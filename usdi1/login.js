$(document).ready(function(){
    $('#h_id').load('header.html');
    $('#f_id').load('footer.html');
    
    // Function to display alert messages using SweetAlert
    function showAlert(message, type) {
        Swal.fire({
            icon: type === 'success' ? 'success' : 'error',
            title: type === 'success' ? 'Success!' : 'Error!',
            text: message
        });
    }

    $('#submit').click(function(event) {
        event.preventDefault(); 

        var email_id = $('#email_id').val();
        var user_password = $('#user_password').val();

        // Create data object to send in AJAX request
        var data = {
            email_id: email_id,
            user_password: user_password
        };

        $.ajax({
            type: 'POST',
            url: 'http://127.0.0.1:5000/login',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response) {
                if (response.status === 1) {
                    var user_id = response.user_id;
                    var user_role = response.role;
                    localStorage.setItem('user_id', user_id);
                    localStorage.setItem('user_role', user_role);
                    showAlert('Login Successful', 'success');
                    setTimeout(function() {
                        switch (user_role) {
                            case 'admin':
                                window.location.href = 'admin_dashbord.html';
                                break;
                            case 'citizen':
                                window.location.href = 'citizen_dashbord.html';
                                break;
                        }
                    }, 2000);
                } else {
                    showAlert('Invalid username or password.', 'error');
                }
            },
            error: function(xhr, status, error) {
                // Handle errors (e.g., network issues)
                showAlert('An error occurred. Please try again later.', 'error');
                console.error('Error:', error);
            }
        });
    });
});
