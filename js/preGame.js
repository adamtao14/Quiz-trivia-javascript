//Dichiarazione delle diverse variabili e acquisizione degli elementi nell'html

if( /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {

 	alert("non puoi giocare sui dispositivi mobili");
 	document.location.href="nonPuoiGiocare.html";
 }
else{
    //ciao
    localStorage.clear();
}



var count = 5;
var actual = 0;
var username = document.getElementById("nome");
var bottone = document.getElementById("pronto");





//Controlliamo i dati in input dell'utente e li salviamo nella local storage del browser

bottone.addEventListener("click", function(){

	if(username.value=="" || username.value.length < 4 || username.value.length > 15){

		alert("Il nome utente deve avere tra i 4 e 15 caratteri");
	}else{
		bottone.disabled=true;
		var categoria = document.getElementById("categoria");
		var scelta_categoria = categoria.options[categoria.selectedIndex].value;
		var difficolta = document.getElementById("difficolta");
		var scelta_difficolta = difficolta.options[difficolta.selectedIndex].value;
    var domande=document.getElementById("num_domande");
    var numero_domande=domande.options[domande.selectedIndex].value;
		if (typeof(Storage) !== "undefined") {

			  localStorage.setItem("nome", username.value);
			  localStorage.setItem("categoria", scelta_categoria);
			  localStorage.setItem("difficolta", scelta_difficolta);
        localStorage.setItem("numero_domande", numero_domande);
        getSessionToken();
			} else {
			  alert("Il tuo browser non supporta Web Storage...");
			}
		countdown();  //se tutto va bene parte il countdown
	}

});

//funzione che fa partire il countdown prima dell'inizio del gioco
function countdown(){

	var counting = setInterval(function(){


		document.getElementById("timer").innerHTML=count-actual;
		actual=actual+1;

		if(actual==6){
			clearInterval(counting);
			setTimeout(redirect,900); //una volta finito il countdown c'è il redirect alla pagina del quiz
		}

	},1000);



}
//otteniamo la chiave di sessione per non ripetere le stesse domande
function getSessionToken(){
	var session_url="https://opentdb.com/api_token.php?command=request";

	fetch(session_url).then(response => {

  	return response.json();

	}).then(data => {

		  session_token = data.token;
		  localStorage.setItem("sessione",session_token);
		  console.log(session_token);

	}).catch(err => {

	});
}

//redirect alla pagina del quiz

function redirect(){

  document.location.href = "quiz.html";

}
