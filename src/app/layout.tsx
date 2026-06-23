import "./global.css";
import NavigationTabs from "../components/NavigationTabs";
import AppProvider from "../providers/AppProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-white">
        <AppProvider>
          <NavigationTabs />
          <main>{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}
