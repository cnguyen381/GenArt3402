(function (ns) {
  "use strict";

  function cross(a, b, c) {
    return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  }

  function inCircumcircle(triangle, point, points) {
    const a = points[triangle[0]], b = points[triangle[1]], c = points[triangle[2]];
    const ax = a.x - point.x, ay = a.y - point.y;
    const bx = b.x - point.x, by = b.y - point.y;
    const cx = c.x - point.x, cy = c.y - point.y;
    const determinant = (ax * ax + ay * ay) * (bx * cy - cx * by)
      - (bx * bx + by * by) * (ax * cy - cx * ay)
      + (cx * cx + cy * cy) * (ax * by - bx * ay);
    return cross(a, b, c) > 0 ? determinant > 1e-12 : determinant < -1e-12;
  }

  function edgeKey(a, b) {
    return a < b ? `${a}:${b}` : `${b}:${a}`;
  }

  function triangulate(input) {
    if (input.length < 3) return [];
    const points = input.slice();
    const firstSuper = points.length;
    points.push({ x: -8, y: -4 }, { x: 9, y: -4 }, { x: 0.5, y: 10 });
    let triangles = [[firstSuper, firstSuper + 1, firstSuper + 2]];

    for (let pointIndex = 0; pointIndex < input.length; pointIndex++) {
      const point = points[pointIndex];
      const bad = [];
      for (let i = 0; i < triangles.length; i++) {
        if (inCircumcircle(triangles[i], point, points)) bad.push(i);
      }

      const boundary = new Map();
      bad.forEach((index) => {
        const tri = triangles[index];
        [[tri[0], tri[1]], [tri[1], tri[2]], [tri[2], tri[0]]].forEach(([a, b]) => {
          const key = edgeKey(a, b);
          const edge = boundary.get(key) || { a, b, count: 0 };
          edge.count++;
          boundary.set(key, edge);
        });
      });
      const badSet = new Set(bad);
      triangles = triangles.filter((_, index) => !badSet.has(index));
      boundary.forEach((edge) => {
        if (edge.count === 1 && Math.abs(cross(points[edge.a], points[edge.b], point)) > 1e-10) {
          const indices = cross(points[edge.a], points[edge.b], point) > 0
            ? [edge.a, edge.b, pointIndex]
            : [edge.b, edge.a, pointIndex];
          triangles.push(indices);
        }
      });
    }

    return triangles.filter((triangle) => triangle.every((index) => index < input.length));
  }

  ns.Triangulation = { triangulate };
})(window.VenusArt = window.VenusArt || {});
