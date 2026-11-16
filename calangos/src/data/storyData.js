// ok: 'T' = sucesso p/ Calango Terrestre, 'E' = sucesso p/ Escalador, null = falha sempre.
// wrong: explicação da falha anatômica quando a espécie é incompatível (chave única "pN-esp").
export const SPECIES={
 T:{name:'Calango Terrestre',sci:'Ameiva ameiva',desc:'Robusto, veloz no solo e bom escavador. Não escala troncos lisos.'},
 E:{name:'Lagarto Escalador',sci:'Plica plica',desc:'Achatado, garras curvas para aderir a troncos. Lento e vulnerável no solo aberto.'}};
export const PHASES=[
{title:'Queimada Rasteira na Serrapilheira',threat:'Fogo rasteiro avança sobre as folhas secas, com fumaça tóxica e calor intenso!',fog:[0x6b4a2a,0.035],
 options:[
 {t:'Entrar em uma toca rasa no solo',ok:null,fail:'Asfixia',why:'Tocas rasas aprisionam monóxido (CO) e dióxido de carbono (CO₂) e o solo superaquece. O lagarto perde a consciência por asfixia antes de o fogo passar.'},
 {t:'Subir em um arbusto seco e baixo',ok:null,fail:'Copa inflamável',why:'Arbustos secos são combustível: as chamas rasteiras sobem rápido até a copa baixa e atingem o animal.'},
 {t:'Correr a favor do vento',ok:null,fail:'Fuga a favor do vento',why:'Fumaça e faíscas viajam mais rápido que o lagarto. Correr a favor do vento mantém o animal dentro da frente de fogo.'},
 {t:'Buscar uma fenda profunda sob rocha úmida perto do igarapé',ok:'T'},
 {t:'Escalar um tronco alto de casca grossa e úmida até o dossel',ok:'E'}],
 wrong:{T:'O Calango Terrestre não tem garras nem achatamento para aderir a troncos lisos e verticais: escorrega e cai no fogo.',E:'O Escalador é lento no solo aberto e a fenda ficava longe: as chamas o alcançam antes do abrigo.'}},
{title:'Enxurrada Súbita e Erosão de Solo',threat:'Tempestade extrema: uma torrente de lama, pedras e galhos desce a encosta!',fog:[0x3b4a52,0.03],
 options:[
 {t:'Nadar contra a correnteza de lama',ok:null,fail:'Arrastado pela lama',why:'A lama densa e as pedras superam qualquer força de natação de um lagarto. Ele é arrastado e esmagado.'},
 {t:'Esconder-se sob um tronco solto',ok:null,fail:'Esmagamento',why:'Troncos soltos são arrastados pela torrente e rolam sobre o abrigo, esmagando o animal.'},
 {t:'Ficar paralisado em uma depressão do terreno',ok:null,fail:'Soterramento',why:'Depressões concentram a água e a lama: o lagarto é soterrado e morre por sufocamento.'},
 {t:'Correr transversalmente à encosta até um barranco firme e elevado',ok:'T'},
 {t:'Subir em uma árvore de raízes firmes, acima da linha da lama',ok:'E'}],
 wrong:{T:'Sem garras, o Terrestre não consegue subir no tronco liso e molhado e é levado pela lama.',E:'Lento no chão encharcado, o Escalador não atravessa a encosta a tempo e é arrastado.'}},
{title:'Desmatamento Mecanizado e Correntão',threat:'Tratores de esteira e correntões derrubam árvores gigantes em efeito dominó!',fog:[0x5a5f45,0.025],
 options:[
 {t:'Agarrar-se ao tronco que está caindo',ok:null,fail:'Esmagamento pela queda',why:'O tronco tomba com tonelagem enorme: o lagarto é esmagado contra o solo ou arremessado.'},
 {t:'Fugir em linha reta na direção da queda',ok:null,fail:'Atingido na trajetória',why:'A copa cai em arco e atinge uma área maior que a distância que o lagarto percorre.'},
 {t:'Esconder-se no oco de uma árvore marcada para corte',ok:null,fail:'Preso no oco',why:'Árvores marcadas são as próximas a cair; o oco vira armadilha e é destruído com o tronco.'},
 {t:'Correr perpendicularmente à queda, rumo à mata intacta',ok:'T'},
 {t:'Pular de cipó em cipó e descer por troncos já tombados até a mata intacta',ok:'E'}],
 wrong:{T:'Sem aderência vertical, o Terrestre não alcança os cipós e fica na zona de queda.',E:'Em solo aberto e vibrando, o Escalador é lento demais para sair da zona de queda.'}},
{title:'Enchente Extrema e Alagamento de Várzea',threat:'As águas turvas sobem abruptamente, isolando bancos de terra e expulsando predadores!',fog:[0x4d5b4a,0.028],
 options:[
 {t:'Nadar em águas abertas sem destino',ok:null,fail:'Exaustão e afogamento',why:'Sem rumo, o lagarto gasta energia, cansa e se afoga; também fica exposto a peixes e jacarés.'},
 {t:'Permanecer em um banco de areia',ok:null,fail:'Banco submerso',why:'O banco de areia é o primeiro a submergir quando a várzea sobe.'},
 {t:'Subir em um galho podre flutuante',ok:null,fail:'Galho se desfaz',why:'Madeira podre perde flutuação e se desfaz; o animal cai na água turbulenta.'},
 {t:'Nadar com ondulação lateral até o barranco alto mais próximo',ok:'T'},
 {t:'Subir em árvore alta de várzea e se fixar acima da cota da água',ok:'E'}],
 wrong:{T:'Sem como subir, o Terrestre fica sem abrigo e é vencido pela água.',E:'O Escalador nada mal e o barranco era longe demais: exaustão.'}},
{title:'Onda de Calor Extrema e Seca Severa',threat:'42°C, solo rachado, nenhuma umidade e sol letal para animais ectotérmicos!',fog:[0xc9a45a,0.02],
 options:[
 {t:'Procurar água em campo aberto sob o sol',ok:null,fail:'Hipertermia',why:'Ectotérmicos não regulam a temperatura internamente; acima do limite crítico ocorre colapso e morte.'},
 {t:'Enterrar-se em areia quente superficial',ok:null,fail:'Cozimento no solo',why:'A areia superficial passa de 50°C e o animal não consegue se refrescar.'},
 {t:'Ficar em um galho exposto',ok:null,fail:'Desidratação',why:'Exposto à radiação direta, o lagarto perde água rapidamente e desidrata.'},
 {t:'Cavar uma toca profunda sob raízes, onde o solo mantém temperatura estável',ok:'T'},
 {t:'Subir ao dossel sombreado e abrigar-se numa bromélia que retém água',ok:'E'}],
 wrong:{T:'Sem aderência vertical, o Terrestre não alcança o dossel e fica ao sol.',E:'Sem escavar, o Escalador não acha abrigo no solo rachado: hipertermia.'}},
{title:'O Colapso Total',threat:'Megaincêndio, solo desmatado, céu bloqueado por fuligem, sem água nem abrigo.',fog:[0x2a2a2a,0.05],final:true,
 options:[
 {t:'Correr em direção ao rio',ok:null,fail:'Rio seco e fumaça',why:'O rio está seco e o ar, tóxico. A distância é grande demais sem cobertura.'},
 {t:'Cavar a toca mais profunda possível',ok:null,fail:'Solo em brasa',why:'Sem umidade, o solo calcinado retém calor e CO: a toca vira forno.'},
 {t:'Subir na última árvore em pé',ok:null,fail:'Árvore em chamas',why:'As árvores restantes estão queimando e sem copa. Não há onde se esconder.'},
 {t:'Esperar a chuva',ok:null,fail:'Sem chuva',why:'A fuligem e a fumaça bloqueiam o ciclo da chuva local; a espera é fatal.'},
 {t:'Migrar para outra mata',ok:null,fail:'Sem habitat',why:'A floresta ao redor já se foi; não há corredor ecológico para migrar.'}]}
];
export const END_MSG='Infelizmente, a natureza tem limites e não pode se adaptar a tudo. A velocidade e a escala do impacto humano superam a capacidade biológica de evolução e sobrevivência das espécies.';
export const TOTAL_FAILS=25;
