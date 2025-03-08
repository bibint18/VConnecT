

function Home() {
  const cookie = document.cookie
  return (
    <div>
      <h1 style={{color:"black"}}>Home page</h1>
      <p>{cookie}</p>
    </div>
  )
}

export default Home
