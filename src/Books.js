import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useHistory, useParams } from "react-router-dom";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import Rating from '@mui/material/Rating';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import CircularProgress from '@mui/material/CircularProgress';
import { forwardRef } from "react";

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { book_url } from './App';





export function Home() {

  const [data, setData] = useState('');
  const token = localStorage.getItem('$auth');


  const getBooks = () => {
    axios(
      {
        url: `${book_url}/getbook`,
        method: 'GET',
        headers: { 'x-auth-token': token }
      }).then(response => setData(response.data));
  };
  useEffect(getBooks, [token]);

  return (
    <div className='booksContainer'>
      {(!data.length) ?<div><CircularProgress id='dataprogress'></CircularProgress></div>:
       data.map((books, i) => { return <div className='book' key={i}><Books data={books} getBooks={getBooks} /></div>; })}
    </div>);
}



function Books({ data,getBooks }) {
  const { BookName, Author, Imageurl, Price, Rating: rating, _id } = data;
  
  let history = useHistory();

  const token = localStorage.getItem('$auth');
  const Email = localStorage.getItem('Email');
  const user = localStorage.getItem('$user');

  const [Message,setMessage]=useState('');
  // Snack Bar Open/Close Status
  const [open, setOpen] = useState(false);
  const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  // Snack Bar Open/Close function
  const handleClick = () => { setOpen(true); };
  const handleClose = () => { setOpen(false); };


  const Cart = () => {
    axios({
      url: `${book_url}/addtocart/${_id}`,
      method: 'POST',
      data: { Email },
      headers: { 'x-auth-token': token }
    }).then(response => response.data).then(data=>setMessage({msg:data.Msg,result:'success'})) 
    .catch((error) => setMessage({ msg: error.response.data.Msg, result: 'warning' })).then(handleClick)
    
  };
  
  // Delete
  const DeleteBook = (_id) => {
    axios(
      {
        url: `${book_url}/deletebook/${_id}`,
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      }).then(response => response.data).then(data=>setMessage({msg:data.Msg,result:'success'}))
      .catch((error) => setMessage({ msg: error.response.data.Msg, result: 'warning' })).then(handleClick).then(() => getBooks());
  }
  return (<div>

    <Card sx={{ maxWidth: 450 }} className='card'>

      <div className='thumbnailContainer'>
        <img src={Imageurl} className='bookThumbnail' alt='bookThumbnail' />
      </div>

      <CardContent className='bookContent'>

        <Typography gutterBottom variant="subtitle1" component="div">
          <b className='bookName'>{BookName}</b>
          <IconButton onClick={() => history.push(`/bookinfo/${_id}`)}><InfoIcon /></IconButton>
        </Typography>

        <Typography  color="text.primary" variant="subtitle2">
          <p className='detail'>Author : {Author}</p>
          <Rating name="half-rating-read" className='detail' defaultValue={+rating} precision={0.5} readOnly />
          <Typography variant="subtitle1"><b className='detail'>Price : Rs.{Price}</b></Typography>
        </Typography>


        {((token) && (user === 'User')) && <Button onClick={() => Cart(_id)} className='addcartbutton' variant='outlined'>Add to Cart</Button>}


        {(token) && (user === 'Admin') ? <div className='moreaction'>
          <Button onClick={() => Cart(_id)} variant='outlined'>Add to Cart</Button>
          <IconButton onClick={() => history.push(`/edit/${_id}`)}><EditIcon color='warning' /></IconButton>
          <IconButton onClick={() => DeleteBook(_id)}><DeleteIcon color='error' /></IconButton>
        </div> : ''}

      </CardContent>

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




export function NewArrivals() {

  const [data, setData] = useState(null);
  const getBooks = () => {
    axios(
      {
        url: `${book_url}/getnewarrivals`,
        method: 'GET'
      }).then(response => setData(response.data));

  };
  // eslint-disable-next-line
  useEffect(getBooks, []);

  return (<div>
    <div className='heading'><Typography gutterBottom variant="h5" component="div" align="left">Upcoming Books</Typography></div>
    {(!data) ? <div><div><CircularProgress id='newarrivaldataprogress'></CircularProgress></div></div> :
      <div className='upcomingbooks'>
        {data.map((data, i) => {
          return (<Card key={i} sx={{ maxWidth: 450 }} className='card'>

            <div>
              <img src={data.Imageurl} alt='bookThumbnail' className='bookThumbnail' />
            </div>
            <div>
              <CardContent>
                <Typography gutterBottom variant="h6" component="div"><p>{data.BookName}</p> </Typography>
                <Typography  color="text.primary" variant="subtitle2">
                  <p>Author : {data.Author}</p>
                  <p>Price : Rs.{data.Price}</p>
                  <p>Language :{data.Language}</p>
                  <p>Publisher :{data.Publisher}</p>
                  <p>Publication Date :{data.PublicationDate}</p>
                </Typography>
              </CardContent>
            </div>

          </Card>);
        })}



      </div>}
  </div>);
}


function Category() {
  const [Genre, setGenre] = useState(null);
  const [Author, setAuthor] = useState(null);

  const getData = () => {
    axios({
      url: `${book_url}/get/Author`,
      method: 'GET',
    }).then(response => setAuthor(response.data));

    axios({
      url: `${book_url}/get/Genre`,
      method: 'GET',
    }).then(response => setGenre(response.data));
  };

  useEffect(getData, []);


  return (<div className='category'>
    <Typography variant="h5" align='center' component="div">Browse By Category</Typography><br /><br />

    <Typography  color="text.primary" variant="h6">Genre</Typography>

    {(Genre) && Genre.map((data, i) => {
      return <Link key={i} className='categorylink' to={`/category/${data}`}><p>{data}</p></Link>;
    })}
    <Typography  color="text.primary" variant="h6">Author</Typography>

    {(Author) && Author.map((data, i) => {
      return <Link key={i} to={`/category/${data}`} className='categorylink'><p>{data}</p></Link>;
    })}

  </div>);
}



export function BooksCategory() {

  const [data, setData] = useState('');
  const token = localStorage.getItem('$auth');


  const getBooks = () => {
    axios(
      {
        url: `${book_url}/getbook`,
        method: 'GET',
        headers: { 'x-auth-token': token }
      }).then(response => setData(response.data));
  };
  useEffect(getBooks, [token]);

  return (
    <div className='home'>
      <div><Category /></div>
      <div className='CategorybooksContainer'>
        {(!data.length) ? <div><CircularProgress id='categorydataprogress'></CircularProgress></div>: data.map((books, i) => { return <div className='book' key={i}><Books data={books} getBooks={getBooks} visibility={true} />   </div>; })}
      </div>
    </div>);
}




export function FilterCategory() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  
  const [Url, setUrl] = useState('');

  const urlchange = () => {
    if ((id === 'Fantasy') || (id === 'Fiction') || (id === 'Science') || (id === 'Comics') || (id === 'Engineering') || (id==='Romance') ||(id==='Poetry')) {
      setUrl(`getbooksbygenre?genre=${id}`);
    }

    else {
      setUrl(`getbooksbyauthor?name=${id}`);
    }
  };
  useEffect(urlchange, [id]);

  const getBooks = () => {
    axios(
      {
        url: `${book_url}/${Url}`,
        method: 'GET',
      }).then(response => setData(response.data));

  };
  useEffect(getBooks, [Url]);

  return (<div className='home'>
    <div><Category /></div>
    <div className='CategorybooksContainer'>
      {(!data.length) ? <div><CircularProgress id='categorydataprogress'></CircularProgress></div>
       : data.map((books, i) => { return <div className='book' key={i}><Books data={books} visibility={true} />   </div>; })}
    </div>
  </div>);
}



// Books Info Individual
export function BookInfo() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  
  const getBooks = () => {
    axios(
      {
        url: `${book_url}/getbook/${id}`,
        method: 'GET',
      }).then(response => setData(response.data));
  };
  useEffect(getBooks, [id]);
  return (<div>
    {!(data) ? <div><CircularProgress id='newarrivaldataprogress'></CircularProgress></div> : <IndividualBookData data={data} />}
  </div>);
}
function IndividualBookData({ data }) {
  var { BookName, Author, Description, Language, Publisher, Imageurl, Price, PublicationDate, Rating: rating } = data;
  return (
    <Card style={{ height: '100vh' }}>
      <div className='individualbook'>
        <div>
          <img src={Imageurl} alt='bookThumbnail' />
        </div>
        <CardContent className='bookdetails'>
          <Typography variant="h5" align='center' component="div">
            <p>{BookName}</p>
          </Typography>
          <p><b>Author</b> : {Author}</p>
          <Typography><b>Description</b> :{Description}</Typography>
          <Stack>
            <Rating name="half-rating-read" defaultValue={+rating} precision={0.5} readOnly />
          </Stack>
          <p><b>Price</b> : Rs.{Price}</p>
          <p><b>Language</b> :{Language}</p>
          <p><b>Publisher</b> :{Publisher}</p>
          <p><b>Publication Date</b> : {PublicationDate}</p>
        </CardContent>
      </div>
    </Card>
  );
}
