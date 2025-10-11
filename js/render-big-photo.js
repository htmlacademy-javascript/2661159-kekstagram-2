import { body, createEscHandler, removeEscHandler } from './utils.js';

const bigPictureContainer = document.querySelector('.big-picture');
const buttonCloseModal = bigPictureContainer.querySelector('.big-picture__cancel');

const bigPictureContainerClickHandler = (evt) => {
  if (evt.target.classList.contains('overlay')) {
    closeModal();
  }
};

const buttonCloseModalClickHandler = () => {
  closeModal();
};

function closeModal() {
  bigPictureContainer.classList.add('hidden');
  body.classList.remove('modal-open');
  removeEscHandler();
  bigPictureContainer.removeEventListener('click', bigPictureContainerClickHandler);
}

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
  const commentTemplateHTML = comments.reduce((acc, comment)=> acc + getCommentTemplate(comment), '');

  bigPhoto.src = url;
  bigPhoto.alt = description;
  bigPictureContainer.querySelector('.social__caption').textContent = description;
  bigPictureContainer.querySelector('.likes-count').textContent = likes;
  bigPictureContainer.querySelector('.social__comment-count').classList.add('hidden');
  bigPictureContainer.querySelector('.comments-loader').classList.add('hidden');

  commentsContainer.innerHTML = commentTemplateHTML;

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
    buttonCloseModal.removeEventListener('click', buttonCloseModalClickHandler);
    bigPictureContainer.removeEventListener('click', bigPictureContainerClickHandler);
  });
  buttonCloseModal.addEventListener('click', buttonCloseModalClickHandler, { once: true });
  bigPictureContainer.addEventListener('click', bigPictureContainerClickHandler);
};

export { thumbnailClickHandler };
