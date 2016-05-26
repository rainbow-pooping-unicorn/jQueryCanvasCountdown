/**
 * AUTHOR
 ** Berit Haak /rainbowpoopingunicorn
 *
 * DATE
 ** 02/2016
 *
 ** canvas Countdown functionality 1.0
 *

 HTML-STRUCTURE

 <div class="clock">                                    // -> this class is variable
     <span class="days"></span>                         // -> important classes
     <span class="hours"></span>
     <span class="minutes"></span>
     <span class="seconds"></span>
     <canvas width="100" height="100"></canvas>         // canvas has to be declared if the startTime is set
 </div>
 *

 *** feel free to love me for this amazing feature ***
*/

(function($){
  $.fn.extend({
    canvasCountdown:function(params){
      // setting parameters with defaults for changing output
      // if startTime is empty no canvas will be displayed
      var conf = {
        'deadline'    : new Date('January 31 2016 22:59:59 UTC+01:00'),
        'startTime'   : null,
        'strokeStyle' : '#ffad41',
        'lineWidth'   : 5,
        'tooltipText' : 'Anzeige geht offline in:',
        'captions'    : {
          'handleSingularValues'  : true,
          'showCaptions'          : true,
          'showOnlyDays'          : false,
          'showCaptionsAsLegend'  : false,
          'day'     : {
            'singular'  : 'Day',
            'plural'    : 'Days'
          },
          'hour'    : {
            'singular'  : 'Hour',
            'plural'    : 'Hours'
          },
          'minute'  : {
            'singular'  : 'Minute',
            'plural'    : 'Minutes'
          },
          'second'  : {
            'singular'  : 'Second',
            'plural'    : 'Seconds'
          },
          'legend'  : {
            'withoutDays'   : 'Std.Min.Sek.',
            'day'     : {
              'singular'      : 'Tag',
              'plural'        : 'Tage'
            }
          }
        }
      };

      $.extend(true, conf, params);

      if(conf.deadline >= $.now()/1000) {
        return $(this).each(function(){
          var $this = $(this);
          $this.show();
          // functionality of the plugin

          // setting the Times
          var deadline = conf.deadline;
          var startTime = conf.startTime;

          // configuration for time calculation
          function getTimeRemaining(endtime){
            var now     = Math.floor(Date.now() / 1000);
            var total   = endtime - now;
            var seconds = Math.floor( (total) % 60 );
            var minutes = Math.floor( (total/60) % 60 );
            var hours   = Math.floor( (total/(60*60)) % 24 );
            var days    = Math.floor( total/(60*60*24) );

            return {
              'total': total,
              'days': days,
              'hours': hours,
              'minutes': minutes,
              'seconds': seconds
            };
          }

          // initialize clock
          function initializeClock(clockElement, endtime){
            var daysSpan = clockElement.find('.days');
            var hoursSpan = clockElement.find('.hours');
            var minutesSpan = clockElement.find('.minutes');
            var secondsSpan = clockElement.find('.seconds');

            daysSpan.append('<span class="value"></span><span class="caption"></span>');
            hoursSpan.append('<span class="value"></span><span class="caption"></span>');
            minutesSpan.append('<span class="value"></span><span class="caption"></span>');
            secondsSpan.append('<span class="value"></span><span class="caption"></span>');

            var daysSpanCaption = daysSpan.find('.caption');
            var daysSpanValue = daysSpan.find('.value');
            var hoursSpanCaption = hoursSpan.find('.caption');
            var hoursSpanValue = hoursSpan.find('.value');
            var minutesSpanCaption = minutesSpan.find('.caption');
            var minutesSpanValue = minutesSpan.find('.value');
            var secondsSpanCaption = secondsSpan.find('.caption');
            var secondsSpanValue = secondsSpan.find('.value');

            $( "span.seconds" ).after('<span class="countdown__legend"></span>');

            function updateClock(){
              var t = getTimeRemaining(endtime);
              var legendContainer = $( "span.days" ).parent().find('.countdown__legend');

              if ((conf.captions.showOnlyDays > t.days) || (conf.captions.showOnlyDays === false)) {
                t.hours += 24*t.days;
                hoursSpanValue.text(('0' + t.hours).slice(-2));
                minutesSpanValue.text(('0' + t.minutes).slice(-2));
                secondsSpanValue.text(('0' + t.seconds).slice(-2));
                daysSpan.hide();
                hoursSpan.show();
                minutesSpan.show();
                secondsSpan.show();
                if (conf.captions.showCaptionsAsLegend === true) {
                  legendContainer.removeClass( 'countdown__legend--days' );
                  legendContainer.text(conf.captions.legend.withoutDays);
                } else if (conf.captions.showCaptions === true) {
                  if ((conf.captions.handleSingularValues === true) && (t.hours == 1)) {
                    hoursSpanCaption.text(conf.captions.hour.singular);
                  } else {
                    hoursSpanCaption.text(conf.captions.hour.plural);
                  }

                  if ((conf.captions.handleSingularValues === true) && (t.minutes == 1)) {
                    minutesSpanCaption.text(conf.captions.minute.singular);
                  } else {
                    minutesSpanCaption.text(conf.captions.minute.plural);
                  }

                  if ((conf.captions.handleSingularValues === true) && (t.seconds == 1)) {
                    secondsSpanCaption.text(conf.captions.second.singular);
                  } else {
                    secondsSpanCaption.text(conf.captions.second.plural);
                  }
                }
                else {
                	// code to be executed if condition is false
                  return false;
                }
              } else {
                daysSpanValue.text(('0' + t.days).slice(-2));
                hoursSpan.hide();
                minutesSpan.hide();
                secondsSpan.hide();
                daysSpan.show();
                if (conf.captions.showCaptionsAsLegend === true) {
                  legendContainer.addClass( 'countdown__legend--days' );
                  if (t.days == 1) {
                    legendContainer.text(conf.captions.legend.day.singular);
                  } else {
                    legendContainer.text(conf.captions.legend.day.plural);
                  }
                } else if (conf.captions.showCaptions === true) {
                  if ((conf.captions.handleSingularValues === true) && (t.days == 1)) {
                    daysSpanCaption.text(conf.captions.day.singular);
                  } else {
                    daysSpanCaption.text(conf.captions.day.plural);
                  }
                }
                else {
                	// code to be executed if condition is false
                  return false;
                }
              }

              if(t.total<=0){
                clearInterval(timeinterval);
                $this.hide();
              }

            }

            //setting data-tooltip attribute
            $( "span.days" ).parent().attr('data-tooltip', conf.tooltipText);

            updateClock(); // run function once at first to avoid delay
            var timeinterval = setInterval(updateClock,1000);
          }

          initializeClock(jQuery(this), deadline);


          if(conf.startTime !== null && conf.deadline > $.now()/1000) {
          	// code to be executed if condition is true
            var $canvas = $this.find ('canvas')[0],
                width = $canvas.width,
                height = $canvas.height,
                ctx = $canvas.getContext('2d');

            var drawTimer = function(deg) {
              var x = width / 2, // center x
                  y = height / 2, // center y
                  radius = width / 2 - conf.lineWidth/2,
                  startAngle = 0,
                  endAngle = deg * (Math.PI/180),
                  counterClockwise = false;

              ctx.clearRect(0, 0, height, width);
              ctx.save();

              // Set new circle orientation
              ctx.translate(0, y*2);
              ctx.rotate(-90 * Math.PI/180);

              // writing circle with canvas
              ctx.beginPath();
              ctx.arc(x, y, radius, startAngle, endAngle, counterClockwise);
              ctx.strokeStyle = conf.strokeStyle;
              ctx.lineWidth = conf.lineWidth;
              ctx.stroke();
              ctx.restore(); // restore original states (no rotation etc)
            };

            var updateTimer = function() {
              // Determine the amount of time elapsed; converted to degrees
              var totalTime = deadline - startTime;
              var currentTime = $.now()/1000;
              var remainingTime = deadline - currentTime;

              var deg = (remainingTime / totalTime) * 360;

              drawTimer(deg);
            };

            updateTimer();

            setInterval(updateTimer, 1000*60);

          }
          else {
          	// code to be executed if condition is false
            return false;
          }
        });
      }
    }
  });
  })(jQuery);
