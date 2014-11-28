(function(window, document, $) {
    $(document).ready(function() {
        $('#theo-nav-btn').click(function() {
            $('#theo-content').toggle();
        });
        $('#theo-content a').click(function(){
            $('#theo-content').hide();
        });
        $('#theo-top-btn').click(function(e) {
            $('.body-inner').animate({
                scrollTop: 0
            }, 800);
            e.stopPropagation();
        });
    });

}(window, document, jQuery))


