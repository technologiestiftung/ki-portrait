import React, { useState, useCallback } from "react";
import useFetch, { ImageType } from "../hooks/use-fetch";
import useInfiniteScroll from "../hooks/use-infinite-scroll";
import ImageModal from "./ImageModal";

function ImageGallery(): JSX.Element {
	const limit = window.innerWidth <= 768 ? 10 : 50; // Check if screen width is less than or equal to 768px
	const imagesPerLoad = limit;
	const [offset, setOffset] = useState<number>(0);
	const { loading, images } = useFetch(limit, offset);
	const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);

	const handleLoadMore = useCallback(() => {
		setOffset((prevOffset) => prevOffset + imagesPerLoad);
	}, []);

	useInfiniteScroll(handleLoadMore);

	const handleImageClick = useCallback((image: ImageType) => {
		setSelectedImage(image);
	}, []);

	const handleModalClose = useCallback(() => {
		setSelectedImage(null);
	}, []);

	return (
		<div className="image-gallery grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
			{images.map((image, index) => (
				<Image
					key={`${image.id}-${index}`}
					image={image}
					onClick={handleImageClick}
				/>
			))}
			{loading && (
				<div className="flex justify-center items-center py-4">
					<svg
						className="animate-spin h-5 w-5 mr-3 text-gray-500"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
						></circle>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm12 0a8 8 0 100-16 8 8 0 000 16z"
						></path>
					</svg>
					<span>Loading more images...</span>
				</div>
			)}
			{selectedImage && (
				<ImageModal image={selectedImage} onClose={handleModalClose} />
			)}
			<div id="load-more" />
		</div>
	);
}

interface ImageProps {
	image: ImageType;
	onClick: (image: any) => void;
}

function Image({ image, onClick }: ImageProps): JSX.Element {
	const handleClick = useCallback(() => {
		onClick(image);
	}, [image, onClick]);

	return (
		<img
			src={image.url}
			alt={image.prompt}
			className="w-full h-auto cursor-pointer"
			onClick={handleClick}
		/>
	);
}

export default ImageGallery;
