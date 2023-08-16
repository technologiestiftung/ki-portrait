import { useState, useEffect, useCallback } from "react";

export interface ImageType {
	id: string;
	created_at: string;
	prompt: string;
	url: string;
	prompt_de: string | null;
	age: number | null;
	color_dominant: [number, number, number] | null;
	color_names: string[] | null;
	color_palette: [number, number, number][] | null;
	emotion: { score: number; emotion: string }[] | null;
	gender: string | null;
	gender_score: number | null;
	gesture: { face: number; gesture: string }[] | null;
}

function useFetch(limit: number, offset: number) {
	const [loading, setLoading] = useState(false);
	const [images, setImages] = useState<ImageType[]>([]);

	const fetchImages = useCallback(async () => {
		try {
			setLoading(true);
			const response = await fetch(
				`/.netlify/functions/images?&limit=${limit}&offset=${offset}`,
				{},
			);
			const data = await response.json();
			console.log(data);
			setImages((prevImages) => [...prevImages, ...data.images]);
			setLoading(false);
		} catch (err) {
			console.error(err);
		}
	}, [offset]);

	useEffect(() => {
		fetchImages();
	}, [fetchImages]);

	return { loading, images };
}

export default useFetch;
