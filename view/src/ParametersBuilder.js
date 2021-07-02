export default class ParametersBuilder {
  constructor(parameters) {
    this.parameters = parameters;
    this.parametersInQuery = '';
  }

  getParametersInQuery() {
    this.parameters.forEach(parameter => {
      this.addParametr(parameter);
    });

    return this.parametersInQuery;
  }
  
  addParametr( parameter ) {
    if( this.parametersInQuery && parameter.getInQuery() ) {
      this.parametersInQuery += '&';
    }
    this.parametersInQuery += parameter.getInQuery();
  }
}
