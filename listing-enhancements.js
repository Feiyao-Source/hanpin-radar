(() => {
  document.addEventListener('click',event => {
    const card=event.target.closest('.public-company');if(!card)return;
    setTimeout(() => {
      const content=document.querySelector('#dialogContent');if(!content||content.querySelector('.listing-feedback'))return;
      const box=document.createElement('div');box.className='listing-feedback';box.innerHTML='<button type="button" data-feedback="expired">报告招聘过期</button><button type="button" data-feedback="correction">提交地址/信息纠错</button>';content.append(box);
      box.onclick=e => {const type=e.target.dataset.feedback;if(!type)return;const name=card.querySelector('h3')?.textContent||'',place=card.querySelector('.company-main p')?.textContent.split('·')[1]?.trim()||'';document.querySelector('#companyDialog').close();document.querySelector('#reportCompany').value=name;document.querySelector('#reportPlace').value=place;document.querySelector('#reportRole').value=type==='expired'?'招聘状态纠错':'公司信息纠错';document.querySelector('#reportSource').value='其他';document.querySelector('#reportNote').value=type==='expired'?'该招聘信息可能已经过期，请管理员复核招聘来源和截止时间。':'该公司的地址或招聘信息可能不准确，请管理员根据补充说明复核。';document.querySelector('#reportDialog').showModal();document.querySelector('#reportNote').focus()};
    },0);
  });
})();
