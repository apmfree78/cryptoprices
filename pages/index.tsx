import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import axios from 'axios';
import { useEffect } from 'react';

// pull crypto data , including ids, names, symbol etc
async function getCryptoIds() {
  const options = {
    method: 'GET',
    url: 'https://bravenewcoin.p.rapidapi.com/asset',
    params: { status: 'ACTIVE' },
    headers: {
      'X-RapidAPI-Key': 'ba57c7b61amshfcecd1974184d49p19a42fjsn85787055bfa1',
      'X-RapidAPI-Host': 'bravenewcoin.p.rapidapi.com',
    },
  };

  const response = await axios.request(options).catch((error) => {
    console.error(error);
  });

  console.log(response?.data);
}

const Home: NextPage = () => {
  useEffect(() => {
    getCryptoIds();
  }, []);

  return <div className={styles.container}>Hello World!</div>;
};

export default Home;
