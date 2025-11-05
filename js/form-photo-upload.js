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
const uploadFormButtonSubmit = imgUploadContainer.querySelector('#upload-submit');
const uploadImagePreview = imgUploadContainer.querySelector('.img-upload__preview img');
const uploadImagePreviewEffectThumbnails = imgUploadContainer.querySelectorAll('.effects__preview');
const uploadImagePreviewSliderValue = imgUploadContainer.querySelector('.effect-level__value');
const uploadImagePreviewEffectSlider = imgUploadContainer.querySelector('.effect-level__slider');

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

const updateStateUploadFormButtonSubmit = ()=> {
  uploadFormButtonSubmit.disabled = !pristineInstance.validate();
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

const noUiSliderConfig = {
  start: 1,
  range: {
    min: 0,
    max: 1
  },
  step: 0.1,
  connect: 'lower'
};

noUiSlider.create(uploadImagePreviewEffectSlider, noUiSliderConfig);

const updateFilterEffect = (sliderInstance, sliderConfig, preview, sliderValue, cssFilter, cssUnits = '')=> {
  sliderInstance.noUiSlider.updateOptions(sliderConfig);
  sliderInstance.noUiSlider.on('update', () => {
    preview.style.filter = `${ cssFilter }(${ sliderInstance.noUiSlider.get() }${ cssUnits })`;
    sliderValue.value = sliderInstance.noUiSlider.get();
  });
};

const setFilterEffect = (evt)=> {
  if (evt.target.classList.contains('effects__preview')) {
    // eslint-disable-next-line prefer-const
    let effectString = evt.target.className.split('--')[1];

    uploadImagePreviewEffectSlider.noUiSlider.off('update');

    switch (effectString) {
      case 'chrome':
        updateFilterEffect(
          uploadImagePreviewEffectSlider,
          noUiSliderConfig,
          uploadImagePreview,
          uploadImagePreviewSliderValue,
          'grayscale'
        );
        break;

      case 'sepia':
        updateFilterEffect(
          uploadImagePreviewEffectSlider,
          noUiSliderConfig,
          uploadImagePreview,
          uploadImagePreviewSliderValue,
          'sepia'
        );
        break;

      case 'marvin':
        updateFilterEffect(
          uploadImagePreviewEffectSlider,
          {
            start: 100,
            range: { min: 0, max: 100 },
            step: 1
          },
          uploadImagePreview,
          uploadImagePreviewSliderValue,
          'invert',
          '%'
        );
        break;

      case 'phobos':
        updateFilterEffect(
          uploadImagePreviewEffectSlider,
          {
            start: 3,
            range: { min: 0, max: 3 },
            step: 0.1
          },
          uploadImagePreview,
          uploadImagePreviewSliderValue,
          'blur',
          'px'
        );
        break;

      case 'heat':
        updateFilterEffect(
          uploadImagePreviewEffectSlider,
          {
            start: 3,
            range: { min: 1, max: 3 },
            step: 0.1
          },
          uploadImagePreview,
          uploadImagePreviewSliderValue,
          'brightness'
        );
        break;

      default:
        updateFilterEffect(
          uploadImagePreviewEffectSlider,
          noUiSliderConfig,
          uploadImagePreview,
          uploadImagePreviewSliderValue,
          ''
        );
    }
  }
};

const uploadFormSubmitHandler = (evt)=> {
  evt.preventDefault();
  const isValid = pristineInstance.validate();

  uploadFormButtonSubmit.disabled = !isValid;

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

const documentKeydownHandler = (evt)=> {
  if (evt.key === 'Escape' && document.activeElement !== uploadFormHashTagField && document.activeElement !== uploadFormCommentField) {
    closeModal();
  }
};

const hashTagFieldInputHandler = ()=> {
  updateStateUploadFormButtonSubmit();
};

const commentFieldInputHandler = ()=> {
  updateStateUploadFormButtonSubmit();
};

const uploadFileControlChangeHandler = ()=> {
  uploadOverlay.classList.remove('hidden');
  body.classList.add('modal-open');
  uploadImagePreview.src = `${ getFileURL() }`;
  uploadImagePreviewEffectThumbnails.forEach((thumbnail)=> {
    thumbnail.style.backgroundImage = `url(${ getFileURL() })`;
  });

  document.addEventListener('keydown', documentKeydownHandler);
  uploadFormHashTagField.addEventListener('input', hashTagFieldInputHandler);
  uploadFormCommentField.addEventListener('input', commentFieldInputHandler);
  uploadForm.addEventListener('submit', uploadFormSubmitHandler);
  uploadButtonModalClose.addEventListener('click', imgUploadButtonCloseModalClickHandler, { once: true });
  uploadOverlay.addEventListener('click', imgUploadOverlayClickHandler);
  imgUploadContainer.addEventListener('click', setFilterEffect);
};

function closeModal() {
  pristineInstance.reset();
  uploadOverlay.classList.add('hidden');
  body.classList.remove('modal-open');
  uploadImagePreview.src = DEFAULT_IMG_URL;
  uploadFormCommentField.value = '';
  uploadFormHashTagField.value = '';
  uploadFileControl.value = '';

  document.removeEventListener('keydown', documentKeydownHandler);
  uploadFormHashTagField.removeEventListener('input', hashTagFieldInputHandler);
  uploadFormCommentField.removeEventListener('input', commentFieldInputHandler);
  uploadButtonModalClose.removeEventListener('click', imgUploadButtonCloseModalClickHandler);
  uploadForm.removeEventListener('submit', uploadFormSubmitHandler);
  uploadOverlay.removeEventListener('click', imgUploadOverlayClickHandler);
}

uploadFileControl.addEventListener('change', uploadFileControlChangeHandler);
