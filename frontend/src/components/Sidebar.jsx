// frontend/src/components/Sidebar.jsx
import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore"; // Import useAuthStore
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import { toast } from "react-hot-toast"; // ⭐ Import toast ⭐

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  // ⭐ Access the socket instance from useAuthStore ⭐
  const authStore = useAuthStore();
  const socket = authStore.socket; // Get the socket from the store state

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // ⭐ NEW: useEffect for Socket.IO toast listener using the shared socket ⭐
  useEffect(() => {
    // Ensure the socket is connected and available before trying to listen
    if (!socket || !socket.connected) {
      // If socket is not connected yet, try again when authUser is set
      // (This usually happens after checkAuth/login/signup)
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
    // or when the socket instance changes (though it typically won't)
    return () => {
      socket.off("adminOnlineToast"); // Remove the specific listener
      // DO NOT call socket.disconnect() here!
      // The socket connection is managed globally by useAuthStore.
      // Disconnecting it here would affect other parts of your app.
    };
  }, [socket, authStore.authUser]); // Depend on socket and authUser to re-run if they change
  // This ensures the listener is set up once the socket is ready.

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1} online)
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${
                selectedUser?._id === user._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.fullName}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;
