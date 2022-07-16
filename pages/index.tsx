import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import axios from 'axios';
import { useEffect } from 'react';

interface BraveCoinOptions {
  method: string;
  url: string;
  params: {
    status: string;
  };
  headers: {
    'X-RapidAPI-Key': string;
    'X-RapidAPI-Host': string;
  };
}

interface BraveCryptoData {
  contractAddress: string;
  id: string;
  name: string;
  slugName: string;
  status: string;
  symbol: string;
  type: string;
  url: string;
}

interface CryptoIndex {
  [symbol: string]: BraveCryptoData;
}

// hashmap to quickly extract information on crypto
// token from it's symbol
const cryptoSymbolIndex: CryptoIndex = {};

// pull crypto data , including ids, names, symbol etc
async function getCryptoIds() {
  const options: BraveCoinOptions = {
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

  const cryptoData: BraveCryptoData[] = response?.data?.content;

  // extract data and put it in cryptoSymbolIndex hashmap
  cryptoData.forEach((crypto) => {
    cryptoSymbolIndex[crypto.symbol] = { ...crypto };
  });

  console.log(cryptoSymbolIndex);
}

const Home: NextPage = () => {
  useEffect(() => {
    getCryptoIds();

    const options = {
      method: 'POST',
      url: 'https://bravenewcoin.p.rapidapi.com/oauth/token',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': 'ba57c7b61amshfcecd1974184d49p19a42fjsn85787055bfa1',
        'X-RapidAPI-Host': 'bravenewcoin.p.rapidapi.com',
      },
      data: '{"audience":"https://api.bravenewcoin.com","client_id":"oCdQoZoI96ERE9HY3sQ7JmbACfBf55RY","grant_type":"client_credentials"}',
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, []);

  return <div className={styles.container}>Hello World!</div>;
};

export default Home;
