/*!
 * Copyright (c) 2025 ifmgrn
 * Licensed under the GNU AGPL-3.0 License.
 * See LICENSE.txt for details.
 */import"./kekule-BK_5NSOM.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function n(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(o){if(o.ep)return;o.ep=!0;const s=n(o);fetch(o.href,s)}})();const F=`<header>
	<nav>
		<button id="periodictable_button">Átomos</button>
		<button id="reactions_button">Reações</button>
	</nav>
	<div aria-hidden="true" class="top-art-deco-frame"></div>
</header>
<main id="main"></main>
`;class w{container;html;class;pM;static params={};constructor(t,n){this.container=t,this.pM=n}load(t={}){return this.class&&this.container.classList.add(this.class),this.html&&(this.container.innerHTML=this.html,this.html=void 0),this.onload(this.container,t)}async unload(){await this.onunload(),this.class&&this.container.classList.remove(this.class),this.container.innerHTML=""}async onload(t,n){}async onunload(){}}class q{container;pages;currentPage;constructor(t,n){this.container=t,this.pages=n}async loadPage(t,n={}){this.currentPage&&await this.currentPage.unload(),this.currentPage=new t(this.container,this),await this.currentPage.load(n)}checkURL(){const t=new URLSearchParams(window.location.search.toLowerCase());let n;for(const r of this.pages){for(const[o,s]of Object.entries(r.params))t.has(s)&&(n||(n={}),n[o]=t.get(s));if(n)return this.loadPage(r,n)}return this.loadPage(this.pages[0])}}const z=`<h1>Tabela Períodica</h1>
<button id="filterAtoms" class="center">
	Filtrar pelos átomos selecionados
</button>
<kekule-periodic-table
	id="periodicTable"
	data-displayed-components='["symbol", "name", "atomicNumber", "atomicWeight"]'
></kekule-periodic-table>
`;class U extends w{class="periodicTable";html=z;async onload(){filterAtoms.addEventListener("click",()=>{const n=periodicTable.widget.getSelectedSymbols();n&&n.length&&(window.location.href=`${window.location.pathname}?p=${encodeURIComponent(n.join(" "))}`)})}}const W="modulepreload",G=function(e){return"/quimica/"+e},x={},Q=function(t,n,r){let o=Promise.resolve();if(n&&n.length>0){let c=function(l){return Promise.all(l.map(f=>Promise.resolve(f).then(d=>({status:"fulfilled",value:d}),d=>({status:"rejected",reason:d}))))};document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),a=i?.nonce||i?.getAttribute("nonce");o=c(n.map(l=>{if(l=G(l),l in x)return;x[l]=!0;const f=l.endsWith(".css"),d=f?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${d}`))return;const u=document.createElement("link");if(u.rel=f?"stylesheet":W,f||(u.as="script"),u.crossOrigin="",u.href=l,a&&u.setAttribute("nonce",a),document.head.appendChild(u),f)return new Promise((h,y)=>{u.addEventListener("load",h),u.addEventListener("error",()=>y(new Error(`Unable to preload CSS for ${l}`)))})}))}function s(i){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=i,window.dispatchEvent(a),!a.defaultPrevented)throw i}return o.then(i=>{for(const a of i||[])a.status==="rejected"&&s(a.reason);return t().catch(s)})},E=(e,t)=>t.some(n=>e instanceof n);let k,C;function Y(){return k||(k=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Z(){return C||(C=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const T=new WeakMap,L=new WeakMap,v=new WeakMap;function J(e){const t=new Promise((n,r)=>{const o=()=>{e.removeEventListener("success",s),e.removeEventListener("error",i)},s=()=>{n(m(e.result)),o()},i=()=>{r(e.error),o()};e.addEventListener("success",s),e.addEventListener("error",i)});return v.set(t,e),t}function tt(e){if(T.has(e))return;const t=new Promise((n,r)=>{const o=()=>{e.removeEventListener("complete",s),e.removeEventListener("error",i),e.removeEventListener("abort",i)},s=()=>{n(),o()},i=()=>{r(e.error||new DOMException("AbortError","AbortError")),o()};e.addEventListener("complete",s),e.addEventListener("error",i),e.addEventListener("abort",i)});T.set(e,t)}let I={get(e,t,n){if(e instanceof IDBTransaction){if(t==="done")return T.get(e);if(t==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return m(e[t])},set(e,t,n){return e[t]=n,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function N(e){I=e(I)}function et(e){return Z().includes(e)?function(...t){return e.apply(D(this),t),m(this.request)}:function(...t){return m(e.apply(D(this),t))}}function nt(e){return typeof e=="function"?et(e):(e instanceof IDBTransaction&&tt(e),E(e,Y())?new Proxy(e,I):e)}function m(e){if(e instanceof IDBRequest)return J(e);if(L.has(e))return L.get(e);const t=nt(e);return t!==e&&(L.set(e,t),v.set(t,e)),t}const D=e=>v.get(e);function ot(e,t,{blocked:n,upgrade:r,blocking:o,terminated:s}={}){const i=indexedDB.open(e,t),a=m(i);return r&&i.addEventListener("upgradeneeded",c=>{r(m(i.result),c.oldVersion,c.newVersion,m(i.transaction),c)}),n&&i.addEventListener("blocked",c=>n(c.oldVersion,c.newVersion,c)),a.then(c=>{s&&c.addEventListener("close",()=>s()),o&&c.addEventListener("versionchange",l=>o(l.oldVersion,l.newVersion,l))}).catch(()=>{}),a}function st(e,{blocked:t}={}){const n=indexedDB.deleteDatabase(e);return t&&n.addEventListener("blocked",r=>t(r.oldVersion,r)),m(n).then(()=>{})}const rt=["get","getKey","getAll","getAllKeys","count"],it=["put","add","delete","clear"],P=new Map;function A(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(P.get(t))return P.get(t);const n=t.replace(/FromIndex$/,""),r=t!==n,o=it.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(o||rt.includes(n)))return;const s=async function(i,...a){const c=this.transaction(i,o?"readwrite":"readonly");let l=c.store;return r&&(l=l.index(a.shift())),(await Promise.all([l[n](...a),o&&c.done]))[0]};return P.set(t,s),s}N(e=>({...e,get:(t,n,r)=>A(t,n)||e.get(t,n,r),has:(t,n)=>!!A(t,n)||e.has(t,n)}));const at=["continue","continuePrimaryKey","advance"],R={},B=new WeakMap,V=new WeakMap,ct={get(e,t){if(!at.includes(t))return e[t];let n=R[t];return n||(n=R[t]=function(...r){B.set(this,V.get(this)[t](...r))}),n}};async function*lt(...e){let t=this;if(t instanceof IDBCursor||(t=await t.openCursor(...e)),!t)return;t=t;const n=new Proxy(t,ct);for(V.set(n,t),v.set(n,D(t));t;)yield n,t=await(B.get(n)||t.continue()),B.delete(n)}function _(e,t){return t===Symbol.asyncIterator&&E(e,[IDBIndex,IDBObjectStore,IDBCursor])||t==="iterate"&&E(e,[IDBIndex,IDBObjectStore])}N(e=>({...e,get(t,n,r){return _(t,n)?lt:e.get(t,n,r)},has(t,n){return _(t,n)||e.has(t,n)}}));let p;function M(e){return X(e).match(/[\p{L}\p{N}]+/gu)??[]}function ut(e,t){const n=["nome","tipo","reagentes","produtos"],r=new Set;for(const o of n){const s=e[o];if(Array.isArray(s))for(const i of s)M(i+" "+t[i]).forEach(a=>r.add(a));else M(s).forEach(i=>r.add(i))}return Array.from(r)}async function dt(){return(await g()).getAll("reactions")}async function ft(e){const t=M(X(e));if(!t.length)return[];const r=(await g()).transaction("reactions").store.index("terms_idx"),o=[];for(const i of t){const a=await r.getAll(IDBKeyRange.bound(i,i+"￿"));if(!a.length)return[];o.push(new Map(a.map(c=>[c.id,c])))}o.sort((i,a)=>i.size-a.size);const s=o[0];for(let i=1;i<t.length&&s.size>0;i++){const a=o[i];for(const c of s.keys())a.has(c)||s.delete(c)}return Array.from(s.values())}async function g(){return p||(sessionStorage.getItem("dev-session-active")||(await st("ChemistryDB-dev"),sessionStorage.setItem("dev-session-active","true")),p=(async()=>{let e;const t=await ot("ChemistryDB-dev",1,{upgrade(n,r,o,s){n.createObjectStore("molecules"),n.createObjectStore("reactions",{keyPath:"id"}).createIndex("terms_idx","terms",{multiEntry:!0}),e=new Promise((i,a)=>{Promise.all([s.done,Q(()=>import("./index-DO76UZRw.js"),[])]).then(c=>{const l=c[1].molecules,f=c[1].reactions,d=n.transaction(["reactions","molecules"],"readwrite");for(const[u,h]of Object.entries(l))d.objectStore("molecules").add(h,u);for(const u of f)d.objectStore("reactions").add({...u,id:mt(u.nome),terms:ut(u,l)});return d.done}).then(i).catch(a)})},blocking(){K()}});return e&&await e,t})())}async function K(){p&&((await p).close(),p=void 0)}function $(e){return e.length===1&&e>="0"&&e<="9"}function H(e){return e.normalize("NFD").replace(/[\u0300-\u036f]/g,"")}function X(e){return H(e).toLowerCase()}function mt(e){return e.replaceAll(" ","-").toLowerCase()}function ht(e,t){return e.replace(/{{\s*(.*?)\s*}}/g,(n,r)=>(r=H(r.trim()).toLowerCase(),String(t[r])))}function pt(e,t=""){const n=e.split(`
`),r=[],o=[];function s(a){return a.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function i(a){for(;o.length>0&&o[o.length-1].indent>a;){const c=o.pop();c.openLi&&(r.push("</li>"),c.openLi=!1),r.push(c.type==="ul"?"</ul>":"</ol>")}}return n.forEach(a=>{if(!a.trim()){i(-1);return}const c=a.match(/^(\t*)/),l=c?c[1].length:0,f=a.trim(),d=f.match(/^-\s+(.*)/),u=f.match(/^([0-9a-zA-Z]+)[.)]\s+(.*)/);let h;if(d)h=d[1];else if(u)h=u[2];else{i(-1),r.push(s(`<p>${f}</p>`));return}const y=d?"ul":"ol";if(i(l),o.length===0||o[o.length-1].indent<l||o[o.length-1].type!==y)r.push(`<${y} class="${t}">`),o.push({type:y,indent:l,openLi:!1});else{const S=o[o.length-1];S.openLi&&(r.push("</li>"),S.openLi=!1)}r.push(`<li>${s(h)}`),o[o.length-1].openLi=!0}),i(-1),r.join("")}function j(e,t){const n=e.selectionStart??0,r=e.selectionEnd??0,o=e.value;e.value=o.substring(0,n)+t+o.substring(r);const s=n+t.length;e.selectionStart=e.selectionEnd=s,e.focus(),e.dispatchEvent(new Event("input",{bubbles:!0}))}async function b(e,t){return t||(t=(await g()).transaction("molecules").store),(await Promise.all(e.map(async n=>`${n} (${await t.get(n)})`))).join(", ")}const gt=`<h1>Banco de Dados de Reações Químicas</h1>
<div class="input-container">
	<div role="group" class="hidden" aria-hidden="true">
		<button data-to-insert="₀">X₀</button>
		<button data-to-insert="₁">X₁</button>
		<button data-to-insert="₂">X₂</button>
		<button data-to-insert="₃">X₃</button>
		<button data-to-insert="₄">X₄</button>
		<button data-to-insert="₅">X₅</button>
		<button data-to-insert="₆">X₆</button>
		<button data-to-insert="₇">X₇</button>
		<button data-to-insert="₈">X₈</button>
		<button data-to-insert="₉">X₉</button>
	</div>
	<input id="input" type="search" placeholder="Filtrar..." />
</div>
<div id="reactionsGrid"></div>
`;class O extends w{class="reactions";html=gt;typingTimer;reactionsTableColumns={"Reação Química":"nome",Tipo:"tipo","Reagente(s)":"reagentes","Produto(s)":"produtos",Equação:"equacao"};lastInputValue=void 0;addEventListeners(){input.addEventListener("keydown",t=>{if(t.key==="Escape")t.preventDefault(),input.blur();else if(t.ctrlKey&&$(t.key)){const n={0:"₀",1:"₁",2:"₂",3:"₃",4:"₄",5:"₅",6:"₆",7:"₇",8:"₈",9:"₉"};j(input,n[t.key]),t.preventDefault()}}),input.addEventListener("input",()=>{clearTimeout(this.typingTimer),g(),this.typingTimer=setTimeout(()=>this.search(),500)}),document.addEventListener("keydown",t=>{(t.key.length===1||["Backspace","Delete"].includes(t.key))&&![HTMLInputElement,HTMLTextAreaElement].some(n=>document.activeElement instanceof n)&&!t.altKey&&!t.metaKey&&(!t.shiftKey||t.key.length===1)&&(!t.ctrlKey||$(t.key))&&(input.setSelectionRange(input.value.length,input.value.length),input.focus(),t.ctrlKey&&(input.dispatchEvent(new KeyboardEvent("keydown",{ctrlKey:!0,key:t.key})),t.preventDefault()))})}setupToolbars(){const t=document.getElementsByClassName("input-container");for(const n of t){const r=n.querySelector('[role="group"]'),o=n.querySelector("input");if(!(!r||!o)){for(const s of r.querySelectorAll("button"))s.setAttribute("tabindex","0");r.addEventListener("click",s=>{const i=s.target;i instanceof HTMLButtonElement&&j(o,i.dataset.toInsert??i.textContent??"")}),o.addEventListener("focusin",()=>{r.removeAttribute("aria-hidden"),r.classList.remove("hidden")}),o.addEventListener("focusout",s=>{const i=s.relatedTarget;i instanceof Node&&r.contains(i)||(r.setAttribute("aria-hidden","true"),r.classList.add("hidden"))})}}}async generateReactionsGrid(t){const n=(await g()).transaction("molecules");async function r(s){return`<div>
			    <lite-youtube videoid="${s.embedded_link.slice(s.embedded_link.lastIndexOf("/")+1)}" title="${s.nome}"></lite-youtube>
				<div class="info">
					<span class="field">Reação:</span><span class="value">${s.nome}</span>
					<span class="field">Tipo:</span><span class="value">${s.tipo}</span>
					<span class="field">Reagente(s):</span><span class="value">${await b(s.reagentes,n.store)}</span>
					<span class="field">Produto(s):</span><span class="value">${await b(s.produtos,n.store)}</span>
					<span class="field">Equação:</span><span class="value">${s.equacao}</span>
				</div>
			</div>`}return(await Promise.all(t.map(r))).join("")}async search(t,n=!0){t===void 0?t=input.value:input.value=t,this.lastInputValue!==t&&(this.lastInputValue=t,reactionsGrid.innerHTML=await this.generateReactionsGrid(await(t?ft(t):dt())))}async onload(){this.addEventListeners(),this.setupToolbars();const t=new URLSearchParams(window.location.search.toLowerCase());this.search(t.get("p")??void 0)}async onunload(){clearTimeout(this.typingTimer)}}class yt extends w{class="home";html=F;currentPage;activeButton;static params={p:"p"};async loadPage(t,n){if(this.currentPage){await this.currentPage.unload();const r=window.location.origin+window.location.pathname;window.history.replaceState({},document.title,r)}return this.activeButton&&this.activeButton.classList.remove("active"),this.activeButton=n,n.classList.add("active"),this.currentPage=new t(main),this.currentPage.load()}async onload(){for(const[t,n]of[[U,periodictable_button],[O,reactions_button]])n.addEventListener("click",()=>this.loadPage(t,n));return this.loadPage(O,reactions_button)}}const bt=`<header>
	<div aria-hidden="true" class="top-art-deco-frame"></div>
	<h1>{{ nome }}</h1>
</header>
<main>
	<section>
		<ul class="center tree">
			<li>Tipo: {{ tipo }}</li>
			<li>Reagente(s): {{ reagentes }}</li>
			<li>Produto(s): {{ produtos }}</li>
			<li>Equação balanceada: {{ equação }}</li>
		</ul>
	</section>
	<section>
		<h2>Demonstração</h2>
		<iframe
			src="{{ embedded_link }}"
			loading="lazy"
			title="YouTube video player"
			frameborder="0"
			allow="encrypted-media; picture-in-picture"
			referrerpolicy="strict-origin-when-cross-origin"
			allowfullscreen
		></iframe>
	</section>
	<section>
		<h2>Instruções</h2>
		{{ instruções }}
	</section>
</main>
<footer>
	<a class="center" href=".">Ir para a página principal</a>
</footer>
`;class wt extends w{class="reaction";static params={name:"r"};async onload(t,n){const r=n.name;if(!r)return window.location.assign(".");const o=await g(),s=await o.get("reactions",r);if(!s)return window.location.assign(".");document.title=s.nome;const i=o.transaction("molecules"),a={...s,reagentes:await b(s.reagentes,i.store),produtos:await b(s.produtos,i.store),instrucoes:pt(s.instrucoes,"tree")};t.insertAdjacentHTML("beforeend",ht(bt,a)),K()}}const vt=new q(document.body,[yt,wt]);vt.checkURL();
