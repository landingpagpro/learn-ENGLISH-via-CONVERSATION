import { KeyPhrase, LevelMeta, ProficiencyLevel, ScenarioId, ScenarioMeta } from '../types';
import appLogo from '../assets/images/impara_italiano_parlando_logo_1795248459916.jpg';

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
    description: 'Italiano naturale quotidiano',
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
    title: "Impara l'Italiano Parlando",
    subtitle: 'Dialogo libero e pratica quotidiana',
    roleDescription: 'Fai pratica con conversazioni naturali in italiano su qualsiasi argomento.',
    accentBg: 'bg-blue-50',
    accentText: 'text-[#1E40AF]',
  },
  {
    id: 'airport',
    title: 'In Aeroporto',
    subtitle: 'Check-in, controlli e imbarco',
    roleDescription: 'Esercitati al banco check-in, ai controlli di sicurezza e al gate in italiano.',
    accentBg: 'bg-sky-50',
    accentText: 'text-sky-700',
  },
  {
    id: 'work',
    title: 'Al Lavoro',
    subtitle: 'Riunioni e aggiornamenti',
    roleDescription: 'Parla di progetti, scadenze e lavoro di squadra con colleghi italiani.',
    accentBg: 'bg-indigo-50',
    accentText: 'text-indigo-700',
  },
  {
    id: 'doctor',
    title: 'Dal Medico',
    subtitle: 'Sintomi, visite e ricette',
    roleDescription: 'Spiega come ti senti, chiedi informazioni sulle medicine e segui i consigli del medico.',
    accentBg: 'bg-rose-50',
    accentText: 'text-rose-700',
  },
  {
    id: 'meeting',
    title: 'Conoscere Nuove Persone',
    subtitle: 'Presentazioni, hobby e piani',
    roleDescription: 'Rompi il ghiaccio, parla di te e fai nuove amicizie in italiano.',
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
        meaning: 'Stai passando una bella giornata?',
        usageNote: 'Un modo semplice e amichevole per iniziare una conversazione.',
      },
      {
        id: 'it-conv-b-2',
        italian: 'Puoi ripetere, per favore?',
        meaning: 'Puoi dirlo di nuovo?',
        usageNote: 'Molto utile quando qualcuno parla un po’ troppo veloce.',
      },
      {
        id: 'it-conv-b-3',
        italian: 'Che cosa significa questa parola?',
        meaning: 'Puoi spiegarmi questa parola?',
        usageNote: 'Ottima domanda per imparare nuove parole italiane ogni giorno.',
      },
      {
        id: 'it-conv-b-4',
        italian: 'Mi piace parlare di sport e viaggi.',
        meaning: 'Amo chiacchierare di sport e vacanze.',
        usageNote: 'Cambia "sport" e "viaggi" con qualsiasi tuo interesse.',
      },
      {
        id: 'it-conv-b-5',
        italian: 'Sembra davvero interessante!',
        meaning: 'È una cosa molto bella e curiosa!',
        usageNote: 'Reazione naturale per mantenere vivo il dialogo.',
      },
    ],
    intermediate: [
      {
        id: 'it-conv-i-1',
        italian: 'Cosa hai fatto di bello ultimamente?',
        meaning: 'Come hai passato il tempo negli ultimi giorni?',
        usageNote: 'Un saluto rilassato e naturale tra amici.',
      },
      {
        id: 'it-conv-i-2',
        italian: 'Sinceramente, sono completamente d’accordo con te.',
        meaning: 'Onestamente, la penso proprio come te.',
        usageNote: '"Sinceramente" rende la tua opinione calda e spontanea.',
      },
      {
        id: 'it-conv-i-3',
        italian: 'Questo mi ricorda una storia simile.',
        meaning: 'Mi fa venire in mente un episodio uguale al tuo.',
        usageNote: 'Passaggio elegante prima di raccontare un tuo esempio.',
      },
      {
        id: 'it-conv-i-4',
        italian: 'Come passi di solito il fine settimana?',
        meaning: 'Cosa fai normalmente il sabato e la domenica?',
        usageNote: 'Ottima domanda aperta per continuare a parlare.',
      },
      {
        id: 'it-conv-i-5',
        italian: 'Capisco benissimo il tuo punto di vista.',
        meaning: 'Comprendo perfettamente quello che intendi.',
        usageNote: 'Espressione cortese che mostra attenzione.',
      },
    ],
    advanced: [
      {
        id: 'it-conv-a-1',
        italian: 'Guardando il quadro generale, ha perfettamente senso.',
        meaning: 'Considerando tutto nel complesso, è molto logico.',
        usageNote: 'Espressione naturale per discussioni più approfondite.',
      },
      {
        id: 'it-conv-a-2',
        italian: 'Hai proprio centrato il punto!',
        meaning: 'Hai colto esattamente il nocciolo della questione!',
        usageNote: 'Modo di dire classico quando qualcuno ha pienamente ragione.',
      },
      {
        id: 'it-conv-a-3',
        italian: 'Ho sentimenti contrastanti su questa idea.',
        meaning: 'Vedo sia lati positivi sia dubbi in questa proposta.',
        usageNote: 'Modo equilibrato per esprimere un parere sfumato.',
      },
      {
        id: 'it-conv-a-4',
        italian: 'A dire il vero, entrambe le parti hanno ragione.',
        meaning: 'Valutando bene, tutte e due le opinioni sono valide.',
        usageNote: 'Suona diplomatico e riflessivo durante un confronto.',
      },
      {
        id: 'it-conv-a-5',
        italian: 'Va da sé che la pratica costante dà ottimi frutti.',
        meaning: 'È evidente che esercitarsi con costanza porta risultati.',
        usageNote: 'Formula efficace per introdurre un concetto chiaro.',
      },
    ],
  },
  airport: {
    beginner: [
      {
        id: 'it-air-b-1',
        italian: 'Dov’è il banco del check-in?',
        meaning: 'Dove vado per registrare il mio volo?',
        usageNote: 'Usala appena entri nell’area partenze.',
      },
      {
        id: 'it-air-b-2',
        italian: 'Ecco il mio passaporto e il biglietto.',
        meaning: 'Prego, questi sono i miei documenti di viaggio.',
        usageNote: 'Frase semplice e gentile al check-in o all’imbarco.',
      },
      {
        id: 'it-air-b-3',
        italian: 'Posso avere un posto finestrino, per favore?',
        meaning: 'Vorrei sedermi vicino al finestrino.',
        usageNote: 'Sostituisci "finestrino" con "corridoio" se preferisci il lato interno.',
      },
      {
        id: 'it-air-b-4',
        italian: 'Da quale gate parte il mio volo?',
        meaning: 'Qual è il numero dell’uscita d’imbarco?',
        usageNote: 'Utile se lo schermo delle partenze è lontano.',
      },
      {
        id: 'it-air-b-5',
        italian: 'Il mio volo è in orario?',
        meaning: 'L’aereo parte all’ora prevista?',
        usageNote: 'Domanda breve e chiara per il personale aeroportuale.',
      },
    ],
    intermediate: [
      {
        id: 'it-air-i-1',
        italian: 'Vorrei imbarcare una valigia in stiva.',
        meaning: 'Devo consegnare un bagaglio grande al check-in.',
        usageNote: '"Vorrei" suona sempre cortese e naturale.',
      },
      {
        id: 'it-air-i-2',
        italian: 'Devo ritirare il bagaglio durante lo scalo?',
        meaning: 'Devo prendere la valigia all’aeroporto di coincidenza?',
        usageNote: 'Domanda fondamentale se il viaggio prevede uno scalo.',
      },
      {
        id: 'it-air-i-3',
        italian: 'Quanto tempo ci vuole a piedi fino al gate 14?',
        meaning: 'Quanti minuti servono per arrivare a quell’uscita?',
        usageNote: 'Ti aiuta a gestire bene i tempi nei terminal grandi.',
      },
      {
        id: 'it-air-i-4',
        italian: 'Questo bagaglio a mano rispetta le misure?',
        meaning: 'La mia borsa entra nelle dimensioni consentite in cabina?',
        usageNote: 'Evita costi extra inattesi prima dell’imbarco.',
      },
      {
        id: 'it-air-i-5',
        italian: 'Può avvisarmi quando inizia l’imbarco?',
        meaning: 'Mi dice appena i passeggeri possono salire a bordo?',
        usageNote: 'Modo gentile per chiedere informazioni al gate.',
      },
    ],
    advanced: [
      {
        id: 'it-air-a-1',
        italian: 'Temo di perdere la coincidenza a causa del ritardo.',
        meaning: 'Rischio di non arrivare in tempo al volo successivo.',
        usageNote: '"Temo di..." esprime urgenza restando educati.',
      },
      {
        id: 'it-air-a-2',
        italian: 'Sarebbe possibile riproteggermi sul prossimo volo?',
        meaning: 'Può spostare il mio biglietto sul volo seguente?',
        usageNote: 'Formula precisa ed efficace all’assistenza clienti.',
      },
      {
        id: 'it-air-a-3',
        italian: 'La mia valigia non è uscita sul nastro bagagli.',
        meaning: 'Il mio bagaglio da stiva non è arrivato.',
        usageNote: 'Frase chiave allo sportello bagagli smarriti.',
      },
      {
        id: 'it-air-a-4',
        italian: 'I passeggeri hanno diritto a un voucher per l’hotel?',
        meaning: 'La compagnia copre la notte in albergo per il ritardo?',
        usageNote: 'Linguaggio chiaro e sicuro con l’assistenza in aeroporto.',
      },
      {
        id: 'it-air-a-5',
        italian: 'Può mettere un’etichetta "fragile" su questa borsa?',
        meaning: 'Segnali che questo bagaglio contiene oggetti delicati.',
        usageNote: 'Utile quando viaggi con vetro o dispositivi elettronici.',
      },
    ],
  },
  work: {
    beginner: [
      {
        id: 'it-work-b-1',
        italian: 'Buongiorno! Com’è andato il fine settimana?',
        meaning: 'Ciao! Hai passato un bel weekend?',
        usageNote: 'Saluto cordiale il lunedì mattina prima di iniziare.',
      },
      {
        id: 'it-work-b-2',
        italian: 'Oggi sto lavorando al rapporto.',
        meaning: 'Il mio compito di oggi è preparare questo documento.',
        usageNote: 'Sostituisci "rapporto" con "progetto" o "presentazione".',
      },
      {
        id: 'it-work-b-3',
        italian: 'Puoi aiutarmi con questo compito?',
        meaning: 'Mi puoi dare una mano con questo lavoro?',
        usageNote: '"Puoi..." è diretto e amichevole tra colleghi.',
      },
      {
        id: 'it-work-b-4',
        italian: 'Quando è la scadenza di questo progetto?',
        meaning: 'Entro quale giorno va finito questo lavoro?',
        usageNote: 'Domanda chiara per confermare le priorità del team.',
      },
      {
        id: 'it-work-b-5',
        italian: 'Ti mando il file tra poco.',
        meaning: 'Ti invio il documento via email o chat fra qualche minuto.',
        usageNote: 'Molto usata nelle chat di lavoro quotidiane.',
      },
    ],
    intermediate: [
      {
        id: 'it-work-i-1',
        italian: 'Aggiornamento veloce: siamo perfettamente nei tempi.',
        meaning: 'Breve verifica: tutto procede secondo il programma.',
        usageNote: 'Aggiornamento chiaro e positivo nelle riunioni.',
      },
      {
        id: 'it-work-i-2',
        italian: 'Hai un minuto per rivedere questo insieme?',
        meaning: 'Possiamo controllare velocemente questo lavoro in due?',
        usageNote: 'Apertura cortese prima di chiedere un confronto.',
      },
      {
        id: 'it-work-i-3',
        italian: 'Facciamo il punto domani pomeriggio.',
        meaning: 'Sentiamoci domani per aggiornarci.',
        usageNote: '"Fare il punto" è comunissimo negli uffici italiani.',
      },
      {
        id: 'it-work-i-4',
        italian: 'Ho riscontrato un piccolo problema nel file del cliente.',
        meaning: 'Ho notato una difficoltà nel documento del cliente.',
        usageNote: 'Modo calmo e professionale per segnalare un intoppo.',
      },
      {
        id: 'it-work-i-5',
        italian: 'Terrò tutti aggiornati sui nostri progressi.',
        meaning: 'Condividerò man mano le novità sul lavoro.',
        usageNote: 'Dimostra responsabilità e buon lavoro di squadra.',
      },
    ],
    advanced: [
      {
        id: 'it-work-a-1',
        italian: 'Allineiamoci sulle priorità principali prima di procedere.',
        meaning: 'Mettiamoci d’accordo sugli obiettivi chiave prima di partire.',
        usageNote: 'Ottima frase per guidare una riunione di pianificazione.',
      },
      {
        id: 'it-work-a-2',
        italian: 'Dobbiamo risolvere subito questo collo di bottiglia.',
        meaning: 'Serve sbloccare immediatamente questo rallentamento.',
        usageNote: 'Espressione molto usata nella gestione dei progetti.',
      },
      {
        id: 'it-work-a-3',
        italian: 'Realisticamente, questa tempistica mi sembra piuttosto stretta.',
        meaning: 'Nei fatti abbiamo poco tempo per chiudere entro quella data.',
        usageNote: 'Modo diplomatico per negoziare una scadenza difficile.',
      },
      {
        id: 'it-work-a-4',
        italian: 'Apprezzo molto il tuo riscontro costruttivo sulla bozza.',
        meaning: 'Grazie per i consigli utili sul mio documento.',
        usageNote: 'Crea collaborazione positiva con i colleghi.',
      },
      {
        id: 'it-work-a-5',
        italian: 'Torniamoci su appena avremo i dati definitivi.',
        meaning: 'Riprendiamo il discorso quando i numeri saranno pronti.',
        usageNote: 'Italiano professionale naturale per chiudere un tema.',
      },
    ],
  },
  doctor: {
    beginner: [
      {
        id: 'it-doc-b-1',
        italian: 'Ho mal di testa e un po’ di febbre.',
        meaning: 'Mi fa male la testa e ho la temperatura un po’ alta.',
        usageNote: 'Puoi cambiare "mal di testa" con "mal di gola" o "tosse".',
      },
      {
        id: 'it-doc-b-2',
        italian: 'È iniziato due giorni fa.',
        meaning: 'Ho cominciato a stare male l’altro ieri.',
        usageNote: 'Una delle prime informazioni che chiede ogni medico.',
      },
      {
        id: 'it-doc-b-3',
        italian: 'Mi fa male proprio qui.',
        meaning: 'Sento dolore in questo punto preciso.',
        usageNote: 'Semplice e chiara durante la visita medica.',
      },
      {
        id: 'it-doc-b-4',
        italian: 'Quante volte al giorno devo prendere questa medicina?',
        meaning: 'Qual è la dose giornaliera di questo farmaco?',
        usageNote: 'Controlla sempre bene gli orari prima di uscire.',
      },
      {
        id: 'it-doc-b-5',
        italian: 'Grazie, dottore. Ora sono molto più tranquillo.',
        meaning: 'Grazie per l’aiuto, mi sento sollevato.',
        usageNote: 'Chiusura educata alla fine della visita.',
      },
    ],
    intermediate: [
      {
        id: 'it-doc-i-1',
        italian: 'Mi sento molto giù di forze da tutta la settimana.',
        meaning: 'Sono molto stanco e senza energie da diversi giorni.',
        usageNote: '"Giù di forze" è un’espressione italiana naturale.',
      },
      {
        id: 'it-doc-i-2',
        italian: 'Devo prendere queste pastiglie a stomaco pieno o vuoto?',
        meaning: 'Le prendo prima o dopo i pasti?',
        usageNote: 'Domanda pratica molto utile dal medico o in farmacia.',
      },
      {
        id: 'it-doc-i-3',
        italian: 'Ci sono effetti collaterali a cui fare attenzione?',
        meaning: 'Questo farmaco può dare reazioni particolari?',
        usageNote: 'Verifica importante prima di iniziare una cura.',
      },
      {
        id: 'it-doc-i-4',
        italian: 'Sono allergico alla penicillina.',
        meaning: 'Il mio corpo reagisce male a quell’antibiotico.',
        usageNote: 'Sostituisci "penicillina" con qualsiasi tua allergia.',
      },
      {
        id: 'it-doc-i-5',
        italian: 'Tra quanti giorni dovrei iniziare a stare meglio?',
        meaning: 'Quanto tempo serve perché passino i sintomi?',
        usageNote: 'Aiuta a sapere quando fare un controllo.',
      },
    ],
    advanced: [
      {
        id: 'it-doc-a-1',
        italian: 'Il fastidio tende ad accentuarsi verso sera.',
        meaning: 'Il dolore di solito diventa più forte a fine giornata.',
        usageNote: 'Formula precisa per descrivere sintomi ricorrenti.',
      },
      {
        id: 'it-doc-a-2',
        italian: 'Potrebbe essere scatenato dallo stress o da un’allergia stagionale?',
        meaning: 'La causa può essere la stanchezza o il polline?',
        usageNote: 'Aiuta a ragionare sulle possibili cause con il medico.',
      },
      {
        id: 'it-doc-a-3',
        italian: 'Preferirei un farmaco che non provochi sonnolenza diurna.',
        meaning: 'Mi prescriva qualcosa che non faccia venire sonno di giorno.',
        usageNote: 'Essenziale se devi guidare o lavorare durante la cura.',
      },
      {
        id: 'it-doc-a-4',
        italian: 'Serve un’impegnativa per una visita specialistica?',
        meaning: 'Occorre la ricetta del medico per prenotare lo specialista?',
        usageNote: 'Termine standard ("impegnativa") nella sanità italiana.',
      },
      {
        id: 'it-doc-a-5',
        italian: 'Quali segnali indicano che dovrei tornare per un controllo?',
        meaning: 'Con quali sintomi è meglio rifare una visita?',
        usageNote: 'Comunicazione chiara e attenta sulla propria salute.',
      },
    ],
  },
  meeting: {
    beginner: [
      {
        id: 'it-meet-b-1',
        italian: 'Piacere di conoscerti! Mi chiamo Marco.',
        meaning: 'Ciao! Sono contento di incontrarti.',
        usageNote: 'Modo classico e cordiale per presentarsi.',
      },
      {
        id: 'it-meet-b-2',
        italian: 'Di dove sei?',
        meaning: 'Da quale città o paese vieni?',
        usageNote: 'Una delle domande più facili per iniziare a chiacchierare.',
      },
      {
        id: 'it-meet-b-3',
        italian: 'Cosa ti piace fare nel tempo libero?',
        meaning: 'Quali sono i tuoi hobby preferiti?',
        usageNote: 'Domanda aperta per scoprire gli interessi dell’altro.',
      },
      {
        id: 'it-meet-b-4',
        italian: 'Abiti qui vicino?',
        meaning: 'Vivi in questo quartiere o in questa zona?',
        usageNote: 'Spontanea e amichevole al bar o a un evento.',
      },
      {
        id: 'it-meet-b-5',
        italian: 'È stato davvero un piacere parlare con te!',
        meaning: 'Mi ha fatto molto piacere fare due chiacchiere!',
        usageNote: 'Lascia un’ottima impressione quando ti saluti.',
      },
    ],
    intermediate: [
      {
        id: 'it-meet-i-1',
        italian: 'Come conosci gli altri qui presenti?',
        meaning: 'Come hai incontrato le persone di questo gruppo?',
        usageNote: 'Ottima frase per rompere il ghiaccio a una festa.',
      },
      {
        id: 'it-meet-i-2',
        italian: 'Mi sono trasferito in questa città da pochi mesi.',
        meaning: 'Vivo qui da poco tempo.',
        usageNote: 'Invita naturalmente gli altri a darti consigli locali.',
      },
      {
        id: 'it-meet-i-3',
        italian: 'Conosci qualche buon ristorante qui in zona?',
        meaning: 'Sai consigliarmi un bel posto dove mangiare vicino?',
        usageNote: 'Quasi tutti adorano consigliare i loro locali preferiti.',
      },
      {
        id: 'it-meet-i-4',
        italian: 'Fantastico! Come ti sei appassionato a questo?',
        meaning: 'Bellissimo! Com’è nata questa tua passione?',
        usageNote: 'Mostra curiosità sincera verso chi hai davanti.',
      },
      {
        id: 'it-meet-i-5',
        italian: 'Dobbiamo assolutamente restare in contatto!',
        meaning: 'Continuiamo a scriverci o rivediamoci presto!',
        usageNote: 'Chiusura calorosa dopo una bella chiacchierata.',
      },
    ],
    advanced: [
      {
        id: 'it-meet-a-1',
        italian: 'Qual è stato il momento più bello della tua settimana finora?',
        meaning: 'Che cosa ti ha reso più felice in questi giorni?',
        usageNote: 'Fa nascere racconti molto più veri del classico "Come stai?".',
      },
      {
        id: 'it-meet-a-2',
        italian: 'Sto cercando di allargare il giro e conoscere persone del posto.',
        meaning: 'Voglio fare nuove amicizie qui in città.',
        usageNote: 'Spiegazione sincera e spontanea a un incontro sociale.',
      },
      {
        id: 'it-meet-a-3',
        italian: 'È davvero un punto di vista interessante.',
        meaning: 'Hai un modo originale e profondo di vedere la cosa.',
        usageNote: 'Fa sentire l’altra persona davvero ascoltata.',
      },
      {
        id: 'it-meet-a-4',
        italian: 'Sembra proprio che abbiamo parecchie cose in comune.',
        meaning: 'Abbiamo molti interessi e gusti simili.',
        usageNote: 'Rafforza la sintonia con chi hai appena conosciuto.',
      },
      {
        id: 'it-meet-a-5',
        italian: 'Prendiamoci un caffè la settimana prossima se sei libero.',
        meaning: 'Vediamoci per un caffè appena hai tempo.',
        usageNote: 'Invito naturale e tipicamente italiano.',
      },
    ],
  },
};
