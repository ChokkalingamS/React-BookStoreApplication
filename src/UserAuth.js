import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useHistory, useParams } from "react-router-dom";
import { user_url, context } from './App';
import booklogo1 from './booklogo1.svg';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { InputAdornment, Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CircularProgress from '@mui/material/CircularProgress';
import { forwardRef } from "react";
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import { useFormik } from 'formik';
import * as yup from 'yup';

export function Signup() {

  let history = useHistory();
   // Snackbar 
   const [Message, setMessage] = useState(''); // Server Message
   // Snack bar Open/Close Status
   const [open, setOpen] = useState(false);
   const Alert = forwardRef(function Alert(props, ref) {
     return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
   });
    // Snack bar Open/Close function
   const handleClick = () => { setOpen(true); };
   const handleClose = () => { setOpen(false); };
   

  let validation=yup.object({
    FirstName:yup.string().required('Required Field'),
    LastName:yup.string().required('Required Field'),
    Email:yup.string().required('Required Field').matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Must Be a Valid Email'),
    Password: yup.string().min(8, 'Minimum 8 Characters Required').required('Required Field')
  })

  const {handleChange,handleSubmit,handleBlur,errors,values,touched}=useFormik(
  {
    initialValues:{FirstName:'',LastName:'',Email:'',Password:''},
    validationSchema:validation,
    onSubmit:(newUser)=>signUp(newUser)
  })

    // Password Icon Functionality
    const [text, setText] = useState('Show');
    const [visible, setVisible] = useState('password');
    const icon = (visible === 'password') ? <VisibilityIcon /> : <VisibilityOffIcon />;
    const visibility = () => {
      setVisible((visible) => (visible === 'password') ? 'text' : 'password');
      setText((text) => (text === 'Show') ? 'Hide' : 'Show');
    };
  



  const signUp = async (newUser) => {
    axios(
      {
        url: `${user_url}/signup`,
        method: 'POST',
        data: newUser,
      }).then(response => response.data).then(data=>{setMessage({msg:data.Msg,result:'success'});}) 
      .catch((error) => setMessage({ msg: error.response.data.Msg, result: 'warning' })).then(handleClick)
  };
  return (<div>
      <div className='signupcontainer'>
    <div> <img src={booklogo1} alt='logo' className='booklogo1'/></div>
    <div className='signup'>
      <form onSubmit={handleSubmit}>
      <TextField type="text" 
       onChange={handleChange} onBlur={handleBlur} error={errors.FirstName && touched.FirstName} value={values.FirstName}
       helperText={errors.FirstName && touched.FirstName && errors.FirstName}  name='FirstName' id='FirstName'
      className='signuptextfield' placeholder="First Name" /><br/>
        
      <TextField type="text" 
      onChange={handleChange} onBlur={handleBlur} error={errors.LastName && touched.LastName} value={values.LastName}
      helperText={errors.LastName && touched.LastName && errors.LastName}  name='LastName' id='LastName'
      className='signuptextfield' placeholder=" Last Name" /><br/>

      <TextField type="text"
      onChange={handleChange} onBlur={handleBlur} error={errors.Email && touched.Email} value={values.Email}
      helperText={errors.Email && touched.Email && errors.Email} name='Email' id='Email'
      className='signuptextfield' placeholder="Email" /><br/>

      <TextField type="text"  type={visible}
      onChange={handleChange} onBlur={handleBlur} error={errors.Password && touched.Password} value={values.Password}
      helperText={errors.Password && touched.Password && errors.Password} name='Password' id='Password'
      className='signuptextfield' placeholder="Password"
      InputProps={{
        endAdornment: (<InputAdornment position="start">
          <Tooltip title={text}>
            <IconButton onClick={() => visibility()}>
              {icon}
            </IconButton>
          </Tooltip>
        </InputAdornment>
        ),
      }} /><br/>
        
      <Button type="submit" variant='contained' fullWidth  color='success'>Get Started</Button>
      </form>
      <div className='accountlogin'>
        <span className='accounttext'>Already Have An Account?</span>
      <Button type="submit" variant='contained' onClick={() => history.push('/login')}>Login</Button>
      </div>
      
    </div>
    </div>
      {/* Snack Bar */}
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
        <Alert severity={Message.result} sx={{ width: '100%' }}>
          {Message.msg}
        </Alert>
      </Snackbar>
    </Stack>
    </div>);
}





export function Login() {
  let history = useHistory();
  
  const [Result, setResult] = useState('');
  const [Message, setMessage] = useState('');

  // Snack Bar Open/Close Status
  const [open, setOpen] = useState(false);
  const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  // Snack Bar Open/Close function
  const handleClick = () => { setOpen(true); };
  const handleClose = () => { setOpen(false); };



  let validation=yup.object(
  {
    Email:yup.string().required('Required Field').matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Must Be a Valid Email'),
    Password: yup.string().min(8, 'Minimum 8 Characters Required').required('Required Field')
  })

  const {handleChange,handleSubmit,handleBlur,errors,values,touched}=useFormik(
  {
    initialValues:{Email:'',Password:''},
    validationSchema:validation,
    onSubmit:(userdata)=>logIn(userdata)
  })

    // Password functionality
    const [text, setText] = useState('Show');
    const [visible, setVisible] = useState('password');
    const icon = (visible === 'password') ? <VisibilityIcon /> : <VisibilityOffIcon />;
    const visibility = () => {
      setVisible((visible) => (visible === 'password') ? 'text' : 'password');
      setText((text) => (text === 'Show') ? 'Hide' : 'Show');
    };

  const logIn = async (userdata) => {
    axios(
      {
        url: `${user_url}/login`,
        method: "POST",
        data: userdata
      }).then(response => response)
      .then((data) => setResult(data)).then(_ => history.push('/'))
      .catch((error) => {setMessage({ msg: error.response.data.Msg, result: 'error' });handleClick()})
  };

// console.log(Result);
//   const getData = () => {
//     const token = localStorage.getItem('$auth');
//     const Email = localStorage.getItem('Email');
//     axios({
//       url: `${user_url}/getuser`,
//       method: 'POST',
//       data: { Email },
//       headers: { 'x-auth-token': token }
//     }).then(response => localStorage.setItem('$user', response.data.User)).then(_ => history.push('/'));
//   };

// }).then(response => localStorage.setItem('$user', response.data.User)).then(_ => history.push('/')).then(_ => window.location.reload());


  useEffect(() => {
    function authenticate() {
      if (Result) {
        const { data } = Result;
        console.log(data);
        if (data.token) {
          localStorage.setItem('$name', data.FirstName);
          localStorage.setItem('Email', data.Email);
          localStorage.setItem('$user', data.User)
          localStorage.setItem("$auth", data.token);
          localStorage.setItem("$condition", true);
        }
      }
    }
    authenticate();
  }, [Result]);

  return (  <div>
    <div className='logincontainer'>
      <div> <img src={booklogo1} alt='logo' className='booklogo1'/></div>
    <div className='login'>
      <form onSubmit={handleSubmit}>
      <TextField type="text" className='logintextfield' 
      onChange={handleChange} onBlur={handleBlur} error={errors.Email && touched.Email} value={values.Email}
      helperText={errors.Email && touched.Email && errors.Email} name='Email' id='Email'
       placeholder="Email" /><br/>


      <TextField type="text"className='logintextfield'  
      onChange={handleChange} onBlur={handleBlur} error={errors.Password && touched.Password} value={values.Password}
      helperText={errors.Password && touched.Password && errors.Password}  name='Password' id='Password' type={visible}
      placeholder="Password"   InputProps={{
        endAdornment: (<InputAdornment position="start">
          <Tooltip title={text}>
            <IconButton onClick={() => visibility()}>
              {icon}
            </IconButton>
          </Tooltip>
        </InputAdornment>
        ),
      }} /><br/>
      <Button type="submit" color='primary' variant='contained'  fullWidth>Login</Button><br/><br/>
      </form>
      
      <div className='loginbuttoncontainer'>
      <Button type="submit" color='error'className='forgotpasswordbutton' onClick={() => history.push('/forgotpassword')}>Forgot Password</Button>
      <Button type="submit" color='warning'variant='contained' className='signupbutton'  onClick={() => history.push('/signup')}>Signup</Button>
      </div>
    </div>
    </div>
     {/* Snack Bar */}
     <Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
          <Alert severity={Message.result} sx={{ width: '100%' }}>
            {Message.msg}
          </Alert>
        </Snackbar>
      </Stack>
    
    
    </div>);

}
export function ForgotPassword() {
  let history = useHistory();
  const [Email, setEmail] = useState('');
  
  const [Message, setMessage] = useState('');

  // Snack Bar Open/Close Status
  const [open, setOpen] = useState(false);
  const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  // Snack Bar Open/Close function
  const handleClick = () => { setOpen(true); };
  const handleClose = () => { setOpen(false); };



  
  let validation=yup.object(
    {
      Email:yup.string().required('Required Field').matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Must Be a Valid Email'),
    })
  
    const {handleChange,handleSubmit,handleBlur,errors,values,touched}=useFormik(
    {
      initialValues:{Email:''},
      validationSchema:validation,
      onSubmit:(userdata)=>forgotPassword(userdata)
    })

  const forgotPassword = async (userdata) => {
    axios(
      {
        url: `${user_url}/forgotpassword`,
        method: 'POST',
        data: userdata
      }).then(response => response.data).then(data=>{setMessage({msg:data.Msg,result:'success'});}) 
      .catch((error) => setMessage({ msg: error.response.data.Msg, result: 'warning' })).then(handleClick)
  };
console.log(Message);

  return (<div> 
    <div className='forgotpassword'>
      
      <Typography gutterBottom variant="h5" className='forgotpasswordheading'  component="div">Forgot Password</Typography>
      <form onSubmit={handleSubmit}>
      <TextField type="text" className='forgottextfield'
    
      onChange={handleChange} onBlur={handleBlur} error={errors.Email && touched.Email} value={values.Email} onInput={(e)=>setEmail(e.target.value)}
      helperText={errors.Email && touched.Email && errors.Email} name='Email' id='Email'
      placeholder="Email" /><br/>
      <Button type="submit" fullWidth variant='contained' color='warning' >Submit</Button>
      </form><br/>
      <Button type="submit" className='forgotpasswordback' variant='contained' color='primary' onClick={() => history.push('/login')}>Back</Button>
    </div>

      {/* Snack Bar */}
      <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
        <Alert severity={Message.result} sx={{ width: '100%' }}>
          {Message.msg}
        </Alert>
      </Snackbar>
    </Stack>





    </div>);


}
export function UpdatePassword() {
  const { id: token } = useParams();
  const [Password, setPassword] = useState('');
  const [result, setResult] = useState('');
  const [Message, setMessage] = useState('');



  // Snack Bar Open/Close Status
  const [open, setOpen] = useState(false);
  const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  // Snack Bar Open/Close function
  const handleClick = () => { setOpen(true); };
  const handleClose = () => { setOpen(false); };

  
  let validation=yup.object(
    {
      Password: yup.string().min(8, 'Minimum 8 Characters Required').required('Required Field')
    })
  
    const {handleChange,handleSubmit,handleBlur,errors,values,touched}=useFormik(
    {
      initialValues:{Password:'',token},
      validationSchema:validation,
      onSubmit:(userdata)=>Changepassword(userdata)
    })
  
      // Password functionality
      const [text, setText] = useState('Show');
      const [visible, setVisible] = useState('password');
      const icon = (visible === 'password') ? <VisibilityIcon /> : <VisibilityOffIcon />;
      const visibility = () => {
        setVisible((visible) => (visible === 'password') ? 'text' : 'password');
        setText((text) => (text === 'Show') ? 'Hide' : 'Show');
      };

  const Changepassword = async (userdata) => {
    axios(
      {
        url: `${user_url}/updatepassword`,
        method: 'POST',
        data: userdata
      }).then(response => response.data).then(data=>{setMessage({msg:data.Msg,result:'success'});}) 
      .catch((error) => setMessage({ msg: error.response.data.Msg, result: 'warning' })).then(handleClick)
      
      
      // .then(response => response)
      // .then(response => setResult(response));
  };
  

  return (<div>
      <div className='updatepassword'>

    <Typography gutterBottom variant="h5" className='updatepasswordheading'  component="div">Change Password</Typography>

    <form onSubmit={handleSubmit}>

    <TextField type="text"   className='updatepasswordtextfield' 
     onChange={handleChange} onBlur={handleBlur} error={errors.Password && touched.Password} value={values.Password} onInput={(e)=>e.target.value}
     helperText={errors.Password && touched.Password && errors.Password}  name='Password' id='Password' type={visible}
     placeholder="Password"   InputProps={{
       endAdornment: (<InputAdornment position="start">
         <Tooltip title={text}>
           <IconButton onClick={() => visibility()}>
             {icon}
           </IconButton>
         </Tooltip>
       </InputAdornment>
       ),
     }} />
    <br/>

    <Button type="submit"  variant='contained'  fullWidth>  Update Password</Button>
    </form>
  </div>
      {/* Snack Bar */}
      <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
        <Alert severity={Message.result} sx={{ width: '100%' }}>
          {Message.msg}
        </Alert>
      </Snackbar>
    </Stack>


  </div>);

}
