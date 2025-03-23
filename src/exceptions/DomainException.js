class DomainException extends Error { 
  constructor(message) { 
    super(message); 
    this.name = 'DomainException'; 
    error.captureStackTrace(this, this.constructor);
  }
}

export default DomainException;

