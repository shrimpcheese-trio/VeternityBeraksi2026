import { createHash } from "crypto";

type AvatarUser = {
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
  identities?: Array<{ identity_data?: Record<string, unknown> | null }> | null;
};

function firstString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

export function resolveAvatarUrl(user: AvatarUser | null | undefined): string | undefined {
  if (!user) return undefined;

  const identity = user.identities?.[0]?.identity_data ?? {};
  const meta = user.user_metadata ?? {};

  const avatar =
    firstString(meta.avatar_custom_url) ??
    firstString(identity.avatar_url) ??
    firstString(meta.avatar_url) ??
    firstString(meta.picture) ??
    firstString(identity.picture);

  if (avatar) return avatar;

  const email = firstString(user.email) ?? firstString(identity.email) ?? firstString(meta.email);

  if (email) {
    const emailHash = createHash("md5").update(email.trim().toLowerCase()).digest("hex");
    return `https://gravatar.com/avatar/${emailHash}?s=256&d=retro`;
  }

  return undefined;
}
