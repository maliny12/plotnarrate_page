const SITE = {
    title: "Alternative Text for Statistical Graphics",
    desc: "This project aims to improve the accessibility of statistical graphics by generating alt-text from multiple sources of information, including plot images, underlying R code, and supporting text. To get started, you will need an <a href='https://platform.openai.com/api-keys' target='_blank' rel='noopener noreferrer'>OpenAI API key</a>.",
    tags: [["R", "#c3cbe6"], ["Shiny", "#d6a119"], ["Accessibility", "#3fb890"], ["ellmer", "#ff8a92"], ["brailleR", "#1971d6"]],
    footer: ""
};

const PROJECTS = [
    {
        title: "AltTextGenerator",
        sub: "Shiny app",
        desc: "An interactive dashboard for generating alt-text from plot images, source code, and figure captions. Users can also provide feedback on the generated descriptions through the interface.",
        link: "https://maliny.shinyapps.io/alt-text/",
        art: "app",
        image: "images/shinyapp.png",
        tags: [["Shiny", "#c3cbe6"], ["Web app", "#ff8a92"]]
    },

    {
        title: "plotnarrate",
        sub: "R package",
        desc: "Generates alt-text from plot images, Quarto and R Markdown documents using ellmer and BrailleR, based on source code and reference text to create more informative descriptions.",
        link: "https://numbats.github.io/plotnarrate/",
        art: "docs",
        image: "images/plotnarrate.png",
        tags: [["R package", "#c3cbe6"], ["Documentation", "#ff8a92"]]
    }
];

const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const tagHtml = tags => tags.map(([t, c]) => `<span class="tag" style="background:${esc(c)}">${esc(t)}</span>`).join("");
const art = name => (document.getElementById("art-" + name) || document.getElementById("art-app")).innerHTML;

document.getElementById("site-title").textContent = SITE.title;
document.getElementById("site-desc").innerHTML = SITE.desc;
document.getElementById("site-foot").innerHTML = SITE.footer;
document.getElementById("site-tags").innerHTML = tagHtml(SITE.tags);
document.title = SITE.title;

const cards = document.getElementById("cards");
cards.innerHTML = PROJECTS.map(p => `
            <a class="card" href="${esc(p.link)}" target="_blank" rel="noopener">
            <div class="bg">${p.image ? `<img src="${esc(p.image)}" alt="">` : art(p.art)}</div>
            <div class="info">
                <div class="label">
                <h2>${esc(p.title)}</h2>
                <p class="sub">${esc(p.sub)}</p>
                </div>
                <p class="desc" aria-label="${esc(p.desc)}"></p>
                <div class="tags">${tagHtml(p.tags)}</div>
            </div>
            </a>`).join("");

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const touch = matchMedia("(hover: none)").matches;

cards.querySelectorAll(".card").forEach((card, i) => {
    const out = card.querySelector(".desc");
    const text = PROJECTS[i].desc;
    let timer = null;

    if (touch) { out.textContent = text; return; }   // for phone we just reveal it

    const show = () => {
        clearTimeout(timer);
        out.textContent = "";
        const cur = document.createElement("span");
        cur.className = "cursor";
        out.appendChild(cur);
        if (reduce) { cur.before(text); return; }
        let n = 0;
        const step = () => {
            if (n >= text.length) return;
            cur.before(text[n++]);
            const ch = text[n - 1];
            timer = setTimeout(step, ch === "." || ch === "," ? 90 : 14 + Math.random() * 20);
        };
        step();
    };
    const hide = () => { clearTimeout(timer); out.textContent = ""; };

    card.addEventListener("mouseenter", show);
    card.addEventListener("focus", show);
    card.addEventListener("mouseleave", hide);
    card.addEventListener("blur", hide);
});