import { showErrorMessage } from './message-handling.js';
import { getPhotos } from './photo-service.js';
import { renderThumbnails } from './render-thumbnails.js';
import './form-photo-upload.js';
import { initFilters } from './filters.js';

const initPhotoGallery = async () => {
  try {
    const photos = await getPhotos();
    renderThumbnails(photos);
    initFilters(photos);
  } catch (error) {
    showErrorMessage();
  }
};

initPhotoGallery();
