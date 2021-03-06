import { Action } from '@ngrx/store';
import * as actionTypes from '@app/store-actions/action-types';

export class CleanDashboardsStateAction implements Action {
  readonly type = actionTypes.CLEAN_DASHBOARDS_STATE;

  constructor(
    public payload: {
      project_id: string;
      repo_id: string;
      struct_id: string;
    }
  ) {}
}
