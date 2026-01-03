import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { ChatContext } from '../../context/ChatContext'

const Sidebar = () => {

  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    clearUnseenMessages
  } = useContext(ChatContext)

  const { logout, onlineUsers } = useContext(AuthContext)

  const [input, setInput] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    getUsers()
  }, [onlineUsers])

  const filteredUsers = input
    ? users.filter(user =>
        user.fullName.toLowerCase().includes(input.toLowerCase())
      )
    : users

  return (
    <div
      className={`bg-[#8185B2]/10 h-full p-5 overflow-y-auto text-white
      ${selectedUser ? 'max-md:hidden' : ''}`}
    >
      {/* Header */}
      <div className="pb-5">
        <div className="flex justify-between items-center">

          <div className="flex items-center gap-2">
            <img src={assets.logo_icon} className="w-8 h-8" />
            <span className="text-lg font-semibold">K-Chat</span>
          </div>

          <div className="relative group">
            <img src={assets.menu_icon} className="w-5 cursor-pointer" />

            <div className="absolute top-full right-0 z-20 w-32 p-4 rounded-md
              bg-[#282142]/90 border border-white/10 hidden group-hover:block">
              <p
                onClick={() => navigate('/profile')}
                className="cursor-pointer text-sm hover:text-white"
              >
                Edit Profile
              </p>
              <hr className="my-2 border-white/10" />
              <p
                onClick={logout}
                className="cursor-pointer text-sm hover:text-red-400"
              >
                Logout
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
          <img src={assets.search_icon} className="w-3" />
          <input
            type="text"
            placeholder="Search user..."
            onChange={(e) => setInput(e.target.value)}
            className="bg-transparent outline-none text-white text-sm flex-1"
          />
        </div>
      </div>

      {/* Users List */}
      <div className="flex flex-col gap-2">
        {filteredUsers.map((user) => {

          const isOnline = onlineUsers.includes(user._id)
          const unreadCount = unseenMessages[user._id] || 0

          return (
            <div
              key={user._id}
              onClick={() => {
                setSelectedUser(user)
                clearUnseenMessages(user._id) 
              }}
              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer
              hover:bg-white/5
              ${selectedUser?._id === user._id ? 'bg-[#282142]/50' : ''}`}
            >
              {/* LEFT */}
              <div className="flex items-center gap-3">
                <img
                  src={user.profilePic || assets.avatar_icon}
                  className="w-[35px] h-[35px] rounded-full"
                />

                <div>
                  <p className="text-sm font-medium">{user.fullName}</p>
                  <p className={`text-xs ${
                    isOnline ? 'text-green-400' : 'text-neutral-400'
                  }`}>
                    {isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>

              {/*  UNSEEN BADGE */}
              {unreadCount > 0 && (
                <span className="min-w-[20px] h-5 px-1 flex items-center justify-center
                  rounded-full bg-violet-500 text-white text-xs">
                  {unreadCount}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Sidebar
