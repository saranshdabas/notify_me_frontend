const reducer = (state, action) => {
  const { type, payload } = action;
  if (type === 'START_LOADING') {
    return { ...state, loading: true };
  }
  if (type === 'SET_STATES') {
    console.log(payload);
    return { ...state, selectedState: payload[0].state_id, states: payload };
  }
  if (type === 'SET_STATE') {
    return { ...state, selectedState: payload };
  }
  if (type === 'SET_DISTRICT') {
    return { ...state, selectedDistrict: payload };
  }
  if (type === 'SET_DISTRICTS') {
    return {
      ...state,
      selectedDistrict: payload[0].district_id,
      districts: payload,
    };
  }
  if (type === 'SET_EMAIL') {
    return { ...state, email: payload };
  }
  if (type === 'TOGGLE_TAB') {
    return { ...state, unsubscribe: payload };
  }
  if (type === 'OPEN_SUCCESS') {
    return { ...state, loading: false, openSuccess: true, successMsg: payload };
  }
  if (type === 'CLOSE_SUCCESS') {
    return { ...state, openSuccess: false };
  }
  if (type === 'OPEN_ERROR') {
    return { ...state, loading: false, openError: true, errorMsg: payload };
  }
  if (type === 'CLOSE_ERROR') {
    return { ...state, openError: false };
  }
  if (type === 'LOADING') {
    return { ...state, loading: true };
  }
  return { ...state };
};

export default reducer;
