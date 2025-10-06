import React, { useState, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Компонент для загрузки внешних GLB моделей
function ExternalModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  
  // Клонируем сцену для избежания мутаций
  const clonedScene = React.useMemo(() => {
    const cloned = scene.clone();
    cloned.scale.set(2, 2, 2);
    cloned.position.y = 0;
    
    // Включаем тени для всех мешей
    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    
    return cloned;
  }, [scene]);

  return <primitive object={clonedScene} />;
}

// Компонент для загрузки файлов
export function ModelUploader({ onModelLoad }: { onModelLoad: (url: string) => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File) => {
    if (file.type === 'application/octet-stream' || file.name.endsWith('.glb') || file.name.endsWith('.gltf')) {
      const url = URL.createObjectURL(file);
      onModelLoad(url);
    } else {
      alert('Пожалуйста, выберите файл в формате GLB или GLTF');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <div className="control-group">
      <div
        className={`upload-area ${isDragging ? 'dragging' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="upload-content">
          <div className="upload-icon">📁</div>
          <p>Перетащите GLB/GLTF файл сюда</p>
          <p className="upload-subtitle">или нажмите для выбора</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".glb,.gltf"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
}

export { ExternalModel };
