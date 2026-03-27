import { Layout } from '@/components/Layout';
import { Dashboard } from '@/sections/Dashboard';
import { EmpresaSection } from '@/sections/Empresa';
import { ClientesSection } from '@/sections/Clientes';
import { RecibosSection } from '@/sections/Recibos';
import { EntregaSection } from '@/sections/Entrega';
import { useStore } from '@/hooks/useStore';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import './App.css';

function App() {
  const {
    empresa,
    clientes,
    recibos,
    // clienteSelecionado,
    // reciboSelecionado,
    currentView,
    isLoaded,
    estatisticas,
    setClienteSelecionado,
    setReciboSelecionado,
    setCurrentView,
    updateEmpresa,
    addCliente,
    updateCliente,
    deleteCliente,
    importarClientes,
    addRecibo,
    updateRecibo,
    deleteRecibo,
    marcarEntregue,
  } = useStore();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  const handleAddCliente = (data: Parameters<typeof addCliente>[0]) => {
    addCliente(data);
    toast.success('Cliente adicionado com sucesso!');
  };

  const handleUpdateCliente = (id: string, updates: Partial<typeof clientes[0]>) => {
    updateCliente(id, updates);
    toast.success('Cliente atualizado com sucesso!');
  };

  const handleDeleteCliente = (id: string) => {
    deleteCliente(id);
    toast.success('Cliente excluído com sucesso!');
  };

  const handleImportClientes = (clientes: Parameters<typeof importarClientes>[0]) => {
    const count = importarClientes(clientes);
    toast.success(`${count} cliente(s) importado(s) com sucesso!`);
  };

  const handleAddRecibo = (data: Parameters<typeof addRecibo>[0]) => {
    addRecibo(data);
    toast.success('Recibo criado com sucesso!');
  };

  const handleUpdateRecibo = (id: string, updates: Partial<typeof recibos[0]>) => {
    updateRecibo(id, updates);
    toast.success('Recibo atualizado com sucesso!');
  };

  const handleDeleteRecibo = (id: string) => {
    deleteRecibo(id);
    toast.success('Recibo excluído com sucesso!');
  };

  const handleMarcarEntregue = (id: string, assinatura: string) => {
    marcarEntregue(id, assinatura);
    toast.success('Entrega confirmada com sucesso!');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            estatisticas={estatisticas}
            ultimosClientes={clientes.slice(0, 5)}
            ultimosRecibos={recibos.slice(0, 5)}
            onViewChange={setCurrentView}
            onNovoRecibo={() => setCurrentView('recibos')}
            onSelecionarCliente={(cliente) => {
              setClienteSelecionado(cliente);
              setCurrentView('clientes');
            }}
            onSelecionarRecibo={(recibo) => {
              setReciboSelecionado(recibo);
              setCurrentView('recibos');
            }}
          />
        );
      case 'empresa':
        return (
          <EmpresaSection
            empresa={empresa}
            onUpdate={(updates) => {
              updateEmpresa(updates);
              toast.success('Dados da empresa atualizados!');
            }}
          />
        );
      case 'clientes':
        return (
          <ClientesSection
            clientes={clientes}
            onAdd={handleAddCliente}
            onUpdate={handleUpdateCliente}
            onDelete={handleDeleteCliente}
            onImport={handleImportClientes}
            onSelect={(cliente) => {
              setClienteSelecionado(cliente);
              toast.info(`Cliente ${cliente.nome} selecionado`);
            }}
          />
        );
      case 'recibos':
        return (
          <RecibosSection
            recibos={recibos}
            clientes={clientes}
            empresa={empresa}
            onAdd={handleAddRecibo}
            onUpdate={handleUpdateRecibo}
            onDelete={handleDeleteRecibo}
            onSelectCliente={setClienteSelecionado}
          />
        );
      case 'entrega':
        return (
          <EntregaSection
            recibos={recibos}
            empresa={empresa}
            onMarcarEntregue={handleMarcarEntregue}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      onViewChange={setCurrentView}
      empresaNome={empresa.nome}
    >
      {renderContent()}
      <Toaster position="top-right" richColors />
    </Layout>
  );
}

export default App;
