# Birth of Venus Generative Art — Project Context

This is the living source of truth for the project's artistic intent, system rules, implementation constraints, files, and progress. **Confirmed** items are established by the artist or assignment; **TBD** items remain for the artist to decide. Update this document when decisions are made or implementation changes.

## 1. Project Overview

- **Concept:** Create an original composition by studying the whole of Botticelli's *The Birth of Venus* and translating its primary forms and depth relationships into an image-derived polygon mesh.
- **Artist intent:** Preserve more of the painting's original structure while letting viewers perceive it in a new spatial way. The artist is comfortable with a visible polygonal appearance when subtle gradients or shading give the facets a sense of depth.
- **Source artwork:** Sandro Botticelli, *The Birth of Venus*. The project source file is [`Original_BirthofVenus.jpg`](Original_BirthofVenus.jpg), 4683 × 2912 pixels (landscape). Analyze the whole painting; cropping out source regions is not part of the direction. Its fit within portrait outputs remains to be decided.
- **Inspiration:** Quayola's *Strata*, *Iconographies*, and *Topologies*, especially the investigation of historical imagery through computational abstraction. This project is original and does not aim to reproduce Quayola's works or claim to use his exact methods.
- **Outputs:** A vertical 2160 × 3840 pixel screen composition and a corresponding A3 portrait (297 × 420 mm) stroke-only SVG for pen plotting.
- **Technology:** Browser-based HTML, Canvas, and plain JavaScript, without unnecessary dependencies or build tools.
- **Still to decide:** Visual tuning of contour thresholds and density range, angle/projection mapping, shading strength, output aspect adaptation, and animation. Recognizability will be assessed by the artist while exploring seeds.

## 2. Artistic Intent

The approved direction is option 1: analyze the entire painting and build a triangulated polygon mesh from its primary forms, figures, and structures. The mesh should offer a new spatial reading while retaining much of the source's composition. Polygonal facets are welcome; subtle image-faithful gradients or shading within each facet should help suggest that the planes angle away from a flat surface.

Quayola's work provides a conceptual reference for moving between classical imagery and computational abstraction, and for treating looking, image structure, and historical material as subjects of artistic inquiry. The goal is to learn from that investigative approach, not imitate a recognizable surface style or assert that this project uses Quayola's proprietary processes.

Color should come from the source photo and stay as faithful to it as practical. Perceived angle/depth should follow the painting's spatial organization: people and shell in the foreground, trees in the middle ground, and ocean and sky in the background. The artist will judge recognizability through seed exploration; no minimum legibility rule has been set. Animation is undecided and is deferred for now.

## 3. Research and References

### Findings in the provided research

The two-page *Quayola Research.pdf* collects personal notes and links about *Strata*. The ten-page *AI research.pdf* expands the inquiry through interviews, gallery material, and criticism about *Strata*, *Iconographies*, and *Topologies*. Together they frame Quayola's method as a way of seeing and investigating a source, rather than applying an abstract look for its own sake.

In a 2016 interview about *Iconographies*, Quayola describes using custom computer-vision software to study selected parts of paintings (for example, color), then adjusting and calibrating rules and parameters himself. He says the work is not a painting-in/image-out automatic effect; his own calibration and judgment shape the collision between source and output. The interview also describes abstraction that can suppress the source's narrative while creating a new object of contemplation. This is an artist account of his practice, not disclosure of the software's exact algorithms. [The Berliner interview](https://www.the-berliner.com/art/davide-quayola-engaging-with-history/)

Quayola's official *Strata #4* page says the work's algorithms analyze composition, color schemes, and geometric features in four Flemish paintings and gradually reveal abstract formations; this is a project-level description, not a full algorithm specification. [Quayola: *Strata #4*](https://quayola.com/strata-4/)

The bitforms gallery describes the works' attention to light, form, shape, and color. Its *Topologies* description specifically refers to triangulation and a deforming wireframe of polygons and points. It connects *Strata* to archaeological layering and presents related drawings alongside video installations. [bitforms: *Strata* exhibition](https://www.bitforms.art/exhibition/quayola-strata/)

Technique claims need different levels of confidence. The gallery documents triangulation broadly; a 2011 *Creators Project* article specifically associates Delaunay triangulation with *Strata #4*. The supplied notes also repeat a *Print* description in which triangle color temperature informs triangle height and turns a painting into a landscape. These are published descriptions, not a complete, verified account of Quayola's proprietary software; the color-to-height mapping should not be assumed to apply to every work or to this project. [Creators Project / VICE: *Strata #4*](https://www.vice.com/en/article/istrata-4i-by-quayola/) · [Print: *Today's Obsession — Strata*](https://www.printmag.com/comics-animation-design/today-s-obsession-strata/)

The research describes *Iconographies* as using computer vision to study historical paintings and produce abstract works in which traces of the original may be partly obscured or appear excavated. An interview gives a concrete example of a work that developed an effect like a digital layer peeling away, while emphasizing that Quayola selected and calibrated the result. The *Iconographies* catalog also discusses translation, fragmentation, and the artist's role in selecting outcomes. This supports studying selective fragments and source/output tension as ideas; it does not establish a fixed segmentation or “erosion” algorithm. [NOME: *Iconographies* catalog](https://nomegallery.com/wp-content/uploads/2017/02/Iconographies_cat.pdf)

### Relevance to this source image

The supplied `Original_BirthofVenus.jpg` is a wide composition with a centered standing figure on a shell, two active groupings at the left and right, diagonal windblown fabric and hair, horizontal water and horizon bands, repeated wave shapes, and contrasting fields of sky, sea, foliage, skin, and drapery. These are observations from the project image, not selected system rules. They offer several possible subjects for computational investigation: the balance of a central vertical axis with lateral motion; how contour and color distinguish figures from atmosphere; how repeated waves, curls, and folds create rhythm; and how the shell, shore, and horizon organize depth.

### Principles and project possibilities

- **Research-grounded themes:** shifting attention from iconographic narrative to formal properties; computational study as a new way of looking; fragmentation as both loss and reconstruction; layered historical and digital visual languages; motion as part of the work; and the artist's role in setting rules, calibrating parameters, and curating outputs.
- **Documented or reported methods relevant for consideration:** selective computer-vision analysis; color/form/composition analysis; triangulation and polygonal wireframes; image-derived spatial/topographic transformation as described in secondary sources; selected fragments; animated deformation; and related screen/drawing outputs.
- **Artist-approved project adaptation:** use whole-image contour and visual-complexity analysis to guide a triangulated mesh, with source-faithful color and subtle depth shading. The current edge tracing, sampling, depth guides, and projection are implementation approximations for review, not claims about Quayola's algorithms.
- **Primary references:** [Quayola project index: *Classical Iconography*](https://quayola.com/classical-iconography/), [Quayola: *Strata #4*](https://quayola.com/strata-4/), [The Berliner interview](https://www.the-berliner.com/art/davide-quayola-engaging-with-history/), and the [bitforms *Strata* exhibition page](https://www.bitforms.art/exhibition/quayola-strata/).

### Approaches considered and current direction

The artist selected **option 1, image-derived triangulated topography**, and approved a first implementation pass. The artist wants the whole painting studied, primary visual forms to inform the mesh, image-derived color to remain faithful, and subtle facet shading and polygon angles to suggest depth. Animation remains deferred. The exact appearance and parameter ranges remain open to visual review.

1. **Selected — image-derived triangulated topography:** Build a polygon mesh across the whole source image, guided by detected contours and local visual complexity. Image-derived color remains faithful to the photo; subtle per-polygon shading/gradient and polygon angle create a spatial reading. First-pass algorithms are implemented below; contour selection, density range, depth-zone boundaries, and projection strength still need visual review.
2. **Not selected for the current direction — fragmented, layered image excavation:** This option would select or segment regions and separate, overlap, reveal, or obscure them. The artist is not choosing it now while animation remains undecided; the whole painting, rather than a set of fragments, is the analysis domain.
3. **Not selected — compositional flow and contour field:** This option would derive curves from image gradients and local directions. It is set aside in favor of the polygon mesh direction.

This project will not treat triangulation as a generic overlay detached from the image: the mesh should respond to the painting's detected contours, complexity, and depth relationships. The first pass combines low-level image features with hand-drawn normalized masks for the primary figure groups and shell; the system does not automatically recognize or segment those subjects. Its Delaunay edges are not constrained to follow contour paths. Sampled contour anchors influence the triangulation, while explicit source-derived contour strokes reinforce those boundaries in both outputs. The artist will assess the balance through seed and density exploration; no fixed legibility threshold is set.

### Assignment reference

The 24-page *LMC 3402 — Lab 1 Building Generative Systems with an AI Partner.pdf* establishes the output, reproducibility, workflow, and presentation expectations captured below. It emphasizes writing rules before code, reviewing plans, keeping `context.md` current, and retaining the artist's role in defining rules and curating results.

The five-page `Recommended File structure.pdf` confirms the minimal, self-contained `index.html` starting point; optional JS modules after about 300 lines; one shared geometry model for Canvas and SVG; and a seed log kept in `context.md`. These recommendations agree with the assignment and existing `AGENTS.md`.

## 4. System Rules

Confirmed artistic rules are recorded below; items marked TBD remain open. Do not treat research possibilities as decisions.

### Image Analysis

- **Source image:** `Original_BirthofVenus.jpg` (4683 × 2912 pixels).
- **Analysis domain:** the whole painting. Do not base the artwork on selected crops or isolated fragments.
- **Image properties:** primary forms, figures, and structures; source-derived color; and perceived foreground, middle-ground, and background relationships.
- **Current image analysis:** source is reduced to 720 pixels wide. A grayscale Sobel response is thinned with non-maximum suppression; hysteresis links weak edge pixels to strong ones into contour chains. A local importance field combines edge density and grayscale contrast. This detects visual boundaries and complexity, not semantic figures by itself.
- **Primary-form density guides:** four editable normalized polygons cover the left figure group, Venus, the shell, and the right figure group with its windblown mantle. These hand-authored implementation masks explicitly distinguish subject masses from most background for point sampling; they are coarse guides rather than automatic segmentation and need visual review.
- **Current contour use:** contour chains are ranked by length and edge strength, simplified, and sampled as mesh vertices. Up to 110 selected paths are also drawn as source-colored strokes over the triangulation in both outputs. This reinforces detected boundaries and folds; the paths are not constrained edges of the Delaunay triangulation.
- **Current depth guides:** editable, hand-authored coarse polygons approximate the foreground figures/shell and middle-ground trees in normalized source coordinates; unmarked image regions are treated as background. These first-pass boundaries are provisional and need visual review.
- **Final feature detection, contour thresholds, point sampling, and depth-zone boundaries:** TBD after visual review. The current feature detector may miss soft boundaries or follow texture that is not a meaningful form.

### Geometric Transformation

- **Geometric forms and structures:** a Delaunay triangulated polygon mesh spans the full composition. The first pass combines a jittered 8 × 5 scaffold for broad coverage, sampled contour anchors, and seeded adaptive points. Four coarse primary-form masks prioritize points inside the left figure group, Venus, shell, and right figure/mantle group. Contour anchors inside those masks are preferred; anchors outside them are capped at 10% of the contour-anchor budget to keep background structure while emphasizing the subjects. The image-derived importance field still adds local detail, with a strongly reduced background weight. The local Bowyer–Watson routine triangulates the points. Detected contour paths are stored in the same composition model and drawn with the mesh; they are not enforced as triangle edges. This is our implementation choice, not a claim about Quayola's software.
- **Density:** the seed currently selects a target of 280–480 vertices. Random candidates inside primary-form masks use a priority floor of 0.94; background candidates use 0.16 × local importance. Point acceptance uses `0.04 + 0.96 × priority^0.82`, and minimum spacing uses `baseSpacing × (1.62 − 1.16 × priority)`. These settings are intended to create a much stronger density difference between masked figures/shell and the background, while the sparse scaffold retains broad mesh coverage. The HUD reports the percentage of vertices within form masks. Actual counts may fall below target if spacing rejects candidates. These are initial exploration bounds, not final artist-selected ranges.
- **Depth interpretation:** polygon plane angle relative to the flat image should communicate perceived depth: people and shell foreground, trees middle ground, ocean and sky background. The current guides assign normalized depth values 0.88, 0.48, and 0.12, respectively. The prototype projects depth by small horizontal and vertical offsets and shades from the resulting face normal. Masks, depth values, projection, and angle range remain provisional.
- **Color and facet shading:** screen facets map their corresponding source-image triangles onto projected triangles, preserving the source's local color and detail. A subtle white-to-dark gradient is clipped within each facet and varies with face tilt. Current shading values are initial implementation settings; lighting direction and strength remain open for visual review. Do not introduce an unrelated palette.
- **Rules governing abstraction and recognizability:** the artist will judge this through seed exploration; there is no requirement that every output remain legible as the original scene.
- **Composition and distortion constraints:** analyze the whole painting. The current renderer uses a centered, no-crop contain fit with a white surround and a 5% safety margin for projection on both screen and A3; this is a reversible implementation default, not a final layout decision. Reflow remains an option for later artist review.

### Randomness

- **Parameters controlled by randomness:** target vertex count (currently 280–480), slight scaffold jitter, and candidate point positions currently vary through one seeded RNG. Contour sampling budget follows the target vertex count; contour locations and image-derived importance are fixed for the source image.
- **Current density range:** 280–480 target vertices. The final range and whether density should be a direct comparison control or vary with seed remain TBD. Actual vertex count may be lower than target when adaptive spacing rejects candidates.
- **Elements that remain consistent between variations:** the entire source painting, triangulated-mesh approach, source-derived color, and intended foreground/middle-ground/background ordering.

### Animation

- **Status:** animation behavior is TBD and implementation is deferred while the static mesh and seed exploration are developed.
- **How transformations evolve over time:** TBD.
- **Relationship between the original painting and the generated composition over time:** TBD; the artist will evaluate recognizability after exploring mesh density and seeds.

### Fixed Artistic Constraints

- Analyze the whole painting, not isolated fragments.
- Use image-derived polygon geometry to reinterpret primary forms and spatial depth.
- Keep screen color grounded in the source photo, with only subtle facet shading/gradients to support depth.
- Preserve polygon strokes and image-derived color in the paper output while honoring the assignment's stroke-only SVG rule.
- **Physical pen palette and how continuous facet gradients translate to pen strokes:** TBD.
- **Other invariants:** TBD.

## 5. Architecture Rules

These are established implementation requirements, not artistic choices:

1. All artwork randomness comes from one deterministic, seeded random-number generator (RNG); do not use unseeded `Math.random()` for artwork generation.
2. The same seed and the same inputs and parameters reproduce the same composition geometry.
3. Represent composition geometry in normalized 0–1 coordinates, not fixed pixel coordinates.
4. Keep geometry generation separate from screen rendering and SVG export.
5. Canvas and SVG renderers use the same generated composition model; do not create unrelated drawing algorithms for the two outputs.
6. Start with a simple, self-contained `index.html`. When the implementation grows to around 300 lines, consider splitting it into JavaScript files.
7. Use browser-based HTML, Canvas, and plain JavaScript. Do not add frameworks, package managers, build steps, or CDN dependencies without explicit approval.
8. Keep generative rules, geometry generation, rendering, and exporting clearly separated, even while the implementation is in one file.
9. Keep PNG and SVG exports reproducible from the same seed and underlying composition. Define the animation frame/state used for export before implementing animated export.
10. Keep the architecture straightforward and maintainable for iterative development with Codex.
11. Adapt normalized composition deliberately between screen and paper aspect ratios. The full painting must remain represented without cropping. The current default is centered contain/letterbox; final approval or a reflow decision remains **TBD**.

## 6. Technical Requirements

### Screen Output

- Portrait canvas: **2160 × 3840 pixels**, aspect ratio **9:16**.
- Scale to fit the browser without stretching.
- Support color. Animation remains an eventual assignment requirement, but its behavior and implementation are deferred for now.
- Use `requestAnimationFrame` with a 60 FPS target and display an FPS readout.
- Display the current seed in a small HUD.

### Pen Plotter Output

- Portrait SVG: **297 × 420 mm** (A3).
- Use valid vector paths/strokes only: no fills and no embedded raster images.
- Keep line density and overlaps practical for plotting; consider plotting time and unnecessary pen travel.
- Generate the SVG from the same composition geometry as the screen output.
- Polygon strokes should carry image-derived colors. The SVG may encode colored strokes; actual plot color depends on the available pen palette.
- Continuous facet gradients cannot be drawn directly as continuous tones by a pen plotter. How closely to approximate them with discrete colored strokes or other stroke patterns is **TBD**; no fills or raster images may be added.

### Reproducibility and Controls

- Use deterministic seeded randomness; the same seed and parameters reproduce the same geometry.
- **R:** generate a new seed and composition.
- **S:** save a full-resolution 2160 × 3840 PNG.
- **P:** export the corresponding composition as an A3 SVG.
- PNG and SVG exports must correspond to the same seed and composition. The export frame/state for an animated composition is **TBD** and must be clearly defined.
- Animation is required by the assignment eventually, but artistic animation and implementation are deferred while the static mesh and seed exploration are developed.

### Composition and Aspect Ratios

- Define composition geometry in normalized 0–1 coordinates and preserve the full painting's content.
- Screen ratio is **9:16** (0.5625); A3 portrait is **1:√2** (about 0.707). Preserve the full painting without cropping. The current implementation uses centered contain/letterbox for both outputs; final approval or reflow remains **TBD**.
- The supplied source image is landscape. Its current fit uses a white surround; review this against the desired portrait presentation.
- Use the same polygon edges for the plotter and assign source-derived stroke colors. How the physical pen palette approximates facet color and gradients is **TBD**.

## 7. Project File Structure

The current workspace and intended roles are:

| File or directory | Status | Role |
|---|---|---|
| `AGENTS.md` | Present | Persistent project instructions. |
| `context.md` | Present | Living source of truth for decisions and progress. |
| `Quayola Research.pdf` | Present | Artist research notes and references. |
| `AI research.pdf` | Present (lowercase “r” on disk) | Expanded research synthesis on *Strata*, *Iconographies*, and *Topologies*. |
| `LMC 3402 — Lab 1 Building Generative Systems with an AI Partner.pdf` | Present | Assignment requirements and workflow. |
| `Recommended File structure.pdf` | Present | Five-page architecture and documentation recommendations. |
| `Original_BirthofVenus.jpg` | Present | Designated source image. |
| `index.html` | Present | 4K Canvas and controls; loads the plain JavaScript files in order. |
| `.gitignore` | Present | Ignores `.DS_Store`, `.env`, and `exports/`. |
| `exports/` | Present, currently empty | Generated PNG and SVG outputs; ignored by Git. |
| `rng.js` | Present | Seeded Mulberry32 RNG and deterministic next-seed control. |
| `image-analysis.js` | Present | Downsampled source colors, thinned Sobel edge field, and local contrast/edge importance analysis. |
| `depth-zones.js` | Present | Coarse, editable foreground/middle-ground guide polygons. |
| `triangulation.js` | Present | Local Bowyer–Watson Delaunay triangulation. |
| `geometry.js` | Present | Seeded scaffold, form-weighted adaptive sampling, contour anchors, triangulation input, and shared mesh geometry. |
| `contours.js` | Present | Hysteresis contour tracing, path simplification, and capped contour anchor sampling. |
| `primary-forms.js` | Present | Editable whole-image masks for primary figures and shell, used to prioritize mesh density. |
| `renderer.js` | Present | Canvas texture mapping, projection, facet shading, and mesh strokes. |
| `svg-export.js` | Present | A3 SVG made from colored strokes for shared mesh edges and detected contour paths. |
| `app.js` | Present | Seed controls, exports, HUD, and FPS readout. |

The workspace is not currently initialized as a Git repository. The current JavaScript files are all under 300 lines. The application remains dependency-free and can be opened without a build step.

## 8. Seed Log

No composition has been evaluated or selected yet. Add an entry only when the artist identifies a seed as worth keeping or evaluating; do not invent evaluations.

The scaffold starts with seed `48213` as a reproducible preview default. It has not been artist-evaluated and is not a curated Seed Log entry.

| Seed | Relevant parameters | Visual observations | Successful characteristics | Unsuccessful characteristics | Keep or reject |
|---|---|---|---|---|---|
| — | — | — | — | — | — |

### Seed exploration guidance (proposal)

A seed reproduces a whole composition; it is not one seed per variable. To understand mesh density, compare density settings while holding other inputs steady, then compare multiple seeds at each setting. A manageable first study would be three density levels (sparse, medium, dense) crossed with three seed values (nine compositions). Reuse the same three seed values at each level where possible. Because different point counts can change how a random sequence is consumed, the implementation specification should make comparisons stable (for example, by deriving a fixed candidate point sequence from the seed and changing how many points are used). These are suggested study counts, not generated or evaluated seeds. After the artist chooses a useful density range, the seed can vary density within that range if desired.

## 9. Development Milestones

- [ ] **M1 — Scaffold:** Browser canvas, seeded generation, HUD, and matching PNG/SVG exports.
- [ ] **M2 — Generative rules:** Define and implement the artist-approved, image-derived transformation system.
- [ ] **M3 — Screen:** Refine color, motion, visual hierarchy, and 4K performance.
- [ ] **M4 — Paper:** Adapt the composition to A3 stroke-only SVG and test plotting feasibility.
- [ ] **M5 — Final:** Evaluate outputs, curate seeds, and prepare the project presentation.

Initial M1/M2 code is present, but the browser render, exports, reproducibility, performance, and plotter behavior have not been verified. Keep milestones unchecked until those checks and the artist's visual review are complete.

### Final presentation requirements from the assignment

- Submit a screenshot of `index.html` running with the HUD visible.
- Submit a screenshot of the project file tree showing `index.html`, the completed `context.md`, and `.gitignore`.
- Submit a screenshot of `git log --oneline` showing at least one commit.
- Submit a PNG and its matching SVG from the same seed, with the seed in both filenames.
- The handout's submission due date is shown as `[date]`; no due date is specified there.

## 10. Open Artistic and Technical Decisions

Resolve these with the artist and move decisions into the relevant sections above:

1. Do the hand-authored primary-form masks and adaptive point distribution distinguish figures/shell from background clearly enough, or do the mask boundaries and weights need revision? The masks are explicit guides; the edge detector itself does not semantically identify figures.
2. What mesh-density range produces the desired variation, and should density be a direct parameter during comparison before being allowed to vary with seed?
3. How should the foreground/middle-ground/background relationships be encoded as polygon angles and projection?
4. What shading direction and strength create depth while keeping the source photo's colors faithful?
5. How should the full landscape composition fit the 9:16 screen and A3 portrait without cropping: letterbox or reflow?
6. What degree of recognizability should be preserved in selected seeds?
7. What animation behavior, if any, should be developed later, and what frame/state should exports represent?
8. How should the physical plotter's pen palette approximate image-derived color and the screen's subtle facet gradients?
9. Which seed range and number of outputs are appropriate for later curation beyond the initial density study?
