

var calendar = document.querySelector('.calendar');

var onStartTweenBottom = function(dayBottomP, dayP){
  TweenMax.set(dayBottomP, { z: 1 });
};
var onUpdateTweenBottom = function(dayBottomP, dayP, currentDayP){
    if(this.target._gsTransform.rotationX < 90){
      dayP.style.zIndex = currentDayP + 1;
    }
};
var onCompleteTweenBottom = function(dayBottomP, dayP){
};

var onStartTweenTop = function(dayTopP, dayP){
  TweenMax.set(dayTopP, { z: 1 });
};
var onUpdateTweenTop = function(dayTopP, dayP, currentDayP){
    if(this.target._gsTransform.rotationX < -90){
      dayP.style.zIndex = currentDayP ;
    }
};



var today = new Date();
var calendarParams = {
      day: today.getDate(),
      month: today.getMonth(),
      year: 2015,
      duration: 50,
      durationFlip: 0.4
    },
    startDayDate,
    startDay;

var monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
var currentDay = 0;
var topOverlay,
    bottomOverlay;
var topDelay,
    bottomDelay;
var monthName = "AUG";





function init(){
  var GUI = dat.GUI;
  var params = new GUI( { autoPlace: true});
  params.add(calendarParams, 'day', 1, 31).step(1);
  params.add(calendarParams, 'month', 0, 11).step(1);
  params.add(calendarParams, 'year', 2015, 2020).step(1);
  params.add(calendarParams, 'duration', 1, 100).step(1);
  params.add(calendarParams, 'durationFlip', 0.1, 1).step(0.05);
  var apply = {
     restart:function(){ startCalendar();}
  }
  params.add(apply,'restart');
  
  startCalendar();
}

function reset(){
  calendar.classList.remove('in');
  calendar.innerHTML ='';
}




function startCalendar(){
  reset();
  var durationFlip = calendarParams.durationFlip;
  var i = 0,
      j = 0;
  var day,
      dayBottom,
      dayTop;
  var extraDelay = 1;
  
  
  startDayDate = new Date(calendarParams.year, calendarParams.month, calendarParams.day - 1);
  startDay = startDayDate.getDate();
      
  setTimeout(function(){
    calendar.classList.add('in');
  }, extraDelay * 100);


  for ( i = 0 ; i < calendarParams.duration + 2 ; i++){
    //CREATE DAY CONTAINER
    currentDay = startDayDate.getDate();
    monthName = monthNames[startDayDate.getMonth()];
    startDayDate.setDate(startDayDate.getDate() + 1);
    dayTop = document.createElement('p');
    dayTop.classList.add('top')
    dayTop.innerHTML = '<span>' + currentDay + '</span><span class="overlay"></span>';
    dayBottom = document.createElement('p');
    dayBottom.classList.add('bottom')
    dayBottom.innerHTML = '<span>' + currentDay + '</span><span class="month">' + monthName + '</span><span class="overlay"></span>';
    day = document.createElement('div');
    day.classList.add('day');
    day.setAttribute('data-day', currentDay);
    day.appendChild( dayTop );
    day.appendChild( dayBottom );
    calendar.insertBefore( day, calendar.firstChild );
    topOverlay = dayTop.querySelector('.overlay');
    bottomOverlay = dayBottom.querySelector('.overlay');

    topDelay = (durationFlip * 0.5) * j + extraDelay;
    bottomDelay = topDelay + (durationFlip * 0.5);


    //ANIMATING BOTTOM HALF
    if(i > 0){
      TweenMax.set(dayBottom, {
        transformOrigin:'50% 0%',
        rotationX: 180, z: 0 }
      );
      TweenMax.to(dayBottom, durationFlip, {
        rotationX: 0,
        transformOrigin:'50% 0%',
        force3D: true,
        delay: topDelay,
        onStart: onStartTweenBottom,
        onStartParams: [dayBottom, day],
        onUpdate: onUpdateTweenBottom,
        onUpdateParams: [dayBottom, day, j],
        onComplete: onCompleteTweenBottom,
        onCompleteParams: [dayBottom, day]
      })
    }

    if(i <= calendarParams.duration){
      durationFlip -= 0.002;
      durationFlip = Math.max(durationFlip, 0.2);
      TweenMax.to(bottomOverlay, durationFlip * 2, {
        opacity: 0.5,
        force3D: true,
        delay: (durationFlip * 0.5) * j + (durationFlip * 0.5) + extraDelay
      })
    //ANIMATING TOP HALF
      TweenMax.set(dayTop, {
        transformOrigin:'50% 100%',
        rotationX: 0
      });
      TweenMax.to(dayTop, durationFlip, {
        rotationX: -180,
        transformOrigin:'50% 100%',
        force3D: true,
        delay: bottomDelay,
        onStart: onStartTweenTop,
        onStartParams: [dayTop, day],
        onUpdate: onUpdateTweenTop,
        onUpdateParams: [dayTop, day, j]
      })
      TweenMax.to(topOverlay, durationFlip * 1.2, {
        opacity: 0.5,
        force3D: true,
        delay: (durationFlip * 0.5) * j + (durationFlip * 0.5) + extraDelay
      })
    }
    //durationFlip -= 0.002
    j ++;
  }
}

window.onload = init;
