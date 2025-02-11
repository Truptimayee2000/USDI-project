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
        window.location.href = 'citizen_dashbord.html';
    });

    // Add Metadata button click event
    $('#addMetadata').click(function() {
        $('#addMetadataModal').modal('show');
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
                    tbody.append(`
                        <tr>
                            <td>${index + 1}</td>
                            <td>${metadata.dataset_name}</td>
                            <td>
                                <button class="btn btn-primary btn-xs view" data-dataset_name="${metadata.dataset_name}">View</button>
                            </td>
                        </tr>
                    `);

                    // Cache metadata details
                    metadataCache[metadata.dataset_name] = metadata;
                });
            },
            error: function(xhr, status, error) {
                console.error("Error fetching data:", error);
            }
        });
    }
  
    fetchData();

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


    
});
