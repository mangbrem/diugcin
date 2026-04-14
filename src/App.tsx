/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Plus, 
  Settings, 
  Folder, 
  Sparkles, 
  Play, 
  Download,
  LogOut,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'projects' | 'create' | 'settings'>('projects');

  // Mock login for preview
  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] font-sans selection:bg-[#141414] selection:text-[#E4E3E0]">
      {/* Navigation Rail */}
      <nav className="fixed left-0 top-0 bottom-0 w-16 bg-[#141414] flex flex-col items-center py-8 gap-8 z-50">
        <div className="w-10 h-10 bg-[#E4E3E0] rounded-sm flex items-center justify-center mb-4">
          <Video className="text-[#141414] w-6 h-6" />
        </div>
        
        <button 
          onClick={() => setActiveTab('projects')}
          className={cn(
            "p-2 rounded-md transition-all",
            activeTab === 'projects' ? "bg-[#E4E3E0] text-[#141414]" : "text-[#E4E3E0]/50 hover:text-[#E4E3E0]"
          )}
        >
          <Folder className="w-6 h-6" />
        </button>

        <button 
          onClick={() => setActiveTab('create')}
          className={cn(
            "p-2 rounded-md transition-all",
            activeTab === 'create' ? "bg-[#E4E3E0] text-[#141414]" : "text-[#E4E3E0]/50 hover:text-[#E4E3E0]"
          )}
        >
          <Plus className="w-6 h-6" />
        </button>

        <div className="mt-auto flex flex-col gap-6">
          <button 
            onClick={() => setActiveTab('settings')}
            className={cn(
              "p-2 rounded-md transition-all",
              activeTab === 'settings' ? "bg-[#E4E3E0] text-[#141414]" : "text-[#E4E3E0]/50 hover:text-[#E4E3E0]"
            )}
          >
            <Settings className="w-6 h-6" />
          </button>
          
          {isLoggedIn ? (
            <button onClick={handleLogout} className="p-2 text-red-400 hover:text-red-300">
              <LogOut className="w-6 h-6" />
            </button>
          ) : (
            <button onClick={handleLogin} className="p-2 text-green-400 hover:text-green-300">
              <User className="w-6 h-6" />
            </button>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="pl-16 min-h-screen">
        <header className="border-b border-[#141414] p-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter uppercase">UGC-in Aja</h1>
            <p className="font-mono text-xs opacity-50 mt-2 italic">MEME EDITION // ZERO-COST INFRASTRUCTURE</p>
          </div>
          <div className="flex gap-4">
            <div className="text-right">
              <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest">System Status</p>
              <p className="text-xs font-mono text-green-600">CLIENT_SIDE_READY</p>
            </div>
          </div>
        </header>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'projects' && (
              <motion.div 
                key="projects"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {projects.length === 0 ? (
                  <div className="col-span-full border border-dashed border-[#141414]/30 rounded-lg p-12 flex flex-col items-center justify-center text-center">
                    <Folder className="w-12 h-12 opacity-20 mb-4" />
                    <h3 className="text-xl font-medium">No projects found</h3>
                    <p className="text-sm opacity-50 mt-2">Connect your Google Drive to see your work</p>
                    {!isLoggedIn && (
                      <button 
                        onClick={handleLogin}
                        className="mt-6 px-6 py-2 bg-[#141414] text-[#E4E3E0] rounded-sm font-medium hover:opacity-90 transition-opacity"
                      >
                        Sign in with Google
                      </button>
                    )}
                  </div>
                ) : (
                  projects.map(p => (
                    <div key={p.id} className="border border-[#141414] p-4 bg-white group cursor-pointer hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold uppercase tracking-tight">{p.name}</h3>
                        <p className="font-mono text-[10px] opacity-50">{p.date}</p>
                      </div>
                      <div className="aspect-video bg-[#E4E3E0] mb-4 flex items-center justify-center group-hover:bg-[#141414]/20">
                        <Play className="w-8 h-8 opacity-20" />
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 border border-current py-1 text-xs font-bold uppercase hover:bg-white hover:text-[#141414]">Edit</button>
                        <button className="p-2 border border-current hover:bg-white hover:text-[#141414]"><Download className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}

            {activeTab === 'create' && (
              <motion.div 
                key="create"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-2xl mx-auto"
              >
                <div className="bg-white border border-[#141414] p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="w-5 h-5" />
                    <h2 className="text-2xl font-bold uppercase tracking-tighter">AI Video Generator</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-mono uppercase opacity-50 mb-2">Product Description</label>
                      <textarea 
                        className="w-full border border-[#141414] p-4 font-sans focus:outline-none focus:ring-1 focus:ring-[#141414]"
                        placeholder="e.g. A cute cat water fountain that keeps water fresh..."
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono uppercase opacity-50 mb-2">Meme Style</label>
                        <select className="w-full border border-[#141414] p-2 bg-white">
                          <option>Happy Cat</option>
                          <option>Crying Cat</option>
                          <option>Huh Cat</option>
                          <option>Maxwell the Cat</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono uppercase opacity-50 mb-2">Duration</label>
                        <select className="w-full border border-[#141414] p-2 bg-white">
                          <option>15 Seconds</option>
                          <option>30 Seconds</option>
                          <option>60 Seconds</option>
                        </select>
                      </div>
                    </div>

                    <button className="w-full bg-[#141414] text-[#E4E3E0] py-4 font-bold uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Generate Storyboard
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer / Status Bar */}
      <footer className="fixed bottom-0 left-16 right-0 h-8 bg-[#141414] text-[#E4E3E0] flex items-center px-4 justify-between font-mono text-[10px] z-40">
        <div className="flex gap-4">
          <span>DRIVE_STATUS: {isLoggedIn ? 'CONNECTED' : 'DISCONNECTED'}</span>
          <span>FFMPEG_STATUS: READY</span>
        </div>
        <div className="flex gap-4">
          <span>V1.0.0-ALPHA</span>
          <span>© 2026 UGC-IN AJA</span>
        </div>
      </footer>
    </div>
  );
}

