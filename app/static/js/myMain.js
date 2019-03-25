var weeknumber = 3;
var year = 2019;

var events = {}
var eventDays = ['monday-events', 'tuesday-events', 'wednesday-events', 'thursday-events', 'friday-events', 'saturday-events', 'sunday-events'];



$(document).ready(function(){
    console.log('ready!');
    set_dates()

    $('#btn-forward').click(function(){
        jQuery.each(eventDays, function() {
            $('.' + this).empty();
        })

        weeknumber++;
        loadWeek(events, weeknumber, year);
    });

    $('#btn-back').click(function(){
        jQuery.each(eventDays, function() {
            $('.' + this).empty();
        })

        weeknumber--;
        loadWeek(events, weeknumber, year);
    });

    


    

    //$('.subtitle').html('Dette blir morro!');

   

    $.ajax({
        dataType: "json",
        url: '/info',
        type: 'GET',
        success: function (data) {

            events = data;
            console.log('Ferdig med å laste inn data')
            loadWeek(data, 3, 2019);
            /*
            var i = 0;
            jQuery.each(eventDays, function(key, eventDay){
                
                jQuery.each(data, function(){

                   
                    
                    if (this.ukedag == key && this.ukenummer == weeknumber && this.aar == year) {
                        var eventString = [
                            '<li class="single-event ' + this.posisjon + '" data-start="' + this.start_tid + '" data-end="' + this.slutt_tid + '" data-content="' + this.beskrivelse + '" data-event="event-' + this.farge + '">',
                            '<a href="#0"' + (this.varighet <= 1.5 ? 'class="mindre"' : '') + '>',
                            '<em ' + (this.varighet <= 1.5 ? 'class="event-name mindre" >' : 'class="event-name" >') + this.tittel + '</em>',
                            '</a>',
                            '</li>'
                        ]
                       
                        
                        $('ul.'+eventDay).append(eventString.join(''));
                    }
                    
                    
                    i++;
                })
                //console.log(this);
            });
            
            */
        }
    });

   


function loadWeek(dataset, wn, y) {
    jQuery.each(eventDays, function(key, eventDay){
        
        jQuery.each(dataset, function(){

            if (this.ukedag == key && this.ukenummer == wn && this.aar == y) {
                var eventString = [
                    '<li class="single-event ' + this.posisjon + '" data-start="' + this.start_tid + '" data-end="' + this.slutt_tid + '" data-content="' + this.beskrivelse + '" data-event="event-' + this.farge + '">',
                    '<a href="#0"' + (this.varighet <= 1.5 ? 'class="mindre"' : '') + '>',
                    '<em ' + (this.varighet <= 1.5 ? 'class="event-name mindre" >' : 'class="event-name" >') + this.tittel + '</em>',
                    '</a>',
                    '</li>'
                ]
               
                
                $('ul.'+eventDay).append(eventString.join(''));
            }
            
            
            //i++;
        })
        //console.log(this);
    });

    $.getScript("../styles/js/main.js", function() {
        scheduleScript();
    })
    //scheduleScript();
}


    


});

function set_dates() {

    //console.log(d.setDate(d.getDate()-2))
    /*
    var monday = get_date(1);//(dayOfWeek - 1);
    var tuesday = day - (dayOfWeek - 2);
    var wednsday = day - (dayOfWeek - 3);
    var thursday = day - (dayOfWeek - 4);
    var friday = day - (dayOfWeek - 5);
    var saturday = day - (dayOfWeek - 6);
    var sunday = day - (dayOfWeek - 7);
    */

    var startDate = new Date()

    
    //console.log(dateFns.getISOWeek(new Date()));
    //console.log();



    $('span.mon').html(get_date(startDate, 1));
    $('span.tue').html(get_date(startDate, 2));
    $('span.wed').html(get_date(startDate, 3));
    $('span.thu').html(get_date(startDate, 4));
    $('span.fri').html(get_date(startDate, 5));
    $('span.sat').html(get_date(startDate, 6));
    $('span.sun').html(get_date(startDate, 7));
    //console.log(monday)
}



function get_date(startDate, dayOfWeek) {
    var subAmount = (startDate.getDay()- dayOfWeek);
    var returnDate = dateFns.subDays(startDate, subAmount);
    return returnDate.getDate() + '.' + (returnDate.getMonth()+1);
}


