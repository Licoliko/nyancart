# NYAN CART

Repository: https://github.com/Licoliko/nyancart

Jump ramps now use a GPT Image 2.0 7-angle atlas (`assets/trackside/jump-ramps-angled-gpt2-v2.png`): left, left 45, left 15, front, right 15, right 45, and right. The race renderer picks the ramp angle from the projected course curve, and jumps/elevation have been strengthened for clearer pseudo-3D airtime.

The roster now contains 24 cat-ear racer sets. The first 18 are available by default, and the 6 newly added GPT Image 2.0 racer sets are locked behind coin unlock costs. Jump-ramp angle selection has also been mirrored to better match the perceived course direction.

Jump ramps now use a fixed-cell v2 atlas (`assets/trackside/jump-ramps-angled-gpt2-v2.png`, 7 x 5, 320 x 240 per cell) so animated/angled frames keep a consistent frame size without neighboring-cell bleed. Course-side scenery also has GPT Image 2.0 course-specific atlases rendered as far/mid/near scenery layers.

The stage roster has been expanded from 5 to 11 circuits. The six added concept-art circuits are now selectable and have matching pseudo-3D route data, course themes, elevation profiles, tunnels, and GPT Image 2.0 far/mid/near scenery atlases.

Settings now include a rich scenery toggle. When enabled, course-side scenery draws more densely with distance fog: far props are softened and faded, while near props remain crisp. Turning it off reduces scenery density for lighter rendering.

Settings also open the **24 MACHINE SOUND LAB**. Every racer/kart profile can be selected independently and compared at STOP/IDLE, LOW (65 km/h), HIGH (175 km/h), and FULL BOOST while keeping the same effects-volume mix. The screen supports mouse, touch, keyboard back, and controller navigation.

During a race, the nearest three regular rivals reuse those machine profiles as lightweight positional voices. Volume and high-frequency detail fall with distance, lane separation controls stereo pan, and a short selection hysteresis prevents engines from popping when two rivals exchange places.

Twinkle Sweets, Gear Clock, and Aurora Glacier now corner-cut their single-point hairpins into short Catmull-Rom arcs. Their maximum raw heading step is 8.29°, 7.99°, and 5.61° respectively, so all 11 release courses pass the curve-continuity product check.

Course start/finish rendering was stabilized on circuits where the start line sat on a sharp route seam. Gear Clock, Emerald Ruins, and Twinkle Sweets now use smoother internal start-line placement. Course scenery props now favor opaque rendering with a separate fog layer instead of semi-transparent prop bodies, and newly added circuits no longer reuse unrelated legacy prop sets.

11のサーキットを2周で競うブラウザ・カートレースゲームです。GPT Image 2.0で制作した24人分の14方向スプライト、コース背景、VFXを使用しています。

コース上の猫缶を取ると短い開封アニメーションが入り、順位に応じて重み付けされた4種のオリジナルギアから1つが自動で決まります。難しいモード選択はなく、決定後は1ボタンで使用できます。NPCも同じ猫缶抽選を使い、性格・順位・被弾・標的位置を見てギアを使います。コース上のコインは1枚につき所持コイン3枚、完走報酬は1位50枚（順位に応じて最低10枚）です。

ボスNPCのミア・シャルムは、プレイヤーの前方にいる時だけ、時々後ろを振り向く4コマの予備動作を見せます。その後に猫の骨か空の猫缶を後方へ投げ、骨は強めの減速、空き缶は軽い減速と横ぶれを与えます。ベルガード中は防御できます。予備動作は骨なら黄色のリング・骨アイコン・「BONE」と硬質な2段音、空き缶なら水色のリング・缶アイコン・「CAN」と金属が転がる音で判別できます。NORMALは投げる0.72秒前から振り向き、次の投擲まで8.5〜12秒あるため見てから回避できます。HARDは予備動作0.42秒・間隔3.2〜5.2秒となり、同一ルート上で連続回避と反撃の駆け引きが続きます。

レース画面は2.5D疑似3D方式です。速度に応じて画角、地平線、路面幅、反射線、頭上ゲート、速度線、カメラロール、車体の上下動が変化します。スピードメーターと全体マップ上の各レーサー位置もリアルタイムに更新されます。

現在のレース描画は、地平線へ収束する路面と奥行きスケールを使ったMode 7風の疑似3D方式です。全体マップと同じコース形状からカーブ方向を算出し、AI・アイテム・沿道設備も同じ遠近法で表示します。AIはプレイヤーの前後約40m以内からスタートし、加速・ラバーバンド・レーン変更によって集団戦を維持します。左上には現在順位、上位・近接レーサー、プレイヤーとの距離差を表示し、コース上の相手には順位と名前が表示されます。

トンネルは入口・出口のアーチを遮蔽窓として扱い、壁の向こう側にあるカート・コイン・アイテムが壁面を透過しない描画順です。コース外にはテーマ別の路肩模様、小型設備、観客、大型コースオブジェクトを奥行き順に配置しています。

コース外の森とお菓子の家はGPT Image 2.0で制作した3×2アトラスを使用し、約118m間隔の遠景LODとして必要な枚数だけ描画します。5コース専用ジャンプ台と、排気煙・ターボ煙・ドリフト煙・オフロード土煙・着地煙もGPT Image 2.0製アトラスを使用します。ジャンプ台を踏むとカートが実際に浮上し、着地時にサスペンション、カメラ振動、土煙、短い着地ブーストが発生します。

メニューまたはレース画面の歯車ボタンから設定画面を開けます。マスター音量・BGM音量・マシン／効果音音量・ミュート・キー割り当てはブラウザに保存されます。24台の専用カートは、プリズムタービン、蒸気ピストン、時計仕掛け、ドリル、蜂型ブースターなど、車体設定に合わせた固有のプロシージャルエンジン音を持ちます。

レース中は近いライバル最大3台の固有エンジン音が距離と左右位置に連動します。追い越し・追い越される瞬間には相対速度に応じた軽いドップラー効果がかかり、トンネル内部ではカート音だけに短いステレオ反響と高音の減衰が加わります。入口・出口は約22mのフェードで切り替わります。

レース順位リストは各レーサー行を再利用するFLIP方式で、順位変動時に旧位置から新位置へ滑らかに移動します。2周目突入時には視界を塞がないチェッカー付き `FINAL LAP` 演出が入り、初回レースだけはアクセル、コーナリング、ドリフト／猫缶を実際の入力で覚える3ステップの実践チュートリアルを表示します。メニュー、セット選択、コース選択、難易度、設定、レース、リザルト間は、前画面の退場からレーシングワイプ、次画面の登場までを共通トランジションでつないでいます。

配布版は115枚の実行時画像をWebPで読み込みます。キャラシート・選択立ち絵・透明UIはセル寸法と全画素を維持する可逆圧縮、コース背景と遠景は高品質圧縮です。元PNGは編集用として残し、配布画像容量は142.69MiBから63.31MiBへ55.63%削減しています。`tools/optimize_runtime_images.py`で同じ変換と検証を再実行できます。

描画品質AUTOは端末情報からHIGH・BALANCED・LIGHTを選んで開始し、レース中の実測FPSとフレーム時間を約2.6秒単位で監視します。負荷が続く場合は背景物量・エフェクト・道路セグメント・内部解像度を段階的に下げ、安定が続けば段階的に戻します。LIGHTでも内部解像度は74%を下回りません。手動のHIGH・BALANCED・LIGHTではレース中の自動変更を行いません。

レーサーセットはドラッグ／スワイプに加えて、左右のカードを直接選ぶとそのカードまで自動スクロールします。18番の右は1番、1番の左は18番につながる循環カルーセルです。現在の18セットは初期開放済みで、今後19人目以降に追加するセットはレースで獲得したコインを使って開放します。所持コインと開放状態はブラウザに保存されます。

レース中の小さな `DBG` ボタンでは、走行確認用のコース境界線を表示・非表示にできます。`品質チェック` または `F8` から、全11コース、24キャラの14方向シート、ジャンプ台方向、画面幅、専用音響、FPS・フレーム時間・粒子数・NPCコースアウト数をまとめて検査できます。通常プレイでは境界線と品質レポートは非表示です。

## 遊び方

`index.html` をブラウザで開くか、このフォルダーでローカルWebサーバーを起動してください。

- ハンドル: `←` `→`
- アクセル: `↑`（離すと減速し、停止します）
- ブレーキ: `↓`
- ドリフト／ミニターボ: `Shift` + ハンドル
- 猫缶ギア（開封後に使用）: `Space`
- スタートダッシュ: カウント「2」からアクセルを押し続ける
- ポーズ: `Esc`

すべてのキーボード操作は設定画面で変更できます。スマートフォンでは画面下のタッチボタンで操作できます。

## コントローラー

標準Gamepad API対応コントローラーを接続すると自動認識します。

- 左スティック／十字キー: ハンドル
- RT／A: アクセル
- LT／B: ブレーキ
- RB／LB: ドリフト
- X: 猫缶ギアを使用
- START: ポーズ

描画方式の比較と採用理由は `RACE_RENDERING_DECISION.md` にまとめています。

リザルト画面では、タイム・新記録・獲得コイン・報酬・次のキャラクター開放状況を順番に発表します。コースと難易度ごとのベストタイムは端末内に保存され、次回以降の記録判定に使われます。

レース開始前には、選択コース専用の背景・案内文・準備項目を備えたロード演出を表示します。読み込み済みの素材は再利用し、失敗時には同じ画面から再試行できます。

スマホや低メモリ端末では、開始直後に必要なレーサー素材だけを同時2件までで分割読み込みし、残りのレーサーは接近時に1台ずつ準備します。一時的に失敗した読み込み状態は再試行前に破棄され、任意の装飾素材だけが失敗した場合は軽量表示でレースを続行します。
