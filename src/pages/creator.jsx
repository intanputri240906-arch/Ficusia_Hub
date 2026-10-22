import { useState } from 'react'
import { useStore, L, go, Badge, Avatar, Status, Modal, Confirm, Field, WorkCard, workSrc, fmt } from '../ui'
import { CATEGORIES, BADGES } from '../data'

const NAV = [['/creator', 'Dashboard'], ['/creator/portfolio', 'My Portfolio'], ['/creator/experience', 'Project Experience'], ['/creator/profile', 'My Profile'], ['/creator/badge', 'Badge Status']]
const ICON = { Dashboard: '▦', 'My Portfolio': '▣', 'Project Experience': '☰', 'My Profile': '◉', 'Badge Status': '✿' }
export function Shell({ nav, active, children, onLogout }) {
  return <div className="shell">
    <aside className="sb" aria-label="Sidebar">{nav.map(([to, t]) => <L key={to} to={to} className={active === to ? 'on' : ''}><span aria-hidden>{ICON[t] || '•'}</span>{t}</L>)}<span className="gap" /><button onClick={onLogout}><span aria-hidden>⏻</span>Logout</button></aside>
    <main className="main">{children}</main>
  </div>
}

export function CreatorShell({ p }) {
  const { setUser, say, me } = useStore()
  const [ask, setAsk] = useState(false)
  const sub = p[1] || '', active = sub === 'upload' ? '/creator/portfolio' : '/creator' + (sub ? '/' + sub : '')
  const page = { '': <Dash />, portfolio: <Portfolio />, upload: <Upload id={p[2]} />, experience: <Experience />, profile: <EditProfile />, badge: <BadgePage /> }[sub]
  if (!me) return null
  return <><Shell nav={NAV} active={active} onLogout={() => setAsk(true)}>{page || <div className="empty">Page not found.</div>}</Shell>
    {ask && <Confirm title="Log out?" text="You will need to log in again to manage your portfolio." ok="Logout" onClose={() => setAsk(false)} onOk={() => { setUser(null); say('You have been logged out'); go('/') }} />}</>
}

function completeness(c, hasExpOrWorks) {
  const items = [[!!c.avatar, 'profile photo'], [!!c.bio, 'bio'], [!!c.spec, 'specialization'], [c.skills.length >= 3, 'at least 3 skills'], [!!c.showreel, 'showreel'], [Object.keys(c.links).length > 0, 'a social link'], [!!c.cv, 'CV']]
  return [Math.round(items.filter((i) => i[0]).length / items.length * 100), items.filter((i) => !i[0]).map((i) => i[1])]
}

/* K-01 */
function Dash() {
  const { me, works, exp, reqs, reqHist } = useStore()
  const mine = works.filter((w) => w.creator === me.id)
  const pub = mine.filter((w) => w.status === 'Published')
  const likes = mine.reduce((a, w) => a + w.likes, 0), cm = mine.reduce((a, w) => a + w.comments.length, 0)
  const [pc, miss] = completeness(me)
  const top = [...mine].sort((a, b) => b.likes - a.likes).slice(0, 3)
  const act = mine.flatMap((w) => w.comments.filter((c) => !c.mine).map((c) => ({ t: `${c.user} commented on “${w.title}”`, a: c.ago, i: '✎' }))).slice(0, 4)
  const idx = BADGES.indexOf(me.badge)
  return <>
    <div className="row between"><div><h1>Hello, {me.name}</h1><p className="muted">Summary of your portfolio activity</p></div><L to="/creator/upload" className="btn pri">+ Upload Work</L></div>
    <div className="stats">
      <div className="stat"><span className="small muted">Total Works</span><b>{mine.length}</b><span className="small muted">{pub.length} published · {mine.length - pub.length} drafts</span></div>
      <div className="stat"><span className="small muted">Total Likes</span><b>{likes}</b><span className="small muted">across all works</span></div>
      <div className="stat"><span className="small muted">Total Comments</span><b>{cm}</b><span className="small muted">on your works</span></div>
      <div className="stat"><span className="small muted">Profile Completeness</span><b>{pc}%</b><span className="small muted">{miss.length ? 'Add ' + miss[0] : 'Profile complete'}</span></div>
    </div>
    <div className="two" style={{ gridTemplateColumns: '1.3fr 1fr' }}>
      <div className="panel"><div className="row between"><h3>Top Works</h3><L to="/creator/portfolio" className="small muted">View all ›</L></div>
        {top.length ? top.map((w) => <div className="row" key={w.id} style={{ padding: '10px 0', borderTop: '1px solid var(--line)' }}>
          <img src={workSrc(w, true)} alt="" style={{ width: 110, aspectRatio: '4/3', objectFit: 'cover', borderRadius: 6 }} />
          <div className="grow"><b>{w.title}</b><div><span className="pill">{w.cat}</span></div><div className="small muted">♥ {w.likes} · ✎ {w.comments.length}</div></div>
          <L to={`/creator/upload/${w.id}`} className="btn sm">Manage</L></div>) : <div className="empty">You have no works yet. <L to="/creator/upload" style={{ color: 'var(--acc)' }}>Upload your first work</L></div>}
      </div>
      <div className="stack">
        <div className="panel"><h3>My Badge</h3>
          <div className="steps">{BADGES.map((b, i) => <span key={b} style={{ display: 'contents' }}><span className={'dot' + (i <= idx ? ' on' : '')} />{i < 2 && <span className="ln" />}</span>)}</div>
          <div className="row between small"><span><b>Sprout</b></span><span>Sapling</span><span>Ficus</span></div>
          <p className="small muted" style={{ margin: '10px 0' }}>Current badge: <Badge b={me.badge} /></p>
          <L to="/creator/badge" className="btn sm">{idx < 2 ? 'Request Badge Upgrade' : 'View badge status'}</L></div>
        <div className="panel"><h3>Recent Activity</h3>{act.length ? act.map((a, i) => <div className="row between small" key={i} style={{ padding: '6px 0' }}><span>{a.i} {a.t}</span><span className="muted">{a.a}</span></div>) : <p className="muted small">No activity yet.</p>}</div>
      </div>
    </div>
  </>
}

/* K-02 */
function Portfolio() {
  const { me, works, setWorks, say } = useStore()
  const [tab, setTab] = useState('All'), [s, setS] = useState(''), [cat, setCat] = useState(''), [del, setDel] = useState(null)
  const mine = works.filter((w) => w.creator === me.id)
  const cnt = (st) => mine.filter((w) => w.status === st).length
  const list = mine.filter((w) => (tab === 'All' || w.status === (tab === 'Drafts' ? 'Draft' : 'Published')) && w.title.toLowerCase().includes(s.toLowerCase()) && (!cat || w.cat === cat))
  return <>
    <div className="row between"><h1>My Portfolio</h1><L to="/creator/upload" className="btn pri">+ Upload Work</L></div>
    <div className="tb" style={{ marginTop: 14 }}>
      {[['All', mine.length], ['Published', cnt('Published')], ['Drafts', cnt('Draft')]].map(([t, n]) => <button key={t} className={'pill' + (tab === t ? ' on' : '')} onClick={() => setTab(t)}>{t} ({n})</button>)}
      <span className="grow" /><input type="search" placeholder="Search title…" value={s} onChange={(e) => setS(e.target.value)} aria-label="Search title" /><select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Category"><option value="">Category</option>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
    </div>
    {list.length ? <div className="grid g3">{list.map((w) => <div className="card" key={w.id}>
      <L to={`/works/${w.id}`}><div className="thumb"><img src={workSrc(w, true)} alt={w.title} /></div></L>
      <div className="cap"><b>{w.title}</b><div className="meta"><Status s={w.status} /><span>♥ {w.likes} · ✎ {w.comments.length}</span></div>
        <div className="row" style={{ marginTop: 10 }}><L to={`/creator/upload/${w.id}`} className="btn sm grow">Edit</L><button className="btn sm dan grow" onClick={() => setDel(w)}>Delete</button></div></div></div>)}</div>
      : <div className="empty">{mine.length ? 'No works match your filters.' : 'Your portfolio is empty. Upload your first work to show it to everyone.'}</div>}
    {del && <Confirm title="Delete this work?" text={`“${del.title}” and its comments will be removed. This action cannot be undone.`} onClose={() => setDel(null)} onOk={() => { setWorks(works.filter((w) => w.id !== del.id)); say('Work deleted') }} />}
  </>
}

/* K-03 */
function Upload({ id }) {
  const { me, works, setWorks, say } = useStore()
  const old = id && works.find((w) => w.id === id && w.creator === me.id)
  const [f, setF] = useState(old ? { title: old.title, cat: old.cat, desc: old.desc, tools: old.tools, vis: old.status === 'Draft' ? 'draft' : 'publish', url: old.url, file: old.file } : { title: '', cat: '', desc: '', tools: [], vis: 'publish', url: null, file: null })
  const [tag, setTag] = useState(''), [tried, setTried] = useState(false), [ask, setAsk] = useState(false), [drag, setDrag] = useState(false), [fe, setFe] = useState('')
  if (id && !old) return <div className="empty">Work not found. <L to="/creator/portfolio" style={{ color: 'var(--acc)' }}>Back to My Portfolio</L></div>
  const pick = (file) => { if (!file) return; if (!/^image\//.test(file.type)) return setFe('Please choose an image file (JPG, PNG, WebP).'); if (file.size > 50 * 1024 * 1024) return setFe('File is larger than 50 MB.'); setFe(''); setF({ ...f, url: URL.createObjectURL(file), file: null }) }
  const has = f.url || f.file
  const e = { file: !has && 'A work file is required', title: !f.title.trim() && 'Work title is required', cat: !f.cat && 'Category is required' }
  const save = (draft) => {
    setTried(true)
    if (!draft && Object.values(e).some(Boolean)) return
    if (draft && !f.title.trim()) return setTried(true)
    const w = { id: old?.id || 'w' + Date.now(), title: f.title.trim(), year: old?.year || 2026, cat: f.cat || 'Others', tools: f.tools, desc: f.desc, url: f.url, file: f.file, creator: me.id, likes: old?.likes || 0, comments: old?.comments || [], status: draft || f.vis === 'draft' ? 'Draft' : 'Published' }
    setWorks(old ? works.map((x) => x.id === old.id ? w : x) : [w, ...works]); say(draft ? 'Draft saved' : old ? 'Work updated' : 'Work uploaded successfully'); go('/creator/portfolio')
  }
  const addTag = (ev) => { if (ev.key === 'Enter') { ev.preventDefault(); const t = tag.trim(); if (t && !f.tools.includes(t)) setF({ ...f, tools: [...f.tools, t] }); setTag('') } }
  const prev = { ...f, id: 'x', likes: old?.likes || 0, comments: old?.comments || [], creator: me.id, title: f.title || 'Work Title' }
  return <div className="two" style={{ gridTemplateColumns: '1.6fr 1fr' }}>
    <div>
      <h1>{old ? 'Edit Work' : 'Upload New Work'}</h1><p className="small muted" style={{ marginBottom: 16 }}><L to="/creator/portfolio">My Portfolio</L> › {old ? 'Edit Work' : 'Upload Work'}</p>
      <div className="drop" style={drag ? { borderColor: 'var(--acc)' } : null} onDragOver={(ev) => { ev.preventDefault(); setDrag(true) }} onDragLeave={() => setDrag(false)} onDrop={(ev) => { ev.preventDefault(); setDrag(false); pick(ev.dataTransfer.files[0]) }}>
        <p>{has ? '✓ File selected' : 'Drag & drop your work file here'}</p><p className="small muted">(image · max. 50 MB)</p>
        <label className="btn sm" style={{ marginTop: 10 }}>{has ? 'Replace File' : 'Choose File'}<input type="file" accept="image/*" hidden onChange={(ev) => pick(ev.target.files[0])} /></label>
      </div>
      {(fe || (tried && e.file)) && <div className="err" role="alert" style={{ marginBottom: 10 }}>{fe || e.file}</div>}
      <div style={{ marginTop: 16 }}>
        <Field label="Work Title *" err={tried && e.title}><input type="text" value={f.title} onChange={(ev) => setF({ ...f, title: ev.target.value })} placeholder="Enter work title" /></Field>
        <div className="row" style={{ alignItems: 'flex-start' }}>
          <div className="grow"><Field label="Category *" err={tried && e.cat}><select value={f.cat} onChange={(ev) => setF({ ...f, cat: ev.target.value })}><option value="">Select category…</option>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></Field></div>
          <div className="grow"><Field label="Skill / Tools" hint="Press Enter to add a tag"><input type="text" value={tag} onChange={(ev) => setTag(ev.target.value)} onKeyDown={addTag} placeholder="Add a tag, e.g. Blender" /></Field></div>
        </div>
        <div className="row wrapx" style={{ gap: 6, margin: '-6px 0 14px' }}>{f.tools.map((t) => <button key={t} className="pill on" onClick={() => setF({ ...f, tools: f.tools.filter((x) => x !== t) })}>{t} ×</button>)}</div>
        <Field label="Description"><textarea value={f.desc} onChange={(ev) => setF({ ...f, desc: ev.target.value })} placeholder="Describe your process & the tools you used…" /></Field>
        <div className="row" style={{ marginBottom: 18 }}><b className="small">Visibility</b>{[['publish', 'Publish'], ['draft', 'Save as Draft']].map(([v, l]) => <label className="chk" key={v}><input type="radio" name="vis" checked={f.vis === v} onChange={() => setF({ ...f, vis: v })} />{l}</label>)}</div>
        <div className="row between"><button className="btn" onClick={() => setAsk(true)}>Cancel</button><div className="row"><button className="btn" onClick={() => save(true)}>Save Draft</button><button className="btn pri" onClick={() => save(false)}>{old ? 'Save Changes' : 'Upload Work'}</button></div></div>
        {tried && !f.title.trim() && <div className="err" style={{ textAlign: 'right' }}>Add a title to save a draft.</div>}
      </div>
    </div>
    <div className="stack">
      <h3 style={{ marginTop: 6 }}>Work Card Preview</h3>
      {has ? <WorkCard w={prev} to="/creator/upload" /> : <div className="card"><div className="thumb" /><div className="cap"><b>{prev.title}</b><div className="meta"><span>by {me.name}</span><span>♥ 0 · ✎ 0</span></div><Badge b={me.badge} /></div></div>}
      <div className="note">Uploaded works appear on your creator profile and the home page, visible to everyone without login.</div>
    </div>
    {ask && <Modal onClose={() => setAsk(false)}><h3>Discard changes?</h3><p className="muted" style={{ margin: '8px 0 18px' }}>Data you entered will not be saved.</p><div className="row" style={{ justifyContent: 'flex-end' }}><button className="btn pri" onClick={() => setAsk(false)}>Keep Editing</button><button className="btn" onClick={() => go('/creator/portfolio')}>Discard</button></div></Modal>}
  </div>
}

/* K-04 */
function Experience() {
  const { me, exp, setExp, say } = useStore()
  const blank = { title: '', org: '', role: '', start: '', end: '', type: 'Commercial', desc: '', link: '' }
  const [f, setF] = useState(blank), [eid, setEid] = useState(null), [tried, setTried] = useState(false), [del, setDel] = useState(null)
  const list = exp[me.id] || []
  const years = Array.from({ length: 16 }, (_, i) => String(2026 - i))
  const save = () => {
    setTried(true); if (!f.title.trim() || !f.role.trim()) return
    const item = { ...f, end: f.end || f.start || 'Present', id: eid || 'e' + Date.now() }
    setExp({ ...exp, [me.id]: eid ? list.map((x) => x.id === eid ? item : x) : [item, ...list] }); setF(blank); setEid(null); setTried(false); say('Experience saved')
  }
  return <>
    <h1>Project Experience</h1><p className="muted">Commercial & academic project history (shown on your public profile)</p>
    <div className="two" style={{ gridTemplateColumns: '1.3fr 1fr', marginTop: 8 }}>
      <div className="tl">{list.map((x) => <div key={x.id}><div className="panel"><div className="row between" style={{ alignItems: 'flex-start' }}>
        <div><b>{x.title}</b><div className="small muted">{x.role}{x.org ? ' · ' + x.org : ''} · {x.start}{x.end && x.end !== x.start ? ' – ' + x.end : ''}</div><span className="pill" style={{ marginTop: 6 }}>{x.type}</span></div>
        <div className="row" style={{ gap: 6 }}><button className="btn sm" onClick={() => { setF({ ...blank, ...x }); setEid(x.id) }}>Edit</button><button className="btn sm dan" onClick={() => setDel(x)}>Delete</button></div></div>
        {x.desc && <p className="small muted" style={{ marginTop: 8 }}>{x.desc}</p>}</div></div>)}
        {!list.length && <div className="empty">No experience yet. Add your first project on the right.</div>}</div>
      <div className="panel"><h3>{eid ? 'Edit Experience' : 'Add Experience'}</h3>
        <Field label="Project Title *" err={tried && !f.title.trim() && 'Project title is required'}><input type="text" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="Project name" /></Field>
        <Field label="Role *" err={tried && !f.role.trim() && 'Role is required'}><input type="text" value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })} placeholder="e.g. 3D Animator, Rigger" /></Field>
        <Field label="Studio / Organization"><input type="text" value={f.org} onChange={(e) => setF({ ...f, org: e.target.value })} /></Field>
        <div className="row"><div className="grow"><Field label="Start year"><select value={f.start} onChange={(e) => setF({ ...f, start: e.target.value })}><option value="">Start year</option>{years.map((y) => <option key={y}>{y}</option>)}</select></Field></div>
          <div className="grow"><Field label="End year"><select value={f.end} onChange={(e) => setF({ ...f, end: e.target.value })}><option value="">End year</option><option>Present</option>{years.map((y) => <option key={y}>{y}</option>)}</select></Field></div></div>
        <div className="row" style={{ marginBottom: 14 }}><b className="small">Project Type</b>{['Commercial', 'Academic'].map((t) => <label className="chk" key={t}><input type="radio" name="pt" checked={f.type === t} onChange={() => setF({ ...f, type: t })} />{t}</label>)}</div>
        <Field label="Description"><textarea value={f.desc} onChange={(e) => setF({ ...f, desc: e.target.value })} placeholder="Short description & your contribution…" /></Field>
        <Field label="Link (optional)"><input type="url" value={f.link} onChange={(e) => setF({ ...f, link: e.target.value })} placeholder="https://" /></Field>
        <div className="row between"><button className="btn" onClick={() => { setF(blank); setEid(null); setTried(false) }}>Cancel</button><button className="btn pri" onClick={save}>Save Experience</button></div>
      </div>
    </div>
    {del && <Confirm title="Delete this experience?" text={`“${del.title}” will be removed from your public profile.`} onClose={() => setDel(null)} onOk={() => { setExp({ ...exp, [me.id]: list.filter((x) => x.id !== del.id) }); say('Experience deleted') }} />}
  </>
}

/* K-05 */
function EditProfile() {
  const { me, creators, setCreators, say } = useStore()
  const [f, setF] = useState({ name: me.name, spec: me.spec, bio: me.bio, skills: me.skills, avatar: me.avatar, showreel: me.showreel || '', cv: me.cv, cvName: me.cv ? me.cv.split('/').pop() : '', ArtStation: me.links.ArtStation || '', Behance: me.links.Behance || '', LinkedIn: me.links.LinkedIn || '', Instagram: me.links.Instagram || '' })
  const [tag, setTag] = useState(''), [tried, setTried] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const save = () => {
    setTried(true); if (!f.name.trim() || !f.spec.trim()) return
    const links = Object.fromEntries(['ArtStation', 'Behance', 'LinkedIn', 'Instagram'].filter((k) => f[k]).map((k) => [k, f[k]]))
    setCreators(creators.map((c) => c.id === me.id ? { ...c, name: f.name.trim(), spec: f.spec, bio: f.bio, skills: f.skills, avatar: f.avatar, showreel: f.showreel, cv: f.cv, links } : c)); say('Profile saved')
  }
  const photo = (file) => { if (file) setF({ ...f, avatar: URL.createObjectURL(file) }) }
  return <div className="two" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
    <div><h1 style={{ marginBottom: 16 }}>Edit Profile</h1>
      <div className="row" style={{ marginBottom: 18 }}><Avatar c={{ name: f.name, avatar: f.avatar }} cls="lg" /><div><label className="btn sm">Change Photo<input type="file" accept="image/png,image/jpeg" hidden onChange={(e) => photo(e.target.files[0])} /></label><div className="hint">JPG/PNG, max. 2 MB</div></div></div>
      <Field label="Full Name *" err={tried && !f.name.trim() && 'Full name is required'}><input type="text" value={f.name} onChange={set('name')} /></Field>
      <Field label="Specialization *" err={tried && !f.spec.trim() && 'Specialization is required'}><input type="text" value={f.spec} onChange={set('spec')} placeholder="e.g. 3D Animator" /></Field>
      <Field label="Bio"><textarea value={f.bio} onChange={set('bio')} placeholder="Tell us about yourself & your working style…" /></Field>
      <Field label="Skills" hint="Type and press Enter to add a skill">
        <div className="panel" style={{ padding: 10, background: '#0e0e0e' }}><div className="row wrapx" style={{ gap: 6 }}>{f.skills.map((s) => <button key={s} className="pill on" onClick={() => setF({ ...f, skills: f.skills.filter((x) => x !== s) })}>{s} ×</button>)}
          <input type="text" style={{ border: 0, flex: 1, minWidth: 140, background: 'none' }} value={tag} onChange={(e) => setTag(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); const t = tag.trim(); if (t && !f.skills.includes(t)) setF({ ...f, skills: [...f.skills, t] }); setTag('') } }} placeholder="Add a skill…" /></div></div></Field>
      <div className="row between" style={{ marginTop: 20 }}><button className="btn" onClick={() => go('/creator')}>Cancel</button><button className="btn pri" onClick={save}>Save</button></div>
    </div>
    <div className="stack">
      <L to={`/creators/${me.id}`} className="btn blk">View Public Profile ↗</L>
      <div className="panel"><Field label="Showreel / Demo Reel Link" hint="YouTube or Vimeo link, shown as “Watch Showreel” on your public profile"><input type="url" value={f.showreel} onChange={set('showreel')} placeholder="https://youtube.com/watch?v=…" /></Field></div>
      <div className="panel"><h3>CV</h3>
        {f.cv ? <div className="row between small"><span>📄 {f.cvName}</span><span className="row"><a className="btn sm" href={f.cv} target="_blank" rel="noreferrer">View</a><button className="btn sm dan" onClick={() => setF({ ...f, cv: null, cvName: '' })}>Remove</button></span></div> : <p className="small muted">No CV uploaded yet.</p>}
        <label className="btn sm" style={{ marginTop: 10 }}>{f.cv ? 'Replace CV' : 'Upload CV (PDF)'}<input type="file" accept="application/pdf" hidden onChange={(e) => { const x = e.target.files[0]; if (x) setF({ ...f, cv: URL.createObjectURL(x), cvName: x.name }) }} /></label></div>
      <Field label="ArtStation"><input type="url" value={f.ArtStation} onChange={set('ArtStation')} placeholder="https://artstation.com/…" /></Field>
      <Field label="Behance / Website"><input type="url" value={f.Behance} onChange={set('Behance')} placeholder="https://" /></Field>
      <Field label="LinkedIn"><input type="url" value={f.LinkedIn} onChange={set('LinkedIn')} placeholder="https://linkedin.com/in/…" /></Field>
      <Field label="Instagram"><input type="text" value={f.Instagram} onChange={set('Instagram')} placeholder="@username" /></Field>
      <div className="note">Only you can see the Edit Profile button.</div>
    </div>
  </div>
}

/* K-07 */
function BadgePage() {
  const { me, works, exp, reqs, setReqs, reqHist, setReqHist, say } = useStore()
  const [modal, setModal] = useState(null), [reason, setReason] = useState(''), [ev, setEv] = useState(''), [tried, setTried] = useState(false)
  const nW = works.filter((w) => w.creator === me.id && w.status === 'Published').length, ex = exp[me.id] || [], comm = ex.some((x) => x.type === 'Commercial')
  const idx = BADGES.indexOf(me.badge), pending = reqs.find((r) => r.creator === me.id && r.status === 'Pending')
  const rules = {
    Sprout: [['Active account', true], ['At least 1 published work', nW >= 1]],
    Sapling: [['Alumni status', me.status === 'Alumni'], ['At least 5 works + 1 project experience', nW >= 5 && ex.length >= 1]],
    Ficus: [['Commercial project experience', comm], ['Complete portfolio & showreel', !!me.showreel && nW >= 5]],
  }
  const desc = { Sprout: 'Active student', Sapling: 'Recent graduate', Ficus: 'Professional practitioner' }
  const submit = () => {
    setTried(true); if (!reason.trim()) return
    const r = { id: 'b' + Date.now(), creator: me.id, from: me.badge, to: modal, date: '2026-10-22', status: 'Pending', works: nW, exp: ex.length, showreel: !!me.showreel, reason, evidence: ev, note: '' }
    setReqs([r, ...reqs]); setReqHist([{ id: r.id, date: r.date, req: `${me.badge} → ${modal}`, status: 'Pending', note: 'Under admin review' }, ...reqHist]); setModal(null); setReason(''); setEv(''); setTried(false); say('Badge request submitted')
  }
  const hist = reqHist.map((h) => { const r = reqs.find((x) => x.id === h.id); return r ? { ...h, status: r.status, note: r.status === 'Pending' ? 'Under admin review' : r.note || h.note } : h })
  return <>
    <h1>Badge Status</h1><p className="muted" style={{ marginBottom: 16 }}>Badges show your career development stage</p>
    <div className="grid g3">{BADGES.map((b, i) => {
      const state = i < idx ? 'Achieved' : i === idx ? 'Current' : i === idx + 1 && rules[b].every((r) => r[1]) ? 'Can be requested' : i === idx + 1 ? 'Requirements not met' : 'Locked'
      return <div key={b} className={'bcard' + (i === idx ? ' cur' : i > idx ? ' lock' : '')}>
        <div className="row between"><Badge b={b} /><span className="small muted">{state}</span></div>
        <h3 style={{ margin: '12px 0 6px' }}>{desc[b]}</h3><b className="small">Requirements:</b>
        <ul className="small muted" style={{ paddingLeft: 0, listStyle: 'none', margin: '6px 0 14px' }}>{rules[b].map(([t, ok]) => <li key={t}>{ok ? '✓' : '○'} {t}</li>)}</ul>
        {i === idx + 1 && <button className="btn pri blk" disabled={!rules[b].every((r) => r[1]) || !!pending} onClick={() => setModal(b)}>{pending ? 'Request pending' : rules[b].every((r) => r[1]) ? 'Request Badge' : 'Requirements not met'}</button>}
      </div>
    })}</div>
    <h2 style={{ margin: '28px 0 12px' }}>Request History</h2>
    <div className="tblwrap"><table className="tbl"><thead><tr><th>Date</th><th>Request</th><th>Status</th><th>Admin Notes</th></tr></thead><tbody>{hist.map((h) => <tr key={h.id}><td>{fmt(h.date)}</td><td>{h.req}</td><td><Status s={h.status} /></td><td className="muted">{h.note}</td></tr>)}</tbody></table></div>
    {modal && <Modal onClose={() => setModal(null)}><h3>Request {modal} badge</h3><p className="small muted" style={{ margin: '4px 0 14px' }}>An admin will review your portfolio and profile.</p>
      <Field label="Target badge"><input type="text" value={modal} disabled /></Field>
      <Field label="Evidence / portfolio link (optional)"><input type="url" value={ev} onChange={(e) => setEv(e.target.value)} placeholder="https://" /></Field>
      <Field label="Reason *" err={tried && !reason.trim() && 'Please enter a reason'}><textarea value={reason} onChange={(e) => setReason(e.target.value)} /></Field>
      <div className="row" style={{ justifyContent: 'flex-end' }}><button className="btn" onClick={() => setModal(null)}>Cancel</button><button className="btn pri" onClick={submit}>Submit Request</button></div></Modal>}
  </>
}
