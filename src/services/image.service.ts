export const getRandomImage = (seed?: string): string => {
  if (seed) {
    return `https://picsum.photos/seed/${encodeURIComponent(seed)}/200/200`;
  }

  return "https://picsum.photos/200/200";
};
