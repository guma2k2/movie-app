$(document).ready(function() {
 $("button[id^='buy-ticket-btn']").each(function() {
   $(this).click(function(){
       movieId = $(this).attr("movieId") ;
       console.log(movieId) ;
       var dateList = '<ul id="date-list">';
        for (var i = 0; i < 10; i++) {
          var date = new Date(2023, 3 , 11);
          date.setDate(date.getDate() + i);
          var isActive = i === 0 ? 'active' : '';
          dateList += '<li class="day ' + isActive + '" data-date="' + date.toISOString().split('T')[0] + '">' + formatDate(date) + '</li>';
        }
        dateList += '</ul>';
        $('#date-selection').html(dateList);

        // list city by dayNow
        var date = new Date(2023, 3 , 11);
        var dateString = date.toISOString().slice(0,10);
        console.log(dateString);
        var cites = listCityByMovieAndDay(movieId , dateString) ;
        console.log(cites);
        var cinemas = [] ;
         var subs = [] ;

         // list cinema by city and dayNow ;
         if(cites.length > 0) {
            listFirstCityHTML(cites);
            $("#sub-list").show();
            $("#sub-selection").show();
            subs = listSubByMovieDayCity(movieId, dateString , cites[0].name);
            listFirstSubHtml(subs);
            cinemas = getCinemas(dateString, cites[0].name ,movieId , subs[0].name );
            listCinemaHtml(cinemas ,movieId , dateString , subs[0].name);

         } else {
            var message = "<div class = 'test-center' >Not schedule available</div>"
            $("#city-selection").html(message);
            $("#sub-list").html('');
            $("#sub-list").hide();
            $("#sub-selection").hide();
            $("#cinema-list").html('');
         }
        $('#date-list').on('click', '.day', function() {
           var loadingElement =  $("#loading")
           loadingElement.addClass("loading");
           $('#date-list .day.active').removeClass('active');
           var dateSelectedElement = $(this) ;
           setTimeout(function() {
               loadingElement.removeClass("loading");
               $('#date-list .day.active').removeClass('active');
               dateSelectedElement.addClass('active');
               var selectedDate = dateSelectedElement.data('date');
                console.log(selectedDate);
                cites.length = 0;
                cinemas.length = 0 ;
                subs.length = 0 ;
                cites = listCityByMovieAndDay(movieId , selectedDate);
                if(cites.length > 0) {
                     listFirstCityHTML(cites) ;
                     $("#sub-selection").show();
                     $("#sub-list").show();
                     subs = listSubByMovieDayCity(movieId, selectedDate , cites[0].name);
                     listFirstSubHtml(subs);
                     cinemas = getCinemas(selectedDate, cites[0].name , movieId , subs[0].name);
                     listCinemaHtml(cinemas , movieId , selectedDate , subs[0].name) ;
                 }else {
                      var message = "<div class = 'test-center' >Not schedule available</div>"
                      $("#city-selection").html(message);
                      $("#sub-selection").hide();
                      $("#sub-list").html('');
                      $("#cinema-list").html('');
                      $("#sub-list").hide();
                 }
           }, 700);

         });

          $('#city-selection').on('click', '.city-item', function() {
               var selectedDate = $('#date-list .day.active').data('date');
               $('#city-selection .city-item.active').removeClass('active');
               $(this).addClass('active');
               var selectedCity = $(this).data('city');
               console.log(selectedCity);
               cites.length = 0;
               cinemas.length = 0 ;
               subs.length = 0 ;
               cites = listCityByMovieAndDay(movieId , selectedDate);
               subs = listSubByMovieDayCity(movieId, selectedDate , selectedCity);
               listFirstSubHtml(subs);
               cinemas = getCinemas(selectedDate, selectedCity , movieId , subs[0].name);
               listCinemaHtml(cinemas , movieId , selectedDate , subs[0].name) ;
          });

          $('#sub-selection').on('click', '.sub-item', function() {
             var selectedDate = $('#date-list .day.active').data('date');
             var selectedCity = $('#city-list .city-item.active').data('city');
             $("#sub-list  .sub-item.active").removeClass('active');
             var selectedSub= $(this).data('sub');
             $(this).addClass('active');
             console.log(selectedSub)
             cinemas.length = 0 ;
             cinemas = getCinemas(selectedDate, selectedCity , movieId , selectedSub);
             listCinemaHtml(cinemas , movieId , selectedDate , selectedSub) ;
        });



       $('#ticket-modal').modal('show');
   });
  });

  function listFirstSubHtml(subs) {
     var subListHtml = '<ul id="sub-list" >'
     for(var i = 0 ; i < subs.length ;i++) {
        var isActive = i === 0 ? 'active' : '';
        subListHtml+= '<li class="sub-item '+ isActive +'" data-sub="'+subs[i].name+ '">'+subs[i].name +'</li>'
     }
     subListHtml+= '</ul>';
     $("#sub-selection").html(subListHtml) ;
  }

  function listFirstCityHTML(cites) {
     var cityListHtml = '<ul id="city-list">';
     for(var i = 0 ; i < cites.length ;i++) {
         var isActive = i === 0 ? 'active' : '';
         cityListHtml += '<li class="city-item '+ isActive + '" data-city="'+ cites[i].name  +'">' + cites[i].name  + '</li>';
     }
      cityListHtml += '</ul>';
        // Display the cinema list
      $('#city-selection').html(cityListHtml);
  }

  function listSubByMovieDayCity(movieId , day , cityName) {
     var subs = [] ;
     $.ajax({
         type: "GET",
         url:  baseUrl + "/api/v1/movies/events/sub/"+ day + "/" + cityName +"/" + movieId,
         success: function(response) {
           subs = response;
         },
         error: function(xhr, status, error) {
           console.log("Error: " + error);
         },
         async: false
       });
       console.log(subs);
     return subs;
  }

  function listCityByMovieAndDay(movieId , day) {
    var cites = [];
      $.ajax({
        type: "GET",
        url: baseUrl + "/api/v1/movies/cities/" + movieId + "/" + day,

        success: function(response) {
          cites = response;
        },
        error: function(xhr, status, error) {
          console.log("Error: " + error);
        },
        async: false
      });
      return cites;
  }

  function listEventHtml(events , cinemaName) {
     var eventsList = '<ul class = "event-list d-flex flex-column" >' ;
     eventsList+=cinemaName;
     eventsList+= '<div class="event-items d-flex" >'
     for(var i = 0 ; i < events.length ; i++) {
        eventsList+= '<a href ="/booking/'+ events[i].id +'" class= "event-item" ><li>'+ events[i].start_time  +'</li> </a>';
     }
     eventsList+= '</div>'
     eventsList+= '</ul>' ;
     return eventsList ;
  }

  function listCinemaHtml(cinemas , movieId , date , subType)
   {
       var cinemaListHtml = '<div id="cinema-items">';
       for(var i = 0 ; i < cinemas.length ;i++) {
           cinemaName =  '<span class="cinema-name " >' + cinemas[i].name + '</span>';
           cinemaName +=  '<span class="cinema-type " >' + cinemas[i].cinema_type + '</span>';
           var events = getEvents( date, cinemas[i].name ,movieId, subType );
           cinemaListHtml += listEventHtml(events , cinemaName );
       }
        cinemaListHtml += '</div>';
          // Display the cinema list
        $('#cinema-list').html(cinemaListHtml);
  }

  function getEvents(date , cinemaName , movieId, subType) {
     var url = baseUrl + '/api/v1/movies/events/' + date + '/' + cinemaName + '/' + movieId + "/" + subType;
         console.log(url);
         var events = [];
         $.ajax({
           url: url,
           method: 'GET',
           success: function(data) {
             events = data;
           },
           async: false // Make the request synchronous
         });
         return events;
  }

  function getCinemas(date, cityName, movieId , subType) {
    var url = baseUrl + '/api/v1/movies/cinemas/' + date + '/' + cityName + '/' + movieId + '/' + subType;
    console.log(url);
    var cinemas = [];
    $.ajax({
      url: url,
      method: 'GET',
      success: function(data) {
        cinemas = data;
      },
      async: false // Make the request synchronous
    });
    return cinemas;
  }

  function formatDate(date) {
      var mm = (date.getMonth() + 1).toString().padStart(2, '0'); // add leading zero if needed
      var dd = (date.getDate() - 1).toString().padStart(2, '0'); // add leading zero if needed
      var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
         // Get the day of the week as a number (0-6)
      var dayOfWeekNum = date.getDay();

         // Get the name of the day of the week
      var dayOfWeekName = daysOfWeek[dayOfWeekNum];
      var dayHtml = '<span>'+ dayOfWeekName+'</span> <em>'+ mm+'</em> <strong>'+ dd+'</strong>';
      return dayHtml;
  }
});
