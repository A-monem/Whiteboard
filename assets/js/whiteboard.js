//declare variables
var btnOpen = document.querySelector(".fa-plus-circle")
var modal = document.querySelector(".modal")
var btnCancel = document.querySelector("#button-cancel")
var btnAdd = document.querySelector("#button-addId")
var selMarket = document.querySelector("#market-dropDown")
var selDay = document.getElementById("day-dropDown")
var idPart1 = document.getElementById("part1")
var idPart2 = document.getElementById("part2")
var idPart3 = document.getElementById("part3")
var listDay = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
var listMarket = ["TCN", "GTV", "QTQ", "NWS", "STW", "NTD"];

window.onload = function () {
    // load json file
    xhttp.open("GET", "./IDs.json", true);
    xhttp.send();
};


//establish an http connection
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        // Typical action to be performed when the document is ready:
        let response = JSON.parse(xhttp.responseText);
        console.log(response)
        loadJson(response);
    };
};

//function to load IDs from a json file
function loadJson(response) {
    //loop through markets
    for (var i = 0; i < listMarket.length; i++) {
        let market = listMarket[i];
        //loop through days of the week
        for (var j = 0; j < listDay.length; j++) {
            let day = listDay[j];
            let listOfIDs = document.getElementById(`${market}-${day}`);
            let materialID = response[market][day];
            //loop through IDs in each day
            for (var k = 0; k < materialID.length; k++) {
                if (typeof (materialID[k]) !== "undefined") {
                    createLi(listOfIDs, materialID[k]);
                };
            };
        };
    };
    // run the function add listener
    addListener();
};


// add a listener to remove li when clicking the trash icon
var addListener = function () {
    var btnDelete = document.getElementsByClassName("trash")
    for (var i = 0; i < btnDelete.length; i++) {
        btnDelete[i].addEventListener("click", function () {
            this.parentNode.classList.add("fadeOut");
            let _this = this;
            setTimeout(function () {
                _this.parentNode.parentNode.removeChild(_this.parentNode);
            }, 200)
        });
    };
};

// open add-id window
btnOpen.addEventListener("click", function () {
    modal.style.display = "block";
})


// close add-id widnow
btnCancel.addEventListener("click", function () {
    resetValues()
    modal.style.display = "none";
});


// 
btnAdd.addEventListener("click", function () {
    let day = selDay.value;
    let market = selMarket.value;
    if (idPart1.value !== "" && idPart2.value !== "" && idPart2.value !== "") {
        let materialID = `${idPart1.value.toUpperCase()}_${idPart2.value}_${idPart3.value.toUpperCase()}`;
        let marketDay = document.getElementById(`${market}-${day}`);
        createLi(marketDay, materialID);
        addListener();
        resetValues();
        modal.style.display = "none";
    }
    else {
        alert("Please insert a valid ID");
    };
});

function createLi(parent, id) {
    var node = document.createElement("li");
    var sp = document.createElement("span");
    var ico = document.createElement("i");
    var textnode = document.createTextNode(id);
    sp.classList.add("trash")
    ico.classList.add("fas");
    ico.classList.add("fa-trash-alt")
    sp.appendChild(ico);
    node.appendChild(sp);
    node.appendChild(textnode);
    parent.appendChild(node);
}

function resetValues() {
    idPart1.value = "";
    idPart2.value = "";
    idPart3.value = "";
    selMarket.selectedIndex = 0;
    selDay.selectedIndex = 0;
}




//------------------------------------------------------------------------------------------//


// var fs = require('fs');
// var words = fs.readFileSync('IDs.json');
// console.log(words)

function postJson() {
    // var data = new Object();


    // response[selMarket] = [selDay];
    // response[selMarket][selDay] = id;
    // console.log(response);
    // response = JSON.stringify(response);

    // console.log(response);


  

    // Saturday = [`${id}`]
    // response.TCN = {Saturday};
    // console.log(response);
    // response = JSON.stringify(response);
    // console.log(response);

    var response = { "name": "Hello World"}

    var xhttpPost = new XMLHttpRequest();  
    xhttpPost.open("POST", "./Jtest.json", true);
    xhttpPost.setRequestHeader('Access-Control-Allow-Headers', '*');
    xhttpPost.setRequestHeader("Content-type", "application/json");
    xhttpPost.setRequestHeader('Access-Control-Allow-Methods', "POST");
    // xhttpPost.setRequestHeader('Access-Control-Request-Origin', "https://a-monem.github.io/Whiteboard/IDs.json");
    xhttpPost.send(response);

    // xhttpPost.onreadystatechange = function () {
    
    //     console.log(response); 
    //     response = JSON.stringify(response);
        
    // };
};
