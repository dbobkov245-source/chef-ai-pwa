'use client';

import React, { useState, useEffect } from 'react';
import { Recipe } from '../../types';
import { useLocalStorage } from '../../hooks';
import {
    ShoppingCart,
    Plus,
    Minus,
    Check,
    Trash2,
    Share2,
    Copy,
    X,
    ChefHat
} from 'lucide-react';

interface ShoppingItem {
    id: string;
    text: string;
    checked: boolean;
    quantity: number;
    recipeId?: string;
    recipeName?: string;
}

interface ShoppingListProps {
    onClose: () => void;
}

const ShoppingList: React.FC<ShoppingListProps> = ({ onClose }) => {
    const [items, setItems] = useLocalStorage<ShoppingItem[]>('chef_ai_shopping_list', []);
    const [newItem, setNewItem] = useState('');
    const [copied, setCopied] = useState(false);

    const addItem = (text: string, recipeId?: string, recipeName?: string) => {
        if (!text.trim()) return;

        // Check if item already exists
        const existing = items.find(
            (item) => item.text.toLowerCase() === text.toLowerCase().trim()
        );

        if (existing) {
            setItems((prev) =>
                prev.map((item) =>
                    item.id === existing.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            );
        } else {
            const newShoppingItem: ShoppingItem = {
                id: crypto.randomUUID(),
                text: text.trim(),
                checked: false,
                quantity: 1,
                recipeId,
                recipeName,
            };
            setItems((prev) => [...prev, newShoppingItem]);
        }
        setNewItem('');
    };

    const toggleItem = (id: string) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, checked: !item.checked } : item
            )
        );
    };

    const removeItem = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const updateQuantity = (id: string, delta: number) => {
        setItems((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    const newQty = Math.max(1, item.quantity + delta);
                    return { ...item, quantity: newQty };
                }
                return item;
            })
        );
    };

    const clearChecked = () => {
        setItems((prev) => prev.filter((item) => !item.checked));
    };

    const clearAll = () => {
        setItems([]);
    };

    const copyToClipboard = async () => {
        const text = items
            .filter((i) => !i.checked)
            .map((i) => `${i.quantity > 1 ? `${i.quantity}x ` : ''}${i.text}`)
            .join('\n');

        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const shareList = async () => {
        const text = items
            .filter((i) => !i.checked)
            .map((i) => `${i.quantity > 1 ? `${i.quantity}x ` : ''}${i.text}`)
            .join('\n');

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Список покупок - Шеф ИИ',
                    text: `Мой список покупок:\n\n${text}`,
                });
            } catch (err) {
                console.error('Share failed:', err);
            }
        } else {
            copyToClipboard();
        }
    };

    const uncheckedCount = items.filter((i) => !i.checked).length;
    const checkedCount = items.filter((i) => i.checked).length;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
            <div className="bg-white dark:bg-surface-dark w-full max-w-lg max-h-[85vh] rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col animate-fade-in-up">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-primary/10">
                    <div className="flex items-center gap-3">
                        <ShoppingCart className="text-primary" size={24} />
                        <div>
                            <h2 className="text-lg font-bold text-text-main dark:text-white">
                                Список покупок
                            </h2>
                            <p className="text-xs text-text-secondary dark:text-gray-400">
                                {uncheckedCount} {uncheckedCount === 1 ? 'товар' : 'товаров'}
                                {checkedCount > 0 && ` • ${checkedCount} куплено`}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                        <X size={20} className="text-text-main dark:text-white" />
                    </button>
                </div>

                {/* Add Item Form */}
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            addItem(newItem);
                        }}
                        className="flex gap-2"
                    >
                        <input
                            type="text"
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                            placeholder="Добавить товар..."
                            className="flex-1 px-4 py-3 bg-gray-50 dark:bg-background-dark border-0 rounded-xl text-text-main dark:text-white placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button
                            type="submit"
                            disabled={!newItem.trim()}
                            className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-text-main disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark transition-colors"
                        >
                            <Plus size={24} />
                        </button>
                    </form>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {items.length === 0 ? (
                        <div className="text-center py-12">
                            <ShoppingCart className="mx-auto text-gray-300 dark:text-gray-600 mb-3" size={48} />
                            <p className="text-text-secondary dark:text-gray-400">
                                Список пуст
                            </p>
                            <p className="text-xs text-text-secondary dark:text-gray-500 mt-1">
                                Добавьте товары или нажмите "Добавить в список" на карточке рецепта
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {/* Unchecked items first */}
                            {items
                                .filter((i) => !i.checked)
                                .map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-background-dark rounded-xl group"
                                    >
                                        <button
                                            onClick={() => toggleItem(item.id)}
                                            className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-primary transition-colors"
                                        >
                                            {/* Empty */}
                                        </button>
                                        <span className="flex-1 text-text-main dark:text-white">
                                            {item.text}
                                        </span>
                                        {item.recipeName && (
                                            <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                                                {item.recipeName.split(' ').slice(0, 2).join(' ')}
                                            </span>
                                        )}
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => updateQuantity(item.id, -1)}
                                                className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-text-main dark:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-6 text-center text-sm font-medium text-text-main dark:text-white">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.id, 1)}
                                                className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-text-main dark:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}

                            {/* Divider if there are checked items */}
                            {checkedCount > 0 && uncheckedCount > 0 && (
                                <div className="flex items-center gap-3 py-2">
                                    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                                    <span className="text-xs text-text-secondary dark:text-gray-500">
                                        Куплено
                                    </span>
                                    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                                </div>
                            )}

                            {/* Checked items */}
                            {items
                                .filter((i) => i.checked)
                                .map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-3 p-3 bg-gray-50/50 dark:bg-background-dark/50 rounded-xl group opacity-60"
                                    >
                                        <button
                                            onClick={() => toggleItem(item.id)}
                                            className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                                        >
                                            <Check size={14} className="text-white" />
                                        </button>
                                        <span className="flex-1 text-text-main dark:text-white line-through">
                                            {item.text}
                                        </span>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                {items.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between gap-3">
                        <div className="flex gap-2">
                            {checkedCount > 0 && (
                                <button
                                    onClick={clearChecked}
                                    className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                                >
                                    Удалить купленное
                                </button>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={copyToClipboard}
                                className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                title="Копировать"
                            >
                                {copied ? (
                                    <Check size={18} className="text-primary" />
                                ) : (
                                    <Copy size={18} className="text-text-main dark:text-white" />
                                )}
                            </button>
                            <button
                                onClick={shareList}
                                className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center hover:bg-primary-dark transition-colors"
                                title="Поделиться"
                            >
                                <Share2 size={18} className="text-text-main" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShoppingList;

// Hook to add items from recipe
export function useShoppingList() {
    const [items, setItems] = useLocalStorage<ShoppingItem[]>('chef_ai_shopping_list', []);

    const addFromRecipe = (recipe: Recipe) => {
        const newItems: ShoppingItem[] = recipe.ingredients.map((ing) => ({
            id: crypto.randomUUID(),
            text: ing,
            checked: false,
            quantity: 1,
            recipeId: recipe.id,
            recipeName: recipe.title,
        }));

        setItems((prev) => {
            const existingTexts = new Set(prev.map((i) => i.text.toLowerCase()));
            const uniqueNew = newItems.filter(
                (item) => !existingTexts.has(item.text.toLowerCase())
            );
            return [...prev, ...uniqueNew];
        });

        return newItems.length;
    };

    return { items, addFromRecipe, itemCount: items.filter((i) => !i.checked).length };
}
