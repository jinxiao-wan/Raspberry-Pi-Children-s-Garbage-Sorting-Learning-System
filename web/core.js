import {originalData} from './data/original-data.js';
import {items} from './data/items.js';
export const categories=[
 {id:1,en:'Recyclables',zh:'可回收物',icon:'♻',color:'#246da4',tipEn:'Clean paper, bottles, metals and textiles.',tipZh:'干净的纸、瓶子、金属和织物。'},
 {id:2,en:'Hazardous',zh:'有害垃圾',icon:'!',color:'#b64138',tipEn:'Items that need special collection.',tipZh:'需要专门收集的物品。'},
 {id:3,en:'Food waste',zh:'湿垃圾',icon:'❧',color:'#83503c',tipEn:'Food scraps, peels and other organic waste.',tipZh:'剩饭菜、果皮等易腐垃圾。'},
 {id:4,en:'Residual',zh:'干垃圾',icon:'↗',color:'#4e5555',tipEn:'Other everyday waste in the archived model.',tipZh:'原项目分类中的其他生活垃圾。'},
 {id:5,en:'Construction',zh:'装修垃圾'},{id:6,en:'Bulky waste',zh:'大件垃圾'},{id:7,en:'Non-household',zh:'非生活垃圾'}];
export const library=originalData.flatMap(group=>group.data.flatMap(letter=>letter.garbageItem.map(name=>({name,category:group.categroy,letter:letter.letter}))));
export function search(query,category=0){
 const q=query.trim().toLowerCase();
 const translated=items.filter(x=>q&&(x.en.toLowerCase().includes(q)||x.zh.includes(q)));
 const found=library.filter(x=>(!category||x.category===category)&&(!q||x.name.toLowerCase().includes(q)||translated.some(t=>t.zh===x.name)));
 for(const t of translated)if((!category||t.category===category)&&!found.some(x=>x.name===t.zh&&x.category===t.category))found.push({name:t.zh,category:t.category,curated:true});
 return found.sort((a,b)=>Number(b.name.toLowerCase()===q)-Number(a.name.toLowerCase()===q)||a.category-b.category);
}
export function scoreAnswer(score,item,answer){return {correct:item.category===answer,score:score+(item.category===answer?10:-10)};}
export function shuffledRound(random=Math.random){return [...items].map(x=>({x,key:random()})).sort((a,b)=>a.key-b.key).slice(0,8).map(x=>x.x);}
export {items};
