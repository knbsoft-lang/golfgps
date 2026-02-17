// src/data/holeImages.js
// Builds the URL to the hole image in /public/GolfCourses/...
//
// Your files are now WEBP:
// public/GolfCourses/<Club>/<Nine>/hole01.webp ... hole09.webp

export function holeImagePath(clubKey, nine, holeNumber) {
  if (!clubKey || !nine || !holeNumber) return null;

  // NOTE: this must match your folder name exactly.
  // Your COURSE_CATALOG keys are like "Orange Blossom" and "Belle Glades"
  // but your folder names are "OrangeBlossom" and "BelleGlades"
  // So we remove spaces to match those folders.
  const safeClub = String(clubKey).replace(/\s+/g, "");
  const hole = String(holeNumber).padStart(2, "0");

  return `/GolfCourses/${safeClub}/${nine}/hole${hole}.webp`;
}
