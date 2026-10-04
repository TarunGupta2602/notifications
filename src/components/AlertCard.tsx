export type AlertTone = "down" | "load" | "custom" | "order" | "reminder" | "offer";

function telHref(phone: string) {
  const cleaned = phone.replace(/[^\d+]/g, "");
  return cleaned ? `tel:${cleaned}` : "";
}

const shell: Record<AlertTone, string> = {
  down: "border-[#31425c] bg-[#1b2838]",
  load: "border-[#1e4d44] bg-[#14332e]",
  custom: "border-[#31425c] bg-[#1b2838]",
  order: "border-[#31425c] bg-[#1b2838]",
  reminder: "border-[#31425c] bg-[#1b2838]",
  offer: "border-[#31425c] bg-[#1b2838]",
};

const button: Record<AlertTone, string> = {
  down: "bg-[#2f7cf6] hover:bg-[#1f6fe8]",
  load: "bg-[#2f7cf6] hover:bg-[#1f6fe8]",
  custom: "bg-[#2f7cf6] hover:bg-[#1f6fe8]",
  order: "bg-[#2f7cf6] hover:bg-[#1f6fe8]",
  reminder: "bg-[#2f7cf6] hover:bg-[#1f6fe8]",
  offer: "bg-[#2f7cf6] hover:bg-[#1f6fe8]",
};

export function AlertCard({
  title,
  body,
  phone,
  tone,
  onClose,
}: {
  title: string;
  body: string;
  phone?: string;
  tone: AlertTone;
  onClose?: () => void;
}) {
  const dial = telHref(phone ?? "");

  return (
    <article className={`side-toast overflow-hidden rounded-md border shadow-[0_10px_28px_rgba(0,0,0,0.35)] ${shell[tone]}`}>
      <div className="flex items-center gap-2 px-3 pt-2.5">
        <span className="flex h-4 w-4 items-center justify-center text-[#f2c14e]" aria-hidden>
          <svg viewBox="0 0 16 16" className="h-4 w-4 fill-current">
            <path d="M8 1.5 15 14H1L8 1.5Zm0 4.2c-.4 0-.7.3-.7.7v3.1c0 .4.3.7.7.7s.7-.3.7-.7V6.4c0-.4-.3-.7-.7-.7Zm0 6.1a.8.8 0 1 0 0 1.6.8.8 0 0 0 0-1.6Z" />
          </svg>
        </span>
        <p className="min-w-0 flex-1 truncate text-[12px] text-[#d5dbe6]">Lark</p>
        {onClose ? (
          <button
            type="button"
            aria-label="Close notification"
            onClick={onClose}
            className="flex h-5 w-5 items-center justify-center text-[#9aa6b8] hover:text-white"
          >
            ×
          </button>
        ) : null}
      </div>
      <div className="px-3 pt-2 pb-3">
        <p className="text-[15px] font-semibold leading-5 text-white">{title}</p>
        <p className="mt-1 text-[13px] leading-5 text-[#c5cedb]">{body}</p>
        {phone ? <p className="mt-2 text-[13px] font-semibold tracking-wide text-white">{phone}</p> : null}
        {dial ? (
          <a
            href={dial}
            className={`mt-3 flex h-8 w-full items-center justify-center rounded-sm text-[12px] font-bold tracking-wide text-white ${button[tone]}`}
          >
            CALL
          </a>
        ) : (
          <p className={`mt-3 flex h-8 w-full items-center justify-center rounded-sm text-[12px] font-bold tracking-wide text-white ${button[tone]}`}>
            CALL
          </p>
        )}
      </div>
    </article>
  );
}
