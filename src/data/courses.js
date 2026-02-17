// src/data/courses.js

/**
 * Clubs (Country Clubs) and their nines.
 * For each hole: tee (white center) + green center
 *
 * lat/lon decimal degrees
 *
 * Added:
 * - courseType: "Executive" | "Championship"
 *   (Used by the Home page dropdown flow)
 *
 * Optional per-hole fields:
 * - par: number
 * - hcp: number  (handicap / stroke index)
 */

export const BELLE_GLADES = {
  clubName: "Belle Glades Country Club",
  courseType: "Championship",
  nines: {
    Calusa: [
      { hole: 1, par: 5, tee: { lat: 28.844444, lon: -81.955278 }, green: { lat: 28.841111, lon: -81.954722 } },
      { hole: 2, par: 4, tee: { lat: 28.840278, lon: -81.953889 }, green: { lat: 28.8375, lon: -81.954167 } },
      { hole: 3, par: 3, tee: { lat: 28.836944, lon: -81.954444 }, green: { lat: 28.835833, lon: -81.954167 } },
      { hole: 4, par: 4, tee: { lat: 28.835556, lon: -81.956111 }, green: { lat: 28.833056, lon: -81.9575 } },
      { hole: 5, par: 4, tee: { lat: 28.831111, lon: -81.956944 }, green: { lat: 28.829167, lon: -81.955 } },
      { hole: 6, par: 3, tee: { lat: 28.829444, lon: -81.954444 }, green: { lat: 28.830278, lon: -81.953889 } },
      { hole: 7, par: 4, tee: { lat: 28.830833, lon: -81.953889 }, green: { lat: 28.833333, lon: -81.953889 } },
      { hole: 8, par: 5, tee: { lat: 28.836389, lon: -81.955556 }, green: { lat: 28.839722, lon: -81.956389 } },
      { hole: 9, par: 4, tee: { lat: 28.841111, lon: -81.956667 }, green: { lat: 28.844167, lon: -81.956667 } },
    ],

    Seminole: [
      { hole: 1, par: 4, tee: { lat: 28.843889, lon: -81.958333 }, green: { lat: 28.841111, lon: -81.958333 } },
      { hole: 2, par: 4, tee: { lat: 28.84, lon: -81.958333 }, green: { lat: 28.837222, lon: -81.958333 } },
      { hole: 3, par: 4, tee: { lat: 28.837222, lon: -81.9575 }, green: { lat: 28.840556, lon: -81.9575 } },
      { hole: 4, par: 4, tee: { lat: 28.841944, lon: -81.957222 }, green: { lat: 28.844167, lon: -81.9575 } },
      { hole: 5, par: 5, tee: { lat: 28.8475, lon: -81.953889 }, green: { lat: 28.851111, lon: -81.953889 } },
      { hole: 6, par: 4, tee: { lat: 28.8525, lon: -81.955 }, green: { lat: 28.853889, lon: -81.954167 } },
      { hole: 7, par: 3, tee: { lat: 28.853611, lon: -81.953611 }, green: { lat: 28.852778, lon: -81.953889 } },
      { hole: 8, par: 5, tee: { lat: 28.850278, lon: -81.955 }, green: { lat: 28.8469444, lon: -81.954722 } },
      { hole: 9, par: 3, tee: { lat: 28.846111, lon: -81.954444 }, green: { lat: 28.845, lon: -81.954722 } },
    ],

    Tequesta: [
      { hole: 1, par: 5, tee: { lat: 28.844167, lon: -81.961389 }, green: { lat: 28.841389, lon: -81.960278 } },
      { hole: 2, par: 4, tee: { lat: 28.840556, lon: -81.960833 }, green: { lat: 28.838611, lon: -81.963056 } },
      { hole: 3, par: 4, tee: { lat: 28.839444, lon: -81.962778 }, green: { lat: 28.841667, lon: -81.962778 } },
      { hole: 4, par: 4, tee: { lat: 28.8425, lon: -81.962778 }, green: { lat: 28.841111, lon: -81.965 } },
      { hole: 5, par: 5, tee: { lat: 28.84, lon: -81.965278 }, green: { lat: 28.836667, lon: -81.964444 } },
      { hole: 6, par: 3, tee: { lat: 28.836111, lon: -81.963333 }, green: { lat: 28.836944, lon: -81.962778 } },
      { hole: 7, par: 4, tee: { lat: 28.836389, lon: -81.961667 }, green: { lat: 28.838333, lon: -81.959722 } },
      { hole: 8, par: 3, tee: { lat: 28.839167, lon: -81.959444 }, green: { lat: 28.84, lon: -81.959722 } },
      { hole: 9, par: 4, tee: { lat: 28.841111, lon: -81.959167 }, green: { lat: 28.843889, lon: -81.959167 } },
    ],
  },
};

export const BROAD_STRIPES = {
  clubName: "Broad Stripes Golf Course",
  courseType: "Championship",
  nines: {
    Front: [
      { hole: 1, par: 5, hcp: 9, tee: { lat: 28.965467, lon: -81.961133 }, green: { lat: 28.962206, lon: -81.959069 } },
      { hole: 2, par: 3, hcp: 15, tee: { lat: 28.96185, lon: -81.957931 }, green: { lat: 28.962953, lon: -81.958406 } },
      { hole: 3, par: 4, hcp: 7, tee: { lat: 28.962567, lon: -81.957433 }, green: { lat: 28.962058, lon: -81.954594 } },
      { hole: 4, par: 4, hcp: 5, tee: { lat: 28.961508, lon: -81.953369 }, green: { lat: 28.961439, lon: -81.950639 } },
      { hole: 5, par: 4, hcp: 13, tee: { lat: 28.961869, lon: -81.949397 }, green: { lat: 28.961719, lon: -81.946678 } },
      { hole: 6, par: 3, hcp: 17, tee: { lat: 28.962392, lon: -81.946686 }, green: { lat: 28.963114, lon: -81.947414 } },
      { hole: 7, par: 4, hcp: 11, tee: { lat: 28.963619, lon: -81.946822 }, green: { lat: 28.963997, lon: -81.949842 } },
      { hole: 8, par: 4, hcp: 3, tee: { lat: 28.963192, lon: -81.950492 }, green: { lat: 28.963831, lon: -81.953725 } },
      { hole: 9, par: 5, hcp: 1, tee: { lat: 28.963581, lon: -81.955575 }, green: { lat: 28.966036, lon: -81.959533 } },
    ],

    // Back nine stored as holes 1..9 so it matches /Back/hole01.png..hole09.png
    Back: [
      { hole: 1, par: 5, hcp: 2, tee: { lat: 28.966961, lon: -81.959175 }, green: { lat: 28.967911, lon: -81.955067 } },
      { hole: 2, par: 3, hcp: 14, tee: { lat: 28.968336, lon: -81.954383 }, green: { lat: 28.969061, lon: -81.955081 } },
      { hole: 3, par: 4, hcp: 16, tee: { lat: 28.969883, lon: -81.955847 }, green: { lat: 28.971453, lon: -81.957758 } },
      { hole: 4, par: 4, hcp: 10, tee: { lat: 28.97185, lon: -81.958447 }, green: { lat: 28.971903, lon: -81.955461 } },
      { hole: 5, par: 3, hcp: 18, tee: { lat: 28.972314, lon: -81.955292 }, green: { lat: 28.972717, lon: -81.956197 } },
      { hole: 6, par: 4, hcp: 4, tee: { lat: 28.973219, lon: -81.956367 }, green: { lat: 28.973561, lon: -81.959553 } },
      { hole: 7, par: 5, hcp: 12, tee: { lat: 28.973464, lon: -81.960228 }, green: { lat: 28.97, lon: -81.958731 } },
      { hole: 8, par: 4, hcp: 8, tee: { lat: 28.969367, lon: -81.958408 }, green: { lat: 28.970217, lon: -81.960922 } },
      { hole: 9, par: 4, hcp: 6, tee: { lat: 28.969769, lon: -81.961586 }, green: { lat: 28.967358, lon: -81.960144 } },
    ],
  },
};

export const ORANGE_BLOSSOM = {
  clubName: "Orange Blossom Country Club",
  courseType: "Championship",
  nines: {
    Front: [
      { hole: 1, par: 5, hcp: 3, tee: { lat: 28.952719, lon: -81.946772 }, green: { lat: 28.955403, lon: -81.948703 } },
      { hole: 2, par: 4, hcp: 1, tee: { lat: 28.955931, lon: -81.949208 }, green: { lat: 28.957261, lon: -81.946931 } },
      { hole: 3, par: 3, hcp: 13, tee: { lat: 28.958025, lon: -81.946539 }, green: { lat: 28.958936, lon: -81.946011 } },
      { hole: 4, par: 4, hcp: 15, tee: { lat: 28.959161, lon: -81.947281 }, green: { lat: 28.957411, lon: -81.948656 } },
      { hole: 5, par: 4, hcp: 5, tee: { lat: 28.957378, lon: -81.949864 }, green: { lat: 28.957058, lon: -81.952844 } },
      { hole: 6, par: 5, hcp: 7, tee: { lat: 28.956519, lon: -81.953064 }, green: { lat: 28.953361, lon: -81.953167 } },
      { hole: 7, par: 4, hcp: 9, tee: { lat: 28.953208, lon: -81.952136 }, green: { lat: 28.954342, lon: -81.94985 } },
      { hole: 8, par: 3, hcp: 17, tee: { lat: 28.954283, lon: -81.949406 }, green: { lat: 28.953336, lon: -81.949294 } },
      { hole: 9, par: 4, hcp: 11, tee: { lat: 28.953067, lon: -81.949528 }, green: { lat: 28.951653, lon: -81.947711 } },
    ],

    // Back nine stored as holes 1..9 so it matches /Back/hole01.png..hole09.png
    Back: [
      { hole: 1, par: 4, hcp: 10, tee: { lat: 28.951861, lon: -81.945603 }, green: { lat: 28.954964, lon: -81.945625 } },
      { hole: 2, par: 4, hcp: 8, tee: { lat: 28.955306, lon: -81.944869 }, green: { lat: 28.956886, lon: -81.943139 } },
      { hole: 3, par: 5, hcp: 2, tee: { lat: 28.957122, lon: -81.942753 }, green: { lat: 28.957792, lon: -81.939036 } },
      { hole: 4, par: 4, hcp: 14, tee: { lat: 28.957467, lon: -81.938703 }, green: { lat: 28.955942, lon: -81.937036 } },
      { hole: 5, par: 3, hcp: 16, tee: { lat: 28.955214, lon: -81.936564 }, green: { lat: 28.954106, lon: -81.936942 } },
      { hole: 6, par: 4, hcp: 12, tee: { lat: 28.953406, lon: -81.937356 }, green: { lat: 28.950681, lon: -81.938119 } },
      { hole: 7, par: 5, hcp: 4, tee: { lat: 28.950478, lon: -81.938747 }, green: { lat: 28.949947, lon: -81.9428 } },
      { hole: 8, par: 3, hcp: 18, tee: { lat: 28.950511, lon: -81.942583 }, green: { lat: 28.951606, lon: -81.942597 } },
      { hole: 9, par: 4, hcp: 6, tee: { lat: 28.951953, lon: -81.94285 }, green: { lat: 28.950258, lon: -81.9455 } },
    ],
  },
};

export const COURSE_CATALOG = {
  "Belle Glades": BELLE_GLADES,
  "Orange Blossom": ORANGE_BLOSSOM,
  "Broad Stripes Golf": BROAD_STRIPES,
};