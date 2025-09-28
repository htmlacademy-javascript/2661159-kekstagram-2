import { getPhotos } from './photo-data-generator.js';
import { renderThumbnails } from './render-thumbnails.js';

renderThumbnails(getPhotos());
