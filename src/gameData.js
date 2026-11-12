export const GAME_DATA = [
    {
        id: 1,
        situation: "Đến trước cửa nhà",
        speaker: "Người yêu",
        dialogue: "「いらっしゃい！きょうはきてくれてありがとう。」",
        translate: "Chào mừng em/anh! Cảm ơn vì hôm nay đã đến.",
        options: [
            { id: "A", text: "おじゃまします。", isCorrect: true },
            { id: "B", text: "いただきます。", isCorrect: false },
            { id: "C", text: "おやすみなさい。", isCorrect: false },
            { id: "D", text: "いってきます。", isCorrect: false }
        ],
        explanation: "おじゃまします (Ojama shimasu): Xin phép làm phiền khi bước vào nhà người khác. Đây là câu chào bắt buộc khi vào nhà người Nhật.",
        reaction: "えがお (Cười tươi): 「どうぞ、はいって！」"
    },
    {
        id: 2,
        situation: "Cởi giày khi bước vào",
        speaker: "Người yêu",
        dialogue: "「くつはここでぬいでね。」",
        translate: "Em/anh cởi giày ở đây nhé.",
        options: [
            { id: "A", text: "はい、おじゃまします。", isCorrect: false },
            { id: "B", text: "はい、しつれいします。", isCorrect: true },
            { id: "C", text: "ごめんください。", isCorrect: false },
            { id: "D", text: "おかえりなさい。", isCorrect: false }
        ],
        explanation: "しつれいします (Shitsurei shimasu): Xin thất lễ. Dùng khi thực hiện một hành động bước vào không gian của người khác hoặc khi được yêu cầu làm gì đó.",
        reaction: "「スリッパ、どうぞ！」 (Mời dùng dép đi trong nhà)"
    },
    {
        id: 3,
        situation: "Gặp mẹ người yêu",
        speaker: "Mẹ người yêu",
        dialogue: "「はじめまして。よくきましたね。」",
        translate: "Chào cháu. Rất vui vì cháu đã đến chơi.",
        options: [
            { id: "A", text: "おげんきですか。", isCorrect: false },
            { id: "B", text: "はじめまして。よろしくおねがいします。", isCorrect: true },
            { id: "C", text: "ごちそうさまでした。", isCorrect: false },
            { id: "D", text: "こんばんは。", isCorrect: false }
        ],
        explanation: "はじめまして。よろしくおねがいします: Rất vui được gặp bác, mong bác giúp đỡ. Đây là câu chào chuẩn mực và lịch sự nhất khi gặp phụ huynh lần đầu.",
        reaction: "ほほえむ (Mỉm cười): 「ていねいなこね。どうぞすわって。」"
    },
    {
        id: 4,
        situation: "Được mời uống trà",
        speaker: "Người yêu",
        dialogue: "「おちゃをのみますか？」",
        translate: "Em/anh có muốn uống trà không?",
        options: [
            { id: "A", text: "いいえ、たべます。", isCorrect: false },
            { id: "B", text: "はい、おねがいします。", isCorrect: true },
            { id: "C", text: "おちゃをみます。", isCorrect: false },
            { id: "D", text: "またあした。", isCorrect: false }
        ],
        explanation: "はい、おねがいします (Hai, onegaishimasu): Vâng, làm phiền anh/chị. Dùng để đồng ý nhận sự tiếp đãi một cách lịch sự.",
        reaction: "「はい、どうぞ。あついからきをつけてね。」"
    },
    {
        id: 5,
        situation: "Chuẩn bị ăn tối",
        speaker: "Bố người yêu",
        dialogue: "「さあ、ゆうごはんにしましょう。たくさんたべてね。」",
        translate: "Nào, chúng ta ăn tối thôi. Cháu ăn nhiều vào nhé.",
        options: [
            { id: "A", text: "いただきます。", isCorrect: true },
            { id: "B", text: "ごちそうさまでした。", isCorrect: false },
            { id: "C", text: "いってらっしゃい。", isCorrect: false },
            { id: "D", text: "おやすみ。", isCorrect: false }
        ],
        explanation: "いただきます (Itadakimasu): Mời mọi người dùng bữa / Xin phép nhận bữa ăn này. Thể hiện sự biết ơn trước khi ăn.",
        reaction: "かぞくぜんいん (Cả gia đình): 「いただきます！」"
    },
    {
        id: 6,
        situation: "Trò chuyện khi ăn: Khen món ăn",
        speaker: "Mẹ người yêu",
        dialogue: "「りょうりはおくちにあいますか？」",
        translate: "Thức ăn có vừa miệng cháu không?",
        options: [
            { id: "A", text: "はい、とてもうつくしいです。", isCorrect: false },
            { id: "B", text: "はい、とてもおいしいです。", isCorrect: true },
            { id: "C", text: "いいえ、すきじゃないです。", isCorrect: false },
            { id: "D", text: "たぶんおいしいです。", isCorrect: false }
        ],
        explanation: "とてもおいしいです (Totemo oishii desu): Rất ngon ạ. Việc khen món ăn do chủ nhà nấu là phép lịch sự cơ bản.",
        reaction: "うれしそう (Vui vẻ): 「よかった！たくさんつくったからね。」"
    },
    {
        id: 7,
        situation: "Xin phép sử dụng nhà vệ sinh",
        speaker: "Người chơi (Bạn)",
        dialogue: "（おてあらいにいきたい…なんていう？）",
        translate: "(Bạn muốn đi vệ sinh... nên nói thế nào?)",
        options: [
            { id: "A", text: "トイレはどこだ。", isCorrect: false },
            { id: "B", text: "トイレにいけ。", isCorrect: false },
            { id: "C", text: "トイレをみます。", isCorrect: false },
            { id: "D", text: "おてあらいをおかりしてもいいですか。", isCorrect: true }
        ],
        explanation: "おてあらいをおかりしてもいいですか (Otearai wo okari shite mo ii desu ka): Cháu có thể mượn nhà vệ sinh được không ạ? Dùng từ おてあらい thay vì トイレ sẽ lịch sự hơn nhiều.",
        reaction: "「もちろん。ろうかのつきあたりだよ。」"
    },
    {
        id: 8,
        situation: "Trò chuyện: Hỏi về sở thích",
        speaker: "Bố người yêu",
        dialogue: "「やすみの日はいつも何をしていますか？」",
        translate: "Ngày nghỉ cháu thường làm gì?",
        options: [
            { id: "A", text: "えいがをみたり、本をよんだりしています。", isCorrect: true },
            { id: "B", text: "あしたはやすみです。", isCorrect: false },
            { id: "C", text: "はい、やすんでいます。", isCorrect: false },
            { id: "D", text: "きのうはえいがをみました。", isCorrect: false }
        ],
        explanation: "〜たり、〜たりしています: Cấu trúc liệt kê hành động. (Cháu thường xem phim, đọc sách...)",
        reaction: "「へえ、いいしゅみだね！」"
    },
    {
        id: 9,
        situation: "Kết thúc bữa ăn",
        speaker: "Người chơi (Bạn)",
        dialogue: "（しょくじがおわった。あいさつをしよう。）",
        translate: "(Bữa ăn đã kết thúc. Hãy chào cảm ơn.)",
        options: [
            { id: "A", text: "いただきます。", isCorrect: false },
            { id: "B", text: "ごちそうさまでした。", isCorrect: true },
            { id: "C", text: "ありがとうございました。", isCorrect: false },
            { id: "D", text: "さようなら。", isCorrect: false }
        ],
        explanation: "ごちそうさまでした (Gochisousama deshita): Cảm ơn vì bữa ăn ngon. Bắt buộc nói sau khi ăn xong để cảm ơn người đã chuẩn bị.",
        reaction: "「おそまつさまでした。」 (Không có chi đâu)"
    },
    {
        id: 10,
        situation: "Chào tạm biệt và ra về",
        speaker: "Gia đình người yêu",
        dialogue: "「きょうはきてくれてありがとう。またあそびにきてね。」",
        translate: "Cảm ơn cháu hôm nay đã đến. Hôm sau lại tới chơi nhé.",
        options: [
            { id: "A", text: "ただいま。またきます。", isCorrect: false },
            { id: "B", text: "いってきます。", isCorrect: false },
            { id: "C", text: "本日はおじゃましました。またうかがいます。", isCorrect: true },
            { id: "D", text: "どういたしまして。", isCorrect: false }
        ],
        explanation: "おじゃましました (Ojama shimashita): Cháu đã làm phiền mọi người rồi (thì quá khứ của ojama shimasu). またうかがいます (Mata ukagaimasu): Cháu sẽ lại đến thăm ạ (khiêm nhường ngữ).",
        reaction: "「きをつけてかえってね。バイバイ！」"
    },
    {
        id: 11,
        situation: "Trò chuyện: Hỏi về nghề nghiệp",
        speaker: "Mẹ người yêu",
        dialogue: "「おしごとは何ですか。学生ですか。」",
        translate: "Cháu làm nghề gì? Cháu là sinh viên phải không?",
        options: [
            { id: "A", text: "はい、ベトナム人です。", isCorrect: false },
            { id: "B", text: "はい、大学の学生です。", isCorrect: true },
            { id: "C", text: "いいえ、いしゃです。", isCorrect: false },
            { id: "D", text: "私は学生じゃありません。", isCorrect: false }
        ],
        explanation: "Mẫu câu N1 は N2 です dùng để nói về nghề nghiệp. Mẹ người yêu đang hỏi xác nhận (学生ですか), nên câu trả lời tự nhiên nhất là đồng ý và nói rõ mình là sinh viên đại học (大学の学生です).",
        reaction: "「まあ、すごいですね！」 (Chà, giỏi quá nhỉ!)"
    },
    {
        id: 12,
        situation: "Tặng quà mang từ Việt Nam sang",
        speaker: "Người chơi (Bạn)",
        dialogue: "（おみやげをわたそう…）「おかあさん、＿＿＿は ベトナムのおちゃです。どうぞ。」",
        translate: "(Đưa quà lưu niệm...) Bác gái ơi, ___ là trà của Việt Nam ạ. Xin biếu bác.",
        options: [
            { id: "A", text: "それ", isCorrect: false },
            { id: "B", text: "どれ", isCorrect: false },
            { id: "C", text: "あれ", isCorrect: false },
            { id: "D", text: "これ", isCorrect: true }
        ],
        explanation: "これ (Cái này): Dùng để chỉ vật ở gần người nói. Vì bạn đang cầm món quà trên tay để đưa cho mẹ người yêu, bạn phải dùng これ.",
        reaction: "「ありがとう！ベトナムのおちゃ、すきですよ。」 (Cảm ơn cháu! Bác thích trà Việt Nam lắm.)"
    },
    {
        id: 13,
        situation: "Chuẩn bị ra về",
        speaker: "Người chơi (Bạn)",
        dialogue: "（そろそろかえらないと…）「すみません、いま、＿＿＿ですか。」",
        translate: "(Sắp phải về rồi...) Xin lỗi, bây giờ là ___ ạ?",
        options: [
            { id: "A", text: "何時", isCorrect: true },
            { id: "B", text: "何分", isCorrect: false },
            { id: "C", text: "何曜日", isCorrect: false },
            { id: "D", text: "何月", isCorrect: false }
        ],
        explanation: "何時 (Nan-ji): Mấy giờ. Để hỏi thời gian hiện tại, ta dùng mẫu câu 今、何時ですか (Bây giờ là mấy giờ?).",
        reaction: "「いま、ごご九時はんですよ。」 (Bây giờ là 9 giờ rưỡi tối rồi đấy.)"
    }
];

export const META = {
    1: { scene: 'genkan', who: 'partner' }, 2: { scene: 'genkan', who: 'partner' },
    3: { scene: 'living', who: 'mother' }, 4: { scene: 'living', who: 'partner' },
    5: { scene: 'dining', who: 'father' }, 6: { scene: 'dining', who: 'mother' },
    7: { scene: 'hall', who: 'partner' }, 8: { scene: 'dining', who: 'father' },
    9: { scene: 'dining', who: 'mother' }, 10: { scene: 'genkan', who: 'partner' },
    11: { scene: 'living', who: 'mother' }, 12: { scene: 'living', who: 'mother' },
    13: { scene: 'living', who: 'partner' }
};