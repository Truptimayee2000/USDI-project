$(document).ready(function () {
  $('#h_id').load("header.html");
  $('#f_id').load("footer.html");

  // Function to display alert messages using SweetAlert
  function showAlert(message, type) {
      Swal.fire({
          icon: type === 'success' ? 'success' : 'error',
          title: type === 'success' ? 'Success!' : 'Error!',
          text: message
      });
  }

  // Form submission handler
  $('#registration-form').submit(function (event) {
      event.preventDefault(); // Prevent the form from submitting normally

      var user_name = $('#user_name').val();
      var email_id = $('#email_id').val();
      var mobile_no = $('#mobile_no').val();
      var user_password = $('#user_password').val();
      var confirmPassword = $('#confirmPassword').val();

      // Validation for user inputs
      if (user_name === "") {
          showAlert('Please enter your username.', 'error');
      } else if (email_id === "") {
          showAlert('Please enter your email.', 'error');
      } else if (mobile_no === "") {
          showAlert('Please enter your mobile number.', 'error');
      } else if (user_password === "") {
          showAlert('Please enter your password.', 'error');
      } else if (confirmPassword === "") {
          showAlert('Please confirm your password.', 'error');
      } else {
          // Username format validation
          var user_nameRegex = /^[a-zA-Z0-9_]+$/;
          if (!user_name.match(user_nameRegex)) {
              showAlert('Username must contain letters, numbers, and underscores only.', 'error');
          } else if (user_name.length < 3 || user_name.length > 10) {
              showAlert('Username must be between 3 and 10 characters long.', 'error');
          } else {
              // Validation for mobile number
              var mobile_noRegex = /^[0-9]{10}$/;
              if (!mobile_no.match(mobile_noRegex)) {
                  showAlert('Mobile number must have 10 digits.', 'error');
              } else {
                  // Password validation function
                  function isValidPassword(password) {
                      var passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
                      return passwordRegex.test(password);
                  }

                  // Password validation
                  if (!isValidPassword(user_password)) {
                      showAlert('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.', 'error');
                  } else if (user_password !== confirmPassword) { // Password confirmation validation
                      showAlert('Passwords do not match.', 'error');
                  } else {
                      // If all validations pass, proceed with AJAX request
                      var data = {
                          user_name: user_name,
                          email_id: email_id,
                          mobile_no: mobile_no,
                          user_password: user_password
                      };

                      $.ajax({
                          type: 'POST',
                          url: 'http://127.0.0.1:5000/registration',
                          contentType: 'application/json',
                          data: JSON.stringify(data),
                          success: function (response) {
                              showAlert('Successfully Registered.', 'success');
                              setTimeout(function () {
                                  window.location.href = 'login.html';
                              }, 3000); // Redirect to login page after 3 seconds
                          },
                          error: function (xhr, status, error) {
                              showAlert('An error occurred. Please try again later.', 'error');
                              console.error('Error:', error);
                          }
                      });
                  }
              }
          }
      }
  });
});
