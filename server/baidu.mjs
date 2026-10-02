export async function recognize(image,{apiKey,secretKey,request=fetch}={}){
 if(!apiKey||!secretKey)throw Error('Live recognition is not configured.');
 const tokenUrl=new URL('https://aip.baidubce.com/oauth/2.0/token');
 tokenUrl.search=new URLSearchParams({grant_type:'client_credentials',client_id:apiKey,client_secret:secretKey});
 const tokenResponse=await request(tokenUrl,{method:'POST',signal:AbortSignal.timeout(12000)});
 const token=await tokenResponse.json();if(!tokenResponse.ok||!token.access_token)throw Error('Recognition authentication failed.');
 const url=new URL('https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general');url.searchParams.set('access_token',token.access_token);
 const response=await request(url,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({image}),signal:AbortSignal.timeout(20000)});
 const data=await response.json();if(!response.ok||data.error_code)throw Error('Recognition provider returned an error.');
 return {labels:(data.result||[]).map(x=>x.keyword).filter(x=>typeof x==='string').slice(0,5)};
}
