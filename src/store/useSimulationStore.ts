import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Simulation,
  UserProgress,
  ScreenType,
  ModalData,
  JournalEntry,
  ValidationResult,
  SimulationConfig,
  
  HintLevel,
} from '@/types';
import { SimulationGenerator } from '@/engine/SimulationGenerator';
import { ValidationEngine } from '@/engine/ValidationEngine';
import { ScoringEngine } from '@/engine/ScoringEngine';
import { TRANSACTION_POOLS } from '@/data/transaction-pools';
import { DEFAULT_CONFIG } from '@/utils/constants';

interface SimulationStore {
  // Current simulation
  simulation: Simulation | null;
  userProgress: UserProgress | null;

  // UI state
  currentScreen: ScreenType;
  activeModal: ModalData;

  // Actions
  initializeSimulation: (
    userId: string,
    seed?: string,
    config?: Partial<SimulationConfig>
  ) => void;
  loadSimulation: (simulation: Simulation, progress: UserProgress) => void;

  // Transaction actions
  startTransaction: (transactionId: string) => void;
  submitAnswer: (transactionId: string, entry: JournalEntry[]) => ValidationResult;
  useHint: (transactionId: string, level: HintLevel) => void;
  completeTransaction: (transactionId: string, isCorrect: boolean) => void;

  // Timer actions
  updateTimerTick: (transactionId: string, timeRemaining: number) => void;
  handleTimerExpire: (transactionId: string) => void;

  // Navigation
  goToScreen: (screen: ScreenType) => void;
  showModal: (modal: ModalData) => void;
  closeModal: () => void;

  // Persistence
  saveProgress: () => void;
  resetSimulation: () => void;
}

export const useSimulationStore = create<SimulationStore>()(
  persist(
    (set, get) => ({
      simulation: null,
      userProgress: null,
      currentScreen: 'welcome',
      activeModal: { type: 'none', content: null },

      initializeSimulation: (userId, seed, configOverrides) => {
        const finalSeed = seed || `${userId}-${Date.now()}`;
        const config: SimulationConfig = {
          ...DEFAULT_CONFIG,
          ...configOverrides,
        };

        const generator = new SimulationGenerator(finalSeed);
        const simulation = generator.generateSimulation(userId, TRANSACTION_POOLS, config);

        const userProgress: UserProgress = {
          simulationId: simulation.id,
          userId,
          seed: finalSeed,
          currentTransactionIndex: 0,
          status: 'not_started',
          stars: 0,
          totalScore: 0,
          transactionProgress: {},
          lastSavedAt: new Date(),
        };

        // Initialize progress for each transaction
        simulation.transactions.forEach((t) => {
          const timeLimit = simulation.config.transactionTimeLimits[t.transactionNumber];
          userProgress.transactionProgress[t.id] = {
            transactionId: t.id,
            status: t.transactionNumber === 1 ? 'active' : 'locked',
            attempts: 0,
            hintsUsed: 0,
            hintsViewed: [],
            // Timer initialization
            timeLimit,
            timeRemaining: t.transactionNumber === 1 ? timeLimit : null,
            timeExpired: false,
            startedAt: t.transactionNumber === 1 ? new Date() : undefined,
            currentEntry: [],
            isCorrect: null,
            starsEarned: 0,
          };
        });

        set({ simulation, userProgress, currentScreen: 'welcome' });
        get().saveProgress();
      },

      loadSimulation: (simulation, progress) => {
        set({ simulation, userProgress: progress });
      },

      startTransaction: (transactionId) => {
        const { simulation, userProgress } = get();
        if (!simulation || !userProgress) return;

        const transaction = simulation.transactions.find((t) => t.id === transactionId);
        const progress = userProgress.transactionProgress[transactionId];
        if (!transaction || !progress) return;

        // Determine time limit for this transaction
        const timeLimit = simulation.config.transactionTimeLimits[transaction.transactionNumber];

        // IMMUTABLE UPDATE - Create new objects at each level
        set({
          userProgress: {
            ...userProgress,
            status: 'in_progress',
            startedAt: userProgress.startedAt || new Date(),
            transactionProgress: {
              ...userProgress.transactionProgress,
              [transactionId]: {
                ...progress,
                status: 'active',
                // Timer initialization
                timeLimit,
                timeRemaining: timeLimit,
                timeExpired: false,
                startedAt: new Date(),
              },
            },
          },
        });

        get().saveProgress();
      },

      submitAnswer: (transactionId, entry) => {
        const { simulation, userProgress } = get();
        if (!simulation || !userProgress) {
          return {
            isValid: false,
            errors: [],
            balanceCheck: { isBalanced: false, debitTotal: 0, creditTotal: 0 },
            entryMatches: [],
          };
        }

        const transaction = simulation.transactions.find((t) => t.id === transactionId);
        const progress = userProgress.transactionProgress[transactionId];

        if (!transaction || !progress) {
          return {
            isValid: false,
            errors: [],
            balanceCheck: { isBalanced: false, debitTotal: 0, creditTotal: 0 },
            entryMatches: [],
          };
        }

        // Validate (pass transaction for amount mismatch detection)
        const validator = new ValidationEngine();
        const result = validator.validate(entry, transaction.correctAnswer, transaction);

        // Update progress
        progress.attempts += 1;
        progress.currentEntry = entry;
        progress.isCorrect = result.isValid;

        if (result.isValid) {
          progress.status = 'completed';
          progress.completedAt = new Date();

          // Calculate stars
          const scorer = new ScoringEngine();
          progress.starsEarned = scorer.calculateStars(
            progress.attempts,
            progress.hintsUsed,
            progress.timeExpired, // Use actual timer expired flag
            true
          );

          userProgress.totalScore += progress.starsEarned;
          userProgress.stars = Math.round(userProgress.totalScore * 2) / 2; // Round to nearest 0.5

          // Unlock next transaction
          const nextIndex = transaction.transactionNumber;
          if (nextIndex < simulation.transactions.length) {
            const nextTransaction = simulation.transactions[nextIndex];
            userProgress.transactionProgress[nextTransaction.id].status = 'active';
            userProgress.currentTransactionIndex = nextIndex;
          } else {
            // Simulation complete
            userProgress.status = 'completed';
            userProgress.completedAt = new Date();
          }
        }

        set({ userProgress: { ...userProgress } });
        get().saveProgress();

        return result;
      },

      useHint: (transactionId, level) => {
        const { userProgress } = get();
        if (!userProgress) return;

        const progress = userProgress.transactionProgress[transactionId];
        if (progress && !progress.hintsViewed.includes(level)) {
          progress.hintsViewed.push(level);
          progress.hintsUsed = progress.hintsViewed.length;
          set({ userProgress: { ...userProgress } });
          get().saveProgress();
        }
      },

      // Timer actions
      updateTimerTick: (transactionId: string, timeRemaining: number) => {
        const { userProgress } = get();
        if (!userProgress) return;

        const progress = userProgress.transactionProgress[transactionId];
        if (!progress) return;

        // IMMUTABLE UPDATE
        set({
          userProgress: {
            ...userProgress,
            transactionProgress: {
              ...userProgress.transactionProgress,
              [transactionId]: {
                ...progress,
                timeRemaining,
              },
            },
          },
        });

        get().saveProgress();
      },

      handleTimerExpire: (transactionId: string) => {
        const { simulation, userProgress, showModal } = get();
        if (!simulation || !userProgress) return;

        const transaction = simulation.transactions.find((t) => t.id === transactionId);
        const progress = userProgress.transactionProgress[transactionId];
        if (!transaction || !progress) return;

        // Mark as expired and completed
        progress.timeExpired = true;
        progress.status = 'completed';
        progress.isCorrect = false;
        progress.completedAt = new Date();
        progress.timeRemaining = 0;

        // Calculate stars (0 because timeExpired = true)
        const scorer = new ScoringEngine();
        progress.starsEarned = scorer.calculateStars(
          progress.attempts,
          progress.hintsUsed,
          true, // timeExpired!
          false
        );

        // Unlock next transaction
        const nextIndex = transaction.transactionNumber;
        if (nextIndex < simulation.transactions.length) {
          const nextTransaction = simulation.transactions[nextIndex];
          userProgress.transactionProgress[nextTransaction.id].status = 'active';
          userProgress.currentTransactionIndex = nextIndex;
        } else {
          userProgress.status = 'completed';
          userProgress.completedAt = new Date();
        }

        set({ userProgress: { ...userProgress } });
        get().saveProgress();

        // Show solution modal
        showModal({
          type: 'feedback',
          content: {
            isCorrect: false,
            message: 'Tijd is verstreken! 😅',
            characterQuote: 'Geen paniek, hier is de correcte verwerking. Volgende keer iets sneller! 💪',
            starsEarned: 0,
            currentAttempt: progress.attempts,
            maxAttempts: 3,
            showSolution: true,
            solution: transaction.correctAnswer,
          },
        });
      },

      completeTransaction: (transactionId, isCorrect) => {
        const { userProgress } = get();
        if (!userProgress) return;

        const progress = userProgress.transactionProgress[transactionId];
        if (progress) {
          progress.status = 'completed';
          progress.isCorrect = isCorrect;
          progress.completedAt = new Date();
          set({ userProgress: { ...userProgress } });
          get().saveProgress();
        }
      },

      goToScreen: (screen) => {
        set({ currentScreen: screen });
      },

      showModal: (modal) => {
        set({ activeModal: modal });
      },

      closeModal: () => {
        set({ activeModal: { type: 'none', content: null } });
      },

      saveProgress: () => {
        const { userProgress } = get();
        if (userProgress) {
          userProgress.lastSavedAt = new Date();
          // Zustand persist middleware handles actual saving
        }
      },

      resetSimulation: () => {
        set({
          simulation: null,
          userProgress: null,
          currentScreen: 'welcome',
          activeModal: { type: 'none', content: null },
        });
      },
    }),
    {
      name: 'freshbites-simulation',
      partialize: (state) => ({
        simulation: state.simulation,
        userProgress: state.userProgress,
      }),
    }
  )
);
