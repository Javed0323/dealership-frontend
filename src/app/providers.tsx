import { AuthProvider } from "@/shared/hooks/useAuth";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};
