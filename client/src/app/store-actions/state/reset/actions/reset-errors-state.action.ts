import { Action } from '@ngrx/store';
import * as actionTypes from '@app/store-actions/action-types';

export class ResetErrorsStateAction implements Action {
  readonly type = actionTypes.RESET_ERRORS_STATE;

  constructor() {}
}
