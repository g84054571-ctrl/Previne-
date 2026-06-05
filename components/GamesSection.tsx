import React, { useState } from 'react';
import { HelpCircle, Star, Award, ShieldCheck, Heart, Sparkles, RefreshCw, XCircle, CheckCircle2, ArrowRight } from 'lucide-react';

interface GameStatement {
  id: number;
  text: string;
  isTrue: boolean;
  explanation: string;
  category: 'HIV' | 'Prevenção' | 'Sintomas' | 'Contágio';
}

const STATEMENTS: GameStatement[] = [
  {
    id: 1,
    text: "O beijo na boca pode transmitir o vírus do HIV.",
    isTrue: false,
    explanation: "Mito! O vírus HIV não é transmitido pela saliva. Beijos na boca, abraços, aperto de mão e compartilhamento de pratos ou talheres são 100% seguros.",
    category: 'Contágio'
  },
  {
    id: 2,
    text: "A PEP (Profilaxia Pós-Exposição) pode ser tomada gratuitamente pelo SUS e funciona melhor se iniciada nas primeiras horas após a relação desprotegida.",
    isTrue: true,
    explanation: "Verdade! A PEP deve ser idealmente iniciada nas primeiras 2 a 24 horas, estendendo-se até o limite máximo de 72 horas após o evento de risco.",
    category: 'Prevenção'
  },
  {
    id: 3,
    text: "É perfeitamente possível contrair uma IST e viver anos sem apresentar nenhum sintoma visível.",
    isTrue: true,
    explanation: "Verdade! Muitas ISTs (como Clamídia, Sífilis e o próprio HIV) costumam ser assintomáticas por longos períodos. Por isso a testagem regular de rotina é tão relevante.",
    category: 'Sintomas'
  },
  {
    id: 4,
    text: "Usar duas camisinhas ao mesmo tempo dobra o nível de proteção e segurança.",
    isTrue: false,
    explanation: "Mito! A fricção entre os dois preservativos latex aumenta drasticamente o risco de friccionar e romper a barreira protetora. Use apenas uma camisinha de boa qualidade.",
    category: 'Prevenção'
  },
  {
    id: 5,
    text: "Gestantes diagnosticadas com HIV podem realizar o tratamento adequado de pré-natal e dar à luz bebês 100% livres do vírus.",
    isTrue: true,
    explanation: "Verdade! O tratamento antirretroviral moderno durante a gestação e o acompanhamento correto praticamente reduzem a zero o risco de transmissão de mãe para filho.",
    category: 'HIV'
  },
  {
    id: 6,
    text: "Se o parceiro ou parceira não tem corrimento nem feridas genitais aparentes, não há risco de transmissão de nenhuma IST.",
    isTrue: false,
    explanation: "Mito! Infecções como o HPV e a Sífilis em fase inicial ou latente podem ser transmitidas mesmo na total ausência de feridas abertas ou secreções.",
    category: 'Contágio'
  }
];

export const GamesSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const handleAnswer = (answer: boolean) => {
    setUserAnswer(answer);
    setShowExplanation(true);
    if (answer === STATEMENTS[currentIndex].isTrue) {
      setScore(prev => prev + 10);
    }
  };

  const handleNext = () => {
    setUserAnswer(null);
    setShowExplanation(false);
    if (currentIndex < STATEMENTS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setGameOver(true);
    }
  };

  const restartGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setUserAnswer(null);
    setShowExplanation(false);
    setGameOver(false);
  };

  const currentStatement = STATEMENTS[currentIndex];
  const progressPercent = Math.round(((currentIndex) / STATEMENTS.length) * 100);

  return (
    <div className="max-w-3xl mx-auto py-6 animate-in fade-in duration-500 space-y-6">
      {/* Game Header */}
      <div className="text-center">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center justify-center gap-2">
          <Award className="text-orange-500" size={32} />
          Mito ou Verdade: Saúde Sexual
        </h2>
        <p className="text-slate-500 mt-2 max-w-lg mx-auto text-sm leading-relaxed">
          Participe do nosso mini-game de conscientização interativo e quebre mitos com embasamento científico!
        </p>
      </div>

      {!gameOver ? (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-8 relative overflow-hidden space-y-6">
          {/* Progress Section */}
          <div className="flex justify-between items-center text-xs font-black text-slate-400">
            <span className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full text-purple-600">
              Questão {currentIndex + 1} de {STATEMENTS.length}
            </span>
            <span className="flex items-center gap-1.5 text-orange-500">
              <Star size={14} className="fill-current" />
              Pontuação: {score} XP
            </span>
          </div>

          <div className="w-full h-1.5 bg-slate-100 rounded-full">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-purple-600 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / STATEMENTS.length) * 100}%` }}
            ></div>
          </div>

          {/* Statement Board */}
          <div className="bg-slate-50 border border-slate-100/50 rounded-[2rem] p-8 text-center space-y-4">
            <span className="bg-purple-100 text-purple-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
              Tópico: {currentStatement.category}
            </span>
            <p className="text-xl md:text-2xl font-black text-slate-800 leading-relaxed">
              "{currentStatement.text}"
            </p>
          </div>

          {/* Buttons or Feedback Card */}
          {!showExplanation ? (
            <div className="grid grid-cols-2 gap-4 pt-2">
              <button
                onClick={() => handleAnswer(false)}
                className="py-5 bg-gradient-to-br from-purple-100 to-pink-50 border border-pink-100 hover:border-pink-300 text-purple-800 hover:text-pink-900 rounded-2xl font-black text-lg transition-all active:scale-95 text-center shadow-sm"
              >
                Mito 👎
              </button>
              <button
                onClick={() => handleAnswer(true)}
                className="py-5 bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 hover:border-orange-300 text-orange-850 hover:text-orange-950 rounded-2xl font-black text-lg transition-all active:scale-95 text-center shadow-sm"
              >
                Verdade 👍
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-in zoom-in-95 duration-300 pt-2">
              {userAnswer === currentStatement.isTrue ? (
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex items-center gap-3.5 text-emerald-900">
                  <CheckCircle2 size={28} className="text-emerald-500 shrink-0" />
                  <div>
                    <h5 className="font-extrabold text-sm">Resposta Correta! (+10 XP)</h5>
                    <p className="text-xs text-emerald-700 mt-0.5">Parabéns pela percepção cuidadosa.</p>
                  </div>
                </div>
              ) : (
                <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 flex items-center gap-3.5 text-rose-900">
                  <XCircle size={28} className="text-rose-500 shrink-0" />
                  <div>
                    <h5 className="font-extrabold text-sm">Quase lá!</h5>
                    <p className="text-xs text-rose-700 mt-0.5">O mais importante é aprender novas perspectivas.</p>
                  </div>
                </div>
              )}

              {/* In-depth scientific explanation */}
              <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl">
                <h5 className="font-black text-slate-800 text-sm mb-2">Explicação Científica:</h5>
                <p className="text-slate-600 text-sm leading-relaxed">{currentStatement.explanation}</p>
              </div>

              {/* Progress arrow */}
              <button
                onClick={handleNext}
                className="w-full previne-gradient-bg text-white py-4 rounded-xl font-bold text-sm tracking-wide shadow-lg hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {currentIndex < STATEMENTS.length - 1 ? "Próxima Afirmação" : "Ver Meu Resultado"}
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-8 text-center space-y-6 animate-in zoom-in-100 duration-500">
          <div className="w-20 h-20 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
            <Award size={48} className="fill-current" />
          </div>

          <div className="space-y-1">
            <h3 className="text-3xl font-black text-slate-800 leading-tight">Mini-game Concluído!</h3>
            <p className="text-slate-500 text-sm">Muito obrigado por testar sua conscientização.</p>
          </div>

          {/* Score summary panel */}
          <div className="max-w-xs mx-auto bg-slate-50 border border-slate-100 p-5 rounded-3xl space-y-2">
            <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Desempenho Geral</span>
            <p className="text-4xl font-black text-purple-600">
              {score} / 60 <span className="text-xs text-slate-400">XP</span>
            </p>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              {score >= 50 
                ? "Excelente! Você demonstra alto conhecimento e cuidado sobre autocuidado em saúde sexual!" 
                : score >= 30 
                ? "Bom trabalho! Que tal continuar navegando pela nossa biblioteca para dominar os temas?" 
                : "Informação é proteção! Refaça o teste quando desejar para fixar os conceitos científicos."}
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={restartGame}
              className="px-8 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-all shadow-md active:scale-95 text-sm flex items-center justify-center gap-2"
            >
              <RefreshCw size={14} /> Jogar Novamente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamesSection;
