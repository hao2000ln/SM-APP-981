# DIFF_BASELINE - ScriptLibrary

> Sinh tu dong boi `tools/diff_baseline.py` - khong sua tay.
> Ngay sinh: 2026-11-05. Che do: tach theo prefix (chua co ban 9.81 sach).

## Gioi han pham vi (doc truoc khi dung file nay)

- CHI bao phu **ScriptLibrary** (export dang tung file `.js`, 1 file = 1 record).
- Format, Process, Trigger, dbdict, Display option, Link, wizard, Format Control,
  Menu, RAD... **CHUA duoc export** -> khong co trong phan tich nay: chua co du lieu.
- `ScriptLibrary/BASELINE_9.81/` KHONG phai export tu instance 9.81 sach: la script SM
  lay tu tang app dang chay (10.0.62.29), da tach rieng script `ESD_`/`HPT_` sang
  `ScriptLibrary/Personal/`. Vi vay **cho sua truc tiep script goc (neu co) KHONG phat
  hien duoc**; tuy bien hien chi xac dinh qua prefix `ESD_`/`HPT_`.
- Ap dung: SM 9.81, tang app 10.0.62.29. Build/patch cu the: chua co du lieu.

## Tong hop

| Muc | So file |
|---|---|
| BASELINE_9.81 (script he thong) | 1316 |
| Personal (tuy bien) | 47 |
| - prefix `ESD_` | 14 |
| - prefix `HPT_` | 33 |
| **Tong** | **1363** |
| Da sua script goc (can ban 9.81 sach) | chua co du lieu |
| Thieu so voi ban sach | chua co du lieu |

## Kiem tra tinh nhat quan

| Kiem tra | Ket qua |
|---|---|
| File `ESD_`/`HPT_` con nam trong BASELINE_9.81 | 0 |
| File khong prefix nam trong Personal | 0 |
| Ten file co o ca hai thu muc | 0 |
| Cung ten sau khi bo prefix (ESD_x vs HPT_x) | 1 |

**Cung ten sau khi bo prefix:**

- `test.js: ESD_TEST.js, HPT_TEST.js`

## Script tuy bien prefix `ESD_` (14)

| # | File | So dong |
|---|---|---|
| 1 | `ScriptLibrary/Personal/ESD_DASHBOARD.js` | 98 |
| 2 | `ScriptLibrary/Personal/ESD_ENV_CONFIG.js` | 28 |
| 3 | `ScriptLibrary/Personal/ESD_RUNTIME_TEST_CALLER.js` | 30 |
| 4 | `ScriptLibrary/Personal/ESD_RUNTIME_TEST_TARGET.js` | 63 |
| 5 | `ScriptLibrary/Personal/ESD_SOURCE_MGMT_POC.js` | 4 |
| 6 | `ScriptLibrary/Personal/ESD_SYNC_ToGoogleSheets.js` | 113 |
| 7 | `ScriptLibrary/Personal/ESD_TEST.js` | 124 |
| 8 | `ScriptLibrary/Personal/ESD_TEST_NEW_HD_LIST.js` | 13 |
| 9 | `ScriptLibrary/Personal/ESD_UI_COMMON.js` | 3 |
| 10 | `ScriptLibrary/Personal/ESD_Utils.js` | 2370 |
| 11 | `ScriptLibrary/Personal/ESD_Validate_Fields.js` | 1749 |
| 12 | `ScriptLibrary/Personal/ESD_Validation_Engine.js` | 456 |
| 13 | `ScriptLibrary/Personal/ESD_Validation_Ruleset_Adapter.js` | 46 |
| 14 | `ScriptLibrary/Personal/ESD_Validation_SM_Adapter.js` | 111 |

## Script tuy bien prefix `HPT_` (33)

| # | File | So dong |
|---|---|---|
| 1 | `ScriptLibrary/Personal/HPT_ActionOrchestrator.js` | 140 |
| 2 | `ScriptLibrary/Personal/HPT_ActionRegistry.js` | 95 |
| 3 | `ScriptLibrary/Personal/HPT_ApiSecurity.js` | 266 |
| 4 | `ScriptLibrary/Personal/HPT_BackgroundJobEngine.js` | 195 |
| 5 | `ScriptLibrary/Personal/HPT_BatchActionEngine.js` | 1196 |
| 6 | `ScriptLibrary/Personal/HPT_CatalogEngine.js` | 1332 |
| 7 | `ScriptLibrary/Personal/HPT_CommonApiUtils.js` | 526 |
| 8 | `ScriptLibrary/Personal/HPT_CommonFilterService.js` | 83 |
| 9 | `ScriptLibrary/Personal/HPT_ContractActionRegistry.js` | 32 |
| 10 | `ScriptLibrary/Personal/HPT_ContractActions.js` | 77 |
| 11 | `ScriptLibrary/Personal/HPT_ContractImportHandler.js` | 162 |
| 12 | `ScriptLibrary/Personal/HPT_ContractImportHandlerRegistry.js` | 15 |
| 13 | `ScriptLibrary/Personal/HPT_ContractJobExecutorRegistry.js` | 16 |
| 14 | `ScriptLibrary/Personal/HPT_ContractJobExecutors.js` | 88 |
| 15 | `ScriptLibrary/Personal/HPT_ContractListDefinition.js` | 644 |
| 16 | `ScriptLibrary/Personal/HPT_ContractRepository.js` | 317 |
| 17 | `ScriptLibrary/Personal/HPT_ContractService.js` | 431 |
| 18 | `ScriptLibrary/Personal/HPT_EmailLogListDefinition.js` | 125 |
| 19 | `ScriptLibrary/Personal/HPT_EmailLogReportService.js` | 198 |
| 20 | `ScriptLibrary/Personal/HPT_ImportEngine.js` | 159 |
| 21 | `ScriptLibrary/Personal/HPT_ImportHandlerRegistry.js` | 74 |
| 22 | `ScriptLibrary/Personal/HPT_JobExecutorRegistry.js` | 65 |
| 23 | `ScriptLibrary/Personal/HPT_JobRepository.js` | 301 |
| 24 | `ScriptLibrary/Personal/HPT_JobWorker.js` | 56 |
| 25 | `ScriptLibrary/Personal/HPT_ScreenDefinition.js` | 1317 |
| 26 | `ScriptLibrary/Personal/HPT_ScreenPresets.js` | 128 |
| 27 | `ScriptLibrary/Personal/HPT_ScreenRegistry.js` | 128 |
| 28 | `ScriptLibrary/Personal/HPT_ScreenService.js` | 267 |
| 29 | `ScriptLibrary/Personal/HPT_ScreenView.js` | 99 |
| 30 | `ScriptLibrary/Personal/HPT_SmFieldAdapter.js` | 247 |
| 31 | `ScriptLibrary/Personal/HPT_StatusListDefinition.js` | 125 |
| 32 | `ScriptLibrary/Personal/HPT_TEST.js` | 37 |
| 33 | `ScriptLibrary/Personal/HPT_WriteLog.js` | 159 |
