$(document).ready(function () {
    $(".item.active").removeClass("active");
    $(".item.room").addClass("active");
    var columnNumber = $("input[name='column-number']");
    var rowNumber = $("input[name='row-number']");
    var seatName = $("input[name='seatName']");
    var roomId = $("input[name='roomId']").val();
    var jwt = $("input[name='token']").val() ;
    var sortDir ;
    var sortField ;
    var prevButton = $("ul.pagination li:first-child");
    var nextButton = $("ul.pagination li:last-child");
    var totalPage = $("input[name='totalPage']").val() ;
    var page = $(".page-item.active").data("page");
    var cityId = $("input[name='cityId']").val();
    var cinName = $("input[name='cinemaName']").val();
    var turnBack = false ;
    if(cityId && cinName) {
        console.log(cityId);
        console.log(cinName);
        $("#city-list").val(cityId);
        handleGetCinemaByCity(cityId, jwt) ;
        turnBack = true ;

    }
    if(page == 1) {
        prevButton.hide() ;
    }else if(page == totalPage) {
        nextButton.hide();
    }else {
        prevButton.show() ;
        nextButton.show();
    }
    $("#city-list").on("change" ,function() {
        var cityId = $(this).val() ;
        console.log(cityId) ;
        if(cityId === 'all') {
            console.log(sortField) ;
            console.log(sortDir) ;
            console.log(page) ;
            $(".pagination").show() ;
            sortDir = "desc" ;
            sortField = "id" ;
            $("input[name='cinemaName']").val('');
            handlePaginate(page, sortDir, sortField , jwt );
        } else {
            handleGetCinemaByCity(cityId, jwt) ;

        }
    })
    $(".actionRefresh").click(function() {
        sortDir = "desc";
        sortField = "id";
        page = 1 ;
        prevButton.hide() ;
        nextButton.show();
        $(".page-item").each(function() {
            var item = $(this);
            item.removeClass("active");
            if(item.data("page") === 1) {
                item.addClass("active");
            }
        })
        $(".pagination").show() ;
        $("#city-list").val("all");
        $("#cinema-list").html("");
        handlePaginate(page, sortDir , sortField, jwt);
    });
    $("#cinema-list").on("change" , function() {
        var cityId =$("#city-list").val();
        if(cityId !== 'all') {
            var cinemaName = $(this).val() ;
            handleRoomByCinema(cinemaName, jwt) ;
        }
    })
    $("#addRoom").click(function() {
        var cityId = $("#city-list").val() ;
        console.log(cityId) ;
        if(cityId === 'all') {
            alert("Please choose a city first") ;
        } else {
            $("#room-modal").modal("show");
            $("#update-room").hide();
            $("#add-room").show();
            $(".modal-title").text("Add room") ;
            var cinemaName = $("#cinema-list").val();
            handleGetCinemaByCityForModal(cityId, jwt, cinemaName) ;
        }
    })
    $(".fa-edit").click(function() {
        var cityId = $("#city-list").val() ;
        if(cityId !== 'all') {
            var roomId = $(this).data("id");
            console.log(roomId);
            $("#room-modal").modal("show");
            $("#update-room").show();
            $("#add-room").hide();
            $(".modal-title").text("Update room id: " + roomId) ;
            $("input[name='roomId']").val(roomId);
            handleRoomById(roomId, jwt) ;
        } else {
            alert("Please choose the city first ");
        }
    })
    $("#add-room").click(function() {
        var roomName = $("input[name='name']").val() ;
        var width = $("input[name='width']").val() ;
        var length = $("input[name='length']").val() ;
        console.log(width);
        console.log(length);
        var capacity = length+"x"+width ;
        console.log(typeof(capacity));
        console.log(capacity);
        var cinemaName = $("#cinema-list-modal").val() ;
        var cinemaId = $("#cinema-list-modal").find(":selected").data("id");
        var cinema = {
            id : cinemaId,
            name : cinemaName
        }
        console.log(cinema) ;
        var room = {
            name : roomName,
            capacity : capacity,
            cinema : cinema
        }
        handleAddRoom(room, jwt) ;
    })
    $("#update-room").click(function() {
       var roomId = $("input[name='roomId']").val() ;
       var roomName = $("input[name='name']").val() ;
       var width = $("input[name='width']").val() ;
       var length = $("input[name='length']").val() ;
       var capacity = length+"x"+width ;
       var cinemaName = $("#cinema-list-modal").val() ;
       var cinemaId = $("#cinema-list-modal").find(":selected").data("id");
       var cinema = {
           id : cinemaId,
           name : cinemaName
       }
       console.log(cinema) ;
       var room = {
           name : roomName,
           capacity : capacity,
           cinema : cinema
       }
//       console.log(room);
//       console.log(roomId);
       handleUpdateRoom(roomId, room, jwt) ;
    })
    $(".close").click(function(){
        clearInput();
        $("#room-modal").modal("hide");
    })
    $("ul.pagination").on("click", "a.page-link", function(e) {
            e.preventDefault();
            var currentPage = $(this).closest("li").data("page");
            page = currentPage;
            $(".page-item").removeClass("active") ;
            $("li[data-page ="+page+"]").addClass("active") ;
            sortDir = $("input[name='sortDir']").val() ;
            sortField = $("input[name='sortField']").val() ;
            if(page == 1) {
                prevButton.hide() ;
                nextButton.show();
            }else if(page == totalPage) {
                nextButton.hide();
                prevButton.show() ;
            }else {
                prevButton.show() ;
                nextButton.show();
            }
            handlePaginate(currentPage, sortDir , sortField, jwt);
        });
    $('.sort-link').click(function(e) {
            e.preventDefault();
            var field = $(this).data('field');
            console.log(field) ;
            $("input[name='sortField']").val(field) ;
            if($(this).find('i').hasClass("fa-arrow-down")) {
                sortDir = "asc" ;
                $("input[name='sortDir']").val("asc") ;
            } else {
                sortDir = "desc" ;
                $("input[name='sortDir']").val("desc") ;
            }
            $(".page-item").removeClass("active") ;
            $("li[data-page ="+page+"]").addClass("active") ;
            var action = '';
            handlePaginate(page, sortDir , field, jwt, action );
            $(this).find('i').toggleClass('fa-arrow-down fa-arrow-up');
          });
    function handleUpdateRoom(roomId, room, jwt) {
          var headers = { "Authorization": "Bearer " + jwt };
          var url = baseUrl +  "/api/v1/admin/room/update/" + roomId ;
          $.ajax({
              type: "PUT",
              contentType: "application/json",
              url: url,
              headers: headers,
              data: JSON.stringify(room),
              dataType: 'json',
              success: function(res) {
                  console.log(res);
                  alert("update room : " + res.id + "success");
                  var cinemaName = room.cinema.name ;
                  console.log(cinemaName)
                  handleRoomByCinema(cinemaName, jwt) ;
                  clearInput() ;
                  $("#room-modal").modal("hide");

              },
              error: function(jqXHR, textStatus, errorThrown) {
                  var errorData = JSON.parse(jqXHR.responseText);
                   alert(errorData.message);
              }
          });
    }
    function handleRoomById(roomId, jwt) {
        getRoomById(roomId, jwt)
            .then(function(room) {
                console.log(room) ;
                var capacityArray = room.capacity.split("x");
                var width = capacityArray[1];
                var length = capacityArray[0];
                var cityId = $("#city-list").val() ;
                $("input[name='name']").val(room.name) ;
                $("input[name='width']").val(width) ;
                $("input[name='length']").val(length) ;
                var cinemaName = room.cinemaName ;
                console.log(room.cinemaName);
                handleGetCinemaByCityForModal(cityId, jwt, cinemaName ) ;
            })
            .catch(function(error) {
                   console.log(error) ;
                   if (error.responseJSON) {
                     alert(error.responseJSON.message);
                   } else {
                     alert("An error occurred.");
                   }
            })

    }
    function getRoomById(roomId, jwt) {
          var url = baseUrl + "/api/v1/admin/room/" +roomId ;
          var headers = { "Authorization": "Bearer " + jwt };
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
    function handleAddRoom(room, jwt) {
          var headers = { "Authorization": "Bearer " + jwt };
          var url = baseUrl + "/api/v1/admin/room/save" ;
          $.ajax({
              type: "POST",
              contentType: "application/json",
              url: url,
              headers: headers,
              data: JSON.stringify(room),
              dataType: 'json',
              success: function(res) {
                  clearInput() ;
                  console.log(res);
                  alert("Add room success");
                  var cinemaName = room.cinema.name ;
                  $("#room-modal").modal("hide");
                  console.log(cinemaName)
                  handleRoomByCinema(cinemaName, jwt) ;
              },
              error: function(jqXHR, textStatus, errorThrown) {
                  var errorData = JSON.parse(jqXHR.responseText);
                   alert(errorData.message);
              }
          });
    }
    function handleGetCinemaByCityForModal(cityId, jwt, cinemaName ) {
        getCinemaByCity(cityId , jwt)
            .then(function(cinemas) {
                console.log(cinemas) ;
                if(cinemas.length > 0) {
                    var html = '';
                    $("#cinema-list-modal").empty() ;
                    $.each(cinemas, function(index, cinema) {
                        html+= '<option value="'+cinema.name+'" data-id="'+cinema.id+'">'+cinema.name+'</option>'
                    })
                    $("#cinema-list-modal").html(html) ;
                }
                 $("#cinema-list").val(cinemaName);
                 handleRoomByCinema(cinemaName, jwt) ;
                 $(".pagination").hide() ;
                if(cinemaName !== '') {
                    $("#cinema-list-modal").val(cinemaName) ;
                }
            })
            .catch(function(error) {
                console.log(error) ;
                if (error.responseJSON) {
                  alert(error.responseJSON.message);
                } else {
                  alert("An error occurred.");
                }
            })
    }
    function clearInput() {
        $("input[name='name']").val('') ;
        $("input[name='width']").val('') ;
        $("input[name='length']").val('') ;
        $("#cinema-list-modal").val('') ;
    }

    function handleGetCinemaByCity(cityId, jwt) {
        getCinemaByCity(cityId , jwt)
            .then(function(cinemas) {
                console.log(cinemas) ;
                if(cinemas.length > 0) {
                    var html = '';
                    $("#cinema-list").empty() ;

                    $.each(cinemas, function(index, cinema) {
                        html+= '<option value="'+cinema.name+'">'+cinema.name+'</option>'
                    })
                    handleRoomByCinema(cinemas[0].name, jwt) ;
                    $("#cinema-list").html(html) ;
                }



            })
            .catch(function(error) {
                console.log(error) ;
                if (error.responseJSON) {
                  alert(error.responseJSON.message);
                } else {
                  alert("An error occurred.");
                }
            })
    }
    function handleRoomByCinema(cinemaName , jwt) {
        getRoomByCinema(cinemaName, jwt)
            .then(function(rooms) {
                console.log(rooms);
                $(".table-list").empty() ;
                if(rooms.length > 0) {
                    $(".pagination").hide() ;
                    var html = '' ;
                    $.each(rooms , function(index , room) {
                        html+= '<tr>' +
                        '<td>'+
                            '<a href = "/admin/room/'+room.id +'/seats">' +
                            room.id +
                            '</a>' +
                        '</td>' +
                        '<td>'+ room.name +'</td>' +
                        '<td>'+ room.capacity +'</td>' +
                        '<td>'+ room.cinemaName +'</td>' +
                        '<td>' +
                            '<a data-id="'+room.id+'"class="fas fa-trash fa-2x " href="#" style="color: #1b1918;"></a>' +
                            '<a data-id="'+room.id+'"class="fas fa-edit fa-2x" href="#" style="color: #1b1918;"></a>' +
                        '</td>' +
                        '<td>' +
                         '<a class="fas fa-tasks fa-2x icon-dark" href = "/admin/room/' + room.id +'/seats" ></a>/' +
                     '</td>'+
                    '</tr>' ;
                    })
                    $(".table-list").html(html) ;
                    $(".fa-edit").click(function() {
                        var cityId = $("#city-list").val() ;
                        if(cityId !== 'all') {
                            var roomId = $(this).data("id");
                            $("#room-modal").modal("show");
                            $("#update-room").show();
                            $("#add-room").hide();
                            $(".modal-title").text("Update room id: " + roomId) ;
                            $("input[name='roomId']").val(roomId);
                            handleRoomById(roomId, jwt) ;
                        } else {
                            alert("Please choose the city first ");
                        }
                    })
                }
            })
            .catch(function(error) {
                console.log(error) ;
                if (error.responseJSON) {
                  alert(error.responseJSON.message);
                } else {
                  alert("An error occurred.");
                }
            })
    }
    function getRoomByCinema(cinemaName, jwt) {
          var url = baseUrl + "/api/v1/admin/room/cinema/"+ cinemaName ;
          var headers = { "Authorization": "Bearer " + jwt };
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
    function getCinemaByCity(cityId , jwt) {
          var url = baseUrl + "/api/v1/movies/cinemas/find/city/" + cityId ;
          var headers = { "Authorization": "Bearer " + jwt };
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
                reject(jqXHR);
              }
            });
          });
    }



//////////////////////////////////////////////////////////MANAGE SEAT///////////////////////////////////////////////////

    $(".seat").click(function() {
        var column = $(this).data("column");
        var row = $(this).data("row");
        columnNumber.val(column);
        rowNumber.val(row);
        var idOfSeat = $(this).data("id");
        var checkCreateOrUpdate = idOfSeat != null && $(this).hasClass("none") == false ;
        if(checkCreateOrUpdate) {
            console.log(idOfSeat);
            console.log(column);
            console.log(row);
            var nameSeat = $(this).text() ;
            seatName.val(nameSeat) ;
            $("#addSeat").text("Update seat");
        }else{
            $("#addSeat").text("Add seat");
            seatName.val("") ;
        }
    })
    $("#addSeat").click(function(event){
        event.preventDefault() ;
        var column = columnNumber.val();
        var row = rowNumber.val();
        var name = seatName.val() ;
        var mySeat = $('span[data-column="' + column + '"][data-row="' + row + '"]');
        var checkCreateOrUpdate = mySeat.data("id") != null && mySeat.hasClass("none") == false ;;
        var selectedTypeText = $('#type-list option:selected').text();
        var seat = {
            seat_name: name,
            row_num : row ,
            column_num : column ,
            type : selectedTypeText ,
            roomId : roomId
        };
        if(checkCreateOrUpdate) {
            let seatId = mySeat.data("id") ;
            if(selectedTypeText === "NONE"){
                deleteSeat(seatId , jwt, mySeat , selectedTypeText) ;
            }else{
                console.log(seatId) ;
                updateSeat(seat, jwt , seatId, selectedTypeText , mySeat) ;

            }
        }else{
            saveSeat(seat, jwt)
              .then(function(savedSeat) {
                handleSetSeatHtml(mySeat, savedSeat ,selectedTypeText );
                console.log(savedSeat);
                mySeat.attr("data-id" , savedSeat.id);
                alert("Save success room: " + savedSeat.id);
              })
              .catch(function(error) {
                console.log(error);
                if(error) {
                    var messageErr =  error.responseJSON;
                    alert(messageErr.errors[0]);
                  }
              });
        }


    })
    function handleSetSeatHtml(mySeat, seatDB , selectedTypeText ) {
        mySeat.text(seatDB.seat_name) ;
        mySeat.removeClass() ;
        mySeat.addClass("seat") ;
        columnNumber.val("");
        rowNumber.val("") ;
        seatName.val("") ;
        switch(selectedTypeText) {
          case 'NORMAL':
            mySeat.addClass("normal");
            break;
          case 'NONE':
              mySeat.text("") ;
              mySeat.addClass("none");
              mySeat.removeAttr("data-id");
              $("#addSeat").text("Add seat");
              break;
          case 'VIP':
            mySeat.addClass("vip");
            break;
           case 'KING':
             mySeat.addClass("king");
             break;
           case 'DELUXE':
              mySeat.addClass("deluxe");
              break;
           case 'SWEETBOX':
             mySeat.addClass("sweetbox");
             break;
          default:
             mySeat.addClass("couple");
            break;
    }
    }

    // Call the function with the roomId parameter

    function handlePaginate(currentPage, sortDir, sortField , jwt) {
        getRoomPaginate(currentPage, sortDir, sortField , jwt)
            .then(function(res) {
                // get currentpage , sortDir, sortField , totalPage // data
                $(".table-list").empty() ;
                var rooms = res.results;
                var html = '';
                $.each(rooms,function(index, room) {
                    html += '<tr>' +
                                '<td>' +
                                    '<a href="/admin/room/' + room.id + '/seats">' + room.id + '</a>' +
                                '</td>' +
                                '<td>' + room.name + '</td>' +
                                '<td>' + room.capacity + '</td>' +
                                '<td>' + room.cinemaName + '</td>' +
                                '<td>' +
                                    '<a data-id="'+room.id+'"class="fas fa-trash fa-2x " href="#" style="color: #1b1918;"></a>' +
                                    '<a data-id="'+room.id+'"class="fas fa-edit fa-2x" href="#" style="color: #1b1918;"></a>' +
                                '</td>' +
                                '<td>' +
                                    '<a class="fas fa-tasks fa-2x icon-dark" href = "/admin/room/' + room.id +'/seats" ></a>/' +
                                '</td>'+
                            '</tr>';
                });
                $(".table-list").html(html);
            })
            .catch(function(error) {
                console.log(error);
            })
    }
    function getRoomPaginate(currentPage, sortDir, sortField , jwt) {
          var url = baseUrl +  "/api/v1/admin/room/paginate?pageNum="+currentPage+"&sortDir="+sortDir+"&sortField=" + sortField ;
          var headers = { "Authorization": "Bearer " + jwt };
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
                reject(jqXHR);
              }
            });
          });
    }
    function saveSeat(seat, jwt) {
      var headers = { "Authorization": "Bearer " + jwt };
      var url =  baseUrl +  "/api/v1/admin/seat/save";
      return new Promise(function(resolve, reject) {
        $.ajax({
          type: "POST",
          contentType: "application/json",
          url: url,
          headers: headers,
          data: JSON.stringify(seat),
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
    function updateSeat(seat, jwt , seatId , selectedTypeText , mySeat) {
          var headers = { "Authorization": "Bearer " + jwt };
          var url = baseUrl +  "/api/v1/admin/seat/update/" + seatId ;
          $.ajax({
              type: "PUT",
              contentType: "application/json",
              url: url,
              headers: headers,
              data: JSON.stringify(seat),
              dataType: 'json',
              success: function(seatDB) {
                  handleSetSeatHtml(mySeat, seatDB ,selectedTypeText );
                  alert("Update success " + seatDB.id);
              },
              error: function(jqXHR, textStatus, errorThrown) {
                  console.log(jqXHR);
                  if(jqXHR ) {
                    var messageErr =  jqXHR.responseJSON;
                    alert(messageErr.errors);
                  }

              }
          });
    }
    function deleteSeat(seatId , jwt , mySeat , selectedTypeText) {
          var headers = { "Authorization": "Bearer " + jwt };
          var url = baseUrl + "/api/v1/admin/seat/delete/" + seatId ;
          $.ajax({
              type: "DELETE",
              contentType: "application/json",
              url: url,
              headers: headers,
              success: function() {
                   handleSetSeatHtml(mySeat, mySeat ,selectedTypeText );
                  alert("Delete successful") ;
              },
              error: function(jqXHR, textStatus, errorThrown) {
                  console.log(jqXHR);
                    if(jqXHR ) {
                      var messageErr =  jqXHR.responseJSON;
                      alert(messageErr.errors);
                    }
              }
          });
    }
});