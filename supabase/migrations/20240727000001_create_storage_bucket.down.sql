drop policy if exists "authenticated_upload_proof_photos" on storage.objects;
drop policy if exists "public_read_proof_photos" on storage.objects;
delete from storage.buckets where id = 'proof-photos';
