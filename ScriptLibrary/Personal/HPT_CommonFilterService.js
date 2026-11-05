/**
 * ScriptLibrary name: HPT_CommonFilterService
 * Nguồn option dùng chung cho các bộ lọc toàn hệ thống.
 */

// Nạp Catalog Engine tại runtime.
function getCatalogEngine() {
  var engine = lib.HPT_CatalogEngine;
  if (!engine) throw new Error("HPT_CatalogEngine is not available");
  return engine;
}

// Khai báo backend metadata tối thiểu cho danh mục đơn vị.
function getCommonFilterConfig() {
  return {
    module: "HPT_CommonFilterService",
    requestIdPrefix: "CFS",
    // Engine v1 denies every undeclared operation. This service only exposes
    // lookup options; list/detail/mutations remain unavailable.
    actionPermissions: {
      filterOptions: { allow: true }
    },
    filterOptions: {
    orgLv1: {
      source: "lookup",
      lookup: {
        table: "esdQTorgUnit",
        keyField: "unit.id",
        labelField: "unit.name",
        query: 'level like "lv1*" and status="Dang hoat dong"',
        orderBy: "unit.name",
        maxItems: 500
      }
    },
    orgLv2: {
      source: "dependent",
      dependsOn: "orgLv1",
      parentParameter: "parentId",
      maxParentLength: 160,
      lookup: {
        table: "esdQTorgUnit",
        keyField: "unit.id",
        labelField: "unit.name",
        query: 'level like "lv2*" and status="Dang hoat dong"',
        parentField: "parent.id",
        orderBy: "unit.name",
        maxItems: 500
      }
    },
    orgLv3: {
      source: "dependent",
      dependsOn: "orgLv2",
      parentParameter: "parentId",
      maxParentLength: 160,
      lookup: {
        table: "esdQTorgUnit",
        keyField: "unit.id",
        labelField: "unit.name",
        query: 'level like "lv3*" and status="Dang hoat dong"',
        parentField: "parent.id",
        orderBy: "unit.name",
        maxItems: 500
      }
    }
    }
  };
}

// Trả danh sách đơn vị cấp 1.
function getOrgLevel1(request) {
  return getCatalogEngine().getFilterOptions(getCommonFilterConfig(), "orgLv1", request);
}

// Trả đơn vị cấp 2 theo một hoặc nhiều đơn vị cha.
function getOrgLevel2(request) {
  return getCatalogEngine().getFilterOptions(getCommonFilterConfig(), "orgLv2", request);
}

// Trả đơn vị cấp 3 theo một hoặc nhiều đơn vị cha.
function getOrgLevel3(request) {
  return getCatalogEngine().getFilterOptions(getCommonFilterConfig(), "orgLv3", request);
}
