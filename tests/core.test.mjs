import test from 'node:test';import assert from 'node:assert/strict';import {search,library,items,scoreAnswer,shuffledRound,categories} from '../web/core.js';
test('Chinese and English search find the expected objects',()=>{assert.ok(search('塑料瓶').some(x=>x.category===1));assert.ok(search('banana').some(x=>x.name==='香蕉皮'&&x.category===3));assert.ok(search('paper cup').some(x=>x.name==='纸杯'&&x.category===4));assert.equal(search('nonexistent-object-9876').length,0);});
test('empty search browses the archive; category and whitespace filters work',()=>{assert.equal(search('').length,library.length);assert.ok(search('  香蕉皮  ',3).every(x=>x.category===3));assert.equal(search('banana',1).length,0);assert.ok(library.every(x=>categories.some(c=>c.id===x.category)));});
test('original scoring allows negative values and eight unique game items',()=>{assert.deepEqual(scoreAnswer(0,items[0],2),{correct:false,score:-10});assert.deepEqual(scoreAnswer(-10,items[0],1),{correct:true,score:0});const deck=shuffledRound();assert.equal(deck.length,8);assert.equal(new Set(deck.map(x=>x.id)).size,8);});

import fs from 'node:fs';import path from 'node:path';
test('published legacy source has no literal provider credentials',()=>{
 const root=new URL('../legacy/wechat/',import.meta.url);
 function scan(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,entry.name);if(entry.isDirectory())scan(p);else if(/\.(js|json)$/.test(p)){const s=fs.readFileSync(p,'utf8');assert.equal(/(?:apiKey|secretKey)\s*=\s*['"](?!REPLACE_|REDACTED_)[^'"]+/.test(s),false,p);assert.equal(/key:\s*['"][A-Z0-9]{5}(?:-[A-Z0-9]{5}){5}/.test(s),false,p);assert.equal(/client_(?:id|secret)=(?!REDACTED_|REPLACE_)[A-Za-z0-9]{16,}/.test(s),false,p);}}}
 scan(decodeURIComponent(root.pathname));
});
