import { expect } from "chai";
import ActivityRepository from "../../src/repository/ActivityRepository.js";
import { status } from "../../src/const/constant.js";
import sinon from "sinon";
import activitySchema from "../../src/schema/todoListSchema.js";
import mongoose from "mongoose";
import NotFoundException from "../../src/exceptions/NotFoundException.js";
import MongoInternalException from "../../src/exceptions/MongoInternalException.js";

const sandbox = sinon.createSandbox();

describe("Activity repository test", () => {
  afterEach(() => {
    sandbox.restore();
  });

  //completeActivity unit test
  describe("completeActivity", () => {
    it("should set status completed", async () => {
      const activityId = new mongoose.Types.ObjectId();
      const userId = new mongoose.Types.ObjectId().toString();

      const fakeActivity = {
        _id: activityId,
        name: "Test Activity",
        description: "Test Description",
        dueDate: new Date(),
        status: status.COMPLETED,
        userId: userId,
      };

      const stub = sandbox
        .stub(activitySchema, "findOneAndUpdate")
        .resolves(fakeActivity);

      const activity = await ActivityRepository.completeActivity(
        activityId.toString(),
        userId
      );
      expect(activity.status).eq(status.COMPLETED);
      expect(stub.calledOnce).to.be.true;
    });
  });

  //completeActivity-Exceptions unit test
  describe("completeActivity - Exceptions", () => {
    it("should throw NotFoundException if activity does not exist", async () => {
      const activityId = new mongoose.Types.ObjectId().toString();
      const userId = new mongoose.Types.ObjectId().toString();

      sandbox.stub(activitySchema, "findOneAndUpdate").resolves(null);

      try {
        await ActivityRepository.completeActivity(activityId, userId);
        throw new Error("Test failed: exception was not thrown");
      } catch (err) {
        expect(err).to.be.instanceOf(NotFoundException);
        expect(err.message).to.equal("Attività non trovata o non aggiornata");
      }
    });

    it("should throw MongoInternalException if db error occurs", async () => {
      const activityId = new mongoose.Types.ObjectId().toString();
      const userId = new mongoose.Types.ObjectId().toString();

      sandbox
        .stub(activitySchema, "findOneAndUpdate")
        .rejects(new Error("DB error"));

      try {
        await ActivityRepository.completeActivity(activityId, userId);
        throw new Error("Test failed: exception was not thrown");
      } catch (err) {
        expect(err).to.be.instanceOf(MongoInternalException);
        expect(err.message).to.equal(
          "Errore durante l'aggiornamento dell'attività"
        );
      }
    });
  });

  //updateActivity unit test
  describe("updateActivity", () => {
    it("should update activity and return updated object", async () => {
      const fakeBody = {
        name: "Updated Activity",
        description: "Updated description",
      };

      const fakeActivity = {
        _id: new mongoose.Types.ObjectId(),
        name: fakeBody.name,
        description: fakeBody.description,
        dueDate: new Date(),
        status: status.OPEN,
        userId: new mongoose.Types.ObjectId().toString(),
      };

      const stub = sandbox
        .stub(activitySchema, "findOneAndUpdate")
        .resolves(fakeActivity);

      const activity = await ActivityRepository.updateActivity(
        fakeActivity._id.toString(),
        fakeBody,
        fakeActivity.userId
      );

      expect(activity.name).to.equal(fakeBody.name);
      expect(activity.description).to.equal(fakeBody.description);
      expect(
        stub.calledWith(
          { _id: fakeActivity._id.toString(), userId: fakeActivity.userId },
          fakeBody,
          { new: true, upsert: false }
        )
      ).to.be.true;
      expect(stub.calledOnce).to.be.true;
    });
  });
});
