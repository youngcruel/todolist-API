import DomainException from "./DomainException.js"; // Importazione della classe DomainException

class InternalServerException extends DomainException { // Definizione della classe InternalServerException che estende la classe DomainException
  constructor(message, code) {  // Costruttore della classe InternalServerException che accetta un messaggio e un codice come parametri
    super(message); // Chiamata al costruttore della classe DomainException con il messaggio come argomento
    this.code = code || null; // Impostazione del codice dell'eccezione sul codice specificato o null se non specificato
    this.status = 500; // Impostazione dello status dell'eccezione su 500 (Internal Server Error)
  }
}

export default InternalServerException;

//In questo snippet di codice, ho creato una classe InternalServerException che estende la classe DomainException.
//La classe InternalServerException accetta un messaggio e un codice come parametri e chiama il costruttore della classe DomainException.
//La classe InternalServerException è progettata per gestire eccezioni interne del server nell'applicazione.
//Questa classe può essere utilizzata per identificare e gestire errori interni del server che si verificano durante l'esecuzione dell'applicazione.
//La classe InternalServerException estende la classe DomainException, che a sua volta estende la classe Error di JavaScript,
//per fornire una gerarchia di eccezioni per gestire diversi tipi di errori nell'applicazione.