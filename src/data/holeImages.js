// src/data/holeImages.js
// Public folder paths (served from /)

function pad2(n) {
  return String(n).padStart(2, "0");
}

/**
 * Supports multiple courses.
 *
 * Image naming rule (same everywhere):
 *   hole01.png ... hole09.png
 *
 * Folder rule:
 *   /public/GolfCourses/<CourseSlug>/<NineName>/hole01.png
 *
 * Examples:
 *   /GolfCourses/BelleGlades/Calusa/hole01.png
 *   /GolfCourses/OrangeBlossom/Front/hole01.png
 */

// Map the course display name used in courses.js to a folder slug in /public/GolfCourses/
const COURSE_SLUG = {
  "Belle Glades": "BelleGlades",
  "Orange Blossom": "OrangeBlossom",
};

export function holeImagePath(courseName, nine, holeWithinNine) {
  if (!courseName || !nine || !holeWithinNine) return null;

  const slug = COURSE_SLUG[courseName] || courseName.replace(/\s+/g, "");
  return `/GolfCourses/${slug}/${nine}/hole${pad2(holeWithinNine)}.png`;
}
