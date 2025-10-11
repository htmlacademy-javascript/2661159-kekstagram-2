const body = document.querySelector('body');

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

// Закрытие по ESC
// eslint-disable-next-line prefer-const
let activeHandler = null;
const removeEscHandler = () => {
  if (activeHandler) {
    document.removeEventListener('keydown', activeHandler);
    activeHandler = null;
  }
};

const createEscHandler = (element, cssClassName, cb) => {
  removeEscHandler();

  const handler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      element.classList.add(cssClassName);
      removeEscHandler();
      if (body.classList.contains('modal-open')) {
        body.classList.remove('modal-open');
      }

      if (cb) {
        cb();
      }
    }
  };

  document.addEventListener('keydown', handler);
  activeHandler = handler;
};


export {
  body,
  getRandomPositiveInteger,
  createUniqueValueFromRange,
  shuffleArray,
  createEscHandler,
  removeEscHandler
};
