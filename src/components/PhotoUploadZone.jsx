import { useCallback, useState } from 'react';
import { Upload, X, ImagePlus, Star } from 'lucide-react';

export default function PhotoUploadZone({ photos, setPhotos, maxPhotos = 6 }) {
  const [dragging, setDragging] = useState(false);

  const addFiles = useCallback((files) => {
    const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    const remaining = maxPhotos - photos.length;
    const toAdd = validFiles.slice(0, remaining).map(f => ({
      file: f,
      preview: URL.createObjectURL(f),
      name: f.name,
    }));
    setPhotos(prev => [...prev, ...toAdd]);
  }, [photos.length, maxPhotos, setPhotos]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const removePhoto = (idx) => {
    setPhotos(prev => {
      const copy = [...prev];
      URL.revokeObjectURL(copy[idx].preview);
      copy.splice(idx, 1);
      return copy;
    });
  };

  const moveFirst = (idx) => {
    if (idx === 0) return;
    setPhotos(prev => {
      const copy = [...prev];
      const [item] = copy.splice(idx, 1);
      copy.unshift(item);
      return copy;
    });
  };

  const canAdd = photos.length < maxPhotos;

  return (
    <div className="space-y-3">
      {/* Drop Zone — shown when under limit */}
      {canAdd && (
        <label
          onDrop={handleDrop}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          className="drop-zone flex flex-col items-center justify-center cursor-pointer py-8 px-4 text-center"
          style={{
            borderColor: dragging ? '#1B3A8C' : '#E2E8F0',
            background: dragging ? '#EBF2FF' : '#FAFAFA',
            borderRadius: 12,
          }}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
            style={{ background: dragging ? '#1B3A8C' : '#EBF2FF' }}>
            <Upload size={24} color={dragging ? 'white' : '#1B3A8C'} />
          </div>
          <p className="text-sm font-semibold mb-0.5" style={{ color: '#2D3748' }}>
            {dragging ? 'Drop photos here!' : 'Drag & drop photos here'}
          </p>
          <p className="text-xs mb-3" style={{ color: '#A0AEC0' }}>or click to browse your device</p>
          <span className="text-xs font-bold px-3 py-1.5 rounded-full"
            style={{ background: '#EBF2FF', color: '#1B3A8C' }}>
            {photos.length} / {maxPhotos} photos added
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={e => addFiles(e.target.files)}
          />
        </label>
      )}

      {/* Preview grid */}
      {photos.length > 0 && (
        <div>
          <p className="text-xs font-semibold mb-2" style={{ color: '#718096' }}>
            ★ First photo is the cover · Click ★ to set as cover
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {photos.map((p, i) => (
              <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border-2"
                style={{ borderColor: i === 0 ? '#1B3A8C' : '#E2E8F0' }}>
                <img src={p.preview} alt="" className="w-full h-full object-cover" />

                {/* Cover badge */}
                {i === 0 && (
                  <div className="absolute bottom-0 left-0 right-0 text-center text-[9px] font-bold py-0.5"
                    style={{ background: '#1B3A8C', color: 'white' }}>
                    COVER
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'rgba(0,0,0,0.5)' }}>
                  {i !== 0 && (
                    <button type="button" onClick={() => moveFirst(i)}
                      title="Set as cover"
                      className="w-7 h-7 rounded-full bg-yellow-400 flex items-center justify-center">
                      <Star size={12} color="white" />
                    </button>
                  )}
                  <button type="button" onClick={() => removePhoto(i)}
                    className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center">
                    <X size={12} color="white" />
                  </button>
                </div>
              </div>
            ))}

            {/* Add more tile */}
            {canAdd && (
              <label className="aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all"
                style={{ borderColor: '#E2E8F0' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#1B3A8C'; e.currentTarget.style.background = '#EBF2FF'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.background = 'transparent'; }}>
                <ImagePlus size={18} color="#A0AEC0" />
                <span className="text-[10px] mt-1" style={{ color: '#A0AEC0' }}>Add</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={e => addFiles(e.target.files)} />
              </label>
            )}
          </div>
        </div>
      )}

      {/* All photos added message */}
      {!canAdd && (
        <div className="text-center text-xs font-semibold py-2"
          style={{ color: '#0F9D58', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8 }}>
          ✓ Maximum {maxPhotos} photos added
        </div>
      )}
    </div>
  );
}
