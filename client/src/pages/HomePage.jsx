import React, { useContext } from 'react'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'
import bg from '../assets/bg.jpg'
import { ChatContext } from '../../context/ChatContext'

const HomePage = () => {

  const { selectedUser, messages } = useContext(ChatContext)

  return (
    <div
      className="w-full h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="w-full h-full flex items-center justify-center bg-black/20">
        <div className="w-full max-w-6xl h-[85vh] px-4">
          <div
            className="
              h-full grid grid-cols-[260px_1fr_260px]
              backdrop-blur-md bg-white/10
              border border-white/20
              rounded-xl overflow-hidden
            "
          >
            <Sidebar />
            <ChatContainer />
            <RightSidebar
              selectedUser={selectedUser}
              messages={messages}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
