import { getMetadata } from "../../scripts/aem.js";
import { loadFragment } from "../fragment/fragment.js";

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata("footer");
  const footerPath = footerMeta
    ? new URL(footerMeta, window.location).pathname
    : "/footer";
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = "";
  const footer = document.createElement("div");
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  block.append(footer);

  const rows = [...block.children];

  rows.forEach((row, r) => {
    console.log(row);
    //Select the "follow-us" block

    const followUsContent = document.querySelector(".follow-us div");

    const followUsText = document.querySelector(".follow-us div > div > p");
    const pictureElement = document.querySelector(
      ".follow-us div > div > picture"
    );
    const followUSColumns = document.querySelector(
      ".follow-us .follow-us-content + div"
    );
    followUsContent?.classList.add("follow-us-content");
    followUsText?.classList.add("follow-us-text");
    pictureElement?.classList.add("follow-us-picture");
    followUSColumns?.classList.add("follow-us-column");

    const languageList = document.querySelector(
      ".follow-us-container .default-content-wrapper > ul"
    );

    languageList.classList.add("language-menu");
    const parentListItem = document.querySelector(
      ".follow-us-container .default-content-wrapper > ul > li"
    );
    parentListItem.classList.add("parent");
    const childList = document.querySelector(
      ".follow-us-container .default-content-wrapper > ul > li > ul"
    );
    childList.classList.add("child-menu");

    const childlistItems = document.querySelectorAll(
      ".follow-us-container .default-content-wrapper > ul > li > ul li"
    );

    // Loop through each <li> and add a class
    childlistItems.forEach(function (item) {
      item.classList.add("child");
    });
    console.log(languageList);
  });

  // Get the parent element (English (United States))
  const parentElement = document.querySelector(".parent");

  // Get the child menu (ul with class 'child-menu')
  const childMenu = parentElement.querySelector(".child-menu");

  // Add an event listener to the parent element
  parentElement.addEventListener("click", function (event) {
    // Prevent the event from bubbling up to the document
    event.stopPropagation();

    // Toggle the visibility of the child menu
    if (childMenu.style.display === "block") {
      childMenu.style.display = "none";
    } else {
      childMenu.style.display = "block";
    }
  });

  // Close the dropdown if the user clicks outside
  document.addEventListener("click", function () {
    childMenu.style.display = "none";
  });

  childMenu.addEventListener("click", function (event) {
    event.target.innerText === "French(fr)"
      ? (window.location.pathname = "fr-fr/")
      : (window.location.pathname = "en-us/");
  });
}
