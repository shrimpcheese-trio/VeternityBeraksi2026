-- Migration: 20260731000006
-- Down: removes the avatars storage bucket

delete from storage.buckets where id = 'avatars';
