let g1 = (a) => {
  let [m0,M0,t,tc,tr,...other] = a;
  let r = '<style>.coltb td{width:1.5em;height:1.5em;text-align:center} .coltb{border-spacing:0}</style>';
  let p = n => Math.log(n);
  let pi = n => Math.exp(n);
  let m = p(m0);
  let M = p(M0);
  let Mm = M-m;
  let factor = other.length && other[0]=='fac';
  let fts = (ts,n) => {
    let fx = (x) => x.toFixed(Math.max(0,n-x.toFixed(0).length));
    if (factor) return fx(ts,2)+'x';
    if (ts==0) return '—';
    return ts<1e-9? fx(ts*1e12)+'ps'
         : ts<1e-6? fx(ts*1e9)+'ns'
         : ts<1e-3? fx(ts*1e6)+'us'
         : ts<1?    fx(ts*1e3)+'ms'
         : fx(ts)+'s';
  }

  let fcol = (ts,st="") => {
      let f = (p(ts)-m)/Mm;
      if (ts==0) return '';
      if (factor) f = 1-f;
      if(f <= 0.001) f = 0.001;
      if(f >= 0.999) f = 0.999;
      f = 0.35+0.65*f;
      f = f*3;
      let f0 = f%1; let f1 = 1-f0;
      let col;
      if      (f<1) col = [f1, f0, 0 ];
      else if (f<2) col = [0 , f1, f0];
      else          col = [f0, 0 , f1];
      return ' style="background:rgba('+col.map(c=>c*255).join(',')+',0.8);'+st+'" title="'+fts(ts,4)+'" ';
  };

  r+= '<table class="coltb"><tr>';
  for (let i = 0; i < 15; i++) { let ts=pi(i/14*(M-m)+m); r+= '<td'+fcol(ts,"width:3.3em")+'>'+fts(ts,2)+'</td>'; }
  r+= '</tr></table>';

  r+= '<table class="coltb"><tr><td>𝕨\\𝕩</td>';
  for (let x = 0; x < t[0].length; x++) r+= '<td>'+tr[x]+'</td>';
  r+= '</tr>';

  for (let y = 0; y < t.length; y++) {
    let c = t[y];
    r+= '<tr><td>'+tc[y]+'</td>';
    for (let x = 0; x < c.length; x++) {
      let ts = c[x];
      if (window.timeInCells) r+= '<td '+fcol(ts,"width:3.3em")+'>'+fts(ts,2)+'</td>';
      else r+= '<td '+fcol(ts)+'></td>';
    }
    r+= '</tr>';
  }
  r+= '</table>';
  return r;
}
let ki=0;
htmlgen['tbl'] = (s) => {
  let a = JSON.parse(s);
  if (typeof a[0] === 'number') return g1(a);
  let km="tk"+ki++;
  let r="";
  for (let i = 0; i < a.length; i+=2) {
    let k="tk"+ki++;
    window[k] = () => document.getElementById(km).innerHTML = g1(a[i+1]);
    r+= '<button onclick="window.'+k+'()" style="min-width:3.5em;height:2.5em;margin:.2em .1em">'+a[i]+'</button>'
  }
  return r+'<div id="'+km+'">'+g1(a[1])+'</div>';
};