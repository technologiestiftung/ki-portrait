import { useState, useRef, useCallback, useEffect } from "react";

function useInfiniteScroll(callback: () => void) {
	const [page, setPage] = useState(1);
	const observerRef = useRef<IntersectionObserver | null>(null);

	const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
		const [target] = entries;
		if (target.isIntersecting) {
			setPage((prev) => prev + 1);
		}
	}, []);

	useEffect(() => {
		observerRef.current = new IntersectionObserver(handleObserver, {
			root: null,
			rootMargin: "0px",
			threshold: 1.0,
		});

		return () => {
			if (observerRef.current) {
				observerRef.current.disconnect();
			}
		};
	}, [handleObserver]);

	useEffect(() => {
		if (observerRef.current) {
			observerRef.current.observe(document.querySelector("#load-more")!);
		}
	}, []);

	useEffect(() => {
		callback();
	}, [callback, page]);

	return { page };
}

export default useInfiniteScroll;
