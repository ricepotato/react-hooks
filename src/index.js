import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import { ScriptElementKind } from "typescript";

const useFadeIn = (duration = 1, delay = 2) => {
  const element = useRef();
  useEffect(() => {
    if (element.current) {
      const { current } = element;
      current.style.transition = `opacity ${duration}s ease-in-out ${delay}s`;
      current.style.opacity = 1;
    }
  });
  return { ref: element, style: { opacity: 0 } };
};

const useNetwork = (onChange) => {
  const [status, setStatus] = useState(navigator.onLine);
  const handleChange = () => {
    if (typeof onChange === "function") {
      onChange(navigator.onLine);
    }
    setStatus(navigator.onLine);
  };
  useEffect(() => {
    window.addEventListener("online", handleChange);
    window.addEventListener("offline", handleChange);
  }, []);
  return status;
};

const useGeolocaton = () => {
  const [currentPosition, setPosition] = useState({
    coords: { lat: null, long: null },
    error: null,
  });
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPosition({
          coords: {
            lat: position.coords.latitude,
            long: position.coords.longitude,
          },
          error: null,
        });
      },
      (error) => {
        setPosition({ coords: { lat: null, long: null }, error: true });
      }
    );
  } else {
    setPosition({ coords: { lat: null, long: null }, error: true });
  }
  return currentPosition;
};

const useClick = (onClick) => {
  const element = useRef();
  useEffect(() => {
    // componentDidMount
    if (element.current) {
      element.current.addEventListener("click", onClick);
    }
    // componentWillUnMount
    return () => {
      if (element.current) {
        element.current.removeEventListener("click", onClick);
      }
    };
  }, []);
  return element;
};

const useKeyPress = (inputKey) => {
  const [state, setState] = useState(false);
  const handleKeyPress = (event) => {
    const { key } = event;
    if (key === inputKey) {
      setState(true);
    }
  };
  const handleKeyUp = (event) => {
    const { key } = event;
    if (key === inputKey) {
      setState(false);
    }
  };
  useEffect(() => {
    window.addEventListener("keypress", handleKeyPress);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keypress", handleKeyPress);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);
  return state;
};

const useLocalStorage = (name, initialValue) => {
  const [value, setValue] = useState(initialValue);
  const setLS = (value) => {
    localStorage.setItem(name, value);
    setValue(value);
  };
  return [value, setLS];
};

const useDeviceOrientation = () => {
  const [orientation, setOrientation] = useState({
    alpha: null,
    beta: null,
    gamma: null,
  });
  const handleDeviceOrientation = (event) => {
    const { alpha, beta, gamma } = event;
    setOrientation({ alpha, beta, gamma });
  };
  useEffect(() => {
    window.addEventListener("deviceorientation", handleDeviceOrientation);
    return () => {
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
    };
  }, []);
  return orientation;
};

const useMousePosition = () => {
  const [currentPosition, setPosition] = useState({ x: 0, y: 0 });
  const handleMouseMove = (event) => {
    setPosition({ x: event.screenX, y: event.screenY });
  };
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  return currentPosition;
};

const useScroll = () => {
  const [state, setState] = useState(false);
  const body = document.querySelector("body");

  const lockScroll = () => {
    body.style.overflow = "hidden";
    setState(true);
  };
  const unlockScroll = () => {
    body.style.overflow = "scroll";
    setState(false);
  };

  return [state, { lockScroll, unlockScroll }];
};

const useFavicon = (initialFaviconUrl) => {
  const setFavicon = (newFaviconUrl) => {
    const favicon = document.querySelector("link[rel='shortcut icon'");
    favicon.setAttribute("href", newFaviconUrl);
  };
  setFavicon(initialFaviconUrl);
  return setFavicon;
};

function App() {
  const initialFaviconUrl =
    "https://nomad-coders-assets.s3.amazonaws.com/static/img/m.svg";
  const onTitleClick = () => {
    console.log("say hello");
  };
  const fadeInh1 = useFadeIn(1, 1);
  const online = useNetwork();
  const title = useClick(onTitleClick);

  const {
    coords: { lat, long },
    error,
  } = useGeolocaton();

  const kPressed = useKeyPress("k");
  const iPressed = useKeyPress("i");
  const mPressed = useKeyPress("m");
  const cPressed = useKeyPress("c");
  const hPressed = useKeyPress("h");

  const [currentLS, setLS] = useLocalStorage("JWT", "12345");
  const { alpha, beta, gamma } = useDeviceOrientation();
  const { x, y } = useMousePosition();
  const [isLocked, { lockScroll, unlockScroll }] = useScroll();
  const setFavicon = useFavicon(initialFaviconUrl);

  return (
    <div className="App">
      <div>
        <h1 {...fadeInh1}>Superhooks!</h1>
        <h2>Start editing to see some magic happen!</h2>
      </div>
      <div>
        <h3>useDeviceOrientation</h3>
        <ul>
          <li>Alpha : {alpha}</li>
          <li>Beta : {beta}</li>
          <li>Gamma : {gamma}</li>
        </ul>
      </div>
      <div>
        <h3>Change Favicon</h3>
        <button
          onClick={() =>
            setFavicon(
              "https://static.xx.fbcdn.net/rsrc.php/yD/r/d4ZIVX-5C-b.ico"
            )
          }
        >
          Chage Favicon
        </button>
      </div>
      <div>
        <h3>useGeolocation</h3>
        <ul>
          <li>Latitude : {lat}</li>
          <li>Longitude : {long}</li>
          <li>Geolocation Error : {error}</li>
        </ul>
      </div>
      <div>
        <h3>useMousePosition</h3>
        <ul>
          <li>Mouse X :{x}</li>
          <li>Mouse Y :{y}</li>
        </ul>
      </div>
      <div>
        <h3>useOnline</h3>
        <div>Are we online ? {online ? "Yes" : "No"}</div>
      </div>
      <div>
        <h3>useClick</h3>
        <h4 ref={title}>Title !</h4>
      </div>
      <div>
        <h3>useKeyPress</h3>
        <ul>
          <li>Pressed 'k': {kPressed && "K"}</li>
          <li>Pressed 'i': {iPressed && "I"}</li>
          <li>Pressed 'm': {mPressed && "M"}</li>
          <li>Pressed 'c': {cPressed && "C"}</li>
          <li>Pressed 'h': {hPressed && "H"}</li>
          <li>Pressed 'i': {iPressed && "I"}</li>
        </ul>
      </div>
      <div>
        <h3>useLocalStorage</h3>
        <ul>
          <li>Current Value: {currentLS}</li>
          <button onClick={() => setLS("12345")}>Set value : 12345</button>
          <button onClick={() => setLS(null)}>Clear LS</button>
        </ul>
      </div>
      <div>
        <h3>useLockScroll</h3>
        <div>Is Locked ? {isLocked ? "Yes" : "No"}</div>
        <button onClick={() => lockScroll()}>Lock Scroll</button>
        <button onClick={() => unlockScroll()}>Uplock Scroll</button>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
