// src/data/holeImages.js

export function holeImagePath(clubKey, nine, holeNumber) {
  if (!clubKey || !nine || !holeNumber) return null;

  const safeClub = String(clubKey).replace(/\s+/g, "");
  const safeNine = String(nine);
  const hole = String(holeNumber).padStart(2, "0");

  return `/GolfCourses/${safeClub}/${safeNine}/hole${hole}.webp`;
}