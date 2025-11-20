import { body } from './utils.js';

const closeNotificationModal = (evt) => {
  evt.stopPropagation();

  const notification = document.querySelector('.success') || document.querySelector('.error');
  const buttonCloseNotification = notification.querySelector('button');

  if (evt.target === notification || evt.target === buttonCloseNotification || evt.key === 'Escape') {
    notification.remove();
    body.removeEventListener('click', bodyClickHandler);
    body.removeEventListener('keydown', bodyKeydownHandler);
  }
};

const appendNotification = (template, cb = null) => {
  cb?.();

  const deepTemplateClone = template.cloneNode(true);

  body.append(deepTemplateClone);
  body.addEventListener('click', bodyClickHandler);
  body.addEventListener('keydown', bodyKeydownHandler);
};

function bodyClickHandler(evt) {
  closeNotificationModal(evt);
}

function bodyKeydownHandler(evt) {
  closeNotificationModal(evt);
}

export { appendNotification };
