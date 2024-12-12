import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  block.append(footer);

  const rows = [...block.children];

  rows.forEach((row, r) => {
    console.log(row)
    //Select the "follow-us" block
    
    const followUsContent = document.querySelector('.follow-us div')

    const followUsText = document.querySelector('.follow-us div > div > p');
    const pictureElement = document.querySelector('.follow-us div > div > picture');
    const followUSColumns = document.querySelector('.follow-us .follow-us-content + div');
    followUsContent?.classList.add('follow-us-content')
    followUsText?.classList.add('follow-us-text');
    pictureElement?.classList.add('follow-us-picture');
    followUSColumns?.classList.add('follow-us-column');
  });
}
