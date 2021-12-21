$(document).ready( () => {

    $(document).on("click", "#btnEdit", function () {

        if($("#prodId").val() != "")
        {
            $("#message").html("");
            $("#prodId").prop("disabled", false);
            $("#upc").prop("disabled", false);
            $("#prodId").prop("readonly", true);
            $("#upc").prop("readonly", true);
            $("#prodName").prop("disabled", false);
            $("#catagory").prop("disabled", false);
            $("#desc").prop("disabled", false);
            $("#quantity").prop("disabled", false);
            $("#minQuantity").prop("disabled", false);
            $("#retailPrice").prop("disabled", false);
            $("#cost").prop("disabled", false);

            $("#btnUpdate").css("display", "block");

            $(this).attr('id', 'btnCancel');
            $(this).html("Cancel");
        }
    });

    $(document).on("click", "#btnCancel", function () {
        $("#prodId").prop("disabled", true);
        $("#upc").prop("disabled", true);
        $("#prodName").prop("disabled", true);
        $("#catagory").prop("disabled", true);
        $("#desc").prop("disabled", true);
        $("#quantity").prop("disabled", true);
        $("#minQuantity").prop("disabled", true);
        $("#retailPrice").prop("disabled", true);
        $("#cost").prop("disabled", true);

        $("#btnUpdate").css("display", "none");

        $(this).attr('id', 'btnEdit');
        $(this).html("Edit Product");
    });

    $(document).on("click", "#btnDelete", function () {

        $("#deleteProdId").val($("#prodId").val());
        $("#deleteUpc").val($("#upc").val());
    });

});