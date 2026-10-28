(function (ns) {
  "use strict";

  function format(value) {
    return Number(value.toFixed(3));
  }

  function hex(rgb) {
    return `#${rgb.map((value) => Math.max(0, Math.min(255, value))
      .toString(16).padStart(2, "0")).join("")}`;
  }

  function create(geometry, image, analysis, seed) {
    const width = 2160, height = 3840;
    const contrast = Math.round((geometry.densityContrast == null ? 1 : geometry.densityContrast) * 100);
    const frame = ns.Renderer.containFrame(width, height, image.naturalWidth, image.naturalHeight);
    const definitions = [];
    const polygons = geometry.triangles.map((triangle, index) => {
      const paint = ns.Renderer.facetGradient(triangle, frame, analysis);
      const id = `facet-${index}`;
      definitions.push(
        `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${format(paint.start.x)}" y1="${format(paint.start.y)}" x2="${format(paint.end.x)}" y2="${format(paint.end.y)}">`
        + `<stop offset="0%" stop-color="${hex(paint.highlight)}"/>`
        + `<stop offset="${format(paint.centerStop * 100)}%" stop-color="${hex(paint.midpoint)}"/>`
        + `<stop offset="100%" stop-color="${hex(paint.shadow)}"/>`
        + `</linearGradient>`
      );
      const points = paint.points.map((point) => `${format(point.x)},${format(point.y)}`).join(" ");
      return `<polygon points="${points}" fill="url(#${id})"/>`;
    }).join("\n");
    const metadata = `data-seed="${seed}" data-density-contrast="${contrast}" data-point-count="${geometry.vertices.length}" data-facet-count="${geometry.triangles.length}"`;
    return `<?xml version="1.0" encoding="UTF-8"?>\n`
      + `<svg xmlns="http://www.w3.org/2000/svg" width="${width}px" height="${height}px" viewBox="0 0 ${width} ${height}" ${metadata}>\n`
      + `<defs>\n${definitions.join("\n")}\n</defs>\n${polygons}\n</svg>`;
  }

  function download(svgText, filename) {
    const blob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  ns.ScreenSvgExport = { create, download };
})(window.VenusArt = window.VenusArt || {});
