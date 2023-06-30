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
				`${
					import.meta.env.PUBLIC_SUPABASE_URL
				}/rest/v1/eotai_images?select=*&limit=${limit}&offset=${offset}&order=created_at.desc`,
				{
					headers: {
						apikey: import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
					},
				},
			);
			const data = await response.json();
			setImages((prevImages) => [...prevImages, ...data]);
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
