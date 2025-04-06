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

let route = "/:id/update";
let user;
let activity;
let accessToken;

describe("Update Activity Controller Test", () => {
  beforeEach(async () => {
    user = await TestUtils.createFakeUser(userStatus.ACTIVE);
    activity = await TestUtils.createFakeActivity(status.OPEN, user.id);
    accessToken = cryptoUtils.generateToken(user.toJWT(), 10000);
  });

  afterEach(async () => {
    await TestUtils.restore();
  });

  describe("/PATCH/:id/update success", () => {
    it("should return 200 and the update activity", async () => {
      //Dati da modificare
      const updatedData = {
        name: "Updated name",
        description: "Updated description",
      };

      //Chiama la PATCH con chai-http
      const res = await request
        .execute(app)
        .patch(route.replace(":id", activity.id))
        .set(`Authorization`, `Bearer ${accessToken}`)
        .set("Content-Type", "application/json")
        .send(updatedData);

      //Verifica la risposta
      expect(res).to.have.status(200);
      expect(res.body.id).to.equal(activity.id);
      expect(res.body.userId).to.equal(activity.userId);
      expect(res.body.name).to.equal(updatedData.name);
      expect(res.body.description).to.equal(updatedData.description);
      expect(res.body.dueDate).to.equal(activity.dueDate.toISOString());

      const activityFromDb = await TestUtils.getActivityById(activity.id);

      expect(activityFromDb.name).to.equal(updatedData.name);
      expect(activityFromDb.description).to.equal(updatedData.description);
      expect(activityFromDb.dueDate.toISOString()).to.equal(
        activity.dueDate.toISOString()
      );
      expect(activityFromDb.userId).to.equal(user.id.toString());
    });

    it("should return 200 and update dueDate", async () => {
      //Dati da modificare
      const updatedData = {
        dueDate: new Date().getTime(),
      };

      //Chiama la PATCH con chai-http
      const res = await request
        .execute(app)
        .patch(route.replace(":id", activity.id))
        .set(`Authorization`, `Bearer ${accessToken}`)
        .set("Content-Type", "application/json")
        .send(updatedData);

      //Verifica la risposta
      expect(res).to.have.status(200);
      expect(res.body.id).to.equal(activity.id);
      expect(res.body.userId).to.equal(activity.userId);
      expect(res.body.dueDate).to.equal(
        new Date(updatedData.dueDate).toISOString()
      );

      const activityFromDb = await TestUtils.getActivityById(activity.id);
      expect(activityFromDb.dueDate.toISOString()).to.equal(
        new Date(updatedData.dueDate).toISOString()
      );
      expect(activityFromDb.userId).to.equal(user.id.toString());
    });
  });

  describe("/PATCH/:id/update fail", () => {
    it("should return 401 if access token is invalid", async () => {
      const invalidAccessToken = "Invalid access token";

      //Chiama la PATCH con chai-http
      const res = await request
        .execute(app)
        .patch(route.replace(":id", activity.id))
        .set(`Authorization`, `Bearer ${invalidAccessToken}`)
        .send();

      //Verifica la risposta
      expect(res).to.have.status(401);
    });

    it("should return 400 if activity id is invalid", async () => {
      //Crea un invalid activity Id
      const invalidActivityId = "Invalid activity Id";

      //Chiama la PATCH con chai-http
      const res = await request
        .execute(app)
        .patch(route.replace(":id", invalidActivityId))
        .set(`Authorization`, `Bearer ${accessToken}`)
        .set("Content-Type", "application/json")
        .send();

      //Verifica la risposta
      expect(res).to.have.status(400);
    });

    it("should return 400 if name < 3", async () => {
      //Crea un invalid activity Id
      const invalidActivityId = "Invalid activity Id";

      //Chiama la PATCH con chai-http
      const res = await request
        .execute(app)
        .patch(route.replace(":id", invalidActivityId))
        .set(`Authorization`, `Bearer ${accessToken}`)
        .set("Content-Type", "application/json")
        .send({ name: "cc" });

      //Verifica la risposta
      expect(res).to.have.status(400);
      expect(res.body.message).to.equal(
        'ValidationError: "name" length must be at least 3 characters long'
      );
    });

    it("should return 400 if description < 3", async () => {
      //Crea un invalid activity Id
      const invalidActivityId = "Invalid activity Id";

      //Chiama la PATCH con chai-http
      const res = await request
        .execute(app)
        .patch(route.replace(":id", invalidActivityId))
        .set(`Authorization`, `Bearer ${accessToken}`)
        .set("Content-Type", "application/json")
        .send({ description: "cc" });

      //Verifica la risposta
      expect(res).to.have.status(400);
      expect(res.body.message).to.equal(
        'ValidationError: "description" length must be at least 3 characters long'
      );
    });

    it("should return 400 dueDate is in the past", async () => {
      //Crea un invalid activity Id
      const invalidActivityId = "Invalid activity Id";

      //Chiama la PATCH con chai-http
      const res = await request
        .execute(app)
        .patch(route.replace(":id", invalidActivityId))
        .set(`Authorization`, `Bearer ${accessToken}`)
        .set("Content-Type", "application/json")
        .send({ dueDate: new Date("2021-01-01").getTime() });

      //Verifica la risposta
      expect(res).to.have.status(400);
    });

    it("should return 404 if activity not found", async () => {
      // Crea un activity Id non presente nel db
      const nonExistentActivityId = TestUtils.generateFakeObjectId().toString();

      //Chiama la PATCH con chai-http
      const res = await request
        .execute(app)
        .patch(route.replace(":id", nonExistentActivityId))
        .set(`Authorization`, `Bearer ${accessToken}`)
        .set("Content-Type", "application/json")
        .send();

      //Verifica la risposta
      expect(res).to.have.status(404);
      expect(res.body.message).to.equal(
        "Attività non trovata o non aggiornata"
      );
      expect(res.body.code).to.equal("ActivityRepository.updateActivity");
    });

    it("should return 404 if user not owner", async () => {
      //Crea un'attività associata ad un altro utente
      const fakeActivity = await TestUtils.createFakeActivity(
        status.OPEN,
        TestUtils.generateFakeObjectId()
      );

      //Chiama la PATCH con chai-http
      const res = await request
        .execute(app)
        .patch(route.replace(":id", fakeActivity.id))
        .set(`Authorization`, `Bearer ${accessToken}`)
        .set("Content-Type", "application/json")
        .send();

      //Verifica la risposta
      expect(res).to.have.status(404);
      expect(res.body.message).to.equal(
        "Attività non trovata o non aggiornata"
      );
      expect(res.body.code).to.equal("ActivityRepository.updateActivity");
    });
  });
});
