const filtersBlock = document.querySelector('.img-filters');
// eslint-disable-next-line no-unused-vars
let originalPhotos = [];

const initFilters = (photos) => {
  originalPhotos = [...photos];
  filtersBlock.classList.remove('img-filters--inactive');
};

export { initFilters };
