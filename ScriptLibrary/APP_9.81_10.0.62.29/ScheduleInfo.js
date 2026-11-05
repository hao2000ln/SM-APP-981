var log = getLog("ScheduleInfo");
function print(scheduleFile){
  log.info("The scheduler begin to run. ScheduleName:"+scheduleFile["name"]+",ScheduleID:"+scheduleFile["schedule.id"]);
}