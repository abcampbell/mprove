import { ApRegex } from '../../barrels/am-regex';
import { enums } from '../../barrels/enums';
import { interfaces } from '../../barrels/interfaces';

export function makeMainFields(item: interfaces.Vars) {

  let mainText: string[] = [];
  let groupMainBy: string[] = [];
  let mainFields: {
    as_name: string,
    field_name: string,
    element_name: string
  }[] = [];

  let selected: { [s: string]: number } = {}; // поля которые должны быть в main селекте
  let processedFields: { [s: string]: string } = {};

  let i: number = 0; // номер поля в селекте для group by

  // добавляем в mainFields поля выбранные пользователем по порядку
  item.select.forEach(element => {
    let reg = ApRegex.CAPTURE_DOUBLE_REF_WITHOUT_BRACKETS_G();
    let r = reg.exec(element);

    let asName = r[1];
    let fieldName = r[2];

    mainFields.push({
      as_name: asName,
      field_name: fieldName,
      element_name: asName + '.' + fieldName
    });

    // отмечаем что это поле понадобится в селекте
    selected[element] = 1;
  });

  // добавляем в mainFields оставшиеся depMeasures
  Object.keys(item.dep_measures).forEach(asName => {
    Object.keys(item.dep_measures[asName]).forEach(fieldName => {
      let element = asName + '.' + fieldName;

      // проверка что такое поле еще не добавлялось
      if (!selected[element]) {
        mainFields.push({
          as_name: asName,
          field_name: fieldName,
          element_name: asName + '.' + fieldName
        });
      }

      // отмечаем что это поле понадобится в селекте
      selected[element] = 1;
    });
  });

  // добавляем в main_fields поля из фильтров чтобы далее в этом же сабе обрабатывать
  Object.keys(item.filters).forEach(element => {
    let reg = ApRegex.CAPTURE_DOUBLE_REF_WITHOUT_BRACKETS_G();
    let r = reg.exec(element);

    let asName = r[1];
    let fieldName = r[2];

    // проверка что такое поле еще не добавлялось
    if (!selected[element]) {
      mainFields.push({
        as_name: asName,
        field_name: fieldName,
        element_name: asName + '.' + fieldName
      });
    }

    let fieldClass: enums.FieldClassEnum = asName === 'mf'
      ? item.model.fields.find(mField => mField.name === fieldName).field_class
      : item.model.joins.find(j => j.as === asName).view.fields.find(vField => vField.name === fieldName).field_class;

    // если measure нужно фильтровать - будем добавлять в main select - HAVING станет короче
    if (fieldClass === enums.FieldClassEnum.Measure) {
      selected[element] = 1;
    }
  });

  // набираем селект
  mainFields.forEach(mainField => {

    let asName = mainField.as_name;
    let fieldName = mainField.field_name;
    let element = mainField.element_name;

    let field = asName === 'mf'
      ? item.model.fields.find(mField => mField.name === fieldName)
      : item.model.joins
        .find(j => j.as === asName).view.fields
        .find(vField => vField.name === fieldName);

    let sqlFinal;
    let sqlKeyFinal;
    let sqlSelect;

    if (field.field_class === enums.FieldClassEnum.Dimension) {

      i++;

      if (asName === 'mf') {

        // remove ${ } on doubles (no singles exists in _real of model dimensions)
        sqlSelect = ApRegex.removeBracketsOnDoubles(field.sql_real);

      } else {
        sqlSelect = `${asName}.${fieldName}`;
      }

      if (selected[element]) {
        groupMainBy.push(`${i}`); // toString
      }

    } else if (field.field_class === enums.FieldClassEnum.Measure) {

      i++;

      if (asName === 'mf') {
        // remove ${ } on doubles (no singles exists in _real of model measures)
        sqlFinal = ApRegex.removeBracketsOnDoubles(field.sql_real);

        if ([
          enums.FieldExtTypeEnum.SumByKey,
          enums.FieldExtTypeEnum.AverageByKey,
          enums.FieldExtTypeEnum.MedianByKey,
          enums.FieldExtTypeEnum.PercentileByKey,
        ].indexOf(field.type) > -1) {

          // remove ${ } on doubles (no singles exists in _real of model measures)
          sqlKeyFinal = ApRegex.removeBracketsOnDoubles(field.sql_key_real);
        }

      } else {

        // remove ${ } on singles (no doubles exists in _real of view measures)
        sqlFinal = ApRegex.removeBracketsOnSinglesWithAlias(field.sql_real, asName);

        if ([
          enums.FieldExtTypeEnum.SumByKey,
          enums.FieldExtTypeEnum.AverageByKey,
          enums.FieldExtTypeEnum.MedianByKey,
          enums.FieldExtTypeEnum.PercentileByKey,
        ].indexOf(field.type) > -1) {

          // remove ${ } on singles (no doubles exists in _real of view measures)
          sqlKeyFinal = ApRegex.removeBracketsOnSinglesWithAlias(field.sql_key_real, asName);
        }
      }

      switch (true) {

        case field.type === enums.FieldExtTypeEnum.SumByKey: {
          item.main_udfs['mprove_array_sum'] = 1;

          sqlSelect = `COALESCE(mprove_array_sum(ARRAY_AGG(DISTINCT CONCAT(CONCAT(CAST(`
            + sqlKeyFinal
            + ` AS STRING), '||'), CAST(`
            + sqlFinal
            + ` AS STRING)))), 0)`;

          break;
        }

        case field.type === enums.FieldExtTypeEnum.AverageByKey: {
          item.main_udfs['mprove_array_sum'] = 1;

          let numerator = `mprove_array_sum(ARRAY_AGG(DISTINCT CONCAT(CONCAT(CAST(`
            + sqlKeyFinal
            + ` AS STRING), '||'), CAST(`
            + sqlFinal
            + ` AS STRING))))`;

          let denominator = `NULLIF(CAST(COUNT(DISTINCT CASE WHEN `
            + sqlFinal
            + ` IS NOT NULL THEN `
            + sqlKeyFinal
            + ` ELSE NULL END) AS FLOAT64), 0.0)`;

          sqlSelect = `(${numerator} / ${denominator})`;

          break;
        }

        case field.type === enums.FieldExtTypeEnum.MedianByKey: {
          item.main_udfs['mprove_approx_percentile_distinct_disc'] = 1;

          sqlSelect = `mprove_approx_percentile_distinct_disc(ARRAY_AGG(DISTINCT CONCAT(CONCAT(CAST(`
            + sqlKeyFinal
            + ` AS STRING), '||'), CAST(`
            + sqlFinal
            + ` AS STRING))), 0.5)`;
          break;
        }

        case field.type === enums.FieldExtTypeEnum.PercentileByKey: {
          item.main_udfs['mprove_approx_percentile_distinct_disc'] = 1;

          sqlSelect = `mprove_approx_percentile_distinct_disc(ARRAY_AGG(DISTINCT CONCAT(CONCAT(CAST(`
            + sqlKeyFinal
            + ` AS STRING), '||'), CAST(`
            + sqlFinal
            + ` AS STRING))), `
            + Number(field.percentile) / 100
            + `)`;
          break;
        }

        case field.type === enums.FieldExtTypeEnum.Min: {
          sqlSelect = `MIN(${sqlFinal})`;
          break;
        }

        case field.type === enums.FieldExtTypeEnum.Max: {
          sqlSelect = `MAX(${sqlFinal})`;
          break;
        }

        case field.type === enums.FieldExtTypeEnum.CountDistinct: {
          sqlSelect = `COUNT(DISTINCT ${sqlFinal})`;
          break;
        }

        case field.type === enums.FieldExtTypeEnum.List: {
          sqlSelect = `STRING_AGG(DISTINCT CAST(${sqlFinal} AS STRING), ', ')`;
          break;
        }

        case field.type === enums.FieldExtTypeEnum.Custom: {
          sqlSelect = sqlFinal;
          break;
        }
      }


    } else if (field.field_class === enums.FieldClassEnum.Calculation) {

      if (asName === 'mf') {

        sqlFinal = ApRegex.removeBracketsOnCalculationSinglesMf(field.sql_real);
        sqlFinal = ApRegex.removeBracketsOnCalculationDoubles(sqlFinal);

        sqlSelect = sqlFinal;

      } else {

        sqlFinal = ApRegex.removeBracketsOnCalculationSinglesWithAlias(field.sql_real, asName);
        // no need to substitute doubles (they not exists in view fields)

        sqlSelect = sqlFinal;
      }
    }

    if (selected[element] && field.field_class !== enums.FieldClassEnum.Calculation) {
      mainText.push(`  ${sqlSelect} as ${asName}_${fieldName},`);
    }

    processedFields[element] = sqlSelect;
  });

  item.main_text = mainText;
  item.group_main_by = groupMainBy;
  item.main_fields = mainFields;
  item.selected = selected;
  item.processed_fields = processedFields;

  return item;
}
