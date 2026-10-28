(function (ns) {
  "use strict";

  const canvas = document.getElementById("art");
  const ctx = canvas.getContext("2d");
  const image = new Image();
  const status = document.getElementById("status");
  const seedInput = document.getElementById("seed-input");
  const meshReadout = document.getElementById("mesh-readout");
  const fpsReadout = document.getElementById("fps-readout");
  const contrastInput = document.getElementById("contrast-input");
  const contrastReadout = document.getElementById("contrast-readout");
  let seed = 48223;
  let densityContrast = Number(contrastInput.value) / 100;
  let analysis = null;
  let geometry = null;
  let frameCount = 0;
  let previousFpsTime = 0;

  function setStatus(message) {
    status.textContent = message;
  }

  function updateReadouts() {
    seedInput.value = String(seed);
    contrastReadout.textContent = `${Math.round(densityContrast * 100)}%`;
    if (geometry) {
      const formShare = Math.round(geometry.primaryFormVertexCount / geometry.vertices.length * 100);
      meshReadout.textContent = `Mesh: ${geometry.vertices.length} points · ${geometry.triangles.length} facets · ${formShare}% in form zones`;
    }
  }

  function renderCurrent() {
    if (!analysis || !image.complete) return;
    geometry = ns.Geometry.create(analysis, seed, densityContrast);
    ns.Renderer.render(ctx, canvas, image, geometry, analysis);
    updateReadouts();
    setStatus(`Whole image · figure contours · density contrast ${Math.round(densityContrast * 100)}%`);
  }

  function newSeed() {
    seed = ns.RNG.nextSeed(seed);
    renderCurrent();
  }

  function applySeedInput() {
    const value = Number(seedInput.value);
    if (!seedInput.value.trim() || !Number.isInteger(value) || value < 0 || value > 0xFFFFFFFF) {
      seedInput.value = String(seed);
      return;
    }
    seed = value >>> 0;
    renderCurrent();
  }

  function updateContrast() {
    densityContrast = Number(contrastInput.value) / 100;
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
      link.download = `birth-of-venus-seed-${seed}-contrast-${Math.round(densityContrast * 100)}.png`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setStatus(`Saved PNG · seed ${seed} · contrast ${Math.round(densityContrast * 100)}%`);
    }, "image/png");
  }

  function saveSvg() {
    if (!geometry || !image.complete) return;
    const svg = ns.SvgExport.create(geometry, image, seed);
    ns.SvgExport.download(svg, `birth-of-venus-seed-${seed}-contrast-${Math.round(densityContrast * 100)}-A3.svg`);
    setStatus(`Exported stroke-only A3 SVG · seed ${seed} · contrast ${Math.round(densityContrast * 100)}%`);
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
  seedInput.addEventListener("change", applySeedInput);
  contrastInput.addEventListener("input", updateContrast);
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
  image.src = "../Original_BirthofVenus.jpg";
})(window.VenusArt);
