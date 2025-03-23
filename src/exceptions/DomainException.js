class DomainException extends Error { // Definizione della classe DomainException che estende la classe Error
  constructor(message) { // Costruttore della classe DomainException che accetta un messaggio come parametro
    super(message); // Chiamata al costruttore della classe Error con il messaggio come argomento
    this.name = 'DomainException'; // Impostazione del nome dell'eccezione su 'DomainException'
    error.captureStackTrace(this, this.constructor); // Cattura lo stack trace di chiamate dell'eccezione
  }
}

export default DomainException;

//In questo snippet di codice, ho creato una classe DomainException che estende la classe Error di JavaScript.
//La classe DomainException accetta un messaggio come parametro e imposta il nome dell'eccezione su 'DomainException'.
//Ho utilizzato il metodo super() per chiamare il costruttore della classe Error e passare il messaggio come argomento.
//Ho impostato il nome dell'eccezione su 'DomainException' utilizzando this.name.
//Ho utilizzato il metodo captureStackTrace() per catturare lo stack trace dell'eccezione.
//Infine, ho esportato la classe DomainException per poterla utilizzare in altri file dell'applicazione.
//Questa classe DomainException può essere utilizzata per gestire eccezioni specifiche del dominio nell'applicazione.
//Ad esempio, se si verifica un errore durante l'elaborazione di un'operazione di dominio, è possibile lanciare un'eccezione DomainException
//con un messaggio di errore specifico per identificare il problema.
//Questo aiuta a distinguere gli errori di dominio dagli errori generici e a gestirli in modo appropriato nell'applicazione.
//La classe DomainException può essere estesa per creare eccezioni specifiche del dominio con comportamenti personalizzati
//e messaggi di errore specifici per ciascuna situazione.