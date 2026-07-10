"use client"

import { Text } from "@mantine/core";
import styles from "./footer.module.css";
import Link from "next/link";
import {
  FacebookLogoIcon,
  InstagramLogoIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <img src="/Deblocar_large.svg" alt="large-deblocar-logo" />
        <div className={styles.footerContent}>
          <Text size="md" fw={400} style={{ opacity: 0.6 }}>
            © Deblocar — Tous droits réservés
          </Text>
          <ul>
            <li>
              <Link
                href=" https://www.facebook.com/profile.php?id=61587995278933"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FacebookLogoIcon size={24} />
              </Link>
            </li>
            <li>
              <Link
                href="https://instagram.com/deblocar"
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramLogoIcon size={24} />
              </Link>
            </li>
            <li>
              <Link
                href="https://wa.me/21655410596?text=Bonjour%20je%20souhaite%20vous%20contacter"
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