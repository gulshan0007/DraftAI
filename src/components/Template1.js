import React, { useRef, useState, useEffect } from 'react';
import '../App.css';
import { DocumentEditorContainerComponent, Toolbar } from '@syncfusion/ej2-react-documenteditor';
import Draggable from 'react-draggable';
import { Resizable } from 'react-resizable';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

DocumentEditorContainerComponent.Inject(Toolbar);

function Template1({ filePath }) {
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
    // '[City]': '',
    // '[COUNTRY]': '',
    'Is there a non-compete clause in this agreement?': '', // Custom placeholder
    'How will disputes be resolved?': '',

  });
  const [showToolbar, setShowToolbar] = useState(true);
  const [showPropertiesPane, setShowPropertiesPane] = useState(true);

  // useEffect(() => {
  //   // When modalText changes, update the main editor
  //   if (modalText && editorRef.current) {
  //     editorRef.current.documentEditor.open(modalText);
  //   }
  // }, [modalText]);
  useEffect(() => {
    let isDocumentLoaded = false;
  
    if (!isDocumentLoaded) {
      fetch(filePath)
        .then(response => response.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.onload = () => {
            editorRef.current.documentEditor.open(reader.result);
            isDocumentLoaded = true;
          };
          reader.readAsDataURL(blob);
        })
        .catch(error => console.error('Error loading file:', error));
    }
  }, [filePath]);
  

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
    setShowPropertiesPane(true);
    setShowToolbar(false);
  };

  const handleInsertText = () => {
    
    const editor = editorRef.current.documentEditor.editor;
    Object.keys(placeholders).forEach((key) => {
      if (key === 'Is there a non-compete clause in this agreement?') {
        if (placeholders[key] === 'Strict Non-Competition') {
          editorRef.current.documentEditor.searchModule.findAll("The Employee will not, during the term of this Agreement and for a period of 2 years after its termination, engage, either directly or indirectly, in any business that is competitive to the Company's business within a geographical area that reasonably corresponds to the scope of the Company's business operations.");
          editorRef.current.documentEditor.searchModule.searchResults.replaceAll("The Employee will not, during the term of this Agreement and for a period of 2 years after its termination, engage, either directly or indirectly, in any business that is competitive to the Company's business within a geographical area that reasonably corresponds to the scope of the Company's business operations.");
          editorRef.current.documentEditor.searchModule.findAll("The Employee will not engage in any business that directly competes with the Company within a 50-mile radius of the Company's main office for one year following the termination of this Agreement.");
          editorRef.current.documentEditor.searchModule.searchResults.replaceAll("The Employee will not, during the term of this Agreement and for a period of 2 years after its termination, engage, either directly or indirectly, in any business that is competitive to the Company's business within a geographical area that reasonably corresponds to the scope of the Company's business operations.");
          editorRef.current.documentEditor.searchModule.findAll('[No Non-Competition Clause]');
          editorRef.current.documentEditor.searchModule.searchResults.replaceAll('');
        } else if (placeholders[key] === 'Limited Non-Competition') {
          editorRef.current.documentEditor.searchModule.findAll("The Employee will not, during the term of this Agreement and for a period of 2 years after its termination, engage, either directly or indirectly, in any business that is competitive to the Company's business within a geographical area that reasonably corresponds to the scope of the Company's business operations.");
          editorRef.current.documentEditor.searchModule.searchResults.replaceAll("The Employee will not engage in any business that directly competes with the Company within a 50-mile radius of the Company's main office for one year following the termination of this Agreement.");
          editorRef.current.documentEditor.searchModule.findAll('[Strict Non-Competition]');
          editorRef.current.documentEditor.searchModule.searchResults.replaceAll('');
          editorRef.current.documentEditor.searchModule.findAll('[No Non-Competition Clause]');
          editorRef.current.documentEditor.searchModule.searchResults.replaceAll('');
        } else if (placeholders[key] === 'No Non-Competition Clause') {
          editorRef.current.documentEditor.searchModule.findAll("The Employee will not engage in any business that directly competes with the Company within a 50-mile radius of the Company's main office for one year following the termination of this Agreement.");
          editorRef.current.documentEditor.searchModule.searchResults.replaceAll('');
          editorRef.current.documentEditor.searchModule.findAll("The Employee will not, during the term of this Agreement and for a period of 2 years after its termination, engage, either directly or indirectly, in any business that is competitive to the Company's business within a geographical area that reasonably corresponds to the scope of the Company's business operations.");
          editorRef.current.documentEditor.searchModule.searchResults.replaceAll('');
          editorRef.current.documentEditor.searchModule.findAll('[Limited Non-Competition]');
          editorRef.current.documentEditor.searchModule.searchResults.replaceAll('');
        }
      } else if (key === 'How will disputes be resolved?') {
        if (placeholders[key] === 'Courts Litigation') {
          editorRef.current.documentEditor.searchModule.findAll("Any disputes arising out of or in connection with this Agreement shall be subject to the exclusive jurisdiction of the courts located in [City], [COUNTRY]. Each party hereby submits to the jurisdiction of such courts and waives any objection to venue laid therein.");
          editorRef.current.documentEditor.searchModule.searchResults.replaceAll("Any disputes arising out of or in connection with this Agreement shall be subject to the exclusive jurisdiction of the courts located in [City], [COUNTRY]. Each party hereby submits to the jurisdiction of such courts and waives any objection to venue laid therein.");
          editorRef.current.documentEditor.searchModule.findAll("In the event of any dispute or claim arising out of or relating to this Agreement, the parties agree to first attempt to resolve the dispute through mediation in [City], [COUNTRY]. If the dispute cannot be resolved through mediation within [number] days after initiation, or if either party refuses to participate in mediation, the dispute shall be submitted to the exclusive jurisdiction of the courts located in [City], [COUNTRY].");
          editorRef.current.documentEditor.searchModule.searchResults.replaceAll("Any disputes arising out of or in connection with this Agreement shall be subject to the exclusive jurisdiction of the courts located in [City], [COUNTRY]. Each party hereby submits to the jurisdiction of such courts and waives any objection to venue laid therein.");
          editorRef.current.documentEditor.searchModule.findAll("Any dispute, controversy, or claim arising out of or relating to this Agreement, including the validity, invalidity, breach, or termination thereof, shall be settled by arbitration in accordance with the [Arbitration Rules] of [Arbitration Institution] in [City], [COUNTRY]. The arbitration shall be conducted by [number] arbitrators appointed in accordance with the said Rules. The decision of the arbitrator(s) shall be final and binding upon both parties.");
          editorRef.current.documentEditor.searchModule.searchResults.replaceAll("Any disputes arising out of or in connection with this Agreement shall be subject to the exclusive jurisdiction of the courts located in [City], [COUNTRY]. Each party hereby submits to the jurisdiction of such courts and waives any objection to venue laid therein.");
        } else if (placeholders[key] === 'Mediation') {
          editorRef.current.documentEditor.searchModule.findAll("Any disputes arising out of or in connection with this Agreement shall be subject to the exclusive jurisdiction of the courts located in [City], [COUNTRY]. Each party hereby submits to the jurisdiction of such courts and waives any objection to venue laid therein.");
          editorRef.current.documentEditor.searchModule.searchResults.replaceAll("In the event of any dispute or claim arising out of or relating to this Agreement, the parties agree to first attempt to resolve the dispute through mediation in [City], [COUNTRY]. If the dispute cannot be resolved through mediation within [number] days after initiation, or if either party refuses to participate in mediation, the dispute shall be submitted to the exclusive jurisdiction of the courts located in [City], [COUNTRY].");
          editorRef.current.documentEditor.searchModule.findAll("Any dispute, controversy, or claim arising out of or relating to this Agreement, including the validity, invalidity, breach, or termination thereof, shall be settled by arbitration in accordance with the [Arbitration Rules] of [Arbitration Institution] in [City], [COUNTRY]. The arbitration shall be conducted by [number] arbitrators appointed in accordance with the said Rules. The decision of the arbitrator(s) shall be final and binding upon both parties.");
          editorRef.current.documentEditor.searchModule.searchResults.replaceAll("In the event of any dispute or claim arising out of or relating to this Agreement, the parties agree to first attempt to resolve the dispute through mediation in [City], [COUNTRY]. If the dispute cannot be resolved through mediation within [number] days after initiation, or if either party refuses to participate in mediation, the dispute shall be submitted to the exclusive jurisdiction of the courts located in [City], [COUNTRY].");
          editorRef.current.documentEditor.searchModule.findAll('[Arbitration]');
          editorRef.current.documentEditor.searchModule.searchResults.replaceAll("In the event of any dispute or claim arising out of or relating to this Agreement, the parties agree to first attempt to resolve the dispute through mediation in [City], [COUNTRY]. If the dispute cannot be resolved through mediation within [number] days after initiation, or if either party refuses to participate in mediation, the dispute shall be submitted to the exclusive jurisdiction of the courts located in [City], [COUNTRY].");
        } else if (placeholders[key] === 'Arbitration') {
          editorRef.current.documentEditor.searchModule.findAll("Any disputes arising out of or in connection with this Agreement shall be subject to the exclusive jurisdiction of the courts located in [City], [COUNTRY]. Each party hereby submits to the jurisdiction of such courts and waives any objection to venue laid therein.");
          editorRef.current.documentEditor.searchModule.searchResults.replaceAll("Any dispute, controversy, or claim arising out of or relating to this Agreement, including the validity, invalidity, breach, or termination thereof, shall be settled by arbitration in accordance with the [Arbitration Rules] of [Arbitration Institution] in [City], [COUNTRY]. The arbitration shall be conducted by [number] arbitrators appointed in accordance with the said Rules. The decision of the arbitrator(s) shall be final and binding upon both parties.");
          editorRef.current.documentEditor.searchModule.findAll("In the event of any dispute or claim arising out of or relating to this Agreement, the parties agree to first attempt to resolve the dispute through mediation in [City], [COUNTRY]. If the dispute cannot be resolved through mediation within [number] days after initiation, or if either party refuses to participate in mediation, the dispute shall be submitted to the exclusive jurisdiction of the courts located in [City], [COUNTRY].");
          editorRef.current.documentEditor.searchModule.searchResults.replaceAll("Any dispute, controversy, or claim arising out of or relating to this Agreement, including the validity, invalidity, breach, or termination thereof, shall be settled by arbitration in accordance with the [Arbitration Rules] of [Arbitration Institution] in [City], [COUNTRY]. The arbitration shall be conducted by [number] arbitrators appointed in accordance with the said Rules. The decision of the arbitrator(s) shall be final and binding upon both parties.");
          editorRef.current.documentEditor.searchModule.findAll("Any dispute, controversy, or claim arising out of or relating to this Agreement, including the validity, invalidity, breach, or termination thereof, shall be settled by arbitration in accordance with the [Arbitration Rules] of [Arbitration Institution] in [City], [COUNTRY]. The arbitration shall be conducted by [number] arbitrators appointed in accordance with the said Rules. The decision of the arbitrator(s) shall be final and binding upon both parties.");
          editorRef.current.documentEditor.searchModule.searchResults.replaceAll("Any dispute, controversy, or claim arising out of or relating to this Agreement, including the validity, invalidity, breach, or termination thereof, shall be settled by arbitration in accordance with the [Arbitration Rules] of [Arbitration Institution] in [City], [COUNTRY]. The arbitration shall be conducted by [number] arbitrators appointed in accordance with the said Rules. The decision of the arbitrator(s) shall be final and binding upon both parties.");
        }
      } else {
        editorRef.current.documentEditor.searchModule.findAll(key);
        editorRef.current.documentEditor.searchModule.searchResults.replaceAll(placeholders[key]);
      }
    });
    setInsertModalOpen(false);
    setShowPropertiesPane(true); 
    setShowToolbar(true);// Close insert modal after replacing text
  };
  
  const handlePlaceholderChange = (key, value) => {
    setPlaceholders((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const insertButtonStyle1 = {
    position: 'fixed',
    bottom: '5px',
    right: '10px',
    marginBottom: '10px',
    marginRight: '10px',
    zIndex: 999,
    padding: '12px 24px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s, transform 0.2s',
  };
  
  const insertButtonHoverStyle1 = {
    backgroundColor: 'red',
  };

  const insertButtonStyle = {
    position: 'relative',
    top: '5px',
    left: '10px',
    marginBottom: '10px',
    marginRight: '10px',
    zIndex: 1000,
    padding: '6px 12px',
    backgroundColor: 'none',
    color: 'black',
    border: '1px solid #007bff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s, transform 0.2s',
  };
  
  const insertButtonHoverStyle = {
    backgroundColor: '#007bff',
    transform: 'scale(1.05)',
  };


  const blinkTextStyle = {
    animation: 'blink 1.5s infinite',
  };
  
  // Define keyframes for the blink animation
  const styleSheet = document.styleSheets[0];
  const keyframes =
    `@keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }`;
  styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

  return (
    <div>
      <button onClick={onSave}  style={insertButtonStyle}
        onMouseEnter={(e) => {
          Object.assign(e.target.style, insertButtonHoverStyle);
        }}
        onMouseLeave={(e) => {
          Object.assign(e.target.style, insertButtonStyle);
          e.target.style.backgroundColor = 'transparent'; // Explicitly set to transparent
        }}>Save</button>
      <button onClick={onEdit}  style={insertButtonStyle}
        onMouseEnter={(e) => {
          Object.assign(e.target.style, insertButtonHoverStyle);
        }}
        onMouseLeave={(e) => {
          Object.assign(e.target.style, insertButtonStyle);
          e.target.style.backgroundColor = 'transparent'; // Explicitly set to transparent
        }}>Edit</button>
      
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} accept=".docx" />
      <button onClick={() => fileInputRef.current.click()}  style={insertButtonStyle}
        onMouseEnter={(e) => {
          Object.assign(e.target.style, insertButtonHoverStyle);
        }}
        onMouseLeave={(e) => {
          Object.assign(e.target.style, insertButtonStyle);
          e.target.style.backgroundColor = 'transparent'; // Explicitly set to transparent
        }}>Open</button>
      <button onClick={handleExtract}  style={insertButtonStyle}
        onMouseEnter={(e) => {
          Object.assign(e.target.style, insertButtonHoverStyle);
        }}
        onMouseLeave={(e) => {
          Object.assign(e.target.style, insertButtonStyle);
          e.target.style.backgroundColor = 'transparent'; // Explicitly set to transparent
        }}>Extract</button>
      <button
        onClick={handleInsertClick}
        style={insertButtonStyle1}
      >
        Draft
      </button>

      <DocumentEditorContainerComponent 
        id="container" 
        height='590' 
        serviceUrl='http://localhost:6002/api/documenteditor/' 
        enableToolbar={showToolbar}
        showPropertiesPane={showPropertiesPane}
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
                  showPropertiesPane={showPropertiesPane}
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
          <div className="extract-modal">
            <h2>Extracted Content</h2>
            <textarea
              value={extractedContent}
              readOnly
              style={{ width: '100%', height: '300px', fontFamily: 'monospace', whiteSpace: 'pre' }}
            />
            <button onClick={handleDownload}>Download</button>
            <button onClick={() => setExtractModalOpen(false)}>Close</button>
          </div>
        </div>
      )}

{insertModalOpen && (
  
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="insert-modal-wrapper" style={{ position: 'fixed', right: 10, top: 50 }}>
        <div className="insert-modal-content" style={{ width: 300, backgroundColor: 'white', padding: 20, borderRadius: 10, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <div className="insert-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontWeight: 'bold', fontSize: 18 }}>Configure Contract</span>
            <button onClick={() => { setInsertModalOpen(false); setShowToolbar(true); }} className="modal-close-button" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="#000000" d="M19.707 4.293c-0.391-0.391-1.023-0.391-1.414 0l-4.293 4.293-4.293-4.293c-0.391-0.391-1.023-0.391-1.414 0s-0.391 1.023 0 1.414l4.293 4.293-4.293 4.293c-0.391 0.391-0.391 1.023 0 1.414 0.391 0.391 1.023 0.391 1.414 0l4.293-4.293 4.293 4.293c0.391 0.391 1.023 0.391 1.414 0s0.391-1.023 0-1.414l-4.293-4.293 4.293-4.293c0.391-0.391 0.391-1.023 0-1.414z"/>
              </svg>
            </button>
          </div>
          <div className="insert-modal-body" style={{ height: '370px', overflowY: 'auto', marginTop: 10, marginBottom: 10 }}>
            {Object.keys(placeholders).map((key, index) => (
              <div key={index} style={{ marginBottom: 15 }}>
                <label>{key.replace('[', '').replace(']', '')}*</label>
                {key === 'How will disputes be resolved?' ? (
                  <select
                  value={placeholders[key]}
                  onChange={(e) => handlePlaceholderChange(key, e.target.value)}
                  style={{ width: '90%', padding: 8, fontSize: 12, borderRadius: 5, border: '1px solid #ccc' }}
                >
                  <option value="">Select</option>
                      <option value="Courts Litigation">Courts Litigation</option>
                      <option value="Mediation">Mediation</option>
                      <option value="Arbitration">Arbitration</option>
                </select>
                ) : key === 'Is there a non-compete clause in this agreement?' ? (
                  <select
                    value={placeholders[key]}
                    onChange={(e) => handlePlaceholderChange(key, e.target.value)}
                    style={{ width: '90%', padding: 8, fontSize: 12, borderRadius: 5, border: '1px solid #ccc' }}
                  >
                    <option value="">Select an option</option>
                    <option value="Strict Non-Competition">Strict Non-Competition</option>
                    <option value="Limited Non-Competition">Limited Non-Competition</option>
                    <option value="No Non-Competition Clause">No Non-Competition Clause</option>
                  </select>
                ) : (
                  <input
                    id={`insert-text-${index}`}
                    type="text"
                    value={placeholders[key]}
                    onChange={(e) => handlePlaceholderChange(key, e.target.value)}
                    style={{ width: '90%', padding: 8, fontSize: 12, borderRadius: 5, border: '1px solid #ccc' }}
                  />
                )}
              </div>
            ))}
          </div>
          <button onClick={handleInsertText} className="insert-button" style={{ marginTop: 20, padding: '10px 20px', backgroundColor: 'red', color: 'white', borderRadius: 5, border: 'none', cursor: 'pointer' }}>Insert Text</button>
        </div>
      </div>
    </div>
  
)}

    </div>
  );
}

export default Template1;
