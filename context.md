# Birth of Venus Generative Art — Project Context

This is the living source of truth for the project's artistic intent, system rules, implementation constraints, files, and progress. **Confirmed** items are established by the artist or assignment; **TBD** items remain for the artist to decide. Update this document when decisions are made or implementation changes.

## 1. Project Overview

- **Concept:** Create an original composition by studying the whole of Botticelli's *The Birth of Venus* and translating its primary forms and depth relationships into an image-derived polygon mesh.
- **Artist intent:** Preserve more of the painting's original structure while letting viewers perceive it in a new spatial way. Tilt-responsive HSV gradients should make polygon planes read as dimensional while retaining sampled facet colors at their midpoints; shadows may use modestly increased saturation instead of relying mainly on lower brightness.
- **Source artwork:** Sandro Botticelli, *The Birth of Venus*. The project source file is [`Original_BirthofVenus.jpg`](Original_BirthofVenus.jpg), 4683 × 2912 pixels (landscape). Analyze the whole painting; cropping out source regions is not part of the direction. The current implementation uses centered contain fitting in the portrait outputs; final visual approval remains pending.
- **Inspiration:** Quayola's *Strata*, *Iconographies*, and *Topologies*, especially the investigation of historical imagery through computational abstraction. This project is original and does not aim to reproduce Quayola's works or claim to use his exact methods.
- **Outputs:** A vertical 2160 × 3840 screen composition, a matching full-color screen SVG with filled gradient facets, and a corresponding A3 portrait (297 × 420 mm) stroke-only SVG for pen plotting.
- **Technology:** Browser-based HTML, Canvas, and plain JavaScript, without unnecessary dependencies or build tools.
- **Final-submission direction:** Seed `48223` at 85% figure/background density contrast is the artist's selected composition. The reported mesh has 296 points and 564 facets. The browser opens to these settings. The final PNG, full-color screen SVG, A3 plotter SVG, and required screenshots have not yet been generated; the artist performs final verification of every output.

## 2. Artistic Intent

The approved direction is option 1: analyze the entire painting and build a triangulated polygon mesh from its primary forms, figures, and structures. The mesh should offer a new spatial reading while retaining much of the source's composition. Polygonal facets use tilt-responsive HSV gradients to suggest planes angled away from a flat surface. Each facet retains its sampled source color at the gradient midpoint; shadows preserve the sampled hue, modestly increase saturation, and rely less on lowering value.

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
- **Artist-approved project adaptation:** use whole-image contour and visual-complexity analysis to guide a triangulated mesh, with sampled source color at each facet midpoint, source-luminance direction for facet gradients, and depth-responsive HSV value shading. These image-analysis, sampling, depth-guide, and projection choices are implementation approximations for review, not claims about Quayola's algorithms.
- **Primary references:** [Quayola project index: *Classical Iconography*](https://quayola.com/classical-iconography/), [Quayola: *Strata #4*](https://quayola.com/strata-4/), [The Berliner interview](https://www.the-berliner.com/art/davide-quayola-engaging-with-history/), and the [bitforms *Strata* exhibition page](https://www.bitforms.art/exhibition/quayola-strata/).

### Approaches considered and current direction

The artist selected **option 1, image-derived triangulated topography**, and approved a first implementation pass. The artist wants the whole painting studied, primary visual forms to inform the mesh, image-derived color to remain faithful at facet midpoints, source luminance to guide gradient direction, and depth-based tilt to control gradient strength and polygon angles. Animation remains deferred. The exact appearance remains open to visual review.

1. **Selected — image-derived triangulated topography:** Build a polygon mesh across the whole source image, guided by detected contours and local visual complexity. Image-derived color remains at each facet's gradient midpoint; smoothed source-luminance gradients guide highlight direction, while depth-based tilt controls HSV value-shift strength. First-pass algorithms are implemented below; contour selection, density range, depth-zone boundaries, and projection strength still need visual review.
2. **Not selected for the current direction — fragmented, layered image excavation:** This option would select or segment regions and separate, overlap, reveal, or obscure them. The artist is not choosing it now while animation remains undecided; the whole painting, rather than a set of fragments, is the analysis domain.
3. **Not selected — compositional flow and contour field:** This option would derive curves from image gradients and local directions. It is set aside in favor of the polygon mesh direction.

This project will not treat triangulation as a generic overlay detached from the image: the mesh should respond to the painting's detected contours, complexity, and depth relationships. The first pass combines low-level image features with hand-drawn normalized masks for the primary figure groups and shell; the system does not automatically recognize or segment those subjects. Its Delaunay edges are not constrained to follow contour paths. Sampled contour anchors influence the triangulation. Source-derived contour strokes appear only in the A3 plotter SVG; the screen preview and full-color screen SVG render filled facets without outline strokes. The artist selected seed `48223` for submission; no general legibility threshold has been set.

### Assignment reference

The 24-page *LMC 3402 — Lab 1 Building Generative Systems with an AI Partner.pdf* establishes the output, reproducibility, workflow, and presentation expectations captured below. It emphasizes writing rules before code, reviewing plans, keeping `context.md` current, and retaining the artist's role in defining rules and curating results.

The five-page `Recommended File structure.pdf` recommends a minimal browser entry point, optional JS modules as code grows, one shared geometry model for Canvas and SVG, and a seed log in `context.md`. For this project, the artist chose to group all runnable implementation files in `src/`, keeping research, source artwork, and project documentation at the root.

## 4. System Rules

Confirmed artistic rules are recorded below; items marked TBD remain open. Do not treat research possibilities as decisions.

### Image Analysis

- **Source image:** `Original_BirthofVenus.jpg` (4683 × 2912 pixels).
- **Analysis domain:** the whole painting. Do not base the artwork on selected crops or isolated fragments.
- **Image properties:** primary forms, figures, and structures; source-derived color; and perceived foreground, middle-ground, and background relationships.
- **Current image analysis:** source is reduced to 720 pixels wide. A grayscale Sobel response is thinned with non-maximum suppression; hysteresis links weak edge pixels to strong ones into contour chains. A local importance field combines edge density and grayscale contrast. A broad, box-smoothed grayscale field supplies local brightness-gradient directions for facet lighting; these are a source-luminance proxy, not a physical or semantic lighting model. This analysis detects visual boundaries and complexity, not semantic figures by itself.
- **Primary-form density guides:** four editable normalized polygons cover the left figure group, Venus, the shell, and the right figure group with its windblown mantle. These hand-authored implementation masks explicitly distinguish subject masses from most background for point sampling; they are coarse guides rather than automatic segmentation and need visual review.
- **Current contour use:** contour chains are ranked by length and edge strength, simplified, and sampled as mesh vertices. Border-dominated paths are excluded. Source-colored contour strokes are retained in the shared geometry and A3 SVG only when at least 45% of their length falls within primary-form masks; they are not drawn in the screen preview. The paths are not constrained edges of the Delaunay triangulation.
- **Current depth guides:** editable, hand-authored coarse polygons approximate the foreground figures/shell and middle-ground trees in normalized source coordinates; unmarked image regions are treated as background. These first-pass boundaries are provisional and need visual review.
- **Final feature detection, contour thresholds, point sampling, and depth-zone boundaries:** TBD after visual review. The current feature detector may miss soft boundaries or follow texture that is not a meaningful form.

### Geometric Transformation

- **Geometric forms and structures:** a Delaunay triangulated polygon mesh spans the full composition. The first pass combines a jittered 8 × 5 scaffold for broad coverage, sampled contour anchors, and seeded adaptive points. Four coarse primary-form masks prioritize points inside the left figure group, Venus, shell, and right figure/mantle group. Contour anchors inside those masks are preferred; anchors outside them are capped according to the contrast setting. The image-derived importance field still adds local detail, with a reduced background weight. The local Bowyer–Watson routine triangulates the points. Detected contour paths remain in the shared composition model for A3 stroke export; they are not enforced as triangle edges or drawn as screen strokes. This is our implementation choice, not a claim about Quayola's software.
- **Density:** the seed selects a target of 280–480 vertices. The 0–100 figure/background contrast slider maps to an internal strength of `slider / 60`: 60% preserves the previous strongest setting, while 100% extends subject/background separation. At 60%, candidates inside primary-form masks use a priority floor of 0.94; background candidates use 0.16 × local importance; minimum spacing uses `baseSpacing × (1.62 − 1.16 × priority)`; and background contour anchors are capped at 10% of their budget. At 0%, the masks do not bias sampling, all sampled non-border contour anchors may be used, and minimum spacing uses `baseSpacing × (1.38 − 0.95 × detail)`. At higher settings, subject priority is capped at 1, background detail weight and background contour anchors decrease, and spacing increases in background regions. The HUD reports the percentage of vertices within form masks. Contrast changes do not alter the seed or target vertex count; actual counts may fall below target if spacing rejects candidates.
- **Depth interpretation:** polygon plane angle relative to the flat image should communicate perceived depth: people and shell foreground, trees middle ground, ocean and sky background. The current guides assign normalized depth values 0.88, 0.48, and 0.12, respectively. The prototype projects depth by small horizontal and vertical offsets and shades from the resulting face normal. Masks, depth values, projection, and angle range remain provisional.
- **Color and facet shading:** the screen does not display the source raster beneath the mesh or draw polygon outline strokes. Each facet uses the average of 16 source-color samples distributed across that triangle. Its clipped three-stop gradient keeps the midpoint stop at the original facet color. Smoothed source-luminance gradients orient the highlight toward the locally brighter side, while depth-based face tilt controls strength. Highlights raise value by 25–45% of remaining headroom with source hue and saturation unchanged. Shadows preserve source hue, increase saturation by 20–35% (clamped to the HSV maximum), and reduce value by 15–30%, depending on tilt. The gradient spans the facet's full projected extent; when the source has no clear local brightness direction, it falls back to an upper-left highlight. The stroke-only A3 export uses image-derived colors for polygon and selected contour paths.
- **Rules governing abstraction and recognizability:** the artist will judge this through seed exploration; there is no requirement that every output remain legible as the original scene.
- **Composition and distortion constraints:** analyze the whole painting. The current renderer uses a centered, no-crop contain fit with a 5% safety margin for projection on both screen and A3. The browser preview appears over a white stage; PNG export retains the required 2160 × 3840 dimensions but makes unused canvas pixels transparent. The A3 SVG has no background rectangle and contains only colored vector strokes.

### Randomness

- **Parameters controlled by randomness:** target vertex count (currently 280–480), slight scaffold jitter, and candidate point positions vary through one seeded RNG. Contour sampling budget follows the target vertex count; contour locations and image-derived importance are fixed for the source image. Figure/background contrast is a separate user-controlled parameter, not randomized by the seed.
- **Current point-count range:** the seed selects a target of 280–480 vertices; the final range remains TBD. The separate figure/background contrast slider does not change this target.
- **Elements that remain consistent between variations:** the entire source painting, triangulated-mesh approach, source-derived color, and intended foreground/middle-ground/background ordering.

### Animation

- **Status:** animation behavior is TBD and implementation is deferred while the static mesh and seed exploration are developed.
- **How transformations evolve over time:** TBD.
- **Relationship between the original painting and the generated composition over time:** TBD; the artist will evaluate recognizability after exploring mesh density and seeds.

### Fixed Artistic Constraints

- Analyze the whole painting, not isolated fragments.
- Use image-derived polygon geometry to reinterpret primary forms and spatial depth.
- Keep screen color grounded in the source photo at facet midpoints; use local source luminance to orient HSV gradients and depth-based tilt to control their strength. Highlights raise value by 25–45% of remaining headroom while preserving sampled hue and saturation. Shadows preserve hue, increase saturation by 20–35%, and reduce value by 15–30%, depending on tilt.
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
6. Keep the runnable application in `src/`, beginning with `src/index.html`. Keep individual JavaScript modules under around 300 lines and split responsibilities by feature.
7. Use browser-based HTML, Canvas, and plain JavaScript. Do not add frameworks, package managers, build steps, or CDN dependencies without explicit approval.
8. Keep generative rules, geometry generation, rendering, and exporting clearly separated across the `src/` modules.
9. Keep PNG and SVG exports reproducible from the same seed and underlying composition. Define the animation frame/state used for export before implementing animated export.
10. Keep the architecture straightforward and maintainable for iterative development with Codex.
11. Adapt normalized composition deliberately between screen and paper aspect ratios. The full painting must remain represented without cropping. The current default is centered contain/letterbox; final approval or a reflow decision remains **TBD**.

## 6. Technical Requirements

### Screen Output

- Portrait canvas: **2160 × 3840 pixels**, aspect ratio **9:16**.
- Scale to fit the browser without stretching.
- Export both a transparent PNG and a filled, gradient-shaded screen SVG at 2160 × 3840 from the same composition geometry.
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
- **Seed field:** enter an exact unsigned 32-bit seed (0–4,294,967,295); `R` advances to the next seed. The project opens at selected seed `48223`.
- **Figure/background contrast:** slider from 0% (no mask-based density bias) to 100%. The previous strongest setting is now at 60%; values above 60% increase separation. Changing it retains the current seed and total point-count target.
- **S:** save a full-resolution 2160 × 3840 PNG with transparent pixels outside the rendered composition (no white matte).
- **V:** save a full-color 2160 × 3840 SVG of the filled, gradient-shaded screen facets. It uses the same mesh and facet-gradient calculation as the Canvas renderer; it has no white background or polygon outlines.
- **P:** export the separate A3 plotter SVG, made from colored strokes only.
- Export filenames include both seed and contrast. The screen SVG metadata records seed, contrast, point count, and facet count; the A3 SVG records seed and contrast.
- PNG, screen SVG, and plotter SVG must correspond to the same seed and geometry. The export frame/state for an animated composition is **TBD** and must be clearly defined.
- Animation is required by the assignment eventually, but artistic animation and implementation are deferred while the static mesh and seed exploration are developed.

### Composition and Aspect Ratios

- Define composition geometry in normalized 0–1 coordinates and preserve the full painting's content.
- Screen ratio is **9:16** (0.5625); A3 portrait is **1:√2** (about 0.707). Preserve the full painting without cropping. The implementation uses a centered contain fit; unused screen PNG pixels are transparent while the preview stage remains white.
- The supplied source image is landscape. Its full composition remains visible in the portrait outputs with contain fitting.
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
| `src/index.html` | Present | 4K Canvas and controls; opens with seed `48223` and 85% figure/background density contrast; loads the plain JavaScript files in order. |
| `.gitignore` | Present | Ignores `.DS_Store`, `.env`, and `exports/`. |
| `exports/` | Present, currently empty | Destination for generated PNG and SVG outputs; ignored by Git. |
| `src/rng.js` | Present | Seeded Mulberry32 RNG and deterministic next-seed control. |
| `src/image-analysis.js` | Present | Downsampled source colors, thinned Sobel edge field, local contrast/edge importance, and smoothed luminance-gradient directions. |
| `src/depth-zones.js` | Present | Coarse, editable foreground/middle-ground guide polygons. |
| `src/triangulation.js` | Present | Local Bowyer–Watson Delaunay triangulation. |
| `src/geometry.js` | Present | Seeded scaffold, form-weighted adaptive sampling, contour anchors, triangulation input, and shared mesh geometry. |
| `src/contours.js` | Present | Hysteresis contour tracing, path simplification, and capped contour anchor sampling. |
| `src/primary-forms.js` | Present | Editable whole-image masks for primary figures and shell, used to prioritize mesh density. |
| `src/renderer.js` | Present | Image-sampled color facet fills, projection, source-luminance-oriented gradients with depth-responsive HSV value shifts, and transparent unused canvas. |
| `src/svg-export.js` | Present | A3 SVG made from colored strokes for shared mesh edges and detected contour paths. |
| `src/screen-svg-export.js` | Present | Full-color 2160 × 3840 SVG with the same filled facets and gradients as the screen renderer. |
| `src/app.js` | Present | Exact seed input, next-seed control, figure/background contrast slider, exports, HUD, and FPS readout. |

The project is a Git repository with commit history. All runnable implementation files are grouped in `src/`; JavaScript modules remain under 300 lines. The application remains dependency-free and can be opened without a build step.

## 8. Seed Log

The artist selected seed `48223` at 85% figure/background density contrast as the preferred submission composition. Its reported mesh has 296 points and 564 facets. The scaffold now opens with these values.

| Seed | Relevant parameters | Visual observations | Successful characteristics | Unsuccessful characteristics | Keep or reject |
|---|---|---|---|---|---|
| 48223 | 85% figure/background density contrast; 296 points; 564 facets | Artist's preferred composition for final submission | Artist selected this version as the favorite | — | Keep for final submission |
| 48243 | 447 points; 866 facets; 89% in form zones | Earlier comparison seed; artist observed stronger figure/background distinction and flatter background facets | — | — | Alternate |

The selected submission state is seed `48223`, 85% figure/background density contrast, 296 points, and 564 facets. Further seed exploration is optional; do not replace this curated state without the artist's decision.

## 9. Development Milestones

- [ ] **M1 — Scaffold:** Browser canvas, seeded generation, HUD, and corresponding PNG, full-color screen SVG, and A3 plotter SVG exports.
- [ ] **M2 — Generative rules:** Define and implement the artist-approved, image-derived transformation system.
- [ ] **M3 — Screen:** Refine color, motion, visual hierarchy, and 4K performance.
- [ ] **M4 — Paper:** Adapt the composition to A3 stroke-only SVG and test plotting feasibility.
- [ ] **M5 — Final:** Evaluate outputs, curate seeds, and prepare the project presentation.

The artist has visually reviewed the preferred seed and curated it for M5. The artist is responsible for verifying every generated output. Milestones remain unchecked because the final PNG, both SVG exports, and submission screenshots have not yet been generated; reproducibility, browser errors/performance, and plotter behavior also remain unverified. Assignment-required animation is deferred. Generate the submission files, have the artist review them, and resolve animation status before treating the project as complete.

### Final presentation requirements from the assignment

- Submit a screenshot of `src/index.html` running with the HUD visible.
- Submit a screenshot of the project file tree showing `src/index.html`, the completed `context.md`, and `.gitignore`.
- Submit a screenshot of `git log --oneline` showing at least one commit.
- Submit a 2160 × 3840 transparent PNG and its matching A3 plotter SVG from seed `48223` at 85% contrast, with the seed in both filenames. The full-color screen SVG is an additional vector version of the screen composition.
- The provided assignment deck shows `[date]` as a placeholder and does not specify a concrete due date.

## 10. Open Artistic and Technical Decisions

Resolve these with the artist and move decisions into the relevant sections above:

1. Do the hand-authored primary-form masks and adjustable density contrast distinguish figures/shell from background clearly enough, or do the mask boundaries and weights need revision? The masks are explicit guides; the edge detector itself does not semantically identify figures.
2. What overall target vertex-count range produces the desired variation? The figure/background density contrast is now a separate direct control.
3. How should the foreground/middle-ground/background relationships be encoded as polygon angles and projection?
4. Does the smoothed source-luminance direction and reduced tilt-responsive shading strength create enough depth while keeping the source photo's colors faithful?
5. How should the full landscape composition fit the 9:16 screen and A3 portrait without cropping: letterbox or reflow?
6. What degree of recognizability should be preserved in selected seeds?
7. The assignment requires animation, but it is deferred for now. Decide whether to implement it or confirm that a static submission is acceptable; if animated, define the export frame/state.
8. How should the physical plotter's pen palette approximate image-derived color and the screen's continuous facet gradients?
9. Which seed range and number of outputs are appropriate for later curation beyond the initial density study?
