import InternalServerException from "./InternalServerException.js";

class NotCreatedException extends InternalServerException {
  constructor(message, code) {
    super(message, code);
  }
}

export default NotCreatedException;
