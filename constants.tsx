
import { ISTInfo } from './types';

const OFFICIAL_LINKS = [
  { label: 'Ministério da Saúde (Brasil)', url: 'https://www.gov.br/saude/pt-br/assuntos/saude-de-a-z/i/ist' },
  { label: 'OMS - Saúde Sexual', url: 'https://www.who.int/health-topics/sexual-health' }
];

export const COMMON_ISTS: ISTInfo[] = [
  {
    id: 'hiv',
    name: 'HIV/AIDS',
    description: 'O Vírus da Imunodeficiência Humana ataca as células de defesa do corpo.',
    symptoms: ['Febre recorrente', 'Fadiga extrema', 'Suores noturnos', 'Pode ser assintomático por anos'],
    prevention: 'Uso de preservativos, PrEP (Pré-Exposição) e PEP (Pós-Exposição).',
    diagnosis: 'Testes rápidos de sangue ou saliva, exames laboratoriais (ELISA).',
    treatment: 'Terapia Antirretroviral (TARV) que torna o vírus indetectável e intransmissível.',
    links: [...OFFICIAL_LINKS, { label: 'UNAIDS Brasil', url: 'https://unaids.org.br/' }]
  },
  {
    id: 'sifilis',
    name: 'Sífilis',
    description: 'Infecção bacteriana curável que se manifesta em estágios (primária, secundária, latente e terciária).',
    symptoms: ['Ferida indolor genital (cancro)', 'Manchas nas palmas das mãos/pés', 'Febre'],
    prevention: 'Uso consistente de preservativos e pré-natal adequado.',
    diagnosis: 'Exame de sangue VDRL e testes rápidos.',
    treatment: 'Antibióticos prescritos por médicos (geralmente Penicilina Benzatina).',
    links: OFFICIAL_LINKS
  },
  {
    id: 'hpv',
    name: 'HPV',
    description: 'Vírus que causa lesões na pele e mucosas, principal fator de risco para câncer de colo do útero.',
    symptoms: ['Verrugas genitais (crista de galo)', 'Lesões microscópicas'],
    prevention: 'Vacinação (disponível no SUS), preservativos e exames preventivos (Papanicolau).',
    diagnosis: 'Exame clínico, Papanicolau, Colposcopia e testes de DNA-HPV.',
    treatment: 'Remoção das verrugas e acompanhamento das lesões precursoras de câncer.',
    links: OFFICIAL_LINKS
  },
  {
    id: 'hepatites',
    name: 'Hepatites B e C',
    description: 'Infecções que atingem o fígado, podendo causar cirrose ou câncer se não tratadas.',
    symptoms: ['Icterícia (olhos amarelos)', 'Urina escura', 'Cansaço'],
    prevention: 'Vacinação (para Hep B), não compartilhar agulhas ou objetos cortantes.',
    diagnosis: 'Exames de sangue específicos (sorologia).',
    treatment: 'Antivirais específicos fornecidos pelo SUS.',
    links: OFFICIAL_LINKS
  },
  {
    id: 'herpes',
    name: 'Herpes Genital',
    description: 'Infecção viral recorrente que causa pequenas bolhas dolorosas.',
    symptoms: ['Bolhas agrupadas', 'Ardor e coceira local', 'Feridas que cicatrizam e voltam'],
    prevention: 'Uso de preservativos (proteção parcial) e evitar contato durante crises.',
    diagnosis: 'Avaliação clínica e, se necessário, raspagem da lesão para análise.',
    treatment: 'Medicamentos antivirais para reduzir a duração e frequência das crises.',
    links: OFFICIAL_LINKS
  }
];

export const SYSTEM_INSTRUCTION = `Você é o Previne+, um assistente especializado em saúde sexual.
Responda sempre com empatia, usando um tom acolhedor. Seu tema visual baseia-se em tons de Roxo, Rosa e Laranja/Coral, representando acolhimento, cuidado e vitalidade.
Instruções:
1. Nunca dê diagnósticos.
2. Sempre sugira o SUS (UBS/CTA).
3. Baseie-se em evidências científicas.
4. Explique termos técnicos de forma simples.
5. Se o usuário estiver angustiado, acolha o sentimento antes de dar a informação técnica.`;
