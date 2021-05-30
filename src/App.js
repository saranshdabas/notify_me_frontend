import logo from './logo.svg';
import './App.css';
import { useEffect, useReducer } from 'react';
import reducer from './app-reducer';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import axios from 'axios';

const connector = axios.create({
  baseURL: 'https://cdn-api.co-vin.in/api/v2/admin',
});

const backEndConn = axios.create({
  baseURL: 'https://vaccinenotification.xyz/api',
});

const initialState = {
  states: [],
  selectedState: '',
  districts: [],
  selectedDistrict: '',
  email: '',
  unsubscribe: 0,
  openSuccess: false,
  successMsg: '',
  openError: false,
  errorMsg: '',
  loading: false,
};

const pattern = new RegExp(
  /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
);

function Alert(props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const getStates = () => {
    connector
      .get('/location/states')
      .then((res) => {
        dispatch({ type: 'SET_STATES', payload: res.data.states });
      })
      .catch((error) => {
        dispatch({
          type: 'OPEN_ERROR',
          payload: 'Api Setu failure, please try after some time!',
        });
      });
  };

  const getDistricts = () => {
    if (state.selectedState) {
      connector
        .get(`/location/districts/${state.selectedState}`)
        .then((res) => {
          dispatch({ type: 'SET_DISTRICTS', payload: res.data.districts });
        })
        .catch((error) => {
          console.log('error', error);
          dispatch({
            type: 'OPEN_ERROR',
            payload: 'Api Setu failure, please try after some time.',
          });
        });
    }
  };

  const handleSubmit = () => {
    dispatch({ type: 'LOADING' });
    if (!pattern.test(state.email)) {
      dispatch({
        type: 'OPEN_ERROR',
        payload: 'Please enter a valid email address.',
      });
      return;
    }
    if (!state.unsubscribe) {
      backEndConn
        .get('/user', { params: { email: state.email } })
        .then((res) => {
          if (res.data.data.length) {
            console.log('HERE');
            dispatch({
              type: 'OPEN_ERROR',
              payload: 'Email already registered.',
            });
          } else {
            backEndConn
              .post('/user', {
                email: state.email,
                districts: [{ id: state.selectedDistrict }],
              })
              .then((res) => {
                dispatch({
                  type: 'OPEN_SUCCESS',
                  payload: 'Congratulations, you have been registered.',
                });
              })
              .catch((error) => {
                dispatch({
                  type: 'OPEN_ERROR',
                  payload: 'Backend Api failure, please try after some time.',
                });
              });
          }
        })
        .catch((error) => {
          dispatch({
            type: 'OPEN_ERROR',
            payload: 'Backend Api failure, please try after some time.',
          });
        });
    } else {
      backEndConn
        .get('/user', { params: { email: state.email } })
        .then((res) => {
          if (res.data.data.length) {
            console.log(res.data.data[0]._id);
            backEndConn
              .delete(`/post/${res.data.data[0]._id}`)
              .then((res) => {
                dispatch({
                  type: 'OPEN_SUCCESS',
                  payload: 'User successfully deleted.',
                });
              })
              .catch((error) => {
                dispatch({
                  type: 'OPEN_ERROR',
                  payload: 'Backend Api failure, please try after some time.',
                });
              });
          } else {
            dispatch({ type: 'OPEN_ERROR', payload: 'User does not exist.' });
          }
        });
    }
    //axios.post;
  };

  useEffect(() => {
    getStates();
  }, []);

  useEffect(() => {
    getDistricts();
  }, [state.selectedState]);
  return (
    <div className='App'>
      <header className='App-header'>
        <span className='title'>
          {' '}
          Subscribe to get email notification when slots for 18+ are available
        </span>
        <main className='card'>
          <Tabs
            className='tabs'
            value={state.unsubscribe}
            onChange={(event, newValue) =>
              dispatch({ type: 'TOGGLE_TAB', payload: newValue })
            }
            indicatorColor='primary'
            textColor='primary'
            variant='fullWidth'
            aria-label='full width tabs example'
          >
            <Tab label='Subscribe' />
            <Tab label='Un-Subscribe' />
          </Tabs>
          {!state.unsubscribe && (
            <FormControl className='form-control'>
              <InputLabel>Select your state</InputLabel>
              <Select
                native
                value={state.selectedState}
                onChange={(event) =>
                  dispatch({
                    type: 'SET_STATE',
                    payload: event.target.value,
                  })
                }
                label='Select your state'
              >
                {state.states.map((state2) => {
                  return (
                    <option value={state2.state_id} key={state2.state_id}>
                      {state2.state_name}
                    </option>
                  );
                })}
              </Select>
            </FormControl>
          )}
          {!state.unsubscribe && (
            <FormControl className='form-control'>
              <InputLabel>Select your district</InputLabel>
              <Select
                native
                value={state.selectedDistrict}
                onChange={(event) =>
                  dispatch({
                    type: 'SET_DISTRICT',
                    payload: event.target.value,
                  })
                }
                label='Select your state'
              >
                {state.districts.map((district) => {
                  return (
                    <option
                      value={district.district_id}
                      key={district.district_id}
                    >
                      {district.district_name}
                    </option>
                  );
                })}
              </Select>
            </FormControl>
          )}
          <TextField
            required
            className='form-control'
            value={state.email}
            style={{ paddingBottom: '1rem' }}
            onChange={(event) =>
              dispatch({ type: 'SET_EMAIL', payload: event.target.value })
            }
            id='standard-basic'
            label='Enter your email'
          />
          <Button
            onClick={() => handleSubmit()}
            color='primary'
            variant='outlined'
          >
            SUBMIT
          </Button>
        </main>
        <Snackbar
          open={state.openSuccess}
          autoHideDuration={3000}
          onClose={() => dispatch({ type: 'CLOSE_SUCCESS' })}
        >
          <Alert
            onClose={() => dispatch({ type: 'CLOSE_SUCCESS' })}
            severity='success'
          >
            {state.successMsg}
          </Alert>
        </Snackbar>
        <Snackbar
          open={state.openError}
          autoHideDuration={3000}
          onClose={() => dispatch({ type: 'CLOSE_ERROR' })}
        >
          <Alert
            onClose={() => dispatch({ type: 'CLOSE_ERROR' })}
            severity='error'
          >
            {state.errorMsg}
          </Alert>
        </Snackbar>
      </header>
    </div>
  );
}

export default App;
