if (typeof SupplierForm !== 'function'){
class SupplierForm {


  constructor() {
   
     
      this.addValidation();
      this.addErrorTxt()
  }

addValidation() {
  
  window.SupplierForm.fieldValidationSet['RegistrationCode'] = [window.Validators.required]
  window.SupplierForm.fieldValidationSet['EconomicCode'] = [window.Validators.required,window.Validators.maxLength(16),window.Validators.minLength(12)]
  window.SupplierForm.fieldValidationSet['NationalCode'] = [window.Validators.required,window.Validators.maxLength(10),window.GlobalValidators.justDigits]

  
}

addErrorTxt() {
const RegistrationCode = {
  required: "وارد کردن کد ثبت اجباری می باشد",
}
const EconomicCode = {
  required: "وارد کردن کد اقتصادي اجباری می باشد",
  maxlength: "کد اقتصادي بايد 12 تا 16 رقم باشد",
  minlength: "کد اقتصادي بايد 12 تا 16 رقم باشد"
}
const NationalCode = {
  required: "وارد کردن کد ملي اجباری می باشد",
  justDigits: "مقادير بايد به صورت عدد باشد  ",
  maxlength: "کد ملي بايد 10 رقم باشد",
  minlength: "کد ملي بايد 10 رقم باشد"
}
  window.SupplierForm.errorSet['RegistrationCode'] = RegistrationCode; 
  window.SupplierForm.errorSet['EconomicCode'] = EconomicCode; 
  window.SupplierForm.errorSet['NationalCode'] = NationalCode; 
}


}



var supplierForm = new SupplierForm(); 
}
