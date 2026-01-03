import React, { useContext, useMemo } from 'react'
import assets from '../assets/assets'
import { ChatContext } from '../../context/ChatContext'

const RightSidebar = ({ selectedUser }) => {

  const { messages } = useContext(ChatContext)

  
  const sharedImages = useMemo(() => {
    if (!messages) return []
    return messages.filter(msg => msg.image)
  }, [messages])

  if (!selectedUser) return null

  return (
    <div
      className={`bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll 
      max-md:hidden`}
    >

      {/* PROFILE */}
      <div className='pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto'>
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          className='w-20 aspect-[1/1] rounded-full'
        />

        <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2'>
          <span className='w-2 h-2 rounded-full bg-green-500'></span>
          {selectedUser.fullName}
        </h1>

        <p className='px-10 mx-auto text-center'>
          {selectedUser.bio || "Hey there! I am using K-Chat"}
        </p>
      </div>

      <hr className='border-[#ffffff50] my-4' />

      {/* MEDIA */}
      <div className='px-5 text-xs'>
        <p>Media</p>

        {sharedImages.length === 0 ? (
          <p className="mt-4 text-gray-400 text-center">
            No media shared yet
          </p>
        ) : (
          <div className='mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80'>
            {sharedImages.map((msg, index) => (
              <div
                key={index}
                onClick={() => window.open(msg.image)}
                className='cursor-pointer rounded'
              >
                <img
                  src={msg.image}
                  className='h-full rounded-md'
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default RightSidebar
