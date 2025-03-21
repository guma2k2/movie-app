$(document).ready(function() {
   var bookingId= $("#bookingId").val();
   var stompClient = null;
   var eventId = $("input[name='eventId']").val() ;
   var username = null;
   var messageContent = $("#seats").text();
   console.log(messageContent);
   var interval;
   connect();
   console.log(bookingId);
   var jwtToken = $("#token").val();
   countdown(4 , 59);
   // form-payment
   $("#btn-payment").click(function() {
      alert("perform action");
      sendMessagePayed();
      $("#form-payment").submit();
   })
   $("#btn-cancel").click(function() {
       var loadingElement =  $("#loading")
       loadingElement.addClass("loading");
       setTimeout(function() {
           loadingElement.removeClass("loading");
           cancelBooking(jwtToken , bookingId);
       },500);
   })
   function countdown(minutes, seconds) {
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
           $("#minute").text('');
           $("#second").text('');
           cancelBooking(jwtToken,bookingId) ;
         }
       }, 1000);
     }
   function pad(num, size) {
         var s = num + '';
         while (s.length < size) s = '0' + s;
         return s;
       }
   function cancelBooking(jwtToken, bookingId) {
     $.ajax({
       url: "http://localhost:8082/api/v1/delete/booking/" + bookingId,
       type: 'DELETE',
       headers: {
         'Authorization': 'Bearer ' + jwtToken
       },
       success: function(result) {
         sendMessageCancel();
         clearInterval(interval);
         $("#overTime").submit();
       },
       error: function(xhr, status, error) {
         console.error('Error:', error);
       }
     });
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
     }
     function sendMessageCancel() {
         var messageContent = $("#seats").text();
         console.log(messageContent);
         console.log(messageContent);
         console.log(eventId);
         console.log(messageContent);
         if(messageContent && stompClient) {
             var chatMessage = {
                 sender: username,
                 seats: messageContent,
                 type: 'CANCEL'
             };
             stompClient.send("/app/chat/"+ eventId + "/sendMessage", {}, JSON.stringify(chatMessage));
         }
     }

     function sendMessagePayed() {
          var messageContent = $("#seats").text();
          console.log(messageContent);
          console.log(messageContent);
          console.log(eventId);
          console.log(messageContent);
          if(messageContent && stompClient) {
              var chatMessage = {
                  sender: username,
                  seats: messageContent,
                  type: 'PAID'
              };
              stompClient.send("/app/chat/"+ eventId + "/sendMessage", {}, JSON.stringify(chatMessage));
          }
      }

})


