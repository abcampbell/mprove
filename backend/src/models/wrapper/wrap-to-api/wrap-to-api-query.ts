import { api } from '../../../barrels/api';
import { entities } from '../../../barrels/entities';
import { helper } from '../../../barrels/helper';

export function wrapToApiQuery(query: entities.QueryEntity): api.Query {
  return {
    query_id: query.query_id,
    project_id: query.project_id,
    struct_id: query.struct_id,
    pdt_deps: JSON.parse(query.pdt_deps),
    pdt_deps_all: JSON.parse(query.pdt_deps_all),
    sql: JSON.parse(query.sql),
    is_pdt: helper.benumToBoolean(query.is_pdt),
    pdt_id: query.pdt_id,
    pdt_trigger_sql: query.pdt_trigger_sql,
    pdt_trigger_time: query.pdt_trigger_time,
    pdt_need_start_by_time: helper.benumToBoolean(query.pdt_need_start_by_time),
    pdt_need_start_by_trigger_sql: helper.benumToBoolean(
      query.pdt_need_start_by_trigger_sql
    ),
    pdt_trigger_sql_value: query.pdt_trigger_sql_value,
    pdt_trigger_sql_last_error_message:
      query.pdt_trigger_sql_last_error_message,
    status: query.status,
    last_run_by: query.last_run_by,
    last_run_ts: Number(query.last_run_ts),
    last_cancel_ts: Number(query.last_cancel_ts),
    last_complete_ts: Number(query.last_complete_ts),
    last_complete_duration: Number(query.last_complete_duration),
    last_error_message: query.last_error_message,
    last_error_ts: Number(query.last_error_ts),
    data: query.data,
    temp: helper.benumToBoolean(query.temp),
    server_ts: Number(query.server_ts)
  };
}
