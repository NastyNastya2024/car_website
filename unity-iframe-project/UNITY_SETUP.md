# 🎮 Unity Setup Guide

Пошаговое руководство по настройке Unity проекта для WebGL интеграции.

## 📋 Требования

- Unity Hub 3.0+
- Unity Editor 2022.3.15f1 или новее
- Python 3.6+ (для скриптов билда)

## 🚀 Быстрая настройка

### 1. Открытие проекта
1. Запустите Unity Hub
2. Нажмите "Open" → "Add project from disk"
3. Выберите папку `UnityProject`
4. Unity откроет проект

### 2. Настройка сцены
1. Создайте новую сцену: `File → New Scene`
2. Сохраните как `Assets/Scenes/MainScene.unity`
3. Добавьте на сцену:
   - **Main Camera** (уже есть)
   - **Directional Light** (уже есть)
   - **Empty GameObject** с именем "WebGLManager"

### 3. Настройка WebGLManager
1. Выберите объект "WebGLManager"
2. Добавьте компонент `WebGLCommunication`
3. Настройте параметры:
   - **Models**: Перетащите 3D модели в массив
   - **Animators**: Перетащите аниматоры в массив
   - **Camera Transform**: Перетащите Main Camera

### 4. Создание 3D моделей
1. Создайте Empty GameObject с именем "ModelCreator"
2. Добавьте компонент `ModelCreator`
3. Нажмите Play - модели создадутся автоматически
4. Остановите Play режим
5. Перетащите созданные модели в WebGLManager

### 5. Настройка анимаций
1. Для каждой модели добавьте компонент `SimpleAnimator`
2. Настройте параметры анимации
3. Создайте Animator Controller:
   - `Window → Animation → Animator`
   - Создайте параметры: Dance, Wave, Idle, Jump
   - Создайте переходы между состояниями

## 🔧 WebGL настройки

### Build Settings
1. `File → Build Settings`
2. Выберите **WebGL** платформу
3. Нажмите "Switch Platform"
4. Добавьте сцену `MainScene` в Scenes In Build

### Player Settings
1. `Edit → Project Settings → Player`
2. **WebGL Settings**:
   - Compression Format: **Gzip**
   - Data Caching: **Enabled**
   - Memory Size: **512 MB**
   - Exception Support: **Explicitly Throw Exceptions**
   - Name Files As Hashes: **Enabled**

## 🎬 Создание анимаций

### Простые анимации
1. Выберите модель
2. `Window → Animation → Animation`
3. Создайте анимации:
   - **Dance**: Покачивание и подпрыгивание
   - **Wave**: Махание рукой
   - **Idle**: Покой
   - **Jump**: Прыжок

### Animator Controller
1. Создайте Animator Controller
2. Добавьте параметры (Bool):
   - Dance
   - Wave
   - Idle
   - Jump
3. Создайте состояния и переходы

## 🚀 Сборка проекта

### Автоматический билд
```bash
cd unity-iframe-project
python3 build_unity.py
```

### Ручной билд
1. В Unity: `Build → Build WebGL`
2. Выберите папку `../unity-build`
3. Дождитесь завершения билда

## 🧪 Тестирование

### Локальное тестирование
1. Запустите HTML сервер:
   ```bash
   cd web-interface
   python3 -m http.server 8000
   ```
2. Откройте http://localhost:8000
3. Проверьте все функции

### Отладка
1. Откройте Developer Tools (F12)
2. Проверьте Console на ошибки
3. Проверьте Network на загрузку Unity

## 📁 Структура файлов

```
UnityProject/
├── Assets/
│   ├── Scripts/
│   │   ├── WebGLCommunication.cs      # Основной скрипт
│   │   ├── ModelCreator.cs            # Создание моделей
│   │   ├── SimpleAnimator.cs          # Простые анимации
│   │   └── WebGLBuildScript.cs        # Скрипт билда
│   ├── Plugins/WebGL/
│   │   └── WebGLCommunication.jslib   # JavaScript плагин
│   ├── Scenes/
│   │   └── MainScene.unity            # Главная сцена
│   └── Models/                        # 3D модели
└── ProjectSettings/                   # Настройки проекта
```

## 🐛 Решение проблем

### Unity не открывается
- Убедитесь, что Unity Hub установлен
- Проверьте версию Unity (2022.3.15f1+)

### WebGL билд не работает
- Проверьте настройки Player Settings
- Убедитесь, что выбрана WebGL платформа
- Проверьте размер памяти (512MB+)

### Коммуникация не работает
- Проверьте JavaScript плагин в Plugins/WebGL/
- Убедитесь, что WebGLCommunication.cs прикреплен к объекту
- Проверьте Console браузера на ошибки

### Анимации не воспроизводятся
- Проверьте Animator Controller
- Убедитесь, что параметры настроены правильно
- Проверьте SimpleAnimator компонент

## 📚 Полезные ссылки

- [Unity WebGL Documentation](https://docs.unity3d.com/Manual/webgl.html)
- [Unity WebGL Build Settings](https://docs.unity3d.com/Manual/webgl-build.html)
- [Unity Animation System](https://docs.unity3d.com/Manual/AnimationSection.html)

---

**🎮 Готово!** Ваш Unity проект настроен для WebGL интеграции с HTML.
