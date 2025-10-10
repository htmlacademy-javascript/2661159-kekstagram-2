import { thumbnailClickHandler } from './render-big-photo.js';

const picturesContainer = document.querySelector('.pictures');

const getThumbnail = (template, data)=> {
  const fragment = document.createDocumentFragment();

  data.forEach((item)=> {
    const deepTemplateClone = template.cloneNode(true);
    const clonedTemplate = {
      img: deepTemplateClone.querySelector('.picture__img'),
      likesCount: deepTemplateClone.querySelector('.picture__likes'),
      commentsCount:  deepTemplateClone.querySelector('.picture__comments')
    };

    deepTemplateClone.href = item.url;
    deepTemplateClone.dataset.photoId = item.id;
    clonedTemplate.img.src = item.url;
    clonedTemplate.img.alt = item.description;
    clonedTemplate.likesCount.textContent = item.likes;
    clonedTemplate.commentsCount.textContent = item.comments.length;

    fragment.append(deepTemplateClone);
  });

  return fragment;
};

const renderThumbnails = (data)=> {
  const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');

  picturesContainer.append(getThumbnail(pictureTemplate, data));
  picturesContainer.addEventListener('click', thumbnailClickHandler(data));
};


export { renderThumbnails };
