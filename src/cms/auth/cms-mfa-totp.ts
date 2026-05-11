import { generateSecret, generateURI, verifySync } from "otplib";

export function cmsMfaTotpIssuer(): string {
  return process.env.CMS_MFA_ISSUER?.trim() || "Abexis CMS";
}

export function cmsMfaTotpGenerateSecret(): string {
  return generateSecret();
}

export function cmsMfaTotpOtpauthUri(label: string, secretBase32: string): string {
  return generateURI({
    issuer: cmsMfaTotpIssuer(),
    label,
    secret: secretBase32,
  });
}

export function cmsMfaTotpVerify(secretBase32: string, token: string): boolean {
  return verifySync({ secret: secretBase32, token }).valid === true;
}
