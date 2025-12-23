/**
 * Hook for generating image URLs by combining API URL with directory and filename
 *
 * @returns A function that generates image URLs
 */
export function useImageUrl() {
  const API_URL = import.meta.env.VITE_API_URL;
  const API_URL_UPLOAD = import.meta.env.VITE_API_URL_UPLOAD || API_URL;

  /**
   * Generates a complete image URL by combining API URL with directory and filename
   *
   * @param directory - The directory path where the image is stored
   * @param filename - The filename of the image
   * @param fallbackUrl - Optional fallback URL to use if directory or filename is missing
   * @returns The complete image URL
   */
  const getImageUrl = (
    directory?: string,
    filename?: string,
    fallbackUrl?: string
  ): string => {
    // Return fallback URL if directory or filename is missing
    if (!directory || !filename) {
      return fallbackUrl || "";
    }

    return `${API_URL_UPLOAD}/${directory}/${filename}`;
  };

  return {
    getImageUrl,
  };
}
