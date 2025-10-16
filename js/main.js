import { getPhotos } from './photo-data-generator.js';
import { renderThumbnails } from './render-thumbnails.js';
import { imgUploadControlChangeHandler } from './forms/form-photo-upload.js';

const photoData = getPhotos();

renderThumbnails(photoData);
