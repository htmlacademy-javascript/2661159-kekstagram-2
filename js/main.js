import { getPhotos } from './photo-data-generator.js';
import { renderThumbnails } from './render-thumbnails.js';

const photoData = getPhotos();

renderThumbnails(photoData);
