// API base URL configuration
// In production (Vercel), API and frontend are on same domain, so use relative URLs
// In development, use explicit localhost or VITE_API_URL if set
const getApiBase = () => {
	// If VITE_API_URL is explicitly set, use it
	if (import.meta.env.VITE_API_URL) {
		return import.meta.env.VITE_API_URL.replace(/\/+$/, "");
	}
	// In production (Vercel), use relative URLs
	if (import.meta.env.PROD) {
		return ""; // Relative URLs work on same domain
	}
	// Development fallback
	return "http://localhost:5000";
};

export const apiBase = getApiBase();

