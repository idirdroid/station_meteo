//Fonction de découpge de la date
function formattedDate(d) {
    return d.slice(0, 10) + " - " + d.slice(11, 19);
}

// Emplacement de l'API météo sur le net
const baseApiUrl = 'https://spring-meteo-station-api.herokuapp.com/api/measures';

//***************************************************************
//***************************************************************
//Fonction d'appel de l'API
function callApi(url, request, measureType, fDate, tDate, displayFn) {
// Récupération de la dernière valeur d'un type de mesure
    //Construction de l'url selon les appels (avec ou sans dates)
    if (fDate !== null && tDate !== null) {
        urlFull = url + '/' + request + '?measure-type=' + measureType + '&start-date=' + fDate + '&end-date=' + tDate;
    } else {
        urlFull = url + '/' + request + '?measure-type=' + measureType;
    }
    fetch(urlFull).then(function (response) {
        response.json().then(function (result) {
            //Execution de la fonction d'affichage envoyée en paramètre
            displayFn(result);
        });
    }).catch(function (error) {
        console.log('Il y a eu un problème avec la récupération de la dernière mesure ' + error.message);
    })
}


//***************************************************************
//***************************************************************
//Récupération des entrées de menu.
let listElementMenu = document.getElementById("menu").getElementsByTagName("li");

//Première ligne de menu (Dernière mesure)
listElementMenu[0].addEventListener("click", function () {
    //Récupération de l'unité souhaitée
    let measureType = document.getElementById("listeDeroulante").value;

    //Construction de la fonction d'affichage
    let displayFn = function (result) {

        //On vide le bloc div-dates s'il existe
        document.getElementById("div-dates").innerHTML = "";

        //Création du bloc d'éléments HTML
        let hElement = document.createElement("h3");
        hElement.textContent = "Dernier relevé du : " + formattedDate(result["measureDate"]);

        let pElement = document.createElement("p");
        pElement.textContent = result["type"] + " : " + result["value"] + " " + result["unit"];

        let affichage = document.getElementById("resultat");

        //On vide la section affichage si des éléments existent déjà
        affichage.innerHTML = "";

        affichage.appendChild(hElement);
        affichage.appendChild(pElement);
    }
//Appel de l'API
    callApi(baseApiUrl, "last", measureType, '', '', displayFn);
});

//***************************************************************
//***************************************************************
//Deuxième ligne de menu (Top Mesures)
listElementMenu[1].addEventListener("click", function () {

//Récupération de l'unité souhaitée
    let measureType = document.getElementById("listeDeroulante").value;

    //Construction de la fonction d'affichage
    let displayFn = function (result) {

        document.getElementById("div-dates").innerHTML = "";

        let hElement = document.createElement("h3");
        hElement.textContent = "Top mesure du : " + formattedDate(result["measureDate"]);

        let pElement = document.createElement("p");
        pElement.textContent = result["type"] + " : " + result["value"] + " " + result["unit"];

        let affichage = document.getElementById("resultat");
        affichage.innerHTML = "";
        affichage.appendChild(hElement).appendChild(pElement);
    };
//Appel de l'API
    callApi(baseApiUrl, "top", measureType, '', '', displayFn)
});


//***************************************************************
//***************************************************************
//Troisième ligne de menu (Tableau de données)
//On initialise les variables qui contiendront les dates
let fDate = (new Date()).toISOString().slice(0, 19);
console.log(fDate);
let tDate = new Date();
tDate.setHours(tDate.getHours() + 2);
tDate = tDate.toISOString().slice(0, 19);
console.log(tDate);

//Listener sur le menu d'index 2
listElementMenu[2].addEventListener("click", function () {

//Récupération de l'unité souhaitée
    let measureType = document.getElementById("listeDeroulante").value;

    document.getElementById("div-dates").innerHTML = '';

    //Création du bloc DataTime
    let sectionDate = document.createElement("section");
    let fromLabel = document.createElement("label");
    fromLabel.textContent = "Date de début ";
    let fromDate = document.createElement("input");
    fromDate.type = "datetime-local";
    fromDate.value = fDate;

    let toLabel = document.createElement("label");
    toLabel.textContent = "Date de fin ";

    let toDate = document.createElement("input");
    toDate.type = "datetime-local";
    toDate.value = tDate

    let refreshButton = document.createElement("button");
    refreshButton.textContent = "Rafraîchir les dates";
    refreshButton.addEventListener("click", function () {
        //let fDate = fromDate;
        console.log(fromDate.value);
        fDate = fromDate.value;
        console.log(toDate.value);
        tDate = toDate.value;
    })

    let blocDate = document.createElement("section");
    blocDate.id = "dates";
    blocDate.appendChild(fromLabel);
    blocDate.appendChild(fromDate);
    blocDate.appendChild(toLabel);
    blocDate.appendChild(toDate);
    blocDate.appendChild(refreshButton);

    document.getElementById("div-dates").appendChild(blocDate);

    let displayFn = function (result) {

        document.getElementById("resultat").innerHTML = '';

        let table = document.createElement("table");
        let tablehead = document.createElement("thead");
        let headcol = document.createElement("td");
        headcol.innerText = "Date";
        tablehead.appendChild(headcol);
        headcol = document.createElement("td");
        headcol.innerText = "Valeurs";
        tablehead.appendChild(headcol);
        table.appendChild(tablehead);
        let tableBody = document.createElement("tbody");
        for (let i = 0; i < result.length; i++) {
            let tablerow = document.createElement("tr");
            let col = document.createElement("td");
            //let tempDate = formattedDate(result[i]["measureDate"].toDateString());

            col.innerText = formattedDate(result[i]["measureDate"]);
            tablerow.appendChild(col);
            col = document.createElement("td");
            col.innerText = result[i]["value"];
            tablerow.appendChild(col);
            tableBody.appendChild(tablerow);
        }
        table.appendChild(tableBody);

        document.getElementById("resultat").appendChild(table);
    }
//Appel de l'API
    callApi(baseApiUrl, '', measureType, fDate, tDate, displayFn);
});
