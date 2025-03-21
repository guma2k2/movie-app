$(document).ready(function () {
    $(".item.active").removeClass("active");
    $(".item.movie").addClass("active");
    var jwt = $("input[name='token']").val() ;
    var sortDir = $("input[name='sortDir']").val() ;
    var sortField = $("input[name='sortField']").val() ;
    var genres = [] ;
    var keyword = $("input[name='keyword']").val() ;
    var prevButton = $("ul.pagination li:first-child");
    var nextButton = $("ul.pagination li:last-child");
    var totalPage = $("input[name='totalPage']").val() ;
    var page = $(".page-item.active").data("page");
    var sizePage = $("input[name='sizePage']").val() ;
    if(page === 1) {
        prevButton.hide() ;
    }else if(page === totalPage) {
        nextButton.hide();
    }else {
        prevButton.show() ;
        nextButton.show();
    }
      $(".fa-check-circle").click(function() {
        var movieId = $(this).attr("movieId") ;
        var status = $(this).hasClass("icon-green") ? false : true ;
        var element = $(this) ;
        handleUpdateStatus(movieId, jwt, status , element ) ;
    })

      $("ul.pagination").on("click", "a.page-link", function(e) {
        e.preventDefault();
        var currentPage;
        if ($(this).attr("aria-label") === "Previous") {
            // Handle click on previous button
            console.log("Previous button clicked.");
            currentPage = page - 1;
          } else if ($(this).attr("aria-label") === "Next") {
            // Handle click on next button
            console.log("Next button clicked.");
            currentPage = page +  1;
          } else {
            currentPage = $(this).closest("li").data("page");
        }

        page = currentPage;
        if(page === 1) {
            prevButton.hide() ;
            nextButton.show();
        }else if(page == totalPage) {
            nextButton.hide();
            prevButton.show() ;
        }else {
            prevButton.show() ;
            nextButton.show();
        }
        $(".page-item").removeClass("active") ;
        $("li[data-page ="+page+"]").addClass("active") ;
        sortDir = "desc" ;
        sortField = "id" ;
        var action = '';
        handlePaginate(page, sortDir , sortField, keyword, jwt, action);
    });
    $(".actionRefresh").click(function() {
        sortDir = "desc";
        sortField = "id";
        keyword = '';
        page = 1 ;
        var action = 'asdfa' ;
        handlePaginate(page, sortDir , sortField, keyword, jwt, action );
    });

      $('.sort-link').click(function(e) {
        e.preventDefault();
        var sortField = $(this).data('field');
        $("input[name='sortField']").val(sortField) ;
        if($(this).find('i').hasClass("fa-arrow-down")) {
            sortDir = "asc" ;
            $("input[name='sortDir']").val("asc") ;
        } else {
            sortDir = "desc" ;
            $("input[name='sortDir']").val("desc") ;
        }
        $(".page-item").removeClass("active") ;
        $("li[data-page ="+page+"]").addClass("active") ;
    //        var currentPage = $(".page-item.active").data("page") ;
        var action = '';
        handlePaginate(page, sortDir , sortField, keyword ,jwt, action );
        $(this).find('i').toggleClass('fa-arrow-down fa-arrow-up');
      });

      $(".btn-search").click(function(e) {
           e.preventDefault();
           keyword = $("input[name='keyword']").val();
           page = 1;
           var action = '';
           handlePaginate(page , sortDir , sortField, keyword , jwt, action) ;
      })

      $('a.fa-edit').click(function() {
          var movieId = $(this).data('id');
          $(".modal-title").text("UPDATE MOVIE : " + movieId);
          $("#movie-modal").modal("show") ;
          $("input[name='movieId']").val(movieId) ;
          $("#update-movie").show();
          $("#action-movie").hide()
          handleUpdateMovie(movieId, jwt) ;
       });

      $(".btn-add").click(function(e) {
           $("#movie-modal").modal("show") ;
           $(".modal-title").text("ADD");
           $("#update-movie").hide();
           $("#action-movie").show() ;
           clearInput();
           $('#selectedGenres').empty() ;
      })

      function clearInput() {
            $("input[name='title']").val('') ;
            $("input[name='description']").val('') ;
            $("input[name='duration_minutes']").val('') ;
            $("input[name='release_date']").val('') ;
            $(".language-list").val('') ;
            $(".rating-list").val('')  ;
            $("input[name='director']").val('')  ;
            $("input[name='cast']").val('')  ;
            $("input[name='poster_url']").val('')  ;
            $("input[name='trailer']").val('')   ;
            $(".showing").val('') ;
            $("#genre-list").val('') ;
            $("#thumbnail").attr("src" , "")  ;
            $("#fileImage").val('');
      }

        $('#genre-list').on('change', function() {
        // Get selected options
        var selectedOptions = $(this).find('option:selected');

        // Clear selected values array
        genres = [];

        // Iterate over selected options and add their values to the selected values array
        selectedOptions.each(function() {
          var id = $(this).data("id") ;
          var name = $(this).val() ;
          genres.push({id: id , name : name});
        });

        // Do something with the selected values
        console.log(genres);
         var html = '';
         for (var i = 0; i < genres.length; i++) {
           html += '<span class="badge badge-secondary">' + genres[i].name + '</span> ';
         }
         $('#selectedGenres').html(html);
    });
        $("#action-movie").click(function(e){
            var title = $("input[name='title']").val() ;
            var description = $("input[name='description']").val() ;
            var duration_minutes = $("input[name='duration_minutes']").val() ;
            var release_date = $("input[name='release_date']").val() ;
            var language = $(".language-list").val() ; ;
            var rating = $(".rating-list").val()  ;
            var director = $("input[name='director']").val()  ;
            var cast = $("input[name='cast']").val()  ;
            var trailer = $("input[name='trailer']").val()   ;
            var showing = $(".showing").val();
            var genreList = genres  ;
            console.log(genreList) ;
            var movie = {
                title: title,
                description : description,
                duration_minutes : duration_minutes,
                release_date: release_date,
                language : language ,
                rating : rating ,
                director: director ,
                cast : cast ,
                trailer : trailer ,
                showing : showing ,
                genres : genreList,
            }
            var formImage = $("#formImage") ;
            handleAddMovie(movie, formImage, jwt) ;
        })
        $('a.fa-trash').click(function() {
          var movieId = $(this).data('id');
          handleDeleteMovie(movieId, jwt) ;
        });


    $("#update-movie").click(function(e) {
      console.log("clicked");
      var movieId = $("input[name='movieId']").val() ;
      var title = $("input[name='title']").val() ;
      var description = $("input[name='description']").val() ;
      var duration_minutes = $("input[name='duration_minutes']").val() ;
      var release_date = $("input[name='release_date']").val() ;
      var language = $(".language-list").val() ; ;
      var rating = $(".rating-list").val()  ;
      var director = $("input[name='director']").val()  ;
      var cast = $("input[name='cast']").val()  ;
      var poster_url = $("input[name='poster_url']").val()  ;
      var trailer = $("input[name='trailer']").val()   ;
      var showing = $(".showing").val();
      var genreList = genres  ;
      var movie = {
          title: title,
          description : description,
          duration_minutes : duration_minutes,
          release_date: release_date,
          language : language ,
          rating : rating ,
          director: director ,
          cast : cast ,
          trailer : trailer ,
          showing : showing ,
          genres : genreList,
      }
      var formImage = $("#formImage") ;
      updateMovieById(movie, movieId,formImage, jwt) ;
   })
    function handleDeleteMovie(movieId, jwt) {
          var headers = { "Authorization": "Bearer " + jwt };
          var url = baseUrl +  "/api/v1/admin/movie/delete/" + movieId ;
          $.ajax({
              type: "DELETE",
              contentType: "application/json",
              url: url,
              headers: headers,
              success: function() {
                 alert("delete successful") ;
                 $("#confirmDialog").modal("hide") ;
                  var action = '' ;
                  handlePaginate(page, sortDir, sortField, keyword , jwt, action) ;
              },
              error: function(jqXHR, textStatus, errorThrown) {
                  console.log("Error updating seat: " + errorThrown);
              }
          });
    }

    // handle click on edit icon
    function getMovieById(movieId, jwt) {
        var url =  baseUrl +  "/api/v1/movies/" + movieId ;
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
    function handleUpdateMovie(movieId, jwt) {
        getMovieById(movieId, jwt)
            .then(function(movie){
                 $("input[name='title']").val(movie.title) ;
                 $("input[name='description']").val(movie.description) ;
                 $("input[name='duration_minutes']").val(movie.duration_minutes) ;
                 $("input[name='release_date']").val(movie.release_date) ;
                 $(".language-list").val(movie.language) ; ;
                 $(".rating-list").val(movie.rating)  ;
                 $("input[name='director']").val(movie.director)  ;
                 $("input[name='cast']").val(movie.cast)  ;
                 $("#thumbnail").attr("src" , movie.photosImagePath)  ;
                 $("input[name='trailer']").val(movie.trailer)   ;
                 var isShowing = movie.showing ? "true" : "false" ;
                 $(".showing").val(isShowing) ;
                 var listGenre = movie.genres ;
                 $("#genre-list").val('') ;
                 $('#selectedGenres').empty() ;
                 if(listGenre.length > 0) {
                    genres = [] ;
                    var html = '' ;
                    var selectedGenres = []
                    for(var i = 0 ; i < listGenre.length ; i++) {
                        console.log(listGenre[i]) ;
                        genres.push(listGenre[i]) ;
                        selectedGenres.push(listGenre[i].name);
                        html += '<span class="badge badge-secondary">' + listGenre[i].name + '</span> ';
                    $("#genre-list").val(selectedGenres) ;
                    $('#selectedGenres').html(html);
                    }
                 }
            })
            .catch(function(error) {
                console.log(error) ;
            })
    }
    function handleSavePoster(formImage, movieId) {
          var formData = new FormData(formImage[0]);
          console.log(formImage);
          var headers = { "Authorization": "Bearer " + jwt };
          var url =  baseUrl +  "/api/v1/admin/movie/save/poster/" + movieId ;
          $.ajax({
              type: "POST",
              cache: false,
              contentType: false,
              processData: false,
              url: url,
              headers: headers,
              data: formData,
              success: function(res) {
                 console.log(res) ;
                 console.log(page);
                 console.log(sortDir);
                 console.log(sortField);
                 var action = "action";
                 handlePaginate(page, sortDir, sortField, keyword , jwt, action);
              },
              error: function(jqXHR, textStatus, errorThrown) {
                  var errorData = JSON.parse(jqXHR.responseText);
                   alert(errorData.message);
              }
          });
     }
    function updateMovieById(movie, movieId,formImage, jwt) {
       var headers = { "Authorization": "Bearer " + jwt };
       var url =  baseUrl +  "/api/v1/admin/movie/update/" + movieId ;
       $.ajax({
           type: "PUT",
           contentType: "application/json",
           url: url,
           headers: headers,
           data: JSON.stringify(movie),
           dataType: 'json',
           success: function(movie) {
               var movieId = movie.id ;
               alert("update successful") ;
               handleSavePoster(formImage, movieId);
               clearInput() ;
               $("#movie-modal").modal("hide") ;
           },
           error: function(jqXHR, textStatus, errorThrown) {
               console.log("Error updating movie: " + errorThrown);
           }
       });
    }
    function handleAddMovie(movie, formImage, jwt) {
        saveMovie(movie, jwt)
            .then(function(movie) {
                alert("save successful") ;
                page = 1 ;
                var movieId = movie.id ;
                console.log(movieId);
                handleSavePoster(formImage,movieId );
                $("#movie-modal").modal("hide") ;
                clearInput() ;
            })
            .catch(function(error){
                console.log(error) ;
            })
    }
    function updateStatusById(movieId, jwt, status) {
            var headers = { "Authorization": "Bearer " + jwt };
              var url = baseUrl +  "/api/v1/admin/movie/update/status/" + movieId + "/" + status;
              return new Promise(function(resolve, reject) {
                  $.ajax({
                    type: "PUT",
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
    function handleUpdateStatus(movieId, jwt , status, element) {
              updateStatusById(movieId, jwt, status)
                .then(function() {
                    if(!status) {
                          element.removeClass("icon-green") ;
                          element.addClass("icon-dark");
                      } else {
                          element.removeClass("icon-dark") ;
                          element.addClass("icon-green");
                      }
                      alert("Update status successful") ;
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
    function saveMovie(movie , jwt) {
         var headers = { "Authorization": "Bearer " + jwt };
          var url =  baseUrl +  "/api/v1/admin/movie/save";
          return new Promise(function(resolve, reject) {
            $.ajax({
              type: "POST",
              contentType: "application/json",
              url: url,
              headers: headers,
              data: JSON.stringify(movie),
              dataType: 'json',
              success: function(data) {
                resolve(data);
              },
              error: function(jqXHR, textStatus, errorThrown) {
                reject(errorThrown);
              }
            });
          });
    }
    function handlePaginate(currentPage, sortDir, sortField, keyword , jwt, action) {
              getMoviePaginate(currentPage, sortDir, sortField, keyword , jwt)
                  .then(function(res) {
                      // get currentpage , sortDir, sortField , totalPage // data
                      $(".table-list").empty() ;
                      var movies = res.results;
                      var paginate = res.paginate;
                      totalPage = paginate.totalPage ;
                      sizePage = paginate.sizePage;
                      sortDir = paginate.sortDir ;
                      sortField= paginate.sortField;
                      page = currentPage ;
                      var totalElements = paginate.totalElements ;
                      var html = '';
                      $.each(movies,function(index, movie) {
                            var status = movie.showing ? '<td><i movieId="' +movie.id+'"class="fas fa-check-circle fa-2x icon-green"></i></td>':
                                                                          '<td><i movieId="' +movie.id+ '"class="fas fa-check-circle fa-2x icon-dark"></i></td>';
                            var genres = movie.genres;
                            var genreString = getGenreString(genres);
                            var poster_url = movie.poster_url != null ? '<img class="imageTable" src="' +movie.photosImagePath + '"/>'
                                                                                        : '<span class="fas fa-images fa-2x"></span>' ;
                            html += '<tr>' +
                                      '<td>' + movie.id + '</td>' +
                                      '<td>' + movie.title + '</td>' +
                                      '<td>' + poster_url + '</td>' +
                                      '<td>' + movie.release_date + '</td>' +
                                      '<td>' + genreString + '</td>' +
                                      status +
                                      '<td class="d-flex justify-content-between" >' +
                                          '<a class="fas fa-trash fa-2x" href="#" style="color: #1b1918;" data-id="'+ movie.id +'"></a>' +
                                          '<a class="fas fa-edit fa-2x ml-3" href="#" style="color: #1b1918;" data-id="'+ movie.id +'"></a>' +
                                      '</td>' +
                                  '</tr>';
                      });


                         $(".table-list").html(html);
                          if(totalElements <= sizePage) {
                               $(".pagination").empty() ;
                          }else if(keyword !== '' || action !== '')  {
                                $(".pagination").empty() ;
                                var changeHtml = '<li class="page-item">' +
                                    '<a class="page-link" href="#" aria-label="Previous">' +
                                    '<span aria-hidden="true">&laquo;</span>' +
                                    '<span class="sr-only">Previous</span>' +
                                    '</a>' +
                                    '</li>';
                                for(var i = 1 ; i <= totalPage ; i++) {
                                   var thClass = (i == currentPage ? 'page-item active' : 'page-item') ;
                                   changeHtml+= '<li class="'+ thClass+'" data-page="'+ i+ '" > <a class="page-link" href="#">'+i+'</a></li>' ;
                                }
                                changeHtml+= '<li class="page-item">' +
                                                  '<a class="page-link" href="#" aria-label="Next">' +
                                                      '<span aria-hidden="true">&raquo;</span>' +
                                                      '<span class="sr-only">Next</span>' +
                                                  '</a>' +
                                                  '</li>' ;
                                $(".pagination").html(changeHtml) ;
                      }
                      prevButton = $("ul.pagination li:first-child");
                      nextButton = $("ul.pagination li:last-child");
                      if(page === 1) {
                          prevButton.hide() ;
                      }else if(page === totalPage) {
                          nextButton.hide();
                      }else {
                          prevButton.show() ;
                          nextButton.show();
                      }
                      $(".fa-check-circle").click(function() {
                          var movieId = $(this).attr("movieId") ;
                          var status = $(this).hasClass("icon-green") ? false : true ;
                          var element = $(this) ;
                          handleUpdateStatus(movieId, jwt, status , element ) ;
                      })
                      $('a.fa-edit').click(function() {
                            var movieId = $(this).data('id');
                            $(".modal-title").text("UPDATE MOVIE : " + movieId);
                            $("#movie-modal").modal("show") ;
                            $("input[name='movieId']").val(movieId) ;
                            $("#update-movie").show();
                            $("#action-movie").hide()
                            handleUpdateMovie(movieId, jwt) ;
                          });
                      $('a.fa-trash').click(function() {
                            var movieId = $(this).data('id');
                            console.log(sortDir) ;
                            console.log(sortField) ;
                            console.log(page) ;
                            handleDeleteMovie(movieId, jwt) ;
                       });
                      $(".btn-add").click(function(e) {
                          clearInput();
                          $("#movie-modal").modal("show") ;
                          $(".modal-title").text("ADD");
                          $("#update-movie").hide();
                          $("#action-movie").show() ;
                    })
                  })
                  .catch(function(error) {
                      console.log(error);
                  })
          }
    function getGenreString(genres) {
            var genreString = '[' ;
            if(genres.length > 0){
              for(var i = 0 ; i < genres.length ; i++) {
                  genreString+= genres[i].name;
                  if(i < genres.length - 1) {
                      genreString+= ", " ;
                  }
                }
              genreString+=']';
            } else {
              genreString+="[empty]";
            }
            return genreString ;
      }
    function getMoviePaginate(currentPage, sortDir, sortField, keyword , jwt) {
           var url = baseUrl +  "/api/v1/admin/movie/paginate?pageNum="+ currentPage+
           "&sortDir="+sortDir+
           "&sortField=" + sortField +
           "&keyword=" + keyword ;
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
});