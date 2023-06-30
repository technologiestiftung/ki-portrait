import React from "react";
import type { ImageType } from "../hooks/use-fetch";

interface ImageModalProps {
	image: ImageType;
	onClose: () => void;
}

function ImageModal({ image, onClose }: ImageModalProps): JSX.Element {
	return (
		<div className="fixed z-10 inset-0 overflow-y-auto bg-black bg-opacity-85">
			<div className="flex items-center justify-center min-h-screen">
				<div
					className="fixed inset-0 bg-opacity-75 transition-opacity"
					aria-hidden="true"
					onClick={onClose}
				></div>

				<div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-lg w-full flex flex-col m-5">
					<div
						id="img-container"
						className="relative pb-0"
						style={{ paddingBottom: "100%" }}
					>
						<img
							className="absolute h-full w-full object-cover"
							src={image.url}
							alt={image.prompt}
							style={{ maxWidth: "100%" }}
						/>
					</div>
					<div className="p-4 flex-1 flex flex-col">
						<h2 className="text-lg font-bold mb-2">{image.prompt}</h2>
						<p className="text-gray-700 text-sm mb-2">
							Created at: {image.created_at}
						</p>
						{/* {image.prompt_de && (
							<p className="text-gray-700 text-sm">
								Prompt (German): {image.prompt_de}
							</p>
						)} */}
						{image.age && (
							<p className="text-gray-700 text-sm">Age: {image.age}</p>
						)}
						{image.color_dominant && (
							<p className="text-gray-700 text-sm">
								Dominant color: {image.color_dominant.join(", ")}
							</p>
						)}
						{image.color_names && (
							<p className="text-gray-700 text-sm">
								Color names: {image.color_names.join(", ")}
							</p>
						)}
						{image.color_palette && (
							<p className="text-gray-700 text-sm">
								Color palette: {image.color_palette.join(", ")}
							</p>
						)}
						{image.emotion && (
							<p className="text-gray-700 text-sm">
								Emotion:{" "}
								{image.emotion
									.map((e) => `${e.emotion} (${e.score})`)
									.join(", ")}
							</p>
						)}
						{image.gender && (
							<p className="text-gray-700 text-sm">
								Gender: {image.gender} ({image.gender_score})
							</p>
						)}
						{image.gesture && (
							<p className="text-gray-700 text-sm">
								Gesture: {image.gesture.map((g) => `${g.gesture}`).join(", ")}
							</p>
						)}
					</div>
					<button
						className="absolute top-0 right-0 m-4 text-white hover:text-gray-900"
						onClick={onClose}
						style={{ zIndex: 10 }}
					>
						<svg
							className="h-6 w-6 fill-current"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
						>
							<path
								fillRule="evenodd"
								d="M10 8.586L6.707 5.293a1 1 0 00-1.414 1.414L8.586 10l-3.293 3.293a1 1 0 101.414 1.414L10 11.414l3.293 3.293a1 1 0 001.414-1.414L11.414 10l3.293-3.293a1 1 0 00-1.414-1.414L10 8.586z"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	);
}

export default ImageModal;
