const http = require('http'), fs = require('fs'), path = require('path'), crypto = require('crypto');
const root = __dirname, dbFile = path.join(root, 'data.json'), sessions = new Map();
const ADMIN_USER = process.env.HANPIN_ADMIN_USER || 'huiyaohu';
const ADMIN_PASSWORD = process.env.HANPIN_ADMIN_PASSWORD || (process.env.NODE_ENV === 'production' ? '' : '114514');
if (process.env.NODE_ENV === 'production' && !ADMIN_PASSWORD) throw new Error('生产环境必须配置 HANPIN_ADMIN_PASSWORD');
const mime = { '.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml' };
function db(){ try{return JSON.parse(fs.readFileSync(dbFile,'utf8'));}catch{return { submissions:[],meta:{lastSourceRefresh:null} };} }
function save(value){fs.writeFileSync(dbFile,JSON.stringify(value,null,2));}
function json(res, status, data){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(data));}
function read(req){return new Promise((resolve,reject)=>{let data='';req.on('data',x=>data+=x);req.on('end',()=>{try{resolve(JSON.parse(data||'{}'));}catch{reject();}});});}
function authenticated(req){const token=(req.headers.cookie||'').match(/hanpin_session=([^;]+)/)?.[1];return token&&sessions.has(token);}
function refreshSourceStatus(){const data=db();data.meta=data.meta||{};data.meta.lastSourceRefresh=new Date().toISOString();save(data);console.log('来源状态已刷新：'+data.meta.lastSourceRefresh);}
setInterval(refreshSourceStatus,24*60*60*1000);
http.createServer(async(req,res)=>{const url=new URL(req.url,'http://localhost');
  if(url.pathname==='/api/site-status'){const data=db();return json(res,200,{updatedAt:fs.existsSync(dbFile)?fs.statSync(dbFile).mtimeMs:0,lastSourceRefresh:data.meta?.lastSourceRefresh||null});}
  if(url.pathname==='/api/public/submissions'){return json(res,200,db().submissions.filter(item=>item.status==='approved'));}
  if(req.method==='POST'&&url.pathname==='/api/submissions'){try{const body=await read(req);if(!body.company||!body.role||!body.place||!body.note||body.note.length<20)return json(res,400,{error:'字段不完整'});const data=db();data.submissions.unshift({id:crypto.randomUUID(),...body,status:'pending',createdAt:new Date().toISOString()});save(data);return json(res,201,{ok:true});}catch{return json(res,400,{error:'无效请求'});}}
  if(req.method==='POST'&&url.pathname==='/api/admin/login'){try{const body=await read(req);if(body.user!==ADMIN_USER||body.password!==ADMIN_PASSWORD)return json(res,401,{error:'账号或密码错误'});const token=crypto.randomBytes(24).toString('hex');sessions.set(token,Date.now());res.writeHead(200,{'Set-Cookie':`hanpin_session=${token}; HttpOnly; SameSite=Strict; Path=/`,'Content-Type':'application/json'});return res.end('{"ok":true}');}catch{return json(res,400,{error:'无效请求'});}}
  if(url.pathname==='/api/admin/submissions'){if(!authenticated(req))return json(res,401,{error:'未登录'});return json(res,200,db().submissions);}
  if(req.method==='PATCH'&&url.pathname.startsWith('/api/admin/submissions/')){if(!authenticated(req))return json(res,401,{error:'未登录'});try{const status=(await read(req)).status;if(!['approved','rejected','pending'].includes(status))return json(res,400,{error:'无效状态'});const data=db(),item=data.submissions.find(x=>x.id===url.pathname.split('/').pop());if(!item)return json(res,404,{error:'不存在'});item.status=status;item.reviewedAt=new Date().toISOString();save(data);return json(res,200,{ok:true});}catch{return json(res,400,{error:'无效请求'});}}
  if(req.method==='DELETE'&&url.pathname.startsWith('/api/admin/submissions/')){if(!authenticated(req))return json(res,401,{error:'未登录'});const data=db(),id=url.pathname.split('/').pop(),index=data.submissions.findIndex(x=>x.id===id);if(index<0)return json(res,404,{error:'不存在'});data.submissions.splice(index,1);save(data);return json(res,200,{ok:true});}
  const target=url.pathname==='/'?'index.html':decodeURIComponent(url.pathname).replace(/^\/+/, '');const file=path.resolve(root,target);if(!file.startsWith(root)||!fs.existsSync(file)||fs.statSync(file).isDirectory()){res.writeHead(404);return res.end('Not found');}res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});fs.createReadStream(file).pipe(res);
}).listen(Number(process.env.PORT)||8080,'0.0.0.0',()=>console.log('汉聘雷达已启动'));
refreshSourceStatus();
