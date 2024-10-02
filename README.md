# Asana Assignee Selector

這個 Chrome 擴充功能可以根據輸入的電子郵件過濾 Asana 中的任務，幫助你每天例會時更快速的篩選指定成員的任務。

## 功能
- 根據 Asana 任務中的 assignee email 進行過濾
- 可以輸入單個或多個 email
- 多組 email 時，可以點擊 `Prev` 或 `Next` 按鈕來切換前一個或下一個 assignee

## 安裝教學

按照以下步驟，手動下載並載入此擴充功能到你的 Chrome 瀏覽器中

### 步驟 1：下載擴充功能
1. 在目前頁面，點擊綠色的 **Code** 按鈕
2. 從下拉選單中選擇 **Download ZIP**
3. 將下載的 `.zip` 檔案解壓縮到你電腦上方便的目錄中

### 步驟 2：在 Chrome 中載入擴充功能
1. 打開 Google Chrome，並在網址列輸入以下網址進入擴充功能管理頁面：
   ```text
   chrome://extensions/
   ```
2. 在擴充功能頁面右上角，開啟「開發者模式」
3. 點擊「載入未封裝項目」按鈕
4. 在彈出的對話框中，到你剛剛解壓縮 .zip 檔案的目錄，選擇包含 manifest.json 的資料夾
5. Asana Assignee Selector 將會載入，可以在「所有擴充功能」列表中看到該擴充功能
6. 點擊瀏覽器工具列中的擴充功能圖示，打開彈出視窗
7. 把 Asana Assignee Selector 釘選到工具列

### 步驟 3：使用 Asana Assignee Selector
1. 到 Asana Project 頁面
2. 點擊瀏覽器工具列中的 Asana Assignee Selector 圖示，打開彈出視窗

#### 【篩選單個 assignee】
1. 輸入要篩選的 assignee email
2. 點擊 `Filter` 按鈕
3. Asana Assignee Selector 會自動幫你點擊 Filter 按鈕並輸入 email
4. 需要主動點擊 Assignee Filter 的輸入框，讓它展開下拉選單搜尋 assignee
5. 找到對應的 assignee 後，會自動選擇該 assignee 並且關閉 Filter popup。如果超過 20 秒後沒有打開選單或找不到人，則會結束尋找

#### 【篩選多個 assignee】
1. 輸入多個要篩選的 assignee email，以 `,` 分隔
2. 點擊 `Filter` 按鈕
3. Asana Assignee Selector 會自動幫你點擊 Filter 按鈕並輸入第一個 email
4. 需要主動點擊 Assignee Filter 的輸入框，讓它展開下拉選單搜尋 assignee
5. 找到對應的 assignee 後，會自動選擇該 assignee 並且關閉 Filter popup。如果超過 20 秒後沒有打開選單或找不到人，則會結束尋找
6. 在 Asana Project 頁面中，Asana Project Title 下方會看到一個 `Prev` 和 `Next` 按鈕，可以點擊來切換前一個或下一個 assignee
7. 第一個 assignee 後就不用主動點擊 Assignee Filter 的輸入框了，會自動點擊

#### 【如果切換 assignee 時卡住導致篩選失敗怎麼辦】
1. 在 Asana Project 頁面中，點擊 `Filters` 按鈕
2. 在 Filter popup 中，點擊 `Clear` 按鈕，清除所有過濾條件
3. 重新執行篩選步驟。例如多組 email 時，就貼上中斷處後的所有 email 重新篩選
