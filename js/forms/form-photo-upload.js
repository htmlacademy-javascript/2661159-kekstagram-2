import { body } from '../utils.js';

const imgUploadContainer = document.querySelector('.img-upload');
const imgUpload = {
  defaultURL: 'img/upload-default-image.jpg',
  form: imgUploadContainer.querySelector('#upload-select-image'),
  control: imgUploadContainer.querySelector('#upload-file'),
  overlay: imgUploadContainer.querySelector('.img-upload__overlay'),
  buttonCloseModal: imgUploadContainer.querySelector('#upload-cancel'),
  preview: imgUploadContainer.querySelector('.img-upload__preview img'),
  previewEffectThumbnails: imgUploadContainer.querySelectorAll('.effects__preview')
};

const imgUploadButtonCloseModalClickHandler = () => {
  closeModal();
};

const imgUploadOverlayClickHandler = (evt) => {
  if (evt.target.classList.contains('img-upload__overlay')) {
    closeModal();
  }
};

const EscPressHandler = (evt)=> {
  if (evt.key === 'Escape') {
    imgUpload.overlay.classList.add('hidden');
  }
};

function closeModal() {
  imgUpload.overlay.classList.add('hidden');
  body.classList.remove('modal-open');
  imgUpload.buttonCloseModal.removeEventListener('click', imgUploadButtonCloseModalClickHandler);
  imgUpload.overlay.removeEventListener('click', imgUploadOverlayClickHandler);
}

const getFileURL = ()=> {
  const file = imgUpload.control.files[0];

  return file ? URL.createObjectURL(file) : imgUpload.defaultURL;
};

const imgUploadControlChangeHandler = ()=> {
  imgUpload.overlay.classList.remove('hidden');
  body.classList.add('modal-open');
  imgUpload.preview.src = `${ getFileURL() }`;
  imgUpload.previewEffectThumbnails.forEach((thumbnail)=> {
    thumbnail.style.backgroundImage = `url(${ getFileURL() })`;
  });

  imgUpload.buttonCloseModal.addEventListener('click', imgUploadButtonCloseModalClickHandler, { once: true });
  imgUpload.overlay.addEventListener('click', imgUploadOverlayClickHandler);
};

document.addEventListener('keydown', EscPressHandler);
imgUpload.control.addEventListener('change', imgUploadControlChangeHandler);

export { imgUploadControlChangeHandler };
