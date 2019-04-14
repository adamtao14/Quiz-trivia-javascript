//chiavi di accesso e informazione che servono a firebase per connettersi al database
var config = {
    apiKey: "AIzaSyDuoj7Zp-st4p6qE28LeV5n2LtzzSpXX68",
    authDomain: "trivia-quiz-90137.firebaseapp.com",
    databaseURL: "https://trivia-quiz-90137.firebaseio.com",
    projectId: "trivia-quiz-90137",
    storageBucket: "trivia-quiz-90137.appspot.com",
    messagingSenderId: "868976708801"
  };
  firebase.initializeApp(config);

//display delle informazioni riguardanti la partita del giocatore
document.getElementById("nome_finale").innerHTML="<span class='red'>Nome</span> : "+localStorage.getItem("nome");
document.getElementById("categoria_finale").innerHTML="<span class='red'>categoria</span> : "+localStorage.getItem("categoria");
document.getElementById("difficolta_finale").innerHTML="<span class='red'>difficolta</span> : "+localStorage.getItem("difficolta");
document.getElementById("punteggio_finale").innerHTML="<span class='red'>punteggio</span> : "+localStorage.getItem("punteggio");
document.getElementById("domande_finale").innerHTML="<span class='red'>N Domande</span> : "+localStorage.getItem("numero_domande");
document.getElementById("tempo_finale").innerHTML="<span class='red'>tempo</span> : "+localStorage.getItem("tempo")+"s";
var data_attuale = new Date();
var data_formattata =  [data_attuale.getDate(), data_attuale.getMonth(), data_attuale.getFullYear()].join('/');
//inizializzazione del databse
var database = firebase.database();
var ref = database.ref('risultati');

//oggetto dati che contiene le informazioni della partita dell'utente e che verrà caricata sul database
var data={

  nome : localStorage.getItem("nome"),
  categoria : localStorage.getItem("categoria"),
  difficolta : localStorage.getItem("difficolta"),
  punteggio : localStorage.getItem("punteggio"),
  tempo : localStorage.getItem("tempo"),
  data_gioco : data_formattata,
  numero_domande:localStorage.getItem("numero_domande")

}
//upload dei dati sul database
function carica(){

    ref.push(data);

}
//funzione che visualizza tutti i risultati contenuti nel database
function ricevuto(data){
  var risultati = data.val();
  var output ="<table class='tabella'>";
  var identificativi = Object.keys(risultati);
  console.log(risultati);
  output +=`
          <tr class='iniziali'>
            <td>Nome</td>
            <td>Data</td>
            <td>Difficoltà</td>
            <td>Categoria</td>
            <td>N Domande</td>
            <td>Punteggio</td>
            <td>Tempo(s)</td>
          </tr>

  `;
  for(var i = 0;i<identificativi.length;i++){
    var k = identificativi[i];
    output += `
            <tr>
              <td>`+risultati[k].nome+`</td>
              <td>`+risultati[k].data_gioco+`</td>
              <td>`+risultati[k].difficolta+`</td>
              <td>`+risultati[k].categoria+`</td>
              <td>`+risultati[k].numero_domande+`</td>
              <td>`+risultati[k].punteggio+`</td>
              <td>`+risultati[k].tempo+`</td>
            </tr>
    `;
  }
  output += `</table>`;
  document.getElementById("risultati_data").innerHTML=output;
}
//funzione che visualizza eventuali errori occorsi durante la fase di chiamata del database
function errore(err){
  console.log(err);
}
function estrai(){

  ref.on('value',ricevuto,errore);


}
//redirect alla prima pagina
function torna(){

   window.location.href = "TriviaGameHome.html";
}
