import RetailLayout from "./layout.retail";
import RetailProviders from "./providers";
import "@mantine/dates/styles.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RetailProviders>
      <RetailLayout>{children}</RetailLayout>
    </RetailProviders>
  );
}
