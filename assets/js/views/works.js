(function(){
  const App = window.PortfolioApp;
  const {DATA,refs,helpers,state} = App;

  function safe(value){
    return helpers.escapeHTML(value ?? "");
  }

  function safeMedia(media){
    return Array.isArray(media)
      ? media.filter(item => item && typeof item.src === "string" && item.src.startsWith("assets/media/"))
      : [];
  }

  function getWorks(){
    return Array.isArray(DATA.works) ? DATA.works : [];
  }

  function isVideoSrc(src){
    return /\.(mp4|webm)$/i.test(String(src || ""));
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
      if(current.layout === "half"){
        const next = media[i+1];
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

  function mediaFigureMarkup(item,index){
    const caption = item.caption ? `<figcaption>${safe(item.caption)}</figcaption>` : "";
    if(isVideoSrc(item.src)){
      return `
        <figure class="work-detail-figure">
          <div class="work-detail-video-wrap">
            <video class="work-detail-video" src="${safe(item.src)}" muted loop autoplay playsinline ${index === 0 ? 'preload="auto"' : 'preload="metadata"'}></video>
            <button class="work-detail-sound-toggle" type="button" data-video-sound-toggle aria-label="소리 켜기/끄기">
              <svg class="icon-sound-off" viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 7.2h3.2L11 3.6v12.8L6.2 12.8H3z" fill="currentColor" stroke="none"></path>
                <path d="M13.4 6.6a4.4 4.4 0 010 6.8"></path>
              </svg>
              <svg class="icon-sound-on" viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" hidden>
                <path d="M3 7.2h3.2L11 3.6v12.8L6.2 12.8H3z" fill="currentColor" stroke="none"></path>
                <line x1="13" y1="6.6" x2="17" y2="13.4"></line>
                <line x1="17" y1="6.6" x2="13" y2="13.4"></line>
              </svg>
            </button>
          </div>
          ${caption}
        </figure>
      `;
    }
    return `
      <figure class="work-detail-figure">
        <img
          src="${safe(item.src)}"
          alt="${safe(item.alt || "")}"
          ${index === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}
          decoding="async"
        >
        ${caption}
      </figure>
    `;
  }

  function bindWorkDetailVideos(){
    [...refs.contentInner.querySelectorAll(".work-detail-video-wrap")].forEach(wrap => {
      const video = wrap.querySelector("video");
      const button = wrap.querySelector("[data-video-sound-toggle]");
      if(!video || !button) return;
      const iconOff = button.querySelector(".icon-sound-off");
      const iconOn = button.querySelector(".icon-sound-on");
      button.addEventListener("click",() => {
        video.muted = !video.muted;
        if(!video.muted) video.play().catch(() => {});
        iconOff.hidden = !video.muted;
        iconOn.hidden = video.muted;
      });
    });
  }

  // 작업 모음: 여러 개인/실험 작업을 액자식 그리드로 보여주는 목록 화면.
  // 왼쪽 사이드바의 "작업 모음" 항목(대표 프로젝트 하위, 번호 없음)에서 바로 들어온다.
  function renderGallery(){
    if(DATA.ui?.worksPublished === false) return App.Views.Portfolio.renderSection("selected-project");
    const works = getWorks();
    const worksLabel = App.getWorksLabel();

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
          <p class="content-description">개인 작업과 실험적인 시도를 모은 목록입니다. 이미지를 누르면 자세한 내용을 볼 수 있습니다.</p>
        </section>

        <section class="section-document-block">
          <div class="section-rule"></div>
          ${works.length ? `
            <div class="works-grid">
              ${works.map(work => {
                const thumb = safeMedia(work.media)[0];
                const size = ["wide","tall"].includes(work.size) ? work.size : "normal";
                return `
                  <button class="works-grid-item works-grid-item-${size}" type="button" data-work="${safe(work.id)}">
                    ${thumb
                      ? `<img src="${safe(thumb.src)}" alt="${safe(thumb.alt || work.title || "")}" loading="lazy" decoding="async">`
                      : `<span class="works-grid-empty">SAMPLE</span>`}
                    <span class="works-grid-caption">
                      <strong>${safe(work.title)}</strong>
                      <small>${safe(work.year || "")}${work.category ? ` · ${safe(work.category)}` : ""}</small>
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

    const media = safeMedia(work.media);

    helpers.setContent(`
      <div class="section-document work-detail-page">
        <section class="section-document-hero">
          <div class="content-eyebrow">${safe(worksLabel)}</div>
          <h1 class="content-title">${safe(work.title)}</h1>
          <div class="content-subtitle">${safe(work.year || "")}${work.category ? ` · ${safe(work.category)}` : ""}</div>
          ${work.description ? `<p class="content-description">${safe(work.description)}</p>` : ""}
          ${work.credit ? `<p class="work-detail-credit">${safe(work.credit)}</p>` : ""}
        </section>

        <section class="section-document-block">
          <div class="section-rule"></div>
          ${media.length ? `
            <div class="work-detail-media">
              ${(() => {
                let flatIndex = 0;
                return groupMediaRows(media).map(row => {
                  if(row.type === "pair"){
                    return `<div class="work-detail-media-row-pair">${
                      row.items.map(item => mediaFigureMarkup(item,flatIndex++)).join("")
                    }</div>`;
                  }
                  if(row.type === "half-solo"){
                    return `<div class="work-detail-media-row-half">${mediaFigureMarkup(row.items[0],flatIndex++)}</div>`;
                  }
                  return mediaFigureMarkup(row.items[0],flatIndex++);
                }).join("");
              })()}
            </div>
          ` : ""}
        </section>
      </div>
    `);

    window.scrollTo({top:0,behavior:"auto"});
    setTimeout(bindWorkDetailVideos,240);
  }

  App.Views.Works = {renderGallery,renderDetail};
})();
