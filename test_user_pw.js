const http = require('http');

async function test() {
  // Register
  await fetch('http://localhost:5000/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test', email: 'test1@test.com', phone: '1234567890', password: 'password123' })
  });
  
  // Login
  const loginRes = await fetch('http://localhost:5000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test1@test.com', password: 'password123' })
  });
  const data = await loginRes.json();
  const token = data.token;

  console.log('Login:', data);

  // Change PW
  const changeRes = await fetch('http://localhost:5000/api/change-password', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ oldPassword: 'password123', newPassword: 'newpassword123' })
  });
  
  console.log('Change PW status:', changeRes.status);
  console.log('Change PW body:', await changeRes.text());
}

test();
