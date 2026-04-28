import { CmsLoginForm } from "@/components/auth/CmsLoginForm";

export const metadata = {
  title: "Anmeldung : CMS",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return <CmsLoginForm />;
}
