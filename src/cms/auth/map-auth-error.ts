import type { AuthError } from "firebase/auth";

/**
 * Maps Firebase Auth error codes to short, non-technical German copy for editors.
 * @see https://firebase.google.com/docs/auth/admin/errors
 */
export function mapFirebaseAuthErrorToMessage(error: unknown): string {
  const code = error && typeof error === "object" && "code" in error ? String((error as AuthError).code) : "";

  const table: Record<string, string> = {
    "auth/invalid-email": "Die E-Mail-Adresse ist ungültig. Bitte prüfen Sie die Eingabe.",
    "auth/user-disabled": "Dieses Konto wurde deaktiviert. Bitte wenden Sie sich an den Support.",
    "auth/user-not-found": "Es gibt kein Konto mit dieser E-Mail. Bitte E-Mail prüfen oder Konto anlegen lassen.",
    "auth/wrong-password": "Das Passwort ist falsch. Bitte erneut versuchen.",
    "auth/invalid-credential": "E-Mail oder Passwort stimmt nicht. Bitte erneut versuchen.",
    "auth/too-many-requests": "Zu viele Versuche. Bitte warten Sie einen Moment und versuchen Sie es erneut.",
    "auth/network-request-failed": "Netzwerkproblem. Bitte Internetverbindung prüfen und erneut versuchen.",
    "auth/operation-not-allowed": "E-Mail/Passwort-Anmeldung ist nicht aktiviert. Bitte Administrator:in kontaktieren.",
    "auth/invalid-api-key": "Die Anwendung ist nicht korrekt konfiguriert (API-Schlüssel). Bitte Administrator:in kontaktieren.",
    "auth/internal-error": "Ein technischer Fehler ist aufgetreten. Bitte später erneut versuchen.",
    "auth/invalid-verification-code":
      "Der Sicherheitscode ist ungültig oder abgelaufen. Bitte einen neuen Code aus der Authenticator-App eingeben.",
    "auth/requires-recent-login":
      "Aus Sicherheitsgründen bitte erneut anmelden und den Vorgang wiederholen.",
  };

  return table[code] ?? "Anmeldung nicht möglich. Bitte E-Mail und Passwort prüfen oder Administrator:in kontaktieren.";
}
