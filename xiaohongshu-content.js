/* Fictional, local community. Images and posts never query a live account. */
const XHS_AUTHORS={
 lane:{name:'巷子里的小满',avatar:'feed-avatar-manman',bio:'槐城散步｜旧书、老房子与路边小店',handle:'xiaoman_lane'},
 cook:{name:'下班吃口热的',avatar:'feed-avatar-aunt',bio:'两个人的小厨房，不赶时间的时候好好吃饭。',handle:'warm_dinner'},
 ride:{name:'慢骑阿川',avatar:'feed-avatar-slowride',bio:'沿河骑车，停下来拍照。',handle:'achuan_cycle'},
 cat:{name:'猫在窗台上',avatar:'feed-avatar-xiaolu',bio:'和猫一起住在老小区。',handle:'window_cat'},
 book:{name:'旧书慢慢翻',avatar:'feed-avatar-shiliu',bio:'淘书、修补，偶尔晒晒工作台。',handle:'paper_days'},
 daily:{name:'周末不设闹钟',avatar:'feed-avatar-xiaozhou',bio:'普通日子也值得记下来。',handle:'weekend_notes'}
};
const XHS_POSTS=[
 {
  "id": "noodles",
  "title": "我的一周冷冻早餐备餐表",
  "author": "cook",
  "images": [
   "xhs-note-noodles"
  ],
  "topic": "美食",
  "body": [
   "周日晚分装，工作日少洗一只锅",
   "周一｜玉米＋蒸蛋",
   "周三｜饭团＋热豆浆",
   "周五｜馒头夹蛋",
   "我家冰箱小，只备三天的量。饭团放凉后单独包好，袋上写日期；吃的时候彻底热透。配菜当天做，不把整周的饭都堆进去。"
  ],
  "tags": [
   "美食",
   "经验分享"
  ],
  "date": "2026-09-05",
  "likes": 27,
  "comments": [
   {
    "author": "daily",
    "text": "饭团里的黄瓜我会当天再加，冻过就软了。",
    "date": "2026-09-17"
   }
  ]
 },
 {
  "id": "river",
  "title": "两天一夜背包里，真正用上的只有这些",
  "author": "ride",
  "images": [
   "xhs-note-river"
  ],
  "topic": "旅行",
  "body": [
   "轻装出门，我的十二升背包",
   "外侧｜水杯与折叠伞",
   "中层｜换洗衣物一套",
   "内袋｜证件和充电线",
   "这次住朋友家，毛巾和洗护都没重复带。返程把没用过的东西记下来，下次再减。清单按自己的住宿条件改，别照着别人的包原样塞。"
  ],
  "tags": [
   "旅行",
   "经验分享"
  ],
  "date": "2026-09-06",
  "likes": 220,
  "comments": [
   {
    "author": "daily",
    "text": "充电线我也老带两根，其实一根够了。",
    "date": "2026-09-17"
   }
  ]
 },
 {
  "id": "cat",
  "title": "猫抓板总买错？先量它伸懒腰的长度",
  "author": "cat",
  "images": [
   "xhs-note-cat"
  ],
  "topic": "萌宠",
  "body": [
   "家里两块抓板的使用记录",
   "竖放｜靠墙固定，不晃",
   "横放｜放在睡醒会路过的地方",
   "换位｜先保留旧抓板",
   "它以前不是不爱抓，是板子跟着爪子跑。垫了防滑垫以后才肯用。新板先和旧板并排放了几天，没有把旧的马上丢掉。"
  ],
  "tags": [
   "萌宠",
   "经验分享"
  ],
  "date": "2026-09-07",
  "likes": 413,
  "comments": [
   {
    "author": "daily",
    "text": "防滑这条有用，我家的也一抓就滑走。",
    "date": "2026-09-17"
   }
  ]
 },
 {
  "id": "market",
  "title": "只有两人的晚饭，买菜按份量记更省事",
  "author": "cook",
  "images": [
   "xhs-note-market"
  ],
  "topic": "美食",
  "body": [
   "小冰箱采购单，不按促销囤菜",
   "两顿叶菜｜先吃容易蔫的",
   "两份豆制品｜看保质期",
   "一份耐放菜｜留给忙的那天",
   "以前看菜便宜就买，最后反而剩下。现在先想哪天在家吃，再写清单。购物单留一行空白给当天特别想吃的东西，不把菜单安排得太死。"
  ],
  "tags": [
   "美食",
   "经验分享"
  ],
  "date": "2026-09-08",
  "likes": 606,
  "comments": [
   {
    "author": "daily",
    "text": "留一个自由发挥的位置，很适合我。",
    "date": "2026-09-17"
   }
  ]
 },
 {
  "id": "desk",
  "title": "抽屉分区不用先买收纳盒",
  "author": "book",
  "images": [
   "xhs-note-desk"
  ],
  "topic": "家居",
  "body": [
   "先试七天，再决定盒子尺寸",
   "每天用｜放前排",
   "偶尔用｜放后排",
   "待处理｜单独留一格",
   "用快递纸板折了几块隔板试位置，发现剪刀那格太窄，挪了一次。等分区稳定再买盒子，不然盒子好看，抽屉还是关不上。"
  ],
  "tags": [
   "家居",
   "经验分享"
  ],
  "date": "2026-09-09",
  "likes": 799,
  "comments": [
   {
    "author": "daily",
    "text": "我拿饼干盒试了一周，省下一套收纳盒。",
    "date": "2026-09-17"
   }
  ]
 },
 {
  "id": "plant",
  "title": "给绿植做一张浇水记录，不靠闹钟硬浇",
  "author": "cat",
  "images": [
   "xhs-note-plant"
  ],
  "topic": "家居",
  "body": [
   "窗边观察页，每盆单独记",
   "周一｜表土湿，先不浇",
   "周四｜盆明显轻了",
   "周日｜新叶展开一半",
   "记录的是盆的状态，不是固定浇水日。我的窗台通风、盆土和你家可能不同。叶子变化画个小记号，比只写日期更容易回想起来。"
  ],
  "tags": [
   "家居",
   "经验分享"
  ],
  "date": "2026-09-10",
  "likes": 992,
  "comments": [
   {
    "author": "daily",
    "text": "终于有不是每周一律浇一次的记录了。",
    "date": "2026-09-17"
   }
  ]
 },
 {
  "id": "rain",
  "title": "阴天拍静物，我只挪了一个位置",
  "author": "lane",
  "images": [
   "xhs-note-rain"
  ],
  "topic": "摄影",
  "body": [
   "窗边练习，先看光落在哪里",
   "关顶灯｜避免两种颜色混在一起",
   "侧向窗｜杯子离窗半米",
   "白纸板｜放在背光那一侧",
   "同一个杯子先后放在桌心和窗边。没有开美颜，手动把亮度压一点，杯沿就清楚了。白纸板不是必须，想要更深的阴影就拿走。"
  ],
  "tags": [
   "摄影",
   "经验分享"
  ],
  "date": "2026-09-11",
  "likes": 1185,
  "comments": [
   {
    "author": "daily",
    "text": "白纸板的距离也会影响，我准备试一下。",
    "date": "2026-09-17"
   }
  ]
 },
 {
  "id": "breakfast",
  "title": "一只平底锅的厚蛋烧练习，失败也记下来",
  "author": "cook",
  "images": [
   "xhs-note-breakfast"
  ],
  "topic": "美食",
  "body": [
   "第二次比第一次顺手",
   "薄铺一层｜半凝固时卷",
   "把卷推开｜空位补蛋液",
   "小火耐心｜破了下一层盖住",
   "头一次蛋液倒多了，中间湿，外面老。第二次分四回倒，样子还是歪的，吃着倒不错。要是粘锅，就先炒个蛋吧，别跟锅较劲。"
  ],
  "tags": [
   "美食",
   "经验分享"
  ],
  "date": "2026-09-12",
  "likes": 1378,
  "comments": [
   {
    "author": "daily",
    "text": "破了再包一层，这句救了我的早餐。",
    "date": "2026-09-17"
   }
  ]
 },
 {
  "id": "laundry",
  "title": "换季衣柜标签，我改成了穿着场景",
  "author": "daily",
  "images": [
   "xhs-note-laundry"
  ],
  "topic": "家居",
  "body": [
   "不用每天重新翻箱子",
   "通勤｜容易搭配的几件",
   "周末｜宽松耐洗",
   "暂收｜洗净晾透再入箱",
   "以前按颜色分，找一件能出门的衣服还要翻半天。现在只分三块，暂收箱外贴一张手写目录。拿走一件就划掉，不凭记忆找。"
  ],
  "tags": [
   "家居",
   "经验分享"
  ],
  "date": "2026-09-13",
  "likes": 1571,
  "comments": [
   {
    "author": "book",
    "text": "箱外目录很好，比每次开箱方便。",
    "date": "2026-09-17"
   }
  ]
 },
 {
  "id": "flowers",
  "title": "第一次插花，我给自己限了三个高度",
  "author": "daily",
  "images": [
   "xhs-note-flowers"
  ],
  "topic": "家居",
  "body": [
   "一只窄口瓶，五枝以内",
   "最高一枝｜先定方向",
   "中间两枝｜错开花头",
   "最低一枝｜遮住瓶口",
   "没有买成套花材，把同一种小花剪出高低。先少放，空着的地方不急着补满。拍完照才发现背后两片叶子互相挡着，下次先转一圈看。"
  ],
  "tags": [
   "家居",
   "经验分享"
  ],
  "date": "2026-09-14",
  "likes": 1764,
  "comments": [
   {
    "author": "book",
    "text": "少放一点反而好看，我每次都塞得太满。",
    "date": "2026-09-17"
   }
  ]
 },
 {
  "id": "library",
  "title": "借来的书怎么做笔记？我的无胶记录法",
  "author": "book",
  "images": [
   "xhs-note-library"
  ],
  "topic": "读书",
  "body": [
   "书里不贴，另纸记页码",
   "上栏｜书名与版本",
   "中栏｜页码＋原句关键词",
   "下栏｜自己的问题",
   "不折角、不往书页贴便签。拿一张小卡当书签，写到哪页就记在哪页，回家再整理。引用原句和自己的想法画条线隔开，免得以后混淆。"
  ],
  "tags": [
   "读书",
   "经验分享"
  ],
  "date": "2026-09-15",
  "likes": 1957,
  "comments": [
   {
    "author": "daily",
    "text": "版本也要记，换一本页码就对不上。",
    "date": "2026-09-17"
   }
  ]
 },
 {
  "id": "lane-photo",
  "title": "九宫格只用中间一格，练习把背景收干净",
  "author": "lane",
  "images": [
   "xhs-note-lane-photo"
  ],
  "topic": "摄影",
  "body": [
   "同一个路口，三种取景",
   "向左一步｜避开杂乱招牌",
   "蹲低一点｜留下墙面",
   "等一会儿｜让路人走过",
   "这次不追求把整条街都拍进去，只留下门口和一把椅子。三张图里我最喜欢最少的那张。站在人行道拍，别为了找角度退到车道。"
  ],
  "tags": [
   "摄影",
   "经验分享"
  ],
  "date": "2026-09-16",
  "likes": 2150,
  "comments": [
   {
    "author": "daily",
    "text": "减掉招牌以后，主体真的清楚很多。",
    "date": "2026-09-17"
   }
  ]
 },
 {
  "id": "peppers",
  "title": "家常调味我不背公式，先做一小碗试味",
  "author": "cook",
  "images": [
   "xhs-note-peppers"
  ],
  "topic": "美食",
  "body": [
   "咸淡分开调，每次只补一点",
   "先稀释｜用少量温水调开",
   "再尝味｜别直接倒进整锅",
   "最后加｜酸味留到出锅前",
   "同样叫生抽，不同瓶子的咸度也不一样。我把试过的量写在瓶盖旁边的小纸条上。这里记的是我家的习惯，不是所有菜都用一碗汁。"
  ],
  "tags": [
   "美食",
   "经验分享"
  ],
  "date": "2026-09-05",
  "likes": 2343,
  "comments": [
   {
    "author": "daily",
    "text": "换牌子之后确实得重新试。",
    "date": "2026-09-17"
   }
  ]
 },
 {
  "id": "bike",
  "title": "第一次骑远一点，出发前我的五分钟检查",
  "author": "ride",
  "images": [
   "xhs-note-bike"
  ],
  "topic": "运动",
  "body": [
   "短途骑行，先绕小区试一圈",
   "刹车｜前后分别试",
   "轮胎｜看是否夹着小石子",
   "随身｜水、灯与应急工具",
   "修车留给会修的人，我只做出发前能看懂的检查。调过刹车以后先低速试，感觉不对就回店。路线先选熟悉的平路，不为凑公里数绕远。"
  ],
  "tags": [
   "运动",
   "经验分享"
  ],
  "date": "2026-09-06",
  "likes": 136,
  "comments": [
   {
    "author": "daily",
    "text": "试骑这步容易忘，先收藏了。",
    "date": "2026-09-17"
   }
  ]
 },
 {
  "id": "sea",
  "title": "住宿只住一晚，洗漱包怎么减到一小袋",
  "author": "ride",
  "images": [
   "xhs-note-sea"
  ],
  "topic": "旅行",
  "body": [
   "按这次行程收，回来再复盘",
   "留｜常用小件与梳子",
   "问｜住宿是否提供毛巾",
   "删｜只因担心而重复带的",
   "出门前先问朋友家有什么，再收自己的东西。分装瓶贴上内容和日期。清单里删掉三样的感觉，比买更大的包舒服。"
  ],
  "tags": [
   "旅行",
   "经验分享"
  ],
  "date": "2026-09-07",
  "likes": 329,
  "comments": [
   {
    "author": "daily",
    "text": "每次都带整瓶洗发水，回来几乎没动。",
    "date": "2026-09-17"
   }
  ]
 },
 {
  "id": "rocks",
  "title": "做手帐不靠贴纸，我画了七种小边框",
  "author": "daily",
  "images": [
   "xhs-note-rocks"
  ],
  "topic": "手工",
  "body": [
   "一支笔，留一点空白",
   "虚线框｜记待办",
   "圆角框｜写当天一句话",
   "留白框｜给没安排的时间",
   "纸不够厚，先在最后一页试笔。边框画歪就歪，不用涂黑重画。画完才发现我真正缺的是写内容，不是更多装饰。"
  ],
  "tags": [
   "手工",
   "经验分享"
  ],
  "date": "2026-09-08",
  "likes": 522,
  "comments": [
   {
    "author": "book",
    "text": "留白框太真实了，周末我也想空着。",
    "date": "2026-09-17"
   }
  ]
 },
 {
  "id": "paper",
  "title": "给平装书包书皮，书脊别绷得太紧",
  "author": "book",
  "images": [
   "xhs-note-paper"
  ],
  "topic": "手工",
  "body": [
   "牛皮纸练习，只包普通新书",
   "先量｜上下各留折边",
   "试合｜翻开再合上几次",
   "再折｜书脊处留活动余量",
   "我用的是自己的普通平装书，没有往书上贴胶。折边只固定在纸皮内侧。旧纸、脱页书不适合照着这样折，练习先拿不心疼的本子。"
  ],
  "tags": [
   "手工",
   "经验分享"
  ],
  "date": "2026-09-09",
  "likes": 715,
  "comments": [
   {
    "author": "daily",
    "text": "我第一张就是折太紧，书都打不开。",
    "date": "2026-09-17"
   }
  ]
 },
 {
  "id": "shelves",
  "title": "读不完的书先停在哪？我的三行阅读卡",
  "author": "book",
  "images": [
   "xhs-note-shelves"
  ],
  "topic": "读书",
  "body": [
   "不是打卡，下次能接着读就好",
   "读到｜第几章、哪一页",
   "记住｜这次最想留下的一点",
   "想问｜还没想明白的问题",
   "卡片夹在书里，下次不用往前翻十页找状态。有的书读一半停了很久也没关系，写下停在哪里就够了。"
  ],
  "tags": [
   "读书",
   "经验分享"
  ],
  "date": "2026-09-10",
  "likes": 908,
  "comments": [
   {
    "author": "daily",
    "text": "比逼自己每天读多少页舒服。",
    "date": "2026-09-17"
   }
  ]
 },
 {
  "id": "window",
  "title": "租房不打孔，先用纸胶带试画框位置",
  "author": "cat",
  "images": [
   "xhs-note-window"
  ],
  "topic": "家居",
  "body": [
   "先贴纸样，看两天再挂",
   "量宽｜和桌面留出边距",
   "贴样｜旧报纸剪同样大小",
   "退后｜坐着和站着都看看",
   "最后决定只留两张小画。纸胶带也先在不起眼的地方试，墙面起皮就别粘。摆在柜子上同样好看，不一定非要上墙。"
  ],
  "tags": [
   "家居",
   "经验分享"
  ],
  "date": "2026-09-11",
  "likes": 1101,
  "comments": [
   {
    "author": "daily",
    "text": "纸样试过才发现自己挂太高了。",
    "date": "2026-09-17"
   }
  ]
 },
 {
  "id": "rain-market",
  "title": "布袋底部开线，我自己缝了个回针",
  "author": "daily",
  "images": [
   "xhs-note-rain-market"
  ],
  "topic": "手工",
  "body": [
   "用旧布练习，再缝真正的袋子",
   "沿旧线｜先对齐两层布",
   "回一针｜线迹交叠",
   "收尾｜打结藏进内侧",
   "第一次针脚大小不一，拆了最歪的那一段。薄布别拉太紧，容易皱。补好以后先装轻东西试，重物还是换结实的袋子。"
  ],
  "tags": [
   "手工",
   "经验分享"
  ],
  "date": "2026-09-12",
  "likes": 1294,
  "comments": [
   {
    "author": "book",
    "text": "回针比我以前一条直线牢一些。",
    "date": "2026-09-17"
   }
  ]
 },
 {
  "id": "bus",
  "title": "手机拍书页，四个边先对齐再按快门",
  "author": "lane",
  "images": [
   "xhs-note-bus"
  ],
  "topic": "摄影",
  "body": [
   "自己的笔记，不开闪光灯",
   "铺平｜别压伤装订处",
   "平行｜镜头对着页面中心",
   "检查｜四角字都清楚再收起",
   "白天窗边拍，身体别挡住光。拍完立刻放大检查，等到了外面才发现糊了就来不及重拍。反光纸换角度比一味调亮有用。"
  ],
  "tags": [
   "摄影",
   "经验分享"
  ],
  "date": "2026-09-13",
  "likes": 1487,
  "comments": [
   {
    "author": "daily",
    "text": "放大检查真的必要，我丢过一页笔记。",
    "date": "2026-09-17"
   }
  ]
 },
 {
  "id": "wind",
  "title": "运动后不只记距离，我多写了一句感受",
  "author": "ride",
  "images": [
   "xhs-note-wind"
  ],
  "topic": "运动",
  "body": [
   "慢慢恢复运动，不追别人数据",
   "今天走了｜半小时",
   "哪里不适｜如实写下来",
   "下次打算｜保持或者减少",
   "我以前只盯数字，走得累也不愿意停。现在把自己的感受写在距离下面，天气不好就缩短。记录是帮自己调整，不是每天都得刷新。"
  ],
  "tags": [
   "运动",
   "经验分享"
  ],
  "date": "2026-09-14",
  "likes": 1680,
  "comments": [
   {
    "author": "daily",
    "text": "今天不加量也值得记。",
    "date": "2026-09-17"
   }
  ]
 },
 {
  "id": "bookroom",
  "title": "旧票根怎么存？我按一次出门装一袋",
  "author": "book",
  "images": [
   "xhs-note-bookroom"
  ],
  "topic": "手帐",
  "body": [
   "袋外写日期，里面别塞太满",
   "车票｜和行程放一起",
   "展览｜留下最喜欢的一张",
   "备注｜记下和谁一起去的",
   "容易褪色的票先拍张照片，不用胶带覆盖字。以前按票的种类分，后来发现同一次出门的东西放一起，回看更有意思。"
  ],
  "tags": [
   "手帐",
   "经验分享"
  ],
  "date": "2026-09-15",
  "likes": 1873,
  "comments": [
   {
    "author": "daily",
    "text": "和谁去比票价更值得记下来。",
    "date": "2026-09-17"
   }
  ]
 },
 {
  "id": "walk",
  "title": "和朋友约见面，提前说清结束时间更轻松",
  "author": "daily",
  "images": [
   "xhs-note-walk"
  ],
  "topic": "生活",
  "body": [
   "我的周末约见小纸条",
   "开始｜下午三点见",
   "地点｜双方都方便到",
   "结束｜六点前各自回家",
   "不是赶人，只是我们都还要买菜、做饭。提前讲好以后见面更放松，想续聊也能一起商量。临时有事早点发消息，别让对方一直等。"
  ],
  "tags": [
   "生活",
   "经验分享"
  ],
  "date": "2026-09-16",
  "likes": 2066,
  "comments": [
   {
    "author": "book",
    "text": "有结束时间以后我反而更愿意出门了。",
    "date": "2026-09-17"
   }
  ]
 }
];
XHS_POSTS.splice(5,0,{id:'old-book-copy',title:'旧书摊淘到的两册手抄本，终于整理好了',author:'lane',topic:'读书',images:['article-old-lane','feed-awen-paper-edges','article-old-manuscript','article-rubbing','book-prayer-cover','xhs-book-qr'],body:['上个月在槐城旧书摊收来的《归亲会抄经本》，上下两册，原来的线已经散了。只做了表面清理，没有裁掉破边。','前几张是整理时拍的过程，最后一张是字间文献库的影录卡。纸太脆，原件现在收起来了，整册扫描都在影录里。','图片中的印记、页边批注和空白页都保留了。不是新印本，也没把缺字补进去。'],tags:['归亲会抄经本','旧书摊','槐城','旧书修补'],date:'2026-09-05',likes:163,clue:true,comments:[{author:'book',text:'最后那张影录卡我存了，翻扫描件比对着照片放大清楚。',date:'2026-09-05'},{author:'lane',text:'是字间那边做的合订影录，纸背也扫了。',date:'2026-09-05'},{author:'daily',text:'巷口的旧书摊还在吗？上次过去赶上下雨没开。',date:'2026-09-06'}]});
const XHS_BOOK_QR='https://zijian.example/library/guqin-copy';

/* Mix photographic notes with the independently authored practical cards. */
(()=>{const photos={noodles:'xhs-life-breakfast',peppers:'xhs-life-seasoning',plant:'article-window-plant',flowers:'article-cup-flower',library:'article-library-desk','lane-photo':'article-old-lane',bike:'feed-zhao-bike-start',paper:'article-library-shelf',shelves:'article-library-shelf',wind:'article-riverside',walk:'article-breakfast-shop'};for(const p of XHS_POSTS){if(photos[p.id]){p.coverIndex=p.images.length;p.images.push(photos[p.id]);}}})();
