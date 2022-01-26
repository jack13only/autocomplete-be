import { createAutoComplete } from "../auto-complete/script"
import http from "http";
import url from 'url';
import { readFile } from 'fs/promises';

async function createCompleteFunc() {
  const data = await readFile('./cities.json');
  const cities: Array<string> = await JSON.parse(data.toString());
  return createAutoComplete(cities);
}
 
async function app() {
  const automplete:(prefix: string) => string[] | [] = await createCompleteFunc()

  http.createServer(async function(request, response){
  
    if (request.url === undefined) throw new Error('url is not url')
    const urlQueries = url.parse(request.url, true);
  
    response.setHeader("Content-Type", "application/json")
  
    const queryComplete = urlQueries.query['complete'] as string;
    
    if (urlQueries.pathname === '/' && request.method === 'GET' && queryComplete) {
      const answer: Array<string> = automplete(queryComplete);
      response.statusCode = 200;
      response.write(JSON.stringify(answer))
    } else {
      response.statusCode = 404
      response.write(JSON.stringify({Error: 'Not found'}))
    }
  
    response.end()  
  }).listen(3000);
}

app()