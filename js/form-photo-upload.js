import { body, pluralize } from './utils.js';
import { sendData, Route, Method } from './api.js';
import { appendNotification } from './notifications.js';

const COMMENT_MAX_CHAR_NUMBER = 140;
const MAX_HASHTAG_COUNT = 5;
const HASHTAG_WORD_DECLENSIONS = ['хэштег', 'хэштега', 'хэштегов'];
const SYMBOL_WORD_DECLENSIONS = ['символ', 'символ', 'символов'];
const HASHTAG_MIN_CHARACTERS_NUMBER = 2;
const HASHTAG_MAX_CHARACTERS_NUMBER = 20;
const HASHTAG_REG_EXP = /^#[a-zA-Zа-яА-ЯёЁ0-9]{1,19}$/;
const DEFAULT_IMG_URL = 'img/upload-default-image.jpg';
const ALLOWED_FILES_FORMATS = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
const DEFAULT_SCALING_VALUE = '100%';

const EFFECT_CONFIGS = {
  chrome: { filter: 'grayscale', start: 1, min: 0, max: 1, step: 0.1, unit: '' },
  sepia: { filter: 'sepia', start: 1, min: 0, max: 1, step: 0.1, unit: '' },
  marvin: { filter: 'invert', start: 100, min: 0, max: 100, step: 1, unit: '%' },
  phobos: { filter: 'blur', start: 3, min: 0, max: 3, step: 0.1, unit: 'px' },
  heat: { filter: 'brightness', start: 3, min: 1, max: 3, step: 0.1, unit: '' },
  none: { filter: '', start: 1, min: 0, max: 1, step: 0.1, unit: '' }
};

const SCALING_STEP_VALUE = 25;
const SCALING_VALUE_MIN = 25;
const SCALING_VALUE_MAX = 100;

const SUBMIT_BUTTON_TEXT_DEFAULT = 'Опубликовать';
const SUBMIT_BUTTON_TEXT_SENDING = 'Идет публикация...';
const successMessageTemplate = document.querySelector('#success').content;
const errorMessageTemplate = document.querySelector('#error').content;

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
const uploadImagePreviewSliderControl = imgUploadContainer.querySelector('.effect-level__value');
const uploadImagePreviewEffectSlider = imgUploadContainer.querySelector('.effect-level__slider');

const uploadImageScale = imgUploadContainer.querySelector('.scale');
const uploadImageScaleInput = uploadImageScale.querySelector('.scale__control--value');


// Проверка полей 'комментарий' и 'хэштеги'
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

  if (file && !ALLOWED_FILES_FORMATS.includes(file.type)) {
    uploadFileControl.value = '';
    return DEFAULT_IMG_URL;
  }

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


// Наложение эффекта на изображение
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

uploadImagePreviewEffectSlider.parentNode.hidden = true;

const hideSlider = (evt)=> {
  const sliderContainer = uploadImagePreviewEffectSlider.parentNode;
  const effectPreview = evt.target.closest('.effects__preview');

  if (effectPreview) {
    const isNoneEffect = effectPreview.classList.contains('effects__preview--none');

    sliderContainer.hidden = isNoneEffect;
  }

  return false;
};

// Функция установки эффекта фильтра
const imgUploadContainerClickHandler = (evt)=> {
  hideSlider(evt);
  if (evt.target.classList.contains('effects__preview')) {
    const effectString = evt.target.className.split('--')[1];
    const config = EFFECT_CONFIGS[effectString];

    uploadImagePreviewEffectSlider.noUiSlider.off('update');

    uploadImagePreviewEffectSlider.noUiSlider.updateOptions({
      start: config.start,
      range: {
        min: config.min,
        max: config.max
      },
      step: config.step,
      connect: 'lower'
    });

    uploadImagePreviewEffectSlider.noUiSlider.on('update', () => {
      const value = uploadImagePreviewEffectSlider.noUiSlider.get();

      uploadImagePreview.style.filter = config.filter ? `${config.filter}(${value}${config.unit})` : '';
      uploadImagePreviewSliderControl.value = value;
    });
  }
};

// Функция изменения масштаба изображения
const uploadImageScaleClickHandler = (evt)=> {
  let sizeValue = +uploadImageScaleInput.value.slice(0, -1);


  if (evt.target.classList.contains('scale__control--smaller')) {
    if (sizeValue > SCALING_VALUE_MIN) {
      sizeValue -= SCALING_STEP_VALUE;
    }
  } else if (evt.target.classList.contains('scale__control--bigger')) {
    if (sizeValue < SCALING_VALUE_MAX) {
      sizeValue += SCALING_STEP_VALUE;
    }
  }

  uploadImageScaleInput.value = `${ sizeValue }%`;
  uploadImagePreview.style.transform = `scale(${ sizeValue / 100 })`;
};

const disableSubmitButton = (text)=> {
  uploadFormButtonSubmit.disabled = true;
  uploadFormButtonSubmit.textContent = text;
};

const enableSubmitButton = (text)=> {
  uploadFormButtonSubmit.disabled = false;
  uploadFormButtonSubmit.textContent = text;
};

const sendFormData = async (form)=> {
  const isValid = pristineInstance.validate();

  if (!isValid) {
    disableSubmitButton(SUBMIT_BUTTON_TEXT_DEFAULT);
  } else {
    disableSubmitButton(SUBMIT_BUTTON_TEXT_SENDING);

    try {
      await sendData(Route.SEND_DATA, Method.POST, new FormData(form));
      appendNotification(successMessageTemplate, ()=> {
        closeModal();
      });
    } catch (error) {
      appendNotification(errorMessageTemplate);
    } finally {
      enableSubmitButton(SUBMIT_BUTTON_TEXT_DEFAULT);
    }
  }
};


// Функции-обработчики
const uploadFormSubmitHandler = (evt)=> {
  evt.preventDefault();
  sendFormData(evt.target);
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
  imgUploadContainer.addEventListener('click', imgUploadContainerClickHandler);
  uploadImageScale.addEventListener('click', uploadImageScaleClickHandler);
};

const resetFilters = ()=> {
  uploadImagePreviewEffectSlider.noUiSlider.updateOptions({
    start: EFFECT_CONFIGS.none.start,
    range: { min: EFFECT_CONFIGS.none.min, max: EFFECT_CONFIGS.none.max },
    step: EFFECT_CONFIGS.none.step
  });

  uploadImagePreviewEffectSlider.noUiSlider.set(EFFECT_CONFIGS.none.start);
  uploadImagePreviewEffectSlider.parentNode.hidden = true;
};

const resetScaling = ()=> {
  uploadImageScaleInput.value = DEFAULT_SCALING_VALUE;
};

const resetImagePreview = ()=> {
  uploadImagePreview.removeAttribute('style');
};

function closeModal() {
  pristineInstance.reset();
  uploadOverlay.classList.add('hidden');
  body.classList.remove('modal-open');
  uploadImagePreview.src = DEFAULT_IMG_URL;
  uploadForm.reset();

  resetFilters();
  resetScaling();
  resetImagePreview();

  uploadImagePreviewSliderControl.value = '';
  document.removeEventListener('keydown', documentKeydownHandler);
  uploadFormHashTagField.removeEventListener('input', hashTagFieldInputHandler);
  uploadFormCommentField.removeEventListener('input', commentFieldInputHandler);
  uploadButtonModalClose.removeEventListener('click', imgUploadButtonCloseModalClickHandler);
  uploadForm.removeEventListener('submit', uploadFormSubmitHandler);
  uploadOverlay.removeEventListener('click', imgUploadOverlayClickHandler);
  imgUploadContainer.removeEventListener('click', imgUploadContainerClickHandler);
  uploadImageScale.removeEventListener('click', uploadImageScaleClickHandler);
}

uploadFileControl.addEventListener('change', uploadFileControlChangeHandler);
