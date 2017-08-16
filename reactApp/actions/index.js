export function login(userId, docs) {
  return {
    type: 'LOGIN', 
    userId, 
    docs
  };
}

export function logout() {
  return {
    type: 'LOGOUT', 
    userId: '', 
    docs: []
  };
}

export function updatePortal (docs) {
  return {
    type: 'UPDATEPORTAL', 
    docs
  };
}