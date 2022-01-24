var time_in_minutes = 1;
var current_time = Date.parse(new Date());
var deadline = new Date(current_time + time_in_minutes*60*1000);

function time_remaining(endtime){
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor( (t/1000) % 60 );
  var minutes = Math.floor( (t/1000/60) % 60 );
  var hours = Math.floor( (t/(1000*60*60)) % 24 );
  var days = Math.floor( t/(1000*60*60*24) );
  return {'total':t, 'days':days, 'hours':hours, 'minutes':minutes, 'seconds':seconds};
}

function run_clock(endtime){
  var clockM = document.getElementById("mins_left");
  var clockS = document.getElementById("secs_left");
  function update_clock(){
    do{
      var t = time_remaining(endtime);
      clockM.innerHTML = t.minutes;
      clockS.innerHTML = t.seconds;
      if(t.total<=0){ 
          current_time = Date.parse(new Date());
          deadline = new Date(current_time + time_in_minutes*60*1000);
          endtime = deadline;
        }

    }while(t<=0);
  }
  update_clock(); // run function once at first to avoid delay
  var timeinterval = setInterval(update_clock,1000);
  
}

run_clock(deadline);
//setInterval(run_clock(deadline),60000)
