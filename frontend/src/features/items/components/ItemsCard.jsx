import React from 'react';
import { 
  Share2, 
  Bookmark, 
  Trash2, 
  Play, 
  FileText, 
  Image as ImageIcon, 
  MessageSquare, 
  Link as LinkIcon,
  Loader
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
      case 'pdf': return <FileText size={iconSize} />;
      case 'tweet': return <MessageSquare size={iconSize} />;
      default: return <LinkIcon size={iconSize} />;
    }
  };
  let items=useItems()
  const isProcessing = elem.processing === true;
  
  return (
    <div className={`bg-[#0F111A] rounded-[24px] p-6 border transition group flex flex-col gap-3 justify-between h-full hover:shadow-2xl ${
      isProcessing 
        ? 'border-yellow-500/30 hover:border-yellow-500/50 hover:shadow-yellow-500/5' 
        : 'border-white/5 hover:border-white/10 hover:shadow-purple-500/5'
    }`}>
      <div>
        {/* Top Header: Icon & Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-purple-400 transition-colors ${
            isProcessing ? 'bg-yellow-500/10 animate-pulse' : 'bg-[#161926]'
          }`}>
            {isProcessing ? (
              <Loader size={16} className="animate-spin" />
            ) : (
              renderTypeIcon(elem.type)
            )}
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

        {/* Processing Status Badge */}
        {isProcessing && (
          <div className="mb-3 px-2 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded text-yellow-400 text-xs font-semibold flex items-center gap-2">
            <Loader size={12} className="animate-spin" />
            Processing with AI...
          </div>
        )}

        {/* URL Display */}
        <div className="mb-2">
          <a target="_blank" className="text-blue-400/80 hover:text-blue-300 transition-colors text-sm" href={elem.url}>
            {elem.url}
          </a>
          {elem.fileUrl && elem.fileUrl !== elem.url && (
            <div className="mt-1">
              <a target="_blank" className="text-purple-400/80 hover:text-purple-300 transition-colors text-xs" href={elem.fileUrl}>
                📸 View Screenshot
              </a>
            </div>
          )}
        </div>

        {/* Title */}
        <h4 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors line-clamp-2">
          {elem.title || "Untitled Insight"}
        </h4>

        {/* Image Preview for screenshots */}
        {elem.fileUrl && (elem.type === 'Image' || elem.fileType?.startsWith('image/')) && (
          <div className="mb-4">
            <a href={elem.fileUrl} target="_blank" rel="noopener noreferrer">
              <img 
                src={elem.fileUrl} 
                alt="Screenshot preview" 
                className="w-full h-32 object-cover rounded-lg border border-white/10 hover:border-purple-500/50 transition-colors cursor-pointer"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </a>
            <p className="text-xs text-gray-600 mt-1 text-center">Click to view full image</p>
          </div>
        )}

        {/* Notes / Description */}
        <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
          {elem.notes || "No additional notes provided for this item."}
        </p>
      </div>

      {/* Footer: Tags & Share */}
      <div className="flex justify-between items-center pt-4 border-t border-white/5">
        <div className="flex flex-wrap gap-2">
          {!isProcessing && elem.tags && elem.tags.length > 0 ? (
            <>
              {elem.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="text-[10px] bg-purple-500/10 border border-purple-500/20 text-purple-400 px-2 py-1 rounded-md font-bold uppercase tracking-wider hover:bg-purple-500/20 cursor-default transition">
                  #{tag.replace('#', '')}
                </span>
              ))}
              {elem.tags.length > 3 && (
                <span className="text-[10px] text-gray-600 font-bold">+{elem.tags.length - 3}</span>
              )}
            </>
          ) : !isProcessing ? (
            <span className="text-[10px] text-gray-700 font-bold">#UNCATEGORIZED</span>
          ) : (
            <span className="text-[10px] text-yellow-600 font-bold">Tags loading...</span>
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