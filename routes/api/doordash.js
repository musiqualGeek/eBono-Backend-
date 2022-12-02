const express = require('express')
const router = express.Router();
const nodeRSA = require('node-rsa');
const fetch = require('node-fetch');

const DoorDashClient = require('@doordash/sdk')
const access_key = {
    "developer_id": "035d28b4-3806-436c-a104-1f836c1cbc39",
    "key_id": "633c1cd9-08fa-46c5-917c-47de06ec8ff9",
    "signing_secret": "gqS163I8pFFvVyaucwc2mVkyWx_6UMocc2wwIWWWcqk"
  }

const client = new DoorDashClient.DoorDashClient(access_key)

function request_dd(did,pickup_address,pick_phone,dadd,dphone){

const response = client
  .createDelivery({
    external_delivery_id: did,
    pickup_address: pickup_address,
    pickup_phone_number: pick_phone,
    dropoff_address: dadd,
    dropoff_phone_number:dphone,
  })
  .then(response => {
    console.log(response.data)
  })
  .catch(err => {
    console.log(err)
  });return response
}



