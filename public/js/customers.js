var selectedRow = null;

$(document).ready( () => {

    $("#table").on("click", "tr", function () {

        if(selectedRow != undefined || selectedRow != null)
        {
            selectedRow.removeClass("active-row");
        }

        $(this).addClass("active-row");
        selectedRow = $(this);

        partNo = selectedRow.children("td:first").text();

        product = data.find(x => x.prodId == partNo);

         // copying to clipborad
         navigator.clipboard.writeText(selectedRow.find("td:eq(1)").text().trim());

        createTable(product);
    });

});