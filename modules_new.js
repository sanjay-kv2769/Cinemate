// ===============----Readline module----=============================
// const readline = require('readline');
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// rl.question('Please enter your name: ', (name) => {
//   console.log('entered name is:' + name);
//   rl.close();
// });

// rl.on('close', () => {
//   console.log('the interface is closed');
//   process.exit(0);
// });

// ===============----fs module----=============================
const fs = require('fs');
// ------------------read & write file synchronously ---------------------------
// const textIN = fs.readFileSync('./Files/input.txt', 'utf-8');
// console.log(textIN);

// let content = `Data from imput.txt: ${textIN}. \nDate created:${new Date()} `;
// fs.writeFileSync('./Files/output.txt', content);

// ------------------read & write file asynchronously ---------------------------
fs.readFile('./Files/start.txt', 'utf-8', (error1, data1) => {
  console.log('data1>>>>', data1);
  fs.readFile(`./Files/${data1}.txt`, 'utf-8', (error2, data2) => {
    console.log('data2>>>>', data2);
    fs.readFile(`./Files/append.txt`, 'utf-8', (error3, data3) => {
      console.log('data3>>>>', data3);
      fs.writeFile('./Files/output.txt',`${data2}\n\n${data3} Date created:${new Date()}`,(error4,data4)=>{
        console.log('file written successfully');
        
      })
    });
  });
});
console.log('reading file....');
