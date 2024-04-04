import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from './img.png';

const sliceTypes = {
  bread: { name: "Bread", price: 1 },
  alooTikki: { name: "Aloo Tikki", price: 3 },
  cheese: { name: "Cheese", price: 2 },
};

const initialSlices = [
  { ...sliceTypes.bread },
  { ...sliceTypes.alooTikki },
  { ...sliceTypes.cheese },
  { ...sliceTypes.alooTikki },
  { ...sliceTypes.bread },
];

function Order() {
  const [slices, setSlices] = useState(initialSlices);
  const [totalPrice, setTotalPrice] = useState(calculateTotalPrice(initialSlices));
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    fetchOrderNumber();
  }, []);

  const fetchOrderNumber = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders');
      setOrderNumber(response.data.orderNumber);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching order number:', error);
    }
  };

  function calculateTotalPrice(slices) {
    return slices.reduce((acc, slice) => acc + slice.price, 0);
  }

  const handleAddSlice = (sliceType) => {
    const newSlices = [...slices, sliceTypes[sliceType]];
    setSlices(newSlices);
    setTotalPrice(calculateTotalPrice(newSlices));
  };

  const handleRemoveSlice = (sliceType) => {
    const index = slices.findIndex(slice => slice.name === sliceTypes[sliceType].name);
    if (index > -1) {
      const newSlices = [...slices];
      newSlices.splice(index, 1);
      setSlices(newSlices);
      setTotalPrice(calculateTotalPrice(newSlices));
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/order', {
        slices,
        totalPrice,
        quantity: 1,
        customerMobileNumber: '1234567890',
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Order placed:', response.data);
      fetchOrderNumber();
    } catch (error) {
      console.error('Error placing order:', error.response ? error.response.data : error);
    }
  };

  return (
    <div>
      <h2>Build Your Burger</h2>
      <div>
        <img src={Image} alt="burger" />
        {slices.map((slice, index) => (
          <div key={index}>{slice.name === "Bread" ? "======= Bread =======" : `------- ${slice.name} -------`}</div>
        ))}
      </div>
      <div>
        <button onClick={() => handleAddSlice('bread')}>Add Bread</button>
        <button onClick={() => handleAddSlice('alooTikki')}>Add Aloo Tikki</button>
        <button onClick={() => handleAddSlice('cheese')}>Add Cheese</button>
        <button onClick={() => handleRemoveSlice('bread')}>Remove Bread</button>
        <button onClick={() => handleRemoveSlice('alooTikki')}>Remove Aloo Tikki</button>
        <button onClick={() => handleRemoveSlice('cheese')}>Remove Cheese</button>
        <div>Total Price: ${totalPrice}</div>
        <div>Next Order Number: {orderNumber}</div>
        <button onClick={handlePlaceOrder}>Place Order</button>
      </div>
    </div>
  );
}

export default Order;

