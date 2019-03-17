var today = new Date()
var weeknumber = dateFns.getISOWeek(today);
var year = today.getFullYear();
var relativeDay = today;

var events = {}
var eventDays = ['monday-events', 'tuesday-events', 'wednesday-events', 'thursday-events', 'friday-events', 'saturday-events', 'sunday-events'];


$(document).ready(function(){
    //console.log('ready!');

    updateScreen();
    set_dates(relativeDay);
    
    console.log($(window).height());

    $('.btn-forward').click(function(){
        weeknumber++;
        if (weeknumber == 53) {
            weeknumber = 1;
            year++;
        }
        relativeDay = dateFns.subDays(relativeDay, -7);
        updateMaster();
    });

    $('.btn-back').click(function(){
        weeknumber--;
        if (weeknumber == 0) {
            weeknumber = 52;
            year--;
        }
        relativeDay = dateFns.subDays(relativeDay, 7);
        updateMaster();
    });
    console.log(window.location.hostname + '/info');
    $.ajax({
        dataType: "json",
        url: '/info',
        type: 'GET',
        success: function (data) {
            events = data;
            updateMaster();
        }
    });

    function updateMaster() {
        // Add static stuff
        updateScreen();
        set_dates(relativeDay);
        // Clear all events
        jQuery.each(eventDays, function() {
            $('.' + this).empty();
        })
        // Reset stage
        $('.cd-schedule').removeClass('js-full');
        // Add events again
        loadWeek(events, weeknumber, year);
        updateEvents();
    }
    
    
    function updateScreen() {
        $('.screen').html(year + ' uke: ' + weeknumber);
    }
    
    
    function loadWeek(dataset, wn, y) {
        jQuery.each(eventDays, function(key, eventDay){   
            jQuery.each(dataset, function(){
                if (this.ukedag == key && this.ukenummer == wn && this.aar == y) {
                    
    
                    
    
                    var start = getScheduleTimestamp(this.start_tid);
                    var slutt = getScheduleTimestamp(this.slutt_tid);
                    var durasjon = slutt - start;
    
                    var timelineStart = getScheduleTimestamp('08:00');
                    var timelineUnitDuration = getScheduleTimestamp('09:00') - getScheduleTimestamp('08:00');
                    var eventSlotHeight = $('ul.'+ eventDay).parent('li').children('.top-info').outerHeight();
    
                    var eventTop = (eventSlotHeight*(start - timelineStart)/timelineUnitDuration) - 1;
                    var eventHeight = eventSlotHeight*durasjon/timelineUnitDuration;
    
                    var eventString = [
                        '<li class="single-event ' + this.posisjon + '" data-start="' + this.start_tid + '" data-end="' + this.slutt_tid + '" data-content="' + this.beskrivelse + '" data-event="event-' + this.farge + '" style="top:' + eventTop + 'px; height:' + eventHeight +'px;">',
                        '<a href="#0"' + (this.varighet <= 1.5 ? 'class="mindre"' : '') + '>',
                        '<em ' + (this.varighet <= 1.5 ? 'class="event-name mindre" >' : 'class="event-name" >') + this.tittel + '</em>',
                        '</a>',
                        '</li>'
                    ];
    
                    $('ul.'+ eventDay).append(eventString.join(''));
    
                }
            })
        });
    
    }
    
    function updateEvents() {
        $.getScript("static/styles/js/main.js", function() {
            //console.log('hei');
            scheduleScript();
        })
    }
    
    function set_dates(date) {
        
        $('span.mon').html(get_date(date, 1));
        $('span.tue').html(get_date(date, 2));
        $('span.wed').html(get_date(date, 3));
        $('span.thu').html(get_date(date, 4));
        $('span.fri').html(get_date(date, 5));
        $('span.sat').html(get_date(date, 6));
        $('span.sun').html(get_date(date, 7));
    }
    
    
    
    function get_date(startDate, dayOfWeek) {
        var subAmount = (startDate.getDay()- dayOfWeek);
        var returnDate = dateFns.subDays(startDate, subAmount);
        return returnDate.getDate() + '.' + (returnDate.getMonth()+1);
    }
    
    function getScheduleTimestamp(time) {
        //accepts hh:mm format - convert hh:mm to timestamp
        time = time.replace(/ /g,'');
        var timeArray = time.split(':');
        var timeStamp = parseInt(timeArray[0])*60 + parseInt(timeArray[1]);
        return timeStamp;
    }
    



    
});


