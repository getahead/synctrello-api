export const UNAUTHORIZED_RESPONSE = {
  success: false,
  error: {
    status: 401,
    message: 'Unauthorized'
  }
};

export const REQUIRED_PARAMS = {
  success: false,
  error: {
    status: 400,
    message: 'Validation error. Required params are missing'
  }
};

export const AVATAR_HOST = 'https://trello-avatars.s3.amazonaws.com/';
