import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Tv, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Save, 
  Eye, 
  Sparkles, 
  Activity, 
  HeartHandshake, 
  Award,
  Layers,
  Video,
  Radio,
  RefreshCw,
  Search
} from 'lucide-react';

export default function AdminDashboard({ 
  isOpen, 
  onClose, 
  animals, 
  setAnimals, 
  cameras, 
  setCameras, 
  sponsorships 
}) {
  const [activeTab, setActiveTab] = useState('cameras'); // 'cameras' | 'animals' | 'sponsorships'
  
  // Camera Edit State
  const [editingCameraId, setEditingCameraId] = useState(null);
  const [cameraForm, setCameraForm] = useState({
    status: 'LIVE',
    stream_url: '',
    viewer_count: 1000
  });

  // Animal Add/Edit State
  const [isAddingAnimal, setIsAddingAnimal] = useState(false);
  const [animalForm, setAnimalForm] = useState({
    name: '',
    scientific_name: '',
    category: 'Mammals',
    habitat: '',
    conservation_status: 'Endangered',
    diet: '',
    short_description: '',
    photo_url: '/images/royal_bengal_tiger.jpg',
    video_url: '/videos/tiger_hero.webm',
    featured: false,
    monthly_sponsorship_cost: 5000
  });

  if (!isOpen) return null;

  // Camera Management Handlers
  const handleEditCamera = (cam) => {
    setEditingCameraId(cam.id);
    setCameraForm({
      status: cam.status,
      stream_url: cam.stream_url,
      viewer_count: cam.viewer_count
    });
  };

  const handleSaveCamera = (id) => {
    setCameras(prev => prev.map(c => c.id === id ? { ...c, ...cameraForm } : c));
    setEditingCameraId(null);
  };

  const toggleCameraStatus = (id) => {
    setCameras(prev => prev.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === 'LIVE' ? 'OFFLINE' : (c.status === 'OFFLINE' ? 'MAINTENANCE' : 'LIVE');
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  // Animal Management Handlers
  const handleSaveNewAnimal = (e) => {
    e.preventDefault();
    if (!animalForm.name || !animalForm.scientific_name) return;

    const newAnimal = {
      ...animalForm,
      id: Date.now(),
      slug: animalForm.name.toLowerCase().replace(/\s+/g, '-'),
      full_bio: animalForm.short_description,
      fun_facts: [
        `Key indicator species under Nandankanan ecological surveillance.`,
        `Native habitat in Odisha wildlife corridors.`
      ]
    };

    setAnimals(prev => [newAnimal, ...prev]);
    setIsAddingAnimal(false);
    setAnimalForm({
      name: '',
      scientific_name: '',
      category: 'Mammals',
      habitat: '',
      conservation_status: 'Endangered',
      diet: '',
      short_description: '',
      photo_url: '/images/royal_bengal_tiger.jpg',
      video_url: '/videos/tiger_hero.webm',
      featured: false,
      monthly_sponsorship_cost: 5000
    });
  };

  const toggleFeaturedAnimal = (id) => {
    setAnimals(prev => prev.map(a => a.id === id ? { ...a, featured: !a.featured } : a));
  };

  const totalFunds = sponsorships.reduce((sum, sp) => sum + (Number(sp.amount) || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-forest-950/90 backdrop-blur-2xl animate-fadeIn text-ivory-50">
      <div className="relative w-full max-w-6xl bg-forest-900 border border-gold-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Top Navbar */}
        <div className="px-6 py-4 bg-forest-950 border-b border-forest-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-xl p-1.5 shadow-md border border-gold-500/40">
              <img 
                src="/images/nandankanan_logo.png" 
                alt="Nandankanan Official Logo" 
                className="h-8 w-auto object-contain"
              />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-ivory-50 flex items-center gap-2">
                Nandankanan Admin Command Center
              </h3>
              <p className="text-[11px] text-gold-400 font-mono">
                Sanctuary Operations • Feeds & Profile Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-forest-800 text-ivory-200 hover:text-white hover:bg-forest-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top KPI Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-forest-950/60 border-b border-forest-800/80 text-xs">
          <div className="p-3.5 rounded-2xl bg-forest-900 border border-forest-800">
            <span className="text-ivory-300 block mb-1">Cataloged Species</span>
            <strong className="text-xl font-bold font-mono text-gold-400">{animals.length}</strong>
          </div>

          <div className="p-3.5 rounded-2xl bg-forest-900 border border-forest-800">
            <span className="text-ivory-300 block mb-1">Active Streams</span>
            <strong className="text-xl font-bold font-mono text-emerald-400">
              {cameras.filter(c => c.status === 'LIVE').length} / {cameras.length}
            </strong>
          </div>

          <div className="p-3.5 rounded-2xl bg-forest-900 border border-forest-800">
            <span className="text-ivory-300 block mb-1">Total Guardianships</span>
            <strong className="text-xl font-bold font-mono text-gold-400">{sponsorships.length}</strong>
          </div>

          <div className="p-3.5 rounded-2xl bg-forest-900 border border-forest-800">
            <span className="text-ivory-300 block mb-1">Care Contributions</span>
            <strong className="text-xl font-bold font-mono text-emerald-400">₹{totalFunds.toLocaleString()}</strong>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="px-6 py-3 bg-forest-950 border-b border-forest-800 flex items-center gap-3">
          <button
            onClick={() => setActiveTab('cameras')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'cameras'
                ? 'bg-gold-500 text-forest-950 shadow-md'
                : 'text-ivory-200 hover:bg-forest-800'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Live Camera Feeds</span>
          </button>

          <button
            onClick={() => setActiveTab('animals')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'animals'
                ? 'bg-gold-500 text-forest-950 shadow-md'
                : 'text-ivory-200 hover:bg-forest-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Species Directory</span>
          </button>

          <button
            onClick={() => setActiveTab('sponsorships')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'sponsorships'
                ? 'bg-gold-500 text-forest-950 shadow-md'
                : 'text-ivory-200 hover:bg-forest-800'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Guardianship Ledger</span>
          </button>
        </div>

        {/* Main Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* TAB 1: LIVE CAMERAS CONTROLLER */}
          {activeTab === 'cameras' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-display font-bold text-lg text-ivory-50">
                  Observation Camera Controller
                </h4>
                <span className="text-xs text-gold-400 font-mono">
                  Toggle status or update demo streams in real time
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cameras.map((cam) => {
                  const isEditing = editingCameraId === cam.id;
                  return (
                    <div
                      key={cam.id}
                      className="p-5 rounded-2xl bg-forest-950 border border-forest-800 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-display font-bold text-base text-ivory-50">
                            {cam.title}
                          </span>
                          <button
                            onClick={() => toggleCameraStatus(cam.id)}
                            className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 ${
                              cam.status === 'LIVE'
                                ? 'bg-red-600/90 text-white'
                                : (cam.status === 'OFFLINE' ? 'bg-zinc-700 text-zinc-300' : 'bg-amber-600 text-white')
                            }`}
                            title="Click to toggle status (LIVE -> OFFLINE -> MAINTENANCE)"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                            {cam.status}
                          </button>
                        </div>

                        <div className="flex items-center gap-3 mb-3">
                          <img
                            src={cam.thumbnail_url}
                            alt={cam.title}
                            className="w-16 h-12 rounded-lg object-cover border border-forest-700 shrink-0"
                          />
                          <div className="text-xs text-ivory-300 space-y-0.5">
                            <div><strong className="text-gold-400">Animal:</strong> {cam.animal_name}</div>
                            <div><strong className="text-gold-400">Location:</strong> {cam.camera_location}</div>
                            <div><strong className="text-gold-400">Audience:</strong> {cam.viewer_count?.toLocaleString()} viewers</div>
                          </div>
                        </div>

                        {isEditing && (
                          <div className="p-3 mt-3 rounded-xl bg-forest-900 border border-forest-700 space-y-2 text-xs">
                            <div>
                              <label className="text-[10px] text-ivory-300 uppercase block mb-1">Stream URL</label>
                              <input
                                type="text"
                                value={cameraForm.stream_url}
                                onChange={(e) => setCameraForm({ ...cameraForm, stream_url: e.target.value })}
                                className="w-full px-2.5 py-1.5 rounded bg-forest-950 border border-forest-700 text-xs text-ivory-50"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-ivory-300 uppercase block mb-1">Viewer Count</label>
                              <input
                                type="number"
                                value={cameraForm.viewer_count}
                                onChange={(e) => setCameraForm({ ...cameraForm, viewer_count: Number(e.target.value) })}
                                className="w-full px-2.5 py-1.5 rounded bg-forest-950 border border-forest-700 text-xs text-ivory-50"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-forest-800 flex items-center justify-between text-xs">
                        {isEditing ? (
                          <div className="flex items-center gap-2 w-full justify-end">
                            <button
                              onClick={() => setEditingCameraId(null)}
                              className="px-3 py-1.5 rounded-lg bg-forest-800 text-ivory-200"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveCamera(cam.id)}
                              className="px-3 py-1.5 rounded-lg bg-gold-500 text-forest-950 font-bold"
                            >
                              Save Changes
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEditCamera(cam)}
                            className="px-3 py-1.5 rounded-lg bg-forest-800 text-gold-300 hover:bg-forest-700 flex items-center gap-1.5"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit Camera Config</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: SPECIES DIRECTORY & ADD SPECIES */}
          {activeTab === 'animals' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-display font-bold text-lg text-ivory-50">
                    Animal Profile Registry
                  </h4>
                  <p className="text-xs text-gold-400 font-mono">
                    Total {animals.length} species managed under Nandankanan taxonomy
                  </p>
                </div>

                <button
                  onClick={() => setIsAddingAnimal(!isAddingAnimal)}
                  className="px-4 py-2 rounded-xl bg-gold-500 text-forest-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md"
                >
                  {isAddingAnimal ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  <span>{isAddingAnimal ? "Cancel" : "Add New Species"}</span>
                </button>
              </div>

              {/* Add Animal Form Accordion */}
              {isAddingAnimal && (
                <form
                  onSubmit={handleSaveNewAnimal}
                  className="p-6 rounded-2xl bg-forest-950 border border-gold-500/40 space-y-4 text-xs"
                >
                  <h5 className="font-display font-bold text-base text-gold-300 mb-2">
                    Register New Wildlife Species
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-ivory-200 mb-1">Common Name *</label>
                      <input
                        type="text"
                        required
                        value={animalForm.name}
                        onChange={(e) => setAnimalForm({ ...animalForm, name: e.target.value })}
                        placeholder="e.g. Indian Leopard"
                        className="w-full p-2.5 rounded-xl bg-forest-900 border border-forest-700 text-ivory-50"
                      />
                    </div>

                    <div>
                      <label className="block text-ivory-200 mb-1">Scientific Name *</label>
                      <input
                        type="text"
                        required
                        value={animalForm.scientific_name}
                        onChange={(e) => setAnimalForm({ ...animalForm, scientific_name: e.target.value })}
                        placeholder="e.g. Panthera pardus fusca"
                        className="w-full p-2.5 rounded-xl bg-forest-900 border border-forest-700 text-ivory-50 italic"
                      />
                    </div>

                    <div>
                      <label className="block text-ivory-200 mb-1">Category</label>
                      <select
                        value={animalForm.category}
                        onChange={(e) => setAnimalForm({ ...animalForm, category: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-forest-900 border border-forest-700 text-ivory-50"
                      >
                        <option value="Mammals">Mammals</option>
                        <option value="Birds">Birds</option>
                        <option value="Reptiles">Reptiles</option>
                        <option value="Aquatic Animals">Aquatic Animals</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-ivory-200 mb-1">Conservation Status</label>
                      <select
                        value={animalForm.conservation_status}
                        onChange={(e) => setAnimalForm({ ...animalForm, conservation_status: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-forest-900 border border-forest-700 text-ivory-50"
                      >
                        <option value="Critically Endangered">Critically Endangered</option>
                        <option value="Endangered">Endangered</option>
                        <option value="Vulnerable">Vulnerable</option>
                        <option value="Near Threatened">Near Threatened</option>
                        <option value="Least Concern">Least Concern</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-ivory-200 mb-1">Habitat</label>
                      <input
                        type="text"
                        value={animalForm.habitat}
                        onChange={(e) => setAnimalForm({ ...animalForm, habitat: e.target.value })}
                        placeholder="e.g. Mixed Deciduous Canopy & Rocky Escarpment"
                        className="w-full p-2.5 rounded-xl bg-forest-900 border border-forest-700 text-ivory-50"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-ivory-200 mb-1">Short Description</label>
                      <textarea
                        rows={2}
                        value={animalForm.short_description}
                        onChange={(e) => setAnimalForm({ ...animalForm, short_description: e.target.value })}
                        placeholder="Key ecological behavior and role in Nandankanan..."
                        className="w-full p-2.5 rounded-xl bg-forest-900 border border-forest-700 text-ivory-50"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsAddingAnimal(false)}
                      className="px-4 py-2 rounded-xl bg-forest-800 text-ivory-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-xl bg-gold-500 text-forest-950 font-bold"
                    >
                      Save Species Profile
                    </button>
                  </div>
                </form>
              )}

              {/* Table of Animals */}
              <div className="overflow-x-auto rounded-2xl border border-forest-800">
                <table className="w-full text-left text-xs text-ivory-200">
                  <thead className="bg-forest-950 text-gold-400 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="p-3">Species</th>
                      <th className="p-3">Scientific Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">IUCN Status</th>
                      <th className="p-3">Sponsorship</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-forest-800 bg-forest-950/60">
                    {animals.map((a) => (
                      <tr key={a.id} className="hover:bg-forest-900/60 transition-colors">
                        <td className="p-3 font-semibold text-ivory-50 flex items-center gap-2">
                          <img src={a.photo_url} alt="" className="w-7 h-7 rounded-lg object-cover" />
                          <span>{a.name}</span>
                        </td>
                        <td className="p-3 italic text-gold-300/80">{a.scientific_name}</td>
                        <td className="p-3">{a.category}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-forest-900 text-[10px] text-amber-300 font-mono">
                            {a.conservation_status}
                          </span>
                        </td>
                        <td className="p-3 font-mono">₹{a.monthly_sponsorship_cost?.toLocaleString()}/mo</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => toggleFeaturedAnimal(a.id)}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-all ${
                              a.featured ? 'bg-gold-500 text-forest-950' : 'bg-forest-800 text-ivory-300'
                            }`}
                          >
                            {a.featured ? 'Featured' : 'Standard'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: SPONSORSHIP LEDGER */}
          {activeTab === 'sponsorships' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-display font-bold text-lg text-ivory-50">
                    Wildlife Guardianship Registry
                  </h4>
                  <p className="text-xs text-gold-400 font-mono">
                    All digital certificates issued and verified care funds
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-forest-800">
                <table className="w-full text-left text-xs text-ivory-200">
                  <thead className="bg-forest-950 text-gold-400 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="p-3">Certificate ID</th>
                      <th className="p-3">Guardian Name</th>
                      <th className="p-3">Sponsored Animal</th>
                      <th className="p-3">Tier</th>
                      <th className="p-3">Term</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Issued Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-forest-800 bg-forest-950/60 font-mono">
                    {sponsorships.map((sp) => (
                      <tr key={sp.id} className="hover:bg-forest-900/60 transition-colors">
                        <td className="p-3 text-gold-300 font-bold">{sp.certificate_id}</td>
                        <td className="p-3 font-sans font-semibold text-ivory-50">{sp.donor_name}</td>
                        <td className="p-3 font-sans text-ivory-200">{sp.animal_name}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-forest-900 text-emerald-400 text-[10px]">
                            {sp.tier}
                          </span>
                        </td>
                        <td className="p-3">{sp.duration_months} Mos</td>
                        <td className="p-3 font-bold text-gold-400">₹{Number(sp.amount).toLocaleString()}</td>
                        <td className="p-3 text-ivory-400 text-[11px]">{sp.created_at}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

