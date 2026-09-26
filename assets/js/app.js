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

  // Open linked content images in place so a second click returns to the work.
  const imageDialog=document.createElement('dialog');
  imageDialog.className='content-image-dialog';
  imageDialog.setAttribute('aria-label','이미지 확대');
  imageDialog.innerHTML='<button type="button" class="content-image-close" aria-label="닫기">×</button><button type="button" class="content-image-dismiss" aria-label="이미지를 눌러 닫기"><img alt=""></button>';
  document.body.appendChild(imageDialog);
  let imageOpener=null;
  document.addEventListener('click',event=>{
    const link=event.target.closest('a');
    if(!link || !App.refs.contentInner.contains(link))return;
    const thumbnail=link.querySelector('img');
    if(!thumbnail || !/\.(png|jpe?g|webp|gif|avif|svg)(?:[?#]|$)/i.test(link.href))return;
    event.preventDefault();
    imageOpener=link;
    const image=imageDialog.querySelector('img');
    image.src=link.href;image.alt=thumbnail.alt;
    imageDialog.showModal();
  });
  imageDialog.addEventListener('click',()=>imageDialog.close());
  imageDialog.addEventListener('close',()=>imageOpener?.focus({preventScroll:true}));


  document.documentElement.dataset.portfolioReady = "true";
})();