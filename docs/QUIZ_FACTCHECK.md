# クイズのファクトチェック記録

確認日：2026年10月。クイズの元データは `src/data/quiz.ts`（各問題の `factCheck` に同じ内容を持つ）。この文書は、そこから作った一覧です。

## 確認の方法

- ルール・用具の数値は、BWF Laws of Badminton（2025年4月26日 Version 5.0）の本文で確認した（条文番号を記録）。
- コートの寸法は、競技規則では図に書かれているため、Wikipedia と日本語の解説記事で確認した。
- 記録・日本の成績は、日本オリンピック委員会（JOC）、Wikipedia、報道、大会ページで、複数の資料が一致することを確認した。
- 時間がたつと変わる内容（点数方式、メダル数、記録）は、問題文か解説に、時期を入れている。

## 確認できなかったこと・採用しなかった題材

- **「黒いシャトルは存在する？」**：BWF承認シャトルの一覧、ヨネックス公式のナイロンシャトル一覧（メイビス各種）、検索結果のいずれでも、黒いシャトルの存在を確認できなかったため、**問題にしていない**。確認できる製品名が分かれば、追加できる。
- **2018年トマス杯の結果**：資料により、記述が食い違った（一方は日本優勝、別の検索結果では中国優勝・日本準優勝）ため、**問題にしていない**。2018年ユーバー杯（日本優勝）と、2014年トマス杯（日本初優勝）だけを採用した。
- **Sports Data Museum のメダル一覧**は、2024年分が反映されておらず、日本の総数が JOC・Wikipedia と食い違ったため、使っていない。
- 次のページは、取得できなかった（本文を直接確認していない）：Olympics.com のスマッシュ記録の記事、BWF公式サイトのニュース本文（403）、日本バドミントン協会のルールページ（503）。代わりに、同じ内容を報じた別の資料（All India Radio、Xinhua）で確認した。
- 世界選手権の選手名は、Wikipedia（英語）の表では国名のみだったため、選手名は検索結果（Wikipedia 日本語版、自治体・解説記事）で確認した。

## 問題ごとの記録

### q01（記録・スピード）バドミントンのスマッシュの世界記録は、陸上でいちばん速い動物のチーターより速い。

- 正解：○
- 出典：[Indian shuttler Satwiksairaj Rankireddy sets Guinness world record for fastest badminton shot（All India Radio）](https://newsonair.gov.in/indian-shuttler-satwiksairaj-rankireddy-sets-guinness-world-record-for-fastest-badminton-shot)、[時速100km超え?! 地球上で最も速い生物とは（中央動物専門学校）](https://www.chuo-a.ac.jp/anilab/learn/420/)
- 確認：565km/h・2023年4月14日・埼玉県草加市のヨネックス工場で計測は、All India Radio と Olympics.com の検索結果で確認（Olympics.com 本文は取得できず）。チーターは資料により時速100〜120km台と幅があるため「100〜120kmほど」と表記。

### q02（記録・スピード）ギネス世界記録に認定された、スマッシュのシャトルの最高速度は、時速およそ何km？

- 正解：約565km
- 出典：[Indian shuttler Satwiksairaj Rankireddy sets Guinness world record for fastest badminton shot（All India Radio）](https://newsonair.gov.in/indian-shuttler-satwiksairaj-rankireddy-sets-guinness-world-record-for-fastest-badminton-shot)
- 確認：565km/h（2023年）、前記録493km/h（2013年5月、タン・ブンヒョン）。All India Radio で確認。

### q03（記録・スピード）スマッシュの世界記録（時速565km）は、東海道新幹線の営業運転の最高速度の、約5倍にあたる。

- 正解：×
- 出典：[Indian shuttler Satwiksairaj Rankireddy sets Guinness world record for fastest badminton shot（All India Radio）](https://newsonair.gov.in/indian-shuttler-satwiksairaj-rankireddy-sets-guinness-world-record-for-fastest-badminton-shot)、[N700S 車両のご案内（JR東海）](https://railway.jr-central.co.jp/train/shinkansen/n700s/)
- 確認：N700S 東海道区間の最高速度285km/h をJR東海のページで確認。565÷285≒1.98。

### q04（記録・スピード）ギネス世界記録に認定された、女子のスマッシュの最高速度は、時速およそ何km？

- 正解：約438km
- 出典：[Indian shuttler Satwiksairaj Rankireddy sets Guinness world record for fastest badminton shot（All India Radio）](https://newsonair.gov.in/indian-shuttler-satwiksairaj-rankireddy-sets-guinness-world-record-for-fastest-badminton-shot)
- 確認：女子 438km/h（Tan Pearly）、2023年4月14日の測定。All India Radio で確認。

### q05（日本の活躍）バドミントンが、オリンピックの正式な競技になったのは、いつ？

- 正解：1992年（バルセロナ大会）
- 出典：[バドミントン｜競技｜日本オリンピック委員会（JOC）](https://www.joc.or.jp/sports/badminton/index.html)、[Badminton（Wikipedia）](https://en.wikipedia.org/wiki/Badminton)
- 確認：正式競技は1992年（JOCのページ、Wikipediaで一致）。公開競技は1972・1988年（Wikipedia）。

### q06（日本の活躍）オリンピックのバドミントンで、日本がこれまでにとったメダルは、全部で何個？（2024年パリ大会まで）

- 正解：6個
- 出典：[バドミントン｜競技｜日本オリンピック委員会（JOC）](https://www.joc.or.jp/sports/badminton/index.html)
- 確認：JOCの日本のメダル一覧（2012銀・2016金銅・2020銅・2024銅2）とWikipedia（ja）のメダリスト一覧で一致。Sports Data Museum のページは2024年分が反映されておらず不採用。

### q07（日本の活躍）オリンピックのバドミントンで、日本が初めてとったメダルは、2012年ロンドン大会の女子ダブルス。その色は？

- 正解：銀メダル
- 出典：[バドミントン｜競技｜日本オリンピック委員会（JOC）](https://www.joc.or.jp/sports/badminton/index.html)
- 確認：2012年ロンドン・女子ダブルス・銀（藤井瑞希・垣岩令佳）。JOCとWikipedia（ja）で一致。

### q08（日本の活躍）日本のバドミントンが、オリンピックで初めて金メダルをとったのは、2016年リオ大会。どの種目？

- 正解：女子ダブルス（髙橋礼華・松友美佐紀）
- 出典：[バドミントン｜競技｜日本オリンピック委員会（JOC）](https://www.joc.or.jp/sports/badminton/index.html)
- 確認：2016年リオ・女子ダブルス・金。JOCで確認。金メダルは1個のみ（2024年まで）。

### q09（日本の活躍）混合ダブルスの渡辺勇大選手と東野有紗選手のペアは、東京2020大会とパリ2024大会で、2大会続けて金メダルをとった。

- 正解：×
- 出典：[バドミントン｜競技｜日本オリンピック委員会（JOC）](https://www.joc.or.jp/sports/badminton/index.html)
- 確認：JOC・Wikipedia（ja）で、2020・2024ともに混合ダブルス銅（渡辺勇大・東野有紗）を確認。

### q10（日本の活躍）2024年パリ大会の女子ダブルスで、銅メダルをとった日本のペアは？

- 正解：志田千陽・松山奈未
- 出典：[バドミントン｜競技｜日本オリンピック委員会（JOC）](https://www.joc.or.jp/sports/badminton/index.html)
- 確認：2024パリ・女子ダブルス銅（志田千陽・松山奈未）。JOCとWikipedia（ja）で一致。

### q11（日本の活躍）奥原希望選手は、2016年リオ大会の女子シングルスで、金メダルをとった。

- 正解：×
- 出典：[バドミントン｜競技｜日本オリンピック委員会（JOC）](https://www.joc.or.jp/sports/badminton/index.html)
- 確認：2016年リオ・女子シングルス・銅（奥原希望）。JOCで確認。「日本の女子シングルス初」は、JOCの一覧に女子シングルスのメダルが他にないことから。

### q12（日本の活躍）桃田賢斗選手は、2018年と2019年の世界選手権の男子シングルスで、2年続けて優勝した。

- 正解：○
- 出典：[BWF World Championships（Wikipedia）](https://en.wikipedia.org/wiki/BWF_World_Championships)
- 確認：世界選手権の男子シングルスは2018・2019年とも日本人が優勝（Wikipedia）。選手名は、検索結果（桃田賢斗の公式・自治体・Wikipedia（ja）ページ）で一致。

### q13（日本の活躍）奥原希望選手は、2017年の世界選手権の女子シングルスで、日本の選手として初めて優勝した。

- 正解：○
- 出典：[奥原希望選手が世界選手権女子シングルスで激闘の末、優勝！](https://terasu.biprogy.com/article/badminton-no29/)、[BWF World Championships（Wikipedia）](https://en.wikipedia.org/wiki/BWF_World_Championships)
- 確認：2017年の女子シングルスは日本が優勝（Wikipedia）。「日本人初」は、検索結果（奥原希望のWikipedia（ja）・解説記事）で一致。

### q14（日本の活躍）山口茜選手は、2021年と2022年の世界選手権の女子シングルスで、2年続けて優勝した。

- 正解：○
- 出典：[BWF World Championships（Wikipedia）](https://en.wikipedia.org/wiki/BWF_World_Championships)
- 確認：2021・2022年の女子シングルスは日本が優勝（Wikipedia）。選手名は検索結果（解説記事・Wikipedia（ja））で一致。

### q15（日本の活躍）日本の男子チームは、2014年のトマス杯（男子の国別対抗戦）の決勝で、マレーシアに負けて、準優勝だった。

- 正解：×
- 出典：[日本男子がトマス杯初優勝、マレーシアに競り勝つ（AFP）](https://www.afpbb.com/articles/-/3015859)
- 確認：AFPの記事見出し・検索結果で、2014年、マレーシアに競り勝ち、日本男子が初優勝と確認。

### q16（日本の活躍）2018年のユーバー杯（女子の国別対抗戦）で、日本は優勝した。

- 正解：○
- 出典：[トマス杯＆ユーバー杯2018（バドスピ）](https://www.badspi.jp/thomasuber2018/)
- 確認：バドスピの大会ページと検索結果で、2018年ユーバー杯は日本が優勝・準優勝はタイと確認。同ページの要約はトマス杯も日本優勝と読める記述だったが、別の検索結果では2018年トマス杯は中国優勝・日本準優勝のため、トマス杯2018の問題は作らなかった。

### q17（日本の活躍）「トマス杯」は、どんな大会？

- 正解：男子の国別対抗の団体戦
- 出典：[トマス杯＆ユーバー杯2018（バドスピ）](https://www.badspi.jp/thomasuber2018/)
- 確認：トマス杯＝男子団体、ユーバー杯＝女子団体。バドスピの大会ページで確認。

### q18（日本の活躍）「ユーバー杯」は、どんな大会？

- 正解：女子の国別対抗の団体戦
- 出典：[トマス杯＆ユーバー杯2018（バドスピ）](https://www.badspi.jp/thomasuber2018/)
- 確認：同上。

### q19（歴史）世界のバドミントンをまとめる国際組織（今の世界バドミントン連盟）が、「国際バドミントン連盟」として作られたのは、いつ？

- 正解：1934年
- 出典：[Badminton（Wikipedia）](https://en.wikipedia.org/wiki/Badminton)
- 確認：1934年設立（Wikipedia）。複数の解説サイトの検索結果でも、1934年7月5日・ロンドン・9協会で一致。

### q20（歴史）「バドミントン」という名前は、イギリスの貴族の屋敷「バドミントン・ハウス」に由来するといわれている。

- 正解：○
- 出典：[Badminton（Wikipedia）](https://en.wikipedia.org/wiki/Badminton)
- 確認：Wikipediaに「名前はバドミントン・ハウスに由来。時期ははっきりしない」とあるため、「といわれている」と表記。

### q21（歴史）世界でいちばん古い、バドミントンの大きな大会「全英オープン」が始まったのは、いつ？

- 正解：1899年
- 出典：[Badminton（Wikipedia）](https://en.wikipedia.org/wiki/Badminton)
- 確認：1899年に開始（Wikipedia）。解説記事の検索結果でも一致。

### q22（歴史）今のような、ラリーに勝った側が必ず得点する「ラリーポイント制」が、国際大会で正式に採用されたのは、いつ？

- 正解：2006年
- 出典：[Badminton（Wikipedia）](https://en.wikipedia.org/wiki/Badminton)
- 確認：2006年にラリーポイント制へ（Wikipedia）。解説記事の検索結果でも2006年で一致。

### q23（歴史）バドミントンは、オリンピックの正式競技になる前に、「公開競技」として行われたことがある。

- 正解：○
- 出典：[Badminton（Wikipedia）](https://en.wikipedia.org/wiki/Badminton)、[バドミントン｜競技｜日本オリンピック委員会（JOC）](https://www.joc.or.jp/sports/badminton/index.html)
- 確認：公開競技は1972・1988年（Wikipedia）、正式競技は1992年（JOC）。

### q24（歴史）バドミントンの元になった遊びは、インドの町「プーナ」で、イギリスの軍人たちが楽しんでいたといわれている。

- 正解：○
- 出典：[Badminton（Wikipedia）](https://en.wikipedia.org/wiki/Badminton)
- 確認：Wikipediaに、Poona（インドの駐屯地の町）と、そこで最初のルールが作られた旨の記述。年代は資料で差があるため、問題文では年を書かなかった。

### q25（シャトル・ラケット）羽根のシャトルには、羽根が12枚ついている。

- 正解：×
- 出典：[BWF Laws of Badminton（2025年4月26日 Version 5.0）](https://extranet.bwf.sport/docs/document-system/81/1466/1470/Section%204.1%20-%20Laws%20of%20Badminton%20-%2026%20April%202025%20V5.0%20(2)%20.pdf)
- 確認：BWF Laws 2.2.1「16 feathers fixed in the base」で確認。

### q26（シャトル・ラケット）試合で使うシャトル1個の重さは、およそどれくらい？

- 正解：約5g
- 出典：[BWF Laws of Badminton（2025年4月26日 Version 5.0）](https://extranet.bwf.sport/docs/document-system/81/1466/1470/Section%204.1%20-%20Laws%20of%20Badminton%20-%2026%20April%202025%20V5.0%20(2)%20.pdf)
- 確認：BWF Laws 2.2.6「4.74 to 5.50 grams」で確認。10円玉の重さ4.5gは、造幣局の公表値として一般に知られる値。

### q27（シャトル・ラケット）天然の羽根のシャトルの台（先の丸い部分）は、コルクに、薄い革をかぶせて作られている。

- 正解：○
- 出典：[BWF Laws of Badminton（2025年4月26日 Version 5.0）](https://extranet.bwf.sport/docs/document-system/81/1466/1470/Section%204.1%20-%20Laws%20of%20Badminton%20-%2026%20April%202025%20V5.0%20(2)%20.pdf)
- 確認：BWF Laws 2.1 に「cork base covered by a thin layer of leather」と確認。

### q28（シャトル・ラケット）シャトルの羽根の長さは、決まっている。およそ何cm？

- 正解：6.2〜7cm
- 出典：[BWF Laws of Badminton（2025年4月26日 Version 5.0）](https://extranet.bwf.sport/docs/document-system/81/1466/1470/Section%204.1%20-%20Laws%20of%20Badminton%20-%2026%20April%202025%20V5.0%20(2)%20.pdf)
- 確認：BWF Laws 2.2.2「62 mm to 70 mm」で確認。

### q29（シャトル・ラケット）バドミントンのラケットには、長さの上限がある。全体の長さは、何cmまで？

- 正解：68cm
- 出典：[BWF Laws of Badminton（2025年4月26日 Version 5.0）](https://extranet.bwf.sport/docs/document-system/81/1466/1470/Section%204.1%20-%20Laws%20of%20Badminton%20-%2026%20April%202025%20V5.0%20(2)%20.pdf)
- 確認：BWF Laws 4「not exceeding 680 mm in overall length and 230 mm in overall width」で確認。

### q30（シャトル・ラケット）ラケットの、ガットを張る部分（ストリング面）にも、大きさの上限がある。

- 正解：○
- 出典：[BWF Laws of Badminton（2025年4月26日 Version 5.0）](https://extranet.bwf.sport/docs/document-system/81/1466/1470/Section%204.1%20-%20Laws%20of%20Badminton%20-%2026%20April%202025%20V5.0%20(2)%20.pdf)
- 確認：BWF Laws 4.2.2「shall not exceed 280 mm in overall length and 220 mm in overall width」で確認（ただし例外の定めあり）。

### q31（シャトル・ラケット）シャトルが正しい速さかどうかを調べるテストでは、下から思いきり打ったシャトルは、反対側のバックラインの、どのあたりに落ちる？

- 正解：バックラインの53〜99cm手前
- 出典：[BWF Laws of Badminton（2025年4月26日 Version 5.0）](https://extranet.bwf.sport/docs/document-system/81/1466/1470/Section%204.1%20-%20Laws%20of%20Badminton%20-%2026%20April%202025%20V5.0%20(2)%20.pdf)
- 確認：BWF Laws 3「not less than 530 mm and not more than 990 mm short of the other back boundary line」で確認。

### q32（コートとルール）バドミントンのコートの長さ（ネットに対して縦方向）は、何m？

- 正解：13.4m
- 出典：[Badminton（Wikipedia）](https://en.wikipedia.org/wiki/Badminton)
- 確認：BWF Laws の寸法は図のみのため、Wikipedia（13.4m・6.1m・5.18m）と日本語の解説記事の検索結果で確認。

### q33（コートとルール）シングルスのコートは、ダブルスのコートより、幅がせまい。

- 正解：○
- 出典：[Badminton（Wikipedia）](https://en.wikipedia.org/wiki/Badminton)
- 確認：Wikipedia（ダブルス6.1m、シングルス5.18m）。差は(6.1−5.18)÷2＝0.46m。

### q34（コートとルール）ネットの高さは、真ん中で、何m？

- 正解：1.524m
- 出典：[BWF Laws of Badminton（2025年4月26日 Version 5.0）](https://extranet.bwf.sport/docs/document-system/81/1466/1470/Section%204.1%20-%20Laws%20of%20Badminton%20-%2026%20April%202025%20V5.0%20(2)%20.pdf)
- 確認：BWF Laws 1「1.524 metres at the centre … 1.55 metres over the side lines for doubles」で確認。

### q35（コートとルール）ネットは、真ん中のほうが、支柱のところよりも、少し高い。

- 正解：×
- 出典：[BWF Laws of Badminton（2025年4月26日 Version 5.0）](https://extranet.bwf.sport/docs/document-system/81/1466/1470/Section%204.1%20-%20Laws%20of%20Badminton%20-%2026%20April%202025%20V5.0%20(2)%20.pdf)
- 確認：同上（1.55−1.524＝0.026m）。

### q36（コートとルール）ラインの上に落ちたシャトルは、「アウト」になる。

- 正解：×
- 出典：[BWF Laws of Badminton（2025年4月26日 Version 5.0）](https://extranet.bwf.sport/docs/document-system/81/1466/1470/Section%204.1%20-%20Laws%20of%20Badminton%20-%2026%20April%202025%20V5.0%20(2)%20.pdf)
- 確認：BWF Laws 1「All the lines shall form part of the area which they define」、13.3.1「not on or within the boundary lines」で確認。

### q37（コートとルール）試合中、シャトルが体育館の天井に当たると、フォルト（失点）になる。

- 正解：○
- 出典：[BWF Laws of Badminton（2025年4月26日 Version 5.0）](https://extranet.bwf.sport/docs/document-system/81/1466/1470/Section%204.1%20-%20Laws%20of%20Badminton%20-%2026%20April%202025%20V5.0%20(2)%20.pdf)
- 確認：BWF Laws 13.3.3「touches the ceiling or side walls」。会場事情による地方規則の注記あり（Laws 13.3.5 の後）。

### q38（コートとルール）サービスは、打つ瞬間のシャトル全体が、床から1.15mより低い位置になければならない。

- 正解：○
- 出典：[BWF Laws of Badminton（2025年4月26日 Version 5.0）](https://extranet.bwf.sport/docs/document-system/81/1466/1470/Section%204.1%20-%20Laws%20of%20Badminton%20-%2026%20April%202025%20V5.0%20(2)%20.pdf)
- 確認：BWF Laws 9.1.6「the whole shuttle shall be below 1.15 metres from the surface of the court」で確認。

### q39（コートとルール）サービスを打つとき、シャトルに回転（スピン）をかけて落としてから打ってもよい。

- 正解：×
- 出典：[BWF Laws of Badminton（2025年4月26日 Version 5.0）](https://extranet.bwf.sport/docs/document-system/81/1466/1470/Section%204.1%20-%20Laws%20of%20Badminton%20-%2026%20April%202025%20V5.0%20(2)%20.pdf)
- 確認：BWF Laws 9.1.5「the server shall release the shuttle without adding spin」で確認。

### q40（コートとルール）2027年1月4日から、国際大会では、1ゲームを何点先取で行う予定？

- 正解：15点
- 出典：[BWF Members Approve 3×15 Scoring System（2026年4月25日）](https://bwfbadminton.com/news-single/2026/04/25/bwf-members-approve-3x15-scoring-system)、[BWF approves 3x15 scoring system for badminton from 2027（Xinhua）](https://english.news.cn/20260426/972c66898961489bbdd5b070aba373c8/c.html)
- 確認：BWFの2026年4月25日の総会で承認、2027年1月4日から。Xinhua と BWF 公式ニュースの検索結果で確認（BWF公式ページの本文は取得できず）。日本の導入は rules.ts に記載のBAJ発表（2026年5月1日）に依拠（今回は未再確認）。

### q41（コートとルール）21点制で、29対29になったら、さらに2点差がつくまで、いつまでも続く。

- 正解：×
- 出典：[BWF Laws of Badminton（2025年4月26日 Version 5.0）](https://extranet.bwf.sport/docs/document-system/81/1466/1470/Section%204.1%20-%20Laws%20of%20Badminton%20-%2026%20April%202025%20V5.0%20(2)%20.pdf)
- 確認：BWF Laws 7.4・7.5「If the score becomes 29-all, the side scoring the 30th point shall win」で確認。

### q42（コートとルール）3ゲーム目では、どちらかが先に11点になったとき（21点制）に、コートを交代する。

- 正解：○
- 出典：[BWF Laws of Badminton（2025年4月26日 Version 5.0）](https://extranet.bwf.sport/docs/document-system/81/1466/1470/Section%204.1%20-%20Laws%20of%20Badminton%20-%2026%20April%202025%20V5.0%20(2)%20.pdf)
- 確認：BWF Laws 8.1.3 で確認。15点制は rules.ts 記載のBAJルールブック2026付録3に依拠。

### q43（コートとルール）ゲームの途中、どちらかが11点になったとき（21点制）の、インターバル（休み）は、何秒以内？

- 正解：60秒以内
- 出典：[BWF Laws of Badminton（2025年4月26日 Version 5.0）](https://extranet.bwf.sport/docs/document-system/81/1466/1470/Section%204.1%20-%20Laws%20of%20Badminton%20-%2026%20April%202025%20V5.0%20(2)%20.pdf)
- 確認：BWF Laws 16.2.1「not exceeding 60 seconds during each game when the leading score reaches 11」で確認。

### q44（コートとルール）ゲームとゲームの間の、インターバル（休み）は、何秒以内？

- 正解：120秒以内
- 出典：[BWF Laws of Badminton（2025年4月26日 Version 5.0）](https://extranet.bwf.sport/docs/document-system/81/1466/1470/Section%204.1%20-%20Laws%20of%20Badminton%20-%2026%20April%202025%20V5.0%20(2)%20.pdf)
- 確認：BWF Laws 16.2.2「not exceeding 120 seconds between the first and second game」で確認。

### q45（コートとルール）ダブルスで、サーブをしている側が得点したら、サーブを打つ人が、パートナーと交代する。

- 正解：×
- 出典：[BWF Laws of Badminton（2025年4月26日 Version 5.0）](https://extranet.bwf.sport/docs/document-system/81/1466/1470/Section%204.1%20-%20Laws%20of%20Badminton%20-%2026%20April%202025%20V5.0%20(2)%20.pdf)
- 確認：BWF Laws 11.3.1「the server shall then serve again from the alternate service court」で確認。

### q46（コートとルール）サーブをする側の得点が「0点」や「偶数」のとき、どちら側のサービスコートから打つ？

- 正解：右側
- 出典：[BWF Laws of Badminton（2025年4月26日 Version 5.0）](https://extranet.bwf.sport/docs/document-system/81/1466/1470/Section%204.1%20-%20Laws%20of%20Badminton%20-%2026%20April%202025%20V5.0%20(2)%20.pdf)
- 確認：BWF Laws 10.1.1・11.1.1 で確認。

### q47（コートとルール）1つの試合は、特に決めがなければ、3ゲームのうち、先に2ゲームをとった側が勝ちになる。

- 正解：○
- 出典：[BWF Laws of Badminton（2025年4月26日 Version 5.0）](https://extranet.bwf.sport/docs/document-system/81/1466/1470/Section%204.1%20-%20Laws%20of%20Badminton%20-%2026%20April%202025%20V5.0%20(2)%20.pdf)
- 確認：BWF Laws 7.1「the best of three games」で確認。

### q48（コートとルール）1人の選手が、続けて2回、シャトルを打っても、フォルトにはならない。

- 正解：×
- 出典：[BWF Laws of Badminton（2025年4月26日 Version 5.0）](https://extranet.bwf.sport/docs/document-system/81/1466/1470/Section%204.1%20-%20Laws%20of%20Badminton%20-%2026%20April%202025%20V5.0%20(2)%20.pdf)
- 確認：BWF Laws 13.3.7「hit twice in succession by the same player. However, a shuttle hitting the head and the stringed area of the racket in one stroke shall not be a fault」で確認。

### q49（コートとルール）コートの白いライン（線）の太さは、約10cmと決まっている。

- 正解：×
- 出典：[BWF Laws of Badminton（2025年4月26日 Version 5.0）](https://extranet.bwf.sport/docs/document-system/81/1466/1470/Section%204.1%20-%20Laws%20of%20Badminton%20-%2026%20April%202025%20V5.0%20(2)%20.pdf)
- 確認：BWF Laws 1「lines 40 mm wide」、「preferably coloured white or yellow」で確認。

### q50（コートとルール）第1ゲームが終わったら、2つの側は、コート（陣地）を交代する。

- 正解：○
- 出典：[BWF Laws of Badminton（2025年4月26日 Version 5.0）](https://extranet.bwf.sport/docs/document-system/81/1466/1470/Section%204.1%20-%20Laws%20of%20Badminton%20-%2026%20April%202025%20V5.0%20(2)%20.pdf)
- 確認：BWF Laws 8.1.1・8.1.2 で確認。
