import { expect } from 'chai';
import activityRepository from '../../src/repository/activityRepository.js';
import { status } from '../../src/const/constant.js';
import sinon from 'sinon';
import activitySchema from '../../src/schema/todoListSchema.js'
import mongoose, { modelNames } from 'mongoose';

const sandbox = sinon.createSandbox();
describe('activityRepositoryTest', () => {
    it('should set status completed', async () => {
        const activityId = new mongoose.Types.ObjectId();
        const userId = new mongoose.Types.ObjectId().toString();
        const stub = sandbox.stub(activitySchema,'findOneAndUpdate').callsFake( () => {
            return { status: status.COMPLETED, _id: activityId} ;
        });
        const activity = await activityRepository.completeActivity(activityId, userId);
        expect(activity.status).eq(status.COMPLETED);
        expect(stub.calledOnce).true;
    });
});
