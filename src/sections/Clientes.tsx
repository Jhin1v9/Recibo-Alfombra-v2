import { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Edit2, 
  Trash2, 
  Upload,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import type { Cliente } from '@/types';

interface ClientesProps {
  clientes: Cliente[];
  onAdd: (cliente: Omit<Cliente, 'id' | 'dataCriacao' | 'dataAtualizacao'>) => void;
  onUpdate: (id: string, updates: Partial<Cliente>) => void;
  onDelete: (id: string) => void;
  onImport: (clientes: Omit<Cliente, 'id' | 'dataCriacao' | 'dataAtualizacao'>[]) => void;
  onSelect: (cliente: Cliente) => void;
}

export function ClientesSection({ 
  clientes, 
  onAdd, 
  onUpdate, 
  onDelete, 
  onImport,
  onSelect 
}: ClientesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  const filteredClientes = clientes.filter(c => 
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.telefone.includes(searchTerm) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImportVCF = (content: string) => {
    const contacts: Omit<Cliente, 'id' | 'dataCriacao' | 'dataAtualizacao'>[] = [];
    const vcards = content.split('BEGIN:VCARD');
    
    vcards.forEach(vcard => {
      if (!vcard.includes('END:VCARD')) return;
      
      const nome = vcard.match(/FN:(.+)/)?.[1] || '';
      const telefone = vcard.match(/TEL[^:]*:(.+)/)?.[1] || '';
      const email = vcard.match(/EMAIL[^:]*:(.+)/)?.[1] || '';
      const endereco = vcard.match(/ADR[^:]*:;;(.+?);/)?.[1] || '';
      
      if (nome) {
        contacts.push({
          nome,
          telefone: telefone.replace(/\s/g, ''),
          email: email.toLowerCase(),
          endereco,
          cidade: '',
          cp: '',
          notas: '',
        });
      }
    });
    
    onImport(contacts);
    setImportDialogOpen(false);
  };

  const handleImportCSV = (content: string) => {
    const lines = content.split('\n');
    const contacts: Omit<Cliente, 'id' | 'dataCriacao' | 'dataAtualizacao'>[] = [];
    
    // Skip header if exists
    const startIndex = lines[0].toLowerCase().includes('nome') ? 1 : 0;
    
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const parts = line.split(',').map(p => p.trim());
      if (parts[0]) {
        contacts.push({
          nome: parts[0],
          telefone: parts[1] || '',
          email: parts[2] || '',
          endereco: parts[3] || '',
          cidade: parts[4] || '',
          cp: parts[5] || '',
          notas: parts[6] || '',
        });
      }
    }
    
    onImport(contacts);
    setImportDialogOpen(false);
  };

  const exportToCSV = () => {
    const headers = ['Nome', 'Telefone', 'Email', 'Endereço', 'Cidade', 'CP', 'Notas'];
    const rows = clientes.map(c => [
      c.nome,
      c.telefone,
      c.email,
      c.endereco,
      c.cidade,
      c.cp,
      c.notas,
    ]);
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clientes-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-500">{clientes.length} cliente(s) cadastrado(s)</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setImportDialogOpen(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Importar
          </Button>
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-amber-600 hover:bg-amber-700">
                <Plus className="w-4 h-4 mr-2" />
                Novo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Novo Cliente</DialogTitle>
              </DialogHeader>
              <ClienteForm 
                onSubmit={(data) => {
                  onAdd(data);
                  setIsAddOpen(false);
                }}
                onCancel={() => setIsAddOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Buscar por nome, telefone ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Clientes List */}
      {filteredClientes.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="py-12 text-center">
            <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? 'Tente buscar com outros termos' 
                : 'Adicione seu primeiro cliente para começar'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsAddOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Cliente
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filteredClientes.map((cliente) => (
            <Card 
              key={cliente.id} 
              className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onSelect(cliente)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-medium text-amber-700">
                      {cliente.nome.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{cliente.nome}</h3>
                    <div className="mt-1 space-y-1">
                      {cliente.telefone && (
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {cliente.telefone}
                        </p>
                      )}
                      {cliente.email && (
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {cliente.email}
                        </p>
                      )}
                      {(cliente.endereco || cliente.cidade) && (
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {cliente.endereco} {cliente.cidade && `- ${cliente.cidade}`}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingCliente(cliente);
                      }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Tem certeza que deseja excluir este cliente?')) {
                          onDelete(cliente.id);
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

      {/* Edit Sheet */}
      <Sheet open={!!editingCliente} onOpenChange={() => setEditingCliente(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Editar Cliente</SheetTitle>
          </SheetHeader>
          {editingCliente && (
            <div className="mt-6">
              <ClienteForm
                initialData={editingCliente}
                onSubmit={(data) => {
                  onUpdate(editingCliente.id, data);
                  setEditingCliente(null);
                }}
                onCancel={() => setEditingCliente(null)}
              />
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importar Clientes</DialogTitle>
          </DialogHeader>
          <ImportForm 
            onImportVCF={handleImportVCF}
            onImportCSV={handleImportCSV}
            onCancel={() => setImportDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface ClienteFormProps {
  initialData?: Partial<Cliente>;
  onSubmit: (data: Omit<Cliente, 'id' | 'dataCriacao' | 'dataAtualizacao'>) => void;
  onCancel: () => void;
}

function ClienteForm({ initialData, onSubmit, onCancel }: ClienteFormProps) {
  const [formData, setFormData] = useState({
    nome: initialData?.nome || '',
    telefone: initialData?.telefone || '',
    email: initialData?.email || '',
    endereco: initialData?.endereco || '',
    cidade: initialData?.cidade || '',
    cp: initialData?.cp || '',
    notas: initialData?.notas || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome.trim()) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome *</Label>
        <Input
          id="nome"
          value={formData.nome}
          onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
          placeholder="Nome completo"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="telefone">Telefone</Label>
          <Input
            id="telefone"
            value={formData.telefone}
            onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
            placeholder="+34 624 529 442"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="email@exemplo.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="endereco">Endereço</Label>
        <Input
          id="endereco"
          value={formData.endereco}
          onChange={(e) => setFormData(prev => ({ ...prev, endereco: e.target.value }))}
          placeholder="Rua, número, andar..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cidade">Cidade</Label>
          <Input
            id="cidade"
            value={formData.cidade}
            onChange={(e) => setFormData(prev => ({ ...prev, cidade: e.target.value }))}
            placeholder="Cidade"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cp">Código Postal</Label>
          <Input
            id="cp"
            value={formData.cp}
            onChange={(e) => setFormData(prev => ({ ...prev, cp: e.target.value }))}
            placeholder="00000"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notas">Notas</Label>
        <textarea
          id="notas"
          value={formData.notas}
          onChange={(e) => setFormData(prev => ({ ...prev, notas: e.target.value }))}
          placeholder="Informações adicionais..."
          className="w-full min-h-[80px] px-3 py-2 border rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" className="flex-1 bg-amber-600 hover:bg-amber-700">
          {initialData ? 'Salvar' : 'Adicionar'}
        </Button>
      </div>
    </form>
  );
}

interface ImportFormProps {
  onImportVCF: (content: string) => void;
  onImportCSV: (content: string) => void;
  onCancel: () => void;
}

function ImportForm({ onImportVCF, onImportCSV, onCancel }: ImportFormProps) {
  const [content, setContent] = useState('');
  const [fileType, setFileType] = useState<'vcf' | 'csv'>('vcf');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setContent(text);
      if (file.name.endsWith('.csv')) setFileType('csv');
      else if (file.name.endsWith('.vcf')) setFileType('vcf');
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (!content.trim()) return;
    if (fileType === 'vcf') onImportVCF(content);
    else onImportCSV(content);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFileType('vcf')}
          className={`flex-1 py-2 px-4 rounded-lg border ${
            fileType === 'vcf' 
              ? 'bg-amber-100 border-amber-300 text-amber-900' 
              : 'bg-white border-gray-200'
          }`}
        >
          VCF (Contatos)
        </button>
        <button
          onClick={() => setFileType('csv')}
          className={`flex-1 py-2 px-4 rounded-lg border ${
            fileType === 'csv' 
              ? 'bg-amber-100 border-amber-300 text-amber-900' 
              : 'bg-white border-gray-200'
          }`}
        >
          CSV (Excel)
        </button>
      </div>

      <div className="space-y-2">
        <Label>Arquivo {fileType.toUpperCase()}</Label>
        <Input
          type="file"
          accept={fileType === 'vcf' ? '.vcf' : '.csv'}
          onChange={handleFileChange}
        />
        <p className="text-xs text-gray-500">
          {fileType === 'vcf' 
            ? 'Exporte seus contatos do telefone ou Google Contacts'
            : 'Formato: Nome, Telefone, Email, Endereço, Cidade, CP, Notas'
          }
        </p>
      </div>

      {content && (
        <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">
          Arquivo carregado com sucesso!
        </div>
      )}

      <div className="flex gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button 
          onClick={handleImport} 
          disabled={!content}
          className="flex-1 bg-amber-600 hover:bg-amber-700"
        >
          Importar
        </Button>
      </div>
    </div>
  );
}
