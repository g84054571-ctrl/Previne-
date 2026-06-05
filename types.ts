
export interface ExternalLink {
  label: string;
  url: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface ISTInfo {
  id: string;
  name: string;
  description: string;
  symptoms: string[];
  prevention: string;
  diagnosis: string;
  treatment: string;
  links: ExternalLink[];
}

export interface NavItem {
  id: 'home' | 'chat' | 'diagnostico' | 'ubs' | 'jogos' | 'comentarios' | 'info' | 'safety';
  label: string;
}
