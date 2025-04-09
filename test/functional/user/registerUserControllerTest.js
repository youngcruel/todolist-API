import * as chai from "chai";
import chaiHttp from "chai-http";
import app from "../../../server.js";
import { expect } from "chai";
import { request } from "chai-http";
import cryptoUtils from "../../../src/utils/cryptoUtils.js";
import TestUtils from "../../fixtures/Utils.js";
import { userStatus } from "../../../src/const/constant.js";
import sinon from "sinon";
import BasicEmailGateway from "../../../src/gateway/BasicEmailGateway.js";
import registrationTokenSchema from "../../../src/schema/registrationTokenSchema.js";

chai.use(chaiHttp);
const sandbox = sinon.createSandbox();

let route = "/user";
let stub;

describe("Register User Controller Test", () => {
  beforeEach(async () => {
    stub = sandbox
      .stub(BasicEmailGateway.prototype, "sendRegistrationEmail")
      .resolves("email sent");
  });

  afterEach(async () => {
    sandbox.restore();
    await TestUtils.restore();
  });

  //Success
  describe("/POST/user success", () => {
    it("should return 201 with message 'Registrazione riuscita! Controlla la tua email per confermare l'account.'", async () => {
      //Chiama la POST con chai-http
      const res = await request
        .execute(app)
        .post(route)
        .send({ email: "email1@gmail.com", password: "password" });

      //Verifica la risposta
      expect(res).to.have.status(201);
      expect(res.body.message).to.equal(
        "Registrazione riuscita! Controlla la tua email per confermare l'account."
      );

      //Verifica la creazione user
      const userFromDb = await TestUtils.getUserByEmail("email1@gmail.com");
      expect(userFromDb.email).eq("email1@gmail.com");
      expect(userFromDb.status).eq(userStatus.PENDING);
      expect(userFromDb.password).to.not.equal("password");
      expect(userFromDb.salt).to.be.a("string");

      // Verifica creazione token
      const token = await TestUtils.getTokenByUserId(userFromDb.id);
      expect(token.userId).eq(userFromDb.id);
      expect(token.registrationToken).to.be.a("string");

      // Verifica invio email
      expect(stub.calledOnce).to.be.true;
      expect(stub.calledWith(userFromDb.email, token.registrationToken)).to.be
        .true;
    });
  });

  //Fail
  describe("/POST/user fail", () => {
    it("should return 400 with invalid mail", async () => {
      //Chiama la POST con chai-http
      const res = await request
        .execute(app)
        .post(route)
        .send({ email: "email", password: "password" });

      //Verifica la risposta
      expect(res).to.have.status(400);
    });

    it("should return 400 with missing mail", async () => {
      //Chiama la POST con chai-http
      const res = await request
        .execute(app)
        .post(route)
        .send({ password: "password" });

      //Verifica la risposta
      expect(res).to.have.status(400);
      expect(res.body.message).eq('ValidationError: "email" is required');
    });

    it("should return 400 and missing password", async () => {
      //Chiama la POST con chai-http
      const res = await request
        .execute(app)
        .post(route)
        .send({ email: "email@gmail.com" });

      //Verifica la risposta
      expect(res).to.have.status(400);
      expect(res.body.message).eq('ValidationError: "password" is required');
    });

    it("should return 500 if email user already exist", async () => {
      //Crea uno user
      const user = await TestUtils.createFakeUser(userStatus.ACTIVE);

      //Chiama la POST con chai-http
      const res = await request
        .execute(app)
        .post(route)
        .send({ email: user.email, password: "password" });
      //Verifica la risposta
      expect(res).to.have.status(500);
      expect(res.body.message).eq("Errore durante la creazione dell'utente");
    });
  });
});
