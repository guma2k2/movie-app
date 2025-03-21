$(document).ready(function () {
    $("form").submit(function (event) {
        var password = $("#password").val();
        var confirmPassword = $("#confirmPassword").val();

        if (password !== confirmPassword) {
            alert("Mật khẩu và xác nhận mật khẩu không khớp!"); // Show error message
            event.preventDefault(); // Prevent form submission
        }
    });
});