// Loaded from data.json, built by the private App repo. Nothing here decides
// a zone; see zoneFor below.
fetch("data.json?v=497594ff59").then(r => r.json()).then(main).catch(() => {
  document.getElementById("lede").textContent = "The zone data didn't load. Refresh the page to try again.";
});

function main(DATA) {

// Every visible string lives here, one whole sentence per key (house rule for new products).
const STR = {
  title: "Which pay zone am I in?",
  lede: "Remote jobs often set pay by location zone, and every company draws its zones differently. Pick where you live to see the zone you'd land in at companies that publish their lists.",
  placeLabel: "Where do you live?",
  placeHint: "Type a city. If yours isn't listed, pick the nearest metro or \u201cElsewhere in\u201d your state.",
  kindMetro: "Metro area",
  kindState: "Outside the listed metros",
  kindInMetro: "{county}, part of the {metro} metro",
  kindOutside: "{county}, outside the listed metros",
  optTown: "town",
  optCounty: "county",
  optMetro: "metro",
  optState: "rest of state",
  elsewhere: "Elsewhere in {state}",
  noMatch: "No place matches \u201c{q}\u201d. Try a nearby larger city or your state name.",
  example: "Example: Denver. Pick your own place above.",
  allWhat: "Prices vs. the US average (100), {year}",
  allWhatState: "{state} state average vs. the US (100), {year}. Includes its cities.",
  housingWhat: "Housing costs vs. the US average",
  above: "{n}% above",
  below: "{n}% below",
  even: "Even",
  bandWhat: "A rough band we set from the price index.",
  bands: ["Lower cost", "Near average", "Higher cost", "Very high cost"],
  mapHeading: "See the zones on a map",
  mapCompany: "Company",
  mapLoading: "Loading the map\u2026",
  mapFailed: "The map didn't load. The table below still has every zone.",
  mapHint: "Tap or hover over a county to see its zone. Tap to look that place up.",
  mapCounty: "{county}, {st}: {place}. {zone} at {company}.",
  mapNotListed: "not listed",
  youAreHere: "Outlined: {place}",
  tableHeading: "Your zone at each company",
  thCo: "Company",
  thZone: "Your zone",
  thWhy: "Why",
  thSrc: "Source",
  rank: "{band} of their scale: {pos} of {count} zones",
  wrong: "Was this wrong?",
  basisLabel: "Zone follows: ",
  basis: { home: "where you live", work: "where you work", yours: "your location (home or office not said)", none: "not stated" },
  wrongSubject: "Zone report: {company}, {place}",
  wrongBody: "PayZoneMap shows: {zone} at {company} for {place}.\n\nThe zone I was given:\n\nWho told me (recruiter, offer letter, job posting link):\n\nWhen:\n\nRemote, hybrid or in the office:\n\nPage: {url}\n\n(No need to include your name or pay.)",
  bandWord: { top: "Top", middle: "Middle", bottom: "Bottom" },
  mapAll: "All companies (typical zone)",
  typical: ["Usually a top zone", "Usually a middle zone", "Usually a bottom zone"],
  typicalWhat: "Across the {n} companies that list it: top at {t}, middle at {m}, bottom at {b}. Worked out from their lists.",
  typicalNone: "No company lists this place yet.",
  mapCountyAll: "{county}, {st}: {place}. {typical}: top at {t}, middle at {m}, bottom at {b} of {n} companies.",
  likely: "Most companies that list this place put it in their {band} zone ({k} of {n}).",
  bandLower: { top: "top", middle: "middle", bottom: "bottom" },
  notListed: "Not listed",
  ordinal: ["Highest", "2nd", "3rd", "4th", "5th", "6th"],
  checked: "Checked {date}",
  published: "Published: {when}",
  nextHeading: "Before you trust a zone",
  next: [
    "Ask the recruiter which zone your exact address or county is in. Most companies here tell you to, and some draw zones by county.",
    "If you live near the edge of a metro, ask which side of the line you're on. Block, for one, says places about 50 miles out may be in a different zone.",
    "Zones change. Each row shows when we last checked the company's page.",
    "Companies differ on whether your zone follows where you live or where you work. Each row shows what that company says. If you'd live in one zone and commute to an office in another, ask which one counts."
  ],
  aboutHeading: "Where this comes from",
  termsLink: "Terms, privacy and credits",
  contact: "See a zone that's out of date, or work at one of these companies and want it corrected? Email ",
  contactEmail: "hello@payzonemap.com",
  about: [
    "Company zones come from each company's own careers page, linked in its row. Where a company lists cities, we matched each city to its metro area.",
    "Price figures are the Bureau of Economic Analysis Regional Price Parities for {year}, all items and housing. 100 is the US average.",
    "Cost bands are a rough grouping we made from that index: under 97 is lower cost, 97 to 103 near average, 103 to 110 higher, and 110 or more very high.",
    "{bay}",
    "A metro that crosses state lines counts as being in the first state in its name.",
    "The map colors each county by its metro area, using the Census Bureau's July 2023 metro definitions. County shapes are from the Census Bureau via us-atlas."
  ]
};
const t = (k, vars = {}) => STR[k].replace(/\{(\w+)\}/g, (_, v) => vars[v] ?? "");

const metroByCode = Object.fromEntries(DATA.metros.map(m => [m.code, m]));
const stateByAbbr = Object.fromEntries(DATA.states.map(s => [s.st, s]));
const PLACES = [
  ...DATA.metros.map(m => ({ id: "m" + m.code, label: `${m.name}, ${m.states.join("-")}`, kind: "metro", metro: m })),
  ...DATA.states.map(s => ({ id: "st-" + s.st, label: t("elsewhere", { state: s.name }), kind: "state", state: s }))
];
const placeById = Object.fromEntries(PLACES.map(p => [p.id, p]));

function pct(v) {
  const d = Math.round((v - 100) * 10) / 10;
  if (d === 0) return t("even");
  return d > 0 ? t("above", { n: d.toFixed(1) }) : t("below", { n: Math.abs(d).toFixed(1) });
}
function band(v) { return STR.bands[v < 97 ? 0 : v < 103 ? 1 : v < 110 ? 2 : 3]; }

// The site ships answers, not rules: the private build works out each
// place's zone at each company and the page only looks it up.
// answers[placeId][companyIndex] = [zoneIndex or -1, whyText, labelText or -1]
function zoneFor(co, place) {
  const a = DATA.answers[place.answerId || place.id][DATA.companies.list.indexOf(co)];
  return { zone: a[0] < 0 ? null : co.zones[a[0]], why: DATA.text[a[1]], label: a[2] < 0 ? undefined : DATA.text[a[2]] };
}

function el(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

function render(place, isExample) {
  document.getElementById("example-flag").hidden = !isExample;
  document.getElementById("place-kind").textContent = place.county
    ? (place.kind === "metro" ? t("kindInMetro", { county: place.countyName, metro: place.metro.name }) : t("kindOutside", { county: place.countyName }))
    : (place.kind === "metro" ? t("kindMetro") : t("kindState"));
  document.getElementById("place-name").textContent = place.label;
  const all = place.kind === "metro" ? place.metro.all : place.state.all;
  document.getElementById("fact-all").textContent = pct(all);
  document.getElementById("fact-all-what").textContent = place.kind === "metro"
    ? t("allWhat", { year: DATA.year }) : t("allWhatState", { state: place.state.name, year: DATA.year });
  const hb = document.getElementById("fact-housing-box");
  hb.hidden = place.kind !== "metro";
  if (place.kind === "metro") document.getElementById("fact-housing").textContent = pct(place.metro.housing);
  document.getElementById("fact-band").textContent = band(all);
  const cs = DATA.consensus[place.answerId || place.id];
  document.getElementById("fact-typical").textContent = cs[3] ? STR.typical[typicalIdx(cs)] : STR.typicalNone;
  document.getElementById("fact-typical-what").textContent = cs[3] ? t("typicalWhat", { n: cs[3], t: cs[0], m: cs[1], b: cs[2] }) : "";

  const rows = document.getElementById("rows");
  rows.replaceChildren();
  for (const co of DATA.companies.list) {
    const z = zoneFor(co, place);
    const tr = document.createElement("tr");
    tr.append(el("td", "co", co.name));

    const tdZ = document.createElement("td");
    if (z.zone) {
      const pos = co.zones.indexOf(z.zone);
      tdZ.append(el("div", "zone", z.label || z.zone));
      const lad = el("div", "ladder"); lad.setAttribute("aria-hidden", "true");
      co.zones.forEach((_, i) => lad.append(el("span", i === pos ? "on" : "")));
      const bw = STR.bandWord[bandOf(pos, co.zones.length)];
      tdZ.append(lad, el("div", "rank", t("rank", { band: bw, pos: STR.ordinal[pos], count: co.zones.length })));
    } else {
      tdZ.append(el("div", "zone unknown", t("notListed")));
      // Randi, 23 Nov: if 5 or more companies that list this place mostly
      // agree, that's a good bet for one that doesn't. Shown with its count.
      const lk = likelyBand(place);
      if (lk) tdZ.append(el("div", "rank", t("likely", { band: STR.bandLower[lk.band], k: lk.k, n: lk.n })));
    }
    tr.append(tdZ);

    // Randi, 23 Nov: "was this wrong" so people can tell us the zone they
    // were actually given. First version is a pre-filled email; reports are
    // read by a person and never change a zone on their own.
    const wrong = el("a", "wrong", t("wrong"));
    wrong.href = "mailto:" + t("contactEmail") + "?subject=" + encodeURIComponent(t("wrongSubject", { company: co.name, place: place.label }))
      + "&body=" + encodeURIComponent(t("wrongBody", { company: co.name, place: place.label,
        zone: z.zone ? (z.label || z.zone) : t("notListed"), url: location.origin + location.pathname + "#" + (place.hashId || place.id) }));
    tdZ.append(wrong);
    const tdW = el("td", "why");
    tdW.append(el("div", "", z.why));
    // Randi, 23 Nov: it matters whether the zone follows where you live or
    // the office you'd commute to. Only the company's own wording is shown.
    const bs = el("div", "basis");
    bs.append(el("strong", "", t("basisLabel") + STR.basis[co.basis]));
    if (co.basis_quote) bs.append(" \u201c" + co.basis_quote.replace(/\.$/, "") + "\u201d");
    tdW.append(bs);
    if (co.notes) tdW.append(el("div", "note", co.notes));
    tr.append(tdW);

    const tdS = el("td", "src");
    const a = el("a", "", new URL(co.source).hostname.replace(/^www\./, ""));
    a.href = co.source; a.target = "_blank"; a.rel = "noopener";
    tdS.append(a, el("span", "date", t("published", { when: co.published })), el("span", "date", t("checked", { date: co.checked })));
    tr.append(tdS);
    rows.append(tr);
  }
}

// Static text
for (const [id, key] of [["title","title"],["lede","lede"],["place-label","placeLabel"],["place-hint","placeHint"],
  ["example-flag","example"],["fact-housing-what","housingWhat"],["fact-band-what","bandWhat"],["table-heading","tableHeading"],
  ["th-co","thCo"],["th-zone","thZone"],["th-why","thWhy"],["th-src","thSrc"],["next-heading","nextHeading"],["terms-link","termsLink"],["about-heading","aboutHeading"]]) {
  document.getElementById(id).textContent = t(key);
}
{
  const c = document.getElementById("contact");
  const mail = el("a", "", t("contactEmail")); mail.href = "mailto:" + t("contactEmail");
  c.append(t("contact"), mail, ".");
}
document.getElementById("next-list").append(...STR.next.map(s => el("li", "", s)));
document.getElementById("about-list").append(...STR.about.map(s =>
  el("li", "", s.replace("{year}", DATA.year).replace("{bay}", DATA.companies.bayNote))));

// Search box (combobox pattern: arrows move, Enter picks, Escape closes)
const input = document.getElementById("place-input");
const list = document.getElementById("place-options");
let matches = [], active = -1;
// Towns and counties load from towns.json after the page shows. Each one
// resolves to its county, and the county to its metro or "Elsewhere in" its
// state, so a town anywhere gets an answer (added for Lakeport, CA, which is
// in no metro).
const KEYS = new Map();
let TOWNS = [];
const countyById = {};
function keyOf(p) { let k = KEYS.get(p); if (!k) { k = norm(p.name || p.label); KEYS.set(p, k); } return k; }
function countyPlace(fips, name, townName) {
  const base = placeForCounty(fips);
  if (!base) return null;
  const st = (stateByFips[fips.slice(0, 2)] || {}).st;
  return { ...base, answerId: base.id, hashId: "c" + fips, county: fips, countyName: name + ", " + st,
           name: townName || name, label: (townName || name) + ", " + st, town: !!townName };
}
fetch("towns.json?v=5f16f29d2f").then(r => r.json()).then(lines => {
  for (const line of lines) {
    const [name, st, fips, isCounty] = line.split("|");
    if (isCounty) countyById[fips] = name;
  }
  for (const line of lines) {
    const [name, st, fips, isCounty] = line.split("|");
    const p = countyPlace(fips, countyById[fips] || fips, isCounty ? null : name);
    if (p) TOWNS.push(p);
  }
  if (location.hash.startsWith("#c")) fromHash();
  if (input.value.trim() && document.activeElement === input) { matches = search(input.value); showOptions(); }
}).catch(() => { /* metro and state search still works */ });
function norm(s) { return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[.]/g, ""); }
function search(q) {
  const n = norm(q.trim());
  if (!n) return [];
  const scored = [];
  const score = (p, k, bump) => {
    let s = -1;
    if (k === n) s = 0;
    else if (k.startsWith(n)) s = 1;
    else if (k.split(/[-,\s]+/).some(w => w.startsWith(n))) s = 2;
    else if (n.length > 2 && k.includes(n)) s = 3;
    if (s >= 0) scored.push([s + bump, p]);
  };
  // Metros first: "nashville" should offer the Nashville metro before the
  // small towns named Nashville in other states.
  for (const p of PLACES) score(p, keyOf(p), p.kind === "state" ? 0.6 : -1.2);
  for (const p of TOWNS) score(p, keyOf(p), p.town ? 0 : 0.4);
  return scored.sort((a, b) => a[0] - b[0] || a[1].label.localeCompare(b[1].label)).slice(0, 12).map(x => x[1]);
}
function showOptions() {
  list.replaceChildren();
  if (!input.value.trim()) { list.hidden = true; input.setAttribute("aria-expanded", "false"); return; }
  if (!matches.length) {
    const li = el("li", "", t("noMatch", { q: input.value.trim() })); li.setAttribute("aria-disabled", "true");
    list.append(li);
  }
  matches.forEach((p, i) => {
    const li = el("li"); li.id = "opt-" + i; li.setAttribute("role", "option");
    li.setAttribute("aria-selected", i === active ? "true" : "false");
    li.append(el("span", "", p.label), el("span", "kind", p.county ? (p.town ? t("optTown") : t("optCounty")) : p.kind === "metro" ? t("optMetro") : t("optState")));
    li.addEventListener("mousedown", e => { e.preventDefault(); choose(p); });
    list.append(li);
  });
  list.hidden = false; input.setAttribute("aria-expanded", "true");
  if (active >= 0) input.setAttribute("aria-activedescendant", "opt-" + active); else input.removeAttribute("aria-activedescendant");
}
function choose(p) {
  input.value = p.label; matches = []; active = -1;
  list.hidden = true; input.setAttribute("aria-expanded", "false");
  try { history.replaceState(null, "", "#" + (p.hashId || p.id)); } catch (e) { /* some frames refuse */ }
  render(p, false);
}

// ---- Map ----
// Each county takes the zone of its metro; counties outside the listed metros
// are looked up as "Elsewhere in {state}". Zone colours run dark (highest pay)
// to light; with fewer than four zones the ramp spreads out evenly.
const stateByFips = Object.fromEntries(DATA.states.map(s => [s.fips, s]));
const SVGNS = "http://www.w3.org/2000/svg";
const mapSel = document.getElementById("map-company");
const mapCap = document.getElementById("map-caption");
let counties = [], youPath = null, currentPlace = null;
function placeForCounty(id) {
  const code = DATA.countyMetro[id];
  return code ? placeById["m" + code] : placeById["st-" + (stateByFips[id.slice(0, 2)] || {}).st];
}
function bandOf(i, n) { return i === 0 ? "top" : i === n - 1 ? "bottom" : "middle"; }
// Average position across listing companies, 0 = their top zone, 100 = bottom.
function typicalIdx(cs) { return cs[4] < 34 ? 0 : cs[4] < 67 ? 1 : 2; }
function likelyBand(place) {
  const cs = DATA.consensus[place.answerId || place.id];
  if (!cs || cs[3] < 5) return null;
  const counts = { top: cs[0], middle: cs[1], bottom: cs[2] };
  const [band, k] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return k * 2 > cs[3] ? { band, k, n: cs[3] } : null;
}
const TYPICAL_COLORS = ["var(--z0)", "var(--z1)", "var(--z3)"];
const isAll = () => mapSel.value === "__all";
function zoneColor(co, zone) {
  if (!zone) return "var(--znone)";
  const n = co.zones.length, i = co.zones.indexOf(zone);
  return `var(--z${n === 1 ? 0 : Math.round(i * 3 / (n - 1))})`;
}
function paintMap() {
  const leg = document.getElementById("legend");
  leg.replaceChildren();
  let items;
  if (isAll()) {
    for (const c of counties) {
      const cs = c.place && DATA.consensus[c.place.id];
      c.el.setAttribute("fill", cs && cs[3] ? TYPICAL_COLORS[typicalIdx(cs)] : "var(--znone)");
    }
    items = STR.typical.map((name, i) => [name, TYPICAL_COLORS[i]]);
  } else {
    const co = DATA.companies.list.find(x => x.name === mapSel.value);
    for (const c of counties) c.el.setAttribute("fill", c.place ? zoneColor(co, zoneFor(co, c.place).zone) : "var(--znone)");
    items = co.zones.map(z => [z, zoneColor(co, z)]);
    if (!co.default) items.push([t("notListed"), "var(--znone)"]);
  }
  for (const [name, col] of items) {
    const li = el("li"); const sw = el("span", "swatch"); sw.style.background = col;
    li.append(sw, el("span", "", name)); leg.append(li);
  }
  mapCap.textContent = t("mapHint");
}
function outlinePlace(place) {
  currentPlace = place;
  if (!youPath || !window.topojson || !MAPTOPO) return;
  const geoms = MAPTOPO.objects.counties.geometries.filter(g =>
    place.county ? g.id === place.county : placeForCounty(g.id) === place);
  youPath.setAttribute("d", geoms.length ? pathOf(topojson.merge(MAPTOPO, geoms)) : "");
}
function pathOf(geom) {
  const polys = geom.type === "Polygon" ? [geom.coordinates] : geom.type === "MultiPolygon" ? geom.coordinates : [];
  return polys.map(p => p.map(r => "M" + r.map(([x, y]) => x.toFixed(1) + "," + y.toFixed(1)).join("L") + "Z").join("")).join("");
}
function meshPath(lines) {
  return lines.coordinates.map(l => "M" + l.map(([x, y]) => x.toFixed(1) + "," + y.toFixed(1)).join("L")).join("");
}
let MAPTOPO = null;
async function initMap() {
  const box = document.getElementById("mapbox");
  document.getElementById("map-loading").textContent = t("mapLoading");
  mapSel.append(new Option(t("mapAll"), "__all"));
  for (const co of DATA.companies.list) mapSel.append(new Option(co.name, co.name));
  mapSel.value = "__all";
  try {
    if (!window.topojson) throw new Error("topojson-client missing");
    MAPTOPO = await (await fetch("counties.json?v=d907231047")).json();
  } catch (e) {
    document.getElementById("map-loading").textContent = t("mapFailed");
    return;
  }
  const svg = document.createElementNS(SVGNS, "svg");
  svg.setAttribute("viewBox", "0 0 975 610");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", t("mapHeading"));
  for (const f of topojson.feature(MAPTOPO, MAPTOPO.objects.counties).features) {
    const p = document.createElementNS(SVGNS, "path");
    p.setAttribute("d", pathOf(f.geometry)); p.setAttribute("class", "county");
    const st = stateByFips[f.id.slice(0, 2)];
    const c = { el: p, id: f.id, name: f.properties.name, st: st ? st.st : "", place: placeForCounty(f.id) };
    const show = () => {
      if (isAll()) {
        const cs = c.place && DATA.consensus[c.place.id];
        if (cs && cs[3]) {
          mapCap.textContent = t("mapCountyAll", { county: c.name, st: c.st, place: c.place.label,
            typical: STR.typical[typicalIdx(cs)], t: cs[0], m: cs[1], b: cs[2], n: cs[3] });
        }
        return;
      }
      const co = DATA.companies.list.find(x => x.name === mapSel.value);
      const z = c.place ? zoneFor(co, c.place) : { zone: null };
      mapCap.textContent = t("mapCounty", { county: c.name, st: c.st, place: c.place ? c.place.label : c.st,
        zone: z.zone ? (z.label || z.zone) : t("mapNotListed"), company: co.name });
    };
    p.addEventListener("mouseenter", show);
    p.addEventListener("click", () => {
      show();
      const cp = countyPlace(c.id, countyById[c.id] || c.name);
      if (cp) { input.value = cp.label; try { history.replaceState(null, "", "#" + cp.hashId); } catch (e) {} render(cp, false); }
    });
    counties.push(c); svg.append(p);
  }
  const states = document.createElementNS(SVGNS, "path");
  states.setAttribute("class", "states");
  states.setAttribute("d", meshPath(topojson.mesh(MAPTOPO, MAPTOPO.objects.states, (a, b) => a !== b)));
  youPath = document.createElementNS(SVGNS, "path"); youPath.setAttribute("class", "you");
  svg.append(states, youPath);
  box.replaceChildren(svg);
  paintMap();
  if (currentPlace) outlinePlace(currentPlace);
}
mapSel.addEventListener("change", paintMap);
const renderTable = render;
render = (place, isExample) => { renderTable(place, isExample); outlinePlace(place); };
initMap();
input.addEventListener("input", () => { matches = search(input.value); active = matches.length ? 0 : -1; showOptions(); });
input.addEventListener("keydown", e => {
  if (e.key === "ArrowDown" && matches.length) { active = (active + 1) % matches.length; showOptions(); e.preventDefault(); }
  else if (e.key === "ArrowUp" && matches.length) { active = (active - 1 + matches.length) % matches.length; showOptions(); e.preventDefault(); }
  else if (e.key === "Enter" && active >= 0) { choose(matches[active]); e.preventDefault(); }
  else if (e.key === "Escape") { list.hidden = true; input.setAttribute("aria-expanded", "false"); }
});
input.addEventListener("blur", () => { list.hidden = true; input.setAttribute("aria-expanded", "false"); });

function fromHash() {
  const h = location.hash.slice(1);
  const p = placeById[h] || (h.startsWith("c") && countyById[h.slice(1)] ? countyPlace(h.slice(1), countyById[h.slice(1)]) : null);
  if (p) { input.value = p.label; render(p, false); return true; }
  return false;
}
window.addEventListener("hashchange", fromHash);
if (!fromHash()) render(placeById["m19740"], true);
}
