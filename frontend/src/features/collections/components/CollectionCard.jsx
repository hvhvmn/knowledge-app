import React, { useEffect, useState } from 'react'
import { Folder, Trash2, MoreVertical } from "lucide-react";
import { useCollections } from '../hooks/useCollection';
import { useNavigate } from 'react-router';
const CollectionCard = ({elem,handleDelete}) => {
let collection=useCollections()
let navigate=useNavigate()

const handleCardClick=(e)=>{
  // Don't navigate if clicking on delete or more button
  if(e.target.closest('button')){
    return
  }
  navigate(`/collections/${elem._id}`)
}

  return (
    <div onClick={handleCardClick} className="bg-[#0D1117]/50 border border-white/5 rounded-[28px] p-6 hover:bg-[#161B22]/60 transition-all duration-300 group cursor-pointer hover:border-white/10 hover:shadow-xl hover:shadow-purple-500/10 relative overflow-hidden">

    {/* Glow Effect */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 blur-2xl" />
  
    {/* Top Section */}
    <div className="flex items-center justify-between mb-5 relative z-10">
      
      {/* Icon */}
      <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
        📂
      </div>
  
      {/* Actions */}
      <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition">
  
        {/* DELETE BUTTON */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(elem._id);
          }}
          className="text-gray-600 hover:text-red-400 transition"
        >
          <Trash2 size={16} />
        </button>
  
        {/* More */}
        <button className="text-gray-600 hover:text-white" onClick={(e)=>e.stopPropagation()}>
          ⋮
        </button>
      </div>
    </div>
  
    {/* Title */}
    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-purple-300 transition">
      {elem.collectionName}
    </h3>
  
    {/* Description */}
    <p className="text-xs text-gray-500 mb-4 line-clamp-2">
      {elem.description || "Organize your saved knowledge efficiently."}
    </p>
  
    {/* Bottom Section */}
    <div className="flex justify-between items-center pt-4 border-t border-white/5 text-xs text-gray-500">
      
  
      <span className="group-hover:text-purple-400 transition">
        Open →
      </span>
    </div>
  </div>
  )
}

export default CollectionCard