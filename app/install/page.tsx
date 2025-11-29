import React from 'react';
import { Share, Plus, Home } from 'lucide-react';

export default function InstallPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-400 to-green-600 rounded-3xl flex items-center justify-center shadow-lg">
                        <span className="text-5xl">👨‍🍳</span>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">
                        Установить Шеф ИИ
                    </h1>
                    <p className="text-lg text-gray-600">
                        Установите приложение на свой iPhone для быстрого доступа
                    </p>
                </div>

                {/* Instructions */}
                <div className="bg-white rounded-3xl shadow-xl p-8 space-y-8">
                    {/* Step 1 */}
                    <div className="flex gap-6">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-green-500 text-white rounded-2xl flex items-center justify-center text-xl font-bold">
                                1
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                Откройте в Safari
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Убедитесь, что вы открыли эту страницу в браузере <strong>Safari</strong> (не в Chrome или другом браузере).
                            </p>
                            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                                <p className="text-sm text-blue-800">
                                    💡 <strong>Совет:</strong> Если вы сейчас в другом браузере, скопируйте эту ссылку и откройте в Safari.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex gap-6">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-green-500 text-white rounded-2xl flex items-center justify-center text-xl font-bold">
                                2
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                Нажмите кнопку "Поделиться"
                            </h3>
                            <p className="text-gray-600 mb-4">
                                В нижней части экрана нажмите на кнопку <Share className="inline w-5 h-5 text-blue-500" /> "Поделиться"
                                (квадрат со стрелкой вверх).
                            </p>
                            <div className="bg-gray-100 rounded-2xl p-4 flex items-center justify-center">
                                <div className="w-12 h-12 border-2 border-blue-500 rounded-xl flex items-center justify-center">
                                    <Share className="w-6 h-6 text-blue-500" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex gap-6">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-green-500 text-white rounded-2xl flex items-center justify-center text-xl font-bold">
                                3
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                Выберите "На экран Домой"
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Прокрутите список вниз и найдите пункт <strong>"На экран Домой"</strong> или <strong>"Add to Home Screen"</strong>.
                            </p>
                            <div className="bg-gray-100 rounded-2xl p-4 flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow">
                                    <Plus className="w-6 h-6 text-gray-700" />
                                </div>
                                <span className="font-medium text-gray-700">На экран Домой</span>
                            </div>
                        </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex gap-6">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-green-500 text-white rounded-2xl flex items-center justify-center text-xl font-bold">
                                4
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                Подтвердите установку
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Нажмите <strong>"Добавить"</strong> в правом верхнем углу.
                            </p>
                        </div>
                    </div>

                    {/* Step 5 */}
                    <div className="flex gap-6">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-green-500 text-white rounded-2xl flex items-center justify-center">
                                ✓
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                Готово! 🎉
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Приложение <strong>Шеф ИИ</strong> появится на главном экране вашего iPhone.
                                Теперь вы можете запускать его как обычное приложение!
                            </p>
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
                                <Home className="w-6 h-6 text-green-600" />
                                <span className="text-green-800 font-medium">Найдите иконку на главном экране</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features */}
                <div className="mt-12 grid gap-6 sm:grid-cols-2">
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <div className="text-3xl mb-3">⚡</div>
                        <h4 className="font-semibold text-gray-900 mb-2">Быстрый запуск</h4>
                        <p className="text-sm text-gray-600">Открывайте приложение одним касанием</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <div className="text-3xl mb-3">📱</div>
                        <h4 className="font-semibold text-gray-900 mb-2">Полный экран</h4>
                        <p className="text-sm text-gray-600">Работает как нативное приложение</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <div className="text-3xl mb-3">🔔</div>
                        <h4 className="font-semibold text-gray-900 mb-2">Уведомления</h4>
                        <p className="text-sm text-gray-600">Получайте важные обновления</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <div className="text-3xl mb-3">💾</div>
                        <h4 className="font-semibold text-gray-900 mb-2">Работает офлайн</h4>
                        <p className="text-sm text-gray-600">Доступ даже без интернета</p>
                    </div>
                </div>

                {/* Back Button */}
                <div className="mt-12 text-center">
                    <a
                        href="/"
                        className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg transition-colors"
                    >
                        Вернуться к приложению
                    </a>
                </div>
            </div>
        </div>
    );
}
