(function(){
  const App = window.PortfolioApp = window.PortfolioApp || {};

  App.DATA = window.PORTFOLIO;

  const typography = App.DATA?.ui?.typography || {};
  const clampNumber = (value,min,max,fallback) => {
    const parsed = Number(value);
    if(!Number.isFinite(parsed)) return fallback;
    return Math.min(max,Math.max(min,parsed));
  };
  const typographyVars = [
    ["--portfolio-hero-title-size",typography.heroTitleSize,36,80,56],
    ["--portfolio-section-title-size",typography.sectionTitleSize,24,60,38],
    ["--portfolio-index-heading-size",typography.indexHeadingSize,18,32,26],
    ["--portfolio-nav-label-size",typography.navLabelSize,9,18,12],
    ["--portfolio-nav-subtitle-size",typography.navSubtitleSize,7,14,9],
    ["--portfolio-eyebrow-size",typography.eyebrowSize,7,14,9],
    ["--portfolio-body-size",typography.bodySize,11,20,15]
  ];
  typographyVars.forEach(([name,value,min,max,fallback]) => {
    document.documentElement.style.setProperty(name,`${clampNumber(value,min,max,fallback)}px`);
  });

  const ALLOWED_WEIGHTS = [400,500,600,700,800];
  const clampWeight = (value,fallback) => {
    const parsed = Number(value);
    return ALLOWED_WEIGHTS.includes(parsed) ? parsed : fallback;
  };
  const weightVars = [
    ["--portfolio-hero-title-weight",typography.heroTitleWeight,700],
    ["--portfolio-section-title-weight",typography.sectionTitleWeight,700],
    ["--portfolio-index-heading-weight",typography.indexHeadingWeight,700],
    ["--portfolio-nav-label-weight",typography.navLabelWeight,700],
    ["--portfolio-nav-subtitle-weight",typography.navSubtitleWeight,400],
    ["--portfolio-eyebrow-weight",typography.eyebrowWeight,400],
    ["--portfolio-body-weight",typography.bodyWeight,400]
  ];
  weightVars.forEach(([name,value,fallback]) => {
    document.documentElement.style.setProperty(name,String(clampWeight(value,fallback)));
  });

  const PUBLIC_SECTION_ORDER = ["selected-project","experience","about"];

  App.publicSectionOrder = PUBLIC_SECTION_ORDER;

  App.getOrderedPortfolioSections = function(){
    const items = Array.isArray(App.DATA?.portfolioSections) ? App.DATA.portfolioSections : [];
    const rank = new Map(PUBLIC_SECTION_ORDER.map((id,index) => [id,index]));
    return [...items].sort((a,b) => {
      const aRank = rank.has(a?.id) ? rank.get(a.id) : PUBLIC_SECTION_ORDER.length;
      const bRank = rank.has(b?.id) ? rank.get(b.id) : PUBLIC_SECTION_ORDER.length;
      return aRank - bRank;
    });
  };

  App.getPublicSectionNumber = function(id){
    const index = App.getOrderedPortfolioSections().findIndex(item => item?.id === id);
    return index >= 0 ? String(index + 1).padStart(2,"0") : "";
  };

  App.getWorksLabel = function(){
    const value = App.DATA?.ui?.worksLabel;
    return typeof value === "string" && value.trim() ? value : "작업 모음";
  };

  App.renumberSectionEyebrow = function(value,id){
    const no = App.getPublicSectionNumber(id);
    const text = String(value || "").trim();
    if(!no) return text;
    if(!text) return no;
    if(/^\d{2}\s*[·.-]/.test(text)){
      return text.replace(/^\d{2}/,no);
    }
    return `${no} · ${text}`;
  };

  App.state = {
    level:0,
    section:"selected-project",
    stage:null,
    process:null,
    projectView:null,
    work:null
  };

  App.runtime = {
    workspaceOpening:false
  };

  App.refs = {
    appRoot:document.getElementById("app"),
    landing:document.getElementById("landing"),
    startFolder:document.getElementById("startFolder"),
    workspace:document.getElementById("workspace"),
    warpLayer:document.getElementById("warpLayer"),
    homeButton:document.getElementById("homeButton"),
    backButton:document.getElementById("backButton"),
    locationTrail:document.getElementById("locationTrail"),
    breadcrumb:document.getElementById("breadcrumb"),
    listHeading:document.getElementById("listHeading"),
    itemList:document.getElementById("itemList"),
    contentInner:document.getElementById("contentInner")
  };

  App.helpers = {
    wait(ms){
      return new Promise(resolve => setTimeout(resolve,ms));
    },

    setContent(html){
      const {contentInner} = App.refs;
      contentInner.classList.add("changing");

      setTimeout(() => {
        contentInner.innerHTML = html;
        contentInner.scrollTop = 0;
        requestAnimationFrame(() => contentInner.classList.remove("changing"));
      },180);
    },

    listItem({id,no,label,subtitle="",active=false}){
      return `
        <button class="list-item ${active ? "active" : ""}" type="button" data-id="${id}">
          <span class="list-no">${no}</span>
          <span class="list-copy">
            <strong>${App.helpers.escapeHTML(label)}</strong>${subtitle?`<small class="nav-subtitle">${App.helpers.escapeHTML(subtitle)}</small>`:""}
          </span>
          <span class="list-arrow">›</span>
        </button>
      `;
    },

    setActiveListItem(id){
      [...App.refs.itemList.querySelectorAll(".list-item")].forEach(el => {
        el.classList.toggle("active",el.dataset.id === id);
      });
    },

    bindList(handler){
      [...App.refs.itemList.querySelectorAll(".list-item")].forEach(el => {
        el.addEventListener("click",() => handler(el.dataset.id));
      });
    },

    bindProcessButtons(){
      [...App.refs.contentInner.querySelectorAll("[data-process]")].forEach(el => {
        el.addEventListener("click",() => App.Views.Process.render(el.dataset.process));
      });
    },

    escapeHTML(value){
      return String(value ?? "")
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;");
    },

    mediaGallery(media,label="프로젝트 이미지"){
      if(!Array.isArray(media) || media.length === 0) return "";

      const safeItems = media.filter(item =>
        item &&
        typeof item.src === "string" &&
        item.src.startsWith("assets/media/")
      );

      if(!safeItems.length) return "";

      return `
        <section class="visual-section">
          <div class="section-label">${this.escapeHTML(label)}</div>
          <div class="visual-gallery">
            ${safeItems.map((item,index) => `
              <figure class="visual-figure ${index === 0 ? "visual-featured" : ""}">
                <img
                  src="${this.escapeHTML(item.src)}"
                  alt="${this.escapeHTML(item.alt || "")}"
                  ${index === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}
                  decoding="async"
                >
                ${item.caption ? `<figcaption>${this.escapeHTML(item.caption)}</figcaption>` : ""}
              </figure>
            `).join("")}
          </div>
        </section>
      `;
    }
  };

  App.Views = App.Views || {};
})();