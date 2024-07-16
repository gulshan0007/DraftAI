import React, { useRef, useState, useEffect } from 'react';
import './App.css';
import { DocumentEditorContainerComponent, Toolbar } from '@syncfusion/ej2-react-documenteditor';
import Draggable from 'react-draggable';
import { Resizable } from 'react-resizable';

DocumentEditorContainerComponent.Inject(Toolbar);

function App() {
  const editorRef = useRef(null);
  const modalEditorRef = useRef(null);
  const fileInputRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [extractModalOpen, setExtractModalOpen] = useState(false);
  const [insertModalOpen, setInsertModalOpen] = useState(false);
  const [modalWidth, setModalWidth] = useState(600); // Initial width
  const [modalHeight, setModalHeight] = useState(400); // Initial height
  const [modalText, setModalText] = useState('');
  const [extractedContent, setExtractedContent] = useState(''); // State for extracted content
  const [insertPosition, setInsertPosition] = useState(null);
  const [placeholders, setPlaceholders] = useState({
    '[EMPLOYEE NAME]': '',
    '[EMPLOYEE ADDRESS]': '',
    '[STATE OR COUNTRY]': '',
    '[COMPANY NAME]': '',
    '[COMPANY ADDRESS]': '',
    '[EFFECTIVE DATE] ': '',

  });

  useEffect(() => {
    // When modalText changes, update the main editor
    if (modalText && editorRef.current) {
      editorRef.current.documentEditor.open(modalText);
    }
  }, [modalText]);

  const onSave = () => {
    if (editorRef.current) {
      editorRef.current.documentEditor.save("Sample", "Docx");
    }
  };

  const onEdit = async () => {
    if (editorRef.current) {
      const sfdt = editorRef.current.documentEditor.serialize();
      setModalOpen(true);
      // Ensure modal opens properly before loading content
      setTimeout(() => {
        if (modalEditorRef.current) {
          modalEditorRef.current.documentEditor.open(sfdt);
        }
      }, 100);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target.result;
        editorRef.current.documentEditor.open(fileContent); // Open file in main editor
      };
      reader.readAsDataURL(file); // Read as array buffer for better compatibility with the DocumentEditor
    }
  };

  const handleExtract = () => {
    if (editorRef.current) {
      const extractedSfdt = editorRef.current.documentEditor.serialize();
      const extractedJson = JSON.stringify(JSON.parse(extractedSfdt), null, 2); // Format JSON with indentation
      setExtractedContent(extractedJson); // Set extracted content
      setExtractModalOpen(true); // Open extract modal
    }
  };

  const handleDownload = () => {
    const blob = new Blob([extractedContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'extracted_content.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const onModalClose = () => {
    setModalOpen(false); // Close the modal

    // Sync changes back to main editor
    if (modalEditorRef.current && editorRef.current) {
      const sfdt = modalEditorRef.current.documentEditor.serialize();
      editorRef.current.documentEditor.open(sfdt);
    }
  };

  const handleResize = (event, { size }) => {
    setModalWidth(size.width);
    setModalHeight(size.height);
  };

  const handleBackdropClick = (e) => {
    if (e.target.className === 'modal-backdrop') {
      setExtractModalOpen(false);
      setInsertModalOpen(false);
    }
  };

  const handleInsertClick = () => {
    setInsertModalOpen(true);
  };

  const handleInsertText = () => {
    const editor = editorRef.current.documentEditor.editor;
    Object.keys(placeholders).forEach((key) => {
      editorRef.current.documentEditor.searchModule.findAll(key);
      editorRef.current.documentEditor.searchModule.searchResults.replaceAll(placeholders[key]);
    });
    setInsertModalOpen(false); // Close the modal after inserting text
  };

  const handlePlaceholderChange = (key, value) => {
    setPlaceholders((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div>
      <button onClick={onSave} style={{ marginBottom: 10, marginRight: 10 }}>Save</button>
      <button onClick={onEdit} style={{ marginBottom: 10, marginRight: 10, borderRadius: '50%' }}>Edit</button>
      
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} accept=".docx" />
      <button onClick={() => fileInputRef.current.click()} style={{ marginBottom: 10, marginRight: 10 }}>Open</button>
      <button onClick={handleExtract} style={{ marginBottom: 10, marginRight: 10 }}>Extract</button>
      <button onClick={handleInsertClick} style={{ marginBottom: 10, marginRight: 10 }}>Insert</button>

      <DocumentEditorContainerComponent 
        id="container" 
        height='590' 
        serviceUrl='http://localhost:6002/api/documenteditor/' 
        enableToolbar={true}
        showPropertiesPane={true}
        showStatusBar={true}
        ref={editorRef} 
      />

      {modalOpen && (
        <Draggable handle=".modal-drag-handle">
          <Resizable
            width={modalWidth}
            height={modalHeight}
            onResize={handleResize}
            minConstraints={[400, 200]} // Minimum size constraints
            maxConstraints={[800, 600]} // Maximum size constraints
          >
            <div className="modal-wrapper">
              <div className="modal-content" style={{ width: modalWidth, height: modalHeight }}>
                <div className="modal-header">
                  <span className="modal-drag-handle">Click here to Drag</span>
                  <button onClick={onModalClose} className="modal-close-button">Close</button>
                </div>
                <DocumentEditorContainerComponent 
                  id="modal-container" 
                  height={modalHeight - 60} // Adjust height for header
                  serviceUrl='http://localhost:6002/api/documenteditor/' 
                  enableToolbar={false}
                  showPropertiesPane={false}
                  showStatusBar={false}
                  ref={modalEditorRef} 
                  textChange={(args) => {
                    // Sync changes back to main editor in real-time
                    if (editorRef.current) {
                      const sfdt = modalEditorRef.current.documentEditor.serialize();
                      editorRef.current.documentEditor.open(sfdt);
                    }
                  }}
                />
              </div>
            </div>
          </Resizable>
        </Draggable>
      )}

      {extractModalOpen && (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
          <div className="extract-modal-wrapper">
            <div className="extract-modal-content" style={{ width: modalWidth, height: modalHeight, backgroundColor: 'white' }}>
              <div className="extract-modal-header">
                <span>Extracted Content</span>
                <button onClick={() => setExtractModalOpen(false)} className="modal-close-button">Close</button>
                <button onClick={handleDownload} className="modal-download-button">Download JSON</button>
              </div>
              <div className="extract-modal-body" style={{ overflow: 'auto', height: modalHeight - 60 }}>
                <pre>{extractedContent}</pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {insertModalOpen && (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
          <div className="insert-modal-wrapper">
            <div className="insert-modal-content" style={{ width: modalWidth, height: modalHeight, backgroundColor: 'white' }}>
              <div className="insert-modal-header">
                <span>Insert Text</span>
                <button onClick={() => setInsertModalOpen(false)} className="modal-close-button">Close</button>
              </div>
              <div className="insert-modal-body" style={{ overflow: 'auto', height: modalHeight - 60 }}>
                {Object.keys(placeholders).map((key, index) => (
                  <div key={index} style={{ marginBottom: 10 }}>
                    <label>{key}</label>
                    <input
                      id={`insert-text-${index}`}
                      type="text"
                      value={placeholders[key]}
                      onChange={(e) => handlePlaceholderChange(key, e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </div>
                ))}
                <button onClick={handleInsertText} className="insert-button">Insert Text</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
