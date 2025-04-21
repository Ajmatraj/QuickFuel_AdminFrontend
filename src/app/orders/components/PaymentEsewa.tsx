import React, { forwardRef } from "react";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";

interface PaymentEsewaProps {
  amount: number;
}

const PaymentEsewa = forwardRef<HTMLFormElement, PaymentEsewaProps>(
  ({ amount }, ref) => {
    const transaction_uuid = uuidv4();
    const tax_amount = 10;
    const service_charge = 0;
    const delivery_charge = 0;
    const total_amount = amount + tax_amount + service_charge + delivery_charge;
    const product_code = "EPAYTEST";

    const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
    const secretKey = "8gBm/:&EnhH.1/q";
    const hash = CryptoJS.HmacSHA256(message, secretKey);
    const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);

    return (
      <>
        <form
        className="hidden"
          ref={ref}
          action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
          method="POST"
        >
          <input type="text" name="amount" defaultValue={amount} required />
          <input type="text" name="tax_amount" defaultValue={10} required />
          <input type="text" name="total_amount" defaultValue={total_amount} required />
          <input type="text" name="transaction_uuid" defaultValue={transaction_uuid} required />
          <input type="text" name="product_code" defaultValue={product_code} required />
          <input type="text" name="product_service_charge" defaultValue={0} required />
          <input type="text" name="product_delivery_charge" defaultValue={0} required />
          <input type="text" name="success_url" defaultValue="https://developer.esewa.com.np/success" required />
          <input type="text" name="failure_url" defaultValue="http://localhost:3000/orders/" required />
          <input type="text" name="signed_field_names" defaultValue="total_amount,transaction_uuid,product_code" required />
          <input type="text" name="signature" defaultValue={hashInBase64} required />
        </form>
      </>
    );
  }
);

PaymentEsewa.displayName = "PaymentEsewa"; // for Next.js HMR friendliness

export default PaymentEsewa;
