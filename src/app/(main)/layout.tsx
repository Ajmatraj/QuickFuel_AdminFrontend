import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster"
export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="auth-container">
      <main className="auth-content">{children}</main>
      <Toaster />
    </div>
  );
}
