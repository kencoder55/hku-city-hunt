# Matching Game Mission 配對遊戲任務

## Overview 概述

A 4x4 matching card game where players need to find pairs of matching cards. The game tracks the number of moves and time taken to complete.

一個 4x4 的配對卡牌遊戲，玩家需要找出成對的卡牌。遊戲會記錄完成所需的步數和時間。

## Mission Type 任務類型

**Type:** `matching`

## Parameter Configuration 參數配置

The mission `parameter` field should be a JSON object with the following structure:

任務的 `parameter` 欄位應該是一個包含以下結構的 JSON 物件：

```json
{
  "cards": [
    {
      "id": 1,
      "content": "🍎",
      "image": null
    },
    {
      "id": 2,
      "content": "🍊",
      "image": null
    },
    {
      "id": 3,
      "content": "🍋",
      "image": null
    },
    {
      "id": 4,
      "content": "🍌",
      "image": null
    },
    {
      "id": 5,
      "content": "🍉",
      "image": null
    },
    {
      "id": 6,
      "content": "🍇",
      "image": null
    },
    {
      "id": 7,
      "content": "🍓",
      "image": null
    },
    {
      "id": 8,
      "content": "🍒",
      "image": null
    }
  ]
}
```

### Card Object Structure 卡牌物件結構

Each card object in the `cards` array should have:

每個卡牌物件應該包含：

- **id** (number, required): Unique identifier for the card pair. Cards with the same `id` will be considered a match.
  - 唯一識別符。具有相同 `id` 的卡牌將被視為配對成功。

- **content** (string, required): The text content to display on the card (can be emoji, text, or numbers).
  - 卡牌上顯示的文字內容（可以是表情符號、文字或數字）。

- **image** (string, optional): URL to an image to display on the card. If provided, this will be shown instead of `content`.
  - 卡牌上顯示的圖片 URL。如果提供，將優先顯示圖片而非 `content`。

### Requirements 要求

- **Total Cards**: Must have exactly **8 unique cards** for a 4x4 grid (16 total including pairs).
  - **卡牌總數**：必須有正好 **8 張獨特的卡牌**，用於 4x4 網格（包括配對共 16 張）。

- Each card will be duplicated automatically to create pairs.
  - 每張卡牌會自動複製以創建配對。

- Cards will be shuffled randomly at the start of the game.
  - 遊戲開始時卡牌會隨機排列。

## Example Configuration with Images 圖片範例配置

```json
{
  "cards": [
    {
      "id": 1,
      "content": "Apple",
      "image": "/assets/images/fruits/apple.png"
    },
    {
      "id": 2,
      "content": "Orange",
      "image": "/assets/images/fruits/orange.png"
    },
    {
      "id": 3,
      "content": "Banana",
      "image": "/assets/images/fruits/banana.png"
    },
    {
      "id": 4,
      "content": "Grape",
      "image": "/assets/images/fruits/grape.png"
    },
    {
      "id": 5,
      "content": "Watermelon",
      "image": "/assets/images/fruits/watermelon.png"
    },
    {
      "id": 6,
      "content": "Strawberry",
      "image": "/assets/images/fruits/strawberry.png"
    },
    {
      "id": 7,
      "content": "Cherry",
      "image": "/assets/images/fruits/cherry.png"
    },
    {
      "id": 8,
      "content": "Pineapple",
      "image": "/assets/images/fruits/pineapple.png"
    }
  ]
}
```

## Game Features 遊戲特色

- **4x4 Grid**: 16 cards (8 unique pairs) arranged in a 4x4 grid.
  - **4x4 網格**：16 張卡牌（8 對獨特配對）排列成 4x4 網格。

- **Move Counter**: Tracks the number of moves (pairs of cards flipped).
  - **步數計數器**：記錄移動次數（翻開的卡牌對數）。

- **Match Indicator**: Shows how many pairs have been matched.
  - **配對指示器**：顯示已配對的數量。

- **Visual Feedback**: 
  - Unflipped cards show a "?" symbol
  - Flipped cards show their content/image
  - Matched cards turn green
  - **視覺反饋**：
    - 未翻開的卡牌顯示 "?" 符號
    - 已翻開的卡牌顯示內容/圖片
    - 配對成功的卡牌變綠色

- **Completion Message**: Displays congratulations message with total moves when all pairs are matched.
  - **完成訊息**：當所有配對都完成時顯示祝賀訊息和總步數。

## Mission Result 任務結果

When the mission is completed, the following data is saved:

任務完成時，會儲存以下數據：

```json
{
  "moves": 15,
  "timeTaken": 45,
  "completed": true
}
```

- **moves**: Number of moves taken to complete the game
  - **moves**：完成遊戲所需的步數

- **timeTaken**: Time taken to complete the game in seconds
  - **timeTaken**：完成遊戲所需的時間（秒）

- **completed**: Boolean indicating game completion
  - **completed**：布林值，表示遊戲是否完成

## Translation Keys 翻譯鍵值

Required translation keys in `messages/en.json` and `messages/zh-HK.json`:

```json
{
  "mission": {
    "matching_game": {
      "moves": "Moves",
      "matched": "Matched",
      "completed": "Congratulations! You've completed the game!",
      "completed_in": "Completed in {{moves}} moves"
    },
    "complete": "Complete Mission"
  }
}
```

Chinese (繁體中文):

```json
{
  "mission": {
    "matching_game": {
      "moves": "步數",
      "matched": "已配對",
      "completed": "恭喜！你已完成遊戲！",
      "completed_in": "用了 {{moves}} 步完成"
    },
    "complete": "完成任務"
  }
}
```
