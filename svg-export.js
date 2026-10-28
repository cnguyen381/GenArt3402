(function (ns) {
  "use strict";

  function format(value) {
    return Number(value.toFixed(2));
  }

  function hex(rgb) {
    return `#${rgb.map((value) => Math.max(0, Math.min(255, value)).toString(16).padStart(2, "0")).join("")}`;
  }

  function create(geometry, image, seed) {
    const width = 297, height = 420;
    const frame = ns.Renderer.containFrame(width, height, image.naturalWidth, image.naturalHeight);
    const meshPaths = geometry.edges.map((edge) => {
      const a = ns.Renderer.project(edge.a, frame);
      const b = ns.Renderer.project(edge.b, frame);
      return `<path d="M ${format(a.x)} ${format(a.y)} L ${format(b.x)} ${format(b.y)}" stroke="${hex(edge.color)}" stroke-width="0.18" stroke-linecap="round" fill="none"/>`;
    }).join("\n");
    const contourPaths = geometry.contours.map((contour) => {
      const points = contour.points.map((point) => ns.Renderer.project(point, frame));
      const commands = points.map((point, index) => `${index ? "L" : "M"} ${format(point.x)} ${format(point.y)}`).join(" ");
      return `<path d="${commands}" stroke="${hex(contour.color)}" stroke-width="0.22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
    }).join("\n");
    const paths = `${meshPaths}\n${contourPaths}`;
    return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="297mm" height="420mm" viewBox="0 0 297 420" data-seed="${seed}">\n${paths}\n</svg>`;
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

  ns.SvgExport = { create, download };
})(window.VenusArt = window.VenusArt || {});
