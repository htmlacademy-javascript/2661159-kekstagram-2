import { getRandomPositiveInteger, createUniqueValueFromRange, shuffleArray } from './utils.js';
import { ranges } from './constants.js';
import { data } from './data.js';

const getCommentID = createUniqueValueFromRange(ranges().COMMENTS_RANGE.MIN, ranges().COMMENTS_RANGE.MAX);

const getCommentItem = ()=> {
  const id = getCommentID();
  const avatar = `img/avatar-${ getRandomPositiveInteger(ranges().AVATAR_RANGE.MIN, ranges().AVATAR_RANGE.MAX) }.svg`;
  const message = shuffleArray(data().COMMENT_MESSAGES).slice(0, getRandomPositiveInteger(1, 2)).join(' ');
  const name = data().USER_NAMES[getRandomPositiveInteger(0, data().USER_NAMES.length - 1)];

  return {
    id,
    avatar,
    message,
    name
  };
};

export const getPhotoItem = (index) => {
  const url = `photos/${ index + 1 }.jpg`;
  const description = data().ALTERNATE_TEXTS[index];
  const likes = getRandomPositiveInteger(ranges().LIKES_RANGE.MIN, ranges().LIKES_RANGE.MAX);
  const comments = Array.from({ length: getRandomPositiveInteger(ranges().COMMENTS_RANGE.MIN, ranges().COMMENTS_RANGE.MAX) }, getCommentItem);

  return {
    id: index + 1,
    url,
    description,
    likes,
    comments
  };
};

export const photos = [];
