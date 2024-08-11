// pages/update-price.js

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';

function UpdatePrice() {
  const [price, setPrice] = useState('');
  const [datprice, setDatPrice] = useState('');
  const router = useRouter();

  const fetchData = async () => {
    try {
      const priceResponse = await axios.get('https://agmar-paliwa.pl/apis/fuel-price');
      const datePriceResponse = await axios.get('https://agmar-paliwa.pl/apis/date-price');

      setPrice(priceResponse.data.price);
      setDatPrice(datePriceResponse.data.datprice);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    if (!token) {
      alert('You must be logged in to update the price and date');
      router.push('/login');
      return;
    }

    try {
      await axios.put('https://agmar-paliwa.pl/apis/fuel-price', { price }, { headers: { Authorization: token } });
      await axios.put('https://agmar-paliwa.pl/apis/date-price', { datprice }, { headers: { Authorization: token } });

      alert('Price and date updated successfully');
    } catch {
      alert('Failed to update price and date');
    }
  };

  return (
    <form onSubmit={handleSubmit} className='login-to-panel'>
      <h1>AGMAR</h1>
      <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="New price" required />
      <input type="text" value={datprice} onChange={(e) => setDatPrice(e.target.value)} placeholder="Date of new price" required />
      <button type="submit">Zmień cenę i datę</button>

      <Link href='/'>Strona główna</Link>
    </form>
  );
}

export default UpdatePrice;

