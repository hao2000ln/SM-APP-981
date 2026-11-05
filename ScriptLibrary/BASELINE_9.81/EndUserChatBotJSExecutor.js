function execute() {
    var jsExecutor = new SCFile("sdchatbotjsexecutor");
    var js = vars['$L.file']['js'];
    var params = lib.EndUserChat.strToJson(vars['$L.file']['parameter']);

    jsExecutor['result'] = lib.JSON2.toJSON(eval(js).apply(this, [params]));
    vars['$L.file'] = jsExecutor;
    vars.$L_exit = "normal";
}