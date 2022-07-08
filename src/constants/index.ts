export const COGNITO_PASSWORD_REGULAR_EXPRESSION = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\^$*.\[\]{}\(\)?\-\"!@#%&\/,><\':;|_~`])\S{8,99}$/;
export const PHONE_NUMBER_REGULAR_EXPRESSION = /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
export const DETECTION_ORIGINS_OBJ = {
  SONICKEY: {
    name: 'SONICKEY',
    shortName: 'SK',
  },
  FINGERPRINT: {
    name: 'FINGERPRINT',
    shortName: 'SID',
  },
};
