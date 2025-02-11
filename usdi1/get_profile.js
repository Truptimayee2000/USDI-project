$(document).ready(function() {
  var userId = localStorage.getItem('user_id');

  if (userId) {
    $.ajax({
      url: 'http://127.0.0.1:5000/get_profile', 
      type: 'GET',
      data: {
        user_id: userId
      },
      success: function(response) {
        if (response.status === 1) {
          // If profile data fetched successfully
          var profile = response.profile;
          $('#user_name').val(profile.user_name);
          $('#email_id').val(profile.email_id);
          $('#mobile_no').val(profile.mobile_no);
        } else {
          // If there was an error or user ID not found
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: response.message,
          });
        }
      },
      error: function(xhr, status, error) {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error fetching user profile data.',
        });
      }
    });
  } else {
    Swal.fire({
      icon: 'warning',
      title: 'User ID not found',
      text: 'User ID not found in local storage. Please log in again.',
    });
  }

  $('#editProfileBtn').click(function(e) {
    e.preventDefault(); 

    var formData = {
      user_id: userId,
      user_name: $('#user_name').val(),
      mobile_no: $('#mobile_no').val()
    };

    $.ajax({
      type: 'POST',
      url: 'http://127.0.0.1:5000/update_profile', 
      data: JSON.stringify(formData),
      contentType: 'application/json',
      success: function(response) {
        if (response.status === 1) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Profile updated successfully!',
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = 'get_profile.html';
            }
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: 'Failed to update profile: ' + response.message,
          });
        }
      },
      error: function(xhr, status, error) {
        console.error('Failed to update profile:', error);
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: 'Failed to update profile. Please try again later.',
        });
      }
    });
  });

  $('#closeBtn').click(function() {
    window.location.href = 'citizen_dashbord.html';
  });
  
});
