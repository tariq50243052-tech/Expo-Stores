// No imports needed for Node 18+ fetch

async function request(url, method, body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const options = {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  };

  const res = await fetch(url, options);
  return res.json();
}

async function checkStats() {
  try {
    // Login
    const loginRes = await request('http://localhost:5000/api/auth/login', 'POST', {
      email: 'superadmin@expo.com',
      password: 'superadmin123'
    });
    const token = loginRes.token;

    // Fetch Stats
    const statsRes = await request('http://localhost:5000/api/assets/stats', 'GET', null, token);

    console.log('Stats Response:', JSON.stringify(statsRes, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

checkStats();