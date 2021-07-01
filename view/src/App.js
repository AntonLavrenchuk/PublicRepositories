import './App.css';
import {useEffect, useState} from 'react'
import repos from './store.json'

const BASE = 'http://127.0.0.1:5000'

function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [repositories, setRepositories] = useState(null);

  const [languages, setLanguages] = useState(null);
  const [stars, setStars] = useState({
    min: null, 
    max: null 
  });
  const [lastCommit, setLastCommit] = useState({
    min: null, 
    max: null 
  });

  function handleChangeLanguages(e) {
    setLanguages(e.target.value);
  }

  function handleChangeMinStars(e) {
    setStars( {...stars, min: parseInt(e.target.value) } );
  }

  function handleChangeMaxStars(e) {
    setStars( {...stars, max: parseInt(e.target.value) } );
  }

  function getDateStrInProperFormat(date) {
    return date.getFullYear() 
      + '-' + (date.getMonth() + 1) 
      + '-' + date.getDate();
  }

  function handleChangeMinLastCommit(e) {
    let date = new Date(e.target.value);

    console.log(date)

    setLastCommit( {...lastCommit, min: getDateStrInProperFormat(date) } );
  }

  function handleChangeMaxLastCommit(e) {
    let date = new Date(e.target.value);

    setLastCommit( {...lastCommit, max: getDateStrInProperFormat(date) } );
  }


  function getRepositoriesFromServer(route) {
    fetch(BASE + route)
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

  function getLanguagesQuery() {
    if(!languages) {
      return '';
    }
    return 'languages=' + languages.toString(); 
  }

  function getStarsQuery() {
    if(!Number.isInteger(stars.min) && !Number.isInteger(stars.max)) { // user DOESN'T select any criteria
      return '';
    }
    const paramName = 'stars=';

    if(Number.isInteger(stars.min) && Number.isInteger(stars.max)) { // user selects BOTH criteria
      if(stars.min > stars.max) {
        setError(new Error("Minimal star count can't be bigger than maximal star count"));
      } 
      return paramName + stars.min + '..' + stars.max;
    }
    if(Number.isInteger(stars.min)) { // user selects MIN stars
      return paramName + '>=' + stars.min;
    }
    // user selects MAX stars
    return paramName + '<=' + stars.max;
    
  }

  function getLastCommitQuery() {
    if(!lastCommit.min && !lastCommit.max) { // user DOESN'T select any criteria
      return '';
    }
    const paramName = 'last_commit=';

    if(lastCommit.min && lastCommit.max) { // user selects BOTH criteria
      if(lastCommit.min > lastCommit.max) {
        setError(new Error("Minimal commit date can't be bigger than maximal last commit date"));
      } 
      return paramName + lastCommit.min + '..' + lastCommit.max;
    }
    if(lastCommit.min) { // user selects MIN date
      return paramName + '>=' + lastCommit.min;
    }
    // user selects MAX date
    return paramName + '<=' + lastCommit.max;
  }

  function submitForm(e) {
    e.preventDefault();

    let query = '/repositories/filter?';

    query += getLanguagesQuery();
    query += getStarsQuery();
    query += getLastCommitQuery();

    getRepositoriesFromServer(query);
  }

  useEffect(() => {
    if( localStorage.getItem('repositories') != null ) {
      setRepositories(JSON.parse(localStorage.getItem('repositories')));
    }
    else {
      getRepositoriesFromServer('/repositories');
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
          <p>
            Languages:
            <input name="languages" onChange={handleChangeLanguages}></input>
          </p>

          <p>
            Stars:
            <input type='number' name='minStars' placeholder='from' onChange={handleChangeMinStars}></input>
            <input type='number' name='maxStars' placeholder='to' onChange={handleChangeMaxStars}></input>
          </p>

          <p>
            Last commit:
            <input type="datetime-local" name='minLastCommit' placeholder='from' onChange={handleChangeMinLastCommit}></input>
            <input type="datetime-local" name='maxLastCommit' placeholder='to' onChange={handleChangeMaxLastCommit}></input>
          </p>

          <button onClick={submitForm}>Submit</button>
        </form>
        <ul>
          {Object.values(repositories).map(repository => (
                <li key={repository.owner}>
                  <p>Name: {repository.name}</p>
                  <p>Owner: {repository.owner}</p>
                  <p>Description: {repository.description}</p>
                  <p>Issues: {repository.issues}</p>
                  <p>Pulls: {repository.pulls}</p>
                  <p>Stars: {repository.stars}</p>
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
