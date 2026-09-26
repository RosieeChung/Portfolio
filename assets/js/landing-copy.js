(function(){
const copy=window.PORTFOLIO?.profile?.landing||{};
const fields=[['landingHeadline','headline','3D ENVIRONMENT',400],['landingTitle','title','Portfolio',450],['landingSubtitle','subtitle','Open workspace',400]];
function fit(){fields.forEach(([id,key,fallback,width])=>{const el=document.getElementById(id);if(!el)return;el.textContent=typeof copy[key]==='string'?copy[key]:fallback;el.style.fontSize='';const natural=el.getComputedTextLength();if(natural>width){const size=parseFloat(getComputedStyle(el).fontSize);el.style.fontSize=(size*width/natural)+'px';}});}
fit();document.fonts?.ready.then(fit);
const button=document.getElementById('startFolder');if(button)button.setAttribute('aria-label',[copy.headline||'3D ENVIRONMENT',copy.title||'Portfolio',copy.subtitle||'Open workspace'].join(' · '));
})();