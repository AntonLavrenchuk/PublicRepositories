import './App.css';
import {useEffect, useState} from 'react'
import Repositories from './Repositories'

const BASE = 'http://127.0.0.1:5000'

function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [repositories, setRepositories] = useState([]);

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

  function getDateStrInCorrectFormat(date) {
    return date.getFullYear() 
      + '-' + (date.getMonth() + 1) 
      + '-' + date.getDate();
  }

  function handleChangeMinLastCommit(e) {
    let date = new Date(e.target.value);

    setLastCommit( {...lastCommit, min: getDateStrInCorrectFormat(date) } );
  }

  function handleChangeMaxLastCommit(e) {
    let date = new Date(e.target.value);

    setLastCommit( {...lastCommit, max: getDateStrInCorrectFormat(date) } );
  }


  function getRepositoriesFromServer(route) {
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

  function getLanguagesQuery() {
    if(!languages) {
      return '';
    }
    return 'languages=' + languages.toString(); 
  }

  function getIntervalQuery(obj, paramName) {
    if(!obj.min && !obj.max) { // user DOESN'T select any criteria
      return '';
    }
    paramName += '=';

    if(obj.min && obj.max) { // user selects BOTH criteria
      if(obj.min > obj.max) {
        setError(new Error("Minimal" + paramName + "can't be bigger than maximal"));
      } 
      return paramName + obj.min + '..' + obj.max;
    }
    if(obj.min) { // user selects MIN
      return paramName + '>=' + obj.min;
    }
    // user selects MAX
    return paramName + '<=' + obj.max;
  }

  function getStarsQuery() {
    return getIntervalQuery(stars, 'stars');
  }

  function getLastCommitQuery() {
    return getIntervalQuery(lastCommit, 'last_commit');
  }

  function getParametrStr( parameter, query ) {
    if( query.parametrs && parameter ) {
      parameter = '&' + parameter;
    }
    query.parametrs += parameter;
  }

  function submitForm(e) {
    setIsLoaded(false);

    e.preventDefault();

    let query = { path: '/repositories/filter?', parametrs: '' };

    getParametrStr(getLanguagesQuery(), query);
    getParametrStr(getStarsQuery(), query);
    getParametrStr(getLastCommitQuery(), query);

    getRepositoriesFromServer(query.path + query.parametrs);
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
    if(repositories.length) {
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
        <Repositories repositories={repositories}/>
      </div>
    );
  }
}

export default App;
