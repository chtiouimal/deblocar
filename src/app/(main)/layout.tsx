"use client";

import "@mantine/core/styles.css";
import "../globals.css";
import { theme } from "@/theme";
import Header from "@/components/core/header/Header";
import Footer from "@/components/core/footer/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div style={{ position: "relative", paddingBottom: 180 }}>
        {children}
        <Footer />
      </div>
    </>
  );
}
