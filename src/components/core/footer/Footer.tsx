"use client"

import { Text } from "@mantine/core";
import styles from "./footer.module.css";
import Link from "next/link";
import { FacebookLogoIcon, InstagramLogoIcon, WhatsappLogoIcon } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";

function Footer() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        {isHome && (
          <img src="/LOGO DEBLOCAR-01.png" alt="large-deblocar-logo" />
        )}
        <div className={styles.footerContent}>
          <Text size="md" fw={400} style={{ opacity: 0.6 }}>
            © Deblocar — Tous droits réservés
          </Text>
          <ul>
            <li>
              <Link
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FacebookLogoIcon size={24} />
              </Link>
            </li>
            <li>
              <Link
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramLogoIcon size={24} />
              </Link>
            </li>
            <li>
              <Link
                href="https://www.whatsapp.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsappLogoIcon size={24} />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer