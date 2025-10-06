# 🎮 Unity iframe Integration - Полное руководство

Полнофункциональная интеграция Unity WebGL с HTML через iframe с двусторонней коммуникацией.

## 🚀 Быстрый старт

### 1. Запуск с заглушкой Unity
```bash
cd unity-iframe-project
./start_full.sh
# Откройте http://localhost:8000
```

### 2. Запуск с реальным Unity
1. Установите Unity Hub и Unity Editor
2. Откройте проект `UnityProject` в Unity
3. Следуйте инструкциям в `UNITY_SETUP.md`
4. Соберите WebGL версию
5. Запустите `./start_full.sh`

## 📁 Структура проекта

```
unity-iframe-project/
├── web-interface/           # HTML интерфейс
│   └── index.html          # Основной HTML файл
├── unity-build/            # Unity WebGL билд
│   └── index.html          # Unity приложение
├── UnityProject/           # Unity проект
│   ├── Assets/
│   │   ├── Scripts/        # C# скрипты
│   │   ├── Plugins/WebGL/  # JavaScript плагины
│   │   ├── Scenes/         # Unity сцены
│   │   └── Models/         # 3D модели
│   └── ProjectSettings/    # Настройки проекта
├── build_unity.py          # Скрипт автоматического билда
├── start_full.sh           # Полный запуск
└── UNITY_SETUP.md          # Инструкции по Unity
```

## 🎯 Возможности

### HTML интерфейс
- ✅ Красивый UI с градиентным фоном
- ✅ Панель управления анимациями
- ✅ Смена 3D моделей (Динозавр, Дракон, Персонаж)
- ✅ Управление камерой (Сброс, Автоповорот)
- ✅ Настройки (Масштаб, Скорость анимации)
- ✅ Полноэкранный режим
- ✅ Горячие клавиши (Пробел, R, F)
- ✅ FPS мониторинг
- ✅ Статус подключения

### Unity интеграция
- ✅ iframe загрузка Unity WebGL
- ✅ Двусторонняя коммуникация HTML ↔ Unity
- ✅ Управление анимациями из HTML
- ✅ Смена моделей в реальном времени
- ✅ Настройка параметров
- ✅ Обработка ошибок
- ✅ Автоматическое создание 3D моделей

## 🎮 Управление

### Горячие клавиши
- `Пробел` - Запустить танец
- `R` - Сбросить камеру
- `F` - Полноэкранный режим

### Панель управления
- **Анимации:** Танец, Приветствие, Покой, Прыжок
- **Модели:** Динозавр, Дракон, Персонаж
- **Камера:** Сброс, Автоповорот
- **Настройки:** Масштаб (0.1x - 3.0x), Скорость (0.1x - 3.0x)

## 🔧 Настройка Unity

### 1. Установка Unity
1. Скачайте Unity Hub: https://unity.com/download
2. Установите Unity Editor 2022.3.15f1 или новее
3. Откройте проект `UnityProject`

### 2. Настройка сцены
1. Создайте сцену `Assets/Scenes/MainScene.unity`
2. Добавьте Empty GameObject "WebGLManager"
3. Добавьте компонент `WebGLCommunication`
4. Настройте параметры

### 3. Создание моделей
1. Добавьте `ModelCreator` компонент
2. Нажмите Play - модели создадутся автоматически
3. Перетащите модели в WebGLManager

### 4. WebGL настройки
1. `File → Build Settings → WebGL`
2. `Edit → Project Settings → Player → WebGL`:
   - Compression Format: Gzip
   - Data Caching: Enabled
   - Memory Size: 512MB

## 🚀 Сборка проекта

### Автоматический билд
```bash
python3 build_unity.py
```

### Ручной билд
1. В Unity: `Build → Build WebGL`
2. Выберите папку `../unity-build`
3. Дождитесь завершения

## 📱 Коммуникация HTML ↔ Unity

### HTML → Unity
```javascript
// Отправка команды в Unity
unityFrame.contentWindow.postMessage({
    type: 'CallUnityMethod',
    method: 'PlayAnimation',
    parameter: 'dance'
}, '*');
```

### Unity → HTML
```csharp
// Отправка сообщения в HTML
SendMessageToHTML("UnityReady");
```

## 🎨 Кастомизация

### Изменение стилей
Отредактируйте CSS в `web-interface/index.html`:
```css
.sidebar {
    background: rgba(0, 0, 0, 0.8);  /* Цвет панели */
    width: 300px;                    /* Ширина панели */
}
```

### Добавление новых анимаций
1. В Unity создайте анимацию
2. Добавьте кнопку в HTML
3. Создайте функцию в JavaScript
4. Добавьте обработку в Unity

### Добавление новых моделей
1. В Unity создайте модель
2. Добавьте в массив Models в WebGLManager
3. Добавьте кнопку в HTML
4. Создайте функцию смены модели

## 🐛 Отладка

### Консоль браузера
- Откройте Developer Tools (F12)
- Проверьте Console на ошибки
- Ищите сообщения Unity

### Unity Console
- В Unity: `Window → General → Console`
- Проверьте ошибки скриптов

### Сетевые запросы
- Проверьте Network tab в DevTools
- Убедитесь, что Unity файлы загружаются

## 📦 Развертывание

### Локальный сервер
```bash
# Python
python3 -m http.server 8000

# Node.js
npx http-server -p 8000

# PHP
php -S localhost:8000
```

### Веб-сервер
1. Загрузите файлы на сервер
2. Убедитесь, что MIME типы настроены
3. Проверьте CORS настройки

## 🔗 Полезные ссылки

- [Unity WebGL Documentation](https://docs.unity3d.com/Manual/webgl.html)
- [Unity WebGL Build Settings](https://docs.unity3d.com/Manual/webgl-build.html)
- [PostMessage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
- [Unity Animation System](https://docs.unity3d.com/Manual/AnimationSection.html)

## 📝 Лицензия

MIT License - используйте свободно для любых целей.

---

**🎮 Готово к использованию!** 

1. **Быстрый старт:** `./start_full.sh`
2. **С Unity:** Следуйте `UNITY_SETUP.md`
3. **Кастомизация:** Редактируйте файлы по необходимости

**Удачи в разработке!** 🚀
