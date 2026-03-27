import { 
  Users, 
  FileText, 
  PackageCheck, 
  TrendingUp, 
  Plus, 
  ArrowRight,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { View, Cliente, Recibo } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DashboardProps {
  estatisticas: {
    totalClientes: number;
    totalRecibos: number;
    recibosPendentes: number;
    recibosEntregues: number;
    proximoNumero: string;
  };
  ultimosClientes: Cliente[];
  ultimosRecibos: Recibo[];
  onViewChange: (view: View) => void;
  onNovoRecibo: () => void;
  onSelecionarCliente: (cliente: Cliente) => void;
  onSelecionarRecibo: (recibo: Recibo) => void;
}

export function Dashboard({ 
  estatisticas, 
  ultimosClientes, 
  ultimosRecibos,
  onViewChange, 
  onNovoRecibo,
  onSelecionarCliente,
  onSelecionarRecibo,
}: DashboardProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return '--/--/----';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Painel Principal</h1>
          <p className="text-gray-500">Resumo do estado e acesso rápido</p>
        </div>
        <Button onClick={onNovoRecibo} className="bg-amber-600 hover:bg-amber-700">
          <Plus className="w-4 h-4 mr-2" />
          Novo Recibo
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Clientes</p>
                <p className="text-2xl font-bold text-blue-900">{estatisticas.totalClientes}</p>
              </div>
              <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-amber-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600 font-medium">Recibos</p>
                <p className="text-2xl font-bold text-amber-900">{estatisticas.totalRecibos}</p>
              </div>
              <div className="w-10 h-10 bg-amber-200 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-amber-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Pendentes</p>
                <p className="text-2xl font-bold text-orange-900">{estatisticas.recibosPendentes}</p>
              </div>
              <div className="w-10 h-10 bg-orange-200 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Entregues</p>
                <p className="text-2xl font-bold text-green-900">{estatisticas.recibosEntregues}</p>
              </div>
              <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center">
                <PackageCheck className="w-5 h-5 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Acesso Rápido</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => onViewChange('empresa')}
              className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left group"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <p className="font-medium text-gray-900">Empresa</p>
              <p className="text-xs text-gray-500 mt-1">Configurar dados</p>
            </button>

            <button
              onClick={() => onViewChange('clientes')}
              className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left group"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <p className="font-medium text-gray-900">Clientes</p>
              <p className="text-xs text-gray-500 mt-1">Gerenciar agenda</p>
            </button>

            <button
              onClick={() => onViewChange('recibos')}
              className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left group"
            >
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-amber-200 transition-colors">
                <FileText className="w-5 h-5 text-amber-600" />
              </div>
              <p className="font-medium text-gray-900">Recibos</p>
              <p className="text-xs text-gray-500 mt-1">Ver todos</p>
            </button>

            <button
              onClick={() => onViewChange('entrega')}
              className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left group"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-green-200 transition-colors">
                <PackageCheck className="w-5 h-5 text-green-600" />
              </div>
              <p className="font-medium text-gray-900">Entregas</p>
              <p className="text-xs text-gray-500 mt-1">Pendentes</p>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Clients */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Últimos Clientes</CardTitle>
            <button 
              onClick={() => onViewChange('clientes')}
              className="text-sm text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              Ver todos <ArrowRight className="w-4 h-4" />
            </button>
          </CardHeader>
          <CardContent className="pt-0">
            {ultimosClientes.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Nenhum cliente cadastrado</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3"
                  onClick={() => onViewChange('clientes')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Cliente
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {ultimosClientes.slice(0, 5).map((cliente) => (
                  <button
                    key={cliente.id}
                    onClick={() => onSelecionarCliente(cliente)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-gray-600">
                        {cliente.nome.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{cliente.nome}</p>
                      <p className="text-sm text-gray-500">{cliente.telefone}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Receipts */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Últimos Recibos</CardTitle>
            <button 
              onClick={() => onViewChange('recibos')}
              className="text-sm text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              Ver todos <ArrowRight className="w-4 h-4" />
            </button>
          </CardHeader>
          <CardContent className="pt-0">
            {ultimosRecibos.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Nenhum recibo criado</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3"
                  onClick={onNovoRecibo}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Recibo
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {ultimosRecibos.slice(0, 5).map((recibo) => (
                  <button
                    key={recibo.id}
                    onClick={() => onSelecionarRecibo(recibo)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                      ${recibo.entregue ? 'bg-green-100' : 'bg-amber-100'}`}
                    >
                      <FileText className={`w-4 h-4 ${recibo.entregue ? 'text-green-600' : 'text-amber-600'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{recibo.numero}</p>
                        {recibo.entregue && (
                          <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            Entregue
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">{recibo.cliente.nome}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">{formatDate(recibo.dataCriacao)}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
