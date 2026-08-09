(function(){
  const App = window.PortfolioApp;
  const {DATA,refs,helpers,state} = App;

  function render(id){
    const p = DATA.process[id];
    if(!p) return;

    state.level = 1;
    state.stage = p.stage;
    state.process = id;

    const stage = DATA.stages.find(x => x.id === p.stage);
    if(!stage) return;

    const rootLabel = DATA.ui?.homeLabel || "포트폴리오";
    const selectedProjectLabel = DATA.portfolioSections.find(item => item.id === "selected-project")?.label || "선정 프로젝트";
    refs.breadcrumb.textContent = `${rootLabel} / ${selectedProjectLabel} / ${stage.label} / ${p.label}`;
    App.Views.Project.syncAccordion(stage.id,p.id);
    App.Navigation.syncContext();

    helpers.setContent(`
      <div class="process-view">
      <div class="content-eyebrow">${p.no} · 세부 작업</div>
      <h1 class="content-title">${p.label}</h1>
      <div class="content-subtitle">${p.subtitle}</div>
      <p class="content-description">${p.description}</p>

      <div class="hero-meta">
        ${p.tags.map(x => `<span class="tag">${x}</span>`).join("")}
      </div>

      ${helpers.mediaGallery(p.media,"작업 이미지")}

      <div class="detail-block">
        <div class="section-label">이 단계에서 하는 일</div>
        <h3>${p.label} 작업 흐름</h3>
        <p>${p.description}</p>

        <div class="detail-points">
          ${p.bullets.map((x,i) => `
            <div class="detail-point">
              <strong>0${i+1}</strong><br>${x}
            </div>
          `).join("")}
        </div>
      </div>

      <div class="section-rule"></div>
      <div class="section-label">${stage.label}의 다른 작업</div>
      <div class="process-list">
        ${stage.process.filter(x => x !== id).map(processId => {
          const other = DATA.process[processId];
          return `
            <button class="process-button" type="button" data-process="${other.id}">
              <span class="process-no">${other.no}</span>
              <span>
                <strong>${other.label}</strong>
                <small>${other.subtitle}</small>
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

  App.Views.Process = {render};
})();