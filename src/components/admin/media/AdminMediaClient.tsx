import Link from "next/link";
import { CMS_PATHS } from "@/admin/paths";
import { adminBody, adminBtnSecondary, adminFeedbackInfo, adminPanel, adminSectionLabel } from "@/components/admin/admin-ui";
import { AdminPageContainer, AdminPageHeader, AdminPageSection } from "@/components/admin/AdminPageContainer";

/**
 * Media management information.
 */
export function AdminMediaClient() {
  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="Medien"
        description="Verwalten Sie Bilder und Dokumente. Dieses System nutzt Firebase Storage für Uploads in Beiträgen und Vakanzen."
      />

      <div className={adminFeedbackSuccess} role="status">
        <p className="font-medium">Firebase Storage ist aktiv</p>
        <p className={`mt-2 ${adminBody}`}>
          Sie können nun Bilder für Blog-Beiträge und Dokumente für Vakanzen direkt hochladen. 
          Die Dateien werden sicher in der Cloud gespeichert und automatisch mit der Website verknüpft.
        </p>
      </div>

      <AdminPageSection>
        <div className={`space-y-6 ${adminPanel} p-6 sm:p-8`}>
          <div>
            <h2 className={adminSectionLabel}>Bilder & Dokumente</h2>
            <p className={`mt-3 max-w-prose ${adminBody}`}>
              <strong className="font-medium text-[var(--apple-text)]">Vakanzen:</strong> Laden Sie PDFs oder Detailbeschriebe
              direkt bei der Bearbeitung der Vakanz hoch. Die Verknüpfung erfolgt automatisch.
            </p>
            <p className={`mt-3 max-w-prose ${adminBody}`}>
              <strong className="font-medium text-[var(--apple-text)]">Blog-Beiträge:</strong> Das Titelbild kann nun
              direkt hochgeladen werden. In Zukunft werden auch Uploads für Bilder innerhalb des Textes unterstützt.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={CMS_PATHS.adminVacancies} className={adminBtnSecondary}>
                Zu den Vakanzen
              </Link>
              <Link href={CMS_PATHS.adminPosts} className={adminBtnSecondary}>
                Zur Beitragsliste
              </Link>
            </div>
          </div>
        </div>
      </AdminPageSection>
    </AdminPageContainer>
  );
}
