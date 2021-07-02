import {useState} from 'react'

import ArrayParameter from './ArrayParameter.js';
import IntervalParameter from './IntervalParameter';
import ParametersBuilder from './ParametersBuilder';

function SetSearchCriteria({setRoute}) {

  const [error, setError] = useState(null);
  const [languages, setLanguages] = useState(null);
  const [stars, setStars] = useState({
    min: null, 
    max: null 
  });
  const [lastCommit, setLastCommit] = useState({
    min: null, 
    max: null 
  });

  function getDateStrInCorrectFormat(date) {
    date = new Date(date);

    return date.getFullYear() 
      + '-' + (date.getMonth() + 1) 
      + '-' + date.getDate();
  }

  //Handlers

  function handleSubmit(e) {
    e.preventDefault();

    let query = { 
      path: '/repositories/filter?', 
      parametrs: '' 
    };

    var builder = new ParametersBuilder([
      new ArrayParameter(languages, 'languages'),
      new IntervalParameter(stars, 'stars'),
      new IntervalParameter(lastCommit, 'last_commit')
    ]);
  
    query.parametrs = builder.getParametersInQuery();

    if( query.parametrs === '' ) {
      query.path = '/repositories';
    }

    setRoute(query.path + query.parametrs);
  }

  function handleChangeMinLastCommit(e) {
    setLastCommit( {...lastCommit, min: getDateStrInCorrectFormat(e.target.value) } );
  }

  function handleChangeMaxLastCommit(e) {
    setLastCommit( {...lastCommit, max: getDateStrInCorrectFormat(e.target.value) } );
  }

  function handleChangeLanguages(e) {
    setLanguages(e.target.value);
  }

  function handleChangeMinStars(e) {
    setStars( {...stars, min: parseInt(e.target.value) } );
  }

  function handleChangeMaxStars(e) {
    setStars( {...stars, max: parseInt(e.target.value) } );
  }

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

        <button onClick={handleSubmit}>Submit</button>
      </form>
      <p>{error}</p>
    </div>
  );
}
export default SetSearchCriteria;