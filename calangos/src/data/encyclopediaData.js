import {PHASES} from './storyData.js';
export const FICHAS={
 T:{nome:'Calango Terrestre (jacarezinho)',sci:'Ameiva ameiva',familia:'Teiidae',
  habitat:'Bordas de mata, clareiras, áreas abertas e solos arenosos da Amazônia; usa tocas e fendas.',
  habitos:'Diurno, ectotérmico e heliotérmico: alterna sol e sombra para manter a temperatura corporal. Forrageador ativo e veloz.',
  dieta:'Insetívoro-onívoro: insetos, aranhas, pequenos vertebrados e eventualmente frutos.',
  adaptacoes:['Escamas: dorsais granulares e ventrais largas, que reduzem a perda de água e protegem do atrito com o solo.','Garras: curtas e retas, boas para escavar e correr, ruins para aderir a troncos lisos.','Termorregulação: sem controle metabólico interno; depende de fontes externas de calor e do microclima.','Respiração: pulmões com troca gasosa passiva e dependente do ar; em ambientes sem ventilação a oxigenação cai.']},
 E:{nome:'Lagarto Escalador',sci:'Plica plica',familia:'Tropiduridae',
  habitat:'Troncos de árvores da floresta primária e de várzea, em geral de cabeça para baixo ou na vertical.',
  habitos:'Diurno e ectotérmico; espera a presa imóvel no tronco, apoiando-se na camuflagem. Pouco veloz no solo aberto.',
  dieta:'Principalmente formigas e outros pequenos artrópodes.',
  adaptacoes:['Escamas: corpo achatado, coloração críptica e escamas rugosas que imitam a casca.','Garras: longas e curvas, com dedos compridos que garantem aderência em superfícies verticais.','Termorregulação: usa o microclima sombreado do tronco; é sensível a sol direto e calor extremo.','Respiração: pulmões simples; o animal depende de ar limpo e movimenta-se pouco em solo aberto.']}};
export const CAUSES={
 asf:['Asfixia por Hipóxia e Intoxicação por Monóxido de Carbono','Em tocas sem ventilação o fogo consome o oxigênio e libera CO e CO₂. O CO liga-se à hemoglobina com afinidade muito maior que o O₂, formando carboxiemoglobina, e os tecidos ficam sem oxigênio. A troca gasosa nos pulmões falha, o animal perde a consciência e morre. Répteis aguentam hipóxia melhor que mamíferos, mas não dentro de um buraco saturado de gases.'],
 queim:['Queimaduras Térmicas e Choque Térmico','Chamas e solo superaquecido desnaturam proteínas da pele e dos músculos em segundos. Sem sudorese, o réptil não consegue dissipar calor, e a lesão térmica evolui para choque e falência de órgãos.'],
 hiper:['Hipertermia Letal acima de 43 °C','O réptil ectotérmico não gera calor metabólico, mas depende do ambiente para se manter na faixa ideal. Perto de 43 °C ele perde o controle: enzimas deixam de funcionar, o sistema nervoso falha e há colapso circulatório. Sem sombra ou toca fria, a fuga térmica é impossível.'],
 esmag:['Esmagamento Mecânico (Trauma Contuso)','Troncos, pedras e maquinário aplicam forças milhares de vezes maiores que o peso do lagarto. O trauma contuso rompe costelas, coluna e órgãos internos, causando hemorragia e morte imediata.'],
 afog:['Exaustão Muscular e Afogamento','Lagartos nadam por ondulação lateral, o que consome muito ATP. Em águas turbulentas ou sem destino, o músculo acumula lactato, a força cai e o animal fica submerso: a água invade os pulmões e ocorre afogamento.'],
 sot:['Asfixia por Soterramento','A lama e os sedimentos comprimem o tórax e bloqueiam as vias aéreas. Sem movimento da caixa torácica a ventilação para, e o animal morre de hipóxia em poucos minutos.'],
 desid:['Desidratação Severa','Sem água e sob sol direto, o lagarto perde líquido pela pele e pela respiração mais rápido do que repõe. O sangue engrossa, os rins param de filtrar e o desequilíbrio de íons leva à falência de órgãos.'],
 coll:['Colapso Ecológico: Perda Total de Habitat','Sem cobertura vegetal, sem presas e sem corredores ecológicos, o lagarto fica sem abrigo, sem alimento e sem água. A fisiologia de répteis não consegue compensar um ambiente que desapareceu em poucos dias.'],
 time:['Resposta Tardia ao Perigo','Em emergências reais, cada segundo conta: a hesitação deixa o animal exposto ao desastre. (Esta falha não conta nas 25 do rastreador.)']};
const MAP=[['asf','queim','asf'],['afog','esmag','sot'],['esmag','esmag','esmag'],['afog','afog','afog'],['hiper','queim','desid'],['asf','hiper','queim','desid','coll']];
const ESP=['queim','esmag','esmag','afog','hiper'];
export function autopsy(key){
 if(key.endsWith('time'))return{cause:CAUSES.time[0],text:CAUSES.time[1]};
 const[p,i]=key.slice(1).split('-');let c;
 if(i==='esp')c=ESP[+p];else c=MAP[+p][+i];
 return{cause:CAUSES[c][0],text:CAUSES[c][1]};}
export function failEntries(){
 const out=[];
 PHASES.forEach((P,pi)=>{
  P.options.forEach((o,i)=>{if(P.final||!o.ok)out.push({key:`p${pi}-${i}`,fase:P.title,title:o.fail,why:o.why});});
  if(!P.final)out.push({key:`p${pi}-esp`,fase:P.title,title:'Limitação anatômica',why:P.wrong.T+' '+P.wrong.E});});
 return out;}
