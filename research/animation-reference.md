# iPhone Duo display-transition reference

Research checked September 12, 2026. Purpose: support an interactive visual rebuild. Primary evidence comprises Apple’s product and Newsroom videos, Apple’s Human Interface Guidelines and Tech Talks, and the original MKBHD hands-on post. Videos were viewed in browser players; no remote video was downloaded for inspection.

## 1. The effect to reproduce

The visible effect combines the device’s real folding geometry with a broad, spatially varying loss of clarity and brightness on the moving display surface. During opening, the right inner Home Screen is already legible while the left inner surface remains blurred and darker. Clarity extends toward the outer left edge late in the opening. The content appears attached to its display, rather than entering vertically. This was directly inspected in [Apple’s hero clip](https://www.apple.com/105/media/us/iphone-duo/2026/9305e4b9-72d9-4c05-9381-b572adadd5e5/anim/hero/large.mp4).

The [original MKBHD post](https://x.com/MKBHD/status/2097782855141335144) is publicly viewable in the browser. Its approximately 19.923-second video shows repeated opening and closing. A partially folded pose exposes the broadly blurred outer screen in front of a sharp strip of the right inner screen, so both displays are visibly active during the handoff. The post’s UI identifies the author as Marques Brownlee and the text as “This iPhone duo animation.” Its recording uses different widgets from Apple’s marketing footage; those are separate examples, not interchangeable frame references.

## 2. Sampled visual evidence and timing

These are browser-player sample positions, not measured system latency or a calibration from time to hinge angle. They are rounded because a player’s currentTime is not a guarantee of exact decoded-frame alignment.

| Source | Sample time | Direct visual observation |
| --- | ---: | --- |
| Product hero, 3.033 s total | 1.816 s | Inner screen narrow and opening; right apps sharp; left photo widget strongly blurred and dark. |
| Product hero | 2.207 s | Much wider inner display; right pane remains sharp; broad dark blur covers the left pane. |
| Product hero | 2.612 s | Similar almost-open pose; left photo becomes substantially clearer. |
| Newsroom opening, 3.000 s total | 2.408 s | Left photo heavily blurred, with darkness strongest toward the far left; right apps crisp. |
| Newsroom opening | 2.551 s | Photo’s hinge-side/right detail clearer than its outer/left area; broad recovery across the left surface. |
| Newsroom opening | 2.701 s | Photo, widget text and dune texture sharp; handoff appears settled. |

Sources: [product hero](https://www.apple.com/105/media/us/iphone-duo/2026/9305e4b9-72d9-4c05-9381-b572adadd5e5/anim/hero/large.mp4), [Newsroom opening video](https://www.apple.com/newsroom/videos/2026/autoplay/09/apple-unveils-iphone-duo/apple-iphone-duo-opening/large_2x.mp4). The Newsroom clip was discovered from the launch article’s video DOM and directly played. Its late recovery is a better close-up reference than the product page’s versatility montage, which chiefly shows several device poses.

## 3. Recommended reconstruction, explicitly inferred

Use three actual display surfaces: outer, inner-left, and inner-right. Give the inner panels one coordinated layout and wallpaper, clipped into the two physical panels. Keep the right Home Screen in a stable local coordinate system while the shell moves around the hinge.

For the moving left panel, blend a sharp surface with a blurred, dimmed version through a very broad mask varying mainly along the screen’s horizontal coordinate. Let the clear region grow from the hinge toward the outer edge. Attach that mask to the panel’s own coordinates so perspective naturally rotates it with the phone. Couple the outer screen’s complementary reveal to the same progress.

These are implementation recommendations inferred from the videos. The sources do not establish a narrow diagonal stripe, a vertically sliding page, uniform whole-screen blur, an exact Gaussian radius, or a specific easing function. A late settle after the shell reaches its almost-open position is visually supported by the sampled marketing clip, but its duration must remain a recreation parameter.

## 4. What Apple actually documents

Apple documents continuous hinge angle updates and high-level closed, partially open, and fully open states through SwiftUI’s onHingeChange and UIKit’s UIHingeInteraction. It describes live hinge data as useful for interactions and effects, while layout should use arrangement and region APIs. This supports a continuously scrubbable effect, but does not publish the Home Screen transition’s internal algorithm. [Multiple displays and scenes, 0:49–2:59](https://developer.apple.com/videos/play/tech-talks/111464/)

The HIG specifies compact layout on the outer display, regular layout inside, side-mounted controls, preservation of content state, and small necessary adjustments around the folding region. The inner camera remains hidden while inactive. Keep the demo’s UI recognizable and anchored; large unrelated rearrangements would conflict with this guidance. [Designing for iPhone Duo](https://developer.apple.com/design/human-interface-guidelines/designing-for-iphone-duo)

Apple’s layout talk describes the folding region as zero-width when flat, and advises moving or resizing existing elements while maintaining visual relationships. That is useful for subtle hinge avoidance, separate from the blur material. [Adaptive layouts](https://developer.apple.com/videos/play/tech-talks/111463/)

## 5. Physical materials and composition

Apple describes a mirror-polished grade 5 titanium enclosure, a contrasting micro-blasted hinge cover, and a matte nano-textured inner screen. It also states that the display engine drives both displays simultaneously, and that their shared aspect ratio supports proportional scaling between displays. [Apple launch announcement](https://www.apple.com/newsroom/2026/09/apple-unveils-iphone-duo/)

For rendering, this suggests narrow, strong reflections on the metal frame, a softer hinge finish, and restrained screen reflections. Avoid treating all surfaces as equally glossy. These rendering choices are inferred from the documented materials; Apple does not provide roughness values. The observed Home Screen uses a blue sky, dark mountain ridges, tan dunes with fine ripples, bright widgets, and a translucent vertical dock at the trailing edge.

## 6. Verified original UI and image assets

The following URLs were discovered through page links or rendered DOM attributes; none were guessed.

- [Official outer Home Screen PNG](https://developer.apple.com/tutorials/images/com.apple.HIG/designing-for-iphone-hero-outside@2x.png) and [inner Home Screen PNG](https://developer.apple.com/tutorials/images/com.apple.HIG/designing-for-iphone-hero-inside@2x.png): flat HIG references for icons and layout. The inspected outer image uses purple abstract wallpaper, not the marketing desert scene. Dark-page variants are also declared by the HIG.
- [Desert lock-screen product still, 1440 × 760](https://www.apple.com/v/iphone-duo/a/images/overview/product-viewer/display__bx48n0ntsgvm_large.jpg): directly viewed; front-on closed phone with much of the mountain/dune image unobscured. Includes phone frame, clock, and controls; it is not standalone wallpaper.
- [Hero start still](https://www.apple.com/v/iphone-duo/a/images/overview/media-hero/hero_startframe__fcol1x2us8i2_large.jpg) and [hero end still](https://www.apple.com/v/iphone-duo/a/images/overview/media-hero/hero_endframe__gdt3l3spaqie_large.jpg): original product-page image links for comparison.
- [Official product film stream](https://www.apple.com/105/media/us/iphone-duo/2026/9305e4b9-72d9-4c05-9381-b572adadd5e5/films/product/iphone-duo-product-tpl-us-2026_16x9.m3u8): discovered in the “Watch the film” link. The stream was not fully reviewed in this focused investigation.

A standalone official desert wallpaper was not verified. Do not describe a rebuilt or cropped version as an original wallpaper asset.

## 7. Acceptance criteria and unresolved precision

Compare the rebuild at several static fold positions, not only as a fast loop: closed outer screen, partially exposed dual screens, nearly open with left blur/right clarity, and settled inner screen. The left-side detail and wallpaper must recover without jumping position. A narrow hard band, diagonal visual strip, or vertical content travel would miss the observed effect.

The precise hinge thresholds, optical blur kernel, mask width, brightness curve, time hysteresis, and any spring constants remain undocumented in the inspected primary sources. Label them as approximation parameters. Apple’s [Design for iPhone Duo talk](https://developer.apple.com/videos/play/tech-talks/111466/) reinforces continuity and restrained adaptation but does not give these constants. Native validation could later use the Duo simulator in Xcode’s Device Hub; Apple documents controls for opening, closing, rotating, and folding there. [Prepare your app, 1:17](https://developer.apple.com/videos/play/tech-talks/111461/)

## Implemented reconstruction

The browser demo uses a live UI beneath a decorative blurred duplicate on the left panel. A broad horizontal mask uncovers the sharp surface from the hinge toward the outside edge. Right-side content stays unfiltered. The reveal follows a quintic 150–180° approximation with a short exponential settling response; those numbers are authored recreation parameters, not Apple specifications. The cover softens during the complementary handoff.

The user’s September 12 screenshot (9:25 AM), followed by their clarification that the screen content should flatten inside the frame, supplies a more specific geometry target: a level lower luminous boundary above the sloping lower metal rim. A separate projective transform now compensates for the left panel’s perspective at its bottom edge while keeping both hinge corners fixed. The upper edge receives a smaller correction. The uncovered wedge uses the underlying dark glass surface. This is a visual reconstruction; it does not imply physical independent bending of the display. The page does not slide down as a whole.

Six transparent Blender Cycles renders provide the inside and cover bezels in two finishes. CSS 3D planes supply the visible sidewalls; the scene remains interactive HTML. The desert wallpaper is newly generated original artwork, not an extracted Apple asset.

Verification on the local preview included paused 0°, 90°, 145°, 165°, and 180° poses, both finishes, note continuity between cover and inner screens, all six loaded bezel images, no right-screen blur or vertical content transform, and a 390px responsive layout without horizontal overflow. JavaScript syntax and whitespace checks passed. Browser console inspection reported no application errors.


### Latest screenshot clarification (September 12, 9:34 AM)

The user requested a stationary blur shade and matching flat top/bottom spacing with no sharp cut. The current reconstruction therefore fixes the spatial blur mask in place, changes only blur strength during the reveal, compensates both vertical boundaries for perspective, and uses a broad eased alpha falloff into the dark glass margins. This supersedes the earlier moving reveal-mask and lower-edge-only implementation choices.


### Frame continuity correction

The live shell now uses rounded cross-sections through its thickness instead of disconnected top, bottom, and side strips. Bezel images inherit their face corner clipping, removing the square projections visible behind the rounded cover in the user’s 9:46 AM screenshots. Closed and nearly edge-on views were inspected after this change.
