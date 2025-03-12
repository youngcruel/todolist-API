//Questo codice definisce una classe JavaScript chiamata Activity che rappresenta un'attività in un'applicazione di gestione delle attività.

class Activity {  //La classe Activity utilizza proprietà private (indicate dal prefisso #) per memorizzare i dettagli dell'attività
    #name;          //Nome dell'attività
    #description;   //Descrizione dell'attività
    #dueDate;       //Data di scadenza dell'attività
    #status;        //Stato dell'attività
    #id;            //ID dell'attività nel database

  //Il costruttore della classe accetta un oggetto activity come parametro e inizializza le proprietà private con i valori corrispondenti dell'oggetto  
  constructor(activity) {  
    this.#id = activity._id.toString(); //L'ID dell'attività viene convertito in una stringa e assegnato alla proprietà privata #id
    this.#name = activity.name;         //Il nome dell'attività viene assegnato alla proprietà privata #name
    this.#description = activity.description;  //La descrizione dell'attività viene assegnata alla proprietà privata #description
    this.#dueDate = activity.dueDate;          //La data di scadenza dell'attività viene assegnata alla proprietà privata #dueDate
    this.#status = activity.status;            //Lo stato dell'attività viene assegnato alla proprietà privata #status
  }
  //La classe Activity definisce i metodi getter per accedere alle proprietà private dell'attività
  get name() {         
    return this.#name;  //Il metodo getter name restituisce il valore della proprietà privata #name
  }
  get description() {
    return this.#description;  //Il metodo getter description restituisce il valore della proprietà privata #description
  }
  get dueDate() {
    return this.#dueDate;   //Il metodo getter dueDate restituisce il valore della proprietà privata #dueDate
  }
  get status() {  
    return this.#status;  //Il metodo getter status restituisce il valore della proprietà privata #status
  }
    get id() {
        return this.#id; //Il metodo getter id restituisce il valore della proprietà privata #id
    }
    toJSON() {    //Il metodo toJSON restituisce un oggetto che rappresenta l'attività in formato JSON, utile per serializzare l'oggetto Activity in una stringa JSON
        return {
            id: this.#id,
            name: this.#name,
            description: this.#description,
            dueDate: this.#dueDate,
            status: this.#status,
        };
    }
}

export default Activity; //Esporto la classe Activity come modulo per essere utilizzata in altri file del progetto

//La classe Activity incapsula i dettagli di un'attività e fornisce metodi per accedere e manipolare questi dettagli.
//La classe utilizza proprietà private per memorizzare i dettagli dell'attività, garantendo che siano accessibili solo all'interno della classe stessa.
//La classe fornisce metodi getter per accedere alle proprietà private dell'attività, consentendo di ottenere i valori delle proprietà in modo sicuro.
//La classe definisce un metodo toJSON per convertire l'oggetto Activity in un oggetto JSON, utile per la serializzazione e la trasmissione dei dati.
//La classe Activity è progettata per essere utilizzata in un'applicazione di gestione delle attività, dove è necessario rappresentare e manipolare le attività.
//La classe Activity è un esempio di incapsulamento e astrazione, due principi fondamentali della programmazione orientata agli oggetti.
//La classe Activity può essere estesa e personalizzata per soddisfare le esigenze specifiche dell'applicazione in cui viene utilizzata.
//La classe Activity è un componente chiave dell'applicazione di gestione delle attività e svolge un ruolo fondamentale nella gestione e visualizzazione delle attività.
//La classe Activity è progettata per essere facile da usare e estendere, consentendo di creare e gestire attività in modo efficiente e intuitivo.

//Alternativa agli schema di mongoose, definisce uno schema per le attività