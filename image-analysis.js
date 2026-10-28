(function (ns) {
  "use strict";

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function buildIntegral(values, width, height) {
    const stride = width + 1;
    const table = new Float64Array(stride * (height + 1));
    for (let y = 0; y < height; y++) {
      let rowSum = 0;
      for (let x = 0; x < width; x++) {
        rowSum += values[y * width + x];
        table[(y + 1) * stride + x + 1] = table[y * stride + x + 1] + rowSum;
      }
    }
    return table;
  }

  function boxMean(table, width, height, x, y, radius) {
    const stride = width + 1;
    const left = Math.max(0, x - radius), top = Math.max(0, y - radius);
    const right = Math.min(width - 1, x + radius), bottom = Math.min(height - 1, y + radius);
    const sum = table[(bottom + 1) * stride + right + 1]
      - table[top * stride + right + 1]
      - table[(bottom + 1) * stride + left]
      + table[top * stride + left];
    return sum / ((right - left + 1) * (bottom - top + 1));
  }

  function analyze(image, maxWidth) {
    const width = Math.min(maxWidth || 720, image.naturalWidth);
    const height = Math.max(1, Math.round(width * image.naturalHeight / image.naturalWidth));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(image, 0, 0, width, height);
    const pixels = ctx.getImageData(0, 0, width, height).data;
    const size = width * height;
    const gray = new Float32Array(size);
    const edge = new Float32Array(size);
    const thin = new Float32Array(size);
    const gxMap = new Float32Array(size);
    const gyMap = new Float32Array(size);

    for (let i = 0; i < size; i++) {
      const p = i * 4;
      gray[i] = pixels[p] * 0.2126 + pixels[p + 1] * 0.7152 + pixels[p + 2] * 0.0722;
    }

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const i = y * width + x;
        const gx = -gray[i - width - 1] + gray[i - width + 1]
          - 2 * gray[i - 1] + 2 * gray[i + 1]
          - gray[i + width - 1] + gray[i + width + 1];
        const gy = -gray[i - width - 1] - 2 * gray[i - width] - gray[i - width + 1]
          + gray[i + width - 1] + 2 * gray[i + width] + gray[i + width + 1];
        gxMap[i] = gx;
        gyMap[i] = gy;
        edge[i] = Math.min(1, Math.hypot(gx, gy) / 1020);
      }
    }

    // Thin the Sobel response along its local gradient before tracing contours.
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const i = y * width + x;
        const gx = gxMap[i], gy = gyMap[i];
        let before, after;
        if (Math.abs(gy) <= Math.abs(gx) * 0.414) {
          before = edge[i - 1]; after = edge[i + 1];
        } else if (Math.abs(gx) <= Math.abs(gy) * 0.414) {
          before = edge[i - width]; after = edge[i + width];
        } else if (gx * gy >= 0) {
          before = edge[i - width - 1]; after = edge[i + width + 1];
        } else {
          before = edge[i - width + 1]; after = edge[i + width - 1];
        }
        if (edge[i] >= before && edge[i] >= after) thin[i] = edge[i];
      }
    }

    const grayIntegral = buildIntegral(gray, width, height);
    const graySquared = new Float32Array(size);
    for (let i = 0; i < size; i++) graySquared[i] = gray[i] * gray[i];
    const squareIntegral = buildIntegral(graySquared, width, height);
    const edgeIntegral = buildIntegral(thin, width, height);
    const importance = new Float32Array(size);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = y * width + x;
        const mean = boxMean(grayIntegral, width, height, x, y, 4);
        const meanSquare = boxMean(squareIntegral, width, height, x, y, 4);
        const contrast = clamp(Math.sqrt(Math.max(0, meanSquare - mean * mean)) / 75, 0, 1);
        const edgeDensity = clamp(boxMean(edgeIntegral, width, height, x, y, 4) * 8, 0, 1);
        importance[i] = contrast * 0.42 + edgeDensity * 0.58;
      }
    }

    return { width, height, pixels, gray, edge, thin, importance };
  }

  function sampleColor(data, u, v) {
    const x = clamp(u * (data.width - 1), 0, data.width - 1);
    const y = clamp(v * (data.height - 1), 0, data.height - 1);
    const x0 = Math.floor(x), y0 = Math.floor(y);
    const x1 = Math.min(data.width - 1, x0 + 1), y1 = Math.min(data.height - 1, y0 + 1);
    const fx = x - x0, fy = y - y0;
    const channel = (c) => {
      const at = (px, py) => data.pixels[(py * data.width + px) * 4 + c];
      const top = at(x0, y0) * (1 - fx) + at(x1, y0) * fx;
      const bottom = at(x0, y1) * (1 - fx) + at(x1, y1) * fx;
      return Math.round(top * (1 - fy) + bottom * fy);
    };
    return [channel(0), channel(1), channel(2)];
  }

  function sampleField(data, field, u, v) {
    const x = clamp(Math.round(u * (data.width - 1)), 0, data.width - 1);
    const y = clamp(Math.round(v * (data.height - 1)), 0, data.height - 1);
    return data[field][y * data.width + x] || 0;
  }

  function toCss(rgb, alpha) {
    return alpha == null
      ? `rgb(${rgb[0]} ${rgb[1]} ${rgb[2]})`
      : `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
  }

  ns.ImageAnalysis = { analyze, sampleColor, sampleField, toCss };
})(window.VenusArt = window.VenusArt || {});
