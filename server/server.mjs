import http from 'node:http';import fs from 'node:fs/promises';import path from 'node:path';import {fileURLToPath} from 'node:url';import {recognize} from './baidu.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../web');
export function createServer({apiKey=process.env.BAIDU_API_KEY,secretKey=process.env.BAIDU_SECRET_KEY,recognizer=recognize}={}){
 const json=(res,status,data)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
 return http.createServer(async(req,res)=>{try{
  const url=new URL(req.url,'http://localhost');
  if(url.pathname==='/api/status'&&req.method==='GET')return json(res,200,{live:!!(apiKey&&secretKey)});
  if(url.pathname==='/api/recognize'&&req.method==='POST'){
   if(!apiKey||!secretKey)return json(res,503,{error:'Live recognition is not configured.'});
   // Local-only server: no cross-origin calls, uploads or stored images.
   if(req.headers.origin&&req.headers.origin!==`http://${req.headers.host}`)return json(res,403,{error:'Origin is not allowed.'});
   if(req.headers['content-type']!=='application/json')return json(res,415,{error:'Expected JSON.'});
   let size=0;const chunks=[];for await(const chunk of req){size+=chunk.length;if(size>6*1024*1024){json(res,413,{error:'Photo is too large.'});return;}chunks.push(chunk);}
   let body;try{body=JSON.parse(Buffer.concat(chunks));}catch{return json(res,400,{error:'Invalid JSON.'});}
   const image=body.image;if(typeof image!=='string'||image.length===0||image.length>5592408||!/^[A-Za-z0-9+/]+={0,2}$/.test(image))return json(res,400,{error:'Invalid image encoding.'});
   const bytes=Buffer.from(image,'base64');if(bytes.length>4*1024*1024||!(bytes.subarray(0,3).equals(Buffer.from([255,216,255]))||bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))))return json(res,400,{error:'Expected a JPEG or PNG under 4 MB.'});
   try{return json(res,200,await recognizer(image,{apiKey,secretKey}));}catch{return json(res,502,{error:'Recognition unavailable. Try manual search.'});}
  }
  if(req.method!=='GET')return json(res,405,{error:'Method not allowed.'});
  const relative=decodeURIComponent(url.pathname);const file=path.resolve(root,'.'+relative+(relative.endsWith('/')?'index.html':''));if(!file.startsWith(root+path.sep))return json(res,403,{error:'Forbidden'});
  const bytes=await fs.readFile(file);const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'};res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(bytes);
 }catch{if(!res.headersSent)json(res,404,{error:'Not found'});else res.end();}});
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){const port=Number(process.env.PORT||8080);createServer().listen(port,'127.0.0.1',()=>console.log(`Little Sorters: http://127.0.0.1:${port}`));}
