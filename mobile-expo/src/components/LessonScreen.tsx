import { useEffect, useMemo, useReducer, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Heart, RotateCcw, X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CompletionScreen } from './CompletionScreen';
import { ChoiceQuestion, Lesson, MatchingQuestion, Question, TrueFalseQuestion, WordBankQuestion } from '../data/coursesData';
import { colors, spacing } from '../theme';

type Phase = 'answering' | 'feedback' | 'complete' | 'out-of-hearts';

type MachineState = {
  phase: Phase;
  questionIndex: number;
  selectedIndex: number | null;
  selectedWordIds: string[];
  selectedLeft: string | null;
  matches: Record<string, string>;
  answerCorrect: boolean;
  correctCount: number;
  livesRemaining: number;
  xpEarned: number;
};

type MachineAction =
  | { type: 'select-choice'; index: number }
  | { type: 'toggle-word'; id: string }
  | { type: 'select-left'; id: string }
  | { type: 'select-right'; id: string; question: MatchingQuestion }
  | { type: 'submit'; correct: boolean; losesHeart: boolean }
  | { type: 'next'; total: number; review: boolean };

function createMachine(hearts: number): MachineState {
  return {
    phase: 'answering',
    questionIndex: 0,
    selectedIndex: null,
    selectedWordIds: [],
    selectedLeft: null,
    matches: {},
    answerCorrect: false,
    correctCount: 0,
    livesRemaining: hearts,
    xpEarned: 0,
  };
}

function machine(state: MachineState, action: MachineAction): MachineState {
  if (action.type === 'next' && state.phase !== 'feedback') return state;
  if (action.type !== 'next' && state.phase !== 'answering') return state;
  switch (action.type) {
    case 'select-choice':
      return { ...state, selectedIndex: action.index };
    case 'toggle-word':
      return {
        ...state,
        selectedWordIds: state.selectedWordIds.includes(action.id)
          ? state.selectedWordIds.filter((id) => id !== action.id)
          : [...state.selectedWordIds, action.id],
      };
    case 'select-left':
      return { ...state, selectedLeft: action.id };
    case 'select-right': {
      if (!state.selectedLeft) return state;
      const pair = action.question.pairs.find((item) => item.id === state.selectedLeft);
      if (!pair) return state;
      return {
        ...state,
        matches: { ...state.matches, [pair.id]: action.id },
        selectedLeft: null,
      };
    }
    case 'submit':
      return {
        ...state,
        phase: 'feedback',
        answerCorrect: action.correct,
        correctCount: state.correctCount + (action.correct ? 1 : 0),
        livesRemaining: action.losesHeart && !action.correct ? Math.max(0, state.livesRemaining - 1) : state.livesRemaining,
      };
    case 'next':
      if (state.livesRemaining === 0 && !action.review) return { ...state, phase: 'out-of-hearts' };
      if (state.questionIndex + 1 >= action.total) {
        const xp = action.review ? 0 : (state.correctCount * 10) + (state.correctCount === action.total ? 5 : 0);
        return { ...state, phase: 'complete', xpEarned: xp };
      }
      return {
        ...state,
        phase: 'answering',
        questionIndex: state.questionIndex + 1,
        selectedIndex: null,
        selectedWordIds: [],
        selectedLeft: null,
        matches: {},
      };
  }
}

function answerIsComplete(question: Question, state: MachineState): boolean {
  if (question.type === 'choice' || question.type === 'true-false') return state.selectedIndex !== null;
  if (question.type === 'word-bank') return state.selectedWordIds.length === question.answerWords.length;
  return question.pairs.every((pair) => Boolean(state.matches[pair.id]));
}

function answerIsCorrect(question: Question, state: MachineState): boolean {
  if (question.type === 'choice') return state.selectedIndex === question.answerIndex;
  if (question.type === 'true-false') return state.selectedIndex === (question.answer ? 0 : 1);
  if (question.type === 'word-bank') {
    const wordsById = new Map(question.bank.map((word) => [word.id, word.text]));
    const selected = state.selectedWordIds.map((id) => wordsById.get(id));
    return selected.length === question.answerWords.length
      && selected.every((word, index) => word === question.answerWords[index]);
  }
  return question.pairs.every((pair) => state.matches[pair.id] === pair.right);
}

function questionSource(question: Question): string {
  return question.source;
}

type Result = { correct: number; total: number; xp: number; review: boolean };

type Props = {
  lesson: Lesson;
  review: boolean;
  hearts: number;
  onLoseHeart: () => void;
  onComplete: (result: Result) => void;
  onExit: () => void;
  onDone: () => void;
};

export function LessonScreen({ lesson, review, hearts, onLoseHeart, onComplete, onExit, onDone }: Props) {
  const [state, dispatch] = useReducer(machine, hearts, createMachine);
  const completionNotified = useRef(false);
  const question = lesson.questions[state.questionIndex];
  const complete = useMemo(() => question ? answerIsComplete(question, state) : false, [question, state]);

  useEffect(() => {
    if (state.phase !== 'complete' || completionNotified.current) return;
    completionNotified.current = true;
    onComplete({
      correct: state.correctCount,
      total: lesson.questions.length,
      xp: state.xpEarned,
      review,
    });
  }, [lesson.questions.length, onComplete, review, state.correctCount, state.phase, state.xpEarned]);

  if (state.phase === 'complete') {
    return (
      <CompletionScreen
        lesson={lesson}
        correct={state.correctCount}
        total={lesson.questions.length}
        xp={state.xpEarned}
        review={review}
        onDone={onDone}
      />
    );
  }

  if (state.phase === 'out-of-hearts') {
    return (
      <SafeAreaView style={styles.center} edges={['top', 'bottom']}>
        <View style={styles.emptyHeart}><Heart size={30} color={colors.red} /></View>
        <Text style={styles.outTitle}>Petite pause ?</Text>
        <Text style={styles.outText}>Vous avez utilisé vos cœurs pour cette leçon. Ils se rechargent avec le temps. Vous pouvez aussi relire vos leçons terminées sans pénalité.</Text>
        <Pressable onPress={onExit} style={styles.primaryButton}><Text style={styles.primaryText}>Retour au parcours</Text></Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.top}>
        <Pressable accessibilityRole="button" accessibilityLabel="Quitter la leçon" onPress={onExit} style={styles.closeButton}>
          <ArrowLeft size={20} color={colors.ink} />
        </Pressable>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${((state.questionIndex + (state.phase === 'feedback' ? 1 : 0)) / lesson.questions.length) * 100}%` }]} />
        </View>
        {review ? (
          <View style={styles.reviewBadge}><RotateCcw size={14} color={colors.primary} /></View>
        ) : (
          <View style={styles.hearts}>{Array.from({ length: 5 }, (_, index) => <Heart key={index} size={16} color={index < state.livesRemaining ? colors.red : colors.line} fill={index < state.livesRemaining ? colors.red : 'transparent'} />)}</View>
        )}
      </View>
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <Text style={styles.lessonKicker}>{review ? 'RÉVISION SANS PÉNALITÉ' : 'LEÇON'} · {lesson.course === 'bible' ? 'BIBLE' : 'CORAN'}</Text>
        <Text style={styles.lessonTitle}>{lesson.title}</Text>
        <View style={styles.questionCard}>
          <Text style={styles.questionCount}>QUESTION {state.questionIndex + 1} SUR {lesson.questions.length}</Text>
          <Text style={styles.prompt}>{question.prompt}</Text>
          {question.type === 'choice' ? (
            <ChoiceExercise
              question={question}
              selected={state.selectedIndex}
              disabled={state.phase !== 'answering'}
              onSelect={(index) => dispatch({ type: 'select-choice', index })}
            />
          ) : question.type === 'true-false' ? (
            <TrueFalseExercise
              question={question}
              selected={state.selectedIndex}
              disabled={state.phase !== 'answering'}
              onSelect={(index) => dispatch({ type: 'select-choice', index })}
            />
          ) : question.type === 'word-bank' ? (
            <WordBankExercise
              question={question}
              selectedIds={state.selectedWordIds}
              onToggle={(id) => dispatch({ type: 'toggle-word', id })}
            />
          ) : (
            <MatchingExercise
              question={question}
              matches={state.matches}
              selectedLeft={state.selectedLeft}
              onSelectLeft={(id) => dispatch({ type: 'select-left', id })}
              onSelectRight={(id) => dispatch({ type: 'select-right', id, question })}
            />
          )}
          {state.phase === 'feedback' ? (
            <View style={[styles.feedback, state.answerCorrect ? styles.feedbackGood : styles.feedbackBad]}>
              <View style={styles.feedbackTitleRow}>
                {state.answerCorrect ? <CheckCircle2 size={20} color={colors.green} /> : <X size={20} color={colors.red} />}
                <Text style={[styles.feedbackTitle, { color: state.answerCorrect ? colors.green : colors.red }]}>
                  {state.answerCorrect ? 'Bien joué !' : review ? 'À revoir tranquillement' : 'On apprend en se trompant'}
                </Text>
              </View>
              {!state.answerCorrect && !review ? <Text style={styles.penalty}>Un cœur a été utilisé. Il reviendra avec le temps.</Text> : null}
              {!state.answerCorrect ? <Text style={styles.correctAnswer}>Réponse : {getCorrectAnswer(question)}</Text> : null}
              <Text style={styles.explanation}>{question.explanation}</Text>
              <Text style={styles.source}>{questionSource(question)}</Text>
            </View>
          ) : null}
        </View>
        {question.type === 'matching' && state.phase === 'answering' ? (
          <Text style={styles.matchHint}>Touchez un élément à gauche, puis sa correspondance à droite.</Text>
        ) : null}
      </ScrollView>

      <View style={styles.bottom}>
        {state.phase === 'feedback' ? (
          <Pressable onPress={() => dispatch({ type: 'next', total: lesson.questions.length, review })} style={styles.primaryButton}>
            <Text style={styles.primaryText}>{state.livesRemaining === 0 && !review ? 'Terminer' : state.questionIndex === lesson.questions.length - 1 ? 'Voir le résultat' : 'Continuer'}</Text>
            <ArrowRight size={18} color={colors.white} />
          </Pressable>
        ) : (
          <Pressable
            disabled={!complete}
            onPress={() => {
              const isCorrect = answerIsCorrect(question, state);
              if (!isCorrect && !review) onLoseHeart();
              dispatch({ type: 'submit', correct: isCorrect, losesHeart: !review });
            }}
            style={[styles.primaryButton, !complete && styles.disabledButton]}
          >
            <Text style={styles.primaryText}>Vérifier</Text>
            <Check size={18} color={colors.white} />
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

function TrueFalseExercise({ question, selected, disabled, onSelect }: { question: TrueFalseQuestion; selected: number | null; disabled: boolean; onSelect: (index: number) => void }) {
  return (
    <View style={styles.options}>
      {['Vrai', 'Faux'].map((option, index) => (
        <Pressable
          key={`${question.id}-${option}`}
          accessibilityRole="button"
          accessibilityState={{ selected: selected === index, disabled }}
          disabled={disabled}
          onPress={() => onSelect(index)}
          style={[styles.option, selected === index && styles.optionSelected]}
        >
          <Text style={[styles.optionLetter, selected === index && styles.optionLetterSelected]}>{option === 'Vrai' ? 'V' : 'F'}</Text>
          <Text style={styles.optionText}>{option}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function ChoiceExercise({ question, selected, disabled, onSelect }: { question: ChoiceQuestion; selected: number | null; disabled: boolean; onSelect: (index: number) => void }) {
  return (
    <View style={styles.options}>
      {question.options.map((option, index) => (
        <Pressable
          key={`${question.id}-${option}`}
          accessibilityRole="button"
          accessibilityState={{ selected: selected === index, disabled }}
          disabled={disabled}
          onPress={() => onSelect(index)}
          style={[styles.option, selected === index && styles.optionSelected]}
        >
          <Text style={[styles.optionLetter, selected === index && styles.optionLetterSelected]}>{String.fromCharCode(65 + index)}</Text>
          <Text style={styles.optionText}>{option}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function WordBankExercise({ question, selectedIds, onToggle }: { question: WordBankQuestion; selectedIds: string[]; onToggle: (id: string) => void }) {
  const selectedWords = selectedIds.map((id) => question.bank.find((word) => word.id === id)).filter((word) => Boolean(word));
  return (
    <View style={styles.wordExercise}>
      <View style={styles.answerTray}>
        {selectedWords.length ? selectedWords.map((word) => (
          <Pressable key={word!.id} onPress={() => onToggle(word!.id)} style={styles.answerToken}>
            <Text style={styles.answerTokenText}>{word!.text}</Text>
          </Pressable>
        )) : <Text style={styles.trayPlaceholder}>Touchez les mots dans l’ordre</Text>}
      </View>
      <View style={styles.wordBank}>
        {question.bank.map((word) => {
          const used = selectedIds.includes(word.id);
          return (
            <Pressable key={word.id} disabled={used} onPress={() => onToggle(word.id)} style={[styles.wordChip, used && styles.usedWord]}>
              <Text style={[styles.wordText, used && styles.usedWordText]}>{word.text}</Text>
            </Pressable>
          );
        })}
      </View>
      {selectedIds.length ? <Text onPress={() => onToggle(selectedIds[selectedIds.length - 1])} style={styles.undoText}>Retirer le dernier mot</Text> : null}
    </View>
  );
}

function MatchingExercise({ question, matches, selectedLeft, onSelectLeft, onSelectRight }: { question: MatchingQuestion; matches: Record<string, string>; selectedLeft: string | null; onSelectLeft: (id: string) => void; onSelectRight: (id: string) => void }) {
  const rightOptions = [...question.pairs].reverse();
  return (
    <View style={styles.matching}>
      <View style={styles.matchColumn}>
        {question.pairs.map((pair) => (
          <Pressable
            key={pair.id}
            disabled={Boolean(matches[pair.id])}
            onPress={() => onSelectLeft(pair.id)}
            style={[styles.matchOption, selectedLeft === pair.id && styles.matchSelected, matches[pair.id] && styles.matchDone]}
          >
            <Text style={styles.matchText}>{pair.left}</Text>
            {matches[pair.id] ? <Check size={14} color={colors.green} /> : null}
          </Pressable>
        ))}
      </View>
      <View style={styles.matchColumn}>
        {rightOptions.map((pair) => {
          const used = Object.values(matches).includes(pair.right);
          return (
            <Pressable
              key={pair.id}
              disabled={used}
              onPress={() => onSelectRight(pair.right)}
              style={[styles.matchOption, used && styles.matchDone, selectedLeft && !used && styles.matchTarget]}
            >
              <Text style={styles.matchText}>{pair.right}</Text>
              {used ? <Check size={14} color={colors.green} /> : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function getCorrectAnswer(question: Question): string {
  if (question.type === 'choice') return question.options[question.answerIndex];
  if (question.type === 'true-false') return question.answer ? 'Vrai' : 'Faux';
  if (question.type === 'word-bank') return question.answerWords.join(' ');
  return question.pairs.map((pair) => `${pair.left} → ${pair.right}`).join(' · ');
}

export { CompletionScreen };

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  top: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: spacing.md, paddingTop: 10, paddingBottom: 15 },
  closeButton: { width: 35, height: 35, borderRadius: 13, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  progressTrack: { flex: 1, height: 9, backgroundColor: colors.line, borderRadius: 8, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.green, borderRadius: 8 },
  hearts: { flexDirection: 'row', gap: 2 },
  reviewBadge: { width: 34, height: 34, borderRadius: 12, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  body: { paddingHorizontal: spacing.md, paddingBottom: 20 },
  lessonKicker: { color: colors.primary, fontSize: 10, fontWeight: '900', letterSpacing: 0.9, marginTop: 8 },
  lessonTitle: { color: colors.ink, fontSize: 24, lineHeight: 30, fontWeight: '900', marginTop: 7, marginBottom: 17 },
  questionCard: { backgroundColor: colors.white, borderRadius: 21, padding: 17, borderWidth: 1, borderColor: colors.line },
  questionCount: { color: colors.muted, fontSize: 9, fontWeight: '900', letterSpacing: 0.8 },
  prompt: { color: colors.ink, fontSize: 17, lineHeight: 24, fontWeight: '800', marginTop: 9, marginBottom: 16 },
  options: { gap: 9 },
  option: { minHeight: 53, flexDirection: 'row', alignItems: 'center', gap: 11, paddingHorizontal: 12, borderRadius: 15, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white },
  optionSelected: { borderWidth: 1.5, borderColor: colors.primary, backgroundColor: '#F8F7FF' },
  optionLetter: { width: 26, height: 26, borderRadius: 9, textAlign: 'center', textAlignVertical: 'center', overflow: 'hidden', backgroundColor: colors.background, color: colors.muted, fontSize: 12, fontWeight: '900', paddingTop: 4 },
  optionLetterSelected: { backgroundColor: colors.primary, color: colors.white },
  optionText: { flex: 1, color: colors.ink, fontSize: 13, fontWeight: '700', lineHeight: 19 },
  wordExercise: { gap: 12 },
  answerTray: { minHeight: 68, flexDirection: 'row', flexWrap: 'wrap', alignContent: 'center', gap: 7, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.primary, backgroundColor: '#FBFAFF', borderRadius: 14, padding: 10 },
  trayPlaceholder: { color: colors.muted, fontSize: 11 },
  answerToken: { backgroundColor: colors.primarySoft, paddingHorizontal: 9, paddingVertical: 7, borderRadius: 9 },
  answerTokenText: { color: colors.primaryDark, fontWeight: '800', fontSize: 12 },
  wordBank: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  wordChip: { paddingHorizontal: 10, paddingVertical: 9, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, borderRadius: 11 },
  wordText: { color: colors.ink, fontWeight: '700', fontSize: 12 },
  usedWord: { backgroundColor: colors.background, borderColor: colors.background },
  usedWordText: { color: 'transparent' },
  undoText: { color: colors.primary, fontSize: 11, fontWeight: '800', alignSelf: 'flex-start', paddingVertical: 4 },
  matching: { flexDirection: 'row', gap: 8 },
  matchColumn: { flex: 1, gap: 8 },
  matchOption: { minHeight: 55, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 4, padding: 8, borderRadius: 12, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white },
  matchSelected: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  matchTarget: { borderColor: '#B9B5F1' },
  matchDone: { backgroundColor: colors.greenSoft, borderColor: colors.greenSoft },
  matchText: { flex: 1, color: colors.ink, fontSize: 10, lineHeight: 14, fontWeight: '700' },
  matchHint: { color: colors.muted, fontSize: 11, textAlign: 'center', marginTop: 10 },
  feedback: { padding: 13, borderRadius: 15, marginTop: 14 },
  feedbackGood: { backgroundColor: colors.greenSoft },
  feedbackBad: { backgroundColor: colors.redSoft },
  feedbackTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  feedbackTitle: { fontSize: 14, fontWeight: '900' },
  penalty: { color: colors.red, fontSize: 11, fontWeight: '700', marginTop: 7 },
  correctAnswer: { color: colors.ink, fontSize: 12, lineHeight: 18, fontWeight: '800', marginTop: 7 },
  explanation: { color: colors.ink, fontSize: 12, lineHeight: 18, marginTop: 7 },
  source: { color: colors.muted, fontSize: 10, lineHeight: 15, marginTop: 7, fontStyle: 'italic' },
  bottom: { paddingHorizontal: spacing.md, paddingVertical: 12, paddingBottom: 26, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.line },
  primaryButton: { minHeight: 52, borderRadius: 16, backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  primaryText: { color: colors.white, fontWeight: '900', fontSize: 15 },
  disabledButton: { backgroundColor: colors.locked },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28, backgroundColor: colors.background },
  emptyHeart: { width: 70, height: 70, borderRadius: 24, backgroundColor: colors.redSoft, alignItems: 'center', justifyContent: 'center' },
  outTitle: { color: colors.ink, fontSize: 24, fontWeight: '900', marginTop: 18 },
  outText: { color: colors.muted, textAlign: 'center', fontSize: 14, lineHeight: 22, marginTop: 9, marginBottom: 22 },
});
