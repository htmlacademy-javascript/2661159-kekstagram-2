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
    clonedTemplate.img.src = item.url;
    clonedTemplate.img.alt = item.description;
    clonedTemplate.likesCount.textContent = item.likes;
    clonedTemplate.commentsCount.textContent = item.comments.length;

    fragment.append(deepTemplateClone);
  });

  return fragment;
};

const renderThumbnails = (container, thumbnail)=> {
  container.append(thumbnail);
};

export { getThumbnail, renderThumbnails };
