-- Migration: 20260731000006
-- Up: creates the avatars storage bucket for user profile photos

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 2097152, '{"image/png", "image/jpeg", "image/webp"}')
on conflict (id) do nothing;

drop policy if exists "authenticated_upload_avatars" on storage.objects;
create policy "authenticated_upload_avatars"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.role() = 'authenticated');

drop policy if exists "public_read_avatars" on storage.objects;
create policy "public_read_avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

drop policy if exists "owner_update_avatars" on storage.objects;
create policy "owner_update_avatars"
  on storage.objects for update
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "owner_delete_avatars" on storage.objects;
create policy "owner_delete_avatars"
  on storage.objects for delete
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
