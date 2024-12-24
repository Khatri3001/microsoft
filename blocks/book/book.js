import { createOptimizedPicture } from "../../scripts/aem.js";

export default function decorate(block) {
  const ul = document.createElement("ul");
  [...block.children].forEach((row, i) => {
    const li = document.createElement("li");
    while (row.firstElementChild) li.append(row.firstElementChild);
    if (i == 0) {
      [...li.children].forEach((div) => {
        if (div.children.length === 1 && div.querySelector("picture"))
          div.className = "book-card-image";
        else div.className = "book-card-body";
      });
      ul.append(li);
    } else {
      let className = null;
      const div = document.createElement("div");
      [...li.children].forEach((div, i) => {
        const blockQuote = document.createElement("blockquote");
        if (div.children.length !== 0) {
          div.className = "book-card-discription";
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
      newImg.classList.add("social-icon"); 
    }
  });
  const firstParagraph = ul.querySelector(
    ".book-card-body > p:first-of-type"
  );
  block.textContent = "";
  block.append(ul);
}
