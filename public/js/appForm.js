const contactform = document.querySelector('.contact-form');

let email = document.getElementById('email');

contactform.addEventListener('submit', (e)=>{
    e.preventDefault();

    let formData = {
        email: email.value,
        subscriberName:subscriberName.value,
    }
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/');
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.onload = function(){
        console.log(xhr.responseText);
        if(xhr.responseText == 'success'){
            alert('Email sent');
            email.value = '';
        }
        
        else {
            alert('Email not sent. already registered')
        }
      
    }
    xhr.send(JSON.stringify(formData));

})