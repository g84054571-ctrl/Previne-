
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ChatInterface from './components/ChatInterface';
import InfoLibrary from './components/InfoLibrary';
import SafetySection from './components/SafetySection';
import DiagnosticSection from './components/DiagnosticSection';
import UbsSection from './components/UbsSection';
import GamesSection from './components/GamesSection';
import CommentsSection from './components/CommentsSection';
import { LoginGate } from './components/LoginGate';
import { NavItem } from './types';
import { Heart, ShieldCheck, HelpCircle, Sparkles, MapPin, Award, MessageSquare, ShieldAlert, ArrowRight, Activity, Loader2 } from 'lucide-react';
import { Logo } from './components/Logo';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './services/firebase';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavItem['id']>('home');
  const [user, setUser] = useState<{ nickname: string; email?: string; isAnonymous: boolean } | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Synchronize authentication events from Firebase real-time channel
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        if (firebaseUser.isAnonymous) {
          setUser({ nickname: 'Visitante Anônimo', isAnonymous: true });
        } else {
          try {
            const userSnap = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (userSnap.exists()) {
              setUser({ 
                nickname: userSnap.data().nickname, 
                email: firebaseUser.email || undefined, 
                isAnonymous: false 
              });
            } else {
              setUser({ 
                nickname: 'Membro Previne+', 
                email: firebaseUser.email || undefined, 
                isAnonymous: false 
              });
            }
          } catch (error) {
            console.error("Error reading profile details on state change:", error);
            setUser({ 
              nickname: 'Membro Previne+', 
              email: firebaseUser.email || undefined, 
              isAnonymous: false 
            });
          }
        }
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLoginSuccess = (userProfile: { nickname: string; email?: string; isAnonymous: boolean }) => {
    setUser(userProfile);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setActiveTab('home');
    } catch (err) {
      console.error("Error signing out from Firebase:", err);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-pink flex flex-col items-center justify-center py-8">
        <div className="flex flex-col items-center justify-center p-8 space-y-4">
          <Logo size="lg" centered={true} />
          <div className="flex items-center gap-3 text-purple-600 font-bold text-sm bg-white/85 px-6 py-3 rounded-full border border-purple-100 shadow-xl mt-4 animate-pulse">
            <Loader2 className="animate-spin text-purple-600" size={18} />
            Sincronizando credenciais de cuidado...
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-pink flex flex-col justify-between py-8">
        <div className="flex-1 flex items-center justify-center animate-in fade-in duration-500">
          <LoginGate onLoginSuccess={handleLoginSuccess} />
        </div>
        <footer className="py-4 text-center">
          <p className="text-slate-400 text-[10px] font-black tracking-[0.25em] uppercase">
            BY SPARK TECH OFICIAL
          </p>
        </footer>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'chat': return <ChatInterface />;
      case 'diagnostico': return <DiagnosticSection onNavigateToUbs={() => setActiveTab('ubs')} />;
      case 'ubs': return <UbsSection />;
      case 'jogos': return <GamesSection />;
      case 'comentarios': return <CommentsSection activeUser={user} />;
      case 'info': return <InfoLibrary />;
      case 'safety': return <SafetySection />;
      default: return (
        <div className="space-y-12 animate-in fade-in duration-700">
          <section className="text-center space-y-6 pt-12 relative overflow-hidden flex flex-col items-center justify-center">
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-purple-100 text-purple-700 rounded-full text-xs font-bold border border-purple-200 shadow-sm animate-pulse mb-2">
              <Sparkles size={14} className="text-purple-600" /> Espaço de Cuidado e Orientação
            </div>

            <Logo size="xl" centered={true} />

            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-700 pt-3">
              Inteligência e <span className="gradient-text">Saúde com Empatia</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Dúvidas sobre ISTs? Nosso banco de dados educacional e nossa inteligência artificial estão aqui para te apoiar com sigilo total e base científica.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
              <button 
                onClick={() => setActiveTab('chat')}
                className="previne-gradient-bg text-white px-10 py-5 rounded-[2rem] font-black text-xl shadow-2xl shadow-purple-200 hover:-translate-y-1 transition-all active:scale-95 duration-200 hover:brightness-105"
              >
                Conversar com IA
              </button>
              <button 
                onClick={() => setActiveTab('diagnostico')}
                className="bg-white text-purple-600 border-2 border-purple-100 px-10 py-5 rounded-[2rem] font-bold text-xl hover:bg-purple-50/50 hover:-translate-y-1 transition-all shadow-md active:scale-95 duration-200"
              >
                Fazer Autoexame
              </button>
            </div>
          </section>

          {/* Quick interactive features panel */}
          <section className="space-y-6">
            <div className="text-center md:text-left space-y-1">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Recursos e Ferramentas Práticas</h2>
              <p className="text-slate-500 text-sm">Use nossos módulos interativos criados para garantir seu bem-estar físico e mental.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Diagnostico Card */}
              <div 
                onClick={() => setActiveTab('diagnostico')}
                className="p-6 bg-white border border-purple-50 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-purple-200 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-all">
                    <Activity size={24} />
                  </div>
                  <h3 className="text-lg font-black text-slate-800 mb-1.5">Autoexame Coletivo</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">Descubra seu perfil preventivo, riscos e orientações sobre PEP e PrEP.</p>
                </div>
                <span className="text-xs font-bold text-purple-600 group-hover:underline mt-4 flex items-center gap-1">
                  Iniciar Diagnóstico <ArrowRight size={12} />
                </span>
              </div>

              {/* UBS map Locator Card */}
              <div 
                onClick={() => setActiveTab('ubs')}
                className="p-6 bg-white border border-pink-50 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-pink-200 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-pink-600 group-hover:text-white transition-all">
                    <MapPin size={24} />
                  </div>
                  <h3 className="text-lg font-black text-slate-800 mb-1.5">UBS mais Próximas</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">Geolocalize os Centros do SUS e pegue preservativos e PEP gratuitos.</p>
                </div>
                <span className="text-xs font-bold text-pink-600 group-hover:underline mt-4 flex items-center gap-1">
                  Ver Mapa & Endereços <ArrowRight size={12} />
                </span>
              </div>

              {/* Games Card */}
              <div 
                onClick={() => setActiveTab('jogos')}
                className="p-6 bg-white border border-orange-50 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-orange-200 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-orange-600 group-hover:text-white transition-all">
                    <Award size={24} />
                  </div>
                  <h3 className="text-lg font-black text-slate-800 mb-1.5">Jogos de Educação</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">Aprenda brincando e desmistifique tabus com o jogo "Mito ou Verdade".</p>
                </div>
                <span className="text-xs font-bold text-orange-600 group-hover:underline mt-4 flex items-center gap-1">
                  Jogar e Ganhar XP <ArrowRight size={12} />
                </span>
              </div>

              {/* Feedback Board Card */}
              <div 
                onClick={() => setActiveTab('comentarios')}
                className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-slate-350 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-all">
                    <MessageSquare size={24} />
                  </div>
                  <h3 className="text-lg font-black text-slate-800 mb-1.5">Mural de Cuidado</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">Participe da rede, faça perguntas anônimas ou leia o depoimento dos outros.</p>
                </div>
                <span className="text-xs font-bold text-slate-600 group-hover:underline mt-4 flex items-center gap-1">
                  Acessar Comentários <ArrowRight size={12} />
                </span>
              </div>
            </div>
          </section>

          <section className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-white rounded-[2.5rem] border border-purple-50/50 shadow-sm hover:shadow-xl hover:shadow-purple-100/30 transition-all group duration-300">
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                <Heart size={28} />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-3">Apoio Emocional</h3>
              <p className="text-slate-500 leading-relaxed">Informações apresentadas de forma leve, sem estigmas ou julgamentos morais.</p>
            </div>
            <div className="p-8 bg-white rounded-[2.5rem] border border-pink-50/50 shadow-sm hover:shadow-xl hover:shadow-pink-100/30 transition-all group duration-300">
              <div className="w-14 h-14 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-pink-600 group-hover:text-white transition-colors duration-300">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-3">Privacidade Plena</h3>
              <p className="text-slate-500 leading-relaxed">Seu anonimato é garantido. Pergunte sobre tudo sem medo de exposição ou julgamento.</p>
            </div>
            <div className="p-8 bg-white rounded-[2.5rem] border border-orange-50/50 shadow-sm hover:shadow-xl hover:shadow-orange-100/30 transition-all group duration-300">
              <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
                <HelpCircle size={28} />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-3">Guia Completo</h3>
              <p className="text-slate-500 leading-relaxed">Sintomas, prevenção e diagnóstico das principais ISTs em um só lugar.</p>
            </div>
          </section>

          <section className="bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900 rounded-[3rem] p-12 text-white text-center relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <h2 className="text-3xl font-black mb-4">Informação é a melhor prevenção</h2>
              <p className="text-pink-100 text-lg mb-10 max-w-2xl mx-auto opacity-90">
                A saúde sexual não deve ser um tabu. Conhecer seu corpo e as formas de proteção é um ato de amor próprio.
              </p>
              <div className="flex flex-wrap justify-center gap-10">
                <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-3xl border border-white/20">
                  <p className="text-4xl font-black text-orange-400">100%</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-black">Sigilo</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-3xl border border-white/20">
                  <p className="text-4xl font-black text-pink-400">Oficial</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-black">Fontes do SUS</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-3xl border border-white/20">
                  <p className="text-4xl font-black text-purple-400">Educação</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-black">Científica</p>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] translate-y-1/2"></div>
            <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px] -translate-y-1/2"></div>
          </section>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pt-20 md:pb-8 bg-gradient-pink">
      <Navbar currentTab={activeTab} onTabChange={setActiveTab} user={user} onLogout={handleLogout} />
      
      <main className="max-w-6xl mx-auto px-4 pt-10 md:pt-8">
        {renderContent()}
      </main>

      <footer className="mt-20 py-12 text-center border-t border-purple-100/50">
        <p className="text-slate-400 text-xs font-medium tracking-wide">
          © {new Date().getFullYear()} Previne+ • BY SPARK TECH OFICIAL • EDUCAÇÃO EM SAÚDE <br />
          <span className="previne-gradient-text font-black mt-2 block">Cuidado é a nossa linguagem principal.</span>
        </p>
      </footer>
    </div>
  );
};

export default App;
