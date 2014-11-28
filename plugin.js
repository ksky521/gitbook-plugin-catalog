(function(window, document, $) {
    $(document).ready(function() {
        $(document).on('click', '#theo-nav-btn', function() {
            $('#theo-content').toggle();
        }).on('click', '#theo-content a', function() {
            $('#theo-content').hide();
        }).on('click', '#theo-top-btn', function(e) {
            $('.body-inner').animate({
                scrollTop: 0
            }, 'fast');
            e.stopPropagation();
        });
    });

}(window, document, jQuery))
