import { shuffleArray, debounce } from './utils.js';
import { renderThumbnails } from './render-thumbnails.js';

const filtersBlock = document.querySelector('.img-filters__form');
let originalPhotos = [];
const debouncedRender = debounce(renderThumbnails, 500);

const initFilters = (photos) => {
  originalPhotos = [...photos];
  filtersBlock.closest('.img-filters').classList.remove('img-filters--inactive');

  filtersBlock.addEventListener('click', filtersBlockClickHandler);
};

function filtersBlockClickHandler(evt) {
  const filterButton = evt.target.closest('.img-filters__button');
  let filteredPhotos = [];

  switch (filterButton.id) {
    case 'filter-random':
      filteredPhotos = shuffleArray([...originalPhotos]);
      break;
    case 'filter-discussed':
      filteredPhotos = [...originalPhotos].sort((a, b) => b.comments.length - a.comments.length);
      break;
    default:
      filteredPhotos = [...originalPhotos];
  }

  Array.from(filtersBlock.children).forEach((button)=> {
    button.classList.toggle('img-filters__button--active', button === filterButton);
  });

  debouncedRender(filteredPhotos);
}

export { initFilters };
