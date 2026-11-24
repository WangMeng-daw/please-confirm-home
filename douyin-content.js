/* Additional public photo posts. Dates, notices and identities follow the existing story. */
(() => {
  const posts = [
    {
      id: 'city-morning-market', creator: 'city', date: '2026-09-16', label: '9月16日', location: '槐城 · 老城',
      title: '又买了一袋青椒',
      text: '七点多出门买菜，买完才想起冰箱里还有半袋青椒。回家又得吃青椒了。还好没下雨，我伞也忘了拿。',
      photos: ['dy-market','feed-city-peppers'], tags: ['早市', '买菜', '普通生活'], likes: 219,
      comments: [{id: 'market-extra-1', creator: 'zhao', text: '最后青椒怎么处理的？', date: '9月16日', likes: 8, replies: [{id: 'market-extra-1a', creator: 'city', text: '炒了两顿，还剩一点。明天不买了。', date: '9月16日', likes: 5}]}]
    },
    {
      id: 'zhao-ride-noodles', creator: 'zhao', date: '2026-09-13', label: '9月13日', location: '槐城 · 家里',
      title: '骑一圈，回来煮面',
      text: '骑完回来饿坏了，面还硬着就捞了。第二张出门前拍的，那会儿还觉得自己能再骑远点。',
      photos: ['dy-noodles','feed-zhao-bike-start'], tags: ['家常饭', '骑行日记'], likes: 43,
      comments: [{id: 'noodles-extra-1', creator: 'city', text: '看着比外面卖的实在。', date: '9月13日', likes: 1, replies: [{id: 'noodles-extra-1a', creator: 'zhao', text: '主要是锅小了，没敢再加。', date: '9月13日', likes: 2}]}]
    },
    {
      id: 'street-stair-cat', creator: 'street', date: '2026-09-15', label: '9月15日', location: '槐城 · 榆树路',
      title: '邻居的猫比我会找地方',
      text: '早上开门，先被它看了一会儿。人在路边忙，它在楼梯上躲雨。主人下来叫它，耳朵动一下，就当答应了。第二张是今天店外的巷子。',
      photos: ['dy-cat','feed-street-cat-lane'], tags: ['街坊日常', '猫'], likes: 486,
      comments: [{id: 'cat-extra-1', creator: 'city', text: '这个眼神，感觉我们都欠它钱。', date: '9月15日', likes: 31, replies: [{id: 'cat-extra-1a', creator: 'street', text: '它只认楼上的，别人叫不动。', date: '9月15日', likes: 15}]}]
    },
    {
      id: 'city-rain-laundry', creator: 'city', date: '2026-09-14', label: '9月14日', location: '槐城 · 老城',
      title: '终于能把衣服搬出来了',
      text: '雨停这点工夫，家家都往外晾。回头看一眼天，再决定要不要走远。第二张是上午买菜时随手拍的，今天一路都在听人聊衣服干没干。',
      photos: ['dy-laundry','feed-city-rain-market'], tags: ['雨后', '老城生活'], likes: 102,
      comments: [{id: 'laundry-extra-1', creator: 'street', text: '我那件工服晾了三天。', date: '9月14日', likes: 3, replies: []}]
    },
    {
      id: 'zhao-cloudy-route', creator: 'zhao', date: '2026-09-05', label: '9月5日', location: '槐城 · 绿道',
      title: '这趟没骑到海边',
      text: '风太大了，骑到这儿就回了。第二张是上个月去海边拍的，这趟没到。等天好了再说。',
      photos: ['feed-zhao-windy-route','feed-zhao-sea-rocks'], tags: ['骑行', '周末'], likes: 57,
      comments: [{id: 'route-extra-1', creator: 'street', text: '能回来就行，别一阵风给吹沟里。', date: '9月5日', likes: 4, replies: [{id: 'route-extra-1a', creator: 'zhao', text: '放心，转头比谁都快。', date: '9月5日', likes: 2}]}]
    },
    {
      id: 'city-community-counter', creator: 'city', date: '2026-09-17', label: '9月17日', location: '槐城 · 社区服务点',
      title: '赶在下班前把事办完',
      text: '补材料跑了两趟，今天终于办好了。窗口边有个地方能坐着等，比站走廊舒服。回去路过老街，天还亮着，正好顺手买点晚饭。',
      photos: ['feed-city-service-queue'], tags: ['槐城日常', '下班以后'], likes: 64,
      comments: [{id: 'counter-extra-1', creator: 'zhao', text: '我上回也是少带一张复印件。', date: '9月17日', likes: 2, replies: []}]
    },
    {
      id: 'city-notice-wang', creator: 'city', date: '2026-09-17', label: '9月17日', location: '槐城 · 东城街道',
      title: '帮转：王建国，家人还在找',
      text: '王建国，67岁，9月14日早上7点20分左右，从榕树巷菜市场附近失去联系。当天穿藏蓝夹克、深灰长裤，带米色购物袋。照片由家属提供。家里还没找到人，看到相似的照片也请帮忙问一下拍摄时间和地点。',
      photos: ['missing-wang'], tags: ['寻人', '王建国', '槐城'], likes: 732,
      comments: [{id: 'wang-extra-1', creator: 'street', text: '店门口的寻人纸还贴着，有新消息我再转。', date: '9月17日', likes: 26, replies: [{id: 'wang-extra-1a', creator: 'city', text: '谢谢，家属在归家寻亲留了登记，日期和衣着写得很清楚。', date: '9月17日', likes: 19, link: {type: 'url', url: 'https://www.guijia.example/record?id=QH-0361', label: '王建国的公开寻人登记'}}]}]
    },
    {
      id: 'street-notice-sun', creator: 'street', date: '2026-09-16', label: '9月16日', location: '槐城 · 河西路',
      title: '找孙海生，照片再转一次',
      text: '孙海生，72岁。9月8日傍晚6点15分左右离开河西路朋友的修车铺，之后没回家。穿浅蓝格纹衬衫、深灰长裤，听力稍弱。麻烦连这段一起转，光看照片不知道是哪天走失的。',
      photos: ['missing-sun'], tags: ['寻人', '孙海生', '河西路'], likes: 386,
      comments: [{id: 'sun-extra-1', creator: 'zhao', text: '转给河西那边一起骑车的人了。', date: '9月16日', likes: 12, replies: [{id: 'sun-extra-1a', creator: 'street', text: '谢谢，有消息跟我说一声。他家里也在归家寻亲发了登记。', date: '9月16日', likes: 7, link: {type: 'url', url: 'https://www.guijia.example/record?id=QH-0347', label: '孙海生的公开寻人登记'}}]}]
    },
    {
      id: 'city-notice-zhao', creator: 'city', date: '2026-09-16', label: '9月16日', location: '槐城 · 西桥街道',
      title: '赵明明的妈妈还在广场附近找',
      text: '帮转家属公开信息：赵明明，8岁，9月10日晚6点50分左右在文化广场东侧走散。蓝色连帽外套、黑色运动裤、白底运动鞋，带黄色水壶。家属还在更新消息，希望早点找到。',
      photos: ['missing-zhao'], tags: ['儿童走失', '赵明明', '槐城'], likes: 1128,
      comments: [{id: 'zhao-notice-extra-1', creator: 'zhao', text: '已转，希望早点找到孩子。', date: '9月16日', likes: 28, replies: [{id: 'zhao-notice-extra-1a', creator: 'city', text: '谢谢你。他妈妈在归家寻亲留了登记。', date: '9月16日', likes: 9, link: {type: 'url', url: 'https://www.guijia.example/record?id=QH-0386', label: '赵明明的公开寻人登记'}}]}]
    },
    {
      id: 'agency-notice-liu', creator: 'agency', date: '2026-09-17', label: '9月17日', location: '槐城 · 文苑街道',
      title: '公开寻访｜刘若宁，13岁',
      text: '9月11日傍晚6点30分左右，刘若宁外出到文苑图书馆附近还书，此后未归。红棕色针织开衫、白色T恤、浅蓝牛仔裤，携带米色帆布书袋。照片经家属同意用于寻访。',
      photos: ['missing-liu'], tags: ['寻亲信息', '刘若宁', '文苑'], likes: 607,
      comments: [{id: 'liu-extra-1', creator: 'city', text: '转了，希望还书的路上有人见过她。', date: '9月17日', likes: 17, replies: [{id: 'liu-extra-1a', creator: 'agency', text: '谢谢帮忙转发，有进展我们会更新。', date: '9月17日', likes: 2, link: {type: 'url', url: 'https://www.guijia.example/record?id=QH-0392', label: '刘若宁的公开寻人登记'}}]}]
    },
    {
      id: 'street-notice-he', creator: 'street', date: '2026-09-17', label: '9月17日', location: '槐城 · 石桥里',
      title: '何小安，手里那把伞是绿色的',
      text: '帮转：何小安，10岁，9月13日下午5点10分左右在石桥里便民市场走失。浅灰卫衣、藏蓝长裤、黑白运动鞋，拿绿色折叠伞。父亲去取修补的衣服，回头就没看到孩子。请附近认识的商户帮忙留意。',
      photos: ['missing-he'], tags: ['寻人', '何小安', '石桥里'], likes: 541,
      comments: [{id: 'he-extra-1', creator: 'city', text: '我这边也转一遍，别被刷过去了。', date: '9月17日', likes: 13, replies: [{id: 'he-extra-1a', creator: 'street', text: '归家寻亲有他家里的登记，有更新我也会接着转。', date: '9月17日', likes: 6, link: {type: 'url', url: 'https://www.guijia.example/record?id=QH-0374', label: '何小安的公开寻人登记'}}]}]
    },
    {
      id: 'city-notice-zhou', creator: 'city', date: '2026-09-17', label: '9月17日', location: '槐城 · 南湖街道',
      title: '帮转周淑琴阿姨的寻人信息',
      text: '周淑琴，62岁，9月12日下午4点30分左右出门散步，最后已知地点在湖滨步道北入口附近。梅紫色针织外套、黑色长裤、棕色小挎包。手机在家充电，没有带出门。家属继续寻找，愿平安。',
      photos: ['missing-zhou'], tags: ['寻人', '周淑琴', '南湖'], likes: 426,
      comments: [{id: 'zhou-extra-1', creator: 'zhao', text: '湖边常去，转到我们骑行群了。', date: '9月17日', likes: 8, replies: [{id: 'zhou-extra-1a', creator: 'city', text: '谢谢你们，麻烦把日期也一起转过去。', date: '9月17日', likes: 5, link: {type: 'url', url: 'https://www.guijia.example/record?id=QH-0358', label: '周淑琴的公开寻人登记'}}]}]
    },
    {
      id: 'awen-paper-edges', creator: 'awen', date: '2026-09-04', label: '9月4日', location: '槐城 · 东楼',
      title: '一沓旧纸，别急着裁边',
      text: '这几张扫描件只扫了正文，前后顺序都对不上。页边的印、背面的字不能裁掉。图二是以前的工位，没拍到桌边那一大摞纸箱。',
      photos: ['feed-awen-paper-edges','douyin-admin'], tags: ['网站维护', '旧档案', '扫图'], likes: 82,
      comments: [{id: 'edges-extra-1', creator: 'city', text: '模糊的旧字你也会认？', date: '9月4日', likes: 4, replies: [{id: 'edges-extra-1a', creator: 'awen', text: '有些认不出来，就留原图，找字间校读帮忙。硬猜容易认错。', date: '9月4日', likes: 9, link: {type: 'official', id: 'translator', label: '字间校读'}}]}]
    },
    {
      id: 'city-old-street-name', creator: 'city', date: '2026-09-11', label: '9月11日', location: '槐城 · 榆树路',
      title: '奶奶说的东棚口，原来就在这里',
      text: '去看槐城旧志那篇榆树路，才知道家里老人一直说的东棚口就是这附近。她报老地名，我在地图上搜了半天。照片一摆出来，她说，早告诉你就是那个棚子。',
      photos: ['douyin-station'], tags: ['旧地名', '榆树路', '槐城旧志'], likes: 194,
      comments: [{id: 'name-extra-1', creator: 'street', text: '旧门牌也有人留着，外地人一听还以为是两条路。', date: '9月11日', likes: 16, replies: [{id: 'name-extra-1a', creator: 'city', text: '我看的那篇在这个号里，名字没变之前的事写得挺细。', date: '9月11日', likes: 5, link: {type: 'official', id: 'localrecords', label: '槐城旧志'}}]}]
    },
    {
      id: 'lamp-paper-margins', creator: 'lamp', date: '2026-09-03', label: '9月3日', location: '槐城 · 老城',
      title: '旧纸旁边的两个小印',
      text: '这张旧页边上原有两个小印，扫描时被当成脏点擦掉了，只好找出原件重拍。抄的时候也要留着，哪怕看不懂。图二是存这些旧纸的小院。',
      photos: ['feed-lamp-two-seals','feed-lamp-courtyard'], tags: ['旧纸', '抄本', '留存'], likes: 69,
      comments: [{id: 'margins-extra-1', creator: 'awen', text: '扫描也经常这样，自动去污把边角吃掉了。', date: '9月3日', likes: 7, replies: [{id: 'margins-extra-1a', creator: 'lamp', text: '还好原件在。读序要连印记一起看，得请校读的人帮着认。', date: '9月3日', likes: 6, link: {type: 'official', id: 'translator', label: '字间校读'}}]}]
    },
    {
      id: 'agency-family-room', creator: 'agency', date: '2026-09-17', label: '9月17日', location: '槐城 · 家庭服务中心',
      title: '家属休息区已开放',
      text: '休息区已整理好，前来登记、等候消息的家属都可以使用。亲人回家后如有适应上的困难，也可联系我们。',
      photos: ['cover-xu'], tags: ['家庭陪伴', '团圆之后'], likes: 458,
      comments: [{id: 'family-room-extra-1', creator: 'lamp', text: '你们先说清楚，送回去的到底是谁。', date: '9月17日', likes: 34, replies: [{id: 'family-room-extra-1a', creator: 'agency', text: '家属好不容易盼到团圆，请不要在这里发布没有根据的说法。', date: '9月17日', likes: 8}, {id: 'family-room-extra-1b', creator: 'lamp', text: '他们等了这么久，更不能拿这种事糊弄他们。', date: '9月17日', likes: 41}]}, {id: 'family-room-extra-2', creator: 'city', text: '怎么每次看到你们两个，都在争这个。', date: '9月18日', likes: 16, replies: []}]
    },
    {
      id: 'lamp-keep-waiting', creator: 'lamp', date: '2026-09-18', label: '9月18日', location: '槐城 · 守灯小院',
      title: '还没找到的人，启事不能撤',
      text: '最近来帮忙的人少了，院里这些寻人启事还会照常整理。有人问，平台说已经接人回家了，是不是就该撤掉？我们得先问清楚，回来的到底是不是家属要找的那个人。',
      photos: ['god-lamp'], tags: ['寻人启事', '等待'], likes: 91,
      comments: [{id: 'waiting-extra-1', creator: 'agency', text: '已经完成接领的家庭，请以最新服务记录为准，不要再传播旧信息。', date: '9月18日', likes: 4, replies: [{id: 'waiting-extra-1a', creator: 'lamp', text: '你们改了登记，那原来那个孩子呢？', date: '9月18日', likes: 29}]}, {id: 'waiting-extra-2', creator: 'city', text: '院里以前的文章还能看吗？', date: '9月18日', likes: 3, replies: [{id: 'waiting-extra-2a', creator: 'lamp', text: '没删，旧稿和之前整理的文章都还在这个号里。', date: '9月18日', likes: 7, link: {type: 'official', id: 'lamphouse', label: '守灯小院'}}]}]
    },
    {
      id: 'agency-return-routine', creator: 'agency', date: '2026-09-24', label: '9月24日', location: '槐城 · 家庭服务中心', requires: 'found',
      title: '从一件熟悉的小事开始',
      text: '亲人刚回家时，可先恢复原来的用餐、休息安排，不必急着追问离家期间的经历。如有不适应的情况，请联系家属服务人员，并保留陪伴记录。',
      photos: ['web-bg-agency'], tags: ['回家以后', '家庭陪伴'], likes: 327,
      comments: [{id: 'routine-extra-1', creator: 'city', text: '我认识的一家说，人回来了，端杯子的动作却每次都一模一样。杯子空了也照做。', date: '9月24日', likes: 17, replies: [{id: 'routine-extra-1a', creator: 'agency', text: '这说明您提供的资料已经起效。其他时候有不适应的，也请继续补充记录。', date: '9月24日', likes: 1}, {id: 'routine-extra-1b', creator: 'lamp', text: '杯子空了还在喝，你们也说正常？家属先留好旧照片，别急着撤掉寻人启事。', date: '9月24日', likes: 23}]}]
    }
  ];

  // A stable mixed feed: preserve the original entry point without treating every swipe as a clue.
  for (const post of posts) if (!DOUYIN_POSTS.some(existing => existing.id === post.id)) DOUYIN_POSTS.push(post);
  const order = [
    'street-rain', 'city-morning-market', 'city-notice-wang', 'awen-first-day',
    'zhao-ride-noodles', 'street-stair-cat', 'agency-notice-liu', 'city-window',
    'city-rain-laundry', 'awen-backup', 'street-notice-sun', 'agency-family-room',
    'zhao-cloudy-route', 'city-notice-zhao', 'lamp-paper-margins', 'agency-shift',
    'city-community-counter', 'street-notice-he', 'awen-paper-edges', 'zhao-sea',
    'city-notice-zhou', 'city-old-street-name', 'street-repair', 'lamp-paper',
    'agency-prayer', 'lamp-keep-waiting', 'agency-return-routine'
  ];
  const byId = new Map(DOUYIN_POSTS.map(post => [post.id, post]));
  DOUYIN_POSTS.splice(0, DOUYIN_POSTS.length,
    ...order.map(id => byId.get(id)).filter(Boolean),
    ...DOUYIN_POSTS.filter(post => !order.includes(post.id))
  );
})();
