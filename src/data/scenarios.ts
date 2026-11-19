import { KeyPhrase, LevelMeta, ProficiencyLevel, ScenarioId, ScenarioMeta } from '../types';
import appLogo from '../assets/images/impara_italiano_logo_1795122324800.jpg';

export const APP_LOGO_URL = appLogo;

export const LEVELS: LevelMeta[] = [
  {
    id: 'beginner',
    label: 'Principiante',
    description: 'Parole semplici e frasi brevi',
  },
  {
    id: 'intermediate',
    label: 'Intermedio',
    description: 'Italiano naturale di ogni giorno',
  },
  {
    id: 'advanced',
    label: 'Avanzato',
    description: 'Modi di dire e fluidità nativa',
  },
];

export const SCENARIOS: ScenarioMeta[] = [
  {
    id: 'conversation',
    title: "Impara l'Italiano",
    subtitle: 'Dialogo libero e pratica quotidiana',
    roleDescription: 'Pratica conversazioni naturali in italiano su qualsiasi argomento a tua scelta.',
    accentBg: 'bg-blue-50',
    accentText: 'text-[#1E40AF]',
  },
  {
    id: 'airport',
    title: 'In aeroporto',
    subtitle: 'Check-in, sicurezza e imbarco',
    roleDescription: "Pratica banchi del check-in, bagagli, controlli di sicurezza e gate d'imbarco in italiano.",
    accentBg: 'bg-sky-50',
    accentText: 'text-sky-700',
  },
  {
    id: 'work',
    title: 'Al lavoro',
    subtitle: 'Riunioni e aggiornamenti sul progetto',
    roleDescription: 'Pratica aggiornamenti in ufficio, scadenze e collaborazione con colleghi italiani.',
    accentBg: 'bg-indigo-50',
    accentText: 'text-indigo-700',
  },
  {
    id: 'doctor',
    title: 'Dal medico',
    subtitle: 'Sintomi, visita e ricette',
    roleDescription: 'Pratica come spiegare come ti senti, chiedere dei farmaci e seguire i consigli medici in italiano.',
    accentBg: 'bg-rose-50',
    accentText: 'text-rose-700',
  },
  {
    id: 'meeting',
    title: 'Conoscere qualcuno',
    subtitle: 'Presentazioni, hobby e programmi',
    roleDescription: 'Pratica come rompere il ghiaccio, parlare di te e fare nuove amicizie in italiano.',
    accentBg: 'bg-amber-50',
    accentText: 'text-amber-700',
  },
];

export const INITIAL_PHRASES: Record<ScenarioId, Record<ProficiencyLevel, KeyPhrase[]>> = {
  conversation: {
    beginner: [
      {
        id: 'it-conv-b-1',
        italian: 'Come va la tua giornata?',
        meaning: 'Come sta andando il tuo giorno?',
        usageNote: 'Domanda cordiale per iniziare qualsiasi conversazione in italiano.',
      },
      {
        id: 'it-conv-b-2',
        italian: 'Puoi ripetere, per favore?',
        meaning: 'Potresti dirlo di nuovo, per cortesia?',
        usageNote: 'Molto utile quando qualcuno parla un po’ troppo velocemente.',
      },
      {
        id: 'it-conv-b-3',
        italian: 'Che cosa significa questa parola?',
        meaning: 'Qual è il significato di questo termine?',
        usageNote: 'Ottima abitudine per imparare nuovi vocaboli italiani in modo naturale.',
      },
      {
        id: 'it-conv-b-4',
        italian: 'Mi piace parlare di sport e viaggi.',
        meaning: 'Amo chiacchierare di sport e viaggi.',
        usageNote: 'Sostituisci "sport" e "viaggi" con qualsiasi tuo hobby preferito.',
      },
      {
        id: 'it-conv-b-5',
        italian: 'Sembra davvero interessante!',
        meaning: 'È una cosa molto curiosa e bella!',
        usageNote: 'Reazione naturale per mantenere amichevole la conversazione.',
      },
    ],
    intermediate: [
      {
        id: 'it-conv-i-1',
        italian: 'Che hai fatto di bello ultimamente?',
        meaning: 'Come hai passato il tempo negli ultimi giorni?',
        usageNote: 'Saluto spontaneo e informale tra amici italiani.',
      },
      {
        id: 'it-conv-i-2',
        italian: 'Sinceramente, sono completamente d’accordo con te.',
        meaning: 'Onestamente condivido in pieno la tua idea.',
        usageNote: '"Sinceramente" rende la tua opinione più calda e spontanea.',
      },
      {
        id: 'it-conv-i-3',
        italian: 'Questo mi ricorda una storia simile.',
        meaning: 'Mi fa venire in mente un episodio uguale.',
        usageNote: 'Passaggio scorrevole per raccontare un esempio personale.',
      },
      {
        id: 'it-conv-i-4',
        italian: 'Come passi di solito i tuoi fine settimana?',
        meaning: 'Cosa fai normalmente nel weekend?',
        usageNote: 'Ottima domanda aperta per continuare a parlare.',
      },
      {
        id: 'it-conv-i-5',
        italian: 'Capisco perfettamente il tuo punto di vista.',
        meaning: 'Comprendo benissimo la tua opinione.',
        usageNote: 'Espressione cortese per mostrare ascolto e rispetto.',
      },
    ],
    advanced: [
      {
        id: 'it-conv-a-1',
        italian: 'Guardando il quadro generale, ha perfettamente senso.',
        meaning: 'Considerando l’insieme, è del tutto logico.',
        usageNote: 'Espressione naturale per discussioni approfondite.',
      },
      {
        id: 'it-conv-a-2',
        italian: 'Hai colto proprio nel segno!',
        meaning: 'Hai centrato esattamente il punto!',
        usageNote: 'Modo di dire classico quando qualcuno fa un’osservazione azzeccata.',
      },
      {
        id: 'it-conv-a-3',
        italian: 'Ho sentimenti contrastanti su questa idea.',
        meaning: 'Sono un po’ diviso riguardo a questa proposta.',
        usageNote: 'Modo equilibrato per esprimere un’opinione sfumata.',
      },
      {
        id: 'it-conv-a-4',
        italian: 'Ad essere onesti, entrambe le parti hanno ragione.',
        meaning: 'A dirla tutta, tutti e due hanno un buon motivo.',
        usageNote: 'Suona diplomatico e curato durante un confronto.',
      },
      {
        id: 'it-conv-a-5',
        italian: 'Va da sé che la pratica ripaga sempre.',
        meaning: 'È ovvio che esercitarsi porta sempre risultati.',
        usageNote: 'Connettivo efficace per sottolineare una verità evidente.',
      },
    ],
  },
  airport: {
    beginner: [
      {
        id: 'it-air-b-1',
        italian: 'Dov’è il banco del check-in?',
        meaning: 'Dove si trova lo sportello per registrarsi?',
        usageNote: 'Da usare appena entri nella zona partenze.',
      },
      {
        id: 'it-air-b-2',
        italian: 'Ecco il mio passaporto e il biglietto.',
        meaning: 'Le consegno i documenti e la carta d’imbarco.',
        usageNote: 'Frase semplice e gentile al check-in o ai controlli.',
      },
      {
        id: 'it-air-b-3',
        italian: 'Posso avere un posto finestrino, per favore?',
        meaning: 'Vorrei sedermi vicino al finestrino, se possibile.',
        usageNote: 'Sostituisci "finestrino" con "corridoio" per il posto lato corridoio.',
      },
      {
        id: 'it-air-b-4',
        italian: 'Da quale gate parte il mio volo?',
        meaning: 'Qual è l’uscita d’imbarco per il mio aereo?',
        usageNote: 'Utile se lo schermo delle partenze non è chiaro.',
      },
      {
        id: 'it-air-b-5',
        italian: 'Il mio volo è in orario?',
        meaning: 'L’aereo partirà all’ora prevista?',
        usageNote: 'Domanda breve e diretta per il personale dell’aeroporto.',
      },
    ],
    intermediate: [
      {
        id: 'it-air-i-1',
        italian: 'Vorrei imbarcare una valigia in stiva.',
        meaning: 'Devo spedire un bagaglio grande con il volo.',
        usageNote: '"Vorrei" suona sempre cortese e naturale in tutta Italia.',
      },
      {
        id: 'it-air-i-2',
        italian: 'Devo ritirare il bagaglio durante lo scalo?',
        meaning: 'Bisogna prendere la valigia nella città intermedia?',
        usageNote: 'Domanda essenziale quando hai un volo con coincidenza.',
      },
      {
        id: 'it-air-i-3',
        italian: 'Quanto tempo ci vuole a piedi fino al gate 14?',
        meaning: 'Quanti minuti servono per raggiungere l’uscita 14?',
        usageNote: 'Aiuta a gestire bene i tempi in un grande terminal.',
      },
      {
        id: 'it-air-i-4',
        italian: 'Questo bagaglio a mano rispetta le misure?',
        meaning: 'Questo zaino o trolley entra nei limiti consentiti?',
        usageNote: 'Evita costi imprevisti al gate d’imbarco.',
      },
      {
        id: 'it-air-i-5',
        italian: 'Potrebbe avvisarmi quando inizia l’imbarco?',
        meaning: 'Mi può fare un cenno appena si può salire a bordo?',
        usageNote: 'Modo gentile per verificare vicino al banco del gate.',
      },
    ],
    advanced: [
      {
        id: 'it-air-a-1',
        italian: 'Temo di perdere la coincidenza per colpa del ritardo.',
        meaning: 'Ho paura di non riuscire a prendere il prossimo volo.',
        usageNote: '"Temo di" esprime urgenza mantenendo un tono educato.',
      },
      {
        id: 'it-air-a-2',
        italian: 'Sarebbe possibile riprenotarmi sul prossimo volo?',
        meaning: 'Potreste spostare il mio biglietto sull’aereo successivo?',
        usageNote: 'Formula cortese ed efficace allo sportello assistenza.',
      },
      {
        id: 'it-air-a-3',
        italian: 'La mia valigia non è uscita sul nastro bagagli.',
        meaning: 'Il mio bagaglio non è arrivato al ritiro.',
        usageNote: 'Frase chiave all’ufficio bagagli smarriti.',
      },
      {
        id: 'it-air-a-4',
        italian: 'I passeggeri hanno diritto a un rimborso per la notte?',
        meaning: 'La compagnia copre le spese di alloggio per l’attesa?',
        usageNote: 'Domanda chiara e professionale per il servizio clienti.',
      },
      {
        id: 'it-air-a-5',
        italian: 'Potrebbe mettere un’etichetta fragile sulla borsa?',
        meaning: 'Può applicare un adesivo per oggetti delicati?',
        usageNote: 'Utile quando viaggi con vetro o dispositivi elettronici.',
      },
    ],
  },
  work: {
    beginner: [
      {
        id: 'it-work-b-1',
        italian: 'Buongiorno! Com’è andato il tuo fine settimana?',
        meaning: 'Ciao! Hai passato un buon weekend?',
        usageNote: 'Saluto amichevole del lunedì prima di iniziare a lavorare.',
      },
      {
        id: 'it-work-b-2',
        italian: 'Oggi sto lavorando al rapporto.',
        meaning: 'Mi sto occupando del documento oggi.',
        usageNote: 'Sostituisci "rapporto" con "progetto" o "presentazione".',
      },
      {
        id: 'it-work-b-3',
        italian: 'Potresti aiutarmi con questo compito?',
        meaning: 'Mi daresti una mano con questa attività?',
        usageNote: '"Potresti" è gentile e cordiale con i colleghi.',
      },
      {
        id: 'it-work-b-4',
        italian: 'Qual è la scadenza per questo lavoro?',
        meaning: 'Entro quando va consegnato questo progetto?',
        usageNote: 'Domanda chiara per confermare le priorità.',
      },
      {
        id: 'it-work-b-5',
        italian: 'Ti mando il file tra poco.',
        meaning: 'Tra qualche minuto ti invio il documento.',
        usageNote: 'Molto usata nelle chat di gruppo e negli aggiornamenti rapidi.',
      },
    ],
    intermediate: [
      {
        id: 'it-work-i-1',
        italian: 'Aggiornamento rapido: siamo perfettamente in orario.',
        meaning: 'Notizia veloce: rispettiamo tutti i tempi previsti.',
        usageNote: 'Aggiornamento chiaro e positivo per le riunioni di squadra.',
      },
      {
        id: 'it-work-i-2',
        italian: 'Hai un minuto per rivedere questo insieme?',
        meaning: 'Possiamo controllare questo lavoro un attimo in due?',
        usageNote: 'Modo educato prima di interrompere un collega.',
      },
      {
        id: 'it-work-i-3',
        italian: 'Aggiorniamoci domani pomeriggio per fare il punto.',
        meaning: 'Sentiamoci domani per vedere a che punto siamo.',
        usageNote: '"Fare il punto" è un’espressione comunissima in ufficio.',
      },
      {
        id: 'it-work-i-4',
        italian: 'Ho incontrato un piccolo problema con il file del cliente.',
        meaning: 'C’è un lieve imprevisto nel documento del cliente.',
        usageNote: 'Modo calmo e professionale per segnalare un ostacolo.',
      },
      {
        id: 'it-work-i-5',
        italian: 'Terrò tutti aggiornati sui nostri progressi.',
        meaning: 'Vi farò sapere man mano come procede il lavoro.',
        usageNote: 'Dimostra responsabilità e buona comunicazione in squadra.',
      },
    ],
    advanced: [
      {
        id: 'it-work-a-1',
        italian: 'Allineiamoci sulle priorità prima di procedere.',
        meaning: 'Mettiamoci d’accordo sulle cose più importanti prima di partire.',
        usageNote: 'Ottima frase per guidare le riunioni di pianificazione.',
      },
      {
        id: 'it-work-a-2',
        italian: 'Dobbiamo risolvere questo collo di bottiglia subito.',
        meaning: 'Va sbloccato immediatamente questo rallentamento.',
        usageNote: 'Lessico professionale molto usato nella gestione operativa.',
      },
      {
        id: 'it-work-a-3',
        italian: 'Dal punto di vista pratico, questa tempistica è stretta.',
        meaning: 'Concretamente abbiamo poco tempo per finire tutto.',
        usageNote: 'Modo diplomatico per far notare scadenze poco realistiche.',
      },
      {
        id: 'it-work-a-4',
        italian: 'Apprezzo molto il tuo feedback costruttivo sulla bozza.',
        meaning: 'Ti ringrazio per i suggerimenti utili sul documento.',
        usageNote: 'Rafforza la collaborazione positiva nel team.',
      },
      {
        id: 'it-work-a-5',
        italian: 'Riprendiamo il discorso appena abbiamo i dati finali.',
        meaning: 'Ci torniamo sopra non appena escono i numeri definitivi.',
        usageNote: 'Italiano naturale di livello manageriale per il follow-up.',
      },
    ],
  },
  doctor: {
    beginner: [
      {
        id: 'it-doc-b-1',
        italian: 'Ho mal di testa e un po’ di febbre.',
        meaning: 'Sento dolore alla testa e la temperatura alta.',
        usageNote: 'Sostituisci "testa" con "gola" se hai mal di gola.',
      },
      {
        id: 'it-doc-b-2',
        italian: 'È iniziato due giorni fa.',
        meaning: 'I sintomi sono comparsi l’altro ieri.',
        usageNote: 'Dettaglio fondamentale che ogni medico chiede subito.',
      },
      {
        id: 'it-doc-b-3',
        italian: 'Mi fa male proprio qui.',
        meaning: 'Sento dolore esattamente in questo punto.',
        usageNote: 'Semplice e diretto durante la visita medica.',
      },
      {
        id: 'it-doc-b-4',
        italian: 'Quante volte al giorno devo prendere questa medicina?',
        meaning: 'Qual è la dose quotidiana di questo farmaco?',
        usageNote: 'Chiedi sempre conferma sulle dosi prima di uscire.',
      },
      {
        id: 'it-doc-b-5',
        italian: 'Grazie dottore, ora mi sento più sollevato.',
        meaning: 'La ringrazio, adesso sono molto più tranquillo.',
        usageNote: 'Chiusura cordiale alla fine della visita.',
      },
    ],
    intermediate: [
      {
        id: 'it-doc-i-1',
        italian: 'Mi sento davvero giù di corda da tutta la settimana.',
        meaning: 'Sono molto stanco e senza forze da diversi giorni.',
        usageNote: '"Giù di corda" è un’espressione naturale per poca energia.',
      },
      {
        id: 'it-doc-i-2',
        italian: 'Devo prendere queste pillole prima o dopo i pasti?',
        meaning: 'Le compresse vanno prese a stomaco vuoto o pieno?',
        usageNote: 'Domanda pratica per il medico o il farmacista.',
      },
      {
        id: 'it-doc-i-3',
        italian: 'Ci sono effetti collaterali a cui fare attenzione?',
        meaning: 'Questo farmaco può provocare reazioni particolari?',
        usageNote: 'Controllo importante prima di iniziare una nuova cura.',
      },
      {
        id: 'it-doc-i-4',
        italian: 'Sono allergico alla penicillina.',
        meaning: 'Ho un’allergia a questo antibiotico.',
        usageNote: 'Sostituisci "penicillina" con qualsiasi altra tua allergia.',
      },
      {
        id: 'it-doc-i-5',
        italian: 'Tra quanto tempo dovrei iniziare a stare meglio?',
        meaning: 'Dopo quanti giorni vedrò un miglioramento?',
        usageNote: 'Utile per capire quando tornare se i sintomi restano.',
      },
    ],
    advanced: [
      {
        id: 'it-doc-a-1',
        italian: 'Il fastidio tende a peggiorare durante la notte.',
        meaning: 'Il dolore diventa più intenso nelle ore notturne.',
        usageNote: 'Formulazione precisa per descrivere sintomi ricorrenti.',
      },
      {
        id: 'it-doc-a-2',
        italian: 'Potrebbe essere legato allo stress o a un’allergia stagionale?',
        meaning: 'La causa può dipendere da tensione o pollini?',
        usageNote: 'Utile per aiutare a individuare l’origine del disturbo.',
      },
      {
        id: 'it-doc-a-3',
        italian: 'Preferirei evitare farmaci che causano sonnolenza di giorno.',
        meaning: 'Vorrei medicine che non mi facciano venire sonno.',
        usageNote: 'Indispensabile se devi guidare o lavorare durante la cura.',
      },
      {
        id: 'it-doc-a-4',
        italian: 'Mi serve un’impegnativa per vedere uno specialista?',
        meaning: 'Serve la ricetta del medico di base per la visita?',
        usageNote: 'Termine sanitario standard in Italia ("impegnativa").',
      },
      {
        id: 'it-doc-a-5',
        italian: 'Quali segnali indicano che devo tornare per un controllo?',
        meaning: 'In quali casi è meglio fare una seconda visita?',
        usageNote: 'Comunicazione chiara e attenta alla propria salute.',
      },
    ],
  },
  meeting: {
    beginner: [
      {
        id: 'it-meet-b-1',
        italian: 'Piacere di conoscerti! Mi chiamo Sam.',
        meaning: 'Molto lieto! Il mio nome è Sam.',
        usageNote: 'Presentazione classica e cordiale quando incontri qualcuno.',
      },
      {
        id: 'it-meet-b-2',
        italian: 'Di dove sei?',
        meaning: 'Da quale città o paese vieni?',
        usageNote: 'Modo facilissimo per iniziare a parlare con persone nuove.',
      },
      {
        id: 'it-meet-b-3',
        italian: 'Che cosa ti piace fare nel tempo libero?',
        meaning: 'Quali sono i tuoi passatempi preferiti?',
        usageNote: 'Domanda amichevole per scoprire gli interessi dell’altro.',
      },
      {
        id: 'it-meet-b-4',
        italian: 'Abiti qui vicino?',
        meaning: 'Vivi in questa zona?',
        usageNote: 'Semplice e spontanea mentre chiacchieri al bar o a un evento.',
      },
      {
        id: 'it-meet-b-5',
        italian: 'È stato un piacere parlare con te!',
        meaning: 'Mi ha fatto molto piacere fare questa chiacchierata!',
        usageNote: 'Lascia un’ottima impressione al momento dei saluti.',
      },
    ],
    intermediate: [
      {
        id: 'it-meet-i-1',
        italian: 'Come conosci gli altri qui presenti?',
        meaning: 'In che modo hai incontrato le persone di questo gruppo?',
        usageNote: 'Uno dei migliori modi per rompere il ghiaccio alle feste.',
      },
      {
        id: 'it-meet-i-2',
        italian: 'Mi sono trasferito qui solo da qualche mese.',
        meaning: 'Vivo in questa città da poco tempo.',
        usageNote: 'Invita naturalmente l’altra persona a darti consigli locali.',
      },
      {
        id: 'it-meet-i-3',
        italian: 'Conosci qualche buon ristorante in questa zona?',
        meaning: 'Sai consigliarmi un bel posto dove mangiare qui vicino?',
        usageNote: 'In Italia tutti amano parlare di buon cibo e locali.',
      },
      {
        id: 'it-meet-i-4',
        italian: 'Fantastico! Come ti sei appassionato a questo?',
        meaning: 'Che bello! Quando hai iniziato a interessartene?',
        usageNote: 'Mostra sincera curiosità verso le passioni dell’altro.',
      },
      {
        id: 'it-meet-i-5',
        italian: 'Dobbiamo assolutamente restare in contatto!',
        meaning: 'Sentiamoci ancora presto!',
        usageNote: 'Saluto caldo e spontaneo dopo una bella conversazione.',
      },
    ],
    advanced: [
      {
        id: 'it-meet-a-1',
        italian: 'Qual è stato il momento migliore della tua settimana finora?',
        meaning: 'Cosa ti è piaciuto di più in questi giorni?',
        usageNote: 'Apre conversazioni molto più ricche del solito "Come stai?".',
      },
      {
        id: 'it-meet-a-2',
        italian: 'Sto cercando di allargare il mio giro e conoscere nuove persone.',
        meaning: 'Mi fa piacere fare nuove conoscenze e amicizie.',
        usageNote: 'Modo autentico per spiegare perché partecipi a un incontro.',
      },
      {
        id: 'it-meet-a-3',
        italian: 'Hai una prospettiva davvero interessante su questo tema.',
        meaning: 'Il tuo punto di vista è molto originale.',
        usageNote: 'Fa sentire l’altra persona davvero ascoltata.',
      },
      {
        id: 'it-meet-a-4',
        italian: 'Sembra che abbiamo parecchie cose in comune.',
        meaning: 'Abbiamo davvero tanti interessi simili.',
        usageNote: 'Approfondiva con naturalezza la sintonia con chi hai appena conosciuto.',
      },
      {
        id: 'it-meet-a-5',
        italian: 'Prendiamoci un caffè la settimana prossima se sei libero.',
        meaning: 'Vediamoci per un caffè tra qualche giorno se hai tempo.',
        usageNote: '"Prendiamoci un caffè" è italiano spontaneo e amichevole.',
      },
    ],
  },
};
