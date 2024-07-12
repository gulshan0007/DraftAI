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
  const [modalWidth, setModalWidth] = useState(600); // Initial width
  const [modalHeight, setModalHeight] = useState(400); // Initial height
  const [modalText, setModalText] = useState('');
  
  
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
      reader.readAsDataURL(file);
    }
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

  return (
    <div>
      <button onClick={onSave} style={{ marginBottom: 10, marginRight: 10 }}>Save</button>
      <button onClick={onEdit} style={{ marginBottom: 10, marginRight: 10, borderRadius: '50%' }}>Edit</button>
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} accept=".docx" />
      <button onClick={() => fileInputRef.current.click()} style={{ marginBottom: 10, marginRight: 10 }}>Open</button>
      
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
      {modalOpen && (
        <div className="modal-backdrop" onClick={onModalClose}></div>
      )}
    </div>
  );
}

export default App;