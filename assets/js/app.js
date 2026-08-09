(function(){
  const App = window.PortfolioApp;

  function validateRequiredNodes(){
    const missing = Object.entries(App.refs)
      .filter(([,value]) => !value)
      .map(([key]) => key);

    if(missing.length){
      throw new Error(`Portfolio bootstrap failed. Missing DOM refs: ${missing.join(", ")}`);
    }
  }

  validateRequiredNodes();
  App.Navigation.bind();

  document.documentElement.dataset.portfolioReady = "true";
})();