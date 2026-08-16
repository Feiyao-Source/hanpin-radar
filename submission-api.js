document.querySelector('#reportForm').addEventListener('submit', async event => {
  event.preventDefault(); event.stopImmediatePropagation();
  const form = event.currentTarget;
  if (!form.checkValidity()) return form.reportValidity();
  const body = { company: document.querySelector('#reportCompany').value.trim(), role: document.querySelector('#reportRole').value.trim(), place: document.querySelector('#reportPlace').value.trim(), source: document.querySelector('#reportSource').value, firstSeen: document.querySelector('#reportFirstSeen').value, score: Number(document.querySelector('#reportScore').value), note: document.querySelector('#reportNote').value.trim(), photoName: document.querySelector('#reportPhoto').files[0]?.name || '' };
  const submit = form.querySelector('.submit'); submit.disabled = true; submit.textContent = '正在提交…';
  try { const response = await fetch('/api/submissions', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) }); if (!response.ok) throw new Error(); document.querySelector('#reportDialog').close(); form.reset(); document.querySelector('#photoPreview').hidden = true; alert('已提交审核。审核通过后会在地图和公司列表公开显示。'); } catch { alert('提交失败，请确认网站通过 http://localhost:8080 打开，或邮件联系 1348465638@qq.com。'); } finally { submit.disabled = false; submit.textContent = '提交审核 →'; }
}, true);
