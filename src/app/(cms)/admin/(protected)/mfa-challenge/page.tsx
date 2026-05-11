import { CmsMfaChallengeForm } from "@/components/auth/CmsMfaChallengeForm";

export const metadata = {
  title: "Authenticator : CMS",
  robots: { index: false, follow: false },
};

export default function AdminMfaChallengePage() {
  return <CmsMfaChallengeForm />;
}
