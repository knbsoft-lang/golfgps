// src/data/courses.js

const FIXED_TEMPLATE_OVERLAY = {
  A0: { x: 0.5, y: 0.9141 },
  C0: { x: 0.5, y: 0.0859 },
};

export const BROAD_STRIPES = {
  clubName: "Broad Stripes Golf",
  courseType: "Championship",
  nines: {
    Front: [
      { hole: 1, par: 5, hcp: 9, greenDepth: 33, green: { lat: 28.962251, lon: -81.959087 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 2, par: 3, hcp: 15, greenDepth: 31, green: { lat: 28.962945, lon: -81.958402 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 3, par: 4, hcp: 7, greenDepth: 35, green: { lat: 28.962056, lon: -81.954615 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 4, par: 4, hcp: 5, greenDepth: 28, green: { lat: 28.961429, lon: -81.950662 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 5, par: 4, hcp: 13, greenDepth: 33, green: { lat: 28.961722, lon: -81.946705 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 6, par: 3, hcp: 17, greenDepth: 34, green: { lat: 28.963108, lon: -81.947422 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 7, par: 4, hcp: 11, greenDepth: 32, green: { lat: 28.964075, lon: -81.949823 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 8, par: 4, hcp: 3, greenDepth: 27, green: { lat: 28.963828, lon: -81.953700 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 9, par: 5, hcp: 1, greenDepth: 28, green: { lat: 28.963843, lon: -81.953690 }, overlay: FIXED_TEMPLATE_OVERLAY },
    ],
    Back: [
      { hole: 1, par: 5, hcp: 2, greenDepth: 29, green: { lat: 28.967902, lon: -81.955053 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 2, par: 3, hcp: 14, greenDepth: 30, green: { lat: 28.969058, lon: -81.955071 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 3, par: 4, hcp: 16, greenDepth: 29, green: { lat: 28.971455, lon: -81.957745 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 4, par: 4, hcp: 10, greenDepth: 36, green: { lat: 28.971907, lon: -81.955476 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 5, par: 3, hcp: 18, greenDepth: 30, green: { lat: 28.972707, lon: -81.956199 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 6, par: 4, hcp: 4, greenDepth: 30, green: { lat: 28.973558, lon: -81.959536 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 7, par: 5, hcp: 12, greenDepth: 33, green: { lat: 28.970011, lon: -81.958758 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 8, par: 4, hcp: 8, greenDepth: 29, green: { lat: 28.970227, lon: -81.960908 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 9, par: 4, hcp: 6, greenDepth: 27, green: { lat: 28.967369, lon: -81.960175 }, overlay: FIXED_TEMPLATE_OVERLAY },
    ],
  },
};

export const ORANGE_BLOSSOM = {
  clubName: "Orange Blossom",
  courseType: "Championship",
  nines: {
    Front: [
      { hole: 1, par: 5, hcp: 3, greenDepth: 26, green: { lat: 28.955420, lon: -81.948705 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 2, par: 4, hcp: 1, greenDepth: 26, green: { lat: 28.957275, lon: -81.946953 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 3, par: 3, hcp: 13, greenDepth: 37, green: { lat: 28.958957, lon: -81.946013 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 4, par: 4, hcp: 15, greenDepth: 24, green: { lat: 28.957450, lon: -81.948662 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 5, par: 4, hcp: 5, greenDepth: 28, green: { lat: 28.957078, lon: -81.952831 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 6, par: 5, hcp: 7, greenDepth: 33, green: { lat: 28.953423, lon: -81.953196 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 7, par: 4, hcp: 9, greenDepth: 33, green: { lat: 28.954327, lon: -81.949857 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 8, par: 3, hcp: 17, greenDepth: 25, green: { lat: 28.953364, lon: -81.949328 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 9, par: 4, hcp: 11, greenDepth: 39, green: { lat: 28.951679, lon: -81.947745 }, overlay: FIXED_TEMPLATE_OVERLAY },
    ],
    Back: [
      { hole: 1, par: 4, hcp: 10, greenDepth: 30, green: { lat: 28.954954, lon: -81.945611 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 2, par: 4, hcp: 8, greenDepth: 33, green: { lat: 28.956901, lon: -81.943140 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 3, par: 5, hcp: 2, greenDepth: 33, green: { lat: 28.956878, lon: -81.943138 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 4, par: 4, hcp: 14, greenDepth: 30, green: { lat: 28.957788, lon: -81.939069 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 5, par: 3, hcp: 16, greenDepth: 24, green: { lat: 28.955930, lon: -81.936920 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 6, par: 4, hcp: 12, greenDepth: 29, green: { lat: 28.954132, lon: -81.936938 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 7, par: 5, hcp: 4, greenDepth: 35, green: { lat: 28.950695, lon: -81.938138 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 8, par: 3, hcp: 18, greenDepth: 24, green: { lat: 28.949969, lon: -81.942782 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 9, par: 4, hcp: 6, greenDepth: 32, green: { lat: 28.950295, lon: -81.945472 }, overlay: FIXED_TEMPLATE_OVERLAY },
    ],
  },
};

export const HACIENDA_HILLS = {
  clubName: "Hacienda Hills",
  courseType: "Championship",
  nines: {
    Lakes: [
      { hole: 1, par: 5, hcp: 9, greenDepth: 33, green: { lat: 28.941188, lon: -81.959571 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 2, par: 4, hcp: 2, greenDepth: 31, green: { lat: 28.937937, lon: -81.957984 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 3, par: 3, hcp: 7, greenDepth: 31, green: { lat: 28.938419, lon: -81.956299 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 4, par: 4, hcp: 5, greenDepth: 34, green: { lat: 28.940697, lon: -81.954511 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 5, par: 4, hcp: 1, greenDepth: 37, green: { lat: 28.936964, lon: -81.954277 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 6, par: 4, hcp: 3, greenDepth: 32, green: { lat: 28.936610, lon: -81.957667 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 7, par: 4, hcp: 4, greenDepth: 25, green: { lat: 28.936558, lon: -81.961739 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 8, par: 3, hcp: 6, greenDepth: 24, green: { lat: 28.937392, lon: -81.962744 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 9, par: 5, hcp: 8, greenDepth: 26, green: { lat: 28.942720, lon: -81.963155 }, overlay: FIXED_TEMPLATE_OVERLAY },
    ],
    Oaks: [
      { hole: 1, par: 5, hcp: 4, greenDepth: 22, green: { lat: 28.941492, lon: -81.959302 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 2, par: 3, hcp: 6, greenDepth: 25, green: { lat: 28.942292, lon: -81.958882 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 3, par: 4, hcp: 5, greenDepth: 28, green: { lat: 28.941203, lon: -81.955159 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 4, par: 5, hcp: 8, greenDepth: 26, green: { lat: 28.945570, lon: -81.954272 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 5, par: 4, hcp: 9, greenDepth: 35, green: { lat: 28.946290, lon: -81.957462 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 6, par: 4, hcp: 1, greenDepth: 24, green: { lat: 28.942728, lon: -81.957834 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 7, par: 3, hcp: 7, greenDepth: 23, green: { lat: 28.942291, lon: -81.958878 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 8, par: 4, hcp: 3, greenDepth: 23, green: { lat: 28.945506, lon: -81.959191 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 9, par: 4, hcp: 2, greenDepth: 39, green: { lat: 28.943559, lon: -81.962259 }, overlay: FIXED_TEMPLATE_OVERLAY },
    ],
    Palms: [
      { hole: 1, par: 5, hcp: 7, greenDepth: 33, green: { lat: 28.945738, lon: -81.969026 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 2, par: 4, hcp: 8, greenDepth: 47, green: { lat: 28.945489, lon: -81.965321 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 3, par: 3, hcp: 6, greenDepth: 28, green: { lat: 28.947053, lon: -81.963942 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 4, par: 5, hcp: 1, greenDepth: 31, green: { lat: 28.949910, lon: -81.967678 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 5, par: 4, hcp: 3, greenDepth: 30, green: { lat: 28.949419, lon: -81.971362 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 6, par: 4, hcp: 4, greenDepth: 38, green: { lat: 28.950055, lon: -81.968642 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 7, par: 4, hcp: 2, greenDepth: 35, green: { lat: 28.949409, lon: -81.971383 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 8, par: 3, hcp: 9, greenDepth: 35, green: { lat: 28.948497, lon: -81.962798 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 9, par: 4, hcp: 5, greenDepth: 33, green: { lat: 28.945514, lon: -81.964001 }, overlay: FIXED_TEMPLATE_OVERLAY },
    ],
  },
};

export const GLENVIEW_CHAMPIONS = {
  clubName: "Glenview Champions",
  courseType: "Championship",
  nines: {
    FoxRun: [
      { hole: 1, par: 4, hcp: 6, greenDepth: 23, green: { lat: 28.952360, lon: -82.010811 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 2, par: 4, hcp: 3, greenDepth: 22, green: { lat: 28.952372, lon: -82.015719 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 3, par: 5, hcp: 9, greenDepth: 20, green: { lat: 28.947551, lon: -82.015519 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 4, par: 3, hcp: 8, greenDepth: 34, green: { lat: 28.945992, lon: -82.012676 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 5, par: 4, hcp: 1, greenDepth: 24, green: { lat: 28.942810, lon: -82.011444 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 6, par: 3, hcp: 7, greenDepth: 25, green: { lat: 28.942447, lon: -82.010054 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 7, par: 5, hcp: 2, greenDepth: 30, green: { lat: 28.946401, lon: -82.011101 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 8, par: 4, hcp: 4, greenDepth: 33, green: { lat: 28.950214, lon: -82.010825 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 9, par: 4, hcp: 5, greenDepth: 29, green: { lat: 28.949509, lon: -82.007726 }, overlay: FIXED_TEMPLATE_OVERLAY },
    ],
    StirrupCup: [
      { hole: 1, par: 4, hcp: 4, greenDepth: 21, green: { lat: 28.945867, lon: -82.007508 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 2, par: 4, hcp: 9, greenDepth: 22, green: { lat: 28.941523, lon: -82.004315 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 3, par: 5, hcp: 8, greenDepth: 36, green: { lat: 28.937387, lon: -82.005095 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 4, par: 3, hcp: 7, greenDepth: 35, green: { lat: 28.938414, lon: -82.007125 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 5, par: 4, hcp: 5, greenDepth: 26, green: { lat: 28.934558, lon: -82.006611 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 6, par: 4, hcp: 3, greenDepth: 28, green: { lat: 28.936127, lon: -82.003665 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 7, par: 5, hcp: 1, greenDepth: 34, green: { lat: 28.941461, lon: -82.003356 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 8, par: 3, hcp: 6, greenDepth: 36, green: { lat: 28.943833, lon: -82.004394 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 9, par: 4, hcp: 2, greenDepth: 38, green: { lat: 28.948602, lon: -82.006508 }, overlay: FIXED_TEMPLATE_OVERLAY },
    ],
    TalleyHo: [
      { hole: 1, par: 5, hcp: 5, greenDepth: 23, green: { lat: 28.953528, lon: -82.001752 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 2, par: 4, hcp: 4, greenDepth: 30, green: { lat: 28.956690, lon: -82.002366 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 3, par: 4, hcp: 1, greenDepth: 22, green: { lat: 28.955414, lon: -82.006745 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 4, par: 3, hcp: 8, greenDepth: 36, green: { lat: 28.957382, lon: -82.004826 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 5, par: 4, hcp: 6, greenDepth: 31, green: { lat: 28.959834, lon: -82.006262 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 6, par: 4, hcp: 2, greenDepth: 22, green: { lat: 28.959567, lon: -82.010853 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 7, par: 3, hcp: 7, greenDepth: 22, green: { lat: 28.958515, lon: -82.010594 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 8, par: 4, hcp: 9, greenDepth: 21, green: { lat: 28.956706, lon: -82.007550 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 9, par: 5, hcp: 3, greenDepth: 27, green: { lat: 28.951317, lon: -82.006456 }, overlay: FIXED_TEMPLATE_OVERLAY },
    ],
  },
};

export const TIERRA_DEL_SOL = {
  clubName: "Tierra Del Sol",
  courseType: "Championship",
  nines: {
    Front: [
      { hole: 1, par: 4, hcp: 11, greenDepth: 36, green: { lat: 28.932743, lon: -81.974852 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 2, par: 4, hcp: 3, greenDepth: 27, green: { lat: 28.935061, lon: -81.978179 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 3, par: 3, hcp: 15, greenDepth: 39, green: { lat: 28.936995, lon: -81.978374 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 4, par: 4, hcp: 1, greenDepth: 36, green: { lat: 28.940083, lon: -81.976676 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 5, par: 3, hcp: 17, greenDepth: 23, green: { lat: 28.941246, lon: -81.974516 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 6, par: 5, hcp: 7, greenDepth: 26, green: { lat: 28.940871, lon: -81.969551 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 7, par: 4, hcp: 5, greenDepth: 30, green: { lat: 28.941477, lon: -81.965357 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 8, par: 5, hcp: 13, greenDepth: 29, green: { lat: 28.938752, lon: -81.969082 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 9, par: 4, hcp: 9, greenDepth: 21, green: { lat: 28.935969, lon: -81.971236 }, overlay: FIXED_TEMPLATE_OVERLAY },
    ],
    Back: [
      { hole: 1, par: 4, hcp: 6, greenDepth: 26, green: { lat: 28.932201, lon: -81.974223 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 2, par: 3, hcp: 18, greenDepth: 29, green: { lat: 28.931192, lon: -81.974344 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 3, par: 5, hcp: 8, greenDepth: 26, green: { lat: 28.926642, lon: -81.971323 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 4, par: 4, hcp: 2, greenDepth: 27, green: { lat: 28.922970, lon: -81.971861 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 5, par: 4, hcp: 10, greenDepth: 23, green: { lat: 28.920611, lon: -81.971282 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 6, par: 3, hcp: 14, greenDepth: 30, green: { lat: 28.921995, lon: -81.969429 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 7, par: 5, hcp: 12, greenDepth: 26, green: { lat: 28.926564, lon: -81.969044 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 8, par: 3, hcp: 16, greenDepth: 24, green: { lat: 28.928789, lon: -81.969465 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 9, par: 5, hcp: 4, greenDepth: 25, green: { lat: 28.933924, lon: -81.970203 }, overlay: FIXED_TEMPLATE_OVERLAY },
    ],
  },
};

export const LOPEZ_LEGACY = {
  clubName: "Lopez Legacy",
  courseType: "Championship",
  nines: {
    AshleyMeadows: [
      { hole: 1, par: 4, hcp: 8, greenDepth: 33, green: { lat: 28.976006, lon: -82.012804 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 2, par: 4, hcp: 4, greenDepth: 25, green: { lat: 28.974984, lon: -82.009969 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 3, par: 5, hcp: 1, greenDepth: 34, green: { lat: 28.975687, lon: -82.004042 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 4, par: 3, hcp: 9, greenDepth: 31, green: { lat: 28.977486, lon: -82.003274 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 5, par: 4, hcp: 7, greenDepth: 31, green: { lat: 28.978640, lon: -82.006924 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 6, par: 4, hcp: 2, greenDepth: 36, green: { lat: 28.978790, lon: -82.011299 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 7, par: 4, hcp: 5, greenDepth: 26, green: { lat: 28.979872, lon: -82.015233 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 8, par: 3, hcp: 6, greenDepth: 25, green: { lat: 28.977922, lon: -82.016967 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 9, par: 5, hcp: 3, greenDepth: 26, green: { lat: 28.973516, lon: -82.014312 }, overlay: FIXED_TEMPLATE_OVERLAY },
    ],
    ErinnGlenn: [
      { hole: 1, par: 4, hcp: 5, greenDepth: 28, green: { lat: 28.967729, lon: -82.011679 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 2, par: 3, hcp: 8, greenDepth: 36, green: { lat: 28.973523, lon: -82.010141 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 3, par: 4, hcp: 6, greenDepth: 39, green: { lat: 28.968465, lon: -82.011054 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 4, par: 5, hcp: 1, greenDepth: 34, green: { lat: 28.968436, lon: -82.005251 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 5, par: 4, hcp: 3, greenDepth: 40, green: { lat: 28.965895, lon: -82.002829 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 6, par: 3, hcp: 7, greenDepth: 32, green: { lat: 28.965743, lon: -82.001594 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 7, par: 4, hcp: 2, greenDepth: 23, green: { lat: 28.968377, lon: -82.004509 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 8, par: 5, hcp: 9, greenDepth: 37, green: { lat: 28.969487, lon: -82.010126 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 9, par: 4, hcp: 4, greenDepth: 34, green: { lat: 28.971374, lon: -82.012047 }, overlay: FIXED_TEMPLATE_OVERLAY },
    ],
    TorriPines: [
      { hole: 1, par: 5, hcp: 2, greenDepth: 32, green: { lat: 28.971216, lon: -82.020268 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 2, par: 3, hcp: 8, greenDepth: 42, green: { lat: 28.973098, lon: -82.021407 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 3, par: 4, hcp: 7, greenDepth: 36, green: { lat: 28.976562, lon: -82.022407 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 4, par: 4, hcp: 6, greenDepth: 38, green: { lat: 28.981391, lon: -82.021426 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 5, par: 4, hcp: 1, greenDepth: 37, green: { lat: 28.980407, lon: -82.017827 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 6, par: 4, hcp: 4, greenDepth: 40, green: { lat: 28.978643, lon: -82.019711 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 7, par: 4, hcp: 3, greenDepth: 35, green: { lat: 28.975021, lon: -82.020900 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 8, par: 3, hcp: 9, greenDepth: 25, green: { lat: 28.972323, lon: -82.020280 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 9, par: 5, hcp: 5, greenDepth: 33, green: { lat: 28.972286, lon: -82.015628 }, overlay: FIXED_TEMPLATE_OVERLAY },
    ],
  },
};

export const PALMER_LEGENDS = {
  clubName: "Palmer Legends",
  courseType: "Championship",
  nines: {
    CherryHill: [
      { hole: 1, par: 5, hcp: 4, greenDepth: 36, green: { lat: 28.913748, lon: -81.997255 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 2, par: 4, hcp: 2, greenDepth: 37, green: { lat: 28.912966, lon: -82.002902 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 3, par: 4, hcp: 5, greenDepth: 36, green: { lat: 28.916072, lon: -82.003442 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 4, par: 4, hcp: 1, greenDepth: 33, green: { lat: 28.919497, lon: -82.008306 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 5, par: 3, hcp: 7, greenDepth: 31, green: { lat: 28.918725, lon: -82.010001 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 6, par: 4, hcp: 6, greenDepth: 41, green: { lat: 28.918760, lon: -82.004858 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 7, par: 4, hcp: 9, greenDepth: 33, green: { lat: 28.919505, lon: -82.008304 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 8, par: 3, hcp: 3, greenDepth: 42, green: { lat: 28.915717, lon: -82.000424 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 9, par: 5, hcp: 8, greenDepth: 38, green: { lat: 28.909254, lon: -81.995453 }, overlay: FIXED_TEMPLATE_OVERLAY },
    ],
    LaurelValley: [
      { hole: 1, par: 4, hcp: 5, greenDepth: 31, green: { lat: 28.914065, lon: -81.993016 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 2, par: 5, hcp: 6, greenDepth: 40, green: { lat: 28.918497, lon: -81.993137 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 3, par: 4, hcp: 1, greenDepth: 42, green: { lat: 28.922252, lon: -81.995511 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 4, par: 5, hcp: 9, greenDepth: 32, green: { lat: 28.924806, lon: -81.999623 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 5, par: 4, hcp: 3, greenDepth: 30, green: { lat: 28.923329, lon: -81.996884 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 6, par: 3, hcp: 8, greenDepth: 34, green: { lat: 28.922269, lon: -81.995517 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 7, par: 4, hcp: 2, greenDepth: 41, green: { lat: 28.919145, lon: -81.990172 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 8, par: 3, hcp: 7, greenDepth: 37, green: { lat: 28.918380, lon: -81.991752 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 9, par: 4, hcp: 4, greenDepth: 41, green: { lat: 28.914734, lon: -81.993207 }, overlay: FIXED_TEMPLATE_OVERLAY },
    ],
    RileyGrove: [
      { hole: 1, par: 4, hcp: 7, greenDepth: 32, green: { lat: 28.912124, lon: -81.987979 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 2, par: 4, hcp: 2, greenDepth: 30, green: { lat: 28.914686, lon: -81.984718 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 3, par: 4, hcp: 9, greenDepth: 32, green: { lat: 28.919280, lon: -81.985519 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 4, par: 5, hcp: 4, greenDepth: 31, green: { lat: 28.919259, lon: -81.979963 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 5, par: 4, hcp: 1, greenDepth: 34, green: { lat: 28.919170, lon: -81.975685 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 6, par: 3, hcp: 8, greenDepth: 33, green: { lat: 28.918384, lon: -81.975195 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 7, par: 4, hcp: 3, greenDepth: 30, green: { lat: 28.913664, lon: -81.975153 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 8, par: 3, hcp: 6, greenDepth: 28, green: { lat: 28.911645, lon: -81.977893 }, overlay: FIXED_TEMPLATE_OVERLAY },
      { hole: 9, par: 5, hcp: 5, greenDepth: 32, green: { lat: 28.909709, lon: -81.983736 }, overlay: FIXED_TEMPLATE_OVERLAY },
    ],
  },
};

export const COURSE_CATALOG = {
  "Broad Stripes Golf": BROAD_STRIPES,
  "Orange Blossom": ORANGE_BLOSSOM,
  "Hacienda Hills": HACIENDA_HILLS,
  "Glenview Champions": GLENVIEW_CHAMPIONS,
  "Tierra Del Sol": TIERRA_DEL_SOL,
  "Lopez Legacy": LOPEZ_LEGACY,
  "Palmer Legends": PALMER_LEGENDS,
};