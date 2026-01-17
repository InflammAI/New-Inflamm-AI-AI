// Mock Database for Development (No PostgreSQL required)
const mockDB = {
  users: [],
  vitals: [],
  devices: [],
  recommendations: [],
  notifications: [],
  sessions: [],
};

class MockPool {
  async connect() {
    return new MockClient();
  }

  async query(sql, params = []) {
    // Mock authentication
    if (sql.includes('INSERT INTO users')) {
      const user = {
        id: mockDB.users.length + 1,
        uuid: require('uuid').v4(),
        email: params[0],
        password_hash: params[1],
        first_name: params[2],
        last_name: params[3],
        created_at: new Date(),
      };
      mockDB.users.push(user);
      return { rows: [user], rowCount: 1 };
    }

    if (sql.includes('SELECT') && sql.includes('FROM users')) {
      const email = params[0];
      const user = mockDB.users.find(u => u.email === email);
      return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
    }

    if (sql.includes('INSERT INTO vitals')) {
      const vital = {
        id: mockDB.vitals.length + 1,
        uuid: require('uuid').v4(),
        user_id: params[0],
        heart_rate: params[1],
        blood_oxygen: params[2],
        temperature: params[3],
        recorded_at: new Date(),
      };
      mockDB.vitals.push(vital);
      return { rows: [vital], rowCount: 1 };
    }

    if (sql.includes('SELECT') && sql.includes('FROM vitals')) {
      const vitals = mockDB.vitals;
      return { rows: vitals, rowCount: vitals.length };
    }

    return { rows: [], rowCount: 0 };
  }

  end() {
    return Promise.resolve();
  }
}

class MockClient {
  async query(sql, params) {
    return new MockPool().query(sql, params);
  }

  release() {}
}

module.exports = { Pool: MockPool };
