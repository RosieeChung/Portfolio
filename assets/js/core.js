(function(){
  const App = window.PortfolioApp = window.PortfolioApp || {};

  App.DATA = window.PORTFOLIO;

  App.state = {
    level:0,
    section:"about",
    stage:null,
    process:null
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

    listItem({id,no,label,subtitle,active=false}){
      return `
        <button class="list-item ${active ? "active" : ""}" type="button" data-id="${id}">
          <span class="list-no">${no}</span>
          <span class="list-copy">
            <strong>${label}</strong>
            <span>${subtitle || ""}</span>
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