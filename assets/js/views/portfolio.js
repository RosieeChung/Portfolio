(function(){
  const App = window.PortfolioApp;
  const {DATA,refs,helpers,state} = App;

  function renderIndex(){
    Object.assign(state,{
      level:0,
      section:"about",
      stage:null,
      process:null
    });
    const homeLabel = DATA.ui?.homeLabel || "포트폴리오";
    const portfolioHeading = DATA.ui?.portfolioHeading || homeLabel;
    const aboutItem = DATA.portfolioSections.find(item => item.id === "about");

    refs.homeButton.textContent = homeLabel;
    refs.listHeading.textContent = portfolioHeading;
    refs.breadcrumb.textContent = `${homeLabel} / ${aboutItem?.label || "소개"}`;

    refs.itemList.classList.add("section-tabs");
    refs.itemList.innerHTML = DATA.portfolioSections.map((item,index) =>
      helpers.listItem({
        id:item.id,
        no:String(index+1).padStart(2,"0"),
        label:item.label,
        subtitle:item.navSubtitle || "",
        active:item.id === "about"
      })
    ).join("");

    helpers.bindList(renderSection);
    renderSection("about");
  }

  function renderSection(id){
    state.section = id;
    helpers.setActiveListItem(id);

    const item = DATA.portfolioSections.find(x => x.id === id);
    if(!item) return;

    refs.breadcrumb.textContent = `${DATA.ui?.homeLabel || "포트폴리오"} / ${item.label}`;
    App.Navigation.syncContext();

    if(id === "about"){
      const workStyleTitle = typeof DATA.profile.workStyleTitle === "string"
        ? DATA.profile.workStyleTitle
        : "작업 방식";
      const rawWorkStyleItems = Array.isArray(DATA.profile.workStyleItems)
        ? DATA.profile.workStyleItems
        : (Array.isArray(item.bullets) ? item.bullets : []);
      const workStyleItems = rawWorkStyleItems.map(entry => {
        if(typeof entry === "string") return {text:entry,media:[]};
        if(!entry || typeof entry !== "object") return {text:"",media:[]};
        return {
          text:typeof entry.text === "string" ? entry.text : "",
          media:Array.isArray(entry.media) ? entry.media : []
        };
      });

      helpers.setContent(`
        <div class="content-eyebrow">${item.eyebrow}</div>
        <h1 class="content-title">${DATA.profile.name}</h1>
        <div class="content-subtitle">${DATA.profile.role}</div>
        <p class="content-description">${DATA.profile.intro}</p>

        <div class="hero-meta">
          ${DATA.profile.disciplines.map(x => `<span class="tag">${x}</span>`).join("")}
        </div>

        <div class="section-rule"></div>
        <div class="section-label">${workStyleTitle}</div>
        <div class="summary-grid">
          ${workStyleItems.map((x,i) => {
            const image = x.media[0];
            return `
              <div class="summary-card workstyle-card">
                <span>${String(i+1).padStart(2,"0")}</span>
                ${image?.src ? `
                  <div class="workstyle-card-image">
                    <img
                      src="${image.src}"
                      alt="${image.alt || ""}"
                      loading="lazy"
                    >
                  </div>
                ` : ""}
                <strong>${x.text}</strong>
              </div>
            `;
          }).join("")}
        </div>
      `);
      return;
    }

    if(id === "experience"){
      helpers.setContent(`
        <div class="content-eyebrow">${item.eyebrow}</div>
        <h1 class="content-title">${item.title}</h1>
        <p class="content-description">${item.description}</p>

        <div class="section-rule"></div>
        <div class="experience-list">
          ${DATA.experience.map(x => `
            <div class="experience-row">
              <div class="experience-period">${x.period}</div>
              <div>
                <div class="experience-role">${x.role}</div>
                <div class="experience-project">${x.project}</div>
                <div class="experience-scope">${x.scope}</div>
              </div>
            </div>
          `).join("")}
        </div>
      `);
      return;
    }

    const projectCompositionTitle = typeof item.projectCompositionTitle === "string"
      ? item.projectCompositionTitle
      : "프로젝트 구성";
    const rawProjectCompositionItems = Array.isArray(item.projectCompositionItems)
      ? item.projectCompositionItems
      : DATA.stages.slice(0,3).map(stage => ({
          title:stage.label,
          subtitle:stage.subtitle,
          media:[]
        }));
    const projectCompositionItems = rawProjectCompositionItems.map(entry => ({
      title:typeof entry?.title === "string" ? entry.title : "",
      subtitle:typeof entry?.subtitle === "string" ? entry.subtitle : "",
      media:Array.isArray(entry?.media) ? entry.media : []
    }));

    helpers.setContent(`
      <div class="content-eyebrow">${item.eyebrow}</div>
      <h1 class="content-title">${item.title}</h1>
      <p class="content-description">${item.description}</p>

      <div class="section-rule"></div>
      <div class="section-label">${projectCompositionTitle}</div>
      <div class="summary-grid project-composition-grid">
        ${projectCompositionItems.map((entry,index) => {
          const image = entry.media[0];
          return `
            <div class="summary-card project-composition-card">
              <span>${String(index+1).padStart(2,"0")}</span>
              ${image?.src ? `
                <div class="project-composition-card-image">
                  <img
                    src="${image.src}"
                    alt="${image.alt || ""}"
                    loading="lazy"
                  >
                </div>
              ` : ""}
              <div class="project-composition-card-copy">
                <strong>${entry.title}</strong>
                ${entry.subtitle ? `<small>${entry.subtitle}</small>` : ""}
              </div>
            </div>
          `;
        }).join("")}
      </div>

      <button class="project-open" id="openProject" type="button">프로젝트 과정 보기 →</button>
    `);

    setTimeout(() => {
      document.getElementById("openProject")?.addEventListener(
        "click",
        App.Views.Project.renderList
      );
    },210);
  }

  App.Views.Portfolio = {
    renderIndex,
    renderSection
  };
})();