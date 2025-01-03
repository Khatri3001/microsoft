export function createTag(tag, attributes, html, options = {}) {
  const el = document.createElement(tag);
  if (html) {
    if (
      html instanceof HTMLElement ||
      html instanceof SVGElement ||
      html instanceof DocumentFragment
    ) {
      el.append(html);
    } else if (Array.isArray(html)) {
      el.append(...html);
    } else {
      el.insertAdjacentHTML("beforeend", html);
    }
  }
  if (attributes) {
    Object.entries(attributes).forEach(([key, val]) => {
      el.setAttribute(key, val);
    });
  }
  options.parent?.append(el);
  return el;
}

export function queryIndexUrl(langauge) {
  if (window.location.pathname.includes(langauge) && langauge !== "") {
    return "query-index.json";
  } else if (langauge == "") {
    return "en-us/query-index.json";
  }
}
