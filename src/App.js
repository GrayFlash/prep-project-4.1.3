import React, {useState, useEffect} from 'react';
import MyMap from "./components/MyMap";
import logo from "./assets/img/mlh-prep.png";
import useWeather from "./helpers/customHooks/useWeather";
import RequiredThings from "./components/RequiredThings";
import WeatherCard from './components/WeatherCard';
import Loader from './components/Loader';
import SearchOption from './helpers/SearchOption/SearchOption';
import alanBtn from "@alan-ai/alan-sdk-web";

const App = () => {
  const {
    city,
    results,
    isLoading,
    isLoaded,
    setCity,
    error,
	cityRes,
    fetchWeatherUsingCoordinates,
    cityObj,
    setCityObj
  } = useWeather();
  
  const [reactLoading, setReactLoading] = useState(true);
  
  function fakeRequest() {
    return new Promise(resolve => setTimeout(() => resolve(), 1000));
  }

  useEffect(() => {
    //adding alan ai button on home page
    alanBtn({
      key: process.env.REACT_APP_ALAN_APIKEY,
      onCommand: function (commandData) {
        if (commandData.command === "city") {
          //setting city to show the weather of the vity asked through voice command
          setCity(commandData.cityname.value);
        }
      },
      zIndex: 10000000
    });
  }, []);

  useEffect(() => {
    fakeRequest().then(() => {
      const el = document.querySelector(".loader-wrapper");
      if (el) {
        el.remove();
        setReactLoading(!reactLoading);
      }
    });
  }, []);
  

  return (
    <>
      <img className="logo" src={logo} alt="MLH Prep Logo"></img>
      <div>

      <div className="locator">
              <div className="searchbox">
                <div>
                  <h2>Enter a city below 👇</h2>
                </div>
                <SearchOption
                  city={city}
                  onChange={(event) => setCity(event.target.value)} 
                  updateCity={(city) => setCity(city)} 
                  updateCityObj={(city) => setCityObj(city)}
                />
              </div>
              <div className="mymap">
                {cityRes && (<MyMap
                      lon={cityRes?.coord?.lon}
                      lat={cityRes?.coord?.lat}
                      name={cityRes?.name}
                      fetchWeatherUsingCoordinates={fetchWeatherUsingCoordinates}
                      temp={cityRes?.main.feels_like}
                />)}
              </div>
            </div>
        {isLoading && (
          <>
            <div style = {{marginTop: '100px'}} className = "loader-svg">
              <Loader />
            </div>
          </>
        )}
        {/* {console.log("error " + error)}
        {console.log("results" + results)} */}

        {isLoaded && error && (
          <div>Error: {error.message}</div>
        )}

        {isLoaded && results && error==null && (
          <>
            <WeatherCard results={results} city={cityRes}/>

            

            <div>
              <RequiredThings results={cityRes} />
            </div>
          </>
        )}

      </div>
    </>
  );
};

export default App;
