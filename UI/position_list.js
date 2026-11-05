function buildRawDataRow(f) {
    return {
        id: f.id,
        status_en: f.status_en,
        status_vi: f.status_vi,
        color: f.color,
        bgcolor: f.bgcolor,
        sysmodtime: f.sysmodtime,
    };
}

function render() {
    const raw_data = [];
    const f = new SCFile("esdDMstatus");
    let rc = f.doSelect(true);

    while (rc == RC_SUCCESS) {
        const row = buildRawDataRow(f);
        raw_data.push(
            lib.ESD_Validate_Fields.escapeFields(row, [
                "id",
                "status_en",
                "status_vi",
                "color",
                "bgcolor",
                "sysmodtime",
            ]),
        );
        rc = f.getNext();
    }

    const RAW_JSON = lib.ESD_Validate_Fields.safeJSONStringify(raw_data);

    var strVar = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../js/sl/css/dataTables.dataTables.css">
    <link rel="stylesheet" href="../js/sl/css/buttons.dataTables.css">
    <link rel="stylesheet" href="../js/sl/css/base.css">
    <link rel="stylesheet" href="../js/sl/css/iconhpt.css">
</head>
<body>
    <table id="tableID" class="display" style="width:100%">
        <thead></thead>
        <tbody></tbody>
    </table>

    <script src="../js/sl/js/jquery-3.7.1.js"></script>
    <script src="../js/sl/js/dataTables-2.0.5.js"></script>
    <script src="../js/sl/js/dataTables.buttons.min.js"></script>
    <script src="../js/sl/js/buttons.dataTables.min.js"></script>
    <script src="../js/sl/js/jszip.min.js"></script>
    <script src="../js/sl/js/buttons.html5.min.js"></script>
    <script src="../js/sl/js/utils/defaultDatatable.js"></script>
    <style>div.dt-container div.dt-layout-row:first-child{flex-flow: row nowrap;}</style>
    <script>
        const raw_data = ${RAW_JSON};
        const baseColumns = [
            {
                data: 'id', width: '10%', title: 'Mã phieu',
                render: function (data, type, row, meta) {
                    if (type === "display") {
                        return '<a class="link-ticket" data-dm-id="' + row.id + '" href="javascript:void(0);">' + data + '</a>';
                    }
                    return data;
                }
            },
            { data: 'status_en', width: '10%', title: 'Status En' },
			{ data: 'status_vi', width: '10%', title: 'Status Vi' },
			{ data: 'color', width: '10%', title: 'color' },
			{ data: 'bgcolor', width: '10%', title: 'bgcolor' },
            { data: 'sysmodtime', width: '10%', title: 'sysmodtime' },
        ];

        const tableOptions = getDefaultDataTableOptions(raw_data, {
            destroy: true,
            scrollCollapse: true,
            scrollY: '40rem',
            pageLength: 10,
            deferRender: true,
            columns: baseColumns,
            columnDefs: [
                { targets: '_all', defaultContent: "" }
            ],
            order: [[0, 'desc']]
        });
        
        const table = new DataTable('#tableID', tableOptions);
        // Search only column
        addMultiColumnVNFilter(table, '#tableID', [0, 1]);
        setupLinkClickEvent('a.link-ticket', 'esdDMPosition', 'dm-id', 'id');
    </script>
</body>
</html>`;

    return strVar;
}
