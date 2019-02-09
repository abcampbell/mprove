import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import * as api from '@app/api/_index';
import * as actionTypes from '@app/store/action-types';
import * as actions from '@app/store/actions/_index';
import * as services from '@app/services/_index';
import * as interfaces from '@app/interfaces/_index';

@Injectable()
export class FailEffect {
  @Effect({ dispatch: false }) fail$: Observable<Action> = this.actions$.pipe(
    ofType(
      actionTypes.BACKEND_FAIL,

      actionTypes.CREATE_FILE_FAIL,
      actionTypes.SAVE_FILE_FAIL,
      actionTypes.DELETE_FILE_FAIL,

      actionTypes.CREATE_FOLDER_FAIL,
      actionTypes.DELETE_FOLDER_FAIL,
      actionTypes.RENAME_FOLDER_FAIL,

      actionTypes.CREATE_MCONFIG_FAIL,

      actionTypes.CREATE_MEMBER_FAIL,
      actionTypes.EDIT_MEMBER_FAIL,
      actionTypes.DELETE_MEMBER_FAIL,

      actionTypes.CREATE_DASHBOARD_FAIL,
      actionTypes.CREATE_MCONFIG_AND_QUERY_FAIL,

      actionTypes.CREATE_PROJECT_FAIL,
      actionTypes.SET_PROJECT_QUERY_SIZE_LIMIT_FAIL,
      actionTypes.SET_PROJECT_WEEK_START_FAIL,
      actionTypes.SET_PROJECT_TIMEZONE_FAIL,
      actionTypes.DELETE_PROJECT_FAIL,

      actionTypes.CANCEL_QUERIES_FAIL,
      actionTypes.RUN_QUERIES_FAIL,
      actionTypes.RUN_QUERIES_DRY_FAIL,
      actionTypes.SET_LIVE_QUERIES_FAIL,

      actionTypes.SET_USER_NAME_FAIL,
      actionTypes.SET_USER_THEMES_FAIL,
      actionTypes.SET_USER_TIMEZONE_FAIL,

      actionTypes.COMMIT_REPO_FAIL,
      actionTypes.PULL_REPO_FAIL,
      actionTypes.PUSH_REPO_FAIL,
      actionTypes.REGENERATE_REPO_REMOTE_PUBLIC_KEY_FAIL,
      actionTypes.REGENERATE_REPO_REMOTE_WEBHOOK_FAIL,
      actionTypes.REVERT_REPO_TO_LAST_COMMIT_FAIL,
      actionTypes.REVERT_REPO_TO_PRODUCTION_FAIL,
      actionTypes.SET_REPO_REMOTE_URL_FAIL,

      actionTypes.CANCEL_SUBSCRIPTIONS_FAIL,
      actionTypes.SWITCH_ANALYTICS_SUBSCRIPTION_PLAN_FAIL,

      actionTypes.CONFIRM_FAIL,
      actionTypes.PONG_FAIL
    ),
    filter(
      (action: any) =>
        !action.payload.error
          .toString()
          .includes('Request not sent because not authenticated')
    ),
    tap((action: any) => {
      let e = action.payload.error;

      if (
        e &&
        e.data &&
        e.data.response &&
        e.data.response.body &&
        e.data.response.body.info &&
        [api.ServerResponseStatusEnum.AUTHORIZATION_ERROR].indexOf(
          e.data.response.body.info.status
        ) > -1
      ) {
        this.myDialogService.showInfoDialog(e.data.response.body.info.status);
        this.store.dispatch(new actions.LogoutUserAction({ empty: true }));

        return;
      }

      if (
        e &&
        e.data &&
        e.data.response &&
        e.data.response.body &&
        e.data.response.body.info &&
        e.data.response.body.info.status ===
          api.ServerResponseStatusEnum.MaintenanceMode
      ) {
        let url = this.router.routerState.snapshot.url;

        window.location.href = url;
      } else {
        let err = e;

        if (!err.data) {
          err.name = `[AppEffects] ${err.message}`;
          err.message = `[AppEffects] ${err.message}: -`;

          err.data = {
            name: err.name,
            message: '-'
          };
        }

        err.name = `${action.type} ${err.name}`;
        err.message = `${action.type} ${err.message}`;

        err.data = {
          name: err.name,
          message: err.data.message
        };

        throw err;
      }
    })
  );

  constructor(
    private actions$: Actions,
    private router: Router,
    private myDialogService: services.MyDialogService,
    private store: Store<interfaces.AppState>
  ) {}
}
