import Parameter from "./Parameter";

export default class IntervalParameter extends Parameter {
  getInQuery() {
    if(!this.value.min && !this.value.max) { // user DOESN'T select any criteria
      return '';
    }
    let result = this.name + '=';

    if(this.value.min && this.value.max) { // user selects BOTH criteria
      if(this.value.min > this.value.max) {
        throw new Error("Minimal " + this.name + " can't be bigger than maximal");
      } 
      result = result + this.value.min + '..' + this.value.max;
    }
    else if(this.value.min) { // user selects MIN
      result = result + '>=' + this.value.min;
    }
    else { // user selects MAX
      result = result  + '<=' + this.value.max;
    }

    return result;
  }
}