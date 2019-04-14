//Prendo alcuni dati dalla localStorage che servono per generare l'URL
document.getElementById("nome-giocatore").innerHTML = "Username : " + localStorage.getItem("nome");
document.getElementById("cat_scelta").innerHTML = "Categoria : " + localStorage.getItem("categoria");
document.getElementById("diff_scelta").innerHTML = "Difficoltà : " + localStorage.getItem("difficolta");
var difficolta_scelta = localStorage.getItem("difficolta");
var cat = localStorage.getItem("categoria");
var numero_domande=localStorage.getItem("numero_domande");
var tipo = "multiple";

//dichiarazioni di altre variabili del gioco
var domande = [];
var corrette = [];
var incorretta_uno = [];
var incorretta_due = [];
var incorretta_tre = [];
var numero_domanda_corrente=0;
var punteggio=0;
var disposizione;
var conta_tempo=0;
const tempoDomanda = 15;
const larghezza = 500;
const unita = larghezza / tempoDomanda;
let TIMER;
const ultima_domanda = numero_domande-1;
var session_token ="";
var secondi_passati;
var inizio_tempo;

//funzione per la generazione dell'URL
function generateURL(category,difficulty,type){
	return "https://opentdb.com/api.php?amount="+localStorage.getItem("numero_domande")+"&category=" + category + "&difficulty=" + difficulty + "&type=" + type+"&token="+localStorage.getItem("sessione");
}

//funzione per la trasformazione della categoria scelta in numero(serve perchè nell'URL la categoria viene identificata da un numero)
function trasforma_categoria(cat){

	var cat_number = 0;

	if(cat == "musica"){

		cat_number = 12;

	}else if(cat == "storia"){

		cat_number = 23;

	}else if(cat == "geografia"){

		cat_number = 22;

	}else if(cat == "sport"){

		cat_number = 21;

	}else if(cat == "film"){

		cat_number = 11;

	}else if(cat == "politica"){

		cat_number = 24;

	}

	return cat_number;
}

//funzione che fa il fetch dell'oggetto restituito dalla richiesta all API
function get_data(URL){
	fetch(URL).then(response => {

  	return response.json();

	}).then(data => {

		  console.log(data);
			if(data.response_code!=0){
				alert("non ci sono domande sul database in base ai criteri scelti");
				window.location="TriviaGameHome.html";
			}else{
				creaDomande(data);
			}


	}).catch(err => {

	});
}
//funzione per il caricamento dei diversi array con le infomrmazioni prese dall'API
function creaDomande(data){

		for(var i=0; i < numero_domande; i++){

			domande[i] = data.results[i].question;
			corrette[i] = data.results[i].correct_answer;
			incorretta_uno[i] = data.results[i].incorrect_answers[0];
			incorretta_due[i] = data.results[i].incorrect_answers[1];
			incorretta_tre[i] = data.results[i].incorrect_answers[2];

		}

		//chiamata alla funzione StartGame che fa partire il gioco
		StartGame();

}

//assegnazione delle diverse rispote nei diversi contenitori in modo casuale
function creaDisposizione(disp,indice){

	switch(disp){

		case 0:
			document.getElementById("risposta1").innerHTML=incorretta_uno[indice];
			document.getElementById("risposta2").innerHTML=incorretta_due[indice];
			document.getElementById("risposta3").innerHTML=incorretta_tre[indice];
			document.getElementById("risposta4").innerHTML=corrette[indice];
			break;
		case 1:
			document.getElementById("risposta4").innerHTML=incorretta_uno[indice];
			document.getElementById("risposta1").innerHTML=incorretta_due[indice];
			document.getElementById("risposta2").innerHTML=incorretta_tre[indice];
			document.getElementById("risposta3").innerHTML=corrette[indice];
			break;
		case 2:
			document.getElementById("risposta3").innerHTML=incorretta_uno[indice];
			document.getElementById("risposta1").innerHTML=incorretta_due[indice];
			document.getElementById("risposta2").innerHTML=incorretta_tre[indice];
			document.getElementById("risposta4").innerHTML=corrette[indice];
			break;
		case 3:
			document.getElementById("risposta3").innerHTML=incorretta_uno[indice];
			document.getElementById("risposta1").innerHTML=incorretta_due[indice];
			document.getElementById("risposta2").innerHTML=incorretta_tre[indice];
			document.getElementById("risposta4").innerHTML=corrette[indice];
			break;
		case 4:
			document.getElementById("risposta1").innerHTML=incorretta_uno[indice];
			document.getElementById("risposta3").innerHTML=incorretta_due[indice];
			document.getElementById("risposta4").innerHTML=incorretta_tre[indice];
			document.getElementById("risposta2").innerHTML=corrette[indice];
			break;
		case 5:
			document.getElementById("risposta2").innerHTML=incorretta_uno[indice];
			document.getElementById("risposta4").innerHTML=incorretta_due[indice];
			document.getElementById("risposta3").innerHTML=incorretta_tre[indice];
			document.getElementById("risposta1").innerHTML=corrette[indice];
			break;
		case 6:
			document.getElementById("risposta4").innerHTML=incorretta_uno[indice];
			document.getElementById("risposta1").innerHTML=incorretta_due[indice];
			document.getElementById("risposta3").innerHTML=incorretta_tre[indice];
			document.getElementById("risposta2").innerHTML=corrette[indice];
			break;
		case 7:
			document.getElementById("risposta3").innerHTML=incorretta_uno[indice];
			document.getElementById("risposta2").innerHTML=incorretta_due[indice];
			document.getElementById("risposta4").innerHTML=incorretta_tre[indice];
			document.getElementById("risposta1").innerHTML=corrette[indice];
			break;
		case 8:
			document.getElementById("risposta2").innerHTML=incorretta_uno[indice];
			document.getElementById("risposta4").innerHTML=incorretta_due[indice];
			document.getElementById("risposta1").innerHTML=incorretta_tre[indice];
			document.getElementById("risposta3").innerHTML=corrette[indice];
			break;

	}

}

//funzione che scorre gli array con le domande  e goni vilta le visualizza
function generaDomande(){

  document.getElementById("numero").innerHTML=numero_domanda_corrente+1;
  document.getElementById("domanda_attuale").innerHTML=domande[numero_domanda_corrente];
  disposizione=Math.floor(Math.random() * 9);
  var stringa_prima;
  var stringa_corrente;
  creaDisposizione(disposizione,numero_domanda_corrente);
}

//funzione per il controllo della risposta scelta
function controlla(id_risposta){
  var elemento=document.getElementById("risposta"+id_risposta);
    if( elemento.innerHTML == corrette[numero_domanda_corrente]){
        punteggio=punteggio+3;
				//se la risposta è giusta si chiama la funzione giusto()
        giusto(id_risposta);
    }else{
			punteggio=punteggio-1;
			//se la risposta è sbagliata si chiama la funzione sbagliato()
        sbagliato(id_risposta);
    }
    conta_tempo = 0;
    if(numero_domanda_corrente < ultima_domanda){
        numero_domanda_corrente++;
				setTimeout(generaDomande,500);
    }else{
        clearInterval(TIMER);
        punteggioFinale();
    }
}
//funzione che conferma la correttezza della risposta cambiando il colore del contenitore in verde
function giusto(id_risposta){
			document.getElementById("contenitore"+id_risposta).style.backgroundColor="green";
			document.getElementById("risposta"+id_risposta).style.color="white";
			setTimeout(function() {
			    ritorna_bianco(id_risposta);
			}, 500);
      document.getElementById("score").innerHTML=punteggio;

}

//funzione che conferma l'incorrettezza della risposta cambiando il colore del contenitore in rosso
function sbagliato(id_risposta){
			document.getElementById("contenitore"+id_risposta).style.backgroundColor="red";
			document.getElementById("risposta"+id_risposta).style.color="white";
			setTimeout(function() {
			    ritorna_bianco(id_risposta);
			}, 500);
      document.getElementById("score").innerHTML=punteggio;

}
//funzione che fa tornare il colore del contenitore della risposta scelta in bianco dopo il cambiamento verde/rosso
function ritorna_bianco(id_risposta){
			document.getElementById("contenitore"+id_risposta).style.backgroundColor="white";
			document.getElementById("risposta"+id_risposta).style.color="black";
}
//funzione per la barra del tempo che lo fa avanzare ogno secondo,cambia domanda in caso sia finito il tempo e non si e avuta una risposta,ferma il quiz se si ha raggiunta l'ultima domanda
function timerDomande(){
    if(conta_tempo <= tempoDomanda){
        counter.innerHTML = conta_tempo;
        timeGauge.style.width = conta_tempo * unita + "px";
        conta_tempo++;
    }else{
        conta_tempo = 0;
        if(numero_domanda_corrente < ultima_domanda){
            numero_domanda_corrente++;
						setTimeout(generaDomande,500);
        }else{
            clearInterval(TIMER);
        }
    }
}

//funzione che calcola il punteggio finale,il tempo trascorso del quiz e si sposta nella pagina fine.html
function punteggioFinale(){

		localStorage.setItem("punteggio",punteggio);
		secondi_passati=(new Date() - inizio_tempo ) / 1000;
		secondi_passati=Math.round(secondi_passati);
		localStorage.setItem("tempo",secondi_passati);
		setTimeout(function () {
		   window.location.href = "fine.html";
		}, 1000);

}
//funzione che fa cominciare il gioco
function StartGame(){

    generaDomande();
		document.getElementById("score").innerHTML=punteggio;
		inizio_tempo=new Date();
    TIMER = setInterval(timerDomande,1000);


}
//chiamata delle prime funzioni
var cat_in_number = trasforma_categoria(cat);
var URL = generateURL(cat_in_number,difficolta_scelta,tipo);
console.log(URL);
get_data(URL);
