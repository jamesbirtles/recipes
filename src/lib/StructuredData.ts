import { Schema } from '@effect/schema';

/**
 * Same as Schema.String except that some cleanup is performed such as converting
 * some html entities back into their original character
 */
const String = Schema.transform(Schema.String, Schema.String, {
	strict: true,
	decode: (s) =>
		// TODO: maybe bring in a library to do this
		s
			.replaceAll('&#39;', "'")
			.replaceAll('&quot;', '"')
			.replaceAll('&amp;', '&')
			.replaceAll('&#x27;', "'")
			.replaceAll('&nbsp;', ' '),
	encode: (s) => s,
});

export const HowToStep = Schema.Struct({
	_tag: Schema.tag('HowToStep').pipe(Schema.fromKey('@type')),
	name: String.pipe(Schema.optionalWith({ as: 'Option' })),
	description: String.pipe(Schema.optionalWith({ as: 'Option' })),
	text: String.pipe(Schema.optionalWith({ as: 'Option' })),
	// TODO: support itemListElement - https://developers.google.com/search/docs/appearance/structured-data/recipe#how-to-step
});
export const HowToSection = Schema.Struct({
	_tag: Schema.tag('HowToSection').pipe(Schema.fromKey('@type')),
	name: String.pipe(Schema.optionalWith({ as: 'Option' })),
	itemListElement: Schema.Array(HowToStep),
});
export const RecipeInstructions = Schema.Union(
	Schema.ArrayEnsure(HowToStep),
	Schema.ArrayEnsure(HowToSection),
	Schema.ArrayEnsure(String),
);

export const Recipe = Schema.Struct({
	'@type': Schema.tag('Recipe'),
	name: String,
	recipeInstructions: RecipeInstructions.pipe(Schema.optionalWith({ as: 'Option' })),
	recipeIngredient: Schema.ArrayEnsure(String).pipe(Schema.mutable),
});
export const decodeRecipe = Schema.decodeUnknownSync(Recipe);
