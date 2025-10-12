import { body, createEscHandler, removeEscHandler } from './utils.js';

const COMMENTS_SHOWN = 5;
const bigPictureContainer = document.querySelector('.big-picture');
const buttonCloseModal = bigPictureContainer.querySelector('.big-picture__cancel');
const buttonLoadMore = bigPictureContainer.querySelector('.comments-loader');

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
  buttonLoadMore.removeEventListener('click', loadMoreComments);
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

function loadMoreComments() {
  const comments = loadMoreComments.comments;
  const commentsContainer = loadMoreComments.commentsContainer;
  const commentsCount = loadMoreComments.commentsCount;
  const shownCount = loadMoreComments.shownCount + COMMENTS_SHOWN;

  commentsContainer.innerHTML = comments.slice(0, shownCount).reduce((acc, comment)=> acc + getCommentTemplate(comment), '');

  commentsCount.shown.textContent = shownCount <= comments.length ? shownCount : comments.length;
  loadMoreComments.shownCount = shownCount;

  if (shownCount >= comments.length) {
    buttonLoadMore.classList.add('hidden');
    buttonLoadMore.removeEventListener('click', loadMoreComments);
  }
}

const renderBigPhoto = ({ url, description, likes, comments })=> {
  const bigPhoto = bigPictureContainer.querySelector('.big-picture__img img');
  const commentsContainer = bigPictureContainer.querySelector('.social__comments');
  const displayedCommentsContainer = bigPictureContainer.querySelector('.social__comment-count');
  const commentsCount = {
    shown: displayedCommentsContainer.querySelector('.social__comment-shown-count'),
    total: displayedCommentsContainer.querySelector('.social__comment-total-count')
  };

  bigPhoto.src = url;
  bigPhoto.alt = description;
  bigPictureContainer.querySelector('.social__caption').textContent = description;
  bigPictureContainer.querySelector('.likes-count').textContent = likes;

  loadMoreComments.comments = comments;
  loadMoreComments.commentsContainer = commentsContainer;
  loadMoreComments.commentsCount = commentsCount;
  loadMoreComments.shownCount = COMMENTS_SHOWN;

  commentsCount.shown.textContent = comments.length <= COMMENTS_SHOWN ? comments.length : COMMENTS_SHOWN;
  commentsCount.total.textContent = comments.length;
  buttonLoadMore.classList.toggle('hidden', comments.length <= COMMENTS_SHOWN);

  commentsContainer.innerHTML = comments.slice(0, loadMoreComments.shownCount).reduce((acc, comment)=> acc + getCommentTemplate(comment), '');

  bigPictureContainer.classList.remove('hidden');
  body.classList.add('modal-open');

  if (comments.length > COMMENTS_SHOWN) {
    buttonLoadMore.addEventListener('click', loadMoreComments);
  }
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
    buttonLoadMore.removeEventListener('click', loadMoreComments);
  });
  buttonCloseModal.addEventListener('click', buttonCloseModalClickHandler, { once: true });
  bigPictureContainer.addEventListener('click', bigPictureContainerClickHandler);
};

export { thumbnailClickHandler };
