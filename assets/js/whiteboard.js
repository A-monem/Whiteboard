
var btnOpen = document.querySelector(".fa-plus-circle")
var modal = document.querySelector(".modal")
var btnCancel = document.querySelector("#button-cancel")
var btnAdd = document.querySelector("#button-addId")
var selMarket = document.querySelector("#market-dropDown")
var selDay = document.querySelector("#day-dropDown")
var idPart1 = document.getElementById("part1")
var idPart2 = document.getElementById("part2")
var idPart3 = document.getElementById("part3")
var listDay = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
var listMarket = ["TCN","GTV","QTQ","NWS","STW","NTD"];

window.onload = function(){
    // run the function add listener
    addListener();
    // load json file
    xhttp.open("GET", "IDs.json", true);
    xhttp.send();
};

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
       // Typical action to be performed when the document is ready:
       var response = JSON.parse(xhttp.responseText);
       loadJson(response);
    };
};

function loadJson(response){
    for (var i=0; i<listMarket.length; i++){
        var market = listMarket[i];
        for (var j=0; j<listDay.length; j++){
            var day = listDay[j];
            var listOfIDs = document.getElementById(`${market}-${day}`);
            var materialID = response[market][day].forEach(element => {
                if (typeof(materialID) !== "undefined"){
                    createLi(listOfIDs, materialID); 
                };
            });; //fix the array issue

        };
    };
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
btnOpen.addEventListener("click", function(){ 
    modal.style.display = "block";
})


// close add-id widnow
btnCancel.addEventListener("click", function(){
    resetValues()
    modal.style.display = "none";
})


// 
btnAdd.addEventListener("click", function(){
    if(idPart1.value !== "" && idPart2.value !== "" && idPart2.value !== "" ){
        var materialID = ` ${idPart1.value.toUpperCase()}_${idPart2.value}_${idPart3.value.toUpperCase()}`;
        var listOfIDs = document.getElementById(`${selMarket.value}-${selDay.value}`);
        createLi(listOfIDs, materialID);
        addListener();
        resetValues();
        modal.style.display = "none";
    }
    else{
        alert("Please insert a valid ID");
    };
});

function createLi(parent, id){
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
    parent.appendChild(node) ;
}

function resetValues(){
    idPart1.value = "";
    idPart2.value = "";
    idPart3.value = "";
    selMarket.selectedIndex = 0;
    selDay.selectedIndex = 0;
}