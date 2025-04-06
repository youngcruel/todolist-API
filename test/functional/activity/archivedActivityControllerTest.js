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

let route = "/:id/archive";
let user;
let activityOpen;
let activityCompleted;
let activityDeleted;
let activityArchived;
let accessToken;

describe("Archive Activity Controller Test", () => {
  beforeEach(async () => {
    user = await TestUtils.createFakeUser(userStatus.ACTIVE);
    //Ricordare di spostare la creazione dell'activity specifica nel singolo test
    activityOpen = await TestUtils.createFakeActivity(status.OPEN, user.id);
    activityDeleted = await TestUtils.createFakeActivity(
      status.DELETED,
      user.id
    );
    activityArchived = await TestUtils.createFakeActivity(
      status.ARCHIVED,
      user.id
    );
    activityCompleted = await TestUtils.createFakeActivity(
      status.COMPLETED,
      user.id
    );
    accessToken = cryptoUtils.generateToken(user.toJWT(), 10000);
  });

  afterEach(async () => {
    await TestUtils.restore();
  });

  //Success
  describe("/PATCH/:id/archive success", () => {
    it("should return 200 and activity archived (previous status=open)", async () => {
      //Chiama la GET con chai-http
      const res = await request
        .execute(app)
        .patch(route.replace(":id", activityOpen.id))
        .set(`Authorization`, `Bearer ${accessToken}`)
        .send();

      //Verifica la risposta
      expect(res).to.have.status(200);
      expect(res.body.id).to.equal(activityOpen.id);
      expect(res.body.userId).to.equal(activityOpen.userId);
      expect(res.body.name).to.equal(activityOpen.name);
      expect(res.body.description).to.equal(activityOpen.description);
      expect(res.body.dueDate).to.equal(activityOpen.dueDate.toISOString());
      expect(res.body.status).to.equal(status.ARCHIVED);

      //Verifica che l'attività sia stata aggiornata nel database
      const updatedActivity = await TestUtils.getActivityById(activityOpen.id);
      expect(updatedActivity.status).to.equal(status.ARCHIVED);
      expect(updatedActivity.id).to.equal(activityOpen.id);
      expect(updatedActivity.userId).to.equal(user.id);
      expect(updatedActivity.name).to.equal(activityOpen.name);
      expect(updatedActivity.description).to.equal(activityOpen.description);
      expect(updatedActivity.dueDate.toISOString()).to.equal(
        activityOpen.dueDate.toISOString()
      );
    });

    it("should return 200 and activity archived if already archived", async () => {
      //Chiama la GET con chai-http
      const res = await request
        .execute(app)
        .patch(route.replace(":id", activityArchived.id))
        .set(`Authorization`, `Bearer ${accessToken}`)
        .send();

      //Verifica la risposta
      expect(res).to.have.status(200);
      expect(res.body.status).to.equal(status.ARCHIVED);
      expect(res.body.id).to.equal(activityArchived.id);
      expect(res.body.userId).to.equal(activityArchived.userId);
    });

    it("should return 200 and activity archived (previous status=completed)", async () => {
      //Chiama la GET con chai-http
      const res = await request
        .execute(app)
        .patch(route.replace(":id", activityCompleted.id))
        .set(`Authorization`, `Bearer ${accessToken}`)
        .send();

      //Verifica la risposta
      expect(res).to.have.status(200);
      expect(res.body.status).to.equal(status.ARCHIVED);
      expect(res.body.id).to.equal(activityCompleted.id);
      expect(res.body.userId).to.equal(activityCompleted.userId);
    });
  });

  describe("/PATCH/:id/archive fail", () => {
    it("should return 401 if access token is invalid", async () => {
      const invalidAccessToken = "Invalid access token";

      //Chiama la PATCH con chai-http
      const res = await request
        .execute(app)
        .patch(route.replace(":id", activityOpen.id))
        .set(`Authorization`, `Bearer ${invalidAccessToken}`)
        .send();

      //Verifica la risposta
      expect(res).to.have.status(401);
    });

    it("should return 400 if activityId is invalid", async () => {
      const invalidActivityId = "Invalid activity id";

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
      const fakeActivityId = TestUtils.generateFakeObjectId().toString();

      //Chiama la PATCH con chai-http
      const res = await request
        .execute(app)
        .patch(route.replace(":id", fakeActivityId))
        .set(`Authorization`, `Bearer ${accessToken}`)
        .send();

      //Verifica la risposta
      expect(res).to.have.status(404);
      expect(res.body.message).to.equal(
        "Attività non trovata o non aggiornata"
      );
      expect(res.body.code).to.equal("ActivityRepository.archiveActivity");
    });

    it("should return 404 if activity status is deleted", async () => {
      //Chiama la PATCH con chai-http
      const res = await request
        .execute(app)
        .patch(route.replace(":id", activityDeleted.id))
        .set(`Authorization`, `Bearer ${accessToken}`)
        .send();

      //Verifica la risposta
      expect(res).to.have.status(404);
      expect(res.body.message).to.equal(
        "Attività non trovata o non aggiornata"
      );
      expect(res.body.code).to.equal("ActivityRepository.archiveActivity");
    });

    it("should return 404 if user not owner", async () => {
      //Crea un'attività associata ad un altro utente
      const activityUser2 = await TestUtils.createFakeActivity(
        status.OPEN,
        TestUtils.generateFakeObjectId()
      );

      //Chiama la PATCH con chai-http
      const res = await request
        .execute(app)
        .patch(route.replace(":id", activityUser2.id))
        .set(`Authorization`, `Bearer ${accessToken}`)
        .send();

      //Verifica la risposta
      expect(res).to.have.status(404);
      expect(res.body.message).to.equal(
        "Attività non trovata o non aggiornata"
      );
      expect(res.body.code).to.equal("ActivityRepository.archiveActivity");
    });
  });
});
