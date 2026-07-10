"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./header.module.css";
import { Text } from "@mantine/core";
import { usePathname } from "next/navigation";

function Header() {
  const pathname = usePathname();
  const isDevis = pathname === "/devis";
  const handleNavClick = (sectionId: string) => {
    if (pathname === "/") {
      document
        .getElementById(sectionId)
        ?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = `/?section=${sectionId}`;
    }
  };

  return (
    <div className={`${isDevis ? styles.headerDevis : styles.header}`}>
      <Link href="/" style={{ opacity: 1 }}>
        <Image
          src="/Deblocar_small.svg"
          alt="deblocar-logo"
          width={192}
          height={30}
        />
      </Link>
      {!isDevis && (
        <div className={styles.headerMenu}>
          <ul className={styles.textMenuList}>
            <li>
              <button onClick={() => handleNavClick("marques")}>
                <Text size="md" fw={400}>
                  Marques
                </Text>
              </button>
            </li>
            <li>
              <button onClick={() => handleNavClick("services")}>
                <Text size="md" fw={400}>
                  Services
                </Text>
              </button>
            </li>
            <li>
              <button onClick={() => handleNavClick("process")}>
                <Text size="md" fw={400}>
                  Process
                </Text>
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Header;
