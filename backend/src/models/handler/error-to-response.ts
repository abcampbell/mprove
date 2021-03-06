import { api } from '../../barrels/api';
import { enums } from '../../barrels/enums';
import { errorToLog } from './error-to-log';
import { ServerError } from '../server-error';

export async function errorToResponse(err: any, req: any, res: any, next: any) {
  if (err) {
    errorToLog(err);

    res.json({
      info: {
        origin: api.CommunicationOriginEnum.SERVER,
        type: api.CommunicationTypeEnum.RESPONSE,
        reply_to: req.body.info.request_id,
        status:
          err.name === 'UnauthorizedError' ||
          err.name === enums.middlewareErrorsEnum.MIDDLEWARE_CHECK_JWT
            ? api.ServerResponseStatusEnum.AUTHORIZATION_ERROR
            : err instanceof ServerError
            ? mapInfoStatus(err.name)
            : api.ServerResponseStatusEnum.INTERNAL_SERVER_ERROR,
        error: {
          message: mapInfoErrorMessage(err)
        }
      },
      payload: undefined
    });
  } else {
    next();
  }
}

function mapInfoStatus(name: string) {
  switch (name) {
    case enums.otherErrorsEnum.INTERNAL_SERVER_ERROR:
      return api.ServerResponseStatusEnum.INTERNAL_SERVER_ERROR;

    case enums.otherErrorsEnum.SET_PROJECT_CREDENTIALS_ERROR_JSON_NOT_VALID:
      return api.ServerResponseStatusEnum
        .SET_PROJECT_CREDENTIALS_ERROR_JSON_NOT_VALID;

    case enums.postgresErrorsEnum.POSTGRES_CREATE_SCHEMA:
      return api.ServerResponseStatusEnum
        .SET_PROJECT_CREDENTIALS_ERROR_CAN_NOT_CREATE_SCHEMA_POSTGRES;

    case enums.procErrorsEnum.PROC_CREATE_DATASET:
      return api.ServerResponseStatusEnum
        .SET_PROJECT_CREDENTIALS_ERROR_CAN_NOT_CREATE_DATASET;

    case enums.otherErrorsEnum.REGISTER_ERROR_USER_ALREADY_EXISTS:
      return api.ServerResponseStatusEnum.REGISTER_ERROR_USER_ALREADY_EXISTS;

    case enums.otherErrorsEnum.REGISTER_ERROR_USER_IS_NOT_INVITED:
      return api.ServerResponseStatusEnum.REGISTER_ERROR_USER_IS_NOT_INVITED;

    case enums.otherErrorsEnum.INVITE_MEMBER_ERROR_USER_DELETED:
      return api.ServerResponseStatusEnum.INVITE_MEMBER_ERROR_USER_DELETED;

    case enums.otherErrorsEnum
      .DELETE_USER_ERROR_USER_IS_THE_SINGLE_ADMIN_IN_PROJECT:
      return api.ServerResponseStatusEnum
        .DELETE_USER_ERROR_USER_IS_THE_SINGLE_ADMIN_IN_PROJECT;

    case enums.otherErrorsEnum.LOGIN_ERROR_WRONG_PASSWORD:
      return api.ServerResponseStatusEnum.LOGIN_ERROR_WRONG_PASSWORD;

    case enums.otherErrorsEnum.LOGIN_ERROR_USER_DOES_NOT_EXIST:
      return api.ServerResponseStatusEnum.LOGIN_ERROR_USER_DOES_NOT_EXIST;

    case enums.otherErrorsEnum.LOGIN_ERROR_USER_DELETED:
      return api.ServerResponseStatusEnum.LOGIN_ERROR_USER_DELETED;

    case enums.otherErrorsEnum.LOGIN_ERROR_REGISTER_TO_SET_PASSWORD:
      return api.ServerResponseStatusEnum.LOGIN_ERROR_REGISTER_TO_SET_PASSWORD;

    case enums.otherErrorsEnum.VERIFY_EMAIL_ERROR_USER_DOES_NOT_EXIST:
      return api.ServerResponseStatusEnum
        .VERIFY_EMAIL_ERROR_USER_DOES_NOT_EXIST;

    case enums.otherErrorsEnum.RESET_PASSWORD_ERROR_USER_DOES_NOT_EXIST:
      return api.ServerResponseStatusEnum
        .RESET_PASSWORD_ERROR_USER_DOES_NOT_EXIST;

    case enums.otherErrorsEnum.UPDATE_PASSWORD_ERROR_TOKEN_EXPIRED:
      return api.ServerResponseStatusEnum.UPDATE_PASSWORD_ERROR_TOKEN_EXPIRED;

    case enums.otherErrorsEnum.CONFIRM_EMAIL_ERROR_USER_DOES_NOT_EXIST:
      return api.ServerResponseStatusEnum
        .CONFIRM_EMAIL_ERROR_USER_DOES_NOT_EXIST;

    case enums.otherErrorsEnum.GET_STATE_ERROR_USER_DOES_NOT_EXIST:
      return api.ServerResponseStatusEnum.GET_STATE_ERROR_USER_DOES_NOT_EXIST;

    case enums.otherErrorsEnum.API_ERROR:
      return api.ServerResponseStatusEnum.API_ERROR;

    case enums.otherErrorsEnum.AUTHORIZATION_EMAIL_ERROR:
      return api.ServerResponseStatusEnum.AUTHORIZATION_EMAIL_ERROR;

    default:
      return api.ServerResponseStatusEnum.INTERNAL_SERVER_ERROR;
  }
}

function mapInfoErrorMessage(err: any) {
  switch (err.name) {
    case enums.postgresErrorsEnum.POSTGRES_CREATE_SCHEMA:
      return err.originalError ? err.originalError.message : err.message;

    default:
      return undefined;
  }
}
