import{u as A}from"./useCanvas-b9fb9ced.js";import{o as E,a as F,c as $}from"./index-001d42e8.js";const z={__name:"index",setup(q){const{canvasRef:P,context:s,width:_}=A();let g=0;const c=400;let u=0,o=[];const k=p();let y=Math.random()<.3,f=3,d=!0;function v(e,t,a){return a?Math.floor(Math.random()*Math.random()*(t-e))+e:Math.floor(Math.random()*(t-e))+e}function p(){return v(0,360)}class m{constructor(t,a,i,n,l,h){this.x=t,this.y=a,this.xp=i,this.yp=n,this.radius=l,this.pc=h,this.c=[]}drawCircle(t){s.value.beginPath(),s.value.moveTo(this.x+this.radius*t,this.y),s.value.arc(this.x,this.y,this.radius*t,0,Math.PI*2),s.value.fillStyle=`hsl(${k+5*this.radius},90%,50%)`,s.value.fill()}}class S{constructor(){this.car=[],this.to=-v(0,400)}canDrawCurve(){const t=this.to+u;if(s.value.setLineDash([Math.max(1,t),4e3]),s.value.stroke(this.path),t>this.len+40)return this.car[this.car.length-1].drawCircle(.8),t<=this.len+120;if(t>this.len){const a=.8*(t-this.len)/40;return this.car[this.car.length-1].drawCircle(a),!0}else return!0}addCurveCircle(t){t.pc&&(this.car.unshift(t.pc),this.addCurveCircle(t.pc))}setPath(){this.len=0,this.path=new Path2D,this.path.moveTo(0,0),this.path.lineTo(this.car[1].xp,this.car[1].yp),this.len+=this.car[0].radius;for(let t=1;t<this.car.length-1;t++)this.path.bezierCurveTo(this.car[t].x,this.car[t].y,this.car[t].x,this.car[t].y,this.car[t+1].xp,this.car[t+1].yp),this.len+=2*this.car[t].radius;this.path.lineTo(this.car[this.car.length-1].x,this.car[this.car.length-1].y),this.len+=this.car[this.car.length-1].radius}}let r=[new m(0,0,0,0,50,0,0)];function b(e,t,a){s.value.beginPath(),s.value.arc(e,t,5,0,Math.PI*2),s.value.closePath(),s.value.fillStyle=a||"red",s.value.fill()}function I(e,t,a){if((e*e+t*t)**.5>c-a)return!1;for(let i=0;i<r.length;i++){const n=a+r[i].radius,l=r[i].x-e,h=r[i].y-t;if(!(Math.abs(l)>n||Math.abs(h)>n)&&(l*l+h*h)**.5+1<n)return!1}return!0}function T(e){const t=Math.PI*2*Math.random(),a=y?r[r.length-1-v(0,r.length,!0)]:r[v(0,r.length)],i=a.x+(a.radius+e)*Math.cos(t),n=a.y+(a.radius+e)*Math.sin(t);if(I(i,n,e)){const l=a.x+a.radius*Math.cos(t),h=a.y+a.radius*Math.sin(t),w=new m(i,n,l,h,e,a);return a.c.push(w),r.push(w),!0}return!1}function D(){s.value.clearRect(-c,-c,2*c,2*c);let e=0;for(let t=0;t<o.length;t++)o[t].canDrawCurve()&&e++;return b(0,0,"silver"),e}function M(){r=[new m(0,0,0,0,50,0,0)];for(let e=0;e<2e3;e++){let t=10;e<20?t=42:e<100?t=34:e<300?t=26:e<1e3&&(t=18),T(t)}o=[];for(let e=0;e<r.length;e++)if(r[e].c.length===0){const t=new S;t.car=[r[e]],t.addCurveCircle(r[e]),t.setPath(),o.push(t)}}function C(){cancelAnimationFrame(g),!d&&(u+=f,(!D()||u<0)&&(f===3?f=-8:(s.value.strokeStyle=`hsla(${p()},90%,60%,0.6)`,f=3,u=0,y=Math.random()<.3,M())),g=requestAnimationFrame(C))}function x(){d&&requestAnimationFrame(C),d=!d}function R(){s.value.translate(_.value/2,c),s.value.lineCap="round",s.value.fillStyle="green",s.value.lineWidth=5,s.value.strokeStyle=`hsla(${p()},90%,60%,0.6)`}return E(()=>{addEventListener("click",x,!1),M(),R(),x()}),(e,t)=>(F(),$("canvas",{ref_key:"canvasRef",ref:P},null,512))}};export{z as default};