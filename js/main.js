import { getPhotos } from './photo-data-generator.js';
import { getThumbnail, renderThumbnails } from './render-thumbnails.js';

const photos = [];
const MAX_PHOTO_NUMBER = 25;
const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
const picturesContainer = document.querySelector('.pictures');


getPhotos(photos, MAX_PHOTO_NUMBER);

renderThumbnails(picturesContainer, getThumbnail(pictureTemplate, photos));
