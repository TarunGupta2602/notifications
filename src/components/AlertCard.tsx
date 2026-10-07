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
    <article className="side-toast overflow-hidden rounded-md border border-gray-300 shadow-2xl bg-white">
      <div className={`flex items-center gap-2 px-3 py-2 ${colors.bar} border-b border-gray-200`}>
        <span className="flex h-4 w-4 items-center justify-center text-red-600 animate-pulse" aria-hidden>
          <svg viewBox="0 0 16 16" className="h-4 w-4 fill-current">
            <path d="M8 1.5 15 14H1L8 1.5Zm0 4.2c-.4 0-.7.3-.7.7v3.1c0 .4.3.7.7.7s.7-.3.7-.7V6.4c0-.4-.3-.7-.7-.7Zm0 6.1a.8.8 0 1 0 0 1.6.8.8 0 0 0 0-1.6Z" />
          </svg>
        </span>
        <p className="min-w-0 flex-1 truncate text-[12px] font-semibold text-gray-700">{brandName}</p>
        <span className="text-[10px] text-red-600 font-bold animate-pulse">⚠️</span>
      </div>
      <div className={`px-4 pt-3 pb-3 ${colors.body}`}>
        <p className="text-[15px] font-bold leading-5 text-red-600">{title}</p>
        <p className="mt-2 text-[13px] leading-[18px] text-gray-800 font-medium">{body}</p>
        {safeImage || phone ? (
          <div className="mt-3 flex items-center gap-3 rounded-md bg-red-50 border-2 border-red-200 p-2">
            {safeImage ? (
              <span
                role="img"
                aria-label="Alert image"
                className="h-14 w-14 shrink-0 rounded-md bg-white bg-cover bg-center border border-gray-200"
                style={{ backgroundImage: `url("${safeImage}")` }}
              />
            ) : (
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-red-100 text-red-600 border-2 border-red-300" aria-hidden>
                <svg viewBox="0 0 16 16" className="h-7 w-7 fill-current animate-pulse">
                  <path d="M8 1.5 15 14H1L8 1.5Zm0 4.2c-.4 0-.7.3-.7.7v3.1c0 .4.3.7.7.7s.7-.3.7-.7V6.4c0-.4-.3-.7-.7-.7Zm0 6.1a.8.8 0 1 0 0 1.6.8.8 0 0 0 0-1.6Z" />
                </svg>
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-bold text-red-700">{phone || "Call this number"}</p>
              <p className="truncate text-[12px] text-red-600 font-semibold">⚠️ IMMEDIATE ACTION REQUIRED</p>
            </div>
          </div>
        ) : null}
        {dial ? (
          <a
            href={dial}
            className="mt-3 flex h-10 w-full items-center justify-center rounded-md bg-gradient-to-r from-red-600 to-red-700 border-2 border-red-500 text-[13px] font-bold tracking-[0.14em] text-white hover:from-red-500 hover:to-red-600 transition-all shadow-lg animate-pulse"
          >
            🚨 CALL NOW
          </a>
        ) : (
          <p className="mt-3 flex h-10 w-full items-center justify-center rounded-md bg-gradient-to-r from-red-600 to-red-700 border-2 border-red-500 text-[13px] font-bold tracking-[0.14em] text-white shadow-lg animate-pulse">
            🚨 CALL NOW
          </p>
        )}
      </div>
    </article>
  );
}
