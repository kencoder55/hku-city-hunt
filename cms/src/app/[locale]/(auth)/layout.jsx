import ApplicationProvider from "@/components/provider/ApplicationProvider";

export const metadata = {
  title: "New Life 330 Event 2026 CMS",
  description: "New Life 330 Event 2026 CMS",
};

export default async function RootLayout({ children, params }) {
  return <ApplicationProvider params={params}>{children}</ApplicationProvider>;
}
