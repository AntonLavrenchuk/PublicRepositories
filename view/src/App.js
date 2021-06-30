import './App.css';
import {useEffect, useState} from 'react'
import repos from './store.json'
const ApiUrl = 'http://127.0.0.1:5000/get-repositories'

function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [repositories, setRepositories] = useState(null);

  useEffect(() => {
    if( localStorage.getItem('repositories') != null ) {
      setRepositories(JSON.parse(localStorage.getItem('repositories')));
    }
    else {
      fetch(ApiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Not 2xx response")
        }
        response.json();
      })
      .then((data) => {
        localStorage.setItem('repositories', data);
        setRepositories(JSON.parse(data));
      })
      .catch((err) => {
        setError(err);
      });      
    }
  }, [])

  useEffect(() => {
    if(repositories) {
      setIsLoaded(true); 
    } 
  }, [repositories])

  useEffect(() => {
    if(error) {
      setIsLoaded(true); 
    } 
  }, [error])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div>
        <ul>
          {Object.values(repositories).map(repository => (
                <li key={repository.owner}>
                  <p>Name: {repository.name}</p>
                  <p>Owner: {repository.owner}</p>
                  <p>Description: {repository.description}</p>
                  <p>Issues: {repository.issues}</p>
                  <p>Pulls: {repository.pulls}</p>
                  Languages:
                  <ol>
                    {repository.languages.map(language => (
                      <li key={language}>
                        {language}
                      </li>  
                    ))}
                  </ol>
                  <p>Created at: {repository.created_at}</p>
                </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default App;
