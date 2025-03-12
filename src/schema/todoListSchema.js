// Questo codice definisce uno schema Mongoose per un'applicazione di gestione delle attività (to-do list)

import mongoose from "mongoose"; // Importa il modulo mongoose per la gestione del database
import {status} from "../const/constant.js"; // Importa la costante status da constant.js, file di costanti che definisce i possibili stati di una attività

const todolistSchema = new mongoose.Schema(  // Definizione schema Mongoose per la collezione "Activity"
  {
    name: String,  // Stringa contenente il nome dell'attività
    description: String, // Stringa contenente la descrizione dell'attività
    dueDate: {  // Data di scadenza dell'attività (data e ora corrente di default date.now)
      type: Date,
      default: Date.now,
    },
    status: { // Stato dell'attività (aperta, in corso, completata)
        type: String,  // Stringa che rappresenta lo stato dell'attività
        default: status.OPEN, // Stato di default: "aperta"
    }
  },
  {
    timestamps: {  // Aggiunge automaticamente i campi created_at e updated_at per tenere traccia della creazione e dell'aggiornamento dei documenti.
      createdAt: "created_at", 
      updatedAt: "updated_at", 
      wrightConcern: { // Specifica le opzioni di scrittura per il documento
        w: 1, // Operazione deve essere confermata da un solo nodo
        wtimeout: 2000, // Timeout di 2 secondi
      },
    },
  }
);

const activity = mongoose.model("Activity", todolistSchema); // Crea il modello "Activity" a partire dallo schema "todolistSchema"

export default activity; // Esporta il modello "Activity" per poterlo utilizzare in altri file del progetto

// In sintesi, questo codice definisce uno schema per le attività di una to-do list, 
// specificando i campi e le loro proprietà, e crea un modello Mongoose basato sullo schema todolistSchema per interagire con il database MongoDB.