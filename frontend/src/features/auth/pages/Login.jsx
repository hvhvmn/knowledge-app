import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router';
import { useAuths } from '../hooks/useAuth';
import { useSelector } from 'react-redux';
const Login = () => {
    let [email,setEmail]=useState("")
    let [password,setPassword]=useState("")
    const [showPassword, setShowPassword] = useState(false);
    let auth=useAuths()
    let user=useSelector(state=>state.auth.user)
    let loading=useSelector(state=>state.auth.isLoading)
    let navigate=useNavigate()
    let subHandler=async(e)=>{
        e.preventDefault()
        let payload={
            email,password
        }
      let res= await auth.handleLogin(payload)
   if(res){
    navigate("/")
   }    
    }
  if(!loading && user){
    return <Navigate to="/" replace/>
  }
    return (
        <div className="min-h-screen bg-[#05070A] text-white font-sans flex flex-col justify-between p-6 md:p-6 overflow-hidden relative">
          {/* Subtle Background Glows */}
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />
          
          {/* Navbar */}
          <nav className="flex justify-between items-center z-10">
            <div className="text-xl font-bold tracking-tight">Ethereal AI</div>
          
          </nav>
    
          {/* Main Content */}
          <main className="flex flex-col lg:flex-row items-center justify-between gap-12 z-10 flex-grow">
            
            {/* Left Side: Hero */}
            <div className="max-w-xl ml-[50px]">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">
                ✨ Intelligence Curator
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] mb-8 tracking-tight">
                Welcome <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-400">
                  Back
                </span>
              </h1>   
              <p className="text-gray-400 text-3xl leading-relaxed mb-12 ">
              Access your knowledge, organized and powered by AI.
Experience the next evolution of curated intelligence.
Your ideas, insights, and memories—intelligently connected in one place
              </p>
    
              
            </div>
    
            {/* Right Side: Sign In Card */}
            <div className="w-full max-w-md bg-[#0D1117]/60 backdrop-blur-2xl p-12 rounded-[32px] mr-[50px] border border-white/5 shadow-2xl">
              <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-2">Sign In</h2>
                <p className="text-gray-500 text-sm">Enter your credentials to continue</p>
              </div>
    
              <form 
              onSubmit={(e)=>subHandler(e)}
              className="space-y-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-3">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-purple-400 transition" />
                    <input 
                      type="email" 
                      placeholder="you@example.com" 
                      value={email}
                      onChange={(e)=>setEmail(e.target.value)}
                      className="w-full bg-[#05070A] border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-purple-500/50 transition"
                    />
                  </div>
                </div>
    
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Password</label>
                  
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-purple-400 transition" />
                    <input 
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      className="w-full bg-[#05070A] border border-white/10 rounded-xl pl-12 pr-12 py-4 text-sm focus:outline-none focus:border-purple-500/50 transition"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
    
                <button className="w-full bg-gradient-to-r from-[#7C3AED] to-[#2563EB] hover:opacity-90 py-4 rounded-xl font-bold text-sm transition shadow-lg shadow-blue-500/20">
                  Sign In
                </button>                
              </form>
    
              <p className="text-center text-sm text-gray-500 mt-10">
                Don't have an account? 
                <Link to="/register" className="text-purple-400 font-medium hover:underline">Register</Link>
              </p>
            </div>
          </main>
    
                  </div>
      );
}

export default Login