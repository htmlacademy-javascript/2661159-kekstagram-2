import { body } from './utils.js';

const closeNotificationModal = (evt) => {
  evt.stopPropagation();

  const notification = document.querySelector('.success') || document.querySelector('.error');
  const buttonCloseNotification = notification.querySelector('.button');

  if (evt.target !== notification || evt.target !== buttonCloseNotification || evt.key === 'Escape') {
    notification.remove();
    body.removeEventListener('click', closeNotificationModal);
    body.removeEventListener('keydown', closeNotificationModal);
  }
};

const appendNotification = (template, cb = null) => {
  cb?.();

  const deepTemplateClone = template.cloneNode(true);

  body.append(deepTemplateClone);
  body.addEventListener('click', closeNotificationModal);
  body.addEventListener('keydown', closeNotificationModal);
};

export { closeNotificationModal, appendNotification };
