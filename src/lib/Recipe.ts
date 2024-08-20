import * as cheerio from 'cheerio';

// TODO: investigate security implications of just visiting and downloading any URL the user gives us.

export const importRecipe = async (url: string) => {
	const result = await fetch(url, {
		headers: { accept: 'text/html' }
	});
	if (result.status != 200) {
		throw new Error('Recipe URL responded with a non 200 status code');
	}

	const contentType = result.headers.get('Content-Type');
	if (!contentType?.startsWith('text/html')) {
		throw new Error('Expected recipe to return text/html content.');
	}

	const html = await result.text();
	const select = cheerio.load(html);
	const ldjson = select('script[type=application/ld+json]').text().trim();
	if (!ldjson) {
		throw new Error('Page does not contain any metadata');
	}

	const ld = tryParse(ldjson);
	const recipe = findRecipe(ld);
	return recipe;
};

const tryParse = (value: string): Record<string, unknown>[] => {
	try {
		// Kind of an ugly hack to parse back-to-back json objects. I'd probably consider rewriting
		// this importer in rust and using some good JSON parser that can handle this case
		return JSON.parse('[' + value.replace(/\}\{/g, '},{') + ']');
	} catch {
		throw new Error('Page metadata is not valid JSON');
	}
};

type Recipe = {
	title: string;
	// TODO: remove
	raw: unknown;
};

// I'm sort of tempted to try and bring in something like Effect-ts Schema to parse this data,
// in rust I would probably be using serde
const findRecipe = (objects: Record<string, unknown>[]): Recipe | null => {
	for (const object of objects) {
		const type = object['@type'];
		if (type === 'Recipe') {
			return extractRecipe(object) as Recipe;
		}

		const graph = object['@graph'];
		if (Array.isArray(graph)) {
			const recipe = findRecipe(graph);
			if (recipe != null) return recipe;
		}
	}

	return null;
};

const str = (object: Record<string, unknown>, key: string, fallback?: string) => {
	const value = object[key];
	if (typeof value === 'string') {
		return value;
	}
	if (fallback != null) {
		return fallback;
	}
	throw new Error(`missing expected property '${key}'`);
};

const extractRecipe = (object: Record<string, unknown>): Recipe => {
	const title = str(object, 'name', 'Unnamed');
	return { title, raw: object };
};
