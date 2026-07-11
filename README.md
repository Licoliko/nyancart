# NYAN CART

Repository: https://github.com/Licoliko/nyancart

Jump ramps now use a GPT Image 2.0 7-angle atlas (`assets/trackside/jump-ramps-angled-gpt2-v2.png`): left, left 45, left 15, front, right 15, right 45, and right. The race renderer picks the ramp angle from the projected course curve, and jumps/elevation have been strengthened for clearer pseudo-3D airtime.

The roster now contains 24 cat-ear racer sets. The first 18 are available by default, and the 6 newly added GPT Image 2.0 racer sets are locked behind coin unlock costs. Jump-ramp angle selection has also been mirrored to better match the perceived course direction.

Jump ramps now use a fixed-cell v2 atlas (`assets/trackside/jump-ramps-angled-gpt2-v2.png`, 7 x 5, 320 x 240 per cell) so animated/angled frames keep a consistent frame size without neighboring-cell bleed. Course-side scenery also has GPT Image 2.0 course-specific atlases rendered as far/mid/near scenery layers.

The stage roster has been expanded from 5 to 11 circuits. The six added concept-art circuits are now selectable and have matching pseudo-3D route data, course themes, elevation profiles, tunnels, and GPT Image 2.0 far/mid/near scenery atlases.

Settings now include a rich scenery toggle. When enabled, course-side scenery draws more densely with distance fog: far props are softened and faded, while near props remain crisp. Turning it off reduces scenery density for lighter rendering.

Course start/finish rendering was stabilized on circuits where the start line sat on a sharp route seam. Gear Clock, Emerald Ruins, and Twinkle Sweets now use smoother internal start-line placement. Course scenery props now favor opaque rendering with a separate fog layer instead of semi-transparent prop bodies, and newly added circuits no longer reuse unrelated legacy prop sets.

きらめきスイーツサーキットを舞台にした、3周制のブラウザ・カートレースゲームです。GPT Image 2.0で制作した18人分の14方向スプライト、スイーツコース背景、アイテム、VFXを使用しています。

レース画面は2.5D疑似3D方式です。速度に応じて画角、地平線、路面幅、反射線、頭上ゲート、速度線、カメラロール、車体の上下動が変化します。スピードメーターと全体マップ上の各レーサー位置もリアルタイムに更新されます。

現在のレース描画は、地平線へ収束する路面と奥行きスケールを使ったMode 7風の疑似3D方式です。全体マップと同じコース形状からカーブ方向を算出し、AI・アイテム・沿道設備も同じ遠近法で表示します。AIはプレイヤーの前後約40m以内からスタートし、加速・ラバーバンド・レーン変更によって集団戦を維持します。左上には現在順位、上位・近接レーサー、プレイヤーとの距離差を表示し、コース上の相手には順位と名前が表示されます。

トンネルは入口・出口のアーチを遮蔽窓として扱い、壁の向こう側にあるカート・コイン・アイテムが壁面を透過しない描画順です。コース外にはテーマ別の路肩模様、小型設備、観客、大型コースオブジェクトを奥行き順に配置しています。

コース外の森とお菓子の家はGPT Image 2.0で制作した3×2アトラスを使用し、約118m間隔の遠景LODとして必要な枚数だけ描画します。5コース専用ジャンプ台と、排気煙・ターボ煙・ドリフト煙・オフロード土煙・着地煙もGPT Image 2.0製アトラスを使用します。ジャンプ台を踏むとカートが実際に浮上し、着地時にサスペンション、カメラ振動、土煙、短い着地ブーストが発生します。

メニューまたはレース画面の歯車ボタンから設定画面を開けます。マスター音量・BGM音量・ミュート・キー割り当てはブラウザに保存されます。

レーサーセットはドラッグ／スワイプに加えて、左右のカードを直接選ぶとそのカードまで自動スクロールします。18番の右は1番、1番の左は18番につながる循環カルーセルです。現在の18セットは初期開放済みで、今後19人目以降に追加するセットはレースで獲得したコインを使って開放します。所持コインと開放状態はブラウザに保存されます。

レース中の小さな `DBG` ボタンでは、走行確認用のコース境界線を表示・非表示にできます。通常プレイでは境界線は非表示です。

## 遊び方

`index.html` をブラウザで開くか、このフォルダーでローカルWebサーバーを起動してください。

- ハンドル: `←` `→`
- アクセル: `↑`（離すと減速し、停止します）
- ブレーキ: `↓`
- ドリフト／ミニターボ: `Shift` + ハンドル
- アイテム: `Space`
- スタートダッシュ: カウント「2」からアクセルを押し続ける
- ポーズ: `Esc`

すべてのキーボード操作は設定画面で変更できます。スマートフォンでは画面下のタッチボタンで操作できます。

## コントローラー

標準Gamepad API対応コントローラーを接続すると自動認識します。

- 左スティック／十字キー: ハンドル
- RT／A: アクセル
- LT／B: ブレーキ
- RB／LB: ドリフト
- X: アイテム
- START: ポーズ

描画方式の比較と採用理由は `RACE_RENDERING_DECISION.md` にまとめています。
