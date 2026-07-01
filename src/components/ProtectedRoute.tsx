"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Home } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import { Role } from "../types/auth";
import LoadingScreen from "./LoadingScreen";

interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRoles?: Role[];
}

export function ProtectedRoute({
  children,
  allowedRoles = ["viewer", "admin"],
}: ProtectedRouteProps) {
  const router = useRouter();
  const { loading, authenticated, role } = useAuth();

  const authorized =
    authenticated &&
    role &&
    allowedRoles.includes(role);

  useEffect(() => {
    if (loading || authorized) return;

    const timer = setTimeout(() => {
      router.replace("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [loading, authorized, router]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!authorized) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <h1 className="text-7xl font-bold">403</h1>

        <h2 className="mt-4 text-2xl font-semibold">
          Access Denied
        </h2>

        <p className="mt-2 max-w-md text-muted-foreground">
          You must be logged in with the appropriate permissions to view
          this page. Redirecting to the home page...
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
