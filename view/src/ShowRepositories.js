import './App.css';

function ShowRepositories({repositories}) {
  if(repositories) {
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
              <p>Created at: {repository.last_commit}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }  
  return "Nothing to show"
}

export default ShowRepositories;
