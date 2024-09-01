import { Schema } from '@effect/schema';
import { Match, Option } from 'effect';

export const RecipeStep = Schema.TaggedStruct('RecipeStep', {
	title: Schema.String.pipe(Schema.optionalWith({ as: 'Option' })),
	text: Schema.String,
});

export const RecipeSection = Schema.TaggedStruct('RecipeSection', {
	title: Schema.String,
	steps: Schema.Array(RecipeStep).pipe(Schema.mutable),
});

export const Ingredient = Schema.Struct({
	quantity: Schema.Number.pipe(
		Schema.annotations({
			title: 'Quantity',
			description:
				'Total number of units specified, converting any fractions into decimals up to 2 decimal places',
		}),
		Schema.OptionFromNullOr,
	),
	unit: Schema.String.pipe(
		Schema.annotations({
			title: 'Units',
			description: 'Unit of measurement, e.g. tbsp, cups, thumb-sized, small, piece etc',
		}),
		Schema.OptionFromNullOr,
	),
	name: Schema.String.pipe(
		Schema.annotations({
			title: 'Item Name',
			// description: 'Name of the ingredient as it would be on the packaging in the supermarket',
			description: 'Full name of the ingredient',
		}),
	),
	preparation: Schema.String.pipe(
		Schema.annotations({
			title: 'Preparation',
			description: 'How the item is prepped, e.g. chopped, finely sliced, diced, etc',
		}),
		Schema.OptionFromNullOr,
	),
	hint: Schema.String.pipe(
		Schema.annotations({
			title: 'Extra Information',
			description:
				'Any miscellaneous information or hints such as possible substitutions, recommended brands, or other advice stated.',
		}),
		Schema.OptionFromNullOr,
	),
}).pipe(Schema.annotations({ title: 'Ingredient', description: 'Ingredient for a recipe' }));
export const decodeIngredient = Schema.decodeUnknownSync(Ingredient);
export const encodeIngredient = Schema.encodeUnknownSync(Ingredient);

export const Recipe = Schema.Struct({
	id: Schema.String,
	user_id: Schema.String,
	title: Schema.String,
	url: Schema.String,
	image: Schema.String.pipe(Schema.OptionFromNullOr),
	instructions: Schema.Array(RecipeSection).pipe(Schema.mutable, Schema.OptionFromNullOr),
	ingredients: Schema.Array(Ingredient).pipe(Schema.mutable),
	original_ingredients: Schema.Array(Schema.String).pipe(Schema.mutable),
});
export const NewRecipe = Recipe.pipe(Schema.omit('user_id'));
export const encodeRecipe = Schema.encodeUnknownSync(Recipe);
export const decodeRecipe = Schema.decodeUnknownSync(Recipe);

const TO_GRAMS = {
	lbs: 453.59237,
	oz: 28.34952,
	kg: 0.001,
};
const TO_ML = {
	cup: 236.5882365,
};

export const convertToMetric = (ingredient: typeof Ingredient.Type) => {
	if (Option.isNone(ingredient.quantity) || Option.isNone(ingredient.unit)) {
		return ingredient;
	}

	const fromQuantity = ingredient.quantity.value;
	const fromUnit = ingredient.unit.value;

	const [toQuantity, toUnit] = Match.value(fromUnit).pipe(
		Match.whenOr('pounds', 'pound', 'lbs', 'lb', () => [fromQuantity * TO_GRAMS.lbs, 'g'] as const),
		Match.whenOr('ounces', 'ounce', 'ozs', 'oz', () => [fromQuantity * TO_GRAMS.oz, 'g'] as const),
		Match.whenOr('cups', 'cup', () => [fromQuantity * TO_ML.cup, 'ml'] as const),
		Match.orElse(() => [fromQuantity, fromUnit] as const),
	);

	return Ingredient.make({
		...ingredient,
		quantity: Option.some(Number(toQuantity.toPrecision(3))),
		unit: Option.some(toUnit),
	});
};
