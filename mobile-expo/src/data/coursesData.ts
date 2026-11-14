export type CourseId = 'bible' | 'coran' | 'decouverte';
export type Level = 'debutant' | 'intermediaire' | 'avance';
export type GoalMinutes = 5 | 10 | 15;

export type ChoiceQuestion = {
  id: string;
  type: 'choice';
  prompt: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  source: string;
};

export type TrueFalseQuestion = {
  id: string;
  type: 'true-false';
  prompt: string;
  answer: boolean;
  explanation: string;
  source: string;
};

export type WordBankQuestion = {
  id: string;
  type: 'word-bank';
  prompt: string;
  answerWords: string[];
  bank: { id: string; text: string }[];
  explanation: string;
  source: string;
};

export type MatchingQuestion = {
  id: string;
  type: 'matching';
  prompt: string;
  pairs: { id: string; left: string; right: string }[];
  explanation: string;
  source: string;
};

export type Question = ChoiceQuestion | TrueFalseQuestion | WordBankQuestion | MatchingQuestion;

export type Lesson = {
  id: string;
  course: Exclude<CourseId, 'decouverte'>;
  title: string;
  subtitle: string;
  minutes: number;
  module: string;
  questions: Question[];
};

export type Profile = {
  course: CourseId;
  level: Level;
  dailyGoal: GoalMinutes;
  reminderEnabled: boolean;
  reminderHour: number;
  reminderMinute: number;
  hideStreak: boolean;
};

const bibleLessons: Lesson[] = [
  {
    id: 'bible-reperes',
    course: 'bible',
    title: 'Se repérer dans la Bible',
    subtitle: 'Livres, genres et organisation',
    minutes: 5,
    module: 'Premiers repères',
    questions: [
      {
        id: 'bible-reperes-q1',
        type: 'choice',
        prompt: 'Dans la Bible, comment appelle-t-on les grandes divisions qui rassemblent plusieurs chapitres ?',
        options: ['Des livres', 'Des saisons', 'Des recueils audio'],
        answerIndex: 0,
        explanation: 'La Bible est composée de livres, eux-mêmes divisés en chapitres et en versets.',
        source: 'Repère général de lecture biblique.',
      },
      {
        id: 'bible-reperes-q0',
        type: 'true-false',
        prompt: 'Les chapitres et les versets sont des repères de lecture ajoutés au texte, et non le nom original de chaque livre.',
        answer: true,
        explanation: 'Les divisions en chapitres et versets servent à se repérer ; elles ne font pas partie du titre original de chaque livre.',
        source: 'Repère général de lecture biblique.',
      },
      {
        id: 'bible-reperes-q2',
        type: 'word-bank',
        prompt: 'Replace les mots pour compléter ce repère pédagogique :',
        answerWords: ['La', 'Bible', 'réunit', 'plusieurs', 'livres'],
        bank: [
          { id: 'bq2-1', text: 'livres' },
          { id: 'bq2-2', text: 'La' },
          { id: 'bq2-3', text: 'plusieurs' },
          { id: 'bq2-4', text: 'Bible' },
          { id: 'bq2-5', text: 'réunit' },
          { id: 'bq2-6', text: 'chapitres' },
        ],
        explanation: 'Cette phrase décrit l’organisation de l’ensemble ; ce n’est pas une citation biblique.',
        source: 'Repère général de lecture biblique — formulation pédagogique.',
      },
      {
        id: 'bible-reperes-q3',
        type: 'matching',
        prompt: 'Associe chaque terme à son rôle dans le repérage d’un passage.',
        pairs: [
          { id: 'livre', left: 'Livre', right: 'Grande partie du recueil' },
          { id: 'chapitre', left: 'Chapitre', right: 'Section d’un livre' },
          { id: 'verset', left: 'Verset', right: 'Repère court à l’intérieur d’un chapitre' },
        ],
        explanation: 'Une référence biblique combine généralement le nom d’un livre, un chapitre et un ou plusieurs versets.',
        source: 'Repère général de lecture biblique.',
      },
    ],
  },
  {
    id: 'bible-creation',
    course: 'bible',
    title: 'Le récit de la création',
    subtitle: 'Lire les premiers chapitres de la Genèse',
    minutes: 6,
    module: 'Premiers repères',
    questions: [
      {
        id: 'bible-creation-q1',
        type: 'choice',
        prompt: 'Quel livre biblique s’ouvre sur le récit de la création ?',
        options: ['Genèse', 'Psaumes', 'Actes'],
        answerIndex: 0,
        explanation: 'La Genèse est le premier livre de la Bible dans les canons juif et chrétien.',
        source: 'Genèse 1–2 — synthèse pédagogique, non citation.',
      },
      {
        id: 'bible-creation-q2',
        type: 'word-bank',
        prompt: 'Complète ce résumé de lecture (il ne s’agit pas d’un verset) :',
        answerWords: ['La', 'Genèse', 'présente', 'des', 'récits', 'des', 'origines'],
        bank: [
          { id: 'bc2-1', text: 'des' },
          { id: 'bc2-2', text: 'La' },
          { id: 'bc2-3', text: 'origines' },
          { id: 'bc2-4', text: 'présente' },
          { id: 'bc2-5', text: 'Genèse' },
          { id: 'bc2-6', text: 'récits' },
          { id: 'bc2-7', text: 'des' },
          { id: 'bc2-8', text: 'chroniques' },
        ],
        explanation: 'Le début de la Genèse rassemble des récits des origines, interprétés selon différentes traditions.',
        source: 'Genèse 1–2 — synthèse pédagogique, non citation.',
      },
      {
        id: 'bible-creation-q3',
        type: 'matching',
        prompt: 'Associe ces éléments de lecture à leur description.',
        pairs: [
          { id: 'ref', left: 'Genèse 1', right: 'Premier chapitre du livre de la Genèse' },
          { id: 'lecture', left: 'Récit des origines', right: 'Désignation pédagogique d’un thème' },
          { id: 'note', left: 'Note de lecture', right: 'Explication éditoriale, distincte du texte' },
        ],
        explanation: 'La référence indique où lire ; une note pédagogique est un commentaire, pas le texte biblique.',
        source: 'Genèse 1–2 — repères de lecture.',
      },
    ],
  },
  {
    id: 'bible-abraham',
    course: 'bible',
    title: 'Abraham et le départ',
    subtitle: 'Découvrir un récit de la Genèse',
    minutes: 6,
    module: 'Premiers repères',
    questions: [
      {
        id: 'bible-abraham-q1',
        type: 'choice',
        prompt: 'Dans quel livre se trouvent les récits bibliques consacrés à Abraham ?',
        options: ['Genèse', 'Lévitique', 'Apocalypse'],
        answerIndex: 0,
        explanation: 'Les récits d’Abraham se trouvent notamment dans la seconde moitié de la Genèse.',
        source: 'Genèse 12–25 — repère de lecture.',
      },
      {
        id: 'bible-abraham-q2',
        type: 'word-bank',
        prompt: 'Complète ce repère (formulation pédagogique, pas une citation) :',
        answerWords: ['Abraham', 'est', 'une', 'figure', 'du', 'récit', 'de', 'la', 'Genèse'],
        bank: [
          { id: 'ba2-1', text: 'récit' },
          { id: 'ba2-2', text: 'Abraham' },
          { id: 'ba2-3', text: 'est' },
          { id: 'ba2-4', text: 'de' },
          { id: 'ba2-5', text: 'une' },
          { id: 'ba2-6', text: 'la' },
          { id: 'ba2-7', text: 'figure' },
          { id: 'ba2-8', text: 'Genèse' },
          { id: 'ba2-9', text: 'du' },
        ],
        explanation: 'Cette phrase situe le personnage dans le livre ; elle ne reproduit pas le texte sacré.',
        source: 'Genèse 12–25 — synthèse pédagogique.',
      },
      {
        id: 'bible-abraham-q3',
        type: 'matching',
        prompt: 'Associe chaque repère au passage concerné.',
        pairs: [
          { id: 'depart', left: 'Départ d’Abraham', right: 'Genèse 12' },
          { id: 'alliance', left: 'Récit d’alliance', right: 'Genèse 15' },
          { id: 'sarah', left: 'Récits autour de Sarah', right: 'Genèse 18' },
        ],
        explanation: 'Les chapitres indiqués sont des repères pour retrouver les récits ; consultez le texte et les notes de votre édition.',
        source: 'Genèse 12, 15 et 18 — repères de lecture.',
      },
    ],
  },
  {
    id: 'bible-moise',
    course: 'bible',
    title: 'Moïse et l’Exode',
    subtitle: 'Suivre un récit de libération',
    minutes: 7,
    module: 'Premiers repères',
    questions: [
      {
        id: 'bible-moise-q1',
        type: 'choice',
        prompt: 'Quel livre raconte l’appel de Moïse et la sortie d’Égypte ?',
        options: ['Exode', 'Ruth', 'Job'],
        answerIndex: 0,
        explanation: 'L’Exode présente ces récits dans ses premiers chapitres.',
        source: 'Exode 3 et 12–14 — repères de lecture.',
      },
      {
        id: 'bible-moise-q2',
        type: 'word-bank',
        prompt: 'Replace les repères chronologiques du récit, sans reprendre ses paroles :',
        answerWords: ['Appel', 'de', 'Moïse', 'puis', 'départ', 'd’Égypte'],
        bank: [
          { id: 'bm2-1', text: 'départ' },
          { id: 'bm2-2', text: 'Moïse' },
          { id: 'bm2-3', text: 'd’Égypte' },
          { id: 'bm2-4', text: 'Appel' },
          { id: 'bm2-5', text: 'puis' },
          { id: 'bm2-6', text: 'de' },
        ],
        explanation: 'Les premiers chapitres de l’Exode racontent l’appel de Moïse, puis la sortie d’Égypte.',
        source: 'Exode 3 et 12–14 — synthèse pédagogique, non citation.',
      },
      {
        id: 'bible-moise-q3',
        type: 'matching',
        prompt: 'Associe chaque référence à son repère de lecture.',
        pairs: [
          { id: 'appel', left: 'Exode 3', right: 'Appel de Moïse' },
          { id: 'paques', left: 'Exode 12', right: 'Récit de la Pâque' },
          { id: 'mer', left: 'Exode 14', right: 'Passage de la mer dans le récit' },
        ],
        explanation: 'Les références facilitent la lecture suivie ; les commentaires peuvent présenter des interprétations différentes.',
        source: 'Exode 3, 12 et 14 — repères de lecture.',
      },
    ],
  },
  {
    id: 'bible-beatitudes',
    course: 'bible',
    title: 'Les Béatitudes',
    subtitle: 'Un enseignement dans l’Évangile selon Matthieu',
    minutes: 7,
    module: 'Premiers repères',
    questions: [
      {
        id: 'bible-beatitudes-q1',
        type: 'choice',
        prompt: 'Dans quel chapitre de Matthieu se trouve le début du passage appelé « les Béatitudes » ?',
        options: ['Matthieu 5', 'Matthieu 18', 'Matthieu 28'],
        answerIndex: 0,
        explanation: 'Le passage commence au chapitre 5, dans le discours sur la montagne.',
        source: 'Matthieu 5, 1–12 — repère de lecture.',
      },
      {
        id: 'bible-beatitudes-q2',
        type: 'word-bank',
        prompt: 'Complète ce repère éditorial (pas une citation du texte) :',
        answerWords: ['Les', 'Béatitudes', 'font', 'partie', 'du', 'discours', 'sur', 'la', 'montagne'],
        bank: [
          { id: 'bb2-1', text: 'discours' },
          { id: 'bb2-2', text: 'Les' },
          { id: 'bb2-3', text: 'montagne' },
          { id: 'bb2-4', text: 'font' },
          { id: 'bb2-5', text: 'partie' },
          { id: 'bb2-6', text: 'du' },
          { id: 'bb2-7', text: 'Béatitudes' },
          { id: 'bb2-8', text: 'sur' },
          { id: 'bb2-9', text: 'la' },
        ],
        explanation: 'Le discours sur la montagne est une appellation courante pour les chapitres 5 à 7 de Matthieu.',
        source: 'Matthieu 5–7 — synthèse pédagogique.',
      },
      {
        id: 'bible-beatitudes-q3',
        type: 'matching',
        prompt: 'Associe la référence au repère correspondant.',
        pairs: [
          { id: 'debut', left: 'Matthieu 5, 1–12', right: 'Passage des Béatitudes' },
          { id: 'sel', left: 'Matthieu 5, 13–16', right: 'Images du sel et de la lumière' },
          { id: 'discours', left: 'Matthieu 5–7', right: 'Discours sur la montagne' },
        ],
        explanation: 'Les références permettent de lire le passage dans son contexte plus large.',
        source: 'Évangile selon Matthieu 5–7 — repères de lecture.',
      },
    ],
  },
];

const quranLessons: Lesson[] = [
  {
    id: 'coran-reperes',
    course: 'coran',
    title: 'Se repérer dans le Coran',
    subtitle: 'Sourates, versets et traductions',
    minutes: 5,
    module: 'Premiers repères',
    questions: [
      {
        id: 'coran-reperes-q1',
        type: 'choice',
        prompt: 'Comment se nomment les chapitres du Coran ?',
        options: ['Les sourates', 'Les épîtres', 'Les psaumes'],
        answerIndex: 0,
        explanation: 'Le Coran est organisé en sourates, elles-mêmes composées de versets.',
        source: 'Repère général de lecture coranique.',
      },
      {
        id: 'coran-reperes-q0',
        type: 'true-false',
        prompt: 'Une traduction française du Coran est identique au texte arabe.',
        answer: false,
        explanation: 'Une traduction rend un sens dans une autre langue ; elle se distingue du texte arabe et doit être identifiée par son édition.',
        source: 'Repère général de lecture coranique.',
      },
      {
        id: 'coran-reperes-q2',
        type: 'word-bank',
        prompt: 'Complète ce repère pédagogique, qui n’est pas une citation :',
        answerWords: ['Le', 'Coran', 'est', 'organisé', 'en', 'sourates'],
        bank: [
          { id: 'cr2-1', text: 'sourates' },
          { id: 'cr2-2', text: 'en' },
          { id: 'cr2-3', text: 'Le' },
          { id: 'cr2-4', text: 'est' },
          { id: 'cr2-5', text: 'Coran' },
          { id: 'cr2-6', text: 'organisé' },
          { id: 'cr2-7', text: 'livres' },
        ],
        explanation: 'Cette formulation décrit la structure du Coran et ne reprend pas un verset.',
        source: 'Repère général de lecture coranique — formulation pédagogique.',
      },
      {
        id: 'coran-reperes-q3',
        type: 'matching',
        prompt: 'Associe chaque terme à sa description.',
        pairs: [
          { id: 'sourate', left: 'Sourate', right: 'Chapitre du Coran' },
          { id: 'aya', left: 'Verset (aya)', right: 'Unité de texte repérée dans une sourate' },
          { id: 'traduction', left: 'Traduction', right: 'Rendu du sens dans une autre langue' },
        ],
        explanation: 'Une traduction transmet un sens dans une autre langue ; elle doit être distinguée du texte arabe.',
        source: 'Repère général de lecture coranique.',
      },
    ],
  },
  {
    id: 'coran-fatiha',
    course: 'coran',
    title: 'Découvrir Al-Fatiha',
    subtitle: 'La première sourate',
    minutes: 6,
    module: 'Premiers repères',
    questions: [
      {
        id: 'coran-fatiha-q1',
        type: 'choice',
        prompt: 'Quel est le numéro de la sourate Al-Fatiha dans l’ordre courant du Coran ?',
        options: ['1', '12', '114'],
        answerIndex: 0,
        explanation: 'Al-Fatiha est la première sourate dans l’ordre courant du muṣḥaf.',
        source: 'Coran, sourate 1 — repère de lecture.',
      },
      {
        id: 'coran-fatiha-q2',
        type: 'word-bank',
        prompt: 'Complète ce repère sans reconstituer le texte de la sourate :',
        answerWords: ['Al-Fatiha', 'est', 'la', 'première', 'sourate', 'du', 'Coran'],
        bank: [
          { id: 'cf2-1', text: 'du' },
          { id: 'cf2-2', text: 'Al-Fatiha' },
          { id: 'cf2-3', text: 'Coran' },
          { id: 'cf2-4', text: 'est' },
          { id: 'cf2-5', text: 'la' },
          { id: 'cf2-6', text: 'première' },
          { id: 'cf2-7', text: 'sourate' },
        ],
        explanation: 'Il s’agit d’un repère de structure, pas d’une citation ni d’une traduction.',
        source: 'Coran, sourate 1 — repère pédagogique.',
      },
      {
        id: 'coran-fatiha-q3',
        type: 'matching',
        prompt: 'Associe chaque repère à sa description générale.',
        pairs: [
          { id: 'numero', left: 'Sourate 1', right: 'Position d’Al-Fatiha dans l’ordre courant' },
          { id: 'audio', left: 'Récitation audio', right: 'À écouter depuis une source autorisée' },
          { id: 'sens', left: 'Traduction française', right: 'Rendu du sens, distinct du texte arabe' },
        ],
        explanation: 'Pour étudier le texte, distinguez le texte arabe, sa récitation, la traduction et le commentaire.',
        source: 'Coran, sourate 1 — repère de lecture.',
      },
    ],
  },
  {
    id: 'coran-ikhlas',
    course: 'coran',
    title: 'Une courte sourate : Al-Ikhlas',
    subtitle: 'Lire avec une traduction identifiée',
    minutes: 6,
    module: 'Premiers repères',
    questions: [
      {
        id: 'coran-ikhlas-q1',
        type: 'choice',
        prompt: 'Quel numéro porte la sourate Al-Ikhlas dans l’ordre courant ?',
        options: ['112', '19', '2'],
        answerIndex: 0,
        explanation: 'Al-Ikhlas est la sourate 112 dans l’ordre courant du muṣḥaf.',
        source: 'Coran, sourate 112 — repère de lecture.',
      },
      {
        id: 'coran-ikhlas-q2',
        type: 'word-bank',
        prompt: 'Replace ces mots pour former un repère (pas une traduction du texte) :',
        answerWords: ['Al-Ikhlas', 'est', 'le', 'nom', 'd’une', 'sourate'],
        bank: [
          { id: 'ci2-1', text: 'sourate' },
          { id: 'ci2-2', text: 'le' },
          { id: 'ci2-3', text: 'Al-Ikhlas' },
          { id: 'ci2-4', text: 'nom' },
          { id: 'ci2-5', text: 'est' },
          { id: 'ci2-6', text: 'd’une' },
        ],
        explanation: 'Cette phrase identifie une sourate ; les explications de son sens doivent citer leurs sources.',
        source: 'Coran, sourate 112 — repère pédagogique.',
      },
      {
        id: 'coran-ikhlas-q3',
        type: 'matching',
        prompt: 'Associe chaque élément à la bonne catégorie.',
        pairs: [
          { id: '112', left: '112', right: 'Numéro de sourate dans l’ordre courant' },
          { id: 'arabe', left: 'Texte arabe', right: 'Texte à distinguer de sa traduction' },
          { id: 'tafsir', left: 'Tafsir', right: 'Commentaire exégétique à attribuer et contextualiser' },
        ],
        explanation: 'Une explication doit être attribuée à une source et ne remplace ni le texte ni sa traduction.',
        source: 'Coran, sourate 112 — repères éditoriaux.',
      },
    ],
  },
  {
    id: 'coran-maryam',
    course: 'coran',
    title: 'Maryam dans le Coran',
    subtitle: 'Une figure nommée dans une sourate',
    minutes: 7,
    module: 'Premiers repères',
    questions: [
      {
        id: 'coran-maryam-q1',
        type: 'choice',
        prompt: 'Quelle sourate porte le nom de Maryam ?',
        options: ['La sourate 19', 'La sourate 1', 'La sourate 114'],
        answerIndex: 0,
        explanation: 'Maryam est le nom de la sourate 19 dans l’ordre courant.',
        source: 'Coran, sourate 19 — repère de lecture.',
      },
      {
        id: 'coran-maryam-q2',
        type: 'word-bank',
        prompt: 'Complète ce repère de lecture, sans citer le texte :',
        answerWords: ['La', 'sourate', 'Maryam', 'porte', 'le', 'numéro', '19'],
        bank: [
          { id: 'cm2-1', text: '19' },
          { id: 'cm2-2', text: 'La' },
          { id: 'cm2-3', text: 'numéro' },
          { id: 'cm2-4', text: 'Maryam' },
          { id: 'cm2-5', text: 'porte' },
          { id: 'cm2-6', text: 'le' },
          { id: 'cm2-7', text: 'sourate' },
        ],
        explanation: 'Le nom Maryam sert de repère dans l’ordre des sourates.',
        source: 'Coran, sourate 19 — repère pédagogique.',
      },
      {
        id: 'coran-maryam-q3',
        type: 'matching',
        prompt: 'Associe les références à leur repère de lecture.',
        pairs: [
          { id: 'maryam', left: 'Sourate 19', right: 'Sourate Maryam' },
          { id: 'aliimran', left: 'Sourate 3', right: 'Contient également des passages au sujet de Maryam' },
          { id: 'traduction', left: 'Traduction', right: 'Version française à identifier par son édition' },
        ],
        explanation: 'Pour étudier ces passages, gardez la référence et l’édition de traduction visibles.',
        source: 'Coran, sourates 3 et 19 — repères de lecture.',
      },
    ],
  },
  {
    id: 'coran-yusuf',
    course: 'coran',
    title: 'Le récit de Yusuf',
    subtitle: 'Suivre les repères de la sourate 12',
    minutes: 7,
    module: 'Premiers repères',
    questions: [
      {
        id: 'coran-yusuf-q1',
        type: 'choice',
        prompt: 'Dans quelle sourate trouve-t-on le récit de Yusuf ?',
        options: ['Sourate 12', 'Sourate 112', 'Sourate 1'],
        answerIndex: 0,
        explanation: 'La sourate 12 est intitulée Yusuf et développe ce récit.',
        source: 'Coran, sourate 12 — repère de lecture.',
      },
      {
        id: 'coran-yusuf-q2',
        type: 'word-bank',
        prompt: 'Complète ce repère (synthèse pédagogique, pas une citation) :',
        answerWords: ['La', 'sourate', '12', 'est', 'intitulée', 'Yusuf'],
        bank: [
          { id: 'cy2-1', text: 'Yusuf' },
          { id: 'cy2-2', text: 'La' },
          { id: 'cy2-3', text: 'est' },
          { id: 'cy2-4', text: '12' },
          { id: 'cy2-5', text: 'intitulée' },
          { id: 'cy2-6', text: 'sourate' },
        ],
        explanation: 'Yusuf est le nom arabe associé à Joseph ; les choix de translittération peuvent varier.',
        source: 'Coran, sourate 12 — repère pédagogique.',
      },
      {
        id: 'coran-yusuf-q3',
        type: 'matching',
        prompt: 'Associe le terme à son repère de lecture.',
        pairs: [
          { id: 'sourate', left: 'Sourate Yusuf', right: 'Sourate 12 dans l’ordre courant' },
          { id: 'yusuf', left: 'Yusuf', right: 'Forme arabe du nom Joseph' },
          { id: 'commentaire', left: 'Commentaire', right: 'À distinguer du texte traduit' },
        ],
        explanation: 'Les commentaires et traductions doivent être identifiés ; les traditions d’exégèse peuvent différer.',
        source: 'Coran, sourate 12 — repères éditoriaux.',
      },
    ],
  },
];

export function getCourseLessons(course: CourseId): Lesson[] {
  if (course === 'bible') return bibleLessons;
  if (course === 'coran') return quranLessons;
  return [...bibleLessons, ...quranLessons];
}

export function getLessonById(id: string): Lesson | undefined {
  return [...bibleLessons, ...quranLessons].find((lesson) => lesson.id === id);
}

export function getCourseLabel(course: CourseId): string {
  if (course === 'bible') return 'Bible';
  if (course === 'coran') return 'Coran';
  return 'Découverte';
}

export function getLevelLabel(level: Level): string {
  if (level === 'intermediaire') return 'Intermédiaire';
  if (level === 'avance') return 'Avancé';
  return 'Débutant';
}
