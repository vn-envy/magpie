import { getVendors, type Vendor } from "./vendors";
import type { FixtureState } from "./state";

function esc(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function vendorCard(vendor: Vendor): string {
  return `
      <article class="vendor-card" data-rank="${vendor.rank}">
        <div class="card-head">
          <span class="rank-badge">${vendor.rank}</span>
          <h3 class="vendor-name">${esc(vendor.brand)}</h3>
        </div>
        <p class="vendor-claim">${esc(vendor.claim)}</p>
        <p class="vendor-evidence">${esc(vendor.evidence)}</p>
        <ul class="feature-tags">
          ${vendor.features.map((f) => `<li>${esc(f)}</li>`).join("\n          ")}
        </ul>
        <a class="vendor-link" href="${esc(vendor.outbound_url)}">Visit ${esc(vendor.brand)}</a>
      </article>`;
}

function loadMoreScript(vendors: Vendor[]): string {
  const hidden = vendors.slice(5).map((v) => ({
    rank: v.rank,
    brand: v.brand,
    claim: v.claim,
    evidence: v.evidence,
    features: v.features,
    outbound_url: v.outbound_url,
  }));
  return `
  <script type="application/json" id="vendor-data">${JSON.stringify(hidden)}</script>
  <script>
    document.getElementById("load-more").addEventListener("click", function () {
      var data = JSON.parse(document.getElementById("vendor-data").textContent);
      var list = document.getElementById("vendor-list");
      data.forEach(function (v) {
        list.insertAdjacentHTML("beforeend",
          '<article class="vendor-card" data-rank="' + v.rank + '">' +
            '<div class="card-head"><span class="rank-badge">' + v.rank + "</span>" +
            '<h3 class="vendor-name">' + v.brand + "</h3></div>" +
            '<p class="vendor-claim">' + v.claim + "</p>" +
            '<p class="vendor-evidence">' + v.evidence + "</p>" +
            '<ul class="feature-tags">' +
            v.features.map(function (f) { return "<li>" + f + "</li>"; }).join("") +
            "</ul>" +
            '<a class="vendor-link" href="' + v.outbound_url + '">Visit ' + v.brand + "</a>" +
          "</article>");
      });
      this.remove();
    });
  </script>`;
}

function carouselScript(): string {
  return `
  <script type="application/json" id="featured-evidence-data">${"{}"}</script>
  <script>
    (function () {
      var slides = Array.prototype.slice.call(document.querySelectorAll(".carousel-slide"));
      var active = 0;
      function show(index) {
        active = Math.max(0, Math.min(slides.length - 1, index));
        slides.forEach(function (slide, i) {
          if (i === active) { slide.setAttribute("data-active", ""); }
          else { slide.removeAttribute("data-active"); }
        });
        document.querySelector(".carousel-prev").disabled = active === 0;
        document.querySelector(".carousel-next").disabled = active === slides.length - 1;
      }
      document.querySelector(".carousel-prev").addEventListener("click", function () { show(active - 1); });
      document.querySelector(".carousel-next").addEventListener("click", function () { show(active + 1); });

      slides.forEach(function (slide) {
        var button = slide.querySelector(".toggle-evidence");
        button.addEventListener("click", function () {
          var drawer = slide.querySelector(".evidence-drawer");
          if (!drawer.hasAttribute("data-loaded")) {
            drawer.setAttribute("data-loaded", "");
            drawer.innerHTML =
              '<p class="featured-evidence">' + slide.getAttribute("data-evidence") + "</p>" +
              '<ul class="featured-features">' +
              JSON.parse(slide.getAttribute("data-features")).map(function (f) {
                return "<li>" + f + "</li>";
              }).join("") + "</ul>" +
              '<a class="featured-link" href="' + slide.getAttribute("data-url") + '">Visit ' +
              slide.querySelector(".featured-name").textContent + "</a>";
          }
          var expanded = button.getAttribute("aria-expanded") === "true";
          button.setAttribute("aria-expanded", String(!expanded));
          button.textContent = expanded ? "Show evidence" : "Hide evidence";
          if (expanded) { drawer.setAttribute("hidden", ""); }
          else { drawer.removeAttribute("hidden"); }
        });
      });
    })();
  </script>`;
}

export function renderFixtureHtml(state: FixtureState): string {
  const vendors = getVendors(state.facts_mode);
  const body =
    state.layout_mode === "legacy_cards"
      ? `
    <section id="ranked-vendors" class="ranked-vendors">
      <h2>Ranked vendors</h2>
      <div id="vendor-list" class="vendor-list">
        ${vendors.slice(0, 5).map(vendorCard).join("\n")}
      </div>
      <button type="button" id="load-more" class="load-more">Load more vendors</button>
    </section>
    ${loadMoreScript(vendors)}`
      : `
    <section id="featured-carousel" class="featured-carousel">
      <h2>Editor&rsquo;s featured platforms</h2>
      <div class="carousel-track">
        ${vendors
          .slice(0, 3)
          .map(
            (v, i) => `
        <div class="carousel-slide"${i === 0 ? ' data-active=""' : ""} data-featured-rank="${v.rank}"
             data-evidence="${esc(v.evidence)}" data-features="${esc(JSON.stringify(v.features))}"
             data-url="${esc(v.outbound_url)}">
          <span class="position-chip">No. ${v.rank} featured</span>
          <h2 class="featured-name">${esc(v.brand)}</h2>
          <p class="featured-tagline">${esc(v.claim)}</p>
          <button type="button" class="toggle-evidence" aria-expanded="false">Show evidence</button>
          <div class="evidence-drawer" hidden></div>
        </div>`,
          )
          .join("\n")}
        <div class="carousel-nav">
          <button type="button" class="carousel-prev" aria-label="Previous featured platform">&larr; Previous</button>
          <button type="button" class="carousel-next" aria-label="Next featured platform">Next &rarr;</button>
        </div>
      </div>
    </section>
    <section id="ranked-vendors" class="ranked-vendors">
      <h2>More ranked vendors</h2>
      <div class="vendor-list">
        ${vendors.slice(3).map(vendorCard).join("\n")}
      </div>
    </section>
    ${carouselScript()}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Enterprise Support Platforms 2026</title>
<meta name="robots" content="noindex">
<style>
  body { font-family: Georgia, "Times New Roman", serif; color: #1e293b; margin: 0; background: #f8fafc; }
  main { max-width: 720px; margin: 0 auto; padding: 40px 24px 24px; }
  .kicker { font-family: Arial, sans-serif; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #4f46e5; font-weight: 700; }
  h1 { font-size: 30px; margin: 8px 0 6px; color: #0f172a; }
  .meta-line { font-family: Arial, sans-serif; font-size: 13px; color: #64748b; }
  .methodology { font-size: 14px; line-height: 1.6; color: #475569; border-bottom: 1px solid #e2e8f0; padding-bottom: 20px; }
  h2 { font-size: 20px; color: #0f172a; margin: 28px 0 14px; }
  .vendor-list { display: flex; flex-direction: column; gap: 16px; }
  .vendor-card { border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; background: #fff; }
  .card-head { display: flex; align-items: center; gap: 10px; }
  .rank-badge { font-family: Arial, sans-serif; width: 30px; height: 30px; border-radius: 999px; background: #0f172a; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; }
  .vendor-name { font-size: 17px; margin: 0; }
  .vendor-claim { font-weight: 600; font-size: 14px; margin: 10px 0 6px; }
  .vendor-evidence { font-size: 14px; line-height: 1.55; color: #475569; margin: 0 0 10px; }
  .feature-tags { list-style: none; display: flex; flex-wrap: wrap; gap: 6px; padding: 0; margin: 0 0 10px; }
  .feature-tags li { font-family: Arial, sans-serif; font-size: 12px; background: #f1f5f9; color: #475569; padding: 3px 10px; border-radius: 999px; }
  .vendor-link { font-family: Arial, sans-serif; font-size: 13px; color: #4f46e5; }
  .load-more { font-family: Arial, sans-serif; width: 100%; padding: 12px; margin-top: 20px; border: 1px solid #cbd5e1; background: #fff; border-radius: 8px; font-weight: 600; color: #334155; cursor: pointer; }
  .featured-carousel .carousel-track { border: 1px solid #c7d2fe; background: #eef2ff; border-radius: 14px; padding: 28px; }
  .carousel-slide { display: none; flex-direction: column; align-items: center; text-align: center; }
  .carousel-slide[data-active] { display: flex; }
  .position-chip { font-family: Arial, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; background: #4f46e5; color: #fff; padding: 4px 12px; border-radius: 999px; }
  .featured-name { font-size: 24px; margin: 14px 0 6px; }
  .featured-tagline { font-size: 14px; color: #475569; margin: 0 0 14px; }
  .toggle-evidence { font-family: Arial, sans-serif; font-size: 13px; font-weight: 600; color: #4338ca; background: #fff; border: 0; border-radius: 8px; padding: 9px 16px; cursor: pointer; box-shadow: 0 1px 2px rgba(0,0,0,0.08); }
  .evidence-drawer { background: #fff; border-radius: 10px; padding: 14px; margin-top: 14px; width: 100%; box-sizing: border-box; }
  .evidence-drawer[hidden] { display: none; }
  .featured-evidence { font-size: 14px; line-height: 1.55; }
  .featured-features { list-style: none; display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; padding: 0; margin: 8px 0; }
  .featured-features li { font-family: Arial, sans-serif; font-size: 12px; background: #f1f5f9; color: #475569; padding: 3px 10px; border-radius: 999px; }
  .featured-link { font-family: Arial, sans-serif; font-size: 13px; color: #4f46e5; }
  .carousel-nav { display: flex; justify-content: space-between; margin-top: 18px; }
  .carousel-nav button { font-family: Arial, sans-serif; font-size: 13px; font-weight: 600; color: #4338ca; background: #fff; border: 0; border-radius: 999px; padding: 9px 16px; cursor: pointer; box-shadow: 0 1px 2px rgba(0,0,0,0.08); }
  .carousel-nav button:disabled { opacity: 0.4; cursor: default; }
  footer { margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 14px; font-family: Arial, sans-serif; font-size: 11px; color: #94a3b8; }
</style>
</head>
<body>
<main>
  <header>
    <p class="kicker">Source Shift Lab · Enterprise Software Review</p>
    <h1>Enterprise Support Platforms 2026</h1>
    <p class="meta-line">Category: enterprise customer support · Last updated: 2026-08-21</p>
  </header>
  <p class="methodology">Methodology: platforms are reviewed quarterly by our editorial team and ranked by evidence strength, integration depth, and compliance posture. All vendor claims are backed by cited, verifiable evidence.</p>${body}
  <footer>Synthetic public fixture for scraper-reliability testing · Controlled chaos fixture · Revision ${state.revision} · layout: ${state.layout_mode} · facts: ${state.facts_mode}</footer>
</main>
</body>
</html>`;
}
