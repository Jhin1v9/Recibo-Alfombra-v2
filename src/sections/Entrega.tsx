import { useState } from 'react';
import { 
  PackageCheck, 
  Search, 
  Check, 
  FileText,
  Calendar,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SignaturePad } from '@/components/SignaturePad';
import { ReceiptViewer } from '@/components/ReceiptViewer';
import type { Recibo, Empresa } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface EntregaProps {
  recibos: Recibo[];
  empresa: Empresa;
  onMarcarEntregue: (id: string, assinatura: string) => void;
}

export function EntregaSection({ recibos, empresa, onMarcarEntregue }: EntregaProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecibo, setSelectedRecibo] = useState<Recibo | null>(null);
  const [assinaturaEntrega, setAssinaturaEntrega] = useState<string | null>(null);
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const [showPDFDialog, setShowPDFDialog] = useState(false);

  const recibosPendentes = recibos.filter(r => !r.entregue);
  const recibosEntregues = recibos.filter(r => r.entregue);

  const filteredPendentes = recibosPendentes.filter(r => 
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

  const handleConfirmEntrega = () => {
    if (selectedRecibo && assinaturaEntrega) {
      onMarcarEntregue(selectedRecibo.id, assinaturaEntrega);
      setShowSignatureDialog(false);
      setShowPDFDialog(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Entregas</h1>
        <p className="text-gray-500">
          {recibosPendentes.length} entrega(s) pendente(s) | {recibosEntregues.length} entregue(s)
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Buscar recibo pendente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Pending Deliveries */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Entregas Pendentes</h2>
        {filteredPendentes.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="py-12 text-center">
              <PackageCheck className="w-16 h-16 mx-auto text-green-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'Nenhum recibo encontrado' : 'Todas as entregas estão em dia!'}
              </h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? 'Tente buscar com outros termos' 
                  : 'Não há recibos pendentes de entrega'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {filteredPendentes.map((recibo) => (
              <Card key={recibo.id} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{recibo.numero}</h3>
                        <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                          Pendente
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{recibo.cliente.nome}</p>
                      <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Package className="w-3 h-3" />
                          {recibo.item.tipo || 'Sem tipo'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Recolha: {formatDate(recibo.dataRecolha)}
                        </span>
                      </div>
                      {recibo.dataEntregaPrevista && (
                        <p className="text-xs text-amber-600 mt-1">
                          Entrega prevista: {formatDate(recibo.dataEntregaPrevista)}
                        </p>
                      )}
                    </div>
                    <Button
                      onClick={() => {
                        setSelectedRecibo(recibo);
                        setAssinaturaEntrega(null);
                        setShowSignatureDialog(true);
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Entregar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Recent Deliveries */}
      {recibosEntregues.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Entregas Recentes</h2>
          <div className="grid gap-3">
            {recibosEntregues.slice(0, 5).map((recibo) => (
              <Card key={recibo.id} className="border-0 shadow-sm opacity-75">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{recibo.numero}</h3>
                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          Entregue
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{recibo.cliente.nome}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Entregue em: {formatDate(recibo.dataEntrega || '')}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedRecibo(recibo);
                        setShowPDFDialog(true);
                      }}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Ver PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Signature Dialog */}
      <Dialog open={showSignatureDialog} onOpenChange={setShowSignatureDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Confirmar Entrega</DialogTitle>
          </DialogHeader>
          {selectedRecibo && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Recibo: <strong>{selectedRecibo.numero}</strong></p>
                <p className="text-sm text-gray-600">Cliente: <strong>{selectedRecibo.cliente.nome}</strong></p>
                <p className="text-sm text-gray-600">Artigo: <strong>{selectedRecibo.item.tipo}</strong></p>
              </div>

              <SignaturePad
                label="Assinatura do Cliente (Confirmação de Entrega)"
                onSave={setAssinaturaEntrega}
                existingSignature={assinaturaEntrega}
              />

              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowSignatureDialog(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleConfirmEntrega}
                  disabled={!assinaturaEntrega}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Confirmar Entrega
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* PDF Dialog */}
      <ReceiptViewer
        recibo={selectedRecibo || { id: '', numero: '', clienteId: '', cliente: {} as any, item: {} as any, dataRecolha: '', dataEntregaPrevista: '', valorEstimado: '', observacoesServico: '', assinaturaCliente: null, assinaturaEmpresa: null, dataCriacao: '', dataAtualizacao: '', entregue: false }}
        empresa={empresa}
        tipo="entrega"
        open={showPDFDialog}
        onClose={() => setShowPDFDialog(false)}
      />
    </div>
  );
}
