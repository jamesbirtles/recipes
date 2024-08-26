CREATE POLICY "Enable delete for users based on user_id" ON "public"."shopping_list_items" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

drop index if exists "public"."shopping_list_items_user_order_unique";


alter table "public"."shopping_list_items" add constraint "shopping_list_items_user_order_unique" unique(user_id, "order") DEFERRABLE INITIALLY IMMEDIATE;

CREATE OR REPLACE FUNCTION public."clearCheckedShoppingListItems"()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
  item record;
begin
  for item in
    select * from public.shopping_list_items where checked = true order by "order" desc for update
  loop
    perform "deleteShoppingListItem"(item.id);
  end loop;
end;
$function$;

CREATE OR REPLACE FUNCTION public."deleteShoppingListItem"(id uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
  o public.shopping_list_items."order"%type;
  uid public.shopping_list_items.user_id%type;
begin
  delete from public.shopping_list_items where shopping_list_items.id = $1 returning "order", user_id into o, uid;
  update public.shopping_list_items
  set "order" = "order" - 1
  where "order" >= o and user_id = uid;
end;
$function$;
