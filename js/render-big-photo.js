import { body, createEscHandler, removeEscHandler } from './utils.js';

const picturesContainer = document.querySelector('.pictures');
const bigPictureContainer = document.querySelector('.big-picture');
const buttonCloseModal = bigPictureContainer.querySelector('.big-picture__cancel');

const buttonCLoseCLickHandler = ()=> {
  bigPictureContainer.classList.add('hidden');
  body.classList.remove('modal-open');
  removeEscHandler();
};

const getBigPhoto = (data)=> {
  const fragment = document.createDocumentFragment();
  const picturePreview = {
    img: bigPictureContainer.querySelector('.big-picture__img img'),
    title: bigPictureContainer.querySelector('.social__caption'),
    likes: bigPictureContainer.querySelector('.likes-count'),
    comments: bigPictureContainer.querySelector('.social__comments'),
    commentsCount: bigPictureContainer.querySelector('.social__comment-count'),
    buttonLoadMoreComments: bigPictureContainer.querySelector('.comments-loader')
  };
  const { url, description, likes, comments } = data;

  picturePreview.img.src = url;
  picturePreview.img.alt = description;
  picturePreview.title.textContent = description;
  picturePreview.likes.textContent = likes;
  picturePreview.commentsCount.classList.add('hidden');
  picturePreview.buttonLoadMoreComments.classList.add('hidden');

  comments.forEach((comment)=> {
    const commentElement = document.createElement('li');
    commentElement.className = 'social__comment';

    const img = document.createElement('img');
    img.className = 'social__picture';
    img.src = comment.avatar;
    img.alt = comment.name;
    img.width = 35;
    img.height = 35;

    const text = document.createElement('p');
    text.className = 'social__text';
    text.textContent = comment.message;

    commentElement.append(img, text);
    fragment.appendChild(commentElement);
  });

  picturePreview.comments.replaceChildren(fragment);

  bigPictureContainer.classList.remove('hidden');
  if (!body.classList.contains('modal-open')) {
    body.classList.add('modal-open');
  }
};

const picturesContainerClickHandler = (data)=> function (evt) {
  const currentLink = evt.target.closest('a.picture');
  evt.preventDefault();

  if (currentLink) {
    const currentPhotoID = +currentLink.dataset.photoId;
    const photo = data.find((item)=> item.id === currentPhotoID);

    if (photo) {
      getBigPhoto(photo);
    }
  }

  createEscHandler(bigPictureContainer, 'hidden', ()=> {
    buttonCloseModal.removeEventListener('click', buttonCLoseCLickHandler);
  });
  buttonCloseModal.addEventListener('click', buttonCLoseCLickHandler, { once: true });
};

export { picturesContainer, picturesContainerClickHandler };
