$(document).ready(function () {
    var congressData = null;


    loadPage();

});


function loadPage() {

    var allDataArray3 = [];

    $.getJSON("https://nytimes-ubiqum.herokuapp.com/congress/113/house", function (data) {

        $.getJSON("Hoja_Scripts/congressApi.js", function (data2) {


            console.log(data);
            var congressSun = data2.results;
            var newYorkTime = data.results[0].members;
            console.log(data2);

            //crear un bucle para contar la longitud de todos los objetos 

            for (var i = 0; i < data2.results.length; i++) {
                //despues crear una variable con un objeto poniendo los valores deseados y despues mas adelante agregarle los valores de los api deseados 
                var objApi1 = {

                    fullName: "",

                    officeYear: "",

                    birthD: "",

                    partyAll: "",

                    stateAll: "",

                    votePercenP: "",

                    contact_form: "",
                    
                    api: "SUNLIGHT"

                };
                // agregar cada valor del api de Sunlight en los valores de los objetos 
                objApi1.fullName = congressSun[i].first_name + " " + congressSun[i].last_name;
                objApi1.officeYear = "-";
                objApi1.birthD = congressSun[i].birthday;
                objApi1.partyAll = "-";
                objApi1.stateAll = congressSun[i].state;
                objApi1.votePercenP = "-";
                objApi1.contact_form = congressSun[i].contact_form;

                // agarrar el id de la tabla y usar empty para que no cree tablas cada vez que trate de filtrar
                $('#tableHouse').empty();
                var stateValue = objApi1.stateAll;
                
                var partyValue = objApi1.partyAll;
                
                var filters = checkedBoxes();
                
                var filtersApi = checkedApi();
                
                var filtersState = selectedValue("stateslist");
                // la variable showApi hace que si la longitud es 0 quiero igualmente me muestre la columna o un indexof para que regrese el valor selecionado 
                var showApiList = filtersApi.length == 0 || filtersApi.indexOf(objApi1.api) != -1;
                
                var showRowState = (filtersState == "all") || (filtersState == stateValue);
                
                var showRowParty = filters.length == 0 || filters.indexOf(partyValue) != -1;

                if (showRowParty && showRowState && showApiList) {
                    allDataArray3.push(objApi1);


                }

            }

            for (var i = 0; i < newYorkTime.length; i++) {

                var objApi2 = {

                    fullName: "",

                    officeYear: "",

                    birthD: "",

                    partyAll: "",

                    stateAll: "",

                    votePercenP: "",

                    contact_form: "",
                    
                    api: "NYT"

                };

                objApi2.fullName = newYorkTime[i].first_name + " " + newYorkTime[i].last_name;
                objApi2.officeYear = newYorkTime[i].seniority;
                objApi2.birthD = " - ";
                objApi2.partyAll = newYorkTime[i].party;
                objApi2.stateAll = newYorkTime[i].state;
                objApi2.votePercenP = newYorkTime[i].votes_with_party_pct + "%";
                objApi2.contact_form = newYorkTime[i].url;

                $('#tableHouse').empty();
                var stateValue = objApi2.stateAll;
                
                var partyValue = objApi2.partyAll;
                
                var filters = checkedBoxes();
                
                var filtersApi = checkedApi();
                
                var filtersState = selectedValue("stateslist"); 
                
                var showApiList = filtersApi.length == 0 || filtersApi.indexOf(objApi2.api) != -1;
                
                var showRowState = (filtersState == "all") || (filtersState == stateValue);
                
                var showRowParty = filters.length == 0 || filters.indexOf(partyValue) != -1;

                if (showRowParty && showRowState && showApiList) {

                    allDataArray3.push(objApi2);
                }

            }

            console.log(allDataArray3);

            listeners();
            listenersOptions();
            checkedBoxes();
            selectedList(allDataArray3);
            selectedValue("stateslist");
            createTableSunNYT(allDataArray3);
            checkedApi();
            listenersApi();



            // TODO: crear un data3 con las llaves 
            // if NYC checked && SUN  checked  ORRRRRR NYC not checked && SUN not checked ===>> data3 = data1 + data2
            // if NYC checked =>>> data3 = data
            // if SUN checked =>>> data3 = data2
        });

    })

}

function createTableSunNYT(allDataArray3) {

    /*$('#tableSenator').empty();
    $.each(allDataArray3, function(key, value){
        var row = document.createElement("tr");
        for (key in value){
            row.insertCell().innerHTML = value[key];
        }
        $('#tableSenator').append(row);
    })*/
    var tblSun = document.getElementById("tableHouse");

    for (var y = 0; y < allDataArray3.length; y++) {
        var row = document.createElement("tr");
        var linp = document.createElement("a");

        tblSun.appendChild(row);
        var objOfficeYear = allDataArray3[y].officeYear;
        var objName = allDataArray3[y].fullName;
        var objBirthD = allDataArray3[y].birthD;
        var objParty = allDataArray3[y].partyAll;
        var objStateAll = allDataArray3[y].stateAll;
        var objVotePer = allDataArray3[y].votePercenP;
        linp.innerHTML = objName;
        linp.href = allDataArray3[y].contact_form;
        row.insertCell().appendChild(linp);
        row.insertCell().innerHTML = objOfficeYear;
        row.insertCell().innerHTML = objBirthD;
        row.insertCell().innerHTML = objParty;
        row.insertCell().innerHTML = objStateAll;
        row.insertCell().innerHTML = objVotePer;



    }
    // crear row
    // crear celdas con info
    // table append row
}

function createTable() {

        var tbl = document.getElementById("tableHouse");
        var data = congressData.results;
        var array = data[0].members;


        while (tbl.rows.length > 0) {
            tbl.deleteRow(0);
        }
        ///Tabla de los del congreso.
        for (var i = 0; i < array.length; i++) {
            var row = document.createElement("tr");
            var linkP = document.createElement("a");

            tbl.appendChild(row);

            var currentMember = data[0].members[i];
            var partyValues = currentMember.party;
            var stateValue = data[0].members[i].state;
            var filters = checkedBoxes();
            var filtersState = selectedValue("stateslist");
            var showRowParty = filters.length == 0 || filters.indexOf(partyValues) != -1;
            var showRowState = (filtersState == "all") || (filtersState == stateValue);

            if (showRowParty && showRowState) {


                if (array[i].middle_name == null || array[i].middle_name == "") {
                    var fullName = array[i].first_name + " " + array[i].last_name;
                } else {
                    var fullName = array[i].first_name + " " + array[i].middle_name + " " + array[i].last_name;
                }

                var partyP = array[i].party;
                var stateP = array[i].state;
                var yearsInOffice = array[i].seniority;
                var percentVotes = array[i].votes_with_party_pct + "%";


                linkP.innerHTML = fullName;
                linkP.href = array[i].url;
                row.insertCell().appendChild(linkP);

                row.insertCell().innerHTML = partyP;
                row.insertCell().innerHTML = stateP;
                row.insertCell().innerHTML = yearsInOffice;
                row.insertCell().innerHTML = percentVotes;
                ///Final de la tabla.
            }
        }
    }

function checkedApi() {
    var checkN = document.getElementById("nytb")
    var checkS = document.getElementById("sunlightb")
    var arrayChecked = [];

    if (checkN.checked) {
        arrayChecked.push("NYT");

    }
    if (checkS.checked) {
        arrayChecked.push("SUNLIGHT");
    }
    return arrayChecked;
};

function listenersApi() {
    var checkN = document.getElementById("nytb")
    var checkS = document.getElementById("sunlightb");
    checkN.addEventListener("click", loadPage);
    checkS.addEventListener("click", loadPage);
};


function checkedBoxes() {
    
    // cada checkbox checkeado con su respectivo id sera agreagado a un array para diferenciar cada checkbox marcado
    
    var checkD = document.getElementById("democrat");
    var checkR = document.getElementById("republican");
    var checkI = document.getElementById("independent");
    var arrayChecked = [];

    if (checkD.checked) {
        arrayChecked.push("D");

    }
    if (checkR.checked) {
        arrayChecked.push("R");

    }
    if (checkI.checked) {
        arrayChecked.push("I");

    }

    return arrayChecked;
};

function listeners() {
    // estos listeners hacen el llamado del click, cada vez que se haga click se hara un llamado a la funcion que cree la tabla o lo que sea, en este caso se carga la pagina
    var checkD = document.getElementById("democrat");
    var checkR = document.getElementById("republican");
    var checkI = document.getElementById("independent");
    checkD.addEventListener("click", loadPage);
    checkR.addEventListener("click", loadPage);
    checkI.addEventListener("click", loadPage);
};

function listenersOptions() {
    // esto simplemente es llamado para que cree la pagina cadavez que hagamos click
    var stateTable = document.getElementById("stateslist");
    stateTable.addEventListener("click", loadPage);
};

function selectedList(stateP) {
    //crear una bucle para meter todos los estados en una lista de seleccion
    var array = stateP;
    var stateTable = document.getElementById("stateslist");
    var stateArray = [];

    for (var i = 0; i < array.length; i++) {
        var stateQ = array[i].stateAll;
        if (stateArray.indexOf(stateQ) == -1) {
            stateArray.push(stateQ);
        }
    }
    // y despues que se crea un bucle se crea otro para ordenarlos alfabeticamente dentro de la lista de seleccion
    stateArray.sort("statelist");
    for (var i = 0; i < stateArray.length; i++) {
        var optionList = document.createElement("option");

        optionList.innerHTML = stateArray[i];
        stateTable.append(optionList);
    }
}


function selectedValue(selectID) {

    var selectedOption = document.getElementById(selectID).options[document.getElementById(selectID).selectedIndex].value;


    return selectedOption;
}
