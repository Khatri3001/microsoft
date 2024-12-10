

// export default function makeFirstThreeWordsClickable() {
//     // Get all <p> elements on the page, including those inside <strong> or <em>
//     const paragraphs = document.querySelectorAll('p, strong, em');
  
//     paragraphs.forEach((element) => {
//       // Extract the text content while preserving existing HTML
//       const content = element.innerHTML;
  
//       // Use regex to split the content into the first three words and the rest
//       const match = content.match(/^(\s*<[^>]+>\s*)*(\S+\s+\S+\s+\S+)(.*)$/);
  
//       if (match) {
//         const [_, openingTags = "", firstThreeWords, restOfText] = match;
  
//         // Wrap the first three words in an <a> tag
//         const clickablePart = `<a href="https://www.google.com" target="_blank" class="clickable-link">${firstThreeWords}</a>`;
  
//         // Reconstruct the element's innerHTML with the clickable link
//         element.innerHTML = `${openingTags}${clickablePart}${restOfText}`;
//       }
//     });
//   }
  