const USER_THRESHOLD = 5;
const USER_LOCK_TIME = 15 * 60 * 1000; // 15 min
const IP_THRESHOLD = 100;
const IP_WINDOW = 5 * 60 * 1000; // 5 min

// Check if user should be locked
function checkUserLock(user) {
  if (user.lockUntil && user.lockUntil > Date.now()) {
    return true;
  }
  return false;
}

// Handle failed login for user
function handleUserFailure(user) {
  user.failedAttempts++;
  if (user.failedAttempts >= USER_THRESHOLD) {
    user.lockUntil = new Date(Date.now() + USER_LOCK_TIME);
  }
  return user;
}

// Check if IP should be blocked
function checkIpLock(ipRecord) {
  if (ipRecord.blockUntil && ipRecord.blockUntil > Date.now()) {
    return true;
  }
  return false;
}

// Handle failed login for IP
function handleIpFailure(ipRecord) {
  ipRecord.failedAttempts++;
  if (ipRecord.failedAttempts >= IP_THRESHOLD) {
    ipRecord.blockUntil = new Date(Date.now() + IP_WINDOW);
  }
  return ipRecord;
}

module.exports = {
  checkUserLock,
  handleUserFailure,
  checkIpLock,
  handleIpFailure,
};
