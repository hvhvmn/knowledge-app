import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard, Compass, Bookmark, Folder, Settings,
  Plus, Search, Bell, HelpCircle, MoreHorizontal, Share2,
  Play, FileText, Image as ImageIcon, MessageSquare, Trash2, X
} from 'lucide-react';
import { useItems } from '../hooks/useItems';
import { useSelector } from 'react-redux';
import ItemsCard from '../components/ItemsCard';
import { Link } from 'react-router';
import { NavLink } from "react-router-dom";
const Dashboard = () => {
  let items = useItems()
  let [searchQuery, setSearchQuery] = useState('')
  let [debounceTimer, setDebounceTimer] = useState(null)
  
  useEffect(() => {
    items.handleGetAllItems()
  }, [])

  // Handle search with debounce
  const handleSearchChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    
    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    // Set new timer
    const timer = setTimeout(() => {
      if (query.trim() !== "") {
        items.handleSearchItems(query)
      } else {
        items.handleGetAllItems() // Show all items if search is cleared
      }
    }, 500) // 500ms debounce

    setDebounceTimer(timer)
  }

  const clearSearch = () => {
    setSearchQuery('')
    items.handleGetAllItems()
  }

  let allItems = useSelector(state => state.items.item)
  let loading = useSelector(state => state.items.isLoading)
  let user = useSelector(state => state.auth.user)
  return (
    <div className="flex min-h-screen bg-[#090A11] text-gray-400 font-sans">

      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-[#0F111A] border-r border-white/5 flex flex-col p-6">

  {/* Top Section */}
  <div className="space-y-8">
    <div className="flex items-center gap-3 px-2">
      <div>
        <h1 className="text-white font-bold text-md leading-none">
          Ethereal AI
        </h1>
        <p className="text-[10px] uppercase tracking-wider text-gray-500 mt-1">
          Knowledge Manager
        </p>
      </div>
    </div>

    <nav className="flex-grow space-y-2">
      <NavItem to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" />      <NavItem to="/graph" icon={<Compass size={18} />} label="Knowledge Graph" />
      <NavItem to="/collections" icon={<Folder size={18} />} label="Collections" />

      <button className='bg-red-500 p-2 border-none rounded-xl ml-1 hover:bg-red-700 active:scale-95 text-white'>
        Log Out
      </button>
    </nav>
  </div>


  {/* Bottom Add Button */}
  <Link
    to="/add"
    className="w-full mt-[240px] bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:opacity-90 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition shadow-lg shadow-purple-500/20 no-underline"
  >
    <Plus size={18} /> Add Item
  </Link>

</aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-8 overflow-y-auto">

        {/* Header */}
        <header className="flex justify-end items-center mb-10">

          <div className="flex items-center gap-5">
            <button className="relative text-gray-400 hover:text-white transition">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full border-2 border-[#090A11]" />
            </button>
            <HelpCircle size={20} className="hover:text-white cursor-pointer" />
            <div className="flex items-center gap-3 bg-[#161926] pl-1 pr-4 py-1 rounded-full border border-white/5">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Avatar" className="w-7 h-7 rounded-full bg-orange-200" />
              <span className="text-sm text-white font-medium">{user.username}</span>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="">
          <h2 className="text-4xl font-bold text-white mt-[-70px] mb-2 tracking-tight">Welcome to Ethereal AI</h2>
          <p className="text-gray-500 mb-8">An intelligent layer over everything you learn and save.</p>
        </section>

        {/* Processing Status Banner */}
        {Array.isArray(allItems) && allItems.some(item => item.processing) && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
            <div>
              <p className="text-yellow-400 text-sm font-semibold">
                🤖 Processing {allItems.filter(item => item.processing).length} item(s) with AI...
              </p>
              <p className="text-yellow-600 text-xs">Generating tags, embeddings, and storing vectors</p>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative w-full max-w-xl">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search items by title, notes, or tags..."
              className="w-full bg-[#161926] border border-white/5 rounded-xl pl-12 pr-12 py-3 text-sm text-white focus:outline-none focus:border-purple-500/40 transition placeholder:text-gray-600"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex gap-4 bg-[#161926]/50 p-1 rounded-xl w-fit border border-white/5">
            {['All', 'Articles', 'Videos', 'Tweets', 'Images', 'Pdf'].map((tab, i) => (
              <button key={tab} className={`px-6 py-2 rounded-lg text-sm font-medium transition ${i === 0 ? 'bg-[#1F2335] text-white shadow-sm' : 'hover:text-white'}`}>
                {tab}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {['#AI', '#React', '#Learning', '#Design', '#Web3', '#Productivity'].map((tag, i) => (
              <span key={tag} className={`px-4 py-1.5 rounded-full border text-xs font-medium cursor-pointer transition ${i === 0 ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-[#161926] border-white/5 hover:border-white/20'}`}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Grid Layout */}
        <div>
          {searchQuery && (
            <div className="mb-4 flex items-center gap-2">
              <span className="text-sm text-gray-400">Search results for:</span>
              <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-lg text-sm font-medium">
                "{searchQuery}"
              </span>
              {allItems && <span className="text-gray-500 text-sm">({allItems.length} found)</span>}
            </div>
          )}
          <div className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar">
            {loading ? (
              <div className="text-gray-500">Searching...</div>
            ) : allItems && allItems.length > 0 ? (
              allItems.map((elem) => (
                <ItemsCard key={elem._id} elem={elem} />
              ))
            ) : (
              <div className="text-gray-500">
                {searchQuery ? "No items found matching your search." : "No items added"}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, to }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition ${isActive
        ? "bg-gradient-to-r from-purple-500/20 to-transparent text-purple-400 border-l-2 border-purple-500"
        : "text-gray-500 hover:text-white hover:bg-white/5"
      }`
    }
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </NavLink>
);




export default Dashboard;