import { body } from './utils.js';

const COMMENTS_SHOWN = 5;
const bigPictureContainer = document.querySelector('.big-picture');
const buttonCloseModal = bigPictureContainer.querySelector('.big-picture__cancel');
const bigPhoto = bigPictureContainer.querySelector('.big-picture__img img');

const buttonLoadMore = bigPictureContainer.querySelector('.comments-loader');
const commentsContainer = bigPictureContainer.querySelector('.social__comments');
const displayedCommentsContainer = bigPictureContainer.querySelector('.social__comment-count');
const commentsCount = {
  shown: displayedCommentsContainer.querySelector('.social__comment-shown-count'),
  total: displayedCommentsContainer.querySelector('.social__comment-total-count')
};
let allReceivedComments = [];
let currentDisplayedCount = COMMENTS_SHOWN;

const loadMoreComments = () => {
  clearContainer(commentsContainer);

  currentDisplayedCount += COMMENTS_SHOWN;

  renderCommentsToContainer(commentsContainer, allReceivedComments.slice(0, currentDisplayedCount));
  commentsCount.shown.textContent = allReceivedComments.length <= currentDisplayedCount ? allReceivedComments.length : currentDisplayedCount;
  commentsCount.total.textContent = allReceivedComments.length;
  buttonLoadMore.classList.toggle('hidden', allReceivedComments.length <= currentDisplayedCount);
};

const buttonLoadMoreClickHandler = () => {
  loadMoreComments();
};

const bigPictureContainerClickHandler = (evt) => {
  if (evt.target.classList.contains('overlay')) {
    closeModal();
  }
};

const buttonCloseModalClickHandler = () => {
  closeModal();
};

const documentKeydownHandler = (evt) => {
  if (evt.key === 'Escape') {
    bigPictureContainer.classList.add('hidden');
    body.classList.remove('modal-open');
    buttonCloseModal.removeEventListener('click', buttonCloseModalClickHandler);
    bigPictureContainer.removeEventListener('click', bigPictureContainerClickHandler);
    buttonLoadMore.removeEventListener('click', buttonLoadMoreClickHandler);
    currentDisplayedCount = COMMENTS_SHOWN;
  }
};

function closeModal() {
  bigPictureContainer.classList.add('hidden');
  body.classList.remove('modal-open');
  bigPictureContainer.removeEventListener('click', bigPictureContainerClickHandler);
  buttonLoadMore.removeEventListener('click', buttonLoadMoreClickHandler);
  currentDisplayedCount = COMMENTS_SHOWN;
}

function getCommentTemplate(comment) {
  const li = document.createElement('li');
  const img = document.createElement('img');
  const p = document.createElement('p');

  li.classList.add('social__comment');

  img.className = 'social__picture';
  img.src = comment.avatar;
  img.alt = comment.name;
  img.width = 35;
  img.height = 35;

  p.className = 'social__text';
  p.textContent = comment.message;

  li.append(img, p);
  return li;
}

function clearContainer(container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

function renderCommentsToContainer(container, comments) {
  const fragment = document.createDocumentFragment();

  clearContainer(container);

  comments.forEach((comment) => {
    fragment.append(getCommentTemplate(comment));
  });

  container.append(fragment);
}

const renderBigPhoto = ({ url, description, likes, comments }) => {
  clearContainer(commentsContainer);

  allReceivedComments = comments;

  bigPhoto.src = url;
  bigPhoto.alt = description;
  bigPictureContainer.querySelector('.social__caption').textContent = description;
  bigPictureContainer.querySelector('.likes-count').textContent = likes;

  commentsCount.shown.textContent = comments.length <= COMMENTS_SHOWN ? comments.length : COMMENTS_SHOWN;
  commentsCount.total.textContent = comments.length;
  buttonLoadMore.classList.toggle('hidden', comments.length <= COMMENTS_SHOWN);

  renderCommentsToContainer(commentsContainer, comments.slice(0, COMMENTS_SHOWN));

  bigPictureContainer.classList.remove('hidden');
  body.classList.add('modal-open');
};

const thumbnailClickHandler = (data) => function (evt) {
  const currentLink = evt.target.closest('a.picture');

  if (currentLink) {
    evt.preventDefault();
    const currentPhotoID = +currentLink.dataset.photoId;
    const photo = data.find((item) => item.id === currentPhotoID);

    if (photo) {
      renderBigPhoto(photo);
    }
  }

  buttonCloseModal.addEventListener('click', buttonCloseModalClickHandler, { once: true });
  bigPictureContainer.addEventListener('click', bigPictureContainerClickHandler);
  buttonLoadMore.addEventListener('click', buttonLoadMoreClickHandler);
};

document.addEventListener('keydown', documentKeydownHandler);

export { thumbnailClickHandler };
