function getTimeRemaining(endtime) {
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor((t / 1000) % 60);
  var minutes = Math.floor((t / 1000 / 60) % 60);
  var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  var days = Math.floor(t / (1000 * 60 * 60 * 24));
  return {
    'total': t,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  };
}

function initializeClock(id, endtime) {
  var clock = document.getElementById(id);
  var daysSpan = clock.querySelector('.days');
  var hoursSpan = clock.querySelector('.hours');
  var minutesSpan = clock.querySelector('.minutes');
  var secondsSpan = clock.querySelector('.seconds');

  function updateClock() {
    var t = getTimeRemaining(endtime);

    daysSpan.innerHTML = t.days;
    hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
    minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
    secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

    if (t.total <= 0) {
      clearInterval(timeinterval);
    }
  }

  updateClock();
  var timeinterval = setInterval(updateClock, 1000);
}

function myToggle(checkboxId, checkboxChecked){
  if(checkboxChecked == true) {
    $(".f-" + checkboxId).show();
  }
  else {
    $(".f-" + checkboxId).hide();
  }
}

(function($) {
  "use strict"; // Start of use strict

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function() {
    $('.navbar-collapse').collapse('hide');
  });

  // Add navbar-scrolled class when togglin navbar while on top
  $('.navbar-toggler').click(function() {
    $('.navbar').addClass('navbar-scrolled');
  });

  $('[data-toggle="tooltip"]').tooltip();

  // Only for homepage
  if ($(".page-home").length) {
    // Activate scrollspy to add active class to navbar items on scroll
    $('body').scrollspy({
      target: '#mainNav',
      offset: 75
    });

    // Collapse Navbar
    var navbarCollapse = function() {
      if ($("#mainNav").offset().top > 100) {
        $("#mainNav").addClass("navbar-scrolled");
      } else {
        $("#mainNav").removeClass("navbar-scrolled");
      }
    };
    // Collapse now if page is not at top
    navbarCollapse();
    // Collapse the navbar when page is scrolled
    $(window).scroll(navbarCollapse);


    // Smooth scrolling using jQuery easing
    $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
      if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        if (target.length) {
          $('html, body').animate({
            scrollTop: (target.offset().top - 72)
          }, 1000, "easeInOutExpo");
          return false;
        }
      }
    });
  }

  // Only for festival page
  if ($(".page-festival").length) {

    // Initialize countdown clock
    var deadline = new Date(Date.parse(new Date('january 8, 2020 18:00:00')));
    initializeClock('clockdiv', deadline); 

    // Smooth scrolling using jQuery easing
    $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
      if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        if (target.length) {
          $('html, body').animate({
            scrollTop: (target.offset().top + 2)
          }, 1000, "easeInOutExpo");
          return true;
        }
      }
    });

  }



  if($(".s-filters").length) {

    // prevent dropdown menu from closing when clicking checkbox label
    $(document).on('click', '.s-filters .dropdown-menu', function (e) {
      e.stopPropagation();
    });

    // vars to check if nothing has been clicked yet
    var kind_first_click = 0;
    var location_first_click = 0;
    $('input[type="checkbox"]').click(function(){
      var checkboxId = $(this).attr("id");
      var checkboxType = checkboxId[0];
      var checkboxChecked = $(this).prop('checked');
      console.log('kind_first_click: ' + kind_first_click);
      console.log('location_first_click: ' + location_first_click);
      console.log('checkboxId: ' + checkboxId);
      console.log('checkboxType: ' + checkboxType);
      console.log('checkboxChecked: ' + checkboxChecked);
      if (checkboxType == 'k'){
        console.log('if checkboxTypeis k');
        if (kind_first_click == 0 && checkboxChecked == true){
          $("div[class*='f-k-']").hide();
          $(".f-" + checkboxId).show();
          kind_first_click = 1;
        }
        else {
          myToggle(checkboxId, checkboxChecked);
        }
      }
      else {
        console.log('if checkboxTypeis l');
        if (location_first_click == 0 && checkboxChecked == true){
          $("div[class*='f-l-']").hide();
          $(".f-" + checkboxId).show();
          location_first_click = 1;
        }
        else {
          myToggle(checkboxId, checkboxChecked);
        }
      }
      console.log('kind_first_click: ' + kind_first_click);
      console.log('location_first_click: ' + location_first_click);     
    });
  }

})(jQuery); // End of use strict
