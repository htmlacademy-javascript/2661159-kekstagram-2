const PHOTO_RANGE = { MIN: 1, MAX: 25 };
const LIKES_RANGE = { MIN: 15, MAX: 200 };
const COMMENTS_RANGE = { MIN: 0, MAX: 30 };
const AVATAR_RANGE = { MIN: 1, MAX: 6 };

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

// Получение рандомного целого числа из диапазона от a до b
const getRandomPositiveInteger = (a, b) => {
  const lower = Math.ceil(Math.min(Math.abs(a), Math.abs(b)));
  const upper = Math.floor(Math.max(Math.abs(a), Math.abs(b)));
  const result = Math.random() * (upper - lower + 1) + lower;

  return Math.floor(result);
};

// Получение уникального числового значения из диапазона от min до max
const createUniqueValueFromRange = (min, max) => {
  const usedValues = [];

  return function () {
    let currentValue = getRandomPositiveInteger(min, max);

    if (usedValues.length >= max - min + 1) { // если длина массива использованных значений больше, либо равна количеству чисел из заданного диапазона
      return null;
    }

    while (usedValues.includes(currentValue)) {
      currentValue = getRandomPositiveInteger(min, max);
    }

    usedValues.push(currentValue);
    return currentValue;
  };
};

// Перемешивание массива
const shuffleArray = (array)=> array.sort(()=> Math.random() - 0.5);

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

const photos = [];

for (let i = 0; i < PHOTO_RANGE.MAX; i++) {
  photos.push(getPhotoItem(i));
}

// чтобы посмотреть результат в консоли нужно удалить 'export' (удалит ошибку SyntaxError в консоли) на строке 111 и раскомментировать строку 114
// console.log(photos);
