import React from "react"
import { Outlet } from "react-router-dom"
function Test() {
  
    return (
    <div>
      <h1>Test page</h1>
      <Outlet />
    </div>
    )
  }
  
  export default Test;