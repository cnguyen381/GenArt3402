# Birth of Venus Generative Art — Project Context

This is the living source of truth for the project's artistic intent, system rules, implementation constraints, files, and progress. **Confirmed** items are established by the artist or assignment; **TBD** items remain for the artist to decide. Update this document when decisions are made or implementation changes.

## 1. Project Overview

- **Concept:** Create an original generative composition by computationally investigating and transforming formal properties of Botticelli's *The Birth of Venus*. The system's specific visual result is **TBD**.
- **Artist intent:** Explore how a historical image's formal structure can inform a new visual composition through a rule-based system. Generative analysis is an artistic investigation, not merely a decorative effect.
- **Source artwork:** Sandro Botticelli, *The Birth of Venus*. The project source file is [`Original_BirthofVenus.jpg`](Original_BirthofVenus.jpg), 4683 × 2912 pixels (landscape). Any crop, framing, or image preparation is **TBD**.
- **Inspiration:** Quayola's *Strata*, *Iconographies*, and *Topologies*, especially the investigation of historical imagery through computational abstraction. This project is original and does not aim to reproduce Quayola's works or claim to use his exact methods.
- **Outputs:** A vertical 2160 × 3840 pixel screen composition and a corresponding A3 portrait (297 × 420 mm) stroke-only SVG for pen plotting.
- **Technology:** Browser-based HTML, Canvas, and plain JavaScript, without unnecessary dependencies or build tools.
- **Unresolved artistic direction:** Which image properties to analyze, how to transform them, what remains recognizable, how color and geometry interact, and how motion and randomness contribute are all **TBD**.

## 2. Artistic Intent

The confirmed direction is to examine *The Birth of Venus* as both a historical, representational image and a formal arrangement that can be investigated computationally. The project asks how characteristics such as composition, color, geometry, proportions, or spatial relationships might support a new composition. Which of these characteristics matter, and what transformation they should undergo, remain **TBD**.

Quayola's work provides a conceptual reference for moving between classical imagery and computational abstraction, and for treating looking, image structure, and historical material as subjects of artistic inquiry. The goal is to learn from that investigative approach, not imitate a recognizable surface style or assert that this project uses Quayola's proprietary processes.

The artist retains authorship through defining the system's rules and limits and evaluating its outputs. The desired balance between abstraction and recognition, and the particular role of the original image in the final composition, remain **TBD**.

## 3. Research and References

### Findings in the provided research

The two-page *Quayola Research.pdf* collects personal notes and links about *Strata*. It describes interests in classical figuration and abstraction, Renaissance and Baroque iconography, architectural traditions, geometry, stratification, and the value and conservation of historical objects. It also frames viewing as an encounter with an image's surface and underlying visual logic.

The notes report that *Strata* analyzes composition, color schemes, and geometric features in paintings and gradually reveals abstract formations. A passage attributed in the notes to a *Print* article describes color analysis, triangular color pieces, assigning triangle height according to color temperature, forming a landscape, and animating the result. These are **reported descriptions in the supplied research**, not verified specifications of Quayola's methods or evidence of a complete/proprietary algorithm. They do not decide this project's technique.

The notes also frame screen movement as a dialogue between eras and dimensions and refer to universal rules of beauty and perfection. These remain conceptual prompts rather than constraints for this project.

The research page includes an image of a mesh over a painting. It is a visual reference only; it does not establish that this project should use a mesh or triangulation.

### Principles and project possibilities

- **Research-grounded themes:** relationship between representation and abstraction; analysis of historical imagery; geometry, composition, and stratification; dialogue between historical traditions and contemporary computational aesthetics; artist-defined systems and curation.
- **Unselected technical possibilities:** image-derived color, segmentation, sampling, triangulation, layering, geometric distortion, or temporal transformation. These remain options for discussion, not selected rules.
- **Source links listed in the research notes:** [bitforms: Quayola — Strata](https://www.bitforms.art/exhibition/quayola-strata), [Quayola: Strata 4](https://quayola.com/strata-4/), and [Print: Today's Obsession — Strata](https://www.printmag.com/comics-animation-design/today-s-obsession-strata/).

### Assignment reference

The 24-page *LMC 3402 — Lab 1 Building Generative Systems with an AI Partner.pdf* establishes the output, reproducibility, workflow, and presentation expectations captured below. It emphasizes writing rules before code, reviewing plans, keeping `context.md` current, and retaining the artist's role in defining rules and curating results.

`Recommended File structure.pdf`, mentioned in the request, is not present in the project directory. The file-structure guidance below comes from `AGENTS.md` and the available assignment handout.

## 4. System Rules

Artistic rules below remain open until the artist decides them. Do not treat research possibilities as decisions.

### Image Analysis

- **Source image:** `Original_BirthofVenus.jpg` (4683 × 2912 pixels).
- **Image properties to analyze:** TBD.
- **Image segmentation and sampling methods:** TBD.
- **Source image framing or preprocessing:** TBD.

### Geometric Transformation

- **Geometric forms and structures:** TBD.
- **Transformation algorithms:** TBD.
- **Rules governing abstraction and recognizability:** TBD.
- **Composition and distortion constraints:** TBD.

### Randomness

- **Parameters controlled by randomness:** TBD.
- **Allowed parameter ranges:** TBD.
- **Elements that remain consistent between variations:** TBD.

### Animation

- **Artistic animation behavior:** TBD.
- **How transformations evolve over time:** TBD.
- **Relationship between the original painting and the generated composition over time:** TBD.

### Fixed Artistic Constraints

- **Confirmed broad constraint:** the generated geometry should retain a meaningful relationship to the source image, in keeping with the artist's stated intent.
- **Other invariants and visual elements that must remain consistent:** TBD.
- **Specific balance of source fidelity and abstraction:** TBD.

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
11. Adapt normalized composition deliberately between screen and paper aspect ratios. Whether to crop, letterbox, or reflow is **TBD**.

## 6. Technical Requirements

### Screen Output

- Portrait canvas: **2160 × 3840 pixels**, aspect ratio **9:16**.
- Scale to fit the browser without stretching.
- Support color and animation.
- Use `requestAnimationFrame` with a 60 FPS target and display an FPS readout.
- Display the current seed in a small HUD.

### Pen Plotter Output

- Portrait SVG: **297 × 420 mm** (A3).
- Use valid vector paths/strokes only: no fills and no embedded raster images.
- Keep line density and overlaps practical for plotting; consider plotting time and unnecessary pen travel.
- Generate the SVG from the same composition geometry as the screen output.
- How color, tone, layers, or motion should translate to physical strokes is **TBD**.

### Reproducibility and Controls

- Use deterministic seeded randomness; the same seed and parameters reproduce the same geometry.
- **R:** generate a new seed and composition.
- **S:** save a full-resolution 2160 × 3840 PNG.
- **P:** export the corresponding composition as an A3 SVG.
- PNG and SVG exports must correspond to the same seed and composition. The export frame/state for an animated composition is **TBD** and must be clearly defined.

### Composition and Aspect Ratios

- Define composition geometry in normalized 0–1 coordinates.
- Screen ratio is **9:16** (0.5625); A3 portrait is **1:√2** (about 0.707). Choose and document whether the composition crops, letterboxes, or reflows between outputs; this is **TBD**.
- The supplied source image is landscape. How its framing relates to the portrait composition is **TBD**.
- A color-based or animated composition needs an artist-approved translation into stroke-only paths for the plotter; that mapping is **TBD**.

## 7. Project File Structure

The current workspace and intended roles are:

| File or directory | Status | Role |
|---|---|---|
| `AGENTS.md` | Present | Persistent project instructions. |
| `context.md` | Present | Living source of truth for decisions and progress. |
| `Quayola Research.pdf` | Present | Artist research notes and references. |
| `LMC 3402 — Lab 1 Building Generative Systems with an AI Partner.pdf` | Present | Assignment requirements and workflow. |
| `Recommended File structure.pdf` | Missing | Referenced in the request, unavailable in this workspace. |
| `Original_BirthofVenus.jpg` | Present | Designated source image. |
| `index.html` | Present, currently empty | Planned browser entry point and initial self-contained application. |
| `.gitignore` | Present | Ignores `.DS_Store`, `.env`, and `exports/`. |
| `exports/` | Present, currently empty | Generated PNG and SVG outputs; ignored by Git. |
| `geometry.js` | Planned, optional | Geometry generation and image-derived transformations if/when code is split. |
| `renderer.js` | Planned, optional | Canvas and PNG rendering if/when code is split. |
| `svg-export.js` | Planned, optional | A3 stroke-only SVG export if/when code is split. |

The workspace is not currently initialized as a Git repository. The separate JavaScript files are optional; begin with `index.html` and split only when complexity warrants it. Do not add unnecessary application files at this stage.

## 8. Seed Log

No composition has been evaluated or selected yet. Add an entry only when the artist identifies a seed as worth keeping or evaluating; do not invent evaluations.

| Seed | Relevant parameters | Visual observations | Successful characteristics | Unsuccessful characteristics | Keep or reject |
|---|---|---|---|---|---|
| — | — | — | — | — | — |

## 9. Development Milestones

- [ ] **M1 — Scaffold:** Browser canvas, seeded generation, HUD, and matching PNG/SVG exports.
- [ ] **M2 — Generative rules:** Define and implement the artist-approved, image-derived transformation system.
- [ ] **M3 — Screen:** Refine color, motion, visual hierarchy, and 4K performance.
- [ ] **M4 — Paper:** Adapt the composition to A3 stroke-only SVG and test plotting feasibility.
- [ ] **M5 — Final:** Evaluate outputs, curate seeds, and prepare the project presentation.

### Final presentation requirements from the assignment

- Open studio: **December 11, 2026, 11:20 a.m.–2:10 p.m.**
- Submit a screenshot of `index.html` running with the HUD visible.
- Submit a screenshot of the project file tree showing `index.html`, the completed `context.md`, and `.gitignore`.
- Submit a screenshot of `git log --oneline` showing at least one commit.
- Submit a PNG and its matching SVG from the same seed, with the seed in both filenames.
- The handout's submission due date is shown as `[date]`; no due date is specified there.

## 10. Open Artistic and Technical Decisions

Resolve these with the artist and move decisions into the relevant sections above:

1. Which visual properties of *The Birth of Venus* should be analyzed?
2. How should the source painting be geometrically transformed?
3. What degree of recognizability should be preserved?
4. How should color, composition, and geometry interact?
5. How should the artwork evolve through animation, and what frame/state should exports represent?
6. What should randomness control, and within what ranges?
7. How should the transformation translate into a physical pen plot?
8. How should the composition adapt between 9:16 screen and A3 portrait: crop, letterbox, or reflow?
9. How should the landscape source image be framed for the portrait outputs?
