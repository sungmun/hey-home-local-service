/**
 * HTTP 응답은 JSON 타입의 데이터를 전달하는 것을 기본으로 한다.
 *
 * 사용되는 HTTP Status
 *  - 200 OK                      : 일반적인 요청 성공
 *  - 201 Created                 : 성공적인 리소스 생성(보통 POST)
 *  - 202 Accepted                : 비동기 처리가 성공적으로 시작된 경우
 *  - 204 No Content              : 응답 바디에 의도적으로 아무것도 포함되지 않음(보통 PUT, DELETE)
 *  - 301 Moved Permanently       : 리소스 모델이 재설계되어 요청 경로가 변경됨
 *  - 304 Not Modified            : 클라이언트의 정보가 최신인 경우
 *  - 400 Bad Request             : 일반적인 요청 실패
 *  - 401 Unauthorized            : 인증되지 않음
 *  - 403 Forbidden               : 인증과 상관없이 액세스 금지
 *  - 404 Not Found               : 요청 URI에 해당하는 리소스가 없음
 *  - 409 Conflict                : 리소스 상태에 위반됨(e.g. 비어있지 않은 리소스에 대한 삭제 요청)
 *  - 422 Unprocessable Entity    : 전달된 데이터의 형태가 유효하지 않음 (deprecated) -> 400 Bad Request
 *  - 500 Internal Server Error   : 내부 서버 에러(API가 잘못 작동할 때)
 *  - 503 Service Unavailable     : 외부 서비스가 멈춘상태
 *
 * 에러 발생시 응답 본문
 * {
 *   "error": {
 *     "status": {number} HTTP 스테이터스,
 *     "name": {string} 에러명,
 *     "message": {string} 에러 메세지,
 *     "alertMessage": {string=} 출력할 에러 메세지
 *   }
 * }
 */
import _ from 'lodash';
import { Request, Response, ErrorRequestHandler } from 'express';
import logger from '../config/logger';

import { Error } from '../model/common/error.model';
import MESSAGE from './error.message';
import { UnauthorizedError } from './error';

// const slackSender = require('../components/slackSender');

const errMessage = {
  DEFAULT_ERROR: '알 수 없는 에러가 발생했습니다. 서버 관리자에게 문의바랍니다.',
};

/**
 * JSON 성공 응답
 *
 * @param {Object}res       - 익스프레스 응답 객체
 * @param {Number=} status  - 응답할 HTTP 상태코드
 * @returns {function}
 */
const respondSuccess = (res: Response, status: number): any => {
  /**
   * 성공처리 함수
   * @param {*} entity - 결과값
   * @returns {*}
   */
  return (entity: any) => {
    res.statusCode = status;

    if (entity) {
      res.json(entity);
    } else {
      res.json({});
    }

    return entity;
  };
};

/**
 * JSON 에러 응답
 *
 * @param {Object}  res               - 익스프레스 응답 객체
 * @param {Error}   err               - 에러 객체
 * @param {String}  err.name          - 에러명
 * @param {Number}  err.status        - 응답할 HTTP 상태코드
 * @param {String}  err.message       - 에러 메세지
 * @param {String}  err.alertMessage  - 출력할 에러 메세지
 * @param {Object=} err.data          - 에러 데이터
 * @returns {*}
 */
const respondError = (res: Response, err: any): any => {
  let { message, code } = err;

  // 코드에 고려되지 않은 에러를 처리하기 위한 안내 문구 추가
  if (err.status === 500) {
    message = `${errMessage.DEFAULT_ERROR}(${err.message})`;
  }

  const error = new Error(err);

  if (_.isNil(err.alertMessage) === false) {
    error.alertMessage = err.alertMessage;
  }

  // @ts-ignore
  res.errorCode = code || undefined;
  res.statusCode = err.status;
  res.json({ error: error.getOutPutData() });
  return { error };
};

/**
 * Joi 밸리데이션 에러 메세지 응답
 *
 * @param {Object}  res               - 익스프레스 응답 객체
 * @param {Error}   err               - 에러 객체
 * @param {String}  err.name          - 에러명
 * @param {Number=} err.status        - 응답할 HTTP 상태코드
 * @param {String=} err.details       - 에러 메세지 배열
 * @returns {*}
 */
const respondBodyValidationError = (res: Response, err: any): any => {
  res.statusCode = err.status;

  const error = new Error(err);

  res.json({ error });
  return { error };
};

/* *
 * 몽구스 밸리데이션 에러 메세지 응답
 *
 * @param {Object}  res               - 익스프레스 응답 객체
 * @param {Error}   err               - 에러 객체
 * @param {String}  err.name          - 에러명
 * @param {Number=} err.status        - 응답할 HTTP 상태코드
 * @param {String=} err.message       - 에러 메세지
 * @param {String}  err.alertMessage  - 출력할 에러 메세지
 * @returns {*}
 */
function respondMongooseValidationError(res: Response, err: any) {
  if (_.isNil(err.status)) {
    err.status = 400;
  }
  err.message = `${errMessage.DEFAULT_ERROR} (${err.errors[Object.keys(err.errors)[0]].message})`;
  return respondError(res, err);
}

/**
 * 몽구스 캐스팅 에러 메세지 응답
 *
 * @param {Object}  res               - 익스프레스 응답 객체
 * @param {Error}   err               - 에러 객체
 * @param {String}  err.name          - 에러명
 * @param {Number=} err.status        - 응답할 HTTP 상태코드
 * @param {String=} err.message       - 에러 메세지
 * @param {String}  err.alertMessage  - 출력할 에러 메세지
 * @returns {*}
 */
function respondMongooseCastError(res: Response, err: any) {
  if (_.isNil(err.status)) {
    err.status = 400;
  }
  err.message = `${errMessage.DEFAULT_ERROR} (\`${err.path}\` 필드는 ${err.kind} 타입이므로, \`${err.value}\`가 담길 수 없습니다.)`;
  return respondError(res, err);
}

/**
 * s3 업로드 에러 메세지 응답
 *
 * @param {Object}  res               - 익스프레스 응답 객체
 * @param {Error}   err               - 에러 객체
 * @param {String}  err.name          - 에러명
 * @param {Number=} err.status        - 응답할 HTTP 상태코드
 * @param {String=} err.message       - 에러 메세지
 * @param {String}  err.alertMessage  - 출력할 에러 메세지
 * @returns {*}
 */
function respondMulterError(res: Response, err: any) {
  if (_.isNil(err.status)) {
    err.status = 400;
  }

  const errorMessage = _.get(MESSAGE, 'MULTER_ERROR');

  err.message = _.get(errorMessage, err.code, errorMessage.UNKNOWN_UPLOAD_ERROR) || MESSAGE.UNKNOWN_ERROR;

  return respondError(res, err);
}

/**
 * DB 커넥션 부족 에러
 *
 * @param {Object}  res               - 익스프레스 응답 객체
 * @param {Error}   err               - 에러 객체
 * @param {String}  err.name          - 에러명
 * @param {Number=} err.status        - 응답할 HTTP 상태코드
 * @param {String=} err.message       - 에러 메세지
 * @param {String}  err.alertMessage  - 출력할 에러 메세지
 * @returns {*}
 */
function respondSequelizeConnectionAcquireTimeoutError(res: Response, err: any) {
  if (_.isNil(err.status)) {
    err.status = 400;
  }

  err.message = '현재 사용자가 많습니다. 잠시 후 다시 시도해 주시기 바랍니다.';

  return respondError(res, err);
}

/**
 * jsonwebtoken의 인증 에러 메세지 응답
 *
 * @param {Response} res
 * @param {Error} err - 에러 객체
 */
const respondJwtTokenError = (res: Response, err: Error) => {
  const jwtErrorMessage = _.get(MESSAGE, 'JWT_ERROR');

  const errObj = _.get(jwtErrorMessage, err.message, {
    message: '인증 에러가 발생하였습니다, 서버 관리자에게 문의해 주세요.',
    code: 'UNAUTHORIZED_ERROR',
  });

  const e = new UnauthorizedError(errObj);

  return respondError(res, e);
};

/**
 * 기본 에러 메세지 응답
 *
 * @param {Object}  res               - 익스프레스 응답 객체
 * @param {Error}   err               - 에러 객체
 * @param {String}  err.name          - 에러명
 * @param {Number=} err.status        - 응답할 HTTP 상태코드
 * @param {String=} err.message       - 에러 메세지
 * @param {String}  err.alertMessage  - 출력할 에러 메세지
 * @param {Number=} statusCode        - 응답할 HTTP 상태코드
 * @returns {*}
 */
function respondDefaultError(res: Response, err: Error, statusCode: number) {
  if (statusCode) {
    err.status = statusCode;
  } else if (_.isNil(err.status)) {
    err.status = 500;
  }
  if (_.isNil(err.message)) {
    err.message = errMessage.DEFAULT_ERROR;
  }
  return respondError(res, err);
}

export default {
  /**
   * 200 OK 응답 함수
   *
   * @param {Object} req - 익스프레스 요청 객체
   * @param {Object} res - 익스프레스 응답 객체
   */
  sendOK(req: Request, res: Response) {
    res.statusCode = 200;
    res.end('OK');
  },

  /**
   * 404 Not Found 응답 함수
   *
   * @param {Object} req - 익스프레스 요청 객체
   * @param {Object} res - 익스프레스 응답 객체
   */
  sendNotFound(req: Request, res: Response) {
    res.statusCode = 404;
    res.end('Not Found');
  },

  /**
   * 요청한 데이터를 JSON 데이터로 전달
   *
   * @param {Object} res          - 익스프레스 응답 객체
   * @param {Number=} statusCode  - 응답할 HTTP 상태코드
   * @returns {function}
   * @deprecated
   */
  respondWithResult(res: Response, statusCode: number) {
    return respondSuccess(res, statusCode || 200);
  },

  /**
   * 200 OK 응답
   *
   * @param {Object} res - 익스프레스 응답 객체
   * @returns {Function}
   */
  respondWithOK(res: Response) {
    return respondSuccess(res, 200);
  },

  /**
   * 201 Created 응답
   *
   * @param {Object} res - 익스프레스 응답 객체
   * @returns {Function}
   */
  respondWithCreated(res: Response) {
    return respondSuccess(res, 201);
  },

  /**
   * 203 Accepted 응답
   *
   * @param {Object} res - 익스프레스 응답 객체
   * @returns {Function}
   */
  respondWithAccepted(res: Response) {
    return respondSuccess(res, 203);
  },

  /**
   * 성공하였으나 전달할 데이터 없음
   *
   * @param {Object} res - 익스프레스 응답 객체
   * @returns {function}
   */
  respondWithNoContent(res: Response) {
    /**
     * 204 처리 함수
     *
     * @param {*=} entity - 결과값
     * @returns {*}
     */
    return (entity: any) => {
      res.statusCode = 204;
      res.end();
      return entity;
    };
  },

  /**
   * 실패 메세지를 JSON 형태로 응답
   *
   * @param {Object}  res         - 익스프레스 응답 객체
   * @param {Number=} statusCode  - 응답할 HTTP 상태코드
   * @returns {function}
   */
  handleError(res: Response, statusCode?: number) {
    /**
     * 에러처리 함수
     *
     * @param {Error} err - 에러 객체
     * @returns {Error}
     */
    return (err: Error) => {
      // 400대 Error Status Code 로깅 제외
      if (_.inRange(err.status, 400, 499) === false) {
        logger.error(`${err.name} - ${err.message}`, { callStack: err.stack, data: err.data });
        err.url = _.get(res, 'req.originalUrl');
        err.method = _.get(res, 'req.method');
      }
      switch (err.name) {
        case 'BodyValidationError':
          return respondBodyValidationError(res, err);
        case 'ValidationError':
          return respondMongooseValidationError(res, err);
        case 'CastError':
          return respondMongooseCastError(res, err);
        case 'MulterError':
          return respondMulterError(res, err);
        case 'SequelizeConnectionAcquireTimeoutError':
          return respondSequelizeConnectionAcquireTimeoutError(res, err);
        case 'TokenExpiredError':
        case 'JsonWebTokenError':
        case 'NotBeforeError':
          return respondJwtTokenError(res, err);
        default:
          return respondDefaultError(res, err, statusCode);
      }
    };
  },
};
