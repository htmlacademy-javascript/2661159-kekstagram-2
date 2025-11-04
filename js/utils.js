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

// Склонение слова после числа
const pluralize = (num, declensions) => {
  const n = Math.abs(num) % 100;
  const n1 = n % 10;

  if (n > 10 && n < 20) {
    return declensions[2];
  }

  if (n1 > 1 && n1 < 5) {
    return declensions[1];
  }

  if (n1 === 1) {
    return declensions[0];
  }

  return declensions[2];
};

export {
  body,
  getRandomPositiveInteger,
  createUniqueValueFromRange,
  shuffleArray,
  pluralize
};
