/**
 * Automatically scales down and compresses image files or base64 data URLs
 * to ensure fast rendering, minimal storage footprint, and zero localStorage QuotaExceeded errors.
 */
export async function compressImage(
  source: File | Blob | string,
  maxWidth = 1280,
  maxHeight = 1280,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const handleUrl = (url: string, shouldRevoke: boolean) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          let { width, height } = img;
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.max(1, Math.round(width * ratio));
            height = Math.max(1, Math.round(height * ratio));
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            if (shouldRevoke) URL.revokeObjectURL(url);
            resolve(typeof source === 'string' ? source : url);
            return;
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Use image/jpeg for broad Android WebView support
          let output = '';
          try {
            output = canvas.toDataURL('image/jpeg', quality);
          } catch {
            output = canvas.toDataURL('image/png');
          }

          if (shouldRevoke) URL.revokeObjectURL(url);
          resolve(output);
        } catch (err) {
          if (shouldRevoke) URL.revokeObjectURL(url);
          if (typeof source === 'string') {
            resolve(source);
          } else {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(err);
            reader.readAsDataURL(source as Blob);
          }
        }
      };

      img.onerror = () => {
        if (shouldRevoke) URL.revokeObjectURL(url);
        if (typeof source === 'string') {
          resolve(source);
        } else {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('Failed to load image'));
          reader.readAsDataURL(source as Blob);
        }
      };

      img.src = url;
    };

    if (typeof source === 'string') {
      handleUrl(source, false);
    } else {
      try {
        const objectUrl = URL.createObjectURL(source);
        handleUrl(objectUrl, true);
      } catch {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            handleUrl(reader.result, false);
          } else {
            reject(new Error('Failed to read image as Data URL'));
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(source);
      }
    }
  });
}
