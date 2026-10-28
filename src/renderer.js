(function (ns) {
  "use strict";

  function containFrame(width, height, imageWidth, imageHeight) {
    // Reserve a small border so the depth projection cannot clip the source's edges.
    const scale = Math.min(width / imageWidth, height / imageHeight) * 0.95;
    const frameWidth = imageWidth * scale;
    const frameHeight = imageHeight * scale;
    return {
      x: (width - frameWidth) / 2,
      y: (height - frameHeight) / 2,
      width: frameWidth,
      height: frameHeight
    };
  }

  function project(vertex, frame) {
    const lift = vertex.depth;
    return {
      x: frame.x + vertex.x * frame.width + lift * frame.width * 0.018,
      y: frame.y + vertex.y * frame.height + lift * frame.height * 0.025
    };
  }

  function trianglePath(ctx, triangle) {
    ctx.beginPath();
    ctx.moveTo(triangle[0].x, triangle[0].y);
    ctx.lineTo(triangle[1].x, triangle[1].y);
    ctx.lineTo(triangle[2].x, triangle[2].y);
    ctx.closePath();
  }

  function rgbToHsv(rgb) {
    const [r, g, b] = rgb.map((channel) => channel / 255);
    const max = Math.max(r, g, b), min = Math.min(r, g, b), delta = max - min;
    let hue = 0;
    if (delta) {
      if (max === r) hue = 60 * (((g - b) / delta) % 6);
      else if (max === g) hue = 60 * ((b - r) / delta + 2);
      else hue = 60 * ((r - g) / delta + 4);
    }
    if (hue < 0) hue += 360;
    return [hue, max ? delta / max : 0, max];
  }

  function hsvToRgb(hue, saturation, value) {
    const chroma = value * saturation;
    const segment = hue / 60;
    const x = chroma * (1 - Math.abs(segment % 2 - 1));
    let rgb;
    if (segment < 1) rgb = [chroma, x, 0];
    else if (segment < 2) rgb = [x, chroma, 0];
    else if (segment < 3) rgb = [0, chroma, x];
    else if (segment < 4) rgb = [0, x, chroma];
    else if (segment < 5) rgb = [x, 0, chroma];
    else rgb = [chroma, 0, x];
    const match = value - chroma;
    return rgb.map((channel) => Math.round((channel + match) * 255));
  }

  function colorAtValue(rgb, value, saturationOverride) {
    const [hue, sampledSaturation] = rgbToHsv(rgb);
    const saturation = saturationOverride == null ? sampledSaturation : saturationOverride;
    return hsvToRgb(hue, saturation, Math.max(0, Math.min(1, value)));
  }

  function drawColorTriangle(ctx, triangle) {
    const target = [triangle.a, triangle.b, triangle.c].map((v) => v.projected);
    ctx.save();
    trianglePath(ctx, target);
    ctx.clip();
    ctx.fillStyle = ns.ImageAnalysis.toCss(triangle.color);
    ctx.fill();
    ctx.restore();
  }

  function normalFor(triangle, frame) {
    const a = triangle.a, b = triangle.b, c = triangle.c;
    const ax = (b.x - a.x) * frame.width;
    const ay = (b.y - a.y) * frame.height;
    const az = (b.depth - a.depth) * frame.height * 0.08;
    const bx = (c.x - a.x) * frame.width;
    const by = (c.y - a.y) * frame.height;
    const bz = (c.depth - a.depth) * frame.height * 0.08;
    let nx = ay * bz - az * by;
    let ny = az * bx - ax * bz;
    let nz = ax * by - ay * bx;
    const length = Math.hypot(nx, ny, nz) || 1;
    nx /= length; ny /= length; nz /= length;
    return { x: nx, y: ny, z: nz };
  }

  function shadeTriangle(ctx, triangle, frame, analysis) {
    const target = [triangle.a, triangle.b, triangle.c].map((v) => v.projected);
    const center = {
      x: (target[0].x + target[1].x + target[2].x) / 3,
      y: (target[0].y + target[1].y + target[2].y) / 3
    };
    const normal = normalFor(triangle, frame);
    const tilt = Math.min(1, Math.hypot(normal.x, normal.y) * 3.6);
    const [hue, saturation, value] = rgbToHsv(triangle.color);
    const highlightValue = value + (1 - value) * (0.25 + tilt * 0.20);
    const shadowValue = value * (1 - (0.15 + tilt * 0.15));
    const shadowSaturation = Math.min(1, saturation * (1.20 + tilt * 0.15));
    const sourceSamples = [triangle.a, triangle.b, triangle.c, {
      x: (triangle.a.x + triangle.b.x + triangle.c.x) / 3,
      y: (triangle.a.y + triangle.b.y + triangle.c.y) / 3
    }];
    let directionX = 0, directionY = 0;
    sourceSamples.forEach((point) => {
      directionX += ns.ImageAnalysis.sampleField(analysis, "lightingX", point.x, point.y);
      directionY += ns.ImageAnalysis.sampleField(analysis, "lightingY", point.x, point.y);
    });
    let directionLength = Math.hypot(directionX, directionY);
    if (directionLength < 0.05) {
      // Use an upper-left highlight only where the source has no clear local brightness direction.
      directionX = -0.78;
      directionY = -0.92;
      directionLength = Math.hypot(directionX, directionY);
    }
    directionX /= directionLength;
    directionY /= directionLength;
    const projections = target.map((point) =>
      (point.x - center.x) * directionX + (point.y - center.y) * directionY
    );
    const minimum = Math.min(...projections), maximum = Math.max(...projections);
    const centerStop = maximum === minimum ? 0.5 : maximum / (maximum - minimum);
    const gradient = ctx.createLinearGradient(
      center.x + directionX * maximum, center.y + directionY * maximum,
      center.x + directionX * minimum, center.y + directionY * minimum
    );
    gradient.addColorStop(0, ns.ImageAnalysis.toCss(hsvToRgb(hue, saturation, highlightValue)));
    gradient.addColorStop(centerStop, ns.ImageAnalysis.toCss(triangle.color));
    gradient.addColorStop(1, ns.ImageAnalysis.toCss(
      colorAtValue(triangle.color, shadowValue, shadowSaturation)
    ));
    ctx.save();
    trianglePath(ctx, target);
    ctx.clip();
    ctx.fillStyle = gradient;
    trianglePath(ctx, target);
    ctx.fill();
    ctx.restore();
  }

  function render(ctx, canvas, image, geometry, analysis) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const frame = containFrame(canvas.width, canvas.height, image.naturalWidth, image.naturalHeight);
    geometry.vertices.forEach((vertex) => { vertex.projected = project(vertex, frame); });

    geometry.triangles.forEach((triangle) => drawColorTriangle(ctx, triangle));
    geometry.triangles.forEach((triangle) => shadeTriangle(ctx, triangle, frame, analysis));
    return frame;
  }

  ns.Renderer = { containFrame, project, render };
})(window.VenusArt = window.VenusArt || {});
