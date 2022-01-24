const cartBtn = document.querySelector(".cart-btn");//cart ka icon button
const closeCartBtn = document.querySelector(".close-cart"); //cross button
const clearCartBtn = document.querySelector(".clear-cart");//clear button
const cartDOM = document.querySelector(".cart");//cart ka main div jisme sab he span,h2,cart content
const cartOverlay = document.querySelector(".cart-overlay"); //cart ka parent div
const cartItems = document.querySelector(".cart-items");  //cart vala number homepage pr
const cartTotal = document.querySelector(".cart-total");//span jaha total show ho rha hai
const cartContent = document.querySelector(".cart-content");//div jisme apke items hoge cart ke show

let discPrice = 0;

let input = document.querySelector(".input");
let btn = document.getElementById("button");
let result = document.getElementById("result");

let cart = [];
let C = {

  SALE2021:{
      disc:100,
      count:2
  },

  CHRISTMASDEAL2021:{
      disc: 120,
      count: 2
  },

  NEWYEARSTEAL: {
      disc: 150,
      count: 2
  }

}

// var express = require('express');
// var app = express();
// var path = require('path');


// let jsonPath = path.join(__dirname, '../routes', 'products_json.json')

let jsonPath = '/js/products_json.json'

  
// cart js logic implementation==========================================
class UI {

  getBagButtons() {
    const buttons = [...document.querySelectorAll(".buy-btn")]; 
  
    //console.log(buttons)
    //console.log(cart);
    buttons.forEach(button => {
//console.log(cart);
      let id = button.dataset.id;
     //console.log(id)
     let inCart = cart.find(item => item.id === id);
      if (inCart) {
        button.innerText = "In Cart";
        button.disabled = true;
      } 
      else {
        button.addEventListener("click", event => {
         
          // disable button
          // console.log("hello")
          event.target.innerText = "In Bag";
          event.target.disabled = true;
          // add to cart
          let cartItem = { ...Storage.getProduct(+id), amount: 1 };  
          
         // let x = Storage.getProduct(+id);
          //console.log(x);
         // console.log(cartItem) //add  item to cart array
          cart = [...cart, cartItem];
          //console.log(cart)
         // console.log(cart)
          Storage.saveCart(cart);
          // add to DOM
          this.setCartValues(cart);
          this.addCartItem(cartItem);
          this.showCart();
        });
      }
    });
  }

  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map(item => {
      tempTotal += item.discountPrice * item.amount;
      itemsTotal += item.amount;
      // console.log(tempTotal,"xx");
      // console.log(itemsTotal,"rr");
    });
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
    let total = tempTotal;
    localStorage.setItem('total_cart',total);
  }

 CouponFun(cart){
  // console.log(input.value.length)
    if(input.value.length ==0)
    {
     localStorage.setItem('Code',"Not Applied");
    }
  btn.onclick = function() {
    //console.log(input.value);
    let coup = input.value;  //user input value
    // console.log(typeof(coup));
    //console.log(coup);
    let total = document.querySelector(".total");
    let totalPrice = total.innerHTML;
    totalPrice = parseInt(totalPrice);
  
    for(let key in C) {
      if(totalPrice ==""){
        console.log("zero case")
        total.innerHTML=0;
        result.innerHTML = "Cannot Apply coupon"
      }
        else if(key == coup){
            if(C[key].count>0){
                discPrice = C[key].disc;
                C[key].count -= 1;
                totalPrice= totalPrice-discPrice;   
                total.innerHTML = totalPrice;
    
                localStorage.setItem('total_cart',totalPrice);
                localStorage.setItem('Code',key);
                //console.log(typeof key)
                result.innerHTML = "Coupon Code applied successfully"
                result.style.fontStyle= "italic"
                input.value = key;
                input.disabled = true;
                btn.value="Applied"
                btn.style.fontStyle ="italic"
                btn.disabled= true;
                break;
            }
            else if (C[key].count==1){
                btn.value="Apply"
                discPrice = C[key].disc;
                C[key].count -= 1;
                totalPrice= totalPrice-discPrice;   
                total.innerHTML = totalPrice;
                localStorage.setItem('total_cart',totalPrice);
                localStorage.setItem('Code',key);
                result.innerHTML = "Coupon Code applied successfully"
                result.style.fontStyle= "italic"
                input.value = key;
                 input.disabled = true;
                btn.innerHTML="Applied"
                btn.disabled= true;

            }
            else if(key== coup && C[key].count<=0) {
                result.innerHTML = "Your coupon code has Expired"
                result.style.fontStyle= "italic"
                discPrice=0;

                break;
            }
            else{
                break;
            }
        }
        else {
            result.innerHTML = "Invalid Coupon"
            discPrice=0;
        }
            
    }
    
 let ico = document.querySelector("#ic");
 ico.addEventListener('click',()=>{
     btn.disabled=false;
     input.disabled=false;
     btn.value="Apply"
     btn.style.fontStyle = "normal"

 })
    
}


 }
  addCartItem(item) {
    //console.log(item)
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
            <br>
            <img src=${item.image} width="100px" alt="product" />
            <!-- item info -->
            <div>
              <h4>${item.title}</h4>
              <h5>$${item.discountPrice}</h5>
              <span class="remove-item" data-id=${item.id}>Remove</span>
            </div>
            <!-- item functionality -->
            <div>
              <i class="fa fa-chevron-up" data-id=${item.id}></i>
              <p class="item-amount">
                ${item.amount}
              </p>
              <i class="fa fa-chevron-down" data-id=${item.id}></i>
            </div>
          <!-- cart item -->
    `;
    cartContent.appendChild(div);
  }

  showCart() {
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
  }

  setupAPP() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
    cartBtn.addEventListener("click", this.showCart);
    closeCartBtn.addEventListener("click", this.hideCart);
    this.CouponFun(cart);
  }

  populateCart(cart) {
    cart.forEach(item => this.addCartItem(item));
  }
  hideCart() {
    cartOverlay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");
  }

  cartLogic() {
    clearCartBtn.addEventListener("click", () => {
      this.clearCart();
       });

    cartContent.addEventListener("click", event => {
      if (event.target.classList.contains("remove-item")) {
        let removeItem = event.target;
        let id = removeItem.dataset.id;
        cart = cart.filter(item => item.id !== id);
       //console.log(cart);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        //console.log()
        cartContent.removeChild(removeItem.parentElement.parentElement); //item removed from dom
        const buttons = [...document.querySelectorAll(".buy-btn")];
        buttons.forEach(button => {
          if (parseInt(button.dataset.id) === id) {
            button.disabled = false;
            button.innerHTML = `<i class="bi bi-cart-fill"></i>add to bag`;
          }
        });
      } 
      else if (event.target.classList.contains("fa-chevron-up")) {
        //console.log("Hello")
        let addAmount = event.target;
        let id = addAmount.dataset.id;
        let tempItem = cart.find(item => item.id == id);
                    //datatype of id from dataset.id is string and json id is number
        //console.log(tempItem.amount)
        if(tempItem.amount<tempItem.count){
        tempItem.amount = tempItem.amount + 1;
        //console.log(tempItem)
        
        // cart.map((item)=>{if(item.id == id){
        //   item.amount = tempItem.amount;
        // }})
       // cart.map((item)=>{console.log(item.amount)})
        //console.log(cart)
        Storage.saveCart(cart);
      
        //console.log(cart,"2")
        this.setCartValues(cart);
        addAmount.nextElementSibling.innerText = tempItem.amount;
        }
      } 

      else if (event.target.classList.contains("fa-chevron-down")) {
        let lowerAmount = event.target;
        let id = lowerAmount.dataset.id;
        let tempItem = cart.find(item => item.id == id);
        tempItem.amount = tempItem.amount - 1;

        if (tempItem.amount > 0) {
          Storage.saveCart(cart);
          this.setCartValues(cart);
          lowerAmount.previousElementSibling.innerText = tempItem.amount;
        } 
        else {
          cart = cart.filter(item => item.id !== id);
          // console.log(cart);
         // console.log(typeof id)
          this.setCartValues(cart);
          Storage.saveCart(cart);
          cartContent.removeChild(lowerAmount.parentElement.parentElement);
          const buttons = [...document.querySelectorAll(".buy-btn")];
          // console.log(buttons)
          buttons.forEach(button => {
            if (parseInt(button.dataset.id) == id) {
              button.disabled = false;
              button.innerHTML = `<i class="bi bi-cart-fill"></i>add to bag`;
            }
          });
        }
      }
    });
  }

  clearCart() {
    cart = [];
    this.setCartValues(cart);
    Storage.saveCart(cart);
    //console.log("yeaha pe hu");
    const buttons = [...document.querySelectorAll(".buy-btn")];
   // console.log(buttons)
    buttons.forEach(button => {
      
      button.disabled = false;
      button.innerHTML = `<i class="bi bi-cart-fill"></i>Add to bag`;
    });
    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }
    this.hideCart();
  }
}


//----------- storage class
  const Storage =   {

    saveProducts : (data)=>{
     
     localStorage.setItem("data", JSON.stringify(data));
   },
    getProduct:(id) => {
     let products = JSON.parse(localStorage.getItem("data"));
     //console.log(id,products);
     return products.find(product => product.id === id);
   },
    saveCart :(cart)=> {
     localStorage.setItem("cart", JSON.stringify(cart));
   },
    getCart:()=> {
     return localStorage.getItem("cart")
       ? JSON.parse(localStorage.getItem("cart"))
       : [];
   }
 }


//---------------------try

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  fetch(jsonPath).then(response => {
     return response.json();
  }).then(function (data){
     appendData(data);
  });
  
  function itemImage(slicedata,z,discount){

     let index = 0;
     var items = document.querySelector(".cards");
     let productResult = '';
     let ogPrice,dPrice;
     slicedata.forEach((product)=>{
         ogPrice = product.price;
         dPrice = ogPrice - (discount/100)*ogPrice;
         productResult +=`
         <div class="card-item">
         <img class = "img1" src=${product.image} alt="" width="200px">
         <div class="lines">
             <h3 class="text-center my-1">${product.title}</h3>
             <p class="text-center my-1">$${Math.round(dPrice)}<span id="discount"> - ${discount}% off</span></p>
             <p class="text-center my-1 op" id="og_price"><strike>$${ogPrice}</strike></p>
             <button class="buy-btn" data-id=${product.id}>Add to cart</button>
         </div>
         <br>
         <br>
     </div>`
     })
  items.innerHTML = productResult;
  }
  
  function appendData(data) {
    //console.log(cart,"1")
     let sindex = 0;
     let z = 1;
     let slicedata;
     let l=0;
     let r= 4;
     slicedata = data.slice(l,r);
   let discount = 100-(z*10)-10
     itemImage(slicedata,z,discount);

      ui.setupAPP();
      Storage.saveProducts(data);
      ui.getBagButtons();
      ui.cartLogic();
     // console.log(cart,"1-")
    
     let ImageChange = setInterval(()=>{
        z=z+1;
        discount = 100-(z*10)-10;
        l=r;
        r=r+4;
       
     slicedata =  data.slice(l,r);
        itemImage(slicedata,z,discount);
        //ui.setupAPP();
        ui.getBagButtons();
       // ui.cartLogic();
        if(z==5)
        {
          z=0;
        }
        if(r==20)
     {
        r=0;
        //if u dont want to clear then set r=0
       // clearInterval(ImageChange);
     }
        
     },40000)
     
    }

     
    
});







//===================================================================================


//first time written 

// function itemImage(data,sindex,z,discount){
//    let dPrice;
//    let index = 0;
//    var items = document.querySelectorAll(".card-item");
//    for(item of items)
//  { 
//     let img = item.children[0];
//     img.src = data[sindex+index].image;
//     //const {children: [child]} = item;
//     let Product_name = item.children[1].children[0];
//     //console.log(item.children[1].children[0]);
//     Product_name.textContent = data[sindex+index].title;
  
//     let price = item.children[1].children[2];
//     //console.log(item.children[1].children[2]);
//     let ogprice = data[sindex+index].price;
//     price.textContent = 'Rs '+ogprice;
//     //console.log(ogprice)

//     let DiscounPrice = item.children[1].children[1];
//     dPrice = ogprice - (discount/100)*ogprice;
//     DiscounPrice.textContent = 'Rs '+Math.round(dPrice) + `  ${discount}%` + 'off'
  
//     index++;
//  }
// }

// function appendData(data) {
//    let sindex = 0;
//    let z = 1;
//    //let slicedata;
//    // let l=0;
//    // let r= 4;
//    //slicedata = data.slice(l,r);
//  let discount = 100-(z*10)-10
//    itemImage(data,sindex,z,discount);
//    // l=r;
//    // r=r+4;
//    // data.slice(l,r);
//    sindex+=4;
//    setInterval(()=>{
//       z=z+1;
//       discount = 100-(z*10)-10;
//       itemImage(data,sindex,z,discount);
//       if(z==5)
//       {
//         z=0;
//       }
//       sindex+=4;
//       sindex%=20;
      
//    },10000)

// }  