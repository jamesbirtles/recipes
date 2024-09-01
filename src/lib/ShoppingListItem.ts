import { Schema } from '@effect/schema';

// (parameter) item: {
//     checked: boolean;
//     created_at: string;
//     id: string;
//     name: string;
//     order: number;
//     quantity: number | null;
//     unit: string | null;
//     user_id: string;
// }
export const ShoppingListItem = Schema.Struct({
	id: Schema.String,
	user_id: Schema.String,
	name: Schema.String,
	order: Schema.Number,
	quantity: Schema.Number.pipe(Schema.OptionFromNullOr),
	unit: Schema.String.pipe(Schema.OptionFromNullOr),
	checked: Schema.Boolean,
});

export const decode = Schema.decodeSync(ShoppingListItem);
