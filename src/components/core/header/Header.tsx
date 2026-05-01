import Image from "next/image";
import Link from "next/link"
import styles from "./header.module.css";
import { Text } from "@mantine/core";

function Header() {
  return (
    <div className={styles.header}>
      <Link href="/">
        <Image
          src="/deblocar-logo.png"
          alt="deblocar-logo"
          width={192}
          height={30}
        />
      </Link>
      <div className={styles.headerMenu}>
        <ul className={styles.textMenuList}>
          <li>
            <Link href="/">
              <Text size="md" fw={400}>
                Navigation
              </Text>
            </Link>
          </li>
          <li>
            <Link href="/">
              <Text size="md" fw={400}>
                Navigation
              </Text>
            </Link>
          </li>
          <li>
            <Link href="/">
              <Text size="md" fw={400}>
                Navigation
              </Text>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Header