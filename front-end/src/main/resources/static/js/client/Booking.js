$(document).ready(function() {
   var stompClient = null;
   var eventId = $("input[name='eventId']").val() ;
   var username = null;
   var interval ;
   connect();

  // Show default tab on page load
  // Handle tab link button clicks
  $(".tablinks").click(function(event) {
    event.preventDefault();
    var tabId = $(this).attr("data-tab");

    var tab_name = $(".tabcontent.show").attr("data-tab");

    const names = $('.seat.checked').map(function() {
      return $(this).data('name');
    }).get();

    var seat_num = names.length;
    if(tabId == 'tab2' && tab_name =='tab1' ) {
       if(seat_num == 0) {
          alert("Bạn phải chọn một chỗ ngồi trước");
       } else {
           var loadingElement =  $("#loading")
            loadingElement.addClass("loading");
            setTimeout(function() {
            loadingElement.removeClass("loading");
            countdown(4,59 , 'Bắp Nước') ;
            toggleTab(tabId, event , 'Bắp Nước');
            },700);
       }
    } else if (tabId == 'tab2' && tab_name == 'tab2') {
       sendMessage();
       $("#form-booking").submit();
    }else {
        var loadingElement =  $("#loading")
        loadingElement.addClass("loading");
        setTimeout(function() {
        loadingElement.removeClass("loading");
        if(interval != null) {
            clearInterval(interval);
        }
        countdown(0 , 0 , 'Người / Ghế ');
        toggleTab(tabId , event);
        },500);
    }
  });


  $(".fa-plus").click(function(e) {
    e.preventDefault();
    var price = parseInt($(this).data("price")) ;
    var currentValue = parseInt($("#combo" + $(this).attr("id").substr(4)).val());
    var newValue = currentValue + 1;
    $("#combo" + $(this).attr("id").substr(4)).val(newValue);
    var currentTotal = parseInt($("#total-price").val());
    var currentComboPrice = parseInt($("#price-combo").val());

    var totalPriceCombo = currentComboPrice + price;
    var totalPrice = currentTotal + price;
    var formattedPrice = totalPrice.toLocaleString("vi-VN");
    var formattedPriceCombo = totalPriceCombo.toLocaleString("vi-VN");

    $("#total-price").val(totalPrice);
    $("#total-price-formatted").val(formattedPrice);
    $("#price-combo").val(totalPriceCombo);
    $("#price-combo-formatted").val(formattedPriceCombo);
  })

  $(".fa-minus").click(function(e) {
       e.preventDefault();
       var price = parseInt($(this).data("price")) ;
       var currentValue = parseInt($("#combo" + $(this).attr("id").substr(5)).val());
       if(currentValue > 0 ) {
           var newValue = currentValue - 1;
           $("#combo" + $(this).attr("id").substr(5)).val(newValue);
           var currentTotal = parseInt($("#total-price").val());
           var currentComboPrice = parseInt($("#price-combo").val());

           var totalPriceCombo = currentComboPrice - price;
           var totalPrice = currentTotal - price;
           var formattedPrice = totalPrice.toLocaleString("vi-VN");
           var formattedPriceCombo = totalPriceCombo.toLocaleString("vi-VN");

           $("#total-price").val(totalPrice);
           $("#total-price-formatted").val(formattedPrice);
           $("#price-combo").val(totalPriceCombo);
           $("#price-combo-formatted").val(formattedPriceCombo);
        }
    })

  $('.seat').click(function() {
    if ($(this).hasClass('reserved')) {
      return;
    }
    var isCouple = $(this).hasClass("couple");
    var isSw = $(this).hasClass("sweetbox");

    if(isCouple || isSw ) {
       let seat_name = $(this).data('name');
       var seat_start = seat_name.charAt(0);
       let seat_name_num = parseInt(seat_name.substring(1));
       console.log(seat_name_num);
       var ok = seat_name_num % 2 == 0;
       $(this).toggleClass('checked');
       var sideSeat ;
       if(ok){
          sideSeat = $("#" + seat_start + (seat_name_num - 1) );
       } else {
          sideSeat = $("#" + seat_start + (seat_name_num +  1) );
       }
       sideSeat.toggleClass("checked");
       const names = $('.seat.checked').map(function() {
            return $(this).data('name');
       }).get();

       let num_normal = $('.seat.normal.checked').length;
       let num_vip = $('.seat.vip.checked').length;
       let num_king = $('.seat.king.checked').length;
       let num_deluxe = $('.seat.vip.deluxe').length;
       let num_couple = $('.seat.couple.checked').length;
       let num_sweetbox = $('.seat.sweetbox.checked').length;
       let selectedTypes = [num_normal, num_vip, num_king, num_deluxe, num_couple , num_sweetbox];
       let numSelectedTypes = selectedTypes.filter(type => type > 0).length;
       console.log(numSelectedTypes);
       var num_seat = names.length;
       if(num_seat > 0) {
         if(numSelectedTypes >= 2) {
            $(this).removeClass('checked');
            sideSeat.removeClass('checked');
            alert("Chỉ được chọn 1 loại ghể") ;
         }else{
            $("#seats-label").text("Ghế");
            switch(true) {
               case(num_sweetbox > 0):
                 var price = $("#total-price-sweetbox").data("price") ;
                 var totalPrice = price * num_seat;
                 var formattedPrice = totalPrice.toLocaleString("vi-VN");
                 $("#total-price").val(totalPrice);
                 $("#total-price-formatted").val(formattedPrice);

                default:
                 var price = $("#total-price-couple").data("price") ;
                    var totalPrice = price * num_seat;
                    var formattedPrice = totalPrice.toLocaleString("vi-VN");
                    $("#total-price").val(totalPrice);
                    $("#total-price-formatted").val(formattedPrice);
                 break;
            }
            $('#selected-seats').val(names.join(', '));
         }
      }else {
         $('#selected-seats').val("");
         $("#seats-label").text("");
         $("#total-price").val("0");
         $("#total-price-formatted").val("0");
      }

    } else {
       // toggle active class
           $(this).toggleClass('checked');
           // update the seat name text
           const names = $('.seat.checked').map(function() {
             return $(this).data('name');
           }).get();
           let num_normal = $('.seat.normal.checked').length;
           let num_vip = $('.seat.vip.checked').length;
           let num_king = $('.seat.king.checked').length;
           let num_deluxe = $('.seat.vip.deluxe').length;
           let num_couple = $('.seat.couple.checked').length;
           let num_sweetbox = $('.seat.sweetbox.checked').length;
           let selectedTypes = [num_normal, num_vip, num_king, num_deluxe, num_couple , num_sweetbox];
           let numSelectedTypes = selectedTypes.filter(type => type > 0).length;
           var num_seat = names.length;
           if(num_seat > 0) {
              if(numSelectedTypes >= 2) {
                 $(this).removeClass('checked');
                 alert("Chỉ được chọn 1 loại ghe") ;
              }else{
                 $("#seats-label").text("Ghế");
                 switch(true) {
                    case(num_normal > 0):
                      var price = $("#total-price-normal").data("price") ;
                        var totalPrice = price * num_seat;
                        var formattedPrice = totalPrice.toLocaleString("vi-VN");
                        $("#total-price").val(totalPrice);
                        $("#total-price-formatted").val(formattedPrice);
                      break;
                    case(num_vip > 0):
                       var price = $("#total-price-vip").data("price") ;
                        var totalPrice = price * num_seat;
                        var formattedPrice = totalPrice.toLocaleString("vi-VN");
                        $("#total-price").val(totalPrice);
                        $("#total-price-formatted").val(formattedPrice);
                      break;
                    case(num_king > 0):
                      var price = $("#total-price-king").data("price") ;
                        var totalPrice = price * num_seat;
                        var formattedPrice = totalPrice.toLocaleString("vi-VN");
                        $("#total-price").val(totalPrice);
                        $("#total-price-formatted").val(formattedPrice);
                      break;
                    default:
                      var price = $("#total-price-deluxe").data("price") ;
                        var totalPrice = price * num_seat;
                        var formattedPrice = totalPrice.toLocaleString("vi-VN");
                        $("#total-price").val(totalPrice);
                        $("#total-price-formatted").val(formattedPrice);
                      break;
                 }
                 $('#selected-seats').val(names.join(', '));
              }
           }else {
              $('#selected-seats').val("");
              $("#seats-label").text("");
              $("#total-price").val("0");
              $("#total-price-formatted").val("0");
           }
    }



  });


  function countdown(minutes, seconds , booking_title) {
    var clockDown = $('.clock');
    if(minutes === 0 && seconds === 0) {
       clockDown.css("display" , "none");
       $("#minute").text('');
       $("#second").text('');
       $("#clock-title").css("display" ,"none");
       clearInterval(interval);
       return;
    }
    $("#clock-title").css("display" ,"block");
    clockDown.show();
    var totalSeconds = minutes * 60 + seconds;
    interval = setInterval(function() {
      var remainingSeconds = totalSeconds % 60;
      var remainingMinutes = Math.floor(totalSeconds / 60);
      var formattedMinute = pad(remainingMinutes, 2);
      var formattedSecond = pad(remainingSeconds, 2);
      $("#minute").text(formattedMinute);
      $("#second").text(formattedSecond);
      console.log(totalSeconds);
      totalSeconds--;
      if (totalSeconds < 0) {
        $(".tabcontent").removeClass("show");
        $("#tab1" ).addClass("show");
        $('.tablinks').removeClass('active');
        $("#btn-tap1").addClass('active');
        $(".booking-title").text(booking_title);
        clockDown.css("display" , "none");
        $("#minute").text('');
        $("#second").text('');
        $("#clock-title").css("display" ,"none");
        clearInterval(interval);
      }
    }, 1000);
  }
  function toggleTab(tabId , event , booking_title) {
       $(".tabcontent").removeClass("show");
       $("#" + tabId).addClass("show");
       $('.tablinks').removeClass('active');
       $(event.target).addClass('active');
       $(".booking-title").text(booking_title);
    }

  function pad(num, size) {
    var s = num + '';
    while (s.length < size) s = '0' + s;
    return s;
  }

  function connect() {
      var username = $("input[name='username']").val() ;
      console.log(username);
      if(username) {
          var socket = new SockJS('/ws');
          stompClient = Stomp.over(socket);
          stompClient.connect({}, onConnected, onError);
      }
  }

  function onConnected() {
      username = $("input[name='username']").val() ;
      console.log(eventId);
      stompClient.subscribe('/topic/event/' + eventId , onMessageReceived);
      // Tell your username to the server
      stompClient.send("/app/chat/"+ eventId + "/add",
          {},
          JSON.stringify({sender: username, type: 'JOINED'})
      )
  }
  function onError(error) {
      alert(error)
  }
  function onMessageReceived(payload) {
      console.log(payload.body);
      var chatMessage = JSON.parse(payload.body);
      if(chatMessage.type === 'BOOKED') {
        var seatWasBooked = chatMessage.seats.split(", ");
        console.log(seatWasBooked);
        $(".seat").each(function() {
            var dataName = $(this).data('name');
            if (seatWasBooked.includes(dataName)) {
               $(this).addClass('reserved');
               $(this).prop('disabled', true);
            }
        })
      } else if(chatMessage.type === "LEAVE") {
           console.log("leave");
           stompClient.unsubscribe("/topic/event/" + eventId);
      } else if(chatMessage.type === "CANCEL") {
          var seatWasBooked = chatMessage.seats;
          console.log("CANCEL");
          $(".seat").each(function() {
              var dataName = $(this).data('name');
              if (seatWasBooked.includes(dataName)) {
                 $(this).removeClass('reserved');
                 $(this).removeAttr('disabled');
              }
          })
      }  else if(chatMessage.type === "PAID") {
           var seatWasBooked = chatMessage.seats;
           console.log("PAID");
           $(".seat").each(function() {
               var dataName = $(this).data('name');
               if (seatWasBooked.includes(dataName)) {
                  $(this).removeClass('reserved');
                  $(this).addClass('unavailable');
                  $(this).removeAttr('disabled');
               }
           })
       }
  }
  function sendMessage() {
      var messageContent = $('.seat.checked').map(function() {
           return $(this).data('name');
       }).get().join(', ');
       console.log(eventId);
       console.log(messageContent);
      if(messageContent && stompClient) {
          var chatMessage = {
              sender: username,
              seats: messageContent,
              type: 'BOOKED'
          };
          stompClient.send("/app/chat/"+ eventId + "/sendMessage", {}, JSON.stringify(chatMessage));
      }
  }
});

