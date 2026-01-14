export const normalizeUrl = (
  baseUrl: string | undefined
): string | undefined => {
  if (!baseUrl) {
    return;
  }

  let isValidUrl = true;

  try {
    const urlObj = new URL(baseUrl);
    isValidUrl = urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    isValidUrl = false;
  }

  if (!isValidUrl) {
    return;
  }

  const urlObj = new URL(baseUrl);
  const baseUrlNormalized = urlObj.origin;

  return baseUrlNormalized;
};
