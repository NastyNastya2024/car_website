@echo off
echo 🎮 Запуск Unity iframe проекта...
echo 📁 Директория: %CD%

cd web-interface
echo 🚀 Запуск сервера на http://localhost:8000
echo 📱 Откройте браузер и перейдите по адресу выше
echo ⏹️  Для остановки нажмите Ctrl+C

python -m http.server 8000
if errorlevel 1 (
    echo ❌ Python не найден. Установите Python для запуска локального сервера
    echo 📁 Или откройте файл web-interface/index.html напрямую в браузере
    pause
)
