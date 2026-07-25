"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions/auth";

export function SignOutButton() {
  async function handleSignOut() {
    try {
      await signOut();
    } catch {
      console.error("Sign out failed");
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleSignOut}>
      Keluar
    </Button>
  );
}
