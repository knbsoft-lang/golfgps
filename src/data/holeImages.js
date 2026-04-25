// src/data/holeImages.js
// Builds the URL to the hole image in /public/GolfCourses/...
//
// Some courses use PNG, some use WEBP.

function imageExtensionForClub(clubKey) {
  const safeClub = String(clubKey || "").replace(/\s+/g, "");

  // These two current courses are PNG
  if (safeClub === "BroadStripesGolf") return "png";
  if (safeClub === "OrangeBlossom") return "png";

  // Default for other courses
  return "webp";
}

export function holeImagePath(clubKey, nine, holeNumber) {
  if (!clubKey || !nine || !holeNumber) return null;

  const safeClub = String(clubKey).replace(/\s+/g, "");
  const safeNine = String(nine);
  const hole = String(holeNumber).padStart(2, "0");
  const ext = imageExtensionForClub(clubKey);

  return `/GolfCourses/${safeClub}/${safeNine}/hole${hole}.${ext}`;
}