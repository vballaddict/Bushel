export const SITE_URL = 'https://bushel-farm-home.ethanpen06.chatgpt.site';
export const STORAGE_KEY = 'bushel-expo-preview-v1';
export const CROPS = { Corn: 56, Soybean: 60, Oats: 32, Wheat: 60, Barley: 48 };
export const id = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
export const seed = () => ({version:1, loads:[], shapes:[
  {id:'demo-bin-1',kind:'bin',number:'1',capacity:12000,type:'circle',label:'1',width:12,height:12,rotation:0,color:'#61c4ef',x:25,y:35},
  {id:'demo-bin-2',kind:'bin',number:'2',capacity:18000,type:'circle',label:'2',width:14,height:14,rotation:0,color:'#61c4ef',x:55,y:35},
  {id:'demo-shed',kind:'decoration',number:'',capacity:0,type:'rectangle',label:'Shed',width:25,height:16,rotation:0,color:'#e9c78b',x:60,y:75}
]});
export function validateShape(shape, shapes) {
  if(!['bin','decoration'].includes(shape.kind)||!['circle','rectangle'].includes(shape.type))throw Error('Choose a valid shape.');
  if(!/^#[a-f0-9]{6}$/i.test(shape.color))throw Error('Use a colour such as #61c4ef.');
  if(typeof shape.label!=='string'||shape.label.length>40)throw Error('Use a label of 40 characters or fewer.');
  if(!['x','y','width','height','rotation'].every(k=>Number.isFinite(shape[k])))throw Error('Enter valid sizes and positions.');
  if(shape.x<0||shape.x>100||shape.y<0||shape.y>100||shape.width<3||shape.width>40||shape.height<3||shape.height>40||shape.rotation<0||shape.rotation>360)throw Error('Positions must be 0–100, sizes 3–40, and rotation 0–360.');
  if(shape.kind==='bin'){
    if(!shape.number.trim()||shape.number.length>20)throw Error('Enter a bin number (20 characters or fewer).');
    if(!Number.isSafeInteger(shape.capacity)||shape.capacity<0)throw Error('Capacity must be a whole number of bushels.');
    if(shapes.some(s=>s.kind==='bin'&&s.id!==shape.id&&s.number===shape.number.trim()))throw Error('That bin number is already used.');
  }
}
export function putShape(state, shape) {
  validateShape(shape,state.shapes);
  const saved={...shape,number:shape.number.trim(),label:shape.kind==='bin'?shape.number.trim():shape.label.trim(),height:shape.type==='circle'?shape.width:shape.height};
  return {...state,shapes:state.shapes.filter(s=>s.id!==shape.id).concat(saved)};
}
export function deleteShape(state, shapeId) {
  if(state.loads.some(l=>l.binId===shapeId))throw Error('Reassign this bin’s loads before deleting it.');
  return {...state,shapes:state.shapes.filter(s=>s.id!==shapeId)};
}
export function putLoad(state, load) {
  if(!Number.isSafeInteger(load.weight)||load.weight<=0||load.weight>1000000000)throw Error('Enter a whole-number weight greater than zero.');
  if(!Object.hasOwn(CROPS,load.crop))throw Error('Choose a crop.');
  if(!state.shapes.some(s=>s.id===load.binId&&s.kind==='bin'))throw Error('Choose a destination bin.');
  return {...state,loads:state.loads.filter(l=>l.id!==load.id).concat(load).sort((a,b)=>b.createdAt-a.createdAt)};
}
export function binTotals(state, binId) {
  const loads=state.loads.filter(l=>l.binId===binId),products={};
  for(const l of loads){products[l.crop]??={weight:0,bushels:0};products[l.crop].weight+=l.weight;products[l.crop].bushels+=l.weight/CROPS[l.crop];}
  return {weight:loads.reduce((n,l)=>n+l.weight,0),bushels:loads.reduce((n,l)=>n+l.weight/CROPS[l.crop],0),count:loads.length,products};
}
export function parseSaved(raw) {
  if(!raw)return seed();const value=JSON.parse(raw);
  if(value.version!==1||!Array.isArray(value.shapes)||!Array.isArray(value.loads))throw Error('The saved preview data cannot be read.');
  for(const s of value.shapes)validateShape(s,value.shapes);
  for(const l of value.loads)putLoad(value,l);
  return value;
}
