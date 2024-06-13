import React, { Suspense } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Phenocam Chile en tiempo real",
  description: "Monitoreo fenológico nacional",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-theme="cupcake">
      <body className={inter.className}>
        <div className="md:container md:mx-auto pt-10">
          <Suspense>{children}</Suspense>
        </div>
      </body>
    </html>
  );
}
