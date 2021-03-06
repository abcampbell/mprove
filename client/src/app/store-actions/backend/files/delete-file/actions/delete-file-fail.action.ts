import { Action } from '@ngrx/store';
import * as actionTypes from '@app/store-actions/action-types';

export class DeleteFileFailAction implements Action {
  readonly type = actionTypes.DELETE_FILE_FAIL;

  constructor(public payload: { error: any }) {}
}
