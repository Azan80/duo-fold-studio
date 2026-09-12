# Blender hardware bezel overlays

Six transparent orthographic front-view Cycles renders, 930 × 1248 px (3× a 310 × 416 CSS leaf). Model coordinates map directly to pixels; use the whole image at `position:absolute; inset:0; width:100%; height:100%; pointer-events:none`.

- `bezel-silver-left.png`, `bezel-silver-right.png`
- `bezel-dark-left.png`, `bezel-dark-right.png`
- `bezel-silver-cover.png`, `bezel-dark-cover.png`

Left aperture: x = 9…310, y = 9…407 CSS px, with 17px outer-side inner corner radii. Right aperture mirrors this: x = 0…301. The hinge edge is open. Outer corners: 26px on the free edge; 3px at the hinge edge. Both outside background and central aperture have zero alpha.

Rims are genuine 3D meshes: polished titanium chamfers, subtly brushed satin titanium faces, black glass inset, and black precision gasket. Studio area lights create all highlights. The .blend contains both leaves, the closed cover frame, and all material variants. Active camera is orthographic, front-facing, with no floor, perspective, or baked screen.

Reproduce all renders:
From the repository root, run `blender --background --python source/hardware/render_bezels.py` (created with Blender 5.2.1). PNGs are written to `dist/assets/hardware/`.

`duo-hardware.blend` opens with the silver left leaf active; right is render-hidden. `render_bezels.py` assigns materials and visibility for all six outputs. No raster painting or image compositing was used.

The cover has four 26px outer corner radii and a fully enclosed aperture at x=9…301, y=9…407 CSS px with four 17px inner corner radii. Run the generator with `-- --cover-only` to reproduce only these two outputs.
