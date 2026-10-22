import { useMemo, useState } from 'react'
import { useStore, L, go, WorkCard, Badge, Avatar, JobLogo, Pager, Modal, Field, Status, fmt, workSrc } from '../ui'
import { CATEGORIES, TOOLS, BADGES, education, honors, img } from '../data'

const TODAY = '2026-10-22'
const q = () => new URLSearchParams((location.hash.split('?')[1] || ''))
const pubWorks = (works) => works.filter((w) => w.status === 'Published')
const openJobs = (jobs) => jobs.filter((j) => j.status === 'Active' && j.deadline >= TODAY)

/* ---------- P-01 ---------- */
export function Home() {
  const { works, jobs, creators } = useStore()
  const [cat, setCat] = useState('All')
  const [text, setText] = useState('')
  const list = pubWorks(works).filter((w) => cat === 'All' || w.cat === cat).sort((a, b) => b.year - a.year).slice(0, 4)
  const feat = works.find((w) => w.id === 'w6')
  const submit = (e) => { e.preventDefault(); go('/works' + (text ? '?q=' + encodeURIComponent(text) : '')) }
  return <>
    <section className="hero">
      <img src={feat.url || img(feat.file)} alt="" />
      <div className="wrap">
        <h1>Animation Creator Showcase & Careers</h1>
        <p>Browse the portfolios of Animation students and alumni. Open to everyone, no login required.</p>
        <form className="search" onSubmit={submit} role="search">
          <input type="search" value={text} onChange={(e) => setText(e.target.value)} placeholder="Search creators, works, or skills…" aria-label="Search" />
          <button className="btn pri">Search</button>
        </form>
      </div>
      <L to={`/works/${feat.id}`} className="credit">Featured: {feat.title} by Riki Oktav</L>
    </section>
    <div className="wrap">
      <div className="bar between">
        <div className="row wrapx"><b className="small muted">Category</b>
          {['All', ...CATEGORIES].map((c) => <button key={c} className={'pill' + (cat === c ? ' on' : '')} onClick={() => setCat(c)}>{c}</button>)}</div>
        <L to="/works" className="btn sm">Advanced Filters ▾</L>
      </div>
      <section className="sec">
        <div className="sec-h"><h2>Latest Works</h2><L to="/works">View all ›</L></div>
        {list.length ? <div className="grid">{list.map((w) => <WorkCard key={w.id} w={w} />)}</div> : <div className="empty">No works in this category yet.</div>}
      </section>
      <div className="two" style={{ marginTop: 30 }}>
        <section>
          <div className="sec-h"><h2>Latest Jobs</h2><L to="/jobs">View all ›</L></div>
          {openJobs(jobs).slice(0, 3).map((j) => <div className="jobrow" key={j.id}>
            <JobLogo j={j} /><div><b>{j.title}</b><div className="small muted">{j.company}</div></div>
            <span className="pill">{j.type}</span><span className="small muted">Deadline: {fmt(j.deadline)}</span>
            <L to={`/jobs/${j.id}`} className="btn sm">View Details</L></div>)}
        </section>
        <section className="panel">
          <h3>Featured Creators</h3>
          <div className="fc">{creators.filter((c) => c.active).slice(0, 4).map((c) => <L key={c.id} to={`/creators/${c.id}`}><Avatar c={c} cls="md" /><b>{c.name.split(' ').slice(0, 2).join(' ')}</b><Badge b={c.badge} /></L>)}</div>
        </section>
      </div>
    </div>
  </>
}

/* ---------- P-02 ---------- */
export function Works() {
  const { works, creator } = useStore()
  const init = { q: q().get('q') || '', cats: q().get('cat') ? [q().get('cat')] : [], tools: [], badges: [], sort: 'Newest' }
  const [f, setF] = useState(init)       // applied
  const [d, setD] = useState(init)       // draft in the sidebar
  const [page, setPage] = useState(1)
  const [text, setText] = useState(init.q)
  const tog = (arr, v) => arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]
  const apply = (n) => { setF(n); setD(n); setPage(1) }
  const list = useMemo(() => {
    let r = pubWorks(works).filter((w) => {
      const c = creator(w.creator)
      const hay = (w.title + w.cat + w.tools.join(' ') + c.name + c.skills.join(' ')).toLowerCase()
      return hay.includes(f.q.toLowerCase()) && (!f.cats.length || f.cats.includes(w.cat)) && (!f.tools.length || f.tools.some((t) => w.tools.includes(t) || c.skills.includes(t))) && (!f.badges.length || f.badges.includes(c.badge))
    })
    if (f.sort === 'Most liked') r = [...r].sort((a, b) => b.likes - a.likes)
    else r = [...r].sort((a, b) => b.year - a.year)
    return r
  }, [works, f])
  const per = 8, pages = Math.ceil(list.length / per)
  const chips = [...f.cats.map((x) => ['cats', x]), ...f.tools.map((x) => ['tools', x]), ...f.badges.map((x) => ['badges', x])]
  return <div className="wrap side">
    <aside className="filter panel" aria-label="Filters">
      <div className="row between"><h3 style={{ margin: 0 }}>Filter</h3><button className="btn sm" onClick={() => { setText(''); apply({ q: '', cats: [], tools: [], badges: [], sort: 'Newest' }) }}>Reset</button></div>
      <h4>Category</h4>
      <label className="chk"><input type="checkbox" checked={!d.cats.length} onChange={() => setD({ ...d, cats: [] })} />All</label>
      {CATEGORIES.map((c) => <label className="chk" key={c}><input type="checkbox" checked={d.cats.includes(c)} onChange={() => setD({ ...d, cats: tog(d.cats, c) })} />{c}</label>)}
      <h4>Skill / Tools</h4>
      <div className="row wrapx" style={{ gap: 6 }}>{TOOLS.slice(0, 6).map((t) => <button key={t} className={'pill' + (d.tools.includes(t) ? ' on' : '')} onClick={() => setD({ ...d, tools: tog(d.tools, t) })}>{t}</button>)}</div>
      <h4>Creator Badge</h4>
      {BADGES.map((b) => <label className="chk" key={b}><input type="checkbox" checked={d.badges.includes(b)} onChange={() => setD({ ...d, badges: tog(d.badges, b) })} />{b}</label>)}
      <h4>Sort by</h4>
      <select value={d.sort} onChange={(e) => setD({ ...d, sort: e.target.value })} aria-label="Sort by"><option>Newest</option><option>Most liked</option></select>
      <button className="btn pri blk" style={{ marginTop: 18 }} onClick={() => apply({ ...d, q: text })}>Apply Filters</button>
    </aside>
    <section>
      <form className="row" onSubmit={(e) => { e.preventDefault(); apply({ ...d, q: text }) }}>
        <input type="search" className="grow" value={text} onChange={(e) => setText(e.target.value)} placeholder="Search works, creators, or skills…" aria-label="Search works" /><button className="btn pri">Search</button>
      </form>
      <div className="row wrapx" style={{ margin: '12px 0 16px' }}>
        <span className="small muted">Showing {list.length} work{list.length !== 1 && 's'}</span>
        {chips.map(([k, v]) => <button key={k + v} className="pill on" onClick={() => apply({ ...f, [k]: f[k].filter((x) => x !== v) })}>{v} ×</button>)}
      </div>
      {list.length ? <div className="grid g3">{list.slice((page - 1) * per, page * per).map((w) => <WorkCard key={w.id} w={w} />)}</div>
        : <div className="empty">No works match your filters. Try removing a filter or searching another keyword.</div>}
      <Pager page={page} pages={pages} set={setPage} />
    </section>
  </div>
}

/* ---------- P-03 / K-06 ---------- */
export function WorkDetail({ id }) {
  const { works, setWorks, creator, user, me, liked, setLiked, say, reports, setReports } = useStore()
  const [text, setText] = useState('')
  const [edit, setEdit] = useState(null)
  const [rep, setRep] = useState(null)
  const w = works.find((x) => x.id === id)
  if (!w || (w.status !== 'Published' && w.creator !== user?.id && user?.role !== 'admin')) return <div className="wrap"><div className="empty" style={{ marginTop: 40 }}>This work is not available. <L to="/works" style={{ color: 'var(--acc)' }}>Browse works</L></div></div>
  const c = creator(w.creator), isL = liked[w.id], more = pubWorks(works).filter((x) => x.creator === w.creator && x.id !== w.id).slice(0, 3)
  const patch = (fn) => setWorks(works.map((x) => x.id === w.id ? fn(x) : x))
  const like = () => { if (!user) return go('/login'); setLiked({ ...liked, [w.id]: !isL }); patch((x) => ({ ...x, likes: x.likes + (isL ? -1 : 1) })) }
  const send = (e) => { e.preventDefault(); if (!text.trim()) return; patch((x) => ({ ...x, comments: [...x.comments, { user: me?.name || 'Admin', text: text.trim(), ago: 'Just now', mine: true }] })); setText('') }
  const share = () => { navigator.clipboard?.writeText(location.href); say('Link copied') }
  const sendReport = (e) => { e.preventDefault(); const f = new FormData(e.target); setReports([{ id: 'r' + Date.now(), kind: rep.kind, text: rep.text, work: w.id, by: me?.name || 'Admin', author: rep.author, reason: f.get('reason'), status: 'Pending', date: TODAY }, ...reports]); setRep(null); say('Report sent. Thank you.') }
  return <div className="wrap">
    <div className="crumb"><L to="/">Home</L> › <L to="/works">Works</L> › {w.title}</div>
    <div className="detail">
      <div>
        <div className="media"><img src={workSrc(w)} alt={w.title} /></div>
        <h1 style={{ marginTop: 18 }}>{w.title} <span className="muted" style={{ fontWeight: 400, fontSize: 18 }}>{w.year}</span></h1>
        <div className="row wrapx" style={{ margin: '10px 0' }}><span className="pill on">{w.cat}</span>{w.tools.map((t) => <span className="pill" key={t}>{t}</span>)}{w.status === 'Draft' && <Status s="Draft" />}</div>
        <div className="row between" style={{ margin: '16px 0' }}>
          <div className="row"><Avatar c={c} cls="md" /><div><b>{c.name}</b> <Badge b={c.badge} /><div className="small muted">{c.spec}</div></div></div>
          <L to={`/creators/${c.id}`} className="btn">View Profile</L>
        </div>
        <div className="row wrapx">
          <button className={'btn' + (isL ? ' pri' : '')} onClick={like} aria-pressed={!!isL}>{isL ? '♥ Liked' : '♡ Like'} ({w.likes})</button>
          <button className="btn" onClick={share}>Share</button>
          {user && <button className="btn" onClick={() => setRep({ kind: 'Work', text: w.title, author: c.name })}>Report</button>}
          {!user && <span className="small muted">Log in to like this work</span>}
        </div>
        <h3 style={{ margin: '22px 0 6px' }}>Description</h3><p className="muted" style={{ maxWidth: 680 }}>{w.desc}</p>
      </div>
      <aside>
        <h2>Comments ({w.comments.length})</h2>
        <div style={{ margin: '8px 0' }}>{w.comments.map((m, i) => <div className="cm" key={i}>
          <span className="av">{m.user[0].toUpperCase()}</span>
          <div className="grow">
            <div className="row between"><b className="small">{m.user}</b><span className="small muted">{m.ago}</span></div>
            {edit === i ? <form onSubmit={(e) => { e.preventDefault(); const v = e.target.t.value; patch((x) => ({ ...x, comments: x.comments.map((k, j) => j === i ? { ...k, text: v } : k) })); setEdit(null) }}><input name="t" type="text" defaultValue={m.text} autoFocus /><button className="btn sm pri" style={{ marginTop: 6 }}>Save</button></form> : <p>{m.text}</p>}
            {user && <div className="row small muted" style={{ gap: 12 }}>
              {m.mine ? <><button style={lk} onClick={() => setEdit(i)}>Edit</button><button style={lk} onClick={() => patch((x) => ({ ...x, comments: x.comments.filter((_, j) => j !== i) }))}>Delete</button></>
                : <button style={lk} onClick={() => setRep({ kind: 'Comment', text: m.text, author: m.user })}>Report</button>}
            </div>}
          </div></div>)}
          {!w.comments.length && <p className="muted small">No comments yet.</p>}
        </div>
        {user ? <form className="row" onSubmit={send}><input type="text" className="grow" value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a comment…" aria-label="Write a comment" /><button className="btn pri">Send</button></form>
          : <div className="gate"><p className="small muted">Anyone can read comments without an account.<br />Log in to write a comment & like this work.</p><div className="row" style={{ justifyContent: 'center', marginTop: 12 }}><L to="/login" className="btn pri">Login</L><L to="/login?signup" className="btn">Sign Up</L></div></div>}
        {more.length > 0 && <><h3 style={{ margin: '26px 0 10px' }}>More Works by This Creator</h3>
          <div className="mini">{more.map((m) => <L key={m.id} to={`/works/${m.id}`}><img src={workSrc(m, true)} alt={m.title} /><b className="small">{m.title}</b><div className="small muted">♥ {m.likes}</div></L>)}</div></>}
      </aside>
    </div>
    {rep && <Modal onClose={() => setRep(null)}><form onSubmit={sendReport}><h3>Report this {rep.kind.toLowerCase()}</h3>
      <p className="muted small" style={{ margin: '6px 0 14px' }}>An admin will review your report.</p>
      <Field label="Reason"><select name="reason"><option>Plagiarism</option><option>Inappropriate</option><option>Spam</option><option>Wrong category</option></select></Field>
      <div className="row" style={{ justifyContent: 'flex-end' }}><button type="button" className="btn" onClick={() => setRep(null)}>Cancel</button><button className="btn pri">Send report</button></div></form></Modal>}
  </div>
}
const lk = { background: 'none', border: 0, color: 'var(--mut)', padding: 0, fontSize: 12, textDecoration: 'underline' }

/* ---------- P-04 ---------- */
export function Creators() {
  const { creators, works } = useStore()
  const [f, setF] = useState({ q: '', spec: '', skill: '', badge: '', status: '' })
  const [n, setN] = useState(8)
  const set = (k) => (e) => { setF({ ...f, [k]: e.target.value }); setN(8) }
  const specs = [...new Set(creators.map((c) => c.spec))], skills = [...new Set(creators.flatMap((c) => c.skills))].sort()
  const list = creators.filter((c) => c.active && (c.name + c.skills.join(' ')).toLowerCase().includes(f.q.toLowerCase()) && (!f.spec || c.spec === f.spec) && (!f.skill || c.skills.includes(f.skill)) && (!f.badge || c.badge === f.badge) && (!f.status || c.status === f.status))
  const stat = (c) => { const w = pubWorks(works).filter((x) => x.creator === c.id); return [w.length, w.reduce((a, x) => a + x.likes, 0)] }
  return <div className="wrap" style={{ paddingTop: 26 }}>
    <div className="row between"><h1>Creator Directory</h1><span className="muted small">{list.length} registered creators</span></div>
    <div className="tb" style={{ marginTop: 14 }}>
      <input type="search" className="grow" placeholder="Search creator name or skill…" value={f.q} onChange={set('q')} aria-label="Search creators" style={{ flex: 1 }} />
      <select value={f.spec} onChange={set('spec')} aria-label="Specialization"><option value="">Specialization</option>{specs.map((s) => <option key={s}>{s}</option>)}</select>
      <select value={f.skill} onChange={set('skill')} aria-label="Skill"><option value="">Skill</option>{skills.map((s) => <option key={s}>{s}</option>)}</select>
      <select value={f.badge} onChange={set('badge')} aria-label="Badge"><option value="">Badge</option>{BADGES.map((s) => <option key={s}>{s}</option>)}</select>
      <select value={f.status} onChange={set('status')} aria-label="Status"><option value="">Status</option><option>Student</option><option>Alumni</option></select>
    </div>
    {list.length ? <div className="grid">{list.slice(0, n).map((c) => { const [w, l] = stat(c); return <L key={c.id} to={`/creators/${c.id}`} className="card cc">
      <Avatar c={c} /><b>{c.name}</b><span className="small muted">{c.spec}</span><Badge b={c.badge} />
      <div className="tags">{c.skills.slice(0, 2).map((s) => <span className="pill" key={s}>{s}</span>)}</div>
      <hr /><span className="small muted">{w ? `${w} works · ${l} ♥` : 'No works yet'}</span><b className="small" style={{ color: 'var(--acc)' }}>View Profile ›</b></L> })}</div>
      : <div className="empty">No creators found. Try different filters.</div>}
    {n < list.length && <div style={{ textAlign: 'center', padding: 24 }}><button className="btn" onClick={() => setN(n + 8)}>Load more ▾</button></div>}
  </div>
}

/* ---------- P-05 ---------- */
export function CreatorProfile({ id }) {
  const { creator, works, exp, user, say } = useStore()
  const [tab, setTab] = useState('Portfolio')
  const c = creator(id)
  if (!c) return <div className="wrap"><div className="empty" style={{ marginTop: 40 }}>Creator not found.</div></div>
  const ws = works.filter((w) => w.creator === c.id && (w.status === 'Published' || user?.id === c.id)), ex = exp[c.id] || []
  const likes = ws.reduce((a, w) => a + w.likes, 0)
  const Exp = () => ex.length ? <div className="tl">{ex.map((e) => <div key={e.id}><b>{e.title}</b><div className="small muted">{e.role} · {e.org} · {e.start}{e.end !== e.start ? ' – ' + e.end : ''} · {e.type}</div><p className="small" style={{ marginTop: 4 }}>{e.desc}</p></div>)}</div> : <p className="muted">No project experience added yet.</p>
  return <>
    <div className="banner" style={{ backgroundImage: c.banner ? `url(${c.banner})` : undefined }} />
    <div className="wrap">
      <div className="phead">
        <Avatar c={c} cls="lg" />
        <div className="info">
          <h1>{c.name} <Badge b={c.badge} /></h1>
          <div className="muted">Specialization: {c.spec} · {c.status}</div>
          <p style={{ maxWidth: 620, margin: '8px 0 12px' }}>{c.bio}</p>
          <div className="row wrapx">
            {c.showreel && <a className="btn pri" href={c.showreel} target="_blank" rel="noreferrer">▶ Watch Showreel</a>}
            <button className="btn" onClick={() => { navigator.clipboard?.writeText(c.email); say('Email copied') }}>Copy Email</button>
            {c.cv && <a className="btn" href={c.cv} download>Download CV</a>}
            {Object.entries(c.links).map(([k, v]) => <a key={k} className="small" style={{ fontWeight: 700 }} href={v} target="_blank" rel="noreferrer">{k}</a>)}
          </div>
        </div>
        <div style={{ minWidth: 260, paddingBottom: 6 }}>
          <b>Skill</b><div className="row wrapx" style={{ gap: 6, margin: '6px 0 12px' }}>{c.skills.map((s) => <span className="pill" key={s}>{s}</span>)}</div>
          <b className="muted">{ws.length} Works · {likes} Likes · {ex.length} Projects</b>
        </div>
      </div>
      <div className="tabs" role="tablist">{['Portfolio', 'Project Experience', 'About'].map((t) => <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t}</button>)}</div>
      {tab === 'Portfolio' && <div className="two" style={{ gridTemplateColumns: '2fr 1fr' }}>
        {ws.length ? <div className="grid g3">{ws.map((w) => <WorkCard key={w.id} w={w} />)}</div> : <div className="empty">This creator has not published any works yet.</div>}
        <div className="panel"><h3>Project Experience</h3><Exp /></div></div>}
      {tab === 'Project Experience' && <div className="panel" style={{ maxWidth: 760 }}><Exp /></div>}
      {tab === 'About' && <div className="two" style={{ gridTemplateColumns: '1fr 1.2fr' }}>
        <div className="stack">
          <div className="panel"><h3>About</h3><p className="muted">{c.bio}</p></div>
          {c.id === 'riki' && <><div className="panel"><h3>Education</h3>{education.map((e) => <div key={e[0]} style={{ marginBottom: 10 }}><b className="small">{e[0]}</b><div className="small muted">{e[1]} · {e[2]}</div></div>)}</div>
            <div className="panel"><h3>Honors & Awards</h3>{honors.map((h) => <div className="small muted" key={h}>• {h}</div>)}</div></>}
        </div>
        <div className="panel"><div className="row between" style={{ marginBottom: 12 }}><h3 style={{ margin: 0 }}>Curriculum Vitae</h3>{c.cv && <a className="btn sm" href={c.cv} download>Download CV</a>}</div>
          {c.cv ? <iframe title="CV" src={c.cv} style={{ width: '100%', height: 640, border: '1px solid var(--line)', borderRadius: 8, background: '#fff' }} /> : <p className="muted">No CV uploaded.</p>}</div>
      </div>}
      {!user && <div className="note row between wrapx" style={{ marginTop: 28 }}><span>Portfolio and works are open to all visitors. Login / Sign Up is only needed to like and comment on works.</span><span className="row"><L to="/login" className="btn sm">Login</L><L to="/login?signup" className="btn sm pri">Sign Up</L></span></div>}
    </div>
  </>
}

/* ---------- P-06 ---------- */
export function Jobs() {
  const { jobs } = useStore()
  const [s, setS] = useState(''), [t, setT] = useState('All'), [loc, setLoc] = useState(''), [sort, setSort] = useState('Newest'), [page, setPage] = useState(1)
  let list = openJobs(jobs).filter((j) => (j.title + j.company).toLowerCase().includes(s.toLowerCase()) && (t === 'All' || j.type === t) && (!loc || j.location.includes(loc)))
  list = [...list].sort((a, b) => sort === 'Newest' ? b.posted.localeCompare(a.posted) : a.deadline.localeCompare(b.deadline))
  const per = 5
  return <div className="wrap" style={{ paddingTop: 26 }}>
    <h1>Creative Industry Career Listings</h1>
    <div className="tb" style={{ marginTop: 14 }}>
      <input type="search" style={{ flex: 1 }} placeholder="Search position or studio…" value={s} onChange={(e) => { setS(e.target.value); setPage(1) }} aria-label="Search jobs" />
      <div className="row" style={{ gap: 6 }}>{['All', 'Internship', 'Full-time', 'Freelance'].map((x) => <button key={x} className={'pill' + (t === x ? ' on' : '')} onClick={() => { setT(x); setPage(1) }}>{x}</button>)}</div>
      <select value={loc} onChange={(e) => { setLoc(e.target.value); setPage(1) }} aria-label="Location"><option value="">Location</option><option>Batam</option><option>Remote</option></select>
      <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort"><option>Newest</option><option>Deadline</option></select>
    </div>
    {list.slice((page - 1) * per, page * per).map((j) => <div className="jobrow" key={j.id} style={{ gridTemplateColumns: '56px 1fr auto auto' }}>
      <JobLogo j={j} /><div><b style={{ fontSize: 17 }}>{j.title}</b><div className="small muted">{j.company}</div><div className="row" style={{ gap: 6, marginTop: 6 }}><span className="pill on">{j.type}</span><span className="pill">{j.location}</span></div></div>
      <div><div className="small muted">Deadline</div><b>{fmt(j.deadline)}</b></div><L to={`/jobs/${j.id}`} className="btn pri">View Details</L></div>)}
    {!list.length && <div className="empty">No open positions match your search.</div>}
    <Pager page={page} pages={Math.ceil(list.length / per)} set={setPage} />
  </div>
}

/* ---------- P-07 ---------- */
export function JobDetail({ id }) {
  const { jobs, say } = useStore()
  const j = jobs.find((x) => x.id === id)
  if (!j || j.status === 'Draft') return <div className="wrap"><div className="empty" style={{ marginTop: 40 }}>This job is not available. <L to="/jobs" style={{ color: 'var(--acc)' }}>Back to jobs</L></div></div>
  const sim = openJobs(jobs).filter((x) => x.id !== j.id).slice(0, 2)
  return <div className="wrap">
    <div className="crumb"><L to="/">Home</L> › <L to="/jobs">Jobs</L> › {j.title}</div>
    <div className="panel row between wrapx" style={{ margin: '14px 0 24px', padding: 22 }}>
      <div className="row" style={{ gap: 18 }}><JobLogo j={j} /><div><h1>{j.title}</h1><div className="muted">{j.company}</div>
        <div className="row wrapx" style={{ gap: 6, marginTop: 8 }}><span className="pill on">{j.type}</span><span className="pill">{j.location}</span><span className="pill">Deadline: {fmt(j.deadline)}</span>{j.status === 'Closed' && <Status s="Closed" />}</div></div></div>
      <div className="stack" style={{ minWidth: 240 }}><a className="btn pri blk" href={j.apply} target="_blank" rel="noreferrer">Apply via Studio Link ↗</a><button className="btn blk" onClick={() => { navigator.clipboard?.writeText(location.href); say('Link copied') }}>Share</button></div>
    </div>
    <div className="two" style={{ paddingBottom: 30 }}>
      <div className="stack">
        <h3>Job Description</h3><p className="muted" style={{ maxWidth: 680 }}>{j.desc}</p>
        <h3 style={{ paddingTop: 10 }}>Qualifications</h3><ul className="muted" style={{ paddingLeft: 20 }}>{j.qual.map((x) => <li key={x}>{x}</li>)}</ul>
        <h3 style={{ paddingTop: 10 }}>Required Skills</h3><div className="row wrapx" style={{ gap: 6 }}>{j.skills.map((s) => <span className="pill on" key={s}>{s}</span>)}</div>
        <h3 style={{ paddingTop: 10 }}>How to Apply</h3><p className="muted">Send your portfolio and CV through the studio’s application link. Include your Ficusia Hub profile link.</p>
      </div>
      <div className="stack">
        <div className="panel"><h3>Job Information</h3>{[['Type', j.type], ['Location', j.location], ['Deadline', fmt(j.deadline)], ['Posted', fmt(j.posted)]].map(([a, b]) => <div className="row between small" key={a} style={{ padding: '5px 0' }}><span className="muted">{a}</span><b>{b}</b></div>)}</div>
        {sim.length > 0 && <><h3>Similar Jobs</h3>{sim.map((x) => <L key={x.id} to={`/jobs/${x.id}`} className="jobrow" style={{ gridTemplateColumns: '48px 1fr auto' }}><JobLogo j={x} /><div><b>{x.title}</b><div className="small muted">{x.company}</div></div><span className="pill">{x.type}</span></L>)}</>}
      </div>
    </div>
  </div>
}

/* ---------- P-08 ---------- */
export function Auth({ guard }) {
  const { setUser, creators, setCreators, say } = useStore()
  const [show, setShow] = useState(false)
  const [lg, setLg] = useState({ email: '', password: '', err: '' })
  const [s, setS] = useState({ name: '', email: '', prog: '', status: 'Student', pw: '', pw2: '', terms: false })
  const [tried, setTried] = useState(false)
  const login = (e) => {
    e.preventDefault()
    if (!lg.email.trim() || !lg.password) return setLg({ ...lg, err: 'Enter your email and password.' })
    if (lg.email.toLowerCase().startsWith('admin')) { setUser({ role: 'admin', id: 'admin', name: 'Admin' }); say('Welcome back, Admin'); return go('/admin') }
    const c = creators.find((x) => x.email === lg.email.trim().toLowerCase()) || creators[0]
    if (!c.active) return setLg({ ...lg, err: 'This account is inactive. Contact an admin.' })
    setUser({ role: 'creator', id: c.id, name: c.name }); say(`Welcome back, ${c.name.split(' ')[0]}`); go('/creator')
  }
  const emailBad = s.email && !/^\S+@\S+\.\S+$/.test(s.email)
  const errs = { name: !s.name.trim() && 'Full name is required', email: !s.email ? 'Email is required' : emailBad && 'Invalid email format', prog: !s.prog && 'Select your study program', pw: s.pw.length < 8 && 'Use at least 8 characters', pw2: s.pw2 !== s.pw && 'Passwords do not match', terms: !s.terms && 'Please accept the Terms & Conditions' }
  const signup = (e) => {
    e.preventDefault(); setTried(true)
    if (Object.values(errs).some(Boolean)) return
    const id = 'u' + Date.now()
    const nc = { id, name: s.name.trim(), spec: s.prog, status: s.status, badge: s.status === 'Student' ? 'Sprout' : 'Sapling', email: s.email.toLowerCase(), active: true, skills: [], bio: '', links: {} }
    setCreators([...creators, nc]); setUser({ role: 'creator', id, name: nc.name }); say('Account created. Welcome to Ficusia Hub!'); go('/creator')
  }
  const E = (k) => tried && errs[k]
  return <div className="wrap">
    {guard && <div className="note" style={{ marginTop: 22 }}><b>Login required.</b> This area is only for {guard === 'admin' ? 'Admins' : 'Creators'}. Log in to continue.</div>}
    <div className="auth">
      <form className="panel" onSubmit={login} noValidate>
        <h1 style={{ marginBottom: 14 }}>Log In</h1>
        <Field label="Email"><input type="email" value={lg.email} onChange={(e) => setLg({ ...lg, email: e.target.value, err: '' })} placeholder="name@email.com" autoComplete="email" /></Field>
        <Field label="Password"><div className="row" style={{ gap: 6 }}><input type={show ? 'text' : 'password'} value={lg.password} onChange={(e) => setLg({ ...lg, password: e.target.value, err: '' })} autoComplete="current-password" /><button type="button" className="btn sm" onClick={() => setShow(!show)}>{show ? 'Hide' : 'Show'}</button></div></Field>
        <div className="row between small" style={{ marginBottom: 12 }}><label className="chk"><input type="checkbox" />Remember me</label><button type="button" className="small" style={{ background: 'none', border: 0, fontWeight: 700 }} onClick={() => say('Password reset link sent (demo)')}>Forgot password?</button></div>
        {lg.err && <div className="err" style={{ marginBottom: 10 }} role="alert">{lg.err}</div>}
        <button className="btn pri blk">Log In</button>
        <div className="note" style={{ margin: '16px 0', textAlign: 'center' }}>Creators & Admins log in through the same form.<br />The system redirects to the dashboard for your role.<br /><span style={{ opacity: .8 }}>Demo: any email opens the Creator dashboard; an email starting with “admin” opens Admin.</span></div>
        <p className="small muted" style={{ textAlign: 'center' }}>Just browsing? Works, creators and jobs are open to everyone.<br /><L to="/" style={{ fontWeight: 700, color: 'var(--tx)' }}>Continue as guest (no login) →</L></p>
      </form>
      <form className="panel" onSubmit={signup} noValidate>
        <h1 style={{ marginBottom: 14 }}>Create Creator Account</h1>
        <Field label="Full Name *" err={E('name')}><input type="text" value={s.name} autoFocus={location.hash.includes('signup')} onChange={(e) => setS({ ...s, name: e.target.value })} placeholder="Full name" /></Field>
        <Field label="Email *" err={E('email') || (emailBad && 'Invalid email format')}><input type="email" value={s.email} onChange={(e) => setS({ ...s, email: e.target.value })} placeholder="name@email.com" /></Field>
        <div className="row" style={{ alignItems: 'flex-start' }}>
          <div className="grow"><Field label="Study Program *" err={E('prog')}><select value={s.prog} onChange={(e) => setS({ ...s, prog: e.target.value })}><option value="">Select program</option><option>Animation</option><option>Multimedia & Networking</option><option>Other</option></select></Field></div>
          <div className="grow"><span className="small" style={{ fontWeight: 700, display: 'block', marginBottom: 9 }}>Status *</span><div className="row">{['Student', 'Alumni'].map((x) => <label className="chk" key={x}><input type="radio" name="st" checked={s.status === x} onChange={() => setS({ ...s, status: x })} />{x}</label>)}</div></div>
        </div>
        <div className="row" style={{ alignItems: 'flex-start' }}>
          <div className="grow"><Field label="Password *" err={E('pw')}><input type="password" value={s.pw} onChange={(e) => setS({ ...s, pw: e.target.value })} autoComplete="new-password" /></Field></div>
          <div className="grow"><Field label="Confirm Password *" err={E('pw2')}><input type="password" value={s.pw2} onChange={(e) => setS({ ...s, pw2: e.target.value })} autoComplete="new-password" /></Field></div>
        </div>
        <label className="chk"><input type="checkbox" checked={s.terms} onChange={(e) => setS({ ...s, terms: e.target.checked })} />I agree to the Terms & Conditions</label>{E('terms') && <div className="err">{errs.terms}</div>}
        <button className="btn pri blk" style={{ margin: '14px 0 8px' }}>Sign Up</button>
        <p className="small muted" style={{ textAlign: 'center' }}>✓ Your account is active immediately after sign-up. No admin approval needed.</p>
      </form>
    </div>
    <div className="note"><b>Initial badge follows sign-up status: Student → Sprout, Alumni → Sapling.</b><br />Badge upgrades (Sapling → Ficus, etc.) are requested by the creator and verified by Admin. Account registration itself needs no verification.</div>
  </div>
}
