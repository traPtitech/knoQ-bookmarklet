# knoQ-bookmarklet
東工大の教務Webシステムの施設予約ページから，traPが予約している部屋情報を抜き出すブックマークレットです．

## 機能
- [x] 部屋情報をCSVとしてダウンロード
- [ ] 部屋情報をJSONとしてダウンロード
- [ ] 部屋情報をMD形式の表としてクリップボードにコピー

## 使用方法
1. ブックマークレットをお使いの登録
<a id="bookmarklet">ブックマークレット</a>
2. 教務Webの「施設予約ページ」にアクセス
3. ブックマークレットを走らせる
4. CSVファイルのダウンロードが始まる

<script>
  fetch("https://github.com/traPtitech/knoQ-bookmarklet/releases/download/v0.1.0/index.js")
    .then((res) => res.text())
    .then((js) => {
      document.getElementById("bookmarklet").href = js;
    });
</script>
