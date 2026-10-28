(function (ns) {
  "use strict";

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function bucketKey(x, y) {
    return `${x}:${y}`;
  }

  function create(analysis, seed) {
    const random = ns.RNG.create(seed);
    const aspect = analysis.width / analysis.height;
    const targetVertices = 280 + Math.floor(random() * 201);
    const baseSpacing = Math.sqrt(aspect / targetVertices);
    const cellSize = baseSpacing * 0.45;
    const points = [];
    const seen = new Set();
    const buckets = new Map();

    function addPoint(x, y) {
      x = clamp(x, 0, 1);
      y = clamp(y, 0, 1);
      const key = `${Math.round(x * 10000)}:${Math.round(y * 10000)}`;
      if (seen.has(key) || points.length >= targetVertices) return false;
      seen.add(key);
      const primaryForm = ns.PrimaryForms.weightAt(x, y) > 0;
      const point = {
        x,
        y,
        depth: ns.DepthZones.depthAt(x, y),
        importance: ns.ImageAnalysis.sampleField(analysis, "importance", x, y),
        primaryForm
      };
      points.push(point);
      const gx = Math.floor(x * aspect / cellSize);
      const gy = Math.floor(y / cellSize);
      const gridKey = bucketKey(gx, gy);
      if (!buckets.has(gridKey)) buckets.set(gridKey, []);
      buckets.get(gridKey).push(point);
      return true;
    }

    function hasNearby(x, y, minimum) {
      const gx = Math.floor(x * aspect / cellSize);
      const gy = Math.floor(y / cellSize);
      const radius = Math.ceil(minimum / cellSize);
      for (let oy = -radius; oy <= radius; oy++) {
        for (let ox = -radius; ox <= radius; ox++) {
          const nearby = buckets.get(bucketKey(gx + ox, gy + oy));
          if (!nearby) continue;
          for (const point of nearby) {
            const dx = (point.x - x) * aspect;
            const dy = point.y - y;
            if (dx * dx + dy * dy < minimum * minimum) return true;
          }
        }
      }
      return false;
    }

    // A sparse scaffold keeps quiet areas connected without imposing a full grid.
    const baseColumns = 8, baseRows = 5;
    for (let row = 0; row <= baseRows; row++) {
      for (let column = 0; column <= baseColumns; column++) {
        let x = column / baseColumns, y = row / baseRows;
        if (column > 0 && column < baseColumns) x += (random() - 0.5) * 0.035;
        if (row > 0 && row < baseRows) y += (random() - 0.5) * 0.035;
        addPoint(x, y);
      }
    }

    const contourBudget = Math.floor(targetVertices * 0.38);
    const contourCandidates = ns.Contours.sampleAnchors(
      analysis.contours || [], contourBudget, analysis.width, analysis.height
    );
    const formAnchors = contourCandidates.filter((point) => ns.PrimaryForms.weightAt(point.x, point.y) > 0);
    const backgroundAnchors = contourCandidates.filter((point) => ns.PrimaryForms.weightAt(point.x, point.y) === 0);
    const backgroundAnchorLimit = Math.floor(contourBudget * 0.10);
    formAnchors.concat(backgroundAnchors.slice(0, backgroundAnchorLimit))
      .forEach((point) => addPoint(point.x, point.y));

    const formPriorityFloor = 0.94;
    const backgroundDetailWeight = 0.16;
    let attempts = 0;
    const maxAttempts = targetVertices * 90;
    while (points.length < targetVertices && attempts++ < maxAttempts) {
      const x = random(), y = random();
      const detail = ns.ImageAnalysis.sampleField(analysis, "importance", x, y);
      const isPrimaryForm = ns.PrimaryForms.weightAt(x, y) > 0;
      const priority = isPrimaryForm
        ? Math.max(formPriorityFloor, detail)
        : detail * backgroundDetailWeight;
      const acceptance = 0.04 + 0.96 * Math.pow(priority, 0.82);
      if (random() > acceptance) continue;
      const spacing = baseSpacing * (1.62 - priority * 1.16);
      if (!hasNearby(x, y, spacing)) addPoint(x, y);
    }

    const indexTriangles = ns.Triangulation.triangulate(points);
    const triangles = indexTriangles.map((indices) => {
      const [a, b, c] = indices.map((index) => points[index]);
      return { a, b, c, depth: (a.depth + b.depth + c.depth) / 3 };
    }).sort((a, b) => a.depth - b.depth);

    const edgeMap = new Map();
    indexTriangles.forEach(([a, b, c]) => {
      [[a, b], [b, c], [c, a]].forEach(([i, j]) => {
        const key = i < j ? `${i}:${j}` : `${j}:${i}`;
        if (edgeMap.has(key)) return;
        const va = points[i], vb = points[j];
        const color = ns.ImageAnalysis.sampleColor(analysis, (va.x + vb.x) / 2, (va.y + vb.y) / 2);
        edgeMap.set(key, { a: va, b: vb, color });
      });
    });

    const contours = (analysis.contours || []).map((path) => {
      const points = path.points.map((point) => ({
        x: point.x,
        y: point.y,
        depth: ns.DepthZones.depthAt(point.x, point.y)
      }));
      const middle = points[Math.floor(points.length / 2)];
      return {
        points,
        color: ns.ImageAnalysis.sampleColor(analysis, middle.x, middle.y),
        strength: path.strength,
        score: path.score
      };
    });

    return {
      seed: seed >>> 0,
      targetVertices,
      vertices: points,
      primaryFormVertexCount: points.reduce((count, point) => count + Number(point.primaryForm), 0),
      triangles,
      edges: Array.from(edgeMap.values()),
      contours
    };
  }

  ns.Geometry = { create };
})(window.VenusArt = window.VenusArt || {});
