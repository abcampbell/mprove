import { Action } from '@ngrx/store';
import * as actionTypes from '@app/store-actions/action-types';

export class UpdateLayoutChartIdAction implements Action {
  readonly type = actionTypes.UPDATE_LAYOUT_CHART_ID;

  constructor(public payload: string) {}
}
