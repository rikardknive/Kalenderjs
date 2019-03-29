$(document).ready(function(){
    //console.log('ready!');

    var isMobile = false; //initiate as false
    // device detection
    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
        isMobile = true;
    }

    //console.log(isMobile);

    var today = new Date()
    var weeknumber = dateFns.getISOWeek(today);
    var year = today.getFullYear();
    var relativeDay = today;
    
    var events = {}
    var eventDays = ['monday-events', 'tuesday-events', 'wednesday-events', 'thursday-events', 'friday-events', 'saturday-events', 'sunday-events'];

    updateScreen();
    set_dates(relativeDay);
    
    //console.log($(window).height());

    console.log(window.location.pathname);
    $('a[href$="'+ window.location.pathname +'"]').parent().addClass('active')

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
    //console.log(window.location.pathname + '/info');
    var url = window.location.pathname + '/info';
    
    $.ajax({
        dataType: "json",
        url: url,
        type: 'GET',
        success: function (data) {
            events = data;
            //console.log(data)
            updateMaster();
        }
    });

    function updateMaster() {
        // Add static stuff
        updateScreen();
        set_dates(relativeDay);
        // Clear all events
        jQuery.each(eventDays, function() {
            //$('.' + this).children('a').off();
            $('.' + this).empty();
        })
        // Reset stage
        $('.cd-schedule').removeClass('js-full');
        // Add events again
        loadWeek(events, weeknumber, year);
        
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
                    
                    var multi = 1;
                   
                   

                    
                    if (isMobile) {
                        if (durasjon <= getScheduleTimestamp('01:50')) {
                            multi = 2;
                        }
                    }
                    var eventTop = (eventSlotHeight*(start - timelineStart)/timelineUnitDuration) - 1;
                    var eventHeight = (eventSlotHeight*durasjon/timelineUnitDuration) * multi;
    
                    var eventString = [
                        '<li class="single-event ' + this.posisjon + '" pos="' + this.posisjon +'" data-start="' + this.start_tid + '" data-end="' + this.slutt_tid + '" data-content="' + this.beskrivelse + '" data-event="event-' + this.farge + '" style="top:' + eventTop + 'px; height:' + eventHeight +'px;">',
                        '<a ' + (this.varighet <= 1.5 ? 'class="mindre"' : '') + '>',
                        '<em ' + (this.varighet <= 1.5 ? 'class="event-name mindre" >' : 'class="event-name" >') + this.tittel + '</em>',
                        '</a>',
                        '</li>'
                    ];
    
                    $('ul.'+ eventDay).append(eventString.join(''));
    
                }
            })
        });
        
        $.getScript("static/styles/js/main.js");

        
    
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


/*

todo:
Remove loading tag after load
Flytt over durationlabel

*/