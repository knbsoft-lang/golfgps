// src/data/courses.js

/**
 * Clubs (Country Clubs) and their nines.
 * For each hole: tee (white center) + green center
 *
 * lat/lon decimal degrees
 *
 * Added:
 * - courseType: "Executive" | "Championship"
 *   (Used by the left-side dropdown flow)
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

export const ORANGE_BLOSSOM = {
  clubName: "Orange Blossom Country Club",
  courseType: "Championship",
  nines: {
    Front: [
      { hole: 1, par: 5, tee: { lat: 28.8438889, lon: -81.9583333 }, green: { lat: 28.8411111, lon: -81.9583333 } },
      { hole: 2, par: 4, tee: { lat: 28.9558333, lon: -81.9491667 }, green: { lat: 28.9572222, lon: -81.9466667 } },
      { hole: 3, par: 3, tee: { lat: 28.9577778, lon: -81.9463889 }, green: { lat: 28.9588889, lon: -81.9458333 } },
      { hole: 4, par: 4, tee: { lat: 28.9591667, lon: -81.9472222 }, green: { lat: 28.9572222, lon: -81.9486111 } },
      { hole: 5, par: 4, tee: { lat: 28.9572222, lon: -81.9497222 }, green: { lat: 28.9569444, lon: -81.9527778 } },
      { hole: 6, par: 5, tee: { lat: 28.9563889, lon: -81.9530556 }, green: { lat: 28.9533333, lon: -81.9530556 } },
      { hole: 7, par: 4, tee: { lat: 28.9530556, lon: -81.9519444 }, green: { lat: 28.9541667, lon: -81.9497222 } },
      { hole: 8, par: 3, tee: { lat: 28.9541667, lon: -81.9491667 }, green: { lat: 28.9530556, lon: -81.9491667 } },
      { hole: 9, par: 4, tee: { lat: 28.9530556, lon: -81.9494444 }, green: { lat: 28.9513889, lon: -81.9475 } },
    ],

    // Back nine stored as holes 1..9 so it matches /Back/hole01.png..hole09.png
    Back: [
      { hole: 1, par: 4, tee: { lat: 28.9516667, lon: -81.9458333 }, green: { lat: 28.955, lon: -81.9455556 } },
      { hole: 2, par: 4, tee: { lat: 28.955, lon: -81.9447222 }, green: { lat: 28.9566667, lon: -81.9430556 } },
      { hole: 3, par: 5, tee: { lat: 28.9569444, lon: -81.9427778 }, green: { lat: 28.9577778, lon: -81.9388889 } },
      { hole: 4, par: 4, tee: { lat: 28.9572222, lon: -81.9386111 }, green: { lat: 28.9558333, lon: -81.9366667 } },
      { hole: 5, par: 3, tee: { lat: 28.955, lon: -81.9363889 }, green: { lat: 28.9538889, lon: -81.9366667 } },
      { hole: 6, par: 4, tee: { lat: 28.9527778, lon: -81.9375 }, green: { lat: 28.9505556, lon: -81.9380556 } },
      { hole: 7, par: 5, tee: { lat: 28.9502778, lon: -81.9386111 }, green: { lat: 28.9497222, lon: -81.9427778 } },
      { hole: 8, par: 3, tee: { lat: 28.9502778, lon: -81.9425 }, green: { lat: 28.9513889, lon: -81.9425 } },
      { hole: 9, par: 4, tee: { lat: 28.9516667, lon: -81.9427778 }, green: { lat: 28.95, lon: -81.9452778 } },
    ],
  },
};

export const COURSE_CATALOG = {
  "Belle Glades": BELLE_GLADES,
  "Orange Blossom": ORANGE_BLOSSOM,
};
