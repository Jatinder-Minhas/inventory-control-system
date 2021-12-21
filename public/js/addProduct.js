$(document).ready( () => {

    // Submit the form by validating it
    $("form").submit(function(e){
        var isValid = validateForm();

        if(isValid)
            return true;
        else
            e.preventDefault();
    });

    $("#catagory").click(function(){
        selectedCata = $("#catagory").val();

        if(selectedCata == "other")
        {
            $("#otherCata").css("display", "block");
        }
        else
        {
            $("#otherCata").css("display", "none");
        }
    });

    function validateForm()
    {
        var prodId = $("#prodId").val();
        var upc = $("#upc").val();
        var prodName = $("#prodName").val();
        var quantity = $("#quantity").val();
        var minQuantity = $("#minQuantity").val();
        var retailPrice = $("#retailPrice").val();
        var cost = $("#cost").val();
        var selectedCata = $("#catagory").val();
        var otherCata = $("#otherCatagory").val();
        var desc = $("#desc").val();

        if(selectedCata == "unvalid")
        {
            $("#errorMessage").html("Please Enter or Select Catagory")
            $("#myModal").modal();
            return false;
        }
        else if(selectedCata == "other" && otherCata == "")
        {
            $("#errorMessage").html("Catagory is required!");
            
            $("#myModal").modal();
            return false;
        }
        else if(isNaN(prodId) || prodId == "")
        {
            $("#errorMessage").html("Product Number is Invalid")
            $("#myModal").modal();
            return false;
        }   
        else if(isNaN(upc) || upc == "" || (upc.length < 12 || upc.length > 13))
        {
            $("#errorMessage").html("Upc is must be a 12 digit number")
            $("#myModal").modal();
            return false;
        }
        else if(prodName == "")
        {
            $("#errorMessage").html("Product Name is Invalid")
            $("#myModal").modal();
            return false;
        }
        else if(isNaN(quantity) || quantity == "" || quantity < 0)
        {
            $("#errorMessage").html("Quantity must be a positive number")
            $("#myModal").modal();
            return false;
        }
        else if(isNaN(minQuantity) || minQuantity == "" || minQuantity < 0)
        {
            $("#errorMessage").html("Minimum Bin Quantity must be a positive number")
            $("#myModal").modal();
            return false;
        }
        else if(isNaN(retailPrice) || retailPrice == "" || retailPrice < 0)
        {
            $("#errorMessage").html("Retail Price must be a positive number")
            $("#myModal").modal();
            return false;
        }
        else if(isNaN(cost) || cost == "" || cost < 0)
        {
            $("#errorMessage").html("Cost must be a positive number")
            $("#myModal").modal();
            return false;
        }
        else
            return true;
        
    }


});