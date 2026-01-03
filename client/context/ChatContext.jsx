import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket, axios } = useContext(AuthContext);

  // ===============================
  // GET USERS FOR SIDEBAR
  // ===============================
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ===============================
  // GET MESSAGES (OPEN CHAT)
  // ===============================
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages);

        // 🔥 CLEAR UNSEEN WHEN CHAT OPENED
        setUnseenMessages(prev => {
          const updated = { ...prev };
          delete updated[userId];
          return updated;
        });
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ===============================
  // SEND MESSAGE
  // ===============================
  const sendMessage = async (messageData) => {
    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );

      if (data.success) {
        setMessages(prev => [...prev, data.newMessage]);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ===============================
  // CLEAR UNSEEN (SIDEBAR CLICK)
  // ===============================
  const clearUnseenMessages = (userId) => {
    setUnseenMessages(prev => {
      const updated = { ...prev };
      delete updated[userId];
      return updated;
    });
  };

  // ===============================
  // SOCKET: RECEIVE MESSAGES
  // ===============================
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = async (newMessage) => {
      // IF CURRENT CHAT IS OPEN
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        setMessages(prev => [...prev, newMessage]);

        // MARK AS SEEN
        await axios.put(`/api/messages/mark/${newMessage._id}`);
      } else {
        // SHOW UNSEEN COUNT
        setUnseenMessages(prev => ({
          ...prev,
          [newMessage.senderId]:
            (prev[newMessage.senderId] || 0) + 1,
        }));
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedUser]);

  // ===============================
  // CONTEXT PROVIDER
  // ===============================
  return (
    <ChatContext.Provider
      value={{
        messages,
        users,
        selectedUser,
        unseenMessages,
        getUsers,
        getMessages,
        sendMessage,
        setSelectedUser,
        clearUnseenMessages,
      }}>
      {children}
    </ChatContext.Provider>
  );
};
