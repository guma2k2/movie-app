$(document).ready(function() {
   $(".ticket-btn").click(function() {
      var jwt = $("#token").val();
      console.log(jwt);
      var ticketId = $(this).data("id") ;
      var ticket = getTicket(jwt , ticketId);
      console.log(ticket);
      var html = ticketHtml(ticket) ;
      $(".modal-body-ticket").html(html);
      generateQRCodeUrl(ticket);
      $("#ticket-modal").modal('show');
   });
   function getTicket(jwt, ticketId) {
     var ticket;
     $.ajax({
       url: baseUrl + '/api/v1/ticket/' + ticketId,
       type: 'GET',
       beforeSend: function(xhr) {
         xhr.setRequestHeader('Authorization', 'Bearer ' + jwt);
       },
       success: function(data) {
         ticket = data;
       },
       error: function(xhr, status, error) {
         console.log('Error: ' + error.message);
       },
       async: false
     });
     return ticket;
   }
   function ticketHtml(ticket) {
       let combosHTML = '';
         if (ticket.combos && ticket.combos.length > 0) {
           ticket.combos.forEach(cb => {
             combosHTML += `
               <div class="combo-item ml-2 mb-1">- ${cb.combo.title} - ${cb.combo.quantity}</div>
             `;
           });
         } else {
             combosHTML+='<div className="combo-item ml-2 mb-1">Không có combo nào</div>';
         }
       var html = `<div class="container d-flex flex-column" >
                           <h2 class="text-center">Vé xem phim</h2>
                           <div class="ticketTitle mb-2 " style="font-weight: bold; color: black;">
                               ${ticket.event.movie.title}
                           </div>
                           <div class="ticketTitle mb-2 ">${ticket.event.start_date}</div>
                           <div class="ticketTitle mb-2 " > ${ticket.event.start_time}</div>
                           <div class="d-flex mb-2">
                               <div>Rạp CGV</div>
                               <div class=" ml-3" >${ticket.event.cinemaName}</div>
                           </div>
                           <div class="row room-container " style="margin-top: 20px;" >
                               <div class="left-container col-6">
                                   <div class="seat-label mb-2" style="opacity: 0.5;" >Ghế</div>
                                   <div class="seat-name mb-2" >${ticket.seats}</div>
                               </div>
                               <div class="right-container col-6 pl-4 ">
                                   <div class="room-label mb-2" style="opacity: 0.5;" >PHÒNG CHIẾU</div>
                                   <div class="room-name mb-2" >${ticket.event.room.name}</div>
                               </div>
                           </div>
                           <div class="cinema-label mb-2" style="opacity: 0.5; margin-top: 20px;"  >Combo</div>
                           ${combosHTML}
                           <div class="d-flex justify-content-center mt-1">
                                <div class="qrcode cinema-label"></div>
                           </div>
                       </div>`;
       return html ;
   }
   function generateQRCodeUrl(ticket) {
       $(".qrcode").qrcode({ text: ticket.qrCode });
   }
});



