-- Migration: 20260731000004
-- Up: creates the review-photos storage bucket for employer review images

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('review-photos', 'review-photos', true, 5242880, '{"image/png", "image/jpeg", "image/webp"}')
on conflict (id) do nothing;

drop policy if exists "authenticated_upload_review_photos" on storage.objects;
create policy "authenticated_upload_review_photos"
  on storage.objects for insert
  with check (bucket_id = 'review-photos' and auth.role() = 'authenticated');

drop policy if exists "public_read_review_photos" on storage.objects;
create policy "public_read_review_photos"
  on storage.objects for select
  using (bucket_id = 'review-photos');
