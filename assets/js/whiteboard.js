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
var LiveChecked = document.getElementById("live-input");
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
            let ulOfIDs = document.getElementById(`${market}-${day}`);//grab ul of "market-day"
            let materialID = response[market][day]; //extract IDs from the http GET response
            //loop through IDs in each day
            if (materialID == "") {
                addClearTick(ulOfIDs, true); //call addTickIcon function 
            }
            for (var k = 0; k < materialID.length; k++) {
                if (typeof (materialID[k]) !== "undefined") {
                    createLi(ulOfIDs, materialID[k]);
                }
            };
        };
    };
    addListener(); // call the function add listener
};

function addClearTick(ulObject, bool) {
    let td = ulObject.parentNode;
    let sp = ulObject.parentNode.firstChild.nextSibling;
    if (bool === true) {
        td.classList.add("clear"); // add "clear" class to td
        sp.classList.add("show"); //add "show" class to span   
    } else if (bool === false) {
        td.classList.remove("clear"); // remove "clear" class to td
        sp.classList.remove("show"); //remove "show" class to span   
    }
}


// add a listener to the trash span to remove li when clicking at the icon
var addListener = function () {
    var btnDelete = document.getElementsByClassName("trash"); //grab all trash icons
    //loop over trash spans to add a listener
    for (var i = 0; i < btnDelete.length; i++) {
        btnDelete[i].addEventListener("click", function () {
            var li_ID = this.parentNode.textContent; //get-id from parent li
            marketPattern = /^\w{3}/; //regular expression to extract market from parent ul
            dayPattern = /\w*$/; //regular expression to extract day from parent ul
            var li_market = marketPattern.exec(this.parentNode.parentNode.id)[0];
            var li_day = dayPattern.exec(this.parentNode.parentNode.id)[0];
            deleteJson(li_market, li_day, li_ID); //delete id from IDs.json
            this.parentNode.classList.add("fadeOut");
            let _this = this;
            setTimeout(function () {
                //remove li from parent ul
                _this.parentNode.parentNode.removeChild(_this.parentNode);
            }, 200)
            location.reload()
        });
    };
}

// open add-id window
btnOpen.addEventListener("click", function () {
    modal.style.display = "block";
})

// close add-id widnow
btnCancel.addEventListener("click", function () {
    resetValues()
    modal.style.display = "none";
});

// adding a new ID "li" to table
btnAdd.addEventListener("click", function () {
    let day = selDay.value;
    let market = selMarket.value;
    let checked = LiveChecked.checked;
    if (idPart1.value !== "" && idPart2.value !== "" && idPart2.value !== "") {
        let materialID = `${idPart1.value.toUpperCase()}_${idPart2.value}_${idPart3.value.toUpperCase()}`;
        let marketDay = document.getElementById(`${market}-${day}`); // grab ul of markte-day
        addClearTick(marketDay, false); //call addTickIcon function 
        createLi(marketDay, materialID, checked);
        resetValues();
        postJson(market, day, materialID);
        modal.style.display = "none";
        addListener();
    }
    else {
        alert("Please insert a valid ID");
    }
});

function createLi(parent, id, checked) {
    var l = document.createElement("li"); //creating an li element
    var sp1 = document.createElement("span"); //creating a span element
    var ico1 = document.createElement("i"); //creating an li element
    var textnode = document.createTextNode(id); //add id as a text

    sp1.classList.add("trash") //add class name to span
    ico1.classList.add("fas"); // add class to icon
    ico1.classList.add("fa-trash-alt")
    sp1.appendChild(ico1); // append icon into the span   
    l.appendChild(sp1); //append span into li
    l.appendChild(textnode);

    if (checked) {
        var sp2 = document.createElement("span"); //creating a span element
        var ico2 = document.createElement("i"); //creating an li element
        sp2.classList.add("live"); //add class name to span 
        ico2.classList.add("fas"); // add class to icon
        ico2.classList.add("fa-broadcast-tower");
        sp2.appendChild(ico2);
        l.appendChild(sp2);
    }
    
    l.addEventListener("click", function () {
        this.classList.toggle("cross");
    })
    parent.appendChild(l); //append li into ul
}

function createTick(parent) {
    var ico = document.createElement("i");
    ico.classList.add("fas");
    ico.classList.add("fa-check-circle");
    parent.appendChild(ico);

}

function resetValues() {
    idPart1.value = "";
    idPart2.value = "";
    idPart3.value = "";
    selMarket.selectedIndex = 0;
    selDay.selectedIndex = 0;
    LiveChecked.checked = false;
}


function postJson(market, day, id) {
    xhr = new XMLHttpRequest();
    var url = "./addID";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    var data = JSON.stringify({ market: market, day: day, id: id });
    xhr.send(data);
};

function deleteJson(market, day, id) {

    xhr = new XMLHttpRequest();
    var url = "./deleteID";
    xhr.open("DELETE", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    var data = JSON.stringify({ market: market, day: day, id: id });
    xhr.send(data);

};

//*************************************************************************//

var headerDate1 = document.getElementsByClassName("week1-date") //get h5 elements to add dates

insertWeekOneDates(headerDate1); //executes function to insert dates

//function to insert dates
function insertWeekOneDates(headerDate) {
    for (var i = 0; i < headerDate.length; i++) {
        var day = new Date(); //get today's date
        var d = day.getDay() - 1;
        var diff = 0;
        var wDay = headerDate1[i].parentNode.innerText;
        wDay = listDay.indexOf(wDay);
        if (wDay == d) {
            headerDate[i].textContent = `${day.getDate()}/${day.getMonth() + 1}`;
            headerDate[i].parentNode.classList.add("highlight");
        } else if (wDay > d) {
            diff = wDay - d;
            day.setDate(day.getDate() + diff);
            headerDate[i].textContent = `${day.getDate()}/${day.getMonth() + 1}`;
            headerDate[i].parentNode.classList.remove("highlight");
        } else if (wDay < d) {
            diff = (7 - (d - wDay));
            day.setDate(day.getDate() + diff);
            headerDate[i].textContent = `${day.getDate()}/${day.getMonth() + 1}`;
            headerDate[i].parentNode.classList.remove("highlight");
        }
    }
}

var tableHeader = document.querySelectorAll(".row-header th")

console.log(tableHeader[1].firstChild.nextSibling.nextSibling)

for (var i=1; i<tableHeader.length; i++){
    
    tableHeader[i].addEventListener("click", function(){
        this.firstChild.nextSibling.nextSibling.classList.toggle("show");
    })
}
