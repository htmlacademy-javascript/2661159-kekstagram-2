import { ranges } from './constants.js';
import { photos, getPhotoItem } from './photo-data-generator.js';

for (let i = 0; i < ranges().PHOTO_RANGE.MAX; i++) {
  photos.push(getPhotoItem(i));
}

// console.log(photos);
