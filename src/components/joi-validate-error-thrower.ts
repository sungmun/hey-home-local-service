import _ from 'lodash';
import template from 'string-template';

import { RequiredError, BadRequestError, DataTypeError } from './error';

const getTemplateMessage = (validateMessage: any, key: string, type: string) => {
  let templateMessage = _.get(validateMessage, `${key}.${type}`);
  if (_.isEmpty(templateMessage) === false) {
    return templateMessage;
  }

  templateMessage = _.get(validateMessage, `${key}.default`);

  if (_.isEmpty(templateMessage) === false) {
    return templateMessage;
  }

  templateMessage = _.get(validateMessage, `default.${type}`);

  if (_.isEmpty(templateMessage) === false) {
    return templateMessage;
  }

  return _.get(validateMessage, 'default.default');
};

const processValidateResult = (result: any, validateMessage: any): void => {
  const details = _.get(result, 'error.details', []);

  if (_.isEmpty(details) === false) {
    const { type, context } = _.get(details, '0', {});

    const { key = 'default' } = context;

    const templateMessage = getTemplateMessage(validateMessage, key, type);

    const convertedMessage = template(templateMessage, context);

    const [, errorType = ''] = _.split(type, '.');

    if (['base', 'only'].includes(errorType) === true) {
      throw new DataTypeError({
        message: convertedMessage,
        code: `${_.toUpper(errorType)}_${_.toUpper(key)}`,
      });
    } else if (['empty', 'required'].includes(errorType) === true) {
      throw new RequiredError({
        message: convertedMessage,
        code: `${_.toUpper(errorType)}_${_.toUpper(key)}`,
      });
    } else {
      throw new BadRequestError({
        message: convertedMessage,
        code: `${_.toUpper(errorType)}_${_.toUpper(key)}`,
      });
    }
  } else if (_.isEmpty(result.error) === false) {
    throw result.error;
  }
};

export default {
  processResult: processValidateResult,
};
