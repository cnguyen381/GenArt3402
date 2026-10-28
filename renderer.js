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

    geometry.triangles.forEach((triangle) => drawColorTriangle(ctx, triangle));
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
