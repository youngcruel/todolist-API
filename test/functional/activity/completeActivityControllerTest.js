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

let route = "/:id/complete";
let user;
let activity;
let accessToken;

describe("Complete Activity Controller Test", () => {
  beforeEach(async () => {
    user = await TestUtils.createFakeUser(userStatus.ACTIVE);
    activity = await TestUtils.createFakeActivity(status.OPEN, user.id);
    accessToken = cryptoUtils.generateToken(user.toJWT(), 10000);
  });

  afterEach(async () => {
    await TestUtils.restore();
  });

  describe("/PATCH/:id/complete success", () => {
    it("should return 200 and the completed activity", async () => {
      //Chiama la PATCH con chai-http
      const res = await request
        .execute(app)
        .patch(route.replace(":id", activity.id))
        .set(`Authorization`, `Bearer ${accessToken}`)
        .send();

      //Verifica la risposta
      expect(res).to.have.status(200);
      expect(res.body.status).to.equal(status.COMPLETED);
      expect(res.body.id).to.equal(activity.id);
      expect(res.body.userId).to.equal(activity.userId);
      expect(res.body.name).to.equal(activity.name);
      expect(res.body.description).to.equal(activity.description);
      expect(res.body.dueDate).to.equal(activity.dueDate.toISOString());

      //Verifica che l'attività sia stata aggiornata nel database
      const activityFromDb = await TestUtils.getActivityById(activity.id);
      expect(activityFromDb.status).to.equal(status.COMPLETED);
      expect(activityFromDb.name).to.equal(activity.name);
      expect(activityFromDb.description).to.equal(activity.description);
      expect(activityFromDb.dueDate.toISOString()).to.equal(
        activity.dueDate.toISOString()
      );
      expect(activityFromDb.userId).to.equal(user.id);
    });

    it("should return 200 if activity status is already completed", async () => {
      //Crea un'attività associata a quell'utente ma con status DELETED (invalid)
      const activity = await TestUtils.createFakeActivity(
        status.COMPLETED,
        user.id
      );

      //Chiama la PATCH con chai-http
      const res = await request
        .execute(app)
        .patch(route.replace(":id", activity.id))
        .set(`Authorization`, `Bearer ${accessToken}`)
        .send();

      //Verifica la risposta
      expect(res).to.have.status(200);
      expect(res.body.status).to.equal(status.COMPLETED);
      expect(res.body.id).to.equal(activity.id);
      expect(res.body.userId).to.equal(activity.userId);
      expect(res.body.name).to.equal(activity.name);
      expect(res.body.description).to.equal(activity.description);
      expect(res.body.dueDate).to.equal(activity.dueDate.toISOString());
    });
  });

  describe("/PATCH/:id/complete fail", () => {
    it("should return 401 if access token is invalid", async () => {
      //Genera token richiesto dal middleware auth
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

    it("should return 400 if if activity id is invalid", async () => {
      //Crea un invalid activity Id
      const invalidActivityId = "Invalid activity Id";

      //Chiama la PATCH con chai-http
      const res = await request
        .execute(app)
        .patch(route.replace(":id", invalidActivityId))
        .set(`Authorization`, `Bearer ${accessToken}`)
        .send();

      //Verifica la risposta
      expect(res).to.have.status(400);
    });

    it("should return 404 if activity not found", async () => {
      // Crea un activity Id non presente nel db
      const nonExistentActivityId = TestUtils.generateFakeObjectId();

      //Chiama la PATCH con chai-http
      const res = await request
        .execute(app)
        .patch(route.replace(":id", nonExistentActivityId))
        .set(`Authorization`, `Bearer ${accessToken}`)
        .send();

      //Verifica la risposta
      expect(res).to.have.status(404);
      expect(res.body.message).to.equal(
        "Attività non trovata o non aggiornata"
      );
      expect(res.body.code).to.equal("ActivityRepository.completeActivity");
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
        .send();

      //Verifica la risposta
      expect(res).to.have.status(404);
      expect(res.body.message).to.equal(
        "Attività non trovata o non aggiornata"
      );
      expect(res.body.code).to.equal("ActivityRepository.completeActivity");
    });

    it("should return 404 if activity status is deleted", async () => {
      //Crea un'attività associata a quell'utente ma con status DELETED (invalid)
      const activity = await TestUtils.createFakeActivity(
        status.DELETED,
        user.id
      );

      //Chiama la PATCH con chai-http
      const res = await request
        .execute(app)
        .patch(route.replace(":id", activity.id))
        .set(`Authorization`, `Bearer ${accessToken}`)
        .send();

      //Verifica la risposta
      expect(res).to.have.status(404);
      expect(res.body.message).to.equal(
        "Attività non trovata o non aggiornata"
      );
      expect(res.body.code).to.equal("ActivityRepository.completeActivity");
    });
  });
});
