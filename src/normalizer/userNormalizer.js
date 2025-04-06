class UserNormalizer {
  #user;

  constructor(user) {
    this.#user = user;
  }

  getLogin() {
    return {
      id: this.#user.id.toString(),
      email: this.#user.email,
      accessToken: this.#user.accessToken,
      refreshToken: this.#user.refreshToken,
    };
  }
  //getFullUser per restituire anche le altre propr
}

export default UserNormalizer;
