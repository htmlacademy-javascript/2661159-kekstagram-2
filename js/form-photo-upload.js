import { body, pluralize } from './utils.js';

const COMMENT_MAX_CHAR_NUMBER = 140;
const MAX_HASHTAG_COUNT = 5;
const HASHTAG_WORD_DECLENSIONS = ['хэштег', 'хэштега', 'хэштегов'];
const SYMBOL_WORD_DECLENSIONS = ['символ', 'символ', 'символов'];
const HASHTAG_MIN_CHARACTERS_NUMBER = 2;
const HASHTAG_MAX_CHARACTERS_NUMBER = 20;
const HASHTAG_REG_EXP = /^#[a-zA-Zа-яА-ЯёЁ0-9]{1,19}$/;
const DEFAULT_IMG_URL = 'img/upload-default-image.jpg';

const imgUploadContainer = document.querySelector('.img-upload');
const uploadForm = imgUploadContainer.querySelector('#upload-select-image');
const uploadFormHashTagField = imgUploadContainer.querySelector('.text__hashtags');
const uploadFormCommentField = imgUploadContainer.querySelector('.text__description');
const uploadFileControl = imgUploadContainer.querySelector('#upload-file');
const uploadOverlay = imgUploadContainer.querySelector('.img-upload__overlay');
const uploadButtonModalClose = imgUploadContainer.querySelector('#upload-cancel');
const uploadButtonFormSubmit = imgUploadContainer.querySelector('#upload-submit');
const uploadImagePreview = imgUploadContainer.querySelector('.img-upload__preview img');
const uploadImagePreviewEffectThumbnails = imgUploadContainer.querySelectorAll('.effects__preview');

let hashTagErrorMessage = '';
const getHashTagErrorString = () => hashTagErrorMessage;

const getHashTag = (value) => value.trim().toLowerCase().split(/\s+/);

const pristineConfig = {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'img-upload__field-wrapper--error',
  errorTextParent: 'img-upload__field-wrapper',
};

const pristineInstance = new Pristine(uploadForm, pristineConfig);

const getFileURL = ()=> {
  const file = uploadFileControl.files[0];

  return file ? URL.createObjectURL(file) : DEFAULT_IMG_URL;
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
      check: (item) => item.length < HASHTAG_MIN_CHARACTERS_NUMBER || item.length > HASHTAG_MAX_CHARACTERS_NUMBER,
      error: `Хэштег должен быть длиной от ${ HASHTAG_MIN_CHARACTERS_NUMBER } до ${ HASHTAG_MAX_CHARACTERS_NUMBER } ${ pluralize(HASHTAG_MAX_CHARACTERS_NUMBER, SYMBOL_WORD_DECLENSIONS) }`
    },
    {
      check: (item) => !HASHTAG_REG_EXP.test(item),
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
  uploadFormHashTagField,
  isHashTagValid,
  getHashTagErrorString,
  2,
  false
);

pristineInstance.addValidator(
  uploadFormCommentField,
  isCommentValid,
  `Комментарий не должен превышать ${ COMMENT_MAX_CHAR_NUMBER } символов`,
  2,
  false
);

const formSubmitHandler = (evt)=> {
  evt.preventDefault();
  const isValid = pristineInstance.validate();

  uploadButtonFormSubmit.disabled = !isValid;

  if (isValid) {
    uploadForm.submit();
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

const documentPressEscHandler = (evt)=> {
  if (evt.key === 'Escape' && document.activeElement !== uploadFormCommentField) {
    uploadOverlay.classList.add('hidden');
    uploadImagePreview.src = DEFAULT_IMG_URL;
    body.classList.remove('modal-open');
  }
};

const imgUploadControlChangeHandler = ()=> {
  uploadOverlay.classList.remove('hidden');
  body.classList.add('modal-open');
  uploadImagePreview.src = `${ getFileURL() }`;
  uploadImagePreviewEffectThumbnails.forEach((thumbnail)=> {
    thumbnail.style.backgroundImage = `url(${ getFileURL() })`;
  });

  uploadButtonModalClose.addEventListener('click', imgUploadButtonCloseModalClickHandler, { once: true });
  uploadOverlay.addEventListener('click', imgUploadOverlayClickHandler);
};

const hashTagFieldInputHandler = ()=> {
  uploadButtonFormSubmit.disabled = !pristineInstance.validate();
};

const commentFieldInputHandler = ()=> {
  uploadButtonFormSubmit.disabled = !pristineInstance.validate();
};

function closeModal() {
  pristineInstance.reset();
  uploadOverlay.classList.add('hidden');
  body.classList.remove('modal-open');
  uploadImagePreview.src = DEFAULT_IMG_URL;
  uploadFormCommentField.value = '';
  uploadFormHashTagField.value = '';
  uploadButtonModalClose.removeEventListener('click', imgUploadButtonCloseModalClickHandler);
  uploadOverlay.removeEventListener('click', imgUploadOverlayClickHandler);
}

document.addEventListener('keydown', documentPressEscHandler);
uploadFormHashTagField.addEventListener('input', hashTagFieldInputHandler);
uploadFormCommentField.addEventListener('input', commentFieldInputHandler);
uploadForm.addEventListener('submit', formSubmitHandler);
uploadFileControl.addEventListener('change', imgUploadControlChangeHandler);
