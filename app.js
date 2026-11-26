// Loaded from data.json, built by the private App repo. Nothing here decides
// a zone; see zoneFor below.
fetch("data.json?v=4d5203de14").then(r => r.json()).then(main).catch(() => {
  document.getElementById("lede").textContent = "The zone data didn't load. Refresh the page to try again.";
});

function main(DATA) {

// Every visible string lives here, one whole sentence per key (house rule for new products).
const STR = {
  title: "Which pay zone am I in?",
  lede: "Remote jobs often set pay by location zone, and every company draws its zones differently. Search by place, company, role or pay.",
  placeLabel: "Where do you live?",
  companyLabel: "Company",
  companyPh: "Any company",
  companyNoMatch: "No company matches \u201c{q}\u201d yet. Suggest one at hello@payzonemap.com.",
  companyKind: "Zones at",
  companyRest: "everywhere else not listed above",
  companyUnlisted: "Not listed: {text}",
  companyOrder: "A place listed in a higher zone takes that zone.",
  // Decided 25 Nov: a company that posts one US range (GitHub) is listed
  // rather than left out, and says plainly that location still counts.
  oneRangeKind: "one US range",
  oneRangeCompanyKind: "Pay at",
  oneRangeRank: "No zones published",
  oneRangeBasis: "Location still counts: ",
  oneRangeNoLoc: "Location: their postings don't say whether it changes pay",
  oneRangeEverywhere: "everywhere in the US",
  oneRangeMeta: "One range for the whole US; the company publishes no zones.",
  // Decided 25 Nov: a company that posts a range per city and no zone list
  // (Twitch) shows its cities as places, not as a ranked scale.
  cityRank: "Ranges posted for cities here",
  cityKind: "{n} cities",
  cityMeta: "Ranges are set per city; the company publishes no zone list.",
  companyClear: "Show all companies",
  mapShowingAll: "Showing: all companies (typical zone)",
  mapShowing: "Showing: {company}",
  zoneLine: "{zone}",
  placePh: "City or state",
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
  allWhatState: "{state} average vs. the US (100), {year}. Includes its cities.",
  housingWhat: "Housing costs vs. the US average",
  above: "{n}% above",
  below: "{n}% below",
  even: "Even",
  bandWhat: "A rough band from the price index.",
  bands: ["Lower cost", "Near average", "Higher cost", "Very high cost"],
  mapHeading: "See the zones on a map",
  mapCompany: "Company",
  mapLoading: "Loading the map\u2026",
  mapFailed: "The map didn't load. The table below has every zone.",
  mapHint: "Tap or hover over a county to see its zone. Tap to look it up.",
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
  reportedLabel: "Reported by people: ",
  reportedOne: "1 was told {zone}",
  reportedMany: "{n} were told {zone}",
  reportedSpan: " ({span}).",
  reportedDiffers: " This differs from the published list.",
  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  basisLabel: "Zone follows: ",
  basis: { home: "where you live", work: "where you work", yours: "your location (home or office not said)", none: "not stated", officehome: "the office, or where you live if remote" },
  wrongSubject: "Zone report: {company}, {place}",
  wrongBody: "PayZoneMap shows: {zone} at {company} for {place}.\n\nThe zone I was given:\n\nWho told me (recruiter, offer letter, job posting link):\n\nWhen:\n\nRemote, hybrid or in the office:\n\nPage: {url}\n\n(No need to include your name or pay.)",
  bandWord: { top: "Top", middle: "Middle", bottom: "Bottom" },
  mapAll: "All companies (typical zone)",
  typical: ["Usually a top zone", "Usually a middle zone", "Usually a bottom zone"],
  typicalWhat: "Top zone at {t}, middle at {m}, bottom at {b} of the {n} companies that list it.",
  typicalNone: "No company lists this place yet.",
  mapCountyAll: "{county}, {st}: {place}. {typical}: top at {t}, middle at {m}, bottom at {b} of {n} companies.",
  likely: "Most companies that list it put it in their {band} zone ({k} of {n}).",
  bandLower: { top: "top", middle: "middle", bottom: "bottom" },
  notListed: "Not listed",
  ordinal: ["Highest", "2nd", "3rd", "4th", "5th", "6th"],
  checked: "Checked {date}",
  published: "Published: {when}",
  nextHeading: "Before you trust a zone",
  next: [
    "Ask the recruiter which zone your address is in. Some companies draw zones by county.",
    "Near the edge of a metro? Ask which side of the line you're on. Block says places about 50 miles out may be in a different zone.",
    "Zones change. Each row shows when we last checked.",
    "Some companies set your zone by where you live, others by where you work. Each row says which. Live in one zone and work in another? Ask which counts."
  ],
  worldHeading: "Why only the US?",
  world: [
    "A company can only pay you in a country where it can legally employ you, through its own company there or an employer of record.",
    "Each country has its own payroll tax, benefits and labor law, so pay is set country by country.",
    "US sanctions bar or restrict hiring in some places, such as Cuba, Iran, North Korea and Crimea.",
    "Inside the US too, some companies only hire remote staff in states where they're registered. If you're remote, check your state is on the list."
  ],
  worldLink: "See the current list",
  payHeading: "Posted pay ranges for {place}",
  payHeadingCo: "Posted pay ranges at {company} for {place}",
  payHeadingAll: "Posted pay ranges in every zone",
  payHeadingAllCo: "Posted pay ranges at {company}, every zone",
  payIntroAll: "Each range is the company's own, from a current posting, with the zone it applies to. Read {date}. Levels are our match from the job title.",
  payHourly: "{range} an hour",
  payAmt: "Pay amount",
  roleLabel: "Role or job title",
  rolePh: "Product manager",
  searchPayLink: "See the postings",
  payAmtPh: "150k, or 25 an hour",
  payAmtBad: "Enter a number, like 150k or 25.",
  payAmtCovers: "Showing {covers} ranges only. Change \u201cWhat the range covers\u201d for other kinds of pay.",
  payCountAmt: "{p} at {c} have a range that includes {amt} ({covers}): {n}.",
  payN: { posting: ["{n} posting", "{n} postings"], company: ["{n} company", "{n} companies"], range: ["{n} range", "{n} ranges"] },
  payByRole: "By role type: {list}.",
  payWhere: "Location",
  payWhereHere: "Zone for {place}",
  payWhereAll: "Every zone",
  payIntro: "Each range is the company's own, from a current posting, for this place's zone. Read {date}. Levels are our match from the job title.",
  payRole: "Role type",
  payLevel: "Level",
  payCovers: "What the range covers",
  payQ: "Job title contains",
  payAny: "Any",
  payNoLevel: "Level not stated",
  payCount: "{n} from {p} at {c}.",
  payNone: "No current postings match. Try another role, level or title.",
  payMore: "Show more",
  pthJob: "Job",
  pthLevel: "Level",
  pthRange: "Range for your zone",
  pthCovers: "What it covers",
  payAnyZone: "same in every location",
  payFromTitle: "matched from the title word \u201c{word}\u201d",
  payFromRange: "from the range label \u201c{word}\u201d",
  payCoverageCo: "At {company}, {shown} of {read} current US postings show a range we can match to a zone; {ranged} list a range at all.",
  payCoverageSummary: "How complete this is, by company",
  payCoverageLine: "{company}: {shown} of {read} current US postings shown ({ranged} list a range)",
  payCoverageNote: "Postings without a range we can match to a zone aren't shown. We read up to 150 postings per company each week.",
  payWrongSubject: "Pay range report: {company}, {title}",
  payWrongBody: "PayZoneMap shows: {title} at {company}\nLevel: {level}\nRange: {range} ({zone})\nCovers: {covers}\nPosting: {url}\n\nWhat's wrong (the level, the range, or what it covers):\n\nPage: {page}\n\n(No need to include your name or pay.)",
  coversHeading: "What a pay range covers",
  covers: [
    "Base pay: salary only. Bonus, commission, equity and benefits come on top, if offered.",
    "Base plus bonus target: includes a target bonus, so the salary part is lower than shown.",
    "On-target earnings: base plus commission at full quota, common in sales.",
    "Total compensation: base plus bonus, and often equity, in one number.",
    "Each range says what it covers, and different kinds are never mixed. Compare like with like. If a posting doesn't say, it's marked \u201cNot stated\u201d."
  ],
  payAlso: "Also offered: {what}",
  payAlsoWords: { equity: "equity", bonus: "bonus" },
  payPosted: "Posted {date}",
  levelNames: { IC1: "IC1 entry", IC2: "IC2 mid", IC3: "IC3 senior", IC4: "IC4 staff", IC5: "IC5 senior staff", IC6: "IC6 principal", IC7: "IC7 distinguished", M1: "M1 manager", M2: "M2 senior manager", M3: "M3 director", M4: "M4 senior director", M5: "M5 VP", M6: "M6 SVP", M7: "M7 C-level" },
  aboutHeading: "Where this comes from",
  termsLink: "Terms, privacy and credits",
  storyLink: "The story behind PayZoneMap",
  contact: "Zone out of date, or want your company's corrected? Email ",
  contactEmail: "hello@payzonemap.com",
  about: [
    "Zones come from each company's own careers page, linked in its row. Listed cities are matched to their metro area.",
    "Prices: Bureau of Economic Analysis Regional Price Parities, {year}, all items and housing. 100 is the US average.",
    "Cost bands are our rough grouping of that index: under 97 lower, 97 to 103 near average, 103 to 110 higher, 110 or more very high.",
    "{bay}",
    "A metro that crosses state lines counts in the first state in its name.",
    "Counties are colored by metro, using the Census Bureau's July 2023 metro definitions. County shapes: Census Bureau via us-atlas."
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
  for (const co of (selectedCompany ? [selectedCompany] : DATA.companies.list)) {
    const z = zoneFor(co, place);
    const tr = document.createElement("tr");
    tr.append(el("td", "co", co.name));

    const tdZ = document.createElement("td");
    if (z.zone && (co.one_range || co.city_zones)) {
      tdZ.append(el("div", "zone", z.zone), el("div", "rank", t(co.one_range ? "oneRangeRank" : "cityRank")));
    } else if (z.zone) {
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
    // Reports are their own layer (decided 24 Nov): counted, dated, and
    // never mixed into the published zone above them.
    const rp = ((DATA.reports || {})[place.answerId || place.id] || {})[DATA.companies.list.indexOf(co)];
    if (rp) {
      const parts = Object.entries(rp.z).sort((a, b) => b[1] - a[1]).map(([zi, n]) =>
        t(n === 1 ? "reportedOne" : "reportedMany", { n, zone: co.zones[+zi] }));
      const mon = ym => STR.months[+ym.slice(5) - 1] + " " + ym.slice(0, 4);
      const span = rp.from === rp.to ? mon(rp.from) : mon(rp.from) + " to " + mon(rp.to);
      const differs = Object.keys(rp.z).some(zi => co.zones[+zi] !== z.zone);
      const box = el("div", "reported");
      box.append(el("strong", "", t("reportedLabel")), parts.join(", ") + t("reportedSpan", { span }) + (differs ? t("reportedDiffers") : ""));
      tdZ.append(box);
    }
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
    bs.append(el("strong", "", co.one_range ? (co.basis_quote ? t("oneRangeBasis") : t("oneRangeNoLoc")) : t("basisLabel") + STR.basis[co.basis]));
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
// Placeholders (24 Nov): the hint lines under each box read as too wordy. Hover
// was the first idea, but phones have no hover, so each box shows a short
// example instead; the label stays above it, and the no-match and bad-number
// messages still say what to do when it matters.
for (const [id, key] of [["place-input","placePh"],["company-input","companyPh"],["role-input","rolePh"],["amt-input","payAmtPh"],["pay-amt","payAmtPh"]])
  document.getElementById(id).placeholder = t(key);
for (const [id, key] of [["title","title"],["lede","lede"],["place-label","placeLabel"],["company-label","companyLabel"],["company-clear","companyClear"],["role-label","roleLabel"],["amt-label","payAmt"],["search-pay-link","searchPayLink"],["pay-where-label","payWhere"],["pay-role-label","payRole"],["pay-level-label","payLevel"],["pay-covers-label","payCovers"],["pay-q-label","payQ"],["pay-amt-label","payAmt"],["pth-job","pthJob"],["pth-level","pthLevel"],["pth-range","pthRange"],["pth-covers","pthCovers"],
  ["example-flag","example"],["fact-housing-what","housingWhat"],["fact-band-what","bandWhat"],["table-heading","tableHeading"],
  ["th-co","thCo"],["th-zone","thZone"],["th-why","thWhy"],["th-src","thSrc"],["next-heading","nextHeading"],["terms-link","termsLink"],["story-link","storyLink"],["about-heading","aboutHeading"]]) {
  document.getElementById(id).textContent = t(key);
}
{
  const c = document.getElementById("contact");
  const mail = el("a", "", t("contactEmail")); mail.href = "mailto:" + t("contactEmail");
  c.append(t("contact"), mail, ".");
}
document.getElementById("covers-heading").textContent = t("coversHeading");
document.getElementById("covers-list").append(...STR.covers.map(s => el("li", "", s)));
document.getElementById("world-heading").textContent = t("worldHeading");
document.getElementById("world-list").append(...STR.world.map((s, i) => {
  const li = el("li", "", s);
  if (i === 2) {
    const a = el("a", "", t("worldLink")); a.href = "https://ofac.treasury.gov/sanctions-programs-and-country-information";
    a.target = "_blank"; a.rel = "noopener"; li.append(" ", a, ".");
  }
  return li;
}));
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
  render(p, false);
  writeHash();
}

// ---- Map ----
// Each county takes the zone of its metro; counties outside the listed metros
// are looked up as "Elsewhere in {state}". Zone colours run dark (highest pay)
// to light; with fewer than four zones the ramp spreads out evenly.
const stateByFips = Object.fromEntries(DATA.states.map(s => [s.fips, s]));
const SVGNS = "http://www.w3.org/2000/svg";
let selectedCompany = null;
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
const isAll = () => !selectedCompany;
function zoneColor(co, zone) {
  if (!zone) return "var(--znone)";
  if (co.one_range || co.city_zones) return "var(--z2)";
  const n = co.zones.length, i = co.zones.indexOf(zone);
  return `var(--z${n === 1 ? 0 : Math.round(i * 3 / (n - 1))})`;
}
function paintMap() {
  document.getElementById("map-showing").textContent = selectedCompany ? t("mapShowing", { company: selectedCompany.name }) : t("mapShowingAll");
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
    const co = selectedCompany;
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
      const co = selectedCompany;
      const z = c.place ? zoneFor(co, c.place) : { zone: null };
      mapCap.textContent = t("mapCounty", { county: c.name, st: c.st, place: c.place ? c.place.label : c.st,
        zone: z.zone ? (z.label || z.zone) : t("mapNotListed"), company: co.name });
    };
    p.addEventListener("mouseenter", show);
    p.addEventListener("click", () => {
      show();
      const cp = countyPlace(c.id, countyById[c.id] || c.name);
      if (cp) { input.value = cp.label; render(cp, false); writeHash(); }
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

const renderTable = render;
let shownPlace = null, shownExample = true;
render = (place, isExample) => { shownPlace = place; shownExample = isExample; renderTable(place, isExample); outlinePlace(place); renderPay(); };
// ---- Pay ranges by role and level (24 Nov) ----
// Built from current postings at companies whose range labels we can match
// to their zones. The company's own words come first; our IC/M level sits
// beside it, marked as matched. Ranges that cover different things (base,
// bonus included, on-target earnings) are labelled and never combined.
let PAY = null, payShown = 50, payWhereTouched = false;
// Role search (24 Nov, Randi): "Every zone" lets a role be looked up without
// picking a place first. It starts on "Every zone" until a place is chosen.
const payEls = { where: document.getElementById("pay-where"), role: document.getElementById("pay-role"), level: document.getElementById("pay-level"),
  covers: document.getElementById("pay-covers"), q: document.getElementById("pay-q"), amt: document.getElementById("pay-amt") };
// Pay search (24 Nov, Randi): enter a number, see postings whose range includes
// it. Ranges are matched only against ranges that cover the same kind of pay:
// with "Any" chosen, it switches to base pay and says so. Counts, no averages.
let payCoversAuto = false;
// Top search (24 Nov). The role and pay search lived only in the pay section,
// below the map, where a first visit never scrolled. The top fields are the
// same two boxes as the pay section's title and amount, kept in step both
// ways, with a count and a button down to the postings.
const topEls = { role: document.getElementById("role-input"), amt: document.getElementById("amt-input") };
function payAmountOf(s) {
  s = (s || "").toLowerCase().replace(/[$,\s]/g, "");
  const hr = /(\/h(ou)?r|perhour|anhour|hourly|\/h)$/.test(s);
  s = s.replace(/(\/h(ou)?r|perhour|anhour|hourly|\/h)$/, "");
  const m = s.match(/^(\d+(?:\.\d+)?)(k|m)?$/);
  if (!m) return null;
  const v = parseFloat(m[1]) * (m[2] === "k" ? 1e3 : m[2] === "m" ? 1e6 : 1);
  return hr && v >= 1000 ? null : v;
}
fetch("pay.json?v=59f1f03fa1").then(r => r.ok ? r.json() : null).then(p => {
  if (!p) return;
  PAY = p;
  payEls.role.append(new Option(t("payAny"), ""), ...p.families.map((f, i) => new Option(f, String(i))));
  payEls.level.append(new Option(t("payAny"), ""), ...p.levels.map(l => new Option(STR.levelNames[l] || l, l)), new Option(t("payNoLevel"), "none"));
  payEls.covers.append(new Option(t("payAny"), ""), ...p.covers.map((c, i) => new Option(c, String(i))));
  payEls.where.append(new Option("", "here"), new Option(t("payWhereAll"), "all"));
  payEls.where.value = shownExample ? "all" : "here";
  for (const e of Object.values(payEls)) e.addEventListener("input", () => { payShown = 50; payWhereTouched ||= e === payEls.where; renderPay(); });
  for (const [top, box] of [[topEls.role, payEls.q], [topEls.amt, payEls.amt]])
    top.addEventListener("input", () => { box.value = top.value; payShown = 50; renderPay(); });
  // A button, not a #pay-section link: the address holds the place and company
  // (fromHash), and a hash change to #pay-section cleared the chosen company.
  document.getElementById("search-pay-link").addEventListener("click", () => {
    const h = document.getElementById("pay-heading"); h.scrollIntoView({ behavior: "smooth", block: "start" }); h.focus({ preventScroll: true });
  });
  // Anything typed at the top before pay.json arrived.
  payEls.q.value ||= topEls.role.value; payEls.amt.value ||= topEls.amt.value;
  renderPay();
}).catch(() => {});
const money = n => "$" + Math.round(n).toLocaleString("en-US");
const nOf = (what, n) => STR.payN[what][n === 1 ? 0 : 1].replace("{n}", n.toLocaleString("en-US"));
// Hourly jobs (customer experience, SDRs, interns) post an hourly rate. A range
// under $1,000 is hourly and says so; it used to read as "$21 - $25" beside salaries.
const hourly = mx => mx < 1000;
const cents = n => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const payAmount = (mn, mx) => hourly(mx) ? t("payHourly", { range: cents(mn) + " \u2013 " + cents(mx) }) : money(mn) + " \u2013 " + money(mx);
function renderPay() {
  const sec = document.getElementById("pay-section");
  if (!PAY || !shownPlace) { sec.hidden = true; return; }
  sec.hidden = false;
  const pid = shownPlace.answerId || shownPlace.id, ans = DATA.answers[pid];
  const coIdx = selectedCompany ? DATA.companies.list.indexOf(selectedCompany) : -1;
  // Until someone picks a Location themselves, it follows the place: every zone
  // for the opening example, the place's zone once they choose one.
  if (!payWhereTouched) payEls.where.value = shownExample ? "all" : "here";
  payEls.where.options[0].text = t("payWhereHere", { place: shownPlace.label });
  const all = payEls.where.value === "all";
  document.getElementById("pay-heading").textContent = all
    ? (selectedCompany ? t("payHeadingAllCo", { company: selectedCompany.name }) : t("payHeadingAll"))
    : selectedCompany ? t("payHeadingCo", { company: selectedCompany.name, place: shownPlace.label }) : t("payHeading", { place: shownPlace.label });
  document.getElementById("pay-intro").textContent = t(all ? "payIntroAll" : "payIntro", { date: PAY.snapshot });
  const amtRaw = payEls.amt.value.trim(), amt = amtRaw ? payAmountOf(amtRaw) : null;
  if (amt !== null && payEls.covers.value === "") { payEls.covers.value = "0"; payCoversAuto = true; }
  if (!amtRaw && payCoversAuto) { payEls.covers.value = ""; payCoversAuto = false; }
  if (payEls.covers.value !== "0") payCoversAuto = payCoversAuto && payEls.covers.value === "0";
  const amtNote = document.getElementById("pay-amt-note");
  amtNote.textContent = amtRaw && amt === null ? t("payAmtBad")
    : amt !== null ? t("payAmtCovers", { covers: PAY.covers[+payEls.covers.value].toLowerCase() }) : "";
  const role = payEls.role.value, level = payEls.level.value, cov = payEls.covers.value, q = norm(payEls.q.value.trim());
  const hits = PAY.rows.filter(r => {
    const [ci, pi, zi, , , covers, lvlR] = r, post = PAY.postings[pi];
    if (coIdx >= 0 && ci !== coIdx) return false;
    if (!all && zi !== -1 && ans[ci][0] !== zi) return false;
    if (!all && zi === -1 && ans[ci][0] < 0) return false;
    if (role !== "" && String(post[1]) !== role) return false;
    if (cov !== "" && String(covers) !== cov) return false;
    const lv = lvlR || post[2];
    if (level === "none" ? !!lv : (level !== "" && lv !== level)) return false;
    if (q && !norm(post[0]).includes(q)) return false;
    if (amt !== null && (hourly(amt) !== hourly(r[4]) || amt < r[3] || amt > r[4])) return false;
    return true;
  });
  // Every zone: keep each posting's zones together, highest-paid posting first.
  if (all) {
    const top = new Map();
    for (const r of hits) top.set(r[1], Math.max(top.get(r[1]) || 0, r[4]));
    hits.sort((a, b) => top.get(b[1]) - top.get(a[1]) || a[1] - b[1] || a[2] - b[2]);
  } else hits.sort((a, b) => b[4] - a[4]);
  const posts = new Set(hits.map(r => r[1])), cos = new Set(hits.map(r => r[0]));
  let countText = !hits.length ? t("payNone") : amt !== null
    ? t("payCountAmt", { p: nOf("posting", posts.size), c: nOf("company", cos.size), n: nOf("range", hits.length), amt: hourly(amt) ? t("payHourly", { range: cents(amt) }) : money(amt), covers: PAY.covers[+cov].toLowerCase() })
    : t("payCount", { n: nOf("range", hits.length), p: nOf("posting", posts.size), c: nOf("company", cos.size) });
  if (amt !== null && hits.length) {
    const fam = new Map();
    for (const pi of posts) { const f = PAY.families[PAY.postings[pi][1]]; fam.set(f, (fam.get(f) || 0) + 1); }
    countText += " " + t("payByRole", { list: [...fam].sort((a, b) => b[1] - a[1]).map(([f, n]) => f + " " + n).join(", ") });
  }
  document.getElementById("pay-count").textContent = countText;
  if (topEls.role.value !== payEls.q.value) topEls.role.value = payEls.q.value;
  if (topEls.amt.value !== payEls.amt.value) topEls.amt.value = payEls.amt.value;
  const sp = document.getElementById("search-pay");
  sp.hidden = !payEls.q.value.trim() && !amtRaw;
  document.getElementById("search-pay-text").textContent = amtRaw && amt === null ? t("payAmtBad") : countText;
  const tb = document.getElementById("pay-rows"); tb.replaceChildren();
  for (const [ci, pi, zi, mn, mx, covers, lvlR, r8] of hits.slice(0, payShown)) {
    const co = DATA.companies.list[ci], post = PAY.postings[pi], tr = document.createElement("tr");
    const tdJ = el("td"); const a = el("a", "", post[0]); a.href = post[3]; a.target = "_blank"; a.rel = "noopener";
    tdJ.append(el("div", "co", co.name), a, el("div", "sub", PAY.families[post[1]] + (post[4] ? " \u00b7 " + t("payPosted", { date: post[4] }) : "")));
    const lv = lvlR || post[2];
    const tdL = el("td"); tdL.append(el("div", "", lv ? (STR.levelNames[lv] || lv) : t("payNoLevel")));
    const word = lvlR ? r8 : post[6];
    if (lv) tdL.append(el("div", "sub", word ? (lvlR ? t("payFromRange", { word }) : t("payFromTitle", { word })) : ""));
    const tdR = el("td"); tdR.append(el("div", "amt", payAmount(mn, mx)));
    tdR.append(el("div", "sub", zi === -1 ? t("payAnyZone") : co.zones[zi]));
    const tdC = el("td"); tdC.append(el("span", "tag", PAY.covers[covers]));
    if (post[5].length) tdC.append(el("div", "sub", t("payAlso", { what: post[5].map(w => STR.payAlsoWords[w]).join(", ") })));
    const wr = el("a", "wrong", t("wrong"));
    wr.href = "mailto:" + t("contactEmail") + "?subject=" + encodeURIComponent(t("payWrongSubject", { company: co.name, title: post[0] }))
      + "&body=" + encodeURIComponent(t("payWrongBody", { title: post[0], company: co.name, level: lv ? (STR.levelNames[lv] || lv) : t("payNoLevel"),
        range: payAmount(mn, mx), zone: zi === -1 ? t("payAnyZone") : co.zones[zi], covers: PAY.covers[covers], url: post[3],
        page: location.origin + location.pathname + location.hash }));
    tdC.append(wr);
    tr.append(tdJ, tdL, tdR, tdC); tb.append(tr);
  }
  // Coverage: postings without a range are data too (DevOps Docket review).
  const covP = document.getElementById("pay-coverage"), covAll = document.getElementById("pay-coverage-all");
  if (coIdx >= 0) {
    const cv = PAY.coverage[String(coIdx)];
    covAll.hidden = true;
    covP.textContent = cv ? t("payCoverageCo", { company: selectedCompany.name, shown: cv[2], read: cv[0], ranged: cv[1] }) + " " + t("payCoverageNote") : "";
  } else {
    covP.textContent = t("payCoverageNote");
    covAll.hidden = false;
    document.getElementById("pay-coverage-summary").textContent = t("payCoverageSummary");
    const ul = document.getElementById("pay-coverage-list"); ul.replaceChildren();
    for (const [k, cv] of Object.entries(PAY.coverage)) ul.append(el("li", "", t("payCoverageLine", { company: DATA.companies.list[+k].name, shown: cv[2], read: cv[0], ranged: cv[1] })));
  }
  const more = document.getElementById("pay-more");
  more.hidden = hits.length <= payShown; more.textContent = t("payMore");
}
document.getElementById("pay-more").addEventListener("click", () => { payShown += 50; renderPay(); });


// ---- Company search (24 Nov, Randi: too many companies for a dropdown) ----
// A company on its own shows that company's published zone list and its map;
// with a place it narrows the table to that one company's row.
const cInput = document.getElementById("company-input");
const cList = document.getElementById("company-options");
let cMatches = [], cActive = -1;
const slug = s => norm(s).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
function companySearch(q) {
  const n = norm(q.trim());
  if (!n) return [];
  return DATA.companies.list
    .map(co => { const k = norm(co.name); return [k.startsWith(n) ? 0 : k.split(/\s+/).some(w => w.startsWith(n)) ? 1 : k.includes(n) ? 2 : -1, co]; })
    .filter(x => x[0] >= 0).sort((a, b) => a[0] - b[0] || a[1].name.localeCompare(b[1].name)).map(x => x[1]);
}
function showCompanyOptions() {
  cList.replaceChildren();
  if (!cInput.value.trim()) { cList.hidden = true; cInput.setAttribute("aria-expanded", "false"); return; }
  if (!cMatches.length) {
    const li = el("li", "", t("companyNoMatch", { q: cInput.value.trim() })); li.setAttribute("aria-disabled", "true"); cList.append(li);
  }
  cMatches.forEach((co, i) => {
    const li = el("li"); li.id = "copt-" + i; li.setAttribute("role", "option");
    li.setAttribute("aria-selected", i === cActive ? "true" : "false");
    li.append(el("span", "", co.name), el("span", "kind", co.one_range ? t("oneRangeKind") : co.city_zones ? t("cityKind", { n: co.zones.length }) : co.zones.length + " zones"));
    li.addEventListener("mousedown", e => { e.preventDefault(); chooseCompany(co); });
    cList.append(li);
  });
  cList.hidden = false; cInput.setAttribute("aria-expanded", "true");
  if (cActive >= 0) cInput.setAttribute("aria-activedescendant", "copt-" + cActive); else cInput.removeAttribute("aria-activedescendant");
}
function renderCompanyPanel() {
  const panel = document.getElementById("company-panel");
  panel.hidden = !selectedCompany;
  if (!selectedCompany) return;
  const co = selectedCompany, zl = DATA.zoneLists[DATA.companies.list.indexOf(co)];
  document.getElementById("company-kind").textContent = t(co.one_range || co.city_zones ? "oneRangeCompanyKind" : "companyKind");
  document.getElementById("company-name").textContent = co.name;
  const ul = document.getElementById("company-zones"); ul.replaceChildren();
  co.zones.forEach((z, i) => {
    const li = el("li"); const parts = [...zl.zones[i].metros, ...zl.zones[i].states];
    if (zl.zones[i].rest) parts.push(t(co.one_range ? "oneRangeEverywhere" : "companyRest"));
    const sw = el("span", "swatch"); sw.style.background = zoneColor(co, z); sw.style.display = "inline-block"; sw.style.marginRight = "0.4rem"; sw.style.verticalAlign = "-0.15rem";
    const nm = el("span", "zname"); nm.append(sw, z);
    li.append(nm, el("span", "zplaces", parts.join(" \u00b7 ")));
    ul.append(li);
  });
  if (zl.unlisted) { const li = el("li"); li.append(el("span", "zplaces", t("companyUnlisted", { text: zl.unlisted }))); ul.append(li); }
  const meta = document.getElementById("company-meta"); meta.replaceChildren();
  const a = el("a", "", new URL(co.source).hostname.replace(/^www\./, "")); a.href = co.source; a.target = "_blank"; a.rel = "noopener";
  meta.append(co.one_range ? t("oneRangeMeta") + " " : co.city_zones ? t("cityMeta") + " " : t("companyOrder") + " " + t("basisLabel") + STR.basis[co.basis] + ". ", a, " \u00b7 " + t("checked", { date: co.checked }));
}
function writeHash() {
  const parts = [];
  if (shownPlace && !shownExample) parts.push(shownPlace.hashId || shownPlace.id);
  if (selectedCompany) parts.push("co=" + slug(selectedCompany.name));
  try { history.replaceState(null, "", parts.length ? "#" + parts.join("&") : location.pathname); } catch (e) {}
}
function chooseCompany(co) {
  selectedCompany = co; cInput.value = co ? co.name : ""; cMatches = []; cActive = -1;
  cList.hidden = true; cInput.setAttribute("aria-expanded", "false");
  renderCompanyPanel(); paintMap(); if (shownPlace) render(shownPlace, shownExample); writeHash();
}
cInput.addEventListener("input", () => {
  if (!cInput.value.trim() && selectedCompany) { chooseCompany(null); return; }
  cMatches = companySearch(cInput.value); cActive = cMatches.length ? 0 : -1; showCompanyOptions();
});
cInput.addEventListener("keydown", e => {
  if (e.key === "ArrowDown" && cMatches.length) { cActive = (cActive + 1) % cMatches.length; showCompanyOptions(); e.preventDefault(); }
  else if (e.key === "ArrowUp" && cMatches.length) { cActive = (cActive - 1 + cMatches.length) % cMatches.length; showCompanyOptions(); e.preventDefault(); }
  else if (e.key === "Enter" && cActive >= 0) { chooseCompany(cMatches[cActive]); e.preventDefault(); }
  else if (e.key === "Escape") { cList.hidden = true; cInput.setAttribute("aria-expanded", "false"); }
});
cInput.addEventListener("blur", () => { cList.hidden = true; cInput.setAttribute("aria-expanded", "false"); });
document.getElementById("company-clear").addEventListener("click", () => chooseCompany(null));
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
  // "#m19740", "#m19740&co=asana" or "#co=asana" (older links are just the place id).
  const parts = location.hash.slice(1).split("&");
  const coPart = parts.find(x => x.startsWith("co="));
  const co = coPart ? DATA.companies.list.find(c => slug(c.name) === coPart.slice(3)) : null;
  const h = parts.find(x => x && !x.startsWith("co=")) || "";
  if (co !== selectedCompany) { selectedCompany = co || null; cInput.value = co ? co.name : ""; renderCompanyPanel(); if (counties.length) paintMap(); }
  const p = placeById[h] || (h.startsWith("c") && countyById[h.slice(1)] ? countyPlace(h.slice(1), countyById[h.slice(1)]) : null);
  if (p) { input.value = p.label; render(p, false); return true; }
  return !!co && !h;
}
window.addEventListener("hashchange", fromHash);
if (!fromHash() || !shownPlace) render(placeById["m19740"], true);
}
