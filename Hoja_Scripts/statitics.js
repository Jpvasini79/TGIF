$(document).ready(function () {
    
    $.getJSON("https://nytimes-ubiqum.herokuapp.com/congress/113/senate", function (data) {
        var senatorData = data;
        getNoOfReps(senatorData);
        tableOfRep(senatorData);
        totalOFVotes(senatorData);
        tableOfVotes(senatorData);
        createVotesTable("leastTable", senatorData);
        createVotesTable("bottomtable", senatorData);
    })

})

var statistic = {
    stat: [
        {
            "party": "Democrats",
            "noOfRep": 0,
            "percentvotesRep": 0,


     },
        {
            "party": "Republicans",
            "noOfRep": 0,
            "percentvotesRep": 0
    },
        {
            "party": "Independents",
            "noOfRep": 0,
            "percentvotesRep": 0
    }
                ]

};
//esta funcion sirve para meter a los miembros del senado dentro de una array con el mismo valor de partido por sepaarado y despues sacarle la longitud y ponerlos en el HTML 

function getNoOfReps(senatorData) {
    var numbersOfDemoccrats = [];
    var numbersOfRepublicans = [];
    var numbersOfIndependents = [];

    var currentMembers = senatorData.results[0].members;

    for (var i = 0; i < currentMembers.length; i++) {
        if (currentMembers[i].party == "D") {
            numbersOfDemoccrats.push(currentMembers[i])
        }
        if (currentMembers[i].party == "R") {
            numbersOfRepublicans.push(currentMembers[i])
        }
        if (currentMembers[i].party == "I") {
            numbersOfIndependents.push(currentMembers[i])
        }

    }
    statistic.stat[0].noOfRep = numbersOfDemoccrats.length;
    statistic.stat[1].noOfRep = numbersOfRepublicans.length;
    statistic.stat[2].noOfRep = numbersOfIndependents.length;
};


function tableOfRep(senatorData) {
    // una vez se tiene la longitud de los representates del congreso y el senado estos se meten en un html
    var cellRepublic = document.getElementById("noRep");
    var cellDemocrat = document.getElementById("noDem");
    var cellIndepend = document.getElementById("noInd");

    var dem = statistic.stat[0].noOfRep;
    var rep = statistic.stat[1].noOfRep;
    var ind = statistic.stat[2].noOfRep;
    cellDemocrat.innerHTML = dem;
    cellRepublic.innerHTML = rep;
    cellIndepend.innerHTML = ind;
};

//esta funcion sirve para sacar la media de votos para cada partido en total 

function totalOFVotes(senatorData) {
    var votesOfDemocrats = [];
    var votesOfRepublicans = [];
    var votesOfIndependent = [];

    var totalDem = 0;
    var totalRep = 0;
    var totalInd = 0;

    var currentVotes = senatorData.results[0].members;

    for (var i = 0; i < currentVotes.length; i++) {
// se hace un bucle para elegir representatne con su cada partido para asi "filtrar" cada uno, despues que se filtra se puede elegir su porcentaje de votos
        if (currentVotes[i].party == "D") {
            votesOfDemocrats.push(currentVotes[i].votes_with_party_pct);
            totalDem += parseFloat(currentVotes[i].votes_with_party_pct);
        }
        if (currentVotes[i].party == "R") {
            votesOfRepublicans.push(currentVotes[i].votes_with_party_pct);
            totalRep += parseFloat(currentVotes[i].votes_with_party_pct)
        }
        if (currentVotes[i].party == "I") {
            votesOfIndependent.push(currentVotes[i].votes_with_party_pct)
            totalInd += parseFloat(currentVotes[i].votes_with_party_pct)

        }

    }

    var allTotalDem = (totalDem / votesOfDemocrats.length).toFixed(2);
    var allTotalRep = (totalRep / votesOfRepublicans.length).toFixed(2);
    var allTotalInd = (totalInd / votesOfIndependent.length).toFixed(2);
    //despues de habar sacado el resusltado de la operacion utilizar el resultado y sustituirlo en el parte de porcentaje de votos
    statistic.stat[0].percentvotesRep = allTotalDem;
    statistic.stat[1].percentvotesRep = allTotalRep;
    statistic.stat[2].percentvotesRep = allTotalInd;

};


function tableOfVotes() {
    var cellDemPer = document.getElementById("percentDem");
    var cellRepPer = document.getElementById("percentRep");
    var cellIndPer = document.getElementById("percentInd");

    var demPer = statistic.stat[0].percentvotesRep;
    var repPer = statistic.stat[1].percentvotesRep;
    var indPer = statistic.stat[2].percentvotesRep;

    cellDemPer.innerHTML = demPer + "%";
    cellRepPer.innerHTML = repPer + "%";
    cellIndPer.innerHTML = indPer + "%";
};


/////////////////////


function createVotesTable(tableId, senatorData) {

    var arrayMissed = [];
    var currentMissed = senatorData.results[0].members;

    for (var i = 0; i < currentMissed.length; i++) {

        var obj = {

            name: "",

            missed_votes: "",

            percent_missed: "",

            url_member: ""
        };

        obj.name = currentMissed[i].first_name + " " + currentMissed[i].last_name;
        obj.missed_votes = currentMissed[i].missed_votes;
        obj.percent_missed = currentMissed[i].missed_votes_pct;
        arrayMissed.push(obj);
        obj.url_member = currentMissed[i].url;
    }

    arrayMissed.sort(
        function (obj1, obj2) {

            if (tableId == "bottomtable")
                return obj1.missed_votes - obj2.missed_votes;
            else
                return obj2.missed_votes - obj1.missed_votes;
        });
    var aMLength = arrayMissed.length;
    var perc = 10;
    var cut = aMLength * (perc / 100);
    var theFirstTen = [];

    for (var j = 0; j < cut; j++) {
        theFirstTen.push(arrayMissed[j]);
    };

    var tblBottom = document.getElementById(tableId);

    for (var y = 0; y < theFirstTen.length; y++) {
        var row = document.createElement("tr");
        var linP = document.createElement("a");

        tblBottom.appendChild(row);

        var objMissed = theFirstTen[y].missed_votes;
        var objPercent = theFirstTen[y].percent_missed;
        var objName = theFirstTen[y].name;
        linP.innerHTML = objName;
        linP.href = theFirstTen[y].url_member;
        row.insertCell().appendChild(linP);
        row.insertCell().innerHTML = objMissed;
        row.insertCell().innerHTML = objPercent + "%";
    }

};
