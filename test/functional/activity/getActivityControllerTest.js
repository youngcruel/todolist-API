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

let route = "/:id/activity";
let user;
let activity;
let accessToken;

describe("GET Activity By Id", () => {
  beforeEach(async () => {
    user = await TestUtils.createFakeUser(userStatus.ACTIVE);
    accessToken = cryptoUtils.generateToken(user.toJWT(), 10000);
    activity = await TestUtils.createFakeActivity(status.OPEN, user.id);
  });

  afterEach(async () => {
    await TestUtils.restore();
  });

  //Success
  describe("/GET/:id/activity success", () => {
    it("should return 200 and the activity", async () => {
      //Chiama la GET con chai-http
      const res = await request
        .execute(app)
        .get(route.replace(":id", activity.id))
        .set(`Authorization`, `Bearer ${accessToken}`)
        .send();

      //Verifica la risposta
      expect(res).to.have.status(200);
      expect(res.body.status).to.equal(status.OPEN);
      expect(res.body.id).to.equal(activity.id);
      expect(res.body.userId).to.equal(activity.userId);
      expect(res.body.name).to.equal(activity.name);
      expect(res.body.description).to.equal(activity.description);
      expect(res.body.dueDate).to.equal(activity.dueDate.toISOString());

      //Verifica che l'attività sia stata aggiornata nel database
      const activityFromDb = await TestUtils.getActivityById(activity.id);
      expect(activityFromDb.status).to.equal(status.OPEN);
      expect(activityFromDb.name).to.equal(activity.name);
      expect(activityFromDb.description).to.equal(activity.description);
      expect(activityFromDb.dueDate.toISOString()).to.equal(
        activity.dueDate.toISOString()
      );
      expect(activityFromDb.userId).to.equal(user.id);
    });
  });

  //Fail
  describe("/GET/:id/activity fail", () => {
    it("should return 401 if access token is invalid", async () => {
      const invalidAccessToken = "Invalid access token";

      //Chiama la GET con chai-http
      const res = await request
        .execute(app)
        .get(route.replace(":id", activity.id))
        .set(`Authorization`, `Bearer ${invalidAccessToken}`)
        .send();

      //Verifica la risposta
      expect(res).to.have.status(401);
    });

    it("should return 400 if activityId is invalid", async () => {
      const invalidActivityId = "Invalid actyvity id";

      //Chiama la GET con chai-http
      const res = await request
        .execute(app)
        .get(route.replace(":id", invalidActivityId))
        .set(`Authorization`, `Bearer ${accessToken}`)
        .send();

      //Verifica la risposta
      expect(res).to.have.status(400);
    });

    it("should return 404 if user not owner", async () => {
      // Crea un altro utente
      const anotherUser = await TestUtils.createFakeUser(userStatus.ACTIVE);
      const anotherAccessToken = cryptoUtils.generateToken(
        anotherUser.toJWT(),
        10000
      );

      //Chiama la GET con chai-http
      const res = await request
        .execute(app)
        .get(route.replace(":id", activity.id))
        .set(`Authorization`, `Bearer ${anotherAccessToken}`)
        .send();

      //Verifica la risposta
      expect(res).to.have.status(404);
      expect(res.body.message).eq("Attività non trovata");
      expect(res.body.code).eq("ActivityRepository.getActivity");
    });

    it("should return 404 if activity not exist", async () => {
      // Crea un altro utente
      const unexistActyvityId =
        await TestUtils.generateFakeObjectId().toString();

      //Chiama la GET con chai-http
      const res = await request
        .execute(app)
        .get(route.replace(":id", unexistActyvityId))
        .set(`Authorization`, `Bearer ${accessToken}`)
        .send();

      //Verifica la risposta
      expect(res).to.have.status(404);
      expect(res.body.message).eq("Attività non trovata");
      expect(res.body.code).eq("ActivityRepository.getActivity");
    });
  });
});
