import { useState, useEffect, useCallback } from 'react';
import type { Empresa, Cliente, Recibo, View } from '@/types';

const STORAGE_KEY = 'recibo-alfombras-v2';

interface StoredData {
  empresa: Empresa | null;
  clientes: Cliente[];
  recibos: Recibo[];
}

const defaultEmpresa: Empresa = {
  id: 'default',
  nome: 'Sua Empresa',
  slogan: 'Serviço Profissional',
  telefone: '',
  endereco: '',
  cidade: '',
  email: '',
  nif: '',
  corPrimaria: '#8B5A2B',
  corSecundaria: '#D4A574',
};

const generateId = () => Math.random().toString(36).substring(2, 15);

const generateReceiptNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `RC-${year}${month}${day}-${random}`;
};

export function useStore() {
  const [empresa, setEmpresa] = useState<Empresa>(defaultEmpresa);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [recibos, setRecibos] = useState<Recibo[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [reciboSelecionado, setReciboSelecionado] = useState<Recibo | null>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data: StoredData = JSON.parse(stored);
        if (data.empresa) setEmpresa(data.empresa);
        if (data.clientes) setClientes(data.clientes);
        if (data.recibos) setRecibos(data.recibos);
      } catch (e) {
        console.error('Error loading data:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      const data: StoredData = { empresa, clientes, recibos };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [empresa, clientes, recibos, isLoaded]);

  // Empresa operations
  const updateEmpresa = useCallback((updates: Partial<Empresa>) => {
    setEmpresa(prev => ({ ...prev, ...updates }));
  }, []);

  // Cliente operations
  const addCliente = useCallback((cliente: Omit<Cliente, 'id' | 'dataCriacao' | 'dataAtualizacao'>) => {
    const newCliente: Cliente = {
      ...cliente,
      id: generateId(),
      dataCriacao: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString(),
    };
    setClientes(prev => [newCliente, ...prev]);
    return newCliente;
  }, []);

  const updateCliente = useCallback((id: string, updates: Partial<Cliente>) => {
    setClientes(prev => prev.map(c => 
      c.id === id ? { ...c, ...updates, dataAtualizacao: new Date().toISOString() } : c
    ));
  }, []);

  const deleteCliente = useCallback((id: string) => {
    setClientes(prev => prev.filter(c => c.id !== id));
    if (clienteSelecionado?.id === id) {
      setClienteSelecionado(null);
    }
  }, [clienteSelecionado]);

  const importarClientes = useCallback((novosClientes: Omit<Cliente, 'id' | 'dataCriacao' | 'dataAtualizacao'>[]) => {
    const clientesComId = novosClientes.map(c => ({
      ...c,
      id: generateId(),
      dataCriacao: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString(),
    }));
    setClientes(prev => [...clientesComId, ...prev]);
    return clientesComId.length;
  }, []);

  // Recibo operations
  const addRecibo = useCallback((recibo: Omit<Recibo, 'id' | 'dataCriacao' | 'dataAtualizacao' | 'numero'>) => {
    const newRecibo: Recibo = {
      ...recibo,
      id: generateId(),
      numero: generateReceiptNumber(),
      dataCriacao: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString(),
    };
    setRecibos(prev => [newRecibo, ...prev]);
    return newRecibo;
  }, []);

  const updateRecibo = useCallback((id: string, updates: Partial<Recibo>) => {
    setRecibos(prev => prev.map(r => 
      r.id === id ? { ...r, ...updates, dataAtualizacao: new Date().toISOString() } : r
    ));
  }, []);

  const deleteRecibo = useCallback((id: string) => {
    setRecibos(prev => prev.filter(r => r.id !== id));
    if (reciboSelecionado?.id === id) {
      setReciboSelecionado(null);
    }
  }, [reciboSelecionado]);

  const marcarEntregue = useCallback((id: string, assinaturaEntrega: string) => {
    setRecibos(prev => prev.map(r => 
      r.id === id ? { 
        ...r, 
        entregue: true, 
        dataEntrega: new Date().toISOString(),
        assinaturaEntregaCliente: assinaturaEntrega,
        dataAtualizacao: new Date().toISOString(),
      } : r
    ));
  }, []);

  // Statistics
  const estatisticas = {
    totalClientes: clientes.length,
    totalRecibos: recibos.length,
    recibosPendentes: recibos.filter(r => !r.entregue).length,
    recibosEntregues: recibos.filter(r => r.entregue).length,
    proximoNumero: generateReceiptNumber(),
  };

  // Search functions
  const buscarCliente = useCallback((termo: string) => {
    const termoLower = termo.toLowerCase();
    return clientes.filter(c => 
      c.nome.toLowerCase().includes(termoLower) ||
      c.telefone.includes(termo) ||
      c.email.toLowerCase().includes(termoLower)
    );
  }, [clientes]);

  const buscarRecibo = useCallback((termo: string) => {
    const termoLower = termo.toLowerCase();
    return recibos.filter(r => 
      r.numero.toLowerCase().includes(termoLower) ||
      r.cliente.nome.toLowerCase().includes(termoLower) ||
      r.item.tipo.toLowerCase().includes(termoLower)
    );
  }, [recibos]);

  return {
    // Data
    empresa,
    clientes,
    recibos,
    clienteSelecionado,
    reciboSelecionado,
    currentView,
    isLoaded,
    estatisticas,
    
    // Setters
    setClienteSelecionado,
    setReciboSelecionado,
    setCurrentView,
    
    // Operations
    updateEmpresa,
    addCliente,
    updateCliente,
    deleteCliente,
    importarClientes,
    addRecibo,
    updateRecibo,
    deleteRecibo,
    marcarEntregue,
    buscarCliente,
    buscarRecibo,
    
    // Utilities
    generateReceiptNumber,
  };
}
