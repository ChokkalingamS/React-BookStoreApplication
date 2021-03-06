import { useState, useEffect,forwardRef } from 'react';

import axios from 'axios';
import { useHistory, useParams } from "react-router-dom";
import { useFormik } from 'formik';
import * as yup from 'yup';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import TextField from '@mui/material/TextField';
import Rating from '@mui/material/Rating';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import { user_url, book_url } from './App';

import emptycart from './Images/emptycart.svg';
import noorder from './Images/noorder.svg';



// User Profile Page
export function Dashboard() {
  const [data, setData] = useState(null);
  const token = localStorage.getItem('$auth');
  const Email = localStorage.getItem('Email');

  const getData = () => {
    axios({
      url: `${user_url}/getuser`,
      method: 'POST',
      data: { Email },
      headers: { 'x-auth-token': token }
    }).then(response => setData(response.data));
  };

  useEffect(getData, [Email,token]);
 
  return (
    <div className='dashboard'>
      {!(data) ? <div><CircularProgress id='profileprogress' color='success'></CircularProgress></div> :
        <div className='profile'><UpdateProfile data={data} /></div>}
    </div>);
}


function UpdateProfile({ data })
 {

  const token = localStorage.getItem('$auth');
  const [progress, setProgress] = useState(0); // Progress Bar
  const { FirstName: fname, LastName: lname, Email, Mobile: phone, Address: addr } = data;
  let history = useHistory();

  const [FirstName, setFirstName] = useState(fname);

  const [Message,setMessage]=useState('');
  // Snack Bar Open/Close Status
  const [open, setOpen] = useState(false);
  const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  // Snack Bar Open/Close function
  const handleClick = () => { setOpen(true); };
  const handleClose = () => { setOpen(false); };


  let validation=yup.object({
    FirstName:yup.string().required('Required Field'),
    LastName:yup.string().required('Required Field'),
    Address:yup.string().required('Required Field'),
    Mobile: yup.number().typeError('Must specify a number').min(10, 'Invalid').required('Required Field')
  })

  

  const {handleChange,handleSubmit,handleBlur,errors,values,touched}=useFormik(
  {
    initialValues:{FirstName:fname,LastName:lname,Address:addr,Mobile:phone,Email},
    validationSchema:validation,
    onSubmit:(userData)=>update(userData)
  })


  const update = (userData) => {
    setProgress(1);
    axios({
      url: `${user_url}/profileupdate`,
      method: 'PUT',
      data: userData,
      headers: { 'x-auth-token': token }
    }).then(response=>response.data).then(data=>{setMessage({msg:data.Msg,result:'success'});setTimeout(() => history.goBack(),1500)})
    .catch((error) => {setMessage({ msg: error.response.data.Msg, result: 'error' });setProgress(0)})
    .then(handleClick)
    
  };
  localStorage.setItem('$name',FirstName)
  return (
      <div>
            {/* Condional Rendering after submit */}
    {(progress === 1) && <CircularProgress id='profileprogress' color='success'></CircularProgress>}

    <div className='profiletextfieldcontainer'>
    <form onSubmit={handleSubmit}>
    <TextField variant="outlined"  onInput={(e) => setFirstName(e.target.value)}
      onChange={handleChange} onBlur={handleBlur} error={errors.FirstName && touched.FirstName} value={values.FirstName}
      helperText={errors.FirstName && touched.FirstName && errors.FirstName}  name='FirstName' id='FirstName'
      color='success' label='FirstName' type='text' className='profiletextfield' placeholder="FirstName" /><br />

    <TextField variant="outlined"  
      onChange={handleChange} onBlur={handleBlur} error={errors.LastName && touched.LastName} value={values.LastName}
      helperText={errors.LastName && touched.LastName && errors.LastName}  name='LastName' id='LastName'
      color='success' label='LastName' type='text' className='profiletextfield' placeholder="LastName" /><br />

    <TextField variant="outlined" value={Email} readOnly
      color='success' label='Email' type='text' className='profiletextfield' placeholder="Email" /><br />

    <TextField variant="outlined"   multiline maxRows={2}
      onChange={handleChange} onBlur={handleBlur} error={errors.Address && touched.Address} value={values.Address}
      helperText={errors.Address && touched.Address && errors.Address}  name='Address' id='Address'
      color='success' label='Address' type='text' className='profiletextfield' placeholder="Address" /><br />

    <TextField variant="outlined"  multiline maxRows={5} 
      onChange={handleChange} onBlur={handleBlur} error={errors.Mobile && touched.Mobile} value={values.Mobile}
      helperText={errors.Mobile && touched.Mobile && errors.Mobile}  name='Mobile' id='Mobile'
      color='success' label='Mobile' type='text' className='profiletextfield' placeholder="Mobile" /><br />


    <Button type='submit' fullWidth variant='contained'>Update</Button><br /><br/>
    <Button onClick={() => history.push('/')} fullWidth color='error' variant='contained'>Cancel</Button>
    </form>
     {/* Snack Bar */}
     <Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
          <Alert severity={Message.result} sx={{ width: '100%' }}>
            {Message.msg}
          </Alert>
        </Snackbar>
      </Stack>
  </div>
  </div>);
}



// My Cart Page
export function MyCart() {
  const [data, setData] = useState('');
  const Email = localStorage.getItem('Email');
  const token = localStorage.getItem('$auth');
  const [show,setShow]=useState(0);

  const getCartData = () => {
    axios(
      {
        url: `${book_url}/getcartdata`,
        method: 'POST',
        data: { Email },
        headers: { 'x-auth-token': token }
      }).then(response => setData(response.data.OrderedBooks));

      setTimeout(() => {
        setShow(1)
      }, 3000);

  };
  useEffect(getCartData, [Email,token]);
  return (<div><div className='heading'><Typography variant="h4" align='left' component="div">My Cart</Typography></div>
          {(show === 0) && <CircularProgress id='cartprogress' color='success'></CircularProgress>}
    <div className='mycart'>
      {((!data) || !(data.length)) ? (show) ?<div className='emptycart'><img src={emptycart} alt='logo'/> </div>:''
       : data.map((data, i) => { return <div className='cartbook' key={i}> <CartBooks data={data} getCartData={getCartData} visibility={false} /></div>; })}
    </div>
  </div>);
}




function CartBooks({ data, getCartData }) {
  
  let history = useHistory();
  const token = localStorage.getItem('$auth');
  const Email = localStorage.getItem('Email');
  const { BookName, Author, Imageurl, Price, Rating: rating, _id } = data;

  const [Message,setMessage]=useState('');
  // Snack Bar Open/Close Status
  const [open, setOpen] = useState(false);
  const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  // Snack Bar Open/Close function
  const handleClick = () => { setOpen(true); };
  const handleClose = () => { setOpen(false); };


  const DeleteCartBook = (_id) => {
    axios(
      {
        url: `${book_url}/deletecart/${_id}`,
        method: 'DELETE',
        data: { Email },
        headers: { 'x-auth-token': token }
      }).then(response =>response.data).then(data=>setMessage({msg:data.Msg,result:'success'}))
      .catch(error=>setMessage({msg:error.response.data.Msg,result:'error'})).then(handleClick)
      .then(() =>setTimeout(() =>getCartData(),500) );
  };
  
  return (<div>
    <Card sx={{ maxWidth: 800 }} className='CartBook'>
      <div className='cartcontainer'>

        <div className='thumbnailContainer'>
          <img src={Imageurl} className='bookThumbnail' alt='bookThumbnail' />
        </div>
        <CardContent className='bookContent'>

          <Typography gutterBottom variant="h6" component="div">
            <b className='bookName'>{BookName}</b>
            <IconButton onClick={() => history.push(`/bookinfo/${_id}`)}><InfoIcon /></IconButton>
          </Typography>

          <Typography  color="text.primary" variant="subtitle2">
            <p className='detail'>Author : {Author}</p></Typography>
            <Rating name="half-rating-read" className='detail' defaultValue={+rating} precision={0.5} readOnly />
            <Typography  color="text.primary" variant="h6"><p className='detail'>Price : Rs.{Price}</p></Typography>
          

          <Button onClick={() => DeleteCartBook(_id)} color='error' variant='outlined' style={{ marginRight: '0.75rem' }}>Remove Item</Button>
          <Button onClick={() => history.push(`/orderbook/${_id}`)} color='warning' variant='contained'>Place Order</Button>
        </CardContent>
      </div>
    </Card>

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


// Place Order page
export function OrderBook() {

  const { id } = useParams();
  const [data, setData] = useState(null);
  const token = localStorage.getItem('$auth');

  const getBooks = () => {
    axios(
      {
        url: `${book_url}/getbook/${id}`,
        method: 'GET',
        headers: { 'x-auth-token': token }
      }).then(response => setData(response.data));
  };
  useEffect(getBooks, [id,token]);
  
  return (<div className='Orderbookcontainer'>
    {!(data) ? <div>{<CircularProgress id='orderprogress' color='warning'></CircularProgress>}</div> : <PlaceOrder data={data} showcount={true} />}
  </div>);
}




function PlaceOrder({ data }) {
  
  const { BookName, Author, Imageurl, Price, Rating: rating, Available, _id } = data;
  let history = useHistory();
  const [count, setCount] = useState(1);
  const token = localStorage.getItem('$auth');
  const Email = localStorage.getItem('Email');
  const [progress,setProgress]=useState(0);

  const [Message,setMessage]=useState('');
  // Snack Bar Open/Close Status
  const [open, setOpen] = useState(false);
  const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  // Snack Bar Open/Close function
  const handleClick = () => { setOpen(true); };
  const handleClose = () => { setOpen(false); };


  const orderBook = (_id, total) => {
    setProgress(1)
    axios(
      {
        url: `${book_url}/orderbooks/${_id}`,
        method: 'POST',
        data: { Email, total },
        headers: { 'x-auth-token': token }
      }).then(response => response.data).then(data=>{setMessage({msg:data.Msg,result:'success'});setTimeout(() => history.push('/message'),1500);})
        .catch(error=>error.response.data).then(data=>{setMessage({msg:data.Msg,result:'warning'});setProgress(0)}).then(handleClick)
    };
  return (<div>
    {(progress === 1) && <CircularProgress id='orderbookprogress' color='warning'></CircularProgress>}
    
    <Card sx={{ maxWidth: 800 }}>
      <div className='ordercontainer'>
        <div className='thumbnailContainer'>
          <img src={Imageurl} className='bookThumbnail' alt='bookThumbnail' />
        </div>
        <CardContent className='bookContent'>

          <Typography gutterBottom variant="subtitle1" component="div">
            <b className='bookName'>{BookName}</b>
            <IconButton onClick={() => history.push(`/bookinfo/${_id}`)}><InfoIcon /></IconButton>
          </Typography>

          <Typography color="text.primary" variant="subtitle2">
            <p className='detail'>Author : {Author}</p>
            <Rating name="half-rating-read" className='detail' defaultValue={+rating} precision={0.5} readOnly />
            {(Available)&&<p className='detail'>Total : {count} Nos</p>}
            <Typography variant="subtitle1" className='detail'><b>Price : Rs.{Price * count}</b></Typography>
            {(Available)?<p>Payment Method : Cash On Delivery Only Available</p>:''}
          </Typography>

          <div>
            {(Available < 12 && Available > 0) ? <p className='bookleftalert'>Hurry Up!!!  Only {Available} books left </p> : (Available===0) ? <p className='bookleftalert'>Books Sold Out</p> : ''}

            {(Available>0) &&
              <div className='buttonContainer'>

                <div className='addbook'>
                  <Button onClick={() => setCount(count + 1)} variant='outlined'>+</Button>
                  <Typography>{count}</Typography>
                  <Button onClick={() => (count > 1) && setCount(count - 1)} variant='outlined'>-</Button> </div>

                <Button onClick={() => orderBook(_id, count)} variant='contained' color='warning'>Place Order</Button>

              </div>}
          </div>
        </CardContent>
      </div>
    </Card>   
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


// Books Order Page
export function MyOrders() {
  const [data, setData] = useState(null);
  const token = localStorage.getItem('$auth');
  const Email = localStorage.getItem('Email');
  const [show,setShow]=useState(0);

  const getOrderData = () => {
    axios(
      {
        url: `${book_url}/getorderbooks`,
        method: 'POST',
        data: { Email },
        headers: { 'x-auth-token': token }
      }).then(response => setData(response.data.OrderedBooks));

      setTimeout(() => {
        setShow(1)
      }, 3000);

  };
  useEffect(getOrderData, [Email,token]);
  
  return (<div>
      {(show === 0) && <CircularProgress id='orderpageprogress' color='success'></CircularProgress>}
       <div className='heading'><Typography gutterBottom variant="h5" component="div" align="left">My Orders</Typography></div>
    <div className='orders'>
    
    {((!data) || !(data.length)) ? (show) ?<div className='emptyorder'><img src={noorder} alt='logo'/></div> :''

      :<div className='orderbooklist'>
        {data.map((data, i) => { return (<div key={i}><GetOrderBooks data={data} /> </div>); })}
      </div>}
  </div>
  </div>);
}



function GetOrderBooks({ data }) {
  const { BookName, Author, Imageurl, Price, total, Rating, ExpectedDelivery, _id } = data;
  let history = useHistory();
  return (<Card sx={{ maxWidth: 800 }}>
    <div className='orderedbooklist'>

      <div className='thumbnailContainer'>
        <img src={Imageurl} className='bookThumbnail' alt='bookThumbnail' />
      </div>
      <CardContent>
        <div className='bookContent'>
          <Typography gutterBottom variant="h5" component="div" className='bookName'>{BookName}
            <IconButton onClick={() => history.push(`/bookinfo/${_id}`)}><InfoIcon /></IconButton></Typography>
          <Typography color="text.primary" variant="subtitle2">
            <p>Author : {Author}</p>
            <p>Rating : {Rating}</p>
            <p>Total  : {total} Nos</p>
            <Typography color="text.primary" variant="subtitle1"> <b>Price  : Rs.{Price}</b></Typography>
            <p>Payment Method : Cash On Delivery</p>
            <p>Expected Delivery : {ExpectedDelivery} </p></Typography>
        </div></CardContent>
    </div>
  </Card>);
}
