(function(){
  const App = window.PortfolioApp;
  const {DATA,refs,helpers,state} = App;

  function accordionStageItem(stage,activeStageId,activeProcessId){
    const isOpen = stage.id === activeStageId;

    return `
      <div class="stage-accordion ${isOpen ? "open" : ""}" data-stage-group="${stage.id}">
        <button
          class="list-item stage-trigger ${isOpen ? "active" : ""}"
          type="button"
          data-stage-id="${stage.id}"
          aria-expanded="${isOpen ? "true" : "false"}"
        >
          <span class="list-no">${stage.no}</span>
          <span class="list-copy">
            <strong>${stage.label}</strong>
            <span>${stage.subtitle}</span>
          </span>
          <span class="list-arrow stage-chevron">⌄</span>
        </button>

        <div class="stage-children" aria-hidden="${isOpen ? "false" : "true"}">
          ${stage.process.map(processId => {
            const p = DATA.process[processId];
            const isActive = activeProcessId === p.id;

            return `
              <button
                class="stage-child ${isActive ? "active" : ""}"
                type="button"
                data-stage-process="${p.id}"
              >
                <span class="stage-child-no">${p.no}</span>
                <span class="stage-child-copy">
                  <strong>${p.label}</strong>
                  <small>${p.subtitle}</small>
                </span>
                <span class="stage-child-arrow">›</span>
              </button>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }

  function syncAccordion(stageId=state.stage || "concept",processId=state.process || null){
    refs.itemList.innerHTML = DATA.stages.map(stage =>
      accordionStageItem(stage,stageId,processId)
    ).join("");

    [...refs.itemList.querySelectorAll("[data-stage-id]")].forEach(button => {
      button.addEventListener("click",() => {
        renderStage(button.dataset.stageId);
      });
    });

    [...refs.itemList.querySelectorAll("[data-stage-process]")].forEach(button => {
      button.addEventListener("click",() => {
        App.Views.Process.render(button.dataset.stageProcess);
      });
    });
  }

  function renderList(){
    Object.assign(state,{
      level:1,
      stage:"concept",
      process:null
    });

    refs.listHeading.textContent = "프로젝트 과정";
    const rootLabel = DATA.ui?.homeLabel || "포트폴리오";
    const selectedProjectLabel = DATA.portfolioSections.find(item => item.id === "selected-project")?.label || "선정 프로젝트";
    refs.breadcrumb.textContent = `${rootLabel} / ${selectedProjectLabel} / 콘셉트`;

    renderStage("concept");
  }

  function renderStage(id){
    const stage = DATA.stages.find(x => x.id === id);
    if(!stage) return;

    state.level = 1;
    state.stage = id;
    state.process = null;

    syncAccordion(id,null);

    const rootLabel = DATA.ui?.homeLabel || "포트폴리오";
    const selectedProjectLabel = DATA.portfolioSections.find(item => item.id === "selected-project")?.label || "선정 프로젝트";
    refs.breadcrumb.textContent = `${rootLabel} / ${selectedProjectLabel} / ${stage.label}`;
    App.Navigation.syncContext();

    helpers.setContent(`
      <div class="stage-view">
        <div class="content-eyebrow">${stage.no} · 제작 단계</div>
        <h1 class="content-title">${stage.label}</h1>
        <div class="content-subtitle">${stage.subtitle}</div>
        <p class="content-description">${stage.description}</p>

        ${helpers.mediaGallery(stage.media,"단계 이미지")}

        <div class="section-rule"></div>
        <div class="section-label">단계 요약</div>
        <div class="summary-grid stage-summary-grid">
          ${stage.summary.map((x,i) => `
            <div class="summary-card stage-summary-card">
              <span>0${i+1}</span>
              <strong>${x}</strong>
            </div>
          `).join("")}
        </div>

        <div class="section-rule process-rule"></div>
        <div class="section-label">세부 작업 과정</div>
        <div class="process-list stage-process-list">
          ${stage.process.map(processId => {
            const p = DATA.process[processId];
            return `
              <button class="process-button" type="button" data-process="${p.id}">
                <span class="process-no">${p.no}</span>
                <span>
                  <strong>${p.label}</strong>
                  <small>${p.subtitle}</small>
                </span>
                <span class="go">›</span>
              </button>
            `;
          }).join("")}
        </div>
      </div>
    `);

    setTimeout(helpers.bindProcessButtons,210);
  }

  App.Views.Project = {
    renderList,
    renderStage,
    syncAccordion
  };
})();