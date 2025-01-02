import { getMetadata, createOptimizedPicture } from "../../scripts/aem.js";
import { createTag } from "../../utils/utils.js";

function findTopMatchingArrays(referenceArray, arrays) {
    // Create an array of objects containing the array and the count of matches
    const matches = arrays.map(arr => {
        const matchCount = arr.tags.filter(element => referenceArray.includes(element)).length;
        return { array: arr, matchCount: matchCount };

    });
    // Sort the arrays by matchCount in descending order
    matches.sort((a, b) => b.matchCount - a.matchCount);

    // Return the top 3 arrays with the maximum number of matches
    return matches.slice(0, 3).map(item => item.array);
}

export default async function decorate(block) {
    const indexedTags = [];
    await fetch('/query-index.json')
        .then((response) => response.json())
        .then((json) => {
            json.data.forEach((post) => {
                post.tags = post.tags != '' ? JSON.parse(post.tags) : post.tags;
                if (new String(post.path).valueOf() != new String(window.location.pathname).valueOf() && post.tags.length) {
                    post.path = window.location.origin + post.path;
                    post.image = createOptimizedPicture(window.location.origin + post.image, '', false, [
                        { width: "200" },
                    ]);
                    const date = new Date(post.date * 1000); // Multiply by 1000 to convert seconds to milliseconds
                    // Format the date to "Nov 12, 2024"
                    const options = { year: 'numeric', month: 'short', day: 'numeric' };
                    post.date = date.toLocaleDateString('en-US', options);
                    indexedTags.push(post);
                }

            })
        });
    const tagMeta = getMetadata("article:tag");
    const topMatched = findTopMatchingArrays(tagMeta, indexedTags);
    console.log(topMatched);
    const wrapper = createTag('div', { class: 'article-wrapper' });
    topMatched.slice(0, 3).forEach((article) => {

        if (!article) return;

        const {
            path, title, image, date, author
        } = article;

        const container = createTag('div', { class: 'article-cards' });
        const cardImage = createTag('p', { class: 'article-card-image' }, image);
        const cardBody = createTag('div', { class: 'article-card-body' });
        const descriptionEl = createTag('a', { class: 'article-card-description', href: path });
        const dateEl = createTag('p', { class: 'article-card-date' }, date + '<span>|</span>');
        const titleEl = createTag('a', { href: path }, author);
        dateEl.append(titleEl);
        const h3 = createTag('h3', null, title + ' >')
        descriptionEl.append(h3);


        cardBody.append(dateEl, descriptionEl);
        container.append(cardImage, cardBody);
        wrapper.append(container)

    });
    block.textContent = '';
    block.append(wrapper);
}
