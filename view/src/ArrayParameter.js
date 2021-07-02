import Parameter from "./Parameter";

export default class ArrayParameter extends Parameter {
  getInQuery() {
    if(!this.value) {
      return '';
    }
    let result = this.name + '=' + this.value.toString() 
    return result; 
  }
}