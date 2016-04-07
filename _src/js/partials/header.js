var $ = jQuery = require('jquery');

/**
 * Open / close public navigation
 */

 $(function(){
    $(document).on('click', '.js-nav-opener', function(e){
        $(this).toggleClass('open');
        $('.js-navigation').toggleClass('visible');
        e.preventDefault();
    });   
});
