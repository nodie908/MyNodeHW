import fs from "fs";

function readJson(fileName) {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, "utf-8", (err, data) => {
            if (err) {
                reject(err);
            } else {
                const jsonData = JSON.parse(data);
                resolve(jsonData);
            }
        })
    })
}

function writeJson(fileName, data) {
    return new Promise((resolve, reject) => {
        const jsonData = JSON.stringify(data, null, 2);
        fs.writeFile(fileName, jsonData, 'utf-8', (err) => {
            if(err){
                reject(err);
            } else {
                resolve();
            }
        })
    })
}

async function main() {
    const fileName = 'count.json';
    const jsonData = await readJson(fileName);

    const count = jsonData.count;
    console.log(`count был: ${count}`);

    jsonData.count = count + 1;

    await writeJson(fileName, jsonData);
    console.log(`Значение count было обновлено и записано`);
    console.log(`count стал: ${jsonData.count}`);
    
}

main();