(function(){
const App=window.PortfolioApp;
const {DATA,refs,state,helpers}=App;
const esc=v=>helpers.escapeHTML(v??"");
const iconPaths={
 terrain:'<path d="m3 18 5-10 4 6 3-9 6 13H3Z"/><path d="m6 12 2 2 2-2"/>',
 data:'<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z"/><path d="M9 3v15M15 6v15"/>',
 model:'<path d="m12 3 9 5v9l-9 5-9-5V8l9-5Z"/><path d="m3 8 9 5 9-5M12 13v9M7.5 5.5l9 5"/>',
 light:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/>',
 record:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/>'
};
const icon=key=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+iconPaths[key]+'</svg>';
const stageIcon=id=>({'base-build':'terrain','data-setup':'data','modeling':'model','environment':'light'}[id]||'record');
const mediaItems=items=>(Array.isArray(items)?items:[]).filter(x=>x&&typeof x.src==="string"&&x.src.startsWith("assets/media/"));
function resultGroups(items){
 const groups=[],byScene=new Map();
 mediaItems(items).forEach((item,index)=>{
  const rawScene=String(item.scene||String(item.label||'').match(/\s(\d+)$/)?.[1]||Math.floor(index/3)+1).trim();
  const scene=/^\d+$/.test(rawScene)?rawScene.padStart(2,'0'):rawScene;
  if(!byScene.has(scene)){const group={scene,items:[]};byScene.set(scene,group);groups.push(group);}
  byScene.get(scene).items.push(item);
 });
 return groups;
}
function resultGallery(items){
 const groups=resultGroups(items);
 if(!groups.length)return '';
 return `<div class="result-scenes" aria-label="장면별 결과 이미지">${groups.map((group,groupIndex)=>{
  const first=group.items[0];
  const sceneName=/^\d+$/.test(group.scene)?`장면 ${group.scene.padStart(2,'0')}`:group.scene;
  return `<section class="result-scene" aria-label="${esc(sceneName)}"><header class="result-scene-head"><div><span>VIEW ${String(groupIndex+1).padStart(2,'0')}</span><h4>${esc(sceneName)}</h4></div><small>${group.items.length}개 이미지 · 하나의 장면</small></header><div class="result-scene-body"><figure class="result-scene-feature"><a class="result-scene-main" href="${esc(first.src)}" target="_blank" rel="noopener"><img src="${esc(first.src)}" alt="${esc(first.alt||'')}" loading="lazy"></a><figcaption><strong class="result-scene-label">${esc(first.label||'결과 이미지')}</strong><span class="result-scene-caption" ${first.caption?'':'hidden'}>${esc(first.caption||'')}</span></figcaption></figure><div class="result-scene-options" role="group" aria-label="${esc(sceneName)} 이미지 선택">${group.items.map((item,index)=>`<button type="button" data-result-src="${esc(item.src)}" data-result-alt="${esc(item.alt||'')}" data-result-label="${esc(item.label||'이미지 '+(index+1))}" data-result-caption="${esc(item.caption||'')}" aria-pressed="${index===0}"><img src="${esc(item.src)}" alt="" loading="lazy"><span>${esc((item.label||'이미지 '+(index+1)).replace(/\s+\d+$/,''))}</span></button>`).join('')}</div></div></section>`;
 }).join('')}</div>`;
}

function gallery(items,work=false){
 const entries=mediaItems(items);
 if(work&&entries.length>1){const first=entries[0];return `<div class="record-media work-image-viewer"><figure><a class="work-image-main" href="${esc(first.src)}" target="_blank" rel="noopener"><img src="${esc(first.src)}" alt="${esc(first.alt)}" loading="lazy"></a><figcaption class="work-image-caption" ${first.label||first.caption?'':'hidden'}>${esc(first.label||first.caption||'')}</figcaption><div class="work-image-options" role="group" aria-label="작업 이미지 선택">${entries.map((m,i)=>`<button type="button" data-work-src="${esc(m.src)}" data-work-alt="${esc(m.alt||'')}" data-work-caption="${esc([m.label,m.caption].filter(Boolean).join(' · '))}" aria-label="${esc(m.label||m.alt||`이미지 ${i+1}`)}" aria-pressed="${i===0}"><img src="${esc(m.src)}" alt="" loading="lazy"></button>`).join('')}<span class="work-image-count">1 / ${entries.length}</span></div></figure></div>`;}
 return `<div class="record-media">${mediaItems(items).map(x=>`<figure class="${x.layout==='half'?'half':''}"><a href="${esc(x.src)}" target="_blank" rel="noopener"><img src="${esc(x.src)}" alt="${esc(x.alt)}" loading="lazy"></a>${x.label||x.caption?`<figcaption>${x.label?`<strong>${esc(x.label)}</strong>`:''}${x.caption?`<span>${esc(x.caption)}</span>`:''}</figcaption>`:''}</figure>`).join('')}</div>`;}
const bullets=items=>Array.isArray(items)&&items.length?`<ul>${items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'';
function deactivateCaseStudy(){
 document.documentElement.classList.remove("case-study-open");
 document.body.classList.remove("case-study-open");
 refs.workspace.classList.remove("case-study-mode");
}
function renderCaseStudy(section){
 App.Views.Portfolio.deactivateSectionPageMode();
 Object.assign(state,{level:0,section:"selected-project",stage:null,process:null,projectView:"featured",work:null});
 document.documentElement.classList.add("case-study-open");
 document.body.classList.add("case-study-open");
 refs.workspace.classList.add("case-study-mode");
 App.Navigation.syncContext();
 refs.breadcrumb.textContent="포트폴리오 / 대표 프로젝트";
 const stages=DATA.stages||[];
 const passes=mediaItems(section.heroMedia);
 const first=passes[0];
 const facts=Object.entries({role:'담당 분야',scope:'작업 범위',tools:'사용 도구',data:'참고자료'}).filter(([k])=>section.projectFacts?.[k]);
 refs.contentInner.innerHTML=`
 <div class="bridge-case">
 
 <header class="bridge-heading"><div><p class="eyebrow"><span class="project-dot" aria-hidden="true"></span>${esc(section.eyebrow||'SELECTED PROJECT')}</p><h1>${esc(section.title)}</h1></div></header>
 ${first?`<section class="render-viewer" aria-label="렌더 비교"><div class="viewer-heading"><span>프로젝트 뷰어</span><span>RENDER STUDIES</span></div>
 <div class="render-enlarge"><img id="bridge-render" src="${esc(first.src)}" alt="${esc(first.alt)}"><button class="zoom-label" type="button" aria-label="전체 화면으로 보기" title="전체 화면으로 보기"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M8 3H3v5M16 3h5v5M21 16v5h-5M3 16v5h5"/></svg></button></div>
 <div class="render-toolbar"><div class="pass-controls" role="group" aria-label="렌더 종류">${passes.map((p,i)=>`<button type="button" data-pass="${i}" aria-pressed="${i===0}" tabindex="${i===0?0:-1}"><img src="${esc(p.src)}" alt=""><span>${esc(p.label||`보기 ${i+1}`)}</span></button>`).join('')}</div><p id="pass-caption" aria-live="polite">${esc(first.caption)}</p></div></section>`:''}
 <section class="bridge-overview"><div><h2>프로젝트 개요</h2><p>${esc(section.description)}</p></div><dl>${facts.map(([k,label])=>`<div><dt>${label}</dt><dd>${esc(section.projectFacts[k])}</dd></div>`).join('')}</dl></section>
 <section class="bridge-process">
 <div class="pipeline-board"><header class="pipeline-board-heading"><div><p class="pipeline-kicker">PROJECT WORKFLOW</p><h2>${esc(section.projectCompositionTitle||'제작 파이프라인')}</h2><p class="pipeline-description">${esc(section.projectCompositionDescription||'')}</p></div></header>
 <div class="pipeline-table-scroll" role="region" aria-label="제작 파이프라인 요약표" tabindex="0"><table class="pipeline-table"><caption>제작 단계별 작업 구성과 핵심 내용</caption><colgroup><col class="pipeline-col-stage"><col class="pipeline-col-work"><col></colgroup><thead><tr><th scope="col">제작 단계</th><th scope="col">세부 작업</th><th scope="col">핵심 내용</th></tr></thead><tbody>${stages.map((s,i)=>`<tr><th scope="row"><a class="pipeline-jump" href="#flow-stage-${i}"><span class="pipeline-step-icon">${icon(stageIcon(s.id))}</span><span><small>STEP ${String(i+1).padStart(2,'0')}</small><strong>${esc(s.label)}</strong></span><span class="pipeline-jump-arrow" aria-hidden="true">↓</span></a></th><td><div class="pipeline-work-labels">${(s.process||[]).map(id=>DATA.process[id]).filter(Boolean).map(p=>`<span>${esc(p.label)}</span>`).join('')||mediaItems(s.media).map(m=>`<span>${esc(m.label||m.alt||'결과 이미지')}</span>`).join('')}</div></td><td>${s.summary?.length?bullets(s.summary):`<p>${esc(s.description)}</p>`}</td></tr>`).join('')}</tbody></table></div>
 <ol class="pipeline-footnote" aria-label="제작 흐름">${stages.map(s=>`<li>${esc(s.label)}</li>`).join('')}</ol></div>
 <div class="records-flow" aria-label="세부 작업 기록">${stages.map((s,i)=>`<section class="flow-stage" aria-labelledby="flow-stage-title-${i}" id="flow-stage-${i}"><header class="flow-stage-heading"><span class="flow-stage-number">${String(i+1).padStart(2,'0')}</span><div><p class="eyebrow">${esc(s.english||'PROCESS')}</p><h3 id="flow-stage-title-${i}">${esc(s.label)}</h3>${s.subtitle?`<p class="stage-subtitle">${esc(s.subtitle)}</p>`:''}</div></header>
 <div class="flow-stage-overview ${(s.process||[]).some(id=>DATA.process[id])?'stage-toc-overview':''} ${s.id==='current-result'?'result-stage-overview':''}"><div><p>${esc(s.description)}</p></div>${(s.process||[]).some(id=>DATA.process[id])?`<nav class="stage-toc" aria-label="${esc(s.label)} 작업 목차">${(s.process||[]).map((id,j)=>{const p=DATA.process[id];return p?`<a class="work-jump" href="#flow-work-${i}-${j}"><span>${String(j+1).padStart(2,'0')}</span><strong>${esc(p.label)}</strong></a>`:''}).join('')}</nav>`:s.id==='current-result'?resultGallery(s.media):gallery([...mediaItems(s.pipelineMedia),...mediaItems(s.media)].filter((m,i,a)=>a.findIndex(x=>x.src===m.src)===i))}</div>
 <div class="flow-work-list">${(s.process||[]).map((id,j)=>{const p=DATA.process[id];return p?`<article id="flow-work-${i}-${j}" class="flow-work ${mediaItems(p.media).length?'has-media':''}"><div class="flow-work-copy"><span class="flow-work-number">${String(i+1).padStart(2,'0')} / ${String(j+1).padStart(2,'0')}</span><h4>${esc(p.label)}</h4>${p.subtitle?`<p class="flow-subtitle">${esc(p.subtitle)}</p>`:''}<p>${esc(p.description)}</p>${bullets(p.bullets)}${(p.tags||[]).length?`<div class="record-tags">${p.tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div>`:''}</div>${gallery(p.media,true)}</article>`:''}).join('')}</div></section>`).join('')}</div></section></div>
 <dialog class="render-dialog" aria-label="프로젝트 렌더 갤러리"><header class="dialog-heading"><span class="dialog-status" aria-live="polite"></span><button type="button" class="close-render" aria-label="확대 닫기" autofocus title="닫기"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button></header><div class="dialog-image-stage"><img alt="" role="button" tabindex="0" aria-label="이미지 클릭하여 확대 닫기" title="클릭하여 닫기"></div><footer class="dialog-controls"><button type="button" class="render-prev" aria-label="이전 이미지"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m14 5-7 7 7 7"/></svg></button><div class="dialog-passes" role="group" aria-label="확대 이미지 선택">${passes.map((p,i)=>`<button type="button" data-dialog-pass="${i}" aria-pressed="false"><img src="${esc(p.src)}" alt=""><span>${esc(p.label||`보기 ${i+1}`)}</span></button>`).join('')}</div><button type="button" class="render-next" aria-label="다음 이미지"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m10 5 7 7-7 7"/></svg></button></footer></dialog>`;
 refs.contentInner.querySelectorAll('.pipeline-jump,.work-jump').forEach(link=>link.addEventListener('click',e=>{e.preventDefault();const target=refs.contentInner.querySelector(link.getAttribute('href'));target.tabIndex=-1;target.focus({preventScroll:true});target.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});}));
 refs.contentInner.querySelectorAll('[data-work-src]').forEach(button=>button.addEventListener('click',()=>{
  const viewer=button.closest('.work-image-viewer'),link=viewer.querySelector('.work-image-main'),image=link.querySelector('img'),caption=viewer.querySelector('.work-image-caption');
  link.href=button.dataset.workSrc;image.src=button.dataset.workSrc;image.alt=button.dataset.workAlt;
  caption.textContent=button.dataset.workCaption;caption.hidden=!caption.textContent;
  const buttons=[...viewer.querySelectorAll('[data-work-src]')];buttons.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  viewer.querySelector('.work-image-count').textContent=`${buttons.indexOf(button)+1} / ${buttons.length}`;
 }));
 refs.contentInner.querySelectorAll('.result-scene').forEach(scene=>{
  const link=scene.querySelector('.result-scene-main'),image=link.querySelector('img'),label=scene.querySelector('.result-scene-label'),caption=scene.querySelector('.result-scene-caption');
  scene.querySelectorAll('[data-result-src]').forEach(button=>button.addEventListener('click',()=>{
   link.href=button.dataset.resultSrc;image.src=button.dataset.resultSrc;image.alt=button.dataset.resultAlt;
   label.textContent=button.dataset.resultLabel;caption.textContent=button.dataset.resultCaption;caption.hidden=!caption.textContent;
   scene.querySelectorAll('[data-result-src]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  }));
 });
 if(!first)return;
 let current=0;
 const img=document.getElementById("bridge-render"),caption=document.getElementById("pass-caption"),dialog=refs.contentInner.querySelector("dialog");
 function selectPass(index){
 current=(index+passes.length)%passes.length;const pass=passes[current];
 img.src=pass.src;img.alt=pass.alt||"";caption.textContent=pass.caption||"";
 dialog.querySelector("img").src=pass.src;dialog.querySelector("img").alt=pass.alt||"";
 dialog.querySelector('.dialog-status').textContent=`${pass.label||'렌더'} · ${current+1} / ${passes.length}`;
 refs.contentInner.querySelectorAll('[data-pass],[data-dialog-pass]').forEach(b=>{
  const selected=Number(b.dataset.pass??b.dataset.dialogPass)===current;
  b.setAttribute('aria-pressed',String(selected));
 });
 }
 refs.contentInner.querySelectorAll('[data-pass],[data-dialog-pass]').forEach(b=>b.addEventListener('click',()=>selectPass(Number(b.dataset.pass??b.dataset.dialogPass))));
 const passButtons=[...refs.contentInner.querySelectorAll('[data-pass]')];
 passButtons.forEach((b,i)=>{b.tabIndex=0;b.addEventListener('keydown',e=>{
 let next;if(e.key==='ArrowRight')next=(i+1)%passes.length;else if(e.key==='ArrowLeft')next=(i+passes.length-1)%passes.length;else return;
 e.preventDefault();passButtons[next].focus();selectPass(next);
 });});
 refs.contentInner.querySelector('.zoom-label').addEventListener('click',()=>{selectPass(current);dialog.showModal();});
 dialog.querySelector('.close-render').addEventListener('click',()=>dialog.close());
 const enlargedImage=dialog.querySelector('.dialog-image-stage img');
 enlargedImage.addEventListener('click',()=>dialog.close());
 enlargedImage.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();dialog.close();}});
 dialog.querySelector('.render-prev').addEventListener('click',()=>selectPass(current-1));
 dialog.querySelector('.render-next').addEventListener('click',()=>selectPass(current+1));
 dialog.querySelector('.render-prev').disabled=dialog.querySelector('.render-next').disabled=passes.length<2;
 dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();selectPass(current+(e.key==='ArrowRight'?1:-1));}});
 dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
 dialog.addEventListener('close',()=>refs.contentInner.querySelector('.zoom-label').focus({preventScroll:true}));
 window.scrollTo(0,0);
}
App.Views.Project={renderCaseStudy,deactivateCaseStudy,renderList(){renderCaseStudy(DATA.portfolioSections.find(s=>s.id==="selected-project"))},renderStage(){this.renderList()},syncAccordion(){}};
})();
