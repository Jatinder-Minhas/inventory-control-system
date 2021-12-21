var selectedRow = null;
var phone;

$(document).ready( () => {

    $("#table").on("click", "tr", function () {

        if(selectedRow != undefined || selectedRow != null)
        {
            selectedRow.removeClass("active-row");
        }

        $(this).addClass("active-row");
        selectedRow = $(this);

        _id = selectedRow.children("td:first").text();

        $("#_idView").val(_id.trim());
        $("#_idChange").val(_id.trim());
    });

});
