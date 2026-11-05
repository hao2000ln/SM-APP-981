var WARNING_VALUE = 1800000000;

function getConsumedWarningCounters() {
    var counterList = [];
    var counter = new SCFile("counters");
    var rc = counter.doSelect("true");
    while (rc == RC_SUCCESS) {
        if (counter["current.value"] > WARNING_VALUE) {
            var counterValue = {};
            counterValue["type"] = "counters";
            counterValue["name"] = counter["table.name"];
            counterValue["value"] = counter["current.value"];
            counterList.push(counterValue);
        }
        rc = counter.getNext();
    }
    
    return counterList;
}

function getConsumedWarningNumbers() {
    var numberList = [];
    var number = new SCFile("number");
    var rc = number.doSelect("true");
    while (rc == RC_SUCCESS) {
        if (number["number"] > WARNING_VALUE) {
            var numberValue = {};
            numberValue["type"] = "number";
            numberValue["name"] = number["name"];
            numberValue["value"] = number["number"];
            numberList.push(numberValue);
        }
        rc = number.getNext();
    }
    
    return numberList;
}

function generateCounterWarningMailBody(counterValues, body) {
    if (counterValues == null || counterValues.length ==0) {
        return null;
    }
    
    var table = "<table style=\"FONT-SIZE: 11pt; FONT-FAMILY: Metric Regular, arial\" cellspacing=\"2\" cellpadding=\"6\" width=\"94%\" align=\"right\" border=\"1\">";
    table += "  <tbody>\n";
    table += "    <tr>\n";
    table += "      <th align=\"left\">" + funcs.scmsg("counter:type", "monitor") + "</th>\n";
    table += "      <th align=\"left\">" + funcs.scmsg("counter:tablename", "monitor") + "</th>\n";
    table += "      <th align=\"right\">" + funcs.scmsg("counter:value", "monitor") + "</th>\n";
    table += "    </tr>\n";
    for (var i=0; i<counterValues.length; i++) {
        table += "    <tr>\n";
        table += "      <td align=\"left\">" + funcs.scmsg(counterValues[i]["type"], "tablename") + "</td>\n";
        table += "      <td align=\"left\">" + counterValues[i]["name"] + "</td>\n";
        table += "      <td align=\"right\">" + counterValues[i]["value"] + "</td>\n";
        table += "    </tr>\n";
    }
    table += "  </tbody>\n";
    table += "</table>\n";
    
    if (body == null || body == "") {
        body = "<html>\n" + table + "</html>";
    } else {
        body = body.replace("${counterValues}", table);
        body = "<html>\n" + body + "\n</html>";
    }
    
    return body;
}


function sendCounterWarningMail(toUsers, counterValues) {
    if (toUsers == null || toUsers.length == 0) {
        toUsers = ["falcon"];
    }
    
    var fromUser = funcs.operator();
    
    var mail = new SCFile("mail");
    mail["user.to"] = "scheduler";
    mail["user.from"] = fromUser;
    mail["user.array"] = toUsers;

    mail["date.to.send"] = funcs.tod();
    mail["status"] = "sent";
    mail["mailno"] = new Datum();
    var no = new Datum();
    funcs.rtecall("getnumber", 1, no, "mail");
    mail["mailno"] = no;
    
    mail["application"] = "email"
    
    var body = "";
    var template = new SCFile("htmltemplates");
    var rc = template.doSelect("name=\"Counter Upper Limit Warning\" and language=\""+ lib.htmlemailtemplates.getLang(fromUser) +"\"");
    if (rc == RC_SUCCESS) {
        mail["subject"] = template["mail.title"];
        body = template["htmlcode"];
    } else {
        mail["subject"] = "Warning: the value of counters/number is close to the upper limit! ";
    }
    
    body = generateCounterWarningMailBody(counterValues, body);
    
    if (body == null) {
        return;
    }
    
    mail["text"].push(body);

    var rteNames = new Datum();
    rteNames.push("file");
    var rteValues = new Datum();
    rteValues.push(mail);
    funcs.rtecall("callrad", new SCDatum(), "mail.send.sched", rteNames, rteValues, false);
}

function checkCounterWarning(toUsers, value) {
    if (value != null && value > 0) {
        WARNING_VALUE = value;
    }
    
    var counterValues = getConsumedWarningCounters();
    var numberValues = getConsumedWarningNumbers();
    
    counterValues = lib.ArrayUtil.merge(counterValues, numberValues);
    
    sendCounterWarningMail(toUsers, counterValues);
}

