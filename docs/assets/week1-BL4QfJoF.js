var p=Object.defineProperty;var S=(t,e,s)=>e in t?p(t,e,{enumerable:!0,configurable:!0,writable:!0,value:s}):t[e]=s;var r=(t,e,s)=>S(t,typeof e!="symbol"?e+"":e,s);import{l as E,g as x,R as y}from"./library-BampcdjG.js";/* empty css              */class W{constructor(e,s,i,o,c,l){r(this,"value");r(this,"occurrence");r(this,"x");r(this,"y");r(this,"length");r(this,"hoverState");r(this,"style");r(this,"render",e=>{e.fillStyle=this.style,e.fillText(this.value,this.x,this.y)});this.value=e,this.occurrence=s,this.x=i,this.y=o,this.length=c,this.hoverState=!1,this.style=l}}class m{constructor(){r(this,"sentence");r(this,"addWord",e=>{this.sentence=[...this.sentence,e]});r(this,"render",({ctx:e,dict:s,styles:i})=>{const o=this.sentence.find(c=>s[c].hoverState===!0);e.strokeStyle=o?i.focus:i.blur,this.sentence.forEach((c,l)=>{o&&(s[c].style=i.focus);const d=l>0?this.sentence[l-1]:null;d&&E(e,s[d].x,s[d].y,s[c].x,s[c].y)})});this.sentence=[]}}const n={dict:{},sentences:[],styles:{focus:"red",blur:"black"},init:()=>{const t=new m;n.sentences=[...n.sentences,t]},addWord:(t,e,s)=>{t=t.toLocaleLowerCase(),n.dict[t]?n.dict[t].occurrence++:n.dict[t]=new W(t,1,e,s,t.length,n.styles.blur),n.sentences[n.sentences.length-1].addWord(t)},endSentence:()=>{const t=new m;n.sentences=[...n.sentences,t]},checkHover:(t,e,s)=>{const i=Object.keys(n.dict),o=i.find(c=>n.dict[c].x<=t&&n.dict[c].x+n.dict[c].length*s*.5>=t&&n.dict[c].y>=e&&n.dict[c].y-s<=e);return o?(n.dict[o].hoverState=!0,!0):(i.forEach(c=>n.dict[c].hoverState=!1),!1)},render:t=>{for(const e in n.dict)n.dict[e].style=n.styles.blur;n.sentences.forEach(e=>{e.render({ctx:t,dict:n.dict,styles:n.styles})});for(const e in n.dict)n.dict[e].render(t)}},u=document.getElementById("canvas"),h=u.getContext("2d"),v=document.getElementById("input-container"),f=document.getElementById("input-field"),b=()=>{if(!(h&&f))return;u.width=window.innerWidth,u.height=window.innerHeight;let[t,e]=x(v);const s=30,i=()=>{h.fillStyle="rgba(150,150,150,0.9)",h.fillRect(0,0,u.width,u.height),h.font=`${s}px Helvetica`,n.render(h)};n.init(),i(),f.addEventListener("keydown",c=>{c.key==="Enter"&&(f.value.split(new RegExp("(\\s+|(?=\\.)|(?<=\\.)|\\b)")).filter(Boolean).forEach(a=>{if(a==="."){n.endSentence(),t=y.float(10,50),e+=80;return}if(!/[a-zA-Z]/.test(a))return;const g=e+y.float(-20,20);n.addWord(a,t,g),t+=a.length*30+y.float(20,50)}),i(),f.value="",v.style.left=`${t}px`,v.style.top=`${e}px`)});let o=!1;document.addEventListener("mousemove",c=>{const[l,d]=[c.clientX,c.clientY],a=n.checkHover(l,d,s);a!=o&&i(),o=a})};b();
