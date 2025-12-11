'use client'

import DestinyQuiz from '@/components/quizzes/DestinyQuiz'
import { QuizPageShell } from '@/components/quizzes/QuizPageShell'

export default function DestinyQuizPage() {
    return (
        // Shell might need adjustment for dark theme quizzes, or we accept the "card inside shell" look.
        // Given DestinyQuiz has its own container styling, we can render it.
        // IF we want the header, use Shell.
        <QuizPageShell title="Destiny Check">
            <DestinyQuiz />
        </QuizPageShell>
    )
}
