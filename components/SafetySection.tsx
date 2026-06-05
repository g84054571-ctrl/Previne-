
import React from 'react';
import { Lock, Phone, MapPin, ExternalLink, ShieldAlert } from 'lucide-react';

const SafetySection: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 pb-20 md:pb-4">
      <header>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Privacidade & Segurança</h2>
        <p className="text-slate-600">Sua jornada de saúde é protegida e importante para nós.</p>
      </header>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center mb-4">
            <Lock size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Conversa Privada</h3>
          <p className="text-slate-600 text-sm">
            Não armazenamos dados pessoais identificáveis. Suas perguntas ao Previne+ são usadas apenas para gerar respostas no momento da sessão.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <ShieldAlert size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Limites da IA</h3>
          <p className="text-slate-600 text-sm">
            Nossa inteligência artificial é treinada para orientar, não para diagnosticar. Sempre valide informações críticas com um médico.
          </p>
        </div>
      </section>

      <section className="bg-slate-900 text-white rounded-3xl p-8 overflow-hidden relative">
        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-4">Canais de Apoio</h3>
          <div className="space-y-4">
            <a href="tel:136" className="flex items-center gap-4 bg-white/10 p-4 rounded-xl hover:bg-white/20 transition-all">
              <Phone className="text-teal-400" />
              <div>
                <p className="font-bold">Disque Saúde - 136</p>
                <p className="text-xs text-white/60">Atendimento do SUS para dúvidas e orientações.</p>
              </div>
              <ExternalLink size={16} className="ml-auto opacity-50" />
            </a>
            
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl">
              <MapPin className="text-blue-400" />
              <div>
                <p className="font-bold">UBS e CTA</p>
                <p className="text-xs text-white/60">Procure a Unidade Básica de Saúde mais próxima de você.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl"></div>
      </section>

      <div className="bg-purple-50/80 border border-purple-100 p-6 rounded-2xl">
        <h4 className="text-purple-800 font-bold mb-2">Apoio Emocional</h4>
        <p className="text-purple-700 text-sm mb-4">
          Receber um diagnóstico ou ter uma suspeita de IST pode ser difícil. Não passe por isso sozinho. O CVV (Centro de Valorização da Vida) oferece apoio emocional gratuito e sigiloso.
        </p>
        <a href="tel:188" className="inline-block previne-gradient-bg text-white px-6 py-2.5 rounded-full font-bold hover:opacity-90 transition-all shadow-md">
          Ligue 188
        </a>
      </div>
    </div>
  );
};

export default SafetySection;
