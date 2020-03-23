//importing modules
const puppeteer =  require('puppeteer'); // is a Node library which provides a high-level API to control Chrome or Chromium
const fs = require('fs-extra'); // provides an API for interacting with the file system

(async function main()
{
    try{

        const browser  = await puppeteer.launch({ headless: true }); //You can set value to false if you wish to view the process as it happens 
        const page = await browser.newPage();
        page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36');

           
            const wrtiteStream = await fs.createWriteStream('Data.txt'); // creation of the txt file to store extracted data

           for (let z = 0; z<5; z++)
           {
            
                
               for (let i = 0; i<2; i++){
                await page.goto('https://www.sundaystandard.info/?s=', { timeout: 0, waitUntil: "networkidle0" }); // navigates to the page from which extraction can begin(in this case the search page of the Sundat Standard)
                const searchIn = await page.$('input.td-widget-search-input'); 
                await searchIn.type('Bridgette Motsepe'); // navigates to the search box and adds the text to be searched
                const searchbtn = await page.$('input.wpb_button.wpb_btn-inverse.btn');
                await searchbtn.click(); // navigates to the search submit button and clicks its

                //To get the title from the preview boxes
                await page.waitForSelector('.td-block-row');
                const blocks = await page.$$('.td-block-row');
                const block = blocks[z];
                const titles = await block.$$('.td-block-span6');
                const title = titles[i];

                //Title
                const header = await title.$('h3');
                const head = await page.evaluate(header => header.innerText, header);
                await wrtiteStream.write(`Title: ${head}\n`);
                

                //clicking on the link for each article
                const atag = await header.$('a');
                await atag.click();
                await page.waitForSelector('.tdb-block-inner.td-fix-index');
                const paragraphs = await page.$$('.tdb-block-inner.td-fix-index > p');
                //geatting each paragraph from the article 
                for (const paragraph of paragraphs){
                    const para = await page.evaluate(paragraph => paragraph.innerText, paragraph);
                    await wrtiteStream.write(`${para}\n`);
                }
                
            }

           }
           
           console.log('Done :)');
           await browser.close();

    }catch (e)
    {
        console.log('my error',e);
    }
})();