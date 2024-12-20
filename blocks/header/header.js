import { getMetadata } from "../../scripts/aem.js";
import { loadFragment } from "../fragment/fragment.js";

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia("(min-width: 900px)");

function closeOnEscape(e) {
  if (e.code === "Escape") {
    const nav = document.getElementById("nav");
    const navSections = nav.querySelector(".nav-sections");
    const navSectionExpanded = navSections.querySelector(
      '[aria-expanded="true"]'
    );
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector("button").focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector(".nav-sections");
    const navRightSections = nav.querySelector(".nav-right-sections");
    const navSectionExpanded = navSections.querySelector(
      '[aria-expanded="true"]'
    );
    const navRightSectionExpanded = navRightSections.querySelector(
      '[aria-expanded="true"]'
    );
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
    if (navRightSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navRightSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navRightSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === "nav-drop";
  if (isNavDrop && (e.code === "Enter" || e.code === "Space")) {
    const dropExpanded = focused.getAttribute("aria-expanded") === "true";
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest(".nav-sections"));
    focused.setAttribute("aria-expanded", dropExpanded ? "false" : "true");
  }
}

function focusNavSection() {
  document.activeElement.addEventListener("keydown", openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections
    .querySelectorAll(".nav-sections .default-content-wrapper > ul > li")
    .forEach((section) => {
      section.setAttribute("aria-expanded", expanded);
    });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded =
    forceExpanded !== null
      ? !forceExpanded
      : nav.getAttribute("aria-expanded") === "true";
  const button = nav.querySelector(".nav-hamburger button");
  document.body.style.overflowY = expanded || isDesktop.matches ? "" : "hidden";
  nav.setAttribute("aria-expanded", expanded ? "false" : "true");
  toggleAllNavSections(
    navSections,
    expanded || isDesktop.matches ? "false" : "true"
  );
  button.setAttribute(
    "aria-label",
    expanded ? "Open navigation" : "Close navigation"
  );
  // enable nav dropdown keyboard accessibility
  const navDrops =
    navSections.querySelectorAll(".nav-drop") ??
    navSections.querySelectorAll(".nav-right-drop");
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute("tabindex")) {
        drop.setAttribute("tabindex", 0);
        drop.addEventListener("focus", focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute("tabindex");
      drop.removeEventListener("focus", focusNavSection);
    });
  }

  //enable menu collapse on escape keypress
  if (isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener("keydown", closeOnEscape);
    // collapse menu on focus lost
    nav.addEventListener("focusout", closeOnFocusLost);
    nav.setAttribute("button-aria-expanded", false);
  } else {
    window.removeEventListener("keydown", closeOnEscape);
    nav.removeEventListener("focusout", closeOnFocusLost);
  }
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleBlogMenu(nav, navSections, forceExpanded = null) {
  const expanded =
    forceExpanded !== null
      ? !forceExpanded
      : nav.getAttribute("button-aria-expanded") === "true";
  nav.setAttribute("button-aria-expanded", expanded ? "false" : "true");
}

async function loadNav(block) {
  const navMeta = getMetadata("nav");
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : "/nav";
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = "";
  const nav = document.createElement("nav");
  nav.id = "nav";
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = [
    "logo",
    "brand",
    "sections",
    "right-sections",
    "search-tool",
    "cart-tool",
  ];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });
  const navLogo = nav.querySelector(".nav-logo");
  const navBrand = nav.querySelector(".nav-brand");
  const brandLink = navBrand.querySelector(".button");
  if (brandLink) {
    brandLink.className = "";
    brandLink.closest(".button-container").className = "";
  }

  const navSections = nav.querySelector(".nav-sections");
  if (navSections) {
    navSections
      .querySelectorAll(":scope .default-content-wrapper > ul > li")
      .forEach((navSection) => {
        if (navSection.querySelector("ul"))
          navSection.classList.add("nav-drop");
        navSection.addEventListener("click", (e) => {
          if (
            isDesktop.matches &&
            !e.target.classList.contains("subnav-drop")
          ) {
            const expanded =
              navSection.getAttribute("aria-expanded") === "true";
            toggleAllNavSections(navSections);
            navSection.setAttribute(
              "aria-expanded",
              expanded ? "false" : "true"
            );
          }
        });
        navSection
          .querySelector("ul")
          .querySelectorAll("li")
          .forEach((subnavSection) => {
            if (subnavSection.querySelector("ul")) {
              subnavSection.classList.add("subnav-drop");
              let subnavSectionUL = subnavSection.querySelector("ul");
              subnavSectionUL.classList.add("subnav-drop-ul");
            }
            subnavSection.addEventListener("click", () => {
              if (isDesktop.matches) {
                const expanded =
                  subnavSection.getAttribute("aria-expanded") === "true";
                console.log(expanded);
                subnavSection.setAttribute(
                  "aria-expanded",
                  expanded ? "false" : "true"
                );
              }
            });
            subnavSection.addEventListener("mouseover", () => {
              if (isDesktop.matches) {
                const expanded =
                  subnavSection.getAttribute("aria-expanded") === "true";
                console.log(expanded);
                subnavSection.setAttribute(
                  "aria-expanded",
                  expanded ? "false" : "true"
                );
              }
            });
          });
      });
  }

  const navRightSections = nav.querySelector(".nav-right-sections");
  if (navRightSections) {
    navRightSections
      .querySelectorAll(":scope .default-content-wrapper > ul > li")
      .forEach((navRightSection) => {
        const span = document.createElement("span");
        const ul = navRightSection.querySelector("ul");
        const spanNode = document.createTextNode("All Microsoft");
        // span.append(spanNode);
        navRightSection.replaceChildren(span);
        navRightSection.append(ul);
        if (navRightSection.querySelector("ul"))
          navRightSection.classList.add("nav-right-drop");
        if (isDesktop.matches) {
          navRightSection.addEventListener("click", (e) => {
            const expanded =
              navRightSection.getAttribute("aria-expanded") === "true";
            toggleAllNavSections(navRightSection);
            navRightSection.setAttribute(
              "aria-expanded",
              expanded ? "false" : "true"
            );
            navRightSection.querySelector("span").display = "block";
          });
        }
      });
  }

  // hamburger for mobile
  const hamburger = document.createElement("div");
  hamburger.classList.add("nav-hamburger");
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener("click", () => {
    navRightSections.querySelector("span").style.display = "none";
    navRightSections
      .querySelectorAll(".nav-right-drop>ul>li")
      .forEach((drop) => {
        drop.classList.add("nav-right-drop-child");
        drop.setAttribute("aria-expanded", "false");
        drop.addEventListener("click", () => {
          const expanded = drop.getAttribute("aria-expanded") === "true";
          drop.setAttribute("aria-expanded", expanded ? "false" : "true");
        });
      });
    toggleMenu(nav, navRightSections);
  });
  nav.prepend(hamburger);
  nav.setAttribute("aria-expanded", "false");
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  const navWrapper = document.createElement("div");
  navWrapper.className = "nav-wrapper";
  if (!isDesktop.matches) {
    navWrapper.classList.add("nav-wrapper-border");
  }
  navWrapper.append(nav);
  const blogMenu = document.createElement("div");
  blogMenu.classList.add("blog-menu");
  const blogMenuNode = document.createTextNode("Official Blog Menu");
  blogMenu.append(blogMenuNode);
  blogMenu.addEventListener("click", () => {
    toggleBlogMenu(nav, navSections);
    if (navSections) {
      navSections
        .querySelectorAll(":scope .default-content-wrapper > ul > li")
        .forEach((navSection) => {
          if (navSection.querySelector("ul"))
            navSection.classList.add("nav-drop");
          navSection.addEventListener("click", (e) => {
            if (!e.target.classList.contains("subnav-drop")) {
              const expanded =
                navSection.getAttribute("aria-expanded") === "true";
              toggleAllNavSections(navSections);
              navSection.setAttribute(
                "aria-expanded",
                expanded ? "false" : "true"
              );
            }
          });
          navSection
            .querySelector("ul")
            .querySelectorAll("li")
            .forEach((subnavSection) => {
              if (subnavSection.querySelector("ul")) {
                subnavSection.classList.add("subnav-drop");
                let subnavSectionUL = subnavSection.querySelector("ul");
                subnavSectionUL.classList.add("subnav-drop-ul");
              }
              subnavSection.addEventListener("click", () => {
                const expanded =
                  subnavSection.getAttribute("aria-expanded") === "true";
                console.log(expanded);
                subnavSection.setAttribute(
                  "aria-expanded",
                  expanded ? "false" : "true"
                );
              });
              subnavSection.addEventListener("mouseover", () => {
                if (isDesktop.matches) {
                  const expanded =
                    subnavSection.getAttribute("aria-expanded") === "true";
                  console.log(expanded);
                  subnavSection.setAttribute(
                    "aria-expanded",
                    expanded ? "false" : "true"
                  );
                }
              });
            });
        });
    }
  });
  navWrapper.append(blogMenu);
  block.append(navWrapper);
  searchFunc(navLogo, block);
}

/**
 * search button functionality
 * @param {*} navLogo
 * @param {*} block
 */
function searchFunc(navLogo, block) {
  const searchIcon = document.querySelector(".icon-search");
  searchIcon.addEventListener("click", () => {
    const div = document.createElement("div");
    div.classList.add("search-container");
    const input = document.createElement("input");
    input.classList.add("search-input");
    const searchBtn = document.createElement("button");
    const node = document.createTextNode("btn");
    const cancelBtn = document.createElement("button");
    searchBtn.append(node);
    searchBtn.classList.add("search-btn");
    input.appendChild(searchBtn);
    block.textContent = "";
    const nav = document.createElement("nav");
    nav.id = "nav";
    if (isDesktop.matches) {
      nav.classList.remove("search");
      nav.append(navLogo);
      const cancelNode = document.createTextNode("Cancel");
      cancelBtn.classList.add("cancel-btn");
      cancelBtn.append(cancelNode);
      div.appendChild(input);
      div.appendChild(cancelBtn);
    } else {
      nav.classList.add("search");
      cancelBtn.classList.add("cancel-btn");
      const lineDiv = document.createElement("div");
      lineDiv.classList.add("horizontal-line");
      cancelBtn.appendChild(lineDiv);
      div.appendChild(cancelBtn);
      div.appendChild(input);
    }
    nav.append(div);
    const navWrapper = document.createElement("div");
    navWrapper.className = "nav-wrapper";
    navWrapper.append(nav);
    block.append(navWrapper);
    if (cancelBtn)
      cancelBtn.addEventListener("click", () => {
        loadNav(block);
      });
  });
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  await loadNav(block);
  const navLogo = nav.querySelector(".nav-logo");
  searchFunc(navLogo, block);
  isDesktop.addEventListener("change", () => {
    loadNav(block);
  });
}
