import { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Package,
  Calendar,
  Euro,
  Eye,
  ChevronRight,
  X,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SignaturePad } from '@/components/SignaturePad';
import { ReceiptPDF } from '@/components/ReceiptPDF';
import type { Recibo, Cliente, Empresa, ItemRecolhido } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RecibosProps {
  recibos: Recibo[];
  clientes: Cliente[];
  empresa: Empresa;
  onAdd: (recibo: Omit<Recibo, 'id' | 'dataCriacao' | 'dataAtualizacao' | 'numero'>) => void;
  onUpdate: (id: string, updates: Partial<Recibo>) => void;
  onDelete: (id: string) => void;
  onSelectCliente: (cliente: Cliente) => void;
}

const estadoRapidoOptions = [
  { label: 'Excelente', value: 'Excelente estado' },
  { label: 'Bom estado', value: 'Bom estado' },
  { label: 'Com manchas', value: 'Com manchas visíveis' },
  { label: 'Com desgaste', value: 'Com sinais de desgaste' },
  { label: 'Sujidade intensa', value: 'Sujidade intensa' },
];

const observacoesFrequentes = [
  'Manchas localizadas',
  'Desgaste por uso',
  'Possível odor',
  'Sujidade intensa',
  'Revisar bordas e costuras',
  'Desbotamento',
  'Rasgões pequenos',
];

export function RecibosSection({ 
  recibos, 
  clientes, 
  empresa,
  onAdd, 
  onUpdate, 
  onDelete,
  // onSelectCliente,
}: RecibosProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingRecibo, setEditingRecibo] = useState<Recibo | null>(null);
  const [viewingRecibo, setViewingRecibo] = useState<Recibo | null>(null);

  const filteredRecibos = recibos.filter(r => 
    r.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.item.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    if (!dateString) return '--/--/----';
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
          <h1 className="text-2xl font-bold text-gray-900">Recibos</h1>
          <p className="text-gray-500">{recibos.length} recibo(s) criado(s)</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="bg-amber-600 hover:bg-amber-700">
          <Plus className="w-4 h-4 mr-2" />
          Novo Recibo
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Buscar por número, cliente ou tipo de artigo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Recibos List */}
      {filteredRecibos.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="py-12 text-center">
            <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'Nenhum recibo encontrado' : 'Nenhum recibo criado'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? 'Tente buscar com outros termos' 
                : 'Crie seu primeiro recibo para começar'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsAddOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Recibo
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filteredRecibos.map((recibo) => (
            <Card 
              key={recibo.id} 
              className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setViewingRecibo(recibo)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0
                    ${recibo.entregue ? 'bg-green-100' : 'bg-amber-100'}`}
                  >
                    <FileText className={`w-5 h-5 ${recibo.entregue ? 'text-green-600' : 'text-amber-600'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{recibo.numero}</h3>
                      {recibo.entregue ? (
                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          Entregue
                        </span>
                      ) : (
                        <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                          Pendente
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{recibo.cliente.nome}</p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        {recibo.item.tipo || 'Sem tipo'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(recibo.dataRecolha)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewingRecibo(recibo);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingRecibo(recibo);
                      }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Tem certeza que deseja excluir este recibo?')) {
                          onDelete(recibo.id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>Novo Recibo</DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <ReciboForm 
              clientes={clientes}
              empresa={empresa}
              onSubmit={(data) => {
                onAdd(data);
                setIsAddOpen(false);
              }}
              onCancel={() => setIsAddOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Sheet */}
      <Sheet open={!!editingRecibo} onOpenChange={() => setEditingRecibo(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Editar Recibo</SheetTitle>
          </SheetHeader>
          {editingRecibo && (
            <div className="mt-6">
              <ReciboForm
                clientes={clientes}
                empresa={empresa}
                initialData={editingRecibo}
                onSubmit={(data) => {
                  onUpdate(editingRecibo.id, data);
                  setEditingRecibo(null);
                }}
                onCancel={() => setEditingRecibo(null)}
              />
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* View Dialog */}
      <Dialog open={!!viewingRecibo} onOpenChange={() => setViewingRecibo(null)}>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Visualizar Recibo</DialogTitle>
          </DialogHeader>
          {viewingRecibo && (
            <ReceiptPDF 
              recibo={viewingRecibo} 
              empresa={empresa} 
              tipo="recolha"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface ReciboFormProps {
  clientes: Cliente[];
  empresa: Empresa;
  initialData?: Partial<Recibo>;
  onSubmit: (data: Omit<Recibo, 'id' | 'dataCriacao' | 'dataAtualizacao' | 'numero'>) => void;
  onCancel: () => void;
}

function ReciboForm({ clientes, initialData, onSubmit, onCancel }: ReciboFormProps) {
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(initialData?.cliente || null);
  const [item, setItem] = useState<ItemRecolhido>({
    tipo: initialData?.item?.tipo || '',
    tamanho: initialData?.item?.tamanho || '',
    corDescricao: initialData?.item?.corDescricao || '',
    estado: initialData?.item?.estado || '',
    observacoes: initialData?.item?.observacoes || '',
  });
  const [dataRecolha, setDataRecolha] = useState(initialData?.dataRecolha || format(new Date(), 'yyyy-MM-dd'));
  const [dataEntregaPrevista, setDataEntregaPrevista] = useState(initialData?.dataEntregaPrevista || '');
  const [valorEstimado, setValorEstimado] = useState(initialData?.valorEstimado || '');
  const [observacoesServico, setObservacoesServico] = useState(initialData?.observacoesServico || '');
  const [assinaturaCliente, setAssinaturaCliente] = useState<string | null>(initialData?.assinaturaCliente || null);
  const [assinaturaEmpresa, setAssinaturaEmpresa] = useState<string | null>(initialData?.assinaturaEmpresa || null);
  const [activeTab, setActiveTab] = useState('cliente');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCliente) return;

    onSubmit({
      clienteId: selectedCliente.id,
      cliente: selectedCliente,
      item,
      dataRecolha,
      dataEntregaPrevista,
      valorEstimado,
      observacoesServico,
      assinaturaCliente,
      assinaturaEmpresa,
      entregue: initialData?.entregue || false,
    });
  };

  const addObservacao = (obs: string) => {
    setItem(prev => ({
      ...prev,
      observacoes: prev.observacoes ? `${prev.observacoes}; ${obs}` : obs
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="cliente">Cliente</TabsTrigger>
          <TabsTrigger value="artigo">Artigo</TabsTrigger>
          <TabsTrigger value="servico">Serviço</TabsTrigger>
          <TabsTrigger value="assinaturas">Assinaturas</TabsTrigger>
        </TabsList>

        <TabsContent value="cliente" className="space-y-4">
          {selectedCliente ? (
            <Card className="border-0 shadow-sm bg-amber-50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center">
                      <span className="text-lg font-medium text-amber-700">
                        {selectedCliente.nome.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{selectedCliente.nome}</p>
                      <p className="text-sm text-gray-600">{selectedCliente.telefone}</p>
                      {selectedCliente.email && (
                        <p className="text-sm text-gray-600">{selectedCliente.email}</p>
                      )}
                    </div>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedCliente(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-500">Selecione um cliente:</p>
              {clientes.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <User className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">Nenhum cliente cadastrado</p>
                </div>
              ) : (
                <div className="grid gap-2 max-h-[300px] overflow-y-auto">
                  {clientes.map((cliente) => (
                    <button
                      key={cliente.id}
                      type="button"
                      onClick={() => setSelectedCliente(cliente)}
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {cliente.nome.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{cliente.nome}</p>
                        <p className="text-sm text-gray-500">{cliente.telefone}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="artigo" className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Artigo *</Label>
              <Input
                id="tipo"
                value={item.tipo}
                onChange={(e) => setItem(prev => ({ ...prev, tipo: e.target.value }))}
                placeholder="Ex: Tapete persa, Alfombra, Cortina, etc."
                required
              />
              <p className="text-xs text-gray-500">
                Pode ser qualquer tipo de artigo: tapete, alfombra, cortina, edredão, etc.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tamanho">Tamanho / Medidas</Label>
              <Input
                id="tamanho"
                value={item.tamanho}
                onChange={(e) => setItem(prev => ({ ...prev, tamanho: e.target.value }))}
                placeholder="Ex: 200x300cm, 2x3m, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="corDescricao">Cor / Descrição</Label>
              <Input
                id="corDescricao"
                value={item.corDescricao}
                onChange={(e) => setItem(prev => ({ ...prev, corDescricao: e.target.value }))}
                placeholder="Ex: Vermelho com padrões azuis"
              />
            </div>

            <div className="space-y-2">
              <Label>Estado Rápido</Label>
              <div className="flex flex-wrap gap-2">
                {estadoRapidoOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setItem(prev => ({ ...prev, estado: opt.value }))}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      item.estado === opt.value
                        ? 'bg-amber-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado Detalhado</Label>
              <Input
                id="estado"
                value={item.estado}
                onChange={(e) => setItem(prev => ({ ...prev, estado: e.target.value }))}
                placeholder="Descreva o estado do artigo..."
              />
            </div>

            <div className="space-y-2">
              <Label>Observações Frequentes</Label>
              <div className="flex flex-wrap gap-2">
                {observacoesFrequentes.map((obs) => (
                  <button
                    key={obs}
                    type="button"
                    onClick={() => addObservacao(obs)}
                    className="px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    + {obs}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações do Artigo</Label>
              <textarea
                id="observacoes"
                value={item.observacoes}
                onChange={(e) => setItem(prev => ({ ...prev, observacoes: e.target.value }))}
                placeholder="Observações adicionais sobre o artigo..."
                className="w-full min-h-[100px] px-3 py-2 border rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="servico" className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dataRecolha">Data de Recolha *</Label>
              <Input
                id="dataRecolha"
                type="date"
                value={dataRecolha}
                onChange={(e) => setDataRecolha(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataEntrega">Entrega Prevista</Label>
              <Input
                id="dataEntrega"
                type="date"
                value={dataEntregaPrevista}
                onChange={(e) => setDataEntregaPrevista(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="valor">Valor Estimado</Label>
            <div className="relative">
              <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="valor"
                value={valorEstimado}
                onChange={(e) => setValorEstimado(e.target.value)}
                placeholder="0,00"
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoesServico">Observações do Serviço</Label>
            <textarea
              id="observacoesServico"
              value={observacoesServico}
              onChange={(e) => setObservacoesServico(e.target.value)}
              placeholder="Observações sobre o serviço a realizar..."
              className="w-full min-h-[100px] px-3 py-2 border rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </TabsContent>

        <TabsContent value="assinaturas" className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <SignaturePad
              label="Assinatura do Cliente"
              onSave={setAssinaturaCliente}
              existingSignature={assinaturaCliente}
            />
            <SignaturePad
              label="Assinatura da Empresa"
              onSave={setAssinaturaEmpresa}
              existingSignature={assinaturaEmpresa}
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button 
          type="submit" 
          className="flex-1 bg-amber-600 hover:bg-amber-700"
          disabled={!selectedCliente}
        >
          {initialData ? 'Salvar Alterações' : 'Criar Recibo'}
        </Button>
      </div>
    </form>
  );
}
