import { photoData } from './photo-data-generator.js';
import { renderThumbnails } from './render-thumbnails.js';
import { picturesContainer, picturesContainerClickHandler } from './render-big-photo.js';

renderThumbnails(photoData);
picturesContainer.addEventListener('click', picturesContainerClickHandler(photoData));
