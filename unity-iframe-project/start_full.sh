#!/bin/bash

echo "🎮 Анимированный персонаж - Запуск"
echo "=================================="

# Проверяем Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 не найден. Установите Python для запуска сервера"
    exit 1
fi

# Переходим в директорию проекта
cd "$(dirname "$0")/web-interface"

# Находим свободный порт
PORT=8000
while lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; do
    PORT=$((PORT + 1))
done

# Запускаем веб-сервер
echo "🚀 Запуск веб-сервера на порту $PORT..."
echo "📱 Откройте браузер: http://localhost:$PORT"
echo "⏹️  Для остановки нажмите Ctrl+C"
echo ""

python3 -m http.server $PORT