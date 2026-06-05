import React, { useState } from 'react';
import { ShieldCheck, Heart, AlertCircle, HelpCircle, ArrowRight, RefreshCw, Smartphone, MapPin, Clock, Info } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options: {
    label: string;
    value: string;
    weight: 'high' | 'medium' | 'low';
    alert?: string;
  }[];
}

export const DiagnosticSection: React.FC<{ onNavigateToUbs: () => void }> = ({ onNavigateToUbs }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);

  const questions: Question[] = [
    {
      id: 1,
      text: "Qual é o principal motivo do autoexame preventivo hoje?",
      options: [
        { label: "Tive uma relação sexual recente sem uso de preservativo", value: "unprotected_sex", weight: "high" },
        { label: "Estou apresentando sintomas ou alteração física na região íntima", value: "symptoms", weight: "high" },
        { label: "Quero entender meu perfil de prevenção ativa (PrEP/PEP, vacinas)", value: "routine", weight: "low" },
        { label: "Apenas curiosidade / prevenção educativa geral", value: "educational", weight: "low" }
      ]
    },
    {
      id: 2,
      text: "Se houve alguma exposição, há quanto tempo isso ocorreu aproximadamente?",
      options: [
        { 
          label: "Menos de 72 horas (Janela crítica)", 
          value: "less_72h", 
          weight: "high",
          alert: "Atenção crucial: Se você correu risco de exposição ao HIV há menos de 72h, você se enquadra no protocolo do PEP (Profilaxia Pós-Exposição). Procure uma UBS ou CTA imediatamente!"
        },
        { label: "Entre 72 horas e 30 dias", value: "mid_range", weight: "medium" },
        { label: "Mais de 30 dias atrás", value: "long_term", weight: "low" },
        { label: "Não tive nenhuma exposição de risco recente", value: "no_risk", weight: "low" }
      ]
    },
    {
      id: 3,
      text: "Você percebeu alguma destas manifestações físicas recentemente?",
      options: [
        { label: "Feridas, bolhas ou verrugas na região genital, anal ou oral", value: "wounds", weight: "high" },
        { label: "Corrimento incomum ou dor e ardor intensos ao urinar", value: "discharge", weight: "high" },
        { label: "Ínguas inchadas, febre leve inexplicada ou manchas avermelhadas na pele", value: "systemic", weight: "medium" },
        { label: "Nenhuma destas alterações ou sem sintomas", value: "none", weight: "low" }
      ]
    },
    {
      id: 4,
      text: "Qual é o seu método ou histórico de prevenção atual?",
      options: [
        { label: "Uso preservativos ou barreiras protetoras em todas as relações", value: "always_protected", weight: "low" },
        { label: "Faço uso regular de PrEP (Profilaxia Pré-Exposição) e testagens rápidas", value: "prep", weight: "low" },
        { label: "Tenho o hábito de testar periodicamente, mas uso preservativo de forma inconstante", value: "partial", weight: "medium" },
        { label: "Não adoto nenhum método ou não tenho informações claras sobre proteção", value: "none", weight: "medium" }
      ]
    }
  ];

  const handleSelectOption = (questionId: number, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResult(true);
    }
  };

  const getResultsData = () => {
    // Determine risk profile
    let highCount = 0;
    let mediumCount = 0;
    let lowCount = 0;
    let includesUrgentPep = false;

    // Check if less than 72h exposure
    if (answers[2] === "less_72h") {
      includesUrgentPep = true;
    }

    Object.entries(answers).forEach(([qId, val]) => {
      const question = questions.find(q => q.id === Number(qId));
      const option = question?.options.find(o => o.value === val);
      if (option?.weight === 'high') highCount++;
      if (option?.weight === 'medium') mediumCount++;
      if (option?.weight === 'low') lowCount++;
    });

    let riskLevel: 'high' | 'medium' | 'low' = 'low';
    if (highCount > 0 || includesUrgentPep) {
      riskLevel = 'high';
    } else if (mediumCount > 1) {
      riskLevel = 'medium';
    }

    return {
      riskLevel,
      includesUrgentPep,
      highCount,
      answersSummary: answers
    };
  };

  const resetQuiz = () => {
    setAnswers({});
    setCurrentStep(0);
    setShowResult(false);
  };

  const result = showResult ? getResultsData() : null;

  return (
    <div className="max-w-3xl mx-auto py-6 animate-in fade-in duration-500">
      {/* Visual Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center justify-center gap-2">
          <ShieldCheck className="text-purple-600" size={32} />
          Diagnóstico Preventivo & Autoexame
        </h2>
        <p className="text-slate-500 mt-2 max-w-lg mx-auto text-sm leading-relaxed">
          Responda a perguntas simples de forma 100% privada para entender se há necessidade de atendimento ou cuidados preventivos imediatos.
        </p>
      </div>

      {!showResult ? (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-8 relative overflow-hidden">
          {/* Progress Indicator */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-black text-purple-600 uppercase tracking-widest">
              Passo {currentStep + 1} de {questions.length}
            </span>
            <span className="text-xs font-medium text-slate-400">
              {Math.round(((currentStep + 1) / questions.length) * 100)}% Concluído
            </span>
          </div>

          <div className="w-full h-1.5 bg-slate-100 rounded-full mb-8">
            <div 
              className="h-full previne-gradient-bg rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            ></div>
          </div>

          {/* Question Text */}
          <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-8 leading-tight">
            {questions[currentStep].text}
          </h3>

          {/* Options Grid */}
          <div className="grid gap-4">
            {questions[currentStep].options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSelectOption(questions[currentStep].id, opt.value)}
                className="w-full p-5 text-left border border-slate-200 hover:border-purple-300 hover:bg-purple-50/20 rounded-2xl font-semibold text-slate-700 hover:text-slate-900 transition-all active:scale-[0.99] flex items-center justify-between group"
              >
                <span>{opt.label}</span>
                <span className="w-6 h-6 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-purple-600 group-hover:text-white transition-all">
                  <ArrowRight size={14} />
                </span>
              </button>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-2 bg-slate-50 p-4 rounded-xl text-slate-500 text-xs leading-relaxed">
            <HelpCircle size={16} className="text-slate-400 shrink-0" />
            <span>Suas respostas são estritamente mantidas na memória viva do seu navegador e descartadas na página de finalização. Nada é compartilhado ou salvo fora do seu aparelho.</span>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* RESULTS CARD */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-8 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full blur-3xl"></div>

            <div className="text-center mb-8">
              <span className="text-xs uppercase font-black text-slate-400 tracking-[0.2em]">Resultado da Autoavaliação</span>
              
              {result?.riskLevel === 'high' ? (
                <div className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-700 border border-red-100 rounded-full font-black text-sm">
                  <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
                  Requer Atenção / Atendimento Recomendável
                </div>
              ) : result?.riskLevel === 'medium' ? (
                <div className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-amber-50 text-amber-700 border border-amber-100 rounded-full font-black text-sm">
                  <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse"></span>
                  Nível de Cuidado Moderado
                </div>
              ) : (
                <div className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full font-black text-sm">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
                  Perfil Preventivo Operando Normal
                </div>
              )}
            </div>

            {/* URGENT PEP WINDOW BANNER */}
            {result?.includesUrgentPep && (
              <div className="bg-red-50/90 border border-red-200 rounded-3xl p-6 mb-8 text-red-950 flex flex-col md:flex-row gap-4 items-center">
                <div className="p-4 bg-red-600 text-white rounded-2xl">
                  <Clock size={32} className="animate-pulse" />
                </div>
                <div className="space-y-1 text-center md:text-left">
                  <h4 className="font-black text-lg text-red-900">Protocolo PEP Necessário (Abaixo de 72h)</h4>
                  <p className="text-sm text-red-700 leading-relaxed">
                    Você informou ter tido uma relação recente sem método protetivo nas últimas 72 horas. 
                    <strong> A Profilaxia Pós-Exposição (PEP)</strong> é um medicamento que pode prevenir o contágio permanente ao vírus HIV caso tomado dentro desta janela de segurança.
                  </p>
                </div>
              </div>
            )}

            {/* CLINICAL SYMPTOMS BANNER */}
            {answers[3] !== "none" && !result?.includesUrgentPep && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8 text-amber-950 flex gap-4 items-start">
                <AlertCircle size={24} className="text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-extrabold text-amber-900">Sintomas Físicos Observados</h4>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    A presença de corrimentos, feridas, ardência ou verrugas deve ser examinada clinicamente por um profissional de saúde. Algumas infecções bacterianas (como Sífilis e Gonorréia) são facilmente tratáveis com antibióticos específicos. Não faça automedicação!
                  </p>
                </div>
              </div>
            )}

            {/* WHAT TO DO NOW SECTION */}
            <div className="space-y-6">
              <h4 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <Info size={18} className="text-purple-600" />
                Passos e Recomendações Importantes:
              </h4>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-slate-100 p-5 rounded-2xl hover:bg-slate-50/50 transition-all">
                  <h5 className="font-black text-slate-800 mb-1.5 text-sm">Janelas Imunológicas</h5>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Qualquer exame ou auto-teste rápido para HIV e Hepatites tem uma janela de cerca de 30 dias após o evento de risco para exibir um diagnóstico preciso. Testar-se hoje é importante, mas lembre-se de repetir em 30 dias se o risco foi recente.
                  </p>
                </div>

                <div className="border border-slate-100 p-5 rounded-2xl hover:bg-slate-50/50 transition-all">
                  <h5 className="font-black text-slate-800 mb-1.5 text-sm">PrEP (Prevenção Pré-Exposição)</h5>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Caso você tenha uma vida sexualmente ativa frequente e prefira uma prevenção medicamentosa contínua complementar ao uso do preservativo, você pode solicitar acompanhamento de PrEP de forma inteiramente gratuita pelo SUS nas principais UBS brasileiras.
                  </p>
                </div>
              </div>

              <div className="bg-purple-50/50 p-6 rounded-3xl border border-purple-100/30 text-center space-y-4">
                <p className="font-bold text-purple-950 text-sm">
                  Quer saber onde realizar sua testagem rápida ou receber atendimento sigiloso e doação de preservativos perto de você?
                </p>
                <button
                  onClick={onNavigateToUbs}
                  className="previne-gradient-bg text-white px-8 py-3.5 rounded-full font-black text-sm tracking-wide shadow-lg hover:brightness-105 transition-all inline-flex items-center gap-2"
                >
                  <MapPin size={16} /> Encontrar UBS e CTA mais Próximos
                </button>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <button
                onClick={resetQuiz}
                className="text-slate-500 hover:text-purple-600 font-bold text-xs flex items-center gap-2 py-2 px-4 rounded-xl hover:bg-slate-50 transition-all"
              >
                <RefreshCw size={14} /> Refazer Autoavaliação
              </button>
              <span className="text-[10px] text-slate-400 font-medium">Autoexame meramente educativo e preventivo. Não substitui consulta médica.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosticSection;
