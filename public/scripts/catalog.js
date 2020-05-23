var items = [];
var categories = [];
var serverURL = "http://localhost:8080/api/"

function fetchCatalog() {

    //get items from the server
    $.ajax({
        url: serverURL + "items",
        type: "GET",
        success: function (response) {

            console.log("Yay, it works!", response);

            //solve, show only my items
            //travel response array
            //get each item on the array
            // if the item.user == "Sandie"
            // then, push item into items array

            for (var i = 0; i < response.length; i++) {
                var item = response[i];
                if (item.user == "Sandie") {
                    items.push(item);
                }
            }
            //for all the items to show
            //items = response;

            displayCatalog();

        },
        error: function (errorDetails) {
            console.log("Error:", errorDetails);
        }
    });

}

function displayCatalog() {
    //travel the array
    for (var i = 0; i < items.length; i++) {
        //get the item
        var item = items[i];
        //draw the item on the DOM (html)
        drawItem(item);

        var cat = item.category;
        //ask if categories array contains cat
        //if not categories contains the cat
        if (!categories.includes(cat)) {
            //then push cat into categories
            categories.push(cat);

        }
    }
    drawCategories();
    //console.log(categories);
}

function drawItem(item) {
    //create the syntax

    var sntx =
        `<div class='item'> 
            <img src='${item.image}'>
            <label class='code'>${item.code}</label> 
            <label class='cat'>${item.category}</label>

            <label class='desc'>${item.description}</label>

            <label class='price'>$ ${(item.price * 1).toFixed(2)}</label>
            <button class='btn btn-sm btn-info'> + </button>

        </div>`;


    //get the element from the screen
    var container = $("#catalog");

    //append the syntax to the element
    container.append(sntx);

}

function drawCategories() {
    //get the container for categories
    var container = $("#categories");
    // travel the categories array
    for (var i = 0; i < categories.length; i++) {
        // get each category
        var c = categories[i];
        // create an li for category
        var li = `<li class="list-group-item"> <a href="#" onclick="searchByCategory('${c}');">${c}</li>`;
        // add li to container
        container.append(li);
    }

}
function search() {

    var text = $("#txtSearch").val().toLowerCase(); //get the text    
    //console.log(text);

    //clear previous results
    $("#catalog").html("");

    //travel the array and show only items that contains the text
    for (var i = 0; i < items.length; i++) {
        var item = items[i];

        //if the description contains the text, 
        //OR the category contains the text
        //OR the code is equal to the text
        //or the price is equal to the text
        //then show the item on the screen

        if (item.description.toLowerCase().includes(text)
            || item.category.toLowerCase().includes(text)
            || item.code == text
            || item.price == text

        ) {
            drawItem(item);
        }
    }
}
function searchByCategory(catName){
    console.log("Search by cat", catName);

    //clear
    $("#catalog").html("");

    //travel the array

    for (var i = 0; i < items.length; i++) {
        var item = items[i];
    
        if (item.category.toLowerCase().includes(catName.toLowerCase()) ) {
            drawItem(item);
        }

       /*  or
        if (item.category.toLowerCase() == catName.toLowerCase() ) {
            drawItem(item);
        } */
    }

}

function init() {
    console.log("This is the catalog page");

    //get data
    fetchCatalog();

    //hook events
    $("#btnSearch").click(search);
    $("#txtSearch").keypress(function (e) {

        /* if(e.key == "Enter"){
            search();
        } */

        if (e.keyCode == 13) {
            search();
        }

    });

    $("#catalog").on("click", ".item", function () {

        // $(this).toggleClass("selected");

        // get the image of the clicked element
        var img = $(this).find('img').clone();

        $(".modal-body").html(img);
        $("#modal").modal();

    });


}



window.onload = init;