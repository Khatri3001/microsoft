import { createTag, queryIndexUrl } from "../../utils/utils.js";
import { createOptimizedPicture } from "../../scripts/aem.js";
function decorateArticles(
  articles,
  featuredDiv,
  featuredArticleCount,
  moreNewsDiv,
  moreNewsCount
) {
  const wrapper = createTag("div", { class: "article-wrapper" });
  articles.forEach((article, i) => {
    if (!article) return;
    const { path, title, image, date, author } = article;
    const container = createTag("div", { class: "article-cards" });
    const cardImage = createTag("p", { class: "article-card-image" }, image);
    const cardBody = createTag("div", { class: "article-card-body" });
    const descriptionEl = createTag("a", {
      class: "article-card-description",
      href: path,
    });
    const dateEl = createTag(
      "p",
      { class: "article-card-date" },
      date + "<span>|</span>"
    );
    const titleEl = createTag("a", { href: path }, author);
    dateEl.append(titleEl);
    const h3 = createTag("h3", null, title + " >");
    descriptionEl.append(h3);
    cardBody.append(dateEl, descriptionEl);
    if (image) {
      container.append(cardImage);
    }
    container.append(cardBody);
    if (i < featuredArticleCount) {
      featuredDiv.append(container);
    } else {
      moreNewsDiv.append(container);
    }
  });
  wrapper.append(featuredDiv);
  wrapper.append(moreNewsDiv);
  return wrapper;
}
 
export default async function decorate(block) {
  const articles = [];
  const language = window.location.pathname.substring(
    1,
    window.location.pathname.length
  );
  const queryIndexPath = queryIndexUrl(language);
 
  const featuredDiv = createTag("div", { class: "featured-wrapper" });
  let featuredArticleCount = 0;
  const moreNewsDiv = createTag("div", { class: "more-news-wrapper" });
  let moreNewsCount = 0;
  [...block.children].forEach((row, i) => {
    if (i == 0) {
      featuredDiv.append(`${row.children[0].textContent}`);
      featuredArticleCount = +row.children[1].textContent;
    } else {
      moreNewsDiv.append(`${row.children[0].textContent}`);
      moreNewsCount = +row.children[1].textContent;
    }
  });
  await fetch(queryIndexPath)
    .then((response) => response.json())
    .then((json) => {
      json.data
        .sort((a, b) => b.lastModified - a.lastModified)
        .slice(0, featuredArticleCount + moreNewsCount)
        .forEach((post) => {
          post.path = window.location.origin + post.path;
          if (post.image) {
            post.image = createOptimizedPicture(
              window.location.origin + post.image,
              "",
              false,
              [{ width: "750" }]
            );
          }
 
          const date = new Date(post.date * 1000);
          const options = { year: "numeric", month: "short", day: "numeric" };
          post.date = date.toLocaleDateString("en-US", options);
 
          articles.push(post);
        });
    });
  const wrapper = decorateArticles(
    articles,
    featuredDiv,
    featuredArticleCount,
    moreNewsDiv,
    moreNewsCount
  );
  block.replaceWith(wrapper);
}