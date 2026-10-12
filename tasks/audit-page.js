/* 页面手机适配审计：以 DOM 度量代替肉眼看图。
   用法：node_repl 里把本文件内容作为表达式交给 playwright.evaluate。
   覆盖：横向溢出、文字裁切、触控尺寸、触控重叠、字阶层次、首屏焦点、折叠控件、可发现性。 */
(function(){
  const de=document.documentElement, mb=document.querySelector(".mbody");
  const R=el=>el.getBoundingClientRect();
  const cls=el=>(el.className||"").toString().trim().slice(0,44);
  const txt=el=>(el.textContent||"").replace(/\s+/g," ").trim().slice(0,34);
  const out={hash:location.hash, viewport:{w:innerWidth,h:innerHeight}};

  out.pageOverflow = de.scrollWidth - de.clientWidth;
  out.docOverflow  = document.body.scrollWidth - document.body.clientWidth;
  if(!mb) return out;
  out.mbody = {w:mb.clientWidth, sw:mb.scrollWidth, overflow:mb.scrollWidth-mb.clientWidth, h:mb.scrollHeight};

  const mbR=R(mb);
  const outside=[], clipped=[];
  mb.querySelectorAll("*").forEach(el=>{
    const r=R(el);
    if(r.width<=0||r.height<=0) return;
    if(r.right>mbR.right+1||r.left<mbR.left-1){
      outside.push({tag:el.tagName,cls:cls(el),l:Math.round(r.left),r:Math.round(r.right),txt:txt(el)});
    }
    const cs=getComputedStyle(el);
    const isText = el.children.length===0 && (el.textContent||"").trim().length>0;
    if(isText && el.scrollWidth>el.clientWidth+1 && cs.whiteSpace!=="normal"){
      clipped.push({tag:el.tagName,cls:cls(el),sw:el.scrollWidth,cw:el.clientWidth,ws:cs.whiteSpace,txt:txt(el)});
    }
    if(isText && cs.textOverflow==="ellipsis"){
      clipped.push({tag:el.tagName,cls:cls(el),ellipsis:true,sw:el.scrollWidth,cw:el.clientWidth,txt:txt(el)});
    }
  });
  out.outsideBox=outside.slice(0,10); out.outsideCount=outside.length;
  out.clippedText=clipped.slice(0,10); out.clippedCount=clipped.length;

  /* 勾选框的触控区由外层 label/容器提供：按有效触控矩形判定 */
  const eff = el => {
    let n = el;
    while (n && n !== mb) {
      const r = R(n);
      if (r.height >= 44 && r.width >= 44) return r;
      if (n.tagName === "LABEL" || n.classList.contains("ckc")) return r;
      n = n.parentElement;
    }
    return R(el);
  };
  const intr=[...mb.querySelectorAll("button,a[href],summary,input,select,textarea,[onclick]")]
    .filter(el=>{const r=R(el);return r.width>0&&r.height>0;});
  const small=[];
  intr.forEach(el=>{const r=eff(el); if(r.height<44||r.width<44)
    small.push({cls:cls(el),tag:el.tagName,w:Math.round(r.width),h:Math.round(r.height),txt:txt(el)});});
  out.smallTargets=small.slice(0,14); out.smallCount=small.length;
  const overlaps=[];
  for(let i=0;i<intr.length;i++)for(let j=i+1;j<intr.length;j++){
    const a=intr[i],b=intr[j];
    if(a.contains(b)||b.contains(a))continue;
    const x=R(a),y=R(b);
    const ox=Math.min(x.right,y.right)-Math.max(x.left,y.left);
    const oy=Math.min(x.bottom,y.bottom)-Math.max(x.top,y.top);
    if(ox>2&&oy>2) overlaps.push({a:cls(a)+","+txt(a),b:cls(b)+","+txt(b),ox:Math.round(ox),oy:Math.round(oy)});
  }
  out.overlaps=overlaps.slice(0,8); out.overlapCount=overlaps.length;

  const scale={};
  mb.querySelectorAll("*").forEach(el=>{
    if(el.children.length) return;
    const t=(el.textContent||"").trim(); if(!t) return;
    const cs=getComputedStyle(el);
    const k=cs.fontSize+"/"+cs.fontWeight;
    (scale[k]=scale[k]||{n:0,sample:[]}).n++;
    if(scale[k].sample.length<2) scale[k].sample.push(txt(el));
  });
  out.typeScale=Object.entries(scale).sort((a,b)=>parseFloat(b[0])-parseFloat(a[0]))
    .map(([k,v])=>({size:k,n:v.n,sample:v.sample}));

  const sec=mb.querySelector(".secthead, .groupbox, .focusrec, .qlist, .metricbar, .card, .segview, h1,h2,h3");
  const firstScreen=[];
  let y=0;
  [...mb.children].forEach(el=>{
    const r=R(el); if(r.height<4) return;
    firstScreen.push({cls:cls(el)||el.tagName, h:Math.round(r.height), top:Math.round(r.top-mbR.top),
      fs:getComputedStyle(el).fontSize, lead:txt(el).slice(0,60)});
  });
  out.firstScreen=firstScreen.slice(0,14);
  const detailsInMain=[...mb.querySelectorAll("details")].map(d=>({
    summary:txt(d.querySelector("summary")||d), open:d.open, h:Math.round(R(d).height)}));
  out.details=detailsInMain;
  out.headings=[...mb.querySelectorAll("h1,h2,h3,.ct,.ph-t,.secthead h2,.frt")].map(el=>({
    tag:el.tagName,cls:cls(el),fs:getComputedStyle(el).fontSize,fw:getComputedStyle(el).fontWeight,txt:txt(el)}));
  out.viewSwitches=[...mb.querySelectorAll(".segview button,.ptab,.fchip")].map(el=>({
    cls:cls(el),sel:el.getAttribute("aria-selected")||(el.classList.contains("on")?"on":""),txt:txt(el),
    h:Math.round(R(el).height)}));
  return out;
})()
