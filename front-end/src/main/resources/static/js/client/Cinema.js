$(document).ready(function() {
   var cinemas = [];
   $("[id^='city']").click(function() {
      $(".theater-wrap").html('');
      $(".cgv-schedule").hide();
      $("[id^='city']").removeClass('siteactive');
      $(this).addClass('siteactive');
      var cityId = $(this).data("id");
      console.log(cityId);
      cinemas = getCinemasByCity(cityId);
      console.log(cinemas);
      listCinemasHtml(cinemas);
   });
   $('ul').on('click', 'li[id^="cinema"]', function() {
         var cinemaId = $(this).data("id");
    //     console.log(cinemaName);
         $(".cgv-schedule").show();

         $(this).addClass('current');
         $(this).siblings().removeClass('current');
         var cinema = findById(cinemaId);
    //     console.log(cinema) ;
         theaterHeadHtml(cinema);
         var dateList = '<ul id="date-list">';
         for (var i = 0; i < 10; i++) {
           var date = new Date(2023, 3 , 11);
           date.setDate(date.getDate() + i);
           var isActive = i === 0 ? 'active' : '';
           dateList += '<li class="day ' + isActive + '" data-date="' + date.toISOString().split('T')[0] + '">' + formatDate(date) + '</li>';
     }
     dateList += '</ul>';
     $('#date-selection').html(dateList);
     var date = new Date(2023, 3 , 11);
     var dateString = date.toISOString().slice(0,10);

     var filmList = getFilmByDateCinema(cinemaId, dateString) ;

     if(filmList != null ){
        filmListHtml(filmList) ;
     } else{
        var message = "<div class = 'test-center' >Not schedule available</div>"
        $(".cgv-showtimes").html(message);
     }
     $('#date-list').on('click', '.day', function() {
        $('#date-list .day.active').removeClass('active');
        $(this).addClass('active');
        $(".cgv-schedule").show();
        var selectedDate = $(this).data('date');
        filmList = getFilmByDateCinema(cinemaId, selectedDate) ;
        if(filmList != null) {
             filmListHtml(filmList) ;
         }else {
              var message = "<div class = 'test-center' >Not schedule available</div>"
              $(".cgv-showtimes").html(message);
         }
      });

   });

  function filmListHtml(filmList) {
        var filmHtml = '';
        $.each(filmList, function(movieKey, subtitleMap) {
          var id = movieKey.substring(movieKey.indexOf("id=")+3, movieKey.indexOf(", title="));
          var title = movieKey.substring(movieKey.indexOf("title='")+7, movieKey.indexOf("', poster_url="));
          var poster_url = movieKey.substring(movieKey.indexOf("poster_url='")+12, movieKey.indexOf("'}"));
          var movie = { id: id, title: title, poster_url: poster_url };

          filmHtml += '<div class="film-list" >';
          filmHtml+= `<div class="film-label" >
                                <h3>
                                  <a href="/movie/${movie.id}" >${movie.title}</a>
                                  <span class="rating-icon" >C18</span>
                                </h3>
                              </div>`;
          filmHtml+= `<div class="film-left">
                                <div class="film-poster">
                                  <a>
                                    <img src="${movie.poster_url}" style="display: block; border: 0 ; width:182px; height:260px;"  />
                                  </a>
                                </div>
                              </div>`;
          filmHtml+='<div class="film-right">';

          $.each(subtitleMap, function(subtitleKey, eventList) {
            var subtitle = {};
            subtitleKey.substring(subtitleKey.indexOf("(") + 1, subtitleKey.indexOf(")")).split(", ").forEach(function(item) {
              var parts = item.split("=");
              subtitle[parts[0]] = parts[1].replace(/'/g, "");
            });
            filmHtml+= `<strong class="film-screen std pl-1" style="font-weight: bold;" >${subtitle.name}</strong>`;
            filmHtml+='<div class="film-showtimes" >';
            filmHtml+= '<ul class="event-items d-flex " >';
            $.each(eventList, function(index, event) {
                filmHtml+=`<li class="event-item" >
                                <a href="/booking/${event.id}" >
                                    <span>${event.start_time}</span>
                                </a>
                            </li>`;
            });
            filmHtml+='</ul>' ;
            filmHtml+='</div>' ;
          });

            filmHtml+='</div>' ;
            filmHtml+='</div>' ;
    });

    $(".cgv-showtimes").html(filmHtml);
  }

  function getCinemasByCity(cityId) {
        var cinemas = [];
        var url = baseUrl + "/api/v1/movies/cinemas/find/city/" + cityId;
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
  function findById(cinemaId) {
    var cinema;
    var url = baseUrl + "/api/v1/movies/cinemas/" + cinemaId;
      $.ajax({
        url: url,
        method: 'GET',
        success: function(data) {
          cinema = data;
        },
        async: false // Make the request synchronous
      });
      return cinema;
  }
  function theaterHeadHtml(cinema) {
     var images = cinema.images ;
     console.log(images);
     var imagesLength = images.length;
     var imagesHtml = `<div id="carouselExampleControls" class="carousel slide" data-ride="carousel" style="width:950px;object-fit:cover;" >
                         <div class="carousel-inner">
                           <div class="carousel-item active">
                             <img class="d-block w-100" src="${cinema.photosImagePath}" alt="First slide">
                           </div>` ;
     if(imagesLength > 0) {
        for (var i = 0 ; i < imagesLength ;i++ ) {
            var image = images[i];
            imagesHtml+= `<div class="carousel-item">
                                <img class="d-block w-100" src="${image.extraImagePath}" alt="Second slide">
                              </div>` ;
        }
     }
     imagesHtml+= '</div>' +
                     '<a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">' +
                       '<span class="carousel-control-prev-icon" aria-hidden="true"></span>' +
                       '<span class="sr-only">Previous</span>' +
                     '</a>' +
                     '<a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">' +
                       '<span class="carousel-control-next-icon" aria-hidden="true"></span>' +
                       '<span class="sr-only">Next</span>' +
                     '</a>' +
                   '</div>';
     var html = `<div class="heater-head" >
                       <div class="home-title" >
                         <h3>Rạp</h3>
                       </div>
                       <div class="page-title theater-title" >
                         <h3>${cinema.name}</h3>
                       </div>
                     </div>
                     <div class="theater-gallery" >
                       <div class="theater-thumb-image"  >
                         ${imagesHtml}
                       </div>
                       <div class="theater-information"  >
                         <div class="left-info-theater" >
                           <div class="theater-left-content" >
                             <div class="theater-address" style="font:11px; color: #fdfcf0;" >${cinema.address}</div>
                             <div class="fax d-flex">
                               <label style="font-size: 13px; font-weight:600;" >Fax: </label>
                               <div class="fax-input ml-3" style="inline;" >+84 4 6 275 5240</div>
                             </div>
                             <div class="hotline d-flex ">
                               <label style="font-size: 13px; font-weight:600;" >Hotline: </label>
                               <div class="fax-input ml-3 " style="inline;" >${cinema.phone_number}</div>
                             </div>
                           </div>
                         </div>
                         <div class="right-info-theater" >
                           <div class="theater-right-content">
                             <div class="location" >
                               <a href="#" >Xem bản đồ</a>
                             </div>
                             <div class="contact-us">
                               <a href="#" >Liên hệ CGV</a>
                             </div>
                           </div>
                         </div>
                       </div>
                     </div>`;

                     $(".theater-wrap").html(html);
  }
  function getFilmByDateCinema(cinemaId , date) {
        var films ;
        var url = baseUrl + "/api/v1/movies/events/cinemas/"+cinemaId+"/" + date;
          $.ajax({
            url: url,
            method: 'GET',
            success: function(data) {
              films = data;
            },
            async: false // Make the request synchronous
          });
          return films;
  }
  function listCinemasHtml(cinemas) {
        var html = '' ;
        for(var i = 0 ; i < cinemas.length ; i++) {
            html+='<li id="cinema'+cinemas[i].id+'" data-id="'+cinemas[i].id+'" data-name="'+cinemas[i].name+'" ><span>'+cinemas[i].name+'</span></li>';
        }
          $("#cinema-list").html(html);
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
})