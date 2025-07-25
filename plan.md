## 名詞解釋
CRDT：
Conflict-free Replicated Data Type，無衝突複製資料型別
是一種特別設計的資料結構，讓多個節點離線/同時編輯同一份資料時，不需要中心鎖或序列化排隊，也能自動合併、最後收斂到同一結果。它保證所謂的 Strong Eventual Consistency（強最終一致性）。
MVP：
Minimum Viable Product =「最小可用產品」：能讓你們真正開始用、驗證方向、累積回饋的最小那一組功能。
不是 demo，也不是最終產品；是「夠用就好」，剩下的先不做。
## A. 產品定位 & 使用情境

**A1 產品目標:** 
打造一個有markdown筆記功能和有日曆和日程表的 all in one軟體，功能包含：
1. markdown筆記功能
2. 類似notion的資料庫功能(可以)
3. 有自己的日曆和任務系統可以挺醒使用者
4. 有分類的日程表(也就是一組任務可以開放或取消可以讓使用者更好的編輯提醒與日程)
5. 有共同編輯功能(即時同步)

**A2 使用者/角色**
學生與工作者

**A3 為什麼要做?**
notion痛點：
- 處理日常任務或行程表時就不是這麼直觀，他比較像你要自動進notion看而不是提醒你要看
- 不是真實markdown尤其對數學部分的copy很不好和h標籤太少只到h3其他我覺得沒什麼問題

ticktick痛點：
- 然分組了卻不能開關整組任務我覺得不好，notion在記事上
共通痛點：
我不想花太多錢在一堆應用上
所以我想要做一個擁有這兩個軟體的日程規畫+筆記軟體讓我不用再用一堆應用完成日程規劃

**A4 平台優先順序**
1. Web（React）
2. 桌面（Tauri 包 web）
3. 行動端（Flutter + WebView 編輯器）

**A5 功能地圖**
| 模組                      | 必備功能（MVP）                                                                          | 之後可加（Nice-to-have）                                        | 備註／待決議                                 |
| ------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------- | -------------------------------------------- |
| **Markdown 筆記**         | 純 Markdown 編輯、H1\~H6、清單、程式碼區塊、數學公式（LaTeX/KaTeX）、附件（圖片/檔案）   | 區塊折疊、引用、內嵌連結預覽、標籤/提及                         | Web 用 React 編輯器；App 用 WebView 載同一套 |
| **資料庫（Notion-like）** | 表格視圖、欄位型態（文字/日期/選單/標籤/關聯到筆記）、排序/篩選                          | 看板視圖、日曆視圖、關聯多表、簡易公式欄位                      | 規模小先做表格即可                           |
| **日曆 / 任務系統**       | 月/週視圖、建立任務、提醒（行動端本地通知）、任務分類開關（關閉＝不提醒 + 可選是否隱藏） | RRULE 重複規則、桌面通知、Email 通知、Google Calendar 匯入/匯出 | 分類開關行為需定義清楚                       |
| **分類日程表**            | 任務可屬於多個分類、分類可一鍵開/關提醒                                                  | 分類可套用顏色/樣板                                             | 需定義 UI/邏輯                               |
| **多人共編**              | 多人共用資料，避免覆蓋（最後寫入勝 or 簡易鎖定）                                         | 即時共同編輯（游標顯示、CRDT）、留言/@提及、版本歷史            | 先決定 MVP 要不要即時                        |
| **離線 & 同步**           | 離線可讀/可編輯；恢復網路自動同步；衝突策略先簡化                                        | 之後導入 CRDT 或更細粒度合併                                    | 行動端與 Web 都需本地快取                    |
| **搜尋 / 快速跳轉**       | 依標題/內容搜尋、快速跳到筆記/任務                                                       | 進階搜尋（欄位條件）、全文索引                                  | MVP 先簡單                                   |
| **匯入/匯出**             | Markdown/JSON 匯出；Markdown 匯入                                                        | Notion 匯入、ICS 匯出                                           | 先最小可用                                   |
| **登入/安全**             | Email/密碼或單一 OAuth（Google）                                                         | Apple Login、端到端加密                                         | 看需求複雜度                                 |
| **備份**                  | 手動匯出檔案                                                                             | 自動每日備份到雲端儲存（S3/Drive）                              | 內部用即可                                   |

已記錄你的決策，B／C 段定稿如下。

## B. 編輯器

**B1 Block 類型（MVP）**

* 文字／標題（H1\~H6）
* 清單（無序、有序、待辦）
* 表格（純文字表格，進階功能之後再說）
* 程式碼區塊（語法高亮）
* 數學公式（LaTeX/KaTeX）
* 引用（blockquote）
* 任意 Page／Block 錨點連結
* 每頁可設定 emoji/icon

**B2 互動功能**

* Markdown 快捷鍵
* Slash Menu（`/` 呼叫）
* 拖拉排序／縮排、多層巢狀
* 多選批次操作
* **註解（inline 範圍）**，註解內可 @ 使用者

**B3 匯入／匯出**

* Markdown 匯入／匯出

**B4 WebView 策略（行動端）**

* 進入編輯頁時才載入 WebView
* 不做純文字備援模式

**B5 共編技術**

* Web 編輯器用 CRDT（如 Yjs）
* App WebView 直接加入同一同步房

---

## C. 日曆／任務（Final）

**C1 實體**

* Task（任務）與 Event（事件）分開
* Event 支援開始／結束時段

**C2 視圖**

* 日、週、月、清單

**C3 重複規則（RRULE）**

* MVP 就要
* 先支援：Daily／Weekly(選星期幾)／Monthly(按日期)／Yearly
* 每個 Event 有 start/end，再套用 RRULE 產生實例

**C4 提醒**

* 本地通知（離線可用）
* 推播（伺服器→FCM/APNs）

**C5 分類開關**

* 關閉＝不顯示 & 不提醒（無總覽灰階）

**C6 任務 ↔ 筆記**

* 任務可連到 Page/Block
* 筆記選文字可直接建立任務（帶回連結）

**C7 任務狀態**

* 未開始／進行中／完成
* 完成後是否顯示由使用者設定（隱藏或保留顯示完成狀態）

**C8 時區**

* 使用者可自行設定（預設 Asia/Taipei）

## D. 開發分配
## 0. 結構總覽

* **Phase Lx（Learning）**：專注技術補強與小型 PoC，各階段彼此獨立，可並行或跳著做。
* **Milestone Mx（Build）**：產品功能開發里程碑，每個里程碑都有明確 DoR/DoD。
* **Phase X（Cross-Platform）**：Web 完成後，再啟動桌面/行動端。

---

## 1. Monorepo 基礎（共用架構）

**建議結構（Turborepo / pnpm）：**

```
root/
  apps/
    web/            # Next.js 或 Vite + React
    server/         # Express/Fastify + Prisma 或 Supabase Edge Functions
  packages/
    editor/         # Tiptap/自訂 block 邏輯
    schema/         # Prisma schema / zod schema / OpenAPI 定義
    ui/             # 共用 UI 元件（React）
    config/         # eslint/prettier/tsconfig（若未用 TS，則放共用設定）
```

> 先全 JS，未來再視情況導入 TS（packages/schema 可先用 zod 定義型別）。

**最低限度 CI/CD：**

* GitHub Actions：`install → lint → build → (optional test)`
* 只要能阻擋壞掉的 build 即可。

---

## 2. Learning Phases（基礎學習路徑）

> 先完成後端基礎，再進階前端與型別；CI/CD、Monorepo 策略同步學。

### Phase B｜Backend 基礎（DB + Auth + CRUD）

* **B0 Monorepo & CI 起手式**：

  * Turborepo + pnpm workspace 初始化（apps/server + apps/web + packages/config）
  * GitHub Actions：install → lint → build（先無測試）
  * ✅ 驗收：Push 後 CI 綠燈，apps/server 本地跑 `/health`、apps/web Hello World

* **B1 PostgreSQL + Prisma + CRUD**：

  * Docker Compose 跑 Postgres
  * Prisma schema：`users`、`lists`、`items`（Mini Planner）
  * Fastify/Express 最小 CRUD API（/lists, /items）
  * ✅ 驗收：Postman 對 /lists CRUD 成功，DB 中能見資料

* **B2 Auth（Email/密碼 + JWT）**：

  * bcrypt 雜湊、簽發 Access/Refresh Token
  * Middleware 驗證、權限檢查
  * ✅ 驗收：未帶 token 被擋、帶 token 可操作自己的資源

* **B3 測試基礎**：

  * Vitest/Jest：測 utility（hashing、token）
  * Supertest：測 1\~2 支核心 API（/auth/login, /lists）
  * ✅ 驗收：`pnpm test` 綠燈，CI 跑測試

### Phase F｜Frontend 強化（TypeScript + React）

* **F0 React + TypeScript 起手**：

  * Vite + React + TS 範本
  * 型別：用 zod 或手寫定義 API response
  * ✅ 驗收：能呼叫後端 /auth/login，取得並存 token

* **F1 Routing & 狀態管理**：

  * React Router 設定頁面路由（登入頁 / List 列表）
  * 全域狀態：Zustand 或 Context 存 user/token
  * ✅ 驗收：登入後導向 List 頁，重新整理仍保留登入狀態

* **F2 CRUD UI**：

  * List & Item CRUD 表單／列表 UI
  * 表單驗證：react-hook-form + zod
  * ✅ 驗收：能完整操作 lists/items，並顯示錯誤提示

* **F3 前端測試**：

  * Vitest + React Testing Library 測 1\~2 個元件
  * ✅ 驗收：CI 跑前端測試，綠燈才可合併

### Phase I｜基礎設施 & 部署

* **I0 ESLint/Prettier & Commit Hooks**：

  * husky + lint-staged 設定
  * ✅ 驗收：pre-commit 自動 lint、format

* **I1 環境變數管理**：

  * dotenv、GitHub Secrets 管理
  * ✅ 驗收：Local / CI 皆能讀到必要 env

* **I2 部署 PoC**：

  * Server：部署到 Railway/Fly.io
  * Web：部署到 Vercel
  * ✅ 驗收：成功連線後端、前端能正常呼叫 API

## 2.5. Learning Phases（Mini Planner 串接 Backend & Frontend）
### 2.1 Mini Planner 功能範圍
- **Auth**：Email + 密碼（JWT）
- **List**：分類（如 School / Work）
- **Item**：屬於某個 List，含 `title`, `description`, `status('todo'|'doing'|'done')`, `due_at?`
- **權限**：只能操作自己的資料
- （Optional）搜尋 / 篩選、到期日查詢

### 2.2 資料表（Mini 版）
```sql
users (
  id uuid primary key,
  email text unique,
  password_hash text,
  created_at timestamptz default now()
);

lists (
  id uuid primary key,
  owner_id uuid references users(id),
  name text,
  created_at timestamptz default now()
);

items (
  id uuid primary key,
  list_id uuid references lists(id),
  title text,
  description text,
  status text check (status in ('todo','doing','done')),
  due_at timestamptz null,
  created_at timestamptz default now()
);
```

### 2.3 連動式 Steps（B + F 並行）

| 步驟 | Phase             | Backend 目標                     | Frontend 目標                              | CI / 其他               | DoD                            |
| ---- | ----------------- | -------------------------------- | ------------------------------------------ | ----------------------- | ------------------------------ |
| 0    | **B0 + F0**       | Monorepo + CI；server `/health`  | React+TS Hello World                       | GH Actions lint/build   | CI 綠燈，兩邊可跑              |
| 1    | **B1a**           | Postgres + Prisma schema/migrate | —                                          | Docker Compose / `.env` | script/API 可 CRUD 基本資料    |
| 2    | **B1b + F1a**     | `/lists` CRUD（未驗權）          | 呼叫 `/health` & `/lists` 顯示列表         | Supertest `/health`     | 前端能顯示 lists（暫無 token） |
| 3    | **B2 + F1b**      | Auth + JWT 中介層                | 登入頁，拿 token 後顯示我的 lists          | 後端測試進 CI           | 未帶 token 擋下，帶 token 正常 |
| 4    | **B3 + F2**       | `/items` CRUD + zod 驗參         | List/Item CRUD UI（react-hook-form + zod） | 前端單元測試            | CRUD 全打通，錯誤提示正常      |
| 5    | **B4 + F3（選）** | 搜尋/篩選/到期日 query           | 篩選 UI、狀態切換                          | Playwright E2E          | E2E 流程跑通                   |
| 6    | **I2**            | 部署 server / web                | 部署 web                                   | GitHub Secrets          | 線上可用                       |

### 2.4 Checklist

* [ ] Step 0：Monorepo／CI
* [ ] Step 1：DB／Prisma
* [ ] Step 2：`/lists` CRUD + 前端呼叫
* [ ] Step 3：Auth + 前端登入
* [ ] Step 4：`/items` CRUD + 前端 UI + 驗證 + 測試
* [ ] Step 5（選）：搜尋/篩選 + E2E
* [ ] Step 6：部署

## 3. Milestones（Build Web MVP） Milestones（Build Web MVP）（Build Web MVP）

> 每個 Milestone 沒有固定時間，但必須滿足 DoR/DoD 才算完成。

### **M0｜基礎架構 Ready**

* **DoR（Ready）**：L0\~L2 完成
* **任務**：

  * Monorepo 清理、eslint/prettier、commit hooks（husky）
  * 資料庫連線管理、環境變數策略（dotenv）
  * API 骨架 & 目錄結構（路由/控制器/服務）
* **DoD（Done）**：

  * 可以註冊/登入、CI 綠燈、DB 連線正常

### **M1｜核心資料模型 & API**

* **DoR**：M0 完成、ERD 草稿已確認
* **任務**：

  * 實作 CRUD：Page / Block / Task / Event / Category
  * 權限控制（只能操作自己的資料）
  * 前端登入後看得到「我的 Page 列表」→ 可以建立/刪除頁面
* **DoD**：

  * Postman/Swagger 可測試所有 CRUD
  * 前端基本串接完成

### **M2｜Web 編輯器 MVP**

* **DoR**：M1 完成，API 穩定
* **任務**：

  * Tiptap Block：Text/Heading/List/Code/Math/Table
  * Slash menu、Markdown 快捷鍵
  * JSON ↔ API 存取、Markdown 匯出（基本）
  * （Optional）Yjs 單文件同步 Demo（先不導入正式）
* **DoD**：

  * 手動測試：新增/刪除/排序 Block 正常
  * 重新整理後資料正確顯示

### **M3｜任務/日曆 + RRULE + 分類開關**

* **DoR**：M2 完成，Task/Event schema OK
* **任務**：

  * 日/週/月/清單視圖（Web）
  * 任務/事件表單（分類、提醒、RRULE）
  * 分類開關：關閉 = 不顯示 + 不提醒
  * 任務 ↔ 筆記連結（選文字建任務）
* **DoD**：

  * 建立一個每週任務 → 日曆顯示正確
  * 關閉分類後任務被隱藏且不提醒

### **M4｜通知 & 註解 / @mention（可選）**

* **DoR**：M3 完成，提醒需求確認
* **任務**：

  * Web Push（Service Worker）或 Email 通知（簡化版）
  * Inline 註解 + @mention 儲存＋顯示
  * （若要共編）正式導入 Yjs/Hocuspocus + Awareness
* **DoD**：

  * 任務到期可收到至少一種提醒
  * 註解功能可用（建立/顯示/刪除）

### **M5｜整合、Polish、部署**

* **DoR**：M0\~M4 功能皆完成
* **任務**：

  * E2E 測試（Playwright）：登入→編輯→建任務→提醒
  * 匯入/匯出完善（Markdown/JSON）
  * 使用者設定（時區、完成任務顯示方式、分類管理）
  * 部署（Web：Vercel；Server：Railway/Fly.io；DB：Supabase/Postgres）
* **DoD**：

  * 一鍵部署流程可跑
  * 核心流程 E2E 測試通過
  * 高優先 bug 清單為 0

---

## 4. Phase X（Cross-Platform 之後再啟動）

* **X1｜Tauri 桌面版**：直接包 Web；再加檔案系統存取、快捷鍵整合
* **X2｜Flutter 行動端**：

  * WebView + JS Bridge
  * 本地 DB（Isar）+ 離線同步策略
  * 本地通知 / 推播整合
* **X3｜同步優化 & CRDT 完整導入**：

  * GC/快照策略、離線編輯衝突處理

---

## 5. 決策點（先訂 or 開發中滾動調整）

| 項目          | 選擇                                         | 備註                                               |
| ------------- | -------------------------------------------- | -------------------------------------------------- |
| Monorepo 工具 | Turborepo + pnpm                             | 已定，一開始就分 apps/ & packages/                 |
| DB            | PostgreSQL（Docker 本地 / 雲端）             | Prisma 管 migration，jsonb 存 Block 內容           |
| ORM / Schema  | Prisma + zod                                 | Prisma 做 DB schema，zod 驗 request/response       |
| Backend 框架  | Fastify（或 Express）                        | Fastify 輕量、好測試；Express 也可，但請固定一種   |
| Auth          | JWT（Access + Refresh）+ bcrypt              | 後端簽發 token，保留未來換成 session/cookie 的彈性 |
| Editor        | Tiptap + KaTeX                               | 先做常用 Block；之後擴充                           |
| RRULE         | rrule.js                                     | 不重造 iCal 輪子                                   |
| 通知          | 先 Web Push / Email，之後 FCM/APNs           | 需要後端守護程式送通知                             |
| 測試          | Vitest + Supertest（API）/ Playwright（E2E） | 先 API/utility，再補 E2E                           |

---

## 6. 工具箱（起手式連結 – 之後可再補）（起手式連結 – 之後可再補）

* Turborepo 官方文件
* Prisma Quickstart / Supabase Docs
* Tiptap 官方 React Starter + KaTeX extension
* rrule.js README & examples
* GitHub Actions（Node.js CI）樣板
* Vitest / Playwright 官方入門

（要我之後把連結貼齊再告訴我）

---

## 7. 下一步建議

1. **確認決策表**（DB/Auth/Backend/Monorepo 工具）。
2. 開始 **L0 → L1 → L2**，每完成一個就打勾並簡短記錄遇到的坑。
3. L3（編輯器）前，先畫出 Page/Block 的資料格式（JSON Schema）。
4. L4（RRULE）後就能開始 M0/M1。

---

## 8. 回給我這些，我再微調

* 有沒有要先砍掉或延後的功能（例如：註解、共編、推播）？
* 決策表中你想採用的選項（或你已有偏好）
* 需要我補充的教材/範例主題（例如：如何把 Tiptap JSON 存進 Prisma）
* 你想用的工作流（例如：GitHub Projects 看板、Issue 模板）

> 之後我們可以把每個 L/M 拆成 Issue checklist，我也可以幫你寫 Issue Template。
