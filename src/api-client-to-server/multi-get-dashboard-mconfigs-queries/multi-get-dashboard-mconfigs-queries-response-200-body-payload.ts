import * as api from '../../_index';

export interface MultiGetDashboardMconfigsQueriesResponse200BodyPayload {
  dashboard_or_empty: api.Dashboard[];
  dashboard_mconfigs: api.Mconfig[];
  dashboard_queries: api.Query[];
}
