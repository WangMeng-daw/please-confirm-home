/* Late photographs and social activity. Existing posts remain untouched. */
(() => {
  const data = window.GAME_DATA;
  const photo = (id, clock, number, requires) => ({
    title: `IMG_${number}.JPG`,
    file: id,
    takenAt: `2026-09-24T${clock}:00+08:00`,
    date: '2026年9月24日',
    time: clock,
    device: '来自微信',
    lens: '已存储图像',
    size: '2.3 MB',
    location: '',
    album: '最近项目',
    requires
  });

  Object.assign(data.photos, {
    reflection: photo('reflection', '22:21', '5833', 'memory'),
    threshold: photo('threshold', '22:28', '5837', 'inner'),
    hollow: {...photo('hollow', '22:31', '5840', 'hollowReceived'), lens: '微信接收图像'}
  });

  const posts = [
    {
      id: 'horror_mirror_photo', person: 'daughter', date: '9月24日 22:21',
      sortAt: '2026-09-24T22:21:00+08:00', requires: 'mirror',
      text: '妈妈给我拍的。', photos: ['reflection'], likes: [],
      comments: [{name: '李岚', text: '这张我没有发给你。'}]
    },
    {
      id: 'horror_whale_repost', person: 'daughter', date: '9月24日 22:28',
      sortAt: '2026-09-24T22:28:00+08:00', requires: 'inner',
      text: data.moments.find(m=>m.id==='little_whale_day').text,
      photos: ['past_beach'], likes: [],
      comments: [{name: '小禾', text: '爸，这张里面，我那时候在笑什么？'}]
    }
  ];

  data.moments.push(...posts);
  window.HORROR_CONTENT = {
    version: 1,
    posts,
    afterMemoryPhotos: ['reflection'],
    afterInnerPhotos: ['threshold']
  };
})();
