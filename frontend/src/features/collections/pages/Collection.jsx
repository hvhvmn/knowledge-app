import {
    Plus, Search, Bell, Grid,
    Brain, Box, Lightbulb, Palette, Banknote,
    Sparkles, X, ChevronRight, FileText, Play, Image as ImageIcon
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useCollections } from '../hooks/useCollection';
import { useSelector } from 'react-redux';
import CollectionCard from '../components/CollectionCard';
const Collection = () => {
    let [flag, setFlag] = useState(true)
    let collection=useCollections()
    useEffect(()=>{
      collection.handleGetAllCollection()
    },[])
    let collections=useSelector(state=>state.collection.collection)
    let handleDelete=collection.handleDeleteCollection
    return (
        <div className="min-h-screen bg-[#05070A] text-gray-400 font-sans p-8">

            {/* --- NAVBAR --- */}
            <nav className="flex justify-between items-center mb-16">
                <div className="flex items-center gap-12">
                    <div className="text-white font-bold text-lg tracking-tight">Ethereal AI</div>
                    {/* <div className="flex gap-8 text-[11px] uppercase tracking-[0.2em] font-bold">
                <a href="#" className="hover:text-white transition">All Files</a>
                <a href="#" className="text-purple-400 border-b border-purple-400 pb-1">Recent</a>
                <a href="#" className="hover:text-white transition">Shared</a>
                <a href="#" className="hover:text-white transition">Archived</a>
              </div> */}
                </div>
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <Bell size={18} className="hover:text-white cursor-pointer transition" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full border-2 border-[#05070A]" />
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-orange-200 overflow-hidden border border-white/10">
                                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Avatar" className="w-7 h-7 rounded-full bg-orange-200" />

                    </div>
                </div>
            </nav>

            {/* --- HEADER --- */}
            <header className="flex gap-5 items-center   mb-12">
                <div className="max-w-xl">
                    <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">Your Collections</h1>
                    <p className="text-gray-500 leading-relaxed">
                        Organize your knowledge into meaningful groups and access it effortlessly with AI-powered surfacing.
                    </p>
                </div>

                
                    <Link
                    to="/add" className="bg-[#A78BFA] hover:bg-[#C4B5FD] text-[#05070A] px-6 py-3 rounded-2xl font-bold flex ml-62 items-center gap-2 transition-all shadow-lg shadow-purple-500/20">
                    <Plus size={20} />
                    Create Item</Link>
                    <Link
                    to="/create-collection" className="bg-[#A78BFA] hover:bg-[#C4B5FD] text-[#05070A] px-6 py-3 rounded-2xl font-bold flex  items-center gap-2 transition-all shadow-lg shadow-purple-500/20">
                    <Plus size={20} />
                    New Collection</Link>
            </header>

            {/* --- COLLECTIONS GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {/* {collections.map((col) => (
                    <div key={col.id} className="bg-[#0D1117]/50 border border-white/5 rounded-[32px] p-8 hover:bg-[#161B22]/50 transition-all group cursor-pointer hover:border-white/10">
                        <div className="w-12 h-12 rounded-2xl bg-[#161B22] flex items-center justify-center text-purple-400 mb-8 border border-white/5 group-hover:scale-110 transition-transform">
                            {col.icon}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{col.title}</h3>
                        <p className="text-sm text-gray-500 mb-10 leading-relaxed">{col.desc}</p>

                        <div className="flex justify-between items-center">
                            <div className="flex -space-x-2">
                                <div className="w-8 h-8 rounded-lg bg-[#1C2128] border border-white/5 flex items-center justify-center text-blue-400"><FileText size={14} /></div>
                                <div className="w-8 h-8 rounded-lg bg-[#1C2128] border border-white/5 flex items-center justify-center text-purple-400"><Play size={14} /></div>
                                <div className="w-8 h-8 rounded-lg bg-[#1C2128] border border-white/5 flex items-center justify-center text-pink-400"><ImageIcon size={14} /></div>
                            </div>
                            <span className="text-[10px] uppercase tracking-widest font-bold text-gray-600">{col.items} Items</span>
                        </div>
                    </div>
                ))} */}
                {collections?collections.map((elem,idx)=>{
                    return <CollectionCard handleDelete={handleDelete} elem={elem} key={idx}/>
                }):"No collection created"}

                {/* Empty State / Add New */}
                <div className="border-2 border-dashed border-white/5 rounded-[32px] flex flex-col items-center justify-center p-8 hover:border-white/10 transition-colors cursor-pointer group min-h-[280px]">
                    <div className="w-12 h-12 rounded-full bg-[#161B22] flex items-center justify-center text-gray-600 mb-4 group-hover:text-white transition-colors">
                        <Link to='/create-collection'><Plus size={24} /></Link>
                    </div>
                    <Link to='/create-collection' className="text-sm font-medium text-gray-500 group-hover:text-white">Create Collection</Link>
                </div>
            </div>

            {/* --- AI SUGGESTION BANNER --- */}
            <div className={flag ? `bg-[#0D1117] border border-white/5 rounded-[32px] p-8 relative overflow-hidden group` : "hidden"}>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
                    <div className="flex items-center gap-8">
                        <div className="w-16 h-16 rounded-2xl bg-[#161B22] border border-white/10 flex items-center justify-center shadow-inner">
                            <Sparkles className="text-purple-400 w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">AI Suggested: "Future Tech Expo"</h3>
                            <p className="text-gray-500 text-sm max-w-xl">
                                We've noticed you frequently bookmark articles about spatial computing and neural interfaces.
                                Would you like to create a new collection for these?
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-center">
                        <button
                            onClick={() => setFlag(false)}
                            className={`text-sm font-bold text-gray-500 hover:text-white transition px-6 py-3 rounded-xl hover:bg-white/5`}>Dismiss</button>
                        <div className="relative">
                        <Link to='/create-collection'>    <button className="bg-[#A78BFA] hover:bg-[#C4B5FD] text-[#05070A] px-8 py-3 rounded-xl font-bold transition shadow-lg shadow-purple-500/20">
                                Create Collection
                            </button> </Link>
                            <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#A78BFA] rounded-full flex items-center justify-center border-4 border-[#0D1117] animate-bounce">
                                <Sparkles size={12} className="text-[#05070A]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
}

export default Collection