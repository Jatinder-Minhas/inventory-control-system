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
        navigator.clipboard.writeText(partNo.trim());

        createTable(product);
    });

});

function createTable(product)
    {
        $("#partNo").html(product.prodId);
        $("#upc").html(product.upc);
        $("#prodName").html(product.prodName);
        $("#catagory").html(product.catagory);
        $("#desc").html(product.desc);
        $("#quantity").html(product.quantity);
        $("#price").html("$" + product.retailPrice);
        $("#cost").html("$" + product.cost);
        $("#minQuantity").html(product.minQuantity);
    };

function viewDetails(){

    partNo = selectedRow.children("td:first").text();
    product = data.find(x => x.prodId == partNo);
    createTable(product);
    
    $('#myModal').modal();
};