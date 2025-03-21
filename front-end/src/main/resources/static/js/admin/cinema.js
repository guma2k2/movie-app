var extraImagesCount = 0 ;
$(document).ready(function () {
    var jwt = $("input[name='token']").val() ;
    $(".item.active").removeClass("active");
    $(".item.cinema").addClass("active");
    $("#city-list").on('change' , function() {
        checkCurrentCity(jwt) ;
    })

    $(".btn-add").click(function() {
        $("#cinema-modal").modal("show");
        $("#update-cinema").hide();
        $("#add-cinema").show();
        $(".modal-title").text("Add cinema") ;
        clearInput();
    })
    $(".close").click(function() {
        $("#cinema-modal").modal("hide") ;
        clearInput() ;
        extraImagesCount = 0 ;
    })
    $(".fas.fa-edit").click(function(e) {
        var cinemaId = $(this).data("id");
        console.log(cinemaId) ;
        $("#cinema-modal").modal("show");
        $("#update-cinema").show();
        $("#add-cinema").hide();
        $(".modal-title").text("Update cinema") ;
        $("input[name='cinemaId']").val(cinemaId);
        setCinemaById(cinemaId, jwt);
    })
    $("#update-cinema").click(function() {
        var cinemaId = $("input[name='cinemaId']").val();
        console.log(cinemaId);
        var name = $("input[name='name']").val() ;
        var address = $("input[name='address']").val() ;
        var cinema_type = $("#types").val() ;
        var phone_number = $("input[name='phone_number']").val() ;
        var cityId = $("#city-list-modal").val() ;
        var cityName = $("#city-list-modal option:selected").text();
        var city = {
            id : cityId,
            name : cityName
        }
        var cinema = {
            name : name,
            address: address,
            cinema_type :cinema_type ,
            phone_number : phone_number,
            city: city
        }
        var formImage = $("#divCinemaImages") ;
        handleUpdateCinema(cinema, formImage, jwt, cinemaId) ;
    })
    $("#add-cinema").click(function() {
        var name = $("input[name='name']").val() ;
        var address = $("input[name='address']").val() ;
        var cinema_type = $("#types").val() ;
        var phone_number = $("input[name='phone_number']").val() ;
        var cityId = $("#city-list-modal").val() ;
        var cityName = $("#city-list-modal option:selected").text();
        var city = {
            id : cityId,
            name : cityName
        }
        var cinema = {
            name : name,
            address: address,
            cinema_type :cinema_type ,
            phone_number : phone_number,
            city: city
        }
        var formImage = $("#divCinemaImages");
        handleAddCinema(cinema, formImage, jwt) ;
    })
    function handleUpdateCinema(cinema, formImage, jwt , cinemaId) {
          console.log(cinemaId) ;
          var headers = { "Authorization": "Bearer " + jwt };
          var url = baseUrl +  "/api/v1/admin/cinema/update/" + cinemaId  ;
          $.ajax({
              type: "PUT",
              contentType: "application/json",
              url: url,
              headers: headers,
              data: JSON.stringify(cinema),
              dataType: 'json',
              success: function(cinema) {
                  console.log("successful") ;
                  alert("successful") ;
                  var cinemaId = cinema.id ;
                  handleSaveImages(formImage, cinemaId) ;
                  $("#cinema-modal").modal("hide");
                  clearInput();
              },
              error: function(jqXHR, textStatus, errorThrown) {
                  var errorData = JSON.parse(jqXHR.responseText);
                  alert(errorData.message);
              }
          });
    }
    function setCinemaById(cinemaId, jwt) {
        getCinemaById(cinemaId, jwt)
            .then(function(cinema) {
               $("input[name='name']").val(cinema.name) ;
               $("input[name='address']").val(cinema.address) ;
               $("#types").val(cinema.cinema_type) ;
               $("input[name='phone_number']").val(cinema.phone_number) ;
               $("#city-list-modal").val(cinema.city.id) ;
               var cinemaImages = cinemaImagesUpdateHtml(cinema) ;
               $("#divCinemaImages").html(cinemaImages);
               $("#fileImage").change(function(){
                   	fileSize = this.files[0].size;
                   	if(fileSize > 1048576){
                   		this.setCustomValidity("The file must be lower than 1MB");
                   		this.reportValidity();
                   	}else {
                   		this.setCustomValidity("");
                   		showImageThumbnail(this);
                   	}
               })

               $("input[name='extraImage']").each(function(index) {
               		extraImagesCount++;
               		$(this).change(function() {
               			if (!checkFileSize(this)) {
               				return;
               			}
               			showExtraImageThumbnail(this, index);
               		});
               	});

               	$("a[name='linkRemoveExtraImage']").each(function(index) {
               		$(this).click(function() {
               			removeExtraImage(index);
               		});
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
    function cinemaImagesAddHtml() {
        var html = '<div class="col" >' +
                        '<div class="p-2 border" >' +
                            '<div><label>Main Image</label></div>' +
                            '<div class="m-2">' +
                                '<img id="thumbnail" alt="Main image preview"  class="img-fluid" src=""/>' +
                            '</div>' +
                            '<div>' +
                                '<input type="file" id="fileImage" name="fileImage"  accept="image/png, image/jpeg" />' +
                            '</div>' +
                        '</div>' +
                    '</div>' ;
        html+= '<div class="col" id="divExtraImage1">' +
                    '<div class="p-2 border" >' +
                        '<div id="extraImageHeader0">' +
                            '<label>Extra Image #1</label>' +
                        '</div>' +
                        '<div class="m-2">' +
                            '<img id="extraThumbnail0"' +
                                 'alt="Extra image 0 preview" class="img-fluid"' +
                                 'src=""/>' +
                        '</div>' +
                        '<div>' +
                            '<input type="file" name="extraImage"' +
                                   'accept="image/png, image/jpeg" />' +
                        '</div>' +
                    '</div>' +
                '</div>' ;
                return html ;
    }
    function handleSaveImages(formImage, cinemaId) {
          var formData = new FormData(formImage[0]);
          console.log(formImage);
          var headers = { "Authorization": "Bearer " + jwt };
          var url =  baseUrl + "/api/v1/admin/cinema/save/image/" + cinemaId ;
          $.ajax({
              type: "POST",
              cache: false,
              contentType: false,
              processData: false,
              url: url,
              headers: headers,
              data: formData,
              success: function(res) {
                 checkCurrentCity(jwt);
              },
              error: function(jqXHR, textStatus, errorThrown) {
                  var errorData = JSON.parse(jqXHR.responseText);
                   alert(errorData.message);
              }
          });
     }
    function cinemaImagesUpdateHtml(cinema) {
        var html = '<div class="col" >' +
                        '<div class="p-2 border" >' +
                            '<div><label>Main Image</label></div>' +
                            '<div class="m-2">' +
                                '<img id="thumbnail" alt="Main image preview"  class="img-fluid" src="'+ cinema.photosImagePath  + '"/>' +
                            '</div>' +
                            '<div>' +
                                '<input type="file" id="fileImage" name="fileImage"  accept="image/png, image/jpeg" />' +
                            '</div>' +
                        '</div>' +
                    '</div>' ;
        var images = cinema.images;
        if(images.length) {
            for(var i = 0 ; i < images.length ;i++){
                var image = images[i] ;
                html += '<div class="col border m-3 p-2" id="divExtraImage' + i  + '">' +
                        '<div>' +
                            '<label>Extra Image #'+(i+1)+ '</label>' +
                            '<a name="linkRemoveExtraImage"' +
                             'class="btn fas fa-times-circle fa-2x icon-dark float-right"' +
                                'title="Remove this image"></a>' +
                        '</div>' +
                        '<div class="m-2">' +
                            '<img id="extraThumbnail' + i + '"' +
                                'alt="Extra image #' + (i+1)  + ' preview" class="img-fluid"' +
                                'src="'+ image.extraImagePath +'"/>' +
                        '</div>' +
                        '<div>' +
                            '<input type="file" name="extraImage" accept="image/png, image/jpeg"/>' +
                        '</div>' +
                        '<input type="hidden" name="imageIDs" id="imageId' + i + '" value="' + image.id + '" />' +
                        '<input type="hidden" name="imageNames" id="imageName' + i + '" value="' + image.name +'"/>' +
                    '</div>' ;
            }
        var numberOfExistingExtraImages = images.length ;
        html+= '<div class="col" id="divExtraImage' + numberOfExistingExtraImages + '">' +
            '<div class="p-2 border" >' +
                '<div id="extraImageHeader' + numberOfExistingExtraImages +  '">' +
                    '<label>Extra Image #'  + (numberOfExistingExtraImages+1) +  '</label>' +
                '</div>' +
                '<div class="m-2">' +
                    '<img id="extraThumbnail' + numberOfExistingExtraImages +  '"' +
                         'alt="Extra image ' + numberOfExistingExtraImages  + ' preview" class="img-fluid"' +
                         'src=""/>' +
                '</div>' +
                '<div>' +
                    '<input type="file" name="extraImage"' +
                           'accept="image/png, image/jpeg" />' +
                '</div>' +
            '</div>' +
        '</div>' ;
        } else {
            html+= '<div class="col" id="divExtraImage1">' +
                    '<div class="p-2 border" >' +
                        '<div id="extraImageHeader0">' +
                            '<label>Extra Image #1</label>' +
                        '</div>' +
                        '<div class="m-2">' +
                            '<img id="extraThumbnail0"' +
                                 'alt="Extra image 0 preview" class="img-fluid"' +
                                 'src=""/>' +
                        '</div>' +
                        '<div>' +
                            '<input type="file" name="extraImage"' +
                                   'accept="image/png, image/jpeg" />' +
                        '</div>' +
                    '</div>' +
                '</div>' ;
        }
    return html ;
    }
    function getCinemaById(cinemaId , jwt) {
          var url =  baseUrl + "/api/v1/admin/cinema/" + cinemaId ;
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
    function checkCurrentCity(jwt) {
        var city = $("#city-list").val() ;
//        console.log(typeof(city));
//        console.log(city);
        if(city === 'all') {
            handleAllCinema(jwt) ;
        }else {
            handleListCinemaByCity(city, jwt) ;
        }
    }
    function handleAllCinema(jwt) {
        getAllCinema(jwt)
            .then(function(cinemas) {
                console.log(cinemas) ;
                if(cinemas.length > 0 ){
                    $(".table-body").empty() ;
                    var html = '' ;
                    $.each(cinemas, function(index, cinema) {
                        var city = cinema.city;
                        html += '<tr>' +
                            '<td>' + cinema.id + '</td>' +
                            '<td>' + cinema.name + '</td>' +
                            '<td style="min-width:400px;">' + cinema.address + '</td>' +
                            '<td>' + cinema.cinema_type + '</td>' +
                            '<td>' + cinema.city.name + '</td>' +
                            '<td>' +
                            '<a data-id="' + cinema.id + '" class="fas fa-trash ml-2" href="#" style="color: #1b1918;"></a>' +
                            '<a data-id="' + cinema.id + '" class="fas fa-edit ml-2" href="#" style="color: #1b1918;"></a>' +
                            '</td>' +
                            '</tr>';
                    })
                    $(".table-body").html(html) ;
                }
                $(".fas.fa-edit").click(function(e) {
                    var cinemaId = $(this).data("id");
                    console.log(cinemaId) ;
                    $("#cinema-modal").modal("show");
                    $("#update-cinema").show();
                    $("#add-cinema").hide();
                    $(".modal-title").text("Update cinema") ;
                    setCinemaById(cinemaId, jwt);
                })
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
    function getAllCinema(jwt) {
          var url = baseUrl +  "/api/v1/admin/cinema" ;
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
    function handleAddCinema(cinema, formImage, jwt) {
          var headers = { "Authorization": "Bearer " + jwt };
          var url =  baseUrl +  "/api/v1/admin/cinema/save"  ;
          $.ajax({
              type: "POST",
              contentType: "application/json",
              url: url,
              headers: headers,
              data: JSON.stringify(cinema),
              dataType: 'json',
              success: function(cinema) {
                  console.log("successful") ;
                  alert("successful") ;
                  var cinemaId = cinema.id ;
                  handleSaveImages(formImage, cinemaId);
                  $("#cinema-modal").modal("hide");
                  clearInput();
              },
              error: function(jqXHR, textStatus, errorThrown) {
                  var errorData = JSON.parse(jqXHR.responseText);
                  alert(errorData.message);
              }
          });
    }
    function handleListCinemaByCity(cityId, jwt) {
        getCinemaByCity(cityId, jwt)
            .then(function(cinemas) {
                console.log(cinemas) ;
                var html = '' ;
                if(cinemas.length > 0 ){
                    $(".table-body").empty() ;
                    var html = '' ;
                    $.each(cinemas, function(index, cinema) {
                        var city = cinema.city;
                        html += '<tr>' +
                            '<td>' + cinema.id + '</td>' +
                            '<td>' + cinema.name + '</td>' +
                            '<td style="min-width:400px;">' + cinema.address + '</td>' +
                            '<td>' + cinema.cinema_type + '</td>' +
                            '<td>' + cinema.city.name + '</td>' +
                            '<td>' +
                            '<a data-id="' + cinema.id + '" class="fas fa-trash ml-2" href="#" style="color: #1b1918;"></a>' +
                            '<a data-id="' + cinema.id + '" class="fas fa-edit ml-2" href="#" style="color: #1b1918;"></a>' +
                            '</td>' +
                            '</tr>';
                    })
                }
                $(".table-body").html(html) ;
                $(".fas.fa-edit").click(function(e) {
                    var cinemaId = $(this).data("id");
                    console.log(cinemaId) ;
                    $("#cinema-modal").modal("show");
                    $("#update-cinema").show();
                    $("#add-cinema").hide();
                    $(".modal-title").text("Update cinema") ;
                    $("input[name='cinemaId']").val(cinemaId);
                    setCinemaById(cinemaId, jwt);
                })
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
                reject(errorThrown);
              }
            });
          });
    }
    function clearInput() {
       $("input[name='name']").val('') ;
       $("input[name='address']").val('') ;
       $("#types").val('') ;
       $("input[name='phone_number']").val('') ;
       $("#city-list-modal").val('') ;
       var addImageHtml = cinemaImagesAddHtml();
       $("#divCinemaImages").html(addImageHtml) ;
       $("#fileImage").change(function(){
                fileSize = this.files[0].size;
                if(fileSize > 1048576){
                    this.setCustomValidity("The file must be lower than 1MB");
                    this.reportValidity();
                }else {
                    this.setCustomValidity("");
                    showImageThumbnail(this);
                }
          })

          $("input[name='extraImage']").each(function(index) {
                extraImagesCount++;
                $(this).change(function() {
                    if (!checkFileSize(this)) {
                        return;
                    }
                    showExtraImageThumbnail(this, index);
                });
            });

            $("a[name='linkRemoveExtraImage']").each(function(index) {
                $(this).click(function() {
                    removeExtraImage(index);
                });
            });
    }
});

function showExtraImageThumbnail(fileInput, index) {
    var file = fileInput.files[0];

    fileName = file.name;

    imageNameHiddenField = $("#imageName" + index);
    if (imageNameHiddenField.length) {
        imageNameHiddenField.val(fileName);
    }
    var reader = new FileReader();
    reader.onload = function(e) {
        $("#extraThumbnail" + index).attr("src", e.target.result);
    };

    reader.readAsDataURL(file);
//    console.log(index);
//    console.log(extraImagesCount);
    if (index >= extraImagesCount - 1) {
        addNextExtraImageSection(index + 1);
    }
}
function addNextExtraImageSection(index) {
        htmlExtraImage = `
            <div class="col border m-3 p-2" id="divExtraImage${index}">
                <div id="extraImageHeader${index}"><label>Extra Image #${index + 1}:</label></div>
                <div class="m-2">
                    <img id="extraThumbnail${index}" alt="Extra image #${index + 1} preview" class="img-fluid"
                        src=""/>
                </div>
                <div>
                    <input type="file" name="extraImage"
                        onchange="showExtraImageThumbnail(this, ${index})"
                        accept="image/png, image/jpeg" />
                </div>
            </div>
        `;

        htmlLinkRemove = `
            <a class="btn fas fa-times-circle fa-2x icon-dark float-right"
                href="javascript:removeExtraImage(${index - 1})"
                title="Remove this image"></a>
        `;

        $("#divCinemaImages").append(htmlExtraImage);

        $("#extraImageHeader" + (index - 1)).append(htmlLinkRemove);
        extraImagesCount++;
     }
function removeExtraImage(index) {
   $("#divExtraImage" + index).remove();
}
function checkFileSize(fileInput) {
    fileSize = fileInput.files[0].size;
    if (fileSize > 1048576) {
        fileInput.setCustomValidity("You must choose an image less than " + 1048576 + " bytes!");
        fileInput.reportValidity();
        return false;
    } else {
        fileInput.setCustomValidity("");
        return true;
    }
}
function showImageThumbnail(fileInput){
   var file = fileInput.files[0];
   console.log(file);
   var reader = new FileReader();
   reader.onload = function(e){
       $("#thumbnail").attr("src" , e.target.result);
   }
   reader.readAsDataURL(file);
}