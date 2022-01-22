import './App.css';
import {useState,createContext,useEffect} from 'react';
import axios from 'axios';

import { useFormik } from 'formik';
import * as yup from 'yup';

import{Switch,Link,Route,useHistory,useParams,Redirect} from "react-router-dom";

// MaterialUI
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Tooltip} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import TextField from '@mui/material/TextField';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Divider from '@mui/material/Divider';
import Rating from '@mui/material/Rating';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import { Login, Signup, ForgotPassword, UpdatePassword } from './UserAuth';
import { AdminOrderpage, Edit, GetAllUsers } from './AdminContent';

// import Drawer from "@mui/material/Drawer";
// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import ListItemIcon from "@mui/material/ListItemIcon";
// import ListItemText from "@mui/material/ListItemText";
// import GroupIcon from '@mui/icons-material/Group';
// import AddReactionIcon from '@mui/icons-material/AddReaction';
// import InfoIcon from '@mui/icons-material/Info';
// import SettingsIcon from '@mui/icons-material/Settings';



export default function App() {
  return (
    <div className="App">
      <Container/>
    </div>
  );
}

export const user_url=`http://localhost:1000/user`
export const book_url=`http://localhost:1000/data`
export const context=createContext(''); 

function Container()
{
  const[Email,setEmail]=useState('');
  const[user,setUser]=useState('');

  const value=localStorage.getItem('$condition');
  const usertype=localStorage.getItem('$user')
  const token=localStorage.getItem('$auth')
  let history=useHistory()
  
  const [Auth,setAuth]=useState(value);
  let obj={Email,setEmail,Auth,setAuth,user,setUser}


    return(
    <div className='container'>
        <context.Provider value={obj}>
          <Switch>
           {/* {(!value)&&<> */}
          {/* <Route exact path='/login'><Login/></Route>
          <Route path='/signup'> <Signup/></Route>
          <Route path='/forgotpassword'> <ForgotPassword/></Route>
          <Route path='/updatepassword/:id'> <UpdatePassword/></Route> */}
          {/* </>} */}
         
          {/* <Route exact path='/dashboard'>{(value&&localStorage.getItem('$auth'))?<Dashboard/>:<Redirect to='/'/>}</Route> */}

          <>
          <NavigationBar/>
          <Route exact path='/login'><Login/></Route>
          <Route path='/signup'> <Signup/></Route>
          <Route path='/forgotpassword'> <ForgotPassword/></Route>
          <Route path='/updatepassword/:id'> <UpdatePassword/></Route>

          <Route exact path='/'><Home/></Route>
          <Route exact path='/newarrivals'><NewArrivals/></Route>
          <Route exact path='/filter'><BooksCategory/></Route>
          <Route exact path='/category/:id'><FilterCategory/></Route>
          <Route exact path='/bookinfo/:id'><BookInfo/></Route>

         {/* {(token&&value&&usertype)&&<>
          <Route exact path='/orderbook/:id'><OrderBook/></Route>
          <Route exact path='/mycart'><MyCart/></Route>
          <Route exact path='/myorders'><MyOrders/></Route>
          <Route exact path='/dashboard'><Dashboard/></Route>
          </>} */}
           <>
          <Route exact path='/orderbook/:id'>{((token)&&(value))?<OrderBook/>:<Redirect to='/'/>}</Route>
          <Route exact path='/mycart'>{((token)&&(value))?<MyCart/>:<Redirect to='/'/>}</Route>
          <Route exact path='/myorders'>{((token)&&(value))?<MyOrders/>:<Redirect to='/'/>}</Route>
          <Route exact path='/dashboard'>{((token)&&(value))?<Dashboard/>:<Redirect to='/'/>}</Route>
          </>

         <>
          <Route exact path='/userorders'>{((usertype==='Admin')&&(token))?<AdminOrderpage/>:<Redirect to='/'/>}</Route>
          <Route exact path='/edit/:id'>{((usertype==='Admin')&&(token))?<Edit/>:<Redirect to='/'/>}</Route>
          <Route exact path='/userlist'>{((usertype==='Admin')&&(token))?<GetAllUsers/>:<Redirect to='/'/>}</Route>
          </>


          </>

          <Route path='/tverification'> <Message message='Two Step Verification Completed'/></Route>
          </Switch>
      </context.Provider>
    </div>)
}


function NavigationBar()
{
  const user=localStorage.getItem('$user')
  const value=localStorage.getItem('$condition')
  const token=localStorage.getItem('$auth')
  let history=useHistory();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


    return(<div className='navbar'>
         <Box sx={{ flexGrow: 1 }}>
         <AppBar position="static" id='nav' color='error' style={{backgroundColor:'#232f3e'}}>
        <Toolbar variant="dense">
        <Typography variant="h6" color="inherit" component="div"></Typography>
        <Button color='inherit'><Link className='link' to='/'>Home</Link></Button>
        <Button color='inherit'><Link className='link' to='/newarrivals'>New Arrivals</Link></Button>
        <Button color='inherit'><Link className='link' to='/filter'>Categories</Link></Button>
        {/* {(token&&value)?<>
        <Button color='inherit'><Link className='link' to='/mycart'>My Cart</Link></Button>
        <Button color='inherit'><Link className='link' to='/myorders'>My Orders</Link></Button>
        <Button color='inherit'><Link className='link' to='/dashboard'>Profile</Link></Button>
        </>:''} */}

           {/* Avatar */}
           {(token&&value)?<>
        <IconButton className='avatar' onClick={handleClick}><AccountCircleIcon style={{fill:'white'}} /></IconButton>
        <Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={handleClose}
        MenuListProps={{'aria-labelledby': 'basic-button',}}>
          <MenuItem onClick={()=>{history.push('/dashboard');handleClose();}}>My Profile</MenuItem>
          <Divider />
          <MenuItem onClick={()=>{history.push('/myorders');handleClose();}}>My Orders</MenuItem>
          <Divider />
          <MenuItem onClick={()=>{history.push('/mycart');handleClose();}}>My Cart</MenuItem>
          <Divider />
          {(user==='Admin')&&<>
          <MenuItem onClick={()=>{history.push('/userorders');handleClose();}}>Book Orders</MenuItem>
          <Divider />
          <MenuItem onClick={()=>{history.push('/userlist');handleClose();}}>Customer List</MenuItem>
          <Divider />
          </>}
          <MenuItem onClick={()=>{localStorage.clear();window.location.reload();}}>Log Out</MenuItem>
        </Menu></>:''}



        {(!token)&&<Link  className='link' id='signin-nav' to='/login'><Button color='inherit'>Sign In</Button></Link>}
        {/* {(token)&&<Button color='inherit' onClick={()=>{localStorage.clear();window.location.reload();}}><Link className='link' to='/'>Log Out</Link></Button>} */}
        
        {/* {(user==='Admin')&&<Button color='inherit'><Link className='link' to='/userorders'>Orders</Link></Button>} */}
        {/* {(user==='Admin')&&<Button color='inherit'><Link className='link' to='/userlist'>Customers</Link></Button>} */}
        </Toolbar>
        </AppBar>
        </Box>
    </div>)  
}


function Home()
{

  const[data,setData]=useState('')
  const token=localStorage.getItem('$auth')
  
  
  const getBooks=()=>{
        axios(
        {
            url:`${book_url}/getbook`,
            method:'GET',
            headers: { 'x-auth-token':token }
        }).then(response=>setData(response.data))
  }
  useEffect(getBooks,[])


  if(data)
  {
    console.log(data);
    
  }

  return(
    <div className='booksContainer'>
    {(!data.length)?<p>Loading</p>:data.map((books,i)=>{return <div className='book' key={i}><Books data={books}  getBooks={getBooks} visibility={true}/>   </div>})}
    </div>)
}


function MyCart()
{
  const [data,setData]=useState('');
  const Email=localStorage.getItem('Email')
  const token=localStorage.getItem('$auth')
  
  const getCartData=()=>{
    axios(
      {
        url:`${book_url}/getcartdata`,
        method:'POST',
        data:{Email},
        headers: { 'x-auth-token':token }
      }).then(response=>setData(response.data.OrderedBooks))
  }
  useEffect(getCartData,[Email])
  return(<div><Typography variant="h4" align='left' component="div">My Cart</Typography> 
  <div className='mycart'>
    {((!data)||!(data.length))?<p>Cart Empty</p>:data.map((data,i)=>{ return <div className='cartbook' key={i}> <CartBooks data={data} getCartData={getCartData} visibility={false}/></div>})}
  </div>
  </div>)
}


function CartBooks({data,getCartData})
{
  const [DelCart,setDelCart]=useState('');
  let history=useHistory();
  const token=localStorage.getItem('$auth')
  const Email=localStorage.getItem('Email')
  const {BookName,Author,Imageurl,Price,Rating:rating,_id}=data

  const DeleteCartBook=(_id)=>{
    axios(
      {
        url:`${book_url}/deletecart/${_id}`,
        method:'DELETE',
        data:{Email},
        headers: { 'x-auth-token':token }
      }).then(response=>setDelCart(response.data)).then(()=>getCartData())
  }
  console.log(DelCart,'delete');
return (
  <Card sx={{ maxWidth:800 }} className='CartBook'>
    <div className='cartcontainer'>

  <div className='thumbnailContainer'>
  <img src={Imageurl} className='bookThumbnail' alt='bookThumbnail'/>
  </div>
  <CardContent className='bookContent'>
  
  <Typography gutterBottom variant="subtitle1" component="div">
    <b className='bookName'>{BookName}</b>
    <IconButton onClick={()=>history.push(`/bookinfo/${_id}`)} ><InfoIcon/></IconButton>
    </Typography>

    <Typography variant="body2" color="text.primary"variant="subtitle2">
    <p className='detail'>Author : {Author}</p>
    <Rating name="half-rating-read" className='detail' defaultValue={rating} precision={0.5} readOnly />
    <p className='detail'>Price : Rs.{Price}</p>
    </Typography>

    <Button onClick={()=>DeleteCartBook(_id)} color='error' variant='outlined' style={{marginRight:'0.75rem'}}>Remove Item</Button>
    <Button onClick={()=>history.push(`/orderbook/${_id}`)}  color='warning' variant='contained'>Place Order</Button>
  </CardContent>
  </div>
</Card>)
}

function OrderBook()
{
    const {id}=useParams()
    const [data,setData]=useState(null) ;
  const token=localStorage.getItem('$auth')

  const getBooks=()=>{
    axios(
    {
        url:`${book_url}/getbook/${id}`,
        method:'GET',
        headers: { 'x-auth-token':token }
    }).then(response=>setData(response.data))
    }
    useEffect(getBooks,[id])
    console.log(data,'orderbook');
    return(<div className='Orderbookcontainer'>
      {!(data)?<div>Loading</div>:<PlaceOrder data={data} showcount={true}/>}
    </div>)  
}

function PlaceOrder({data})
{
  const [OrderResult,setOrderResult]=useState('');
  const {BookName,Author,Imageurl,Price,Rating:rating,Available,_id}=data
  let history=useHistory();
  const[count,setCount]=useState(1);
  const token=localStorage.getItem('$auth')
  const Email=localStorage.getItem('Email')

  const orderBook=(_id,total)=>{
    axios(
      {
        url:`${book_url}/orderbooks/${_id}`,
        method:'POST',
        data:{Email,total},
        headers: { 'x-auth-token':token }
      }).then(response=>setOrderResult(response.data))
  }
  return (
    <Card sx={{ maxWidth:800 }} >
      <div className='ordercontainer'>
    <div className='thumbnailContainer'>
    <img src={Imageurl} className='bookThumbnail' alt='bookThumbnail'/>
    </div>
    <CardContent className='bookContent'>
    
      <Typography gutterBottom variant="subtitle1" component="div">
      <b className='bookName'>{BookName}</b>
      <IconButton onClick={()=>history.push(`/bookinfo/${_id}`)} ><InfoIcon/></IconButton>
      </Typography>

      <Typography  color="text.primary"variant="subtitle2">
      <p className='detail'>Author : {Author}</p>
      <Rating name="half-rating-read" className='detail' defaultValue={rating} precision={0.5} readOnly />
      <p className='detail'>Total : {count} Nos</p>
       <Typography variant="subtitle1" className='detail'><b>Price : Rs.{Price*count}</b></Typography>
      </Typography>

      <div>
       {(Available<12 && Available>0)?<p className='bookleftalert'>Hurry Up!!!  Only {Available} books left </p>:(!Available)&&<p className='bookleftalert'>Books Sold Out</p>}

       {(Available)&&
       <div className='buttonContainer'>
         

      <div className='addbook' >
        <Button onClick={()=>setCount(count+1)}variant='outlined'>+</Button>
          <Typography>{count}</Typography>
        <Button onClick={()=>(count>1)&& setCount(count-1)}  variant='outlined'>-</Button> </div>

        <Button onClick={()=>orderBook(_id,count)} variant='contained' color='warning' >Place Order</Button>

        </div>}

    </div>
    </CardContent>
    </div>
  </Card>)
}





function Books({data,visibility,showcount,getBooks,getCartData}) 
{
  const {BookName,Author,Description,Language,Publisher,Imageurl,Price,PublicationDate,Rating:rating,Available,_id}=data
  const[CartResult,setCartResult]=useState('');
  const [OrderResult,setOrderResult]=useState('');
  const [DelStatus,SetDelStatus]=useState('')
  const [DelCart,setDelCart]=useState('');

  let history=useHistory();
  const[count,setCount]=useState(1);
  const token=localStorage.getItem('$auth')
  const Email=localStorage.getItem('Email')
  const user=localStorage.getItem('$user')
  
  const Cart=()=>{
      axios({
          url:`${book_url}/addtocart/${_id}`,
          method:'POST',
          data:{Email},
          headers: { 'x-auth-token':token }
      }).then(response=>setCartResult(response.data))
  }

  const DeleteCartBook=(_id)=>{
    axios(
      {
        url:`${book_url}/deletecart/${_id}`,
        method:'DELETE',
        data:{Email},
        headers: { 'x-auth-token':token }
      }).then(response=>setDelCart(response.data)).then(()=>getCartData())
  }
  console.log(DelCart,'delete');

  

  const orderBook=(_id,total)=>{
    axios(
      {
        url:`${book_url}/orderbooks/${_id}`,
        method:'POST',
        data:{Email,total},
        headers: { 'x-auth-token':token }
      }).then(response=>setOrderResult(response.data))
  }
  // Delete
  const DeleteBook=(_id)=>{
    axios(
      {
        url:`${book_url}/deletebook/${_id}`,
        method:'DELETE',
        headers: { 'x-auth-token':token }
      }).then(response=>SetDelStatus(response.data)).then(()=> getBooks())
  }
  console.log(DelStatus,'delete');
    const moreinfobutton={marginLeft:(!(token))?'10rem':0};
  return (
    <Card sx={{ maxWidth:450 }} className='card'>
      
    <div className='thumbnailContainer'>
    {/* <CardMedia
          component="img"
          height="350"
          width='500'
          image={Imageurl}
          alt='bookThumbnail'
        /> */}

    <img src={Imageurl} className='bookThumbnail' alt='bookThumbnail'/>
    </div>
    <CardContent className='bookContent'>
    
    <Typography gutterBottom variant="subtitle1" component="div">
      <b className='bookName'>{BookName}</b>
      <IconButton onClick={()=>history.push(`/bookinfo/${_id}`)} ><InfoIcon/></IconButton>
      </Typography>

      <Typography variant="body2" color="text.primary"variant="subtitle2">
      <p className='detail'>Author : {Author}</p>
      {/* <p>Rating : {Rating}</p> */}
      {/* <Rating name="read-only" value={Rating} readOnly></Rating> */}
      {/* <Stack> */}
      <Rating name="half-rating-read" className='detail' defaultValue={rating} precision={0.5} readOnly />
    {/* </Stack> */}
      {(!showcount)&&<Typography variant="subtitle1"><b className='detail'>Price : Rs.{Price}</b></Typography>}
      {(showcount)&&<p className='detail'>Price : Rs.{Price*count}</p>}
      </Typography>
   
      {(visibility&&token)&&<Button onClick={()=>Cart(_id)} variant='outlined'>Add to Cart</Button>}
      {/* <Button onClick={()=>history.push(`/bookinfo/${_id}`)} style={moreinfobutton}>More Info</Button> */}

      {/* {(!visibility&&!showcount)&&<Button onClick={()=>history.push(`/orderbook/${_id}`)}>Place Order</Button>} */}
      
     {(!visibility&&!showcount)&& <div>
      <Button onClick={()=>DeleteCartBook(_id)} color='error' variant='outlined' style={{marginRight:'0.75rem'}}>Remove Item</Button>
      <Button onClick={()=>history.push(`/orderbook/${_id}`)}  color='warning' variant='contained'>Place Order</Button>
      
      </div>}


       {(visibility)&&(user==='Admin')?<div>
         <IconButton onClick={()=>history.push(`/edit/${_id}`)}><EditIcon color='warning'/></IconButton>
         <IconButton onClick={()=>DeleteBook(_id)}><DeleteIcon color='error'/></IconButton>
       </div>:''} 

      {(showcount)&&
      <div>
       {(Available<12 && Available>0)?<p>Hurry Up!!!  Only {Available} books left </p>:(!Available)&&<p>Books Sold Out</p>}
       {(Available)&&<div>
         <Button onClick={()=>orderBook(_id,count)}>Place Order</Button>
      <div className='button Container'>
        <Button onClick={()=>setCount(count+1)}>+</Button>
          <b>{count}</b>
        <Button onClick={()=>(count>1)&& setCount(count-1)}>-</Button> </div>
        </div>}
    </div>}


    </CardContent>
    
  </Card>)
}

function Category()
{
    // let Genre=['Fantasy','Fiction','Science','Comics','Engineering'];
    // let Author=['J.K. Rowling','Andrzej Sapkowski','Danusia Stok','Masashi Kishimoto'];

    const [Genre,setGenre]=useState(null)
    const [Author,setAuthor]=useState(null)

    const getData=()=>{
        axios({
          url:`${book_url}/get/Author`,
          method:'GET',
        }).then(response=>setAuthor(response.data))
        
        axios({
          url:`${book_url}/get/Genre`,
          method:'GET',
        }).then(response=>setGenre(response.data))
    }

    useEffect(getData,[])


    return(<div className='category'>
        <Typography  variant="h5" align='center' component="div">Browse By Category</Typography><br/><br/>
        <Typography variant="body2" color="text.primary"variant="h6" >Genre</Typography>
        {(Genre)&&Genre.map((data,i)=>{
          return <Link key={i} className='categorylink' to={`/category/${data}`}><p>{data}</p></Link>
        })}
        <Typography  variant="body2" color="text.primary"variant="h6" >Author</Typography>
        {(Author)&&Author.map((data,i)=>{
          return <Link key={i} to={`/category/${data}`}className='categorylink'><p>{data}</p></Link>
        })}

    </div>)
}

function BooksCategory()
{

  const[data,setData]=useState('')
  const token=localStorage.getItem('$auth')
  
  
  const getBooks=()=>{
        axios(
        {
            url:`${book_url}/getbook`,
            method:'GET',
            headers: { 'x-auth-token':token }
        }).then(response=>setData(response.data))
  }
  useEffect(getBooks,[])


  if(data)
  {
    console.log(data);
    
  }

  return(
  <div className='home'>
    <div ><Category/></div>
    <div className='CategorybooksContainer'>
    {(!data.length)?<p>Loading</p>:data.map((books,i)=>{return <div className='book' key={i}><Books data={books}  getBooks={getBooks} visibility={true}/>   </div>})}
    </div>
  </div>)
}


function FilterCategory() 
{
    const {id}=useParams()
    const [data,setData]=useState([]) ;
    const token=localStorage.getItem('$auth')
    const [Url,setUrl]=useState('')

    const urlchange=()=>
    {
    if((id==='Fantasy')||(id==='Fiction')||(id==='Science')||(id==='Comics')||(id==='Engineering'))
    {
        setUrl(`getbooksbygenre?genre=${id}`)
    }
    else
    {
    setUrl(`getbooksbyauthor?name=${id}`)
    }
  }
    useEffect(urlchange,[id])
    
  const getBooks=()=>{
    axios(
    {
        url:`${book_url}/${Url}`,
        method:'GET',
        headers: { 'x-auth-token':token }
    }).then(response=>setData(response.data))

}
useEffect(getBooks,[Url])

  return (<div className='home'>
  <div ><Category/></div>
  <div className='CategorybooksContainer'>
  {(!data.length)?<p>Loading</p>:data.map((books,i)=>{return <div className='book' key={i}><Books data={books} visibility={true}/>   </div>})}
  </div>
</div>)
}



// Books Info Individual
function BookInfo()
{
  const {id}=useParams();
  const [data,setData]=useState(null) ;
  const token=localStorage.getItem('$auth')

  const getBooks=()=>{
    axios(
    {
        url:`${book_url}/getbook/${id}`,
        method:'GET',
        headers: { 'x-auth-token':token }
    }).then(response=>setData(response.data))
    }
    useEffect(getBooks,[id])
    return(<div>
      {!(data)?<div>Loading</div>:<IndividualBookData data={data}/>}
    </div>)
}


function IndividualBookData({data})
{
  var {BookName,Author,Description,Language,Publisher,Imageurl,Price,PublicationDate,Rating:rating,_id}=data
    return(
                 <Card style={{height:'100vh'}}>
                  <div className='individualbook'>
                  <div>
                  <img src={Imageurl} alt='bookThumbnail'/>
                  </div>
                  <CardContent className='bookdetails'>
                  <Typography  variant="h5" align='center' component="div">
                  <p>{BookName}</p>
                  </Typography>
                  <p><b>Author</b> : {Author}</p>
                  <Typography><b>Description</b> :{Description}</Typography>
                  {/* <p><b>Rating</b> : {Rating}</p> */}
                  <Stack>
                  <Rating name="half-rating-read" defaultValue={rating} precision={0.5} readOnly />
                  </Stack>
                  <p><b>Price</b> : Rs.{Price}</p>
                  <p><b>Language</b> :{Language}</p>
                  <p><b>Publisher</b> :{Publisher}</p>
                  <p><b>Publication Date</b> : {PublicationDate}</p>
                  </CardContent>
                  </div>
         </Card>
         )
}















// function Counter()
// {
//     const[count,setCount]=useState(0);
//     return(
//      <div className='button Container'>
//         <Button onClick={()=>setCount(count+1)}>+</Button>
//           <b>{count}</b>
//         <Button onClick={()=>(count!==0)&& setCount(count-1)}>-</Button>
//     </div>)
// }


function MyOrders() 
{
    const[data,setData]=useState(null);
    const token=localStorage.getItem('$auth')
    const Email=localStorage.getItem('Email')
      
  const getOrderData=()=>{
    axios(
      {
        url:`${book_url}/getorderbooks`,
        method:'POST',
        data:{Email},
        headers: { 'x-auth-token':token }
      }).then(response=>setData(response.data.OrderedBooks))
  }
  useEffect(getOrderData,[Email])
console.log(data);
  return(<div className='orders'>
    <Typography gutterBottom variant="h5" component="div"align="left">My Orders</Typography>
      {!(data)?<div>Books Not yet ordered</div>:
      
      <div className='orderbooklist'>
      {data.map((data,i)=>{return(<div key={i}><GetOrderBooks data={data}/> </div>)})}
      </div>}
  </div>)
}



function GetOrderBooks({data})
{
    const{BookName,Author,Imageurl,Price,total,Rating,ExpectedDelivery,_id}=data  
    let history=useHistory()
    return (<Card sx={{ maxWidth:800 }}>
      <div className='orderedbooklist'>
      
<div className='thumbnailContainer'>
    <img src={Imageurl} className='bookThumbnail' alt='bookThumbnail'/>
    </div>
    <CardContent>
    <div className='bookContent'>
    <Typography gutterBottom variant="h5" component="div" className='bookName'>{BookName}
    <IconButton onClick={()=>history.push(`/bookinfo/${_id}`)} ><InfoIcon/></IconButton></Typography>
    <Typography  color="text.primary"variant="subtitle2">
      <p>Author : {Author}</p>
      <p>Rating : {Rating}</p>
      <p>Total  : {total} Nos</p>
    <Typography  color="text.primary"variant="subtitle1"> <b>Price  : Rs.{Price}</b></Typography>
      
      <p>Expected Delivery : {ExpectedDelivery} </p></Typography>
  </div></CardContent>
  </div>
    </Card>)
}









function NewArrivals()
{
  
  const[data,setData]=useState(null)
  const getBooks=()=>{
    axios(
    {
        url:`${book_url}/getnewarrivals`,
        method:'GET'
    }).then(response=>setData(response.data))
    
console.log(data);
}
useEffect(getBooks,[])

    return (<div>
              <Typography gutterBottom variant="h5" component="div"align="left">Upcoming Books</Typography>
      {(!data)?<div>...Loading</div>:
      <div className='upcomingbooks'>
        {data.map((data,i)=>{return(<Card key={i} sx={{ maxWidth:450 }} className='card'>
        
          <div >
                  <img src={data.Imageurl} alt='bookThumbnail' className='bookThumbnail'/>
                  </div>
                  <div >
                  <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                  <p>{data.BookName}</p>
                  </Typography>
                  <Typography variant="body2" color="text.primary"variant="subtitle2">
                  <p>Author : {data.Author}</p>
                  <p>Price : Rs.{data.Price}</p>
                  <p>Language :{data.Language}</p>
                  <p>Publisher :{data.Publisher}</p>
                  <p>Publication Date :{data.PublicationDate}</p>
                  </Typography>
                  </CardContent>
                  </div>
          
            </Card>)})}
        
        
        
        </div>}
    </div>)
}
 



function Dashboard()
{
  const[data,setData]=useState(null);
  const token=localStorage.getItem('$auth')
  const Email=localStorage.getItem('Email')

  const getData=()=>{
    axios({
      url:`${user_url}/getuser`,
      method:'POST',
      data:{Email},
      headers: { 'x-auth-token':token }
    }).then(response=>setData(response.data))
  }

  useEffect(getData,[Email])
  console.log(data);
  // if(data)
  // {
  //   const{FirstName,LastName,Email,Mobile,Address,Status}=data
  // }


  return (
  <div className='dashboard'>
    {!(data)?<div>Loading</div>:
      <div className='profile'><UpdateProfile data={data}/></div>}
  </div>)
}



function UpdateProfile({data})
{
  const token=localStorage.getItem('$auth')
  const{FirstName:fname,LastName:lname,Email,Mobile:phone,Address:addr}=data
  let history=useHistory()

  const[FirstName,setFirstName]=useState(fname);
  const[LastName,setLastName]=useState(lname);
  const[Address,setAddress]=useState(addr);
  const[Mobile,setMobile]=useState(phone);
  const userData={FirstName,LastName,Address,Mobile,Email}

  const update=(userData)=>{
    axios({
        url:`${user_url}/profileupdate`,
        method:'PUT',
        data:userData,
        headers: { 'x-auth-token':token }
    })
  }
  
  return(<div className='profiletextfieldcontainer'>
    
    <TextField variant="outlined"  value={FirstName} onChange={(e)=>setFirstName(e.target.value)}
     color='success' label='FirstName' type='text'className='profiletextfield'  placeholder="FirstName" /><br/>
     
     <TextField variant="outlined"  value={LastName} onChange={(e)=>setLastName(e.target.value)}
     color='success' label='LastName' type='text'className='profiletextfield'  placeholder="LastName" /><br/>
     
      <TextField variant="outlined"  value={Email} readOnly
     color='success' label='Email' type='text'className='profiletextfield'  placeholder="Email" /><br/>
     
      <TextField variant="outlined"  value={Address} onChange={(e)=>setAddress(e.target.value)} multiline maxRows={2}
     color='success' label='Address' type='text' className='profiletextfield' placeholder="Address" /><br/>

      <TextField variant="outlined"  value={Mobile}  multiline maxRows={5} onChange={(e)=>setMobile(e.target.value)}
     color='success' label='Mobile' type='text' className='profiletextfield' placeholder="Mobile" /><br/>


    <Button onClick={()=>update(userData)} className='profiletextfield' variant='contained'>Update</Button><br/>
    <Button onClick={() => history.push('/')} className='profiletextfield' color='success' variant='contained' >Cancel</Button>
  </div>)
}



function Message({message})
{
  return (
  <div className='message'>
      <p>{message}</p>
  </div>)
}
