import{W as f,S as b,O as z,T as g,V as _,N as p,d as w,M as E,R as C,D as M,e as A}from"./three.module-f9807762.js";import{q as S,o as I,a as j,c as T,h as R,F as D,k as d}from"./index-001d42e8.js";const P=d("canvas",{id:"canvas-webgl","backdrop-blur":"","bg-white":""},null,-1),Z=d("a",{href:"https://ykob.github.io/sketch-threejs/sketch/butterfly.html",target:"_blank",class:"text-zine-500 hover:text-blue-500 fixed z-100 bottom-2 left-2"},"The source code",-1),O={__name:"index",setup(F){const a=[];class h{constructor(r,o){this.uniforms={index:{type:"f",value:r},time:{type:"f",value:0},size:{type:"f",value:200},texture:{type:"t",value:o}},this.physicsRenderer=null,this.obj=this.createObj()}createObj(){const r=new w(200,100,24,12),o=new E(r,new C({uniforms:this.uniforms,vertexShader:`attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float index;
uniform float time;
uniform float size;

varying vec3 vPosition;
varying vec2 vUv;

void main() {
  float flapTime = radians(sin(time * 6.0 - length(position.xy) / size * 2.6 + index * 2.0) * 45.0 + 30.0);
  float hovering = cos(time * 2.0 + index * 3.0) * size / 16.0;
  vec3 updatePosition = vec3(
    cos(flapTime) * position.x,
    position.y + hovering,
    sin(flapTime) * abs(position.x) + hovering
  );

  vec4 mvPosition = modelViewMatrix * vec4(updatePosition, 1.0);

  vPosition = position;
  vUv = uv;

  gl_Position = projectionMatrix * mvPosition;
}
`,fragmentShader:`precision highp float;

uniform float index;
uniform float time;
uniform float size;
uniform sampler2D texture;

varying vec3 vPosition;
varying vec2 vUv;

//
// Description : Array and textureless GLSL 2D/3D/4D simplex
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise3(vec3 v)
  {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

// Permutations
  i = mod289(i);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients: 7x7 points over a square, mapped onto an octahedron.
// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
  }

vec3 convertHsvToRgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  vec4 texColor = texture2D(texture, vUv);

  float noise = snoise3(vPosition / vec3(size * 0.25) + vec3(0.0, 0.0, time));
  vec3 hsv = vec3(1.0 + noise * 0.2 + index * 0.7, 0.4, 1.0);
  vec3 rgb = convertHsvToRgb(hsv);

  gl_FragColor = vec4(rgb, 1.0) * texColor;
}`,depthWrite:!1,side:M,transparent:!0}));return o.rotation.set(-45*Math.PI/180,0,0),o}render(r,o){this.uniforms.time.value+=o,this.obj.position.z=this.obj.position.z>-900?this.obj.position.z-4:900}}const{width:v,height:x}=S();return I(()=>{function l(e){return e.setSize(v.value,x.value),r}function r(e){const t=Math.min(v.value/x.value/1.3333333333333333,1)*640,i=Math.min(x.value/v.value/(480/640),1)*480;e.left=t*-.5,e.right=t*.5,e.top=i*.5,e.bottom=i*-.5,e.updateProjectionMatrix()}function o(e,t,i,s){const m=s.getDelta();for(let c=0;c<a.length;c++)a[c].render(i,m);i.render(e,t),requestAnimationFrame(()=>o(e,t,i,s))}function y(){const e=document.getElementById("canvas-webgl"),t=new f({antialias:!1,canvas:e}),i=new b,s=new z(-1,1,1,-1,1,1e4),m=new A,c=new g;t.setClearColor(15658734,1),s.position.set(250,500,1e3),s.lookAt(new _),l(t)(s),R([v,x],()=>l(t)(s),{debounce:500}),c.crossOrigin="anonymous",c.load("https://zerdocs.oss-cn-shanghai.aliyuncs.com/tex.png",u=>{u.magFilter=p,u.minFilter=p;for(let n=0;n<12;n++)a[n]=new h(n,u),a[n].obj.position.set(((n+1)%3-1)*n*50,0,1800/12*n),i.add(a[n].obj);o(i,s,t,m)})}y()}),(l,r)=>(j(),T(D,null,[P,Z],64))}};export{O as default};
