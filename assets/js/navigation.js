(function(){
  const App = window.PortfolioApp;
  const {refs,state,runtime} = App;

  function openWorkspace(){
    if(runtime.workspaceOpening || refs.workspace.classList.contains("show")) return;

    runtime.workspaceOpening = true;
    App.Views.Portfolio.renderIndex();
    refs.workspace.setAttribute("aria-hidden","false");

    refs.appRoot.classList.add("warping");
    refs.landing.classList.add("entering");

    refs.warpLayer.classList.remove("active");
    void refs.warpLayer.offsetWidth;
    refs.warpLayer.classList.add("active");

    setTimeout(() => {
      document.documentElement.classList.add("workspace-open");
      document.body.classList.add("workspace-open");
      window.scrollTo(0,0);
      refs.workspace.classList.add("show");
    },330);

    setTimeout(() => {
      refs.landing.style.display = "none";
      refs.landing.classList.remove("entering");
      refs.warpLayer.classList.remove("active");
      refs.appRoot.classList.remove("warping");
      runtime.workspaceOpening = false;
    },880);
  }

  function closeWorkspace(){
    document.documentElement.classList.remove("workspace-open");
    document.body.classList.remove("workspace-open");
    window.scrollTo(0,0);
    refs.workspace.classList.remove("show");
    refs.workspace.setAttribute("aria-hidden","true");
    runtime.workspaceOpening = false;

    setTimeout(() => {
      refs.landing.style.display = "grid";
      refs.landing.classList.remove("entering");
      refs.warpLayer.classList.remove("active");
      refs.appRoot.classList.remove("warping");
    },470);
  }

  function goBack(){
    if(state.level === 1){
      if(state.process){
        App.Views.Project.renderStage(state.stage);
      }else{
        App.Views.Portfolio.renderIndex();
        App.Views.Portfolio.renderSection("selected-project");
      }
      return;
    }

    closeWorkspace();
  }

  function syncContext(){
    const {backButton,locationTrail} = refs;

    // Level 0: no Back button.
    backButton.hidden = state.level === 0;

    const crumbs = [];

    if(state.level === 0){
      const section = App.DATA.portfolioSections.find(item => item.id === state.section);
      crumbs.push({
        label:App.DATA.ui?.homeLabel || "포트폴리오",
        current:false,
        action:null
      });
      crumbs.push({
        label:section ? section.label : "소개",
        current:true,
        action:null
      });
    }else{
      const stage = App.DATA.stages.find(item => item.id === state.stage);

      crumbs.push({
        label:App.DATA.portfolioSections.find(item => item.id === "selected-project")?.label || "선정 프로젝트",
        current:false,
        action(){
          App.Views.Portfolio.renderIndex();
          App.Views.Portfolio.renderSection("selected-project");
        }
      });

      if(stage){
        crumbs.push({
          label:stage.label,
          current:!state.process,
          action:state.process ? () => App.Views.Project.renderStage(stage.id) : null
        });
      }

      if(state.process){
        const process = App.DATA.process[state.process];
        if(process){
          crumbs.push({
            label:process.label,
            current:true,
            action:null
          });
        }
      }
    }

    locationTrail.innerHTML = crumbs.map((crumb,index) => {
      const separator = index === 0 ? "" : '<span class="location-separator">›</span>';

      if(crumb.action && !crumb.current){
        return `${separator}<button class="location-crumb" type="button" data-location-index="${index}">${crumb.label}</button>`;
      }

      return `${separator}<span class="location-crumb ${crumb.current ? "current" : "root"}">${crumb.label}</span>`;
    }).join("");

    [...locationTrail.querySelectorAll("[data-location-index]")].forEach(button => {
      const crumb = crumbs[Number(button.dataset.locationIndex)];
      if(crumb && crumb.action){
        button.addEventListener("click",crumb.action);
      }
    });
  }

  function bind(){
    refs.startFolder.addEventListener("click",openWorkspace);

    refs.startFolder.addEventListener("keydown",event => {
      if(event.key === "Enter" || event.key === " "){
        event.preventDefault();
        openWorkspace();
      }
    });

    refs.homeButton.addEventListener("click",closeWorkspace);
    refs.backButton.addEventListener("click",goBack);
  }

  App.Navigation = {
    bind,
    openWorkspace,
    closeWorkspace,
    goBack,
    syncContext
  };
})();