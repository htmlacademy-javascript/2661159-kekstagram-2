import { shuffleArray, debounce } from './utils.js';
import { renderThumbnails } from './render-thumbnails.js';

const FILTER_BUTTON_ACTIVE_CLASS = 'img-filters__button--active';

const debouncedRender = debounce(renderThumbnails, 500);
const filtersBlock = document.querySelector('.img-filters__form');
let originalPhotos = [];

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

  if (filterButton.classList.contains(FILTER_BUTTON_ACTIVE_CLASS)) {
    return;
  }

  Array.from(filtersBlock.children).forEach((button)=> {
    button.classList.toggle(FILTER_BUTTON_ACTIVE_CLASS, button === filterButton);
  });

  debouncedRender(filteredPhotos);
}

export { initFilters };
