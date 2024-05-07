let flag=0;

function hamburger_open(event){
    const button = event.currentTarget;
    const menu = document.querySelector('#mobile-menu');
    button.classList.remove('fl');
    if(flag===0)
    {
        flag=1;
        const other_box = document.querySelector('#hamburger-box-x');
        menu.classList.add('fl');
        other_box.classList.add('fl');
        button.classList.add('hidden');
    }
    else
    {
        flag=0;
        const other_box = document.querySelector('#hamburger-box');
        menu.classList.remove('fl');
        other_box.classList.remove('hidden');
    }
}    

const ham_box = document.querySelector('#hamburger-box');
ham_box.addEventListener('click', hamburger_open);
const ham_x = document.querySelector('#hamburger-box-x');
ham_x.addEventListener('click', hamburger_open);
