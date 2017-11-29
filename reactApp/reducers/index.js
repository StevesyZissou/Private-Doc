const reducer = (state = {userId: '', docs: []}, action) => {
  switch(action.type) {
  case 'LOGIN': 
    var newState = {
      userId: action.userId, 
      docs: action.docs
    };
    return newState; 
  case 'UPDATEPORTAL': 
    var newState2 = {
      userId: state.userId, 
      docs: action.docs
    };
    return newState2; 
  case 'LOGOUT': 
    var newState3 = {
      userId: action.userId, 
      docs: action.docs
    };
    return newState3;
  default: 
    return state;   
  }
};

export default reducer;

// sample userId: '5990c91c7fe732141da75968'