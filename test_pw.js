const http = require('http');

async function test() {
  const loginRes = await fetch('http://localhost:5000/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@gmail.com', password: 'admin' }) // Trying old or 'admin@123'
  });
  
  let data = await loginRes.json();
  if (!loginRes.ok) {
    // try admin@123
    const loginRes2 = await fetch('http://localhost:5000/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@gmail.com', password: 'admin@123' }) 
    });
    data = await loginRes2.json();
  }

  console.log('Login:', data);

  const token = data.token;
  
  const changeRes = await fetch('http://localhost:5000/api/change-password', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ oldPassword: 'admin@123', newPassword: 'newpassword123' })
  });
  
  console.log('Change PW status:', changeRes.status);
  console.log('Change PW body:', await changeRes.text());
}

test();
