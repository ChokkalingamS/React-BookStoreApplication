import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams,useHistory } from "react-router-dom";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { book_url, user_url } from './App';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { forwardRef } from "react";

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

export function AdminOrderpage() {
  const [data, setData] = useState(null);
  const token = localStorage.getItem('$auth');
  const Email = localStorage.getItem('Email');

  const getOrderData = () => {
    axios(
      {
        url: `${book_url}/userorders`,
        method: 'POST',
        data: { Email },
        headers: { 'x-auth-token': token }
      }).then(response => setData(response.data));
  };
  console.log(data);
  useEffect(getOrderData, [Email]);
  console.log(data);
  return (<div className='orders'>
    {!(data) ? <div>Books Not yet ordered</div> : (data.length) ?
      <div className='customerbooklist'>
        {data.map((data, i) => { return (<div key={i}><AdminBooks data={data} /> </div>); })}
      </div> : <div>Books Not yet ordered</div>}
  </div>);

}
function AdminBooks({ data }) {
  const { FirstName, LastName, Email, Mobile, Address, OrderedBooks } = data;
  // const{_id,BookName,Author,Description,Language,Publisher,Imageurl,Price,total,PublicationDate,Rating,ExpectedDelivery}=
  return (<div>
    <div>
      {OrderedBooks.map((data, i) => {
        return ( <Card key={i} sx={{ maxWidth:900 }} style={{marginBottom:'2rem'}} className='customercard' >
          <div className='customerorder' >
          <div> <img src={data.Imageurl} alt='bookThumbnail' className='bookThumbnail' /></div>
          <CardContent >
          
          <Typography variant="h6" component="div"><p>{data.BookName}</p></Typography>
          <Typography  color="text.primary"variant="subtitle2">
            <p>Author : {data.Author}</p>
            <p>Total : {data.total} Nos</p>
            <Typography variant="subtitle1" className='detail'> <b>Price : Rs.{data.Price}</b></Typography>
            <p>Expected Delivery : {data.ExpectedDelivery}</p>
            </Typography>
            </CardContent> 
            <CardContent >
            
          
          <Typography variant="subtitle1" component="div"><b>Customer Details</b></Typography>
          <Typography>
            <p>Name:{FirstName} {LastName}</p>
            <p>Email : {Email}</p>
            <p>Mobile : {Mobile}</p>
            <p>Address : {Address}</p>
          </Typography>
             
             </CardContent>
          
        </div></Card>);
      })}
    </div>

  </div>
  );
}
export function Edit() {
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
  useEffect(getBooks, [id]);
  return (<div>
    {!(data) ? <div>Loading</div> : <EditBookData data={data} />}
  </div>);
}



function EditBookData({ data }) 
{
  var { BookName: bookname, Author: author,Genre:genre,Available:available, Description: description, Language: language, Publisher: publisher, Imageurl: imageurl, Price: price, PublicationDate: publicationdate, Rating: rating, _id } = data;
  let history=useHistory()
  const token = localStorage.getItem('$auth');
  const [BookName, setBookName] = useState(bookname);
  const [Imageurl, setImageurl] = useState(imageurl);
  const [Author, setAuthor] = useState(author);
  const [Available, setAvailable] = useState(available);
  const [Description, setDescription] = useState(description);
  const [Publisher, setPublisher] = useState(publisher);
  const [Price, setPrice] = useState(price);
  const [Language, setLanguage] = useState(language);
  const [PublicationDate, setPublicationDate] = useState(publicationdate);
  const [Rating, setRating] = useState(rating);
  const [Genre,setGenre]=useState(genre)
  const [progress, setProgress] = useState(0);

  const [Message,setMessage]=useState('');
  // Snack Bar Open/Close Status
  const [open, setOpen] = useState(false);
  const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  // Snack Bar Open/Close function
  const handleClick = () => { setOpen(true); };
  const handleClose = () => { setOpen(false); };


  const BookData = { BookName,Imageurl,Author,Description,Publisher,Price,Language,PublicationDate,Rating,Genre,Available};

  let validation=yup.object({
BookName:yup.string().typeError('Field Should not be empty').required('Required Field'),
Imageurl:yup.string().typeError('Field Should not be empty').required('Required Field'),
Author:yup.string().typeError('Field Should not be empty').required('Required Field'),
Description:yup.string().typeError('Field Should not be empty').required('Required Field'),
Publisher:yup.string().typeError('Field Should not be empty').required('Required Field'),
Price:yup.number().typeError('Must specify a number').required('Required Field'),
Language:yup.string().typeError('Field Should not be empty').required('Required Field'),
PublicationDate:yup.string().typeError('Must specify a number').required('Required Field'),
Rating:yup.string().typeError('Field Should not be empty').required('Required Field'),
Genre:yup.string().typeError('Field Should not be empty').required('Required Field'),  
  })
 
  const {handleChange,handleBlur,errors,values,touched}=useFormik(
  {
    initialValues:{ BookName:bookname, Imageurl:imageurl,Genre:genre, Author:author,Available:available, Description:description, Publisher:publisher, Price:price, Language:language, PublicationDate:publicationdate, Rating:rating},
    validationSchema:validation,
  })

  const updateBook = (BookData) => {
    setProgress(1);
    axios(
      {
        url: `${book_url}/getbook/${_id}`,
        method: 'PUT',
        data: BookData,
        headers: { 'x-auth-token': token }
      }).then(response => response.data).then(data=>{setMessage({msg:data.Msg,result:'success'});setTimeout(() => history.goBack(),2000);}) 
      .catch((error) => {setMessage({ msg: error.response.data.Msg, result: 'warning' });setProgress(0)}).then(handleClick)
  };
  
  return (<div>
    {(progress === 1) && <CircularProgress id='editbookprogress' color='success'></CircularProgress>}
      <div className='booktextfieldcontainer' >
   
    <div>
    
    <TextField variant="outlined" onInput={(e=>setBookName(e.target.value))}
    onChange={handleChange} onBlur={handleBlur} error={errors.BookName && touched.BookName} value={values.BookName}
    helperText={errors.BookName && touched.BookName && errors.BookName}  name='BookName' id='BookName'
      color='success' label='Book Name' type='text' className='booktextfield' placeholder="Book Name" /><br />

    <TextField variant="outlined" onInput={(e=>setImageurl(e.target.value))}
    onChange={handleChange} onBlur={handleBlur} error={errors.Imageurl && touched.Imageurl} value={values.Imageurl}
    helperText={errors.Imageurl && touched.Imageurl && errors.Imageurl}  name='Imageurl' id='Imageurl'
      color='success' label='Thumbnail Url'  className='booktextfield'type='text' placeholder="Image url" /><br />

    <TextField variant="outlined" onInput={(e=>setAuthor(e.target.value))}
    onChange={handleChange} onBlur={handleBlur} error={errors.Author && touched.Author} value={values.Author}
    helperText={errors.Author && touched.Author && errors.Author}  name='Author' id='Author'
      color='success' label='Author' type='text' className='booktextfield' placeholder="Author Name" /><br />

    <TextField variant="outlined" onInput={(e=>setPrice(e.target.value))}
    onChange={handleChange} onBlur={handleBlur} error={errors.Price && touched.Price} value={values.Price}
    helperText={errors.Price && touched.Price && errors.Price}  name='Price' id='Price'
      color='success' label='Price' type='text' className='booktextfield' placeholder="Price" /><br />

    <TextField variant="outlined" onInput={(e=>setLanguage(e.target.value))}
    onChange={handleChange} onBlur={handleBlur} error={errors.Language && touched.Language} value={values.Language}
    helperText={errors.Language && touched.Language && errors.Language}  name='Language' id='Language'
      color='success' label='Language' type='text' className='booktextfield' placeholder="Language" /><br />
      
      <TextField variant="outlined" onInput={(e=>setGenre(e.target.value))}
    onChange={handleChange} onBlur={handleBlur} error={errors.Genre && touched.Genre} value={values.Genre}
    helperText={errors.Genre && touched.Genre && errors.Genre}  name='Genre' id='Genre'
      color='success' label='Genre' type='text' className='booktextfield' placeholder="Genre" /><br />
    </div>

    <div>
    <TextField variant="outlined" onInput={(e=>setAvailable(e.target.value))} type='number'
    onChange={handleChange} onBlur={handleBlur} error={errors.Available && touched.Available} value={values.Available}
    helperText={errors.Available && touched.Available && errors.Available}  name='Available' id='Available'
      color='success' label='Available' type='text' className='booktextfield' placeholder="Available" /><br />
      
    <TextField variant="outlined" onInput={(e=>setPublisher(e.target.value))}
    onChange={handleChange} onBlur={handleBlur} error={errors.Publisher && touched.Publisher} value={values.Publisher}
    helperText={errors.Publisher && touched.Publisher && errors.Publisher}  name='Publisher' id='Publisher'
      color='success' label='Publisher' type='text' className='booktextfield' placeholder="Publisher" /><br />

    <TextField variant="outlined" onInput={(e=>setPublicationDate(e.target.value))}
    onChange={handleChange} onBlur={handleBlur} error={errors.PublicationDate && touched.PublicationDate} value={values.PublicationDate}
    helperText={errors.PublicationDate && touched.PublicationDate && errors.PublicationDate}  name='PublicationDate' id='PublicationDate'
      color='success' label='Publication Date' type='text' className='booktextfield' placeholder="Publication Date" /><br />

    <TextField variant="outlined" onInput={(e=>setRating(e.target.value))}
    onChange={handleChange} onBlur={handleBlur} error={errors.Rating && touched.Rating} value={values.Rating}
    helperText={errors.Rating && touched.Rating && errors.Rating}  name='Rating' id='Rating'
      color='success' label='Rating' type='text'  className='booktextfield'placeholder="Rating" /><br />

    <TextField variant="outlined" onInput={(e=>setDescription(e.target.value))}
    onChange={handleChange} onBlur={handleBlur} error={errors.Description && touched.Description} value={values.Description}
    helperText={errors.Description && touched.Description && errors.Description}  name='Description' id='Description'
      color='success' label='Description' type='text'  multiline maxRows={5} className='booktextfield' placeholder="Description" /><br />
 <br/><br/><br/>
  <div className='updatecancelbutton'>
  <Button onClick={() => history.goBack()} color='error' variant='contained' className='cancel'>Cancel</Button>
  <Button type='submit' color='success' onClick={()=>updateBook(BookData)} variant='contained' >Update Book</Button>  </div>
  
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
export function GetAllUsers() {
  const [data, setData] = useState('');
  const Email = localStorage.getItem('Email');
  const token = localStorage.getItem('$auth');
  const get = () => {
    axios(
      {
        url: `${user_url}/getallusers`,
        method: 'POST',
        data: { Email },
        headers: { 'x-auth-token': token }
      }).then(response => setData(response.data));
    console.log(data, 'userlist');
  };
  useEffect(get, []);
  return (<div>
    {(!data) ? <div>...Loading</div> : <div>
    <TableContainer component={Paper} id="table">
        <Table sx={{ minWidth:400}} aria-label="simple table">
        <TableHead>
        <TableRow>
        <TableCell align="center">S.No</TableCell>  
        <TableCell align="center">Name</TableCell>
        <TableCell align="center">Email</TableCell>
        <TableCell align="center">Address</TableCell>
        <TableCell align="center">Mobile</TableCell>
        </TableRow>
        </TableHead>
      {data.map((data, i) => { return <TableBody key={i}>
      <TableRow  className="userdata" key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>  
      <TableCell align="center"> <p  className="username">{i+1}</p></TableCell>
        <TableCell align="center"> <p  className="username">{data.FirstName} {data.LastName}</p></TableCell>
        <TableCell align="center"> <p className="usermail">{data.Email}    </p></TableCell>
        <TableCell align="center"> <p className="userphnno">{data.Mobile} </p></TableCell>
        <TableCell align="center"> <p className="useraddress">{data.Address} </p></TableCell>
        </TableRow>
        </TableBody>})}
        </Table> 
        </TableContainer>
        
        </div>}
       
  </div>);
}




export function AddBookData() 
{
  let history=useHistory()
  const token = localStorage.getItem('$auth');
  const Email = localStorage.getItem('Email');

  const [BookName, setBookName] = useState("");
  const [Imageurl, setImageurl] = useState("");
  const [Author, setAuthor] = useState("");
  const [Available, setAvailable] = useState("");
  const [Description, setDescription] = useState("");
  const [Publisher, setPublisher] = useState("");
  const [Price, setPrice] = useState("");
  const [Language, setLanguage] = useState("");
  const [PublicationDate, setPublicationDate] = useState("");
  const [Rating, setRating] = useState("");
  const [Genre,setGenre]=useState("")
  const [progress, setProgress] = useState(0);

  const [Message,setMessage]=useState('');
  // Snack Bar Open/Close Status
  const [open, setOpen] = useState(false);
  const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  // Snack Bar Open/Close function
  const handleClick = () => { setOpen(true); };
  const handleClose = () => { setOpen(false); };


  const BookData = { BookName,Imageurl,Author,Description,Publisher,Price,Language,PublicationDate,Rating,Genre,Available,Email};

  let validation=yup.object({
BookName:yup.string().typeError('Field Should not be empty').required('Required Field'),
Imageurl:yup.string().typeError('Field Should not be empty').required('Required Field'),
Author:yup.string().typeError('Field Should not be empty').required('Required Field'),
Description:yup.string().typeError('Field Should not be empty').required('Required Field'),
Publisher:yup.string().typeError('Field Should not be empty').required('Required Field'),
Price:yup.number().typeError('Must specify a number').required('Required Field'),
Language:yup.string().typeError('Field Should not be empty').required('Required Field'),
PublicationDate:yup.string().typeError('Must specify a number').required('Required Field'),
Rating:yup.string().typeError('Field Should not be empty').required('Required Field'),
Genre:yup.string().typeError('Field Should not be empty').required('Required Field'),  
  })
 
  const {handleChange,handleBlur,errors,values,touched}=useFormik(
  {
    initialValues:{ BookName:'', Imageurl:'',Genre:'', Author:'',Available:'', Description:'', Publisher:'', Price:'', Language:'', PublicationDate:'', Rating:''},
    validationSchema:validation,
  })

  const addBook = (BookData) => {
    setProgress(1);
    axios(
      {
        url: `${book_url}/addbook`,
        method: 'POST',
        data: BookData,
        headers: { 'x-auth-token': token }
      }).then(response => response.data).then(data=>{setMessage({msg:data.Msg,result:'success'});setTimeout(() => history.push('/'),2000);}) 
      .catch((error) => {setMessage({ msg: error.response.data.Msg, result: 'warning' });setProgress(0)}).then(handleClick)
  };
 

  
  return (<div>
    {(progress === 1) && <CircularProgress id='addbookprogress' color='success'></CircularProgress>}
      <div className='booktextfieldcontainer' >
   
    <div>
    
    <TextField variant="outlined" onInput={(e=>setBookName(e.target.value))}
    onChange={handleChange} onBlur={handleBlur} error={errors.BookName && touched.BookName} value={values.BookName}
    helperText={errors.BookName && touched.BookName && errors.BookName}  name='BookName' id='BookName'
      color='success' label='Book Name' type='text' className='booktextfield' placeholder="Book Name" /><br />

    <TextField variant="outlined" onInput={(e=>setImageurl(e.target.value))}
    onChange={handleChange} onBlur={handleBlur} error={errors.Imageurl && touched.Imageurl} value={values.Imageurl}
    helperText={errors.Imageurl && touched.Imageurl && errors.Imageurl}  name='Imageurl' id='Imageurl'
      color='success' label='Thumbnail Url'  className='booktextfield'type='text' placeholder="Image url" /><br />

    <TextField variant="outlined" onInput={(e=>setAuthor(e.target.value))}
    onChange={handleChange} onBlur={handleBlur} error={errors.Author && touched.Author} value={values.Author}
    helperText={errors.Author && touched.Author && errors.Author}  name='Author' id='Author'
      color='success' label='Author' type='text' className='booktextfield' placeholder="Author Name" /><br />

    <TextField variant="outlined" onInput={(e=>setPrice(e.target.value))}
    onChange={handleChange} onBlur={handleBlur} error={errors.Price && touched.Price} value={values.Price}
    helperText={errors.Price && touched.Price && errors.Price}  name='Price' id='Price'
      color='success' label='Price' type='text' className='booktextfield' placeholder="Price" /><br />

    <TextField variant="outlined" onInput={(e=>setLanguage(e.target.value))}
    onChange={handleChange} onBlur={handleBlur} error={errors.Language && touched.Language} value={values.Language}
    helperText={errors.Language && touched.Language && errors.Language}  name='Language' id='Language'
      color='success' label='Language' type='text' className='booktextfield' placeholder="Language" /><br />
      
      <TextField variant="outlined" onInput={(e=>setGenre(e.target.value))}
    onChange={handleChange} onBlur={handleBlur} error={errors.Genre && touched.Genre} value={values.Genre}
    helperText={errors.Genre && touched.Genre && errors.Genre}  name='Genre' id='Genre'
      color='success' label='Genre' type='text' className='booktextfield' placeholder="Genre" /><br />
    </div>

    <div>
    <TextField variant="outlined" onInput={(e=>setAvailable(e.target.value))} type='number'
    onChange={handleChange} onBlur={handleBlur} error={errors.Available && touched.Available} value={values.Available}
    helperText={errors.Available && touched.Available && errors.Available}  name='Available' id='Available'
      color='success' label='Available' type='text' className='booktextfield' placeholder="Available" /><br />
      
    <TextField variant="outlined" onInput={(e=>setPublisher(e.target.value))}
    onChange={handleChange} onBlur={handleBlur} error={errors.Publisher && touched.Publisher} value={values.Publisher}
    helperText={errors.Publisher && touched.Publisher && errors.Publisher}  name='Publisher' id='Publisher'
      color='success' label='Publisher' type='text' className='booktextfield' placeholder="Publisher" /><br />

    <TextField variant="outlined" onInput={(e=>setPublicationDate(e.target.value))}
    onChange={handleChange} onBlur={handleBlur} error={errors.PublicationDate && touched.PublicationDate} value={values.PublicationDate}
    helperText={errors.PublicationDate && touched.PublicationDate && errors.PublicationDate}  name='PublicationDate' id='PublicationDate'
      color='success' label='Publication Date' type='text' className='booktextfield' placeholder="Publication Date" /><br />

    <TextField variant="outlined" onInput={(e=>setRating(e.target.value))}
    onChange={handleChange} onBlur={handleBlur} error={errors.Rating && touched.Rating} value={values.Rating}
    helperText={errors.Rating && touched.Rating && errors.Rating}  name='Rating' id='Rating'
      color='success' label='Rating' type='text'  className='booktextfield'placeholder="Rating" /><br />

    <TextField variant="outlined" onInput={(e=>setDescription(e.target.value))}
    onChange={handleChange} onBlur={handleBlur} error={errors.Description && touched.Description} value={values.Description}
    helperText={errors.Description && touched.Description && errors.Description}  name='Description' id='Description'
      color='success' label='Description' type='text'  multiline maxRows={5} minRows={5} className='booktextfield' placeholder="Description" /><br />
 <br/><br/><br/>
  <div className='addcancelbutton'>
  <Button onClick={() => history.goBack()} color='error' variant='contained' className='cancel'>Cancel</Button>
  <Button type='submit' color='success' onClick={()=>addBook(BookData)} variant='contained' >Add Book</Button>  </div>
  
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