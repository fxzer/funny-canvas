import{W as v,S as A,P as L,f as l,g as R,I as y,h as w,M as m,D as k,A as D,i as h}from"./three.module-f9807762.js";import{d as E,o as H,a as I,c as B}from"./index-001d42e8.js";const G={id:"webgl","wh-full":"","bg-black":""},O=E({__name:"index",setup(j){let p=0,n,e,a,o,i,r;H(()=>{_(),u()});function _(){var M;n=new v({antialias:!0,alpha:!0}),n.setPixelRatio(window.devicePixelRatio?window.devicePixelRatio:1),n.setSize(window.innerWidth,window.innerHeight),n.autoClear=!1,n.setClearColor(0,0),(M=document.getElementById("webgl"))==null||M.appendChild(n.domElement),e=new A,a=new L(75,window.innerWidth/window.innerHeight,1,1e3),a.position.z=400,e.add(a),o=new l,i=new l,r=new l,e.add(o),e.add(i),e.add(r);const g=new R(2,0),f=new y(7,1),z=new y(15,1),S=new w({color:16777215,flatShading:!0});for(let x=0;x<1e3;x++){const c=new m(g,S);c.position.set(Math.random()-.5,Math.random()-.5,Math.random()-.5).normalize(),c.position.multiplyScalar(90+Math.random()*700),c.rotation.set(Math.random()*2,Math.random()*2,Math.random()*2),r.add(c)}const P=new w({color:16777215,flatShading:!0}),W=new w({color:16777215,wireframe:!0,side:k}),d=new m(f,P);d.scale.x=d.scale.y=d.scale.z=16,o.add(d);const s=new m(z,W);s.scale.x=s.scale.y=s.scale.z=10,i.add(s);const C=new D(10066329);e.add(C);const t=[];t[0]=new h(16777215,1),t[0].position.set(1,0,0),t[1]=new h(1173691,1),t[1].position.set(.75,1,.5),t[2]=new h(8519881,1),t[2].position.set(-.75,-1,.5),e.add(t[0]),e.add(t[1]),e.add(t[2]),window.addEventListener("resize",b,!1)}function b(){a.aspect=window.innerWidth/window.innerHeight,a.updateProjectionMatrix(),n.setSize(window.innerWidth,window.innerHeight)}function u(){cancelAnimationFrame(p),p=requestAnimationFrame(u),r.rotation.x+=0,r.rotation.y-=.004,o.rotation.x-=.002,o.rotation.y-=.003,i.rotation.x-=.001,i.rotation.y+=.002,n.clear(),n.render(e,a)}return(g,f)=>(I(),B("div",G))}});export{O as default};