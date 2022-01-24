import './App.css';
import {useState,useEffect,forwardRef} from 'react';
import{Switch,Link,Route,useHistory,Redirect} from "react-router-dom";

// MaterialUI
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AddBoxIcon from '@mui/icons-material/AddBox';


import { Login, Signup, ForgotPassword, UpdatePassword } from './UserAuth';
import { AdminOrderpage, Edit, GetAllUsers,AddBookData } from './AdminContent';
import { OrderBook, MyCart, MyOrders, Dashboard } from './User';
import { Home, NewArrivals, BooksCategory, FilterCategory, BookInfo } from './Books';
import success from './success.svg';
import confirm from './confirm.svg';




export default function App() {
  return (
    <div className="App">
      <Container/>
    </div>
  );
}
// local
// export const user_url=`http://localhost:1000/user`
// export const book_url=`http://localhost:1000/data`

export const user_url=`https://bookstore--application.herokuapp.com/user`
export const book_url=`https://bookstore--application.herokuapp.com/data`


function Container()
{

  const value=localStorage.getItem('$condition');
  const usertype=localStorage.getItem('$user')
  const token=localStorage.getItem('$auth')

    return(
    <div className='container'>
        
          <Switch>
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
        </Toolbar>
        </AppBar>
        </Box>
    </div>)  
}




function OrderSuccess() 
{
  let history=useHistory();
    return(<div className='success'>

      <img src={success} alt='message'/>
      <div>     
     <Typography variant="h2" color="inherit" component="div">
      <p>Order Confirmed </p> 
      </Typography>
      <div className='confirmpagebutton'>
      <Button variant='contained' color='primary' onClick={()=>history.push('/myorders')} >Track Order</Button>
      <Button variant='contained' color='warning' onClick={()=>history.push('/')}>Continue Shopping</Button>
      </div>
      </div>
      </div>)
}


function Confirmation() 
{
  const [Message,]=useState({msg:'Verification Completed',result:'success'});
  // Snack Bar Open/Close Status
  const [open, setOpen] = useState(false);
  const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  // Snack Bar Open/Close function
  const handleClick = () => { setOpen(true); };
  const handleClose = () => { setOpen(false); };

  useEffect(handleClick,[Message])

    return(
      <div className='confirm'>

      <img src={confirm} alt='message'/>
      <div>

     
     <Typography variant="h2" color="inherit" component="div">
      
      <p> Welcome to the Book Store</p> 
      
    </Typography>
        
     {/* Snack Bar */}
     <Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
          <Alert severity={Message.result} sx={{ width: '100%' }}>
            {Message.msg}
          </Alert>
        </Snackbar>
      </Stack>    
    </div>
    </div>)
}





