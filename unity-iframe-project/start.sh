#!/bin/bash

echo "🎮 Запуск Unity iframe проекта..."
echo "📁 Директория: $(pwd)"

# Проверяем Python
if command -v python3 &> /dev/null; then
    echo "✅ Python3 найден"
    cd web-interface
    echo "🚀 Запуск сервера на http://localhost:8000"
    echo "📱 Откройте браузер и перейдите по адресу выше"
    echo "⏹️  Для остановки нажмите Ctrl+C"
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "✅ Python найден"
    cd web-interface
    echo "🚀 Запуск сервера на http://localhost:8000"
    echo "📱 Откройте браузер и перейдите по адресу выше"
    echo "⏹️  Для остановки нажмите Ctrl+C"
    python -m http.server 8000
else
    echo "❌ Python не найден. Установите Python для запуска локального сервера"
    echo "📁 Или откройте файл web-interface/index.html напрямую в браузере"
fi
