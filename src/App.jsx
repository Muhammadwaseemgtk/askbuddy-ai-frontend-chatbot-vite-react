import ChatWindow from "./components/ChatWindow";


const App = () => {

  return (
    <div 
    className="min-h-screen flex flex-col bg-blue-100">
      <h1
      className="text-center mt-7 text-blue-700 font-bold text-2xl"
      >AskBuddy-AI welcomes you.</h1>
      <ChatWindow />
    </div>
  )
}

export default App;