export interface BraveCoinOptions {
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
export interface BraveCoinAccessTokenOptions {
  method: string;
  url: string;
  headers: {
    'content-type': string;
    'X-RapidAPI-Key': string;
    'X-RapidAPI-Host': string;
  };
  data: string;
}

export interface BraveCryptoData {
  contractAddress: string;
  id: string;
  name: string;
  slugName: string;
  status: string;
  symbol: string;
  type: string;
  url: string;
}

export interface CryptoIndex {
  [symbol: string]: BraveCryptoData;
}


