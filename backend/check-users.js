const { Client } = require('pg');

async function checkUsers() {
  const client = new Client({
    connectionString: 'postgresql://postgres:root@localhost:5432/logislot'
  });

  try {
    await client.connect();
    const res = await client.query('SELECT * FROM "users"');
    console.log('Users in DB:');
    console.log(res.rows);
    
    if (res.rows.length === 0) {
      console.log('No users found. I should run the seed script.');
    }
    
    await client.end();
  } catch (err) {
    console.error('Error connecting to DB or querying:', err.message);
  }
}

checkUsers();
