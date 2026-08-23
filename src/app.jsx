import React, { useState, useEffect } from 'react';
import { 
  FileText, Users, Calendar, Clock, MapPin, Plus, Search, 
  ChevronRight, ArrowLeft, Trash2, X, Check, Eye, BookOpen, Edit3, Save,
  LogOut, ShieldCheck, User, Sparkles, Loader2, AlertCircle
} from 'lucide-react';

// ==========================================
// KONFIGURASI BACKEND (Ganti dengan URL Web App GAS Anda)
// ==========================================
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby.../exec"; // <-- GANTI URL INI DENGAN URL WEB APP ANDA

// Master data siswa dari Database Siswa untuk fitur pencarian instan
const MASTER_STUDENTS = [
  { nis: '262701001', name: 'Aiden Yusuf Abdilah', kelas: '1' },
  { nis: '262701003', name: 'Benjamin Abraham Joseph', kelas: '1' },
  { nis: '262701004', name: 'Cataleya Leona Syahlaa', kelas: '1' },
  { nis: '262701008', name: 'Diajeng Alisha Kamania', kelas: '1' },
  { nis: '262701009', name: 'Fabian Randu Tenggara', kelas: '1' },
  { nis: '262701010', name: 'Faradilla Jade', kelas: '1' },
  { nis: '262701012', name: 'Felicia shena samanta siringoringo', kelas: '1' },
  { nis: '262701013', name: 'Gede Mavendra Evano', kelas: '1' },
  { nis: '262701014', name: 'Haruki Rasyid Prawira', kelas: '1' },
  { nis: '262701016', name: 'Husein Ilman Maulana', kelas: '1' },
  { nis: '262701018', name: 'Ignatius Haga Daeli', kelas: '1' },
  { nis: '262701022', name: 'Kadek Nandita Adityanandana', kelas: '1' },
  { nis: '262701023', name: 'Kiano Viriyadhika Wijaya', kelas: '1' },
  { nis: '262701027', name: 'Mochammad Raslan Prawira Yudha', kelas: '1' },
  { nis: '262701028', name: 'Muhammad Alfarizqi', kelas: '1' },
  { nis: '262701032', name: 'Raksaka Irsyadul Ibad', kelas: '1' },
  { nis: '262701034', name: 'Sheikha Ariella Paramaditha Murtado', kelas: '1' },
  { nis: '262701035', name: 'Tan Jendra Naradipa', kelas: '1' },
  { nis: '262701002', name: 'Aryan Nataya Hutagalung', kelas: '2' },
  { nis: '262701005', name: 'Chergie Baja Akbhara', kelas: '2' },
  { nis: '262701006', name: 'Damai Azalea Putri', kelas: '2' },
  { nis: '262701007', name: 'Darlene Anindya Maharani', kelas: '2' },
  { nis: '262701011', name: 'Felic Gohi Sakti Tambun', kelas: '2' },
  { nis: '262701015', name: 'Hasan Izzul Maulana', kelas: '2' },
  { nis: '262701017', name: 'I Gusti Ngurah Aditya Madyasta', kelas: '2' },
  { nis: '262701019', name: 'Izzat muhamad reza', kelas: '2' },
  { nis: '262701020', name: 'Jagad Radja Gultom', kelas: '2' },
  { nis: '262701021', name: 'Jonathan Gio Rafandra', kelas: '2' },
  { nis: '262701024', name: 'Leo Julian cong', kelas: '2' },
  { nis: '262701025', name: 'Leticia Hasiana Simarmata', kelas: '2' },
  { nis: '262701026', name: 'Ludji Alcander Josiah Christian', kelas: '2' },
  { nis: '262701029', name: 'Narsha Ercilia', kelas: '2' },
  { nis: '262701030', name: 'Rainata Bianca Quinn Ajawaila', kelas: '2' },
  { nis: '262701031', name: 'Rajendra panca sakti meva', kelas: '2' },
  { nis: '262701033', name: 'Ryola Jingga Khalisa Haviz', kelas: '2' },
  { nis: '262701036', name: 'Tarendra Hafy Rahmatullah', kelas: '2' },
  { nis: '262701037', name: 'Theodorus Parulian Sihaloho', kelas: '2' },
  { nis: '242501018', name: 'Aurora Moana Zhong', kelas: '3' },
  { nis: '232401010', name: 'Adiba Shazfa Azmya', kelas: '4' }
];

const KATEGORI_OPTIONS = [
  'Konflik antar siswa', 'Perkelahian', 'Bullying', 'Perilaku', 
  'Pelanggaran aturan', 'Kerusakan barang', 'Masalah sosial', 
  'Masalah media sosial', 'Masalah lainnya'
];

const PERAN_OPTIONS = ['Siswa Terlibat', 'Korban', 'Saksi'];

const PIHAK_OPTIONS = [
  'Wali Kelas', 'Kepala Sekolah', 'Orang Tua/Wali Siswa', 
  'Konselor/Psikolog Sekolah', 'Koordinator Tingkat', 
  'Guru Mata Pelajaran', 'Lainnya'
];

const BANTUAN_OPTIONS = [
  'Tidak ada bantuan khusus', 'Tindak lanjut dari Wali Kelas', 
  'Tindak lanjut dari Kepala Sekolah', 'Konsultasi dengan Psikolog/Konselor', 
  'Pendampingan siswa', 'Pertemuan dengan Orang Tua/Wali', 
  'Mediation antar siswa', 'Pemantauan lanjutan'
];

const LoginScreen = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-950 to-purple-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-purple-200 text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex justify-center">
          <div className="bg-purple-100 p-4 rounded-3xl border-2 border-purple-300 shadow-md">
            <img 
              src="https://i.imgur.com/5T1LlRI.png" 
              alt="Logo Sekolah" 
              className="w-16 h-16 object-contain"
              onError={(e) => { e.target.src = "https://placehold.co/60x60/7c3aed/ffffff?text=Logo"; }}
            />
          </div>
        </div>

        <div>
          <span className="text-xs font-black tracking-widest text-purple-700 uppercase bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
            SDNP TUNAS GLOBAL
          </span>
          <h1 className="text-2xl font-extrabold text-gray-900 mt-2">Jurnal Peristiwa</h1>
          <p className="text-xs text-gray-600 mt-1 font-medium">Sistem Informasi Pencatatan & Tindak Lanjut Peristiwa Internal Sekolah</p>
        </div>

        <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 text-left text-xs text-purple-950 space-y-1.5">
          <div className="font-bold flex items-center gap-1.5 text-purple-900">
            <ShieldCheck size={16} /> Akses Terbatas Khusus Guru
          </div>
          <p className="leading-relaxed">Silakan masuk menggunakan akun Google resmi sekolah (@tunasglobal.sch.id) Anda.</p>
        </div>

        <button
          onClick={() => onLogin({
            name: 'Ahmad Syafi\'i, S.Pd.',
            email: 'ahmad.syafii@tunasglobal.sch.id',
            role: 'Wali Kelas / Guru Piket',
            photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
          })}
          className="w-full py-3.5 px-4 bg-white hover:bg-purple-50 text-gray-800 border-2 border-gray-300 hover:border-purple-500 rounded-2xl font-bold transition-all shadow-md flex items-center justify-center gap-3 group text-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span className="group-hover:text-purple-900">Lanjutkan dengan Google</span>
        </button>

        <p className="text-[11px] text-gray-400">© SDNP Tunas Global • Student Profile System</p>
      </div>
    </div>
  );
};

const HeaderNav = ({ currentUser, onLogout }) => {
  return (
    <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-800 p-3.5 px-6 rounded-3xl shadow-lg flex items-center justify-between text-white border border-purple-700/50">
      <div className="flex items-center gap-3">
        <div className="bg-white/10 p-2 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner">
          <img 
            src="https://i.imgur.com/5T1LlRI.png" 
            alt="Logo Sekolah" 
            className="w-7 h-7 object-contain"
            onError={(e) => { e.target.src = "https://placehold.co/40x40/7c3aed/ffffff?text=Logo"; }}
          />
        </div>
        <div>
          <h1 className="text-sm md:text-base font-extrabold tracking-tight leading-tight">Jurnal Peristiwa</h1>
          <p className="text-[10px] font-semibold text-purple-200 tracking-wide">SDNP TUNAS GLOBAL</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {currentUser && (
          <div className="flex items-center gap-2.5 bg-white/10 px-3 py-1.5 rounded-2xl backdrop-blur-md border border-white/20">
            <div className="w-6 h-6 rounded-full bg-purple-300 text-purple-950 font-bold flex items-center justify-center text-xs shadow-xs">
              {currentUser.name ? currentUser.name.charAt(0) : 'G'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold leading-none">{currentUser.name}</p>
              <p className="text-[9px] text-purple-200 font-medium leading-tight mt-0.5">{currentUser.role}</p>
            </div>
          </div>
        )}
        <button 
          onClick={onLogout}
          title="Keluar"
          className="p-2 bg-white/10 hover:bg-red-500/80 rounded-2xl text-purple-100 hover:text-white transition-colors border border-white/20"
        >
          <LogOut size={15} />
        </button>
      </div>
    </div>
  );
};

const Dashboard = ({ onNavigate, currentUser, onLogout }) => {
  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
      <HeaderNav currentUser={currentUser} onLogout={onLogout} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4">
        <button
          onClick={() => onNavigate('list')}
          className="bg-gradient-to-br from-indigo-50/90 via-purple-50/80 to-indigo-100/60 hover:from-indigo-100 hover:to-purple-200 border-2 border-purple-300/80 hover:border-purple-500 p-7 rounded-3xl shadow-sm transition-all flex flex-col items-center text-center group transform hover:-translate-y-1"
        >
          <div className="p-4 bg-indigo-600 text-white rounded-2xl mb-3.5 group-hover:scale-110 transition-transform shadow-md">
            <BookOpen size={32} />
          </div>
          <h2 className="text-lg font-bold text-gray-900 group-hover:text-purple-900">Daftar Peristiwa</h2>
          <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">Lihat arsip peristiwa tercatat dan riwayat keterlibatan siswa.</p>
          <span className="mt-4 text-xs font-bold text-indigo-700 flex items-center gap-1 bg-indigo-100 px-3.5 py-1.5 rounded-xl group-hover:bg-indigo-200 transition-colors">
            Buka Arsip <ChevronRight size={14} />
          </span>
        </button>

        <button
          onClick={() => onNavigate('create')}
          className="bg-gradient-to-br from-purple-800 via-indigo-900 to-purple-950 hover:from-purple-900 hover:to-indigo-950 text-white p-7 rounded-3xl shadow-lg transition-all flex flex-col items-center text-center group transform hover:-translate-y-1 border border-purple-600"
        >
          <div className="p-4 bg-white/20 text-white rounded-2xl mb-3.5 group-hover:scale-110 transition-transform backdrop-blur-sm border border-white/30 shadow-inner">
            <Plus size={32} />
          </div>
          <h2 className="text-lg font-bold">Catat Peristiwa Baru</h2>
          <p className="text-xs text-purple-100 mt-1.5 leading-relaxed">Buat laporan insiden baru dengan form terstruktur 4 bagian.</p>
          <span className="mt-4 text-xs font-bold bg-white/20 px-3.5 py-1.5 rounded-xl flex items-center gap-1 backdrop-blur-sm shadow-sm">
            Mulai Catat <ChevronRight size={14} />
          </span>
        </button>
      </div>
    </div>
  );
};

const IncidentList = ({ incidents, onViewIncident, onBack, currentUser, onLogout, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIncidents = incidents.filter(inc => 
    (inc.incident_id && inc.incident_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (inc.tempat_kejadian && inc.tempat_kejadian.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (inc.kategori && inc.kategori.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (inc.ringkasan_kejadian && inc.ringkasan_kejadian.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (inc.guru_pembuat && inc.guru_pembuat.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6 animate-in fade-in duration-300">
      <HeaderNav currentUser={currentUser} onLogout={onLogout} />

      <div className="flex items-center justify-between bg-gradient-to-r from-purple-800 to-indigo-900 text-white p-4 px-6 rounded-3xl shadow-md">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 text-purple-100 hover:bg-white/15 rounded-2xl transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-base font-bold">Daftar Peristiwa</h2>
        </div>
        <span className="text-xs font-bold text-purple-100 bg-white/15 px-3.5 py-1.5 rounded-2xl border border-white/20">
          Total: {incidents.length} Peristiwa
        </span>
      </div>

      <div className="bg-gradient-to-br from-indigo-50/40 via-purple-50/50 to-white rounded-3xl border border-purple-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-purple-100 bg-purple-100/40 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-500" size={18} />
            <input
              type="text"
              placeholder="Cari peristiwa / tempat / pelapor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-purple-300 rounded-2xl text-sm focus:ring-2 focus:ring-purple-600 bg-white shadow-sm outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-16 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-700" />
              <p className="text-xs font-bold text-purple-900">Memuat data dari Google Sheets...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-purple-200/60 text-purple-950 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-bold">ID & Tanggal</th>
                  <th className="px-6 py-4 font-bold">Kategori & Tempat</th>
                  <th className="px-6 py-4 font-bold">Siswa Terlibat</th>
                  <th className="px-6 py-4 font-bold">Pelapor</th>
                  <th className="px-6 py-4 text-right font-bold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100 text-sm">
                {filteredIncidents.length > 0 ? (
                  filteredIncidents.map((incident) => (
                    <tr key={incident.incident_id} className="hover:bg-purple-100/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{incident.incident_id}</div>
                        <div className="text-gray-600 flex items-center gap-1 mt-0.5 text-xs font-medium">
                          <Calendar size={12}/> {incident.tanggal_kejadian} ({incident.waktu_kejadian})
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block bg-purple-200 text-purple-950 px-2.5 py-1 rounded-xl font-bold text-xs mb-1 border border-purple-300 shadow-xs">
                          {incident.kategori}
                        </span>
                        <div className="text-xs text-gray-600 flex items-center gap-1 font-medium">
                          <MapPin size={12}/> {incident.tempat_kejadian}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-800">{incident.participants ? incident.participants.length : 0} Siswa</div>
                        <div className="text-xs text-gray-600 truncate max-w-xs mt-0.5 font-medium">
                          {incident.participants ? incident.participants.map(p => p.name).join(', ') : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-gray-700">
                        {incident.guru_pembuat || incident.created_by || '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => onViewIncident(incident)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-2xl font-bold transition-all text-xs shadow-sm"
                        >
                          <Eye size={14} /> Detail
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400 font-medium">
                      Belum ada data peristiwa tercatat.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

const StudentSearchAndAdd = ({ onAddStudent, hasParticipants }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  const [pendingStudent, setPendingStudent] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    if (searchTerm.length < 2) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(() => {
      const results = MASTER_STUDENTS.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.nis.includes(searchTerm) ||
        s.kelas.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSelectStudent = (student) => {
    setPendingStudent(student);
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleConfirmAdd = () => {
    if (!selectedRole) return;
    onAddStudent({ ...pendingStudent, peran: selectedRole });
    setPendingStudent(null);
    setSelectedRole('');
    setShowSearch(false);
  };

  const handleCancelAdd = () => {
    setPendingStudent(null);
    setSelectedRole('');
  };

  if (pendingStudent) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-purple-400 rounded-3xl p-5 shadow-sm space-y-4 animate-in fade-in">
        <div>
          <h4 className="font-extrabold text-gray-900 text-base">{pendingStudent.name}</h4>
          <p className="text-xs font-semibold text-purple-900 mt-0.5">Kelas: {pendingStudent.kelas} • NIS: {pendingStudent.nis}</p>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-extrabold text-purple-950 uppercase tracking-wider">Pilih Peran: *</label>
          <div className="flex flex-col sm:flex-row gap-3">
            {PERAN_OPTIONS.map(peran => (
              <label key={peran} className={`flex items-center gap-2.5 cursor-pointer px-4 py-2.5 border-2 rounded-2xl font-bold text-xs transition-all ${
                selectedRole === peran ? 'border-purple-800 bg-purple-200 text-purple-950 shadow-xs' : 'border-purple-200 bg-white text-gray-700'
              }`}>
                <input 
                  type="radio" 
                  name="role_selection" 
                  value={peran}
                  checked={selectedRole === peran}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="sr-only" 
                />
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedRole === peran ? 'border-purple-900 bg-purple-800' : 'border-gray-400'}`}>
                  {selectedRole === peran && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                </div>
                {peran}
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-2.5 pt-2">
          <button type="button" onClick={handleConfirmAdd} disabled={!selectedRole} className="px-5 py-2.5 bg-purple-700 disabled:opacity-50 text-white rounded-2xl font-bold hover:bg-purple-800 text-xs shadow-sm transition-colors">
            Konfirmasi Tambah
          </button>
          <button type="button" onClick={handleCancelAdd} className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-300 text-xs transition-colors">
            Batal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {!showSearch ? (
        <button
          type="button"
          onClick={() => setShowSearch(true)}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 border-2 border-dashed border-purple-400 rounded-3xl text-purple-900 hover:text-purple-950 hover:border-purple-600 hover:bg-purple-50/80 transition-all font-bold text-xs shadow-xs bg-purple-50/40"
        >
          <Plus size={16} />
          {hasParticipants ? '+ Tambahkan siswa lain' : '+ Tambahkan siswa'}
        </button>
      ) : (
        <div className="bg-purple-50/90 border border-purple-300 rounded-3xl p-4 relative space-y-3 shadow-inner">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-purple-950 uppercase tracking-wider">Cari Data Siswa</span>
            <button type="button" onClick={() => setShowSearch(false)} className="text-gray-500 hover:text-gray-800 p-1">
              <X size={16} />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-500" size={16} />
            <input 
              type="text" 
              placeholder="🔍 Cari nama / NIS siswa..."
              autoFocus
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-purple-300 rounded-2xl focus:ring-2 focus:ring-purple-600 text-xs shadow-sm outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {searchTerm.length >= 2 && (
            <div className="bg-white rounded-2xl shadow-lg border border-purple-200 max-h-52 overflow-y-auto divide-y divide-purple-100">
              {searchResults.length > 0 ? (
                searchResults.map((student) => (
                  <button
                    key={student.nis}
                    type="button"
                    onClick={() => handleSelectStudent(student)}
                    className="w-full text-left px-4 py-2.5 hover:bg-purple-100/60 transition-colors flex justify-between items-center group"
                  >
                    <div>
                      <div className="font-bold text-gray-900 group-hover:text-purple-950 text-xs">{student.name}</div>
                      <div className="text-[11px] font-medium text-purple-800">Kelas: {student.kelas} • NIS: {student.nis}</div>
                    </div>
                    <span className="text-[11px] bg-purple-200 text-purple-950 px-2.5 py-1 rounded-xl font-bold">Pilih</span>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-gray-500 font-medium">Siswa tidak ditemukan</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const IncidentForm = ({ initialData, onCancel, onSave, currentUser, onLogout }) => {
  const [formData, setFormData] = useState(initialData || {
    tanggal_kejadian: new Date().toISOString().split('T')[0],
    waktu_kejadian: new Date().toTimeString().slice(0, 5),
    tempat_kejadian: '',
    kategori: '',
    guru_pembuat: currentUser ? currentUser.name : '',
    participants: [],
    ringkasan_kejadian: '',
    upaya_penyelesaian: '',
    pihak_yang_diinfokan: [],
    bantuan_yang_diperlukan: [],
    detail_bantuan: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxGroupChange = (field, value) => {
    setFormData(prev => {
      const list = prev[field];
      if (list.includes(value)) {
        return { ...prev, [field]: list.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...list, value] };
      }
    });
  };

  const handleAddParticipant = (student) => {
    if (formData.participants.some(p => p.nis === student.nis)) return;
    setFormData(prev => ({ ...prev, participants: [...prev.participants, student] }));
  };

  const handleRemoveParticipant = (nis) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.filter(p => p.nis !== nis)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.tempat_kejadian || !formData.kategori || !formData.ringkasan_kejadian || !formData.guru_pembuat) {
      alert("Mohon lengkapi informasi wajib (Tempat, Kategori, Guru Pembuat, dan Ringkasan Kejadian).");
      return;
    }
    if (formData.participants.length === 0) {
      alert("Mohon tambahkan minimal satu siswa yang terlibat.");
      return;
    }

    setIsSubmitting(true);
    const savedIncident = {
      ...formData,
      incident_id: formData.incident_id || ('INC' + Math.floor(1000 + Math.random() * 9000)),
      created_by: currentUser ? currentUser.email : formData.guru_pembuat,
      created_at: formData.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await onSave(savedIncident);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-4 md:p-6 pb-24 space-y-6 animate-in fade-in duration-300">
      <HeaderNav currentUser={currentUser} onLogout={onLogout} />

      <div className="flex items-center justify-between bg-gradient-to-r from-purple-800 to-indigo-900 text-white p-4 px-6 rounded-3xl shadow-md">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onCancel} className="p-2 text-purple-100 hover:bg-white/15 rounded-2xl transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-base font-bold">{initialData ? 'Edit Peristiwa' : 'Catat Peristiwa Baru'}</h2>
        </div>
        <button type="submit" disabled={isSubmitting} className="px-5 py-2 bg-white text-purple-950 hover:bg-purple-100 disabled:opacity-50 rounded-2xl font-extrabold shadow-md transition-all text-xs flex items-center gap-1.5">
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={15} />} Simpan Peristiwa
        </button>
      </div>

      {/* Bagian 1: Informasi Kejadian */}
      <div className="bg-gradient-to-br from-indigo-50/60 via-purple-50/60 to-white p-6 md:p-7 rounded-3xl border border-purple-200 shadow-sm space-y-4">
        <h2 className="text-xs font-extrabold text-purple-950 uppercase tracking-widest border-b border-purple-200 pb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-700"></span> 1. Informasi Kejadian
        </h2>

        <div>
          <label className="block text-xs font-bold text-gray-800 mb-1.5 flex items-center gap-1.5">
            <User size={15} className="text-purple-700"/> Guru Pembuat Laporan *
          </label>
          <input 
            type="text" 
            name="guru_pembuat" 
            value={formData.guru_pembuat} 
            onChange={handleInputChange} 
            placeholder="Tuliskan Nama Guru & Gelar..." 
            required
            className="w-full px-4 py-2.5 border border-purple-300 rounded-2xl text-xs bg-white focus:ring-2 focus:ring-purple-600 outline-none transition-all shadow-xs font-semibold text-purple-950" 
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1.5">Tanggal Kejadian *</label>
            <input type="date" name="tanggal_kejadian" value={formData.tanggal_kejadian} onChange={handleInputChange} required
              className="w-full px-4 py-2.5 border border-purple-300 rounded-2xl text-xs bg-white focus:ring-2 focus:ring-purple-600 outline-none transition-all shadow-xs" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1.5">Waktu Kejadian *</label>
            <input type="time" name="waktu_kejadian" value={formData.waktu_kejadian} onChange={handleInputChange} required
              className="w-full px-4 py-2.5 border border-purple-300 rounded-2xl text-xs bg-white focus:ring-2 focus:ring-purple-600 outline-none transition-all shadow-xs" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1.5">Tempat Kejadian *</label>
            <input type="text" name="tempat_kejadian" value={formData.tempat_kejadian} onChange={handleInputChange} placeholder="Mis: Lapangan Utama, Kelas 4..." required
              className="w-full px-4 py-2.5 border border-purple-300 rounded-2xl text-xs bg-white focus:ring-2 focus:ring-purple-600 outline-none transition-all shadow-xs" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1.5">Kategori Peristiwa *</label>
            <select name="kategori" value={formData.kategori} onChange={handleInputChange} required
              className="w-full px-4 py-2.5 border border-purple-300 rounded-2xl text-xs bg-white focus:ring-2 focus:ring-purple-600 outline-none transition-all shadow-xs">
              <option value="">-- Pilih Kategori --</option>
              {KATEGORI_OPTIONS.map(kat => <option key={kat} value={kat}>{kat}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Bagian 2: Siswa yang Terlibat */}
      <div className="bg-gradient-to-br from-purple-50/60 via-indigo-50/60 to-white p-6 md:p-7 rounded-3xl border border-purple-200 shadow-sm space-y-4">
        <h2 className="text-xs font-extrabold text-purple-950 uppercase tracking-widest border-b border-purple-200 pb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-700"></span> 2. Siswa yang Terlibat
        </h2>
        <StudentSearchAndAdd onAddStudent={handleAddParticipant} hasParticipants={formData.participants.length > 0} />

        {formData.participants.length > 0 && (
          <div className="space-y-3 pt-2">
            {formData.participants.map((student) => (
              <div key={student.nis} className="flex items-center justify-between p-4 bg-white border border-purple-200 rounded-2xl shadow-xs">
                <div>
                  <h4 className="font-bold text-gray-900 text-xs">{student.name}</h4>
                  <p className="text-[11px] font-semibold text-purple-900">Kelas: {student.kelas} • NIS: {student.nis}</p>
                  <span className="inline-block mt-1.5 px-3 py-0.5 text-[10px] font-extrabold rounded-xl bg-purple-200 text-purple-950 border border-purple-300">
                    {student.peran}
                  </span>
                </div>
                <button type="button" onClick={() => handleRemoveParticipant(student.nis)} className="text-gray-400 hover:text-red-600 p-2.5 rounded-xl hover:bg-red-50 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bagian 3: Detail Peristiwa */}
      <div className="bg-gradient-to-br from-indigo-50/60 via-purple-50/60 to-white p-6 md:p-7 rounded-3xl border border-purple-200 shadow-sm space-y-4">
        <h2 className="text-xs font-extrabold text-purple-950 uppercase tracking-widest border-b border-purple-200 pb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-800"></span> 3. Detail Peristiwa
        </h2>
        <div>
          <label className="block text-xs font-bold text-gray-800 mb-1.5">Ringkasan Kejadian *</label>
          <textarea name="ringkasan_kejadian" rows="3" value={formData.ringkasan_kejadian} onChange={handleInputChange} required
            className="w-full px-4 py-2.5 border border-purple-300 rounded-2xl text-xs bg-white focus:ring-2 focus:ring-purple-600 outline-none transition-all shadow-xs"
            placeholder="Jelaskan kronologi kejadian secara objektif..."></textarea>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-800 mb-1.5">Upaya Penyelesaian</label>
          <textarea name="upaya_penyelesaian" rows="3" value={formData.upaya_penyelesaian} onChange={handleInputChange}
            className="w-full px-4 py-2.5 border border-purple-300 rounded-2xl text-xs bg-white focus:ring-2 focus:ring-purple-600 outline-none transition-all shadow-xs"
            placeholder="Tuliskan tindakan atau upaya yang sudah dilakukan guru/sekolah..."></textarea>
        </div>
      </div>

      {/* Bagian 4: Informasi & Tindak Lanjut */}
      <div className="bg-gradient-to-br from-purple-50/60 via-indigo-50/60 to-white p-6 md:p-7 rounded-3xl border border-purple-200 shadow-sm space-y-6">
        <h2 className="text-xs font-extrabold text-purple-950 uppercase tracking-widest border-b border-purple-200 pb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-800"></span> 4. Informasi & Tindak Lanjut
        </h2>
        <div>
          <label className="block text-xs font-bold text-gray-800 mb-2.5">Pihak yang Sudah Diinfokan</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PIHAK_OPTIONS.map(pihak => (
              <label key={pihak} className="flex items-center gap-3 text-xs font-bold text-gray-750 cursor-pointer p-2.5 bg-white border border-purple-100 rounded-2xl hover:bg-purple-100/50 transition-colors shadow-xs">
                <input 
                  type="checkbox" 
                  checked={formData.pihak_yang_diinfokan.includes(pihak)}
                  onChange={() => handleCheckboxGroupChange('pihak_yang_diinfokan', pihak)}
                  className="rounded-md border-purple-400 text-purple-700 focus:ring-purple-600 w-4 h-4"
                />
                {pihak}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-800 mb-2.5">Bantuan / Tindak Lanjut yang Diperlukan</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BANTUAN_OPTIONS.map(bantuan => (
              <label key={bantuan} className="flex items-center gap-3 text-xs font-bold text-gray-750 cursor-pointer p-2.5 bg-white border border-purple-100 rounded-2xl hover:bg-purple-100/50 transition-colors shadow-xs">
                <input 
                  type="checkbox" 
                  checked={formData.bantuan_yang_diperlukan.includes(bantuan)}
                  onChange={() => handleCheckboxGroupChange('bantuan_yang_diperlukan', bantuan)}
                  className="rounded-md border-purple-400 text-purple-700 focus:ring-purple-600 w-4 h-4"
                />
                {bantuan}
              </label>
            ))}
          </div>
          <div className="mt-4">
            <input 
              type="text" 
              name="detail_bantuan" 
              value={formData.detail_bantuan} 
              onChange={handleInputChange} 
              placeholder="Detail tambahan bantuan khusus (opsional)..."
              className="w-full px-4 py-2.5 border border-purple-300 rounded-2xl text-xs bg-white focus:ring-2 focus:ring-purple-600 outline-none transition-all shadow-xs"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-800 hover:to-indigo-900 disabled:opacity-50 text-white rounded-2xl font-bold shadow-lg transition-all text-xs flex items-center justify-center gap-2 border border-purple-600">
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />} Simpan Peristiwa
        </button>
      </div>
    </form>
  );
};

const IncidentDetail = ({ incident, onBack, onEdit, currentUser, onLogout }) => {
  if (!incident) return null;

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 pb-12 space-y-6 animate-in fade-in duration-300">
      <HeaderNav currentUser={currentUser} onLogout={onLogout} />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2.5 text-gray-600 hover:bg-purple-100 rounded-2xl shadow-sm border border-purple-300 transition-colors bg-white">
            <ArrowLeft size={20} />
          </button>
          <div>
            <span className="text-[11px] font-bold text-purple-950 bg-purple-200 px-3 py-0.5 rounded-full border border-purple-300">{incident.incident_id}</span>
            <h2 className="text-lg font-extrabold text-gray-900 mt-0.5">Detail Peristiwa</h2>
          </div>
        </div>

        <button 
          onClick={() => onEdit(incident)} 
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-2xl font-bold text-xs shadow-md transition-all border border-purple-600"
        >
          <Edit3 size={15} /> Edit Peristiwa
        </button>
      </div>

      <div className="bg-gradient-to-b from-white via-purple-50/20 to-indigo-50/30 rounded-3xl border border-purple-200 shadow-sm overflow-hidden divide-y divide-purple-200">
        <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gradient-to-r from-purple-100/80 to-indigo-100/70 border-b border-purple-200">
          <div>
            <p className="text-[11px] text-purple-950 font-extrabold uppercase tracking-wide">Tanggal & Waktu</p>
            <p className="font-bold text-gray-900 mt-1 flex items-center gap-1.5 text-xs">
              <Calendar size={13} className="text-purple-700"/> {incident.tanggal_kejadian} • {incident.waktu_kejadian}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-purple-950 font-extrabold uppercase tracking-wide">Tempat & Pelapor</p>
            <p className="font-bold text-gray-900 mt-1 flex items-center gap-1.5 text-xs">
              <MapPin size={13} className="text-purple-700"/> {incident.tempat_kejadian}
            </p>
            <p className="text-[11px] text-purple-900 font-semibold mt-1">Oleh: {incident.guru_pembuat || incident.created_by}</p>
          </div>
          <div>
            <p className="text-[11px] text-purple-950 font-extrabold uppercase tracking-wide">Kategori</p>
            <p className="font-extrabold text-purple-950 mt-1 text-xs bg-purple-200/90 inline-block px-2.5 py-1 rounded-xl border border-purple-300">{incident.kategori}</p>
          </div>
        </div>

        <div className="p-6 space-y-3 bg-white/70">
          <h3 className="text-xs font-extrabold text-purple-950 uppercase tracking-wider">Siswa Terkait ({incident.participants ? incident.participants.length : 0})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {incident.participants && incident.participants.map((p, idx) => (
              <div key={idx} className="p-3.5 bg-gradient-to-br from-indigo-50/80 to-purple-50/80 border border-purple-200 rounded-2xl flex justify-between items-center shadow-xs">
                <div>
                  <p className="font-bold text-gray-900 text-xs">{p.name}</p>
                  <p className="text-[11px] font-semibold text-purple-900">Kelas: {p.kelas} • NIS: {p.nis}</p>
                </div>
                <span className="px-3 py-1 text-[10px] font-bold rounded-xl bg-purple-200 text-purple-950 border border-purple-300">{p.peran}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 space-y-2 bg-purple-50/20">
          <h3 className="text-xs font-extrabold text-purple-950 uppercase tracking-wider">Ringkasan Kejadian</h3>
          <p className="text-gray-800 text-xs bg-white p-4 rounded-2xl whitespace-pre-wrap leading-relaxed border border-purple-200 shadow-xs">{incident.ringkasan_kejadian}</p>
        </div>

        {incident.upaya_penyelesaian && (
          <div className="p-6 space-y-2 bg-indigo-50/20">
            <h3 className="text-xs font-extrabold text-purple-950 uppercase tracking-wider">Upaya Penyelesaian</h3>
            <p className="text-gray-800 text-xs bg-white p-4 rounded-2xl whitespace-pre-wrap leading-relaxed border border-purple-200 shadow-xs">{incident.upaya_penyelesaian}</p>
          </div>
        )}

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white/80">
          <div>
            <h3 className="text-xs font-extrabold text-purple-950 uppercase tracking-wider mb-3">Pihak yang Diinfokan</h3>
            {incident.pihak_yang_diinfokan && incident.pihak_yang_diinfokan.length > 0 ? (
              <ul className="space-y-2">
                {(typeof incident.pihak_yang_diinfokan === 'string' ? incident.pihak_yang_diinfokan.split(', ') : incident.pihak_yang_diinfokan).map((pihak, idx) => (
                  <li key={idx} className="text-xs font-bold text-gray-800 flex items-center gap-2.5 bg-purple-50/80 p-2.5 rounded-2xl border border-purple-100">
                    <Check size={15} className="text-purple-700" /> {pihak}
                  </li>
                ))}
              </ul>
            ) : <p className="text-xs text-gray-400 italic">Tidak ada catatan.</p>}
          </div>

          <div>
            <h3 className="text-xs font-extrabold text-purple-950 uppercase tracking-wider mb-3">Bantuan / Tindak Lanjut</h3>
            {incident.bantuan_yang_diperlukan && incident.bantuan_yang_diperlukan.length > 0 ? (
              <ul className="space-y-2">
                {(typeof incident.bantuan_yang_diperlukan === 'string' ? incident.bantuan_yang_diperlukan.split(', ') : incident.bantuan_yang_diperlukan).map((bantuan, idx) => (
                  <li key={idx} className="text-xs font-bold text-gray-800 flex items-center gap-2.5 bg-indigo-50/80 p-2.5 rounded-2xl border border-indigo-100">
                    <Check size={15} className="text-indigo-700" /> {bantuan}
                  </li>
                ))}
              </ul>
            ) : <p className="text-xs text-gray-400 italic">Tidak ada catatan.</p>}
            {incident.detail_bantuan && (
              <p className="mt-3 text-[11px] font-semibold text-gray-700 bg-purple-100/70 p-3 rounded-2xl border border-purple-200">Catatan: {incident.detail_bantuan}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [editingIncident, setEditingIncident] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Ambil data dari Google Sheets saat aplikasi dimuat / masuk dashboard
  const fetchIncidents = async () => {
    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes("...")) {
      return; // Skip jika URL belum diatur
    }
    setIsLoading(true);
    try {
      const response = await fetch(GOOGLE_SCRIPT_URL);
      const result = await response.json();
      if (result.status === 'success') {
        setIncidents(result.data || []);
      }
    } catch (error) {
      console.error("Gagal mengambil data dari Google Sheets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchIncidents();
    }
  }, [currentUser]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('login');
  };

  const handleSaveIncident = async (savedIncident) => {
    // Kirim ke Google Apps Script Backend (POST)
    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(savedIncident)
      });
      const result = await response.json();
      if (result.status === 'success') {
        // Refresh data setelah berhasil simpan
        await fetchIncidents();
        setSelectedIncident(savedIncident);
        setCurrentView('detail');
        setEditingIncident(null);
      } else {
        alert("Gagal menyimpan ke Google Sheets: " + result.message);
      }
    } catch (error) {
      console.error("Error saving incident:", error);
      alert("Terjadi kesalahan jaringan saat menyimpan data.");
    }
  };

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50/40 to-purple-100/60 text-gray-900 font-sans selection:bg-purple-300 selection:text-purple-950">
      {currentView === 'dashboard' && (
        <Dashboard 
          onNavigate={(view) => {
            if (view === 'list') fetchIncidents();
            setCurrentView(view);
          }}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}

      {currentView === 'list' && (
        <IncidentList 
          incidents={incidents}
          onViewIncident={(inc) => { setSelectedIncident(inc); setCurrentView('detail'); }}
          onBack={() => setCurrentView('dashboard')}
          currentUser={currentUser}
          onLogout={handleLogout}
          isLoading={isLoading}
        />
      )}

      {currentView === 'create' && (
        <IncidentForm 
          initialData={null}
          onCancel={() => setCurrentView('dashboard')}
          onSave={handleSaveIncident}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}

      {currentView === 'edit' && (
        <IncidentForm 
          initialData={editingIncident}
          onCancel={() => setCurrentView('detail')}
          onSave={handleSaveIncident}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}

      {currentView === 'detail' && (
        <IncidentDetail 
          incident={selectedIncident}
          onBack={() => { setSelectedIncident(null); setCurrentView('list'); }}
          onEdit={(inc) => { setEditingIncident(inc); setCurrentView('edit'); }}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default App;
