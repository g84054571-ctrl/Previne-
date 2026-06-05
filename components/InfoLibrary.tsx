
import React, { useState } from 'react';
import { COMMON_ISTS } from '../constants';
import { Search, ChevronRight, Activity, ShieldCheck, Stethoscope, Microscope, ExternalLink as LinkIcon } from 'lucide-react';
import { ISTInfo } from '../types';

const InfoLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIST, setSelectedIST] = useState<ISTInfo | null>(null);

  const filtered = COMMON_ISTS.filter(ist => 
    ist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto py-4 animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Recursos Educacionais</h2>
        <p className="text-slate-600">Base de dados científica sobre prevenção, diagnóstico e cuidado em ISTs.</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" size={20} />
        <input
          type="text"
          placeholder="Pesquisar no banco de dados..."
          className="w-full bg-white border border-purple-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {selectedIST ? (
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-purple-50 animate-in fade-in zoom-in-95 duration-300">
          <button 
            onClick={() => setSelectedIST(null)}
            className="text-purple-600 font-semibold mb-6 flex items-center gap-2 hover:bg-purple-50 w-fit px-4 py-2 rounded-full transition-colors"
          >
            ← Voltar à lista
          </button>
          
          <div className="border-b border-purple-50 pb-6 mb-6">
            <h3 className="text-4xl font-black text-slate-800 mb-3">{selectedIST.name}</h3>
            <p className="text-xl text-slate-600 leading-relaxed">{selectedIST.description}</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-purple-50/50 p-6 rounded-2xl border border-purple-100/50">
              <div className="flex items-center gap-2 text-purple-700 font-bold mb-3">
                <Activity size={20} /> Sintomas Comuns
              </div>
              <ul className="space-y-2">
                {selectedIST.symptoms.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-purple-900 text-sm">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100/50">
              <div className="flex items-center gap-2 text-emerald-700 font-bold mb-3">
                <ShieldCheck size={20} /> Métodos de Prevenção
              </div>
              <p className="text-sm text-emerald-800 leading-relaxed">{selectedIST.prevention}</p>
            </div>

            <div className="bg-sky-50/50 p-6 rounded-2xl border border-sky-100/50">
              <div className="flex items-center gap-2 text-sky-700 font-bold mb-3">
                <Microscope size={20} /> Como é feito o Diagnóstico
              </div>
              <p className="text-sm text-sky-800 leading-relaxed">{selectedIST.diagnosis}</p>
            </div>

            <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100/50">
              <div className="flex items-center gap-2 text-orange-700 font-bold mb-3">
                <Stethoscope size={20} /> Tratamento e Cuidados
              </div>
              <p className="text-sm text-orange-800 leading-relaxed">{selectedIST.treatment}</p>
            </div>
          </div>

          <div className="border-t border-purple-100 pt-6">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <LinkIcon size={18} /> Saiba mais em fontes oficiais:
            </h4>
            <div className="flex flex-wrap gap-3">
              {selectedIST.links.map((link, i) => (
                <a 
                   key={i} 
                   href={link.url} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="bg-white border border-purple-200 text-purple-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-purple-600 hover:text-white transition-all flex items-center gap-2 shadow-sm"
                >
                  {link.label} <LinkIcon size={14} />
                </a>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map(ist => (
            <button
              key={ist.id}
              onClick={() => setSelectedIST(ist)}
              className="flex items-center justify-between p-6 bg-white border border-purple-50 rounded-2xl hover:border-purple-300 hover:shadow-lg hover:shadow-purple-100/50 transition-all group text-left"
            >
              <div>
                <h4 className="text-xl font-bold text-slate-800 group-hover:text-purple-600 transition-colors mb-1">{ist.name}</h4>
                <p className="text-slate-500 text-sm line-clamp-1">{ist.description}</p>
              </div>
              <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all">
                <ChevronRight size={24} />
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-purple-50 text-purple-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={32} />
              </div>
              <p className="text-slate-400">Não encontramos resultados para "{searchTerm}".</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InfoLibrary;
