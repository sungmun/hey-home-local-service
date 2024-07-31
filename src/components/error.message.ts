export default {
  MULTER_ERROR: {
    LIMIT_FILE_SIZE: '업로드 용량은 파일당 최대 10MB까지 가능합니다.',
    LIMIT_UNEXPECTED_FILE: '업로드 최대 개수는 5개까지 가능합니다.',
    UNKNOWN_UPLOAD_ERROR: '업로드 중 알 수 없는 에러가 발생했습니다.',
  },
  JWT_ERROR: {
    'jwt expired': {
      message: '토큰이 만료되었습니다.',
      code: 'EXPIRED_TOKEN',
    },
    'jwt malformed': {
      message: '유효하지 않은 형태의 토큰이 전달되었습니다.',
      code: 'WRONG_TOKEN',
    },
    'jwt signature is required': {
      message: '유효하지 않은 형태의 토큰이 전달되었습니다.',
      code: 'REQUIRED_TOKEN_SIGNATURE',
    },
    'invalid signature': {
      message: '유효하지 않은 형태의 토큰이 전달되었습니다.',
      code: 'WRONG_TOKEN_SIGNATURE',
    },
    'jwt not active': {
      message: '토큰이 활성화되어 있지 않습니다.',
      code: 'NOT_ACTIVE_TOKEN',
    },
  },
  UNKNOWN_ERROR: '알 수 없는 에러가 발생했습니다.',
};

// NOT_FOUND_AUTH: '토큰이 필요합니다.',
