import React from "react";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";

const PaymentEsewa = () => {
  const transaction_uuid = uuidv4();
  const amount = 100;
  const tax_amount = 10;
  const service_charge = 0;
  const delivery_charge = 0;
  const total_amount = amount + tax_amount + service_charge + delivery_charge; 
  const product_code = "EPAYTEST";
  const success_url = "https://developer.esewa.com.np/success";
  const failure_url = "https://developer.esewa.com.np/failure";
  const signed_field_names = "amount,tax_amount,total_amount,transaction_uuid,product_code,product_service_charge,product_delivery_charge,success_url,failure_url";

  // Correct message format
  const message = `amount=${amount},tax_amount=${tax_amount},total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code},product_service_charge=${service_charge},product_delivery_charge=${delivery_charge},success_url=${success_url},failure_url=${failure_url},signed_field_names=${signed_field_names}`;

  // Correctly encode secret key and generate HMAC signature
  const secretKey = "8gBm/:&EnhH.1/q"; // Ensure this is correct
  const hash = CryptoJS.HmacSHA256(message, secretKey);
  const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
  console.log(hashInBase64);

  return (
    <>
      PaymentEsewa
      <form action="https://rc-epay.esewa.com.np/api/epay/main/v2/form" method="POST">
        <input type="text" name="amount" defaultValue={amount} required />
        <input type="text" name="tax_amount" defaultValue={tax_amount} required />
        <input type="text" name="total_amount" defaultValue={total_amount} required />
        <input type="text" name="transaction_uuid" defaultValue={transaction_uuid} required />
        <input type="text" name="product_code" defaultValue={product_code} required />
        <input type="text" name="product_service_charge" defaultValue={service_charge} required />
        <input type="text" name="product_delivery_charge" defaultValue={delivery_charge} required />
        <input type="text" name="success_url" defaultValue={success_url} required />
        <input type="text" name="failure_url" defaultValue={failure_url} required />
        <input type="text" name="signed_field_names" defaultValue={signed_field_names} required />
        <input type="text" name="signature" defaultValue={hashInBase64} required />
        <input defaultValue="Submit" type="submit" />
      </form>
    </>
  );
};

export default PaymentEsewa;
