import { Action } from '@ngrx/store';
import * as actionTypes from '@app/store-actions/action-types';
import * as api from '@app/api/_index';

export class SetProjectConnectionAction implements Action {
  readonly type = actionTypes.SET_PROJECT_CONNECTION;

  constructor(public payload: api.SetProjectConnectionRequestBody['payload']) {}
}
