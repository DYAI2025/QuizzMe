import Link from 'next/link'
import React from 'react'

interface QuizPageShellProps {
    title: string
    children: React.ReactNode
}

export function QuizPageShell({ title, children }: QuizPageShellProps) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/verticals/quiz" className="font-bold text-lg text-purple-900 hover:opacity-80 transition-opacity">
                        ← All Quizzes
                    </Link>
                    <h1 className="text-xl font-semibold text-gray-800 truncate ml-4">{title}</h1>
                    <div className="w-24"></div> {/* Spacer for balance */}
                </div>
            </header>

            <main className="flex-grow container mx-auto px-4 py-8 max-w-2xl">
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                    {children}
                </div>
            </main>

            <footer className="text-center py-6 text-gray-500 text-sm">
                <p>© 2024 Quiz Platform. For entertainment purposes only.</p>
            </footer>
        </div>
    )
}
