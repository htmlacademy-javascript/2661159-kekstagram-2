import { body, createEscHandler, removeEscHandler } from './utils.js';

const bigPictureContainer = document.querySelector('.big-picture');
const buttonCloseModal = bigPictureContainer.querySelector('.big-picture__cancel');

const overlayClickHandler = (evt)=> {
  if (evt.target.classList.contains('overlay')) {
    bigPictureContainer.classList.add('hidden');
    removeEscHandler();
    bigPictureContainer.removeEventListener('click', overlayClickHandler);
  }
};

const buttonCloseClickHandler = ()=> {
  bigPictureContainer.classList.add('hidden');
  body.classList.remove('modal-open');
  removeEscHandler();
  bigPictureContainer.removeEventListener('click', overlayClickHandler);
};

const getCommentTemplate = (comment)=> `
  <li class="social__comment">
    <img
      class="social__picture"
      src="${ comment.avatar }"
      alt="${ comment.name }"
      width="35" height="35">
    <p class="social__text">${ comment.message }</p>
  </li>
`;

const renderBigPhoto = ({ url, description, likes, comments })=> {
  const bigPhoto = bigPictureContainer.querySelector('.big-picture__img img');
  const commentsContainer = bigPictureContainer.querySelector('.social__comments');

  bigPhoto.src = url;
  bigPhoto.alt = description;
  bigPictureContainer.querySelector('.social__caption').textContent = description;
  bigPictureContainer.querySelector('.likes-count').textContent = likes;
  bigPictureContainer.querySelector('.social__comment-count').classList.add('hidden');
  bigPictureContainer.querySelector('.comments-loader').classList.add('hidden');

  commentsContainer.innerHTML = '';
  comments.forEach((comment)=> {
    commentsContainer.insertAdjacentHTML('beforeend', getCommentTemplate(comment));
  });

  bigPictureContainer.classList.remove('hidden');
  body.classList.add('modal-open');
};

const thumbnailClickHandler = (data)=> function (evt) {
  const currentLink = evt.target.closest('a.picture');
  evt.preventDefault();

  if (currentLink) {
    const currentPhotoID = +currentLink.dataset.photoId;
    const photo = data.find((item)=> item.id === currentPhotoID);

    if (photo) {
      renderBigPhoto(photo);
    }
  }

  createEscHandler(bigPictureContainer, 'hidden', ()=> {
    buttonCloseModal.removeEventListener('click', buttonCloseClickHandler);
    bigPictureContainer.removeEventListener('click', overlayClickHandler);
  });
  buttonCloseModal.addEventListener('click', buttonCloseClickHandler, { once: true });
  bigPictureContainer.addEventListener('click', overlayClickHandler);
};

export { thumbnailClickHandler };
