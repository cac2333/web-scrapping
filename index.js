const puppeteer = require ('puppeteer');

//To open headless with chrome, this is subject to be change on different PC
const PATH = `C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe`;
const LIST = 'li.jl';
const NEXT ='#FooterPageNav > div > ul > li.next';
jobCount=0;


async function run(){

  const browser = await puppeteer.launch({
     headless: true,
     executablePath: PATH
   });

  const page = await browser.newPage();
  await page.goto('https://www.glassdoor.ca/Job/montreal-jobs-SRCH_IL.0,8_IC2296722.htm?radius=31&jobType=internship');

  //first page
  //extract jobs from job list
  var jobs = await page.evaluate(()=>{
    let list =  document.querySelectorAll('li.jl');
    return Array.from(list).map((e) => {return e.innerText});
  });

  String.prototype.replaceAll = function (search, replace){
    return this.replace(new RegExp(search, 'g'), replace);
  };

  const numPages = await getNumPages(page);
  //other pages
  //while not reach to last page
  counter=2;  //page number
  while(counter<=numPages){

    await page.goto(`https://www.glassdoor.ca/Job/montreal-jobs-SRCH_IL.0,8_IC2296722_IP${counter}.htm?radius=31&jobType=internship`);

    //first page
    var job = await page.evaluate(()=>{
      let list =  document.querySelectorAll('li.jl');
      return Array.from(list).map((e) => {return e.innerText});
    });

    jobs = jobs.concat(job);
    counter++;
  }

  jobs = jobs.map (job => job.replaceAll('\n', ' '));
  jobs = jobs.filter (job => job.includes('Softerware') || job.includes('Computer') || job.includes('Information') || job.includes('Research') || job.includes('Programmer') || job.includes('Machine') );
  console.log(jobs);
}



async function getNumPages(page) {
  let count = await page.evaluate(() => {
      return parseInt(document.querySelector('#MainColSummary > p').innerText);
  });

  const numJobs = parseInt(count);

  console.log('numJobs: ', numJobs);

  //30 jobs per pages
  return Math.ceil(numJobs / 30);
}



run();
