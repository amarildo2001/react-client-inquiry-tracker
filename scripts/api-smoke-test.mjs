import assert from 'node:assert/strict';
const base=process.env.TEST_BASE_URL || 'http://127.0.0.1:8787';
let cookie='';
async function request(path,method='GET',body,otherCookie){
 const response=await fetch(base+path,{method,headers:{...(body?{'Content-Type':'application/json'}:{}),Cookie:otherCookie??cookie},body:body?JSON.stringify(body):undefined});
 if(otherCookie===undefined&&response.headers.get('set-cookie'))cookie=response.headers.get('set-cookie').split(';')[0];
 return {status:response.status,data:await response.json()};
}
for(let i=0;i<30;i++){try{await fetch(base+'/api/health');break;}catch{if(i===29)throw Error('Local server did not become ready');await new Promise(r=>setTimeout(r,500));}}
assert.equal((await request('/api/health')).data.database,'connected');
const initial=await request('/api/inquiries');assert.equal(initial.status,200);assert.equal(initial.data.inquiries.length,4);
const created=await request('/api/inquiries','POST',{name:'API Test',email:'test@example.com',service:'WordPress',budget:1250,message:'Temporary smoke test'});assert.equal(created.status,201);const id=created.data.inquiry.id;
assert.equal((await request('/api/inquiries')).data.inquiries.length,5);
assert.equal((await request('/api/inquiries/'+id,'PATCH',{status:'Won'})).data.inquiry.status,'Won');
assert.equal((await request('/api/inquiries/'+id,'PATCH',{status:'Wrong'})).status,400);
assert.equal((await request('/api/inquiries','POST',{name:'X',email:'bad',service:'Other',budget:-10})).status,400);
const alien=await request('/api/inquiries','GET',undefined,'');assert.equal(alien.data.inquiries.length,4);
assert.equal((await request('/api/inquiries/'+id,'DELETE',undefined,'')).status,404);
assert.equal((await request('/api/inquiries')).data.inquiries.find(x=>x.id===id).status,'Won');
const cross=await fetch(base+'/api/inquiries',{method:'POST',headers:{Origin:'https://unrelated.example','Content-Type':'application/json',Cookie:cookie},body:'{}'});assert.equal(cross.status,403);
assert.equal((await request('/api/inquiries/'+id,'DELETE')).status,200);
assert.equal((await request('/api/inquiries/'+id,'DELETE')).status,404);
assert.equal((await request('/api/inquiries')).data.inquiries.length,4);
const page=await fetch(base);assert.equal(page.status,200);assert.match(await page.text(),/Your next project starts here/);
console.log('PASS: API health, seed data, create, persistence, status update, validation, workspace isolation, cross-origin protection, deletion, missing record, and page rendering.');
