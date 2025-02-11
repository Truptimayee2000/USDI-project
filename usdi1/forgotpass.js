$(document).ready(function () {
    $('#h_id').load("header.html");
    $('#f_id').load("footer.html");
    $('form').submit(function (event) {
        event.preventDefault();
        var email_id= $('#email_id').val();
        var new_password = $('#new_password').val();
        var confirmPassword = $('input[name="confirmpassword"]').val();


        if (email_id === '') {
            alert('Please enter your email.');
            return false;
        }
        if (new_password === '') {
            alert('Please enter your new password.');
            return false;
        }
        if (confirmPassword === '') {
            alert('Please confirm your new password.');
            return false;
        }
        if (new_password !== confirmPassword) {
            alert('Passwords do not match.');
            return false;
        }

        submitForm();
    });

    function submitForm() {
        var email_id = $('#email_id').val();
        var new_password = $('#new_password').val();

        var data = {
            email_id: email_id,
            new_password: new_password
        };

        // AJAX request
        $.ajax({
            type: 'POST',
            url: 'http://127.0.0.1:5000/forgot_password',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (response) {
                alert('Password successfully changed!');
                window.location.href = 'login.html';
            },
            error: function (xhr, status, error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again later.');
            }
        });
    }
});
