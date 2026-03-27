import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Recibo, Empresa } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface GeneratePDFOptions {
  recibo: Recibo;
  empresa: Empresa;
  tipo?: 'recolha' | 'entrega';
}

export function generateProfessionalPDF({ recibo, empresa, tipo = 'recolha' }: GeneratePDFOptions): jsPDF {
  // Create PDF with high quality settings
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: false, // Better quality without compression
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);

  let currentY = margin;

  // Helper function to convert hex to RGB
  const hexToRgb = (hex: string): [number, number, number] => {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return [r, g, b];
  };

  const primaryColor = hexToRgb(empresa.corPrimaria);
  // const secondaryColor = hexToRgb(empresa.corSecundaria);

  // ========== HEADER ==========
  // Company name background
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 35, 'F');

  // Company name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(empresa.nome, margin, 22);

  // Slogan
  if (empresa.slogan) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text(empresa.slogan, margin, 30);
  }

  currentY = 45;

  // ========== RECEIPT TITLE ==========
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  const titleText = tipo === 'recolha' ? 'RECIBO DE RECOLHA' : 'COMPROVANTE DE ENTREGA';
  doc.text(titleText, pageWidth / 2, currentY, { align: 'center' });

  currentY += 8;

  // Subtitle
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const subtitleText = tipo === 'recolha' 
    ? 'Comprovante de custódia temporária para serviço profissional'
    : 'Confirmação de entrega do artigo ao cliente';
  doc.text(subtitleText, pageWidth / 2, currentY, { align: 'center' });

  currentY += 15;

  // ========== RECEIPT INFO BOX ==========
  const infoBoxY = currentY;
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(margin, infoBoxY, contentWidth, 25, 3, 3, 'F');
  
  // Receipt number
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('RECIBO N.º', margin + 5, infoBoxY + 9);
  
  doc.setFontSize(14);
  doc.text(recibo.numero, margin + 5, infoBoxY + 19);

  // Date
  const dateText = tipo === 'recolha' 
    ? formatDate(recibo.dataRecolha)
    : formatDate(recibo.dataEntrega || '');
  
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(9);
  doc.text('DATA', pageWidth - margin - 5, infoBoxY + 9, { align: 'right' });
  
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(12);
  doc.text(dateText, pageWidth - margin - 5, infoBoxY + 19, { align: 'right' });

  currentY += 35;

  // ========== CLIENT INFO ==========
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('DADOS DO CLIENTE', margin, currentY);
  
  // Underline
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.5);
  doc.line(margin, currentY + 2, margin + 50, currentY + 2);

  currentY += 10;

  // Client data table
  const clientData = [
    ['Nome:', recibo.cliente.nome || 'N/A'],
    ['Telefone:', recibo.cliente.telefone || 'N/A'],
    ...(recibo.cliente.email ? [['Email:', recibo.cliente.email]] : []),
    ['Endereço:', recibo.cliente.endereco || 'N/A'],
    ...(recibo.cliente.cidade || recibo.cliente.cp ? [['Cidade/CP:', `${recibo.cliente.cidade || ''} ${recibo.cliente.cp || ''}`]] : []),
  ];

  autoTable(doc, {
    body: clientData,
    startY: currentY,
    margin: { left: margin, right: margin },
    theme: 'plain',
    styles: {
      fontSize: 10,
      cellPadding: 2,
      font: 'helvetica',
    },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: primaryColor, cellWidth: 30 },
      1: { textColor: [60, 60, 60] },
    },
  });

  currentY = (doc as any).lastAutoTable.finalY + 8;

  // ========== ITEM INFO ==========
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMAÇÃO DO ARTIGO', margin, currentY);
  
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.line(margin, currentY + 2, margin + 55, currentY + 2);

  currentY += 10;

  const itemData = [
    ['Tipo:', recibo.item.tipo || 'N/A'],
    ['Tamanho:', recibo.item.tamanho || 'N/A'],
    ['Cor/Descrição:', recibo.item.corDescricao || 'N/A'],
    ['Estado:', recibo.item.estado || 'N/A'],
    ...(recibo.item.observacoes ? [['Observações:', recibo.item.observacoes]] : []),
  ];

  autoTable(doc, {
    body: itemData,
    startY: currentY,
    margin: { left: margin, right: margin },
    theme: 'plain',
    styles: {
      fontSize: 10,
      cellPadding: 2,
      font: 'helvetica',
    },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: primaryColor, cellWidth: 35 },
      1: { textColor: [60, 60, 60] },
    },
  });

  currentY = (doc as any).lastAutoTable.finalY + 8;

  // ========== SERVICE INFO (only for recolha) ==========
  if (tipo === 'recolha') {
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('CONTROLO DO SERVIÇO', margin, currentY);
    
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.line(margin, currentY + 2, margin + 55, currentY + 2);

    currentY += 10;

    const serviceData = [
      ['Data de Recolha:', formatDate(recibo.dataRecolha)],
      ['Entrega Prevista:', formatDate(recibo.dataEntregaPrevista)],
      ['Valor Estimado:', recibo.valorEstimado || 'Por definir'],
      ...(recibo.observacoesServico ? [['Observações:', recibo.observacoesServico]] : []),
    ];

    autoTable(doc, {
      body: serviceData,
      startY: currentY,
      margin: { left: margin, right: margin },
      theme: 'plain',
      styles: {
        fontSize: 10,
        cellPadding: 2,
        font: 'helvetica',
      },
      columnStyles: {
        0: { fontStyle: 'bold', textColor: primaryColor, cellWidth: 40 },
        1: { textColor: [60, 60, 60] },
      },
    });

    currentY = (doc as any).lastAutoTable.finalY + 10;
  }

  // ========== LEGAL TEXT ==========
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(margin, currentY, contentWidth, 25, 3, 3, 'F');

  doc.setTextColor(80, 80, 80);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');

  const legalText = tipo === 'recolha'
    ? `Por meio deste documento, ${empresa.nome} confirma que o artigo descrito acima foi recolhido nas instalações do cliente e permanece sob custódia temporária para limpeza, tratamento e manipulação profissional. O cliente declara estar ciente do estado do artigo no momento da recolha.`
    : `Por meio deste documento, confirmo que recebi o artigo descrito acima nas condições indicadas e dou por concluído o serviço contratado com ${empresa.nome}. O cliente declara estar satisfeito com o serviço prestado.`;

  const splitText = doc.splitTextToSize(legalText, contentWidth - 10);
  doc.text(splitText, margin + 5, currentY + 8);

  currentY += 35;

  // ========== SIGNATURES ==========
  const signatureY = pageHeight - 50;
  const signatureWidth = (contentWidth - 20) / 2;

  // Client signature
  if (recibo.assinaturaCliente && tipo === 'recolha') {
    try {
      doc.addImage(recibo.assinaturaCliente, 'PNG', margin, signatureY - 15, signatureWidth, 20);
    } catch (e) {
      // If image fails, just show line
    }
  }

  // Client signature line
  doc.setDrawColor(100, 100, 100);
  doc.setLineWidth(0.3);
  doc.line(margin, signatureY + 8, margin + signatureWidth, signatureY + 8);

  doc.setTextColor(60, 60, 60);
  doc.setFontSize(9);
  doc.text(recibo.cliente.nome, margin, signatureY + 15);
  doc.setTextColor(120, 120, 120);
  doc.setFontSize(8);
  doc.text('Assinatura do Cliente', margin, signatureY + 20);

  // Company signature
  const companyX = margin + signatureWidth + 20;
  
  if (tipo === 'recolha' && recibo.assinaturaEmpresa) {
    try {
      doc.addImage(recibo.assinaturaEmpresa, 'PNG', companyX, signatureY - 15, signatureWidth, 20);
    } catch (e) {}
  } else if (tipo === 'entrega' && recibo.assinaturaEntregaCliente) {
    try {
      doc.addImage(recibo.assinaturaEntregaCliente, 'PNG', companyX, signatureY - 15, signatureWidth, 20);
    } catch (e) {}
  }

  // Company signature line
  doc.line(companyX, signatureY + 8, companyX + signatureWidth, signatureY + 8);

  doc.setTextColor(60, 60, 60);
  doc.setFontSize(9);
  doc.text(empresa.nome, companyX, signatureY + 15);
  doc.setTextColor(120, 120, 120);
  doc.setFontSize(8);
  doc.text(tipo === 'recolha' ? 'Assinatura da Empresa' : 'Confirmação de Entrega', companyX, signatureY + 20);

  // ========== FOOTER ==========
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text(`${empresa.nome} - Documento gerado digitalmente`, pageWidth / 2, pageHeight - 8, { align: 'center' });

  if (empresa.telefone) {
    doc.text(`Tel: ${empresa.telefone}`, margin, pageHeight - 8);
  }

  return doc;
}

function formatDate(dateString: string): string {
  if (!dateString) return '--/--/----';
  try {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  } catch {
    return '--/--/----';
  }
}

export function downloadPDF(doc: jsPDF, filename: string): void {
  doc.save(filename);
}
