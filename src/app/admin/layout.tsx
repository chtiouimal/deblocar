import AdminProviders from "./providers";
import AdminLayoutClient from "./layout.client";
import "@mantine/dates/styles.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProviders>
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </AdminProviders>
  );
}
