import { getPhotos } from './photo-data-generator.js';
import { renderThumbnails } from './render-thumbnails.js';
import { imgUpload, imgUploadControlChangeHandler } from './form-photo-upload.js';

const photoData = getPhotos();

renderThumbnails(photoData);

imgUpload.control.addEventListener('change', imgUploadControlChangeHandler);
