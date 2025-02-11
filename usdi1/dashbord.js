$(document).ready(function () {
    $('#f_id').load('footer.html');
    
    if (localStorage.getItem('user_id') === undefined || localStorage.getItem('user_id') == '' || localStorage.getItem('user_id') == null) {
        window.location.href = 'login.html';
    } else {
        $('#logout').click(function (event) {
            event.preventDefault();

            var user_id = localStorage.getItem('user_id');
            var data = {
                user_id: user_id
            };

            $.ajax({
                type: 'POST',
                url: 'http://127.0.0.1:5000/logout',
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function(response) {
                    if (response.status === 1) {
                        localStorage.removeItem('user_id');
                        showAlert('Logout Successful', 'success');
                        setTimeout(function () {
                            window.location.href = 'login.html';
                        }, 2000);
                    } else {
                        showAlert('Logout unsuccessful. Please try again.', 'error');
                    }
                },
                error: function(xhr, status, error) {
                    showAlert('An error occurred. Please try again later.', 'error');
                    console.error('Error:', error);
                }
            });
        });
    }

    $.ajax({
        url: 'http://127.0.0.1:5000/total_users',  // Your Flask API endpoint
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            // Update the total users count in the HTML
            $('#total-users').text(data['total users']);

            // Update the total vector data count in the HTML
            $('#total-vector').text(data['total_vector_data']);

            $('#total-raster').text(data['total_raster_data']);

            $('#total-wms').text(data['total_wms']);
        },
        error: function(xhr, status, error) {
            console.error('Error fetching total users and vector data:', error);
            $('#total-users').text('Error fetching data');
            $('#total-vector').text('Error fetching data');
        }
    });
   
});

function showAlert(message, type) {
    Swal.fire({
        icon: type === 'success' ? 'success' : 'error',
        title: type === 'success' ? 'Success!' : 'Error!',
        text: message
    });
}
