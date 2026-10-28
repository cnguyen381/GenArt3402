(function (ns) {
  "use strict";

  // Editable first-pass depth guides in whole-image normalized coordinates.
  // Their boundaries are intentionally coarse and should be reviewed against seeds.
  const foreground = [
    [[0.02, 0.12], [0.19, 0.03], [0.40, 0.06], [0.43, 0.27], [0.37, 0.43], [0.42, 0.60], [0.34, 0.78], [0.17, 0.76], [0.04, 0.62]],
    [[0.43, 0.08], [0.58, 0.07], [0.65, 0.26], [0.62, 0.52], [0.68, 0.82], [0.62, 0.98], [0.47, 0.97], [0.40, 0.76], [0.42, 0.45]],
    [[0.24, 0.68], [0.45, 0.65], [0.66, 0.70], [0.76, 0.91], [0.70, 0.99], [0.30, 0.99], [0.22, 0.88]],
    [[0.68, 0.20], [0.79, 0.16], [0.87, 0.28], [0.94, 0.39], [0.95, 0.62], [0.99, 0.91], [0.88, 0.98], [0.75, 0.91], [0.69, 0.72], [0.65, 0.49]]
  ];
  const middle = [
    [[0.60, 0.00], [0.99, 0.00], [0.99, 0.35], [0.91, 0.43], [0.82, 0.38], [0.73, 0.29], [0.66, 0.23]]
  ];

  function contains(poly, x, y) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i][0], yi = poly[i][1];
      const xj = poly[j][0], yj = poly[j][1];
      const crosses = (yi > y) !== (yj > y)
        && x < (xj - xi) * (y - yi) / ((yj - yi) || 1e-9) + xi;
      if (crosses) inside = !inside;
    }
    return inside;
  }

  function depthAt(x, y) {
    if (foreground.some((poly) => contains(poly, x, y))) return 0.88;
    if (middle.some((poly) => contains(poly, x, y))) return 0.48;
    return 0.12;
  }

  ns.DepthZones = { depthAt };
})(window.VenusArt = window.VenusArt || {});
