$(document).ready(function() {
    $('#h_id').load("header.html");
    $('#f_id').load("footer.html") 
    // Toggle FAQ answers
    $('.question').click(function() {
        $(this).next('.answer').toggleClass('active');
        $(this).find('i').toggleClass('fa-plus fa-minus');
    });

    

    // Search functionality
    $('#searchInput').on('keyup', function() {
        var value = $(this).val().toLowerCase();
        $('.faq-section').filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });
});
