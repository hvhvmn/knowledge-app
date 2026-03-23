import React from 'react';
import { 
  Share2, 
  Bookmark, 
  Trash2, 
  Play, 
  FileText, 
  Image as ImageIcon, 
  MessageSquare, 
  Link as LinkIcon 
} from 'lucide-react';
import { useItems } from '../hooks/useItems';

const ItemsCard = ({ elem }) => {
  // Function to render the correct icon based on content type

  const renderTypeIcon = (type) => {
    const iconSize = 16;
    switch (type?.toLowerCase()) {
      case 'video': return <Play size={iconSize} fill="currentColor" />;
      case 'article': return <FileText size={iconSize} />;
      case 'image': return <ImageIcon size={iconSize} />;
      case 'tweet': return <MessageSquare size={iconSize} />;
      default: return <LinkIcon size={iconSize} />;
    }
  };
  let items=useItems()
  return (
    <div className="bg-[#0F111A] rounded-[24px] p-6 border border-white/5 hover:border-white/10 w-fit transition group flex flex-col gap-3 justify-between h-full hover:shadow-2xl hover:shadow-purple-500/5">
      <div>
        {/* Top Header: Icon & Actions */}
        <div className="flex justify-between  mb-6">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-[#161926] text-gray-400 group-hover:text-purple-400 transition-colors`}>
            {renderTypeIcon(elem.type)}
          </div>
          <div className="flex gap-2 text-gray-600 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
            <Bookmark size={18} className="hover:text-white cursor-pointer transition" />
            <Trash2 
            onClick={()=>{
              items.handleDeleteItem(elem._id)
            }}
            size={18} className="hover:text-red-400 cursor-pointer transition" />
          </div>
        </div>

      <a target="_blank" className="text-blue-400/80 mb-2 " href={elem.url}>{elem.url}</a>

        {/* Title */}
        <h4 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors line-clamp-2">
          {elem.title || "Untitled Insight"}
        </h4>

        {/* Notes / Description */}
        <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
          {elem.notes || "No additional notes provided for this item."}
        </p>
      </div>

      {/* Footer: Tags & Share */}
      <div className="flex justify-between items-center pt-4 border-t border-white/5">
        <div className="flex flex-wrap gap-2">
          {elem.tags && elem.tags.length > 0 ? (
            elem.tags.map((tag, index) => (
              <span key={index} className="text-[10px] text-gray-600 font-bold uppercase tracking-wider hover:text-gray-400 cursor-default">
                #{tag.replace('#', '')}
              </span>
            ))
          ) : (
            <span className="text-[10px] text-gray-700 font-bold">#UNCATEGORIZED</span>
          )}
        </div>
        <button className="text-gray-600 hover:text-white transition-colors p-1">
          <Share2 size={16} />
        </button>
      </div>
    </div>
  );

 
  };

  
export default ItemsCard;