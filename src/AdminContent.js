import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams,useHistory } from "react-router-dom";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { book_url, user_url } from './App';


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
          
          <Typography variant="h6" component="div">
            <p>{data.BookName}</p>
          </Typography>
          <Typography  color="text.primary"variant="subtitle2">
            <p>Author : {data.Author}</p>
            <p>Total : {data.total} Nos</p>
            <Typography variant="subtitle1" className='detail'> <b>Price : Rs.{data.Price}</b></Typography>
            <p>Expected Delivery : {data.ExpectedDelivery}</p>
            </Typography>
            </CardContent> 
            <CardContent >
            
          
          <Typography variant="subtitle1" component="div"><b>UserDetails</b></Typography>
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
function EditBookData({ data }) {
  var { BookName: bookname, Author: author, Description: description, Language: language, Publisher: publisher, Imageurl: imageurl, Price: price, PublicationDate: publicationdate, Rating: rating, _id } = data;
  let history=useHistory()
  const token = localStorage.getItem('$auth');
  const [BookName, setBookName] = useState(bookname);
  const [Imageurl, setImageurl] = useState(imageurl);
  const [Author, setAuthor] = useState(author);
  const [Description, setDescription] = useState(description);
  const [Publisher, setPublisher] = useState(publisher);
  const [Price, setPrice] = useState(price);
  const [Language, setLanguage] = useState(language);
  const [PublicationDate, setPublicationDate] = useState(publicationdate);
  const [Rating, setRating] = useState(rating);
  const [Result, setResult] = useState('');

  const BookData = { BookName, Imageurl, Author, Description, Publisher, Price, Language, PublicationDate, Rating };

  const updateBook = (BookData) => {
    axios(
      {
        url: `${book_url}/getbook/${_id}`,
        method: 'PUT',
        data: BookData,
        headers: { 'x-auth-token': token }
      }).then(response => setResult(response));
  };
  console.log(Result, 'Edit');
  return (<div className='booktextfieldcontainer'>
    <div>
    <TextField variant="outlined" value={BookName} onChange={(e) => setBookName(e.target.value)}
      color='success' label='Book Name' type='text' className='booktextfield' placeholder="Book Name" /><br />

    <TextField variant="outlined" value={Imageurl} onChange={(e) => setImageurl(e.target.value)}
      color='success' label='Thumbnail Url'  className='booktextfield'type='text' placeholder="Image url" /><br />

    <TextField variant="outlined" value={Author} onChange={(e) => setAuthor(e.target.value)}
      color='success' label='Author' type='text' className='booktextfield' placeholder="Author Name" /><br />

    <TextField variant="outlined" value={Price} onChange={(e) => setPrice(e.target.value)}
      color='success' label='Price' type='text' className='booktextfield' placeholder="Price" /><br />

    <TextField variant="outlined" value={Language} onChange={(e) => setLanguage(e.target.value)}
      color='success' label='Language' type='text' className='booktextfield' placeholder="Language" /><br />
    </div>
    <div>
    <TextField variant="outlined" value={Publisher} onChange={(e) => setPublisher(e.target.value)}
      color='success' label='Publisher' type='text' className='booktextfield' placeholder="Publisher" /><br />

    <TextField variant="outlined" value={PublicationDate} onChange={(e) => setPublicationDate(e.target.value)}
      color='success' label='Publication Date' type='text' className='booktextfield' placeholder="Publication Date" /><br />

    <TextField variant="outlined" value={Rating} onChange={(e) => setRating(e.target.value)}
      color='success' label='Rating' type='text'  className='booktextfield'placeholder="Rating" /><br />

    <TextField variant="outlined" value={Description} onChange={(e) => setDescription(e.target.value)}
      color='success' label='Description' type='text'  multiline maxRows={5} className='booktextfield' placeholder="Description" /><br />
 
  <div className='updatecancelbutton'>
  <Button onClick={() => history.goBack()} color='success' variant='contained' className='cancel'>Cancel</Button>
  <Button onClick={() => updateBook(BookData)} color='success' variant='contained' >Update Book</Button>  </div>
    </div>
    
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

