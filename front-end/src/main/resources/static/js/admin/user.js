$(document).ready(function () {
   $(".item.active").removeClass("active");
   $(".item.user").addClass("active");
    var jwt = $("input[name='token']").val() ;
    var sortDir = $("input[name='sortDir']").val() ;
    var sortField = $("input[name='sortField']").val() ;
    var keyword = $("input[name='keyword']").val() ;
    var prevButton = $("ul.pagination li:first-child");
    var nextButton = $("ul.pagination li:last-child");
    var totalPage = $("input[name='totalPage']").val() ;
    var page = $(".page-item.active").data("page");
    var sizePage = $("input[name='sizePage']").val() ;
    if(totalPage <= 1){
        $(".pagination").hide() ;
    }else {
        $(".pagination").show() ;
        if(page === 1) {
            prevButton.hide() ;
        }else if(page === totalPage) {
            nextButton.hide();
        }else {
            prevButton.show() ;
            nextButton.show();
        }
    }
    $(".actionRefresh").click(function() {
        sortDir = "desc";
        sortField = "id";
        keyword = "";
        page = 1 ;
        var action = 'asdfa' ;
        prevButton.hide() ;
        nextButton.show();
        handlePaginate(page, sortDir , sortField, keyword, jwt, action);
    });
    $(".fa-check-circle").click(function() {
        var userId = $(this).attr("userId") ;
        var status = $(this).hasClass("icon-green") ? false : true ;
        var element = $(this) ;
        handleUpdateStatus(userId, jwt, status , element ) ;
    })
     $("#hidePassword").click(function() {
        $(this).hide() ;
        $("#showPassword").show() ;
        $("input[name='password']").attr("type", "text");
     })
     $("#showPassword").click(function() {
        $(this).hide() ;
        $("#hidePassword").show() ;
        $("input[name='password']").attr("type", "password");
     })

     $("ul.pagination").on("click", "a.page-link", function(e) {
        e.preventDefault();
        var currentPage ;
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
        $(".page-item").removeClass("active") ;
        $("li[data-page ="+page+"]").addClass("active") ;
        var action = '' ;
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
        var action = '';
        handlePaginate(page, sortDir , sortField, keyword, jwt, action );
        $(this).find('i').toggleClass('fa-arrow-down fa-arrow-up');
      });
     $('a.fa-edit').click(function() {
        var userId = $(this).data('id');
        $(".modal-title").text("UPDATE USER : " + userId);
        $("#user-modal").modal("show") ;
        $("input[name='userId']").val(userId) ;

        $("#update-user").show();
        $("#add-user").hide()
        handleGetUserById(userId, jwt) ;
      });
     $(".btn.btn-primary.actionSearch").click(function() {
        var newKeyword = $("div.action-search input[name='keyword']").val();
        console.log(newKeyword);
        keyword = newKeyword ;
        console.log(sortField);
        console.log(sortDir);
        var action = '' ;
        handlePaginate(page, sortDir, sortField, keyword, jwt, action) ;
     })
     $('a.fa-trash').click(function() {
//            var userId = $(this).data('id');
//            console.log(sortDir) ;
//            console.log(sortField) ;
//            console.log(page) ;
//            handleDeleteMovie(movieId, jwt) ;
        alert("Lazy to finish :))") ;
     });
     $(".addUser").click(function(e) {
          clearInput() ;
          $("#user-modal").modal("show") ;
          $(".modal-title").text("ADD");
          $("#update-user").hide();
          $("#action-user").show() ;
     })
     $(".close").click(function() {
        clearInput() ;
        $("#user-modal").modal("hide") ;
     })
     $("#add-user").click(function() {
        var firstName = $("input[name='firstName']").val() ;
        var lastName = $("input[name='lastName']").val() ;
        var email = $("input[name='email']").val() ;
        var password = $("input[name='password']").val() ;
        var rolesArray = [];
        var checkedRoles = $('.role-checkbox:checked');
        checkedRoles.each(function() {
           var roleId = $(this).val();
           var roleName = $(this).attr('name');
           var role = {
              id : roleId,
              name: roleName
           }
           rolesArray.push(role) ;
        });
        var user = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password : password,
            roles: rolesArray
        }
        var formImage = $("#formImage") ;
        handleAddUser(user, formImage, jwt) ;

     })
     $("#update-user").click(function() {
         var userId = $("input[name='userId']").val() ;
//         console.log(userId);
         var firstName = $("input[name='firstName']").val() ;
         var lastName = $("input[name='lastName']").val() ;
         var email = $("input[name='email']").val() ;
         var password = $("input[name='password']").val() ;
         var roles = [];
         var checkedRoles = $('.role-checkbox:checked');
         var formImage = $("#formImage") ;
         checkedRoles.each(function() {
            var roleId = $(this).val();
            var roleName = $(this).attr('name');
            var role = {
               id : roleId,
               name: roleName
            }
            roles.push(role) ;
         });
//         console.log(roles);
         var user = {
             firstName: firstName,
             lastName: lastName,
             email: email,
             password: password,
             roles: roles
         }
         console.log(user) ;
         handleUpdateUser(user, userId, formImage ,jwt) ;

      })

     function handleAddUser(user, formImage, jwt) {
          var headers = { "Authorization": "Bearer " + jwt };
          var url = baseUrl + "/api/v1/admin/user/save" ;
          $.ajax({
              type: "POST",
              url: url,
              dataType: 'json',
              contentType: "application/json",
              headers: headers,
              data : JSON.stringify(user) ,
              success: function(res) {
                  console.log(res);
                  var userId = res.id;
                  alert("save user : " + userId + "success");
                  handleSavePhotoUser(formImage, userId);
                  clearInput() ;
                  $("#user-modal").modal("hide");
              },
              error: function(jqXHR, textStatus, errorThrown) {
                  var errorData = JSON.parse(jqXHR.responseText);
                   alert(errorData.message);
              }
          });
     }
     function handleSavePhotoUser(formImage, userId) {
          var formData = new FormData(formImage[0]);
          var headers = { "Authorization": "Bearer " + jwt };
          var url = baseUrl + "/api/v1/admin/user/save/photo/" + userId ;
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
                 var action = "update";
                 handlePaginate(page, sortDir, sortField, keyword , jwt, action);
              },
              error: function(jqXHR, textStatus, errorThrown) {
                  var errorData = JSON.parse(jqXHR.responseText);
                   alert(errorData.message);
              }
          });
     }
     function handleGetUserById(userId, jwt) {
        getUserById(userId, jwt)
            .then(function(user) {
                $("input[name='firstName']").val(user.firstName) ;
                $("input[name='lastName']").val(user.lastName) ;
                $("input[name='email']").val(user.email) ;
                $("#thumbnail").attr("src" , user.photosImagePath);
                $("input[name='password']").attr("placeholder" , "Fill the blank if you want to change password");
                var roles = user.roles;
//                console.log(roles) ;
                $.each(roles, function(index, role) {
                    $('input[type="checkbox"][value="' + role.id + '"]').prop('checked', true);
                });
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
     function getUserById(userId, jwt) {
          var url = baseUrl + "/api/v1/admin/user/" +userId ;
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
     function updateStatusById(userId, jwt, status) {
        var headers = { "Authorization": "Bearer " + jwt };
          var url = baseUrl + "/api/v1/admin/user/update/status/" + userId + "/" + status;
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
     function handleUpdateStatus(userId, jwt , status, element) {
          updateStatusById(userId, jwt, status)
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
     function handleUpdateUser(user, userId, formImage, jwt) {
          var headers = { "Authorization": "Bearer " + jwt };
//          console.log(jwt) ;
          var url = baseUrl + "/api/v1/admin/user/update/" + userId ;
          $.ajax({
              type: "PUT",
              contentType: "application/json",
              url: url,
              headers: headers,
              data: JSON.stringify(user),
              dataType: 'json',
              success: function(res) {
                  var userId = res.id ;
                  console.log(res);
                  alert("update user success");
                  handleSavePhotoUser(formImage, userId);
                  clearInput() ;
                  $("#user-modal").modal("hide");
              },
              error: function(jqXHR, textStatus, errorThrown) {
              }
          });
     }
     function clearInput() {
        $("input[name='firstName']").val('') ;
        $("input[name='lastName']").val('') ;
        $("input[name='email']").val('') ;
        $("input[name='password']").val('') ;
        $("#hidePassword").show() ;
        $("#showPassword").hide() ;
        $("input[name='password']").attr("type", "password");
        $("#thumbnail").attr("src" , "") ;
        $("#fileImage").val("") ;
        $('.role-checkbox:checked').prop('checked', false);
     }
     function handlePaginate(currentPage, sortDir, sortField, keyword , jwt , action) {
            getUserPaginate(currentPage, sortDir, sortField, keyword , jwt)
                .then(function(res) {
                    // get currentpage , sortDir, sortField , totalPage // data
//                    console.log(jwt) ;
                    $(".table-list").empty() ;
                    var users = res.results;
//                    console.log(res) ;
                    var paginate = res.paginate;
                    totalPage = paginate.totalPage ;
                    sizePage = paginate.sizePage;
                    sortDir = paginate.sortDir ;
                    sortField= paginate.sortField;
                    page = currentPage ;
                    var totalElements = paginate.totalElements ;
                    var html = '';
                    $.each(users,function(index, user) {
                          var status = user.status ? '<td><i userId="' + user.id+'" class="fas fa-check-circle fa-2x icon-green"></i></td>':
                                                    '<td><i userId="' + user.id+ '" class="fas fa-check-circle fa-2x icon-dark"></i></td>';
                          var roles = user.roles;
                          var roleString = getRoleString(roles) ;
                          var photo = user.photo != null ? '<img class="imageTable" src="' +user.photosImagePath + '"/>'
                                                            : '<span class="fas fa-user fa-2x"></span>' ;
                          console.log(photo);
                          html += '<tr>' +
                                    '<td>' + user.id + '</td>' +
                                    '<td>' + user.firstName + '</td>' +
                                    '<td>' + user.lastName + '</td>' +
                                    '<td>' + user.email + '</td>' +
                                    '<td>' + photo + '</td>' +
                                    '<td>' + roleString + '</td>' +
                                    status +
                                    '<td>' +
                                        '<a class="fas fa-trash fa-2x" href="#" style="color: #1b1918;" data-id="'+ user.id +'"></a>' +
                                        '<a class="fas fa-edit fa-2x ml-3" href="#" style="color: #1b1918;" data-id="'+ user.id +'"></a>' +
                                    '</td>' +
                                '</tr>';
                        });


                      $(".table-list").html(html);
                        if(totalPage <= 1) {
                             $(".pagination").empty() ;
                        }else if(keyword !== '' || action !== '') {
                              $(".pagination").empty() ;
                              var changeHtml = '<li class="page-item">' +
                                  '<a class="page-link" href="#" aria-label="Previous">' +
                                  '<span aria-hidden="true">&laquo;</span>' +
                                  '<span class="sr-only">Previous</span>' +
                                  '</a>' +
                                  '</li>';
                              console.log(totalPage) ;
                              for(var i = 1 ; i <= totalPage ; i++) {
                                 var thClass = (i == currentPage ? 'page-item active' : 'page-item') ;
                                 changeHtml+= '<li class="'+ thClass+'" data-page="'+ i+ '" > <a class="page-link" href="#">'+i+'</a></li>' ;
                                 console.log(i) ;
                              }
                              changeHtml+= '<li class="page-item">' +
                                                '<a class="page-link" href="#" aria-label="Next">' +
                                                    '<span aria-hidden="true">&raquo;</span>' +
                                                    '<span class="sr-only">Next</span>' +
                                                '</a>' +
                                                '</li>' ;
                              $(".pagination").html(changeHtml) ;
                              $(".pagination").show();
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
                    $('a.fa-edit').click(function() {
                        var userId = $(this).data('id');
                        $(".modal-title").text("UPDATE USER : " + userId);
                        $("#user-modal").modal("show") ;
                        $("input[name='userId']").val(userId) ;
                        $("#update-user").show();
                        $("#add-user").hide()
                        handleGetUserById(userId, jwt) ;
                     });
                     $(".fa-check-circle").click(function() {
                             var userId = $(this).attr("userId") ;
                             var status = $(this).hasClass("icon-green") ? false : true ;
                             var element = $(this) ;
                             handleUpdateStatus(userId, jwt, status , element ) ;
                         })
                    $('a.fa-trash').click(function() {
                          alert("feature not found") ;
                     });
                    $(".addUser").click(function(e) {
                          clearInput() ;
                          $("#user-modal").modal("show") ;
                          $(".modal-title").text("ADD");
                          $("#update-user").hide();
                          $("#action-user").show() ;
                    })
                })
                .catch(function(error) {
                    console.log(error);
                })
        }
     function getRoleString(roles) {
              var roleString = '[' ;
              if(roles.length > 0){
                for(var i = 0 ; i < roles.length ; i++) {
                    roleString+= roles[i].name;
                    if(i < roles.length - 1) {
                        roleString+= ", " ;
                    }
                  }
                roleString+= ']';
              } else {
                roleString+="[empty]";
              }
              return roleString ;
        }
     function getUserPaginate(currentPage, sortDir, sortField, keyword , jwt) {
                 var url = baseUrl + "/api/v1/admin/user/paginate?pageNum="+ currentPage+
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