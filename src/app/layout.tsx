"use client";

import "@mantine/core/styles.css";
import "./globals.css";
import { Montserrat, Poppins } from "next/font/google";

import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core";
import { theme } from "@/theme";
import Header from "@/components/core/header/Header";
import Footer from "@/components/core/footer/Footer";

// export const metadata = {
//   title: "Deblocar",
//   description: "Deblocar",
// };

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat", // optional but powerful
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${montserrat.variable}`}
      {...mantineHtmlProps}
    >
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          <Header />
          <div style={{ position: "relative", paddingBottom: 180 }}>
            {children}
            <Footer />
          </div>
        </MantineProvider>
      </body>
    </html>
  );
}
