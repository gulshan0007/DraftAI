# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)








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
    }
  };

  const handleInsertClick = (e) => {
    const position = editorRef.current.documentEditor.selection.start;
    setInsertPosition(position);
    setInsertModalOpen(true);
  };

  const handleInsertText = () => {
    const insertText = document.getElementById('insert-text').value;
    editorRef.current.documentEditor.selection.insertText(insertText);
    setInsertModalOpen(false);
  };

  const handleDeleteText = () => {
    editorRef.current.documentEditor.selection.delete();
    setInsertModalOpen(false);
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
        <div className="modal-backdrop" onClick={() => setInsertModalOpen(false)}>
          <div className="extract-modal-wrapper">
            <div className="extract-modal-content" style={{ width: 400, height: 200, backgroundColor: 'white' }}>
              <div className="extract-modal-header">
                <span>Insert/Delete Text</span>
                <button onClick={() => setInsertModalOpen(false)} className="modal-close-button">Close</button>
              </div>
              <div className="extract-modal-body" style={{ overflow: 'auto', height: 140 }}>
                <input id="insert-text" type="text" placeholder="Insert text here" />
                <button onClick={handleInsertText} style={{ marginLeft: 10 }}>Insert</button>
                <button onClick={handleDeleteText} style={{ marginLeft: 10 }}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="modal-backdrop" onClick={onModalClose}></div>
      )}
    </div>
  );
}

export default App;




































import React, { useRef, useState, useEffect } from 'react';
import './App.css';
import { DocumentEditorContainerComponent, Toolbar } from '@syncfusion/ej2-react-documenteditor';
import Draggable from 'react-draggable';
import { Resizable } from 'react-resizable';

DocumentEditorContainerComponent.Inject(Toolbar);

function App() {
  
  const [textsInsideBrackets, setTextsInsideBrackets] = useState([]);
  const editorRef = useRef(null);
  const modalEditorRef = useRef(null);
  const fileInputRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [extractModalOpen, setExtractModalOpen] = useState(false);
  const [insertModalOpen, setInsertModalOpen] = useState(false);
  const [findReplaceModalOpen, setFindReplaceModalOpen] = useState(false);
  const [modalWidth, setModalWidth] = useState(600);
  const [modalHeight, setModalHeight] = useState(400);
  const [modalText, setModalText] = useState('');
  const [extractedContent, setExtractedContent] = useState('');
  const [insertPosition, setInsertPosition] = useState(null);
  const [findText, setFindText] = useState(''); // State for text to find
  const [replaceText, setReplaceText] = useState(''); // State for replacement text
  const [findReplaceResults, setFindReplaceResults] = useState([]); // State for find results

  useEffect(() => {
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
        editorRef.current.documentEditor.open(fileContent);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExtract = () => {
    if (editorRef.current) {
      const extractedSfdt = editorRef.current.documentEditor.serialize();
      const extractedJson = JSON.stringify(JSON.parse(extractedSfdt), null, 2);
      setExtractedContent(extractedJson);
      setExtractModalOpen(true);
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
    setModalOpen(false);

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
      setFindReplaceModalOpen(false);
    }
  };

  const handleInsertClick = (e) => {
    const position = editorRef.current.documentEditor.selection.start;
    setInsertPosition(position);
    setInsertModalOpen(true);
  };

  

  

 
  

  const handleFindReplaceClick = () => {
    if (editorRef.current) {
      try {
        const sfdt = JSON.parse(editorRef.current.documentEditor.serialize()); // Serialize the document
        console.log('Serialized Document:', sfdt);
        let textsInsideBrackets = findAllTextInsideBrackets(sfdt); // Extract all text inside brackets
        setTextsInsideBrackets(textsInsideBrackets); // Store in state to render in modal
        setFindReplaceModalOpen(true); // Open Find & Replace modal
      } catch (error) {
        console.error('Error serializing or processing document:', error);
      }
    }
  };
  
  // Function to find all text inside brackets
  // Function to find all text inside brackets
  const findAllTextInsideBrackets = (sfdt) => {
    let texts = [];
    if (sfdt && sfdt.sec) {
      sfdt.sec.forEach(section => {
        if (section.blocks && section.blocks.length) {
          section.blocks.forEach(block => {
            if (block.inlines && block.inlines.length) {
              block.inlines.forEach(inline => {
                if (inline.hasOwnProperty('text') && inline.text.includes('[') && inline.text.includes(']')) {
                  let startIndex = inline.text.indexOf('[');
                  let endIndex = inline.text.indexOf(']');
                  if (startIndex !== -1 && endIndex !== -1) {
                    let textInsideBrackets = inline.text.substring(startIndex + 1, endIndex);
                    texts.push(textInsideBrackets.trim());
                  }
                }
              });
            }
          });
        }
      });
    }
    return texts;
  };


  const handleInputChange = (e, index) => {
    const updatedTexts = [...textsInsideBrackets];
    updatedTexts[index] = e.target.value;
    setTextsInsideBrackets(updatedTexts);
  };
  

  const handleDeleteText = () => {
    const editor = editorRef.current.documentEditor.editor;
    const selection = editorRef.current.documentEditor.selection;

    const start = selection.start;
    const end = selection.end;

    selection.start = start;
    selection.end = end;

    editor.delete();
  };

  
  // Function to find text inside brackets
  const findTextInsideBrackets = (sfdt) => {
    let text = '';
    if (sfdt && sfdt.sec) {
      sfdt.sec.forEach(section => {
        if (section.blocks && section.blocks.length) {
          section.blocks.forEach(block => {
            if (block.inlines && block.inlines.length) {
              block.inlines.forEach(inline => {
                if (inline.hasOwnProperty('text') && inline.text.includes('[') && inline.text.includes(']')) {
                  let startIndex = inline.text.indexOf('[');
                  let endIndex = inline.text.indexOf(']');
                  if (startIndex !== -1 && endIndex !== -1) {
                    text += inline.text.substring(startIndex + 1, endIndex) + '\n';
                  }
                }
              });
            }
          });
        }
      });
    }
    return text.trim();
  };
  
  const handleInsertText = () => {
    if (editorRef.current) {
      try {
        const sfdt = JSON.parse(editorRef.current.documentEditor.serialize()); // Serialize the document
        const replacedSfdt = replaceTextInsideBrackets(sfdt); // Replace text inside brackets
        editorRef.current.documentEditor.open(JSON.stringify(replacedSfdt)); // Open updated content in editor
        setFindReplaceModalOpen(false); // Close Find & Replace modal
      } catch (error) {
        console.error('Error inserting text into document:', error);
      }
    }
  };

  // Function to replace text inside brackets
  const replaceTextInsideBrackets = (sfdt) => {
    let updatedSfdt = { ...sfdt };
    let textIndex = 0;
    if (updatedSfdt && updatedSfdt.sec) {
      updatedSfdt.sec.forEach(section => {
        if (section.blocks && section.blocks.length) {
          section.blocks.forEach(block => {
            if (block.inlines && block.inlines.length) {
              block.inlines.forEach(inline => {
                if (inline.hasOwnProperty('text') && inline.text.includes('[') && inline.text.includes(']')) {
                  let startIndex = inline.text.indexOf('[');
                  let endIndex = inline.text.indexOf(']');
                  if (startIndex !== -1 && endIndex !== -1) {
                    let originalText = inline.text.substring(startIndex, endIndex + 1);
                    inline.text = inline.text.replace(originalText, `[${textsInsideBrackets[textIndex]}]`);
                    textIndex++;
                  }
                }
              });
            }
          });
        }
      });
    }
    return updatedSfdt;
  };
  

  const handleFindText = () => {
    if (findText.trim() !== '') {
      const regex = new RegExp(`\\[${findText}\\]`, 'g');
      const content = editorRef.current.documentEditor.getText();
      const results = [];
      let match;
      while ((match = regex.exec(content)) !== null) {
        results.push({
          match: match[0],
          index: match.index,
        });
      }
      setFindReplaceResults(results);
    }
  };

  const handleReplaceText = () => {
    if (findText.trim() !== '' && replaceText.trim() !== '') {
      const regex = new RegExp(`\\[${findText}\\]`, 'g');
      const content = editorRef.current.documentEditor.getText();
      const replacedContent = content.replace(regex, replaceText);
      editorRef.current.documentEditor.editorModule.insertText(replacedContent);
      setFindReplaceModalOpen(false);
    }
  };

  return (
    <div>
      <button onClick={onSave} style={{ marginBottom: 10, marginRight: 10 }}>Save</button>
      <button onClick={onEdit} style={{ marginBottom: 10, marginRight: 10, borderRadius: '50%' }}>Edit</button>
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} accept=".docx" />
      <button onClick={() => fileInputRef.current.click()} style={{ marginBottom: 10, marginRight: 10 }}>Open</button>
      <button onClick={handleExtract} style={{ marginBottom: 10, marginRight: 10 }}>Extract</button>
      <button onClick={handleInsertClick} style={{ marginBottom: 10, marginRight: 10 }}>Insert</button>
      <button onClick={handleFindReplaceClick} style={{ marginBottom: 10, marginRight: 10 }}>Find & Replace</button>

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
            minConstraints={[400, 200]}
            maxConstraints={[800, 600]}
          >
            <div className="modal-wrapper">
              <div className="modal-content" style={{ width: modalWidth, height: modalHeight }}>
                <div className="modal-header">
                  <span className="modal-drag-handle">Click here to Drag</span>
                  <button onClick={onModalClose} className="modal-close-button">Close</button>
                </div>
                <DocumentEditorContainerComponent 
                  id="modal-container" 
                  height={modalHeight - 60}
                  serviceUrl='http://localhost:6002/api/documenteditor/' 
                  enableToolbar={false}
                  showPropertiesPane={false}
                  showStatusBar={false}
                  ref={modalEditorRef} 
                  textChange={(args) => {
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
          <div className="extract-modal-wrapper">
            <div className="extract-modal-content" style={{ width: 400, height: 200, backgroundColor: 'white' }}>
              <div className="extract-modal-header">
                <span>Insert/Delete Text</span>
                <button onClick={() => setInsertModalOpen(false)} className="modal-close-button">Close</button>
              </div>
              <div className="extract-modal-body" style={{ overflow: 'auto', height: 80 }}>
                <input id="insert-text" type="text" placeholder="Insert text here" />
                <button onClick={handleInsertText} style={{ marginLeft: 10 }}>Insert</button>
                <button onClick={handleDeleteText} style={{ marginLeft: 10 }}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
{findReplaceModalOpen && (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
          <div className="extract-modal-wrapper">
            <div className="extract-modal-content" style={{ width: 400, height: 200, backgroundColor: 'white' }}>
              <div className="extract-modal-header">
                <span>Find & Replace</span>
                <button onClick={() => setFindReplaceModalOpen(false)} className="modal-close-button">Close</button>
              </div>
              <div className="extract-modal-body" style={{ overflow: 'auto', height: 100 }}>
                {textsInsideBrackets.map((text, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      value={text}
                      onChange={(e) => handleInputChange(e, index)}
                      placeholder="Edit text here"
                      style={{ width: '100%', marginBottom: 10 }}
                    />
                  </div>
                ))}
                <button onClick={handleInsertText} style={{ marginLeft: 10 }}>Insert</button>
              </div>
            </div>
          </div>
        </div>
      )}



      {modalOpen && (
        <div className="modal-backdrop" onClick={onModalClose}></div>
      )}
    </div>
  );
}

export default App;







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
      reader.readAsArrayBuffer(file); // Read as array buffer for better compatibility with the DocumentEditor
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
