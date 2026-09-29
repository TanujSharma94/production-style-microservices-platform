import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "ShopHub",
  description: "Production-style e-commerce platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
