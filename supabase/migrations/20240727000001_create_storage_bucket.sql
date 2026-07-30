-- Migration: 00004_create_storage_bucket
-- Up: creates proof-photos storage bucket with RLS policies

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('proof-photos', 'proof-photos', true, 5242880, '{"image/png", "image/jpeg", "image/webp"}')
on conflict (id) do nothing;

create policy "authenticated_upload_proof_photos"
  on storage.objects for insert
  with check (bucket_id = 'proof-photos' and auth.role() = 'authenticated');

create policy "public_read_proof_photos"
  on storage.objects for select
  using (bucket_id = 'proof-photos');
