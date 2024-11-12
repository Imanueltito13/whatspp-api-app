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
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Kirim Pesan WhatsApp
      </h1>
      <div className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Nomor Telepon"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <textarea
            placeholder="Pesan"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
          />
        </div>
        <button
          onClick={sendMessage}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          Kirim Pesan
        </button>
      </div>
      {response && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Respons:</h2>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default WhatsAppSender;
