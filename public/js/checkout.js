const order_items = document.querySelector(".order-items");
const summary  = document.querySelector(".summary");
const taxamt = document.querySelector(".taxamt");
const coup = document.querySelector(".coupon");
const shipCharges = 10;  // in dollars
let totalPrice = 0; //total order value
const Tax = 0.05;
let taxAmt = 0;
let items = 0;

//including the Cart  stored in localStorage in form of Strings and parsing
let DisCoupPrice =  JSON.parse(localStorage.total_cart);
let Cart = JSON.parse(localStorage.cart);
//console.log(DisCoupPrice)
let Coupon = localStorage.Code;
console.log(Coupon)
function checkCart() {
    if(Cart.length>0){
        return true;
    }
    else 
    {return false;}
}

function calcItemsCost(){
    if(checkCart()){
        order_items.innerHTML += "  " + DisCoupPrice;
        // console.log(items);
    }
    else {
        order_items.innerHTML += " " + "0";
        taxamt.innerHTML = taxAmt;
        console.log("Cart Empty!")}
}

function totalOrder() {
    var check = checkCart();
    if(check){
        taxAmt = ( DisCoupPrice + shipCharges ) * Tax;
        taxamt.innerHTML = taxAmt;
        coup.innerHTML += Coupon;
        totalPricefinal  = ( DisCoupPrice + shipCharges) + taxAmt;
        summary.lastElementChild.innerHTML += " " + totalPricefinal;
        // console.log(Cart.length);
    } 
    else
    {
        summary.lastElementChild.innerHTML += " " + "0";
    }
   
}

calcItemsCost();
totalOrder();
localStorage.setItem('total_cart_final',totalPricefinal);
