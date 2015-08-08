;(function($) {
    $(document).ready(function() {
        // allow the example links to fill and trigger the filtering
        $('.fill-filter').on('click', function(ev) {
            ev.preventDefault();
            $('.filter-table input').val($(this).text()).focus().trigger('click');
        });
    });
})(jQuery);
