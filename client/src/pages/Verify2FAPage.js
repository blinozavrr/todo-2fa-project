import React, { useState } from 'react';
import axios from 'axios';

export default function Verify2FAPage() {
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/api/auth/verify-2fa', { userId, token });
      console.log(res.data);
      alert('2FA подтверждена! Теперь можете войти в систему.');
    } catch (error) {
      console.error(error.response.data);
    }
  };

  return (
    <div>
      <h2>Подтверждение 2FA</h2>
      <form onSubmit={handleVerify}>
        <input 
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e)=>setUserId(e.target.value)}
        />
        <input 
          type="text"
          placeholder="6-значный код"
          value={token}
          onChange={(e)=>setToken(e.target.value)}
        />
        <button type="submit">Подтвердить</button>
      </form>
    </div>
  );
}
