//Fonction de formatage de la date
function formattedDate(d, type) {
    //Récupération des données
    let date = new Date(d);
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds()
    let dt = date.getDate();

    //Modification des données
    if (minutes === 0) { minutes = "00"; }
    if (hours < 10) {    hours = '0' + hours; }
    if (seconds < 10) { seconds = '0' + seconds;}
    if (dt < 10) { dt = '0' + dt; }
    if (month < 10) { month = '0' + month; }

    //Retour de la valeur souhaitée
    if (type === "small") { return (dt + '/' + month + '/' + year); }
    else { return (dt + '/' + month + '/' + year + ' ' + hours + ':' + minutes + ':' + seconds); }
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
let listElementMenu = document.getElementById("menu").getElementsByTagName("a");

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
        hElement.textContent = "Dernier mesure du : " + formattedDate(result["measureDate"], "small");

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
        hElement.textContent = "Top mesure du : " + formattedDate(result["measureDate"], "small");

        let pElement = document.createElement("p");
        pElement.textContent = result["type"] + " : " + result["value"] + " " + result["unit"];

        let affichage = document.getElementById("resultat");
        affichage.innerHTML = "";
        affichage.appendChild(hElement);
        affichage.appendChild(pElement);
    };
//Appel de l'API
    callApi(baseApiUrl, "top", measureType, '', '', displayFn)
});


//***************************************************************
//***************************************************************
//Troisième ligne de menu (Tableau de données)
//On initialise les variables qui contiendront les dates
let fDate = (new Date()).toISOString().slice(0, 19);
let tDate = new Date();
tDate.setHours(tDate.getHours() + 2);
tDate = tDate.toISOString().slice(0, 19);

function createDate() {
    //Création du bloc DataTime
    let sectionDate = document.createElement("section");
    let fromLabel = document.createElement("label");
    fromLabel.textContent = "Date de début";
    let fromDate = document.createElement("input");
    fromDate.type = "datetime-local";
    fromDate.value = fDate;

    let toLabel = document.createElement("label");
    toLabel.textContent = "Date de fin";

    let toDate = document.createElement("input");
    toDate.type = "datetime-local";
    toDate.value = tDate

    //Création du bouton et de son Event Listener
    let refreshButton = document.createElement("button");
    refreshButton.textContent = "Rafraîchir les dates";
    refreshButton.addEventListener("click", function () {
        fDate = fromDate.value;
        tDate = toDate.value;
    })

    let blocDate = document.createElement("section");
    blocDate.id = "dates";
    blocDate.appendChild(fromLabel);
    blocDate.appendChild(fromDate);
    blocDate.appendChild(toLabel);
    blocDate.appendChild(toDate);
    blocDate.appendChild(refreshButton);

    //Ajout du bloc date
    document.getElementById("div-dates").appendChild(blocDate);
}

//Listener sur le menu d'index 2
listElementMenu[2].addEventListener("click", function () {

//Récupération de l'unité souhaitée
    let measureType = document.getElementById("listeDeroulante").value;

    document.getElementById("div-dates").innerHTML = '';

    createDate();

    //Construction du tableau HTML
    let displayFn = function (result) {

        document.getElementById("resultat").innerHTML = '';

        let table = document.createElement("table");

        //Entête du tableau
        let tablehead = document.createElement("thead");
        let headcol = document.createElement("td");
        headcol.innerText = "Date";
        tablehead.appendChild(headcol);
        headcol = document.createElement("td");
        headcol.innerText = "Valeur de mesure";
        tablehead.appendChild(headcol);
        table.appendChild(tablehead);

        //corps du tableau
        let tableBody = document.createElement("tbody");
        for (let i = 0; i < result.length; i++) {
            let tablerow = document.createElement("tr");
            let col = document.createElement("td");

            col.innerText = formattedDate(result[i]["measureDate"], "long");
            tablerow.appendChild(col);
            col = document.createElement("td");
            col.innerText = result[i]["value"];
            tablerow.appendChild(col);
            tableBody.appendChild(tablerow);
        }
        //Ajout du corps du tableau
        table.appendChild(tableBody);
        //ajout du tableau complet au document
        document.getElementById("resultat").appendChild(table);
    }
//Appel de l'API
    callApi(baseApiUrl, '', measureType, fDate, tDate, displayFn);
});


//***************************************************************
//***************************************************************
//Quatrième élement de menu (Graphique)
listElementMenu[3].addEventListener("click", function () {

//Récupération de l'unité souhaitée
    let measureType = document.getElementById("listeDeroulante").value;

    document.getElementById("div-dates").innerHTML = '';

    createDate();

    //Construction du tableau HTML
    let displayFn = function (result) {

        document.getElementById("resultat").innerHTML = '';
        let graphique = document.createElement("canvas");
        graphique.id = "graphique";


        document.getElementById("resultat").appendChild(graphique);

        //Code d'affichage du graphique
        //Création des tableaux de données
        let labels = [];
        let dataSet = [];

        for (let i = 1; i < result.length; i++) {
            labels.push(formattedDate(result[i]["measureDate"],"long"));
            dataSet.push(result[i]["value"]);
        }

        const data = {
            labels: labels,
            datasets: [{
                label: 'Mesures : ' + measureType,
                backgroundColor: 'rgb(245,170,0)',
                borderColor: 'rgb(245,170,0)',
                data: dataSet,
                tension: 0.3
            }]
        };
        const config = {
            type: 'line',
            data,
            options: {}
        };
        let myChart = new Chart(
            document.getElementById('graphique'),
            config
        );

    }
//Appel de l'API
    callApi(baseApiUrl, '', measureType, fDate, tDate, displayFn);
});