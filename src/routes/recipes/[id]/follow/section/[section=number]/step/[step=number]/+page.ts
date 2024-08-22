import { error } from '@sveltejs/kit';
import { Option, Array } from 'effect';

export const load = async ({ params, parent }) => {
	const data = await parent();

	const sectionIndex = Number(params.section) - 1;
	const stepIndex = Number(params.step) - 1;

	const section = data.recipe.instructions.pipe(
		Option.andThen(Array.get(sectionIndex)),
		Option.getOrElse(() => error(404, 'Recipe section not found')),
	);
	const step = Array.get(section.steps, stepIndex).pipe(
		Option.getOrElse(() => error(404, 'Recipe step not found')),
	);

	const nextStepHref = Array.get(section.steps, stepIndex + 1).pipe(
		Option.andThen(
			() => `/recipes/${data.recipe.id}/follow/section/${sectionIndex + 1}/step/${stepIndex + 2}`,
		),
		Option.orElse(() =>
			data.recipe.instructions.pipe(
				Option.andThen(Array.get(sectionIndex + 1)),
				Option.andThen(
					() => `/recipes/${data.recipe.id}/follow/section/${sectionIndex + 2}/step/1`,
				),
			),
		),
		Option.getOrElse(() => `/recipes/${data.recipe.id}`),
	);
	const prevStepHref = (
		stepIndex > 0 ? Array.get(section.steps, stepIndex - 1) : Option.none()
	).pipe(
		Option.andThen(
			() => `/recipes/${data.recipe.id}/follow/section/${sectionIndex + 1}/step/${stepIndex}`,
		),
		Option.orElse(() =>
			data.recipe.instructions.pipe(
				Option.andThen((instructions) =>
					sectionIndex > 0 ? Array.get(instructions, sectionIndex - 1) : Option.none(),
				),
				Option.andThen(
					(section) =>
						`/recipes/${data.recipe.id}/follow/section/${sectionIndex}/step/${section.steps.length}`,
				),
			),
		),
		Option.getOrElse(() => `/recipes/${data.recipe.id}/follow`),
	);

	return { section, step, stepNumber: stepIndex + 1, nextStepHref, prevStepHref };
};
