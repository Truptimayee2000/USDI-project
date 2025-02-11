$(document).ready(function () {
    // Logout functionality
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

    // Add Catalogue button click
    $('#addCatalogueBtn').click(function () {
        $('#addCatalogueModal').modal('show');
    });

    // Close button click
    $('#close').click(function () {
        window.location.href = 'admin_dashbord.html';
    });

    // Function to fetch catalogue data and populate the table
    function fetchData() {
        $.ajax({
            url: 'http://127.0.0.1:5000/catalogue',
            type: 'GET',
            success: function (response) {
                $('#catalogueTable').empty();
                response.forEach(function (output, index) {
                    localStorage.setItem(output.catalogue_id, JSON.stringify({
                        table_name: output.table_name,
                        dataset_name: output.dataset_name
                    }));
                    let buttonText = output.is_active ? 'Deactivate' : 'Activate';
                    let buttonClass = output.is_active ? 'btn-danger' : 'btn-success';

                    $('#catalogueTable').append(`
                        <tr>
                            <td>${index + 1}</td>
                            <td>${output.dataset_name}</td>
                            <td>${output.schema_name}</td>
                            <td>${output.table_name}</td>
                            <td>${output.data_type}</td>
                            <td>
                                <button class="btn btn-primary btn-xs editBtn" 
                                    data-catalogue_id="${output.catalogue_id}" 
                                    data-dataset_name="${output.dataset_name}" 
                                    data-schema_name="${output.schema_name}" 
                                    data-table_name="${output.table_name}" 
                                    data-data_type="${output.data_type}"
                                    style="box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);">Edit</button>

                                <button class="btn btn-warning btn-xs view" data-catalogue-id="${output.catalogue_id}" data-table-name="${output.table_name}" style="box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);">View</button>

                                <button href="#" class="btn btn-xs deactivateBtn ${buttonClass}" data-dataset_name="${output.dataset_name}" style="box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);">${buttonText}</button>
                            </td>
                        </tr>
                    `);
                });

                $('.view').click(function () {
                    var catalogueId = $(this).data('catalogue-id');
                    var tableName = $(this).data('table-name');
                    
                    var url = `map1.html?catalogueId=${catalogueId}&tableName=${tableName}`;
                    window.location.href = url;
                });
            },
            error: function (xhr, status, error) {
                console.error("Error fetching data:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error fetching data. Please try again.'
                });
            }
        });

    }

    // Initial fetch of catalogue data
    fetchData();

    $('#searchButton').click(function () {
        var searchText = $('#searchInput').val().toLowerCase();

        // Filter table rows based on search text
        $('#catalogueTable tr').each(function () {
            var dataset_name = $(this).find('td').text().toLowerCase();
            var schema_name = $(this).find('td').text().toLowerCase();
            var table_name = $(this).find('td').text().toLowerCase();
            var data_type = $(this).find('td').text().toLowerCase();
           
            if (dataset_name.includes(searchText) || schema_name.includes(searchText) || table_name.includes(searchText) || data_type.includes(searchText)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });

    });


    

    // Edit button click
    $(document).on('click', '.editBtn', function () {
        var catalogue_id = $(this).data('catalogue_id');
        var dataset_name = $(this).data('dataset_name');
        var schema_name = $(this).data('schema_name');
        var table_name = $(this).data('table_name');
        var data_type = $(this).data('data_type');

        $('#editCatalogue_id').val(catalogue_id);
        $('#editDatasetName').val(dataset_name);
        $('#editSchemaName').val(schema_name);
        $('#editTableName').val(table_name);
        $('#editDataType').val(data_type);

        $('#editCatalogueModal').modal('show');
    });

    // Deactivate/Activate button click
    $(document).on('click', '.deactivateBtn', function () {
        var dataset_name = $(this).data('dataset_name');
        var button = this;
        var action = $(button).text() === 'Deactivate' ? 'deactivate' : 'activate';
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to ' + action + ' this catalogue?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, ' + action + ' it!',
            cancelButtonText: 'No, cancel!'
        }).then((result) => {
            if (result.isConfirmed) {
                deactivateCatalogue(dataset_name, button);
            }
        });
    });

    function deactivateCatalogue(dataset_name, button) {
        $.ajax({
            url: 'http://127.0.0.1:5000/adcatalogue',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ dataset_name: dataset_name }),
            success: function (response) {
                Swal.fire({
                    icon: response.status_code === 1 ? 'success' : 'error',
                    title: response.status_code === 1 ? 'Success' : 'Error',
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
                console.error("Error:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error occurred. Please try again.'
                });
            }
        });
    }

    // Add Catalogue Form submission
    $('#addCatalogueForm').submit(function (event) {
        event.preventDefault();
        var dataset_name = $('#dataset_name').val();
        var schema_name = $('#schema_name').val();
        var table_name = $('#table_name').val();
        var data_type = $('#data_type').val();

        // Validate the input fields
        if (!dataset_name || !schema_name || !table_name || !data_type) {
            Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: 'Please fill out all fields.'
            });
            return false;
        }

        var data = {
            dataset_name: dataset_name,
            schema_name: schema_name,
            table_name: table_name,
            data_type: data_type
        };

        $.ajax({
            url: 'http://127.0.0.1:5000/addcatalogue',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Catalogue added successfully!'
                });
                $('#addCatalogueModal').modal('hide');
                fetchData();
            },
            error: function (xhr, status, error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error occurred while adding catalogue. Please try again.'
                });
            }
        });
    });

    // Edit Catalogue Form submission
    $('#editCatalogueForm').submit(function (event) {
        event.preventDefault();
        var catalogue_id = $('#editCatalogue_id').val();  // Include the catalogue_id
        var dataset_name = $('#editDatasetName').val();
        var schema_name = $('#editSchemaName').val();
        var table_name = $('#editTableName').val();
        var data_type = $('#editDataType').val();

        // Validate the input fields
        if (!dataset_name || !schema_name || !table_name || !data_type) {
            Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: 'Please fill out all fields.'
            });
            return false;
        }

        var data = {
            catalogue_id: catalogue_id,  // Add catalogue_id to the data object
            dataset_name: dataset_name,
            schema_name: schema_name,
            table_name: table_name,
            data_type: data_type
        };

        $.ajax({
            url: 'http://127.0.0.1:5000/updatecatalogue',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Catalogue updated successfully!'
                });
                $('#editCatalogueModal').modal('hide');
                fetchData();
            },
            error: function (xhr, status, error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error occurred while updating catalogue. Please try again.'
                });
            }
        });
    });
    
  
});
