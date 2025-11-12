import { getPhotos } from './photoService.js';
import { renderThumbnails } from './render-thumbnails.js';
import './form-photo-upload.js';

const photoData = async () => {
  const photos = await getPhotos();
  renderThumbnails(photos);
};

photoData();
