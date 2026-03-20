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
 * - greenDepth: number  (green depth in yards)
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
      { hole: 1, par: 5, hcp: 9, greenDepth: 26, tee: { lat: 28.965467, lon: -81.961133 }, green: { lat: 28.962206, lon: -81.959069 } },
      { hole: 2, par: 3, hcp: 15, greenDepth: 26, tee: { lat: 28.96185, lon: -81.957931 }, green: { lat: 28.962953, lon: -81.958406 } },
      { hole: 3, par: 4, hcp: 7, greenDepth: 37, tee: { lat: 28.962567, lon: -81.957433 }, green: { lat: 28.962058, lon: -81.954594 } },
      { hole: 4, par: 4, hcp: 5, greenDepth: 24, tee: { lat: 28.961508, lon: -81.953369 }, green: { lat: 28.961439, lon: -81.950639 } },
      { hole: 5, par: 4, hcp: 13, greenDepth: 28, tee: { lat: 28.961869, lon: -81.949397 }, green: { lat: 28.961719, lon: -81.946678 } },
      { hole: 6, par: 3, hcp: 17, greenDepth: 33, tee: { lat: 28.962392, lon: -81.946686 }, green: { lat: 28.963114, lon: -81.947414 } },
      { hole: 7, par: 4, hcp: 11, greenDepth: 33, tee: { lat: 28.963619, lon: -81.946822 }, green: { lat: 28.963997, lon: -81.949842 } },
      { hole: 8, par: 4, hcp: 3, greenDepth: 25, tee: { lat: 28.963192, lon: -81.950492 }, green: { lat: 28.963831, lon: -81.953725 } },
      { hole: 9, par: 5, hcp: 1, greenDepth: 39, tee: { lat: 28.963726, lon: -81.955847 }, green: { lat: 28.96607, lon: -81.959551 } },
    ],

    Back: [
      { hole: 1, par: 5, hcp: 2, greenDepth: 30, tee: { lat: 28.967123, lon: -81.958785 }, green: { lat: 28.967911, lon: -81.955067 } },
      { hole: 2, par: 3, hcp: 14, greenDepth: 33, tee: { lat: 28.968423, lon: -81.954368 }, green: { lat: 28.969061, lon: -81.955081 } },
      { hole: 3, par: 4, hcp: 16, greenDepth: 33, tee: { lat: 28.969883, lon: -81.955847 }, green: { lat: 28.971453, lon: -81.957758 } },
      { hole: 4, par: 4, hcp: 10, greenDepth: 30, tee: { lat: 28.971886, lon: -81.958384 }, green: { lat: 28.971903, lon: -81.955461 } },
      { hole: 5, par: 3, hcp: 18, greenDepth: 24, tee: { lat: 28.972325, lon: -81.955277 }, green: { lat: 28.972717, lon: -81.956197 } },
      { hole: 6, par: 4, hcp: 4, greenDepth: 29, tee: { lat: 28.973274, lon: -81.95643 }, green: { lat: 28.973561, lon: -81.959553 } },
      { hole: 7, par: 5, hcp: 12, greenDepth: 35, tee: { lat: 28.9735, lon: -81.960244 }, green: { lat: 28.97, lon: -81.958731 } },
      { hole: 8, par: 4, hcp: 8, greenDepth: 24, tee: { lat: 28.969403, lon: -81.958446 }, green: { lat: 28.970217, lon: -81.960922 } },
      { hole: 9, par: 4, hcp: 6, greenDepth: 32, tee: { lat: 28.969769, lon: -81.961586 }, green: { lat: 28.967358, lon: -81.960144 } },
    ],
  },
};

export const ORANGE_BLOSSOM = {
  clubName: "Orange Blossom Country Club",
  courseType: "Championship",
  nines: {
    Front: [
      { hole: 1, par: 5, hcp: 3, greenDepth: 26, tee: { lat: 28.952719, lon: -81.946772 }, green: { lat: 28.955403, lon: -81.948703 } },
      { hole: 2, par: 4, hcp: 1, greenDepth: 26, tee: { lat: 28.955931, lon: -81.949208 }, green: { lat: 28.957261, lon: -81.946931 } },
      { hole: 3, par: 3, hcp: 13, greenDepth: 37, tee: { lat: 28.958025, lon: -81.946539 }, green: { lat: 28.958936, lon: -81.946011 } },
      { hole: 4, par: 4, hcp: 15, greenDepth: 24, tee: { lat: 28.959161, lon: -81.947281 }, green: { lat: 28.957411, lon: -81.948656 } },
      { hole: 5, par: 4, hcp: 5, greenDepth: 28, tee: { lat: 28.957378, lon: -81.949864 }, green: { lat: 28.957058, lon: -81.952844 } },
      { hole: 6, par: 5, hcp: 7, greenDepth: 33, tee: { lat: 28.956519, lon: -81.953064 }, green: { lat: 28.953361, lon: -81.953167 } },
      { hole: 7, par: 4, hcp: 9, greenDepth: 33, tee: { lat: 28.953208, lon: -81.952136 }, green: { lat: 28.954342, lon: -81.94985 } },
      { hole: 8, par: 3, hcp: 17, greenDepth: 25, tee: { lat: 28.954283, lon: -81.949406 }, green: { lat: 28.953336, lon: -81.949294 } },
      { hole: 9, par: 4, hcp: 11, greenDepth: 39, tee: { lat: 28.953067, lon: -81.949528 }, green: { lat: 28.951653, lon: -81.947711 } },
    ],

    Back: [
      { hole: 1, par: 4, hcp: 10, greenDepth: 30, tee: { lat: 28.951861, lon: -81.945603 }, green: { lat: 28.954964, lon: -81.945625 } },
      { hole: 2, par: 4, hcp: 8, greenDepth: 33, tee: { lat: 28.955306, lon: -81.944869 }, green: { lat: 28.956886, lon: -81.943139 } },
      { hole: 3, par: 5, hcp: 2, greenDepth: 33, tee: { lat: 28.957122, lon: -81.942753 }, green: { lat: 28.957792, lon: -81.939036 } },
      { hole: 4, par: 4, hcp: 14, greenDepth: 30, tee: { lat: 28.957467, lon: -81.938703 }, green: { lat: 28.955942, lon: -81.937036 } },
      { hole: 5, par: 3, hcp: 16, greenDepth: 24, tee: { lat: 28.955214, lon: -81.936564 }, green: { lat: 28.954106, lon: -81.936942 } },
      { hole: 6, par: 4, hcp: 12, greenDepth: 29, tee: { lat: 28.953406, lon: -81.937356 }, green: { lat: 28.950681, lon: -81.938119 } },
      { hole: 7, par: 5, hcp: 4, greenDepth: 35, tee: { lat: 28.950478, lon: -81.938747 }, green: { lat: 28.949947, lon: -81.9428 } },
      { hole: 8, par: 3, hcp: 18, greenDepth: 24, tee: { lat: 28.950511, lon: -81.942583 }, green: { lat: 28.951606, lon: -81.942597 } },
      { hole: 9, par: 4, hcp: 6, greenDepth: 32, tee: { lat: 28.951953, lon: -81.94285 }, green: { lat: 28.950258, lon: -81.9455 } },
    ],
  },
};

export const HACIENDA_HILLS = {
  clubName: "Hacienda Hills",
  courseType: "Championship",
  nines: {
    Lakes: [
      { hole: 1, par: 5, hcp: 9, greenDepth: 33, tee: { lat: 28.942964, lon: -81.96272 }, green: { lat: 28.941171, lon: -81.959545 } },
      { hole: 2, par: 4, hcp: 2, greenDepth: 31, tee: { lat: 28.939993, lon: -81.959098 }, green: { lat: 28.937895, lon: -81.95796 } },
      { hole: 3, par: 3, hcp: 7, greenDepth: 31, tee: { lat: 28.938128, lon: -81.957222 }, green: { lat: 28.938389, lon: -81.956284 } },
      { hole: 4, par: 4, hcp: 5, greenDepth: 34, tee: { lat: 28.938625, lon: -81.955535 }, green: { lat: 28.940722, lon: -81.954504 } },
      { hole: 5, par: 4, hcp: 1, greenDepth: 37, tee: { lat: 28.939578, lon: -81.954312 }, green: { lat: 28.936937, lon: -81.954261 } },
      { hole: 6, par: 4, hcp: 3, greenDepth: 32, tee: { lat: 28.936426, lon: -81.954667 }, green: { lat: 28.936596, lon: -81.957717 } },
      { hole: 7, par: 4, hcp: 4, greenDepth: 25, tee: { lat: 28.936828, lon: -81.959121 }, green: { lat: 28.936549, lon: -81.961768 } },
      { hole: 8, par: 3, hcp: 6, greenDepth: 24, tee: { lat: 28.937138, lon: -81.96157 }, green: { lat: 28.937409, lon: -81.96274 } },
      { hole: 9, par: 5, hcp: 8, greenDepth: 26, tee: { lat: 28.939483, lon: -81.963088 }, green: { lat: 28.942708, lon: -81.963187 } },
    ],

    Oaks: [
      { hole: 1, par: 5, hcp: 4, greenDepth: 22, tee: { lat: 28.943162, lon: -81.962565 }, green: { lat: 28.941484, lon: -81.959265 } },
      { hole: 2, par: 3, hcp: 6, greenDepth: 25, tee: { lat: 28.941031, lon: -81.958962 }, green: { lat: 28.941998, lon: -81.958521 } },
      { hole: 3, par: 4, hcp: 5, greenDepth: 28, tee: { lat: 28.942147, lon: -81.957587 }, green: { lat: 28.941199, lon: -81.955111 } },
      { hole: 4, par: 5, hcp: 8, greenDepth: 26, tee: { lat: 28.94186, lon: -81.954275 }, green: { lat: 28.945586, lon: -81.954306 } },
      { hole: 5, par: 4, hcp: 9, greenDepth: 35, tee: { lat: 28.945847, lon: -81.95506 }, green: { lat: 28.946257, lon: -81.957486 } },
      { hole: 6, par: 4, hcp: 1, greenDepth: 24, tee: { lat: 28.94599, lon: -81.958532 }, green: { lat: 28.942717, lon: -81.957818 } },
      { hole: 7, par: 3, hcp: 7, greenDepth: 23, tee: { lat: 28.94333, lon: -81.958453 }, green: { lat: 28.94225, lon: -81.958862 } },
      { hole: 8, par: 4, hcp: 3, greenDepth: 23, tee: { lat: 28.94288, lon: -81.9593 }, green: { lat: 28.945532, lon: -81.959212 } },
      { hole: 9, par: 4, hcp: 2, greenDepth: 39, tee: { lat: 28.945471, lon: -81.961032 }, green: { lat: 28.943518, lon: -81.962257 } },
    ],

    Palms: [
      { hole: 1, par: 5, hcp: 7, greenDepth: 33, tee: { lat: 28.944702, lon: -81.965242 }, green: { lat: 28.94572, lon: -81.969075 } },
      { hole: 2, par: 4, hcp: 8, greenDepth: 47, tee: { lat: 28.946165, lon: -81.967757 }, green: { lat: 28.945518, lon: -81.965265 } },
      { hole: 3, par: 3, hcp: 6, greenDepth: 28, tee: { lat: 28.946032, lon: -81.964369 }, green: { lat: 28.947056, lon: -81.96395 } },
      { hole: 4, par: 5, hcp: 1, greenDepth: 31, tee: { lat: 28.948203, lon: -81.964291 }, green: { lat: 28.94989, lon: -81.967677 } },
      { hole: 5, par: 4, hcp: 3, greenDepth: 30, tee: { lat: 28.950378, lon: -81.966648 }, green: { lat: 28.949568, lon: -81.963874 } },
      { hole: 6, par: 4, hcp: 4, greenDepth: 38, tee: { lat: 28.950337, lon: -81.971078 }, green: { lat: 28.950062, lon: -81.968618 } },
      { hole: 7, par: 4, hcp: 2, greenDepth: 35, tee: { lat: 28.950445, lon: -81.966336 }, green: { lat: 28.949554, lon: -81.963888 } },
      { hole: 8, par: 3, hcp: 9, greenDepth: 35, tee: { lat: 28.949291, lon: -81.963167 }, green: { lat: 28.948474, lon: -81.96278 } },
      { hole: 9, par: 4, hcp: 5, greenDepth: 33, tee: { lat: 28.947636, lon: -81.962638 }, green: { lat: 28.945487, lon: -81.964006 } },
    ],
  },
};

export const GLENVIEW_CHAMPIONS = {
  clubName: "Glenview Country Club",
  courseType: "Championship",
  nines: {
    FoxRun: [
      { hole: 1, par: 4, hcp: 6, greenDepth: 23, tee: { lat: 28.951549, lon: -82.00789 }, green: { lat: 28.952343, lon: -82.01081 } },
      { hole: 2, par: 4, hcp: 3, greenDepth: 22, tee: { lat: 28.952587, lon: -82.012328 }, green: { lat: 28.952347, lon: -82.015737 } },
      { hole: 3, par: 5, hcp: 9, greenDepth: 20, tee: { lat: 28.951208, lon: -82.015725 }, green: { lat: 28.947542, lon: -82.015498 } },
      { hole: 4, par: 3, hcp: 8, greenDepth: 34, tee: { lat: 28.946022, lon: -82.013631 }, green: { lat: 28.94597, lon: -82.012674 } },
      { hole: 5, par: 4, hcp: 1, greenDepth: 24, tee: { lat: 28.945525, lon: -82.012028 }, green: { lat: 28.942802, lon: -82.011441 } },
      { hole: 6, par: 3, hcp: 7, greenDepth: 25, tee: { lat: 28.942172, lon: -82.011303 }, green: { lat: 28.942438, lon: -82.010061 } },
      { hole: 7, par: 5, hcp: 2, greenDepth: 30, tee: { lat: 28.942693, lon: -82.009187 }, green: { lat: 28.946381, lon: -82.011113 } },
      { hole: 8, par: 4, hcp: 4, greenDepth: 33, tee: { lat: 28.94775, lon: -82.011362 }, green: { lat: 28.950202, lon: -82.010842 } },
      { hole: 9, par: 4, hcp: 5, greenDepth: 29, tee: { lat: 28.950466, lon: -82.010366 }, green: { lat: 28.949494, lon: -82.007712 } },
    ],

    StirrupCup: [
      { hole: 1, par: 4, hcp: 4, greenDepth: 21, tee: { lat: 28.948531, lon: -82.007625 }, green: { lat: 28.945861, lon: -82.007515 } },
      { hole: 2, par: 4, hcp: 9, greenDepth: 22, tee: { lat: 28.943795, lon: -82.005357 }, green: { lat: 28.94153, lon: -82.004308 } },
      { hole: 3, par: 5, hcp: 8, greenDepth: 36, tee: { lat: 28.940179, lon: -82.003914 }, green: { lat: 28.937375, lon: -82.005111 } },
      { hole: 4, par: 3, hcp: 7, greenDepth: 35, tee: { lat: 28.937791, lon: -82.006015 }, green: { lat: 28.938396, lon: -82.00712 } },
      { hole: 5, par: 4, hcp: 5, greenDepth: 26, tee: { lat: 28.936636, lon: -82.007793 }, green: { lat: 28.934524, lon: -82.00658 } },
      { hole: 6, par: 4, hcp: 3, greenDepth: 28, tee: { lat: 28.934166, lon: -82.005479 }, green: { lat: 28.93612, lon: -82.003648 } },
      { hole: 7, par: 5, hcp: 1, greenDepth: 34, tee: { lat: 28.937722, lon: -82.002709 }, green: { lat: 28.94145, lon: -82.003329 } },
      { hole: 8, par: 3, hcp: 6, greenDepth: 36, tee: { lat: 28.942832, lon: -82.003715 }, green: { lat: 28.94386, lon: -82.004455 } },
      { hole: 9, par: 4, hcp: 2, greenDepth: 38, tee: { lat: 28.945705, lon: -82.00645 }, green: { lat: 28.948594, lon: -82.006494 } },
    ],

    TalleyHo: [
      { hole: 1, par: 5, hcp: 5, greenDepth: 23, tee: { lat: 28.951167, lon: -82.004925 }, green: { lat: 28.953478, lon: -82.001728 } },
      { hole: 2, par: 4, hcp: 4, greenDepth: 30, tee: { lat: 28.954454, lon: -82.001746 }, green: { lat: 28.956646, lon: -82.002339 } },
      { hole: 3, par: 4, hcp: 1, greenDepth: 22, tee: { lat: 28.956847, lon: -82.003779 }, green: { lat: 28.955381, lon: -82.006713 } },
      { hole: 4, par: 3, hcp: 8, greenDepth: 36, tee: { lat: 28.956875, lon: -82.005988 }, green: { lat: 28.957362, lon: -82.004812 } },
      { hole: 5, par: 4, hcp: 6, greenDepth: 31, tee: { lat: 28.958336, lon: -82.004191 }, green: { lat: 28.959786, lon: -82.006253 } },
      { hole: 6, par: 4, hcp: 2, greenDepth: 22, tee: { lat: 28.959905, lon: -82.007704 }, green: { lat: 28.959548, lon: -82.010853 } },
      { hole: 7, par: 3, hcp: 7, greenDepth: 22, tee: { lat: 28.959106, lon: -82.011627 }, green: { lat: 28.958487, lon: -82.010603 } },
      { hole: 8, par: 4, hcp: 9, greenDepth: 21, tee: { lat: 28.958117, lon: -82.009429 }, green: { lat: 28.956694, lon: -82.007531 } },
      { hole: 9, par: 5, hcp: 3, greenDepth: 27, tee: { lat: 28.954704, lon: -82.007306 }, green: { lat: 28.951275, lon: -82.006434 } },
    ],
  },
};

export const TIERRA_DEL_SOL = {
  clubName: "Tierra Del Sol Country Club",
  courseType: "Championship",
  nines: {
    Front: [
      { hole: 1, par: 4, hcp: 11, greenDepth: 36, tee: { lat: 28.934361, lon: -81.972433 }, green: { lat: 28.932758, lon: -81.974878 } },
      { hole: 2, par: 4, hcp: 3, greenDepth: 27, tee: { lat: 28.933376, lon: -81.976104 }, green: { lat: 28.935076, lon: -81.97819 } },
      { hole: 3, par: 3, hcp: 15, greenDepth: 39, tee: { lat: 28.935942, lon: -81.978401 }, green: { lat: 28.936996, lon: -81.978371 } },
      { hole: 4, par: 4, hcp: 1, greenDepth: 36, tee: { lat: 28.937928, lon: -81.978553 }, green: { lat: 28.940088, lon: -81.976673 } },
      { hole: 5, par: 3, hcp: 17, greenDepth: 23, tee: { lat: 28.94093, lon: -81.975683 }, green: { lat: 28.941254, lon: -81.974513 } },
      { hole: 6, par: 5, hcp: 7, greenDepth: 26, tee: { lat: 28.941559, lon: -81.973059 }, green: { lat: 28.940904, lon: -81.969544 } },
      { hole: 7, par: 4, hcp: 5, greenDepth: 30, tee: { lat: 28.940959, lon: -81.968416 }, green: { lat: 28.941491, lon: -81.965357 } },
      { hole: 8, par: 5, hcp: 13, greenDepth: 29, tee: { lat: 28.940822, lon: -81.965344 }, green: { lat: 28.938754, lon: -81.969099 } },
      { hole: 9, par: 4, hcp: 9, greenDepth: 21, tee: { lat: 28.938345, lon: -81.972013 }, green: { lat: 28.935947, lon: -81.971227 } },
    ],

    Back: [
      { hole: 1, par: 4, hcp: 6, greenDepth: 26, tee: { lat: 28.93401, lon: -81.971963 }, green: { lat: 28.932207, lon: -81.97425 } },
      { hole: 2, par: 3, hcp: 18, greenDepth: 29, tee: { lat: 28.932056, lon: -81.974756 }, green: { lat: 28.931195, lon: -81.974361 } },
      { hole: 3, par: 5, hcp: 8, greenDepth: 26, tee: { lat: 28.928124, lon: -81.97429 }, green: { lat: 28.926654, lon: -81.97129 } },
      { hole: 4, par: 4, hcp: 2, greenDepth: 27, tee: { lat: 28.925701, lon: -81.971156 }, green: { lat: 28.922958, lon: -81.971856 } },
      { hole: 5, par: 4, hcp: 10, greenDepth: 23, tee: { lat: 28.923166, lon: -81.971123 }, green: { lat: 28.920607, lon: -81.971294 } },
      { hole: 6, par: 3, hcp: 14, greenDepth: 30, tee: { lat: 28.920958, lon: -81.969286 }, green: { lat: 28.922015, lon: -81.969452 } },
      { hole: 7, par: 5, hcp: 12, greenDepth: 26, tee: { lat: 28.923893, lon: -81.968468 }, green: { lat: 28.92657, lon: -81.969041 } },
      { hole: 8, par: 3, hcp: 16, greenDepth: 24, tee: { lat: 28.927607, lon: -81.969536 }, green: { lat: 28.928791, lon: -81.969457 } },
      { hole: 9, par: 5, hcp: 4, greenDepth: 25, tee: { lat: 28.930148, lon: -81.969728 }, green: { lat: 28.933955, lon: -81.970223 } },
    ],
  },
};

export const LOPEZ_LEGACY = {
  clubName: "Lopez Legacy Golf & Country Club",
  courseType: "Championship",
  nines: {
    AshleyMeadows: [
      { hole: 1, par: 4, hcp: 8, greenDepth: 33, tee: { lat: 28.973916, lon: -82.013823 }, green: { lat: 28.976034, lon: -82.012771 } },
      { hole: 2, par: 4, hcp: 4, greenDepth: 25, tee: { lat: 28.976922, lon: -82.01212 }, green: { lat: 28.975002, lon: -82.009942 } },
      { hole: 3, par: 5, hcp: 1, greenDepth: 34, tee: { lat: 28.975195, lon: -82.008152 }, green: { lat: 28.975692, lon: -82.004011 } },
      { hole: 4, par: 3, hcp: 9, greenDepth: 31, tee: { lat: 28.976468, lon: -82.003073 }, green: { lat: 28.977491, lon: -82.003255 } },
      { hole: 5, par: 4, hcp: 7, greenDepth: 31, tee: { lat: 28.978031, lon: -82.003796 }, green: { lat: 28.978666, lon: -82.006905 } },
      { hole: 6, par: 4, hcp: 2, greenDepth: 36, tee: { lat: 28.978436, lon: -82.008693 }, green: { lat: 28.978799, lon: -82.011294 } },
      { hole: 7, par: 4, hcp: 5, greenDepth: 26, tee: { lat: 28.978449, lon: -82.012883 }, green: { lat: 28.979895, lon: -82.01522 } },
      { hole: 8, par: 3, hcp: 6, greenDepth: 25, tee: { lat: 28.978811, lon: -82.016331 }, green: { lat: 28.977957, lon: -82.016953 } },
      { hole: 9, par: 5, hcp: 3, greenDepth: 26, tee: { lat: 28.976531, lon: -82.01696 }, green: { lat: 28.973549, lon: -82.014303 } },
    ],

    ErinnGlenn: [
      { hole: 1, par: 4, hcp: 5, greenDepth: 28, tee: { lat: 28.969705, lon: -82.012906 }, green: { lat: 28.967717, lon: -82.011628 } },
      { hole: 2, par: 3, hcp: 8, greenDepth: 36, tee: { lat: 28.9659, lon: -82.013048 }, green: { lat: 28.965707, lon: -82.011765 } },
      { hole: 3, par: 4, hcp: 6, greenDepth: 39, tee: { lat: 28.965598, lon: -82.010804 }, green: { lat: 28.968329, lon: -82.011061 } },
      { hole: 4, par: 5, hcp: 1, greenDepth: 34, tee: { lat: 28.968756, lon: -82.00949 }, green: { lat: 28.968475, lon: -82.00521 } },
      { hole: 5, par: 4, hcp: 3, greenDepth: 40, tee: { lat: 28.967259, lon: -82.005109 }, green: { lat: 28.965915, lon: -82.002819 } },
      { hole: 6, par: 3, hcp: 7, greenDepth: 32, tee: { lat: 28.964791, lon: -82.002436 }, green: { lat: 28.965769, lon: -82.001606 } },
      { hole: 7, par: 4, hcp: 2, greenDepth: 23, tee: { lat: 28.967005, lon: -82.00234 }, green: { lat: 28.968418, lon: -82.004486 } },
      { hole: 8, par: 5, hcp: 9, greenDepth: 37, tee: { lat: 28.969683, lon: -82.005757 }, green: { lat: 28.969488, lon: -82.010151 } },
      { hole: 9, par: 4, hcp: 4, greenDepth: 34, tee: { lat: 28.969117, lon: -82.01082 }, green: { lat: 28.971395, lon: -82.012048 } },
    ],

    TorriPines: [
      { hole: 1, par: 5, hcp: 2, greenDepth: 32, tee: { lat: 28.970798, lon: -82.016297 }, green: { lat: 28.971276, lon: -82.02028 } },
      { hole: 2, par: 3, hcp: 8, greenDepth: 42, tee: { lat: 28.972175, lon: -82.021348 }, green: { lat: 28.973103, lon: -82.021411 } },
      { hole: 3, par: 4, hcp: 7, greenDepth: 36, tee: { lat: 28.974753, lon: -82.021346 }, green: { lat: 28.976598, lon: -82.022414 } },
      { hole: 4, par: 4, hcp: 6, greenDepth: 38, tee: { lat: 28.978797, lon: -82.021349 }, green: { lat: 28.981439, lon: -82.021432 } },
      { hole: 5, par: 4, hcp: 1, greenDepth: 37, tee: { lat: 28.981732, lon: -82.020178 }, green: { lat: 28.980437, lon: -82.017816 } },
      { hole: 6, par: 4, hcp: 4, greenDepth: 40, tee: { lat: 28.980032, lon: -82.017279 }, green: { lat: 28.978647, lon: -82.019595 } },
      { hole: 7, par: 4, hcp: 3, greenDepth: 35, tee: { lat: 28.97773, lon: -82.020982 }, green: { lat: 28.975037, lon: -82.020903 } },
      { hole: 8, par: 3, hcp: 9, greenDepth: 25, tee: { lat: 28.973168, lon: -82.020396 }, green: { lat: 28.972351, lon: -82.020276 } },
      { hole: 9, par: 5, hcp: 5, greenDepth: 33, tee: { lat: 28.971974, lon: -82.020068 }, green: { lat: 28.97232, lon: -82.015631 } },
    ],
  },
};

export const PALMER_LEGENDS = {
  clubName: "Palmer Legends Country Club",
  courseType: "Championship",
  nines: {
    CherryHill: [
      { hole: 1, par: 5, hcp: 4, greenDepth: 36, tee: { lat: 28.91073, lon: -81.994388 }, green: { lat: 28.913724, lon: -81.997252 } },
      { hole: 2, par: 4, hcp: 2, greenDepth: 37, tee: { lat: 28.913252, lon: -81.999551 }, green: { lat: 28.912943, lon: -82.002888 } },
      { hole: 3, par: 4, hcp: 5, greenDepth: 36, tee: { lat: 28.913313, lon: -82.003668 }, green: { lat: 28.916094, lon: -82.003446 } },
      { hole: 4, par: 4, hcp: 1, greenDepth: 33, tee: { lat: 28.919611, lon: -82.005384 }, green: { lat: 28.919501, lon: -82.008325 } },
      { hole: 5, par: 3, hcp: 7, greenDepth: 31, tee: { lat: 28.919678, lon: -82.009969 }, green: { lat: 28.918738, lon: -82.010008 } },
      { hole: 6, par: 4, hcp: 6, greenDepth: 41, tee: { lat: 28.919612, lon: -82.005348 }, green: { lat: 28.918776, lon: -82.004854 } },
      { hole: 7, par: 4, hcp: 9, greenDepth: 33, tee: { lat: 28.919259, lon: -82.003497 }, green: { lat: 28.918685, lon: -82.000894 } },
      { hole: 8, par: 3, hcp: 3, greenDepth: 42, tee: { lat: 28.916863, lon: -82.000565 }, green: { lat: 28.915714, lon: -82.000404 } },
      { hole: 9, par: 5, hcp: 8, greenDepth: 38, tee: { lat: 28.91188, lon: -81.998429 }, green: { lat: 28.909256, lon: -81.995445 } },
    ],

    LaurelValley: [
      { hole: 1, par: 4, hcp: 5, greenDepth: 31, tee: { lat: 28.911606, lon: -81.993312 }, green: { lat: 28.914072, lon: -81.993029 } },
      { hole: 2, par: 5, hcp: 6, greenDepth: 40, tee: { lat: 28.914904, lon: -81.99415 }, green: { lat: 28.918521, lon: -81.993153 } },
      { hole: 3, par: 4, hcp: 1, greenDepth: 42, tee: { lat: 28.919511, lon: -81.993516 }, green: { lat: 28.921602, lon: -81.995307 } },
      { hole: 4, par: 5, hcp: 9, greenDepth: 32, tee: { lat: 28.922168, lon: -81.997036 }, green: { lat: 28.924804, lon: -81.999651 } },
      { hole: 5, par: 4, hcp: 3, greenDepth: 30, tee: { lat: 28.925267, lon: -81.998678 }, green: { lat: 28.923342, lon: -81.996906 } },
      { hole: 6, par: 3, hcp: 8, greenDepth: 34, tee: { lat: 28.922992, lon: -81.996014 }, green: { lat: 28.922272, lon: -81.99551 } },
      { hole: 7, par: 4, hcp: 2, greenDepth: 41, tee: { lat: 28.9204, lon: -81.992783 }, green: { lat: 28.919149, lon: -81.990133 } },
      { hole: 8, par: 3, hcp: 7, greenDepth: 37, tee: { lat: 28.918594, lon: -81.9906 }, green: { lat: 28.918395, lon: -81.991761 } },
      { hole: 9, par: 4, hcp: 4, greenDepth: 41, tee: { lat: 28.917349, lon: -81.99269 }, green: { lat: 28.914723, lon: -81.993205 } },
    ],

    RileyGrove: [
      { hole: 1, par: 4, hcp: 7, greenDepth: 32, tee: { lat: 28.910095, lon: -81.989156 }, green: { lat: 28.91215, lon: -81.987983 } },
      { hole: 2, par: 4, hcp: 2, greenDepth: 30, tee: { lat: 28.91205, lon: -81.985494 }, green: { lat: 28.914707, lon: -81.984697 } },
      { hole: 3, par: 4, hcp: 9, greenDepth: 32, tee: { lat: 28.917976, lon: -81.98363 }, green: { lat: 28.919317, lon: -81.985533 } },
      { hole: 4, par: 5, hcp: 4, greenDepth: 31, tee: { lat: 28.919516, lon: -81.98411 }, green: { lat: 28.919281, lon: -81.979933 } },
      { hole: 5, par: 4, hcp: 1, greenDepth: 34, tee: { lat: 28.918801, lon: -81.978643 }, green: { lat: 28.919187, lon: -81.975673 } },
      { hole: 6, par: 3, hcp: 8, greenDepth: 33, tee: { lat: 28.919244, lon: -81.974937 }, green: { lat: 28.918398, lon: -81.975213 } },
      { hole: 7, par: 4, hcp: 3, greenDepth: 30, tee: { lat: 28.915833, lon: -81.976434 }, green: { lat: 28.913682, lon: -81.97516 } },
      { hole: 8, par: 3, hcp: 6, greenDepth: 28, tee: { lat: 28.912375, lon: -81.977066 }, green: { lat: 28.911657, lon: -81.977902 } },
      { hole: 9, par: 5, hcp: 5, greenDepth: 32, tee: { lat: 28.911511, lon: -81.980021 }, green: { lat: 28.909728, lon: -81.983721 } },
    ],
  },
};

export const COURSE_CATALOG = {
  "Belle Glades": BELLE_GLADES,
  "Orange Blossom": ORANGE_BLOSSOM,
  "Broad Stripes Golf": BROAD_STRIPES,
  "Hacienda Hills": HACIENDA_HILLS,
  "Glenview Champions": GLENVIEW_CHAMPIONS,
  "Tierra Del Sol": TIERRA_DEL_SOL,
  "Lopez Legacy": LOPEZ_LEGACY,
  "Palmer Legends": PALMER_LEGENDS,
};