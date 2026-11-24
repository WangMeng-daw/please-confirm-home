/* Family photographs and ordinary social history. Loaded before phone state. */
(() => {
  const data = window.GAME_DATA;
  const photo = (id, date, clock, number, details = {}) => ({
    title: `IMG_${number}.JPG`,
    file: id,
    takenAt: `${date}T${clock}:00+08:00`,
    date: `${Number(date.slice(0, 4))}年${Number(date.slice(5, 7))}月${Number(date.slice(8, 10))}日`,
    time: clock,
    device: 'iPhone 14 Pro',
    lens: '主摄 — 26 mm ƒ1.8',
    size: '2.4 MB',
    location: '槐城区 · 家',
    album: '最近项目',
    ...details
  });

  Object.assign(data.photos, {
    past_beach: photo('past_beach', '2026-05-03', '16:42', '4827', {
      initial: true, location: '临海市 · 东湾', size: '3.1 MB', keywords: ['海边','海滩','大海','鲸鱼']
    }),
    past_breakfast: photo('past_breakfast', '2026-05-16', '08:13', '4903', {
      initial: true, device: '李岚的 iPhone 13', size: '2.2 MB'
    }),
    past_drawing: photo('past_drawing', '2026-07-04', '15:27', '5184', {
      initial: true, device: '来自微信', lens: '已存储图像', location: '槐城区 · 实验小学', size: '1.8 MB'
    }),
    past_rabbit: photo('past_rabbit', '2026-06-11', '18:25', '5039', {
      initial: true, size: '2.6 MB'
    }),
    past_sleep: photo('past_sleep', '2026-07-19', '22:06', '5271', {
      initial: true, device: '李岚的 iPhone 13', lens: '主摄 — 26 mm ƒ1.6', size: '1.9 MB'
    }),
    home_shoes: photo('home_shoes', '2026-09-24', '20:58', '5820', {
      requires: 'found', device: '李岚的 iPhone 13', lens: '主摄 — 26 mm ƒ1.6', size: '2.3 MB'
    }),
    home_dinner: photo('home_dinner', '2026-09-24', '21:51', '5824', {
      requires: 'settled', device: '李岚的 iPhone 13', lens: '主摄 — 26 mm ƒ1.6', size: '2.2 MB'
    }),
    home_drawing: photo('home_drawing', '2026-09-24', '22:06', '5827', {
      requires: 'settled', device: '李岚的 iPhone 13', lens: '主摄 — 26 mm ƒ1.6', size: '2.5 MB'
    }),
    home_rabbit: photo('home_rabbit', '2026-09-24', '22:11', '5829', {
      requires: 'settled', device: '李岚的 iPhone 13', lens: '主摄 — 26 mm ƒ1.6', size: '2.4 MB'
    }),
    home_sleep: photo('home_sleep', '2026-09-24', '22:20', '5831', {
      requires: 'memory', device: '来自微信', lens: '已存储图像', location: '', size: '1.7 MB'
    })
  });

  data.photos.before.initial = true;
  data.photos.before.takenAt = '2026-06-11T18:24:00+08:00';
  data.photos.returned.takenAt = '2026-09-24T21:43:00+08:00';
  data.photos.returned.requires = 'found';
  data.photos.door.takenAt = '2026-09-24T22:17:00+08:00';
  data.photos.door.requires = 'memory';
  data.photos.lead.takenAt = '2026-08-13T20:10:00+08:00';
  data.photos.lead.requires = 'verified';

  const posts = [
    {
      id: 'family_evening', person: 'wife', date: '9月24日 22:11', sortAt: '2026-09-24T22:11:00+08:00', requires: 'settled',
      text: '饭还温着。她说想坐一会儿，画完再吃。\n今天先不催了。',
      photos: ['home_dinner', 'home_drawing', 'home_rabbit'],
      likes: ['刘老师'], comments: [
        {name: '刘老师', text: '不用急着恢复上课，先好好休息。'},
        {name: '李岚', text: '嗯，谢谢刘老师。'}
      ]
    },
    {
      id: 'family_back_home', person: 'wife', date: '9月24日 21:09', sortAt: '2026-09-24T21:09:00+08:00', requires: 'found',
      text: '到家了。\n谢谢这些天帮我们找孩子的人，消息没能一一回复，真的谢谢大家。',
      photos: ['home_shoes'],
      likes: ['老赵', '刘老师'], comments: [
        {name: '老赵', text: '太好了。我把寻人那条先撤下来。'},
        {name: '刘老师', text: '平安回来就好。'},
        {name: '李岚', text: '让大家跟着操心了。'}
      ]
    },
    {
      id: 'school_friday', person: 'teacher', date: '9月18日 15:42', sortAt: '2026-09-18T15:42:00+08:00',
      text: '这周第一次准时下班。买了两把青菜，回家煮面。',
      likes: [], comments: []
    },
    {
      id: 'bike_repair', person: 'friend', date: '9月12日 11:26', sortAt: '2026-09-12T11:26:00+08:00',
      text: '异响找到了，车筐螺丝松了。后轮白拆一回。',
      likes: [], comments: []
    },
    {
      id: 'wife_album', person: 'wife', date: '8月30日 23:08', sortAt: '2026-08-30T23:08:00+08:00',
      text: '以前总嫌手机空间不够。这一个月，一张照片都没删。',
      likes: ['刘老师', '老赵'], comments: []
    },
    {
      id: 'summer_homework', person: 'daughter', date: '8月9日 17:05', sortAt: '2026-08-09T17:05:00+08:00',
      text: '数学还有好多页，今天不想写了。',
      likes: ['老赵'], comments: [
        {name: '李岚', text: '先把今天那两页写完。'},
        {name: '小禾', text: '你怎么也看朋友圈。'},
        {name: '林砚', text: '不会的留着，晚上一起看。'}
      ]
    },
    {
      id: 'sleepy_waiting', person: 'wife', date: '7月19日 22:14', sortAt: '2026-07-19T22:14:00+08:00',
      text: '非要等爸爸，没等到就睡着了。',
      photos: ['past_sleep'],
      likes: ['林砚', '老赵'], comments: [
        {name: '林砚', text: '我已经到楼下了。'},
        {name: '李岚', text: '轻一点开门。'}
      ]
    },
    {
      id: 'drawing_house', person: 'me', date: '7月4日 18:21', sortAt: '2026-07-04T18:21:00+08:00',
      text: '周末社团的画，小禾说这是我们家。我问车位在哪，她说纸不够大。',
      photos: ['past_drawing'],
      likes: ['李岚', '刘老师'], comments: [
        {name: '小禾', text: '因为你老停歪。'},
        {name: '老赵', text: '哈哈，你车确实老停歪。'},
        {name: '林砚', text: '下次给我留点面子。'}
      ]
    },
    {
      id: 'forgotten_raincoat', person: 'friend', date: '6月28日 09:51', sortAt: '2026-06-28T09:51:00+08:00',
      text: '带了水，带了打气筒，带了补胎工具。\n没带雨衣。只能在早餐店等雨停了。',
      likes: ['林砚', '李岚'], comments: [{name: '林砚', text: '豆腐脑帮我打包一份。'}]
    },
    {
      id: 'birthday_outtakes', person: 'wife', date: '6月11日 20:07', sortAt: '2026-06-11T20:07:00+08:00',
      text: '拍生日照拍了十分钟。\n蛋糕还没吃，蜡烛先点了三次。',
      photos: ['past_rabbit'],
      likes: ['林砚', '刘老师', '老赵'], comments: [
        {name: '小禾', text: '这张能不能不发。'},
        {name: '李岚', text: '我觉得这张可爱。'},
        {name: '老赵', text: '小禾生日快乐，下次叔叔请你吃冰淇淋。'},
        {name: '小禾', text: '说话算话！'}
      ]
    },
    {
      id: 'childrens_day', person: 'teacher', date: '6月1日 17:38', sortAt: '2026-06-01T17:38:00+08:00',
      text: '游园会顺利结束，感谢来帮忙的家长。落下的保温杯和校服外套放在班级失物箱，明天记得来领。',
      likes: ['林砚', '李岚'], comments: [{name: '李岚', text: '辛苦老师们了。'}]
    },
    {
      id: 'saturday_breakfast', person: 'wife', date: '5月16日 08:31', sortAt: '2026-05-16T08:31:00+08:00',
      text: '周六，不催她，慢慢吃。',
      photos: ['past_breakfast'],
      likes: ['林砚', '刘老师'], comments: [
        {name: '林砚', text: '给我留半个包子。'},
        {name: '李岚', text: '留在锅里了，自己热。'}
      ]
    },
    {
      id: 'little_whale_day', person: 'daughter', date: '5月3日 18:06', sortAt: '2026-05-03T18:06:00+08:00',
      text: '鲸鱼还没有名字。\n今天的海风好大！',
      photos: ['past_beach'], location: '临海市 · 东湾',
      likes: ['林砚', '李岚', '老赵'], comments: [
        {name: '林砚', text: '进门前把袜子里的沙子倒了啊。'},
        {name: '小禾', text: '已经倒了。'},
        {name: '李岚', text: '倒在你爸爸鞋里了。'}
      ]
    },
    {
      id: 'trip_planning', person: 'friend', date: '4月26日 19:03', sortAt: '2026-04-26T19:03:00+08:00',
      text: '五一去东湾，房间订好了。有附近吃饭的地方推荐吗？',
      likes: ['李岚'], comments: [
        {name: '林砚', text: '别忘了留个后备箱的位置。'},
        {name: '老赵', text: '你们一家三口到底带多少东西。'}
      ]
    }
  ];

  const originalDates = {
    zhao: '2026-09-18T17:30:00+08:00',
    wife: '2026-09-10T19:46:00+08:00',
    birthday: '2026-06-11T18:32:00+08:00',
    trip: '2026-05-03T17:12:00+08:00'
  };
  for (const entry of data.moments) {
    if (originalDates[entry.id]) entry.sortAt = originalDates[entry.id];
    if (entry.photo && !entry.photos) entry.photos = [entry.photo];
  }
  data.moments = [...posts, ...data.moments].sort((a, b) => String(b.sortAt || '').localeCompare(String(a.sortAt || '')));

  const historyAdditions = {
    daughter: [
      {date: '5月3日 17:08', contentId: 'photo-history-daughter-1'},
      {type: 'image', text: '', photo: 'past_beach', contentId: 'photo-history-daughter-2'},
      {text: '让妈妈给我拍的。', contentId: 'photo-history-daughter-3'},
      {text: '我们走到停车场了，你和赵叔叔在哪？', contentId: 'photo-history-daughter-4'},
      {me: true, text: '拿水呢，马上。别站在车道上。', contentId: 'photo-history-daughter-5'}
    ],
    wife: [
      {date: '5月16日 08:17', contentId: 'photo-history-wife-1'},
      {type: 'image', text: '', photo: 'past_breakfast', contentId: 'photo-history-wife-2'},
      {text: '终于肯好好吃早饭了。你那份在锅里。', contentId: 'photo-history-wife-3'},
      {me: true, text: '我买完牛奶就上来。', contentId: 'photo-history-wife-4'},
      {date: '7月19日 22:08', contentId: 'photo-history-wife-5'},
      {type: 'image', text: '', photo: 'past_sleep', contentId: 'photo-history-wife-6'},
      {text: '说要等你回来，刚躺下就睡着了。', contentId: 'photo-history-wife-7'},
      {me: true, text: '床头灯给她留着，我还有十分钟。', contentId: 'photo-history-wife-8'}
    ],
    teacher: [
      {date: '7月4日 15:36', contentId: 'photo-history-teacher-1'},
      {type: 'image', text: '', photo: 'past_drawing', contentId: 'photo-history-teacher-2'},
      {text: '今天社团活动画家里的样子，小禾说还有一点没画完，纸让她带回去了。', contentId: 'photo-history-teacher-3'},
      {me: true, text: '收到了，谢谢刘老师。', contentId: 'photo-history-teacher-4'},
      {text: '铅笔盒放在学校了，周一到讲台抽屉拿就行。', contentId: 'photo-history-teacher-5'}
    ]
  };
  for (const [person, messages] of Object.entries(historyAdditions)) {
    data.histories[person] = [...messages, ...data.histories[person]];
  }

  window.PHOTO_EXPANSION = {
    version: 1,
    initialPhotos: ['past_beach', 'past_breakfast', 'past_rabbit', 'past_drawing', 'past_sleep'],
    afterReturnPhotos: ['home_shoes'],
    afterSettledPhotos: ['home_dinner', 'home_drawing', 'home_rabbit'],
    afterMemoryPhotos: ['home_sleep'],
    posts,
    historyAdditions
  };

  // Update only known shipped content; never replace whole saved social threads.
  const previousText = {
    zhao: '又开始下雨。回家路上慢点。',
    school_friday: '周五最后一节课，收上来三本没有写名字的作业。\n有一本每道题都对，实在很想知道是哪位小朋友。',
    bike_repair: '研究了半天异响，修车师傅拧了一下车筐。\n收了我五块钱。我觉得主要是看我可怜。',
    wife_album: '手机总说空间不够。翻到这些，又一张也舍不得删。',
    summer_homework: '暑假作业只剩一点点了。\n一点点的意思是数学还没开始。',
    sleepy_waiting: '刚说完“我一点也不困”。\n另一只袜子不知道又踢到哪里了。',
    drawing_house: '刘老师发来的。说这是我们家。\n我问为什么没有我的车位，她说画纸不够大。',
    childrens_day: '游园会结束。保温杯和校服外套在班级失物箱，明天记得来领。\n还有一袋没开封的薯片，我已经尽力保护了。',
    saturday_breakfast: '好不容易不用赶着出门，吃个早饭花了四十分钟。\n桌子比人吃得多。',
    little_whale_day: '今天捡到两块石头，买到一只鲸鱼。\n袜子里的沙子也带回来了。',
    trip_planning: '假期去海边。天气预报每天变一次，订好的房间倒是一天比一天便宜。'
  };
  const removedComments = {
    school_friday: [{name: '老赵', text: '我小时候专挑没做完的时候不写名字。'}],
    wife_album: [{name: '刘老师', text: '画画那张我这里也存着。'}, {name: '李岚', text: '谢谢您一直留着。'}]
  };
  const changedComments = {
    summer_homework: [
      {name: '李岚', from: '我在客厅听见了。', to: '先把今天那两页写完。'},
      {name: '林砚', from: '晚上一起看两页。', to: '不会的留着，晚上一起看。'}
    ],
    birthday_outtakes: [{name: '小禾', from: '第一张能不能不发。', to: '这张能不能不发。'}]
  };
  window.MOMENT_CONTENT_REFRESH = {
    version: 2,
    apply(state) {
      if (!state || (state.momentDetailVersion || 0) >= this.version) return false;
      for (const entry of state.moments || []) {
        const source = data.moments.find(item => item.id === entry.id);
        if (!source) continue;
        if (previousText[entry.id] && entry.text === previousText[entry.id]) entry.text = source.text;
        if (entry.id === 'horror_whale_repost' && entry.text === previousText.little_whale_day) entry.text = source.text;
        if (entry.id === 'zhao' && entry.art === 'sea') delete entry.art;
        if (entry.id === 'wife_album' && JSON.stringify(entry.photos) === JSON.stringify(['past_beach', 'past_sleep', 'past_drawing'])) delete entry.photos;
        if (entry.id === 'birthday_outtakes' && JSON.stringify(entry.photos) === JSON.stringify(['past_rabbit', 'before'])) entry.photos = ['past_rabbit'];
        if (entry.id === 'bike_repair' && Array.isArray(entry.likes)) entry.likes = entry.likes.filter(name => name !== '刘老师');
        if (!Array.isArray(entry.comments)) continue;
        entry.comments = entry.comments.filter(comment => !(removedComments[entry.id] || []).some(seed => seed.name === comment.name && seed.text === comment.text));
        for (const comment of entry.comments) {
          const edit = (changedComments[entry.id] || []).find(seed => seed.name === comment.name && seed.from === comment.text);
          if (edit) comment.text = edit.to;
        }
      }
      for (const message of state.history?.daughter || []) {
        if (!message.me && message.text === '我还是想要海边那只小鲸鱼。') message.text = '我还是喜欢海边买的那只小鲸鱼。';
      }
      for (const message of state.history?.teacher || []) {
        if (!message.me && message.text === '今天美术课画家里的样子，小禾说还有一点没画完，纸让她带回去了。') message.text = '今天社团活动画家里的样子，小禾说还有一点没画完，纸让她带回去了。';
      }
      state.momentDetailVersion = this.version;
      return true;
    }
  };
})();
