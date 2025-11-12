const BASE_URL = 'https://31.javascript.htmlacademy.pro/kekstagram';

const Route = {
  GET_DATA: '/data',
  SEND_DATA: '/',
};

const Method = {
  GET: 'GET',
  POST: 'POST',
};

const ErrorText = {
  [Method.GET]: 'Не удалось загрузить данные. Попробуйте еще раз',
  [Method.POST]: 'Не удалось отправить данные формы',
};

const getData = async (route, method, body = null) => {
  const response = await fetch(`${BASE_URL}${route}`, { method, body});
  if (!response.ok) {
    throw new Error(ErrorText[method]);
  }
  return response.json();
};

export { BASE_URL, Route, Method, ErrorText, getData };
