export const ERROR_MESSAGES = {
  UNEXPECTED_ERROR: 'Unexpected error. Please try again or later',
  TypeError: 'Network error. Please try again later',
  Unauthorized: 'Unauthorized. Sign in to continue',

  REQUIRED: '{FIELD_NAME} is required',
  VALIDATE_PHONE: 'Phone number is not valid',
  VALIDATE_EMAIL: 'EMAIL is not valid',
};

export const regexp = {
  email: '^([a-z0-9\\._-]+@[a-z0-9_-]+\\.[a-z0-9\\._-]{2,})$',
  phone: '^(?:(8|\\+?7)[-\\s]?)?[\\(]?([0-9]{3})[-\\)]?((?:[-\\s]?\\d{2,3}){3})$'
};

/**
 * Возвращает true или текст ошибки если валидация фейлится
 * @param value
 * @param fieldName {string} Имя поля
 * @returns {boolean|string}
 */
export function isEmpty(value, fieldName = '') {
  const isValid = value && value.toString().trim();

  return !isValid ? (fieldName ? ERROR_MESSAGES.REQUIRED.replace(/\{FIELD_NAME\}/, fieldName) : true) : false;
}

/**
 * Возвращает true или текст ошибки если валидация фейлится
 * @param value
 * @param message {boolean} Должна ли функция вернуть текст ошибки в случае ошибки
 * @returns {boolean|string}
 */
export function isEmailInvalid(value, notEmpty = false, message = false) {
  const error = notEmpty && isEmpty(value, 'Email');
  if (error) {
    return error;
  }
  const isValid = RegExp(regexp.email, 'i').test(value.toString().trim());
  return !isValid ? (message ? ERROR_MESSAGES.VALIDATE_EMAIL : true) : false;
}

export function isEmailValid() {
  return !isEmailInvalid.apply(this, arguments);
}


/**
 * Возвращает true или текст ошибки если валидация фейлится
 * @param value
 * @param message {boolean} Должна ли функция вернуть текст ошибки в случае ошибки
 * @returns {boolean|string}
 */
export function isPhoneInvalid(value = '', message = false) {
  let isValid = false;
  const valueTrimmed = value.toString().trim();
  const error = isEmpty(valueTrimmed, 'Телефон');
  if (error) {
    return error;
  } else if (valueTrimmed.length >= 11) {
    // Минимальная длина телефона - 11 символов
    // Незачем валидировать, если результат у нас уже известен
    const phoneRegexp = new RegExp(regexp.phone);
    const matchedValues = valueTrimmed.match(phoneRegexp);

    isValid = matchedValues
      && matchedValues[1]   // код страны
      && matchedValues[2]   // код города, оператора
      && matchedValues[3]   // сам номер телефона
      && matchedValues[3].replace(/\D/g, '').length === 7; // количество цифр в номере телефона
  }
  return !isValid ? (message ? ERROR_MESSAGES.VALIDATE_PHONE : true) : false;
}


/**
 * Удаляет пустые свойства объекта
 * @param obj
 * @returns {*}
 */
export function deleteEmpty(obj) {
  Object.keys(obj).forEach(k => {
    if (!obj[k]) {
      delete obj[k];
    }
  });
  return obj;
}

/**
 * Приводит телефон к формату 79991234567
 * @param phone
 * @param alreadyValidated {boolean} - уже провалидирован телефон или нет
 * @returns {*}
 */
export function formatPhone(phone = '', alreadyValidated = false) {
  const valueTrimmed = phone.toString().trim();
  if (!alreadyValidated && isPhoneInvalid(valueTrimmed)) {
    return false;
  }

  const phoneRegexp = new RegExp(regexp.phone);
  const matchedValues = valueTrimmed.match(phoneRegexp);

  return '7' + matchedValues[2].replace(/\D/g, '') + matchedValues[3].replace(/\D/g, '');
}
