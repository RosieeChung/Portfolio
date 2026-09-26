(function(){
  "use strict";
  var grid=document.querySelector('.grid-bg'); if(!grid)return;
  var NS='http://www.w3.org/2000/svg';
  var svg=document.createElementNS(NS,'svg');
  svg.setAttribute('class','grid-vector');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');svg.setAttribute('shape-rendering','geometricPrecision');
  grid.insertBefore(svg,grid.firstChild);
  function el(name,attrs){var n=document.createElementNS(NS,name);Object.keys(attrs||{}).forEach(function(k){n.setAttribute(k,attrs[k]);});return n;}
  function draw(){
    var r=grid.getBoundingClientRect(),W=Math.max(1,r.width||innerWidth),H=Math.max(1,r.height||innerHeight),mobile=W<=820;
    var P=mobile?900:1180,poX=W*.5,poY=H*(mobile?.22:.24),left=W*(mobile?-.40:-.24),right=left,top=H*(mobile?.20:.25),bottom=H*(mobile?-.92:-.82);
    var planeW=W-left-right,planeH=H-top-bottom,scale=mobile?1.22:1.12,ang=(mobile?69:68)*Math.PI/180,sin=Math.sin(ang),cos=Math.cos(ang),tileW=mobile?104:128,tileH=mobile?60:74,slope=tileH/tileW;
    function project(x,y){var dx=(x-planeW/2)*scale,yy=y*scale*cos,z=y*scale*sin,den=Math.max(8,P-z),f=P/den,wx=W/2+dx,wy=top+yy;return{x:poX+(wx-poX)*f,y:poY+(wy-poY)*f};}
    var lo=0,hi=Math.min(planeH,(P*.90)/(scale*sin));for(var n=0;n<34;n++){var mid=(lo+hi)/2;if(project(planeW/2,mid).y<H*1.10)lo=mid;else hi=mid;}var yMax=Math.max(tileH*4,lo);
    svg.setAttribute('viewBox','0 0 '+W+' '+H);svg.setAttribute('preserveAspectRatio','none');while(svg.firstChild)svg.removeChild(svg.firstChild);
    var defs=el('defs'),grad=el('linearGradient',{id:'gridLineFade',x1:'0',y1:String(H*.20),x2:'0',y2:String(H),gradientUnits:'userSpaceOnUse'});
    /* V85: floor pulled down (.085→.03) and ceiling raised (.33→.42) so the
       fade reads all the way to "basically gone" far away instead of
       stalling at a visible plateau, while close lines carry more color. */
    [['0%','#6f91b5','0.03'],['30%','#6f91b5','0.14'],['66%','#6f91b5','0.27'],['100%','#6f91b5','0.42']].forEach(function(s){grad.appendChild(el('stop',{offset:s[0],'stop-color':s[1],'stop-opacity':s[2]}));});defs.appendChild(grad);svg.appendChild(defs);
    var lg=el('g',{fill:'none',stroke:'url(#gridLineFade)','stroke-width':'1.45','stroke-linecap':'round','vector-effect':'non-scaling-stroke'}),dg=el('g',{fill:'#6f96cf'});svg.appendChild(lg);svg.appendChild(dg);
    function seg(sign,c){var pts=[];function add(x,y){if(x>=-.01&&x<=planeW+.01&&y>=-.01&&y<=yMax+.01)pts.push([x,y]);}add(0,c);add(planeW,sign*slope*planeW+c);add((0-c)/(sign*slope),0);add((yMax-c)/(sign*slope),yMax);var u=[];pts.forEach(function(p){if(!u.some(function(q){return Math.abs(p[0]-q[0])<.1&&Math.abs(p[1]-q[1])<.1;}))u.push(p);});return u.length>=2?[u[0],u[1]]:null;}
    var cp=[],cn=[];for(var a=Math.floor((-slope*planeW-tileH)/tileH)*tileH;a<=yMax+tileH;a+=tileH)cp.push(a);for(var b=-tileH;b<=yMax+slope*planeW+tileH;b+=tileH)cn.push(b);
    function drawFamily(list,sign){list.forEach(function(c){var s=seg(sign,c);if(!s)return;var p=project(s[0][0],s[0][1]),q=project(s[1][0],s[1][1]);lg.appendChild(el('line',{x1:p.x.toFixed(2),y1:p.y.toFixed(2),x2:q.x.toFixed(2),y2:q.y.toFixed(2)}));});}drawFamily(cp,1);drawFamily(cn,-1);
    /* V85: dots used to have an opacity floor (.20) right up to a hard skip
       boundary (p.y<H*.20), so the farthest visible row was still clearly
       there and then nothing beyond it — a visible edge, not a fade. The
       skip boundary now sits earlier (H*.10) than where the fade curve
       reaches ~0 (H*.20), so the last few rows drawn are already faded to
       near-invisible before they stop being drawn at all. Ceiling raised
       for more color up close; radius grows from near-nothing to a bigger
       max so distance reads through size too, not just opacity. */
    cp.forEach(function(a){cn.forEach(function(b){var x=(b-a)/(2*slope),y=(a+b)/2;if(x<0||x>planeW||y<0||y>yMax)return;var p=project(x,y);if(p.x<-4||p.x>W+4||p.y<H*.10||p.y>H+4)return;var t=Math.max(0,Math.min(1,(p.y-H*.20)/(H*.80))),op=(.66*Math.pow(t,1.2)).toFixed(3),rr=(0.5+1.05*t).toFixed(2);dg.appendChild(el('circle',{cx:p.x.toFixed(2),cy:p.y.toFixed(2),r:rr,opacity:op}));});});
  }
  var raf=0;function schedule(){if(raf)cancelAnimationFrame(raf);raf=requestAnimationFrame(function(){raf=0;draw();});}draw();addEventListener('resize',schedule,{passive:true});if(window.ResizeObserver){var ro=new ResizeObserver(schedule);ro.observe(grid);}
})();
