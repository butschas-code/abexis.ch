import { CmsTotpEnrollment } from "@/components/auth/CmsTotpEnrollment";

export const metadata = {
  title: "Authenticator einrichten : CMS",
  robots: { index: false, follow: false },
};

export default function AdminMfaSetupPage() {
  return <CmsTotpEnrollment />;
}
