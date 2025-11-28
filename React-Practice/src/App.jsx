
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Card from "./components/Card"
import { useState, useEffect } from "react"

function App() {
  const [count, setCount] = useState(0)
  const [first, setFirst] = useState(0)
  const [color, setColor] = useState(0)

  
  //run on count change
  useEffect(() => {
    alert("count  was changed")
    setColor(color + 1)
  }, [count])
  
  return (
    <>
         <Navbar color = {"red" + color}/>
         <Footer/>
         <div className="card" class = 'flex'>
          <Card title = "Card 1" description = "This is Card 1"/>
          <Card title = "Card 2" description = "This is Card 2"/>
          <Card title = "Card 3" description = "This is Card 3"/>
          <Card/>
        </div>
        <div>The count is {count}</div>
        <button class = 'border-2 p-2 rounded-md' onClick={()=>{setCount(count + 1)}}>Increment Count</button>         
    </>
  )
}

export default App
