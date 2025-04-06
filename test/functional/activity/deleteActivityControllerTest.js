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

let route = "/:id/delete";
let user;
let activity;
let accessToken;

describe("Delete Activity Controller Test", () => {
  beforeEach(async () => {
    user = await TestUtils.createFakeUser(userStatus.ACTIVE);
    activity = await TestUtils.createFakeActivity(status.OPEN, user.id);
    accessToken = cryptoUtils.generateToken(user.toJWT(), 10000);
  });

  afterEach(async () => {
    await TestUtils.restore();
  });

  describe("/DELETE/:id/delete success", () => {
    it("should return 200 and the delete activity message (previous status=open)", async () => {
      //Chiama la DELETE con chai-http
      const res = await request
        .execute(app)
        .delete(route.replace(":id", activity.id))
        .set(`Authorization`, `Bearer ${accessToken}`)
        .send();

      //Verifica la risposta
      expect(res).to.have.status(200);

      // Verifica il messaggio
      expect(res.body.message).to.equal("Attività eliminata con successo");

      // Verifica nel db
      const activityFromDb = await TestUtils.getActivityById(activity.id);
      expect(activityFromDb.status).to.equal(status.DELETED);
      expect(activityFromDb.name).to.equal(activity.name);
      expect(activityFromDb.description).to.equal(activity.description);
      expect(activityFromDb.dueDate.toISOString()).to.equal(
        activity.dueDate.toISOString()
      );
      expect(activityFromDb.userId).to.equal(user.id);
    });

    it("should return 200 if activity status is already deleted", async () => {
      //Crea un'attività associata a quell'utente ma con status DELETED
      const activity = await TestUtils.createFakeActivity(
        status.DELETED,
        user.id
      );

      //Chiama la DELETE con chai-http
      const res = await request
        .execute(app)
        .delete(route.replace(":id", activity.id))
        .set(`Authorization`, `Bearer ${accessToken}`)
        .send();

      //Verifica la risposta
      expect(res).to.have.status(200);

      // Verifica nel db
      const activityFromDb = await TestUtils.getActivityById(activity.id);
      expect(activityFromDb.status).to.equal(status.DELETED);
    });

    it("should return 200 if previous activity status=completed", async () => {
      //Crea un'attività associata a quell'utente ma con status COMPLETED
      const activity = await TestUtils.createFakeActivity(
        status.COMPLETED,
        user.id
      );

      //Chiama la DELETE con chai-http
      const res = await request
        .execute(app)
        .delete(route.replace(":id", activity.id))
        .set(`Authorization`, `Bearer ${accessToken}`)
        .send();

      //Verifica la risposta
      expect(res).to.have.status(200);
    });

    it("should return 200 if previous activity status=archived", async () => {
      //Crea un'attività associata a quell'utente ma con status ARCHVED
      const activity = await TestUtils.createFakeActivity(
        status.ARCHIVED,
        user.id
      );

      //Chiama la DELETE con chai-http
      const res = await request
        .execute(app)
        .delete(route.replace(":id", activity.id))
        .set(`Authorization`, `Bearer ${accessToken}`)
        .send();

      //Verifica la risposta
      expect(res).to.have.status(200);
    });
  });

  describe("/DELETE/:id/delete fail", () => {
    it("should return 401 if access token is invalid", async () => {
      //Genera token richiesto dal middleware auth
      const invalidAccessToken = "Invalid access token";

      //Chiama la DELETE con chai-http
      const res = await request
        .execute(app)
        .delete(route.replace(":id", activity.id))
        .set(`Authorization`, `Bearer ${invalidAccessToken}`)
        .send();

      //Verifica la risposta
      expect(res).to.have.status(401);
    });

    it("should return 400 if if activity id is invalid", async () => {
      //Crea un invalid activity Id
      const invalidActivityId = "Invalid activity Id";

      //Chiama la DELETE con chai-http
      const res = await request
        .execute(app)
        .delete(route.replace(":id", invalidActivityId))
        .set(`Authorization`, `Bearer ${accessToken}`)
        .send();

      //Verifica la risposta
      expect(res).to.have.status(400);
    });

    it("should return 404 if activity not found", async () => {
      // Crea un activity Id non presente nel db
      const nonExistentActivityId = TestUtils.generateFakeObjectId().toString();

      //Chiama la DELETE con chai-http
      const res = await request
        .execute(app)
        .delete(route.replace(":id", nonExistentActivityId))
        .set(`Authorization`, `Bearer ${accessToken}`)
        .send();

      //Verifica la risposta
      expect(res).to.have.status(404);
      expect(res.body.message).to.equal(
        "Attività non trovata o non aggiornata"
      );
      expect(res.body.code).to.equal("ActivityRepository.deleteActivity");
    });

    it("should return 404 if user not owner", async () => {
      //Crea un'attività associata ad un altro utente
      const fakeActivity = await TestUtils.createFakeActivity(
        status.OPEN,
        TestUtils.generateFakeObjectId()
      );

      //Chiama la DELETE con chai-http
      const res = await request
        .execute(app)
        .delete(route.replace(":id", fakeActivity.id))
        .set(`Authorization`, `Bearer ${accessToken}`)
        .send();

      //Verifica la risposta
      expect(res).to.have.status(404);
      expect(res.body.message).to.equal(
        "Attività non trovata o non aggiornata"
      );
      expect(res.body.code).to.equal("ActivityRepository.deleteActivity");
    });
  });
});
