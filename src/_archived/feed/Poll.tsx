'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, BarChart3 } from 'lucide-react';

interface PollOption {
    id: string;
    text: string;
    votes: number;
}

interface PollProps {
    question: string;
    options: PollOption[];
    totalVotes: number;
    userVote?: string;
    onVote: (optionId: string) => void;
    allowMultiple?: boolean;
    endsAt?: Date;
    showResults?: boolean;
}

export default function Poll({
    question,
    options,
    totalVotes,
    userVote,
    onVote,
    allowMultiple = false,
    endsAt,
    showResults: forceShowResults,
}: PollProps) {
    const [hasVoted, setHasVoted] = useState(!!userVote);
    const [selectedOption, setSelectedOption] = useState<string | null>(userVote || null);

    const showResults = forceShowResults || hasVoted;
    const isExpired = endsAt && new Date() > endsAt;

    const handleVote = (optionId: string) => {
        if (hasVoted || isExpired) return;

        setSelectedOption(optionId);
        setHasVoted(true);
        onVote(optionId);
    };

    const getPercentage = (votes: number) => {
        if (totalVotes === 0) return 0;
        return Math.round((votes / totalVotes) * 100);
    };

    return (
        <div className="card p-4 bg-[var(--bg-tertiary)]">
            {/* Question */}
            <div className="flex items-start gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-[var(--primary)] mt-0.5" />
                <h3 className="font-semibold text-lg">{question}</h3>
            </div>

            {/* Options */}
            <div className="space-y-2">
                {options.map((option, index) => {
                    const percentage = getPercentage(option.votes);
                    const isSelected = selectedOption === option.id;
                    const isWinning = showResults && option.votes === Math.max(...options.map(o => o.votes));

                    return (
                        <motion.button
                            key={option.id}
                            onClick={() => handleVote(option.id)}
                            disabled={hasVoted || isExpired}
                            className={`w-full relative overflow-hidden rounded-xl p-3 text-left transition-all ${hasVoted || isExpired
                                    ? 'cursor-default'
                                    : 'cursor-pointer hover:bg-[var(--surface-hover)]'
                                } ${isSelected
                                    ? 'ring-2 ring-[var(--primary)] bg-[var(--primary)]/10'
                                    : 'bg-[var(--surface)]'
                                }`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            {/* Progress bar background */}
                            {showResults && (
                                <motion.div
                                    className={`absolute inset-0 ${isWinning ? 'bg-[var(--primary)]/20' : 'bg-[var(--surface-hover)]'
                                        }`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{ duration: 0.5, ease: 'easeOut' }}
                                />
                            )}

                            {/* Content */}
                            <div className="relative flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {/* Checkbox/Radio indicator */}
                                    <div
                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected
                                                ? 'bg-[var(--primary)] border-[var(--primary)]'
                                                : 'border-[var(--border-light)]'
                                            }`}
                                    >
                                        {isSelected && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                    <span className={`font-medium ${isWinning && showResults ? 'text-[var(--primary)]' : ''}`}>
                                        {option.text}
                                    </span>
                                </div>

                                {/* Results */}
                                {showResults && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex items-center gap-2"
                                    >
                                        <span className="text-sm text-[var(--text-secondary)]">
                                            {option.votes} votes
                                        </span>
                                        <span className={`font-bold ${isWinning ? 'text-[var(--primary)]' : ''}`}>
                                            {percentage}%
                                        </span>
                                    </motion.div>
                                )}
                            </div>
                        </motion.button>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--border)]">
                <span className="text-sm text-[var(--text-tertiary)]">
                    {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
                </span>

                {endsAt && (
                    <span className="text-sm text-[var(--text-tertiary)]">
                        {isExpired ? 'Poll ended' : `Ends ${formatTimeRemaining(endsAt)}`}
                    </span>
                )}

                {!hasVoted && !isExpired && (
                    <button
                        onClick={() => setHasVoted(true)}
                        className="text-sm text-[var(--primary)] hover:underline"
                    >
                        View results
                    </button>
                )}
            </div>
        </div>
    );
}

// Poll Creator Component
export function PollCreator({
    onCreatePoll,
    onCancel,
}: {
    onCreatePoll: (question: string, options: string[]) => void;
    onCancel: () => void;
}) {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '']);

    const addOption = () => {
        if (options.length < 6) {
            setOptions([...options, '']);
        }
    };

    const removeOption = (index: number) => {
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== index));
        }
    };

    const updateOption = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleSubmit = () => {
        if (question.trim() && options.filter(o => o.trim()).length >= 2) {
            onCreatePoll(question, options.filter(o => o.trim()));
        }
    };

    const isValid = question.trim() && options.filter(o => o.trim()).length >= 2;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="card p-4 bg-[var(--bg-tertiary)]"
        >
            <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-[var(--primary)]" />
                <h3 className="font-semibold">Create Poll</h3>
            </div>

            {/* Question */}
            <input
                type="text"
                placeholder="Ask a question..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="input mb-4"
            />

            {/* Options */}
            <div className="space-y-2 mb-4">
                {options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) => updateOption(index, e.target.value)}
                            className="input flex-1"
                        />
                        {options.length > 2 && (
                            <button
                                onClick={() => removeOption(index)}
                                className="btn-icon text-[var(--accent-red)]"
                            >
                                ×
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Add option */}
            {options.length < 6 && (
                <button
                    onClick={addOption}
                    className="text-sm text-[var(--primary)] hover:underline mb-4"
                >
                    + Add option
                </button>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-2">
                <button onClick={onCancel} className="btn-secondary">
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={!isValid}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Create Poll
                </button>
            </div>
        </motion.div>
    );
}

// Helper function
function formatTimeRemaining(date: Date): string {
    const now = new Date();
    const diff = date.getTime() - now.getTime();

    if (diff <= 0) return 'now';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `in ${days}d`;
    if (hours > 0) return `in ${hours}h`;

    const minutes = Math.floor(diff / (1000 * 60));
    return `in ${minutes}m`;
}
