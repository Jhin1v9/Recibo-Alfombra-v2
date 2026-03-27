import { useState, useEffect } from 'react';
import { Building2, Save, Palette, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Empresa } from '@/types';

interface EmpresaProps {
  empresa: Empresa;
  onUpdate: (updates: Partial<Empresa>) => void;
}

export function EmpresaSection({ empresa, onUpdate }: EmpresaProps) {
  const [formData, setFormData] = useState<Empresa>(empresa);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setFormData(empresa);
  }, [empresa]);

  const handleChange = (field: keyof Empresa, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onUpdate(formData);
    setHasChanges(false);
  };

  const colors = [
    { name: 'Âmbar', primary: '#8B5A2B', secondary: '#D4A574' },
    { name: 'Azul', primary: '#1E40AF', secondary: '#60A5FA' },
    { name: 'Verde', primary: '#166534', secondary: '#4ADE80' },
    { name: 'Roxo', primary: '#7C3AED', secondary: '#A78BFA' },
    { name: 'Vermelho', primary: '#DC2626', secondary: '#F87171' },
    { name: 'Cinza', primary: '#374151', secondary: '#9CA3AF' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dados da Empresa</h1>
          <p className="text-gray-500">Configure os dados que aparecerão nos recibos</p>
        </div>
        {hasChanges && (
          <Button onClick={handleSave} className="bg-amber-600 hover:bg-amber-700">
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
          </Button>
        )}
      </div>

      <Tabs defaultValue="dados" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="dados">Dados Gerais</TabsTrigger>
          <TabsTrigger value="aparencia">Aparência</TabsTrigger>
        </TabsList>

        <TabsContent value="dados" className="space-y-6">
          {/* Basic Info */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-600" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome da Empresa *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => handleChange('nome', e.target.value)}
                    placeholder="Ex: Superclim Serviços"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slogan">Slogan / Descrição</Label>
                  <Input
                    id="slogan"
                    value={formData.slogan}
                    onChange={(e) => handleChange('slogan', e.target.value)}
                    placeholder="Ex: Custódia temporária e limpeza profissional"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nif">NIF / Identificação Fiscal</Label>
                  <Input
                    id="nif"
                    value={formData.nif}
                    onChange={(e) => handleChange('nif', e.target.value)}
                    placeholder="Ex: 123456789"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Phone className="w-5 h-5 text-amber-600" />
                Contactos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => handleChange('telefone', e.target.value)}
                    placeholder="+34 624 529 442"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="contato@empresa.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-600" />
                Endereço
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    value={formData.endereco}
                    onChange={(e) => handleChange('endereco', e.target.value)}
                    placeholder="Rua, número, andar..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade / Código Postal</Label>
                  <Input
                    id="cidade"
                    value={formData.cidade}
                    onChange={(e) => handleChange('cidade', e.target.value)}
                    placeholder="08202 Sabadell, Barcelona"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="aparencia" className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Palette className="w-5 h-5 text-amber-600" />
                Cores da Marca
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => {
                      handleChange('corPrimaria', color.primary);
                      handleChange('corSecundaria', color.secondary);
                    }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.corPrimaria === color.primary
                        ? 'border-gray-900 ring-2 ring-gray-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex gap-2 mb-3">
                      <div 
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: color.primary }}
                      />
                      <div 
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: color.secondary }}
                      />
                    </div>
                    <p className="font-medium text-sm">{color.name}</p>
                  </button>
                ))}
              </div>

              {/* Custom Colors */}
              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="corPrimaria">Cor Primária Personalizada</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.corPrimaria}
                      onChange={(e) => handleChange('corPrimaria', e.target.value)}
                      className="w-10 h-10 rounded-lg border cursor-pointer"
                    />
                    <Input
                      id="corPrimaria"
                      value={formData.corPrimaria}
                      onChange={(e) => handleChange('corPrimaria', e.target.value)}
                      placeholder="#8B5A2B"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="corSecundaria">Cor Secundária Personalizada</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.corSecundaria}
                      onChange={(e) => handleChange('corSecundaria', e.target.value)}
                      className="w-10 h-10 rounded-lg border cursor-pointer"
                    />
                    <Input
                      id="corSecundaria"
                      value={formData.corSecundaria}
                      onChange={(e) => handleChange('corSecundaria', e.target.value)}
                      placeholder="#D4A574"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Pré-visualização</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-6 rounded-xl border-2 border-dashed border-gray-200">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl font-bold"
                    style={{ backgroundColor: formData.corPrimaria }}
                  >
                    {formData.nome.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg" style={{ color: formData.corPrimaria }}>
                      {formData.nome}
                    </h3>
                    <p className="text-gray-500">{formData.slogan}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <span 
                    className="px-3 py-1 rounded-full text-sm text-white"
                    style={{ backgroundColor: formData.corPrimaria }}
                  >
                    Primária
                  </span>
                  <span 
                    className="px-3 py-1 rounded-full text-sm text-white"
                    style={{ backgroundColor: formData.corSecundaria }}
                  >
                    Secundária
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
