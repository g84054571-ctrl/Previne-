import React, { useState, useEffect } from 'react';
import { 
  MapPin, Navigation, Phone, ShieldAlert, HeartHandshake, Eye, Map, 
  AlertCircle, Info, Compass, CheckCircle, BarChart2, TrendingUp, Users, 
  FileText, Activity, Layers, ArrowUpRight, Award, ShieldCheck, ChevronDown, ChevronUp, Search
} from 'lucide-react';

interface HealthUnit {
  name: string;
  lat: number;
  lng: number;
  address: string;
  phone: string;
  state: string;
  city: string;
  services: string[];
}

const HEALTH_UNITS: HealthUnit[] = [
  // São Paulo
  {
    name: "CTA Henfil (Centro de Testagem e Aconselhamento)",
    lat: -23.5489,
    lng: -46.6388,
    address: "Rua Libero Badaró, 504 - Centro, São Paulo - SP",
    phone: "(11) 3259-2226",
    state: "SP",
    city: "São Paulo",
    services: ["Distribuição de PrEP/PEP", "Testagem Rápida HIV/Sifilis", "Preservativos Gratuitos", "Consultas e Apoio Psicológico"]
  },
  {
    name: "CTA Santo Amaro",
    lat: -23.6482,
    lng: -46.7031,
    address: "Rua Promotor Gabriel Nettuzzi Perez, 159 - Santo Amaro, São Paulo - SP",
    phone: "(11) 5683-9111",
    state: "SP",
    city: "São Paulo",
    services: ["Distribuição de PrEP/PEP", "Testagem Rápida Avançada", "Vacinação Hepatite B/HPV", "Aconselhamento"]
  },
  {
    name: "SAE DST/Aids Herbert de Souza",
    lat: -23.5932,
    lng: -46.6111,
    address: "Avenida Aratãs, 589 - Ibirapuera, São Paulo - SP",
    phone: "(11) 5057-0100",
    state: "SP",
    city: "São Paulo",
    services: ["Atendimento Especializado IST", "Entrega de Medicamentos", "PrEP e PEP 24h", "Testagem Rápida"]
  },
  // Rio de Janeiro
  {
    name: "CTA Herbert de Souza (Rocha Maia)",
    lat: -22.9554,
    lng: -43.1812,
    address: "Rua General Severiano, 91 - Botafogo, Rio de Janeiro - RJ",
    phone: "(21) 2295-2252",
    state: "RJ",
    city: "Rio de Janeiro",
    services: ["Testagem Rápida", "Orientação e Prevenção", "Urgência PEP em Janela de 72h", "Entrega de Preservativos"]
  },
  {
    name: "Policlínica Ronaldo Gazolla",
    lat: -22.8423,
    lng: -43.3444,
    address: "Av. Pastor Martin Luther King Junior, 10.976 - Acari, Rio de Janeiro - RJ",
    phone: "(21) 3855-4000",
    state: "RJ",
    city: "Rio de Janeiro",
    services: ["Atendimento UBS Geral", "Testagem Rápida", "Acolhimento IST", "Entrega de Insumos"]
  },
  // Minas Gerais
  {
    name: "CTA Orestes Diniz",
    lat: -19.9234,
    lng: -43.9351,
    address: "Alameda Álvaro Celso, 241 - Santa Efigênia, Belo Horizonte - MG",
    phone: "(31) 3409-9568",
    state: "MG",
    city: "Belo Horizonte",
    services: ["Laboratório de Referência", "Testagem Sigilosa", "Profilaxia PrEP/PEP", "Apoio Multiprofissional"]
  },
  // Distrito Federal
  {
    name: "Hospital Dia da Asa Sul (HDAS - Referência)",
    lat: -15.8111,
    lng: -47.8924,
    address: "Av. L2 Sul, Quadra 508/509 - Asa Sul, Brasília - DF",
    phone: "(61) 3445-5600",
    state: "DF",
    city: "Brasília",
    services: ["Atendimento de Emergência PEP", "Equipe Multidisciplinar IST", "Ambulatório PrEP", "Serviço Social"]
  },
  // Bahia
  {
    name: "CTA Marymar Novais",
    lat: -12.9714,
    lng: -38.5014,
    address: "Rua Carlos Gomes, 108 - Centro, Salvador - BA",
    phone: "(71) 3202-1234",
    state: "BA",
    city: "Salvador",
    services: ["Testagem Rápida Integral", "Atendimento em Psicologia", "Tratamento PrEP/PEP", "Preservativos e Gel Lubrificante"]
  },
  // Pernambuco
  {
    name: "CTA COAS Recife",
    lat: -8.0543,
    lng: -34.8813,
    address: "Rua do Hospício, 526 - Boa Vista, Recife - PE",
    phone: "(81) 3355-1000",
    state: "PE",
    city: "Recife",
    services: ["Aconselhamento e Pré-teste", "Vacinação Complementar", "Distribuição de Auto-testes", "PEPs e PrEPs"]
  },
  // Rio Grande do Sul
  {
    name: "CTA Centro de Porto Alegre",
    lat: -30.0346,
    lng: -51.2177,
    address: "Rua Voluntários da Pátria, 65 - Centro Histórico, Porto Alegre - RS",
    phone: "(51) 3289-4000",
    state: "RS",
    city: "Porto Alegre",
    services: ["Prevenção Combinada", "Atendimento para Adolescentes/Adultos", "Entrega de PEP", "Distribuição de Autoteste"]
  },
  // Ceará
  {
    name: "CTA do Hospital São José (HSJ)",
    lat: -3.7319,
    lng: -38.5267,
    address: "Rua Nestor Victor, 280 - Parquelândia, Fortaleza - CE",
    phone: "(85) 3101-2300",
    state: "CE",
    city: "Fortaleza",
    services: ["Referência em Infectologia", "Internações e Diagnósticos", "Profilaxia PrEP/PEP", "Acompanhamento Avançado"]
  },
  // Amazonas
  {
    name: "Fundação de Medicina Tropical Dr. Heitor Vieira Dourado",
    lat: -3.1190,
    lng: -60.0217,
    address: "Av. Pedro Teixeira, 25 - Planalto, Manaus - AM",
    phone: "(92) 2127-3555",
    state: "AM",
    city: "Manaus",
    services: ["Maior Centro de Tratamento da Região", "Urgências 24 horas", "PrEP e PEP de Emergência", "Aconselhamento"]
  },
  // Acre
  {
    name: "CTA/SAE de Rio Branco",
    lat: -9.974,
    lng: -67.807,
    address: "Avenida Getúlio Vargas, 2151 - Bosque, Rio Branco - AC",
    phone: "(68) 3224-2550",
    state: "AC",
    city: "Rio Branco",
    services: ["Testagem Rápida HIV/Sifilis", "Entrega de PEP e PrEP", "Aconselhamento e Insumos Gratuitos"]
  },
  // Alagoas
  {
    name: "CTA PAM Salgadinho (Bloco I)",
    lat: -9.665,
    lng: -35.735,
    address: "Rua do Imperador, s/n - Centro, Maceió - AL",
    phone: "(82) 3315-5152",
    state: "AL",
    city: "Maceió",
    services: ["Distribuição de Medicamentos e Preservativos", "Atendimento para DST/Aids", "Profilaxia de Emergência"]
  },
  // Amapá
  {
    name: "CTA Macapá (Serviço de Atendimento Especializado)",
    lat: 0.038,
    lng: -51.064,
    address: "Rua Jovino Dinoá, 3815 - Trem, Macapá - AP",
    phone: "(96) 3212-1088",
    state: "AP",
    city: "Macapá",
    services: ["Testagem Rápida Sigilosa", "Grupo de Adesão e Psicologia", "PEP Preventiva"]
  },
  // Espírito Santo
  {
    name: "CTA de Vitória",
    lat: -20.315,
    lng: -40.312,
    address: "Rua Alberto de Oliveira Santos, 42 - Centro, Vitória - ES",
    phone: "(27) 3132-5100",
    state: "ES",
    city: "Vitória",
    services: ["Profilaxia PrEP e PEP do SUS", "Prevenção Combinada", "Autotestes rápidos", "Vacinas Hepatite"]
  },
  // Goiás
  {
    name: "CTA de Goiânia",
    lat: -16.686,
    lng: -49.264,
    address: "Avenida Industrial, s/n - Vila Nova, Goiânia - GO",
    phone: "(62) 3524-1800",
    state: "GO",
    city: "Goiânia",
    services: ["Testagem HIV e Hepatites", "Urgência PEP 24h", "Atendimento de Infecção Genital"]
  },
  // Maranhão
  {
    name: "CTA Lira (Superintendência de Vigilância em Saúde)",
    lat: -2.532,
    lng: -44.302,
    address: "Rua do Passeio, s/n - Lira, São Luís - MA",
    phone: "(98) 3214-7226",
    state: "MA",
    city: "São Luís",
    services: ["Atendimento Especializado em IST", "Distribuição de Insumos", "Assistência PrEP e PEP"]
  },
  // Mato Grosso
  {
    name: "CTA de Cuiabá (Serviço de Assistência Especializada)",
    lat: -15.598,
    lng: -56.094,
    address: "Rua Barão de Melgaço, 1222 - Porto, Cuiabá - MT",
    phone: "(65) 3617-7300",
    state: "MT",
    city: "Cuiabá",
    services: ["Testagem Rápida Integrada", "Suporte Social e Psicológico", "Tratamento de Hepatites e HIV"]
  },
  // Mato Grosso do Sul
  {
    name: "CTA de Campo Grande",
    lat: -20.469,
    lng: -54.620,
    address: "Rua Bahia, 513 - Jardim dos Estados, Campo Grande - MS",
    phone: "(67) 3314-3600",
    state: "MS",
    city: "Campo Grande",
    services: ["Consultas de Infectologia", "PEP pós-exposição 72h", "PrEP e preservativos integrados"]
  },
  // Pará
  {
    name: "Unidade de Referência Especializada em Doenças Infectas (URE DIPE)",
    lat: -1.455,
    lng: -48.490,
    address: "Avenida Senador Lemos, 1054 - Umarizal, Belém - PA",
    phone: "(91) 3242-4522",
    state: "PA",
    city: "Belém",
    services: ["Ambulatório DST/Aids de Alta Complexidade", "Coleta de Exames e Carga Viral", "Medicamentos SUS"]
  },
  // Paraíba
  {
    name: "CTA do Município de João Pessoa",
    lat: -7.115,
    lng: -34.863,
    address: "Rua Capitão José Pessoa, 150 - Jaguaribe, João Pessoa - PB",
    phone: "(83) 3214-7922",
    state: "PB",
    city: "João Pessoa",
    services: ["Aconselhamento rápido e sigiloso", "Tratamentos Avançados", "PEP, PrEP e Preservativos"]
  },
  // Piauí
  {
    name: "CTA de Teresina",
    lat: -5.089,
    lng: -42.801,
    address: "Rua 24 de Janeiro, 124 - Centro, Teresina - PI",
    phone: "(86) 3215-9111",
    state: "PI",
    city: "Teresina",
    services: ["Testagem rápida em massa", "Entrega de PEP 72h", "Prevenção a grupos prioritários"]
  },
  // Rio Grande do Norte
  {
    name: "CTA de Natal",
    lat: -5.794,
    lng: -35.211,
    address: "Rua Ver. João Alves da Silva, s/n - Alecrim, Natal - RN",
    phone: "(84) 3232-4755",
    state: "RN",
    city: "Natal",
    services: ["Aconselhamento Especializado", "Atendimento Multidisciplinar", "Distribuição gratuita de Insumos"]
  },
  // Rondônia
  {
    name: "CTA do Município de Porto Velho",
    lat: -8.761,
    lng: -63.903,
    address: "Avenida Sete de Setembro, 2011 - Centro, Porto Velho - RO",
    phone: "(69) 3901-3111",
    state: "RO",
    city: "Porto Velho",
    services: ["Diagnóstico precoce de HIV e Sífilis", "Trabalho educativo externo", "Distribuição de PrEP"]
  },
  // Roraima
  {
    name: "CTA de Boa Vista",
    lat: 2.823,
    lng: -60.675,
    address: "Avenida Capitão Júlio Bezerra, 1500 - 31 de Março, Boa Vista - RR",
    phone: "(95) 3624-9111",
    state: "RR",
    city: "Boa Vista",
    services: ["Acolhimento humanizado de migrantes e locais", "Testes rápidos", "Prevenção PrEP/PEP"]
  },
  // Santa Catarina
  {
    name: "CTA de Florianópolis",
    lat: -27.595,
    lng: -48.548,
    address: "Rua Tenente Silveira, 250 - Centro, Florianópolis - SC",
    phone: "(48) 3212-3900",
    state: "SC",
    city: "Florianópolis",
    services: ["Atendimento de Infecção Genital e PEP", "Insumos preventivos", "Capacitação regional"]
  },
  // Sergipe
  {
    name: "CTA de Aracaju (Cemar Siqueira Campos)",
    lat: -10.911,
    lng: -37.062,
    address: "Rua Bahia, s/n - Siqueira Campos, Aracaju - SE",
    phone: "(79) 3179-1111",
    state: "SE",
    city: "Aracaju",
    services: ["Aconselhamento e Vacinação", "PrEP e PEP de Emergência 72h", "Kits de autoteste gratuitos"]
  },
  // Tocantins
  {
    name: "CTA de Palmas",
    lat: -10.187,
    lng: -48.331,
    address: "Av. LO 3, Parque Arse 13 (103 Sul), Palmas - TO",
    phone: "(63) 3218-5111",
    state: "TO",
    city: "Palmas",
    services: ["Disponibilização de PEP e PrEP do SUS", "Educação em Saúde Sexual", "Testagem Sigilosa"]
  },
  // Paraná
  {
    name: "CTA de Curitiba",
    lat: -25.428,
    lng: -49.263,
    address: "Rua Francisco Torres, 830 - Centro, Curitiba - PR",
    phone: "(41) 3321-2700",
    state: "PR",
    city: "Curitiba",
    services: ["Orientação e Prevenção", "Urgência PEP de Emergência 72h", "PrEP e Teste Silencioso"]
  }
];

interface StateIstData {
  uf: string;
  stateName: string;
  region: 'Norte' | 'Nordeste' | 'Centro-Oeste' | 'Sudeste' | 'Sul';
  hivRate: number; // taxa de incidência de HIV por 100 mil hab.
  syphilisRate: number; // taxa de Sífilis Adquirida por 100 mil hab.
  hepatitisRate: number; // taxa de Hepatites por 100 mil hab.
  yearlyCasesEst: number; // casos novos anuais reportados no SUS
  susActionAlert: string; // orientação preventiva do SUS
}

const IST_STATS: StateIstData[] = [
  { uf: "AC", stateName: "Acre", region: "Norte", hivRate: 10.3, syphilisRate: 47.1, hepatitisRate: 11.4, yearlyCasesEst: 950, susActionAlert: "Foco em áreas de fronteira. Expansão de equipes volantes de testagem indígena no Acre." },
  { uf: "AL", stateName: "Alagoas", region: "Nordeste", hivRate: 9.1, syphilisRate: 44.3, hepatitisRate: 7.5, yearlyCasesEst: 2600, susActionAlert: "Mobilizações de carnaval nas praias de Maceió com distribuição de autoteste rápido." },
  { uf: "AP", stateName: "Amapá", region: "Norte", hivRate: 11.1, syphilisRate: 42.8, hepatitisRate: 10.1, yearlyCasesEst: 900, susActionAlert: "CTA móvel em Macapá e Santana com foco na prevenção na juventude." },
  { uf: "AM", stateName: "Amazonas", region: "Norte", hivRate: 20.4, syphilisRate: 67.8, hepatitisRate: 15.6, yearlyCasesEst: 6100, susActionAlert: "Força-tarefa estadual em Manaus. Campanhas focadas no autoteste entregue via barcos do SUS." },
  { uf: "BA", stateName: "Bahia", region: "Nordeste", hivRate: 10.9, syphilisRate: 48.7, hepatitisRate: 8.5, yearlyCasesEst: 12500, susActionAlert: "Intensificação de entrega de preservativos no circuito Barra-Ondina e centro histórico baiano." },
  { uf: "CE", stateName: "Ceará", region: "Nordeste", hivRate: 11.5, syphilisRate: 45.6, hepatitisRate: 8.2, yearlyCasesEst: 7500, susActionAlert: "Ampliação das farmácias de postos de saúde de Fortaleza para dispensação rápida de PrEP." },
  { uf: "DF", stateName: "Distrito Federal", region: "Centro-Oeste", hivRate: 16.4, syphilisRate: 68.2, hepatitisRate: 10.2, yearlyCasesEst: 3100, susActionAlert: "Campanha especial nas universidades do DF com foco na Profilaxia de Emergência (PEP)." },
  { uf: "ES", stateName: "Espírito Santo", region: "Sudeste", hivRate: 10.4, syphilisRate: 61.2, hepatitisRate: 11.5, yearlyCasesEst: 4300, susActionAlert: "Mutirões trimestrais de imunização contra Hepatite B e HPV nas escolas públicas do ES." },
  { uf: "GO", stateName: "Goiás", region: "Centro-Oeste", hivRate: 11.2, syphilisRate: 58.6, hepatitisRate: 12.1, yearlyCasesEst: 6400, susActionAlert: "Rede descentralizada SUS em Goiânia e Anápolis agilizando o envio de amostras laboratoriais." },
  { uf: "MA", stateName: "Maranhão", region: "Nordeste", hivRate: 11.8, syphilisRate: 41.5, hepatitisRate: 7.7, yearlyCasesEst: 5400, susActionAlert: "Expansão de leitos de infectologia e ambulatórios descentralizados de IST no interior." },
  { uf: "MT", stateName: "Mato Grosso", region: "Centro-Oeste", hivRate: 13.5, syphilisRate: 64.9, hepatitisRate: 13.8, yearlyCasesEst: 3700, susActionAlert: "Ações de conscientização nas rodovias estaduais para caminhoneiros e motoristas de carga." },
  { uf: "MS", stateName: "Mato Grosso do Sul", region: "Centro-Oeste", hivRate: 14.8, syphilisRate: 70.1, hepatitisRate: 14.2, yearlyCasesEst: 3300, susActionAlert: "Forte atuação nas cidades de fronteira seca, fornecendo insumos rápidos e educação bilíngue." },
  { uf: "MG", stateName: "Minas Gerais", region: "Sudeste", hivRate: 9.2, syphilisRate: 54.3, hepatitisRate: 9.8, yearlyCasesEst: 15400, susActionAlert: "Interiorização do acolhimento IST com teleconsultas e laudos rápidos de exames no SUS." },
  { uf: "PA", stateName: "Pará", region: "Norte", hivRate: 13.1, syphilisRate: 50.4, hepatitisRate: 11.2, yearlyCasesEst: 8200, susActionAlert: "Estratégia do SUS de entrega de PrEP em portos fluviais de rios da Amazônia e Belém." },
  { uf: "PB", stateName: "Paraíba", region: "Nordeste", hivRate: 8.4, syphilisRate: 42.1, hepatitisRate: 7.2, yearlyCasesEst: 3100, susActionAlert: "Fortalecimento do pré-natal seguro para erradicação da Sífilis Congênita nas maternidades." },
  { uf: "PR", stateName: "Paraná", region: "Sul", hivRate: 13.9, syphilisRate: 71.3, hepatitisRate: 18.4, yearlyCasesEst: 11500, susActionAlert: "Distribuição gratuita de camisinhas em grandes shows estaduais e parques de Curitiba." },
  { uf: "PE", stateName: "Pernambuco", region: "Nordeste", hivRate: 12.1, syphilisRate: 53.4, hepatitisRate: 9.1, yearlyCasesEst: 9100, susActionAlert: "Parcerias ativas com blocos de Olinda e Recife para distribuição rápida de PEP em plantão." },
  { uf: "PI", stateName: "Piauí", region: "Nordeste", hivRate: 7.9, syphilisRate: 38.6, hepatitisRate: 6.9, yearlyCasesEst: 1950, susActionAlert: "Unidade Móvel Saúde na Estrada prestando testagens rápidas nos municípios piauienses." },
  { uf: "RJ", stateName: "Rio de Janeiro", region: "Sudeste", hivRate: 17.5, syphilisRate: 92.1, hepatitisRate: 14.1, yearlyCasesEst: 22800, susActionAlert: "Ações intensificadas em comunidades e orlas. Programas integrados de testagem anônima do SUS." },
  { uf: "RN", stateName: "Rio Grande do Norte", region: "Nordeste", hivRate: 9.8, syphilisRate: 51.2, hepatitisRate: 7.9, yearlyCasesEst: 3000, susActionAlert: "Integração das redes com maternidades municipais para blindagem vertical antes do parto." },
  { uf: "RS", stateName: "Rio Grande do Sul", region: "Sul", hivRate: 22.8, syphilisRate: 98.4, hepatitisRate: 20.3, yearlyCasesEst: 15900, susActionAlert: "Histórico de alta incidência requer ação permanente em Porto Alegre. Facilidade no PrEP." },
  { uf: "RO", stateName: "Rondônia", region: "Norte", hivRate: 11.9, syphilisRate: 55.2, hepatitisRate: 13.1, yearlyCasesEst: 1900, susActionAlert: "Atendimento ativo em áreas produtivas e ribeirinhas com fornecimento veloz de PEP." },
  { uf: "RR", stateName: "Roraima", region: "Norte", hivRate: 19.5, syphilisRate: 63.4, hepatitisRate: 12.8, yearlyCasesEst: 1200, susActionAlert: "Atendimento prioritário de imigração vulnerável. Folders e materiais informativos bilingues." },
  { uf: "SC", stateName: "Santa Catarina", region: "Sul", hivRate: 18.2, syphilisRate: 85.6, hepatitisRate: 22.1, yearlyCasesEst: 9800, susActionAlert: "Ações integradas em Florianópolis e Joinville de prevenção e testagem sistemática do SUS." },
  { uf: "SP", stateName: "São Paulo", region: "Sudeste", hivRate: 12.8, syphilisRate: 78.4, hepatitisRate: 15.2, yearlyCasesEst: 43500, susActionAlert: "Maior canal nacional de telePrEP e telePEP por aplicativos do próprio SUS estadual." },
  { uf: "SE", stateName: "Sergipe", region: "Nordeste", hivRate: 10.2, syphilisRate: 49.8, hepatitisRate: 8.1, yearlyCasesEst: 2100, susActionAlert: "CTA móvel do SUS atuando em grandes feiras livres e eventos populares." },
  { uf: "TO", stateName: "Tocantins", region: "Norte", hivRate: 9.5, syphilisRate: 43.1, hepatitisRate: 9.9, yearlyCasesEst: 1500, susActionAlert: "Investimentos em consultório na rua visando populações itinerantes no norte do estado." }
];

// Haversine distance
function calculateDistanceInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const UbsSection: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'map' | 'stats'>('map');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Statistics sub-state
  const [selectedStatState, setSelectedStatState] = useState<string>('SP');
  const [statSortBy, setStatSortBy] = useState<'name' | 'hiv' | 'syphilis' | 'cases'>('name');
  const [statSortOrder, setStatSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('Todos');

  const requestLocation = () => {
    setGeoLoading(true);
    setGeoError(null);
    setSuccessMsg(null);

    if (!navigator.geolocation) {
      setGeoError("Seu navegador não oferece suporte para Geolocalização.");
      setGeoLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setGeoLoading(false);
        setSuccessMsg("Localização captada com sucesso! Unidades ordenadas por proximidade real.");
      },
      (error) => {
        console.error(error);
        setGeoLoading(false);
        setGeoError("Permissão negada ou sinal indisponível. Você pode filtrar manualmente de forma fácil abaixo!");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Pre-calculate and sort units by distance if user coords is available
  const sortedAndFilteredUnits = HEALTH_UNITS.map(unit => {
    if (userCoords) {
      const distance = calculateDistanceInKm(userCoords.lat, userCoords.lng, unit.lat, unit.lng);
      return { ...unit, distance };
    }
    return { ...unit, distance: undefined };
  }).filter(unit => {
    // Stage 1: State Filter
    if (selectedState !== 'Todos' && unit.state !== selectedState) return false;
    
    // Stage 2: Text Search
    if (searchTerm.trim() !== '') {
      const text = `${unit.name} ${unit.city} ${unit.address} ${unit.state}`.toLowerCase();
      if (!text.includes(searchTerm.toLowerCase())) return false;
    }
    
    return true;
  }).sort((a, b) => {
    if (a.distance && b.distance) {
      return a.distance - b.distance;
    }
    return 0; // maintain default
  });

  // Extract unique states for select input
  const availableStates = Array.from(new Set(HEALTH_UNITS.map(u => u.state))).sort();

  // Statistics handler
  const currentStatDetails = IST_STATS.find(s => s.uf === selectedStatState) || IST_STATS[24]; // fallback SP

  const handleSortStats = (field: 'name' | 'hiv' | 'syphilis' | 'cases') => {
    if (statSortBy === field) {
      setStatSortOrder(statSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setStatSortBy(field);
      setStatSortOrder('desc'); // default to high-value first
    }
  };

  const processedStats = [...IST_STATS].filter(item => {
    if (selectedRegionFilter !== 'Todos' && item.region !== selectedRegionFilter) return false;
    return true;
  }).sort((a, b) => {
    const isAsc = statSortOrder === 'asc' ? 1 : -1;
    if (statSortBy === 'name') {
      return a.stateName.localeCompare(b.stateName) * isAsc;
    } else if (statSortBy === 'hiv') {
      return (a.hivRate - b.hivRate) * isAsc;
    } else if (statSortBy === 'syphilis') {
      return (a.syphilisRate - b.syphilisRate) * isAsc;
    } else {
      return (a.yearlyCasesEst - b.yearlyCasesEst) * isAsc;
    }
  });

  // Total sums for general dashboard
  const nationalHivAverage = 14.1; // Official ballpark average per 100k
  const totalNationalEstimatedCases = IST_STATS.reduce((acc, curr) => acc + curr.yearlyCasesEst, 0);

  return (
    <div className="max-w-4xl mx-auto py-6 animate-in fade-in duration-500 space-y-8">
      
      {/* Navigation Switch subtabs */}
      <div className="flex justify-center mb-4">
        <div className="bg-slate-100 p-1 rounded-2xl flex gap-1 shadow-inner">
          <button
            onClick={() => setActiveSubTab('map')}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
              activeSubTab === 'map' 
                ? 'bg-white text-purple-600 shadow-md' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Map size={14} /> Unidades do SUS em todos os Estados
          </button>
          <button
            onClick={() => setActiveSubTab('stats')}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
              activeSubTab === 'stats' 
                ? 'bg-white text-purple-600 shadow-md' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <BarChart2 size={14} /> Casos de IST por Estado
          </button>
        </div>
      </div>

      {activeSubTab === 'map' ? (
        <>
          {/* Header Info */}
          <div className="text-center">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center justify-center gap-2">
              <MapPin className="text-pink-600" size={32} />
              Unidades de Saúde Especializadas (UBS/CTA)
            </h2>
            <p className="text-slate-500 mt-2 max-w-lg mx-auto text-sm leading-relaxed">
              Encontre os Centros de Testagem rápidos, atendimento geral do SUS e pontos ativos de fornecimento e Profilaxia (PEP/PrEP) com total privacidade.
            </p>
          </div>

          {/* Geolocation Button Panel */}
          <div className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-slate-100 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center gap-6">
            <div className="absolute top-0 left-0 w-32 h-32 bg-pink-500/5 rounded-full blur-2xl"></div>
            
            <div className="p-4 bg-pink-50 text-pink-600 rounded-3xl shrink-0">
              <Navigation size={32} className={geoLoading ? "animate-spin" : ""} />
            </div>

            <div className="space-y-1.5 text-center md:text-left flex-1">
              <h4 className="font-extrabold text-slate-800 text-lg">Localizar Unidade Próxima a Mim</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Permita o acesso à sua localização atual para que o sistema organize as UBSs do SUS em ordem direta de proximidade geográfica.
              </p>
            </div>

            <div className="shrink-0 w-full md:w-auto">
              <button
                onClick={requestLocation}
                disabled={geoLoading}
                className="w-full md:w-auto previne-gradient-bg text-white px-8 py-4 rounded-2xl font-black text-sm tracking-wide shadow-lg hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:bg-slate-200"
              >
                <Compass size={18} />
                {geoLoading ? "Calculando distâncias..." : "Ativar Localização Atual"}
              </button>
            </div>
          </div>

          {/* Dynamic Status Notifications */}
          {successMsg && (
            <div className="bg-emerald-50 text-emerald-800 p-4 border border-emerald-100 rounded-2xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-600" />
              {successMsg}
            </div>
          )}
          {geoError && (
            <div className="bg-amber-50 text-amber-800 p-4 border border-amber-100 rounded-2xl text-xs font-semibold flex gap-2 items-start">
              <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Aviso:</p>
                <p className="text-amber-700 mt-0.5">{geoError}</p>
              </div>
            </div>
          )}

          {/* Filtering Options */}
          <div className="bg-slate-50 p-4 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
            <div className="w-full md:w-1/3">
              <label className="text-[10px] uppercase font-black text-slate-400 block mb-1.5 ml-2">Filtrar por Estado (Todos as 27 UFs disponíveis!)</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
              >
                <option value="Todos">Todos os Estados ({availableStates.length})</option>
                {availableStates.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div className="w-full md:flex-1">
              <label className="text-[10px] uppercase font-black text-slate-400 block mb-1.5 ml-2">Buscar por Nome, Cidade ou Endereço</label>
              <input
                type="text"
                placeholder="Ex: CTA Henfil, Macapá, Paraíba, Salvador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Units List */}
          <div className="grid gap-6">
            {sortedAndFilteredUnits.map((unit) => (
              <div 
                key={unit.name}
                className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 group"
              >
                {/* Visual colored marker line */}
                <div className="absolute left-0 top-0 bottom-0 w-[4px] previne-gradient-bg"></div>

                <div className="space-y-4 flex-1">
                  {/* Unit Tag Header */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-purple-50 text-purple-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border border-purple-100/30">
                      {unit.city} - {unit.state}
                    </span>
                    
                    {unit.distance !== undefined && (
                      <span className="bg-pink-50 text-pink-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 border border-pink-100/30">
                        <Navigation size={10} />
                        Aproximadamente {unit.distance.toFixed(1)} km de você
                      </span>
                    )}
                  </div>

                  {/* Title and Address */}
                  <div>
                    <h4 className="text-xl md:text-2xl font-black text-slate-800 group-hover:text-purple-600 transition-colors">
                      {unit.name}
                    </h4>
                    <p className="text-slate-500 text-sm mt-1.5 flex items-start gap-2">
                      <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
                      <span>{unit.address}</span>
                    </p>
                    {unit.phone && (
                      <p className="text-slate-500 text-sm mt-1 flex items-center gap-2 font-mono">
                        <Phone size={14} className="text-slate-400" />
                        <span>{unit.phone}</span>
                      </p>
                    )}
                  </div>

                  {/* Specialized Services List */}
                  <div className="space-y-2">
                    <h5 className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Atividades & Insumos Disponíveis:</h5>
                    <div className="flex flex-wrap gap-2">
                      {unit.services.map((svc, i) => (
                        <span 
                          key={i}
                          className="bg-slate-50 border border-slate-100 text-slate-600 px-3 py-1.5 rounded-xl text-xs font-semibold"
                        >
                          {svc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Navigation and Route actions */}
                <div className="shrink-0 flex flex-col gap-2 w-full md:w-44">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${unit.name} ${unit.address}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full text-center bg-slate-50 text-slate-700 hover:bg-slate-100 py-3 rounded-xl font-bold text-xs transition-all border border-slate-100 flex items-center justify-center gap-2"
                  >
                    <Map size={14} /> Incorporar Rota
                  </a>
                  <button
                    onClick={() => {
                      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${unit.name} ${unit.address}`)}`, '_blank');
                    }}
                    className="w-full text-center previne-gradient-bg text-white py-3 rounded-xl font-black text-xs transition-all shadow-md hover:brightness-105 flex items-center justify-center gap-2"
                  >
                    <Compass size={14} /> Abrir no Maps
                  </button>
                </div>
              </div>
            ))}

            {sortedAndFilteredUnits.length === 0 && (
              <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl">
                <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin size={32} />
                </div>
                <p className="text-slate-500 font-bold">Nenhuma unidade especializada listada no estado selecionado.</p>
                <p className="text-slate-400 text-xs mt-1">Experimente buscar por "Todos os Estados" para ver unidades de referência no Brasil.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        /* STATISTICS PANEL FOR SUS DATA */
        <div className="space-y-8 animate-in fade-in duration-500">
          
          {/* Header Info */}
          <div className="text-center">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center justify-center gap-2">
              <BarChart2 className="text-purple-600" size={32} />
              Casos de IST por Estado - Painel Epidemiológico do SUS
            </h2>
            <p className="text-slate-500 mt-2 max-w-lg mx-auto text-sm leading-relaxed">
              Consulte dados sobre as taxas de detecção e estimativas de novos diagnósticos anuais de infecções transmissíveis reportadas ao Ministério da Saúde (SUS) por Estado.
            </p>
          </div>

          {/* Quick SUS General KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-100 shadow-md p-6 rounded-3xl flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                <Users size={24} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Média HIV Brasil</span>
                <h4 className="text-2xl font-black text-slate-800 mt-0.5">{nationalHivAverage} <span className="text-xs text-slate-400">/100 mil</span></h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Casos ativos em detecção por ano</p>
              </div>
            </div>

            <div className="bg-white border border-slate-100 shadow-md p-6 rounded-3xl flex items-center gap-4">
              <div className="p-3 bg-pink-50 text-pink-600 rounded-2xl">
                <TrendingUp size={24} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Estado de Maior Taxa</span>
                <h4 className="text-2xl font-black text-slate-800 mt-0.5">RS / RJ</h4>
                <p className="text-[10px] text-pink-600 font-bold mt-0.5">Sífilis Superior a 90/100k</p>
              </div>
            </div>

            <div className="bg-white border border-slate-100 shadow-md p-6 rounded-3xl flex items-center gap-4">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
                <FileText size={24} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Casos Notificados (Ano)</span>
                <h4 className="text-2xl font-black text-slate-800 mt-0.5">{totalNationalEstimatedCases.toLocaleString('pt-BR')}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Total de estimativas nacionais no SUS</p>
              </div>
            </div>
          </div>

          {/* Core Interactive state details block */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-6 md:p-8 relative overflow-hidden grid md:grid-cols-12 gap-8 items-start">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl"></div>

            {/* Left side controller */}
            <div className="md:col-span-5 space-y-5">
              <div>
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider block mb-2">Selecione o Estado para Análise:</label>
                <select
                  value={selectedStatState}
                  onChange={(e) => setSelectedStatState(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-sm font-black focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer text-slate-800"
                >
                  {IST_STATS.map(item => (
                    <option key={item.uf} value={item.uf}>{item.stateName} ({item.uf})</option>
                  ))}
                </select>
              </div>

              {/* State brief overview card */}
              <div className="bg-slate-50 border border-slate-100 rounded-[1.5rem] p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-black text-slate-800 text-lg">{currentStatDetails.stateName}</h4>
                  <span className="bg-purple-100 text-purple-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
                    Região {currentStatDetails.region}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-200">
                    <span className="text-slate-500 font-semibold">Estimativa novos diagnósticos:</span>
                    <span className="font-extrabold text-slate-800">~{currentStatDetails.yearlyCasesEst.toLocaleString('pt-BR')} / ano</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-200">
                    <span className="text-slate-500 font-semibold">Taxa HIV (por 100k hab.):</span>
                    <span className="font-extrabold text-purple-600">{currentStatDetails.hivRate}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-200">
                    <span className="text-slate-500 font-semibold">Taxa Sífilis Adquirida (100k):</span>
                    <span className="font-extrabold text-pink-600">{currentStatDetails.syphilisRate}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500 font-semibold">Taxa Hepatite (100k):</span>
                    <span className="font-extrabold text-sky-600">{currentStatDetails.hepatitisRate}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side graphical comparison representing indicators on progress bars */}
            <div className="md:col-span-7 space-y-6">
              <div className="space-y-4">
                <h4 className="text-xs uppercase font-black text-slate-400 tracking-wider">Comparativo de Taxas Estaduais vs Média Brasil</h4>
                
                {/* HIV Rating progress chart */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>Taxa HIV ({currentStatDetails.stateName})</span>
                    <span className="font-bold text-purple-600">{currentStatDetails.hivRate} por 100 mil</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full relative overflow-hidden">
                    <div 
                      className="bg-purple-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (currentStatDetails.hivRate / 30) * 100)}%` }}
                    ></div>
                    {/* Tick for National Average (14.1) */}
                    <div 
                      className="absolute top-0 bottom-0 w-[2px] bg-red-500"
                      style={{ left: `${(14.1 / 30) * 100}%` }}
                      title="Média Nacional (14.1)"
                    ></div>
                  </div>
                  <p className="text-[9px] text-slate-400 flex justify-between">
                    <span>Início (0)</span>
                    <span className="text-red-500 font-bold">Linha Vermelha: Média Nacional (14.1)</span>
                    <span>Máx (30+)</span>
                  </p>
                </div>

                {/* Syphilis Rating progress chart */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>Taxa Sífilis Adquirida ({currentStatDetails.stateName})</span>
                    <span className="font-bold text-pink-600">{currentStatDetails.syphilisRate} por 100 mil</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full relative overflow-hidden">
                    <div 
                      className="bg-pink-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (currentStatDetails.syphilisRate / 120) * 100)}%` }}
                    ></div>
                    {/* Tick for National average (estimated 72.5) */}
                    <div 
                      className="absolute top-0 bottom-0 w-[2px] bg-red-500"
                      style={{ left: `${(72.5 / 120) * 100}%` }}
                      title="Média Nacional Sífilis (72.5)"
                    ></div>
                  </div>
                  <p className="text-[9px] text-slate-400 flex justify-between">
                    <span>Início (0)</span>
                    <span className="text-red-500 font-bold">Média Nacional (72.5)</span>
                    <span>Máx (120+)</span>
                  </p>
                </div>

                {/* Hepatitis Rating progress chart */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>Taxa de Hepatites Virais ({currentStatDetails.stateName})</span>
                    <span className="font-bold text-sky-600">{currentStatDetails.hepatitisRate} por 100 mil</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full relative overflow-hidden">
                    <div 
                      className="bg-sky-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (currentStatDetails.hepatitisRate / 30) * 100)}%` }}
                    ></div>
                    {/* Tick for National Average (12.2) */}
                    <div 
                      className="absolute top-0 bottom-0 w-[2px] bg-red-500"
                      style={{ left: `${(12.2 / 30) * 100}%` }}
                      title="Média Nacional Hepatites (12.2)"
                    ></div>
                  </div>
                  <p className="text-[9px] text-slate-400 flex justify-between">
                    <span>Início (0)</span>
                    <span className="text-red-500 font-bold">Média Nacional (12.2)</span>
                    <span>Máx (30+)</span>
                  </p>
                </div>
              </div>

              {/* SUS Intervention Alert block */}
              <div className="bg-purple-50/80 border border-purple-100/55 p-4 rounded-2xl">
                <h5 className="font-black text-purple-900 text-xs flex items-center gap-1.5 mb-1">
                  <ShieldAlert size={14} className="text-purple-600" />
                  Estratégia e Alerta do SUS para {currentStatDetails.stateName}:
                </h5>
                <p className="text-xs text-purple-950 font-medium leading-relaxed">
                  {currentStatDetails.susActionAlert}
                </p>
              </div>
            </div>
          </div>

          {/* Search Region and Sorting Table representing all 27 states */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-6 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="font-black text-slate-800 text-lg">Tabela de Dados: Todas as 27 UFs</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Clique nos cabeçalhos das colunas para ordenar os dados em ordem crescente ou decrescente.</p>
              </div>

              {/* Filter by region */}
              <div>
                <select
                  value={selectedRegionFilter}
                  onChange={(e) => setSelectedRegionFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                >
                  <option value="Todos">Todas as Regiões</option>
                  <option value="Norte">Norte</option>
                  <option value="Nordeste">Nordeste</option>
                  <option value="Centro-Oeste">Centro-Oeste</option>
                  <option value="Sudeste">Sudeste</option>
                  <option value="Sul">Sul</option>
                </select>
              </div>
            </div>

            {/* List Table container */}
            <div className="overflow-x-auto rounded-2xl border border-slate-100 max-h-96 overflow-y-auto no-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 sticky top-0 z-10 text-[10px] uppercase font-black text-slate-400 tracking-wider">
                  <tr>
                    <th 
                      onClick={() => handleSortStats('name')}
                      className="p-4 cursor-pointer hover:bg-slate-100 hover:text-slate-700 transition-colors select-none"
                    >
                      <span className="flex items-center gap-1">
                        Estado {statSortBy === 'name' && (statSortOrder === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                      </span>
                    </th>
                    <th className="p-4">Região</th>
                    <th 
                      onClick={() => handleSortStats('hiv')}
                      className="p-4 cursor-pointer hover:bg-slate-100 hover:text-slate-700 transition-colors select-none text-right"
                    >
                      <span className="flex items-center gap-1 justify-end">
                        Taxa HIV {statSortBy === 'hiv' && (statSortOrder === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                      </span>
                    </th>
                    <th 
                      onClick={() => handleSortStats('syphilis')}
                      className="p-4 cursor-pointer hover:bg-slate-100 hover:text-slate-700 transition-colors select-none text-right"
                    >
                      <span className="flex items-center gap-1 justify-end">
                        Taxa Sífilis {statSortBy === 'syphilis' && (statSortOrder === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                      </span>
                    </th>
                    <th 
                      onClick={() => handleSortStats('cases')}
                      className="p-4 cursor-pointer hover:bg-slate-100 hover:text-slate-700 transition-colors select-none text-right"
                    >
                      <span className="flex items-center gap-1 justify-end">
                        Novos Casos Anuais {statSortBy === 'cases' && (statSortOrder === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {processedStats.map((item) => (
                    <tr 
                      key={item.uf}
                      onClick={() => setSelectedStatState(item.uf)}
                      className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${
                        selectedStatState === item.uf ? 'bg-purple-50/40 font-bold' : ''
                      }`}
                    >
                      <td className="p-4">
                        <span className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded bg-slate-100 text-slate-600 font-bold text-[9px] flex items-center justify-center">
                            {item.uf}
                          </span>
                          {item.stateName}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500 font-medium">{item.region}</td>
                      <td className="p-4 text-right font-bold text-purple-600">{item.hivRate.toFixed(1)}</td>
                      <td className="p-4 text-right font-bold text-pink-600">{item.syphilisRate.toFixed(1)}</td>
                      <td className="p-4 text-right font-bold text-slate-700">{item.yearlyCasesEst.toLocaleString('pt-BR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-[10px] text-slate-400 font-medium italic text-center">
              Fonte simulada/estimada com base no Boletim Epidemiológico de HIV/Aids e Sífilis e dados consolidados do SUS/DATASUS.
            </p>
          </div>

        </div>
      )}

      {/* General Advice Info */}
      <div className="bg-purple-900 text-white rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <HeartHandshake className="text-pink-400" size={24} />
            <h4 className="font-black text-lg">Serviço de Acolhimento do SUS</h4>
          </div>
          <p className="text-sm text-purple-100 leading-relaxed max-w-3xl">
            O Sistema Único de Saúde (SUS) realiza testes rápidos gratuitos com resultados emitidos em até 30 minutos em suas dependências públicas para HIV, Sífilis, Hepatite B e Hepatite C. Caso necessite de preservativos higienizados femininos/masculinos ou gel lubrificante, você pode retirá-los livremente nos balcões de recepção sem necessidade de apresentar receitas ou fazer cadastros burocráticos.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-tr from-pink-500/20 to-purple-500/20 rounded-full blur-3xl -translate-y-12"></div>
      </div>
    </div>
  );
};

export default UbsSection;
