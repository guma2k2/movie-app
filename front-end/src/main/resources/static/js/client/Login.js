$(function () {
    $("#btn-google").on("click", function () {
        var callbackUrl = "http://localhost:8000/authenticate";
        var authUrl = "https://accounts.google.com/o/oauth2/auth";
        var googleClientId = "432352633789-2sr5oickn1f17lbrg8f689tn3fnhv5hu.apps.googleusercontent.com";

        var targetUrl = `${authUrl}?redirect_uri=${encodeURIComponent(callbackUrl)}&response_type=code&client_id=${googleClientId}&scope=openid%20email%20profile`;

        window.location.href = targetUrl;
    });
});
