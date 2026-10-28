(function (ns) {
  "use strict";

  const canvas = document.getElementById("art");
  const ctx = canvas.getContext("2d");
  const image = new Image();
  const status = document.getElementById("status");
  const seedReadout = document.getElementById("seed-readout");
  const meshReadout = document.getElementById("mesh-readout");
  const fpsReadout = document.getElementById("fps-readout");
  let seed = 48213;
  let analysis = null;
  let geometry = null;
  let frameCount = 0;
  let previousFpsTime = 0;

  function setStatus(message) {
    status.textContent = message;
  }

  function updateReadouts() {
    seedReadout.textContent = `Seed: ${seed}`;
    if (geometry) {
      meshReadout.textContent = `Mesh: ${geometry.vertices.length} points · ${geometry.triangles.length} facets`;
    }
  }

  function renderCurrent() {
    if (!analysis || !image.complete) return;
    geometry = ns.Geometry.create(analysis, seed);
    ns.Renderer.render(ctx, canvas, image, geometry);
    updateReadouts();
    setStatus(`Whole image · ${geometry.contours.length} source contours · adaptive static mesh`);
  }

  function newSeed() {
    seed = ns.RNG.nextSeed(seed);
    renderCurrent();
  }

  function savePng() {
    canvas.toBlob((blob) => {
      if (!blob) {
        setStatus("PNG export failed. Try opening the project through a local browser server.");
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `birth-of-venus-seed-${seed}.png`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setStatus(`Saved PNG · seed ${seed}`);
    }, "image/png");
  }

  function saveSvg() {
    if (!geometry || !image.complete) return;
    const svg = ns.SvgExport.create(geometry, image, seed);
    ns.SvgExport.download(svg, `birth-of-venus-seed-${seed}-A3.svg`);
    setStatus(`Exported stroke-only A3 SVG · seed ${seed}`);
  }

  function handleKey(event) {
    if (event.target && /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return;
    const key = event.key.toLowerCase();
    if (key === "r") newSeed();
    if (key === "s") savePng();
    if (key === "p") saveSvg();
  }

  function updateFps(timestamp) {
    frameCount++;
    if (timestamp - previousFpsTime >= 500) {
      const fps = frameCount * 1000 / (timestamp - previousFpsTime || 1);
      fpsReadout.textContent = `FPS: ${Math.round(fps)}`;
      frameCount = 0;
      previousFpsTime = timestamp;
    }
    requestAnimationFrame(updateFps);
  }

  document.getElementById("new-seed").addEventListener("click", newSeed);
  document.getElementById("save-png").addEventListener("click", savePng);
  document.getElementById("save-svg").addEventListener("click", saveSvg);
  window.addEventListener("keydown", handleKey);

  image.onload = function () {
    try {
      analysis = ns.ImageAnalysis.analyze(image, 720);
      analysis.contours = ns.Contours.tracePaths(analysis);
      renderCurrent();
      requestAnimationFrame(updateFps);
    } catch (error) {
      console.error(error);
      setStatus(`Could not analyze source image: ${error.message}`);
    }
  };
  image.onerror = function () {
    setStatus("Could not load Original_BirthofVenus.jpg from this folder.");
  };
  image.src = "Original_BirthofVenus.jpg";
})(window.VenusArt);
