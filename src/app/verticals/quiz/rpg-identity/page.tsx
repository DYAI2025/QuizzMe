'use client'

import { RpgIdentityQuiz } from '@/components/quizzes/RpgIdentityQuiz'
import { QuizPageShell } from '@/components/quizzes/QuizPageShell'

export default function RpgIdentityPage() {
    return (
        <QuizPageShell title="RPG Charakter Test">
            <RpgIdentityQuiz />
        </QuizPageShell>
    )
}
