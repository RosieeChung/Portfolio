(function(){
  const App = window.PortfolioApp;
  const {refs,state,runtime} = App;

  function openWorkspace(){
    if(runtime.workspaceOpening || refs.workspace.classList.contains("show")) return;

    runtime.workspaceOpening = true;
    document.documentElement.classList.add("workspace-preparing");
    document.body.classList.add("workspace-preparing");
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
      document.documentElement.classList.remove("workspace-preparing");
      document.body.classList.remove("workspace-preparing");
      window.scrollTo(0,0);

      // Let the browser commit the document-scroll layout before the workspace
      // fades in. This prevents a one-frame nested scrollbar flash.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => refs.workspace.classList.add("show"));
      });
    },330);

    setTimeout(() => {
      refs.landing.style.display = "none";
      refs.landing.classList.remove("entering");
      refs.warpLayer.classList.remove("active");
      refs.appRoot.classList.remove("warping");
      document.documentElement.classList.remove("workspace-preparing");
      document.body.classList.remove("workspace-preparing");
      runtime.workspaceOpening = false;
    },880);
  }

  function closeWorkspace(){
    App.Views.Project?.deactivateCaseStudy?.();
    App.Views.Portfolio?.deactivateSectionPageMode?.();
    document.documentElement.classList.remove("workspace-preparing");
    document.body.classList.remove("workspace-preparing");
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
    // "작업 모음" is a sidebar-level destination now (peer to 대표 프로젝트/
    // 경력/소개), so Back only ever needs to climb one step: out of a single
    // work's detail page, back to the 작업 모음 grid it came from.
    if(state.section === "selected-project" && state.projectView === "work"){
      App.Views.Works.renderGallery();
      return;
    }

    // Legacy path: state.level is only ever set to 1 by the standalone
    // process detail view (views/process.js), which nothing currently
    // links to (processes render inline inside the featured project page
    // instead). Kept so it still works if that view is wired up again.
    if(state.level === 1){
      if(state.process){
        App.Views.Project.renderStage(state.stage);
      }else{
        App.Views.Portfolio.renderSection("selected-project");
      }
      return;
    }

    closeWorkspace();
  }

  function syncContext(){
    const {backButton,locationTrail} = refs;

    const inWorkDetail = state.section === "selected-project" && state.projectView === "work";

    // No Back button at the top of any section, including 작업 모음's own
    // grid — it's reached straight from the sidebar like 대표 프로젝트/경력/
    // 소개, so Back only appears one level deeper, inside a single work.
    backButton.hidden = !(state.level === 1 || inWorkDetail);

    const crumbs = [];
    const homeLabel = App.DATA.ui?.homeLabel || "포트폴리오";
    const worksLabel = App.getWorksLabel();

    if(state.section === "selected-project" && state.projectView === "works"){
      crumbs.push({label:homeLabel,current:false,action:null});
      crumbs.push({label:worksLabel,current:true,action:null});
    }else if(inWorkDetail){
      crumbs.push({label:homeLabel,current:false,action:null});
      crumbs.push({
        label:worksLabel,
        current:false,
        action:() => App.Views.Works.renderGallery()
      });
      const work = (App.DATA.works || []).find(item => item.id === state.work);
      crumbs.push({label:work ? work.title : "작업",current:true,action:null});
    }else if(state.level === 0){
      const section = App.DATA.portfolioSections.find(item => item.id === state.section);
      crumbs.push({
        label:homeLabel,
        current:false,
        action:null
      });
      crumbs.push({
        label:section ? section.label : state.section,
        current:true,
        action:null
      });
    }else{
      // Legacy path: see the matching comment in goBack().
      const stage = App.DATA.stages.find(item => item.id === state.stage);

      crumbs.push({
        label:App.DATA.portfolioSections.find(item => item.id === "selected-project")?.label || "대표 프로젝트",
        current:false,
        action(){
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