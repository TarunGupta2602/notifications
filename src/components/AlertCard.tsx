export type AlertTone = "down" | "load" | "custom" | "order" | "reminder" | "offer";

function telHref(phone: string) {
  const cleaned = phone.replace(/[^\d+]/g, "");
  return cleaned ? `tel:${cleaned}` : "";
}

const shell: Record<AlertTone, { bar: string; body: string }> = {
  down: { bar: "bg-[#10192b]", body: "bg-[#1a2740]" },
  load: { bar: "bg-[#0c2f2c]", body: "bg-[#114640]" },
  custom: { bar: "bg-[#10192b]", body: "bg-[#1a2740]" },
  order: { bar: "bg-[#10192b]", body: "bg-[#1a2740]" },
  reminder: { bar: "bg-[#0c2f2c]", body: "bg-[#114640]" },
  offer: { bar: "bg-[#10243a]", body: "bg-[#16344f]" },
};

export function AlertCard({
  title,
  body,
  phone,
  image,
  tone,
  onClose,
}: {
  title: string;
  body: string;
  phone?: string;
  image?: string;
  tone: AlertTone;
  onClose?: () => void;
}) {
  const dial = telHref(phone ?? "");
  const colors = shell[tone];
  const safeImage = image?.startsWith("data:image/") ? image : "";

  return (
    <article className="side-toast overflow-hidden rounded-[3px] border border-black/50 shadow-[0_14px_28px_rgba(0,0,0,0.45)]">
      <div className={`flex items-center gap-2 px-2.5 py-1.5 ${colors.bar}`}>
        <span className="flex h-3.5 w-3.5 items-center justify-center text-[#f2c14e]" aria-hidden>
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current">
            <path d="M8 1.5 15 14H1L8 1.5Zm0 4.2c-.4 0-.7.3-.7.7v3.1c0 .4.3.7.7.7s.7-.3.7-.7V6.4c0-.4-.3-.7-.7-.7Zm0 6.1a.8.8 0 1 0 0 1.6.8.8 0 0 0 0-1.6Z" />
          </svg>
        </span>
        <p className="min-w-0 flex-1 truncate text-[11px] font-medium text-white/90">Lark</p>
        {onClose ? (
          <button
            type="button"
            aria-label="Close notification"
            onClick={onClose}
            className="flex h-4 w-4 items-center justify-center text-[14px] leading-none text-white/70 hover:text-white"
          >
            ×
          </button>
        ) : null}
      </div>
      <div className={`px-3 pt-2 pb-2.5 ${colors.body}`}>
        <p className="text-[15px] font-semibold leading-5 text-white">{title}</p>
        <p className="mt-1 text-[12.5px] leading-[17px] text-[#d5deea]">{body}</p>
        {safeImage || phone ? (
          <div className="mt-2 flex items-center gap-2.5 rounded-[2px] bg-black/25 p-1.5">
            {safeImage ? (
              <span
                role="img"
                aria-label="Alert image"
                className="h-12 w-12 shrink-0 rounded-[2px] bg-white bg-cover bg-center"
                style={{ backgroundImage: `url("${safeImage}")` }}
              />
            ) : (
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[2px] bg-white/10 text-[#f2c14e]" aria-hidden>
                <svg viewBox="0 0 16 16" className="h-6 w-6 fill-current">
                  <path d="M8 1.5 15 14H1L8 1.5Zm0 4.2c-.4 0-.7.3-.7.7v3.1c0 .4.3.7.7.7s.7-.3.7-.7V6.4c0-.4-.3-.7-.7-.7Zm0 6.1a.8.8 0 1 0 0 1.6.8.8 0 0 0 0-1.6Z" />
                </svg>
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-white">{phone || "Call this number"}</p>
              <p className="truncate text-[11px] text-white/70">Tap call if the site is stuck</p>
            </div>
          </div>
        ) : null}
        {dial ? (
          <a
            href={dial}
            className="mt-2.5 flex h-8 w-full items-center justify-center rounded-[2px] bg-[#2f7cf6] text-[12px] font-bold tracking-[0.14em] text-white hover:bg-[#1f6fe8]"
          >
            CALL
          </a>
        ) : (
          <p className="mt-2.5 flex h-8 w-full items-center justify-center rounded-[2px] bg-[#2f7cf6] text-[12px] font-bold tracking-[0.14em] text-white">
            CALL
          </p>
        )}
      </div>
    </article>
  );
}
