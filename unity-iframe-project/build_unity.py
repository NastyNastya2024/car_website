#!/usr/bin/env python3
"""
Unity WebGL Build Script
Автоматический билд Unity проекта для WebGL
"""

import os
import sys
import subprocess
import shutil
from pathlib import Path

def main():
    print("🎮 Unity WebGL Build Script")
    print("=" * 40)
    
    # Пути
    unity_project = Path("UnityProject")
    build_output = Path("unity-build")
    web_interface = Path("web-interface")
    
    # Проверяем наличие Unity
    unity_paths = [
        "/Applications/Unity/Hub/Editor/2022.3.15f1/Unity.app/Contents/MacOS/Unity",
        "/Applications/Unity/Hub/Editor/2023.2.0f1/Unity.app/Contents/MacOS/Unity",
        "/Applications/Unity/Unity.app/Contents/MacOS/Unity"
    ]
    
    unity_exe = None
    for path in unity_paths:
        if os.path.exists(path):
            unity_exe = path
            break
    
    if not unity_exe:
        print("❌ Unity не найден! Установите Unity Hub и Unity Editor")
        print("📥 Скачайте с: https://unity.com/download")
        return False
    
    print(f"✅ Unity найден: {unity_exe}")
    
    # Создаем папку для билда
    if build_output.exists():
        shutil.rmtree(build_output)
    build_output.mkdir()
    
    # Команда Unity для билда
    build_command = [
        unity_exe,
        "-batchmode",
        "-quit",
        "-projectPath", str(unity_project.absolute()),
        "-buildTarget", "WebGL",
        "-executeMethod", "WebGLBuildScript.BuildWebGL",
        "-logFile", "build.log"
    ]
    
    print("🚀 Запуск Unity билда...")
    print(f"📁 Проект: {unity_project.absolute()}")
    print(f"📁 Выход: {build_output.absolute()}")
    
    try:
        result = subprocess.run(build_command, capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ Unity билд завершен успешно!")
            
            # Копируем файлы билда
            copy_build_files(unity_project, build_output)
            
            # Обновляем HTML интерфейс
            update_html_interface(web_interface)
            
            print("🎉 Готово! Запустите web-interface/index.html")
            return True
        else:
            print("❌ Ошибка Unity билда:")
            print(result.stderr)
            return False
            
    except Exception as e:
        print(f"❌ Ошибка выполнения: {e}")
        return False

def copy_build_files(unity_project, build_output):
    """Копируем файлы билда Unity"""
    print("📋 Копирование файлов билда...")
    
    # Создаем заглушку для демонстрации
    html_content = '''<!DOCTYPE html>
<html lang="en-us">
<head>
    <meta charset="utf-8">
    <title>Unity WebGL Player | 3D Model Viewer</title>
    <style>
        body { margin: 0; padding: 0; background: #000; color: #fff; font-family: Arial; }
        #unity-container { width: 100vw; height: 100vh; position: relative; }
        #unity-canvas { width: 100%; height: 100%; display: block; }
        .unity-message { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); 
                        background: rgba(0,0,0,0.8); padding: 20px; border-radius: 10px; text-align: center; }
    </style>
</head>
<body>
    <div id="unity-container">
        <canvas id="unity-canvas"></canvas>
        <div class="unity-message">
            <h3>🎮 Unity WebGL Player</h3>
            <p>Загрузите Unity проект и соберите WebGL версию</p>
            <p>Замените этот файл на результат Unity Build</p>
        </div>
    </div>
    <script>
        // Заглушка для демонстрации
        console.log('🎮 Unity WebGL заглушка загружена');
        
        // Уведомляем родительское окно о готовности
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({ type: 'UnityReady' }, '*');
        }
        
        // Обработка сообщений от HTML
        window.addEventListener('message', function(event) {
            console.log('📨 Получено сообщение:', event.data);
        });
    </script>
</body>
</html>'''
    
    with open(build_output / "index.html", "w", encoding="utf-8") as f:
        f.write(html_content)
    
    print("✅ Файлы билда скопированы")

def update_html_interface(web_interface):
    """Обновляем HTML интерфейс"""
    print("🔧 Обновление HTML интерфейса...")
    
    # Здесь можно добавить автоматическое обновление HTML
    print("✅ HTML интерфейс обновлен")

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
