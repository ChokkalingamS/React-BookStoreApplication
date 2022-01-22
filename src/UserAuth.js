import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useHistory, useParams } from "react-router-dom";
import { user_url, context } from './App';
import booklogo1 from './booklogo1.svg';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export function Signup() {

  let history = useHistory();
  const [FirstName, setFirstName] = useState('');
  const [LastName, setLastName] = useState('');
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');

  const newUser = { FirstName, LastName, Email, Password };

  const signUp = async (newUser) => {
    axios(
      {
        url: `${user_url}/signup`,
        method: 'POST',
        data: newUser,
      }).then(x => console.log(x));

  };
  return (<div className='signupcontainer'>
    <div> <img src={booklogo1} alt='logo' className='booklogo1'/></div>
    <div className='signup'>
      <TextField type="text" onInput={(e) => setFirstName(e.target.value)} className='signuptextfield' placeholder="Firstname" />
      <TextField type="text" onInput={(e) => setLastName(e.target.value)} className='signuptextfield' placeholder=" Lastname" />
      <TextField type="text" onInput={(e) => setEmail(e.target.value)} className='signuptextfield' placeholder="Email" />
      <TextField type="text" onInput={(e) => setPassword(e.target.value)} className='signuptextfield' placeholder="Password" />
      <Button type="submit" variant='contained' className='signuptextfield' color='success' onClick={() => signUp(newUser)}>Get Started</Button>
      <div className='accountlogin'>
        <span className='accounttext'>Already Have An Account?</span>
      <Button type="submit" variant='contained' onClick={() => history.push('/login')}>Login</Button>
      </div>
    </div>
    </div>);
}
export function Login() {
  let history = useHistory();
  const { Email, setEmail, Auth, setAuth } = useContext(context);
  const [Password, setPassword] = useState('');
  const [Result, setResult] = useState('');
  const [Message, setMessage] = useState('');
  // const [user,setUser]=useState('')
  const userdata = { Email, Password };


  const logIn = async (userdata) => {
    axios(
      {
        url: `${user_url}/login`,
        method: "POST",
        data: userdata
      }).then(response => response)
      .then((data) => setResult(data));
  };


  const getData = () => {
    const token = localStorage.getItem('$auth');
    const Email = localStorage.getItem('Email');
    axios({
      url: `${user_url}/getuser`,
      method: 'POST',
      data: { Email },
      headers: { 'x-auth-token': token }
    }).then(response => localStorage.setItem('$user', response.data.User)).then(_ => history.push('/')).then(_ => window.location.reload());
  };

// }).then(response => localStorage.setItem('$user', response.data.User)).then(_ => history.push('/')).then(_ => window.location.reload());

  useEffect(() => {
    function authenticate() {
      if (Result) {
        const { data } = Result;
        if (data.token) {
          localStorage.setItem("$auth", data.token);
          localStorage.setItem("$condition", true);
          localStorage.setItem('Email', Email);
          getData();
          setAuth(true);

        }
      }
    }
    authenticate();
  }, [Result]);

  return (
    <div className='logincontainer'>
      <div> <img src={booklogo1} alt='logo' className='booklogo1'/></div>
    <div className='login'>
      <TextField type="text" className='logintextfield' onInput={(e) => setEmail(e.target.value)} placeholder="Email" />
      <TextField type="text"className='logintextfield'  onInput={(e) => setPassword(e.target.value)} placeholder="Password" />
      
      <Button type="submit" color='primary' variant='contained' onClick={() => logIn(userdata)} className='logintextfield'>Login</Button>
      <div className='loginbuttoncontainer'>
      <Button type="submit" color='error'className='forgotpasswordbutton' onClick={() => history.push('/forgotpassword')}>Forgot Password</Button>
      <Button type="submit" color='warning'variant='contained' className='signupbutton'  onClick={() => history.push('/signup')}>Signup</Button>
      </div>
    </div>
    </div>);

}
export function ForgotPassword() {
  let history = useHistory();
  const [Email, setEmail] = useState('');
  const userdata = { Email };
  const [result, setResult] = useState('');

  const forgotPassword = async (userdata) => {
    axios(
      {
        url: `${user_url}/forgotpassword`,
        method: 'POST',
        data: userdata
      }).then(response => response)
      .then(response => setResult(response));
  };


  return (<div> 
    <div className='forgotpassword'>
      
      <Typography gutterBottom variant="h5" className='forgotpasswordheading'  component="div">Forgot Password</Typography>
      
      <TextField type="text" className='forgottextfield' onInput={(e) => setEmail(e.target.value)} placeholder="Email" />
      <Button type="submit" className='forgottextfield' variant='contained' color='warning' onClick={() => { forgotPassword(userdata); }}>Submit</Button>
      <Button type="submit" className='forgotpasswordback' variant='contained' color='primary' onClick={() => history.push('/login')}>Back</Button>
    </div>
    </div>);


}
export function UpdatePassword() {
  const { id: token } = useParams();
  const [Password, setPassword] = useState('');
  const [result, setResult] = useState('');
  const [Message, setMessage] = useState('');

  const userdata = { Password, token };

  const Changepassword = async (userdata) => {
    axios(
      {
        url: `${user_url}/updatepassword`,
        method: 'POST',
        data: userdata
      }).then(response => response)
      .then(response => setResult(response));
  };
  if (result) {
    console.log('update', result);
  }


  return (<div className='updatepassword'>
    <Typography gutterBottom variant="h5" className='updatepasswordheading'  component="div">Change Password</Typography>
    <TextField type="text"   onInput={(e) => setPassword(e.target.value)} className='updatepasswordtextfield' placeholder="Password" />
    <Button type="submit"  variant='contained'onClick={() => Changepassword(userdata)} className='updatepasswordtextfield'>  Update Password</Button>
    
  </div>);

}
