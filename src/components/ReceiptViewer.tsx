import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Download, Printer, X, ZoomIn, ZoomOut } from 'lucide-react';
import { generateProfessionalPDF, downloadPDF } from './ProfessionalPDF';
import type { Recibo, Empresa } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReceiptViewerProps {
  recibo: Recibo;
  empresa: Empresa;
  tipo?: 'recolha' | 'entrega';
  open: boolean;
  onClose: () => void;
}

export function ReceiptViewer({ recibo, empresa, tipo = 'recolha', open, onClose }: ReceiptViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDownload = () => {
    const doc = generateProfessionalPDF({ recibo, empresa, tipo });
    const filename = `${recibo.numero}-${tipo === 'recolha' ? 'recolha' : 'entrega'}.pdf`;
    downloadPDF(doc, filename);
  };

  const handlePrint = () => {
    const doc = generateProfessionalPDF({ recibo, empresa, tipo });
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const printWindow = window.open(pdfUrl, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '--/--/----';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return '--/--/----';
    }
  };

  const zoomIn = () => setZoom(prev => Math.min(prev + 0.2, 2));
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-[95vw] w-full max-h-[95vh] p-0 overflow-hidden flex flex-col"
        style={{ height: '95vh' }}
      >
        {/* Header */}
        <DialogHeader className="px-4 py-3 border-b flex flex-row items-center justify-between space-y-0 bg-gray-50">
          <div className="flex items-center gap-3">
            <DialogTitle className="text-base sm:text-lg font-semibold">
              {tipo === 'recolha' ? 'Recibo de Recolha' : 'Comprovante de Entrega'}
            </DialogTitle>
            <span className="text-xs sm:text-sm text-gray-500 hidden sm:inline">
              {recibo.numero}
            </span>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Zoom controls - hidden on mobile */}
            <div className="hidden sm:flex items-center gap-1 mr-2">
              <Button variant="ghost" size="icon" onClick={zoomOut} className="h-8 w-8">
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-xs text-gray-500 w-12 text-center">{Math.round(zoom * 100)}%</span>
              <Button variant="ghost" size="icon" onClick={zoomIn} className="h-8 w-8">
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDownload}
              className="h-8 px-2 sm:px-3"
            >
              <Download className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">PDF</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePrint}
              className="h-8 px-2 sm:px-3"
            >
              <Printer className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Imprimir</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="h-8 w-8 ml-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Receipt Preview */}
        <div 
          ref={containerRef}
          className="flex-1 overflow-auto bg-gray-200 p-4 sm:p-8 flex justify-center"
        >
          <div 
            className="bg-white shadow-xl origin-top transition-transform duration-200"
            style={{ 
              width: isMobile ? '100%' : '210mm',
              minHeight: isMobile ? 'auto' : '297mm',
              transform: isMobile ? 'none' : `scale(${zoom})`,
              maxWidth: isMobile ? '100%' : '210mm',
            }}
          >
            <ReceiptPreview 
              recibo={recibo} 
              empresa={empresa} 
              tipo={tipo}
              formatDate={formatDate}
            />
          </div>
        </div>

        {/* Mobile Actions Footer */}
        <div className="sm:hidden flex items-center justify-between px-4 py-3 border-t bg-white">
          <span className="text-sm text-gray-600">{recibo.numero}</span>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleDownload} className="bg-amber-600">
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ReceiptPreviewProps {
  recibo: Recibo;
  empresa: Empresa;
  tipo: 'recolha' | 'entrega';
  formatDate: (date: string) => string;
}

function ReceiptPreview({ recibo, empresa, tipo, formatDate }: ReceiptPreviewProps) {
  const isRecolha = tipo === 'recolha';

  return (
    <div 
      className="w-full h-full p-6 sm:p-10"
      style={{ 
        fontFamily: 'Arial, Helvetica, sans-serif',
        minHeight: isRecolha ? '297mm' : 'auto'
      }}
    >
      {/* Header */}
      <div 
        className="-mx-6 -mt-6 sm:-mx-10 sm:-mt-10 px-6 py-5 sm:px-10 sm:py-6 mb-6 sm:mb-8"
        style={{ backgroundColor: empresa.corPrimaria }}
      >
        <h1 className="text-xl sm:text-2xl font-bold text-white">{empresa.nome}</h1>
        {empresa.slogan && (
          <p className="text-white/80 text-xs sm:text-sm mt-1">{empresa.slogan}</p>
        )}
      </div>

      {/* Title */}
      <div className="text-center mb-6 sm:mb-8">
        <h2 
          className="text-lg sm:text-xl font-bold uppercase tracking-wide"
          style={{ color: empresa.corPrimaria }}
        >
          {isRecolha ? 'Recibo de Recolha' : 'Comprovante de Entrega'}
        </h2>
        <p className="text-gray-500 text-xs sm:text-sm mt-1">
          {isRecolha 
            ? 'Comprovante de custódia temporária para serviço profissional'
            : 'Confirmação de entrega do artigo ao cliente'
          }
        </p>
      </div>

      {/* Info Box */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6 sm:mb-8 flex flex-col sm:flex-row sm:justify-between gap-3">
        <div>
          <p className="text-xs text-gray-500 uppercase">Recibo N.º</p>
          <p 
            className="text-lg sm:text-xl font-bold"
            style={{ color: empresa.corPrimaria }}
          >
            {recibo.numero}
          </p>
        </div>
        <div className="sm:text-right">
          <p className="text-xs text-gray-500 uppercase">Data</p>
          <p className="text-base sm:text-lg font-semibold">
            {isRecolha ? formatDate(recibo.dataRecolha) : formatDate(recibo.dataEntrega || '')}
          </p>
        </div>
      </div>

      {/* Client Info */}
      <Section title="Dados do Cliente" color={empresa.corPrimaria}>
        <InfoGrid 
          items={[
            { label: 'Nome', value: recibo.cliente.nome },
            { label: 'Telefone', value: recibo.cliente.telefone },
            ...(recibo.cliente.email ? [{ label: 'Email', value: recibo.cliente.email }] : []),
            { label: 'Endereço', value: recibo.cliente.endereco },
            ...(recibo.cliente.cidade || recibo.cliente.cp 
              ? [{ label: 'Cidade/CP', value: `${recibo.cliente.cidade || ''} ${recibo.cliente.cp || ''}` }] 
              : []),
          ]}
        />
      </Section>

      {/* Item Info */}
      <Section title="Informação do Artigo" color={empresa.corPrimaria}>
        <InfoGrid 
          items={[
            { label: 'Tipo', value: recibo.item.tipo },
            { label: 'Tamanho', value: recibo.item.tamanho },
            { label: 'Cor/Descrição', value: recibo.item.corDescricao },
            { label: 'Estado', value: recibo.item.estado },
            ...(recibo.item.observacoes ? [{ label: 'Observações', value: recibo.item.observacoes }] : []),
          ]}
        />
      </Section>

      {/* Service Info - Only for recolha */}
      {isRecolha && (
        <Section title="Controlo do Serviço" color={empresa.corPrimaria}>
          <InfoGrid 
            items={[
              { label: 'Data de Recolha', value: formatDate(recibo.dataRecolha) },
              { label: 'Entrega Prevista', value: formatDate(recibo.dataEntregaPrevista) },
              { label: 'Valor Estimado', value: recibo.valorEstimado || 'Por definir' },
              ...(recibo.observacoesServico ? [{ label: 'Observações', value: recibo.observacoesServico }] : []),
            ]}
          />
        </Section>
      )}

      {/* Legal Text */}
      <div className="bg-gray-50 rounded-lg p-4 my-6 sm:my-8">
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          {isRecolha ? (
            <>
              Por meio deste documento, <strong>{empresa.nome}</strong> confirma que o artigo 
              descrito acima foi recolhido nas instalações do cliente e permanece sob custódia 
              temporária para limpeza, tratamento e manipulação profissional. O cliente declara 
              estar ciente do estado do artigo no momento da recolha.
            </>
          ) : (
            <>
              Por meio deste documento, confirmo que recebi o artigo descrito acima nas condições 
              indicadas e dou por concluído o serviço contratado com <strong>{empresa.nome}</strong>. 
              O cliente declara estar satisfeito com o serviço prestado.
            </>
          )}
        </p>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-2 gap-4 sm:gap-8 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t">
        <SignatureBox 
          label={recibo.cliente.nome}
          sublabel="Assinatura do Cliente"
          signature={isRecolha ? recibo.assinaturaCliente : recibo.assinaturaEntregaCliente}
        />
        <SignatureBox 
          label={empresa.nome}
          sublabel={isRecolha ? 'Assinatura da Empresa' : 'Confirmação de Entrega'}
          signature={isRecolha ? recibo.assinaturaEmpresa : null}
        />
      </div>

      {/* Footer */}
      <div 
        className="-mx-6 -mb-6 sm:-mx-10 sm:-mb-10 mt-8 sm:mt-12 px-6 py-3 sm:px-10 sm:py-4 text-center"
        style={{ backgroundColor: empresa.corPrimaria }}
      >
        <p className="text-white/90 text-xs">
          {empresa.nome} - Documento gerado digitalmente
        </p>
        {empresa.telefone && (
          <p className="text-white/70 text-xs mt-1">Tel: {empresa.telefone}</p>
        )}
      </div>
    </div>
  );
}

function Section({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div className="mb-5 sm:mb-6">
      <h3 
        className="text-xs sm:text-sm font-bold uppercase mb-2 sm:mb-3 pb-1 border-b-2"
        style={{ color, borderColor: color }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

function InfoGrid({ items }: { items: { label: string; value?: string }[]; color?: string }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
      {items.filter(item => item.value).map((item, index) => (
        <div key={index} className={item.label === 'Observações' ? 'sm:col-span-2' : ''}>
          <span className="text-xs text-gray-500">{item.label}:</span>
          <p className="text-sm sm:text-base text-gray-800 font-medium">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

function SignatureBox({ label, sublabel, signature }: { label: string; sublabel: string; signature: string | null | undefined }) {
  return (
    <div className="text-center">
      {signature && (
        <div className="mb-2 h-12 sm:h-16 flex items-end justify-center">
          <img 
            src={signature} 
            alt="Assinatura" 
            className="max-h-full object-contain"
          />
        </div>
      )}
      <div className="border-t pt-2">
        <p className="text-xs sm:text-sm font-medium text-gray-800 truncate">{label}</p>
        <p className="text-[10px] sm:text-xs text-gray-500">{sublabel}</p>
      </div>
    </div>
  );
}
