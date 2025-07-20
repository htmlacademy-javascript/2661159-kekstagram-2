function getStringLength(str, maxStringLength) {
  return str.length <= maxStringLength;
}

function isPalindrome(str) {
  let newString = '';
  const normalizedString = str.replaceAll(' ', '').toLowerCase();

  for (let i = normalizedString.length - 1; i >= 0; i--) {
    newString += normalizedString[i];
  }

  return newString === normalizedString ? 'Строка является палиндромом' : 'Строка не является палиндромом';
}

function extractInteger(value) {
  if (value) {
    const digits = [];
    const normalizedValue =
    typeof value === 'number'
      ? Math.abs(value).toString()
      : value.replaceAll(' ', '');

    for (let i = 0; i < normalizedValue.length; i++) {
      if (!isNaN(normalizedValue[i])) {
        digits.push(normalizedValue[i]);
      }
    }

    return digits.length ? parseInt(digits.join(''), 10) : NaN;
  }

  return NaN;
}

getStringLength('Привет', 10);
isPalindrome('Т опо Т');
extractInteger('1 кефир, 0.5 батона');
