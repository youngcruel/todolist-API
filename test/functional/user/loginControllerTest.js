import * as chai from "chai";
import chaiHttp from "chai-http";
import app from "../../../server.js";
import { expect } from "chai";
import { request } from "chai-http";
import TestUtils from "../../fixtures/Utils.js";
import { userStatus } from "../../../src/const/constant.js";
import sinon from "sinon";
import cryptoUtils from "../../../src/utils/cryptoUtils.js";

chai.use(chaiHttp);

const sandbox = sinon.createSandbox();

let route = "/user/login";

describe.only("Login User Controller Test", () => {
  beforeEach(async () => {
    sandbox.restore();
  });

  afterEach(async () => {
    sandbox.restore();
    await TestUtils.restore();
  });

  // Success
  describe("/POST/user/login success", () => {
    it("should return 200", async () => {
      const testUser = await TestUtils.createFakeUser(userStatus.ACTIVE, "password");

      const res = await request.execute(app)
        .post(route)
        .send({ email: testUser.email, password: "password123" });

      expect(res).to.have.status(200);
      expect(res.body).to.have.property("accessToken");
      expect(res.body).to.have.property("refreshToken");
        expect(res.body.email).eq(testUser.email);

    const accessToken = res.body.accessToken;
    const refreshToken = res.body.refreshToken;
    const decodedAccessToken = cryptoUtils.verifyJwt(accessToken);
    const decodedRefreshToken = cryptoUtils.verifyJwt(refreshToken);
      expect(decodedAccessToken).to.have.property("email", testUser.email);
      expect(decodedAccessToken).to.have.property("sub", testUser.id.toString());
      expect(decodedAccessToken).to.have.property("iat");
      expect(decodedAccessToken).to.have.property("exp");
      expect(decodedRefreshToken).to.have.property("email", testUser.email);
      expect(decodedRefreshToken).to.have.property("sub", testUser.id.toString());
      expect(decodedRefreshToken).to.have.property("iat");
      expect(decodedRefreshToken).to.have.property("exp");
    });
  });

  // Fail
  describe("/POST/user/login fail", () => {
    it("should return 400 with invalid email", async () => {
      const res = await request.execute(app)
        .post(route)
        .send({ email: "invalidemail", password: "password" });

      expect(res).to.have.status(400);
    });

    it("should return 400 with missing email", async () => {
      const res = await request.execute(app)
        .post(route)
        .send({ password: "password" });

      expect(res).to.have.status(400);
      expect(res.body.message).to.equal('ValidationError: "email" is required');
    });

    it("should return 400 with missing password", async () => {
      const res = await request.execute(app)
        .post(route)
        .send({ email: "email@gmail.com" });

      expect(res).to.have.status(400);
      expect(res.body.message).to.equal('ValidationError: "password" is required');
    });

    it("should return 401 if user doesn't exist", async () => {
      const res = await request.execute(app)
        .post(route)
        .send({ email: "fake_email@gmail.com", password: "password" });

      expect(res).to.have.status(401);
    });

    it("should return 401 if password is wrong", async () => {
      const testUser = await TestUtils.createFakeUser(userStatus.ACTIVE, "correct_password");

      const res = await request.execute(app)
        .post(route)
        .send({ email: testUser.email, password: "wrong_password" });

      expect(res).to.have.status(401);
    });

    it("should return 401 if user is PENDING", async () => {
      const testUser = await TestUtils.createFakeUser(userStatus.PENDING, "password");

      const res = await request.execute(app)
        .post(route)
        .send({ email: testUser.email, password: "password" });

      expect(res).to.have.status(401);
    });

    it("should return 401 if user is DELETED", async () => {
        const testUser = await TestUtils.createFakeUser(userStatus.DELETED, "password");
  
        const res = await request.execute(app)
          .post(route)
          .send({ email: testUser.email, password: "password" });
  
        expect(res).to.have.status(401);
      });
    
  });
});
