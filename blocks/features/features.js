import { createOptimizedPicture } from "../../scripts/aem.js";

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement("ul");
  [...block.children].forEach((row, i) => {
    const li = document.createElement("li");
    while (row.firstElementChild) li.append(row.firstElementChild);
    if (i == 0) {
      [...li.children].forEach((div) => {
        if (div.children.length === 1 && div.querySelector("picture"))
          div.className = "features-card-image";
        else div.className = "features-card-body";
      });
      ul.append(li);
    } else {
      let className = null;
      const div = document.createElement("div");
      [...li.children].forEach((div, i) => {
        const blockQuote = document.createElement("blockquote");
        if (div.children.length !== 0) {
          div.className = "features-card-discription";
        }
        if (i == 0) {
          div.querySelector("p") != null
            ? ((className = div.querySelector("p").textContent), div.remove())
            : null;
        }
        if (className != null && i > 0) {
          blockQuote.innerHTML = `${div.innerHTML}`;
          div.replaceWith(blockQuote);
          blockQuote.classList.add(className);
        }
      });
      div.append(li);
      ul.append(div);
    }
  });
  ul.querySelectorAll("picture > img").forEach((img, index, images) => {
    const replacedPicture = createOptimizedPicture(img.src, img.alt, false, [
      { width: "750" },
    ]);
    img.closest("picture").replaceWith(replacedPicture);
    const newImg = replacedPicture.querySelector("img");

    if (index !== images.length - 1) {
      newImg.classList.add("social-icon"); // Add your class here
    }
  });
  const firstParagraph = ul.querySelector(
    ".features-card-body > p:first-of-type"
  );

  // Ensure we have a valid <p> element
  if (firstParagraph) {
    const tempDate = firstParagraph.textContent.split("|")[0].trim(); // Extract date

    // Create the <abbr> element and set its attributes
    const abbrElement = document.createElement("abbr");
    abbrElement.textContent = tempDate.concat(" | "); // Set the date as the text content
    abbrElement.style.color = "#6e6565"; // Set the text color to #6e6565
    abbrElement.style.fontSize = "16px";
    console.log(firstParagraph.firstChild);
    // Insert the <abbr> element at the start of the <p> element
    firstParagraph.replaceChild(abbrElement, firstParagraph.firstChild);
  }

  block.textContent = "";
  block.append(ul);
}
