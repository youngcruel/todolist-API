import * as chai from "chai";
import chaiHttp from "chai-http";
import app from "../../../server.js";
import { expect } from "chai";
import { request } from "chai-http";
import cryptoUtils from "../../../src/utils/cryptoUtils.js";
import TestUtils from "../../fixtures/Utils.js";
import { userStatus } from "../../../src/const/constant.js";
import { status } from "../../../src/const/constant.js";

chai.use(chaiHttp);

let route = "/";
let user;
let activitiesOpen;
let activitiesCompleted;
let activitiesDeleted;
let activitiesArchived;
let accessToken;

describe("GET Activities By Skip and Limit", () => {
  beforeEach(async () => {
    user = await TestUtils.createFakeUser(userStatus.ACTIVE);
    activitiesOpen = await TestUtils.createManyActivities(
      user.id,
      status.OPEN,
      20
    );
    activitiesCompleted = await TestUtils.createManyActivities(
      user.id,
      status.COMPLETED,
      20
    );
    activitiesDeleted = await TestUtils.createManyActivities(
      user.id,
      status.DELETED,
      20
    );
    activitiesArchived = await TestUtils.createManyActivities(
      user.id,
      status.ARCHIVED,
      20
    );

    accessToken = cryptoUtils.generateToken(user.toJWT(), 10000);
  });

  afterEach(async () => {
    await TestUtils.restore();
  });

  //Success
  describe("/GET/ success", () => {
    it("should return 200 with default parameters (page = 1, limit = 10, status = status.OPEN )", async () => {
      //Chiama la GET con chai-http
      const res = await request
        .execute(app)
        .get(route)
        .set(`Authorization`, `Bearer ${accessToken}`)
        .send();

      //Verifica la risposta
      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array");
      expect(res.body.length).to.be.at.most(10);

      //Verifica ogni attività
      res.body.forEach((activity) => {
        expect(activity.status).to.equal(status.OPEN);
        expect(activity).to.have.property("id");
        expect(activity).to.have.property("name");
        expect(activity).to.have.property("description");
        expect(activity).to.have.property("status");
        expect(activity).to.have.property("userId");
        expect(activity.userId).to.equal(user.id);
      });

      //Verifica nel db
      const dbActivity = await TestUtils.getActivityById(res.body[0].id);
      expect(dbActivity.status).to.equal(status.OPEN);
      expect(dbActivity.userId).to.equal(user.id);
    });

    it("should return 200 with parameters (page = 1, limit = 15, status = status.COMPLETED )", async () => {
      //Chiama la GET con chai-http
      const res = await request
        .execute(app)
        .get(route)
        .set(`Authorization`, `Bearer ${accessToken}`)
        .query({ page: 1, limit: 15, status: status.COMPLETED })
        .send();

      //Verifica la risposta
      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array");
      expect(res.body.length).to.be.at.most(15);

      //Verifica ogni attività
      res.body.forEach((activity) => {
        expect(activity.status).to.equal(status.COMPLETED);
        expect(activity.userId).to.equal(user.id);
      });
    });

    it("should return 200 and the activities with status = deleted", async () => {
      //Chiama la GET con chai-http
      const res = await request
        .execute(app)
        .get(route)
        .set(`Authorization`, `Bearer ${accessToken}`)
        .query({ page: 1, limit: 15, status: status.DELETED })
        .send();

      //Verifica la risposta
      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array");
      expect(res.body.length).to.be.at.most(15);

      //Verifica ogni attività
      res.body.forEach((activity) => {
        expect(activity.status).to.equal(status.DELETED);
        expect(activity.userId).to.equal(user.id);
      });
    });

    it("should return 200 and the activities with status = archived", async () => {
      //Chiama la GET con chai-http
      const res = await request
        .execute(app)
        .get(route)
        .set(`Authorization`, `Bearer ${accessToken}`)
        .query({ page: 1, limit: 15, status: status.ARCHIVED })
        .send();

      //Verifica la risposta
      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array");
      expect(res.body.length).to.be.at.most(15);

      //Verifica ogni attività
      res.body.forEach((activity) => {
        expect(activity.status).to.equal(status.ARCHIVED);
        expect(activity.userId).to.equal(user.id);
      });
    });

    it("should return the correct second page of activities (page = 2, limit = 5, status = open)", async () => {
      // Prima richiesta - pagina 1
      const resPage1 = await request
        .execute(app)
        .get(route)
        .set("Authorization", `Bearer ${accessToken}`)
        .query({ page: 1, limit: 5, status: status.OPEN })
        .send();

      // Seconda richiesta - pagina 2
      const resPage2 = await request
        .execute(app)
        .get(route)
        .set("Authorization", `Bearer ${accessToken}`)
        .query({ page: 2, limit: 5, status: status.OPEN })
        .send();

      // Verifica risposte
      expect(resPage1).to.have.status(200);
      expect(resPage2).to.have.status(200);

      expect(resPage1.body).to.be.an("array");
      expect(resPage1.body.length).to.be.at.most(5);

      expect(resPage2.body).to.be.an("array");
      expect(resPage2.body.length).to.be.at.most(5);

      // Verifica che gli ID della seconda pagina siano diversi dalla prima
      resPage2.body.forEach((activity, index) => {
        expect(activity.id).to.not.equal(resPage1.body[index].id);
      });
    });
  });
  //Fail
  describe("/GET/ fail", () => {
    it("should return 401 if access token is invalid", async () => {
      const invalidAccessToken = "Invalid access token";

      //Chiama la GET con chai-http
      const res = await request
        .execute(app)
        .get(route)
        .set(`Authorization`, `Bearer ${invalidAccessToken}`)
        .send();

      //Verifica la risposta
      expect(res).to.have.status(401);
    });

    it("should return 404 if activities not found", async () => {
      const emptyUser = await TestUtils.createFakeUser(userStatus.ACTIVE);
      accessToken = cryptoUtils.generateToken(emptyUser.toJWT(), 10000);

      //Chiama la PATCH con chai-http
      const res = await request
        .execute(app)
        .get(route)
        .set("Authorization", `Bearer ${accessToken}`)
        .send();

      //Verifica la risposta
      expect(res).to.have.status(404);
    });

    it("should return 404 if user not owner", async () => {
      // Crea un altro utente
      const anotherUser = await TestUtils.createFakeUser(userStatus.ACTIVE);
      const anotherAccessToken = cryptoUtils.generateToken(
        anotherUser.toJWT(),
        10000
      );

      //Chiama la PATCH con chai-http
      const res = await request
        .execute(app)
        .get(route)
        .set("Authorization", `Bearer ${anotherAccessToken}`)
        .send();

      //Verifica la risposta
      expect(res).to.have.status(404);
    });
  });
});
