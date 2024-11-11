// src/WhatsAppSender.js
import React, { useState } from "react";
import axios from "axios";
import { tokenWAAPI, phoneNumberId } from "./config";

const WhatsAppSender = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState(null);

  const sendMessage = async () => {
    const url = `https://graph.facebook.com/v15.0/${phoneNumberId}/messages`;

    const data = {
      messaging_product: "whatsapp",
      to: phoneNumber,
      type: "text",
      text: {
        body: message,
      },
    };

    const headers = {
      Authorization: `Bearer ${tokenWAAPI}`,
      "Content-Type": "application/json",
    };

    try {
      const response = await axios.post(url, data, { headers });
      setResponse(response.data);
    } catch (error) {
      setResponse(error.response ? error.response.data : error.message);
    }
  };

  

  return (
    <div>
      <h1>Kirim Pesan WhatsApp</h1>
      <input
        type="text"
        placeholder="Nomor Telepon"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <textarea
        placeholder="Pesan"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Kirim Pesan</button>
      {response && (
        <div>
          <h2>Respons:</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default WhatsAppSender;
