drop policy if exists "public_read_review_photos" on storage.objects;
drop policy if exists "authenticated_upload_review_photos" on storage.objects;
delete from storage.buckets where id = 'review-photos';
