import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import {
  CryptoIndex,
  BraveCoinOptions,
  BraveCoinAccessTokenOptions,
  BraveCryptoData,
  BraveCoinAssetTicker,
} from '../library/interfaces';

// access token required to get market data
let accessToken: string = '';
const cookies: Cookies = new Cookies();

async function getAccessToken() {
  const options: BraveCoinAccessTokenOptions = {
    method: 'POST',
    url: 'https://bravenewcoin.p.rapidapi.com/oauth/token',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': 'ba57c7b61amshfcecd1974184d49p19a42fjsn85787055bfa1',
      'X-RapidAPI-Host': 'bravenewcoin.p.rapidapi.com',
    },
    data: '{"audience":"https://api.bravenewcoin.com","client_id":"oCdQoZoI96ERE9HY3sQ7JmbACfBf55RY","grant_type":"client_credentials"}',
  };

  const response: void | AxiosResponse = await axios
    .request(options)
    .catch((error) => {
      console.error(error);
    });

  accessToken = response?.data?.access_token;
  cookies.set('token', accessToken);
}

// get market data from crypto assets from BraveCoin API
// token => access token we got from getAccessToken()
// coinID => ID of crypto assets (that we obtained from  getCryptoIds() )
// these IDs are now accessible through cryptoSymbolIndex[symbol].id
async function getCoinMarketData(token: string = accessToken, coinID: string) {
  token =
    'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik5EVXhNRGhHT0VReE56STVOelJCTTBJM1FrUTVOa0l4TWtRd1FrSTJSalJFTVRaR1F6QTBOZyJ9.eyJpc3MiOiJodHRwczovL2F1dGguYnJhdmVuZXdjb2luLmNvbS8iLCJzdWIiOiJvQ2RRb1pvSTk2RVJFOUhZM3NRN0ptYkFDZkJmNTVSWUBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9hcGkuYnJhdmVuZXdjb2luLmNvbSIsImlhdCI6MTY1NzkyNzk0NSwiZXhwIjoxNjU4MDE0MzQ1LCJhenAiOiJvQ2RRb1pvSTk2RVJFOUhZM3NRN0ptYkFDZkJmNTVSWSIsInNjb3BlIjoicmVhZDppbmRleC10aWNrZXIgcmVhZDpyYW5raW5nIHJlYWQ6bXdhIHJlYWQ6Z3dhIHJlYWQ6YWdncmVnYXRlcyByZWFkOm1hcmtldCByZWFkOmFzc2V0IHJlYWQ6b2hsY3YgcmVhZDptYXJrZXQtY2FwIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.VwqPVZQKP-dEPchuJpNRzuNrvp3Dns8f8H2lhBWAF8OH8FTXxYPBgKWximjtCTSTUX2XyCMrmshxi4qcU0rUK1hcXFcQQHsAX8NKZYYNiQTcioN-8FzAzgSE7TfGMsPTH6azJVOr5xqWoABaq348dY_L3VU3X-ytHOUro7RqhAaAZpqX-S6lsv-idlYbqYtSzPIktYo8nwKTwgnbaqJVEvtKRduNtg0jEqdEdjYDfhlktPaNLAIjslLpLly2ujEvMosuPdxKLdXIq8CDnZt4Ki5B0C8U3jcRM980kvhoFWSpAx7-pXu5vDxtWa-R8QMKCF7vqjNoIE4jllT4dlnFdw';

  const options: BraveCoinAssetTicker = {
    method: 'GET',
    url: 'https://bravenewcoin.p.rapidapi.com/market-cap',
    params: { assetId: coinID },
    headers: {
      Authorization: `Bearer ${token}`,
      'X-RapidAPI-Key': 'ba57c7b61amshfcecd1974184d49p19a42fjsn85787055bfa1',
      'X-RapidAPI-Host': 'bravenewcoin.p.rapidapi.com',
    },
  };

  const response: void | AxiosResponse = await axios
    .request(options)
    .catch((error) => {
      console.error(error.message);
    });

  const [{ price }] = response?.data?.content;
  console.log(price);
}
const Home: NextPage = () => {
  // capture coin data in state variable
  // can look up information on crypto with
  // cryptoIndex[SYMBOL] : BraveCryptoData
  /* export interface BraveCryptoData {
    contractAddress: string;
    id: string;
    name: string;
    slugName: string;
    status: string;
    symbol: string;
    type: string;
    url: string;
  } */
  const [cryptoIndex, setCryptoIndex] = useState<CryptoIndex>({});

  useEffect(() => {
    // getting info via API on all crypto listings (symbol, name, etc)
    // listed on BraveNewCoin, this info is then saved to cryptoSymbolIndex
    // hashmap for quick access
    getCryptoIds();
    // getting BraveNewCoin 24-hr access token via API that will allow
    // us to get market data on crypto assets
    // first check if token is cookied
    accessToken = cookies.get('token');
    if (!accessToken) getAccessToken();

    // get data on BTC price
    console.log(cryptoIndex);
  }, []);

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

    const response: void | AxiosResponse = await axios
      .request(options)
      .catch((error) => {
        console.error(error);
      });

    // hashmap to quickly extract information on crypto
    // token from it's symbol
    const cryptoSymbolIndex: CryptoIndex = {};
    // extract data and put it in cryptoSymbols hashmap for easy access
    const cryptoData: BraveCryptoData[] = response?.data?.content;
    cryptoData.forEach((crypto) => {
      cryptoSymbolIndex[crypto.symbol] = { ...crypto };
    });

    // set state
    setCryptoIndex(cryptoSymbolIndex);
    // console.log(cryptoIndex['BTC'].id);
  }

  // console.log(cryptoIndex['BTC'].id);
  console.log(accessToken);
  // getCoinMarketData(accessToken, cryptoIndex['BTC'].id);
  getCoinMarketData(accessToken, 'f1ff77b6-3ab4-4719-9ded-2fc7e71cff1f');

  return <div className={styles.container}>Hello World!</div>;
};

export default Home;
