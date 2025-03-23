import DomainException from "./DomainException.js"; // Importazione della classe DomainException

class UnauthorizedException extends DomainException { // Definizione della classe UnauthorizedException che estende la classe DomainException
  constructor(message, code) {  // Costruttore della classe UnauthorizedException che accetta un messaggio e un codice come parametri
    super(message); // Chiamata al costruttore della classe DomainException con il messaggio come argomento
    this.code = code || null; // Impostazione del codice dell'eccezione sul codice specificato o null se non specificato
    this.status = 401; // Impostazione dello status dell'eccezione su 401
  }
}

export default UnauthorizedException;

