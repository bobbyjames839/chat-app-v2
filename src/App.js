import { useState } from "react";
import Login from "./Login";
import Cookies from "universal-cookie";
import Main from "./Main";

const cookies = new Cookies();

function App() {

  const [isAuth, setIsAuth] = useState(cookies.get('auth-token'));

  return (
    <div>

      {isAuth ? <Main setIsAuth={setIsAuth}/> : <Login setIsAuth={setIsAuth}/>}
    </div>
  );
}

export default App;
