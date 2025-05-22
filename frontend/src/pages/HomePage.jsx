// frontend/src/pages/HomePage.jsx
import { useEffect } from "react"; // ⭐ Import useEffect ⭐
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore"; // ⭐ Import useAuthStore ⭐
import { toast } from "react-hot-toast"; // ⭐ Import toast ⭐

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();
  const { socket } = useAuthStore(); // ⭐ Get the socket instance from useAuthStore ⭐

  // ⭐ NEW: useEffect for Socket.IO toast listener in HomePage ⭐
  useEffect(() => {
    // Ensure the socket is connected and available before trying to listen
    if (!socket || !socket.connected) {
      // If socket is not connected yet, it will connect via checkAuth/login/signup.
      // This effect will re-run when `socket` changes, and the listener will be set up then.
      return;
    }

    // Listen for the 'adminOnlineToast' event
    socket.on("adminOnlineToast", (data) => {
      if (data.message) {
        toast.success(data.message, {
          duration: 3000, // Show for 3 seconds
          position: "top-center", // You can adjust toast position
        });
      }
    });

    // Clean up the socket listener when the component unmounts
    return () => {
      socket.off("adminOnlineToast"); // Remove the specific listener
      // DO NOT call socket.disconnect() here! The socket is managed globally by useAuthStore.
    };
  }, [socket]); // Depend on 'socket' to re-run this effect if the socket instance changes

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
