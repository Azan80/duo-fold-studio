# Duo — Fold Studio

Independent static foldable-phone interface demonstration. Serve `dist/` with an HTTP server. No build or dependencies are required.

## Included

- Continuous hinge-angle control, automatic fold playback and slow motion.
- Inner and outer screen continuity with an edge dock and blurred widget reveal inspired by the supplied MKBHD clip.
- Home screen, sample Photos viewer, editable Notes, Photos/Notes Split View, simulated Camera shutter, Settings and StandBy.
- Two finishes, device rotation, lock/wake controls, responsive sizing and keyboard controls.
- The original reference video is embedded in the About dialog with attribution.

Reference: https://x.com/MKBHD/status/2097782855141335144

This is an approximation, not Apple software or an exact reproduction of iOS. Calls, live camera capture, live weather, third-party apps and actual music streaming are not implemented. Notes persist only for the current page session. Sample photography is loaded from Apple's public product announcement.

## Validation

JavaScript syntax, scripted control IDs, local asset paths, static entrypoint and remote image responses were checked. Broad browser interaction/visual testing was not requested. A supported WebMCP test context was unavailable, so the optional feature-detected tools have not been verified in a browser that implements the proposed API.
