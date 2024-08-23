insert into storage.buckets
  (id, name, public)
values
  ('recipe-images', 'recipe-images', true);

CREATE POLICY "give_users_access_to_own_recipes_folder_select"
ON storage.objects FOR SELECT USING (
    bucket_id = 'recipe-images'::text
    and (select auth.uid()::text) = (storage.foldername(name))[1]
);
CREATE POLICY "give_users_access_to_own_recipes_folder_insert"
ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'recipe-images'::text
    and (select auth.uid()::text) = (storage.foldername(name))[1]
);
CREATE POLICY "give_users_access_to_own_recipes_folder_update"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'recipe-images'::text
    and (select auth.uid()::text) = (storage.foldername(name))[1]
)
WITH CHECK (
    bucket_id = 'recipe-images'::text
    and (select auth.uid()::text) = (storage.foldername(name))[1]
);

