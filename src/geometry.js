(function (ns) {
  "use strict";

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function bucketKey(x, y) {
    return `${x}:${y}`;
  }

  function sampleTriangleColor(analysis, a, b, c) {
    const divisions = 4;
    const total = [0, 0, 0];
    let count = 0;

    function accumulate(weightB, weightC) {
      const weightA = 1 - weightB - weightC;
      const color = ns.ImageAnalysis.sampleColor(
        analysis,
        a.x * weightA + b.x * weightB + c.x * weightC,
        a.y * weightA + b.y * weightB + c.y * weightC
      );
      for (let channel = 0; channel < 3; channel++) total[channel] += color[channel];
      count++;
    }

    // Sample the centroid of each small triangle in a regular barycentric subdivision.
    for (let row = 0; row < divisions; row++) {
      for (let column = 0; column < divisions - row; column++) {
        accumulate((column + 1 / 3) / divisions, (row + 1 / 3) / divisions);
        if (row + column < divisions - 1) {
          accumulate((column + 2 / 3) / divisions, (row + 2 / 3) / divisions);
        }
      }
    }

    return total.map((channel) => Math.round(channel / count));
  }

  function contourCoverage(path, width, height) {
    let totalLength = 0, formLength = 0, borderLength = 0;
    for (let i = 1; i < path.points.length; i++) {
      const a = path.points[i - 1], b = path.points[i];
      const length = Math.hypot((b.x - a.x) * width, (b.y - a.y) * height);
      const x = (a.x + b.x) / 2, y = (a.y + b.y) / 2;
      totalLength += length;
      if (ns.PrimaryForms.weightAt(x, y)) formLength += length;
      if (x < 0.012 || x > 0.988 || y < 0.012 || y > 0.988) borderLength += length;
    }
    return {
      formShare: totalLength ? formLength / totalLength : 0,
      borderShare: totalLength ? borderLength / totalLength : 1
    };
  }

  function isBorderContour(path, width, height) {
    return contourCoverage(path, width, height).borderShare >= 0.35;
  }

  function isRelevantContour(path, width, height) {
    const coverage = contourCoverage(path, width, height);
    return coverage.formShare >= 0.45 && coverage.borderShare < 0.35;
  }

  function create(analysis, seed, contrast) {
    contrast = clamp(contrast == null ? 1 : contrast, 0, 1);
    const contrastStrength = contrast / 0.60;
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
    const sourceContours = (analysis.contours || []).filter((path) =>
      !isBorderContour(path, analysis.width, analysis.height)
    );
    const contourCandidates = ns.Contours.sampleAnchors(
      sourceContours, contourBudget, analysis.width, analysis.height
    );
    const formAnchors = contourCandidates.filter((point) => ns.PrimaryForms.weightAt(point.x, point.y) > 0);
    const backgroundAnchors = contourCandidates.filter((point) => ns.PrimaryForms.weightAt(point.x, point.y) === 0);
    const backgroundAnchorShare = clamp(1 - contrastStrength * 0.90, 0, 1);
    const backgroundAnchorLimit = Math.floor(contourBudget * backgroundAnchorShare);
    formAnchors.concat(backgroundAnchors.slice(0, backgroundAnchorLimit))
      .forEach((point) => addPoint(point.x, point.y));

    const spacingBase = 1.38 + contrastStrength * 0.24;
    const spacingReduction = 0.95 + contrastStrength * 0.21;
    let attempts = 0;
    const maxAttempts = targetVertices * 90;
    while (points.length < targetVertices && attempts++ < maxAttempts) {
      const x = random(), y = random();
      const detail = ns.ImageAnalysis.sampleField(analysis, "importance", x, y);
      const isPrimaryForm = ns.PrimaryForms.weightAt(x, y) > 0;
      const priority = isPrimaryForm
        ? clamp(detail + contrastStrength * (Math.max(0.94, detail) - detail), 0, 1)
        : detail * Math.max(0, 1 - contrastStrength * 0.84);
      const acceptance = 0.04 + 0.96 * Math.pow(priority, 0.82);
      if (random() > acceptance) continue;
      const spacing = baseSpacing * (spacingBase - priority * spacingReduction);
      if (!hasNearby(x, y, spacing)) addPoint(x, y);
    }

    const indexTriangles = ns.Triangulation.triangulate(points);
    const triangles = indexTriangles.map((indices) => {
      const [a, b, c] = indices.map((index) => points[index]);
      return {
        a,
        b,
        c,
        color: sampleTriangleColor(analysis, a, b, c),
        depth: (a.depth + b.depth + c.depth) / 3
      };
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

    const contours = sourceContours.filter((path) =>
      isRelevantContour(path, analysis.width, analysis.height)
    ).map((path) => {
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
      densityContrast: contrast,
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
