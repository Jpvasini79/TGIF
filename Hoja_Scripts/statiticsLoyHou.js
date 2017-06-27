$(document).ready(function () {

    $.getJSON("https://nytimes-ubiqum.herokuapp.com/congress/113/house", function (data) {
        var congressData = data;
        getNoOfReps(congressData);
        tableOfRep(congressData);
        totalOFVotes(congressData);
        tableOfVotes(congressData);
        createTableLoyal("numberofvotessenate", congressData);
        createTableLoyal("percentvotessenate", congressData);
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

function getNoOfReps(congressData) {
    var numbersOfDemoccrats = [];
    var numbersOfRepublicans = [];
    var numbersOfIndependents = [];

    var currentMembers = congressData.results[0].members;

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
getNoOfReps();

function tableOfRep(congressData) {
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
tableOfRep();

function totalOFVotes(congressData) {
    var votesOfDemocrats = [];
    var votesOfRepublicans = [];
    var votesOfIndependent = [];

    var totalDem = 0;
    var totalRep = 0;
    var totalInd = 0;

    var currentVotes = congressData.results[0].members;

    for (var i = 0; i < currentVotes.length; i++) {

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
totalOFVotes();

function tableOfVotes(congressData) {
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
tableOfVotes();


function createTableLoyal(tableIdLoyal) {
    var arrayMissed = [];
    var currentMissed = congressData.results[0].members;

    for (var i = 0; i < currentMissed.length; i++) {

        var objV = {

            name: "",

            number_votes: "",

            percent_ofvotes: "",

            url_member: "",

        };

        objV.name = currentMissed[i].first_name + " " + currentMissed[i].last_name;
        objV.number_votes = currentMissed[i].total_votes;
        objV.percent_ofvotes = currentMissed[i].votes_with_party_pct;
        objV.url_member = currentMissed[i].url;
        arrayMissed.push(objV);
    }

    arrayMissed.sort(
        function (obj1, obj2) {
            if (tableIdLoyal == "percentvotessenate")
                return obj1.percent_ofvotes - obj2.percent_ofvotes;
            else
                return obj2.percent_ofvotes - obj1.percent_ofvotes;
        });

    var aMLength = arrayMissed.length;
    var perc = 10;
    var cut = aMLength * (perc / 100);
    var theFirstTen = [];

    for (var j = 0; j < cut; j++) {
        theFirstTen.push(arrayMissed[j]);
    };

    var tblMostLoyal = document.getElementById(tableIdLoyal);

    for (var y = 0; y < theFirstTen.length; y++) {
        var row = document.createElement("tr");
        var linP = document.createElement("a");

        tblMostLoyal.appendChild(row);


        var objPercent = theFirstTen[y].percent_ofvotes;
        var objTotalofVotes = theFirstTen[y].number_votes;
        var objName = theFirstTen[y].name;
        linP.innerHTML = objName;
        linP.href = theFirstTen[y].url_member;
        row.insertCell().appendChild(linP);
        row.insertCell().innerHTML = objTotalofVotes;
        row.insertCell().innerHTML = objPercent + "%";
    }

};
createTableLoyal("numberofvotessenate");
createTableLoyal("percentvotessenate");
