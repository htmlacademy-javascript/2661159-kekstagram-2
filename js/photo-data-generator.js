import {
  getRandomPositiveInteger,
  createUniqueValueFromRange,
  shuffleArray
} from './utils.js';

const LIKES_RANGE = { MIN: 15, MAX: 200 };
const COMMENTS_RANGE = { MIN: 0, MAX: 30 };
const AVATAR_RANGE = { MIN: 1, MAX: 6 } ;

const ALTERNATE_TEXTS = [
  'Вид на пляж с высоты птичьего полета',
  'Табличка "Как пройти на пляж"',
  'Море, камни, песок',
  'Девушка в купальнике с фотоаппаратом',
  'Две миски с рисом в виде человечков',
  'Черный спортивный автомобиль с открытой наверх водительской дверью',
  'Деревянная миска с разрезанной на двое клубникой и вилка',
  'Две кружки с морсом из красной смородины и ветки смородины',
  'Девушка на пляже и пролетающий над ней самолет',
  'Разная обувь в обувнице',
  'Песчаная дорога на пляж вдоль забора',
  'Белый спортивный автомобиль "Ауди"',
  'Блюдо из свежих фруктов и овощей',
  'Шуточная картинка с рыжим котом',
  'Фотография ног в тапках в виде ботинок робота',
  'Летящий самолёт',
  'Хор, барабанщик и их руководитель на сцене',
  'Красный ретро автомобиль в помещении из кирпича',
  'Фотография ног в тапках с фонариком',
  'Вечерняя фотография пальм на площади с подсветкой',
  'Мясное кушанье на деревянной тарелке и вилка',
  'Купающиеся в море пара человек смотрят на закат',
  'Краб в естественной среде на суше',
  'Фотография концерта',
  'Бегемот пытается ухватить автомобиль'
];

const COMMENT_MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

const USER_NAMES = ['Артём', 'Крокодил Гена', 'ЯнаЯ', 'Батя', 'Yoshi', 'Yla123'];

const getCommentID = createUniqueValueFromRange(COMMENTS_RANGE.MIN, COMMENTS_RANGE.MAX);

const getCommentItem = ()=> {
  const id = getCommentID();
  const avatar = `img/avatar-${ getRandomPositiveInteger(AVATAR_RANGE.MIN, AVATAR_RANGE.MAX) }.svg`;
  const message = shuffleArray(COMMENT_MESSAGES).slice(0, getRandomPositiveInteger(1, 2)).join(' ');
  const name = USER_NAMES[getRandomPositiveInteger(0, USER_NAMES.length - 1)];

  return {
    id,
    avatar,
    message,
    name
  };
};

const getPhotoItem = (index) => {
  const url = `photos/${ index + 1 }.jpg`;
  const description = ALTERNATE_TEXTS[index];
  const likes = getRandomPositiveInteger(LIKES_RANGE.MIN, LIKES_RANGE.MAX);
  const comments = Array.from({ length: getRandomPositiveInteger(COMMENTS_RANGE.MIN, COMMENTS_RANGE.MAX) }, getCommentItem);

  return {
    id: index + 1,
    url,
    description,
    likes,
    comments
  };
};

const getPhotos = ()=> {
  const MAX_PHOTO_NUMBER = 25;
  const photos = [];

  for (let i = 0; i < MAX_PHOTO_NUMBER; i++) {
    photos.push(getPhotoItem(i));
  }

  return photos;
};

export { getPhotos };
