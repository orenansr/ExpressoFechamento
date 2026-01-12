
export interface DailyClosing {
  id: string;
  timestamp: number;
  date: string;
  // Entradas
  dinheiro: number;
  maquina1: number;
  maquina2: number;
  saidaEntrada: number; // Referred to as "saida" in the entrance group
  // Saídas (Despesas/Comandas)
  felipe: number;
  ninha: number;
  renan: number;
  tecnicos: number;
  loja: number;
  // Totals
  totalEntradas: number;
  totalSaidas: number;
  resultado: number;
}
