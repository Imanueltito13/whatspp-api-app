import React, { useState } from "react";
import axios from "axios";
import { tokenWAAPI, phoneNumberId } from "./config";

const WhatsAppSender = () => {
  const [phoneNumbers, setPhoneNumbers] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState([]);
  const [batchProgress, setBatchProgress] = useState(0);

  // Format nomor telepon
  const formatPhoneNumber = (number) => {
    let formatted = number.replace(/\D/g, "");
    if (formatted.startsWith("0")) {
      formatted = `62${formatted.slice(1)}`;
    } else if (!formatted.startsWith("62")) {
      formatted = `62${formatted}`;
    }
    return formatted;
  };

  // Validasi single nomor
  const validateSingleNumber = (number) => {
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(number.replace(/\D/g, ""));
  };

  // Kirim pesan ke satu nomor
  const sendSingleMessage = async (phoneNumber) => {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    const url = `https://graph.facebook.com/v15.0/${phoneNumberId}/messages`;
    const data = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: formattedPhone,
      type: "text",
      text: {
        preview_url: false,
        body: message,
      },
    };

    const headers = {
      Authorization: `Bearer ${tokenWAAPI}`,
      "Content-Type": "application/json",
    };

    try {
      const response = await axios.post(url, data, { headers });
      return {
        success: true,
        phone: phoneNumber,
        response: response.data,
      };
    } catch (error) {
      console.error(`Error sending to ${phoneNumber}:`, error);
      return {
        success: false,
        phone: phoneNumber,
        error: error.response?.data?.error?.message || error.message,
      };
    }
  };

  // Kirim pesan ke multiple nomor
  const sendBatchMessages = async () => {
    setLoading(true);
    setStatus([]);
    setBatchProgress(0);

    // Split dan bersihkan nomor telepon
    const numbers = phoneNumbers
      .split(",")
      .map((num) => num.trim())
      .filter((num) => num.length > 0);

    const results = [];
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    for (let i = 0; i < numbers.length; i++) {
      const number = numbers[i];

      // Skip nomor yang tidak valid
      if (!validateSingleNumber(number)) {
        results.push({
          success: false,
          phone: number,
          error: "Nomor telepon tidak valid",
        });
        continue;
      }

      // Kirim pesan dan tunggu hasil
      const result = await sendSingleMessage(number);
      results.push(result);

      // Update progress
      setBatchProgress(((i + 1) / numbers.length) * 100);
      setStatus(results);

      // Delay 1 detik antara setiap pengiriman untuk menghindari rate limiting
      if (i < numbers.length - 1) {
        await delay(1000);
      }
    }

    setLoading(false);
  };

  const validateForm = () => {
    return (
      phoneNumbers.trim().length > 0 &&
      message.trim().length > 0 &&
      phoneNumbers.split(",").some((num) => validateSingleNumber(num.trim()))
    );
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Kirim Pesan WhatsApp Massal
      </h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nomor Telepon (pisahkan dengan koma)
          </label>
          <textarea
            placeholder="Contoh: 081234567890, 082345678901, 083456789012"
            value={phoneNumbers}
            onChange={(e) => setPhoneNumbers(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Format: 08xxx atau 62xxx, pisahkan dengan koma untuk multiple nomor
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pesan
          </label>
          <textarea
            placeholder="Ketik pesan Anda di sini..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
            disabled={loading}
          />
        </div>

        <button
          onClick={sendBatchMessages}
          disabled={!validateForm() || loading}
          className={`w-full py-2 px-4 rounded-md transition-colors relative ${
            !validateForm() || loading
              ? "bg-gray-300 cursor-not-allowed text-gray-500"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Mengirim... ({Math.round(batchProgress)}%)
            </span>
          ) : (
            "Kirim Pesan"
          )}
        </button>

        {/* Progress Bar */}
        {loading && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${batchProgress}%` }}
            ></div>
          </div>
        )}

        {/* Status Messages */}
        {status.length > 0 && (
          <div className="mt-6 space-y-2">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              Status Pengiriman:
            </h2>
            {status.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-md ${
                  result.success
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                <div className="font-medium">
                  {result.phone} - {result.success ? "Berhasil" : "Gagal"}
                </div>
                {!result.success && (
                  <div className="text-sm mt-1">{result.error}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppSender;
