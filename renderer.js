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

  function affine(source, target) {
    const x0 = source[0].x, y0 = source[0].y;
    const x1 = source[1].x, y1 = source[1].y;
    const x2 = source[2].x, y2 = source[2].y;
    const X0 = target[0].x, Y0 = target[0].y;
    const X1 = target[1].x, Y1 = target[1].y;
    const X2 = target[2].x, Y2 = target[2].y;
    const denominator = x0 * (y1 - y2) + x1 * (y2 - y0) + x2 * (y0 - y1);
    if (Math.abs(denominator) < 1e-8) return null;
    const a = (X0 * (y1 - y2) + X1 * (y2 - y0) + X2 * (y0 - y1)) / denominator;
    const b = (X0 * (x2 - x1) + X1 * (x0 - x2) + X2 * (x1 - x0)) / denominator;
    const c = (X0 * (x1 * y2 - x2 * y1) + X1 * (x2 * y0 - x0 * y2) + X2 * (x0 * y1 - x1 * y0)) / denominator;
    const d = (Y0 * (y1 - y2) + Y1 * (y2 - y0) + Y2 * (y0 - y1)) / denominator;
    const e = (Y0 * (x2 - x1) + Y1 * (x0 - x2) + Y2 * (x1 - x0)) / denominator;
    const f = (Y0 * (x1 * y2 - x2 * y1) + Y1 * (x2 * y0 - x0 * y2) + Y2 * (x0 * y1 - x1 * y0)) / denominator;
    return { a, b, c, d, e, f };
  }

  function trianglePath(ctx, triangle) {
    ctx.beginPath();
    ctx.moveTo(triangle[0].x, triangle[0].y);
    ctx.lineTo(triangle[1].x, triangle[1].y);
    ctx.lineTo(triangle[2].x, triangle[2].y);
    ctx.closePath();
  }

  function drawMappedTriangle(ctx, image, triangle) {
    const source = [triangle.a, triangle.b, triangle.c].map((v) => ({
      x: v.x * image.naturalWidth,
      y: v.y * image.naturalHeight
    }));
    const target = [triangle.a, triangle.b, triangle.c].map((v) => v.projected);
    const transform = affine(source, target);
    if (!transform) return;
    ctx.save();
    trianglePath(ctx, target);
    ctx.clip();
    ctx.transform(transform.a, transform.d, transform.b, transform.e, transform.c, transform.f);
    ctx.drawImage(image, 0, 0);
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

  function shadeTriangle(ctx, triangle, frame) {
    const target = [triangle.a, triangle.b, triangle.c].map((v) => v.projected);
    const center = {
      x: (target[0].x + target[1].x + target[2].x) / 3,
      y: (target[0].y + target[1].y + target[2].y) / 3
    };
    const normal = normalFor(triangle, frame);
    const directionX = 22 + normal.x * 24;
    const directionY = 28 + normal.y * 24;
    const tilt = Math.min(1, Math.hypot(normal.x, normal.y) * 2.2);
    const darkness = 0.035 + tilt * 0.075;
    const gradient = ctx.createLinearGradient(
      center.x - directionX, center.y - directionY,
      center.x + directionX, center.y + directionY
    );
    gradient.addColorStop(0, "rgba(255,255,255,0.035)");
    gradient.addColorStop(1, `rgba(0,0,0,${darkness.toFixed(3)})`);
    ctx.save();
    trianglePath(ctx, target);
    ctx.clip();
    ctx.fillStyle = gradient;
    trianglePath(ctx, target);
    ctx.fill();
    ctx.restore();
  }

  function render(ctx, canvas, image, geometry) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const frame = containFrame(canvas.width, canvas.height, image.naturalWidth, image.naturalHeight);
    geometry.vertices.forEach((vertex) => { vertex.projected = project(vertex, frame); });

    geometry.triangles.forEach((triangle) => drawMappedTriangle(ctx, image, triangle));
    geometry.triangles.forEach((triangle) => shadeTriangle(ctx, triangle, frame));
    ctx.save();
    ctx.lineWidth = 1.3;
    ctx.lineJoin = "round";
    ctx.globalAlpha = 0.82;
    geometry.edges.forEach((edge) => {
      ctx.beginPath();
      ctx.moveTo(edge.a.projected.x, edge.a.projected.y);
      ctx.lineTo(edge.b.projected.x, edge.b.projected.y);
      ctx.strokeStyle = ns.ImageAnalysis.toCss(edge.color);
      ctx.stroke();
    });
    ctx.restore();

    ctx.save();
    ctx.lineWidth = 1.8;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.globalAlpha = 0.86;
    geometry.contours.forEach((contour) => {
      if (contour.points.length < 2) return;
      ctx.beginPath();
      const first = project(contour.points[0], frame);
      ctx.moveTo(first.x, first.y);
      for (let i = 1; i < contour.points.length; i++) {
        const point = project(contour.points[i], frame);
        ctx.lineTo(point.x, point.y);
      }
      ctx.strokeStyle = ns.ImageAnalysis.toCss(contour.color);
      ctx.stroke();
    });
    ctx.restore();
    return frame;
  }

  ns.Renderer = { containFrame, project, render };
})(window.VenusArt = window.VenusArt || {});
