export function adult(birthYear){
    const treshhold = 18;
    let today = new Date();
    let year = today.getFullYear();
    let toAdult = year - birthYear;

    if(toAdult == treshhold){return `not-certain`;}
    else if(toAdult < treshhold){return `not-adult`;}
    else{return `adult`;}
}