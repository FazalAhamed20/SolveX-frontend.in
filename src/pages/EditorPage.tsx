import CodeEditor from "../components/problem/Editor"
import Navbar from "../components/navbar/Navbar"


  
  const initialCode = `
  function runTest() {
    // Example code to be evaluated
    return 'Hello World';
  }
  runTest();
  `;

function EditorPage() {
  return (
    <div>
        <Navbar/>
        <CodeEditor 
          initialCode={initialCode} problemDescription={""}/>
      
    </div>
  )
}

export default EditorPage
