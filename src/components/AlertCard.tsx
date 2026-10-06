export type AlertTone = "down" | "load" | "custom" | "order" | "reminder" | "offer";

function telHref(phone: string) {
  const cleaned = phone.replace(/[^\d+]/g, "");
  return cleaned ? `tel:${cleaned}` : "";
}

const shell: Record<AlertTone, { bar: string; body: string }> = {
  down: { bar: "bg-[#f3f3f3]", body: "bg-white" },
  load: { bar: "bg-[#f3f3f3]", body: "bg-white" },
  custom: { bar: "bg-[#f3f3f3]", body: "bg-white" },
  order: { bar: "bg-[#f3f3f3]", body: "bg-white" },
  reminder: { bar: "bg-[#f3f3f3]", body: "bg-white" },
  offer: { bar: "bg-[#f3f3f3]", body: "bg-white" },
};

export function AlertCard({
  title,
  body,
  phone,
  image,
  tone,
  brand,
}: {
  title: string;
  body: string;
  phone?: string;
  image?: string;
  tone: AlertTone;
  brand?: string;
}) {
  const dial = telHref(phone ?? "");
  const colors = shell[tone];
  const safeImage = image?.startsWith("data:image/") ? image : "";
  const brandName = brand || "Windows";

  return (
    <article className="side-toast overflow-hidden rounded-sm border border-gray-300 shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
      <div className={`flex items-center gap-2 px-3 py-1.5 ${colors.bar} border-b border-gray-200`}>
        <span className="flex h-4 w-4 items-center justify-center text-red-600" aria-hidden>
          <svg viewBox="0 0 16 16" className="h-4 w-4 fill-current">
            <path d="M8 1.5 15 14H1L8 1.5Zm0 4.2c-.4 0-.7.3-.7.7v3.1c0 .4.3.7.7.7s.7-.3.7-.7V6.4c0-.4-.3-.7-.7-.7Zm0 6.1a.8.8 0 1 0 0 1.6.8.8 0 0 0 0-1.6Z" />
          </svg>
        </span>
        <p className="min-w-0 flex-1 truncate text-[11px] font-medium text-gray-700">{brandName}</p>
      </div>
      <div className={`px-3 pt-2 pb-2.5 ${colors.body}`}>
        <p className="text-[14px] font-semibold leading-5 text-gray-900">{title}</p>
        <p className="mt-1 text-[12px] leading-[17px] text-gray-700">{body}</p>
        {safeImage || phone ? (
          <div className="mt-2 flex items-center gap-2.5 rounded-sm bg-gray-100 border border-gray-200 p-1.5">
            {safeImage ? (
              <span
                role="img"
                aria-label="Alert image"
                className="h-12 w-12 shrink-0 rounded-sm bg-white bg-cover bg-center border border-gray-200"
                style={{ backgroundImage: `url("${safeImage}")` }}
              />
            ) : (
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-gray-200 text-gray-500 border border-gray-300" aria-hidden>
                <svg viewBox="0 0 16 16" className="h-6 w-6 fill-current">
                  <path d="M8 1.5 15 14H1L8 1.5Zm0 4.2c-.4 0-.7.3-.7.7v3.1c0 .4.3.7.7.7s.7-.3.7-.7V6.4c0-.4-.3-.7-.7-.7Zm0 6.1a.8.8 0 1 0 0 1.6.8.8 0 0 0 0-1.6Z" />
                </svg>
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-gray-900">{phone || "Call this number"}</p>
              <p className="truncate text-[11px] text-gray-600">Tap call if the site is stuck</p>
            </div>
          </div>
        ) : null}
        {dial ? (
          <a
            href={dial}
            className="mt-2.5 flex h-8 w-full items-center justify-center rounded-sm bg-[#0078d4] text-[12px] font-semibold tracking-[0.14em] text-white hover:bg-[#106ebe]"
          >
            CALL
          </a>
        ) : (
          <p className="mt-2.5 flex h-8 w-full items-center justify-center rounded-sm bg-[#0078d4] text-[12px] font-semibold tracking-[0.14em] text-white">
            CALL
          </p>
        )}
      </div>
    </article>
  );
}
