// import fs from "fs";
// const log = console.log;

// fs.open('tezt.txt', "w", (err) => {
//     if (err) throw err;
//     console.log('chetko vse!')



//     let text = "mama mila ramu";
//     fs.writeFile('tezt.txt', text, (err) => {
//         if (err) throw err;
//         log("file zapisan");

//     });

// });          chitaem
//----------------------------------------------------------

// import fs from "fs";
// const log = console.log;

//     fs.readFile('package.json',  (err,data) => {

//         if (err) throw err;

//         log(data);

//     });

//-------------------------------------------------------------

const log = console.log;

import fs from "fs";

let count = 0;

let fileContent = fs.readFileSync("text.txt", "utf-8");

let array = fileContent.split(" ");

for (let x of array) {
    let reg = /[^0-9]/g;
    if (x.match(reg)) {
        count++;
    }
}

log(count);
log(array);