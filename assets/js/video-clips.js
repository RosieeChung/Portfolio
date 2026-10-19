(function(){
  const controllers = new WeakMap();

  function isVideo(src){ return /\.(mp4|webm)(?:[?#]|$)/i.test(String(src || "")); }
  function isVideoUrl(src){
    try {
      const url = new URL(src);
      return url.protocol === "https:" && !url.username && !url.password && /\.(mp4|webm)$/i.test(url.pathname);
    } catch { return false; }
  }

  function fullVideoSource(src){
    if(typeof src!=="string" || !src.trim())return null;
    src=src.trim();
    if(src.startsWith("assets/media/") && !src.includes("..") && isVideo(src))return {kind:"video",src};
    let url;
    try {url=new URL(src);}catch{return null;}
    if(url.protocol!=="https:" || url.username || url.password)return null;
    if(isVideoUrl(src))return {kind:"video",src};
    const host=url.hostname.replace(/^www\./,"");
    if(host==="drive.google.com"){
      const id=url.pathname.match(/^\/file\/d\/([A-Za-z0-9_-]+)(?:\/|$)/)?.[1] || url.searchParams.get("id");
      if(id && /^[A-Za-z0-9_-]{10,}$/.test(id)){
        const embed=new URL(`https://drive.google.com/file/d/${id}/preview`);
        const key=url.searchParams.get("resourcekey");if(key)embed.searchParams.set("resourcekey",key);
        return {kind:"embed",src:embed.href,link:src};
      }
    }
    if(["youtube.com","m.youtube.com","youtu.be","youtube-nocookie.com"].includes(host)){
      const id=host==="youtu.be" ? url.pathname.split("/")[1] : url.searchParams.get("v") || url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1];
      if(id && /^[A-Za-z0-9_-]{11}$/.test(id))return {kind:"embed",src:`https://www.youtube-nocookie.com/embed/${id}?autoplay=0`,link:src};
    }
    if(["vimeo.com","player.vimeo.com"].includes(host)){
      const match=url.pathname.match(/^\/(?:video\/)?(\d+)(?:\/([A-Za-z0-9]+))?\/?$/);
      if(match){
        const embed=new URL(`https://player.vimeo.com/video/${match[1]}`);
        const hash=url.searchParams.get("h") || match[2];if(hash)embed.searchParams.set("h",hash);
        embed.searchParams.set("autoplay","0");return {kind:"embed",src:embed.href,link:src};
      }
    }
    return {kind:"link",src};
  }

  function workBodyItems(work){
    if(Array.isArray(work.body))return work.body;
    if(work.detailMode==="full-video")return work.fullVideo?.src ? [{type:"video",src:work.fullVideo.src,caption:"",layout:"wide"}] : [];
    return (Array.isArray(work.media)?work.media:[]).map(item=>({...item,type:isVideo(item.src)?"clip":"image"}));
  }

  function bind(video,{autoplay=true}={}){
    controllers.get(video)?.dispose();
    let running=autoplay, frame=0;
    const range=()=>{
      const duration=Number.isFinite(video.duration) ? video.duration : Infinity;
      const start=Math.max(0,Number(video.dataset.clipStart) || 0);
      const end=video.dataset.clipEnd ? Math.min(duration,Number(video.dataset.clipEnd)) : duration;
      return {start,end,valid:start < end};
    };
    const mute=()=>{ if(!video.muted)video.muted=true; };
    const play=()=>{ const pending=video.play(); pending?.catch(()=>{}); };
    const seek=()=>{ const r=range(); if(r.valid)video.currentTime=r.start; };
    const check=()=>{
      if(!running || video.paused || video.seeking)return;
      const r=range();
      if(r.valid && (video.currentTime < r.start - .03 || video.currentTime >= r.end))seek();
    };
    const cancel=()=>{ if(frame && video.cancelVideoFrameCallback)video.cancelVideoFrameCallback(frame); frame=0; };
    const tick=()=>{
      frame=0;
      if(!video.isConnected || !running || video.paused)return;
      check();
      if(video.requestVideoFrameCallback)frame=video.requestVideoFrameCallback(tick);
    };
    const schedule=()=>{ cancel(); if(running && video.requestVideoFrameCallback)frame=video.requestVideoFrameCallback(tick); };
    const ready=()=>{ if(running && range().valid){seek();play();} };
    const ended=()=>{ if(running && range().valid){seek();play();} };
    video.muted=true; video.defaultMuted=true; video.loop=false;
    video.addEventListener("volumechange",mute);
    video.addEventListener("loadedmetadata",ready);
    video.addEventListener("timeupdate",check);
    video.addEventListener("play",schedule);
    video.addEventListener("pause",cancel);
    video.addEventListener("ended",ended);
    const controller={
      play(){running=true;video.autoplay=true;if(video.readyState>=1){seek();play();}},
      stop(){running=false;video.autoplay=false;video.pause();cancel();},
      update(){if(running && video.readyState>=1){seek();play();}},
      dispose(){cancel();video.removeEventListener("volumechange",mute);video.removeEventListener("loadedmetadata",ready);video.removeEventListener("timeupdate",check);video.removeEventListener("play",schedule);video.removeEventListener("pause",cancel);video.removeEventListener("ended",ended);}
    };
    controllers.set(video,controller);
    if(video.readyState>=1)ready();
    return controller;
  }

  const api={isVideo,isVideoUrl,fullVideoSource,workBodyItems,bind};
  if(typeof module!=="undefined" && module.exports)module.exports=api;
  if(typeof window!=="undefined")window.PortfolioVideo=api;
})();
