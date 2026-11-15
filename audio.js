/* Last Signal: synthesized sound only (Web Audio). Nothing here is a NASA recording.
   A low drone, plus a tonal blip that comes further apart and fainter as the story goes on.
   Past the last Pioneer 10 moment everything fades to silence. */
(function(){
  'use strict';
  var ctx=null, master=null, drone=null, muted=true, started=false, lastBlip=0, lastPing=0;

  function start(){
    if(started) return true;
    var AC=window.AudioContext||window.webkitAudioContext;
    if(!AC) return false;
    try{
      ctx=new AC();
      master=ctx.createGain(); master.gain.value=0; master.connect(ctx.destination);
      var lp=ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=260; lp.connect(master);
      drone=ctx.createGain(); drone.gain.value=0.5; drone.connect(lp);
      [[55,0],[82.6,5],[110.4,-4]].forEach(function(p,i){
        var o=ctx.createOscillator(); o.type=i===0?'sine':'triangle'; o.frequency.value=p[0]; o.detune.value=p[1];
        var g=ctx.createGain(); g.gain.value=i===0?0.5:0.18; o.connect(g); g.connect(drone); o.start();
      });
      started=true; return true;
    }catch(e){ return false; }
  }

  function setMuted(m){
    muted=m;
    if(!started) return;
    if(ctx.state==='suspended' && !m) ctx.resume();
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(m?0:0.5, ctx.currentTime, 0.4);
  }

  function blip(freq,vol,dur){
    var t=ctx.currentTime, o=ctx.createOscillator(), g=ctx.createGain();
    o.type='sine'; o.frequency.setValueAtTime(freq,t);
    g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(vol,t+0.02); g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    o.connect(g); g.connect(master); o.start(t); o.stop(t+dur+0.05);
  }

  /* prog: 0..1 over the whole story; pio: 0..1 progress inside the Pioneer 10 act (-1 when not in it) */
  function update(prog,pio,now){
    if(!started||muted) return;
    var quiet = pio>=0.95;             // after the last line there is no sound at all
    var dg = quiet ? 0 : Math.max(0.12, 0.8-0.7*prog);
    drone.gain.setTargetAtTime(dg, ctx.currentTime, 0.8);
    if(quiet) return;
    if(pio>=0.48){                    // our own signal, leaving: a low ping, no reply
      if(now-lastPing>6500){ lastPing=now; blip(110,0.16,2.6); }
      return;
    }
    var gap=2200+prog*prog*16000;        // blips drift further apart
    if(now-lastBlip>gap){
      lastBlip=now;
      var vol=Math.max(0.02,0.11*(1-prog*1.05));
      blip(660-prog*340, vol, 0.5);
    }
  }

  function ping(){ if(started&&!muted) blip(110,0.2,3.4); }

  window.LastSignalAudio={ping:ping,start:start,setMuted:setMuted,update:update,isStarted:function(){return started;},isMuted:function(){return muted;}};
})();
