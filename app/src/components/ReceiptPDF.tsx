import { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';
import type { Recibo, Empresa } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReceiptPDFProps {
  recibo: Recibo;
  empresa: Empresa;
  tipo?: 'recolha' | 'entrega';
}

export function ReceiptPDF({ recibo, empresa, tipo = 'recolha' }: ReceiptPDFProps) {
  const pdfRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    if (!pdfRef.current) return;

    const element = pdfRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${recibo.numero}-${tipo === 'recolha' ? 'recolha' : 'entrega'}.pdf`);
  };

  const print = () => {
    window.print();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '--/--/----';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return '--/--/----';
    }
  };

  const isRecolha = tipo === 'recolha';

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex gap-2 print:hidden">
        <Button onClick={generatePDF} className="flex-1">
          <Download className="w-4 h-4 mr-2" />
          Baixar PDF
        </Button>
        <Button variant="outline" onClick={print} className="flex-1">
          <Printer className="w-4 h-4 mr-2" />
          Imprimir
        </Button>
      </div>

      {/* PDF Content */}
      <div 
        ref={pdfRef} 
        className="bg-white p-8 shadow-lg print:shadow-none print:p-0"
        style={{ 
          width: '210mm', 
          minHeight: '297mm',
          margin: '0 auto',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        {/* Header */}
        <div className="border-b-2 pb-6 mb-6" style={{ borderColor: empresa.corPrimaria }}>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: empresa.corPrimaria }}>
                {empresa.nome}
              </h1>
              <p className="text-gray-600 text-sm mt-1">{empresa.slogan}</p>
              <div className="mt-3 text-sm text-gray-600 space-y-1">
                {empresa.telefone && <p>Tel: {empresa.telefone}</p>}
                {empresa.endereco && <p>{empresa.endereco}</p>}
                {empresa.cidade && <p>{empresa.cidade}</p>}
                {empresa.email && <p>{empresa.email}</p>}
                {empresa.nif && <p>NIF: {empresa.nif}</p>}
              </div>
            </div>
            <div className="text-right">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                style={{ backgroundColor: empresa.corPrimaria }}
              >
                {empresa.nome.charAt(0)}
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide">
            {isRecolha ? 'Recibo de Recolha' : 'Comprovante de Entrega'}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {isRecolha 
              ? 'Comprovante de custódia temporária para serviço profissional'
              : 'Confirmação de entrega do artigo ao cliente'
            }
          </p>
        </div>

        {/* Receipt Info */}
        <div className="flex justify-between mb-6 bg-gray-50 p-4 rounded-lg">
          <div>
            <p className="text-sm text-gray-500">Recibo N.º</p>
            <p className="text-lg font-bold" style={{ color: empresa.corPrimaria }}>
              {recibo.numero}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Data</p>
            <p className="text-lg font-bold">
              {isRecolha ? formatDate(recibo.dataRecolha) : formatDate(recibo.dataEntrega || '')}
            </p>
          </div>
        </div>

        {/* Client Info */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-700 uppercase mb-3 pb-1 border-b">
            Dados do Cliente
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Nome Completo</p>
              <p className="font-medium">{recibo.cliente.nome}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Telefone</p>
              <p className="font-medium">{recibo.cliente.telefone || 'N/A'}</p>
            </div>
            {recibo.cliente.email && (
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-medium">{recibo.cliente.email}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500">Endereço</p>
              <p className="font-medium">{recibo.cliente.endereco || 'N/A'}</p>
            </div>
            {(recibo.cliente.cidade || recibo.cliente.cp) && (
              <div className="col-span-2">
                <p className="text-xs text-gray-500">Cidade / C.P.</p>
                <p className="font-medium">
                  {recibo.cliente.cidade} {recibo.cliente.cp && `- ${recibo.cliente.cp}`}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Item Info */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-700 uppercase mb-3 pb-1 border-b">
            Informação do Artigo
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Tipo</p>
              <p className="font-medium">{recibo.item.tipo || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Tamanho</p>
              <p className="font-medium">{recibo.item.tamanho || 'N/A'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-gray-500">Cor / Descrição</p>
              <p className="font-medium">{recibo.item.corDescricao || 'N/A'}</p>
            </div>
            {!isRecolha && (
              <div className="col-span-2">
                <p className="text-xs text-gray-500">Estado na Entrega</p>
                <p className="font-medium">{recibo.item.estado || 'N/A'}</p>
              </div>
            )}
            {isRecolha && (
              <>
                <div>
                  <p className="text-xs text-gray-500">Estado na Recolha</p>
                  <p className="font-medium">{recibo.item.estado || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500">Observações do Artigo</p>
                  <p className="font-medium">{recibo.item.observacoes || 'Sem observações'}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Service Info - Only for recolha */}
        {isRecolha && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-700 uppercase mb-3 pb-1 border-b">
              Controlo do Serviço
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Data de Recolha</p>
                <p className="font-medium">{formatDate(recibo.dataRecolha)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Entrega Prevista</p>
                <p className="font-medium">{formatDate(recibo.dataEntregaPrevista)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Valor Estimado</p>
                <p className="font-medium">{recibo.valorEstimado || 'Por definir'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-500">Observações do Serviço</p>
                <p className="font-medium">{recibo.observacoesServico || 'Sem observações'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Legal Text */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
          {isRecolha ? (
            <p>
              Por meio deste documento, <strong>{empresa.nome}</strong> confirma que o artigo 
              descrito acima foi recolhido nas instalações do cliente e permanece sob custódia 
              temporária para limpeza, tratamento e manipulação profissional. O cliente declara 
              estar ciente do estado do artigo no momento da recolha.
            </p>
          ) : (
            <p>
              Por meio deste documento, confirmo que recebi o artigo descrito acima nas condições 
              indicadas e dou por concluído o serviço contratado com <strong>{empresa.nome}</strong>. 
              O cliente declara estar satisfeito com o serviço prestado.
            </p>
          )}
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-8 mt-12">
          <div className="text-center">
            {recibo.assinaturaCliente && (
              <div className="mb-2">
                <img 
                  src={recibo.assinaturaCliente} 
                  alt="Assinatura do Cliente" 
                  className="h-20 mx-auto object-contain"
                />
              </div>
            )}
            <div className="border-t pt-2">
              <p className="text-sm font-medium">{recibo.cliente.nome}</p>
              <p className="text-xs text-gray-500">Assinatura do Cliente</p>
            </div>
          </div>
          <div className="text-center">
            {isRecolha ? (
              recibo.assinaturaEmpresa && (
                <div className="mb-2">
                  <img 
                    src={recibo.assinaturaEmpresa} 
                    alt="Assinatura da Empresa" 
                    className="h-20 mx-auto object-contain"
                  />
                </div>
              )
            ) : (
              recibo.assinaturaEntregaCliente && (
                <div className="mb-2">
                  <img 
                    src={recibo.assinaturaEntregaCliente} 
                    alt="Assinatura de Entrega" 
                    className="h-20 mx-auto object-contain"
                  />
                </div>
              )
            )}
            <div className="border-t pt-2">
              <p className="text-sm font-medium">{empresa.nome}</p>
              <p className="text-xs text-gray-500">
                {isRecolha ? 'Assinatura da Empresa' : 'Confirmação de Entrega'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-4 border-t text-center text-xs text-gray-400">
          <p>Documento gerado digitalmente por {empresa.nome}</p>
          <p>{format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</p>
        </div>
      </div>
    </div>
  );
}
