# knoQ-bookmarklet
東工大の教務Webシステムの施設予約ページから，traPが予約している部屋情報を抜き出すブックマークレットです．

## 機能
- [x] 部屋情報をCSVとしてダウンロード
- [ ] 部屋情報をJSONとしてダウンロード
- [ ] 部屋情報をMD形式の表としてクリップボードにコピー

## 動作環境
以下のブラウザで動くことを確認しています
- Chrome 93.0
- Safari 14.1.2
- Firefox 92.0

## 使用方法
### ブックマークレットの登録(初回のみ)
お使いのブラウザにブックマークレットを登録します．やることは通常のブックマークの登録とほとんど同じです．登録するURLがブックマークレットのコードに替わるだけです．

以下ではChromeでの手順を説明します．

1. 以下のブックマークレットをコピー(右端のクリップボードボタンを押せばコピーできます)
```bookmarklet
javascript:(()=>{async function l(){await f();let t=[];for(let e=0;e<4;e++)t.push(...y()),await S();return t.sort((e,n)=>e.timeStart.getTime()-n.timeStart.getTime()),t}async function f(){document.querySelector("#lblModeW").click(),document.querySelector("#tbl2 > tbody > tr > td:nth-child(3) > a").click(),await s()}async function S(){document.querySelector("#ctl00_divMainContents > div:nth-child(10) > div.hideAtPrint > table.searchTablex > tbody > tr:nth-child(1) > td:nth-child(2) > a:nth-child(6)").click(),await s()}async function s(){for(let t=20;t--;)if(await new Promise(n=>setTimeout(n,500)),document.querySelector("#divTbl")?.firstElementChild?.tagName==="DIV")return;throw new Error("\u8B1B\u7FA9\u5BA4\u60C5\u5831\u304C\u30ED\u30FC\u30C9\u3055\u308C\u307E\u305B\u3093\u3067\u3057\u305F")}function y(){let t=document.querySelectorAll("table.tblMonth > tbody > tr.trRoom");return Array.from(t).flatMap(b)}function b(t){let e=t.classList.contains("trTop")?t.cells[1].innerText.trim():t.cells[0].innerText.trim(),n=t.querySelectorAll("td");return Array.from(n).flatMap(o=>g(o).map(r=>({place:e,...r})))}function g(t){let e=t.dataset.date;e=`${e.slice(0,4)}-${e.slice(4,6)}-${e.slice(6,8)}`;let n=t.querySelectorAll("span > span");return Array.from(n).flatMap(({innerText:o})=>{if(!/デジタル創作同好会traP/.test(o))return[];let[,r,i]=o.match(/\((\d\d:\d\d).*(\d\d:\d\d)\)/);return{timeStart:new Date(`${e}T${r}:00`),timeEnd:new Date(`${e}T${i}:00`)}})}function m(t,e,n){let o=new Blob([e],n),r=window.URL.createObjectURL(o),i=document.createElement("a");i.setAttribute("href",r),i.setAttribute("download",t),i.click()}function d(t){let e=document.createElement("textarea");e.value=t,document.body.appendChild(e),e.select();let n=document.execCommand("copy");return document.body.removeChild(e),n}function u(t){return t.length===0?"":T(()=>{let e=[...Object.keys(t[0])],n=t.map(o=>[...Object.values(o)].map(String));return[e,...n].map(o=>o.join(",")).join("\n")})}function p(t){return t.length===0?"":T(()=>{let e=[...Object.keys(t[0])],n=Array(e.length).fill("-"),o=t.map(r=>[...Object.values(r)].map(String));return[e,n,...o].map(r=>`|${r.join("|")}|`).join("\n")})}function T(t){let e=Date.prototype.toString;Date.prototype.toString=Date.prototype.toISOString;try{return t()}finally{Date.prototype.toString=e}}var c=t=>t.toLocaleDateString("ja-JP"),a=t=>t.toLocaleTimeString("ja-JP",{timeStyle:"short"});function w(t){return{\u65E5\u4ED8:c(t.timeStart),\u5834\u6240:t.place,\u958B\u59CB\u6642\u523B:a(t.timeStart),\u7D42\u4E86\u6642\u523B:a(t.timeEnd)}}function h(t){return{Subject:"\u9032\u6357\u90E8\u5C4B",Location:t.place,"Start Date":c(t.timeStart),"End Date":c(t.timeEnd),"Start Time":a(t.timeStart),"End Time":a(t.timeEnd)}}async function x(){let t=await l();if(window.confirm("\u9032\u6357\u90E8\u5C4B\u8868\u3092\u30B3\u30D4\u30FC\u3057\u307E\u3059\u304B?")){let e=p(t.map(w));d(e)?window.alert("\u30B3\u30D4\u30FC\u3057\u307E\u3057\u305F"):window.alert("\u30B3\u30D4\u30FC\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F")}if(window.confirm("CSV\u3092\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u3057\u307E\u3059\u304B?")){let e=u(t.map(h));m("cal.csv",e,{type:"text/csv"})}}x();})();
```
2. ブックマーク追加画面を開く
![ブックマーク追加画面を開く](/assets/scrot1.png?raw=true)
ブックマークツールバー上で右クリックをするとメニューが出る．その中でブックマークを追加という項目をクリックする

3. ブックマークレットを登録する
![ブックマークレットを登録する](/assets/scrot2.png?raw=true)
ブックマークレットの登録名を入力（名前は自由）．そして，URLの欄に先ほどコピーしたブックマークレットのコードを貼り付ける．保存ボタンを押すと登録が完了

### ブックマークレットを使って進捗部屋情報を抽出する
登録したブックマークレットを教務Webシステムの施設予約ページで動作させることで，進捗部屋情報を抽出します．
1. [教務Webシステム](https://kyomu2.gakumu.titech.ac.jp/Titech/Student/)にログイン
2. 左のメニューバーの下部の「施設予約」をクリックして，施設予約ページにアクセス
3. 登録したブックマークレットをクリック
![登録したブックマークレットをクリック](/assets/scrot3.png)
4. ブックマークレットが動作するので待つ
5. 「進捗部屋表をコピーしますか？」と画面が出る．クリップボードにMarkdown形式の進捗部屋表をコピーしたければOKを，そうでないならCancelを押す
![進捗部屋表をコピーしますか？](/assets/scrot4.png)
6. 「CSVをダウンロードしますか？」と画面が出る．CSV形式の進捗部屋情報をダウンロードするならOKを，そうでないならCancelを押す
![CSVをダウンロードしますか？](/assets/scrot5.png)
