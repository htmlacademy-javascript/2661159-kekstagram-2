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

const loadMoreComments = ()=> {
  currentDisplayedCount += COMMENTS_SHOWN;
  commentsContainer.innerHTML = allReceivedComments.slice(0, currentDisplayedCount).reduce((acc, comment)=> acc + getCommentTemplate(comment), '');
  commentsCount.shown.textContent = allReceivedComments.length <= currentDisplayedCount ? allReceivedComments.length : currentDisplayedCount;
  commentsCount.total.textContent = allReceivedComments.length;
  buttonLoadMore.classList.toggle('hidden', allReceivedComments.length <= currentDisplayedCount);
};

const buttonLoadMoreClickHandler = ()=> {
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

const EscPressHandler = (evt)=> {
  if (evt.key === 'Escape') {
    bigPictureContainer.classList.add('hidden');
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
  return `
     <li class="social__comment">
       <img
         class="social__picture"
         src="${ comment.avatar }"
         alt="${ comment.name }"
         width="35" height="35">
       <p class="social__text">${ comment.message }</p>
     </li>
   `;
}

const renderBigPhoto = ({ url, description, likes, comments })=> {

  allReceivedComments = comments;

  bigPhoto.src = url;
  bigPhoto.alt = description;
  bigPictureContainer.querySelector('.social__caption').textContent = description;
  bigPictureContainer.querySelector('.likes-count').textContent = likes;

  commentsCount.shown.textContent = comments.length <= COMMENTS_SHOWN ? comments.length : COMMENTS_SHOWN;
  commentsCount.total.textContent = comments.length;
  buttonLoadMore.classList.toggle('hidden', comments.length <= COMMENTS_SHOWN);

  commentsContainer.innerHTML = comments.slice(0, COMMENTS_SHOWN).reduce((acc, comment)=> acc + getCommentTemplate(comment), '');

  bigPictureContainer.classList.remove('hidden');
  body.classList.add('modal-open');
};

const thumbnailClickHandler = (data)=> function (evt) {
  const currentLink = evt.target.closest('a.picture');

  if (currentLink) {
    evt.preventDefault();
    const currentPhotoID = +currentLink.dataset.photoId;
    const photo = data.find((item)=> item.id === currentPhotoID);

    if (photo) {
      renderBigPhoto(photo);
    }
  }

  buttonCloseModal.addEventListener('click', buttonCloseModalClickHandler, { once: true });
  bigPictureContainer.addEventListener('click', bigPictureContainerClickHandler);
  buttonLoadMore.addEventListener('click', buttonLoadMoreClickHandler);
};

document.addEventListener('keydown', EscPressHandler);

export { thumbnailClickHandler };
