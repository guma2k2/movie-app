$(document).ready(function () {
        //jquery for toggle sub menus
    $(".sub-btn").click(function () {
      $(this).next(".sub-menu").slideToggle();
      $(this).find(".dropdown").toggleClass("rotate");
    });

    //jquery for expand and collapse the sidebar
    $(".menu-btn").click(function () {
      $(".side-bar").toggleClass("active");
      $(".main").toggleClass("active");
    });
});