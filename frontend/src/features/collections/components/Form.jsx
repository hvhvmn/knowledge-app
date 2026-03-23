import React, { useState } from 'react';
import { Sparkles, Folder, Brain, Zap, Wand2, Bell, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useCollections } from '../hooks/useCollection';

const Form = () => {
  
  let collection=useCollections()
  let navigate=useNavigate()
let [collectionName,setCollectionName]=useState('')
  const handleSubmit = async(e) => {
    e.preventDefault();
   await collection.handleCreateCollection({collectionName})
     navigate("/collections")
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[160px] pointer-events-none" />
      
      {/* Navbar (Static Header)
      <nav className="absolute top-0 left-0 right-0 flex justify-between items-center p-6  z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-[#23232C] border border-white/5 flex items-center justify-center shadow-inner">
            <Sparkles size={16} className="text-purple-400" />
          </div>
          <span className="text-xl font-bold tracking-tight">Ethereal AI</span>
        </div>
        <div className="flex items-center gap-6">
          <Search size={18} className="text-gray-500 hover:text-white cursor-pointer" />
          <div className="relative">
            <Bell size={18} className="text-gray-500 hover:text-white cursor-pointer" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full border border-[#030303]" />
          </div>
          <div className="w-8 h-8 rounded-full bg-orange-200 border border-white/5 overflow-hidden">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
          </div>
        </div>
      </nav> */}

      {/* --- Main Modal Card --- */}
      <div className="w-fit bg-[#0D0D14]/80 backdrop-blur-xl  rounded-[32px] p-6 border border-white/5 shadow-2xl z-10 relative group">
        
        {/* Top Badge
        <div className="flex justify-center mb-[-20px]">
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#1A1A26] border border-white/5 shadow-inner">
            <Sparkles size={12} className="text-purple-400" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">New Collection</span>
          </div>
        </div> */}

        {/* Title and Subtitle */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tighter leading-tight">Create New Collection</h1>
          <p className="text-gray-500 text-base max-w-sm mx-auto leading-relaxed">
            Organize your knowledge into meaningful groups and access it effortlessly.
          </p>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Collection Name */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-gray-500 mb-3 ml-1">
              Collection Name <span className="text-red-400 ml-0.5">*</span>
            </label>
            <input 
              required
              type="text"
              value={collectionName}
              onChange={(e)=>setCollectionName(e.target.value)} 
              placeholder="e.g. AI, Web Development, Startup Ideas" 
              className="w-full bg-[#030303] border border-white/5 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-purple-500/40 transition placeholder:text-gray-700"
            />
          </div>

          


          {/* Form Actions */}
          <div className="flex justify-end items-center gap-6 pt-10 border-t border-white/5">
            <button type="button" ></button>
            <Link
            to="/collections"
            className="text-[10px] font-bold text-gray-500 hover:text-white transition uppercase tracking-[0.2em]">Cancel</Link>
            <button type="submit" className="bg-gradient-to-r from-[#A78BFA] to-[#C4B5FD] hover:opacity-95 text-[#030303] px-10 py-3.5 rounded-xl font-bold text-sm transition shadow-lg shadow-purple-500/10 min-w-[200px] flex justify-center items-center gap-2">
              Create Collection
            </button>
          </div>
        </form>
      </div>

      {/* Large Blurred Footer Text */}
      {/* <div className="absolute bottom-[-80px] left-1/2 -translate-x-1/2 select-none z-0 pointer-events-none">
        <h2 className="text-[260px] font-black uppercase tracking-[0.1em] text-white opacity-[0.03] blur-sm">
          ETHEREAL
        </h2>
      </div> */}
    </div>
  );
};

export default Form;