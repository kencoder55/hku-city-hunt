# 畫面紅框圖片資產對照

對照附件六個畫面中紅框標示的圖片，以及同系列相關資產。

實際使用的靜態檔都在 `web/public/assets/`。前端引用路徑為 `/assets/...`。

`web/public/assets 2/` 是同一批資產的副本，程式碼沒有引用。

---

## 1. 主畫面（地圖）

| 紅框位置 | 說明 | 檔案 | 使用處 |
| --- | --- | --- | --- |
| 頂部中央 Logo | 「DNA 校園定向」標題 Logo | `web/public/assets/icons/title-logo.png` | `web/src/components/common/AppLayout.jsx` |
| 右上放大鏡 | 地圖縮放（MUI 圖示，不是獨立圖片檔） | `@mui/icons-material/ZoomIn` | `web/src/components/home/MapControls.jsx` |
| 右上頭像 | 會員頭像（DayDay 吉祥物各造型） | `web/public/assets/icons/avatar/{1-13}.png` | `web/src/components/common/AppLayout.jsx` |
| 底部綠色藥丸按鈕吉祥物 | 尋找角色（finder） | `web/public/assets/icons/finder.png` | `web/src/components/home/NearbyButton.jsx` |

### 同頁相關

| 說明 | 檔案 | 使用處 |
| --- | --- | --- |
| 左上漢堡選單 | `web/public/assets/icons/nav.svg` | `AppLayout.jsx` |
| 地圖底圖（路徑、店舖、角色都畫在圖裡） | `web/public/assets/images/map.svg` | `web/src/components/home/InteractiveMap.jsx` |
| 舊版地圖 | `web/public/assets/images/map-330.svg` | 未在程式碼引用 |
| 舊版地圖 | `web/public/assets/images/map-202602024.svg` | 未在程式碼引用 |
| 地圖任務釘（未完成） | 元件內嵌 SVG | `web/src/components/home/PinIcon.jsx` |
| 地圖任務釘（已完成） | 元件內嵌 SVG | `web/src/components/home/CompletedPinIcon.jsx` |
| 未登入時的預設頭像 | MUI `AccountCircleIcon` | `AppLayout.jsx` |

### 頭像系列（相關）

註冊 / 個人資料可選，路徑格式：`/assets/icons/avatar/{id}.png`

| 檔案 | 造型概要 |
| --- | --- |
| `web/public/assets/icons/avatar/1.png` | 圍巾、拿咖啡 |
| `web/public/assets/icons/avatar/2.png` | 草帽農夫、拿耙 |
| `web/public/assets/icons/avatar/3.png` | 其他 DayDay 造型 |
| `web/public/assets/icons/avatar/4.png` | 其他 DayDay 造型 |
| `web/public/assets/icons/avatar/5.png` | 其他 DayDay 造型 |
| `web/public/assets/icons/avatar/6.png` | 其他 DayDay 造型 |
| `web/public/assets/icons/avatar/7.png` | 其他 DayDay 造型 |
| `web/public/assets/icons/avatar/8.png` | 其他 DayDay 造型 |
| `web/public/assets/icons/avatar/9.png` | 其他 DayDay 造型 |
| `web/public/assets/icons/avatar/10.png` | 其他 DayDay 造型 |
| `web/public/assets/icons/avatar/11.png` | 其他 DayDay 造型 |
| `web/public/assets/icons/avatar/12.png` | 其他 DayDay 造型 |
| `web/public/assets/icons/avatar/13.png` | 其他 DayDay 造型 |

註冊頁頭像選項定義在 `web/src/app/[locale]/(auth)/members/register/page.jsx`。

---

## 2. 任務列表

| 紅框位置 | 說明 | 檔案 | 使用處 |
| --- | --- | --- | --- |
| 列表左側店舖縮圖 | 任務封面圖，來自 CMS `cover_image` | `web/public/assets/images/mission-cover/*.svg` | `web/src/components/mission/MissionsList.jsx` |
| 無封面時的後備圖 | 預設佔位圖 | `web/public/assets/images/default-image-placeholder.svg` | 同上 |

附件紅框的棕色店面，對應 `so330.svg` 這類店舖插畫。實際顯示哪一張取決於該任務的 `coverImage`。

### 搜尋列放大鏡（同頁相關）

任務列表搜尋框的放大鏡是 MUI `SearchIcon`，不是獨立圖片檔。見 `MissionsList.jsx`。

### 任務封面系列（相關）

| 檔案 | 用途 |
| --- | --- |
| `web/public/assets/images/mission-cover/so330.svg` | SO SO 330 店面 |
| `web/public/assets/images/mission-cover/cafe330.svg` | Cafe 330 |
| `web/public/assets/images/mission-cover/eslite.svg` | 誠品 |
| `web/public/assets/images/mission-cover/thealchemistcafe.svg` | The Alchemist Cafe |
| `web/public/assets/images/mission-cover/tamjai.svg` | 譚仔 |
| `web/public/assets/images/mission-cover/tamjai-1.svg` | 譚仔（另一款） |
| `web/public/assets/images/mission-cover/samgor.svg` | 三哥 |
| `web/public/assets/images/mission-cover/samgor-1.svg` | 三哥（另一款） |
| `web/public/assets/images/mission-cover/mtr.svg` | 港鐵 |
| `web/public/assets/images/mission-cover/dayday.svg` | DayDay 吉祥物封面 |

種子資料對應見 `tools/output/mission-data.json`。

### 同頁背景

| 說明 | 檔案 |
| --- | --- |
| 任務列表模糊背景 | `web/public/assets/images/mission-list-bg.png` |

---

## 3. 任務詳情（五感對對碰）

| 紅框位置 | 說明 | 檔案 | 使用處 |
| --- | --- | --- | --- |
| 頂部標題橫幅兩側裝飾 | matching 類型左右圖示 | `web/public/assets/icons/mission-banner/11.svg`（左） | `HeaderBanner` via `missionTypeStyles('matching')` |
|  |  | `web/public/assets/icons/mission-banner/12.svg`（右） | 同上 |
| 中央店舖大圖 | 任務封面圖（與列表縮圖同一來源，放大顯示） | `web/public/assets/images/mission-cover/*.svg` | `web/src/components/mission/MissionHome.jsx` |

標題文字「五感對對碰」是 `mission.name`，不是圖片。橫幅元件：`web/src/components/common/HeaderBanner.jsx`。類型對應表：`web/src/helper/GlobalValueHelper.jsx`。

頁面背景：`web/public/assets/images/mission-bg.svg`（`missions/[slug]/layout.jsx`）。

### 任務橫幅裝飾系列（相關）

每個任務類型一組左右圖示：

| 類型 | 左 | 右 | 顏色 |
| --- | --- | --- | --- |
| reflection | `mission-banner/1.svg` | `mission-banner/2.svg` | `#DBAD58` |
| quiz | `mission-banner/4.svg` | `mission-banner/3.svg` | `#DBAD58` |
| photo | `mission-banner/5.svg` | `mission-banner/6.svg` | `#C88FBB` |
| video | `mission-banner/7.svg` | `mission-banner/8.svg` | `#A8D3C0` |
| painting | `mission-banner/9.svg` | `mission-banner/10.svg` | `#F6ADCD` |
| matching | `mission-banner/11.svg` | `mission-banner/12.svg` | `#96BED8` |
| ar | `mission-banner/13.svg` | `mission-banner/14.svg` | `#D6C682` |
| walking | `mission-banner/15.svg` | `mission-banner/16.svg` | `#93CE6D` |
| letter | `mission-banner/17.svg` | `mission-banner/18.svg` | `#C88FBB` |
| tamjai / samgor | `mission-banner/19.svg` | `mission-banner/20.svg` | `#BD634D` |

完整路徑前綴：`web/public/assets/icons/mission-banner/`。

---

## 4. 對對碰遊戲

| 紅框位置 | 說明 | 檔案 | 使用處 |
| --- | --- | --- | --- |
| 牌背（未翻開） | 印有「感．生活」的卡背 | `web/public/assets/images/matching/cover.svg` | `web/src/components/mission/MissionMatchingGame.jsx` |

翻開後的牌面來自任務參數 `mission.parameter.cards[].image`，種子資料在 `tools/source/cards.json`。

### 牌面系列（相關）

| 檔案 | 內容 |
| --- | --- |
| `web/public/assets/images/matching/cover.svg` | 卡背 |
| `web/public/assets/images/matching/330.svg` | 330 相關圖 |
| `web/public/assets/images/matching/day1.svg` | Day 1 |
| `web/public/assets/images/matching/day2.svg` | Day 2 |
| `web/public/assets/images/matching/day3.svg` | Day 3 |
| `web/public/assets/images/matching/day4.svg` | Day 4 |
| `web/public/assets/images/matching/day5.svg` | Day 5 |
| `web/public/assets/images/matching/eslite.svg` | 誠品 |
| `web/public/assets/images/matching/thealchemistcafe.svg` | The Alchemist Cafe |

遊戲頁背景：`web/public/assets/images/mission-bg/matching.png`。

---

## 5. 任務完成結果

| 紅框位置 | 說明 | 檔案 | 使用處 |
| --- | --- | --- | --- |
| 中央吉祥物 | 草帽農夫 DayDay、拿耙 | `web/public/assets/images/result-dayday.png` | `web/src/components/mission/MissionRecordDetail.jsx` |
| 氣球背景 | 粉／橙／藍氣球與彩帶 | `web/public/assets/images/mission-ecord-bg.png` | `web/src/app/[locale]/(with-app-bar)/mission-records/[slug]/page.jsx` |

「任務完成」是翻譯文字 `mission.record_detail.title`，不是圖片。

拍照 / 畫作任務完成後會改顯示用戶上傳圖（`missionRecord.result.url`），不是 `result-dayday.png`。

### 同頁相關

| 說明 | 檔案 |
| --- | --- |
| 任務紀錄列表背景（檔名無 typo） | `web/public/assets/images/mission-record-bg.png` |

---

## 6. 任務獎賞

| 紅框位置 | 說明 | 檔案 | 使用處 |
| --- | --- | --- | --- |
| 標題旁獎盃 | 金色獎盃 | `web/public/assets/icons/trophy.svg` | `web/src/app/[locale]/(with-app-bar)/rewards/page.jsx` HeaderBanner `rightIcon` |
| 標題左側吉祥物 | 醫生角色（doctor） | `web/public/assets/icons/doctor.png` | 同上 HeaderBanner `leftIcon` |
| Day 1 / Day 2 / Day 3 三人組 | 畫在進度圖裡，不是獨立檔 | `web/public/assets/images/task-progress.png` | `rewards/page.jsx` |
| 路徑上的店舖圖示 | 同上，合成在進度圖裡 | `web/public/assets/images/task-progress.png` | 同上 |
| 路徑上的小吉祥物 | 同上，合成在進度圖裡 | `web/public/assets/images/task-progress.png` | 同上 |

`task-progress.png` 是整張垂直路線圖：白路徑、店舖（誠品等）、列車、拉麵、咖啡，以及多種 DayDay 造型。印章位置由 `web/src/components/reward/StampCard.jsx` 疊在這張圖上。

### 同主題相關

| 說明 | 檔案 | 使用處 |
| --- | --- | --- |
| 較大的獎盃插畫 | `web/public/assets/images/trophy.svg` | 未在目前頁面引用 |
| 禮盒（印章空位） | `web/public/assets/icons/gift-box.svg` | `web/src/components/reward/StampIcon.jsx` |
| 空白印章遮罩 | `web/public/assets/icons/plain-sticker.svg` | `web/src/components/reward/RegularStamp.jsx` |

---

## DayDay 吉祥物相關檔案總表

附件多處紅框都是同一隻白色圓身、戴草帽的角色。現有檔案：

| 檔案 | 造型 / 用途 | 程式碼有引用 |
| --- | --- | --- |
| `icons/finder.png` | 尋找姿勢（附近任務按鈕） | Yes |
| `icons/doctor.png` | 醫生造型（獎賞標題） | Yes |
| `icons/girl.png` | 完成／打卡橫幅左側（取代 success-1 / success-2） | Yes（任務紀錄、身心調查） |
| `icons/green-card.png` | 綠色卡牌角色 | No |
| `icons/yellow-card.png` | 黃色卡牌角色 | No |
| `images/result-dayday.png` | 草帽農夫、拿耙（任務完成） | Yes |
| `icons/avatar/1.png` ~ `13.png` | 頭像選項 | Yes |
| `images/register-success-zh-HK.svg` | 註冊成功插畫（中文） | Yes |
| `images/register-success-en.svg` | 註冊成功插畫（英文） | Yes |
| `images/mission-cover/dayday.svg` | 任務封面用 DayDay | CMS cover |
| `images/matching/day1.svg` ~ `day5.svg` | 對對碰牌面 | CMS cards |
| `images/walk-dayday.svg` | 走路姿勢 DayDay | No |
| `icons/finding-dayday.svg` | 舊尋找圖 | No（已改為 `finder.png`） |
| `icons/dr-dayday.png` | 舊醫生圖 | No（已改為 `doctor.png`） |
| `icons/success-1.svg` / `success-2.svg` | 舊完成圖示 | No（已改為 `girl.png`） |
| `icons/green-dayday.svg` | 舊綠色版 | No（已改為 `green-card.png`） |
| `icons/orange-dayday.svg` | 舊橙色版 | No（已改為 `yellow-card.png`） |

`green-card.png` / `yellow-card.png` / `walk-dayday.svg` 目前沒有程式碼引用。

---

## Logo 相關

| 檔案 | 說明 | 程式碼有引用 |
| --- | --- | --- |
| `web/public/assets/icons/title-logo.png` | 主 Logo「DNA 校園定向」 | Yes（AppBar、登入、註冊、選單） |
| `web/public/assets/icons/logo.svg` | 舊主 Logo「感．生活」 | No（已改為 `title-logo.png`） |
| `web/public/assets/icons/logo.jpg` | Logo 點陣版 | No（web 未用；CMS 用） |
| `web/public/assets/icons/logo-long.jpg` | 長版 Logo | No（web 未用；CMS 用） |
| `web/public/assets/images/nlpra-logo.svg` | NLPRA 機構 Logo | Yes（登入頁） |

---

## 目錄一覽

```
web/public/assets/
  icons/
    title-logo.png
    logo.svg
    nav.svg
    trophy.svg
    finder.png
    doctor.png
    girl.png
    green-card.png
    yellow-card.png
    avatar/1.png ... 13.png
    mission-banner/1.svg ... 20.svg
    ...
  images/
    map.svg
    task-progress.png
    result-dayday.png
    mission-ecord-bg.png
    matching/cover.svg
    matching/day1.svg ... day5.svg
    mission-cover/*.svg
    mission-bg/*.png
    ...
```
