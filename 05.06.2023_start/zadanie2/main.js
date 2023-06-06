import {
    perimetrPr,
    ploshadPr,
    perimetrKrug,
    ploshadKrug,
    perimetrKvadr,
    ploshadKvadr
} from "./formula.js";

let a = 5;
let b = 10;
let r = 7.5;

let pPr = perimetrPr(a,b);
let sPr = ploshadPr(a,b);

let pKrug = perimetrKrug(r);
let sKrug = ploshadKrug(r);

let pKv = perimetrKvadr(a);
let sKv = ploshadKvadr(a);

console.log('Площадь прямоугольника:', sPr);
console.log('Периметр прямоугольника:', pPr);

console.log('Площадь круга:', sKrug.toFixed(3));
console.log('Периметр круга:', pKrug.toFixed(3));

console.log('Площадь квадрата:', sKv);
console.log('Периметр квадрата:', pKv);

