"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CMS_PATHS } from "@/admin/paths";
import { useCmsAuth } from "@/cms/auth/cms-auth-context";
import { canAccessCmsDashboard } from "@/cms/auth/permissions";
import { FirebaseWebEnvMissingPanel } from "@/components/cms/FirebaseWebEnvMissingPanel";
import { AdminLayout } from "./AdminLayout";
import { AdminProtectedBootSkeleton } from "./AdminLoading";
import { LogoutButton } from "./LogoutButton";

type AdminAuthGateProps = {
  children: React.ReactNode;
};

/**
 * Auth guard for protected admin routes. Redirects guests to login; blocks `viewer`.
 * Renders {@link AdminLayout} as soon as Firebase auth is known so the shell is responsive
 * while the Firestore role document loads.
 */
export function AdminAuthGate({ children }: AdminAuthGateProps) {
  const router = useRouter();
  const { configured, user, role, ready, roleReady } = useCmsAuth();

  useEffect(() => {
    if (!configured) return;
    if (!ready) return;
    if (user === null) {
      queueMicrotask(() => {
        router.replace(CMS_PATHS.authLogin);
      });
    }
  }, [user, ready, configured, router]);

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

  return <AdminLayout>{children}</AdminLayout>;
}
