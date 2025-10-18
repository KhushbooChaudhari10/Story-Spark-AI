import React1, {useEffect} from 'react'
import "./Navbar.css"

const Navbar = ({color}) => {
  //run on every render
  useEffect(() => {
    alert("Hey, I will run on every render")
  })

  //run on first render
  useEffect(() => {
    alert("Hey, Welcome to my page")
  }, [])

  //run when certain values change

  useEffect(() => {
    alert("I'm running because color was changed")
  }, [color])
  

  
  return (
    <body class = 'bg-amber-100'>
    <div class='bg-neutral-400 p-4 m-0 flex'>
        <nav>
            <ul class = 'flex gap-32'>
                <li class = 'list-style-none'>Home</li>
                <li class = 'list-style-none'>Contact</li>
                <li class = 'list-style-none'>About</li>
            </ul>
        </nav>
      
    </div>
    <div>
      I am navbar of {color} color
    </div>
    </body>
  )
}

export default Navbar
