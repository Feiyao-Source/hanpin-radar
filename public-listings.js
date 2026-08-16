(() => {
  const source = '武汉市人民政府公开招聘汇总（2026-07-14）';
  const entries = [
    { id:'pub-1', name:'湖北省荣军优抚医院', district:'洪山区', distance:'8.6 km', jobs:'人才引进 7 个岗位', status:'open', deadline:'2026-12-31', x:77, y:21, point:[30.493,114.430] },
    { id:'pub-2', name:'武汉市公安局', district:'江汉区', distance:'12.8 km', jobs:'警务辅助人员 231 人', status:'closed', deadline:'2026-07-14', x:23, y:29, point:[30.602,114.271] },
    { id:'pub-3', name:'武汉理工大学', district:'洪山区', distance:'6.4 km', jobs:'管理助理、宿舍管理员', status:'closed', deadline:'2026-07-17', x:39, y:75, point:[30.505,114.356] },
    { id:'pub-4', name:'湖北省妇幼保健院', district:'洪山区', distance:'5.8 km', jobs:'医疗岗位 17 个', status:'closed', deadline:'2026-07-22', x:61, y:61, point:[30.491,114.389] },
    { id:'pub-5', name:'湖北省教育投资有限公司', district:'武昌区', distance:'9.3 km', jobs:'招聘岗位 3 个', status:'closed', deadline:'2026-07-15', x:31, y:41, point:[30.551,114.329] },
    { id:'pub-6', name:'武汉市教育系统事业单位', district:'武汉市', distance:'10.0 km', jobs:'教育系统公开招聘', status:'closed', deadline:'2026-07-13', x:80, y:48, point:[30.604,114.390] }
  ];
  const $ = s => document.querySelector(s);
  function status(entry) { return entry.status === 'open' ? `<span class="listing-open">仍可报名 · 截止 ${entry.deadline}</span>` : `<span class="listing-closed">报名已截止 · ${entry.deadline}</span>`; }
  function card(entry) { return `<article class="company public-company" data-public="${entry.id}"><div class="score ${entry.status === 'open' ? 'positive' : 'neutral'}">官<small>来源</small></div><div class="company-main"><div class="company-name"><h3>${entry.name}</h3><span>${entry.distance}</span></div><p>公共招聘 · ${entry.district} <b>· ${entry.jobs}</b></p><div class="tags"><span>官方公告</span>${status(entry)}</div></div><button class="arrow">↗</button></article>`; }
  function addCards() { const box = $('#companies'); if (!box || box.querySelector('.public-company')) return; box.insertAdjacentHTML('beforeend', entries.map(card).join('')); $('#resultCount').textContent = box.querySelectorAll('.company').length; }
  function showEntry(id) { const entry = entries.find(item => item.id === id); $('#dialogContent').innerHTML = `<p class="eyebrow">OFFICIAL PUBLIC LISTING</p><h2>${entry.name}</h2><p class="detail-place">⌖ ${entry.district} · ${entry.distance}</p><div class="official-status">${status(entry)}</div><hr><h3>${entry.jobs}</h3><p class="review">此条目来自公开招聘公告。岗位和报名状态请以发布方原文为准。<small>${source}</small></p><a class="source-button" href="https://www.wuhan.gov.cn/zwgk/tzgg/202607/t20260714_2820584.shtml" target="_blank" rel="noopener">查看官方原公告 ↗</a><div class="privacy">暂未收录求职者风评。你可以提交面试地点照片与经历，帮助其他求职者。</div>`; $('#companyDialog').showModal(); }
  document.addEventListener('click', event => { const item = event.target.closest('.public-company'); if (item) showEntry(item.dataset.public); });
  new MutationObserver(addCards).observe($('#companies'), { childList: true }); addCards();
  const map = window.hanpinMap; if (map) entries.forEach(entry => L.marker(entry.point, { icon: L.divIcon({ className:'company-pin-wrap', html:`<span class="company-pin ${entry.status}">▣</span>`, iconSize:[32,32], iconAnchor:[16,16] }) }).addTo(map).bindTooltip(`${entry.name} · ${entry.status === 'open' ? '仍可报名' : '报名已截止'}`).on('click', () => showEntry(entry.id)));
})();
