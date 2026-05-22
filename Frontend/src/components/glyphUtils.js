const FIXED_STARS = [
  { id: 0,  x: 0.15, y: 0.20 },
  { id: 1,  x: 0.35, y: 0.15 },
  { id: 2,  x: 0.55, y: 0.25 },
  { id: 3,  x: 0.75, y: 0.18 },
  { id: 4,  x: 0.85, y: 0.40 },
  { id: 5,  x: 0.70, y: 0.55 },
  { id: 6,  x: 0.50, y: 0.70 },
  { id: 7,  x: 0.30, y: 0.60 },
  { id: 8,  x: 0.12, y: 0.50 },
  { id: 9,  x: 0.20, y: 0.75 },
  { id: 10, x: 0.42, y: 0.45 },
  { id: 11, x: 0.62, y: 0.42 },
  { id: 12, x: 0.80, y: 0.70 },
  { id: 13, x: 0.25, y: 0.35 },
  { id: 14, x: 0.60, y: 0.80 },
  { id: 15, x: 0.45, y: 0.88 },
  { id: 16, x: 0.88, y: 0.25 },
  { id: 17, x: 0.08, y: 0.85 },
];

export const generateStars = (count = 18, canvasWidth, canvasHeight) => {
  // Convert normalised positions (0-1) to actual pixel coordinates
  return FIXED_STARS.slice(0, count).map((s) => ({
    id: s.id,
    x: s.x * canvasWidth,
    y: s.y * canvasHeight,
    radius: 6,
    brightness: 1,
  }));
};

export const getStarById = (stars, id) => {
  return stars.find((star) => star.id === id);
};

export const encodeGlyphSequence = (starIds) => {
  return starIds.join('-');
};

export const getSortedStarIds = (starIds) => {
  return [...starIds].sort((a, b) => a - b);
};

export const isValidGlyphLength = (starIds, min = 4, max = 18) => {
  return starIds.length >= min && starIds.length <= max;
};

export const sequencesMatch = (seq1, seq2) => {
  if (seq1.length !== seq2.length) return false;
  return seq1.every((id, index) => id === seq2[index]);
};