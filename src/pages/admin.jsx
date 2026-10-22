import { useState } from 'react'
import { useStore, L, go, Badge, Avatar, Status, Modal, Confirm, Field, JobLogo, Pager, fmt, download, workSrc } from '../ui'
import { Shell } from './creator'
import { CATEGORIES, BADGES } from '../data'

const NAV = [['/admin', 'Dashboard'], ['/admin/jobs', 'Job Listings'], ['/admin/badges', 'Badge Verification'], ['/admin/creators', 'Creator Data'], ['/admin/moderation', 'Content Moderation'], ['/admin/reports', 'Reports']]
export function AdminShell({ p }) {
  const { setUser, say } = useStore()
  const [ask, setAsk] = useState(false)
  const sub = p[1] || '', active = sub === 'jobs' || sub === 'job' ? '/admin/jobs' : '/admin' + (sub ? '/' + sub : '')
  const page = { '': <Dash />, jobs: <Jobs />, job: <JobForm id={p[2]} />, badges: <Badges />, creators: <CreatorData />, moderation: <Moderation />, reports: <Reports /> }[sub]
  return <><Shell nav={NAV} active={active} onLogout={() => setAsk(true)}>{page || <div className="empty">Page not found.</div>}</Shell>
    {ask && <Confirm title="Log out?" text="You will return to the public home page." ok="Logout" onClose={() => setAsk(false)} onOk={() => { setUser(null); say('You have been logged out'); go('/') }} />}</>
}
const useReqAction = () => {
  const { reqs, setReqs, creators, setCreators, reqHist, setReqHist, say, creator } = useStore()
  return (r, ok, note = '') => {
    setReqs(reqs.map((x) => x.id === r.id ? { ...x, status: ok ? 'Approved' : 'Rejected', note: note || (ok ? 'Approved.' : '') } : x))
    if (ok) setCreators(creators.map((c) => c.id === r.creator ? { ...c, badge: r.to } : c))
    setReqHist(reqHist.map((h) => h.id === r.id ? { ...h, status: ok ? 'Approved' : 'Rejected', note: note || (ok ? 'Approved.' : '') } : h))
    say(`${creator(r.creator)?.name}: badge request ${ok ? 'approved' : 'rejected'}`)
  }
}

/* A-01 */
function Dash() {
  const { creators, works, jobs, reqs, reports } = useStore()
  const act = useReqAction()
  const pend = reqs.filter((r) => r.status === 'Pending'), rep = reports.filter((r) => r.status === 'Pending' || r.status === 'Under review')
  const soon = jobs.filter((j) => j.status === 'Active' && j.deadline <= '2026-11-20' && j.deadline >= '2026-10-22').length
  const byCat = CATEGORIES.map((c) => [c, works.filter((w) => w.cat === c).length]), max = Math.max(1, ...byCat.map((x) => x[1]))
  const byBadge = BADGES.map((b) => [b, creators.filter((c) => c.badge === b).length])
  return <>
    <h1>Admin Dashboard</h1>
    <div className="stats">
      <div className="stat"><span className="small muted">Total Creators</span><b>{creators.length}</b></div>
      <div className="stat"><span className="small muted">Total Works</span><b>{works.length}</b></div>
      <div className="stat"><span className="small muted">Active Jobs</span><b>{jobs.filter((j) => j.status === 'Active').length}</b></div>
      <div className={'stat' + (pend.length ? ' alert' : '')}><span className="small muted">Pending Badges</span><b>{pend.length}</b>{pend.length > 0 && <span className="small" style={{ color: 'var(--warn)' }}>Action needed</span>}</div>
    </div>
    <div className="two" style={{ gridTemplateColumns: '1.4fr 1fr 1fr' }}>
      <div className="panel"><h3>Works per Category</h3><div className="bars">{byCat.map(([c, n]) => <div key={c}><span>{n}</span><i style={{ height: `${n / max * 100}%` }} /><span>{c.replace(' Animation', '').replace('Motion Graphic', 'Motion')}</span></div>)}</div></div>
      <div className="panel"><h3>Creators per Badge</h3>{byBadge.map(([b, n]) => <div key={b}><div className="row between small"><b>{b}</b><span>{n}</span></div><div className="hb"><i style={{ width: `${n / creators.length * 100}%` }} /></div></div>)}</div>
      <div className="panel" style={{ background: '#222' }}><h3>Action Needed</h3>
        {[[pend.length, 'badge requests', '/admin/badges'], [rep.length, 'content reports', '/admin/moderation'], [soon, 'jobs closing soon', '/admin/jobs']].map(([n, t, to]) => <L key={t} to={to} className="row" style={{ padding: '8px 0' }}><b style={{ fontSize: 26, width: 36 }}>{n}</b><span className="muted">{t}</span></L>)}</div>
    </div>
    <div className="row between" style={{ margin: '24px 0 10px' }}><h3>Latest Badge Requests</h3><L to="/admin/badges" className="small muted">View all ›</L></div>
    {pend.length ? pend.slice(0, 3).map((r) => <ReqRow key={r.id} r={r} act={act} />) : <div className="empty">No pending badge requests.</div>}
  </>
}
function ReqRow({ r, act }) {
  const { creator } = useStore(); const c = creator(r.creator)
  return <div className="panel row between" style={{ padding: '10px 16px', marginBottom: 8 }}><div className="row"><Avatar c={c} /><b>{c?.name}</b></div><span className="muted small">{r.from} → {r.to} (proposed)</span>
    <div className="row"><button className="btn sm pri" onClick={() => act(r, true)}>Approve</button><button className="btn sm" onClick={() => act(r, false, 'Rejected from dashboard. See Badge Verification for details.')}>Reject</button></div></div>
}

/* A-02 */
function Jobs() {
  const { jobs, setJobs, say } = useStore()
  const [s, setS] = useState(''), [st, setSt] = useState('All'), [ty, setTy] = useState(''), [page, setPage] = useState(1), [del, setDel] = useState(null)
  const list = jobs.filter((j) => (j.title + j.company).toLowerCase().includes(s.toLowerCase()) && (st === 'All' || j.status === st) && (!ty || j.type === ty)), per = 6
  return <>
    <div className="row between"><h1>Manage Job Listings</h1><L to="/admin/job" className="btn pri">+ Add Job</L></div>
    <div className="tb" style={{ marginTop: 14 }}>
      <input type="search" placeholder="Search position / studio…" value={s} onChange={(e) => { setS(e.target.value); setPage(1) }} aria-label="Search" />
      {['All', 'Active', 'Draft', 'Closed'].map((x) => <button key={x} className={'pill' + (st === x ? ' on' : '')} onClick={() => { setSt(x); setPage(1) }}>{x}</button>)}
      <span className="grow" /><select value={ty} onChange={(e) => { setTy(e.target.value); setPage(1) }} aria-label="Type"><option value="">Type: All</option><option>Internship</option><option>Full-time</option><option>Freelance</option></select>
    </div>
    <div className="tblwrap"><table className="tbl"><thead><tr><th>Position</th><th>Studio / Company</th><th>Type</th><th>Deadline</th><th>Interested</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>{list.slice((page - 1) * per, page * per).map((j) => <tr key={j.id}><td><b>{j.title}</b></td><td>{j.company}</td><td>{j.type}</td><td>{fmt(j.deadline)}</td><td>{j.interested}</td><td><Status s={j.status} /></td>
        <td><div className="row" style={{ gap: 6 }}><L to={`/admin/job/${j.id}`} className="btn sm">Edit</L><button className="btn sm dan" onClick={() => setDel(j)}>Delete</button></div></td></tr>)}</tbody></table></div>
    {!list.length && <div className="empty" style={{ marginTop: 12 }}>No jobs match your filters.</div>}
    <div className="row between" style={{ marginTop: 10 }}><span className="small muted">Showing {list.length ? (page - 1) * per + 1 : 0}–{Math.min(page * per, list.length)} of {list.length} jobs</span><Pager page={page} pages={Math.ceil(list.length / per)} set={setPage} /></div>
    {del && <Confirm title="Delete this job?" text="This action cannot be undone." onClose={() => setDel(null)} onOk={() => { setJobs(jobs.filter((j) => j.id !== del.id)); say('Job deleted') }} />}
  </>
}

/* A-03 */
function JobForm({ id }) {
  const { jobs, setJobs, say } = useStore()
  const old = jobs.find((j) => j.id === id)
  const [f, setF] = useState(old ? { ...old, qualText: old.qual.join('\n') } : { title: '', company: '', type: '', location: '', deadline: '', apply: '', desc: '', qualText: '', status: 'Active' })
  const [tried, setTried] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const e = { title: !f.title.trim() && 'Position is required', company: !f.company.trim() && 'Studio / company is required', type: !f.type && 'Select a type', deadline: !f.deadline && 'Deadline is required', apply: !/^https?:\/\//.test(f.apply) && 'Enter a valid link starting with https://' }
  const save = (status) => {
    setTried(true); if (Object.values(e).some(Boolean)) return
    const job = { ...(old || { id: 'j' + Date.now(), interested: 0, posted: '2026-10-22', skills: [] }), ...f, status, qual: f.qualText.split('\n').filter(Boolean) }; delete job.qualText
    setJobs(old ? jobs.map((j) => j.id === old.id ? job : j) : [job, ...jobs]); say(status === 'Draft' ? 'Draft saved' : 'Job published'); go('/admin/jobs')
  }
  const pv = { title: f.title || 'Position / Job Title', company: f.company || 'Studio Name', type: f.type || 'Internship' }
  return <div className="two" style={{ gridTemplateColumns: '1.6fr 1fr' }}>
    <div><h1>{old ? 'Edit Job' : 'Add New Job'}</h1><p className="small muted" style={{ marginBottom: 16 }}><L to="/admin/jobs">Job Listings</L> › {old ? 'Edit' : 'Add'} Job</p>
      <Field label="Position / Job Title *" err={tried && e.title}><input type="text" value={f.title} onChange={set('title')} placeholder="e.g. 3D Animator Intern" /></Field>
      <div className="row" style={{ alignItems: 'flex-start' }}>
        <div className="grow"><Field label="Studio / Company *" err={tried && e.company}><input type="text" value={f.company} onChange={set('company')} placeholder="Studio name" /></Field></div>
        <div className="grow"><Field label="Type *" err={tried && e.type}><select value={f.type} onChange={set('type')}><option value="">Select type</option><option>Internship</option><option>Full-time</option><option>Freelance</option></select></Field></div></div>
      <div className="row" style={{ alignItems: 'flex-start' }}>
        <div className="grow"><Field label="Location"><input type="text" value={f.location} onChange={set('location')} placeholder="e.g. Batam / Remote" /></Field></div>
        <div className="grow"><Field label="Deadline *" err={tried && e.deadline}><input type="date" value={f.deadline} onChange={set('deadline')} /></Field></div></div>
      <Field label="Application Link (external) *" err={tried && e.apply}><input type="url" value={f.apply} onChange={set('apply')} placeholder="https://" /></Field>
      <Field label="Description"><textarea value={f.desc} onChange={set('desc')} placeholder="Describe the role & responsibilities…" /></Field>
      <Field label="Qualifications" hint="One qualification per line"><textarea value={f.qualText} onChange={set('qualText')} placeholder="Required qualifications & skills…" /></Field>
      <div className="row between"><button className="btn" onClick={() => go('/admin/jobs')}>Cancel</button><div className="row"><button className="btn" onClick={() => save('Draft')}>Save Draft</button><button className="btn pri" onClick={() => save('Active')}>Publish</button></div></div>
    </div>
    <div className="stack"><h3 style={{ marginTop: 6 }}>Job Card Preview</h3>
      <div className="jobrow" style={{ gridTemplateColumns: '48px 1fr' }}><JobLogo j={pv} /><div><b>{pv.title}</b><div className="small muted">{pv.company}</div><span className="pill on" style={{ marginTop: 6 }}>{pv.type}</span></div></div>
      <div className="note">This card appears on the Home and Jobs pages, visible to all visitors without login, only when the status is Active and the deadline has not passed.</div></div>
  </div>
}

/* A-04 */
function Badges() {
  const { reqs, creator } = useStore()
  const act = useReqAction()
  const [tab, setTab] = useState('Pending'), [sel, setSel] = useState(null), [note, setNote] = useState(''), [err, setErr] = useState('')
  const list = reqs.filter((r) => r.status === tab), cur = list.find((r) => r.id === sel) || list[0], c = cur && creator(cur.creator)
  const n = (s) => reqs.filter((r) => r.status === s).length
  return <>
    <h1>Creator Badge Verification</h1>
    <div className="tb" style={{ marginTop: 12 }}>{['Pending', 'Approved', 'Rejected'].map((t) => <button key={t} className={'pill' + (tab === t ? ' on' : '')} onClick={() => { setTab(t); setSel(null); setErr('') }}>{t}{t === 'Pending' ? ` (${n(t)})` : ''}</button>)}</div>
    {!list.length ? <div className="empty">No {tab.toLowerCase()} requests.</div> : <div className="two" style={{ gridTemplateColumns: '1fr 1fr' }}>
      <div className="list">{list.map((r) => { const x = creator(r.creator); return <button key={r.id} className={r.id === cur.id ? 'on' : ''} onClick={() => { setSel(r.id); setErr(''); setNote('') }}><Avatar c={x} /><div className="grow"><b>{x?.name}</b><div className="small muted">{r.from} → {r.to} (proposed)</div></div><span className="small muted">{fmt(r.date)}</span></button> })}</div>
      <div className="panel"><h3>Request Details</h3>
        <div className="row" style={{ marginBottom: 12 }}><Avatar c={c} cls="md" /><div><b>{c.name}</b><div className="small muted">{c.status} · {c.spec}</div></div></div>
        <div className="row" style={{ marginBottom: 12 }}><Badge b={cur.from} />→<Badge b={cur.to} /></div>
        {[['Number of works', cur.works], ['Project experience', cur.exp], ['Showreel', cur.showreel ? 'Added' : 'Not added']].map(([a, b]) => <div className="row between small" key={a} style={{ padding: '4px 0' }}><span className="muted">{a}</span><b>{b}</b></div>)}
        <p style={{ margin: '12px 0 6px' }}><L to={`/creators/${c.id}`} style={{ color: 'var(--acc)', fontWeight: 700 }} target="_blank">View profile & portfolio ↗</L></p>
        <b className="small">Reason for request:</b><p className="small muted" style={{ marginBottom: 12 }}>{cur.reason}</p>
        {cur.status === 'Pending' ? <>
          <Field label="Admin Notes" err={err}><textarea value={note} onChange={(e) => { setNote(e.target.value); setErr('') }} placeholder="Write a note (required if rejecting)…" /></Field>
          <div className="row"><button className="btn grow" onClick={() => { if (!note.trim()) return setErr('A note is required when rejecting.'); act(cur, false, note); setNote('') }}>Reject</button><button className="btn pri grow" onClick={() => { act(cur, true, note); setNote('') }}>Approve</button></div></>
          : <div className="note"><Status s={cur.status} /> {cur.note}</div>}
      </div></div>}
  </>
}

/* A-05 */
function CreatorData() {
  const { creators, setCreators, works, say } = useStore()
  const [f, setF] = useState({ q: '', badge: '', status: '', acc: '' }), [view, setView] = useState(null), [ed, setEd] = useState(null)
  const list = creators.filter((c) => (c.name + c.email).toLowerCase().includes(f.q.toLowerCase()) && (!f.badge || c.badge === f.badge) && (!f.status || c.status === f.status) && (!f.acc || (c.active ? 'Active' : 'Inactive') === f.acc))
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const wn = (c) => works.filter((w) => w.creator === c.id).length
  return <>
    <div className="row between"><h1>Creator Data</h1><span className="muted small">{list.length} creators</span></div>
    <div className="tb" style={{ marginTop: 12 }}>
      <input type="search" style={{ flex: 1 }} placeholder="Search name or email…" value={f.q} onChange={set('q')} aria-label="Search" />
      <select value={f.badge} onChange={set('badge')} aria-label="Badge"><option value="">Badge</option>{BADGES.map((b) => <option key={b}>{b}</option>)}</select>
      <select value={f.status} onChange={set('status')} aria-label="Status"><option value="">Status</option><option>Student</option><option>Alumni</option></select>
      <select value={f.acc} onChange={set('acc')} aria-label="Account"><option value="">Account</option><option>Active</option><option>Inactive</option></select>
      <button className="btn" onClick={() => download('creators.csv', [['Name', 'Email', 'Status', 'Badge', 'Works', 'Account'], ...list.map((c) => [c.name, c.email, c.status, c.badge, wn(c), c.active ? 'Active' : 'Inactive'])])}>Export Data</button>
    </div>
    <div className="tblwrap"><table className="tbl"><thead><tr><th>Creator</th><th>Email</th><th>Status</th><th>Badge</th><th>Works</th><th>Account</th><th>Actions</th></tr></thead>
      <tbody>{list.map((c) => <tr key={c.id}><td><div className="row"><Avatar c={c} /><b>{c.name}</b></div></td><td className="muted">{c.email}</td><td>{c.status}</td><td><Badge b={c.badge} /></td><td>{wn(c)}</td><td><Status s={c.active ? 'Active' : 'Inactive'} /></td>
        <td><div className="row" style={{ gap: 6 }}><button className="btn sm" onClick={() => setView(c)}>View</button><button className="btn sm" onClick={() => setEd({ ...c })}>Edit</button></div></td></tr>)}</tbody></table></div>
    {!list.length && <div className="empty" style={{ marginTop: 12 }}>No creators match your filters.</div>}
    <p className="small muted" style={{ marginTop: 10 }}>“Edit” actions: change badge manually · deactivate / activate account · reset password.</p>
    {view && <Modal onClose={() => setView(null)}><div className="row"><Avatar c={view} cls="md" /><div><h3>{view.name}</h3><div className="small muted">{view.email}</div></div></div>
      <div style={{ margin: '14px 0' }}>{[['Specialization', view.spec], ['Status', view.status], ['Badge', view.badge], ['Works', wn(view)], ['Skills', view.skills.join(', ') || '—']].map(([a, b]) => <div className="row between small" key={a} style={{ padding: '4px 0' }}><span className="muted">{a}</span><b>{b}</b></div>)}</div>
      <div className="row" style={{ justifyContent: 'flex-end' }}><L to={`/creators/${view.id}`} className="btn" target="_blank">Public profile ↗</L><button className="btn pri" onClick={() => setView(null)}>Close</button></div></Modal>}
    {ed && <Modal onClose={() => setEd(null)}><h3>Edit {ed.name}</h3>
      <Field label="Badge"><select value={ed.badge} onChange={(e) => setEd({ ...ed, badge: e.target.value })}>{BADGES.map((b) => <option key={b}>{b}</option>)}</select></Field>
      <Field label="Account"><select value={ed.active ? 'Active' : 'Inactive'} onChange={(e) => setEd({ ...ed, active: e.target.value === 'Active' })}><option>Active</option><option>Inactive</option></select></Field>
      <button className="btn sm" onClick={() => say('Password reset email sent (demo)')}>Reset password</button>
      <div className="row" style={{ justifyContent: 'flex-end', marginTop: 18 }}><button className="btn" onClick={() => setEd(null)}>Cancel</button><button className="btn pri" onClick={() => { setCreators(creators.map((c) => c.id === ed.id ? ed : c)); setEd(null); say('Creator updated') }}>Save changes</button></div></Modal>}
  </>
}

/* A-06 */
function Moderation() {
  const { reports, setReports, works, setWorks, say } = useStore()
  const [tab, setTab] = useState('Incoming Reports'), [del, setDel] = useState(null)
  const inc = reports.filter((r) => r.status === 'Pending' || r.status === 'Under review')
  const list = tab === 'Incoming Reports' ? inc : tab === 'All Works' ? reports.filter((r) => r.kind === 'Work') : reports.filter((r) => r.kind === 'Comment')
  const upd = (r, st, m) => { setReports(reports.map((x) => x.id === r.id ? { ...x, status: st } : x)); say(m) }
  return <>
    <h1>Content Moderation</h1>
    <div className="tb" style={{ marginTop: 12 }}>{[`Incoming Reports`, 'All Works', 'All Comments'].map((t) => <button key={t} className={'pill' + (tab === t ? ' on' : '')} onClick={() => setTab(t)}>{t}{t === 'Incoming Reports' ? ` (${inc.length})` : ''}</button>)}</div>
    {list.map((r) => { const w = r.work && works.find((x) => x.id === r.work); return <div className="mod" key={r.id}>
      <div className="t">{w ? <img src={workSrc(w, true)} alt="" /> : <span style={{ fontSize: 22 }}>✎</span>}</div>
      <div><span className="pill on">{r.kind}</span><div><b>{r.kind === 'Comment' ? `“${r.text}”` : r.text}</b></div><div className="small muted">by {r.author} · reported by {r.by} · {fmt(r.date)}</div></div>
      <div><div className="row" style={{ justifyContent: 'flex-end', marginBottom: 8 }}><span className="pill">{r.reason}</span><Status s={r.status} /></div>
        <div className="row" style={{ gap: 6, justifyContent: 'flex-end' }}>
          {w ? <L to={`/works/${w.id}`} className="btn sm" target="_blank">View</L> : <button className="btn sm" onClick={() => say(`“${r.text}”`)}>View</button>}
          <button className="btn sm pri" onClick={() => { if (w) setWorks(works.map((x) => x.id === w.id ? { ...x, status: 'Draft' } : x)); upd(r, 'Hidden', 'Content hidden from public') }}>Hide</button>
          <button className="btn sm dan" onClick={() => setDel(r)}>Delete</button>
          <button className="btn sm" onClick={() => upd(r, 'Dismissed', 'Report dismissed')}>Dismiss</button></div></div></div> })}
    {!list.length && <div className="empty">Nothing to review here.</div>}
    {del && <Confirm title="Delete this content?" text="The content will be permanently removed. This action cannot be undone." onClose={() => setDel(null)} onOk={() => { if (del.work) setWorks(works.filter((x) => x.id !== del.work)); setReports(reports.filter((x) => x.id !== del.id)); say('Content deleted') }} />}
  </>
}

/* A-07 */
function Reports() {
  const { creators, works, jobs } = useStore()
  const [per, setPer] = useState('Fall Semester 2026'), [from, setFrom] = useState(''), [to, setTo] = useState('')
  const stamp = new Date().toLocaleString('en-GB')
  const badge = BADGES.map((b) => [b, creators.filter((c) => c.badge === b).length])
  const cat = CATEGORIES.map((c) => [c, works.filter((w) => w.cat === c).length])
  const types = ['Internship', 'Full-time', 'Freelance'].map((t) => [t, jobs.filter((j) => j.type === t).length])
  const cards = [
    ['Creators per Badge Summary', badge, [['Total creators', creators.length]], 'creators-per-badge'],
    ['Works per Category Summary', cat, [['Total works', works.length]], 'works-per-category'],
    ['Jobs & Applicants Summary', types, [['Active jobs', jobs.filter((j) => j.status === 'Active').length], ['Total interested', jobs.reduce((a, j) => a + j.interested, 0)], ['Closed', jobs.filter((j) => j.status === 'Closed').length]], 'jobs-summary'],
  ]
  return <>
    <div className="row between wrapx"><h1>Data Reports</h1><button className="btn" onClick={() => window.print()}>Print All</button></div>
    <div className="tb" style={{ marginTop: 14, alignItems: 'flex-end' }}>
      <Field label="Period"><select value={per} onChange={(e) => setPer(e.target.value)}><option>Fall Semester 2026</option><option>Spring Semester 2026</option><option>Custom range</option></select></Field>
      <Field label="From"><input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></Field>
      <Field label="To"><input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></Field>
      <div className="field"><button className="btn pri" onClick={() => setPer(from && to ? 'Custom range' : per)}>Apply</button></div>
    </div>
    <p className="small muted" style={{ marginBottom: 14 }}>Period: {per}{from && to ? ` (${fmt(from)} – ${fmt(to)})` : ''}</p>
    <div className="grid g3">{cards.map(([t, rows, extra, file]) => { const m = Math.max(1, ...rows.map((r) => r[1])); return <div className="panel" key={t}><h3>{t}</h3>
      <div className="bars">{rows.map(([k, n]) => <div key={k}><span>{n}</span><i style={{ height: `${n / m * 100}%` }} /><span>{k.replace(' Animation', '')}</span></div>)}</div>
      <div style={{ margin: '14px 0' }}>{[...rows, ...extra].map(([k, n]) => <div className="row between small" key={k} style={{ padding: '5px 0', borderTop: '1px solid var(--line)' }}><span className="muted">{k}</span><b>{n}</b></div>)}</div>
      <div className="row"><button className="btn sm pri" onClick={() => window.print()}>PDF</button><button className="btn sm" onClick={() => download(file + '.csv', [[t, per], ...rows, ...extra])}>Excel</button><button className="btn sm" onClick={() => window.print()}>Print</button></div>
      <p className="small muted" style={{ marginTop: 12 }}>Updated: {stamp}</p></div> })}</div>
  </>
}
