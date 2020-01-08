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

function myToggle(){
  if (!$('.checkbox-k:checked').length == 0) {
    $('.s-item').hide();
    $('.checkbox-k').each(function(){
      var k_id = $(this).attr("id");
      if($(this).prop('checked')) {
        $(".f-" + k_id).show();
      }
    });
    if (!$('.checkbox-l:checked').length == 0) {
      $('.checkbox-l').each(function(){
        if(!$(this).prop('checked')){
          var l_id = $(this).attr("id");
          $('.f-' + l_id).each(function(){
            if ($(this).is(':visible')){
              $($(this)).hide();
            }
          });
        }
      });
    }
  }
  else {
    $('.s-item').hide();
    $('.checkbox-l').each(function(){
      var l_id = $(this).attr("id");
      if($(this).prop('checked')) {
        $(".f-" + l_id).show();
      }
    });
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
    var festival_start = new Date(Date.parse(new Date('january 8, 2020 18:00:00')));
    var festival_end = new Date(Date.parse(new Date('january 12, 2020 20:00:00')));
    var date_now = Date.now();
    
    if(date_now < festival_start){
      $('#it-soon').show();
      initializeClock('clockdiv', festival_start);
      $('#clockdiv').show();
    }
    else if(date_now < festival_end){
      $('#it-current').show();
      initializeClock('clockdiv', festival_end);
      $('#clockdiv').show();
    }
    else {
      $('#it-finish').show();  
    }

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

    // vars to check if nothing has been clicked yet (start mode)
    var first_click = 0;
    $('input[type="checkbox"]').click(function(){
      var checkboxId = $(this).attr("id");
      var checkboxType = checkboxId[0];
      var checkboxChecked = $(this).prop('checked');
      if (first_click == 0 && checkboxChecked == true){
        $(".s-item").hide();
        $(".f-" + checkboxId).show();
        first_click = 1;
      }
      else {
        myToggle();
      }
      //if nothing is checked display everything (back to start)
      if ($('input[type="checkbox"]:checked').length == 0) {
        $(".s-item").show();
        first_click = 0;
      }
    });
  }

})(jQuery); // End of use strict
