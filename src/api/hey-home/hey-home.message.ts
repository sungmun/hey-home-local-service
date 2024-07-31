export default {
  NOT_FOUND_RESTAURANT: {
    message: '매장 정보를 찾을 수 없습니다.',
    code: 'NOT_FOUND_RESTAURANT',
  },
};

export const validateMessage = {
  default: {
    number: {
      empty: '{label}({key})값이 필요합니다.',
      base: '{label}({key})가 입력형식에 맞지 않습니다.',
      min: '{label}({key})가 가능한 범위가 아닙니다.',
      max: '{label}({key})가 가능한 범위가 아닙니다.',
    },
    any: {
      required: '{label}({key})의 값은 필수입니다.',
      only: '{label}({key})의 입력값이 허용된 입력값이 아닙니다.',
    },
    default: '잘못된 입력값이 있습니다 - {key}',
  },
};
