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

let products = [
    {id: 1,name: 'product 1', price: 400, src: 'src/imgs/product1.jpeg'},
    {id: 7,name: 'product 7', price: 200, src: 'src/imgs/product7.jpeg'},
    {id: 2,name: 'product 2', price: 200, src: 'src/imgs/product2.jpeg'},
    {id: 4,name: 'product 4', price: 250, src: 'src/imgs/product4.jpeg'},
    {id: 5,name: 'product 5', price: 230, src: 'src/imgs/product5.jpeg'},
    {id: 6,name: 'product 6', price: 350, src: 'src/imgs/product6.jpeg'},
    {id: 3,name: 'product 3', price: 300, src: 'src/imgs/product3.jpeg'},
];

let cart = [];

let productNumber = 0;

function main(){
  showSection();
  checkCookie(cart);
  fillProductsContainer(products);
  setCartBadge(cart.length);
  fillCartContainer(cart);
 // normalTextValidation(firstName);
}


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
    cart.push(products[index]);
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
    cartContainer.innerHTML = '';
    for(let i = 0; i < crArr.length; i++){   
        cartContainer.innerHTML += 
        `
        <tr>
            <th scope="row">${i + 1}</th>
                <td><img class="cart-img" src="${crArr[i].src}" /></td>
                <td>${crArr[i].name}</td>
                <td>${crArr[i].price}</td>
                <td>1</td>
            <td>
                <button class="btn btn-danger pb-1 px-2" onclick="removeFromCart(${crArr[i].id})"><img class="icon pb-1" src="src/ics/trash.png" alt=""></button>
            </td>
        </tr>
        `
    }
    
 }

 function normalTextValidation(input, feedBack){
         if(input.value.length < 2) {
            input.classList.add('is-invalid');
            document.querySelector('#'+input.getAttribute('id')+'-feedback').innerHTML = feedBack;
            return false;
         }   
         input.classList.remove('is-invalid');
     return true;  
 }

 function phoneValidation(input, feedBack){
    const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    if(!re.test(String(input.value).toLowerCase())) {
       input.classList.add('is-invalid');
       document.querySelector('#'+input.getAttribute('id')+'-feedback').innerHTML = feedBack;
       return false;
    }   
    input.classList.remove('is-invalid');
    return true;  
}

function genderValidate(feedBack){
  let gender = document.querySelectorAll('input[name=gender]:checked');
  document.querySelector('#gender-feedback small').innerHTML= feedBack;
  if(gender.length < 1){
      document.querySelector('#gender-feedback').classList.remove('d-none');
    return false;
  }
  document.querySelector('#gender-feedback').classList.add('d-none');
  return true; 
}

 function emailValidation(input, feedBack){
        
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!re.test(String(input.value).toLowerCase())) {
        input.classList.add('is-invalid');
        document.querySelector('#'+input.getAttribute('id')+'-feedback').innerHTML = feedBack;
        return false;
    }   
    input.classList.remove('is-invalid');
    return true;  
}

function passwordValidate(input1, input2){
  
    if(input1.value.length < 8){
        input1.classList.add('is-invalid');
        document.querySelector('#'+input1.getAttribute('id')+'-feedback').innerHTML = 'Password length should not be less than 8 characters';
        return false;
    }
    if(input1.value != input2.value){
        input1.classList.add('is-invalid');
        input2.classList.add('is-invalid');
        document.querySelector('#'+input1.getAttribute('id')+'-feedback').innerHTML = 'The password field and the confirm password field do not match';
        return false;
    }
    input2.classList.remove('is-invalid');
    input1.classList.remove('is-invalid');
    return true

}

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
        passwordValidate(password, confirmPassword)
    ];
    console.log(fields)
    fields.forEach(el => {
        if(el == false){
          f.preventDefault()
        }
    })
 }

main();