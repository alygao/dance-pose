import React, { useState } from 'react';
import './home.css';
//posenet

function Home() {
  let professionalInput = React.createRef();
  let ownInput = React.createRef();

  let [professionalVideo, setProfessionalVideo] = useState(null);
  let [ownVideo, setOwnVideo] = useState(null);

  function handleSubmit(event) {
    event.preventDefault();
    // const files = Array.from(event.target.files)
    // setProfessionalVideo(files[0]);
    // setOwnVideo(files[1]);
    console.log("running");
  }

  function handleProfessionalChange(e) {
    const files = Array.from(e.target.files)
    setProfessionalVideo(files[0]);
  }

  function handleOwnChange(e) {
    const files = Array.from(e.target.files)
    setOwnVideo(files[0]);
  }

  return (
    <div className="Home">
      <header className="Home-header">
        <p>Hello World!</p>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="buttons">

            <div className="choose-file-button">
              <label className="custom-file-upload">
                <input type="file"
                  id="file"
                  size="60"
                  required 
                  ref={professionalInput}
                  onChange={handleProfessionalChange}/>
              choose professional video file
              </label>
            </div>

            <div className="choose-file-button">
              <label className="custom-file-upload">
                <input type="file"
                  id="file"
                  size="60"
                  required 
                  ref={ownInput}
                  onChange={handleOwnChange}/>
              choose your own video file
              </label>
            </div>
    


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
