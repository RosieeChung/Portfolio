(function(){
  const App = window.PortfolioApp;
  const {DATA,refs,helpers,state} = App;

  function safe(value){
    return helpers.escapeHTML(value ?? "");
  }

  function safeMedia(media){
    return Array.isArray(media)
      ? media.filter(item => item && typeof item.src === "string" && (item.src.startsWith("assets/media/") || window.PortfolioVideo.isVideoUrl(item.src)))
      : [];
  }

  const WORK_SIZES=["normal","wide","tall","large"];

  function getWorks(){
    return Array.isArray(DATA.works) ? DATA.works : [];
  }

  function isVideoSrc(src){
    return window.PortfolioVideo.isVideo(src);
  }

  function clipAttributes(item){
    return `data-work-video data-clip-start="${safe(item.clipStart || 0)}" ${item.clipEnd!==undefined?`data-clip-end="${safe(item.clipEnd)}"`:""}`;
  }

  // "half" 레이아웃 미디어를 묶는다: 연속된 half 2개는 한 줄에 나란히
  // (pair), 짝 없이 혼자인 half는 그 자체로 폭 50%인 한 줄(half-solo)로
  // — 하나만 half로 지정해도 바로 눈에 띄는 변화가 생기도록. "full"은
  // 그대로 한 줄 전체 폭(single).
  function groupMediaRows(media){
    const rows = [];
    let i = 0;
    while(i < media.length){
      const current = media[i];
      const next = media[i+1];
      if(["portrait-left","portrait-right"].includes(current.layout) && next && ["portrait-left","portrait-right"].includes(next.layout) && current.layout!==next.layout){
        rows.push({type:"portrait-pair",items:[current,next]});i+=2;continue;
      }
      if(isSplit(current.layout)){
        rows.push({type:"split",items:[current]});i+=1;continue;
      }
      if(current.layout === "square-pair"){
        if(next && next.layout === "square-pair"){rows.push({type:"square-pair",items:[current,next]});i+=2;}
        else{rows.push({type:"square-solo",items:[current]});i+=1;}
        continue;
      }
      if(current.layout === "half"){
        if(next && next.layout === "half"){
          rows.push({type:"pair",items:[current,next]});
          i += 2;
        }else{
          rows.push({type:"half-solo",items:[current]});
          i += 1;
        }
      }else{
        rows.push({type:"single",items:[current]});
        i += 1;
      }
    }
    return rows;
  }

  const BODY_LAYOUTS=["wide","portrait-left","portrait-right","square","half","square-pair","split-text-left","split-text-right"];
  function isSplit(layout){ return layout==="split-text-left" || layout==="split-text-right"; }

  function multiline(value){ return safe(value).replace(/\r?\n/g,"<br>"); }

  // 텍스트 + 1:1 자료를 한 줄에 나란히 놓는 블록. 자료 자체는 기존
  // 이미지/무음 구간 항목을 그대로 쓰고, 항목의 textLabel/textTitle/text를 옆에 둔다.
  function splitMarkup(item,index){
    const side=item.layout==="split-text-right" ? "right" : "left";
    const text=`<div class="work-split-text">
        ${item.textLabel?.trim() ? `<div class="work-split-label">${safe(item.textLabel)}</div>` : ""}
        ${item.textTitle?.trim() ? `<h2 class="work-split-title">${multiline(item.textTitle)}</h2>` : ""}
        ${item.text?.trim() ? `<p class="work-split-body">${multiline(item.text)}</p>` : ""}
      </div>`;
    const square=item.ratio==="square";
    return `<section class="work-split" data-text-side="${side}">${text}${mediaFigureMarkup({...item,layout:square ? "square" : "full"},index)}</section>`;
  }

  function mediaFigureMarkup(item,index){
    const caption = item.caption?.trim() ? `<figcaption>${safe(item.caption)}</figcaption>` : "";
    const layout=BODY_LAYOUTS.includes(item.layout)?item.layout:"full";
    let content="",link="";
    if(item.type==="video"){
      const source=window.PortfolioVideo.fullVideoSource(item.src);if(!source)return "";
      if(source.kind==="video")content=`<video class="work-detail-video work-full-video" src="${safe(source.src)}" controls playsinline preload="metadata" aria-label="${safe(item.label || '본문 영상 '+(index+1))}"></video>`;
      else if(source.kind==="embed"){
        const driveId=source.src.match(/^https:\/\/drive\.google\.com\/file\/d\/([A-Za-z0-9_-]+)\/preview/)?.[1];
        if(driveId){
          // 드라이브 영상은 드라이브 플레이어(새 창 아이콘 포함) 대신 기본 플레이어로 직접 재생한다.
          // 드라이브가 직접 재생을 막으면 그때만 드라이브 플레이어로 바꾼다.
          const direct=`https://drive.usercontent.google.com/download?id=${driveId}&export=download&confirm=t`;
          content=`<video class="work-detail-video work-full-video" src="${safe(direct)}" controls playsinline preload="metadata" data-drive-fallback="${safe(source.src)}" aria-label="${safe(item.label || '본문 영상 '+(index+1))}"></video>`;
        }else{
          content=`<iframe src="${safe(source.src)}" title="${safe(item.label || '본문 영상 '+(index+1))}" allow="fullscreen; picture-in-picture; encrypted-media" allowfullscreen></iframe>`;
        }
      }
    }else if(item.type==="clip"){
      content=`<video class="work-detail-video" src="${safe(item.src)}" muted autoplay playsinline ${clipAttributes(item)} ${index === 0 ? 'preload="auto"' : 'preload="metadata"'}></video>`;
    }else{
      content=`<img src="${safe(item.src)}" alt="${safe(item.alt || '')}" ${index === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
    }
    const ratio=item.layout==="square-pair" ? (item.ratio==="original" ? "original" : "square") : "";
    return `<figure class="work-detail-figure work-body-figure" data-work-layout="${layout}" data-work-type="${safe(item.type)}"${ratio?` data-work-ratio="${ratio}"`:""}><div class="work-body-frame">${content}</div>${link}${caption}</figure>`;
  }

  function bindWorkDetailVideos(){
    refs.contentInner.querySelectorAll("[data-work-video]").forEach(video=>window.PortfolioVideo.bind(video));
    refs.contentInner.querySelectorAll("video[data-drive-fallback]").forEach(video=>{
      const fallback=()=>{
        if(!video.isConnected)return;
        const frame=document.createElement("iframe");
        frame.src=video.dataset.driveFallback;frame.title=video.getAttribute("aria-label") || "영상";
        frame.allow="fullscreen; picture-in-picture; encrypted-media";frame.allowFullscreen=true;
        video.replaceWith(frame);
      };
      if(video.error)fallback();else video.addEventListener("error",fallback,{once:true});
    });
  }

  // 작업 모음: 여러 개인/실험 작업을 액자식 그리드로 보여주는 목록 화면.
  // 왼쪽 사이드바의 "작업 모음" 항목(대표 프로젝트 하위, 번호 없음)에서 바로 들어온다.
  function renderGallery(){
    if(DATA.ui?.worksPublished === false) return App.Views.Portfolio.renderSection("selected-project");
    const works = getWorks();
    const worksLabel = App.getWorksLabel();
    const worksDescription = typeof DATA.ui?.worksDescription === "string"
      ? DATA.ui.worksDescription
      : "개인 작업과 실험적인 시도를 모은 목록입니다. 이미지를 누르면 자세한 내용을 볼 수 있습니다.";

    App.Views.Project?.deactivateCaseStudy?.();
    App.Views.Portfolio?.activateSectionPageMode?.("selected-project-works");

    Object.assign(state,{level:0,section:"selected-project",stage:null,process:null,projectView:"works",work:null});
    helpers.setActiveListItem("selected-project-works");

    const rootLabel = DATA.ui?.homeLabel || "포트폴리오";
    refs.breadcrumb.textContent = `${rootLabel} / ${worksLabel}`;
    App.Navigation.syncContext();

    helpers.setContent(`
      <div class="section-document works-gallery-page">
        <section class="section-document-hero">
          <div class="content-eyebrow">${safe(worksLabel)}</div>
          <h1 class="content-title">${safe(worksLabel)}</h1>
          ${worksDescription.trim() ? `<p class="content-description">${safe(worksDescription).replace(/\r?\n/g,"<br>")}</p>` : ""}
        </section>

        <section class="section-document-block">
          <div class="section-rule"></div>
          ${works.length ? `
            <div class="works-grid">
              ${works.map(work => {
                const thumb = safeMedia(work.thumbnail===undefined ? work.media : work.thumbnail)[0];
                const size = WORK_SIZES.includes(work.size) ? work.size : "normal";
                const meta = [work.year,work.category].filter(Boolean).map(safe).join(" · ");
                return `
                  <button class="works-grid-item works-grid-item-${size}" type="button" data-work="${safe(work.id)}">
                    ${thumb
                      ? isVideoSrc(thumb.src)
                        ? `<video src="${safe(thumb.src)}" aria-label="${safe(thumb.alt || work.title || '')}" muted autoplay playsinline preload="metadata" ${clipAttributes(thumb)}></video>`
                        : `<img src="${safe(thumb.src)}" alt="${safe(thumb.alt || work.title || "")}" loading="lazy" decoding="async">`
                      : `<span class="works-grid-empty">SAMPLE</span>`}
                    <span class="works-grid-caption">
                      <strong>${safe(work.title)}</strong>
                      ${meta ? `<small>${meta}</small>` : ""}
                    </span>
                  </button>
                `;
              }).join("")}
            </div>
          ` : `<p class="content-description">아직 등록된 작업이 없습니다.</p>`}
        </section>
      </div>
    `);

    window.scrollTo({top:0,behavior:"auto"});
    setTimeout(bindGallery,240);
  }

  function bindGallery(){
    bindWorkDetailVideos();
    [...refs.contentInner.querySelectorAll("[data-work]")].forEach(button => {
      button.addEventListener("click",() => renderDetail(button.dataset.work));
    });
  }

  // 작업 모음 안의 작업 하나를 크게 보여주는 상세 화면.
  function renderDetail(id){
    if(DATA.ui?.worksPublished === false) return App.Views.Portfolio.renderSection("selected-project");
    const work = getWorks().find(item => item.id === id);
    if(!work) return;
    const worksLabel = App.getWorksLabel();

    App.Views.Project?.deactivateCaseStudy?.();
    App.Views.Portfolio?.activateSectionPageMode?.("selected-project-work");

    Object.assign(state,{level:0,section:"selected-project",stage:null,process:null,projectView:"work",work:id});
    helpers.setActiveListItem("selected-project-works");

    const rootLabel = DATA.ui?.homeLabel || "포트폴리오";
    refs.breadcrumb.textContent = `${rootLabel} / ${worksLabel} / ${work.title}`;
    App.Navigation.syncContext();

    const facts = [["YEAR",work.year],["TYPE",work.category],["ROLE",work.role],["TOOLS",work.tools]].filter(([,value]) => typeof value==="string" && value.trim());
    const allWorks = getWorks();
    const position = allWorks.findIndex(item => item.id === id);
    const prev = position > 0 ? allWorks[position-1] : null;
    const next = position < allWorks.length-1 ? allWorks[position+1] : null;
    // 메인 영상: 상세에 들어오면 맨 위에 컨트롤·소리가 있는 플레이어로 보여준다.
    // 그 아래 본문 자료(이미지·무음 반복·텍스트 블록)는 설명용으로 선택해서 붙인다.
    const mainSource = window.PortfolioVideo.fullVideoSource(work.fullVideo?.src);
    const mainItem = mainSource && ["video","embed"].includes(mainSource.kind) ? {type:"video",src:work.fullVideo.src,layout:"wide",label:`${work.title} 영상`,caption:work.fullVideo.caption || ""} : null;
    const bodySource = Array.isArray(work.body) ? work.body : work.detailMode==="full-video" ? [] : window.PortfolioVideo.workBodyItems(work);
    const media = bodySource.filter(item=>item.type==="video" ? ["video","embed"].includes(window.PortfolioVideo.fullVideoSource(item.src)?.kind) : safeMedia([item]).length);

    helpers.setContent(`
      <div class="section-document work-detail-page">
        <section class="section-document-hero">
          <div class="content-eyebrow">${safe(worksLabel)}</div>
          <h1 class="content-title">${safe(work.title)}</h1>
          ${work.description?.trim() ? `<p class="content-description work-detail-lead">${multiline(work.description.trim())}</p>` : ""}
          ${facts.length ? `<dl class="work-detail-facts">${facts.map(([label,value]) => `<div><dt>${label}</dt><dd>${safe(value)}</dd></div>`).join("")}</dl>` : ""}
          ${work.credit?.trim() ? `<p class="work-detail-credit">${safe(work.credit)}</p>` : ""}
        </section>

        <section class="section-document-block">
          <div class="section-rule"></div>
          ${mainItem ? `<div class="work-detail-main">${mediaFigureMarkup(mainItem,0)}</div>` : ""}
          ${media.length ? `
            <div class="work-detail-media">
              ${(() => {
                let flatIndex = mainItem ? 1 : 0;
                return groupMediaRows(media).map(row => {
                  if(row.type === "pair" || row.type === "portrait-pair"){
                    return `<div class="${row.type==='portrait-pair'?'work-detail-media-row-portrait':'work-detail-media-row-pair'}">${
                      row.items.map(item => mediaFigureMarkup(item,flatIndex++)).join("")
                    }</div>`;
                  }
                  if(row.type === "split") return splitMarkup(row.items[0],flatIndex++);
                  if(row.type === "square-pair") return `<div class="work-detail-media-row-square">${row.items.map(item => mediaFigureMarkup(item,flatIndex++)).join("")}</div>`;
                  if(row.type === "square-solo") return `<div class="work-detail-media-row-square work-detail-media-row-square-solo">${mediaFigureMarkup(row.items[0],flatIndex++)}</div>`;
                  if(row.type === "half-solo"){
                    return `<div class="work-detail-media-row-half">${mediaFigureMarkup(row.items[0],flatIndex++)}</div>`;
                  }
                  return mediaFigureMarkup(row.items[0],flatIndex++);
                }).join("");
              })()}
            </div>
          ` : ""}
        </section>

        ${prev || next ? `
          <nav class="work-detail-pager" aria-label="다른 프로젝트">
            ${prev ? `<button type="button" class="work-detail-pager-link" data-work-nav="${safe(prev.id)}"><small>← 이전 프로젝트</small><strong>${safe(prev.title)}</strong></button>` : "<span></span>"}
            ${next ? `<button type="button" class="work-detail-pager-link work-detail-pager-next" data-work-nav="${safe(next.id)}"><small>다음 프로젝트 →</small><strong>${safe(next.title)}</strong></button>` : ""}
          </nav>
        ` : ""}
      </div>
    `);

    window.scrollTo({top:0,behavior:"auto"});
    setTimeout(() => {
      bindWorkDetailVideos();
      refs.contentInner.querySelectorAll("[data-work-nav]").forEach(button => button.addEventListener("click",() => renderDetail(button.dataset.workNav)));
    },240);
  }

  App.Views.Works = {renderGallery,renderDetail};
})();
