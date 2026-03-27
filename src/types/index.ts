// Tipos principais do aplicativo Recibo Alfombras

export interface Empresa {
  id: string;
  nome: string;
  slogan: string;
  telefone: string;
  endereco: string;
  cidade: string;
  email: string;
  nif: string;
  logo?: string;
  assinatura?: string;
  carimbo?: string;
  corPrimaria: string;
  corSecundaria: string;
}

export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  endereco: string;
  cidade: string;
  cp: string;
  notas: string;
  dataCriacao: string;
  dataAtualizacao: string;
}

export interface ItemRecolhido {
  tipo: string;
  tamanho: string;
  corDescricao: string;
  estado: string;
  observacoes: string;
}

export interface Recibo {
  id: string;
  numero: string;
  clienteId: string;
  cliente: Cliente;
  item: ItemRecolhido;
  dataRecolha: string;
  dataEntregaPrevista: string;
  valorEstimado: string;
  observacoesServico: string;
  assinaturaCliente: string | null;
  assinaturaEmpresa: string | null;
  dataCriacao: string;
  dataAtualizacao: string;
  entregue: boolean;
  dataEntrega?: string;
  assinaturaEntregaCliente?: string | null;
}

export type View = 'dashboard' | 'empresa' | 'clientes' | 'recibos' | 'entrega' | 'configuracoes';

export interface AppState {
  empresa: Empresa | null;
  clientes: Cliente[];
  recibos: Recibo[];
  clienteSelecionado: Cliente | null;
  reciboSelecionado: Recibo | null;
  view: View;
}
