$(document).ready(function () {
    $(".item.active").removeClass("active");
    $(".item.booking").addClass("active");
    var jwt = $("input[name='token']").val();
    var prevButton = $("ul.pagination li:first-child");
    var nextButton = $("ul.pagination li:last-child");
    var totalPage = $("input[name='totalPage']").val();
    var page = $(".page-item.active").data("page");
    var sizePage = $("input[name='sizePage']").val();
    if (page === 1) {
        prevButton.hide();
    } else if (page === totalPage) {
        nextButton.hide();
    } else {
        prevButton.show();
        nextButton.show();
    }
    $("ul.pagination").on("click", "a.page-link", function (e) {
        e.preventDefault();
        var currentPage;
        if ($(this).attr("aria-label") === "Previous") {
            currentPage = page - 1;
        } else if ($(this).attr("aria-label") === "Next") {
            currentPage = page + 1;
        } else {
            currentPage = $(this).closest("li").data("page");
        }

        page = currentPage;
        if (page === 1) {
            prevButton.hide();
            nextButton.show();
        } else if (page == totalPage) {
            nextButton.hide();
            prevButton.show();
        } else {
            prevButton.show();
            nextButton.show();
        }
        $(".page-item").removeClass("active");
        $("li[data-page =" + page + "]").addClass("active");
        var action = '';
        handlePaginate(page, jwt, action);
    });

    function handlePaginate(currentPage, jwt, action) {
        getBookingPaginate(currentPage, jwt)
            .then(function (res) {
                $(".table-list").empty();
                var bookings = res.results;
                var paginate = res.paginate;
                totalPage = paginate.totalPage;
                sizePage = paginate.sizePage;
                page = currentPage;
                var totalElements = paginate.totalElements;
                var html = '';
                $.each(bookings, function (index, booking) {
                    let formattedAmount = new Intl.NumberFormat('vi-VN').format(booking.total_amount) + " VND";
                    let formattedDate = new Date(booking.created_time).toLocaleString('vi-VN', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit', hour12: false
                    });

                    html += '<tr>' +
                        '<td>' +
                        '<a href="/admin/booking/' + booking.id + '">' + booking.id + '</a>' + // Added booking.id as link text
                        '</td>' +
                        '<td>' + booking.event.movie.title + '</td>' +
                        '<td>' +
                        '<span>' + booking.event.start_date + '</span>&nbsp;' +
                        '<span>' + booking.event.start_time + '</span>' +
                        '</td>' +
                        '<td>' +
                        '<span>' + booking.event.room.name + '</span>&nbsp;' +
                        '<span>' + booking.event.cinemaName + '</span>' +
                        '</td>' +
                        '<td>' + booking.status + '</td>' +
                        '<td>' + formattedAmount + '</td>' +
                        '<td>' + formattedDate + '</td>' +
                        '</tr>';

                });


                $(".table-list").html(html);
                if (totalElements <= sizePage) {
                    $(".pagination").empty();
                } else if (action !== '') {
                    $(".pagination").empty();
                    var changeHtml = '<li class="page-item">' +
                        '<a class="page-link" href="#" aria-label="Previous">' +
                        '<span aria-hidden="true">&laquo;</span>' +
                        '<span class="sr-only">Previous</span>' +
                        '</a>' +
                        '</li>';
                    for (var i = 1; i <= totalPage; i++) {
                        var thClass = (i == currentPage ? 'page-item active' : 'page-item');
                        changeHtml += '<li class="' + thClass + '" data-page="' + i + '" > <a class="page-link" href="#">' + i + '</a></li>';
                    }
                    changeHtml += '<li class="page-item">' +
                        '<a class="page-link" href="#" aria-label="Next">' +
                        '<span aria-hidden="true">&raquo;</span>' +
                        '<span class="sr-only">Next</span>' +
                        '</a>' +
                        '</li>';
                    $(".pagination").html(changeHtml);
                }
                prevButton = $("ul.pagination li:first-child");
                nextButton = $("ul.pagination li:last-child");
                if (page === 1) {
                    prevButton.hide();
                } else if (page === totalPage) {
                    nextButton.hide();
                } else {
                    prevButton.show();
                    nextButton.show();
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    }
    function getBookingPaginate(currentPage, jwt) {
        var url = baseUrl + "/api/v1/admin/bookings/paginate?pageNum=" + currentPage;
        var headers = { "Authorization": "Bearer " + jwt };
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "GET",
                contentType: "application/json",
                url: url,
                headers: headers,
                success: function (data) {
                    resolve(data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    reject(errorThrown);
                }
            });
        });
    }
});