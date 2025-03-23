import InternalServerException from "./InternalServerException.js"; // Importazione della classe InternalServerException

class MongoInternalException extends InternalServerException { // Definizione della classe MongoInternalException che estende la classe InternalServerException
  constructor(message, code) { // Costruttore della classe MongoInternalException che accetta un messaggio e un codice come parametri
    super(message, code); // Chiamata al costruttore della classe InternalServerException con il messaggio e il codice come argomenti
  }
}

export default MongoInternalException;

//In questo snippet di codice, ho creato una classe MongoInternalException che estende la classe InternalServerException.
//La classe MongoInternalException accetta un messaggio e un codice come parametri e chiama il costruttore della classe InternalServerException.
//La classe MongoInternalException è progettata per gestire eccezioni interne del server specifiche di MongoDB nell'applicazione.       
//Questa classe può essere utilizzata per identificare e gestire errori interni del server che si verificano durante l'interazione con MongoDB.
//La classe MongoInternalException estende la classe InternalServerException, che a sua volta estende la classe Exception,
//per fornire una gerarchia di eccezioni per gestire diversi tipi di errori nell'applicazione.
//La classe MongoInternalException può essere utilizzata per catturare e gestire eccezioni specifiche di MongoDB in modo da
//fornire un feedback appropriato all'utente e registrare gli errori per la risoluzione dei problemi.