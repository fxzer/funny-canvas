import{d as F,r as D,a as O,c as T,k as A,F as H,x as N,y as j,j as B,z as S,_ as U}from"./index-001d42e8.js";if(!M)var M={map:function(l,a){var d={};return a?l.map(function(v,h){return d.index=h,a.call(d,v)}):l.slice()},naturalOrder:function(l,a){return l<a?-1:l>a?1:0},sum:function(l,a){var d={};return l.reduce(a?function(v,h,m){return d.index=m,v+a.call(d,h)}:function(v,h){return v+h},0)},max:function(l,a){return Math.max.apply(null,a?M.map(l,a):l)}};var G=function(){var l=5,a=8-l,d=1e3;function v(r,t,o){return(r<<2*l)+(t<<l)+o}function h(r){var t=[],o=!1;function u(){t.sort(r),o=!0}return{push:function(n){t.push(n),o=!1},peek:function(n){return o||u(),n===void 0&&(n=t.length-1),t[n]},pop:function(){return o||u(),t.pop()},size:function(){return t.length},map:function(n){return t.map(n)},debug:function(){return o||u(),t}}}function m(r,t,o,u,n,e,f){var c=this;c.r1=r,c.r2=t,c.g1=o,c.g2=u,c.b1=n,c.b2=e,c.histo=f}function _(){this.vboxes=new h(function(r,t){return M.naturalOrder(r.vbox.count()*r.vbox.volume(),t.vbox.count()*t.vbox.volume())})}function x(r,t){if(t.count()){var o=t.r2-t.r1+1,u=t.g2-t.g1+1,n=M.max([o,u,t.b2-t.b1+1]);if(t.count()==1)return[t.copy()];var e,f,c,s,g=0,p=[],b=[];if(n==o)for(e=t.r1;e<=t.r2;e++){for(s=0,f=t.g1;f<=t.g2;f++)for(c=t.b1;c<=t.b2;c++)s+=r[v(e,f,c)]||0;p[e]=g+=s}else if(n==u)for(e=t.g1;e<=t.g2;e++){for(s=0,f=t.r1;f<=t.r2;f++)for(c=t.b1;c<=t.b2;c++)s+=r[v(f,e,c)]||0;p[e]=g+=s}else for(e=t.b1;e<=t.b2;e++){for(s=0,f=t.r1;f<=t.r2;f++)for(c=t.g1;c<=t.g2;c++)s+=r[v(f,c,e)]||0;p[e]=g+=s}return p.forEach(function(y,w){b[w]=g-y}),function(y){var w,z,C,q,k,I=y+"1",E=y+"2",$=0;for(e=t[I];e<=t[E];e++)if(p[e]>g/2){for(C=t.copy(),q=t.copy(),k=(w=e-t[I])<=(z=t[E]-e)?Math.min(t[E]-1,~~(e+z/2)):Math.max(t[I],~~(e-1-w/2));!p[k];)k++;for($=b[k];!$&&p[k-1];)$=b[--k];return C[E]=k,q[I]=C[E]+1,[C,q]}}(n==o?"r":n==u?"g":"b")}}return m.prototype={volume:function(r){var t=this;return t._volume&&!r||(t._volume=(t.r2-t.r1+1)*(t.g2-t.g1+1)*(t.b2-t.b1+1)),t._volume},count:function(r){var t=this,o=t.histo;if(!t._count_set||r){var u,n,e,f=0;for(u=t.r1;u<=t.r2;u++)for(n=t.g1;n<=t.g2;n++)for(e=t.b1;e<=t.b2;e++)f+=o[v(u,n,e)]||0;t._count=f,t._count_set=!0}return t._count},copy:function(){var r=this;return new m(r.r1,r.r2,r.g1,r.g2,r.b1,r.b2,r.histo)},avg:function(r){var t=this,o=t.histo;if(!t._avg||r){var u,n,e,f,c=0,s=1<<8-l,g=0,p=0,b=0;for(n=t.r1;n<=t.r2;n++)for(e=t.g1;e<=t.g2;e++)for(f=t.b1;f<=t.b2;f++)c+=u=o[v(n,e,f)]||0,g+=u*(n+.5)*s,p+=u*(e+.5)*s,b+=u*(f+.5)*s;t._avg=c?[~~(g/c),~~(p/c),~~(b/c)]:[~~(s*(t.r1+t.r2+1)/2),~~(s*(t.g1+t.g2+1)/2),~~(s*(t.b1+t.b2+1)/2)]}return t._avg},contains:function(r){var t=this,o=r[0]>>a;return gval=r[1]>>a,bval=r[2]>>a,o>=t.r1&&o<=t.r2&&gval>=t.g1&&gval<=t.g2&&bval>=t.b1&&bval<=t.b2}},_.prototype={push:function(r){this.vboxes.push({vbox:r,color:r.avg()})},palette:function(){return this.vboxes.map(function(r){return r.color})},size:function(){return this.vboxes.size()},map:function(r){for(var t=this.vboxes,o=0;o<t.size();o++)if(t.peek(o).vbox.contains(r))return t.peek(o).color;return this.nearest(r)},nearest:function(r){for(var t,o,u,n=this.vboxes,e=0;e<n.size();e++)((o=Math.sqrt(Math.pow(r[0]-n.peek(e).color[0],2)+Math.pow(r[1]-n.peek(e).color[1],2)+Math.pow(r[2]-n.peek(e).color[2],2)))<t||t===void 0)&&(t=o,u=n.peek(e).color);return u},forcebw:function(){var r=this.vboxes;r.sort(function(n,e){return M.naturalOrder(M.sum(n.color),M.sum(e.color))});var t=r[0].color;t[0]<5&&t[1]<5&&t[2]<5&&(r[0].color=[0,0,0]);var o=r.length-1,u=r[o].color;u[0]>251&&u[1]>251&&u[2]>251&&(r[o].color=[255,255,255])}},{quantize:function(r,t){if(!r.length||t<2||t>256)return!1;var o=function(s){var g,p=new Array(1<<3*l);return s.forEach(function(b){g=v(b[0]>>a,b[1]>>a,b[2]>>a),p[g]=(p[g]||0)+1}),p}(r);o.forEach(function(){});var u=function(s,g){var p,b,y,w=1e6,z=0,C=1e6,q=0,k=1e6,I=0;return s.forEach(function(E){(p=E[0]>>a)<w?w=p:p>z&&(z=p),(b=E[1]>>a)<C?C=b:b>q&&(q=b),(y=E[2]>>a)<k?k=y:y>I&&(I=y)}),new m(w,z,C,q,k,I,g)}(r,o),n=new h(function(s,g){return M.naturalOrder(s.count(),g.count())});function e(s,g){for(var p,b=s.size(),y=0;y<d;){if(b>=g||y++>d)return;if((p=s.pop()).count()){var w=x(o,p),z=w[0],C=w[1];if(!z)return;s.push(z),C&&(s.push(C),b++)}else s.push(p),y++}}n.push(u),e(n,.75*t);for(var f=new h(function(s,g){return M.naturalOrder(s.count()*s.volume(),g.count()*g.volume())});n.size();)f.push(n.pop());e(f,t);for(var c=new _;f.size();)c.push(f.pop());return c}}}().quantize,L=function(l){this.canvas=document.createElement("canvas"),this.context=this.canvas.getContext("2d"),this.width=this.canvas.width=l.naturalWidth,this.height=this.canvas.height=l.naturalHeight,this.context.drawImage(l,0,0,this.width,this.height)};L.prototype.getImageData=function(){return this.context.getImageData(0,0,this.width,this.height)};var P=function(){};P.prototype.getColor=function(l,a){return a===void 0&&(a=10),this.getPalette(l,5,a)[0]},P.prototype.getPalette=function(l,a,d){var v=function(x){var r=x.colorCount,t=x.quality;if(r!==void 0&&Number.isInteger(r)){if(r===1)throw new Error("colorCount should be between 2 and 20. To get one color, call getColor() instead of getPalette()");r=Math.max(r,2),r=Math.min(r,20)}else r=10;return(t===void 0||!Number.isInteger(t)||t<1)&&(t=10),{colorCount:r,quality:t}}({colorCount:a,quality:d}),h=new L(l),m=function(x,r,t){for(var o,u,n,e,f,c=x,s=[],g=0;g<r;g+=t)u=c[0+(o=4*g)],n=c[o+1],e=c[o+2],((f=c[o+3])===void 0||f>=125)&&(u>250&&n>250&&e>250||s.push([u,n,e]));return s}(h.getImageData().data,h.width*h.height,v.quality),_=G(m,v.colorCount);return _?_.palette():null},P.prototype.getColorFromUrl=function(l,a,d){var v=this,h=document.createElement("img");h.addEventListener("load",function(){var m=v.getPalette(h,5,d);a(m[0],l)}),h.src=l},P.prototype.getImageData=function(l,a){var d=new XMLHttpRequest;d.open("GET",l,!0),d.responseType="arraybuffer",d.onload=function(){if(this.status==200){var v=new Uint8Array(this.response);i=v.length;for(var h=new Array(i),m=0;m<v.length;m++)h[m]=String.fromCharCode(v[m]);var _=h.join(""),x=window.btoa(_);a("data:image/png;base64,"+x)}},d.send()},P.prototype.getColorAsync=function(l,a,d){var v=this;this.getImageData(l,function(h){var m=document.createElement("img");m.addEventListener("load",function(){var _=v.getPalette(m,5,d);a(_[0],this)}),m.src=h})};const R="/funny-canvas/assets/1-22eeea70.png",V="/funny-canvas/assets/2-e710d222.png",W="/funny-canvas/assets/3-040e6532.png",X="/funny-canvas/assets/4-b23b402e.png",J={class:"grid grid-cols-2 gap-8 w-1/2 h-1/2"},K=["src","onMouseenter"],Q=F({__name:"index",setup(l){const a=[R,V,W,X],d=D(0),v=new P,h=D();function m(_,x){const r=_==null?void 0:_.target,t=v.getPalette(r,3),[o,u,n]=t.map(e=>`rgb(${e[0]}, ${e[1]}, ${e[2]})`);h.value=`linear-gradient(to bottom, ${o}, ${u}, ${n})`,d.value=x}return(_,x)=>(O(),T("div",{style:S({background:B(h)}),class:"fixed h-screen w-full flex-center"},[A("div",J,[(O(),T(H,null,N(a,(r,t)=>A("img",{key:t,src:r,class:j(["hover:scale-105 duration-300 border-2 border-white",B(d)===t?"":"opacity-40"]),onMouseenter:o=>m(o,t)},null,42,K)),64))])],4))}});const Z=U(Q,[["__scopeId","data-v-c06d5772"]]);export{Z as default};