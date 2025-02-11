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
    
    $('#close').click(function () {
        window.location.href = 'citizen_dashbord.html';
    });

    function fetchData() {
        $.ajax({
            url: 'http://127.0.0.1:5000/catalogue', 
            type: 'GET',
            success: function (response) {
                var tbody = $('#catalogueTable');
                tbody.empty();
                response.forEach(function (output, index) {
                    localStorage.setItem(output.catalogue_id, JSON.stringify({
                        table_name: output.table_name,
                        dataset_name: output.dataset_name
                    }));

                    tbody.append(`
                        <tr>
                            <td>${index + 1}</td>
                            <td>${output.dataset_name}</td>
                            <td>
                                <button class="btn btn-primary btn-xs view" data-catalogue-id="${output.catalogue_id}" data-table-name="${output.table_name}" style="box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);">View</button>
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
            }
        });
    }

    fetchData();

    $('#searchButton').click(function () {
        var searchText = $('#searchInput').val().toLowerCase();

        $('#catalogueTable tbody tr').each(function () {
            var dataset_name = $(this).find('td').eq(1).text().toLowerCase();
            if (dataset_name.includes(searchText)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });
});
