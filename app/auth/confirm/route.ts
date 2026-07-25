import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const email = searchParams.get("email");

  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as "email" | "recovery" | "invite" | "email_change" | "phone_change",
    });

    if (!error) {
      return NextResponse.redirect(`${origin}/profile/setup`);
    }

    return NextResponse.redirect(`${origin}/login?error=confirm_failed`);
  }

  if (email) {
    const html = `<!DOCTYPE html>
<html><body style="display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:sans-serif;">
<div style="text-align:center;max-width:400px;">
<h1 style="font-size:1.5rem;">Cek Email Anda</h1>
<p style="color:#666;margin-top:0.5rem;">
Kami telah mengirim email konfirmasi ke <strong>${email}</strong>.
Klik tautan di email untuk mengaktifkan akun Anda.
</p>
<a href="/login" style="color:green;text-decoration:underline;font-size:0.875rem;margin-top:1.5rem;display:inline-block;">
Kembali ke halaman masuk
</a>
</div></body></html>`;
    return new NextResponse(html, { headers: { "content-type": "text/html;charset=utf-8" } });
  }

  return NextResponse.redirect(`${origin}/login`);
}
