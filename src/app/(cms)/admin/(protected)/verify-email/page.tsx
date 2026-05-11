import { CmsVerifyEmailPanel } from "@/components/auth/CmsVerifyEmailPanel";

export const metadata = {
  title: "E-Mail bestätigen : CMS",
  robots: { index: false, follow: false },
};

export default function AdminVerifyEmailPage() {
  return <CmsVerifyEmailPanel />;
}
