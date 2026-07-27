const { Client } = require('pg');

async function testConnection() {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'root',
    port: 5432,
  });

  try {
    await client.connect();
    const res = await client.query('SELECT 1 as val');
    console.log('Connection successful with postgres/root:', res.rows[0]);
    await client.end();
  } catch (err) {
    console.error('Connection error postgres/root:', err);
    
    const client2 = new Client({
      user: 'root',
      host: 'localhost',
      database: 'postgres',
      password: 'root',
      port: 5432,
    });
    try {
      await client2.connect();
      const res = await client2.query('SELECT 1 as val');
      console.log('Connection successful with root/root:', res.rows[0]);
      await client2.end();
    } catch (err2) {
      console.error('Connection error root/root:', err2);
    }
  }
}

testConnection();
