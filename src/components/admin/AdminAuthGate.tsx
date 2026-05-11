"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CMS_PATHS } from "@/admin/paths";
import { fetchCmsMfaState } from "@/cms/auth/cms-mfa-client";
import { useCmsAuth } from "@/cms/auth/cms-auth-context";
import { canAccessCmsDashboard } from "@/cms/auth/permissions";
import { getCmsAuth, getCmsAuthIdTokenFresh } from "@/firebase/auth";
import { FirebaseWebEnvMissingPanel } from "@/components/cms/FirebaseWebEnvMissingPanel";
import { AdminLayout } from "./AdminLayout";
import { AdminProtectedBootSkeleton } from "./AdminLoading";
import { LogoutButton } from "./LogoutButton";

type AdminAuthGateProps = {
  children: React.ReactNode;
};

type MfaSnapshot = {
  loading: boolean;
  enrolled: boolean;
  sessionTrusted: boolean;
  fetchFailed: boolean;
};

const initialMfa: MfaSnapshot = {
  loading: false,
  enrolled: false,
  sessionTrusted: false,
  fetchFailed: false,
};

/**
 * Auth guard for protected admin routes. Redirects guests to login; blocks `viewer`.
 * Enforces verified email + custom TOTP enrollment + MFA cookie before the dashboard.
 */
export function AdminAuthGate({ children }: AdminAuthGateProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { configured, user, role, ready, roleReady } = useCmsAuth();
  const [mfa, setMfa] = useState<MfaSnapshot>(initialMfa);

  useEffect(() => {
    if (!configured) return;
    if (!ready) return;
    if (user === null) {
      queueMicrotask(() => {
        router.replace(CMS_PATHS.authLogin);
      });
    }
  }, [user, ready, configured, router]);

  useEffect(() => {
    if (!configured || !ready || user === null || user === undefined || !roleReady) return;
    if (!canAccessCmsDashboard(role)) return;
    if (!user.emailVerified) {
      queueMicrotask(() => {
        setMfa({ loading: false, enrolled: false, sessionTrusted: false, fetchFailed: false });
      });
      return;
    }

    let cancelled = false;
    queueMicrotask(() => {
      setMfa((prev) => ({ ...prev, loading: true, fetchFailed: false }));
    });

    void (async () => {
      const auth = getCmsAuth();
      const u = auth?.currentUser;
      if (!u) return;
      try {
        const token = await getCmsAuthIdTokenFresh(u);
        const data = await fetchCmsMfaState(token);
        if (cancelled) return;
        if (!data) {
          setMfa({ loading: false, enrolled: false, sessionTrusted: false, fetchFailed: true });
          return;
        }
        setMfa({
          loading: false,
          enrolled: data.enrolled,
          sessionTrusted: data.sessionTrusted,
          fetchFailed: false,
        });
      } catch {
        if (!cancelled) {
          setMfa({ loading: false, enrolled: false, sessionTrusted: false, fetchFailed: true });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [configured, ready, user, roleReady, role, pathname, user?.emailVerified]);

  useEffect(() => {
    if (!configured || !ready || user === null || user === undefined || !roleReady) return;
    if (!canAccessCmsDashboard(role)) return;

    if (!user.emailVerified && pathname !== CMS_PATHS.adminVerifyEmail) {
      queueMicrotask(() => router.replace(CMS_PATHS.adminVerifyEmail));
      return;
    }
    if (mfa.loading || mfa.fetchFailed) return;
    if (!user.emailVerified) return;

    if (!mfa.enrolled && pathname !== CMS_PATHS.adminMfaSetup) {
      queueMicrotask(() => router.replace(CMS_PATHS.adminMfaSetup));
      return;
    }
    if (mfa.enrolled && !mfa.sessionTrusted && pathname !== CMS_PATHS.adminMfaChallenge) {
      queueMicrotask(() => router.replace(CMS_PATHS.adminMfaChallenge));
    }
  }, [
    configured,
    ready,
    user,
    roleReady,
    role,
    pathname,
    router,
    mfa.loading,
    mfa.fetchFailed,
    mfa.enrolled,
    mfa.sessionTrusted,
  ]);

  if (!configured) {
    return (
      <div className="flex min-h-[60vh] items-start justify-center px-4 py-12">
        <FirebaseWebEnvMissingPanel />
      </div>
    );
  }

  if (user === null) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-[var(--apple-text-secondary)]">
        Weiterleitung zur Anmeldung…
      </div>
    );
  }

  if (user === undefined) {
    return (
      <AdminLayout>
        <AdminProtectedBootSkeleton title="Sitzung wird erkannt…" />
      </AdminLayout>
    );
  }

  if (!roleReady) {
    return (
      <AdminLayout>
        <AdminProtectedBootSkeleton title="Berechtigungen werden geladen…" />
      </AdminLayout>
    );
  }

  if (!canAccessCmsDashboard(role)) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center shadow-sm">
        <h1 className="text-lg font-semibold text-amber-950">Kein Zugriff</h1>
        <p className="mt-2 text-sm text-amber-900/90">
          Ihr Konto hat keine Berechtigung für dieses Redaktionssystem. Bei Fragen wenden Sie sich bitte an eine
          Administrator:in.
        </p>
        <p className="mt-4 text-xs text-amber-900/70">Angemeldet als: {user.email}</p>
        <div className="mt-6 flex justify-center">
          <LogoutButton label="Abmelden" variant="secondary" />
        </div>
      </div>
    );
  }

  if (mfa.fetchFailed && user.emailVerified) {
    return (
      <AdminLayout>
        <div className="mx-auto max-w-lg rounded-2xl border border-red-200 bg-red-50 p-8 text-sm text-red-900 shadow-sm">
          <h1 className="text-lg font-semibold text-red-950">Zwei-Faktor-Einstellungen nicht erreichbar</h1>
          <p className="mt-3 leading-relaxed">
            Der Server konnte den MFA-Status nicht laden. Für das CMS werden Firebase Admin, gültige Firestore-Regeln
            und die Umgebungsvariable <code className="rounded bg-red-100 px-1">CMS_MFA_COOKIE_SECRET</code> (mind. 16
            Zeichen) benötigt.
          </p>
          <div className="mt-6 flex justify-center">
            <LogoutButton label="Abmelden" variant="secondary" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  const awaitingSecurityRedirect =
    (!user.emailVerified && pathname !== CMS_PATHS.adminVerifyEmail) ||
    (user.emailVerified &&
      !mfa.loading &&
      !mfa.fetchFailed &&
      ((!mfa.enrolled && pathname !== CMS_PATHS.adminMfaSetup) ||
        (mfa.enrolled && !mfa.sessionTrusted && pathname !== CMS_PATHS.adminMfaChallenge)));

  const showMfaBoot =
    user.emailVerified &&
    (mfa.loading ||
      (!mfa.fetchFailed &&
        ((!mfa.enrolled && pathname !== CMS_PATHS.adminMfaSetup) ||
          (mfa.enrolled && !mfa.sessionTrusted && pathname !== CMS_PATHS.adminMfaChallenge))));

  if (awaitingSecurityRedirect || showMfaBoot) {
    return (
      <AdminLayout>
        <AdminProtectedBootSkeleton title="Sicherheit wird geprüft…" />
      </AdminLayout>
    );
  }

  return <AdminLayout>{children}</AdminLayout>;
}
