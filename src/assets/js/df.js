class DF {

  constructor() {
  
    this.initScript();
  }



initScript(){

  const desc = document.querySelector('textarea[name="246"]');
  desc.addEventListener("keypress", this.runScript);
}
runScript(){
   
  window.DF.form.get("246").setValue("Description");}
}

var df = new DF(); 