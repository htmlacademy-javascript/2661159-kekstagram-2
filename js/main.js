import { showErrorMessage } from './message-handling.js';
import { getPhotos } from './photo-service.js';
import { renderThumbnails } from './render-thumbnails.js';
import './form-photo-upload.js';

const initPhotoGallery = async () => {
  try {
    const photos = await getPhotos();
    renderThumbnails(photos);
  } catch (error) {
    showErrorMessage();
  }
};

initPhotoGallery();
