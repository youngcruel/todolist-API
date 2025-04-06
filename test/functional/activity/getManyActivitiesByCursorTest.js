import * as chai from "chai";
import chaiHttp from "chai-http";
import app from "../../../server.js";
import { expect } from "chai";
import { request } from "chai-http";
import cryptoUtils from "../../../src/utils/cryptoUtils.js";
import TestUtils from "../../fixtures/Utils.js";
import { userStatus } from "../../../src/const/constant.js";
import { status } from "../../../src/const/constant.js";
import activity from "../../../src/schema/todoListSchema.js";

chai.use(chaiHttp);

let route = "/activities";
let user;
let activitiesOpen;
let activitiesCompleted;
let activitiesDeleted;
let activitiesArchived;
let accessToken;

describe("GET Activities By Cursor Controller Test", () => {
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
  describe("/GET/activities success", () => {
    it("should return 200 with default parameters (limit = 10, direction = next, cursor = null, status not deleted)", async () => {
      //Chiama la GET con chai-http
      const res = await request
        .execute(app)
        .get(route)
        .set(`Authorization`, `Bearer ${accessToken}`)
        .set("Content-Type", "application/json")
        .send();

      //Verifica la risposta
      expect(res).to.have.status(200);
      expect(res.body).to.have.property("activities").that.is.an("array");
      expect(res.body.activities.length).to.be.at.most(10);
      expect(res.body.direction).to.equal("next");
      expect(res.body).to.have.property("nextCursor").that.is.a("string");
      expect(res.body).to.have.property("prevCursor").that.is.a("string");
      expect(res.body.nextCursor).to.not.equal(res.body.prevCursor);
      expect(res.body.nextCursor).to.equal(
        res.body.activities[res.body.activities.length - 1].id
      );
      expect(res.body.prevCursor).to.equal(res.body.activities[0].id);
      res.body.activities.forEach((activity) => {
        expect(activity.status).to.not.equal(status.DELETED);
        expect(activity.status).to.be.oneOf([
          status.OPEN,
          status.COMPLETED,
          status.ARCHIVED,
        ]);
      });
    });

    /* Nuovi test per la feature: 
lista activities filtrabile per status */
    it("should return 200 and only the activities with status=open", async () => {
      //Chiama la GET con chai-http
      const res = await request
        .execute(app)
        .get(route)
        .set(`Authorization`, `Bearer ${accessToken}`)
        .set("Content-Type", "application/json")
        .query({ status: status.OPEN })
        .send();

      //Verifica la risposta
      expect(res).to.have.status(200);
      res.body.activities.forEach((activity) => {
        expect(activity.status).to.equal(status.OPEN);
      });
    });

    it("should return 200 and only the activities with status=completed", async () => {
      //Chiama la GET con chai-http
      const res = await request
        .execute(app)
        .get(route)
        .set(`Authorization`, `Bearer ${accessToken}`)
        .set("Content-Type", "application/json")
        .query({ status: status.COMPLETED })
        .send();

      //Verifica la risposta
      expect(res).to.have.status(200);
      res.body.activities.forEach((activity) => {
        expect(activity.status).to.equal(status.COMPLETED);
      });
    });

    it("should return 200 and only the activities with status=deleted", async () => {
      //Chiama la GET con chai-http
      const res = await request
        .execute(app)
        .get(route)
        .set(`Authorization`, `Bearer ${accessToken}`)
        .set("Content-Type", "application/json")
        .query({ status: status.DELETED })
        .send();

      //Verifica la risposta
      expect(res).to.have.status(200);
      res.body.activities.forEach((activity) => {
        expect(activity.status).to.equal(status.DELETED);
      });
    });

    it("should return 200 and the activities with status=archived", async () => {
      //Chiama la GET con chai-http
      const res = await request
        .execute(app)
        .get(route)
        .set(`Authorization`, `Bearer ${accessToken}`)
        .set("Content-Type", "application/json")
        .query({ status: status.ARCHIVED })
        .send();

      //Verifica la risposta
      expect(res).to.have.status(200);
      res.body.activities.forEach((activity) => {
        expect(activity.status).to.equal(status.ARCHIVED);
      });
    });

    it("should return 200 and the activities with status=archived or completed", async () => {
      //Chiama la GET con chai-http
      const res = await request
        .execute(app)
        .get(route)
        .set(`Authorization`, `Bearer ${accessToken}`)
        .set("Content-Type", "application/json")
        .query({ limit: 40, status: [status.ARCHIVED, status.COMPLETED] })
        .send();

      //Verifica la risposta
      expect(res).to.have.status(200);
      expect(res.body.activities).length(40);

      const archived = res.body.activities.filter(
        (activity) => activity.status === status.ARCHIVED
      );
      const completed = res.body.activities.filter(
        (activity) => activity.status === status.COMPLETED
      );

      expect(archived).length(20);
      expect(completed).length(20);
    });

    it("should return ordered activities excluding deleted", async () => {
      const res = await request
        .execute(app)
        .get(route)
        .set("Authorization", `Bearer ${accessToken}`)
        .set("Content-Type", "application/json")
        .send();

      expect(res).to.have.status(200);

      const expectedActivities = [...activitiesOpen, ...activitiesCompleted];
      const actualActivities = res.body.activities;
      actualActivities.forEach((activity, index) => {
        expect(activity.id).to.equal(expectedActivities[index].id);
      });
    });

    it("should return 200 with query parameters (limit = 5)", async () => {
      //Chiama la GET con chai-http
      const res = await request
        .execute(app)
        .get(route)
        .set(`Authorization`, `Bearer ${accessToken}`)
        .set("Content-Type", "application/json")
        .query({ limit: 5 })
        .send();

      //Verifica la risposta
      expect(res).to.have.status(200);
      expect(res.body.activities.length).to.be.at.most(5);
    });

    it("should return next page with nextCursor", async () => {
      //Chiama la prima GET con chai-http
      const firstRes = await request
        .execute(app)
        .get(route)
        .set("Authorization", `Bearer ${accessToken}`)
        .set("Content-Type", "application/json")
        .send();

      //Chiama la seconda GET con chai-http
      const secondRes = await request
        .execute(app)
        .get(route)
        .set("Authorization", `Bearer ${accessToken}`)
        .set("Content-Type", "application/json")
        .query({ cursor: firstRes.body.nextCursor, direction: "next" })
        .send();

      //Verifica la risposta
      expect(secondRes).to.have.status(200);
      expect(secondRes.body.direction).to.equal("next");
      expect(
        secondRes.body.activities[0].id >
          firstRes.body.activities[firstRes.body.activities.length - 1].id
      ).to.be.true;
    });

    it("should return prev page with prevCursor", async () => {
      //Chiama la prima GET con chai-http
      const firstRes = await request
        .execute(app)
        .get(route)
        .set("Authorization", `Bearer ${accessToken}`)
        .set("Content-Type", "application/json")
        .send();

      //Chiama la seconda GET con chai-http
      const secondRes = await request
        .execute(app)
        .get(route)
        .set("Authorization", `Bearer ${accessToken}`)
        .set("Content-Type", "application/json")
        .query({ cursor: firstRes.body.nextCursor, direction: "next" })
        .send();

      //Chiama la terza GET con chai-http
      const thirdRes = await request
        .execute(app)
        .get(route)
        .set("Authorization", `Bearer ${accessToken}`)
        .set("Content-Type", "application/json")
        .query({ cursor: secondRes.body.prevCursor, direction: "prev" })
        .send();

      //Verifica la risposta
      expect(thirdRes).to.have.status(200);
      expect(thirdRes.body.direction).to.equal("prev");
      expect(thirdRes.body.activities[0].id < secondRes.body.activities[0].id)
        .to.be.true;
    });
  });

  //Fail
  describe("/GET/activities fail", () => {
    it("should return 401 if access token is invalid", async () => {
      const invalidAccessToken = "Invalid access token";

      //Chiama la GET con chai-http
      const res = await request
        .execute(app)
        .get(route)
        .set(`Authorization`, `Bearer ${invalidAccessToken}`)
        .set("Content-Type", "application/json")
        .send();

      //Verifica la risposta
      expect(res).to.have.status(401);
    });

    it("should return 400 if cursor is invalid", async () => {
      const res = await request
        .execute(app)
        .get(route)
        .set("Authorization", `Bearer ${accessToken}`)
        .set("Content-Type", "application/json")
        .query({ cursor: "not-an-objectid" })
        .send();

      //Verifica la risposta
      expect(res).to.have.status(400);
    });

    it("should return 400 if limit is invalid", async () => {
      //Chiama la GET con chai-http
      const res = await request
        .execute(app)
        .get(route)
        .set("Authorization", `Bearer ${accessToken}`)
        .set("Content-Type", "application/json")
        .query({ limit: "not number" })
        .send();

      //Verifica la risposta
      expect(res).to.have.status(400);
    });

    it("should return 400 if direction is invalid", async () => {
      //Chiama la GET con chai-http
      const res = await request
        .execute(app)
        .get(route)
        .set("Authorization", `Bearer ${accessToken}`)
        .set("Content-Type", "application/json")
        .query({ direction: "invalid direction" })
        .send();

      //Verifica la risposta
      expect(res).to.have.status(400);
    });

    it("should return 400 if status is invalid", async () => {
      //Chiama la GET con chai-http
      const res = await request
        .execute(app)
        .get(route)
        .set("Authorization", `Bearer ${accessToken}`)
        .set("Content-Type", "application/json")
        .query({ status: "invalid direction" })
        .send();

      //Verifica la risposta
      expect(res).to.have.status(400);
    });

    it("should return 404 if activities not found", async () => {
      await TestUtils.restore();
      // Crea utente con solo attività DELETED
      user = await TestUtils.createFakeUser(userStatus.ACTIVE);
      accessToken = cryptoUtils.generateToken(user.toJWT(), 10000);

      //Chiama la PATCH con chai-http
      const res = await request
        .execute(app)
        .get(route)
        .set("Authorization", `Bearer ${accessToken}`)
        .set("Content-Type", "application/json")
        .send();

      //Verifica la risposta
      expect(res).to.have.status(404);
    });

    it("should return 404 if user not owner", async () => {
      await TestUtils.restore();

      // Crea un utente con attività
      user = await TestUtils.createFakeUser(userStatus.ACTIVE);
      activitiesOpen = await TestUtils.createManyActivities(
        user.id,
        status.OPEN,
        20
      );
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
        .set("Content-Type", "application/json")
        .send();

      //Verifica la risposta
      expect(res).to.have.status(404);
    });
  });
});
