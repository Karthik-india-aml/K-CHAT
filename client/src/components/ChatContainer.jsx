import React, { useEffect, useRef, useState, useContext } from 'react'
import assets from '../assets/assets'
import { formalMessageTime } from '../lib/utils'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'

const ChatContainer = () => {
  const { messages, getMessages, sendMessage, selectedUser, setSelectedUser } =
    useContext(ChatContext)

  const { authUser } = useContext(AuthContext)

  const [text, setText] = useState("")
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)

  const scrollEnd = useRef(null)

  /* Load messages when user selected */
  useEffect(() => {
    if (selectedUser) getMessages(selectedUser._id)
  }, [selectedUser])

  /* Auto scroll */
  useEffect(() => {
    scrollEnd.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  /* Handle image upload */
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setImage(reader.result)
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  /* Send message */
  const handleSend = () => {
    if (!text.trim() && !image) return

    sendMessage({ text, image })

    setText("")
    setImage(null)
    setPreview(null)
  }

  /* Empty state */
  if (!selectedUser) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
        <img src={assets.logo_icon} className="max-w-16" />
        <p className="text-lg font-medium text-white">
          Chat anytime, anywhere
        </p>
      </div>
    )
  }

  return (
    <div className="h-full overflow-hidden relative backdrop-blur-lg">

      {/* HEADER */}
      <div className="flex items-center gap-3 py-3 px-4 border-b border-stone-500">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          className="w-8 h-8 rounded-full"
        />
        <p className="flex-1 text-lg text-white">
          {selectedUser.fullName}
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          className="md:hidden w-5 cursor-pointer"
        />
      </div>

      {/* MESSAGES */}
      <div className="flex flex-col h-[calc(100%-90px)] overflow-y-auto px-6 py-4">
        {messages.map(msg => {
          const isMe = msg.senderId === authUser._id

          return (
            <div
              key={msg._id}
              className={`flex mb-2 ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`px-3 py-2 max-w-[220px] text-sm text-white rounded-lg
                ${isMe ? 'bg-violet-500/30' : 'bg-white/10'}`}
              >
                {/* IMAGE */}
                {msg.image && (
                  <img
                    src={msg.image}
                    className="rounded-md mb-1 max-w-full"
                  />
                )}

                {/* TEXT */}
                {msg.text && (
                  <span className="block leading-snug">
                    {msg.text}
                  </span>
                )}

                {/* TIME */}
                <span className="block text-[10px] text-gray-400 text-right leading-none mt-[2px]">
                  {formalMessageTime(msg.createdAt)}
                </span>
              </div>
            </div>
          )
        })}
        <div ref={scrollEnd} />
      </div>

      {/* IMAGE PREVIEW */}
      {preview && (
        <div className="absolute bottom-20 left-4">
          <img
            src={preview}
            className="w-24 h-24 rounded-md border border-white/20"
          />
        </div>
      )}

      {/* INPUT */}
      <div className="absolute bottom-0 left-0 right-0 flex gap-3 p-3">
        <div className="flex-1 flex items-center bg-gray-100/10 px-3 rounded-lg">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Send a message"
            className="flex-1 bg-transparent p-3 text-white outline-none"
          />

          <input
            type="file"
            id="image"
            accept="image/png, image/jpeg"
            hidden
            onChange={handleImageChange}
          />

          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              className="w-5 mr-2 cursor-pointer"
            />
          </label>
        </div>

        <img
          src={assets.send_button}
          className="w-7 cursor-pointer"
          onClick={handleSend}
        />
      </div>
    </div>
  )
}

export default ChatContainer
