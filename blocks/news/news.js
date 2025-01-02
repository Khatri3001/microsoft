export default function decorate(block) {
  const ul = document.createElement("ul");

  [...block.children].forEach((row, i) => {
    const li = document.createElement("li");
    li.className = `row-${i + 1}`;
    while (row.firstElementChild) {
      li.appendChild(row.firstElementChild);
    }

    if (i === 1) {
      const leftDiv = document.createElement("div");
      const rightDiv = document.createElement("div");
      leftDiv.className = "second-row-image";
      rightDiv.className = "second-row-description";

      const children = [...li.children];
      if (children[0]) leftDiv.append(children[0]);
      if (children[1]) rightDiv.append(children[1]);

      li.textContent = "";
      li.append(leftDiv, rightDiv);
    }

    ul.appendChild(li);
  });

  const firstRowImages = ul.querySelectorAll(".row-1 img");
  firstRowImages.forEach((img) => {
    img.style.width = "40px";
    img.style.height = "35px";
    img.style.objectFit = "cover";
    img.style.borderRadius = "4px";
  });

  block.textContent = "";
  block.appendChild(ul);
  block.classList.add("news"); 
}
