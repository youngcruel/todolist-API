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

let route = "/:id/reOpenActivity";
let user;
let activityCompleted;
let accessToken;

describe("ReOpen Activity Controller Test", () => {
  beforeEach(async () => {
    user = await TestUtils.createFakeUser(userStatus.ACTIVE);
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
  describe("/PATCH//id/reOpenActivity success", () => {
    it("should return 200 and activity reopen", async () => {
      //Chiama la GET con chai-http
      const res = await request
        .execute(app)
        .patch(route.replace(":id", activityCompleted.id))
        .set(`Authorization`, `Bearer ${accessToken}`)
        .send();

      //Verifica la risposta
      expect(res).to.have.status(200);
      expect(res.body.id).to.equal(activityCompleted.id);
      expect(res.body.userId).to.equal(activityCompleted.userId);
      expect(res.body.name).to.equal(activityCompleted.name);
      expect(res.body.description).to.equal(activityCompleted.description);
      expect(res.body.dueDate).to.equal(
        activityCompleted.dueDate.toISOString()
      );
      expect(res.body.status).to.equal(status.OPEN);

      //Verifica che l'attività sia stata aggiornata nel database
      const activityFromDb = await TestUtils.getActivityById(
        activityCompleted.id
      );
      expect(activityFromDb.dueDate.toISOString()).to.equal(
        activityCompleted.dueDate.toISOString()
      );
      expect(activityFromDb.userId).to.equal(user.id.toString());
      expect(activityFromDb.name).to.equal(activityCompleted.name);
      expect(activityFromDb.description).to.equal(
        activityCompleted.description
      );
      expect(activityFromDb.status).to.equal(status.OPEN);
    });

    it("should return 200 if activity status is already open (idempotence)", async () => {
      const activityOpen = await TestUtils.createFakeActivity(
        status.OPEN,
        user.id
      );

      const res = await request
        .execute(app)
        .patch(route.replace(":id", activityOpen.id))
        .set(`Authorization`, `Bearer ${accessToken}`)
        .send();

      expect(res).to.have.status(200);
      expect(res.body.status).to.equal(status.OPEN);
      expect(res.body.id).to.equal(activityOpen.id);
    });
  });

  describe("/PATCH/:id/reOpenActivity fail", () => {
    it("should return 401 if access token is invalid", async () => {
      const invalidAccessToken = "Invalid access token";

      //Chiama la PATCH con chai-http
      const res = await request
        .execute(app)
        .patch(route.replace(":id", activityCompleted.id))
        .set(`Authorization`, `Bearer ${invalidAccessToken}`)
        .send();

      //Verifica la risposta
      expect(res).to.have.status(401);
    });

    it("should return 400 if activityId is not valid", async () => {
      //Crea un'attività associata ad un altro utente
      const invalidActivityId = "invalidActivityId";

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
      const invalidActivityId = TestUtils.generateFakeObjectId().toString();

      //Chiama la PATCH con chai-http
      const res = await request
        .execute(app)
        .patch(route.replace(":id", invalidActivityId))
        .set(`Authorization`, `Bearer ${accessToken}`)
        .send();

      //Verifica la risposta
      expect(res).to.have.status(404);
      expect(res.body.message).to.equal(
        "Attività non trovata o non aggiornata"
      );
      expect(res.body.code).to.equal("ActivityRepository.reOpenActivity");
    });

    it("should return 404 if activity status is deleted", async () => {
      const activityDeleted = await TestUtils.createFakeActivity(
        status.DELETED,
        user.id
      );

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
      expect(res.body.code).to.equal("ActivityRepository.reOpenActivity");
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
      expect(res.body.code).to.equal("ActivityRepository.reOpenActivity");
    });
  });
});
