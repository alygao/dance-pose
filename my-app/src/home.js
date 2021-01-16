import React from 'react';
import './home.css';

function Home() {
  function handleSubmit() {
    console.log("hi")
  }
  
  return (
    <div className="Home">
      <header className="Home-header">
        <p>Hello World!</p>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="buttons">
          <p>
            <div className="choose-file-button">
              <label className="custom-file-upload">
                <input type="file"
                  id="image"
                  accept="image/png, image/jpeg"                  size="60"
                  required
                  />
              choose a file
              </label>
            </div>
          </p>


          <div className="submit-button">
            <label className="submit-file">
              <input type="submit" size="60" />
                submit
              </label>
          </div>
        </div>
      </form>
    </div>
  );
} 
  
export default Home;
