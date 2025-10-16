import { body } from '../utils.js';

const imgUploadContainer = document.querySelector('.img-upload');
const imgUpload = {
  defaultURL: 'img/upload-default-image.jpg',
  form: imgUploadContainer.querySelector('#upload-select-image'),
  control: imgUploadContainer.querySelector('#upload-file'),
  modal: imgUploadContainer.querySelector('.img-upload__overlay'),
  buttonCloseModal: imgUploadContainer.querySelector('#upload-cancel'),
  preview: imgUploadContainer.querySelector('.img-upload__preview img'),
  previewEffectThumbnails: imgUploadContainer.querySelectorAll('.effects__preview')
};

const imgUploadButtonCloseModalClickHandler = () => {
  closeModal();
};

function closeModal() {
  imgUpload.modal.classList.add('hidden');
  body.classList.remove('modal-open');
}

const getFileURL = ()=> {
  const file = imgUpload.control.files[0];

  return file ? URL.createObjectURL(file) : imgUpload.defaultURL;
};

const imgUploadControlChangeHandler = ()=> {
  imgUpload.modal.classList.remove('hidden');
  body.classList.add('modal-open');
  imgUpload.preview.src = `${ getFileURL() }`;
  imgUpload.previewEffectThumbnails.forEach((thumbnail)=> {
    thumbnail.style.backgroundImage = `url(${ getFileURL() })`;
  });

  imgUpload.buttonCloseModal.addEventListener('click', imgUploadButtonCloseModalClickHandler, { once: true });
};

imgUpload.control.addEventListener('change', imgUploadControlChangeHandler);

export { imgUploadControlChangeHandler };
