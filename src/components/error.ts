/* eslint-disable */
import _ from 'lodash';
import format from 'string-template';

interface iMessage {
  name?: string;
  message?: string;
  alertMessage?: string;
  code?: string;
  status?: number;
  data?: any;
  fieldName?: any;
}

/**
 * 데이터 형태 에러 메세지 조합
 * - 몽구스의 ValidationError 포매팅 참조
 *
 * @param {String}            message     - 에러 메세지
 * @param {(String|Object)=}  messageArgs - 에러가 발생한 필드명
 * @returns {String}  - 필드명을 가공한 메세지
 */
function formatMessage(message: string, messageArgs: any) {
  if (!messageArgs) {
    return message;
  }
  if (_.isObject(messageArgs)) {
    return format(message, messageArgs);
  }
  return message.replace(/\{PATH}/g, messageArgs);
}

/**
 * 메세지 데이터 추출
 *
 * @param {String|Object}     message     - Error Message
 * @param {(String|Object)=}  messageArgs   - 메세지 변수 데이터
 * @returns {String}
 */
function getMessage(message: iMessage | string, messageArgs: any) {
  let msg;
  if (_.isObject(message)) {
    msg = message.message;
    if (!messageArgs) {
      messageArgs = message.fieldName;
    }
  } else {
    msg = message;
  }
  return formatMessage(msg, messageArgs);
}

/**
 * 일반적인 요청 실패 에러
 */
class BadRequestError extends Error {
  public alertMessage: string;
  public code: string;
  public status: number;
  public data: any;

  /**
   * Constructor
   * @param {String|Object}     message     - Error Message
   * @param {(Object|String)=}  messageArgs - Error Message Args
   * @param {Object=}           data        - Error Data
   */
  constructor(message: iMessage | string, messageArgs?: any, data?: any) {
    super(getMessage(message, messageArgs));

    let msg: iMessage = message as iMessage;

    if (_.isString(message) === true) {
      msg = { message } as iMessage;
    }

    if (msg.alertMessage) {
      this.alertMessage = formatMessage(msg.alertMessage, messageArgs);
    }
    if (msg.code) {
      this.code = msg.code;
    }
    this.name = this.constructor.name;
    this.status = 400;
    this.data = data;
  }
}

/**
 * Body (Joi) Validation 에러
 */
class BodyValidationError extends Error {
  public alertMessage: string;
  public code: string;
  public status: number;
  public data: any;
  public details: any;
  /**
   * Joi Validation Error Constructor
   * @param joiError
   */
  constructor(joiError) {
    super();
    this.name = this.constructor.name;
    this.status = 400;
    this.details = joiError.details;
  }
}

/**
 * 필수값 에러
 * - 필수값이 누락된 경우
 */
class RequiredError extends Error {
  public alertMessage: string;
  public code: string;
  public status: number;
  public data: any;

  /**
   * Constructor
   * @param {String}            message     - Error Message
   * @param {(Object|String)=}  messageArgs - Error Message Args
   * @param {Object=}           data        - Error Data
   */
  constructor(message: iMessage | string, messageArgs?: any, data?: any) {
    super(getMessage(message, messageArgs));

    let msg: iMessage = message as iMessage;

    if (_.isString(message) === true) {
      msg = { message } as iMessage;
    }

    if (msg.alertMessage) {
      this.alertMessage = formatMessage(msg.alertMessage, messageArgs);
    }
    if (msg.code) {
      this.code = msg.code;
    }
    this.name = this.constructor.name;
    this.status = 400;
    this.data = data;
  }
}

/**
 * 데이터 타입 에러
 * - 정해진 타입이 아닌 경우
 */
class DataTypeError extends Error {
  public alertMessage: string;
  public code: string;
  public status: number;
  public data: any;

  /**
   * Constructor
   * @param {String|Object}     message     - Error Message
   * @param {(Object|String)=}  messageArgs - Error Message Args
   * @param {Object=}           data        - Error Data
   */
  constructor(message: iMessage | string, messageArgs?: any, data?: any) {
    super(getMessage(message, messageArgs));

    let msg: iMessage = message as iMessage;

    if (_.isString(message) === true) {
      msg = { message } as iMessage;
    }

    if (msg.alertMessage) {
      this.alertMessage = formatMessage(msg.alertMessage, messageArgs);
    }
    if (msg.code) {
      this.code = msg.code;
    }
    this.name = this.constructor.name;
    this.status = 400;
    this.data = data;
  }
}

/**
 * 이뉴머레이션 밸류 에러
 * - 전달된 값이 주어진 enum 값이 아닐 경우
 */
class EnumerationError extends Error {
  public alertMessage: string;
  public code: string;
  public status: number;
  public data: any;

  /**
   * Constructor
   * @param {String|Object}     message     - Error Message
   * @param {(Object|String)=}  messageArgs - Error Message Args
   * @param {Object=}           data        - Error Data
   */
  constructor(message: iMessage | string, messageArgs?: any, data?: any) {
    super(getMessage(message, messageArgs));

    let msg: iMessage = message as iMessage;

    if (_.isString(message) === true) {
      msg = { message } as iMessage;
    }

    if (msg.alertMessage) {
      this.alertMessage = formatMessage(msg.alertMessage, messageArgs);
    }
    if (msg.code) {
      this.code = msg.code;
    }
    this.name = this.constructor.name;
    this.status = 400;
    this.data = data;
  }
}

/**
 * 유니크 에러
 * - 유니크 조건을 만족시키지 못하는 경우
 */
class UniqueError extends Error {
  public alertMessage: string;
  public code: string;
  public status: number;
  public data: any;

  /**
   * Constructor
   * @param {String|Object}     message     - Error Message
   * @param {(Object|String)=}  messageArgs - Error Message Args
   * @param {Object=}           data        - Error Data
   */
  constructor(message: iMessage | string, messageArgs?: any, data?: any) {
    super(getMessage(message, messageArgs));

    let msg: iMessage = message as iMessage;

    if (_.isString(message) === true) {
      msg = { message } as iMessage;
    }

    if (msg.alertMessage) {
      this.alertMessage = formatMessage(msg.alertMessage, messageArgs);
    }
    if (msg.code) {
      this.code = msg.code;
    }
    this.name = this.constructor.name;
    this.status = 400;
    this.data = data;
  }
}

/**
 * 인증 에러
 */
class UnauthorizedError extends Error {
  public alertMessage: string;
  public code: string;
  public status: number;
  public data: any;

  /**
   * Constructor
   * @param {String|Object}     message     - Error Message
   * @param {(Object|String)=}  messageArgs - Error Message Args
   * @param {Object=}           data        - Error Data
   */
  constructor(message: iMessage | string, messageArgs?: any, data?: any) {
    super(getMessage(message, messageArgs));

    let msg: iMessage = message as iMessage;

    if (_.isString(message) === true) {
      msg = { message } as iMessage;
    }

    if (msg.alertMessage) {
      this.alertMessage = formatMessage(msg.alertMessage, messageArgs);
    }
    if (msg.code) {
      this.code = msg.code;
    }
    this.name = this.constructor.name;
    this.status = 401;
    this.data = data;
  }
}

/**
 * 인증과 상관없는 액세스 금지 에러
 */
class ForbiddenError extends Error {
  public alertMessage: string;
  public code: string;
  public status: number;
  public data: any;

  /**
   * Constructor
   * @param {String|Object}     message     - Error Message
   * @param {(Object|String)=}  messageArgs - Error Message Args
   * @param {Object=}           data        - Error Data
   */
  constructor(message: iMessage | string, messageArgs?: any, data?: any) {
    super(getMessage(message, messageArgs));

    let msg: iMessage = message as iMessage;

    if (_.isString(message) === true) {
      msg = { message } as iMessage;
    }

    if (msg.alertMessage) {
      this.alertMessage = formatMessage(msg.alertMessage, messageArgs);
    }
    if (msg.code) {
      this.code = msg.code;
    }
    this.name = this.constructor.name;
    this.status = 403;
    this.data = data;
  }
}

/**
 * 데이터를 찾을 수 없을 경우의 에러
 */
class NotFoundError extends Error {
  public alertMessage: string;
  public code: string;
  public status: number;
  public data: any;

  /**
   * Constructor
   * @param {String|Object}     message     - Error Message
   * @param {(Object|String)=}  messageArgs - Error Message Args
   * @param {Object=}           data        - Error Data
   */
  constructor(message: iMessage | string, messageArgs?: any, data?: any) {
    super(getMessage(message, messageArgs));

    let msg: iMessage = message as iMessage;

    if (_.isString(message) === true) {
      msg = { message } as iMessage;
    }

    if (msg.alertMessage) {
      this.alertMessage = formatMessage(msg.alertMessage, messageArgs);
    }
    if (msg.code) {
      this.code = msg.code;
    }
    this.name = this.constructor.name;
    this.status = 404;
    this.data = data;
  }
}

/**
 * 리소스 상태에 위반됨 에러
 */
class ConflictError extends Error {
  public alertMessage: string;
  public code: string;
  public status: number;
  public data: any;

  /**
   * Constructor
   * @param {String|Object}     message     - Error Message
   * @param {(Object|String)=}  messageArgs - Error Message Args
   * @param {Object=}           data        - Error Data
   */
  constructor(message: iMessage | string, messageArgs?: any, data?: any) {
    super(getMessage(message, messageArgs));

    let msg: iMessage = message as iMessage;

    if (_.isString(message) === true) {
      msg = { message } as iMessage;
    }

    if (msg.alertMessage) {
      this.alertMessage = formatMessage(msg.alertMessage, messageArgs);
    }
    if (msg.code) {
      this.code = msg.code;
    }
    this.name = this.constructor.name;
    this.status = 409;
    this.data = data;
  }
}

/**
 * 전달된 데이터 형태의 에러
 * @deprecated
 */
class EntityError extends Error {
  public alertMessage: string;
  public code: string;
  public status: number;
  public data: any;

  /**
   * Constructor
   * @param {String|Object}     message     - Error Message
   * @param {(Object|String)=}  messageArgs - Error Message Args
   * @param {Object=}           data        - Error Data
   */
  constructor(message: iMessage, messageArgs?: any, data?: any) {
    super(getMessage(message, messageArgs));

    if (message.alertMessage) {
      this.alertMessage = formatMessage(message.alertMessage, messageArgs);
    }
    this.name = this.constructor.name;
    this.status = 422;
    this.data = data;
  }
}

/**
 * 내부 서버 에러
 */
class InternalServerError extends Error {
  public alertMessage: string;
  public code: string;
  public status: number;
  public data: any;

  /**
   * Constructor
   * @param {String|Object}     message     - Error Message
   * @param {(Object|String)=}  messageArgs - Error Message Args
   * @param {Object=}           data        - Error Data
   */
  constructor(message: iMessage | string, messageArgs?: any, data?: any) {
    super(getMessage(message, messageArgs));

    let msg: iMessage = message as iMessage;

    if (_.isString(message) === true) {
      msg = { message } as iMessage;
    }

    if (msg.alertMessage) {
      this.alertMessage = formatMessage(msg.alertMessage, messageArgs);
    }
    if (msg.code) {
      this.code = msg.code;
    }
    this.name = this.constructor.name;
    this.status = 500;
    this.data = data;
  }
}

/**
 * 외부 서비스를 사용할 수 없는 에러
 */
class ServiceUnavailableError extends Error {
  public alertMessage: string;
  public code: string;
  public status: number;
  public data: any;

  /**
   * Constructor
   * @param {String|Object}     message       - Error Message
   * @param {String=}           message.alert - 메시지 알림
   * @param {String=}           message.code  - 메시지 오류 코드
   * @param {(Object|String)=}  messageArgs - Error Message Args
   * @param {Object=}           data        - Error Data
   */
  constructor(message: iMessage | string, messageArgs?: any, data?: any) {
    super(getMessage(message, messageArgs));

    let msg: iMessage = message as iMessage;

    if (_.isString(message) === true) {
      msg = { message } as iMessage;
    }

    if (msg.alertMessage) {
      this.alertMessage = formatMessage(msg.alertMessage, messageArgs);
    }
    if (msg.code) {
      this.code = msg.code;
    }
    this.name = this.constructor.name;
    this.status = 503;
    this.data = data;
  }
}

/**
 * 프록시 서버 사용시 에러
 */
class ProxyError extends Error {
  public alertMessage: string;
  public code: string;
  public status: number;
  public data: any;

  /**
   * Proxy Error Constructor
   * @param error
   * @param fileName
   * @param fileNumber
   */
  constructor(error: iMessage, fileName: string, fileNumber: number) {
    // super((error.message, fileName, fileNumber);
    super(error.message);

    this.name = error.name;
    this.status = error.status;
    this.message = error.message;
    if (error.alertMessage) {
      this.alertMessage = error.alertMessage;
    }
  }
}
/**
 * 정책에 위반됨 에러
 */
class PolicyError extends Error {
  public alertMessage: string;

  public code: string;

  public status: number;

  public data: any;

  /**
   * Constructor
   * @param {String}            message     - Error Message
   * @param {(Object|String)=}  messageArgs - Error Message Args
   * @param {Object=}           data        - Error Data
   */
  constructor(message: iMessage | string, messageArgs?: any, data?: object) {
    super(getMessage(message, messageArgs));

    let msg: iMessage = message as iMessage;

    if (_.isString(message) === true) {
      msg = { message } as iMessage;
    }

    if (msg.alertMessage) {
      this.alertMessage = formatMessage(msg.alertMessage, messageArgs);
    }
    if (msg.code) {
      this.code = msg.code;
    }
    this.name = this.constructor.name;
    this.status = 406;
    this.data = data;
  }
}

export {
  BadRequestError,
  RequiredError,
  BodyValidationError,
  DataTypeError,
  EnumerationError,
  UniqueError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  EntityError,
  InternalServerError,
  ServiceUnavailableError,
  ProxyError,
  PolicyError,
};
