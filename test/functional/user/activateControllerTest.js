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

const route = "/user/activate/:token";

describe("Activate User Controller Test", () => {
  beforeEach(async () => {
    sandbox.restore();
  });

  afterEach(async () => {
    sandbox.restore();
    await TestUtils.restore();
  });

  // Success
  describe("GET /user/activate/:token success", () => {
    
    it.only("should return 200", async () => {
      
      const testUser = await TestUtils.createFakeUser(userStatus.ACTIVE, "password");
      const activationToken = await TestUtils.createFakeToken(testUser.id, testUser.token);
      const res = await request.execute(app)
        .get(route.replace(":token", activationToken.registrationToken));

    expect(res).to.have.status(200);
    console.log("res", res.body);
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
  describe("/GET/user/activate/:token fail", () => {
   
    it("should return 400 if token length <10", async () => {
      const res = await request.execute(app)
        .get(route.replace(":token", "123456789"))
        .send();

      expect(res).to.have.status(400);
      expect(res.body.message).to.equal('ValidationError: "token" length must be 10 characters long');
    });
    it("should return 400 if token length >10", async () => {
      const res = await request.execute(app)
        .get(route.replace(":token", "1234567ddd89"))
        .send();

      expect(res).to.have.status(400);
      expect(res.body.message).to.equal('ValidationError: "token" length must be 10 characters long');
    });
    it("should return 404 if token is not found", async () => {
      const res = await request.execute(app)
        .get(route.replace(":token", "0123456789"))
        .send();

      expect(res).to.have.status(404);
      expect(res.body.message).to.equal('ValidationError: "token" not found');
    });
    it("should return 404 if user has status DELETED", async () => {
     const testUser = await TestUtils.createFakeUser(userStatus.DELETED, "password");
     const activationToken = await TestUtils.createFakeToken(testUser.id, testUser.token);

      const res = await request.execute(app)
        .get(route.replace(":token", activationToken.registrationToken))
        .send();

      expect(res).to.have.status(404);
    });
    
  });
});
