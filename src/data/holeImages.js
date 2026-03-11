// src/data/holeImages.js
// Builds the URL to the hole image in /public/GolfCourses/...
//
// Your files are WEBP:
// public/GolfCourses/<Club>/<Nine>/hole01.webp ... hole09.webp

export function holeImagePath(clubKey, nine, holeNumber) {
  if (!clubKey || !nine || !holeNumber) return null;

  // Remove spaces from club names to match folder names
  // "Orange Blossom" → "OrangeBlossom"
  // "Belle Glades" → "BelleGlades"
  const safeClub = String(clubKey).replace(/\s+/g, "");

  // Ensure nine name is a string
  const safeNine = String(nine);

  // hole01, hole02, etc
  const hole = String(holeNumber).padStart(2, "0");

  return `/GolfCourses/${safeClub}/${safeNine}/hole${hole}.webp`;
}