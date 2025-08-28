const {
  checkUserLock,
  handleUserFailure,
  checkIpLock,
  handleIpFailure,
} = require("../Middleware/lockout");

describe("Lockout Logic", () => {
  test("should lock user after 5 failed attempts", () => {
    let user = { failedAttempts: 4, lockUntil: null };
    user = handleUserFailure(user);
    expect(user.lockUntil).toBeDefined();
  });

  test("should detect user is locked", () => {
    const future = new Date(Date.now() + 10 * 60 * 1000); // 10 min later
    const user = { lockUntil: future };
    expect(checkUserLock(user)).toBe(true);
  });

  test("should block IP after 100 failed attempts", () => {
    let ipRecord = { failedAttempts: 99, blockUntil: null };
    ipRecord = handleIpFailure(ipRecord);
    expect(ipRecord.blockUntil).toBeDefined();
  });

  test("should detect IP is blocked", () => {
    const future = new Date(Date.now() + 2 * 60 * 1000); // 2 min later
    const ipRecord = { blockUntil: future };
    expect(checkIpLock(ipRecord)).toBe(true);
  });
});
