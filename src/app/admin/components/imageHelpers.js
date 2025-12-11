// Helper functions for handling images with ngrok URLs

/**
 * Processes an image URL to ensure it works with ngrok
 * @param {string} imageUrl - The image URL to process
 * @returns {string} - The processed image URL
 */
export const processImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    
    // If it's already a full URL, return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl;
    }
    
    // If it's a relative URL and we're using ngrok, prepend the ngrok base URL
    // You should get this from your environment variables or config
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || window.location.origin;
    
    // Ensure the URL starts with /
    const path = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    
    return `${baseUrl}${path}`;
};

/**
 * Creates a proxy URL for ngrok images to bypass CORS issues
 * @param {string} imageUrl - The original image URL
 * @returns {string} - The proxy URL
 */
export const createProxyImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    
    // If the URL contains ngrok, we might need special handling
    if (imageUrl.includes('ngrok')) {
        // Option 1: Use the URL as-is but with special headers
        // This is handled in the PackageImage component
        return imageUrl;
        
        // Option 2: If you have a proxy server, use it
        // return `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
    }
    
    return imageUrl;
};

/**
 * Preloads an image to check if it's accessible
 * @param {string} src - The image source URL
 * @returns {Promise<string>} - Returns the URL if successful
 */
export const preloadImage = (src) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        
        // Set crossOrigin to handle CORS
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
            resolve(src);
        };
        
        img.onerror = () => {
            console.error(`Failed to preload image: ${src}`);
            reject(new Error('Failed to load image'));
        };
        
        img.src = src;
    });
};

/**
 * Gets image with fallback options
 * @param {string} primarySrc - The primary image source
 * @param {string} fallbackSrc - The fallback image source
 * @returns {Promise<string>} - Returns the working image URL
 */
export const getImageWithFallback = async (primarySrc, fallbackSrc = '/placeholder-image.png') => {
    try {
        await preloadImage(primarySrc);
        return primarySrc;
    } catch (error) {
        console.warn(`Primary image failed, using fallback: ${fallbackSrc}`);
        return fallbackSrc;
    }
};
