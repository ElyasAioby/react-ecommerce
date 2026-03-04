import { useEffect, useState } from 'react';
import '../App.css';
import { experimental_streamedQuery, useQuery } from '@tanstack/react-query';
import axios from 'axios';



const fetchProducts = async () => {
  const data = await axios.get('https://fakestoreapi.com/products');
  return data;
}


function App() {

  let [current, setCurrent] = useState(0);
  let [count, setCount] = useState(0);
  let [left , setLeft] = useState(100);
  let [showBox , setShowBox] = useState(false);
  let [existingItems, setExistingItems] = useState([]);
  
  
  const {isLoading, isError, data, error} = useQuery({
    queryKey:['products'],
    queryFn: fetchProducts
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

   if (isError) {
    return <div>{error.message} is Happened</div>
  }

  function boxToggle() {
    setShowBox(!showBox)
  }

  let increaseOfCount = () => {
    setCount(count + 1);
  }

  let decreaseOfCount = () => {
    if(count === 0) setCount(0);
    else setCount(count - 1)
  }

  let leftSlide = () => {
    if(current === 0) setCurrent(data.data.length - 1);
    else setCurrent(current - 1);
  }

  let rightSlide = () => {
    if(current === data.data.length - 1) setCurrent(0);
    else setCurrent(current + 1);
  }

  function toggleMenue() {
    if(left === 100 ) setLeft(0);
    else setLeft(100);
  }

  function addToCart() {
    if (count === 0) {
      alert("Enter the Amount of Product!");
      return;
    }

    // Get the product currently being viewed
    const selectedProduct = {
      ...data.data[current],
      quantity: count // Add the quantity that user choose
    };

    
    // Update state correctly using the spread operator
      setExistingItems(prev =>
      prev.some(item => item.id === selectedProduct.id)
        ? prev.map(item =>
            item.id === selectedProduct.id
              ? { ...item, quantity: item.quantity + selectedProduct.quantity }
              : item
          )
        : [...prev, selectedProduct ]
      );
         
    // Reset count after adding (optional)
    setCount(0); 
  }


  return(
      <div className='relative'>
          {/* Mobile/Tablet Menu */}
            <div 
              onClick={toggleMenue} 
              style={{zIndex:'10', transition:'ease-in', transitionDuration: '600ms'}}  
              className={`fixed sm:hidden px-4 py-4 bg-gray-100   ${left === 100 ? 'opacity-70 left-110' : 'opacity-100 left-0'} right-0  top-0 bottom-0`}
            >
              <img className='py-5 w-5 hover:scale-125' src="./src/images/icon-close.svg" alt="close" />
              <ul>
                {['Collections', 'Men', 'Women', 'About', 'Contact'].map(item => (
                  <li key={item} className='cursor-pointer py-2 text-lg font-bold hover:scale-95'>{item}</li>
                ))}
              </ul>
            </div>

          <header className='relative '>
            <nav style={{zIndex:'9'}} className='nav-bar fixed w-full flex items-center justify-between px-6 md:px-1 py-4  top-0 bg-gray-100  border-gray-200'>
              <div className="flex items-center gap-4">
                <img onClick={toggleMenue} className='w-7 h-5 sm:hidden cursor-pointer' src="./src/images/icon-menu.svg" alt="menu" />
                <img className='w-32 h-auto' src="./src/images/logo.svg" alt="logo" />
                
                {/* Desktop and Tablet NavBar : Hidden on mobile, flex on sm and above */}
                <div className='hidden sm:flex items-center gap-6 ml-8 text-gray-500'>
                  {['Collections', 'Men', 'Women', 'About', 'Contact'].map(item => (
                    <a key={item} className='cursor-pointer hover:text-black border-b-4 border-transparent hover:border-orange-400 py-8 transition-all hover:scale-120'>{item}</a>
                  ))}
                </div>
              </div>

              <div className='flex items-center gap-5 sm:gap-10 md:gap-4 lg:w-[20%] md:justify-end lg:gap-30'>
                <div className='relative flex flex-col items-center justify-center '>
                  <img 
                  onClick={boxToggle}
                  className='w-6 sm:w-7 cursor-pointer hover:scale-120 ' src='./src/images/icon-cart.svg' alt="cart" />
                  
                  {showBox ? (
                    <>
                     <ShoppingBox existingItems={existingItems} setExistingItems={setExistingItems}  count={count}  current={current}/> 
                    </>
                  ) : ''}

                </div>
                <img className='w-8 sm:w-12 border-2 border-transparent hover:border-orange-400 rounded-full cursor-pointer' src='./src/images/image-avatar.png' alt="avatar" />
              </div>
            </nav>
          </header>
          
          {/* Main Content Area */}
          <div className='flex flex-col mt-23 lg:mt-44 items-center px-4 sm:px-0'>
            {/* Product Container: column on mobile, row on tablet/desktop */}
            <div className='flex flex-col lg:flex-row lg:w-[80%] xl:w-[70%] justify-between gap-10 lg:gap-20 items-center lg:items-start'>

              {/* Left Part:Products Images */}
              <div className='container-left-part w-full lg:w-[45%]'>
                <div className='relative overflow-hidden rounded-none lg:rounded-xl '>
                  <div className={`flex transition ease-out duration-600 `} style={{transform:`translateX(-${current * 100}%)`}}>
                    {
                       data?.data.map((product) => (
                        <img className='w-full flex-shrink-0 md:h-120' key={product.id} src={product.image}></img>
                       ))
                    }
                  </div>
                  {/* Nav buttons only on mobile */}
                  <button onClick={leftSlide} className='sm:hidden absolute top-1/2 -translate-y-1/2 left-4 p-3 bg-white rounded-full shadow-md'><img src="./src/images/icon-previous.svg" alt="prev"/></button>
                  <button onClick={rightSlide} className='sm:hidden absolute top-1/2 -translate-y-1/2 right-4 p-3 bg-white rounded-full shadow-md'><img src="./src/images/icon-next.svg" alt="next"/></button>
                </div>
                
                {/* Thumbnails: Hidden on smallest mobile, shown on tablets and desktops */}
                <div className='hidden sm:flex px-3 rounded-xl md:px-0 w-full justify-between mt-8 gap-4 overflow-auto shadow-[0_0_45px_0_rgba(0,0,0,0.1)]'>

                  {
                    data?.data.map((product,i) => (
                      <img 
                       onClick={() => setCurrent(i)} 
                       key={product.id}
                       src={product.image}
                       className={`w-1/8 p-3  rounded-xl cursor-pointer hover:opacity-75 transition-opacity ${i === current ? 'border-2 border-orange-400 opacity-50' : ''}`} 
                       >
                      </img>
                    ))
                    
                  }
                </div>
              </div> 

              {/* Right Part: Text and Actions */}
              <div className='container-right-part w-full lg:w-[45%] py-4 lg:py-10'>
                <p className='text-orange-400 font-bold tracking-widest text-md mb-4'>SNEAKER COMPANY</p>
                <h1 className='font-bold text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight'>{data?.data[current].category}</h1>
                <p className='text-gray-500 text-base md:text-lg mb-8'>
                  {data?.data[current].description}
                </p>

                {/* Pricing Layout */}
                <div className='flex flex-row lg:flex-col justify-between items-center lg:items-start mb-8'>
                  <div className='flex items-center gap-4'>
                    <h3 className='font-bold text-3xl'>${data?.data[current].price}</h3> 
                    <span className='bg-orange-100 text-orange-400 font-bold px-2 py-1 rounded-md'>50%</span>
                  </div>
                  <h2 className='text-gray-400 line-through font-bold'>{(data?.data[current].price) * 2}</h2>
                </div>

                {/* Action Buttons: Stack on mobile, side-by-side on tablet/desktop */}
                <div className='flex flex-col md:flex-row gap-4'>
                  <div className='flex items-center justify-between bg-gray-100 rounded-xl px-4 py-3  md:w-1/3'>
                    <img onClick={decreaseOfCount} className='cursor-pointer p-2 hover:opacity-50' src='./src/images/icon-minus.svg' alt="minus" />
                    <span className='font-bold text-lg'>{count}</span>
                    <img onClick={increaseOfCount} className='cursor-pointer p-2 hover:opacity-50' src='./src/images/icon-plus.svg' alt="plus" />
                  </div>
                  <button onClick={addToCart} className='flex-1 flex items-center justify-center gap-4 cursor-pointer bg-orange-400 hover:bg-orange-300 transition-colors text-white font-bold py-4 rounded-xl  shadow-2xl'>
                    <img className='brightness-0 invert' src='./src/images/icon-cart.svg' alt="cart" /> 
                    Add to Cart 
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="fixed bottom-2 right-2 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 p-3 font-mono text-xs text-white">
            <div className="block sm:hidden">XS</div>
            <div className="hidden sm:block md:hidden">SM</div>
            <div className="hidden md:block lg:hidden">MD</div>
            <div className="hidden lg:block xl:hidden">LG</div>
            <div className="hidden xl:block 2xl:hidden">XL</div>
            <div className="hidden 2xl:block">2XL</div>
          </div>


          <footer className='absolute py-3 px-12 flex flex-col gap-3 md:flex-row items-center  bottom-0 h-[105%] md:h-[40%] lg:h-[60%] shadow-inner w-full top-4/4 mt-20 md:mt-[20%] opacity-90 bg-orange-400'>
              <div className='absolute flex flex-col w-5 left-1/2 right-1/2 h-[80%] bg-black md:flex-row md:h-5 md:w-[70%] md:top-1/2 md:left-30 '></div>
              {/*First Box */}
              <div style={{zIndex: '1'}} className='flex flex-col flex-1 px-10 py-4 items-center   bg-orange-300 lg:h-[70%] rounded-xl  hover:scale-95'>
                <p className='text-xl font-bold'>Our Company</p>
                <div>
                  <p className='text-gray-700'>
                    Our Company is Dedicated to Digitalize Your Ideas Into
                    Real World, Flexable, Trustable and Secure Application Systems.
                    <span className='uppercase font-bold text-black'> Al-kharazmi</span> A Company with a Scaleble and Experinced Team 
                    with More than <span className='font-bold text-xl text-orange-600'>60+</span> Projects.
                  </p>
                </div>
              </div>
              {/*Middle Box */}
              <div style={{zIndex: '1'}} className='flex flex-col flex-1  px-10 py-4 items-center md:mt-8 bg-orange-300 lg:h-[70%] rounded-xl hover:scale-95'>
                <p className='text-xl font-bold'>Contacts</p>
                <div className='flex items-start w-full'>
                  <ul className='flex flex-col gap-4 '>
                    <li className='flex items-center'><img className='w-10 pr-2' src="./src/images/icon-email.png" alt="" /><a href="">Email: elyasaioby@gmail.com</a></li>
                    <li className='flex items-center'><img  className='w-10 pr-2' src="./src/images/icon-phone.png" alt="" /><a href="">Phone: 0776004280</a></li>
                    <li className='flex items-center'><img  className='w-10 pr-2' src="./src/images/icon-facebook.png" alt="" /><a href="">Facebok: Elyas Aioby</a></li>
                    <li className='flex items-center'><a href=""></a></li>
                  </ul>
                </div>
              </div>
              {/*Last Box */}
              <div style={{zIndex: '1'}} className='flex  flex-col flex-1  px-10 py-4 items-center md:mt-16   bg-orange-300 lg:h-[70%] rounded-xl hover:scale-95'>
                <p className='mb-6'>Frequently Asked Question <span className='font-bold'>(FAQ)</span></p>
                <div className='flex flex-col h-full justify-between' >
                  <p> 
                    Let's Join Our Community and Share What Have in Your 
                    Mind <span className=''>✌️🧑‍💻</span> 
                  </p>
                  <button className='text-xl bg-orange-500 flex w-full px-2 py-2 md:py-5 justify-center cursor-pointer  rounded-xl hover:shadow-xl'>Ask Me</button>
                </div>
              </div> 
          </footer>
      </div>
)}




const ShoppingBox = ({ existingItems, setExistingItems }) => {

  const clearAll = () => {
    setExistingItems(() => [])

  }

  const clearOne = (id,quantity) => {
    setExistingItems((prev) => prev.filter(item => (item.id !== id)))
  }
    
  return (
    <div className="absolute  top-16 right-0 -left-57 md:-left-57 w-80  overflow-auto max-h-100 bg-white shadow-2xl rounded-lg p-4">
    
      <div className='flex w-full border-b justify-between'>
        <h3 className="font-bold pb-2">Cart</h3>
        <img onClick={clearAll} className='w-6 h-6 cursor-pointer'  src="./src/images/icon-delete.svg" alt="delete-icon" />
      </div>
        
        {existingItems.length === 0 ? (
          <p className="py-10 text-center text-gray-500">Your cart is empty.</p>
        ) : (
           Array.isArray(existingItems) && existingItems.map((item, index) => (
            <div key={index} className="flex items-center   justify-between gap-4 py-4">
              <img src={item.image} className=" w-12 h-12 rounded" alt="" />
              
              <div className=''>
                <p className="flex flex-1 text-gray-500">{item.category}</p>
                <p>
                  ${item.price} x {item.quantity} 
                  <span className=" font-bold ml-2">${item.price * item.quantity}</span>
                </p>
              </div>
              <img  onClick={()=>clearOne(item.id,item.quantity)} className='cursor-pointer' src="./src/images/icon-delete.svg" alt="delte" />
            </div>
          ) )
        )}
      <button className='flex w-full justify-center bg-orange-400 p-2 rounded-xl font-bold cursor-pointer'>Checkout</button>
    </div>
    
  );    
}


export default App
