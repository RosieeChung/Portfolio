(function(){
  const App = window.PortfolioApp;
  const {DATA,refs,helpers,state} = App;

  const workStyleDefaults = [
    {title:"공간 읽기",tool:"QGIS",toolDetail:"V-World · 지도 데이터"},
    {title:"형태 설계",tool:"Blender",toolDetail:"Modeling · Structure"},
    {title:"시각화 검증",tool:"Unreal Engine",toolDetail:"Material · Lighting"}
  ];
  function workStyleIcon(tool){
    const name = String(tool).toLowerCase();
    const shape = name.includes("qgis") ? '<path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/>'
      : name.includes("blender") ? '<path d="m12 2 9 5v10l-9 5-9-5V7l9-5Z M3 7l9 5 9-5 M12 12v10 M7.5 4.5l9 5"/>'
      : name.includes("unreal") ? '<circle cx="12" cy="12" r="4"/><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4.2 4.2l2.1 2.1m11.4 11.4 2.1 2.1M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>'
      : '<path d="m12 3 9 9-9 9-9-9 9-9Z"/>';
    return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${shape}</svg>`;
  }

  function renderExperienceLinks(links){
    if(!Array.isArray(links)) return "";
    const entries = links.map(link => {
      if(!link || typeof link !== "object") return "";
      let url = "";
      try { const parsed = new URL(String(link.url || "").trim()); if(["https:","http:"].includes(parsed.protocol)) url = parsed.href; } catch {}
      const title = String(link.title || "").trim();
      const description = String(link.description || "").trim();
      if(!title && !description && !url) return "";
      return `<li class="experience-link-item">
        ${url ? `<a href="${helpers.escapeHTML(url)}" target="_blank" rel="noopener noreferrer"><svg class="experience-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7 .1l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7-.1l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg><span>${helpers.escapeHTML(title || String(link.url).trim())}</span><span class="experience-external-mark" aria-hidden="true">↗</span></a>` : title ? `<span>${helpers.escapeHTML(title)}</span>` : ""}
        ${description ? `<p>${helpers.escapeHTML(description)}</p>` : ""}
      </li>`;
    }).filter(Boolean);
    return entries.length ? `<ul class="experience-links" aria-label="관련 자료">${entries.join("")}</ul>` : "";
  }

  function renderResearchTimeline(timeline){
    if(!timeline || !Array.isArray(timeline.items))return "";
    const items=timeline.items.map((item,index)=>{
      if(!item || typeof item!=="object")return "";
      const title=String(item.title || "").trim(),period=String(item.period || "").trim();
      let url="";try{const parsed=new URL(String(item.url || "").trim());if(["https:","http:"].includes(parsed.protocol))url=parsed.href;}catch{}
      const school=String(item.school ?? (index===0 && timeline.title!=="작품 · 연구" ? timeline.title || "" : "")).trim();
      if(!school&&!title&&!period&&!url)return "";
      return `<li class="research-timeline-item">
        <span class="research-timeline-school">${helpers.escapeHTML(school)}</span>
        <span class="research-timeline-marker" aria-hidden="true"></span>
        ${period?`<span class="research-timeline-period">${helpers.escapeHTML(period)}</span>`:""}
        ${title?`<span class="research-timeline-title">${helpers.escapeHTML(title)}</span>`:""}
        ${url?`<a href="${helpers.escapeHTML(url)}" target="_blank" rel="noopener noreferrer"><svg class="experience-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7 .1l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7-.1l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg><span>${helpers.escapeHTML(item.linkText?.trim() || "자료 보기")}</span><span aria-hidden="true">↗</span></a>`:""}
      </li>`;
    }).filter(Boolean);
    if(!items.length)return "";
    return `<section class="research-timeline" aria-label="선택 기록">
      <ol class="research-timeline-list" style="--timeline-count:${items.length}" tabindex="0" aria-label="작품과 연구 기록">${items.join("")}</ol>
    </section>`;
  }

  function deactivateSectionPageMode(){
    document.documentElement.classList.remove("section-page-open");
    document.body.classList.remove("section-page-open");
    refs.workspace.classList.remove("section-page-mode");
    delete refs.workspace.dataset.sectionPage;
  }

  function activateSectionPageMode(id){
    App.Views.Project?.deactivateCaseStudy?.();
    document.documentElement.classList.add("section-page-open");
    document.body.classList.add("section-page-open");
    refs.workspace.classList.add("section-page-mode");
    refs.workspace.dataset.sectionPage = id;
  }

  // "대표 프로젝트" 아래에 붙는, 번호 없는 하위 목차 행. helpers.listItem과
  // 같은 .list-item 언어를 쓰되 숫자 대신 그리드(썸네일 모음) 아이콘으로
  // 배지를 채워 하위 항목임을 표시한다.
  function workCollectionListItem(){
    if(DATA.ui?.worksPublished === false) return "";
    return `
      <button class="list-item list-item-sub" type="button" data-id="selected-project-works">
        <span class="list-no list-no-icon" aria-hidden="true">
          <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor">
            <rect x="2" y="2" width="6.2" height="6.2" rx="1.6"></rect>
            <rect x="11.8" y="2" width="6.2" height="6.2" rx="1.6"></rect>
            <rect x="2" y="11.8" width="6.2" height="6.2" rx="1.6"></rect>
            <rect x="11.8" y="11.8" width="6.2" height="6.2" rx="1.6"></rect>
          </svg>
        </span>
        <span class="list-copy">
          <strong>${helpers.escapeHTML(App.getWorksLabel())}</strong>
        </span>
        <span class="list-arrow">›</span>
      </button>
    `;
  }

  function handleListSelect(id){
    if(id === "selected-project-works"){
      App.Views.Works.renderGallery();
      return;
    }
    renderSection(id);
  }

  function renderIndex(){
    App.Views.Project?.deactivateCaseStudy?.();
    deactivateSectionPageMode();
    Object.assign(state,{
      level:0,
      section:"selected-project",
      stage:null,
      process:null,
      projectView:null,
      work:null
    });
    const homeLabel = DATA.ui?.homeLabel || "포트폴리오";
    const portfolioHeading = DATA.ui?.portfolioHeading || homeLabel;
    const orderedSections = App.getOrderedPortfolioSections();
    const firstItem = orderedSections[0] || DATA.portfolioSections[0];

    refs.homeButton.setAttribute("aria-label","처음으로");
    refs.homeButton.title = "랜딩 페이지로 돌아가기";
    refs.listHeading.textContent = portfolioHeading;
    refs.breadcrumb.textContent = `${homeLabel} / ${firstItem?.label || "선정 프로젝트"}`;

    refs.itemList.classList.add("section-tabs");
    refs.itemList.innerHTML = orderedSections.map((item,index) => {
      const row = helpers.listItem({
        id:item.id,
        no:String(index+1).padStart(2,"0"),
        label:item.label,
        subtitle:item.navSubtitle,
        active:item.id === firstItem?.id
      });
      if(item.id === "selected-project"){
        return `<div class="list-group">${row}${workCollectionListItem()}</div>`;
      }
      return row;
    }).join("");

    helpers.bindList(handleListSelect);
    renderSection(firstItem?.id || "selected-project");
  }

  function renderSection(id){
    state.section = id;
    helpers.setActiveListItem(id);

    const item = DATA.portfolioSections.find(x => x.id === id);
    if(!item) return;

    if(id === "selected-project"){
      App.Views.Project.renderCaseStudy(item);
      return;
    }

    Object.assign(state,{projectView:null,work:null});
    activateSectionPageMode(id);

    refs.breadcrumb.textContent = `${DATA.ui?.homeLabel || "포트폴리오"} / ${item.label}`;
    App.Navigation.syncContext();

    if(id === "about"){
      const workStyleTitle = typeof DATA.profile.workStyleTitle === "string"
        ? DATA.profile.workStyleTitle
        : "작업 방식";
      const rawWorkStyleItems = Array.isArray(DATA.profile.workStyleItems)
        ? DATA.profile.workStyleItems
        : (Array.isArray(item.bullets) ? item.bullets : []);
      const workStyleItems = rawWorkStyleItems.map((entry,index) => {
        const value = typeof entry === "string" ? {text:entry} : (entry || {});
        const fallback = workStyleDefaults[index] || {title:"작업 단계",tool:"",toolDetail:""};
        return {
          text:typeof value.text === "string" ? value.text : "",
          title:typeof value.title === "string" ? value.title : fallback.title,
          tool:typeof value.tool === "string" ? value.tool : fallback.tool,
          toolDetail:typeof value.toolDetail === "string" ? value.toolDetail : fallback.toolDetail,
          media:Array.isArray(value.media) ? value.media : []
        };
      });

      helpers.setContent(`
        <div class="section-document section-document-about">
          <section class="section-document-hero">
            <div class="content-eyebrow">${App.renumberSectionEyebrow(item.eyebrow,item.id)}</div>
            <h1 class="content-title">${DATA.profile.name}</h1>
            <div class="content-subtitle">${DATA.profile.role}</div>
            <p class="content-description">${DATA.profile.intro}</p>

            <div class="hero-meta">
              ${DATA.profile.disciplines.map(x => `<span class="tag">${x}</span>`).join("")}
            </div>
          </section>

          <section class="section-document-block">
            <div class="section-document-heading section-document-heading-simple">
              <h2>${workStyleTitle}</h2>
            </div>
            <div class="summary-grid workstyle-grid-wide">
              ${workStyleItems.map((x,i) => {
                const image = x.media[0];
                return `
                  <article class="summary-card workstyle-card">
                    ${image?.src ? `
                      <div class="workstyle-card-image">
                        <img src="${helpers.escapeHTML(image.src)}" alt="${helpers.escapeHTML(image.alt || "")}" loading="lazy">
                      </div>
                    ` : ""}
                    <div class="workstyle-card-body">
                      <span class="workstyle-number">${String(i+1).padStart(2,"0")}</span>
                      <h3 class="workstyle-title">${helpers.escapeHTML(x.title)}</h3>
                      <p class="workstyle-description">${helpers.escapeHTML(x.text)}</p>
                      ${x.tool || x.toolDetail ? `<div class="workstyle-footer">
                        ${x.tool ? `<span class="workstyle-tool">${workStyleIcon(x.tool)}${helpers.escapeHTML(x.tool)}</span>` : ""}
                        ${x.toolDetail ? `<span class="workstyle-tool-detail">${helpers.escapeHTML(x.toolDetail)}</span>` : ""}
                      </div>` : ""}
                    </div>
                  </article>
                `;
              }).join("")}
            </div>
          </section>
        </div>
      `);
      window.scrollTo({top:0,behavior:"auto"});
      return;
    }

    if(id === "experience"){
      helpers.setContent(`
        <div class="section-document section-document-experience">
          <section class="section-document-hero">
            <div class="content-eyebrow">${App.renumberSectionEyebrow(item.eyebrow,item.id)}</div>
            <h1 class="content-title">${item.title}</h1>
            <p class="content-description">${item.description}</p>
          </section>

          ${renderResearchTimeline(DATA.experienceTimeline)}

          <section class="section-document-block">
            <div class="experience-list experience-list-wide">
              ${DATA.experience.map((x,index) => `
                <div class="experience-row">
                  <div class="experience-period">
                    <span>${String(index+1).padStart(2,"0")}</span>
                    <strong>${helpers.escapeHTML(x.period || "")}</strong>
                  </div>
                  <div class="experience-copy">
                    <div class="experience-role">${helpers.escapeHTML(x.role || "")}</div>
                    ${typeof x.roleSubtitle === "string" && x.roleSubtitle.trim() ? `<div class="experience-role-subtitle">${helpers.escapeHTML(x.roleSubtitle)}</div>` : ""}
                    <div class="experience-project">${helpers.escapeHTML(x.project || "")}</div>
                    <div class="experience-scope">${helpers.escapeHTML(x.scope || "")}</div>
                    ${typeof x.tools === "string" && x.tools.trim() ? `<div class="experience-tools"><span class="experience-tools-label">사용 툴</span><span>${helpers.escapeHTML(x.tools)}</span></div>` : ""}
                    ${renderExperienceLinks(x.links)}
                  </div>
                </div>
              `).join("")}
            </div>
          </section>
        </div>
      `);
      window.scrollTo({top:0,behavior:"auto"});
      return;
    }
  }

  App.Views.Portfolio = {
    renderIndex,
    renderSection,
    activateSectionPageMode,
    deactivateSectionPageMode
  };
})();