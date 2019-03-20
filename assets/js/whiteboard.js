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
var tableHeader = document.querySelectorAll(".row-header th")//row header elements
var headerDate1 = document.getElementsByClassName("week1-date") //get h5 elements to add dates
var listDay = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
var listMarket = ["TCN", "GTV", "QTQ", "NWS", "STW", "NTD"];

window.onload = function () {
    // load json file
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(xhttp.responseText);
            loadJson(response);
        };
    };
    //GET Request
    xhttp.open("GET", "./IDs.json", true);
    xhttp.send();

    insertWeekOneDates(headerDate1); //run function to insert dates
    cxDone()//run function 
};

// open add-id widnow
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
    let liveStatus
    if (checked) {
        liveStatus = "Y";
    } else {
        liveStatus = "N";
    }
    if (idPart1.value !== "" && idPart2.value !== "" && idPart2.value !== "") {
        let materialID = `${idPart1.value.toUpperCase()}_${idPart2.value}_${idPart3.value.toUpperCase()}`;
        let marketDay = document.getElementById(`${market}-${day}`); // grab ul of markte-day
        addClearTick(marketDay, false); //call addTickIcon function to remove the tick if present
        createLi(marketDay, materialID, checked);
        addListener(); // add trash icon click listener to remove Li and id in JSON
        resetValues();
        postJson(market, day, `${materialID}_${liveStatus}`); //add YN or NN for live IDs
        modal.style.display = "none";
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

    //add the live icon
    if (checked) {
        var sp2 = document.createElement("span"); //creating a span element
        var ico2 = document.createElement("i"); //creating an li element
        sp2.classList.add("live"); //add class name to span 
        ico2.classList.add("fas"); // add class to icon
        ico2.classList.add("fa-broadcast-tower");
        sp2.appendChild(ico2);
        l.appendChild(sp2);
    }
    //add a listen to cross id if previewed
    l.addEventListener("click", function () {
        this.classList.toggle("cross");
    })
    parent.appendChild(l); //append li into ul
    
}

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
            const idPattern = /\w*_\d*_\w/; //regular expression to exract id
            const livePattern = /\w$/
            //loop through IDs in each day
            if (materialID == "") {
                addClearTick(ulOfIDs, true); //call addTickIcon function 
            }
            for (var k = 0; k < materialID.length; k++) {
                if (typeof (materialID[k]) !== "undefined") {
                    let checked
                    let liveStatus = livePattern.exec(materialID[k]);
                    let id = idPattern.exec(materialID[k]);
                    if (liveStatus == "Y") {
                        checked = true;
                    } else if (liveStatus == "N") {
                        checked = false;
                    }
                    createLi(ulOfIDs, id, checked);
                }   
            };  
        };
    };
    addListener()  
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
function addListener() {
    var btnDelete = document.getElementsByClassName("trash"); //grab all trash icons
    //loop over trash spans to add a listener
    for (var i = 0; i < btnDelete.length; i++) {
        btnDelete[i].addEventListener("click", function () {
            let liveStatus;
            let li_ID = this.parentNode.textContent; //get-id from parent li
            const marketPattern = /^\w{3}/; //regular expression to extract market from parent ul
            const dayPattern = /\w*$/; //regular expression to extract day from parent ul
            var li_market = marketPattern.exec(this.parentNode.parentNode.id)[0];
            var li_day = dayPattern.exec(this.parentNode.parentNode.id)[0];
            if (this.nextSibling.nextSibling){
                liveStatus = "Y";
            } else {
                liveStatus = "N";
            }
            li_ID = `${li_ID}_${liveStatus}`
            console.log(li_ID)
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

//ass listener to row header to preview CX DONE status
function cxDone() {
    for (var i = 1; i < tableHeader.length; i++) {
        tableHeader[i].addEventListener("click", function () {
            this.firstChild.nextSibling.nextSibling.classList.toggle("show");
        })
    }
}

