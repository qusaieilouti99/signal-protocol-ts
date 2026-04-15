"use strict";
/*
 * jobQueue manages multiple queues indexed by device to serialize
 * session io ops on the database.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionLock = void 0;
const jobQueue = {};
class SessionLock {
    static queueJob(id, runJob) {
        const runPrevious = jobQueue[id] || Promise.resolve();
        const runCurrent = (jobQueue[id] = runPrevious.then(runJob, runJob));
        runCurrent
            .then(function () {
            if (jobQueue[id] === runCurrent) {
                delete jobQueue[id];
            }
        })
            .catch(() => {
            // SessionLock callers should already have seen these errors on their own
            // Promise chains, but we need to handle them here too so we just save them
            // so callers can review them.
        });
        return runCurrent;
    }
}
exports.SessionLock = SessionLock;
