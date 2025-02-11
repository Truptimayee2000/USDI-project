$(document).ready(function () {    
    // Logout button click event
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

    // Close button click event
    $('#close').click(function () {
        window.location.href = 'admin_dashbord.html';
    });

    // Add Metadata button click event
    $('#addMetadata').click(function() {
        $('#addMetadataModal').modal('show');
        populateDatasetDropdown();
    });
  
    // Object to cache metadata details
    var metadataCache = {};

    // Function to fetch metadata
    function fetchData() {
        $.ajax({
            url: 'http://127.0.0.1:5000/selectmetadata',
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                var tbody = $('#metadataTableBody');
                tbody.empty(); 
                response.forEach(function (metadata, index) {
                    let buttonText = metadata.is_active ? 'Deactivate' : 'Activate';
                    let buttonClass = metadata.is_active ? 'btn-danger' : 'btn-success';
                    tbody.append(`
                        <tr>
                            <td>${index + 1}</td>
                            <td>${metadata.dataset_name}</td>
                            <td>
                                <button class="btn btn-warning btn-xs view" data-dataset_name="${metadata.dataset_name}">View</button>
                                <button class="btn btn-primary btn-xs editBtn" data-dataset_name="${metadata.dataset_name}"
                                                                               data-data_source="${metadata.data_source}"  
                                                                               data-data_format="${metadata.data_format}">Edit</button>
                                <button href="#" class="btn btn-xs deactivateBtn ${buttonClass}" data-dataset_name="${metadata.dataset_name}" style="box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);">${buttonText}</button>
                            </td>
                        </tr>
                    `);

                    // Cache metadata details
                    metadataCache[metadata.dataset_name] = metadata;
                });
            },
            error: function(xhr, status, error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error fetching data. Please try again later.'
                });
            }
        });
    }
  
    fetchData();

    // Function to populate dataset name dropdown
    function populateDatasetDropdown() {
        $.ajax({
            url: 'http://127.0.0.1:5000/getdataset_name',
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                var dropdown = $('#dataset_name');
                dropdown.empty(); // Clear existing options
                dropdown.append('<option value="" disabled selected>Select Dataset Name</option>');
                response.forEach(function (output) {
                    dropdown.append(`<option value="${output.dataset_name}">${output.dataset_name}</option>`);
                });
            },
            error: function(xhr, status, error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error fetching dataset names. Please try again later.'
                });
            }
        });
    }

    // View button click event
    $(document).on('click', '.view', function () {
        var dataset_name = $(this).data('dataset_name');
        var metadata = metadataCache[dataset_name];

        if (metadata) {
            $('#metadataDetails').html(`
                <div>
                    <p><strong>Dataset Name:</strong> ${metadata.dataset_name}</p>
                    <p><strong>Data Source:</strong> ${metadata.data_source}</p>
                    <p><strong>Data Format:</strong> ${metadata.data_format}</p>
                    <p><strong>Created On:</strong> ${metadata.created_on}</p>
                    <p><strong>Last Updated:</strong> ${metadata.updated_on}</p>
                    <p><strong>Created By:</strong> ${metadata.created_by}</p>
                    <p><strong>Updated By:</strong> ${metadata.updated_by}</p>
                </div>
                <hr>
            `);
            $('#viewModalLabel').text("Metadata Details for " + dataset_name); 
            $('#viewModal').modal('show'); // Show the modal
        } else {
            console.error("Metadata details not found for dataset_name:", dataset_name);
        }
    });

    // Add Metadata form submission
    $('#addMetadataForm').submit(function(event) {
        event.preventDefault();
        var dataset_name = $('#dataset_name').val();
        var data_source = $('#data_source').val();
        var data_format = $('#data_format').val();

        // Validate the input fields
        if (!dataset_name || !data_source || !data_format) {
            Swal.fire({
                icon: 'warning',
                title: 'Validation Error',
                text: 'Please fill out all fields.'
            });
            return false;
        }

        var data = {
            dataset_name: dataset_name,
            data_source: data_source,
            data_format: data_format
        };

        $.ajax({
            url: 'http://127.0.0.1:5000/addmetadata',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Metadata added successfully!'
                });
                $('#addMetadataModal').modal('hide');
                fetchData();
            },
            error: function(xhr, status, error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error occurred while adding metadata. Please try again.'
                });
            }
        });
    });

    // Edit button click event
    $(document).on('click', '.editBtn', function() {
        var dataset_name = $(this).data('dataset_name');
        var data_source = $(this).data('data_source');
        var data_format = $(this).data('data_format');
  
        $('#editDatasetName').val(dataset_name);
        $('#editDatasource').val(data_source);
        $('#editDataformat').val(data_format);
  
        $('#editMetadataModal').modal('show');
    });

    // Edit Metadata form submission
    $('#editMetadataForm').submit(function(event) {
        event.preventDefault();
        var dataset_name = $('#editDatasetName').val();
        var data_source = $('#editDatasource').val();
        var data_format = $('#editDataformat').val();
    
        // Validate the input fields
        if (!dataset_name || !data_source || !data_format) {
            Swal.fire({
                icon: 'warning',
                title: 'Validation Error',
                text: 'Please fill out all fields.'
            });
            return false;
        }
    
        var data = {
            dataset_name: dataset_name,
            data_source: data_source,
            data_format: data_format
        };
    
        $.ajax({
            url: 'http://127.0.0.1:5000/updatemetadata',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Metadata updated successfully!'
                });
                $('#editMetadataModal').modal('hide');
                fetchData();
            },
            error: function(xhr, status, error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error occurred while updating metadata. Please try again.'
                });
            }
        });
    });

    // Search functionality
    $('#searchButton').click(function () {
        var searchText = $('#searchInput').val().toLowerCase();

        // Filter table rows based on search text
        $('#metadataTableBody tr').each(function () {
            var dataset_name = $(this).find('td').text().toLowerCase();
           
            if (dataset_name.includes(searchText)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });

    // Deactivate/Activate button click
    $(document).on('click', '.deactivateBtn', function() {
        var dataset_name = $(this).data('dataset_name');
        var button = this;
        var action = $(button).text() === 'Deactivate' ? 'deactivate' : 'activate';
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            text: 'Do you really want to ' + action + ' this metadata?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                deactivateMetadata(dataset_name, button);
            }
        });
    });
    
    function deactivateMetadata(dataset_name, button) {
        $.ajax({
            url: 'http://127.0.0.1:5000/admetadata',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ dataset_name: dataset_name }),
            success: function(response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: response.message
                });
                if (response.status_code === 1) {
                    fetchData(); // Fetch the latest state after update
                }
            },
            error: function(xhr, status, error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error occurred. Please try again.'
                });
            }
        });
    }
});
