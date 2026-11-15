/* Last Signal v2: scroll engine, world layer, trace rail. No libraries.
   Scroll position is the clock and nothing text-bearing is smoothed, so words and images are always exactly where the hand put them.
   Each .act is a tall section with a sticky stage. Inside an act, y is the distance scrolled since it pinned, in screen heights.
   Cues: data-at="from to [rampIn rampOut]" in screen heights. One value = fade in and hold. A rampIn of 0 at from 0 is a "greet" cue
   (visible while the stage slides in, so no stage arrives empty). See TIMELINE.md. ?debug=1 then __audit() checks the timing. */
(function(){
  'use strict';
  var D=window.LAST_SIGNAL, SND=window.LastSignalAudio;
  var $=function(s,r){return (r||document).querySelector(s);};
  var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));};
  var clamp=function(v,a,b){a=a===undefined?0:a;b=b===undefined?1:b;return Math.min(b,Math.max(a,v));};
  var ease=function(t){return t*t*(3-2*t);};
  var rm=(window.matchMedia('(prefers-reduced-motion: reduce)').matches&&!/[?&]rm=0/.test(location.search))||/[?&]rm=1/.test(location.search);  // ?rm=0 forces the full scroll version even if the system asks for reduced motion  // ?rm=1 previews the reduced-motion page
  if(rm) document.documentElement.classList.add('rm');

  var RAMP=0.14;                              // default fade length, screen heights
  var AU_S=499.004784, DAY=86400000;
  var vh=innerHeight, vw=innerWidth, dpr=Math.min(window.devicePixelRatio||1,2);
  var storyMax=1;

  function utcDay(s){var p=s.split('-');return Date.UTC(+p[0],+p[1]-1,+p[2]);}
  function daysSince(s){var n=new Date();var t=Date.UTC(n.getUTCFullYear(),n.getUTCMonth(),n.getUTCDate());return Math.max(0,Math.floor((t-utcDay(s))/DAY));}
  function fmt(n){return n.toLocaleString('en-US');}
  var byId={}; D.machines.forEach(function(m){byId[m.id]=m;});
  var ORDER=['apollo11','apollo12','opportunity','insight','ingenuity','pioneer10'];

  /* ---------- acts and cues ---------- */
  var acts=$$('.act').map(function(el){
    /* k: visual windows below were authored for the original span; data-k stretches them to the retimed span */
    return {el:el,id:el.id,span:parseFloat(el.dataset.span),k:parseFloat(el.dataset.k)||1,
      cues:$$('[data-at]',el).map(function(c){
        var v=c.dataset.at.trim().split(/\s+/).map(Number);
        return {el:c,f:v[0],t:v.length>1?v[1]:undefined,ri:v[2]!==undefined?v[2]:RAMP,ro:v[3]!==undefined?v[3]:RAMP,silent:c.hasAttribute('data-silent'),o:0};
      }),
      top:0,h:0,tv:1,y:0};
  });
  var actById={}; acts.forEach(function(a){actById[a.id]=a;});
  var zones=[];

  function cueOpacity(y,c){
    if(c.t===undefined) return ease(clamp((y-c.f)/RAMP));
    var a=c.ri<=0?(y>=c.f?1:0):clamp((y-c.f)/c.ri);
    var b=c.ro<=0?(y<=c.t+1e-6?1:0):clamp((c.t-y)/c.ro);
    return ease(a)*ease(b);
  }

  function layout(){
    vh=innerHeight; vw=innerWidth;
    document.documentElement.style.setProperty('--vh',vh+'px');
    if(!rm) acts.forEach(function(a){a.el.style.height=(a.span*vh)+'px';});
    var sy=window.scrollY;
    acts.forEach(function(a){var r=a.el.getBoundingClientRect();a.top=r.top+sy;a.h=r.height;a.tv=Math.max((a.h-vh)/vh,0.0001);});
    zones=$$('[data-machine]').map(function(el){var r=el.getBoundingClientRect();return {el:el,machine:el.dataset.machine,top:r.top+sy,bottom:r.top+sy+r.height};});
    var src=$('#sources'); storyMax=Math.max(1,(src.getBoundingClientRect().top+sy)-vh);
    sizeCanvas(); buildMarkers(); initStars();
  }

  /* ---------- per-act behaviour: y is screen heights since the act pinned, tv its total travel ---------- */
  var nightCount=$('#nightCount'), flightCount=$('#flightCount'), plate=$('#plate'), plateImg=$('#plate img'), rail=$('#rail');
  var ingImg=$('#ingImg'), pulse=0;
  var sgFr=$$('.sg-fr'), sgIm=sgFr.map(function(f){return f.querySelector('.sg-im');}), sgImg=sgFr.map(function(f){return f.querySelector('.sg-im img');}), sgYr=sgFr.map(function(f){return f.querySelector('.sg-yr');}), sgTrack=$('.sg-track'), sgPath=$('.sg-path');
  var sendBtn=$('#sendBtn'), sendOut=$('#sendOut'), sentAt=0, SEND_MS=6500;
  var N11=daysSince(byId.apollo11.last);
  var U={
    'a-apollo11':function(y,a){
      var boot=$('.bg-boot',a.el), wrap=$('.bg-aldrin-wrap',a.el), al=$('.bg-aldrin',a.el);
      var rev=ease(clamp((y-0.85)/0.35));
      boot.style.transform='scale('+(1.18-0.18*clamp(y/a.tv))+')';
      boot.style.opacity=String(1-0.55*rev);
      wrap.style.clipPath='inset(0 0 0 '+((1-rev)*100)+'%)';
      al.style.transform='scale('+(1.1-0.1*clamp((y-0.85)/(a.tv-0.85)))+')';
    },
    'a-signal':function(y){
      /* frame i is fully open at y=i. It opens like a shutter over the half screen before, drifts slowly, and its year slides in just after the shutter starts.
         The signal line is one tall track that moves up with the scroll and is drawn down to the bottom edge of the screen. */
      for(var i=0;i<sgFr.length;i++){
        var t=i===0?1:ease(clamp((y-(i-0.5))/0.5)), iy=i===0?1:ease(clamp((y-(i-0.45))/0.4));
        var v=(20*(1-t)).toFixed(2), h=(9*(1-t)).toFixed(2), d=clamp((y-(i-0.5))/1.5);
        sgFr[i].style.visibility=(i===0||t>0.001)?'visible':'hidden';
        sgIm[i].style.clipPath='inset('+v+'% '+h+'% '+v+'% '+h+'%)';
        if(sgImg[i]) sgImg[i].style.transform='scale('+(1.2-0.2*d).toFixed(4)+') translateY('+(-4+8*d).toFixed(3)+'%)';
        if(sgYr[i]){ sgYr[i].style.opacity=String(iy); sgYr[i].style.translate=((1-iy)*-70).toFixed(1)+'px 0'; }
      }
      sgTrack.style.transform='translate3d(0,'+(-y*vh).toFixed(1)+'px,0)';
    },
    'a-night':function(y){ nightCount.textContent=fmt(Math.round(N11*ease(clamp((y-0.05)/0.6)))); },
    'a-mars':function(y,a){
      var ov=Math.max(0,rail.scrollWidth-vw);
      rail.style.transform='translate3d('+(-ov*clamp((y-0.1)/(a.tv-0.2)))+'px,0,0)';
    },
    'a-grief':function(y,a){ $('.thumbs',a.el).style.scale=String(1+0.2*clamp(y/a.tv)); },
    'a-insight':function(y,a){
      var img=$('.bg-insight',a.el), r=ease(clamp(y/0.5));
      img.style.clipPath='inset(0 0 '+((1-r)*100)+'% 0)';
      img.style.transform='scale('+(1.12-0.12*clamp(y/a.tv))+')';
    },
    'a-ingenuity':function(y){
      /* the helicopter sits at about (910,520) of a 1920x1412 photo shown with object-fit: cover */
      var s=Math.max(vw/1920,vh/1412),dw=1920*s,dh=1412*s;
      ingImg.style.transformOrigin=((vw-dw)/2+910*s)+'px '+((vh-dh)/2+520*s)+'px';
      ingImg.style.transform='scale('+(1+2.5*ease(clamp((y-0.2)/1.2)))+')';
      flightCount.textContent=String(Math.round(72*ease(clamp((y-0.5)/0.35))));
    },
    'a-pioneer':function(y,a){
      plate.style.opacity=String(ease(clamp((y-0.08)/0.2))*(1-ease(clamp((y-1.3)/0.2))));
      plateImg.style.transform='scale('+(1+2.5*ease(clamp((y-0.15)/1.4)))+')';
      pulse=ease(clamp((a.y-2.6)/0.2));   /* raw scroll position: starts with the "14 November 2026" line */
    }
  };

  /* ---------- flow section (Apollo 12) ---------- */
  var flowFig=$('.flow-fig img'), a12days=$('#a12days'), oppDays=$('#oppDays');
  a12days.textContent=fmt(daysSince(byId.apollo12.last));
  oppDays.textContent=fmt(daysSince(byId.opportunity.last));
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('seen');io.unobserve(e.target);}});},{threshold:.18});
    $$('.seen-fx').forEach(function(n){io.observe(n);});
  } else { $$('.seen-fx').forEach(function(n){n.classList.add('seen');}); }

  /* ---------- Pioneer numbers (computed, not typed) ---------- */
  /* distance for the visitor's UTC day from the saved Horizons table; outside the table, the nearest listed day is used */
  var pdIdx=(function(){var t=D.pioneerDaily, s0=Date.UTC(2026,10,1), n=Math.floor((Date.now()-s0)/DAY);return Math.max(0,Math.min(t.au.length-1,n));})();
  var pdDate=new Date(Date.UTC(2026,10,1)+pdIdx*DAY).toISOString().slice(0,10);
  var au=D.pioneerDaily.au[pdIdx], hours=au*AU_S/3600;
  $('#auNow').textContent=String(Math.round(au));
  $('#delayNow').textContent=hours.toFixed(1)+' hours';

  /* ---------- ending list, receipts ---------- */
  (function(){
    var ul=$('#endings'), keys=Object.keys(D.endings);
    keys.forEach(function(k){
      var names=D.machines.filter(function(m){return m.ending===k;}).map(function(m){return m.name.replace(' EASEP','').replace(' ALSEP','');});
      var li=document.createElement('li'), s=document.createElement('span'), b=document.createElement('b');
      s.textContent=names.join(', '); b.textContent=D.endings[k].label;
      var ls=document.createElement('i'); ls.className='lesson'; ls.textContent=D.endings[k].lesson;
      li.appendChild(s); li.appendChild(b); li.appendChild(ls); ul.appendChild(li);
    });
    var host=$('#receipts');
    ORDER.forEach(function(id){
      var m=byId[id], d=document.createElement('details'), sm=document.createElement('summary');
      sm.textContent=m.name+', last contact '+m.last; d.appendChild(sm);
      m.receipts.forEach(function(r){
        var q=document.createElement('blockquote'); q.textContent='“'+r[1]+'”';
        var sp=document.createElement('span'); sp.className='src'; sp.textContent='from saved page: '+r[0]; q.appendChild(sp); d.appendChild(q);
      });
      var lk=document.createElement('p'); lk.className='links';
      m.links.forEach(function(l,i){var a=document.createElement('a');a.href=l[1];a.textContent=l[0];a.rel='noopener';lk.appendChild(a);if(i<m.links.length-1)lk.appendChild(document.createTextNode(' · '));});
      d.appendChild(lk); host.appendChild(d);
    });
    var hz=document.createElement('p'); hz.className='body'; hz.style.marginTop='1rem';
    hz.appendChild(document.createTextNode('Pioneer 10 distance: NASA/JPL Horizons, '));
    var ha=document.createElement('a'); ha.href='https://ssd.jpl.nasa.gov/horizons/'; ha.textContent='ssd.jpl.nasa.gov/horizons'; ha.rel='noopener'; hz.appendChild(ha);
    hz.appendChild(document.createTextNode(', about '+au+' AU from Earth on '+pdDate+' (daily table saved from Horizons). One-way light time is that distance times about 499 seconds per AU.'));
    host.appendChild(hz);
  })();

  /* ---------- HUD ---------- */
  var hudName=$('#hudName'), hudDays=$('#hudDays'), lastZone=null;
  function setHud(machine){
    if(machine===lastZone) return; lastZone=machine;
    if(!machine){hudName.textContent='Last Signal';hudDays.textContent='';return;}
    var m=byId[machine]; hudName.textContent=m.name;
    hudDays.textContent=fmt(daysSince(m.last))+' days since last contact';
  }

  /* ---------- world layer: stars, dust, our signal leaving (decorative, so it may ease) ---------- */
  var wc=$('#world'), wx=wc.getContext('2d'), stars=[], dust=[], dustAmt=0, dustTarget=0;
  var tc=$('#trace'), tx=tc.getContext('2d'), markers=[], railNav=$('#railNav');
  function RAIL(){return vh<=480?48:(vw<=760?64:76);}
  function sizeCanvas(){
    wc.width=Math.round(vw*dpr); wc.height=Math.round(vh*dpr); wx.setTransform(dpr,0,0,dpr,0,0);
    tc.width=Math.round(vw*dpr); tc.height=Math.round(RAIL()*dpr); tx.setTransform(dpr,0,0,dpr,0,0);
  }
  function initStars(){
    var n=Math.round(clamp(vw*vh/3600,160,520)); stars=[];
    for(var i=0;i<n;i++) stars.push({x:Math.random()*vw,y:Math.random()*vh,z:.2+Math.random()*.8,tw:Math.random()*6.28});
    dust=[]; for(var j=0;j<90;j++) dust.push({x:Math.random()*vw,y:Math.random()*vh,l:14+Math.random()*50,s:.5+Math.random()*1.6});
  }
  function drawWorld(now,cur,vel){
    wx.clearRect(0,0,vw,vh);
    var t=now/1000;
    for(var i=0;i<stars.length;i++){
      var s=stars[i], y=((s.y-cur*0.02*s.z)%vh+vh)%vh;
      var a=(0.25+0.6*s.z)*(0.8+0.2*Math.sin(t*(0.6+s.z)+s.tw));
      wx.fillStyle='rgba(225,232,245,'+a.toFixed(3)+')';
      wx.fillRect(s.x,y,s.z>.75?1.6:1,s.z>.75?1.6:1);
    }
    dustAmt+=(dustTarget-dustAmt)*0.04;
    if(dustAmt>0.01){
      wx.strokeStyle='rgba(214,150,96,'+(0.16*dustAmt).toFixed(3)+')'; wx.lineWidth=1; wx.beginPath();
      var spd=1.2+Math.min(Math.abs(vel)*0.05,6);
      for(var j=0;j<dust.length;j++){
        var d=dust[j]; d.x+=d.s*spd; d.y+=d.s*spd*0.18; if(d.x>vw+60){d.x=-60;d.y=Math.random()*vh;} if(d.y>vh)d.y=0;
        wx.moveTo(d.x,d.y); wx.lineTo(d.x-d.l,d.y-d.l*0.18);
      }
      wx.stroke();
    }
    if(sentAt && !rm){
      /* the visitor's own signal: leaves the left edge, crosses the screen, fades, nothing returns */
      var sp=(now-sentAt)/SEND_MS, y1=vh-RAIL()-36;
      if(sp<1.25){
        var sx=Math.min(sp,1)*(vw+120)-60, sf=Math.max(0,1-Math.max(0,sp-0.7)/0.55);
        wx.strokeStyle='rgba(236,231,220,'+(0.95*sf).toFixed(3)+')'; wx.lineWidth=1.8; wx.beginPath();
        for(var qx=Math.max(0,sx-220);qx<=sx;qx+=2){
          var qu=(qx-(sx-220))/220, qe=Math.sin(qu*Math.PI), qy=y1+Math.sin(qx*0.22)*13*qe*sf;
          if(qx===Math.max(0,sx-220)) wx.moveTo(qx,qy); else wx.lineTo(qx,qy);
        }
        wx.stroke();
        wx.fillStyle='rgba(236,231,220,'+(0.9*sf).toFixed(3)+')'; wx.beginPath(); wx.arc(sx,y1,3,0,6.283); wx.fill();
      }
    }
    if(pulse>0.01 && !rm){
      var y0=vh-RAIL()-36, cyc=7, ph=(t%cyc)/cyc, px=ph*vw*1.02;
      wx.strokeStyle='rgba(188,211,232,'+(0.16*pulse).toFixed(3)+')'; wx.lineWidth=1; wx.beginPath(); wx.moveTo(0,y0); wx.lineTo(vw,y0); wx.stroke();
      var fade=Math.max(0,1-ph*1.05);
      wx.strokeStyle='rgba(188,211,232,'+(0.9*fade*pulse).toFixed(3)+')'; wx.lineWidth=1.4; wx.beginPath();
      for(var x=Math.max(0,px-170);x<=px;x+=2){
        var u=(x-(px-170))/170, env=Math.sin(u*Math.PI), yy=y0+Math.sin(x*0.28)*10*env*fade;
        if(x===Math.max(0,px-170)) wx.moveTo(x,yy); else wx.lineTo(x,yy);
      }
      wx.stroke();
    }
  }

  /* ---------- the trace rail (signature move) ---------- */
  var LEVELS=[1,.82,.64,.48,.33,.2,.08], PAD=28, ys=[0,1], xs=[0,1];
  function pos(y){
    if(y<=ys[0]) return xs[0];
    for(var i=1;i<ys.length;i++){ if(y<=ys[i]){ var f=(y-ys[i-1])/Math.max(1,ys[i]-ys[i-1]); return xs[i-1]+(xs[i]-xs[i-1])*f; } }
    return 1;
  }
  function buildMarkers(){
    markers=[]; $$('button',railNav).forEach(function(b){railNav.removeChild(b);});
    ORDER.forEach(function(id){
      var z=zones.filter(function(q){return q.machine===id;})[0]; if(!z) return;
      markers.push({id:id,top:z.top,t:0,year:byId[id].last.slice(0,4),name:byId[id].name});
    });
    /* the rail is not drawn to scroll scale: each machine gets an even slice so the years never collide,
       and Pioneer 10 (the peak) gets the longest stretch. pos() maps a scroll offset onto that axis. */
    var XS=[0,.07,.2,.33,.46,.59,.72,1];
    ys=[0].concat(markers.map(function(m){return m.top;})).concat([storyMax]);
    markers.forEach(function(m,i){m.t=XS[i+1];});
    xs=XS.slice(0,markers.length+1).concat([1]);
    markers.forEach(function(m){
      var b=document.createElement('button'); b.type='button';
      b.setAttribute('aria-label','Jump to '+m.name+', last contact '+m.year);
      b.setAttribute('data-label',m.name.replace(' EASEP','').replace(' ALSEP','')+', '+m.year);
      b.style.left=(PAD+m.t*(vw-2*PAD))+'px';
      b.addEventListener('click',function(){window.scrollTo({top:Math.max(0,m.top-(m.id==='apollo12'?40:0)+(m.id==='apollo12'?0:2)),behavior:rm?'auto':'smooth'});});
      railNav.appendChild(b);
    });
  }
  function amp(t){
    var a=LEVELS[0];
    for(var i=0;i<markers.length;i++){var k=ease(clamp((t-(markers[i].t-0.012))/0.03));a+=(LEVELS[i+1]-LEVELS[i])*k;}
    var last=markers.length?markers[markers.length-1].t:0.8;
    var tail=ease(clamp((t-(last+(1-last)*0.5))/((1-last)*0.4+0.001)));
    return a*(1-tail);
  }
  function drawTrace(now,cur){
    var W=vw,H=RAIL(); tx.clearRect(0,0,W,H);
    var T=rm?0:now/1000, mid=H*0.64, A=H*0.3, tp=pos(cur), xp=PAD+tp*(W-2*PAD);
    var pts=[];
    for(var x=PAD;x<=W-PAD;x+=2){
      var t=(x-PAD)/(W-2*PAD), a=amp(t);
      var v=Math.sin(x*0.35+T*8)*0.55+Math.sin(x*0.13-T*3)*0.45;
      var n=a>0.015?(Math.random()-0.5)*0.3:0;
      pts.push([x,mid-(v+n)*a*A]);
    }
    function path(){tx.beginPath();for(var i=0;i<pts.length;i++){if(i===0)tx.moveTo(pts[i][0],pts[i][1]);else tx.lineTo(pts[i][0],pts[i][1]);}}
    tx.lineJoin='round';
    tx.save(); tx.beginPath(); tx.rect(xp,0,W,H); tx.clip(); path(); tx.strokeStyle='rgba(236,231,220,.22)'; tx.lineWidth=1; tx.stroke(); tx.restore();
    tx.save(); tx.beginPath(); tx.rect(0,0,xp,H); tx.clip(); path(); tx.shadowColor='rgba(188,211,232,.7)'; tx.shadowBlur=6; tx.strokeStyle='rgba(224,234,244,.95)'; tx.lineWidth=1.5; tx.stroke(); tx.restore();
    var idx=clamp(Math.round((xp-PAD)/2),0,pts.length-1), py=pts[idx]?pts[idx][1]:mid;
    tx.fillStyle='#fff'; tx.shadowColor='rgba(188,211,232,.9)'; tx.shadowBlur=10; tx.beginPath(); tx.arc(xp,py,3,0,6.283); tx.fill(); tx.shadowBlur=0;
    tx.font='12px "Segoe UI",system-ui,sans-serif'; tx.textAlign='center';
    markers.forEach(function(m){
      var x=PAD+m.t*(W-2*PAD), passed=cur>=m.top-2;
      tx.strokeStyle=passed?'rgba(188,211,232,.7)':'rgba(236,231,220,.22)'; tx.beginPath(); tx.moveTo(x,16); tx.lineTo(x,H-6); tx.stroke();
      tx.fillStyle=passed?'rgba(236,231,220,.92)':'rgba(236,231,220,.5)'; tx.fillText(m.year,x,12);
    });
  }

  /* ---------- render one frame at an exact scroll offset (used by the loop and by the audit) ---------- */
  function render(s){
    for(var i=0;i<acts.length;i++){
      var a=acts[i];
      if(s>a.top-vh*1.05 && s<a.top+a.h+vh*0.1){
        var y=clamp((s-a.top)/vh,0,a.tv); a.y=y;
        if(!rm){
          for(var j=0;j<a.cues.length;j++){
            var c=a.cues[j], o=cueOpacity(y,c); c.o=o;
            c.el.style.opacity=o.toFixed(3);
            c.el.style.translate='0 '+((1-o)*14).toFixed(1)+'px';
            /* text comes into focus as it arrives and softens as it leaves */
            c.el.style.filter=(o<0.985&&o>0&&!c.el.classList.contains('thumbs'))?'blur('+((1-o)*5).toFixed(1)+'px)':'none';
            if(c.el.classList.contains('enter')) c.el.style.pointerEvents=o>0.5?'auto':'none';
            if(c.el.classList.contains('peak')){ document.body.classList.toggle('hush',o>0.5); sendBtn.style.pointerEvents=o>0.6?'auto':'none'; sendBtn.tabIndex=o>0.6?0:-1; }
          }
          if(U[a.id]) U[a.id](y/a.k,{el:a.el,tv:a.tv/a.k,y:y});
        }
      }
    }
    if(!rm && flowFig){
      var r=flowFig.parentElement.getBoundingClientRect();
      if(r.bottom>-100&&r.top<vh+100){var rel=(r.top+r.height/2-vh/2)/vh; flowFig.style.transform='translate3d(0,'+(rel*-36).toFixed(1)+'px,0) scale(1.1)';}
    }
    var mid=s+vh*0.5, mz=null;
    for(var z=0;z<zones.length;z++){ if(mid>=zones[z].top&&mid<zones[z].bottom){mz=zones[z].machine;break;} }
    setHud(mz);
    dustTarget=(mz==='opportunity'||mz==='insight'||mz==='ingenuity')?1:0;
    return mz;
  }

  /* ---------- main loop ---------- */
  var prevY=window.scrollY;
  function frame(now){
    var s=window.scrollY, vel=s-prevY; prevY=s;
    /* scroll speed shapes the film grain: quick scrolling roughens the picture, stopping settles it */
    window.__vsm=(window.__vsm||0)+((Math.min(Math.abs(vel)/70,1))-(window.__vsm||0))*0.1;
    if(!rm) document.documentElement.style.setProperty('--v',window.__vsm.toFixed(3));
    var mz=render(s);
    drawWorld(now,s,vel);
    drawTrace(now,s);
    var pa=actById['a-pioneer'];
    if(SND) SND.update(clamp(s/storyMax),(mz==='pioneer10')?pa.y/pa.tv:-1,now);
    requestAnimationFrame(frame);
  }

  /* ---------- controls ---------- */
  var soundBtn=$('#soundBtn');
  function paintSound(){var on=SND&&SND.isStarted()&&!SND.isMuted();soundBtn.innerHTML='<i class="dot"></i>'+(on?'Sound on':'Sound off');soundBtn.setAttribute('aria-pressed',on?'true':'false');}
  soundBtn.addEventListener('click',function(){
    if(!SND.isStarted()){SND.start();SND.setMuted(false);} else SND.setMuted(!SND.isMuted());
    paintSound();
  });
  function begin(withSound){
    if(withSound){SND.start();SND.setMuted(false);} paintSound();
    window.scrollTo({top:actById['a-signal'].top+2,behavior:rm?'auto':'smooth'});
  }
  $('#enterSound').addEventListener('click',function(){begin(true);});
  $('#enterQuiet').addEventListener('click',function(){begin(false);});
  var ts=$('#toSources'); if(ts) ts.addEventListener('click',function(e){e.preventDefault();window.scrollTo({top:$('#sources').getBoundingClientRect().top+window.scrollY,behavior:rm?'auto':'smooth'});});

  /* the visitor sends a signal to Pioneer 10. Only the real one-way delay is shown; nothing ever answers. */
  sendBtn.addEventListener('click',function(){
    if(sendBtn.disabled) return;
    var h=hours.toFixed(1);
    sentAt=performance.now(); sendBtn.disabled=true;
    sendOut.textContent='Sent. At the speed of light it takes about '+h+' hours to reach Pioneer 10.';
    if(SND && SND.ping) SND.ping();
    setTimeout(function(){
      sendOut.textContent='Sent. It takes about '+h+' hours to reach Pioneer 10, and a reply would take another '+h+' hours. Pioneer 10 has not answered since 2003.';
      sendBtn.textContent='Send another'; sendBtn.disabled=false;
    },rm?0:SEND_MS);
  });

  /* ---------- images: decode everything up front so nothing arrives blank ---------- */
  $$('img').forEach(function(im){ im.loading='eager'; if(im.decode) im.decode().catch(function(){}); });

  /* warm-up: paint every stage photo once, at stage size and almost invisible, so the first jump to
     any act (rail click, scrollbar drag) does not wait on decode and upload */
  window.addEventListener('load',function(){
    if(rm) return;
    var box=document.createElement('div');
    box.setAttribute('aria-hidden','true');
    box.style.cssText='position:fixed;inset:0;z-index:-1;opacity:.01;pointer-events:none;overflow:hidden';
    $$('.bg, .bg-aldrin, .plate img').forEach(function(im){
      var u=im.tagName==='IMG'?(im.currentSrc||im.src):''; if(!u) return;
      var c=document.createElement('img'); c.src=u; c.alt='';
      c.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:cover';
      box.appendChild(c);
    });
    document.body.appendChild(box);
    setTimeout(function(){ if(box.parentNode) box.parentNode.removeChild(box); },2500);
  });

  /* rail hint: shown on the first screens only, gone after the first jump or scroll */
  (function(){
    var h=document.createElement('p'); h.className='rail-hint'; h.setAttribute('aria-hidden','true');
    h.textContent='Click a year on the trace to jump to that machine.';
    railNav.appendChild(h);
    setTimeout(function(){h.classList.add('on');check();},1800);
    function check(){ if(window.scrollY>vh*0.3||dismissed){ h.classList.remove('on'); } }
    var dismissed=false;
    railNav.addEventListener('click',function(){dismissed=true;check();});
    window.addEventListener('scroll',check,{passive:true});
  })();

  var rzt; window.addEventListener('resize',function(){clearTimeout(rzt);rzt=setTimeout(layout,120);});
  window.addEventListener('load',function(){layout();setTimeout(layout,600);});
  layout(); paintSound();
  document.body.classList.add('ready');
  if(!rm) requestAnimationFrame(frame);
  else {
    var tick=function(){drawTrace(0,window.scrollY);drawWorld(0,0,0);};
    tick(); window.addEventListener('scroll',tick,{passive:true}); window.addEventListener('resize',tick);
    var rmz=function(){var mid=window.scrollY+vh*0.5,m=null;zones.forEach(function(q){if(mid>=q.top&&mid<q.bottom)m=q.machine;});setHud(m);};
    window.addEventListener('scroll',rmz,{passive:true}); rmz();
  }

  /* ---------- timing audit: __audit() in the console (any page, any size) ---------- */
  window.__audit=function(){
    var out={fails:[],cues:0,sizes:[vw,vh]}, savedRm=rm;
    function words(el){return (el.textContent||'').trim().split(/\s+/).filter(Boolean).length;}
    function rectIn(el,stageTop){var r=el.getBoundingClientRect();return {l:r.left,r:r.right,t:r.top-stageTop,b:r.bottom-stageTop};}
    function hit(a,b){return a.l<b.r-1&&a.r>b.l+1&&a.t<b.b-1&&a.b>b.t+1;}
    var hud=$('.hud-id').getBoundingClientRect(), btn=$('#soundBtn').getBoundingClientRect(), rl=vh-RAIL();
    acts.forEach(function(a){
      if(a.id==='a-mars') return;
      /* 1. plateau length vs reading time */
      a.cues.forEach(function(c){
        out.cues++;
        var t=c.t===undefined?a.tv:c.t, plateau=t-c.f-(c.ri<=0?0:c.ri)-(c.ro<=0?0:c.ro);
        var need=0.22+0.022*words(c.el)-0.005;
        if(['counter','thumbs','pulse-note','enter','endings'].some(function(k){return c.el.classList.contains(k);})) need=0.08;
        if(c.t!==undefined&&c.t>a.tv+0.02) out.fails.push(a.id+': cue ends at '+c.t+' beyond travel '+a.tv.toFixed(2));
        if(plateau<need-0.005) out.fails.push(a.id+': cue "'+c.el.textContent.trim().slice(0,28)+'..." plateau '+plateau.toFixed(2)+' < needed '+need.toFixed(2));
      });
      /* 2. gaps and overlaps, sampled along the act */
      var stageTop=a.el.querySelector('.stage').getBoundingClientRect().top;
      for(var y=0;y<=a.tv+1e-6;y+=0.04){
        var vis=[]; a.cues.forEach(function(c){ if(cueOpacity(y,c)>0.7 && !c.el.classList.contains('thumbs') && !c.el.classList.contains('pulse-note')) vis.push(c); });
        var anyText=a.cues.some(function(c){return cueOpacity(y,c)>0.3;});
        var silent=a.cues.some(function(c){return c.silent;});
        if(!anyText && !silent) out.fails.push(a.id+': nothing readable at y='+y.toFixed(2));
        var boxes=[]; vis.forEach(function(c){ $$('.line > *, .counter > *, .endings > *',c.el.parentNode).forEach(function(n){ if(c.el.contains(n)||c.el===n) boxes.push([c,rectIn(n,stageTop),n]); }); });
        for(var i=0;i<boxes.length;i++){
          var b=boxes[i][1];
          if(b.l<-1||b.r>vw+1||b.b>rl+1) out.fails.push(a.id+': text outside safe area at y='+y.toFixed(2)+' ("'+boxes[i][2].textContent.trim().slice(0,20)+'")');
          if(b.t<Math.max(hud.bottom,btn.bottom)-2 && (b.l<hud.right || b.r>btn.left)) out.fails.push(a.id+': text under the HUD at y='+y.toFixed(2));
          for(var k=i+1;k<boxes.length;k++) if(boxes[k][0]!==boxes[i][0]&&hit(b,boxes[k][1])) out.fails.push(a.id+': two texts overlap at y='+y.toFixed(2));
        }
      }
    });
    out.fails=out.fails.filter(function(f,i,arr){return arr.indexOf(f)===i;});
    out.ok=out.fails.length===0; return out;
  };
})();
