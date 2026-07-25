import { AuthLayout } from "@/components/shared/auth-layout";
import { RegisterForm } from "@/components/shared/register-form";

export default function RegisterPage() {
  return (
    <AuthLayout title="Daftar" description="Buat akun baru untuk memulai">
      <RegisterForm />
    </AuthLayout>
  );
}
