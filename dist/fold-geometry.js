// Keep both display boundaries level while the surrounding shell tilts.
// This is a visual reconstruction of the supplied reference, not a hardware API.
export function innerDisplayProjection(angle, scale, vanishingY = 199, perspective = 1800, width = 301) {
 const height = 398;
 const radians = (180 - Math.max(0, Math.min(180, angle))) * Math.PI / 180;
 const localPerspective = perspective / scale - 4;
 const depth = width * Math.sin(radians);
 const bottom = Math.max(0, (height - vanishingY) * depth / localPerspective);
 const top = Math.max(0, vanishingY * depth / localPerspective);
 const k = 1 - (top + bottom) / height;
 // Project the outer edge inward, with both hinge corners held exactly fixed.
 const matrix = [k, -top / width, 0, (k - 1) / width,
                 0, k, 0, 0,
                 0, 0, 1, 0,
                 0, top, 0, 1];
 return {matrix, top, bottom};
}

export function coverDisplayProjection(angle, scale, vanishingY = 199, perspective = 1800) {
 const width=292,height=398;
 const {top,bottom}=innerDisplayProjection(180-angle,scale,vanishingY,perspective,width);
 const k=1-(top+bottom)/height;
 // The front cover's hinge is on its left: mirror the inner-screen correction.
 const matrix=[1/k,top/(width*k),0,(1-k)/(width*k),
               0,1,0,0,0,0,1,0,0,0,0,1];
 return {matrix,top,bottom};
}
