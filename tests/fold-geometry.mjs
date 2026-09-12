import assert from 'node:assert/strict';
import {innerDisplayProjection,coverDisplayProjection} from '../dist/fold-geometry.js';

const W=301,H=398;
function project(matrix,x,y){
 const w=matrix[3]*x+matrix[7]*y+matrix[15];
 assert.ok(w>0,'Display must never invert or cross a perspective pole');
 return {x:(matrix[0]*x+matrix[4]*y+matrix[12])/w,y:(matrix[1]*x+matrix[5]*y+matrix[13])/w};
}
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} differs from ${b}`);
for(const scale of [.28,.5,.83,1.12]){
 for(const angle of [0,45,90,115,145,165,180]){
  for(const eyeY of [199,215,300]){
   const {matrix}=innerDisplayProjection(angle,scale,eyeY);
   const sine=Math.sin((180-angle)*Math.PI/180),distance=1800/scale-4;
   // Evaluate final projected geometry, not just intermediate CSS coefficients.
   for(const edge of [0,H])for(const x of [0,75,150,225,W]){
    const p=project(matrix,x,edge);
    const finalY=eyeY+(p.y-eyeY)/(1-(W-p.x)*sine/distance);
    near(finalY,edge);
   }
   near(project(matrix,W,0).x,W);near(project(matrix,W,0).y,0);
   near(project(matrix,W,H).x,W);near(project(matrix,W,H).y,H);
   if(angle===180){near(project(matrix,0,0).y,0);near(project(matrix,0,H).y,H);}
  }
 }
}
for(const scale of [.28,.83,1.12])for(const angle of [0,15,35,60,85]){
 const eyeY=215,distance=1800/scale-4;
 const {matrix}=coverDisplayProjection(angle,scale,eyeY);
 for(const edge of [0,H])for(const x of [0,73,146,219,292]){
  const p=project(matrix,x,edge);
  const finalY=eyeY+(p.y-eyeY)/(1-p.x*Math.sin(angle*Math.PI/180)/distance);
  near(finalY,edge);
 }
 near(project(matrix,0,0).y,0);near(project(matrix,0,H).y,H);
 if(angle===0){near(project(matrix,292,0).y,0);near(project(matrix,292,H).y,H);}
}
console.log('Inner and cover geometry: both edges stay level, hinge corners stay pinned, and resting screens remain unchanged.');
