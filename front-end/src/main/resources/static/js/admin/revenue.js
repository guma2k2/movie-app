$(document).ready(function () {
    var jwt = $("input[name='token']").val();
    console.log(jwt);

    $(".sub-btn").click(function () {
        $(this).next(".sub-menu").slideToggle();
        $(this).find(".dropdown").toggleClass("rotate");
    });

    $(".item.active").removeClass("active");
    $(".item.dashboard").addClass("active");

    google.charts.load('current', {'packages': ['corechart']});
    loadSalesReportByDate();
    $("#drawChart").on('click', function () {
        loadSalesReportByDate();
    });

    $("#exportFile").on('click', function () {
        var jwt = $("input[name='token']").val(); // Get JWT token
        var startDate = $("input[name='startDate']").val();
        var endDate = $("input[name='endDate']").val();

        // Get sales data again before exporting
        getReport(startDate, endDate, jwt)
            .then(function (sales) {
                if (!sales || sales.length === 0) {
                    alert("No data available for export.");
                    return;
                }
                exportFile(sales, jwt);
            })
            .catch(function (error) {
                console.log(error);
                alert("Failed to retrieve data for export.");
            });
    });

    function exportFile(sales, jwt) {
        var url = baseUrl + "/api/v1/ticket/admin/revenue/file";

        $.ajax({
            type: "POST", // ✅ Use POST to send request body
            url: url,
            headers: {
                "Authorization": "Bearer " + jwt,
                "Content-Type": "application/json"
            },
            data: JSON.stringify(sales), // ✅ Send sales data as JSON body (not in URL)
            xhrFields: {
                responseType: 'blob' // ✅ Expect binary file response
            },
            success: function (data, status, xhr) {
                var filename = "statistics.xlsx";

                // ✅ Create a Blob from the response
                var blob = new Blob([data], { type: xhr.getResponseHeader("Content-Type") });

                // ✅ Create a link element to trigger the file download
                var link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link); // ✅ Clean up after download
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Export error:", textStatus, errorThrown);
                alert("Failed to download the file.");
            }
        });
    }



    function loadSalesReportByDate() {
        var startDate = $("input[name='startDate']").val();
        var endDate = $("input[name='endDate']").val();
        handleDrawChart(startDate, endDate, jwt);
    }

    function handleDrawChart(startDate, endDate, jwt) {
        getReport(startDate, endDate, jwt)
            .then(function (sales) {
                if (!sales || sales.length === 0) {
                    alert("No data available for the selected dates.");
                    $(".chart-table tbody").html("<tr><td colspan='4' class='text-center'>Không có dữ liệu</td></tr>");
                    return;
                }
                drawChart(sales);
                updateTable(sales);
            })
            .catch(function (error) {
                console.log(error);
                if (error.responseJSON) {
                    alert(error.responseJSON.message);
                } else {
                    alert("An error occurred.");
                }
            });
    }

    function getReport(startDate, endDate, jwt) {
        var url = baseUrl + "/api/v1/ticket/admin/revenue/between/" + startDate + "/" + endDate;
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
                    reject(jqXHR);
                }
            });
        });
    }

    function drawChart(sales) {

        // Prepare Data for Ticket Count Chart (Movies on X-axis)
        var ticketData = new google.visualization.DataTable();
        ticketData.addColumn('string', 'Tên phim');  // X-axis (Movie Title)
        ticketData.addColumn('number', 'Số vé bán ra'); // Y-axis (Ticket Count)

        sales.forEach(function (sale) {
            ticketData.addRow([sale.title, sale.ticketCount]);
        });

        // Prepare Data for Revenue Chart (Movies on X-axis)
        var revenueData = new google.visualization.DataTable();
        revenueData.addColumn('string', 'Tên phim');  // X-axis (Movie Title)
        revenueData.addColumn('number', 'Doanh thu'); // Y-axis (Revenue)

        sales.forEach(function (sale) {
            revenueData.addRow([sale.title, sale.totalRevenue]);
        });

        // Chart Styling Options
        var options = {
            title: 'Số vé bán ra theo phim',
            chartArea: {width: '85%', height: '60%'},
            colors: ['#4285F4'], // Blue color for ticket count
            hAxis: {
                title: 'Tên phim', // X-axis title
                slantedText: true, // Enables rotated text
                slantedTextAngle: 45, // Rotates movie titles
                textStyle: { fontSize: 10, bold: true, color: '#333' }
            },
            vAxis: {
                title: 'Số vé bán ra', // Y-axis title
                minValue: 0,
                gridlines: {color: '#eee', count: 5}, // Soft gridlines
                textStyle: { fontSize: 10 }
            },
            legend: {position: 'none'}
        };

        var revenueOptions = {
            title: 'Doanh thu theo phim',
            chartArea: {width: '75%', height: '60%'},
            colors: ['#34A853'], // Green color for revenue
            hAxis: {
                title: 'Tên phim', // X-axis title
                slantedText: true,
                slantedTextAngle: 45, // Rotates movie titles
                textStyle: { fontSize: 10, bold: true, color: '#333' }
            },
            vAxis: {
                title: 'Doanh thu (VND)',
                minValue: 0,
                format: 'short', // Formats large numbers (e.g., 1,500 instead of 1500)
                gridlines: {color: '#eee', count: 5},
                textStyle: { fontSize: 10 }
            },
            legend: {position: 'none'}
        };

        // Draw Ticket Count Chart (Movies on X-axis)
        var ticketChart = new google.visualization.ColumnChart(document.querySelector('.chart-sale-left'));
        ticketChart.draw(ticketData, options);

        // Draw Revenue Chart (Movies on X-axis)
        var revenueChart = new google.visualization.ColumnChart(document.querySelector('.chart-sale-right'));
        revenueChart.draw(revenueData, revenueOptions);
    }
    function updateTable(sales) {
        var tbody = $(".chart-table tbody");
        tbody.empty(); // Clear old data

        // Formatter for VND currency
        var currencyFormatter = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0
        });

        sales.forEach((sale, index) => {
            var formattedRevenue = currencyFormatter.format(sale.totalRevenue); // Convert to VND format

            var row = `
            <tr>
                <td class="text-center">${index + 1}</td>
                <td>${sale.title}</td>
                <td class="text-center">${sale.ticketCount.toLocaleString()}</td>
                <td class="text-end">${formattedRevenue}</td>
            </tr>
        `;
            tbody.append(row);
        });
    }



});
