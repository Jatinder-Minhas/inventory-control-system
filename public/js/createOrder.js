var selectedRow = null;
var totalPrice = 0;
var orderTable = [];
var amountPaid = 0.0;

$(document).ready( () => {

    recalTotalAmount();

    $("#table").on("click", "tr", function () {

        if(selectedRow != undefined || selectedRow != null)
        {
            selectedRow.removeClass("active-row");
        }

        $(this).addClass("active-row");
        selectedRow = $(this);
        $("#txtItemNo").val(selectedRow.find("td:eq(0)").html())
    });

    $(document).on('click', '#btnConfirm', function () 
    {

        var custName = $("#txtCustName").val();
        var phone = $("#txtPhone").val();
        amountPaid = $("#txtAmountPaid").val();

        if(!validateCustomer(custName, phone, amountPaid, totalPrice))
        {
            return;
        }

        alert("Created");

        $.ajax({
            type: "POST",
            url: "/api/orders/createOrder",
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
              },
            data: {"custName": custName, "phone": phone, "amountPaid": amountPaid}
          })
          .done(function (data) {
                window.location = "/api/orders/createOrder";
            }); 
    });

    function validateCustomer(custName, phone, amountPaid, totalPrice)
    {
        if(custName == "")
        {
            alert("Please Fill Customer Name Field");
            return false;
        }
        else if(phone == "" || isNaN(phone) || parseInt(phone).length > 20)
        {
            alert("Please Fill Customer Phone Number Field");
            return false;
        }
        else if(amountPaid == null || amountPaid == undefined || amountPaid == "" || amountPaid < 0)
        {
            alert("Please Fill Payment Made Field");
            return false;
        }
        else if(amountPaid > totalPrice)
        {
            alert("Amount paid is more than Total amount");
            return false;
        }
        else
        {
            return true;
        }
    }

    function recalTotalAmount()
    {
        var total = 0;

        for(i = 0; i < data.length; i++)
        {
            console.log(data[i].quantity)
            total = total + (parseFloat(data[i].retailPrice) * parseInt(data[i].quantity));
            console.log(total);
        }

        totalPrice = total;
        $("#txtTotalPrice").val(totalPrice);
        console.log(total);
    };

});