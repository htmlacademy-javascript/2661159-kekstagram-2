import { getData, Method, Route } from './api';

const getPhotos = async () => await getData(Route.GET_DATA, Method.GET);

export { getPhotos };
