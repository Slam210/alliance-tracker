import "./global.css";
import NavigationTabs from "../components/NavigationTabs";
import AppProvider from "../providers/AppProvider";
import AuthGate from "../components/AuthGate";
import { AuthProvider } from "../providers/AuthProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-white">
        <AuthProvider>
          <AuthGate>
            <AppProvider>
              <NavigationTabs />
              <main>{children}</main>
            </AppProvider>
          </AuthGate>
        </AuthProvider>
      </body>
    </html>
  );
}
