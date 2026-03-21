import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import { useAuths } from '../hooks/useAuth'
import { useSelector } from 'react-redux'
const Register = () => {
    let [username,setUsername]=useState('')
    let [email,setEmail]=useState('')
    let [password,setPassword]=useState('')
    let auth=useAuths()
    let navigate=useNavigate()
    let user=useSelector(state=>state.auth.user)
    let loading=useSelector(state=>state.auth.isLoading)

    let subHandler=async (e) => {
        e.preventDefault()
        let payload={
            username,email,password
        }
        await auth.handleRegister(payload)
         navigate("/")
         
    }
     if(!loading && user){
        return <Navigate to='/' replace />
     }
    return (
        <div className="min-h-screen bg-[#05070A] text-white font-sans flex flex-col justify-between p-6 md:p-6  overflow-hidden relative">
          {/* Background Glows */}
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />
          
          {/* Navbar */}
          <nav className="flex justify-between items-center z-10">
            <div className="text-xl font-bold tracking-tight">Ethereal AI</div>
            
          </nav>
    
          {/* Main Content */}
          <main className="flex flex-col lg:flex-row items-center justify-between gap-12 z-10 flex-grow mt-12 lg:mt-0">
            
            {/* Left Side: Hero */}
            <div className="max-w-xl ml-[50px]">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 flex items-center gap-1">
                  ✨ Intelligence Curator
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-6 tracking-tight">
                Build Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-400">
                  Second Brain
                </span>
              </h1>
              
              <p className="text-gray-400 text-3xl leading-relaxed mb-10 max-w-md">
                Save, organize, and rediscover your knowledge with AI. Ethereal AI transforms 
                scattered notes into a structured ecosystem of thought.
              </p>
    
   
            </div>
    
            {/* Right Side: Form Card */}
            <div className="w-full max-w-md mr-[50px] bg-[#0D1117]/80 backdrop-blur-xl p-10 rounded-[32px] border border-white/5 shadow-2xl">
              <div className="text-center mb-10">
                <h2 className="text-2xl font-semibold mb-2">Initialize Consciousness</h2>
                <p className="text-gray-500 text-sm">Join the network of thinkers today.</p>
              </div>
    
              <form 
              onSubmit={(e)=>subHandler(e)}
              className="space-y-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">User Name</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e)=>setUsername(e.target.value)}
                    placeholder="Johnathan Doe" 
                    className="w-full bg-[#05070A] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/50 transition"
                  />
                </div>
    
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    placeholder="john@email.com" 
                    className="w-full bg-[#05070A] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/50 transition"
                  />
                </div>
    
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Password</label>
                    <input 
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    type="password" placeholder="••••••••" className="w-full bg-[#05070A] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/50 transition" />
                  </div>
                  
                </div>
    
                <button className="w-full bg-gradient-to-r from-[#7C3AED] to-[#2563EB] hover:opacity-90 py-3 rounded-xl font-semibold text-sm transition shadow-lg shadow-purple-500/20">
                  Create Account
                </button>
    
                
    
                
                <p className="text-center text-sm text-gray-500 mt-4">
                  {/* Already have an account? <a href="#" className="text-purple-400 font-medium hover:underline">Sign In</a> */}
                  Already have an account?<Link 
                  to="/login"
                  className="text-purple-400 font-medium hover:underline">Sign In</Link>
                </p>
              </form>
            </div>
          </main>
    
  
        </div>
      );
}

export default Register