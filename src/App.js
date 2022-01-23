import './App.css';
import {useState,useEffect} from 'react';


import success from './success.svg';
import confirm from './confirm.svg';
import{Switch,Link,Route,useHistory,Redirect} from "react-router-dom";

// MaterialUI
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Tooltip} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import { Login, Signup, ForgotPassword, UpdatePassword } from './UserAuth';
import { AdminOrderpage, Edit, GetAllUsers,AddBookData } from './AdminContent';
import { OrderBook, MyCart, MyOrders, Dashboard } from './User';
import { Home, NewArrivals, BooksCategory, FilterCategory, BookInfo } from './Books';

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AddBoxIcon from '@mui/icons-material/AddBox';
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


function Container()
{
  const[Email,setEmail]=useState('');
  const[user,setUser]=useState('');

  const value=localStorage.getItem('$condition');
  const usertype=localStorage.getItem('$user')
  const token=localStorage.getItem('$auth')
  let history=useHistory()
  
  // const [Auth,setAuth]=useState(value);
  // let obj={Email,setEmail,Auth,setAuth,user,setUser}


    return(
    <div className='container'>
        
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
          <Route exact path='/login'>{(!token)?<Login/>:<Redirect to='/'/>}</Route>
          <Route path='/signup'>{(!token)? <Signup/>:<Redirect to='/'/>}</Route>
          <Route path='/forgotpassword'>{(!token)? <ForgotPassword/>:<Redirect to='/'/>}</Route>
          <Route path='/updatepassword/:id'>{(!token)? <UpdatePassword/>:<Redirect to='/'/>}</Route>

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
          <Route exact path='/message'>{((token)&&(value))?<OrderSuccess/>:<Redirect to='/'/>}</Route>
          <Route path='/tverification'> <Confirmation/></Route>
          </>

         <>
          <Route exact path='/userorders'>{((usertype==='Admin')&&(token))?<AdminOrderpage/>:<Redirect to='/'/>}</Route>
          <Route exact path='/edit/:id'>{((usertype==='Admin')&&(token))?<Edit/>:<Redirect to='/'/>}</Route>
          <Route exact path='/addbooks'>{((usertype==='Admin')&&(token))?<AddBookData/>:<Redirect to='/'/>}</Route>
          <Route exact path='/userlist'>{((usertype==='Admin')&&(token))?<GetAllUsers/>:<Redirect to='/'/>}</Route>
          </>


          </>

          
          </Switch>
      
    </div>)
}


function NavigationBar()
{
  const user=localStorage.getItem('$user')
  const value=localStorage.getItem('$condition')
  const token=localStorage.getItem('$auth')
  const Name=localStorage.getItem('$name')
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
         <AppBar position="static" id='nav'>
        <Toolbar variant="regular">
        <Typography variant="h5" color="inherit" component="div"></Typography>
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
            <Button color='inherit' className='avatar'><Link className='link' to='/dashboard'>{Name}</Link></Button>
        <IconButton  onClick={handleClick}><AccountCircleIcon style={{fill:'white'}} /></IconButton>
        <Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={handleClose}
        MenuListProps={{'aria-labelledby': 'basic-button',}}>
          <MenuItem onClick={()=>{history.push('/dashboard');handleClose();}}>
            <ListItemIcon><PersonIcon/></ListItemIcon> My Profile</MenuItem>
           
          <MenuItem onClick={()=>{history.push('/myorders');handleClose();}}>
          <ListItemIcon><LibraryBooksIcon/></ListItemIcon>My Orders</MenuItem>
          
          <MenuItem onClick={()=>{history.push('/mycart');handleClose();}}>
          <ListItemIcon><ShoppingCartIcon/></ListItemIcon>My Cart</MenuItem>
          
          {(user==='Admin')&&<>
          
          <MenuItem onClick={()=>{history.push('/addbooks');handleClose();}}>
          <ListItemIcon><AddBoxIcon/></ListItemIcon>Add Books</MenuItem>

          <MenuItem onClick={()=>{history.push('/userorders');handleClose();}}>
          <ListItemIcon><LibraryBooksIcon/></ListItemIcon>Book Orders</MenuItem>
          
          <MenuItem onClick={()=>{history.push('/userlist');handleClose();}}>
          <ListItemIcon><PeopleIcon /></ListItemIcon>Customer List</MenuItem>

          </>}
          <MenuItem onClick={()=>{localStorage.clear();window.location.reload();}}>
          <ListItemIcon><LogoutIcon /></ListItemIcon>
            Log Out</MenuItem>
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













function Message({message})
{
  return (
  <div className='message'>
      <p>{message}</p>
  </div>)
}

function OrderSuccess() 
{
  let history=useHistory();
  useEffect(()=>setTimeout(() => {
    history.push('/myorders')
  },5000),[])

    return(<div className='success'>

      <img src={success} alt='message'/>
      <div>

      </div>
     <Typography variant="h2" color="inherit" component="div">
      <p>Order Confirmed </p> 
    </Typography>

    </div>)
}


function Confirmation() 
{
  let history=useHistory();
  useEffect(()=>setTimeout(() => {
    history.push('/login')
  },5000),[])

    return(<div className='confirm'>

      <img src={confirm} alt='message'/>
      <div>

     
     <Typography variant="h2" color="inherit" component="div">
      
      <p> Welcome to the Book Store</p> 
      
    </Typography>
    {/* <Typography variant="h4" color="inherit" component="div">Verification Completed</Typography> */}

    </div>
    </div>)
}






// function Books({data,visibility,showcount,getBooks,getCartData}) 
// {
//   const {BookName,Author,Description,Language,Publisher,Imageurl,Price,PublicationDate,Rating:rating,Available,_id}=data
//   const[CartResult,setCartResult]=useState('');
//   const [OrderResult,setOrderResult]=useState('');
//   const [DelStatus,SetDelStatus]=useState('')
//   const [DelCart,setDelCart]=useState('');

//   let history=useHistory();
//   const[count,setCount]=useState(1);
//   const token=localStorage.getItem('$auth')
//   const Email=localStorage.getItem('Email')
//   const user=localStorage.getItem('$user')
  
//   const Cart=()=>{
//       axios({
//           url:`${book_url}/addtocart/${_id}`,
//           method:'POST',
//           data:{Email},
//           headers: { 'x-auth-token':token }
//       }).then(response=>setCartResult(response.data))
//   }

//   const DeleteCartBook=(_id)=>{
//     axios(
//       {
//         url:`${book_url}/deletecart/${_id}`,
//         method:'DELETE',
//         data:{Email},
//         headers: { 'x-auth-token':token }
//       }).then(response=>setDelCart(response.data)).then(()=>getCartData())
//   }
//   console.log(DelCart,'delete');

  

//   const orderBook=(_id,total)=>{
//     axios(
//       {
//         url:`${book_url}/orderbooks/${_id}`,
//         method:'POST',
//         data:{Email,total},
//         headers: { 'x-auth-token':token }
//       }).then(response=>setOrderResult(response.data))
//   }
//   // Delete
//   const DeleteBook=(_id)=>{
//     axios(
//       {
//         url:`${book_url}/deletebook/${_id}`,
//         method:'DELETE',
//         headers: { 'x-auth-token':token }
//       }).then(response=>SetDelStatus(response.data)).then(()=> getBooks())
//   }
//   console.log(DelStatus,'delete');
//     const moreinfobutton={marginLeft:(!(token))?'10rem':0};
//   return (
//     <Card sx={{ maxWidth:450 }} className='card'>
      
//     <div className='thumbnailContainer'>
//     {/* <CardMedia
//           component="img"
//           height="350"
//           width='500'
//           image={Imageurl}
//           alt='bookThumbnail'
//         /> */}

//     <img src={Imageurl} className='bookThumbnail' alt='bookThumbnail'/>
//     </div>
//     <CardContent className='bookContent'>
    
//     <Typography gutterBottom variant="subtitle1" component="div">
//       <b className='bookName'>{BookName}</b>
//       <IconButton onClick={()=>history.push(`/bookinfo/${_id}`)} ><InfoIcon/></IconButton>
//       </Typography>

//       <Typography variant="body2" color="text.primary"variant="subtitle2">
//       <p className='detail'>Author : {Author}</p>
//       {/* <p>Rating : {Rating}</p> */}
//       {/* <Rating name="read-only" value={Rating} readOnly></Rating> */}
//       {/* <Stack> */}
//       <Rating name="half-rating-read" className='detail' defaultValue={rating} precision={0.5} readOnly />
//     {/* </Stack> */}
//       {(!showcount)&&<Typography variant="subtitle1"><b className='detail'>Price : Rs.{Price}</b></Typography>}
//       {(showcount)&&<p className='detail'>Price : Rs.{Price*count}</p>}
//       </Typography>
   
//       {(visibility&&token)&&<Button onClick={()=>Cart(_id)} variant='outlined'>Add to Cart</Button>}
//       {/* <Button onClick={()=>history.push(`/bookinfo/${_id}`)} style={moreinfobutton}>More Info</Button> */}

//       {/* {(!visibility&&!showcount)&&<Button onClick={()=>history.push(`/orderbook/${_id}`)}>Place Order</Button>} */}
      
//      {(!visibility&&!showcount)&& <div>
//       <Button onClick={()=>DeleteCartBook(_id)} color='error' variant='outlined' style={{marginRight:'0.75rem'}}>Remove Item</Button>
//       <Button onClick={()=>history.push(`/orderbook/${_id}`)}  color='warning' variant='contained'>Place Order</Button>
      
//       </div>}


//        {(visibility)&&(user==='Admin')?<div>
//          <IconButton onClick={()=>history.push(`/edit/${_id}`)}><EditIcon color='warning'/></IconButton>
//          <IconButton onClick={()=>DeleteBook(_id)}><DeleteIcon color='error'/></IconButton>
//        </div>:''} 

//       {(showcount)&&
//       <div>
//        {(Available<12 && Available>0)?<p>Hurry Up!!!  Only {Available} books left </p>:(!Available)&&<p>Books Sold Out</p>}
//        {(Available)&&<div>
//          <Button onClick={()=>orderBook(_id,count)}>Place Order</Button>
//       <div className='button Container'>
//         <Button onClick={()=>setCount(count+1)}>+</Button>
//           <b>{count}</b>
//         <Button onClick={()=>(count>1)&& setCount(count-1)}>-</Button> </div>
//         </div>}
//     </div>}


//     </CardContent>
    
//   </Card>)
// }
