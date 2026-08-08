import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useCart } from "../../context/CartContext";

function AppLayout({
  children,
  title,
  subtitle,
  cartCount = 0,
}) {
  const { cartCount: sharedCartCount } = useCart();
  const effectiveCartCount = sharedCartCount ?? cartCount;

  return (
    <div className="h-screen overflow-hidden bg-[#f7fbfb]">

      <Sidebar />

      <div className="flex h-screen min-w-0 flex-col overflow-hidden pl-[220px]">

        <header className="shrink-0 border-b border-gray-200 bg-white px-7 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-black">
                {title}
              </h1>

              <p className="text-sm text-gray-500">
                {subtitle}
              </p>
            </div>

            <Navbar cartCount={effectiveCartCount} />
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </main>

      </div>

    </div>
  );
}

export default AppLayout;