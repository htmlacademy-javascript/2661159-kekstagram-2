import { body } from './utils';

const MESSAGE_LIVE_TIME = 5000;

const errorTemplate = body.querySelector('#data-error').content;

const deleteMessageWithDelay = (cssClassName, delay)=> {
  const errorBlock = body.querySelector(cssClassName);

  setTimeout(()=> {
    errorBlock.remove();
  }, delay);
};

const showErrorMessage = ()=> {
  const deepTemplateClone = errorTemplate.cloneNode(true);

  body.append(deepTemplateClone);
  deleteMessageWithDelay('.data-error', MESSAGE_LIVE_TIME);
};

export { showErrorMessage };
