"use client";

import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { CMS_PATHS } from "@/admin/paths";
import { getCmsAuth } from "@/firebase/auth";

type Props = {
  label?: string;
  variant?: "primary" | "secondary";
};

/**
 * Signs out from Firebase Auth and sends the user to the CMS login screen.
 */
export function LogoutButton({ label = "Abmelden", variant = "secondary" }: Props) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/cms/mfa/session", { method: "DELETE", credentials: "include" }).catch(() => undefined);
    const auth = getCmsAuth();
    if (auth) await signOut(auth);
    router.replace(CMS_PATHS.authLogin);
    router.refresh();
  }

  const base =
    variant === "primary"
      ? "rounded-full bg-[var(--brand-900)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--brand-900-hover)]"
      : "rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-[var(--apple-text-secondary)] hover:border-black/15 hover:text-[var(--apple-text)]";

  return (
    <button type="button" onClick={() => void logout()} className={base}>
      {label}
    </button>
  );
}
