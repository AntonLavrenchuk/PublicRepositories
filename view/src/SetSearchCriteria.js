import {useEffect, useState} from 'react'


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

  function getIntervalQuery(obj, paramName) {
    if(!obj.min && !obj.max) { // user DOESN'T select any criteria
      return '';
    }
    paramName += '=';

    if(obj.min && obj.max) { // user selects BOTH criteria
      if(obj.min > obj.max) {
        setError("Minimal " + paramName + " can't be bigger than maximal");
      } 
      return paramName + obj.min + '..' + obj.max;
    }
    if(obj.min) { // user selects MIN
      return paramName + '>=' + obj.min;
    }
    // user selects MAX
    return paramName + '<=' + obj.max;
  }

  function getLanguagesQuery() {
    if(!languages) {
      return '';
    }
    return 'languages=' + languages.toString(); 
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

  function getDateStrInCorrectFormat(date) {
    return date.getFullYear() 
      + '-' + (date.getMonth() + 1) 
      + '-' + date.getDate();
  }


  //Handlers

  function submitForm(e) {
    e.preventDefault();

    let query = { 
      path: '/repositories/filter?', 
      parametrs: '' 
    };

    getParametrStr(getLanguagesQuery(), query);
    getParametrStr(getStarsQuery(), query);
    getParametrStr(getLastCommitQuery(), query);

    if( query.parametrs === '' ) {
      query.path = '/repositories';
    }

    setRoute(query.path + query.parametrs);
  }

  function handleChangeMinLastCommit(e) {
    let date = new Date(e.target.value);

    setLastCommit( {...lastCommit, min: getDateStrInCorrectFormat(date) } );
  }

  function handleChangeMaxLastCommit(e) {
    let date = new Date(e.target.value);

    setLastCommit( {...lastCommit, max: getDateStrInCorrectFormat(date) } );
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

        <button onClick={submitForm}>Submit</button>
      </form>
      <p>{error}</p>
    </div>
  );
}
export default SetSearchCriteria;