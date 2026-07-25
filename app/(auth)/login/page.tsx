import { AuthLayout } from "@/components/shared/auth-layout";
import { LoginForm } from "@/components/shared/login-form";

export default function LoginPage() {
  return (
    <AuthLayout title="Masuk" description="Masuk ke akun Anda untuk melanjutkan">
      <LoginForm />
    </AuthLayout>
  );
}
