function getStringLength(str, maxStringLength) {
  return str.length <= maxStringLength;
}

function isPalindrome(str) {
  let newString = '';
  const normalizedString = str.replaceAll(' ', '').toLowerCase();

  for (let i = normalizedString.length - 1; i >= 0; i--) {
    newString += normalizedString[i];
  }

  return newString === normalizedString;
}

function extractInteger(value) {
  if (value) {
    const digits = [];
    const normalizedValue = value.toString(); // этого достаточно на этапе инициализации переменной, т.к. цифры собираются ниже в цикле

    for (let i = 0; i < normalizedValue.length; i++) {
      if (!isNaN(normalizedValue[i])) {
        digits.push(normalizedValue[i]);
      }
    }

    return parseInt(digits.join(''), 10); // если digit пустой массив, то join вернет пустую строку, далее parseInt('', 10) вернет NaN
  }

  return NaN;
}

// Функция перевода часов и минут в минуты
const timeToMinutes = ({ hours, minutes })=> hours * 60 + minutes;

// Функция перевода строки времени вида 17:30 в объект вида { hours: 17, minutes: 30 }
const parseTime = (timeString)=> {
  const [stringHours, stringMinutes] = timeString.split(':');
  const hours = Number(stringHours);
  const minutes = Number(stringMinutes);

  return { hours, minutes };
};

const isMeetingWithinWorkingDay = (workingDayStart, workingDayEnd, meetingStart, meetingDuration)=> {
  const startDay = timeToMinutes(parseTime(workingDayStart));
  const endDay = timeToMinutes(parseTime(workingDayEnd));
  const startMeeting = timeToMinutes(parseTime(meetingStart));
  const endMeeting = startMeeting + meetingDuration;

  return startMeeting >= startDay && endMeeting <= endDay;
};

getStringLength('Привет', 10);
isPalindrome('Т опо Т');
extractInteger('1 кефир, 0.5 батона');
isMeetingWithinWorkingDay('14:00', '17:30', '08:0', 90);
