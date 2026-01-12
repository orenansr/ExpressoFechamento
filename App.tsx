
import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, 
  Trash2, 
  History, 
  TrainFront,
  AlertCircle,
  Banknote,
  CreditCard,
  TrendingDown,
  TrendingUp,
  User,
  Users,
  Store,
  CheckCircle,
  Download,
  Calculator,
  ArrowRightLeft
} from 'lucide-react';
import { DailyClosing } from './types';
import { COMPANY_NAME } from './constants';
import { storageService } from './services/storageService';
import { generateClosingPDF } from './utils/pdfGenerator';

const App: React.FC = () => {
  const [closings, setClosings] = useState<DailyClosing[]>([]);
  
  // Form State - Entradas
  const [dinheiro, setDinheiro] = useState<string>('');
  const [maquina1, setMaquina1] = useState<string>('');
  const [maquina2, setMaquina2] = useState<string>('');
  const [saidaEntrada, setSaidaEntrada] = useState<string>('');

  // Form State - Saídas
  const [felipe, setFelipe] = useState<string>('');
  const [ninha, setNinha] = useState<string>('');
  const [renan, setRenan] = useState<string>('');
  const [tecnicos, setTecnicos] = useState<string>('');
  const [loja, setLoja] = useState<string>('');

  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    setClosings(storageService.getClosings());
  }, []);

  // Real-time calculations
  const totalEntradas = useMemo(() => {
    return (parseFloat(dinheiro) || 0) + (parseFloat(maquina1) || 0) + (parseFloat(maquina2) || 0) + (parseFloat(saidaEntrada) || 0);
  }, [dinheiro, maquina1, maquina2, saidaEntrada]);

  const totalSaidas = useMemo(() => {
    return (parseFloat(felipe) || 0) + (parseFloat(ninha) || 0) + (parseFloat(renan) || 0) + (parseFloat(tecnicos) || 0) + (parseFloat(loja) || 0);
  }, [felipe, ninha, renan, tecnicos, loja]);

  const resultadoFinal = useMemo(() => {
    return totalEntradas - totalSaidas;
  }, [totalEntradas, totalSaidas]);

  const handleCloseDay = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (totalEntradas === 0 && totalSaidas === 0) {
      alert("Por favor, insira valores para realizar o fechamento.");
      return;
    }

    const newClosing: DailyClosing = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      timestamp: Date.now(),
      date: new Date().toLocaleDateString('pt-BR'),
      dinheiro: parseFloat(dinheiro) || 0,
      maquina1: parseFloat(maquina1) || 0,
      maquina2: parseFloat(maquina2) || 0,
      saidaEntrada: parseFloat(saidaEntrada) || 0,
      felipe: parseFloat(felipe) || 0,
      ninha: parseFloat(ninha) || 0,
      renan: parseFloat(renan) || 0,
      tecnicos: parseFloat(tecnicos) || 0,
      loja: parseFloat(loja) || 0,
      totalEntradas,
      totalSaidas,
      resultado: resultadoFinal
    };

    setIsClosing(true);
    setTimeout(() => {
      storageService.saveClosing(newClosing);
      setClosings([newClosing, ...closings]);
      generateClosingPDF(newClosing);
      
      // Clear form
      setDinheiro('');
      setMaquina1('');
      setMaquina2('');
      setSaidaEntrada('');
      setFelipe('');
      setNinha('');
      setRenan('');
      setTecnicos('');
      setLoja('');
      
      setIsClosing(false);
      alert('Caixa fechado e relatório gerado!');
    }, 800);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja excluir este registro de fechamento?')) {
      storageService.deleteClosing(id);
      setClosings(closings.filter(c => c.id !== id));
    }
  };

  // Classe utilitária para os inputs
  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-white text-gray-900 font-medium placeholder:text-gray-400";

  return (
    <div className="min-h-screen pb-12 bg-[#fdfaf8]">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-xl sticky top-0 z-50 border-b-4 border-orange-500">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-500 p-2 rounded-xl shadow-lg">
              <TrainFront className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white uppercase">{COMPANY_NAME}</h1>
              <p className="text-orange-400 text-[10px] uppercase font-bold tracking-widest">Painel de Fechamento</p>
            </div>
          </div>
          <div className="text-right bg-white/5 px-4 py-1 rounded-lg border border-white/10">
            <p className="text-[10px] text-gray-400 uppercase font-black">Hoje</p>
            <p className="text-sm font-semibold text-orange-400">{new Date().toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Form Column */}
        <div className="lg:col-span-6 space-y-6">
          <form onSubmit={handleCloseDay} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 bg-orange-50 border-b border-orange-100 flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-orange-600" />
              <h2 className="font-bold text-gray-800">Novo Registro</h2>
            </div>
            
            <div className="p-6 space-y-8">
              {/* Entradas Group */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 border-b border-green-100 pb-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <h3 className="text-xs font-black text-green-700 uppercase">Entradas</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-600 uppercase flex items-center space-x-1">
                      <Banknote className="w-3 h-3 text-green-500" /> <span>Dinheiro</span>
                    </label>
                    <input type="number" step="0.01" value={dinheiro} onChange={(e) => setDinheiro(e.target.value)} placeholder="0,00" className={inputClass} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-600 uppercase flex items-center space-x-1">
                      <CreditCard className="w-3 h-3 text-orange-400" /> <span>Máquina 1</span>
                    </label>
                    <input type="number" step="0.01" value={maquina1} onChange={(e) => setMaquina1(e.target.value)} placeholder="0,00" className={inputClass} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-600 uppercase flex items-center space-x-1">
                      <CreditCard className="w-3 h-3 text-orange-400" /> <span>Máquina 2</span>
                    </label>
                    <input type="number" step="0.01" value={maquina2} onChange={(e) => setMaquina2(e.target.value)} placeholder="0,00" className={inputClass} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-600 uppercase flex items-center space-x-1">
                      <ArrowRightLeft className="w-3 h-3 text-blue-400" /> <span>Saída (Entrada)</span>
                    </label>
                    <input type="number" step="0.01" value={saidaEntrada} onChange={(e) => setSaidaEntrada(e.target.value)} placeholder="0,00" className={inputClass} />
                  </div>
                </div>
              </div>

              {/* Saídas Group */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 border-b border-red-100 pb-2">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  <h3 className="text-xs font-black text-red-700 uppercase">Saídas (Despesas / Pessoal)</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-600 uppercase flex items-center space-x-1">
                      <User className="w-3 h-3" /> <span>Felipe</span>
                    </label>
                    <input type="number" step="0.01" value={felipe} onChange={(e) => setFelipe(e.target.value)} placeholder="0,00" className={inputClass} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-600 uppercase flex items-center space-x-1">
                      <User className="w-3 h-3" /> <span>Ninha</span>
                    </label>
                    <input type="number" step="0.01" value={ninha} onChange={(e) => setNinha(e.target.value)} placeholder="0,00" className={inputClass} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-600 uppercase flex items-center space-x-1">
                      <User className="w-3 h-3" /> <span>Renan</span>
                    </label>
                    <input type="number" step="0.01" value={renan} onChange={(e) => setRenan(e.target.value)} placeholder="0,00" className={inputClass} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-600 uppercase flex items-center space-x-1">
                      <Users className="w-3 h-3" /> <span>Técnicos</span>
                    </label>
                    <input type="number" step="0.01" value={tecnicos} onChange={(e) => setTecnicos(e.target.value)} placeholder="0,00" className={inputClass} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-600 uppercase flex items-center space-x-1">
                      <Store className="w-3 h-3" /> <span>Loja</span>
                    </label>
                    <input type="number" step="0.01" value={loja} onChange={(e) => setLoja(e.target.value)} placeholder="0,00" className={inputClass} />
                  </div>
                </div>
              </div>

              {/* Live Summary Footer */}
              <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100 space-y-3 shadow-inner">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Total de Entradas</span>
                  <span className="font-bold text-green-700">R$ {totalEntradas.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Total de Saídas</span>
                  <span className="font-bold text-red-600">R$ {totalSaidas.toFixed(2)}</span>
                </div>
                <div className="pt-3 border-t border-orange-200 flex justify-between items-center">
                  <span className="text-lg font-black text-slate-800">Saldo Final</span>
                  <span className={`text-2xl font-black ${resultadoFinal >= 0 ? 'text-orange-600' : 'text-red-600'}`}>
                    R$ {resultadoFinal.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isClosing}
                className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isClosing ? <span className="animate-pulse">PROCESSANDO...</span> : <><CheckCircle className="w-5 h-5" /> <span>FECHAR CAIXA</span></>}
              </button>
            </div>
          </form>
        </div>

        {/* History Column */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <History className="w-5 h-5 text-slate-400" />
                <h2 className="font-bold text-gray-800">Fechamentos Recentes</h2>
              </div>
              <span className="bg-orange-100 text-orange-700 text-[10px] px-3 py-1 rounded-full font-black uppercase">
                {closings.length} Registros
              </span>
            </div>
            
            <div className="max-h-[700px] overflow-y-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 sticky top-0 border-b border-gray-200 z-10">
                  <tr>
                    <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase">Data</th>
                    <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase">Entrada</th>
                    <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase">Resultado</th>
                    <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {closings.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-20 text-center text-gray-400 italic">
                        <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-10" />
                        Ainda não há registros de fechamento.
                      </td>
                    </tr>
                  ) : (
                    closings.slice().reverse().map((c) => (
                      <tr key={c.id} className="hover:bg-orange-50/30 transition-colors group">
                        <td className="px-4 py-4">
                          <p className="text-sm font-bold text-slate-700">{c.date}</p>
                          <p className="text-[10px] text-gray-400 font-mono">#{c.id}</p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-xs font-bold text-green-700">R$ {c.totalEntradas.toFixed(2)}</p>
                        </td>
                        <td className="px-4 py-4">
                          <p className={`text-sm font-black ${c.resultado >= 0 ? 'text-orange-600' : 'text-red-600'}`}>
                            R$ {c.resultado.toFixed(2)}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-center space-x-1">
                            <button
                              onClick={() => generateClosingPDF(c)}
                              className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-100 rounded-xl transition-all"
                              title="Download PDF"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(c.id)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-100 rounded-xl transition-all"
                              title="Excluir"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-6xl mx-auto px-4 mt-12 text-center">
        <div className="inline-block p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
          <p className="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em] flex items-center justify-center space-x-2">
            <TrainFront className="w-3 h-3 text-orange-500" />
            <span>&copy; {new Date().getFullYear()} {COMPANY_NAME} &bull; SISTEMA DE GESTÃO EXCLUSIVA</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
