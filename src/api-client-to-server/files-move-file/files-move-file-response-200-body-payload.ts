import * as api from '../../_index';

export interface FilesMoveFileResponse200BodyPayload {
  deleted_dev_file: api.CatalogFile;
  new_dev_file: api.CatalogFile;
  dev_struct: api.Struct;
}
