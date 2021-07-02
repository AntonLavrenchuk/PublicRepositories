import './App.css';
import {useEffect, useState} from 'react'
import ShowRepositories from './ShowRepositories'
import SetSearchCriteria from './SetSearchCriteria'

const BASE = 'http://127.0.0.1:5000'

function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [repositories, setRepositories] = useState([]);
  const [route, setRoute] = useState('');


  function getRepositoriesFromServer() {
    fetch(BASE + route)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Something went wrong")
      }
      return response.json();
    })
    .then((data) => {
      setRepositories(data);
    })
    .catch((err) => {
      setError(err);
    });      
  }

  useEffect(() => {
    if( localStorage.getItem('repositories') != null ) {
      setRepositories(JSON.parse(localStorage.getItem('repositories')));
    }
    else {
      setRoute('/repositories');
    }
  }, [])

  useEffect(() => {
    console.log(route);
    if(route) {
      console.log(route);
      // getRepositoriesFromServer();
    }
  }, [route]);

  useEffect(() => {
    if(repositories.length) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
      setIsLoaded(true); 
    } 
  }, [repositories])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div>
        <SetSearchCriteria setRoute={setRoute}/>
        <ShowRepositories repositories={repositories}/>
      </div>
    );
  }
}

export default App;
