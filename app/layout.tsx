import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import NextAuthProvider from "./components/providers/NextAuthProvider";
import CategoryStoreInitializer from "./components/CategoryStoreInitializer";
import fetchDataFromAPI from "@/lib/api";

export const metadata: Metadata = {
  title: "'My E-commerce Portfolio - Next.js/Zustand'",
  description: "A high-performance e-commerce store built with Next.js Server Components.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const URL = '/api/categories';
  const response = await fetchDataFromAPI(URL);
  const categories = response.ok ? await response.json() : []; 

  return (
    <html lang="en">
      <body>
        <NextAuthProvider>
          <CategoryStoreInitializer categoriesApiData={categories} />
          <div className="flex flex-col min-h-screen min-w-[375px]">
            <Header/>
              <main className="bg-white text-black md:mt-15 w-full min-h-full flex-grow flex flex-col items-center">      
                  {children}
              </main>
            <Footer/>
          </div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
