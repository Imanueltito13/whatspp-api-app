import React, { useState, useEffect } from "react";
import axios from "axios";
import { Camera, MessageCircle, Phone, X } from "lucide-react";

const WhatsAppDashboard = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [recipientNumber, setRecipientNumber] = useState("");

  useEffect(() => {
    // Fetch contacts from WhatsApp Business API
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get("/api/whatsapp/contacts", {
        params: {
          business_account_id: "508295382360221",
        },
      });
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const handleContactSelect = (contact) => {
    if (selectedContacts.includes(contact)) {
      setSelectedContacts(selectedContacts.filter((c) => c !== contact));
    } else {
      setSelectedContacts([...selectedContacts, contact]);
    }
  };

  const handleSendMessage = async () => {
    try {
      await axios.post("/api/whatsapp/send-message", {
        business_account_id: "508295382360221",
        phone_number_id: "457589837444535",
        to: recipientNumber || selectedContacts.map((c) => c.phone_number),
        message: newMessage,
      });
      setMessages([...messages, { sender: "Me", text: newMessage }]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">WhatsApp Business Dashboard</h1>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-medium mb-4">Contacts</h2>
          <ul className="space-y-2">
            {contacts.map((contact) => (
              <li
                key={contact.phone_number}
                className={`flex items-center p-3 rounded-md cursor-pointer ${
                  selectedContacts.includes(contact)
                    ? "bg-gray-200"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => handleContactSelect(contact)}
              >
                <div className="flex-1">
                  <div className="font-medium">{contact.name}</div>
                  <div className="text-gray-500">{contact.phone_number}</div>
                </div>
                {selectedContacts.includes(contact) && (
                  <X className="text-gray-500 hover:text-gray-700" />
                )}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-medium mb-4">Conversation</h2>
          <div className="bg-gray-100 p-4 rounded-md h-80 overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-end mb-2 ${
                  message.sender === "Me" ? "justify-end" : ""
                }`}
              >
                <div
                  className={`bg-white px-4 py-2 rounded-md max-w-[70%] ${
                    message.sender === "Me"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center">
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
            />
            <input
              type="text"
              placeholder="Recipient number (optional)"
              value={recipientNumber}
              onChange={(e) => setRecipientNumber(e.target.value)}
              className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
            >
              <MessageCircle className="mr-2" />
              Send
            </button>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-between items-center">
        <div className="flex items-center">
          <Phone className="mr-2" />
          <span>Contact {selectedContacts.length} number(s)</span>
        </div>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center">
          <Camera className="mr-2" />
          Take Photo
        </button>
      </div>
    </div>
  );
};

export default WhatsAppDashboard;
