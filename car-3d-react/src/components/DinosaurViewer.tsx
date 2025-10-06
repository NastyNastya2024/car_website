import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Grid, OrbitControls } from '@react-three/drei';
import { FBXLoader } from 'three-stdlib';
import * as THREE from 'three';
import './DinosaurViewer.css';

// Хук для загрузки FBX файлов
function useFBX(url: string) {
  const [scene, setScene] = React.useState<THREE.Group | null>(null);
  const [animations, setAnimations] = React.useState<THREE.AnimationClip[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    console.log('🚀 Начинаем загрузку FBX:', url);
    const loader = new FBXLoader();
    
    loader.load(
      url,
      (fbx) => {
        console.log('✅ FBX файл загружен успешно:', fbx);
        console.log('📊 Тип объекта:', fbx.type);
        console.log('📊 Количество детей:', fbx.children.length);
        console.log('📊 Анимации в FBX:', fbx.animations);
        console.log('📊 Имена анимаций:', fbx.animations.map(a => a.name));
        
        setScene(fbx);
        setAnimations(fbx.animations);
        setLoading(false);
      },
      (progress) => {
        const percent = progress.total > 0 ? (progress.loaded / progress.total) * 100 : 0;
        console.log('📥 Прогресс загрузки FBX:', percent.toFixed(1) + '%');
      },
      (err) => {
        console.error('❌ Ошибка загрузки FBX:', err);
        console.error('❌ Детали ошибки:', {
          message: err.message,
          type: err.type,
          target: err.target
        });
        setError(err.message);
        setLoading(false);
      }
    );
  }, [url]);

  return { scene, animations, loading, error };
}

function DinosaurModel() {
  const groupRef = useRef<THREE.Group>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const headBoneRef = useRef<THREE.Bone | null>(null);
  const armBoneRef = useRef<THREE.Bone | null>(null);

  // Загружаем FBX файл вместо GLB
  const { scene, animations, loading, error } = useFBX('/models/Dancing Twerk.fbx');

  // Найти кости в скелете
  useEffect(() => {
    if (!scene) return;
    
    console.log('🔍 Поиск костей в танцующей FBX модели...');
    console.log('📊 Доступные анимации:', animations.map(a => a.name));
    
    // traverse по узлам сцены, ищем SkinnedMesh
    scene.traverse((child) => {
      console.log('🔍 Объект:', child.name, 'Тип:', child.type);
      
      if ((child as any).isSkinnedMesh) {
        const skinned = child as THREE.SkinnedMesh;
        const bones = skinned.skeleton.bones;
        console.log('✅ Найдены кости в SkinnedMesh:', bones.map(b => b.name));

        // Ищем кость головы и кость руки для танцующей модели
        const head = bones.find(b => 
          b.name === 'MCH_INT_HEAD' || 
          b.name === 'DEF_NECK_001' ||
          b.name.toLowerCase().includes('head') ||
          b.name.toLowerCase().includes('neck') ||
          b.name.toLowerCase().includes('skull') ||
          b.name.toLowerCase().includes('jaw') ||
          b.name.toLowerCase().includes('cranium')
        );
        
        const arm = bones.find(b => 
          b.name === 'MCH_INT_ARM.L' || 
          b.name === 'DEF_ARML' ||
          b.name === 'CTRL_IK_ARM_CHAIN.L' ||
          b.name.toLowerCase().includes('arm') ||
          b.name.toLowerCase().includes('hand') ||
          b.name.toLowerCase().includes('forearm') ||
          b.name.toLowerCase().includes('upperarm') ||
          b.name.toLowerCase().includes('shoulder')
        );

        if (head) {
          headBoneRef.current = head;
          console.log('🎯 Найдена кость головы:', head.name);
        } else {
          console.log('❌ Кость головы не найдена');
        }
        
        if (arm) {
          armBoneRef.current = arm;
          console.log('✋ Найдена кость руки:', arm.name);
        } else {
          console.log('❌ Кость руки не найдена');
        }
      }
    });

    if (groupRef.current) {
      mixerRef.current = new THREE.AnimationMixer(groupRef.current);
      console.log('🎬 Создан AnimationMixer');

      // Сначала попробуем воспроизвести встроенные анимации модели
      if (animations.length > 0) {
        console.log('🎭 Попытка воспроизвести встроенные анимации...');
        animations.forEach((clip, index) => {
          const action = mixerRef.current!.clipAction(clip, groupRef.current!);
          action.setLoop(THREE.LoopRepeat, Infinity);
          action.play();
          console.log(`🎬 Запущена встроенная анимация ${index}: ${clip.name}`);
        });
      } else {
        console.log('❌ Встроенные анимации не найдены, создаем собственные...');
        
        // Создаём анимацию для головы — поворот к зрителю
        if (headBoneRef.current) {
          const times = [0, 1, 2, 3, 4]; // в секундах
          const values = [0, Math.PI * 0.2, -Math.PI * 0.2, Math.PI * 0.3, 0]; // поворот в радианах
          const trackName = `${headBoneRef.current.name}.rotation[y]`;
          const headTrack = new THREE.NumberKeyframeTrack(trackName, times, values);
          const headClip = new THREE.AnimationClip('HeadTurn', 4, [headTrack]);
          const headAction = mixerRef.current.clipAction(headClip, groupRef.current);
          headAction.setLoop(THREE.LoopRepeat, Infinity);
          headAction.play();
          console.log('🎯 Запущена анимация головы');
        }

        // Создаём анимацию для руки — танцевальные движения
        if (armBoneRef.current) {
          const times = [0, 0.5, 1, 1.5, 2];
          const values = [0, Math.PI * 0.4, Math.PI * 0.8, Math.PI * 0.4, 0]; // вращение по Z
          const trackName = `${armBoneRef.current.name}.rotation[z]`;
          const armTrack = new THREE.NumberKeyframeTrack(trackName, times, values);
          const armClip = new THREE.AnimationClip('DanceMove', 2, [armTrack]);
          const armAction = mixerRef.current.clipAction(armClip, groupRef.current);
          armAction.setLoop(THREE.LoopRepeat, Infinity);
          armAction.play();
          console.log('💃 Запущена танцевальная анимация руки');
        }

        // Создаём общую анимацию танца для танцующей модели
        const danceTimes = [0, 1, 2, 3, 4];
        const danceValuesY = [0, Math.PI * 0.2, -Math.PI * 0.2, Math.PI * 0.3, 0]; // Более активные повороты
        const danceValuesYPos = [0, 0.2, -0.2, 0.3, 0]; // Прыжки для танца
        const danceValuesX = [0, 0.2, -0.2, 0.3, 0]; // Боковые движения для танца
        
        const danceTrackY = new THREE.NumberKeyframeTrack('.rotation[y]', danceTimes, danceValuesY);
        const danceTrackYPos = new THREE.NumberKeyframeTrack('.position[y]', danceTimes, danceValuesYPos);
        const danceTrackX = new THREE.NumberKeyframeTrack('.position[x]', danceTimes, danceValuesX);
        
        const danceClip = new THREE.AnimationClip('TwerkDance', 4, [danceTrackY, danceTrackYPos, danceTrackX]);
        const danceAction = mixerRef.current.clipAction(danceClip, groupRef.current);
        danceAction.setLoop(THREE.LoopRepeat, Infinity);
        danceAction.play();
        console.log('💃 Запущена танцевальная анимация Twerk');
      }
    }

    return () => {
      // очистка: uncache clips
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
        animations.forEach(clip => mixerRef.current?.uncacheClip(clip));
        console.log('🧹 Очистка анимаций');
      }
    };
  }, [scene, animations]);

  // Обновление миксера каждый кадр
  useFrame((_, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
  });

  // Клонируем сцену для избежания мутаций
  const clonedScene = React.useMemo(() => {
    if (!scene) return null;
    
    const cloned = scene.clone();
    cloned.scale.set(2.5, 2.5, 2.5);
    cloned.position.y = 0;
    cloned.rotation.y = Math.PI / 4; // Поворачиваем динозавра к зрителю
    
    // Включаем тени для всех мешей
    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    
    return cloned;
  }, [scene]);

  // Показываем загрузку или ошибку
  if (loading) {
    return (
      <div style={{ 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)',
        color: 'white',
        fontSize: '18px',
        textAlign: 'center',
        background: 'rgba(0,0,0,0.7)',
        padding: '20px',
        borderRadius: '10px'
      }}>
        💃 Загрузка танцующей модели...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)',
        color: 'red',
        fontSize: '18px',
        textAlign: 'center',
        background: 'rgba(0,0,0,0.7)',
        padding: '20px',
        borderRadius: '10px'
      }}>
        ❌ Ошибка загрузки: {error}
      </div>
    );
  }

  if (!scene) {
    return (
      <div style={{ 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)',
        color: 'yellow',
        fontSize: '18px',
        textAlign: 'center',
        background: 'rgba(0,0,0,0.7)',
        padding: '20px',
        borderRadius: '10px'
      }}>
        ⚠️ Модель не загружена
      </div>
    );
  }

  return (
    <group ref={groupRef}>
      {clonedScene && <primitive object={clonedScene} />}
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, 10, -10]} intensity={0.8} color="#FFD700" />
      <Environment preset="sunset" />
      <Grid
        args={[20, 20]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#6f6f6f"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#9d4edd"
        fadeDistance={30}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={true}
      />
      <DinosaurModel />
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        autoRotate={false}
        autoRotateSpeed={2}
        maxPolarAngle={Math.PI / 2}
        minDistance={3}
        maxDistance={20}
      />
    </>
  );
}

export default function DinosaurViewer() {
  return (
    <div className="dinosaur-viewer-container">
      <div className="canvas-wrapper">
        <Canvas
          shadows
          camera={{ position: [5, 3, 5], fov: 75 }}
          style={{
            background:
              'linear-gradient(135deg, #87CEEB 0%, #98FB98 50%, #DDA0DD 100%)',
          }}
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}