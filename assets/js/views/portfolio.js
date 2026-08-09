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
      helpers.setContent(`
        <div class="content-eyebrow">${item.eyebrow}</div>
        <h1 class="content-title">${DATA.profile.name}</h1>
        <div class="content-subtitle">${DATA.profile.role}</div>
        <p class="content-description">${DATA.profile.intro}</p>

        <div class="hero-meta">
          ${DATA.profile.disciplines.map(x => `<span class="tag">${x}</span>`).join("")}
        </div>

        <div class="section-rule"></div>
        <div class="section-label">작업 방식</div>
        <div class="summary-grid">
          ${item.bullets.map((x,i) => `
            <div class="summary-card">
              <span>0${i+1}</span>
              <strong>${x}</strong>
            </div>
          `).join("")}
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

    helpers.setContent(`
      <div class="content-eyebrow">${item.eyebrow}</div>
      <h1 class="content-title">${item.title}</h1>
      <p class="content-description">${item.description}</p>

      <div class="section-rule"></div>
      <div class="section-label">프로젝트 구성</div>
      <div class="summary-grid">
        ${DATA.stages.slice(0,3).map(stage => `
          <div class="summary-card">
            <span>${stage.no}</span>
            <strong>${stage.label}<br>${stage.subtitle}</strong>
          </div>
        `).join("")}
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