(function(){
  const root=document.documentElement;
  function ready(image){
    return new Promise(resolve=>{
      const finish=()=>{image.onload=null;image.onerror=null;if(image.naturalWidth && image.decode)image.decode().catch(()=>{}).then(resolve);else resolve();};
      if(image.complete)finish();else{image.onload=finish;image.onerror=finish;}
    });
  }
  const images=[...document.querySelectorAll('#startFolder img')];
  const mask=new Image();mask.src='assets/media/folder-v143/document-window-mask-v143.svg';
  // Failed requests also settle: a network error must never lock entry.
  const waits=[...images,mask].map(ready);
  if(document.fonts?.ready)waits.push(document.fonts.ready);
  let revealed=false;
  function reveal(){if(revealed)return;revealed=true;root.classList.remove('landing-assets-pending');}
  Promise.allSettled(waits).then(reveal);
  setTimeout(reveal,12000);
})();
