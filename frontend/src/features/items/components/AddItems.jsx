import React, { useEffect, useState } from 'react'
import { Globe, X, ChevronDown, Lightbulb, Loader2, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { useItems } from '../hooks/useItems';
import { useCollections } from '../../collections/hooks/useCollection'
const AddItems = () => {
    let [title, setTitle] = useState('')
    let [url, setUrl] = useState("")
    let [type, setType] = useState("")
    let [tags, setTags] = useState([])
    let [notes, setNotes] = useState("")
    let [tagInput, setTagInput] = useState("")
    let items = useItems()
    let navigate = useNavigate()
    const [collectionId, setCollectionId] = useState("")
    let collection = useCollections()
    
    // Get collections from Redux state instead of local state
    const collections = useSelector(state => state.collection.collection) || []

    useEffect(() => {
        collection.handleGetAllCollection()
    }, [])
    const addTag = (e) => {
        if (e.key === "Enter" && tagInput.trim() !== "") {
            e.preventDefault()

            setTags([...tags, tagInput.trim()])
            setTagInput("")
        }
    }
    const removeTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove))
    }
    let handleSubmit = async (e) => {
        e.preventDefault()
        if (!type) {
            alert("Please select a type")
            return
        }
        let savePayload = {
            title,
            url,
            type,
            tags,
            notes
        }
        const savedItem = await items.handleSaveAItem(savePayload)
        if (savedItem?._id && collectionId) {
           await items.handleUpdateItem({
   iId:savedItem._id,
   id:collectionId
})
        }
        navigate("/")
    }
    return (
        <div className="min-h-screen bg-[#05070A] text-white font-sans flex flex-col items-center justify-center p-6 relative">
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Header */}
            <div className="text-center mb-10 z-10">
                <div className="flex justify-center items-center gap-2 mb-4">
                    <Sparkles className="text-purple-400 w-4 h-4" />
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 text-center">Ethereal AI</span>
                </div>
                <h1 className="text-3xl font-bold mb-4 tracking-tight">Save New Item</h1>
                <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                    Capture anything — articles, videos, ideas — and let AI organize it for you.
                </p>
            </div>

            {/* --- FORM START --- */}
            <form onSubmit={handleSubmit} className="w-full mt-[-20px]   bg-[#0D1117]/80 backdrop-blur-xl rounded-[32px] border border-white/5 p-10 shadow-2xl z-10">
                <div className="space-y-8">

                    {/* Title */}
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-3 ml-1">Title</label>
                        <input
                            required
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter a meaningful title..."
                            className="w-full bg-[#05070A] border border-white/5 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-purple-500/40 transition ring-0"
                        />
                    </div>

                    {/* URL */}
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-3 ml-1">URL</label>
                        <div className="relative">
                            <Link className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                            <input
                                required
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://example.com"
                                className="w-full bg-[#05070A] border border-white/5 rounded-xl pl-12 pr-5 py-4 text-sm focus:outline-none focus:border-purple-500/40 transition"
                            />
                        </div>
                    </div>

                    {/* Scanning Status (Visual Only)
              <div className="bg-black/40 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                    <Globe className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-200">Scanning URL for metadata...</p>
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider mt-0.5">Automatic source detection active</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 pr-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Live</span>
                </div>
              </div> */}

                    {/* Type and Tags Row */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-3 ml-1">Type</label>
                            <div className="relative">
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="w-full bg-[#05070A] border border-white/5 rounded-xl px-5 py-4 text-sm appearance-none focus:outline-none focus:border-purple-500/40 transition text-gray-200 cursor-pointer"
                                >
                                    <option value="">Select Type</option>
                                    <option value="Article">Article</option>
                                    <option value="Video">Video</option>
                                    <option value="Tweet">Tweet</option>
                                    <option value="Image">Image</option>
                                    <option value="Pdf">Pdf</option>
                                </select>
                                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-3 ml-1">Tags</label>
                            <div className="w-full bg-[#05070A] border border-white/5 rounded-xl px-3 py-2 text-sm flex flex-wrap gap-2 items-center min-h-[56px] focus-within:border-purple-500/40 transition">
                                {tags.map((tag, index) => (
                                    <span key={index} className="flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 px-2 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider">
                                        #{tag}
                                        <button type="button" onClick={() => removeTag(tag)}>
                                            <X className="w-3 h-3 hover:text-white transition" />
                                        </button>
                                    </span>
                                ))}
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={addTag}
                                    placeholder="Type and press Enter..."
                                    className="bg-transparent border-none focus:outline-none text-gray-300 flex-1 min-w-[60px] ml-1 placeholder:text-gray-700"
                                />

                            </div>

                        </div>
                        {/* Collection */}
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-3 ml-1">
                                Collection
                            </label>

                            <div className="flex gap-3">

                                {/* Dropdown */}
                                <div className="relative flex-1">
                                    <select
                                        value={collectionId}
                                        onChange={(e) => setCollectionId(e.target.value)}
                                        className="w-full bg-[#05070A] border border-white/5 rounded-xl px-5 py-4 text-sm appearance-none focus:outline-none focus:border-purple-500/40 transition text-gray-200 cursor-pointer"
                                    >

                                        <option value="">Select Collection</option>

                                        {collections?.map((col) => (
                                            <option key={col._id} value={col._id}>
                                                {col.collectionName}
                                            </option>
                                        ))}

                                    </select>

                                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
                                </div>

                                {/* Create Collection Button */}
                                <button
                                    type="button"
                                    onClick={() => navigate("/create-collection")}
                                    className="px-5 py-3 bg-[#0D1117] border border-white/5 rounded-xl text-xs hover:border-purple-500/40 transition"
                                >
                                    + New
                                </button>

                            </div>

                        </div>

                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-3 ml-1">Notes</label>
                        <textarea
                            rows="3"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add your thoughts, summary, or key points..."
                            className="w-full bg-[#05070A] border border-white/5 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-purple-500/40 transition text-gray-400 resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end items-center gap-8 pt-4">
                        <button type="button" className="text-[10px] font-bold text-gray-500 hover:text-white transition uppercase tracking-[0.2em]">
                            <Link to="/">Cancel</Link>

                        </button>
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-[#7C3AED] to-[#2563EB] hover:opacity-90 disabled:opacity-50 px-8 py-3.5 rounded-xl font-bold text-sm transition shadow-lg shadow-purple-500/20 flex items-center gap-3 min-w-[160px] justify-center"
                        >Save Item
                        </button>
                    </div>
                </div>
            </form>
            {/* --- FORM END --- */}


        </div>
    );
}  
export default AddItems