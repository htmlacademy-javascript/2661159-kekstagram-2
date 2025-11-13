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

  return response.ok ? await response.json() : Promise.reject({ message: ErrorText[method], status: response.status });
};

const sendData = async (route, method, body) => {
  await fetch(`${BASE_URL}${route}`, { method, body });
};

export { Route, Method, getData, sendData };
