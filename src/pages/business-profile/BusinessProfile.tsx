import { useI18n } from "@/i18n/i18n";

export function BusinessProfilePage() {
  const { t } = useI18n();

  return (
    <main className="flex min-w-0 flex-1 flex-col gap-4 p-4 sm:gap-6 sm:p-6">
      <section className="flex min-w-0 flex-col gap-2">
        <h2 className="text-lg font-semibold tracking-normal">
          {t("nav.businessProfile")}
        </h2>
      </section>
    </main>
  );
}
