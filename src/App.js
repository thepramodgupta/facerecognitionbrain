import React, {Component} from 'react';
import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/imagelinkform/ImageLinkForm';
import Rank from './components/rank/Rank';
import './App.css';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognition from './components/faceRecognition/FaceRecognition'

const app = new Clarifai.App({
  apiKey: '8b0f874582854e0e8223cde82095db13'
 });

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_are: 800 
      }
    }
  }
}
class App extends Component {
  constructor(){
    super();
    this.state = {
      input : '',
      imageURL: '',
      box: {}
    }
  }

  onInputChange = (event) => {
    console.log(event.target.value);
    this.setState({
      input:event.target.value
    });
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({ box: box});
  }

  onButtonSubmit = () => {
  this.setState({
    imageURL: this.state.input
  });
  console.log('click');
  app.models
    .predict(
      Clarifai.FACE_DETECT_MODEL, //model key, in our case face recognition
      this.state.input)
    .then(response => {
      this.displayFaceBox(this.calculateFaceLocation(response));
      console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
    })
    .catch(err => console.log(err));
  } 
  render() {
    return (
      <div className="App">
          <Particles className="particles"
            params={ particlesOptions}
            
          />
         <Navigation />
         <Logo />
         <Rank />
         <ImageLinkForm onInputChange={ this.onInputChange } onButtonSubmit= { this.onButtonSubmit }/>
         <FaceRecognition imageURL = { this.state.imageURL } box = { this.state.box }/>
      </div>
    );
  }
}

export default App;
