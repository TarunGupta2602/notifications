import Link from "next/link";

const goods = [
  { name: "Heirloom tomatoes", note: "Picked this morning", price: "₹80" },
  { name: "Whole milk", note: "One litre, glass bottle", price: "₹70" },
  { name: "Sourdough", note: "Baked at 6 am", price: "₹120" },
  { name: "Basil bunch", note: "Enough for one pot", price: "₹40" },
];

export default function Home() {
  return (
    <div className="min-h-full bg-[#f7f4ee] text-[#1c1915]">
      <header className="border-b border-[#e4ddd2]">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Lark
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <a href="#shop" className="hover:underline">
              Shop
            </a>
            <a href="#visit" className="hover:underline">
              Visit
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-5xl gap-10 px-5 py-16 md:grid-cols-[1.2fr_0.8fr] md:items-end">
          <div>
            <p className="text-sm text-[#6d645b]">Neighbourhood grocery</p>
            <h1 className="mt-3 max-w-xl text-5xl font-semibold tracking-tight text-balance">
              Groceries for tonight, from the shop on the corner.
            </h1>
            <p className="mt-5 max-w-md text-lg leading-8 text-[#5c564e]">
              We pack the list in the afternoon and bring it to your door before dinner.
            </p>
            <a
              href="#shop"
              className="mt-8 inline-flex h-11 items-center rounded-full bg-[#1f3d32] px-5 text-sm font-semibold text-white"
            >
              See what is in today
            </a>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-40 rounded-3xl bg-[#d7e3d4]" />
            <div className="h-40 rounded-3xl bg-[#ead9c4]" />
            <div className="col-span-2 h-28 rounded-3xl bg-[#1f3d32]" />
          </div>
        </section>

        <section id="shop" className="border-t border-[#e4ddd2]">
          <div className="mx-auto max-w-5xl px-5 py-14">
            <h2 className="text-2xl font-semibold">In the shop today</h2>
            <ul className="mt-8 divide-y divide-[#e4ddd2] border-y border-[#e4ddd2]">
              {goods.map((item) => (
                <li key={item.name} className="flex items-baseline justify-between gap-4 py-4">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-[#6d645b]">{item.note}</p>
                  </div>
                  <p className="text-sm">{item.price}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="visit" className="border-t border-[#e4ddd2]">
          <div className="mx-auto grid max-w-5xl gap-8 px-5 py-14 md:grid-cols-3">
            <div>
              <h2 className="text-sm font-semibold">Hours</h2>
              <p className="mt-2 text-sm leading-6 text-[#5c564e]">Every day, 8 am to 8 pm.</p>
            </div>
            <div>
              <h2 className="text-sm font-semibold">Shop</h2>
              <p className="mt-2 text-sm leading-6 text-[#5c564e]">14 Maple Lane, ground floor.</p>
            </div>
            <div>
              <h2 className="text-sm font-semibold">Orders</h2>
              <p className="mt-2 text-sm leading-6 text-[#5c564e]">
                Place a list at the counter. We send it out the same evening.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#e4ddd2]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-6 text-sm text-[#6d645b]">
          <p>Lark</p>
          <p>Maple Lane</p>
        </div>
      </footer>
    </div>
  );
}
