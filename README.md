# Duo — Fold Studio

Independent static foldable-phone interface demonstration. Serve `dist/` with an HTTP server. No build or dependencies are required.

## Included

- Continuous hinge-angle control, smooth left-to-right folding, automatic eased playback and slow motion.
- Inner and outer screen continuity with an edge dock and a stationary soft blur shade. The left display settles late while right-side content stays sharp and stationary.
- The front cover mirrors the same stationary blur and feathered top/bottom glass margins during opening, returning to an unwarped clear screen when closed.
- The left display content flattens independently inside the angled shell, with level top and bottom boundaries and softly feathered dark glass margins. Its hinge corners remain pinned.
- Blender-rendered titanium chamfers and recessed glass rims, continuous rounded CSS 3D shell, aligned bezel clipping and rounded closed-shell edges, and restrained matte screen reflections.
- An original generated desert wallpaper. Apple sample photography remains attributed separately.
- Home screen, sample Photos viewer, editable Notes, Photos/Notes Split View, simulated Camera shutter, Settings and StandBy.
- Two finishes, device rotation, lock/wake controls, responsive sizing and keyboard controls.
- The original reference video is embedded in the About dialog with attribution.

Reference: https://x.com/MKBHD/status/2097782855141335144

## Animation and hardware sources

See [the reference research](research/animation-reference.md) for directly viewed Apple video samples, documented materials, and distinctions between observed behavior and inferred animation parameters. The precise Apple blur curve and hinge thresholds are not public in the inspected references.

[Blender sources](source/hardware/README.md) include the editable scene and generator for all six transparent bezel renders. The website uses those rendered assets over live interactive screens; it does not load a Blender runtime.

## Deploying

The Vercel configuration serves the tracked `dist/` directory directly. No install or build step is required. The project can be imported from GitHub using the Other framework preset.

This is an approximation, not Apple software or an exact reproduction of iOS. Calls, live camera capture, live weather, third-party apps and actual music streaming are not implemented. Notes persist only for the current page session. Sample photography is loaded from Apple's public product announcement.

## Validation

JavaScript syntax and whitespace checks pass. Run `node tests/fold-geometry.mjs` to check the level top and bottom display edges, fixed hinge corners, and unchanged open state across fold angles and sizes. Browser verification covers closed, partial and open poses; the broad left-screen reveal; both finishes; app and note continuity; responsive layout; and absence of application console errors. The optional WebMCP configuration and read tools were exercised in the local browser.
