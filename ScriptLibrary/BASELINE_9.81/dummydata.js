//var log = getLog('dummydata');

function getTpData() {
  return [
    {
      "title": "TP - AC Nilson - 1",
      "description": "TP - AC NNN - Production - des - 1",
      "color": "red",
      "@type": "tp",
      "durations": [
        {
          "end": "2012-12-27 10:00:00", //"2012-12-27 10",
          "start": "2012-12-27 03:00:00" //"2012-12-27 3"
        }
      ]
    },
    {
      "title": "TP - AC Nilson - 2",
      "description": "TP - AC NNN - Production - des - 2",
      "color": "red",
      "@type": "tp",
      "durations": [
        {
          "end": "2012-12-28 18:00:00", //"2012-12-28 18",
          "start": "2012-12-28 00:00:00" //"2012-12-28 0"
        }
      ]
    },
    {
      "title": "TP - AC Nilson - 3",
      "description": "TP - AC NNN - Production - des - 3",
      "color": "red",
      "@type": "tp",
      "durations": [
        {
          "end": "2012-12-28 05:00:00", //"2012-12-28 5",
          "start": "2012-12-27 03:00:00" //"2012-12-27 3"
        }
      ]
    },
    {
      "title": "TP - AC Nilson - 4",
      "description": "TP - AC NNN - Production - des - 4",
      "color": "red",
      "@type": "tp",
      "durations": [
        {
          "end": "2012-12-27 19:00:00", //"2012-12-27 19",
          "start": "2012-12-25 08:00:00" //"2012-12-25 8"
        }
      ]
    },
    {
      "title": "TP - AC Nilson - 7",
      "description": "TP - AC NNN - Production - des - 7",
      "color": "red",
      "@type": "tp",
      "durations": [
        {
          "end": "2012-12-30 21:00:00", //"2012-12-30 21",
          "start": "2012-12-20 03:00:00" //"2012-12-20 3"
        }
      ]
    },
    {
      "title": "TP - AC Nilson - 5",
      "description": "TP - AC NNN - Production - des - 5",
      "color": "red",
      "@type": "tp",
      "durations": [
        {
          "end": "2012-11-01 04:00:00", //"2012-11-01 04",
          "start": "2012-10-29 03:00:00" //"2012-10-29 3"
        }
      ]
    },
    {
      "@type": "tp",
      "title": "TP - AC Nilson - Pre production",
      "description": "TP - AC Nilson - Pre production - description",
      "color": "red",
      "durations": [
        {
          "end": "2012-10-30 23:00:00", //"2012-10-30 23",
          "start": "2012-10-30 01:00:00" //"2012-10-30 1"
        }
      ]
    },
    {
      "@type": "tp",
      "title": "TP - AC Nilson - QA",
      "description": "TP - AC Nilson - QA - description",
      "color": "red",
      "durations": [
        {
          "end": "2012-11-02 23:00:00", //"2012-11-2 23",
          "start": "2012-11-01 01:00:00" //"2012-11-1 1"
        }
      ]
    },
    {
      "title": "TP - AC Nilson - Production",
      "description": "Title: AC Nilson<br/>Environment: Production",
      "color": "red",
      "@type": "tp",
      "durations": [
        {
          "end": "2012-11-28 14:00:00", //"2012-11-28 14",
          "start": "2012-11-28 08:00:00" //"2012-11-28 8"
        },
        {
          "end": "2012-11-26 14:00:00", //"2012-11-26 14",
          "start": "2012-11-26 08:00:00" //"2012-11-26 8"
        }
      ]
    },
    {
      "title": "TP - AC Nilson - QA",
      "description": "Title: AC Nilson<br/>Environment: QA",
      "color": "green",
      "@type": "tp",
      "durations": [
        {
          "end": "2012-11-29 03:00:00", //"2012-11-29 3",
          "start": "2012-11-28 23:00:00" //"2012-11-28 23"
        },
        {
          "end": "2012-11-27 04:00:00", //"2012-11-27 4",
          "start": "2012-11-26 22:00:00" //"2012-11-26 22"
        }
      ]
    },
    {
      "title": "TP - AC Nilson - Pre production",
      "description": "Title: AC Nilson<br/>Environment: Pre production",
      "color": "blue",
      "@type": "tp",
      "durations": [
        {
          "end": "2012-11-29 03:00:00", //"2012-11-29 3",
          "start": "2012-11-26 14:00:00" //"2012-11-26 14"
        }
      ]
    }
  ];
}

function getEntryData() {
  return [
    {
      "@type": "ce",
      "id": "C10002",
      "file": "cm3r",
      "title": "Change - AC Nilson - Production",
      "description": "Change - DDD - Production - description",
      "start": "2012-12-25 02:00:00", //2012-12-25 2
      "end": "2012-12-26 07:00:00", //2012-12-26 7
      "color": "green",
      "uniqueQuery": "number='C10002'",
      "overlapped": [
        {
          "@type": "tp",
          "title": "TP - AC Nilson - Production",
          "color": "red",
          "durations": [
            {
              "end": "2012-12-28 04:00:00", //"2012-12-28 04",
              "start": "2012-12-26 03:00:00" //"2012-12-26 3"
            }
          ]
        }
      ]
    },
    {
      "@type": "ce",
      "id": "C10003",
      "file": "cm3r",
      "title": "Change - AC Nilson - Pre Production",
      "description": "Change - AC Nilson - Production - description",
      "start": "2012-12-26 23:00:00", // 2012-12-26 23
      "end": "2012-12-28 01:00:00", //2012-12-28 01
      "color": "green",
      "uniqueQuery": "number='C10003'"
    },
    {
      "@type": "ce",
      "id": "C10004",
      "file": "cm3r",
      "title": "Change - AC Nilson - QA",
      "description": "Change - AC Nilson - QA - description",
      "start": "2012-12-27 20:00:00", // 2012-12-27 20
      "end": "2012-12-28 20:00:00", //2012-12-28 20
      "color": "green",
      "uniqueQuery": "number='C10004'"
    },
    {
      "@type": "ce",
      "id": "C10005",
      "file": "cm3r",
      "title": "C10004 - Memory Upgrade",
      "description": "Title:Memory Upgrade<br/>Environment: Pre Production<br/>Description:Upgrade the memory for workstation or laptop",
      "start": "2012-12-27 20:00:00", // 2012-12-27 20
      "end": "2012-12-27 02:00:00", //2012-12-27 02
      "color": "green",
      "uniqueQuery": "number='C10005'"
    },

    {
      "@type": "ce",
      "id": "C10009",
      "file": "cm3r",
      "title": "C10006 - Virus e-mail",
      "description": "Title:Virus e-mail<br/>Environment: Pre Production<br/>Description:Check and clean system on virusses.<br/>Affected CI:adv-nam-desk-209",
      "start": "2012-12-28 05:00:00", // 2012-12-28 5
      "end": "2012-12-28 14:00:00", //2012-12-28 14
      "color": "blue",
      "uniqueQuery": "number='C10006'"
    },
    {
      "@type": "ce",
      "id": "C10015",
      "file": "cm3r",
      "title": "C10015 - Reinstall network drivers",
      "description": "Title:Reinstall network drivers<br/>Environment: QA<br/>Description:Check and clean system on virusses.<br/>Affected CI:adv-nam-desk-209",
      "start": "2012-12-28 10:00:00", // 2012-12-28 10
      "end": "2012-12-28 19:00:00", //2012-12-28 19
      "color": "#FFCC66",
      "uniqueQuery": "number='C10015'",
      "overlapped": [
        {
          "title": "TP - AC Nilson - Pre production",
          "description": "Title: AC Nilson<br/>Environment: Pre production",
          "color": "blue",
          "@type": "tp",
          "durations": [
            {
              "end": "2012-11-29 03:00:00", //"2012-11-29 3",
              "start": "2012-11-26 14:00:00" //"2012-11-26 14"
            }
          ]
        }
      ]
    },
    {
      "@type": "ce",
      "id": "C10016",
      "file": "cm3r",
      "title": "Change - AC Nilson - Pre Production",
      "description": "Change - AC Nilson - Production - description",
      "start": "2012-12-26 23:00:00",
      "end": "2012-12-28 01:00:00",
      "color": "green",
      "uniqueQuery": "number='C10003'"
    },
    {
      "@type": "ce",
      "id": "C10017",
      "file": "cm3r",
      "title": "Change - AC Nilson - Pre Production",
      "description": "Change - AC Nilson - Production - description",
      "start": "2012-12-26 23:00:00",
      "end": "2012-12-28 01:00:00",
      "color": "green",
      "uniqueQuery": "number='C10003'"
    },
    {
      "@type": "ce",
      "id": "C10018",
      "file": "cm3r",
      "title": "Change - AC Nilson - Pre Production",
      "description": "Change - AC Nilson - Production - description",
      "start": "2012-12-26 23:00:00",
      "end": "2012-12-28 01:00:00",
      "color": "green",
      "uniqueQuery": "number='C10003'"
    },
    {
      "@type": "ce",
      "id": "C10019",
      "file": "cm3r",
      "title": "Change - AC Nilson - Pre Production",
      "description": "Change - AC Nilson - Production - description",
      "start": "2012-12-26 23:00:00",
      "end": "2012-12-28 01:00:00",
      "color": "green",
      "uniqueQuery": "number='C10003'"
    },
    {
      "@type": "ce",
      "id": "C10020",
      "file": "cm3r",
      "title": "Change - AC Nilson - Pre Production",
      "description": "Change - AC Nilson - Production - description",
      "start": "2012-12-26 23:00:00",
      "end": "2012-12-28 01:00:00",
      "color": "green",
      "uniqueQuery": "number='C10003'"
    },
    {
      "@type": "ce",
      "id": "C10021",
      "file": "cm3r",
      "title": "Change - AC Nilson - Pre Production",
      "description": "Change - AC Nilson - Production - description",
      "start": "2012-12-26 23:00:00",
      "end": "2012-12-28 01:00:00",
      "color": "green",
      "uniqueQuery": "number='C10003'"
    },
    {
      "@type": "ce",
      "id": "C10022",
      "file": "cm3r",
      "title": "Change - AC Nilson - Pre Production",
      "description": "Change - AC Nilson - Production - description",
      "start": "2012-12-26 23:00:00",
      "end": "2012-12-28 01:00:00",
      "color": "green",
      "uniqueQuery": "number='C10003'"
    },
    {
      "@type": "ce",
      "id": "C10023",
      "file": "cm3r",
      "title": "Change - AC Nilson - Pre Production",
      "description": "Change - AC Nilson - Production - description",
      "start": "2012-12-26 23:00:00",
      "end": "2012-12-28 01:00:00",
      "color": "green",
      "uniqueQuery": "number='C10003'"
    },
    {
      "@type": "ce",
      "id": "C10024",
      "file": "cm3r",
      "title": "Change - AC Nilson - Pre Production",
      "description": "Change - AC Nilson - Production - description",
      "start": "2012-12-26 23:00:00",
      "end": "2012-12-28 01:00:00",
      "color": "green",
      "uniqueQuery": "number='C10003'"
    }
  ];
}

function getFilterInfos() {
  return [
    {
      filterId: '0',
      name: 'MyFilter',
      category: 'default',
      description: 'My filter',
      userRight: 'readonly',
      general: true
    },
    {
      filterId: '1',
      name: '1st filter',
      category: 'default',
      description: '1st filter',
      userRight: 'readwrite',
      general: true
    },
    {
      filterId: '2',
      name: '2nd filter',
      category: 'default',
      description: '2nd filter',
      userRight: 'readwrite',
      general: true
    }
  ];

}

function getDefaultFilterName() {
  return 'MyFilter';
}

function getFilter(id) {
  return {
    "id": id,
    info: {
      name: 'MyFilter',
      category: 'default',
      description: "test filter",
      userRight: '',
      general: true
    },
    groups: getGroups()
  };
}

function getGroups() {
  var fields = getGroupFields();
  return [
    {
      virtual: true,
      fields: [fields[0]]
    },
    {
      virtual: true,
      fields: [fields[1]]
    }
  ];
}

function getGroupFields() {
  return [
    {
      "field": "severity",
      "label": "Urgency",
      "type": "TEXT_SELECTOR",
      "multiSelect": "true",
      "tab": "group1",
      "values": [
        {
          "value": "1",
          "text": "high"
        }
      ]
    },
    {
      "field": "header/risk.assessment",
      "label": "Risk Assessment",
      "type": "TEXT_SELECTOR",
      "multiSelect": "false",
      "tab": "group2",
      "values": [
        {
          "value": "0",
          "text": "urgent"
        }
      ]
    }
  ];
}


function getFieldValues(field, start, size, filterValue, needCount) {
  if(size == 0) {
    return getAllFieldValues(field);
  } else {
    return getPagingFieldValues(field, start, size, filterValue, needCount);
  }
}

function getAllFieldValues(field) {
  var valueArray = [];
  if(field == 'severity') {
    valueArray = [
      {
        "value": "low",
        "text": "text-low"
      },
      {
        "value": "medium",
        "text": "text-medium"
      },
      {
        "value": "high",
        "text": "text-high"
      }
    ];
  } else if(field == 'header/risk.assessment') {
    valueArray = [
      {
        "value": "low-risk",
        "text": "low risk"
      },
      {
        "value": "medium-risk",
        "text": "medium risk"
      },
      {
        "value": "high-risk",
        "text": "high risk"
      }
    ];
  }
  return {values: valueArray};
}

function getPagingFieldValues(field, start, size, filterValue, needCount) {
  var filteredList = [];
  if(filterValue && filterValue != '') {
    var i;
    for (i = 0; i < ciList.length; i++) {
      var ciText = ciList[i].text;
      if(ciText.indexOf(filterValue) != -1) {
        filteredList.push(ciList[i]);
      }
    }
  } else {
    filteredList = ciList;
  }

  return filteredList;
}

var ciList = [
  {
    "value": "a1",
    "text": "a1"
  },
  {
    "value": "a2",
    "text": "a2"
  },
  {
    "value": "a3",
    "text": "a3"
  },
  {
    "value": "a4",
    "text": "a4"
  },
  {
    "value": "a5",
    "text": "a5"
  },
  {
    "value": "a6",
    "text": "a6"
  },
  {
    "value": "a7",
    "text": "a7"
  },
  {
    "value": "a8",
    "text": "a8"
  },
  {
    "value": "a9",
    "text": "a9"
  },
  {
    "value": "a10",
    "text": "a10"
  },
  {
    "value": "a11",
    "text": "a11"
  },
  {
    "value": "a12",
    "text": "a12"
  },
  {
    "value": "a13",
    "text": "a13"
  },
  {
    "value": "a14",
    "text": "a14"
  },
  {
    "value": "a15",
    "text": "a15"
  },
  {
    "value": "a16",
    "text": "a16"
  },
  {
    "value": "a17",
    "text": "a17"
  },
  {
    "value": "okl",
    "text": "okla"
  },
  {
    "value": "abde",
    "text": "abde"
  }
];

function getFields() {
  return [
    {
      'field': 'Urgency',
      'label': 'Urgency',
      'type': 'BOX_SELECTOR',
      'multiSelect': false,
      'tab': 'gp1'
    },
    {
      'field': 'header/risk.assessment',
      'label': 'Risk Assessment',
      'type': 'BOX_SELECTOR',
      'multiSelect': true,
      'tab': 'gp1'
    },
    {
      'field': 'severity',
      'label': 'Severity',
      'type': 'ADVANCED_SELECTOR',
      'tab': 'gp1'
    },

    {
      'field': 'Urgency1',
      'label': 'Urgency1',
      'type': 'BOX_SELECTOR',
      'multiSelect': false,
      'tab': 'gp2'
    },
    {
      'field': 'Urgency2',
      'label': 'Urgency2',
      'type': 'BOX_SELECTOR',
      'multiSelect': false,
      'tab': 'gp2'
    },
    {
      'field': 'severity3',
      'label': 'Severity3',
      'type': 'BOX_SELECTOR',
      'tab': 'gp2'
    }
  ];
}


//--------------------- add for ide -------------------------
lib.dummydata = {
  "getTpData": getTpData,
  "getEntryData": getEntryData,
  "getFilterInfos": getFilterInfos,
  "getDefaultFilterName": getDefaultFilterName,
  "getFilter": getFilter,
  "getFieldValues": getFieldValues,
  "getFields": getFields
};

