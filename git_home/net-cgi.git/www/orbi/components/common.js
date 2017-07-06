$(function(){

  $(".dropdown-menu li a").click(function(){

	var selectionWrapper = $(this).parent().parent();
	selectionWrapper.find('a.active').removeClass("active");
	$(this).addClass("active");

	var selection = $(this).parent().parent().parent().find("button span").first();
	$(selection).html($(this).text());

	var sdasa = $(selection).parent().prev();
	var customVal = $(this)[0].innerText;

	var akjska = $(this).parent().parent().parent().find('span').html(customVal);
	var alsjdalksd = $(this).parent();

	$(selection).parent().prev().html(customVal);
});

$('ul li a').click(function(event){
  event.preventDefault();
});

  $(".button-nav").click(function(e){
      var rippler = $(this);

      // create .ink element if it doesn't exist
      if(rippler.find(".ink").length == 0) {
          rippler.append("<span class='ink'></span>");
      }

      var ink = rippler.find(".ink");

      // prevent quick double clicks
      ink.removeClass("animate");

      // set .ink diametr
      if(!ink.height() && !ink.width())
      {
          var d = Math.max(rippler.outerWidth(), rippler.outerHeight());
          ink.css({height: d, width: d});
      }

      // get click coordinates
      var x = e.pageX - rippler.offset().left - ink.width()/2;
      var y = e.pageY - rippler.offset().top - ink.height()/2;

      // set .ink position and add class .animate
      ink.css({
        top: y+'px',
        left:x+'px'
      }).addClass("animate");
  });

  $('.input-wrapper').on('click', function (e) {

    var title = $(this).find(".input-title")[0];
    var isddl = title.className.indexOf('ddl-title') > -1;

      if(isddl){
        return true;
      }

      $(this).find(".input-title").addClass('active');
      $(this).find('input').focus();
      e.preventDefault();
  });

  $('.input-wrapper input').focus(function (e) {

      var parentWrapper = $(this).parent();

      parentWrapper.find(".input-title").addClass('active');

      e.preventDefault();
  });

  $('input').on('blur', function () {
      $(this).parent().find(".input-title").removeClass('active').removeClass('non-active-val');
      if($(this).val()){
        $(this).parent().find(".input-title").addClass('non-active-val');
      }


      //Ip box
      var isIpBox = this.className.indexOf('ip-box') > -1;
      if(isIpBox){
        var boxValue = $(this).val();
        var boxLimitValue = 255;

        if(boxValue > boxLimitValue){
          $(this).val(boxLimitValue);
        }
      }
      
      var inputObj = $(this);
      var re=/<script[^>]*>[\d\D]*?<\/script>/ig;
      inputObj.val(inputObj.val().replace(re,''));

  });

  setTimeout (function(){
    $("input:radio:first").prop("checked", true).trigger("click");
  },500);

});
