import DomainException from "./DomainException.js"; // Importazione della classe DomainException

class NotFoundException extends DomainException { // Definizione della classe NotFoundException che estende la classe DomainException
  constructor(message, code) {  // Costruttore della classe NotFoundException che accetta un messaggio e un codice come parametri
    super(message); // Chiamata al costruttore della classe DomainException con il messaggio come argomento
    this.code = code || null; // Impostazione del codice dell'eccezione sul codice specificato o null se non specificato
    this.status = 404; // Impostazione dello status dell'eccezione su 404 
  }
}

export default NotFoundException;

