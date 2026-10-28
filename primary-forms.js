(function (ns) {
  "use strict";

  // Editable normalized guides around the painting's main figure and shell masses.
  // These broad masks steer point density; image contours still supply fine detail.
  const regions = [
    // Left windblown figure group and drapery.
    [
      [0.01, 0.05], [0.12, 0.03], [0.24, 0.05], [0.35, 0.09], [0.41, 0.14],
      [0.43, 0.22], [0.40, 0.29], [0.35, 0.34], [0.39, 0.42], [0.40, 0.52],
      [0.37, 0.62], [0.36, 0.72], [0.31, 0.77], [0.25, 0.72], [0.19, 0.68],
      [0.14, 0.66], [0.09, 0.61], [0.04, 0.62], [0.01, 0.53], [0.00, 0.40]
    ],
    // Venus, including the main flow of her hair.
    [
      [0.49, 0.11], [0.51, 0.08], [0.56, 0.08], [0.60, 0.10], [0.64, 0.14],
      [0.67, 0.19], [0.68, 0.25], [0.66, 0.31], [0.63, 0.37], [0.63, 0.46],
      [0.62, 0.57], [0.60, 0.69], [0.59, 0.82], [0.59, 0.90], [0.57, 0.98],
      [0.52, 0.99], [0.48, 0.96], [0.47, 0.86], [0.46, 0.78], [0.44, 0.70],
      [0.43, 0.58], [0.43, 0.45], [0.43, 0.33], [0.44, 0.22]
    ],
    // The shell beneath Venus.
    [
      [0.25, 0.76], [0.28, 0.71], [0.32, 0.68], [0.39, 0.68], [0.45, 0.70],
      [0.49, 0.68], [0.53, 0.66], [0.59, 0.67], [0.63, 0.72], [0.66, 0.78],
      [0.67, 0.84], [0.66, 0.90], [0.62, 0.94], [0.57, 0.97], [0.50, 0.98],
      [0.42, 0.97], [0.35, 0.95], [0.29, 0.92], [0.24, 0.87], [0.22, 0.82]
    ],
    // The right figure group and the mantle carried toward Venus.
    [
      [0.62, 0.16], [0.67, 0.14], [0.73, 0.16], [0.77, 0.20], [0.81, 0.20],
      [0.84, 0.17], [0.89, 0.16], [0.93, 0.20], [0.96, 0.27], [0.96, 0.37],
      [0.94, 0.44], [0.91, 0.49], [0.94, 0.55], [0.97, 0.61], [0.98, 0.72],
      [0.96, 0.83], [0.95, 0.94], [0.91, 0.98], [0.87, 0.97], [0.84, 0.92],
      [0.80, 0.89], [0.77, 0.84], [0.75, 0.77], [0.72, 0.70], [0.69, 0.65],
      [0.66, 0.57], [0.63, 0.51], [0.60, 0.45], [0.60, 0.35], [0.62, 0.28]
    ]
  ];

  function contains(polygon, x, y) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const [xi, yi] = polygon[i], [xj, yj] = polygon[j];
      const crosses = (yi > y) !== (yj > y)
        && x < (xj - xi) * (y - yi) / ((yj - yi) || 1e-9) + xi;
      if (crosses) inside = !inside;
    }
    return inside;
  }

  function weightAt(x, y) {
    return regions.some((polygon) => contains(polygon, x, y)) ? 1 : 0;
  }

  ns.PrimaryForms = { weightAt };
})(window.VenusArt = window.VenusArt || {});
