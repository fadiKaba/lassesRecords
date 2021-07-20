const sections = document.querySelectorAll('.sections');
const navItems = document.querySelectorAll('.nav-link');
const productsContainer = document.querySelector('#products-container .row');
const cartContainer = document.querySelector('#cart-container tbody');

const firstName = document.querySelector('#firstName');
const lastName = document.querySelector('#lastName');
const email = document.querySelector('#email');
const phone = document.querySelector('#phone');
const talent = document.querySelector('#talent');
const address = document.querySelector('#address');
const password = document.querySelector('#password');
const confirmPassword = document.querySelector('#confirm-password');
const errorsContainer = document.querySelector('#errors-container .modal-body ul');

       /* Add product and prices here */
    
let products = [
    {id: 1,name: 'product 1', price: 400, src: 'src/imgs/product1.jpeg'},
    {id: 7,name: 'product 7', price: 200, src: 'src/imgs/product7.jpeg'},
    {id: 2,name: 'product 2', price: 200, src: 'src/imgs/product2.jpeg'},
    {id: 4,name: 'product 4', price: 250, src: 'src/imgs/product4.jpeg'},
    {id: 5,name: 'product 5', price: 230, src: 'src/imgs/product5.jpeg'},
    {id: 6,name: 'product 6', price: 350, src: 'src/imgs/product6.jpeg'},
    {id: 3,name: 'product 3', price: 300, src: 'src/imgs/product3.jpeg'},
];
    
      /* End Add product and prices here */

let cart = [];

let productNumber = 0;

let errors = [];

function main(){
  showSection();
  checkCookie(cart);
  fillProductsContainer(products);
  setCartBadge(cart.length);
  fillCartContainer(cart);
}

                     /* change Errors message here */

function formSubmit(f){
    let fields = [
        normalTextValidation(firstName, 'First name must contains more than on character'),
        normalTextValidation(lastName, 'Last name must contains more than on character'),
        emailValidation(email, 'Email is not valid'),
     //   phoneValidation(phone, 'Phone is not valid'),
        normalTextValidation(phone, 'Phone is required'),
        genderValidate('Gender is required'),
        normalTextValidation(talent, 'Talent is required'),
        normalTextValidation(address, 'Address is required'),
        passwordValidate(password, confirmPassword, 'Password length should not be less than 8 characters', 'The password field and the confirm password field do not match' ),
        termsValidate('You must accept our terms')
    ];
   // errors.length == 0 ? f.target.removeAttribute('data-bs-toggle') : f.target.setAttribute('data-bs-toggle', 'modal');
    fillErrorsContainer(errorsContainer, errors);
    fields.forEach(el => {
        if(el == false){
          f.preventDefault()
        }
    })
 }
                  /* End change Errors message here */

function hidSections(){
    sections.forEach(el => {
        el.classList.add('d-none');
    });
    navItems.forEach(el => {
        el.classList.remove('active');
    })
}

function showSection(){
    navItems.forEach(el => {
        el.addEventListener('click', (e)=>{
            hidSections();
            document.querySelector('#'+el.getAttribute('id')).classList.add('active'); 
            document.querySelector('#'+el.getAttribute('id')+'-container').classList.remove('d-none'); 
        });
    })
}

function fillProductsContainer(data){
    productsContainer.innerHTML = '';
   data.forEach(el => {
    let check = 'src/ics/cart.png';
    cart.forEach(pr => {
        if(pr.id == el.id){
            check = 'src/ics/check.png'
        }
    })
    productsContainer.innerHTML += 
    `
    <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
        <div class="card product-card">
            <img class="p-img" src="${el.src}" />
            <div>
                <div style="margin: 10px 0;">
                    <p>${el.name}</p>
                    <p>${el.price}</p>
                </div>
                <button class="btn">
                    
                    <button class="cart-btn">
                        <img class="icon" onclick="addToCart(this, ${el.id})" src="${check}" alt="">
                    </button>
                </button>
            </div>
        </div>
    </div>
    `;

   });
}

function addToCart(v, id){

    for(let i = 0; i < cart.length; i++){
        if(cart[i].id == id){
          cart =  cart.filter(x => x.id != id);
          setCookie('cart', JSON.stringify(cart), 2)
          v.setAttribute('src', 'src/ics/cart.png');
          setCartBadge(cart.length);
          fillCartContainer(cart);
          return;
        }
    }
    v.setAttribute('src', 'src/ics/check.png')
    let index = products.findIndex(x => x.id == id);
    let cartEl = products[index];
    cartEl.quantity = 1;
    cart.push(cartEl);
    setCookie('cart', JSON.stringify(cart), 2);
    setCartBadge(cart.length);
    fillCartContainer(cart);
}

function removeFromCart(id){
    cart = cart.filter(x => x.id != id);
    setCookie('cart', JSON.stringify(cart), 2);
    fillCartContainer(cart);
    fillProductsContainer(products);
    setCartBadge(cart.length);

}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  function checkCookie(){
      if(getCookie('cart') != null && getCookie('cart') != ''){
          cart = JSON.parse(getCookie('cart'));
      }
  }

 function setCartBadge(num){
    document.querySelector("#cart-badge").innerHTML = num;
 }

 function fillCartContainer(crArr){
     let total = 0;
    cartContainer.innerHTML = '';
    for(let i = 0; i < crArr.length; i++){   
        let fullCost = crArr[i].price * crArr[i].quantity;
        cartContainer.innerHTML += 
        `
        <tr>
            <th scope="row">${i + 1}</th>
                <td><img class="cart-img" src="${crArr[i].src}" /></td>
                <td>${crArr[i].name}</td>
                <td>${crArr[i].price}</td>
                <td><input class="form-control" min="1" style="max-width:80px;" onchange="setQuantity(this.value, ${crArr[i].id})" type="number" value="${crArr[i].quantity}"></td>
                <td>${fullCost}</td>
            <td>
                <button class="btn btn-danger pb-1 px-2" step="1" onclick="removeFromCart(${crArr[i].id})"><img class="icon pb-1" src="src/ics/trash.png" alt=""></button>
            </td>
        </tr>
        `
        total += fullCost;
    }

    cartContainer.innerHTML +=   `
    <tr>
        <th scope="row"></th>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td><span class="fw-bold">$${total}</span></td>
    </tr>`
    
 }

 function addToErrors(id, feedback){
     if(errors.length == 0){
         errors.push({'id': id, 'feedBack': feedback});
         return;
     }
      for(let i = 0; i < errors.length; i++){
         if(errors[i].id == id){
            return;
         }
      }
      errors.push({'id': id, 'feedBack': feedback});
 }

 function removeFromErrors(id){
     for(let i = 0; i < errors.length; i++){
         if(errors[i].id == id){
             errors.splice(i, 1);
         }
     }
 }

 function normalTextValidation(input, feedBack){
    if(input.value.length < 2) {
    //input.classList.add('is-invalid');
    //document.querySelector('#'+input.getAttribute('id')+'-feedback').innerHTML = feedBack;
    addToErrors(input.getAttribute('id'), feedBack);
    return false;
    }   
    //input.classList.remove('is-invalid');
    removeFromErrors(input.getAttribute('id'));
     return true;  
 }

 function phoneValidation(input, feedBack){
    const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    if(!re.test(String(input.value).toLowerCase())) {
      // input.classList.add('is-invalid');
      // document.querySelector('#'+input.getAttribute('id')+'-feedback').innerHTML = feedBack;
      addToErrors(input.getAttribute('id'), feedBack);
       return false;
    }   
   // input.classList.remove('is-invalid');
   removeFromErrors(input.getAttribute('id'));
    return true;  
}

function genderValidate(feedBack){
  let gender = document.querySelectorAll('input[name=gender]:checked');
  //document.querySelector('#gender-feedback small').innerHTML= feedBack;
  if(gender.length < 1){
     // document.querySelector('#gender-feedback').classList.remove('d-none');
     addToErrors('gender', feedBack);
    return false;
  }
  removeFromErrors('gender');
  //document.querySelector('#gender-feedback').classList.add('d-none');
  return true; 
}

function termsValidate(feedBack){
    let terms = document.querySelector('#terms');
   // document.querySelector('#terms-feedback small').innerHTML= feedBack;
    if(!terms.checked){
        addToErrors(terms.getAttribute('id'), feedBack);
      //  document.querySelector('#terms-feedback').classList.remove('d-none');
      return false;
    }
    //document.querySelector('#terms-feedback').classList.add('d-none');
    removeFromErrors(terms.getAttribute('id'));
    return true; 
  }

 function emailValidation(input, feedBack){
        
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!re.test(String(input.value).toLowerCase())) {
        //input.classList.add('is-invalid');
       // document.querySelector('#'+input.getAttribute('id')+'-feedback').innerHTML = feedBack;
       addToErrors(input.getAttribute('id'), feedBack);
        return false;
    }   
   // input.classList.remove('is-invalid');
   removeFromErrors(input.getAttribute('id'));
    return true;  
}

function passwordValidate(input1, input2, feedBackPassword, feedBackConfirmation){
  
    if(input1.value.length < 8){
      //  input1.classList.add('is-invalid');
      //  document.querySelector('#'+input1.getAttribute('id')+'-feedback').innerHTML = 'Password length should not be less than 8 characters';
        addToErrors(input1.getAttribute('id'), feedBackPassword);
        return false;
    }
    if(input1.value != input2.value){
      //  input1.classList.add('is-invalid');
      //  input2.classList.add('is-invalid');
       // document.querySelector('#'+input1.getAttribute('id')+'-feedback').innerHTML = 'The password field and the confirm password field do not match';
       removeFromErrors(input1.getAttribute('id'));
       addToErrors(input2.getAttribute('id'), feedBackConfirmation);
        return false;
    }
   // input2.classList.remove('is-invalid');
   // input1.classList.remove('is-invalid');
   removeFromErrors(input1.getAttribute('id'));
   removeFromErrors(input2.getAttribute('id'));
    return true

}

 function setQuantity(v, id){
  for(let i = 0; i < cart.length; i++){
      if(cart[i].id == id){
          if(v > 0){
            cart[i].quantity = v;
            setCookie('cart', JSON.stringify(cart), 2);
            fillCartContainer(cart)
          }
      }
  }
 }

 function fillErrorsContainer(errContainer, errs){
     errContainer.innerHTML = '';
     errs.forEach(err => {
       let t = document.createTextNode(err.feedBack)
       let li = document.createElement('li');
       li.appendChild(t);
       errContainer.appendChild(li);
     })
 }

main();