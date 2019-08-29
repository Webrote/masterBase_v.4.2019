/* global document */

const closest = require('closest');
const ready = require('../../js/utils/documentReady.js');

ready(function(){


  // Навешиваем на форму событие submit
  function formListener(form) {

    form.addEventListener('submit', function(e){
      let valid = true;

      // Проверим ИНН поля
      const fieldsINN = Array.from(form.querySelectorAll('input[data-check-inn]'));
      fieldsINN.forEach(function(input){
        input.addEventListener('blur', function(){ checkFieldINN(input); });
        if(!checkFieldINN(input)) valid = false;
      });
      // Проверим все текстовые инпуты
      const fieldsText = Array.from(form.querySelectorAll('input[data-check-pattern]')).concat(Array.from(form.querySelectorAll('textarea[data-check-pattern]')));
      fieldsText.forEach(function(input){
        if(!checkFieldText(input)) valid = false;
      });
      // Проверим все чекбоксы
      const fieldsCheckbox = Array.from(form.querySelectorAll('input[data-check-state]'));
      fieldsCheckbox.forEach(function(input){
        if(!checkFieldCheckbox(input)) valid = false;
      });
      // Если были ошибки, не отправляем форму
      if(!valid) e.preventDefault();
    });

  }

  // Навешиваем на поля событие blur, input..
  function inputsListeners(parent) {

    // Для всех проверяемых текстовых полей добавляем класс "field-text_not-empty"
    const inputNotEmpty = Array.from(parent.querySelectorAll('input[data-notempty]')).concat(Array.from(parent.querySelectorAll('textarea[data-notempty]')));;
    inputNotEmpty.forEach(function(input){
      input.addEventListener('blur', function(){ addClassNotEmpty(input); });
    });
    
    // Для всех проверяемых ИНН полей
    const fieldsINN = Array.from(parent.querySelectorAll('input[data-check-inn]'));
    fieldsINN.forEach(function(input){
      input.addEventListener('blur', function(){ checkFieldINN(input); });
      // input.addEventListener('keyup', function(){ checkFieldText(input); });
    });

    // Для всех проверяемых текстовых полей
    const fieldsText = Array.from(parent.querySelectorAll('input[data-check-pattern]')).concat(Array.from(parent.querySelectorAll('textarea[data-check-pattern]')));
    fieldsText.forEach(function(input){
      input.addEventListener('blur', function(){ checkFieldText(input); });
      input.addEventListener('keyup', function(){ checkFieldText(input); });
    });

    // Для всех проверяемых чекбоксов
    const fieldsCheckbox = Array.from(parent.querySelectorAll('input[data-check-state]'));
    fieldsCheckbox.forEach(function(input){
      input.addEventListener('change', function(){ checkFieldCheckbox(input); });
    });
  }

  window.formValidationInit = function (elemForm) {
    if (elemForm) {

      // Только для выбранной формы
      formListener(elemForm);
      inputsListeners(elemForm);

    } else {
      // Для всех форм страницы
      const forms = Array.from(document.querySelectorAll('form[data-check-form]'));
      forms.forEach( function(form) {
        formListener(form);
      });

      inputsListeners(document);
    }
  }
  

  function addClassNotEmpty(input) {
    const result = input.value !== '';
    const notEmptyClass = 'field-text_not-empty';
    const parent = closest(input, '.field-text');
    result ? parent.classList.add(notEmptyClass) : parent.classList.remove(notEmptyClass);
    return result;
  }

  function checkFieldText(input) {
    const regExp = new RegExp(input.dataset.checkPattern, 'gi');
    const result = regExp.test(input.value);
    const errorClass = 'field-text_error';
    const parent = closest(input, '.field-text');
    result ? parent.classList.remove(errorClass) : parent.classList.add(errorClass);
    return result;
  }

  function checkFieldCheckbox(input) {
    const trueVal = input.dataset.checkState == 'on' ? true : false;
    const result = trueVal === input.checked
    const errorClass = 'field-checkbox__input-wrap_error';
    const parent = closest(input, '.field-checkbox__input-wrap');
    result ? parent.classList.remove(errorClass) : parent.classList.add(errorClass);
    return result;
  }

  function checkFieldINN(input) {
    const result = checkINN(input.value);
    const errorClass = 'field-text_error';
    // const parent = closest(input, '.field-text');
    const parent = input.closest('.field-text');
    result ? parent.classList.remove(errorClass) : parent.classList.add(errorClass);
    return result;
  }

  function checkINN(inputNumber){
    //преобразуем в строку
    inputNumber = String(inputNumber);
    //преобразуем в массив
    inputNumber = inputNumber.split('');
    //для ИНН в 10 знаков
    if((inputNumber.length == 10) && (inputNumber[9] == ((2 * inputNumber[  0] + 4 * inputNumber[1] + 10 * inputNumber[2] + 3 * inputNumber[3] + 5 * inputNumber[4] + 9 * inputNumber[5] + 4 * inputNumber[6] + 6 * inputNumber[7] + 8 * inputNumber[8]) % 11) % 10)){
      return true;
    //для ИНН в 12 знаков
    }else if((inputNumber.length == 12) && ((inputNumber[10] == ((7 * inputNumber[ 0] + 2 * inputNumber[1] + 4 * inputNumber[2] + 10 * inputNumber[3] + 3 * inputNumber[4] + 5 * inputNumber[5] + 9 * inputNumber[6] + 4 * inputNumber[7] + 6 * inputNumber[8] + 8 * inputNumber[9]) % 11) % 10) && (inputNumber[11] == ((3 * inputNumber[ 0] + 7 * inputNumber[1] + 2 * inputNumber[2] + 4 * inputNumber[3] + 10 * inputNumber[4] + 3 * inputNumber[5] + 5 * inputNumber[6] + 9 * inputNumber[7] + 4 * inputNumber[8] + 6 * inputNumber[9] + 8 * inputNumber[10]) % 11) % 10))){
      return true;
    }else{
      return false;
    }
  }


  formValidationInit();
});
