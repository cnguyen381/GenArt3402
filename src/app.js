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
  const sourceImageInput = document.getElementById("source-image-input");
  let seed = 48223;
  let densityContrast = Number(contrastInput.value) / 100;
  let analysis = null;
  let geometry = null;
  let frameCount = 0;
  let previousFpsTime = 0;
  let sourceWasSelected = false;

  function setStatus(message) {
    status.textContent = message;
  }

  function localServerMessage() {
    return "Choose Original_BirthofVenus.jpg above, or run `python3 -m http.server 8000` from the project folder and open http://localhost:8000/src/.";
  }

  function loadSourceImage(source) {
    if (image.src === source && image.complete && analysis) {
      renderCurrent();
      return;
    }
    analysis = null;
    geometry = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    meshReadout.textContent = "Mesh: —";
    setStatus("Loading source image…");
    image.src = source;
  }

  function chooseSourceImage() {
    sourceImageInput.click();
  }

  function loadChosenSourceImage() {
    const file = sourceImageInput.files && sourceImageInput.files[0];
    sourceImageInput.value = "";
    if (!file) return;
    if (!/^image\/(jpeg|png)$/.test(file.type) && !/\.(jpe?g|png)$/i.test(file.name)) {
      setStatus("Choose the provided Original_BirthofVenus.jpg image.");
      return;
    }

    const reader = new FileReader();
    setStatus("Reading selected source image…");
    reader.onload = function () {
      if (typeof reader.result !== "string") {
        setStatus("Could not read the selected image. Please choose Original_BirthofVenus.jpg again.");
        return;
      }
      sourceWasSelected = true;
      loadSourceImage(reader.result);
    };
    reader.onerror = function () {
      setStatus("Could not read the selected image. Please choose Original_BirthofVenus.jpg again.");
    };
    reader.readAsDataURL(file);
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
    if (!geometry) {
      setStatus("Choose and load the source image before exporting.");
      return;
    }
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

  function saveArtworkPng() {
    if (!geometry) return;
    let pixels;
    try {
      pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    } catch (error) {
      setStatus(`Transparent PNG export failed: ${error.message}`);
      return;
    }

    let left = canvas.width, top = canvas.height, right = -1, bottom = -1;
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        if (pixels.data[(y * canvas.width + x) * 4 + 3] === 0) continue;
        left = Math.min(left, x);
        top = Math.min(top, y);
        right = Math.max(right, x);
        bottom = Math.max(bottom, y);
      }
    }
    if (right < left || bottom < top) {
      setStatus("Transparent PNG export failed: no artwork pixels found.");
      return;
    }

    const width = right - left + 1, height = bottom - top + 1;
    const croppedCanvas = document.createElement("canvas");
    croppedCanvas.width = width;
    croppedCanvas.height = height;
    croppedCanvas.getContext("2d").drawImage(
      canvas, left, top, width, height, 0, 0, width, height
    );
    croppedCanvas.toBlob((blob) => {
      if (!blob) {
        setStatus("Transparent PNG export failed. Try opening the project through a local browser server.");
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `birth-of-venus-seed-${seed}-contrast-${Math.round(densityContrast * 100)}-artwork-only.png`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setStatus(`Saved tightly cropped transparent PNG · ${width} × ${height} · seed ${seed}`);
    }, "image/png");
  }

  function saveSvg() {
    if (!geometry || !image.complete) return;
    const svg = ns.SvgExport.create(geometry, image, seed);
    ns.SvgExport.download(svg, `birth-of-venus-seed-${seed}-contrast-${Math.round(densityContrast * 100)}-A3.svg`);
    setStatus(`Exported stroke-only A3 SVG · seed ${seed} · contrast ${Math.round(densityContrast * 100)}%`);
  }

  function saveScreenSvg() {
    if (!geometry || !image.complete || !analysis) return;
    const svg = ns.ScreenSvgExport.create(geometry, image, analysis, seed);
    ns.ScreenSvgExport.download(
      svg,
      `birth-of-venus-seed-${seed}-contrast-${Math.round(densityContrast * 100)}-screen.svg`
    );
    setStatus(`Saved full-color screen SVG · seed ${seed} · contrast ${Math.round(densityContrast * 100)}%`);
  }

  function handleKey(event) {
    if (event.target && /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return;
    const key = event.key.toLowerCase();
    if (key === "r") newSeed();
    if (key === "s") savePng();
    if (key === "v") saveScreenSvg();
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
  document.getElementById("save-artwork-png").addEventListener("click", saveArtworkPng);
  document.getElementById("save-screen-svg").addEventListener("click", saveScreenSvg);
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
      setStatus(window.location.protocol === "file:" && !sourceWasSelected
        ? localServerMessage()
        : `Could not analyze source image: ${error.message}`);
    }
  };
  image.onerror = function () {
    setStatus(window.location.protocol === "file:" && !sourceWasSelected
      ? localServerMessage()
      : "Could not load the selected source image. Choose Original_BirthofVenus.jpg from the project files.");
  };
  document.getElementById("choose-source-image").addEventListener("click", chooseSourceImage);
  sourceImageInput.addEventListener("change", loadChosenSourceImage);

  if (window.location.protocol === "file:") {
    setStatus(localServerMessage());
  } else {
    image.src = "../Original_BirthofVenus.jpg";
  }
})(window.VenusArt);
