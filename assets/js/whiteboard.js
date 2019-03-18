//declare variables
var btnOpen = document.querySelector(".fa-plus-circle");
var modal = document.querySelector(".modal");
var btnCancel = document.querySelector("#button-cancel");
var btnAdd = document.querySelector("#button-addId");
var selMarket = document.querySelector("#market-dropDown");
var selDay = document.getElementById("day-dropDown");
var idPart1 = document.getElementById("part1");
var idPart2 = document.getElementById("part2");
var idPart3 = document.getElementById("part3");
var listDay = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
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
            
            if (materialID == ""){
                listOfIDs.parentNode.classList.add("clear");
                listOfIDs.parentNode.addEventListener("click", function(){
                    var x = this.firstChild.nextSibling;
                    x.classList.toggle("showTick");
                })
            }
            for (var k = 0; k < materialID.length; k++) {
                if (typeof(materialID[k]) !== "undefined") {
                    createLi(listOfIDs, materialID[k]);
                }
            };
        };
    };
    // run the function add listener
    addListener();
};

// add a listener to remove li when clicking the trash icon
var addListener = function () {
    var btnDelete = document.getElementsByClassName("trash");
    for (var i = 0; i < btnDelete.length; i++) {
        btnDelete[i].addEventListener("click", function () {
            var li_ID = this.parentNode.textContent; //get-id
            marketPattern = /^\w{3}/; //regular expression to extract market
            dayPattern = /\w*$/; //regular expression to extract day
            var li_market = marketPattern.exec(this.parentNode.parentNode.id)[0];
            var li_day = dayPattern.exec(this.parentNode.parentNode.id)[0];
            deleteJson(li_market, li_day, li_ID);
            this.parentNode.classList.add("fadeOut");
            let _this = this;
            setTimeout(function () {
                _this.parentNode.parentNode.removeChild(_this.parentNode);
            }, 200)
            location.reload();
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
        marketDay.parentNode.classList.remove("clear"); //remove the clear class 
        createLi(marketDay, materialID);
        addListener();
        resetValues();
        postJson(market, day, materialID);
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

function createTick(parent){
    var ico = document.createElement("i");
    ico.classList.add("fas");
    ico.classList.add("fa-check-circle");
    parent.appendChild(ico);
    console.log(parent);
}

function resetValues() {
    idPart1.value = "";
    idPart2.value = "";
    idPart3.value = "";
    selMarket.selectedIndex = 0;
    selDay.selectedIndex = 0;
}


function postJson(market, day, id) {
    xhr = new XMLHttpRequest();
    var url = "./addID";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    var data = JSON.stringify({ market: market, day: day, id: id});
    xhr.send(data);
};

function deleteJson(market, day, id) {

    xhr = new XMLHttpRequest();
    var url = "./deleteID";
    xhr.open("DELETE", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    var data = JSON.stringify({ market: market, day: day, id: id});
    xhr.send(data);

};
