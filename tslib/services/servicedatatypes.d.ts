// Copyright (c) 2011-2013 Turbulenz Limited

// Collection of type declarations used by both sides of the bridge,
// and by some services and managers that receive data across the
// bridge.  Some of these types correspond directly to JSON data
// passed back and forth between services.  This module can function
// as a canonical place to keep this type information.

//
// Elements on Window
//
interface Window
{
    Turbulenz: any;
    gameSlug: string;
};

//
// Currency
//
interface Currency
{
    currencyName: string;
    alphabeticCode: string;
    numericCode: number;
    minorUnitPrecision: number;
};

//
interface BasketItem
{
    amount: number;
};

interface BasketItemList
{
    [key: string]: BasketItem;
};

//
// Basket - Simple list of items with no price or currency
// information, passed from StoreManager to the Bridge.
//
interface Basket
{
    basketItems : BasketItemList;
    token       : string;
};

interface CalculatedBasketItem
{
  amount: number;
  lineTotal: string;
  price: string;
};

//
// CalculatedBasket - The fully resolved basket returned from the
// TurbulenzBridge, with currency, price, lineprices, etc all
// calculated.
//
interface CalculatedBasketItemList
{
    [key: string]: CalculatedBasketItem;
};

interface CalculatedBasket
{
  currency : Currency;
  items    : CalculatedBasketItemList;
  total    : string;
  token?   : string;
};

//
// StoreItemList - item meta data with a key, title, description and index
//
interface StoreItem
{
    key: string;
    title: string;
    description: string;
    index: number;
};

interface StoreItemList
{
    [itemKey: string]: StoreItem;
};

//
// StoreOfferingOutput
//
interface StoreOfferingOutput
{
    [outputKey: string]: { amount: number; };
}

//
// StoreOffering - meta data about a single offering in the store,
// passed from the bridge to StoreManager.
//
interface StoreOffering extends StoreItem
{
    available : bool;
    price     : string;
    output    : StoreOfferingOutput;
};

interface StoreOfferingList
{
    [itemKey: string]: StoreOffering;
};

//
// StoreOfferingPriceAPI - the Price of an Offering, as used in
// StoreOfferingAPIResponse.  Each entry is the value in minor units
// for that currency.
//
interface StoreOfferingPriceAPI
{
    [currencyCode: string]: number;
}

//
// StoreOfferingAPIResponse - the Offering information passed back from
// the http API.
//
interface StoreOfferingAPIResponse extends StoreItem
{
    available : bool;
    prices    : StoreOfferingPriceAPI;
    output    : StoreOfferingOutput;
};

interface StoreOfferingAPIResponseList
{
    [offeringKey: string]: StoreOfferingAPIResponse;
};

//
// StoreResource - meta data about a single resource in the store
//
interface StoreResource extends StoreItem
{
    type: string;
};

interface StoreResourceList
{
    [itemKey: string]: StoreResource;
};

//
// StoreMetaData
//
// Passed from the Bridge to StoreManager
//
interface StoreMetaData
{
    currency  : string;
    items     : StoreOfferingList;
    offerings : StoreOfferingList;
    resources : StoreResourceList;
};

//
// TransactionRequest - sent to 'api/v1/store/transactions/checkout'
//
interface TransactionRequest
{
    gameSlug: string;
    basket?: any;              // TODO:
    paymentProvider?: string;  // 'googleplay', etc.  (default: 'amazon')
}

//
// Transaction - response from 'api/v1/store/transactions/checkout'
//
interface Transaction
{
    transactionId   : string;
    paymentUrl?     : string;
    paymentProvider : string;
};

//
// TransactionPaymentParameters - parameters to
// 'api/v1/store/transactions/pay/<id>'
//
interface TransactionPaymentParameters
{
    basket            : BasketItemList;
    providerData      : string;
    providerSignature : string;
};

//
// TransactionPayment - response from 'api/v1/store/transactions/pay/<id>'
//
interface TransactionPayment
{
    status: string;    // "checkout", "processing", "completed"
};