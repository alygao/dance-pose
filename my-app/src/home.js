import React, { useState } from 'react';
import './home.css';
//posenet

function Home() {
  let professionalInput = React.createRef();
  let ownInput = React.createRef();

  let [professionalVideo, setProfessionalVideo] = useState(null);
  let [ownVideo, setOwnVideo] = useState(null);

  function handleSubmit(event) {
    setProfessionalVideo(professionalInput.value);
    setOwnVideo(ownInput.value);
    console.log("running");
    event.preventDefault();
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
                  id="file"
                  size="60"
                  required 
                  ref={professionalInput}/>
              choose professional video file
              </label>
            </div>

            <div className="choose-file-button">
              <label className="custom-file-upload">
                <input type="file"
                  id="file"
                  size="60"
                  required 
                  ref={ownInput}/>
              choose your own video file
              </label>
            </div>
            
          </p>


          <div className="submit-button">
            <label className="submit-file">
              <input type="submit" size="60" value="Submit" />
                submit
              </label>
          </div>
        </div>
      </form>
    </div>
  );
} 
  
export default Home;
