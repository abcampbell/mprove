import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import * as actions from '@app/store-actions/actions';
import * as api from '@app/api/_index';
import * as interfaces from '@app/interfaces/_index';
import * as selectors from '@app/store-selectors/_index';

@Component({
  moduleId: module.id,
  selector: 'm-rename-folder-dialog',
  templateUrl: 'rename-folder-dialog.component.html'
})
export class RenameFolderDialogComponent implements OnInit {
  renameFolderForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<RenameFolderDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { node_id: string },
    private store: Store<interfaces.AppState>
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  buildForm(): void {
    this.renameFolderForm = this.fb.group({
      name: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(20)])
      ]
    });
  }

  onSubmit(fv: any) {
    let repo: api.Repo;
    this.store
      .select(selectors.getSelectedProjectModeRepo)
      .pipe(take(1))
      .subscribe(x => (repo = x));

    this.store.dispatch(
      new actions.RenameFolderAction({
        project_id: repo.project_id,
        repo_id: repo.repo_id,
        repo_server_ts: repo.server_ts,
        node_id: this.data.node_id,
        new_name: fv['name']
      })
    );
  }
}
