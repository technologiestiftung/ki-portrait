import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import type { ImageType } from "../../src/hooks/use-fetch";

const handler: Handler = async (
	event: HandlerEvent,
	context: HandlerContext,
) => {
	const DEPLOY_URL = process.env.DEPLOY_URL;
	const imageResponse = await fetch(`${DEPLOY_URL}/eotai_images.json`);
	if (!imageResponse.ok) {
		return {
			statusCode: 500,
			body: JSON.stringify({ message: "Internal server error" }),
		};
	}

	const query = event.queryStringParameters;
	if (!query) {
		return {
			statusCode: 400,
			body: JSON.stringify({
				message: "Bad request limit and offset query missing or invalid",
			}),
		};
	}
	const { offset, limit } = query;

	// if (!event.queryStringParameters || !event.queryStringParameters.query) {
	// 	return {
	// 		statusCode: 400,
	// 		body: JSON.stringify({
	// 			message: "Bad request limit and offset query missing or invalid",
	// 		}),
	// 	};
	// }
	// // check if limit and offset are defined
	if (!limit || !offset) {
		return {
			statusCode: 400,
			body: JSON.stringify({
				message: "Bad request limit and offset query missing",
			}),
		};
	}

	const imageJson = (await imageResponse.json()) as ImageType[];
	// check if limit plus offset exceeds the length of the array
	const numLimit = parseInt(limit);
	const numOffset = parseInt(offset);

	// select images based on limit and offset
	const images = imageJson.slice(
		numOffset,
		numOffset + numLimit > imageJson.length
			? imageJson.length
			: numOffset + numLimit,
	);
	// .map((image) => ({
	// 	url: image.url,
	// }));

	return {
		statusCode: 200,
		body: JSON.stringify({ limit, offset, images }),
	};
};

export { handler };
