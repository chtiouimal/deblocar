import Image from "next/image";
import styles from "./page.module.css";
import Stepper from "@/components/form/Stepper";

export default function Devis() {
  return (
    <div style={{ paddingTop: 132 }}>
      <Stepper />
    </div>
  );
}
