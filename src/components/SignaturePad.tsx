'use client';

import { useRef, useEffect, useState } from 'react';

interface SignaturePadProps {
  value?: string; // Base64 image data
  onChange: (signature: string) => void;
  width?: number;
  height?: number;
}

export default function SignaturePad({ value, onChange, width = 800, height = 200 }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [hasDrawn, setHasDrawn] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setContext(ctx);

    // Set up canvas styling
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Load existing signature if provided
    if (value) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        setHasDrawn(true);
      };
      img.src = value;
    }
  }, [value]);

  // Add global mouse/touch up listeners to handle drawing outside canvas
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDrawing && context) {
        const { x, y } = getCoordinates(e);
        context.lineTo(x, y);
        context.stroke();
      }
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (isDrawing && context) {
        e.preventDefault();
        const { x, y } = getCoordinates(e);
        context.lineTo(x, y);
        context.stroke();
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDrawing) {
        stopDrawing();
      }
    };

    const handleGlobalTouchEnd = () => {
      if (isDrawing) {
        stopDrawing();
      }
    };

    if (isDrawing) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
    }
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchend', handleGlobalTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('touchmove', handleGlobalTouchMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, [isDrawing, context]);

  const getCoordinates = (e: MouseEvent | TouchEvent | React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!context) return;

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsDrawing(true);
    setHasDrawn(true);

    const { x, y } = getCoordinates(e);
    context.beginPath();
    context.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing || !context) return;

    const { x, y } = getCoordinates(e);
    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    // Set timeout to end the stroke after 2 seconds
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Just clear the timeout, don't close the path (it causes visual artifacts)
    timeoutRef.current = setTimeout(() => {
      // Path will naturally end when next stroke starts
    }, 2000);

    // Save signature as base64 with compression
    const canvas = canvasRef.current;
    if (canvas && hasDrawn) {
      // Create a temporary canvas for compression
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');

      // Reduce size to 50% for compression
      tempCanvas.width = canvas.width / 2;
      tempCanvas.height = canvas.height / 2;

      if (tempCtx) {
        tempCtx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);
        // Use 0.5 quality for JPEG-like compression
        const dataUrl = tempCanvas.toDataURL('image/jpeg', 0.5);
        onChange(dataUrl);
      }
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    onChange('');

    // Clear any pending timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-2">
      <div className="border-4 border-blue-500 rounded-lg p-2 bg-gray-50 inline-block select-none">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          className="cursor-crosshair touch-none bg-white rounded"
          style={{ display: 'block', width: '100%', maxWidth: `${width}px`, height: `${height}px` }}
        />
      </div>
      <button
        type="button"
        onClick={clearSignature}
        className="text-sm text-red-600 hover:text-red-800 underline"
      >
        Limpiar firma
      </button>
    </div>
  );
}
