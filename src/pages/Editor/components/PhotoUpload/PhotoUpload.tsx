import { useState, useRef, useCallback } from 'react';
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useCVStore } from '../../../../stores/cvStore';
import { Button, Modal } from '../../../../components/ui';
import { cn } from '../../../../lib/utils';

export function PhotoUpload() {
  const { cv, updatePersonalInfo } = useCVStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const photo = cv?.personalInfo.photo;
  const photoShape = cv?.personalInfo.photoShape || 'circle';
  const photoSize = cv?.personalInfo.photoSize || 'medium';

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32',
  };

  const shapeClasses = {
    circle: 'rounded-full',
    square: 'rounded-none',
    rounded: 'rounded-lg',
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setIsModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCroppedImage = useCallback(async (): Promise<string | null> => {
    if (!imgRef.current || !completedCrop) return null;

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    return canvas.toDataURL('image/jpeg', 0.9);
  }, [completedCrop]);

  const handleSave = async () => {
    const croppedImage = await getCroppedImage();
    if (croppedImage) {
      updatePersonalInfo({ photo: croppedImage });
    }
    setIsModalOpen(false);
    setImageSrc(null);
    setCrop(undefined);
    setCompletedCrop(undefined);
  };

  const handleRemove = () => {
    updatePersonalInfo({ photo: undefined });
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Photo</label>

      <div className="flex items-center gap-4">
        {/* Photo Preview */}
        <div
          className={cn(
            'bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300',
            sizeClasses[photoSize],
            shapeClasses[photoShape]
          )}
        >
          {photo ? (
            <img
              src={photo}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
          >
            {photo ? 'Change' : 'Upload'}
          </Button>
          {photo && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Remove
            </Button>
          )}
        </div>
      </div>

      {/* Crop Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Crop Photo"
        size="lg"
      >
        <div className="space-y-4">
          {imageSrc && (
            <div className="max-h-[400px] overflow-auto flex justify-center">
              <ReactCrop
                crop={crop}
                onChange={c => setCrop(c)}
                onComplete={c => setCompletedCrop(c)}
                aspect={1}
                circularCrop={photoShape === 'circle'}
              >
                <img
                  ref={imgRef}
                  src={imageSrc}
                  alt="Crop preview"
                  className="max-w-full"
                />
              </ReactCrop>
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!completedCrop}>
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
