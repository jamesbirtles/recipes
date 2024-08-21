import { Schema } from '@effect/schema';

export const HowToStep = Schema.Struct({
	_tag: Schema.tag('HowToStep').pipe(Schema.fromKey('@type')),
	name: Schema.String.pipe(Schema.optionalWith({ as: 'Option' })),
	text: Schema.String,
	// TODO: support itemListElement - https://developers.google.com/search/docs/appearance/structured-data/recipe#how-to-step
});
export const HowToSection = Schema.Struct({
	_tag: Schema.tag('HowToSection').pipe(Schema.fromKey('@type')),
	name: Schema.String.pipe(Schema.optionalWith({ as: 'Option' })),
	itemListElement: Schema.Array(HowToStep),
});
export const RecipeInstructions = Schema.Union(
	Schema.ArrayEnsure(HowToStep),
	Schema.ArrayEnsure(HowToSection),
	Schema.ArrayEnsure(Schema.String),
);

export const Recipe = Schema.Struct({
	'@type': Schema.tag('Recipe'),
	name: Schema.String,
	recipeInstructions: RecipeInstructions.pipe(Schema.optionalWith({ as: 'Option' })),
});
export const decodeRecipe = Schema.decodeUnknownSync(Recipe);
