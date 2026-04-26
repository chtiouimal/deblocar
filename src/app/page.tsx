import Image from "next/image";
import styles from "./page.module.css";
import Stepper from "@/components/form/Stepper";

export default function Home() {
  return (
    <div style={{ padding: 40 }}>
      <Stepper />
    </div>
  );
}
