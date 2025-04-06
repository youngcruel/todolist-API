import mongoose from "mongoose";
import activitySchema from "../../src/schema/todoListSchema.js";
import userSchema from "../../src/schema/userSchema.js";
import Activity from "../../src/models/Activity.js";
import User from "../../src/models/User.js";
import registrationTokenSchema from "../../src/schema/registrationTokenSchema.js";
import { status } from "../../src/const/constant.js";
import cryptoUtils from "../../src/utils/cryptoUtils.js";

class TestUtils {
  static async createFakeUser(status) {
    const hashedPassword = cryptoUtils.hashPassword("password123");
    const testUser = {
      email: `emailuser.${Date.now()}@esempio.com`,
      password: hashedPassword.password,
      salt: hashedPassword.salt,
      status,
    };

    const user = await userSchema.create(testUser);
    return new User(user);
  }

  static async createFakeActivity(status, userId, overrides = {}) {
    const testActivity = {
      name: "Test activity",
      description: "Desc activity",
      dueDate: new Date(),
      status,
      userId,
      ...overrides,
    };

    const activity = await activitySchema.create(testActivity);
    return new Activity(activity);
  }

  static async createManyActivities(userId, status, numberOfActivities) {
    const activities = [];

    for (let i = 0; i < numberOfActivities; i++) {
      activities.push({
        name: `Test Activity ${i + 1}`,
        description: `Desc activity ${i + 1}`,
        dueDate: new Date(),
        userId,
        status,
      });
    }

    const insertedActivities = await activitySchema.insertMany(activities);
    return insertedActivities.map((activity) => new Activity(activity));
  }

  static async getActivityById(id) {
    const activity = await activitySchema.findById(id);
    return new Activity(activity);
  }
  static async getUserByEmail(email) {
    const user = await userSchema.findOne({ email });
    return new User(user);
  }

  // static async createFakeToken(userId, tokenValue = "testtoken123") {
  //   const token = await registrationTokenSchema.create({
  //     userId,
  //     registrationToken: tokenValue,
  //   });
  //   return token;
  // }

  static async getTokenByUserId(userId) {
    const token = await registrationTokenSchema.findOne({
      userId,
    });
    return token;
  }
  static async createFakeToken(userId, tokenValue = "tokenvalue") {
    const token = await registrationTokenSchema.create({
      userId,
      registrationToken: tokenValue,
    });
    return await token.save();
  }
  static async generateFakeObjectId() {
    return new mongoose.Types.ObjectId().toString();
  }

  static async restore() {
    await Promise.all([
      activitySchema.deleteMany(),
      userSchema.deleteMany(),
      registrationTokenSchema.deleteMany(),
    ]);
    // await activitySchema.deleteMany();
    // await userSchema.deleteMany();
  }
}

export default TestUtils;
