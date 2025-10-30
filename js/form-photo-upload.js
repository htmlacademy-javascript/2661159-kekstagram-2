import { body, pluralize } from './utils.js';

const COMMENT_MAX_CHAR_NUMBER = 140;
const MAX_HASHTAG_COUNT = 5;
const HASHTAG_WORD_DECLENSIONS = ['хэштег', 'хэштега', 'хэштегов'];
const SYMBOL_WORD_DECLENSIONS = ['символ', 'символ', 'символов'];
const hashTagCharactersNumber = {
  MIN: 2,
  MAX: 20
};
const hashTagRegExp = /^#[a-zA-Zа-яА-ЯёЁ0-9]{1,19}$/;

const imgUploadContainer = document.querySelector('.img-upload');
const imgUpload = {
  defaultURL: 'img/upload-default-image.jpg',
  form: imgUploadContainer.querySelector('#upload-select-image'),
  hashTagField: imgUploadContainer.querySelector('.text__hashtags'),
  commentField: imgUploadContainer.querySelector('.text__description'),
  control: imgUploadContainer.querySelector('#upload-file'),
  overlay: imgUploadContainer.querySelector('.img-upload__overlay'),
  buttonCloseModal: imgUploadContainer.querySelector('#upload-cancel'),
  buttonFormSubmit: imgUploadContainer.querySelector('#upload-submit'),
  preview: imgUploadContainer.querySelector('.img-upload__preview img'),
  previewEffectThumbnails: imgUploadContainer.querySelectorAll('.effects__preview')
};

let hashTagErrorMessage = '';
const errorHashTagString = () => hashTagErrorMessage;

const getHashTag = (value) => value.trim().toLowerCase().split(/\s+/);

const pristineConfig = {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'img-upload__field-wrapper--error',
  errorTextParent: 'img-upload__field-wrapper',
};

const pristineInstance = new Pristine(imgUpload.form, pristineConfig);

const getFileURL = ()=> {
  const file = imgUpload.control.files[0];

  return file ? URL.createObjectURL(file) : imgUpload.defaultURL;
};

const isCommentValid = (value)=> value.trim().length <= COMMENT_MAX_CHAR_NUMBER;

const isHashTagValid = (value)=> {
  const hashtags = getHashTag(value);
  const rules = [
    {
      check: (item) => item[0] !== '#',
      error: 'Хэштеги должны начинаться с #'
    },
    {
      check: (item) => item.length < hashTagCharactersNumber.MIN || item.length > hashTagCharactersNumber.MAX,
      error: `Хэштег должен быть длиной от ${ hashTagCharactersNumber.MIN } до ${ hashTagCharactersNumber.MAX } ${ pluralize(hashTagCharactersNumber.MAX, SYMBOL_WORD_DECLENSIONS) }`
    },
    {
      check: (item) => !hashTagRegExp.test(item),
      error: 'Хэштег содержит недопустимые символы'
    },
    {
      check: (item, index, arr) => arr.indexOf(item, index + 1) !== -1,
      error: 'Хэштеги не должны повторяться'
    },
    {
      check: () => hashtags.length > MAX_HASHTAG_COUNT,
      error: `Максимум можно ввести ${MAX_HASHTAG_COUNT} ${ pluralize(MAX_HASHTAG_COUNT, HASHTAG_WORD_DECLENSIONS) }`
    }
  ];

  if (!value || value.trim() === '') {
    return true;
  }

  return hashtags.every((hashtag, index, arr) =>
    rules.every((rule) => {
      const isInvalid = rule.check(hashtag, index, arr);

      if (isInvalid) {
        hashTagErrorMessage = rule.error;
      }

      return !isInvalid;
    })
  );
};

pristineInstance.addValidator(
  imgUpload.hashTagField,
  isHashTagValid,
  errorHashTagString,
  2,
  false
);

pristineInstance.addValidator(
  imgUpload.commentField,
  isCommentValid,
  `Комментарий не должен превышать ${ COMMENT_MAX_CHAR_NUMBER } символов`,
  2,
  false
);

const formSubmitHandler = (evt)=> {
  evt.preventDefault();
  const isValid = pristineInstance.validate();

  if (!isValid) {
    imgUpload.buttonFormSubmit.disabled = true;
  } else {
    imgUpload.buttonFormSubmit.disabled = false;
    imgUpload.form.submit();
  }
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
  if (evt.key === 'Escape' && document.activeElement !== imgUpload.commentField) {
    imgUpload.overlay.classList.add('hidden');
    imgUpload.preview.src = imgUpload.defaultURL;
    body.classList.remove('modal-open');
  }
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

const inputHandler = ()=> {
  imgUpload.buttonFormSubmit.disabled = !pristineInstance.validate();
};

function closeModal() {
  pristineInstance.reset();
  imgUpload.overlay.classList.add('hidden');
  body.classList.remove('modal-open');
  imgUpload.preview.src = imgUpload.defaultURL;
  imgUpload.commentField.value = '';
  imgUpload.hashTagField.value = '';
  imgUpload.buttonCloseModal.removeEventListener('click', imgUploadButtonCloseModalClickHandler);
  imgUpload.overlay.removeEventListener('click', imgUploadOverlayClickHandler);
}

document.addEventListener('keydown', EscPressHandler);
imgUpload.hashTagField.addEventListener('input', inputHandler);
imgUpload.commentField.addEventListener('input', inputHandler);
imgUpload.form.addEventListener('submit', formSubmitHandler);

export { imgUpload, imgUploadControlChangeHandler };
