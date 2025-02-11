$(document).ready(function () {
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

    $('#addUserBtn').click(function () {
        $('#addUserModal').modal('show');
        populateRoleDropdown('#addUserForm #role_name');
    });

    function fetchData() {
        $.ajax({
            url: 'http://127.0.0.1:5000/select',
            type: 'GET',
            success: function (response) {
                $('#userTableBody').empty();
                response.forEach(function (output, index) {
                    let buttonText = output.is_active ? 'Deactivate' : 'Activate';
                    let buttonClass = output.is_active ? 'btn-danger' : 'btn-success';

                    $('#userTableBody').append(`
                        <tr>
                            <td>${index + 1}</td>
                            <td>${output.user_name}</td>
                            <td>${output.email_id}</td>
                            <td>${output.mobile_no}</td>
                            <td>${output.role_name}</td>
                            <td>
                                <button class="btn btn-primary btn-xs editBtn" 
                                    data-user_name="${output.user_name}" 
                                    data-email_id="${output.email_id}" 
                                    data-mobile_no="${output.mobile_no}" 
                                    data-role_name="${output.role_name}" 
                                    style="box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);">Edit</button> 
                                    
                                <button class="btn btn-warning btn-xs view" data-email_id="${output.email_id}">View</button>

                                <button class="btn btn-xs deactivateBtn ${buttonClass}" 
                                    data-email_id="${output.email_id}" 
                                    style="box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);">${buttonText}</button>
                            </td>
                        </tr>
                    `);
                });
            },
            error: function (xhr, status, error) {
                console.error('Error fetching users:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Error occurred while fetching users. Please try again.'
                });
            }
        });
    }

    fetchData();

    function populateRoleDropdown(selector, selectedRole = "") {
        $.ajax({
            url: 'http://127.0.0.1:5000/getroles',
            type: 'GET',
            success: function (response) {
                $(selector).empty();
                $(selector).append(`<option value="" disabled selected>Select Role Of User</option>`);
                response.forEach(function (role) {
                    let selected = role.role_name === selectedRole ? 'selected' : '';
                    $(selector).append(`<option value="${role.role_name}" ${selected}>${role.role_name}</option>`);
                });
            },
            error: function (xhr, status, error) {
                console.error('Error fetching roles:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Error occurred while fetching roles. Please try again.'
                });
            }
        });
    }

    $('#searchButton').click(function () {
        var searchText = $('#searchInput').val().toLowerCase();
        $('#userTableBody tr').each(function () {
            var role_name = $(this).find('td:nth-child(5)').text().toLowerCase();
            var user_name = $(this).find('td:nth-child(2)').text().toLowerCase();
            var email_id = $(this).find('td:nth-child(3)').text().toLowerCase();
            var mobile_no = $(this).find('td:nth-child(4)').text().toLowerCase();
            if (role_name.includes(searchText) || user_name.includes(searchText) || email_id.includes(searchText) || mobile_no.includes(searchText)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });

    $('#close').click(function () {
        window.location.href = 'admin_dashbord.html';
    });

    $('#addUserForm').submit(function (event) {
        event.preventDefault();
        var user_name = $('#addUserForm #user_name').val();
        var email_id = $('#addUserForm #email_id').val();
        var mobile_no = $('#addUserForm #mobile_no').val();
        var user_password = $('#addUserForm #user_password').val();
        var role_name = $('#addUserForm #role_name').val();

        if (!user_name || !email_id || !mobile_no || !user_password || !role_name) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'All fields are required.'
            });
            return false;
        }

        var user_namePattern = /^[a-zA-Z0-9_]+$/;
        if (!user_name.match(user_namePattern)) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Username must contain letters, numbers, and underscores only.'
            });
            return false;
        }

        if (user_name.length < 3 || user_name.length > 10) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Username must be between 3 and 10 characters long.'
            });
            return false;
        }

        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email_id.match(emailPattern)) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please enter a valid email address.'
            });
            return false;
        }

        var mobile_noPattern = /^[0-9]{10}$/;
        if (!mobile_no.match(mobile_noPattern)) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Mobile number must have 10 digits.'
            });
            return false;
        }

        function checkPassword(str) {
            var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
            return re.test(str);
        }

        if (!checkPassword(user_password)) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Password must have 8 characters, including one uppercase, one lowercase, letters, numbers, and one special character.'
            });
            return false;
        }

        var data = {
            user_name: user_name,
            user_password: user_password,
            email_id: email_id,
            mobile_no: mobile_no,
            role_name: role_name
        };

        $.ajax({
            url: 'http://127.0.0.1:5000/insertuser',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'User added successfully!'
                });
                $('#addUserModal').modal('hide');
                fetchData();
            },
            error: function (xhr, status, error) {
                console.error('Error adding user:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Error occurred while adding user. Please try again.'
                });
            }
        });
    });

    function deactivateUserProfile(email_id, button) {
        $.ajax({
            url: 'http://127.0.0.1:5000/aduserprofile',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ email_id: email_id }),
            success: function (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: response.message
                });

                if (response.status_code === 1) {
                    if ($(button).text() === 'Deactivate') {
                        $(button).text('Activate').removeClass('btn-danger').addClass('btn-success');
                    } else {
                        $(button).text('Deactivate').removeClass('btn-success').addClass('btn-danger');
                    }
                }
            },
            error: function (xhr, status, error) {
                console.error('Error deactivating user:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Error occurred while processing your request. Please try again.'
                });
            }
        });
    }

    $(document).on('click', '.deactivateBtn', function () {
        var email_id = $(this).data('email_id');
        var button = this;
        var action = $(button).text() === 'Deactivate' ? 'deactivate' : 'activate';

        Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to ${action} this user profile?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: `Yes, ${action} it!`,
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                deactivateUserProfile(email_id, button);
            }
        });
    });

    $(document).on('click', '.editBtn', function () {
        var user_name = $(this).data('user_name');
        var email_id = $(this).data('email_id');
        var mobile_no = $(this).data('mobile_no');
        var role_name = $(this).data('role_name');

        $('#editUserModal #user_name').val(user_name);
        $('#editUserModal #email_id').val(email_id);
        $('#editUserModal #mobile_no').val(mobile_no);
        $('#editUserModal #role_name').val(role_name);

        $('#editUserModal').modal('show');
        populateRoleDropdown('#editUserModal #role_name', role_name);
    });

    $('#editUserForm').submit(function (event) {
        event.preventDefault();

        var user_name = $('#editUserModal #user_name').val();
        var email_id = $('#editUserModal #email_id').val();
        var mobile_no = $('#editUserModal #mobile_no').val();
        var role_name = $('#editUserModal #role_name').val();

        var data = {
            user_name: user_name,
            email_id: email_id,
            mobile_no: mobile_no,
            role_name: role_name
        };

        $.ajax({
            url: 'http://127.0.0.1:5000/updateuser',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'User updated successfully!'
                });
                $('#editUserModal').modal('hide');
                fetchData();
            },
            error: function (xhr, status, error) {
                console.error('Error updating user:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Error occurred while updating user. Please try again.'
                });
            }
        });
    });

    $(document).on('click', '.view', function () {
        var email_id = $(this).data('email_id');

        $.ajax({
            type: 'POST',  // Changed from GET to POST
            url: 'http://127.0.0.1:5000/viewloginlog',
            contentType: 'application/json',  // Ensure the content type is JSON
            data: JSON.stringify({ email_id: email_id }),  // Send email_id in the request body
            success: function(response) {
                $('#loginLogTableBody').empty();
                response.forEach(function (output, index) {
                    var row = `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${output.email_id}</td>
                            <td>${output.login_time}</td>
                            <td>${output.logout_time}</td>
                        </tr>`;
                    $('#loginLogTableBody').append(row);
                });

                $('#loginLogModal').modal('show');
            },
            error: function(xhr, status, error) {
                console.error('Error fetching login logs:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Failed to fetch login logs. Please try again later.'
                });
            }
        });
    });

});
