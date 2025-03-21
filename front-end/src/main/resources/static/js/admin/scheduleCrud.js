$(document).ready(function () {
   $(".item.active").removeClass("active");
   $(".item.schedule").addClass("active");
   $(".sub-btn .schedule").next(".sub-menu").slideToggle();
   $(".sub-btn .schedule").find(".dropdown").addClass("rotate");
   $(".sub-menu").removeClass("active");
   $(".sub-menu .schedule").addClass("active");
   var jwt = $("input[name='token']").val() ;
   var citySelected = $("#city-list").val() ;
   var cinemas = getCinemaByCity(citySelected) ;
   if(cinemas.length > 0){
      listCinemaHtml(cinemas) ;
      listRoomHtml(cinemas[0].name , jwt) ;
   }


   $("#city-list").on('change' , function() {
        var selectedCityId = $(this).val() ;
        $("#cinema-list").empty() ;
        var cinemas = getCinemaByCity(selectedCityId) ;
        $("#room-list").empty() ;
        if(cinemas.length > 0){
          listCinemaHtml(cinemas) ;
          listRoomHtml(cinemas[0].name , jwt) ;
        }
   });
   $("#cinema-list").on('change', function() {
        var selectedCinema = $(this).val() ;
        $("#room-list").empty() ;
        listRoomHtml(selectedCinema , jwt) ;
   })
   $("#buttonSearch").click(function() {
        var selectedRoom = $("#room-list").val();
        var selectedDate = $("#date").val() ;
//        console.log(selectedDate);
        listEventHtml(selectedRoom , selectedDate , jwt) ;
        $("table").on("click", ".fas.fa-trash", function() {
          var eventId = $(this).data("id");
          handleDeleteEvent(eventId , jwt);
          $('tr[data-id="' + eventId + '"]').remove();
        });
        $("table").on("click" , ".fas.fa-edit" , function() {
           var eventId = $(this).data("id");
           handleUpdateEvent(eventId,jwt) ;

        });
   });

   function handleUpdateEvent(eventId, jwt) {
        getEventById(eventId, jwt)
            .then(function(event){
               $(".add-content").empty() ;
               var html = '' ;
                html+= `
                <div class="cancel"  style="cursor:pointer; top:0; right:0; position:absolute; margin-bottom:10px; ">
                    <i class="fas fa-times fa-2x"></i>
                </div>
                <div class="text-center" >
                     <h2>Update Event id : ${event.id}</h2>
                </div>
                <div class="row" >
                    <div class="col-6" style="margin-top: 10px ; margin-bottom: 10px; margin-top : 30px; " >
                        <div class="row" >
                            <label class="col-4" >Room Id</label>
                            <input class="col-8" name="roomId" value="${event.room.id}" type="text"  readonly />
                        </div>
                    </div>
                    <div class="col-6" style="margin-top: 10px ; margin-bottom: 10px; margin-top : 30px; " >
                        <div class="row" >
                            <label class="col-4" >Start Date</label>
                            <input class="col-8" name="startDate" value="${event.start_date}" type="text"  readonly />
                        </div>
                    </div>
                    <div class="col-6" style="margin-top: 10px ; margin-bottom: 10px;" >
                        <div class="row" >
                            <label class="col-4" >Search Movie</label>
                            <input id ="keyword"  class="col-8" name="movie" value="" type="text" required  />
                        </div>
                    </div>
                    <div class="col-6" style="margin-top: 10px ; margin-bottom: 10px;" >
                        <div class="row" >
                            <label class="col-4" >Select startTime</label>
                            <input class="col-8" name="startTime" value="${event.start_time}" type="time" required min="08:00" max="23:30" />
                        </div>
                    </div>
                    <div class="col-6" style="margin-top: 10px ; margin-bottom: 10px;" >
                        <div class="row" >
                            <label class="col-4" >Select Movie</label>
                            <select class="col-8" id="movie-list">
                            </select>
                        </div>
                    </div>
                    <div class="col-6" style="margin-top: 10px ; margin-bottom: 10px;" >
                        <div class="row" >
                            <label class="col-4" >Select subType</label>
                            <select class="col-8" id="sub-list">
                            </select>
                        </div>
                    </div>
                    <div class="col-6" style="margin-top: 10px; margin-bottom: 10px;">
                        <div class="row">
                            <label class="col-4" for="price">Select price</label>
                            <div class="col-8 d-flex align-items-center">
                                <input id="price" min="1" name="price" value="${event.price}" 
                                       type="number" required placeholder="EX: 4,000,000" 
                                       class="form-control" style="padding-right: 50px;">
                                <span class="ms-2 fw-bold">VND</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="btn btn-primary updateEvent" style="margin-bottom:10px;" >Update</div>`;
                $(".add-content").html(html) ;
                $(".cancel").click(function() {
                    $(".add-content").empty() ;
                })
                var eventId = event.id;

                $(".updateEvent").click(function() {
                    var startTime = formatTime($("input[name='startTime']").val()) ;
                    var roomId = $("input[name='roomId']").val() ;
                    var movieId = $("#movie-list").val() ;
                    var startDate = $("input[name='startDate']").val() ;
                    var startTime = $("input[name='startTime']").val() ;
                    var subType = $("#sub-list").val() ;
                    var price = $("input[name='price']").val() ;
                    var event = {
                        room : {
                           id : roomId
                        },
                        movie : {
                            id : movieId
                        },
                        subtitleType : {
                            id : subType
                        },
                        start_date : startDate,
                        start_time : startTime,
                        price: price
                    }
                    updateEvent(event , jwt , eventId) ;
                })
                var movieId = event.movie.id ;
                var subTypeId = event.subtitleType.id;
                getAllMovie(movieId) ;
                getAllSubType(jwt , subTypeId);

            })
            .catch(function(error) {
                console.log("Error get event: " + error.response);
            });
   }
   function updateEvent(event , jwt , eventId) {
        updateEventDb(event, jwt, eventId)
            .then(function(event) {
              var row = $('table tr[data-id="' + eventId + '"]');
              row.find('td:eq(1)').text(event.movie.title);
              row.find('td:eq(2)').text(event.startTime);
              row.find('td:eq(3)').text(event.endTime);
              alert("update successful") ;
              $(".add-content").empty() ;
            })
            .catch(function(error){
                console.log(error) ;
                if (error.responseJSON) {
                  alert(error.responseJSON.message);
                } else {
                  alert("An error occurred.");
                }
            })
   }
   function updateEventDb(event , jwt , eventId) {
          var headers = { "Authorization": "Bearer " + jwt };
          var url = baseUrl +  "/api/v1/admin/event/update/" + eventId ;
           return new Promise(function(resolve, reject) {
             $.ajax({
               type: "PUT",
               contentType: "application/json",
               url: url,
               headers: headers,
               data: JSON.stringify(event),
               dataType: 'json',
               success: function(data) {
                 resolve(data);
               },
                error: function(jqXHR, textStatus, errorThrown) {
                 reject(jqXHR);
                }
             });
           });
   }
   function getAllSubType(jwt , subTypeId) {
        getSubType(jwt)
            .then(function(types){
                console.log(types);
                $.each(types, function(index, type) {
                   $("#sub-list").append(`<option value="${type.id}">${type.name}</option>`);
                 });
                $("#sub-list").val(subTypeId) ;
            })
            .catch(function(error) {
                console.log("Error get event: " + error.response);
             });
   }
   function getAllMovie(movieId) {
        $.ajax({
          url: baseUrl + "/api/v1/movies",
          method: "GET",
          success: function(data) {
            // Loop through the movie data and append each option to the select element
            $.each(data, function(index, movie) {
//              console.log(movie.id);
              $('#movie-list').append('<option value="' + movie.id + '">' + movie.title + '</option>');
            });

            // Set the selected value to the first option
            console.log(movieId) ;
            $('#movie-list').val(movieId);
          },
          error: function(xhr, textStatus, errorThrown) {
            console.log("Error fetching movie data: " + errorThrown);
          }
        });
   }
   function getEventById(eventId, jwt) {
        var headers = { "Authorization": "Bearer " + jwt };
        var url = baseUrl + "/api/v1/movies/events/booking/" + eventId ;
        return new Promise(function(resolve, reject) {
           $.ajax({
             type: "GET",
             contentType: "application/json",
             url: url,
             headers: headers,
             success: function(data) {
               resolve(data);
             },
             error: function(jqXHR, textStatus, errorThrown) {
               reject(errorThrown);
             }
           });
         });
   }
   $(".cancel").click(function() {
       console.log("empty");
       $(".add-content").html('');
   })
   $(".addAction").click(function() {
        var roomId = $("#room-list").val() ;
        var date = $("#date").val() ;
        var html = '' ;
        if(roomId !== '' && date !== '') {
            html+= `<div class="text-center" >
                             <h2>Add Event</h2>
                        </div>
                        <div class="cancel"  style="cursor:pointer; top:0; right:0; position:absolute; margin-bottom:10px; ">
                            <i class="fas fa-times fa-2x"></i>
                        </div>
                        <div class="row" >
                            <div class="col-6" style="margin-top: 10px ; margin-bottom: 10px; margin-top : 30px; " >
                                <div class="row" >
                                    <label class="col-4" >Room Id</label>
                                    <input class="col-8" name="roomId" value="${roomId}" type="text"  readonly />
                                </div>
                            </div>
                            <div class="col-6" style="margin-top: 10px ; margin-bottom: 10px; margin-top : 30px; " >
                                <div class="row" >
                                    <label class="col-4" >Start Date</label>
                                    <input class="col-8" name="startDate" value="${date}" type="text"  readonly />
                                </div>
                            </div>
                            <div class="col-6" style="margin-top: 10px ; margin-bottom: 10px;" >
                                <div class="row" >
                                    <label class="col-4" >Search Movie</label>
                                    <input id ="keyword"  class="col-8" name="movie" value="" type="text" required placeholder="Search movie by title" />
                                </div>
                            </div>
                            <div class="col-6" style="margin-top: 10px ; margin-bottom: 10px;" >
                                <div class="row" >
                                    <label class="col-4" >Select startTime</label>
                                    <input class="col-8" name="startTime" value="" type="time" required min="08:00" max="23:30" />
                                </div>
                            </div>
                            <div class="col-6" style="margin-top: 10px ; margin-bottom: 10px;" >
                                <div class="row" >
                                    <label class="col-4" >Select Movie</label>
                                    <select class="col-8" id="movie-list"></select>
                                </div>
                            </div>
                            <div class="col-6" style="margin-top: 10px ; margin-bottom: 10px;" >
                                <div class="row" >
                                    <label class="col-4" >Select subType</label>
                                    <select class="col-8" id="sub-list"></select>
                                </div>
                            </div>
                            <div class="col-6" style="margin-top: 10px ; margin-bottom: 10px;" >
                                <div class="row" >
                                    <label class="col-4" >Select price</label>
                                    <input class="col-8" name="price"  value="" type="number" required placeholder="EX : 4000000" />
                                </div>
                            </div>
                        </div>
                        <div class="btn btn-primary addEvent" style="margin-bottom:10px;" >Xac nhan</div>`
                        $(".add-content").html(html) ;
            listSubTypeHtml(jwt) ;
            $("#keyword").on('input', function() {
                $('#movie-list').empty() ;
                var keyword = $(this).val();
                if(keyword != "") {
                    listMovieHtml(keyword , jwt) ;
                }
            });
            $(".cancel").click(function() {
               console.log("empty");
               $(".add-content").html('');
            })
            $(".addEvent").click(function(){
                var startTime = formatTime($("input[name='startTime']").val()) ;
                var roomId = $("input[name='roomId']").val() ;
                var movieId = $("#movie-list").val() ;
                var startDate = $("input[name='startDate']").val() ;
                var startTime = $("input[name='startTime']").val() ;
                var subType = $("#sub-list").val() ;
                var price = $("input[name='price']").val() ;
                if (price === '' || startTime === '' || movieId === '') {
                    alert("Please complete all input");
                } else {
                    var event = {
                        room : {
                           id : roomId
                        },
                        movie : {
                            id : movieId
                        },
                        subtitleType : {
                            id : subType
                        },
                        start_date : startDate,
                        start_time : startTime,
                        price: price
                    }
                    addEventToTable(event , jwt) ;
                }

            });
        }else {
           alert("vui long chon cac thong tin ngay ");
        }

   })
   function addEventToTable(event , jwt) {
        saveEvent(event , jwt)
            .then(function(event){
                console.log(event);
                var html=`<tr data-id="${event.id}" >
                    <td>${event.id}</td>
                    <td>${event.movie.title}</td>
                    <td>${event.startTime}</td>
                    <td>${event.endTime}</td>
                    <td>
                        <a data-id="${event.id}"  class="fas fa-edit edit"  href="#" style="color: #1b1918;"  ></a>
                        <a data-id="${event.id}" class="fas fa-trash delete"  href="#" style="color: #1b1918;" ></a>
                    </td>
                 </tr>` ;
                $(".table-body").append(html) ;
                alert("successful");
                $('.add-content').empty();
            })
            .catch(function(error) {
                console.log(error);
                if(error.responseJSON){
                    alert(error.responseJSON.message);
                } else {
                    alert("An error was occur");
                }
            });
   }

   function handleDeleteEvent(eventId , jwt) {
        deleteEventById(eventId, jwt)
            .then(function(){
            alert("Delete successful") ;
        })
        .catch(function(error) {
            console.log("Error get event: " + error);
         });
   }

   function deleteEventById(eventId , jwt) {
          var headers = { "Authorization": "Bearer " + jwt };
          var url = baseUrl + "/api/v1/admin/event/delete/" + eventId ;
                return new Promise(function(resolve, reject) {
                  $.ajax({
                    type: "DELETE",
                    url: url,
                    headers: headers,
                    success: function(data) {
                      resolve(data);
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                      reject(jqXHR);
                    }
                  });
                });
   }

   function saveEvent(event, jwt) {
      var headers = { "Authorization": "Bearer " + jwt };
      var url =  baseUrl + "/api/v1/admin/event/save";
      return new Promise(function(resolve, reject) {
        $.ajax({
          type: "POST",
          contentType: "application/json",
          url: url,
          headers: headers,
          data: JSON.stringify(event),
          dataType: 'json',
          success: function(data) {
            resolve(data);
          },
          error: function(jqXHR, textStatus, errorThrown) {
            reject(jqXHR);
          }
        });
      });
   }

   function listSubTypeHtml(jwt) {
        getSubType(jwt)
            .then(function(types){
                console.log(types);
                $.each(types, function(index, type) {
                   $("#sub-list").append(`<option value="${type.id}">${type.name}</option>`);
                 });
            })
            .catch(function(error) {
                console.log("Error get event: " + error);
             });
   }

   function getSubType(jwt) {
         var headers = { "Authorization": "Bearer " + jwt };
         var url = baseUrl + "/api/v1/admin/event/subtype" ;
         return new Promise(function(resolve, reject) {
           $.ajax({
             type: "GET",
             contentType: "application/json",
             url: url,
             headers: headers,
             success: function(data) {
               resolve(data);
             },
             error: function(jqXHR, textStatus, errorThrown) {
               reject(errorThrown);
             }
           });
         });
   }

   function listMovieHtml(keyword , jwt ) {
        getMovieByKeyWord(keyword , jwt)
            .then(function(movies){
                console.log(movies);
                $.each(movies, function(index, movie) {
                   $('#movie-list').append(`<option value="${movie.id}">${movie.title}</option>`);
                 });
            })
            .catch(function(error) {
                    console.log(error) ;
                   if (error.responseJSON) {
                     alert(error.responseJSON.message);
                   } else {
                     alert("An error occurred.");
                   }
             });
   }

   function getMovieByKeyWord(keyword , jwt) {
         var headers = { "Authorization": "Bearer " + jwt };
         var url = baseUrl + "/api/v1/admin/movie/find/" + keyword;
         return new Promise(function(resolve, reject) {
           $.ajax({
             type: "GET",
             contentType: "application/json",
             url: url,
             headers: headers,
             success: function(data) {
               resolve(data);
             },
             error: function(jqXHR, textStatus, errorThrown) {
               reject(errorThrown);
             }
           });
         });
   }

   function listEventHtml(selectedRoom,selectedDate, jwt ) {
        findEventByRoomDate(selectedRoom,selectedDate, jwt )
          .then(function(events) {
                if(events.length > 0) {
                    $(".table-body").empty() ;
                    var html = '';
                    $.each(events, function(index, event) {
                        html+=`<tr data-id="${event.id}" >
                                <td>${event.id}</td>
                                <td>${event.movie.title}</td>
                                <td>${event.startTime}</td>
                                <td>${event.endTime}</td>
                                <td>
                                    <a data-id="${event.id}"  class="fas fa-edit edit"  href="#" style="color: #1b1918;"  ></a>
                                    <a data-id="${event.id}" class="fas fa-trash delete"  href="#" style="color: #1b1918;" ></a>
                                </td>
                             </tr>`
                    });
                    $(".table-body").append(html) ;
                }else {
                    $(".table-body").html('') ;
                    alert("no event available") ;
                }
          })
          .catch(function(error) {
                console.log(error) ;
               if (error.responseJSON) {
                 alert(error.responseJSON.message);
               } else {
                 alert("An error occurred.");
               }
          });
   }

   function formatTime(time) {
     const [hours, minutes] = time.split(":");
     const date = new Date();
     date.setHours(hours);
     date.setMinutes(minutes);
     return date.toLocaleString("en-US", {
       hour: "numeric",
       minute: "numeric",
       hour12: true,
     });
   }

   function findEventByRoomDate(roomId , date, jwt) {
         var headers = { "Authorization": "Bearer " + jwt };
         var url = baseUrl + "/api/v1/admin/event/find/"+roomId + "/" + date ;
         return new Promise(function(resolve, reject) {
           $.ajax({
             type: "GET",
             contentType: "application/json",
             url: url,
             headers: headers,
             success: function(data) {
               resolve(data);
             },
             error: function(jqXHR, textStatus, errorThrown) {
               reject(errorThrown);
             }
           });
         });
   }

   function getCinemaByCity(cityId) {
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

   function listCinemaHtml(cinemas) {
     $.each(cinemas, function(index, cinema) {
       $('#cinema-list').append(`<option value="${cinema.name}">${cinema.name}</option>`);
     });
   }

   function getRoomByCinema(cinemaName, jwt) {
         var headers = { "Authorization": "Bearer " + jwt };
         var url = baseUrl + "/api/v1/admin/room/cinema/" + cinemaName;
         return new Promise(function(resolve, reject) {
           $.ajax({
             type: "GET",
             contentType: "application/json",
             url: url,
             headers: headers,
             success: function(data) {
               resolve(data);
             },
             error: function(jqXHR, textStatus, errorThrown) {
               reject(errorThrown);
             }
           });
         });
       }

   function listRoomHtml(cinemaName , jwt) {
        getRoomByCinema(cinemaName , jwt)
          .then(function(rooms) {
//                console.log(rooms);
                $.each(rooms, function(index, room) {
                   $('#room-list').append(`<option value="${room.id}">${room.name}</option>`);
                });
          })
          .catch(function(error) {
            console.log("Error saving seat: " + error);
          });

   }
});