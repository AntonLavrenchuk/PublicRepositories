import './App.css';
import {useEffect, useState} from 'react'
import repos from './store.json'
const ApiUrl = 'http://127.0.0.1:5000/get-repositories'

function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [repositories, setRepositories] = useState(null);

  const [languages, setLanguages] = useState(null)


  function getFilteredRepositories() {
    if(languages) {
      var hasIntersection = (arr1, arr2) => {
        for(const el1 of arr1) {
          for(const el2 of arr2) {
            if( el1 == el2 ) {
              return true;
            }
          }
        }
        return false;
      }

      return repositories.filter(repository => hasIntersection(repository.languages, languages));
    }


    return repositories;
  }

  function handleChangeLanguages(e) {
    let selectedValues = Array.from(e.target.selectedOptions, option => option.value);

    setLanguages(selectedValues);
  }

  function getUniqueLanguages() {

    var resultSet = new Set();

    Object.values(repositories).map(repository => (
      repository.languages.map(language => (
        resultSet.add(language)
      ))
    ));

    return [...resultSet];
  }

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
        return response.json();
      })
      .then((data) => {
        setRepositories(data);
      })
      .catch((err) => {
        setError(err);
      });      
    }
  }, [])

  useEffect(() => {
    if(repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
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
        <form>
          <select name="languages" multiple onChange={handleChangeLanguages}>
            {getUniqueLanguages().map((language) => (
              <option name={language} key = {language}>
                {language}
              </option>
            ))}
          </select>

          <button onClick={(e)=>e.preventDefault()}>Submit</button>
        </form>
        <ul>
          {Object.values(getFilteredRepositories()).map(repository => (
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
