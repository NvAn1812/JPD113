export const GAME_DATA = [
    {
        id: 1,
        situation: "Đến trước cửa nhà",
        speaker: "Người yêu",
        dialogue: "「いらっしゃい！今日は来てくれてありがとう。」",
        translate: "Chào mừng em/anh! Cảm ơn vì hôm nay đã đến.",
        options: [
            { id: "A", text: "おじゃまします。", isCorrect: true },
            { id: "B", text: "いただきます。", isCorrect: false },
            { id: "C", text: "おやすみなさい。", isCorrect: false },
            { id: "D", text: "いってきます。", isCorrect: false }
        ],
        explanation: "おじゃまします (Ojama shimasu): Xin phép làm phiền khi bước vào nhà người khác. Đây là câu chào bắt buộc khi vào nhà người Nhật.",
        reaction: "笑顔 (Cười tươi): 「どうぞ、入って！」"
    },
    {
        id: 2,
        situation: "Cởi giày khi bước vào",
        speaker: "Người yêu",
        dialogue: "「靴はここで脱いでね。」",
        translate: "Em/anh cởi giày ở đây nhé.",
        options: [
            { id: "A", text: "はい、お邪魔します。", isCorrect: false },
            { id: "B", text: "はい、失礼します。", isCorrect: true },
            { id: "C", text: "ごめんください。", isCorrect: false },
            { id: "D", text: "おかえりなさい。", isCorrect: false }
        ],
        explanation: "失礼します (Shitsurei shimasu): Xin thất lễ. Dùng khi thực hiện một hành động bước vào không gian của người khác hoặc khi được yêu cầu làm gì đó.",
        reaction: "「スリッパ、どうぞ！」 (Mời dùng dép đi trong nhà)"
    },
    {
        id: 3,
        situation: "Gặp mẹ người yêu",
        speaker: "Mẹ người yêu",
        dialogue: "「はじめまして。よく来ましたね。」",
        translate: "Chào cháu. Rất vui vì cháu đã đến chơi.",
        options: [
            { id: "A", text: "お元気ですか。", isCorrect: false },
            { id: "B", text: "はじめまして。よろしくお願いします。", isCorrect: true },
            { id: "C", text: "ごちそうさまでした。", isCorrect: false },
            { id: "D", text: "こんばんは。", isCorrect: false }
        ],
        explanation: "はじめまして。よろしくお願いします: Rất vui được gặp bác, mong bác giúp đỡ. Đây là câu chào chuẩn mực và lịch sự nhất khi gặp phụ huynh lần đầu.",
        reaction: "微笑む (Mỉm cười): 「丁寧な子ね。どうぞ座って。」"
    },
    {
        id: 4,
        situation: "Được mời uống trà",
        speaker: "Người yêu",
        dialogue: "「お茶を飲みますか？」",
        translate: "Em/anh có muốn uống trà không?",
        options: [
            { id: "A", text: "いいえ、食べます。", isCorrect: false },
            { id: "B", text: "はい、お願いします。", isCorrect: true },
            { id: "C", text: "お茶を見ます。", isCorrect: false },
            { id: "D", text: "また明日。", isCorrect: false }
        ],
        explanation: "はい、お願いします (Hai, onegaishimasu): Vâng, làm phiền anh/chị. Dùng để đồng ý nhận sự tiếp đãi một cách lịch sự.",
        reaction: "「はい、どうぞ。熱いから気をつけてね。」"
    },
    {
        id: 5,
        situation: "Chuẩn bị ăn tối",
        speaker: "Bố người yêu",
        dialogue: "「さあ、夕ご飯にしましょう。たくさん食べてね。」",
        translate: "Nào, chúng ta ăn tối thôi. Cháu ăn nhiều vào nhé.",
        options: [
            { id: "A", text: "いただきます。", isCorrect: true },
            { id: "B", text: "ごちそうさまでした。", isCorrect: false },
            { id: "C", text: "いってらっしゃい。", isCorrect: false },
            { id: "D", text: "おやすみ。", isCorrect: false }
        ],
        explanation: "いただきます (Itadakimasu): Mời mọi người dùng bữa / Xin phép nhận bữa ăn này. Thể hiện sự biết ơn trước khi ăn.",
        reaction: "家族全員: 「いただきます！」"
    },
    {
        id: 6,
        situation: "Trò chuyện khi ăn: Khen món ăn",
        speaker: "Mẹ người yêu",
        dialogue: "「料理はお口に合いますか？」",
        translate: "Thức ăn có vừa miệng cháu không?",
        options: [
            { id: "A", text: "はい、とても美しいです。", isCorrect: false },
            { id: "B", text: "はい、とても美味しいです。", isCorrect: true },
            { id: "C", text: "いいえ、好きじゃないです。", isCorrect: false },
            { id: "D", text: "たぶん美味しいです。", isCorrect: false }
        ],
        explanation: "とても美味しいです (Totemo oishii desu): Rất ngon ạ. Việc khen món ăn do chủ nhà nấu là phép lịch sự cơ bản.",
        reaction: "嬉しそう (Vui vẻ): 「よかった！たくさん作ったからね。」"
    },
    {
        id: 7,
        situation: "Xin phép sử dụng nhà vệ sinh",
        speaker: "Người chơi (Bạn)",
        dialogue: "（お手洗いに行きたい…なんて言う？）",
        translate: "(Bạn muốn đi vệ sinh... nên nói thế nào?)",
        options: [
            { id: "A", text: "トイレはどこだ。", isCorrect: false },
            { id: "B", text: "トイレに行け。", isCorrect: false },
            { id: "C", text: "トイレを見ます。", isCorrect: false },
            { id: "D", text: "お手洗いをお借りしてもいいですか。", isCorrect: true }
        ],
        explanation: "お手洗いをお借りしてもいいですか (Otearai wo okari shite mo ii desu ka): Cháu có thể mượn nhà vệ sinh được không ạ? Dùng từ お手洗い thay vì トイレ sẽ lịch sự hơn nhiều.",
        reaction: "「もちろん。廊下の突き当たりだよ。」"
    },
    {
        id: 8,
        situation: "Trò chuyện: Hỏi về sở thích",
        speaker: "Bố người yêu",
        dialogue: "「休みの日はいつも何をしていますか？」",
        translate: "Ngày nghỉ cháu thường làm gì?",
        options: [
            { id: "A", text: "映画を見たり、本を読んだりしています。", isCorrect: true },
            { id: "B", text: "明日は休みです。", isCorrect: false },
            { id: "C", text: "はい、休んでいます。", isCorrect: false },
            { id: "D", text: "昨日は映画を見ました。", isCorrect: false }
        ],
        explanation: "〜たり、〜たりしています: Cấu trúc liệt kê hành động. (Cháu thường xem phim, đọc sách...)",
        reaction: "「へえ、いい趣味だね！」"
    },
    {
        id: 9,
        situation: "Kết thúc bữa ăn",
        speaker: "Người chơi (Bạn)",
        dialogue: "（食事が終わった。挨拶をしよう。）",
        translate: "(Bữa ăn đã kết thúc. Hãy chào cảm ơn.)",
        options: [
            { id: "A", text: "いただきます。", isCorrect: false },
            { id: "B", text: "ごちそうさまでした。", isCorrect: true },
            { id: "C", text: "ありがとうございました。", isCorrect: false },
            { id: "D", text: "さようなら。", isCorrect: false }
        ],
        explanation: "ごちそうさまでした (Gochisousama deshita): Cảm ơn vì bữa ăn ngon. Bắt buộc nói sau khi ăn xong để cảm ơn người đã chuẩn bị.",
        reaction: "「お粗末様でした。」 (Không có chi đâu)"
    },
    {
        id: 10,
        situation: "Chào tạm biệt và ra về",
        speaker: "Gia đình người yêu",
        dialogue: "「今日は来てくれてありがとう。また遊びに来てね。」",
        translate: "Cảm ơn cháu hôm nay đã đến. Hôm sau lại tới chơi nhé.",
        options: [
            { id: "A", text: "ただいま。また来ます。", isCorrect: false },
            { id: "B", text: "いってきます。", isCorrect: false },
            { id: "C", text: "本日はお邪魔しました。また伺います。", isCorrect: true },
            { id: "D", text: "どういたしまして。", isCorrect: false }
        ],
        explanation: "お邪魔しました (Ojama shimashita): Cháu đã làm phiền mọi người rồi (thì quá khứ của ojama shimasu). また伺います (Mata ukagaimasu): Cháu sẽ lại đến thăm ạ (khiêm nhường ngữ).",
        reaction: "「気をつけて帰ってね。バイバイ！」"
    }
];

// Mỗi câu: bối cảnh (scene) + nhân vật đang nói (who)
export const META = {
    1: { scene: 'genkan', who: 'partner' }, 2: { scene: 'genkan', who: 'partner' },
    3: { scene: 'living', who: 'mother' }, 4: { scene: 'living', who: 'partner' },
    5: { scene: 'dining', who: 'father' }, 6: { scene: 'dining', who: 'mother' },
    7: { scene: 'hall', who: 'partner' }, 8: { scene: 'dining', who: 'father' },
    9: { scene: 'dining', who: 'mother' }, 10: { scene: 'genkan', who: 'partner' },
};

export const VOCAB = [
    { ic: '🚪', jp: 'おじゃまします', rd: 'ojama shimasu', vi: 'Xin phép làm phiền (khi vào nhà)' },
    { ic: '👟', jp: '靴', rd: 'kutsu', vi: 'Giày' },
    { ic: '🩴', jp: 'スリッパ', rd: 'surippa', vi: 'Dép đi trong nhà' },
    { ic: '🤝', jp: 'はじめまして', rd: 'hajimemashite', vi: 'Rất vui được gặp lần đầu' },
    { ic: '🍵', jp: 'お茶', rd: 'ocha', vi: 'Trà' },
    { ic: '🍚', jp: 'いただきます', rd: 'itadakimasu', vi: 'Xin phép dùng bữa' },
    { ic: '😋', jp: '美味しい', rd: 'oishii', vi: 'Ngon' },
    { ic: '🙏', jp: 'ごちそうさまでした', rd: 'gochisousama deshita', vi: 'Cảm ơn vì bữa ăn' },
    { ic: '🚻', jp: 'お手洗い', rd: 'otearai', vi: 'Nhà vệ sinh (lịch sự)' },
    { ic: '🎬', jp: '映画', rd: 'eiga', vi: 'Phim' },
    { ic: '📖', jp: '本', rd: 'hon', vi: 'Sách' },
    { ic: '👋', jp: 'お邪魔しました', rd: 'ojama shimashita', vi: 'Cảm ơn đã tiếp đón (khi ra về)' },
];