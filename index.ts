import { createAutoComplete } from "./script"
import http from "http";
import url from 'url';
import { readFile } from 'fs/promises';
import cities from './cities.json';

const PORT = process.env.PORT || 80

  const automplete:(prefix: string) => string[] | [] = createAutoComplete(cities)
  
  http.createServer(async function(request, response){
    
    // const data = readFile('./cities.json');
    // const cities: Array<string> = JSON.parse(data.toString());

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
  }).listen(PORT);
