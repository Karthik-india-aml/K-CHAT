import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign up")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false)

  const { login } = useContext(AuthContext)

  const onSubmitHandler = (e) => {
    e.preventDefault()

    if (currState === "Sign up" && !isDataSubmitted) {
      setIsDataSubmitted(true)
      return
    }

    login(
      currState === "Sign up" ? "signup" : "login",
      { fullName, email, password, bio }
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/40 backdrop-blur-2xl">

      <div className="flex items-center gap-24">

        {/* LEFT */}
        <div className="flex flex-col items-center gap-2">
          <img src={assets.favicon} className="w-24" />
          <h1 className="text-white text-3xl font-bold">K-Chat</h1>
        </div>

        {/* RIGHT */}
        <form
          onSubmit={onSubmitHandler}
          className="w-[320px] p-6 rounded-xl bg-white/10 border border-white/20
          flex flex-col gap-4 text-white"
        >
          <h2 className="text-2xl font-medium flex justify-between items-center">
            {currState}
            {isDataSubmitted && (
              <img
                src={assets.arrow_icon}
                onClick={() => setIsDataSubmitted(false)}
                className="w-5 cursor-pointer"
              />
            )}
          </h2>

          {currState === "Sign up" && !isDataSubmitted && (
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
              className="p-2 rounded-md bg-transparent border border-gray-400
              focus:outline-none focus:ring-1 focus:ring-indigo-400"
              required
            />
          )}

          {!isDataSubmitted && (
            <>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                type="email"
                className="p-2 rounded-md bg-transparent border border-gray-400
                focus:outline-none focus:ring-1 focus:ring-indigo-400"
                required
              />

              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                type="password"
                className="p-2 rounded-md bg-transparent border border-gray-400
                focus:outline-none focus:ring-1 focus:ring-indigo-400"
                required
              />
            </>
          )}

          {currState === "Sign up" && isDataSubmitted && (
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder="Tell us about yourself..."
              className="p-2 rounded-md bg-transparent border border-gray-400
              focus:outline-none focus:ring-1 focus:ring-indigo-400"
              required
            />
          )}

          <button
            type="submit"
            className="py-3 rounded-md bg-gradient-to-r from-purple-500 to-violet-600
            font-medium hover:opacity-90"
          >
            {currState === "Sign up" ? "Create Account" : "Login Now"}
          </button>

          <p className="text-sm text-center text-gray-300">
            {currState === "Sign up" ? (
              <>
                Already have an account?{" "}
                <span
                  onClick={() => {
                    setCurrState("Login")
                    setIsDataSubmitted(false)
                  }}
                  className="text-violet-400 cursor-pointer"
                >
                  Login here
                </span>
              </>
            ) : (
              <>
                Create an account{" "}
                <span
                  onClick={() => setCurrState("Sign up")}
                  className="text-violet-400 cursor-pointer"
                >
                  Click here
                </span>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
