(function($) {
  function swipeEvent(){
    this.delegateType = 'touchstart';
    this.bindType = 'touchstart';
    this.handle = function(event){
      //var eventReturn = null;
      var minDistance = 4;
      var startEvent = event;
      var startX = startEvent.originalEvent.touches[0].clientX;
      var startY = startEvent.originalEvent.touches[0].clientY;
      var endX;
      var endY;
      var currentType = null;
      var $window = $(window);
      var eventName = startEvent.handleObj.origType;
      var handler = startEvent.handleObj.handler;
      
      // track finger position
      $window.bind('touchmove.'+eventName,function(event){
        endX = event.originalEvent.touches[0].clientX;
        endY = event.originalEvent.touches[0].clientY;
        // keep the element from moving on touch
        //event.preventDefault();
      });
      
      // finger has lifted... do some stuff
      $window.bind('touchend.'+eventName,function(event){
        var distanceX = Math.abs(startX - endX);
        var distanceY = Math.abs(startY - endY);

        // determine the swipe type
        if(distanceX > distanceY && distanceX >= minDistance){
          if(startX > endX){
            currentType = 'swipeleft';
          }else{
            currentType = 'swiperight';
          }
        }else if(distanceY >= minDistance){
          if(startY > endY){
            currentType = 'swipeup';
          }else{
            currentType = 'swipedown';
          }
        }
        
        // remove touch events
        $window.unbind('touchmove.'+eventName);
        $window.unbind('touchend.'+eventName);

        // call the event handler
        if(currentType == eventName){
          handler.apply(startEvent.currentTarget,arguments);
        }else{
          return startEvent.currentTarget;
        }
      });
    };
  }
  // create swipe events
  jQuery.event.special.swipeleft = new swipeEvent();
  jQuery.event.special.swiperight = new swipeEvent();
  jQuery.event.special.swipeup = new swipeEvent();
  jQuery.event.special.swipedown = new swipeEvent();
})(jQuery);