-- Migration: 20240731000001_add_service_images
-- Up: creates service-photos storage bucket, adds thumbnail_url and image_urls to worker_services

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('service-photos', 'service-photos', true, 5242880, '{"image/png", "image/jpeg", "image/webp"}')
on conflict (id) do nothing;

create policy "authenticated_upload_service_photos"
  on storage.objects for insert
  with check (bucket_id = 'service-photos' and auth.role() = 'authenticated');

create policy "public_read_service_photos"
  on storage.objects for select
  using (bucket_id = 'service-photos');

alter table worker_services add column if not exists thumbnail_url text;
alter table worker_services add column if not exists image_urls jsonb default '[]'::jsonb;

-- Down
-- drop policy if exists "authenticated_upload_service_photos" on storage.objects;
-- drop policy if exists "public_read_service_photos" on storage.objects;
-- delete from storage.buckets where id = 'service-photos';
-- alter table worker_services drop column if exists thumbnail_url;
-- alter table worker_services drop column if exists image_urls;
