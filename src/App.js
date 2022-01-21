import './App.css';
import {useState,createContext,useContext,useEffect} from 'react';
import axios from 'axios';

import { useFormik } from 'formik';
import * as yup from 'yup';

import{Switch,Link,Route,useHistory,useParams,Redirect} from "react-router-dom";

// MaterialUI
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from '@mui/material/Button';

import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Tooltip} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import TextField from '@mui/material/TextField';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

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
          <Route exact path='/login'><Login/></Route>
          <Route path='/signup'> <Signup/></Route>
          <Route path='/forgotpassword'> <ForgotPassword/></Route>
          <Route path='/updatepassword/:id'> <UpdatePassword/></Route>
          {/* </>} */}
         
          {/* <Route exact path='/dashboard'>{(value&&localStorage.getItem('$auth'))?<Dashboard/>:<Redirect to='/'/>}</Route> */}

          <>
          <NavigationBar/>
          <Route exact path='/'><Home/></Route>
          <Route exact path='/newarrivals'><NewArrivals/></Route>
          <Route exact path='/category/:id'><BookCategory/></Route>
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


function Signup()
{

  let history=useHistory();
  const[FirstName,setFirstName]=useState('');
  const[LastName,setLastName]=useState('');
  const[Email,setEmail]=useState('');
  const[Password,setPassword]=useState('');

  const newUser={FirstName,LastName,Email,Password};

  const signUp = async (newUser) => {
    axios(
    {
        url:`${user_url}/signup`,
        method: 'POST',
        data: newUser,
    }).then(x=>console.log(x))

  }
  return (
  <div className='signup'>
      <input type="text" onInput={(e)=>setFirstName(e.target.value)} placeholder="Enter The Firstname" />
      <input type="text" onInput={(e)=>setLastName(e.target.value)} placeholder="Enter The  Lastname" />
      <input type="text" onInput={(e)=>setEmail(e.target.value)} placeholder="Enter The Mailid" />
      <input type="text" onInput={(e)=>setPassword(e.target.value)} placeholder="Enter The Password" />
      <button type="submit" onClick={()=>signUp(newUser)}>Get Started</button>
      <button type="submit" onClick={()=>history.push('/login')}>Login</button>
  </div>)
}


function Login()
{
  let history=useHistory();
  const {Email,setEmail,Auth,setAuth}=useContext(context);
  const[Password,setPassword]=useState('');
  const [Result,setResult]=useState('');
  const [Message,setMessage]=useState('');
  // const [user,setUser]=useState('')
  const userdata={Email,Password};


  const logIn = async (userdata) => {
    axios(
    {
      url:`${user_url}/login`,
      method: "POST",
      data:userdata
    }).then(response=>response)
    .then((data)=>setResult(data))   
    };

  
    const getData=()=>{
    const token=localStorage.getItem('$auth')
    const Email=localStorage.getItem('Email')
      axios({
        url:`${user_url}/getuser`,
        method:'POST',
        data:{Email},
        headers: { 'x-auth-token':token }
      }).then(response=>localStorage.setItem('$user',response.data.User)).then(_=>history.push('/')).then(_=>window.location.reload())
    }  
  


    console.log(Auth);

    useEffect(()=>{
    function authenticate()
    {
      if (Result) {
        const { data } = Result;
        console.log(data);
        if (data.token) {
          localStorage.setItem("$auth", data.token);
          localStorage.setItem("$condition",true);
          localStorage.setItem('Email',Email)
          getData()
          setAuth(true);
          
        }
      }
  }
  authenticate()
  },[Result])

  return (
  <div className='login'>

      <input type="text" onInput={(e)=>setEmail(e.target.value)} placeholder="Enter The Email" />
      <input type="text" onInput={(e)=>setPassword(e.target.value)} placeholder="Enter The Password" />
      <button type="submit" onClick={()=>logIn(userdata)}>Login</button>
      <button type="submit" onClick={()=>history.push('/signup')}>Signup</button>
      <button type="submit" onClick={()=>history.push('/forgotpassword')}>Forgot Password</button>
  </div>
  )

}


function ForgotPassword()
{
  let history=useHistory()
  const[Email,setEmail]=useState('');
  const userdata={Email};
  const[result,setResult]=useState('')

  const forgotPassword=async(userdata)=>{
    axios(
      {
        url:`${user_url}/forgotpassword`,
        method:'POST',
        data:userdata
      }).then(response=>response)
      .then(response=>setResult(response))
    }


  return (
   <div className='forgotpassword'>
         <input type="text" onInput={(e)=>setEmail(e.target.value)} placeholder="Email" />
         <button type="submit" onClick={()=>{forgotPassword(userdata)}}>Submit</button>
         <button type="submit" onClick={()=>history.push('/login')}>Back</button>
  </div>)


}


function UpdatePassword()
{
    const {id:token}=useParams()
    const [Password,setPassword]=useState('');
    const[result,setResult]=useState('')
    const[Message,setMessage]=useState('');
   
    const userdata={Password,token};

    const Changepassword=async(userdata)=>{
      axios(
        {
          url:`${user_url}/updatepassword`,
          method:'POST',
          data:userdata
        }).then(response=>response)
        .then(response=>setResult(response))
    }
    if(result)
    {
      console.log('update',result);
    }


    return(<div className='updatepassword'>
          <input type="text" onInput={(e)=>setPassword(e.target.value)} placeholder="Enter The Password" />
          <button type="submit" onClick={()=>Changepassword(userdata)}> Update Password</button>
    </div>)

}


function NavigationBar()
{
  const user=localStorage.getItem('$user')
  const value=localStorage.getItem('$condition')
  const token=localStorage.getItem('$auth')
  let history=useHistory();

    return(<div className='navbar'>
         <Box sx={{ flexGrow: 1 }}>
         <AppBar position="static" id='nav' color='error'>
        <Toolbar variant="dense">
        <Typography variant="h6" color="inherit" component="div"></Typography>
        <Button color='inherit'><Link className='link' to='/'>Home</Link></Button>
        <Button color='inherit'><Link className='link' to='/newarrivals'>New Arrivals</Link></Button>
        {(token&&value)?<>
        <Button color='inherit'><Link className='link' to='/mycart'>My Cart</Link></Button>
        <Button color='inherit'><Link className='link' to='/myorders'>My Orders</Link></Button>
        <Button color='inherit'><Link className='link' to='/dashboard'>Profile</Link></Button>
        </>:''}

        {(!token)&&<Button color='inherit'><Link className='link' to='/login'>SignIn</Link></Button>}
        {(token)&&<Button color='inherit' onClick={()=>{localStorage.clear();window.location.reload();}}><Link className='link' to='/'>Log Out</Link></Button>}
        
        {(user==='Admin')&&<Button color='inherit'><Link className='link' to='/userorders'>Orders</Link></Button>}
        {(user==='Admin')&&<Button color='inherit'><Link className='link' to='/userlist'>Customers</Link></Button>}
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
  <div className='home'>
    <div ><Category/></div>
    <div className='booksContainer'>
    {(!data.length)?<p>Loading</p>:data.map((books,i)=>{return <div className='book' key={i}><Books data={books}  getBooks={getBooks} visibility={true}/>   </div>})}
    </div>
  </div>)
}


function Books({data,visibility,showcount,getBooks}) 
{
  const {BookName,Author,Description,Language,Publisher,Imageurl,Price,PublicationDate,Rating,Available,_id}=data
  const[CartResult,setCartResult]=useState('');
  const [OrderResult,setOrderResult]=useState('');
  const [DelStatus,SetDelStatus]=useState('')

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

  const orderBook=(_id,total)=>{
    axios(
      {
        url:`${book_url}/orderbooks/${_id}`,
        method:'POST',
        data:{Email,total},
        headers: { 'x-auth-token':token }
      }).then(response=>setOrderResult(response.data))
  }

  const DeleteBook=(_id)=>{
    axios(
      {
        url:`${book_url}/deletebook/${_id}`,
        method:'DELETE',
        headers: { 'x-auth-token':token }
      }).then(response=>SetDelStatus(response.data)).then(()=> getBooks())
  }
  console.log(DelStatus,'delete');
  
  return (
  <>
    <div className='thumbnailContainer'>
    <img src={Imageurl} className='bookThumbnail' alt='bookThumbnail'/>
    </div>
    <div className='bookContent'>
      <p className='bookName'>{BookName}</p>
      <p>Author : {Author}</p>
      <p>Rating : {Rating}</p>

      {(!showcount)&&<p>Price : Rs.{Price}</p>}
      {(showcount)&&<p>Price : Rs.{Price*count}</p>}
   
      {(visibility&&token)&&<Button onClick={()=>Cart(_id)}>Add to Cart</Button>}
      <IconButton onClick={()=>history.push(`/bookinfo/${_id}`)}><InfoIcon/></IconButton>
      {(!visibility&&!showcount)&&<Button onClick={()=>history.push(`/orderbook/${_id}`)}>Place Order</Button>}

       {(visibility)&&(user==='Admin')?<div>
         <IconButton onClick={()=>history.push(`/edit/${_id}`)}><EditIcon/></IconButton>
         <IconButton onClick={()=>DeleteBook(_id)}><DeleteIcon/></IconButton>
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


    </div>
  </>)
}


function BookCategory() 
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
  <div className='booksContainer'>
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
  var {BookName,Author,Description,Language,Publisher,Imageurl,Price,PublicationDate,Rating,_id}=data
    return(<div className='individualbook '>

                  <div>
                  <img src={Imageurl} alt='bookThumbnail'/>
                  </div>
                  <div >
                  <p>{BookName}</p>
                  <p>Author : {Author}</p>
                  <p>Description :{Description}</p>
                  <p>Rating : {Rating}</p>
                  <p>Price : {Price}</p>
                  <p>Language :{Language}</p>
                  <p>Publisher :{Publisher}</p>
                  <p>Publication Date : {PublicationDate}</p>
                  </div>

         </div>)
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
        <b>Browse By Category</b><br/><br/>
        <b>Genre</b>
        {(Genre)&&Genre.map((data,i)=>{
          return <Link key={i} to={`/category/${data}`}><p>{data}</p></Link>
        })}
        <b>Author</b>
        {(Author)&&Author.map((data,i)=>{
          return <Link key={i} to={`/category/${data}`}><p>{data}</p></Link>
        })}

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
  return(<div>
    {((!data)||!(data.length))?<p>Cart Empty</p>:data.map((data,i)=>{ return <div key={i}> <Books data={data} visibility={false}/></div>})}
  </div>)
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
    return(<div>
      {!(data)?<div>Loading</div>:<Books data={data} showcount={true}/>}
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
      {!(data)?<div>Books Not yet ordered</div>:
      <div>
      {data.map((data,i)=>{return(<div key={i}><GetOrderBooks data={data}/> </div>)})}
      </div>}
  </div>)
}



function GetOrderBooks({data})
{
    const{_id,BookName,Author,Description,Language,Publisher,Imageurl,Price,total,PublicationDate,Rating,ExpectedDelivery}=data  

console.log(data,'oreder');
    return (<div>

<div className='thumbnailContainer'>
    <img src={Imageurl} className='bookThumbnail' alt='bookThumbnail'/>
    </div>
    <div className='bookContent'>
      <p className='bookName'>{BookName}</p>
      <p>Author : {Author}</p>
      <p>Rating : {Rating}</p>
      <p>Price  : {Price}</p>
      <p>Total  : {total}</p>
      <p>Expected Delivery : {ExpectedDelivery} </p>
  </div>

    </div>)
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
      {(!data)?<div>...Loading</div>:
      <div><h3>Upcoming Books</h3>
        {data.map((data,i)=>{return(<div key={i}>
          <div>
                  <img src={data.Imageurl} alt='bookThumbnail' className='bookThumbnail'/>
                  </div>
                  <div >
                  <p>{data.BookName}</p>
                  <p>Author : {data.Author}</p>
                  <p>Price : Rs.{data.Price}</p>
                  <p>Language :{data.Language}</p>
                  <p>Publisher :{data.Publisher}</p>
                  <p>Publication Date :{data.PublicationDate}</p>
                  </div>
            </div>)})}
        
        
        
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

  const[FirstName,setFirstName]=useState(fname);
  const[LastName,setLastName]=useState(lname);
  const[Address,setAddress]=useState(phone);
  const[Mobile,setMobile]=useState(addr);
  const userData={FirstName,LastName,Address,Mobile,Email}

  const update=(userData)=>{
    axios({
        url:`${user_url}/profileupdate`,
        method:'PUT',
        data:userData,
        headers: { 'x-auth-token':token }
    })
  }
  
  return(<div>
    
    <TextField variant="outlined"  value={FirstName} onChange={(e)=>setFirstName(e.target.value)}
     color='success' label='FirstName' type='text' placeholder="FirstName" /><br/>
     <TextField variant="outlined"  value={LastName} onChange={(e)=>setLastName(e.target.value)}
     color='success' label='LastName' type='text' placeholder="LastName" /><br/>
      <TextField variant="outlined"  value={Email} readOnly
     color='success' label='Email' type='text' placeholder="Email" /><br/>
      <TextField variant="outlined"  value={Address} onChange={(e)=>setAddress(e.target.value)}
     color='success' label='Address' type='text' placeholder="Address" /><br/>
      <TextField variant="outlined"  value={Mobile} onChange={(e)=>setMobile(e.target.value)}
     color='success' label='Mobile' type='text' placeholder="Mobile" /><br/>


    <Button onClick={()=>update(userData)}>Update Profile</Button>
    {/* <img src='https://m.media-amazon.com/images/I/917b28Xf9rL._AC_UY218_.jpg' className='bookThumbnail' alt ='img'/> */}
  </div>)
}



function AdminOrderpage()
{
  const[data,setData]=useState(null);
  const token=localStorage.getItem('$auth')
  const Email=localStorage.getItem('Email')
    
const getOrderData=()=>{
  axios(
    {
      url:`${book_url}/getorderbooks`,
      method:'POST',
      // data:{Email},
      headers: { 'x-auth-token':token }
    }).then(response=>setData(response.data))
}
useEffect(getOrderData,[Email])
console.log(data);
return(<div className='orders'>
    {!(data)?<div>Books Not yet ordered</div>:(data.length)?
    <div>
    {data.map((data,i)=>{return(<div key={i}><AdminBooks data={data}/> </div>)})}
    </div>:<div>Books Not yet ordered</div>}
</div>)

}


function AdminBooks({data})
{
    const{FirstName,LastName,Email,Mobile,Address,OrderedBooks}=data
    // const{_id,BookName,Author,Description,Language,Publisher,Imageurl,Price,total,PublicationDate,Rating,ExpectedDelivery}=
  return(<div>
    <div>
    {OrderedBooks.map((data,i)=>{return(<div key={i}>
      <div> <img src={data.Imageurl} alt='bookThumbnail' className='bookThumbnail'/></div>
      <div>
      <p>{data.BookName}</p>
      <p>Author : {data.Author}</p>
      <p>Price : Rs.{data.Price}</p>
      <p>Total :{data.total} Nos</p>
      <p>Expected Delivery : {data.ExpectedDelivery}</p>
      </div>
      <div>
      <p>UserDetails</p>
      <p>Name:{FirstName} {LastName}</p>
      <p>Email : {Email}</p>
      <p>Mobile : {Mobile}</p>
      <p>Address : {Address}</p>
    </div>
      </div>)})}
    </div>
   
  </div>)
}

function Edit()
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
      {!(data)?<div>Loading</div>:<EditBookData data={data}/>}
    </div>)  
}

function EditBookData({data})
{
  var {BookName:bookname,Author:author,Description:description,Language:language,Publisher:publisher,Imageurl:imageurl,Price:price,PublicationDate:publicationdate,Rating:rating,_id}=data
  const token=localStorage.getItem('$auth')
  const[BookName,setBookName]=useState(bookname)
  const[Imageurl,setImageurl]=useState(imageurl)
  const[Author,setAuthor]=useState(author)
  const[Description,setDescription]=useState(description)
  const[Publisher,setPublisher]=useState(publisher)
  const[Price,setPrice]=useState(price)
  const[Language,setLanguage]=useState(language)
  const[PublicationDate,setPublicationDate]=useState(publicationdate)
  const[Rating,setRating]=useState(rating)
  const [Result,setResult]=useState('');

  const BookData={BookName,Imageurl,Author,Description,Publisher,Price,Language,PublicationDate,Rating}

  const updateBook=(BookData)=>{
        axios(
          {
            url:`${book_url}/getbook/${_id}`,
            method:'PUT',
            data:BookData,
            headers: { 'x-auth-token':token }
          }).then(response=>setResult(response))
  }
  console.log(Result,'Edit');
  return(<div>
                <TextField variant="outlined"  value={BookName} onChange={(e)=>setBookName(e.target.value)}
                 color='success' label='Book Name' type='text' placeholder="Book Name" /><br/>
                 
                 <TextField variant="outlined"  value={Imageurl} onChange={(e)=>setImageurl(e.target.value)}
                  color='success' label='Thumbnail Url' type='text' placeholder="Image url" /><br/>
                 
                  <TextField variant="outlined"  value={Author} onChange={(e)=>setAuthor(e.target.value)}
                  color='success' label='Author' type='text' placeholder="Author Name" /><br/>
                 
                 <TextField variant="outlined"  value={Price} onChange={(e)=>setPrice(e.target.value)}
                 color='success' label='Price' type='text' placeholder="Price" /><br/>

                 <TextField variant="outlined"  value={Language} onChange={(e)=>setLanguage(e.target.value)}
                  color='success' label='Language' type='text' placeholder="Language" /><br/>
                 
                 <TextField variant="outlined"  value={Publisher} onChange={(e)=>setPublisher(e.target.value)}
                  color='success' label='Publisher' type='text' placeholder="Publisher" /><br/>
                 
                  <TextField variant="outlined"  value={PublicationDate} onChange={(e)=>setPublicationDate(e.target.value)}
                  color='success' label='Publication Date' type='text' placeholder="Publication Date" /><br/>
                 
                  <TextField variant="outlined"  value={Rating} onChange={(e)=>setRating(e.target.value)}
                  color='success' label='Rating' type='text' placeholder="Rating" /><br/>
                
                 <TextField variant="outlined"  value={Description} onChange={(e)=>setDescription(e.target.value)}
                 color='success' label='Description' type='text' placeholder="Description" /><br/>

                 <Button onClick={()=>updateBook(BookData)}>Update Book</Button>
  </div>)




}

function GetAllUsers() 
{
  const[data,setData] =useState('');
  const Email=localStorage.getItem('Email')
  const token=localStorage.getItem('$auth')
  const get=()=>{
      axios(
      {
          url:`${user_url}/getallusers`,
          method:'POST',
          data:{Email},
          headers: { 'x-auth-token':token }
      }).then(response=>setData(response.data))
      console.log(data,'userlist');
  }
  useEffect(get,[])
  return(<div>
      {(!data)?<div>...Loading</div>:<div><p>Customers : {data.length}</p>
        {data.map((data,i)=>{return <div key={i}><Users data={data}/></div>})}</div>}
  </div>)
}

function Users({data})
{
    const{FirstName,LastName,Email,Mobile,Address}=data;
    console.log(data,'k');
    return(<div>
      <p>Name : {FirstName} {LastName}</p>
      <p>Email : {Email}</p>
      <p>Mobile : {Mobile}</p>
      <p>Address : {Address}</p>
    </div>)
}



function Message({message})
{
  return (
  <div className='message'>
      <p>{message}</p>
  </div>)
}
