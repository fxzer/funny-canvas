var g=Object.defineProperty;var M=(r,s,n)=>s in r?g(r,s,{enumerable:!0,configurable:!0,writable:!0,value:n}):r[s]=n;var i=(r,s,n)=>(M(r,typeof s!="symbol"?s+"":s,n),n);import{c as f}from"./colors-78f22cf3.js";import{u as y}from"./useCanvas-b9fb9ced.js";import{d as D,o as Y,a as _,c as k}from"./index-001d42e8.js";const L=D({__name:"index",setup(r){const{canvasRef:s,context:n}=y();class m{constructor(){i(this,"canvas");i(this,"ctx");i(this,"w");i(this,"h");i(this,"speed");i(this,"lineData");i(this,"maxHeight");i(this,"active");i(this,"heartData");i(this,"heartR");i(this,"dt");i(this,"x");i(this,"y");i(this,"startX");i(this,"startY");i(this,"centerY");i(this,"rid");this.canvas=null,this.ctx=null,this.w=0,this.h=0,this.speed=5,this.lineData=[],this.maxHeight=50,this.active=0,this.heartData=[],this.heartR=10,this.dt=0,this.x=0,this.y=0,this.startX=0,this.startY=0,this.centerY=0,this.rid=0,this.init()}init(){this.canvas=s.value,this.ctx=n.value,window.addEventListener("resize",this.reset.bind(this)),window.addEventListener("click",this.speedUp.bind(this)),this.render()}speedUp(){this.speed+=3,this.speed>15&&(this.speed=5),this.render()}reset(){this.w=this.canvas.width=this.ctx.width=window.innerWidth,this.h=this.canvas.height=this.ctx.height=window.innerHeight,this.centerY=this.h/2+this.heartR*Math.PI*2,this.y=this.centerY,this.clear()}clear(){this.heartData.length=this.lineData.length=0,this.active=0,this.x=0,this.getHeart(),this.ctx.clearRect(0,0,this.w,this.h)}render(){this.reset(),this.step()}getHeart(){let t=Math.PI+.5;const e=2*Math.PI-1,c=this.speed/100;let o=0,a=0;const p=this.heartR;for(let d=0;d<Math.ceil(e/c);d++)o=16*Math.sin(t)**3,a=13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t),t+=c,o*=p,a=-a*p-p*Math.PI*4,a<0&&this.heartData.push({x:o,y:a})}drawTopLine(){const{ctx:t,w:e,x:c,y:o,maxHeight:a,lineData:p,speed:d,active:w,centerY:v}=this;p.unshift({x:c,y:o});let h=c+Math.random()*d+d,l=v;if(h>e*.05&&h<e*.95){if(Math.random()>.8&&w===0&&(l+=Math.random()*a*2-a),h>e*.25&&this.active===0&&(this.active=1),h>e*.38&&this.active===1&&(this.active=2,this.startX=h+d*3,this.startY=v),this.heartData.length>0&&this.active===2){const x=this.heartData.shift();h=this.startX+x.x,l=this.startY+x.y,l>this.startY&&(l=this.startY)}h>.55*e&&this.heartData.length===0&&this.active===2&&(this.active=0)}t.lineWidth=3,t.strokeStyle="rgba(255,255,255,.5)",t.lineJoin="round",t.lineCap="round",t.shadowBlur=20,t.beginPath(),t.moveTo(c,o),t.lineTo(h,l),t.stroke(),t.closePath(),this.x=h,this.y=l}drawLine(){const{ctx:t,lineData:e}=this;e.length<2||(t.lineWidth=3,t.lineJoin="round",t.lineCap="round",t.shadowBlur=20,t.strokeStyle=f[Math.floor(Math.random()*f.length)],t.beginPath(),t.moveTo(e[1].x,e[1].y),t.lineTo(e[0].x,e[0].y),t.stroke(),t.closePath())}step(){cancelAnimationFrame(this.rid),this.rid=requestAnimationFrame(this.step.bind(this)),this.dt%1===0&&(this.drawLine(),this.drawTopLine()),this.x>this.w+this.speed&&this.clear(),this.dt++}}return Y(()=>{new m}),(u,t)=>(_(),k("canvas",{id:"earth",ref_key:"canvasRef",ref:s},null,512))}});export{L as default};