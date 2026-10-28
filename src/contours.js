(function (ns) {
  "use strict";

  function edgeKey(a, b) {
    return a < b ? `${a}:${b}` : `${b}:${a}`;
  }

  function neighbors(index, mask, width, height) {
    const x = index % width, y = Math.floor(index / width), result = [];
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        const px = x + dx, py = y + dy;
        if (px >= 0 && px < width && py >= 0 && py < height) {
          const next = py * width + px;
          if (mask[next]) result.push(next);
        }
      }
    }
    return result;
  }

  function hysteresis(data, low, high) {
    const { width, height, thin } = data;
    const mask = new Uint8Array(thin.length);
    const queue = new Int32Array(thin.length);
    let head = 0, tail = 0;
    for (let i = 0; i < thin.length; i++) {
      if (thin[i] >= high) {
        mask[i] = 2;
        queue[tail++] = i;
      } else if (thin[i] >= low) mask[i] = 1;
    }
    while (head < tail) {
      const index = queue[head++];
      neighbors(index, mask, width, height).forEach((next) => {
        if (mask[next] === 1) {
          mask[next] = 2;
          queue[tail++] = next;
        }
      });
    }
    for (let i = 0; i < mask.length; i++) mask[i] = mask[i] === 2 ? 1 : 0;
    return mask;
  }

  function trace(start, next, mask, visited, width, height) {
    const path = [start];
    let previous = start, current = next, guard = 0;
    while (guard++ < width * height) {
      const key = edgeKey(previous, current);
      if (visited.has(key)) break;
      visited.add(key);
      path.push(current);
      const adjacent = neighbors(current, mask, width, height);
      if (adjacent.length !== 2) break;
      const candidate = adjacent.find((index) => index !== previous && !visited.has(edgeKey(current, index)));
      if (candidate == null) break;
      previous = current;
      current = candidate;
      if (current === start) {
        visited.add(edgeKey(previous, current));
        path.push(current);
        break;
      }
    }
    return path;
  }

  function simplify(points, tolerance) {
    if (points.length <= 2) return points;
    const keep = new Uint8Array(points.length);
    keep[0] = 1; keep[points.length - 1] = 1;
    const stack = [[0, points.length - 1]];
    while (stack.length) {
      const [start, end] = stack.pop();
      const a = points[start], b = points[end];
      const dx = b.x - a.x, dy = b.y - a.y;
      const denominator = Math.hypot(dx, dy) || 1;
      let farthest = -1, maxDistance = tolerance;
      for (let i = start + 1; i < end; i++) {
        const p = points[i];
        const distance = Math.abs(dy * p.x - dx * p.y + b.x * a.y - b.y * a.x) / denominator;
        if (distance > maxDistance) { maxDistance = distance; farthest = i; }
      }
      if (farthest >= 0) {
        keep[farthest] = 1;
        stack.push([start, farthest], [farthest, end]);
      }
    }
    return points.filter((_, index) => keep[index]);
  }

  function pixelPoint(index, width) {
    return { x: index % width, y: Math.floor(index / width) };
  }

  function pathLength(points) {
    let total = 0;
    for (let i = 1; i < points.length; i++) total += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
    return total;
  }

  function tracePaths(data) {
    const { width, height, thin } = data;
    const mask = hysteresis(data, 0.075, 0.19);
    const visited = new Set(), paths = [];
    for (let i = 0; i < mask.length; i++) {
      if (!mask[i]) continue;
      const adjacent = neighbors(i, mask, width, height);
      if (adjacent.length === 2) continue;
      adjacent.forEach((next) => {
        if (!visited.has(edgeKey(i, next))) paths.push(trace(i, next, mask, visited, width, height));
      });
    }
    for (let i = 0; i < mask.length; i++) {
      if (!mask[i]) continue;
      neighbors(i, mask, width, height).forEach((next) => {
        if (!visited.has(edgeKey(i, next))) paths.push(trace(i, next, mask, visited, width, height));
      });
    }

    return paths.map((indices) => {
      const raw = indices.map((index) => pixelPoint(index, width));
      const length = pathLength(raw);
      const strength = indices.reduce((sum, index) => sum + thin[index], 0) / Math.max(1, indices.length);
      const points = simplify(raw, 1.6).map((point) => ({
        x: point.x / (width - 1),
        y: point.y / (height - 1)
      }));
      return { points, length, strength, score: length * (0.6 + strength) };
    }).filter((path) => path.length >= 22 && path.points.length >= 2)
      .sort((a, b) => b.score - a.score)
      .slice(0, 110);
  }

  function pointAlong(points, target, width, height) {
    let walked = 0;
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1], b = points[i];
      const dx = (b.x - a.x) * width, dy = (b.y - a.y) * height;
      const segment = Math.hypot(dx, dy);
      if (walked + segment >= target) {
        const t = segment ? (target - walked) / segment : 0;
        return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
      }
      walked += segment;
    }
    return points[points.length - 1];
  }

  function sampleAnchors(paths, limit, width, height) {
    if (!paths.length || limit <= 0) return [];
    const totalLength = paths.reduce((sum, path) => sum + path.length, 0);
    const spacing = Math.max(7, totalLength / limit);
    const anchors = [];
    for (const path of paths) {
      for (let distance = spacing * 0.45; distance < path.length && anchors.length < limit; distance += spacing) {
        anchors.push(pointAlong(path.points, distance, width, height));
      }
      if (anchors.length >= limit) break;
    }
    return anchors;
  }

  ns.Contours = { tracePaths, sampleAnchors };
})(window.VenusArt = window.VenusArt || {});
