import React, { useRef, useState, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import './ReceiptImageEditor.css';

export const ReceiptImageEditor = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [textOverlays, setTextOverlays] = useState([]);
  const [selectedOverlayId, setSelectedOverlayId] = useState(null);
  const [currentText, setCurrentText] = useState('');
  const [currentX, setCurrentX] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [fontSize, setFontSize] = useState(14);
  const [fontColor, setFontColor] = useState('#000000');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setImage(img);
          setEditMode(true);
          setTextOverlays([]);
          setSelectedOverlayId(null);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image click to add overlay text
  const handleImageClick = (e) => {
    if (!editMode || !image) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = image.width / canvasRef.current.offsetWidth;
    const scaleY = image.height / canvasRef.current.offsetHeight;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const newOverlay = {
      id: Date.now(),
      text: 'Edit me',
      x,
      y,
      fontSize: 14,
      color: '#000000',
      fontFamily: 'Arial',
    };

    setTextOverlays([...textOverlays, newOverlay]);
    setSelectedOverlayId(newOverlay.id);
    setCurrentText('Edit me');
    setCurrentX(x);
    setCurrentY(y);
    setFontSize(14);
    setFontColor('#000000');
  };

  // Update selected overlay
  const updateOverlay = (id, updates) => {
    setTextOverlays(
      textOverlays.map((overlay) =>
        overlay.id === id ? { ...overlay, ...updates } : overlay
      )
    );
  };

  // Handle overlay drag
  const handleMouseDown = (e, overlayId) => {
    e.stopPropagation();
    setSelectedOverlayId(overlayId);
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !selectedOverlayId || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = image.width / canvasRef.current.offsetWidth;
    const scaleY = image.height / canvasRef.current.offsetHeight;

    const deltaX = (e.clientX - dragStart.x) * scaleX;
    const deltaY = (e.clientY - dragStart.y) * scaleY;

    const overlay = textOverlays.find((o) => o.id === selectedOverlayId);
    if (overlay) {
      updateOverlay(selectedOverlayId, {
        x: overlay.x + deltaX,
        y: overlay.y + deltaY,
      });
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Delete selected overlay
  const deleteSelectedOverlay = () => {
    if (selectedOverlayId) {
      setTextOverlays(textOverlays.filter((o) => o.id !== selectedOverlayId));
      setSelectedOverlayId(null);
    }
  };

  // Draw canvas with original image
  const drawCanvas = () => {
    if (!canvasRef.current || !image) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = image.width;
    canvas.height = image.height;

    // Draw original image (unchanged)
    ctx.drawImage(image, 0, 0);

    // Draw text overlays on top
    textOverlays.forEach((overlay) => {
      ctx.font = `${overlay.fontSize}px ${overlay.fontFamily}`;
      ctx.fillStyle = overlay.color;
      ctx.fillText(overlay.text, overlay.x, overlay.y);

      // Draw selection box if selected
      if (overlay.id === selectedOverlayId) {
        const metrics = ctx.measureText(overlay.text);
        const width = metrics.width;
        const height = overlay.fontSize;

        ctx.strokeStyle = '#f0b90b';
        ctx.lineWidth = 3;
        ctx.strokeRect(overlay.x - 5, overlay.y - height - 2, width + 10, height + 10);

        // Draw handles
        ctx.fillStyle = '#f0b90b';
        ctx.fillRect(overlay.x - 7, overlay.y - height - 7, 6, 6);
        ctx.fillRect(overlay.x + width + 4, overlay.y - height - 7, 6, 6);
      }
    });
  };

  // Redraw when textOverlays change
  React.useEffect(() => {
    drawCanvas();
  }, [image, textOverlays, selectedOverlayId]);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, selectedOverlayId, textOverlays]);

  // Export canvas as image
  const exportAsImage = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL('image/png', 1.0);
    
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `receipt-edited-${Date.now()}.png`;
    link.click();
  };

  // Copy to clipboard
  const copyToClipboard = () => {
    if (!canvasRef.current) return;

    canvasRef.current.toBlob((blob) => {
      navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]).then(() => {
        alert('Receipt copied to clipboard!');
      });
    });
  };

  return (
    <div 
      className={`receipt-editor-container ${isDarkMode ? 'dark' : 'light'}`}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="editor-header">
        <h2>Receipt Image Editor</h2>
        {!editMode && (
          <button
            className="upload-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            📤 Upload Receipt
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: 'none' }}
      />

      {!editMode ? (
        <div className="upload-placeholder">
          <div className="placeholder-content">
            <span className="placeholder-icon">🖼️</span>
            <p>Click to upload a receipt image</p>
            <p className="placeholder-text">
              or drag and drop an image here
            </p>
            <button
              className="upload-placeholder-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              Choose File
            </button>
          </div>
        </div>
      ) : (
        <div className="editor-content">
          <div className="canvas-container" ref={containerRef}>
            <canvas
              ref={canvasRef}
              className="receipt-canvas"
              onClick={handleImageClick}
              title="Click to add text overlay"
            />
            <div className="canvas-hint">
              ✏️ Click to add text | 🖱️ Drag to move | Select to edit
            </div>
          </div>

          <div className="editor-sidebar">
            <div className="sidebar-section">
              <h3>Text Overlays ({textOverlays.length})</h3>
              <div className="overlays-list">
                {textOverlays.map((overlay) => (
                  <div
                    key={overlay.id}
                    className={`overlay-item ${
                      selectedOverlayId === overlay.id ? 'active' : ''
                    }`}
                    onClick={() => {
                      setSelectedOverlayId(overlay.id);
                      setCurrentText(overlay.text);
                      setCurrentX(overlay.x);
                      setCurrentY(overlay.y);
                      setFontSize(overlay.fontSize);
                      setFontColor(overlay.color);
                    }}
                  >
                    <span className="overlay-text">{overlay.text}</span>
                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTextOverlays(
                          textOverlays.filter((o) => o.id !== overlay.id)
                        );
                        if (selectedOverlayId === overlay.id) {
                          setSelectedOverlayId(null);
                        }
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {selectedOverlayId && (
              <div className="sidebar-section">
                <h3>Edit Text</h3>

                <div className="form-group">
                  <label>Text Content</label>
                  <input
                    type="text"
                    value={currentText}
                    onChange={(e) => {
                      setCurrentText(e.target.value);
                      updateOverlay(selectedOverlayId, { text: e.target.value });
                    }}
                    placeholder="Enter text"
                  />
                </div>

                <div className="form-group">
                  <label>Position X</label>
                  <input
                    type="number"
                    value={Math.round(currentX)}
                    onChange={(e) => {
                      const x = parseFloat(e.target.value);
                      setCurrentX(x);
                      updateOverlay(selectedOverlayId, { x });
                    }}
                  />
                </div>

                <div className="form-group">
                  <label>Position Y</label>
                  <input
                    type="number"
                    value={Math.round(currentY)}
                    onChange={(e) => {
                      const y = parseFloat(e.target.value);
                      setCurrentY(y);
                      updateOverlay(selectedOverlayId, { y });
                    }}
                  />
                </div>

                <div className="form-group">
                  <label>Font Size</label>
                  <input
                    type="range"
                    min="8"
                    max="72"
                    value={fontSize}
                    onChange={(e) => {
                      const size = parseInt(e.target.value);
                      setFontSize(size);
                      updateOverlay(selectedOverlayId, { fontSize: size });
                    }}
                  />
                  <span className="size-display">{fontSize}px</span>
                </div>

                <div className="form-group">
                  <label>Text Color</label>
                  <div className="color-picker">
                    <input
                      type="color"
                      value={fontColor}
                      onChange={(e) => {
                        setFontColor(e.target.value);
                        updateOverlay(selectedOverlayId, { color: e.target.value });
                      }}
                    />
                    <span className="color-value">{fontColor}</span>
                  </div>
                </div>

                <button
                  className="delete-overlay-btn"
                  onClick={deleteSelectedOverlay}
                >
                  🗑️ Delete This Text
                </button>
              </div>
            )}

            <div className="sidebar-section">
              <h3>Export</h3>
              <button
                className="action-btn export-btn"
                onClick={exportAsImage}
              >
                📥 Download PNG
              </button>
              <button
                className="action-btn copy-btn"
                onClick={copyToClipboard}
              >
                📋 Copy to Clipboard
              </button>
              <button
                className="action-btn reset-btn"
                onClick={() => {
                  setEditMode(false);
                  setImage(null);
                  setTextOverlays([]);
                  setSelectedOverlayId(null);
                }}
              >
                🔄 Start Over
              </button>
            </div>

            <div className="sidebar-section info-section">
              <h3>💡 Tips</h3>
              <p>• Original image stays unchanged</p>
              <p>• Click image to add text</p>
              <p>• Drag text to move it</p>
              <p>• Edit details in sidebar</p>
              <p>• Download when done</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};