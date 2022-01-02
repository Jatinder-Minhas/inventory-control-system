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

        // copying to clipborad
        navigator.clipboard.writeText(selectedRow.find("td:eq(1)").text().trim());

        $("#_idView").val(_id.trim());
        $("#_idChange").val(_id.trim());
    });

});
