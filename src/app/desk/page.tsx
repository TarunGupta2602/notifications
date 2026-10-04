import Link from "next/link";
import { NotificationDesk } from "@/components/NotificationDesk";

export default function DeskPage() {
  return (
    <div className="min-h-full">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
          <p className="font-semibold tracking-tight">Lark desk</p>
          <Link href="/" className="text-sm text-muted">
            View shop
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl px-5 py-8">
        <NotificationDesk />
      </main>
    </div>
  );
}
