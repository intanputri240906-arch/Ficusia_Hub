import { createContext, useContext, useEffect, useState } from 'react'
import { img, initialCreators, initialWorks, initialJobs, initialBadgeRequests, initialReports, experience } from './data'

export const Ctx = createContext(null)
export const useStore = () => useContext(Ctx)

export function useHash() {
  const get = () => location.hash.replace(/^#/, '') || '/'
  const [p, setP] = useState(get)
  useEffect(() => {
    const f = () => { setP(get()); window.scrollTo(0, 0) }
    addEventListener('hashchange', f); return () => removeEventListener('hashchange', f)
  }, [])
  return p
}
export const go = (p) => { location.hash = p }
export const L = ({ to, children, ...r }) => <a href={'#' + to} {...r}>{children}</a>

export function Provider({ children }) {
  const [creators, setCreators] = useState(initialCreators)
  const [works, setWorks] = useState(initialWorks)
  const [jobs, setJobs] = useState(initialJobs)
  const [reqs, setReqs] = useState(initialBadgeRequests)
  const [reports, setReports] = useState(initialReports)
  const [exp, setExp] = useState(experience)
  const [liked, setLiked] = useState({})
  const [user, setUser] = useState(null) // {role, id, name}
  const [toast, setToast] = useState('')
  const [reqHist, setReqHist] = useState([
    { id: 'h1', date: '2026-08-12', req: 'New account', status: 'Approved', note: 'Initial badge granted automatically' },
    { id: 'h2', date: '2026-09-01', req: 'Sprout → Sapling', status: 'Approved', note: 'Alumni status verified' },
    { id: 'h3', date: '2026-09-28', req: 'Sapling → Ficus', status: 'Approved', note: 'Commercial experience and showreel verified' },
  ])
  const say = (m) => { setToast(m); setTimeout(() => setToast(''), 2600) }
  const creator = (id) => creators.find((c) => c.id === id)
  const me = user && user.role === 'creator' ? creator(user.id) : null
  const v = { creators, setCreators, works, setWorks, jobs, setJobs, reqs, setReqs, reports, setReports, exp, setExp, liked, setLiked, user, setUser, say, creator, me, reqHist, setReqHist }
  return <Ctx.Provider value={v}>{children}{toast && <div className="toast" role="status">{toast}</div>}</Ctx.Provider>
}

export const initials = (n = '') => n.split(' ').map((x) => x[0]).slice(0, 2).join('').toUpperCase()
export const Avatar = ({ c, cls = '' }) => c?.avatar
  ? <img className={'av ' + cls} src={c.avatar} alt={c.name} />
  : <span className={'av ' + cls} aria-hidden>{initials(c?.name)}</span>
export const Badge = ({ b }) => <span className={'badge ' + b}>{b}</span>
export const Status = ({ s }) => <span className={'st ' + s}>{s}</span>
export const fmt = (d) => { const x = new Date(d); return isNaN(x) ? d : `${String(x.getDate()).padStart(2, '0')}/${String(x.getMonth() + 1).padStart(2, '0')}/${x.getFullYear()}` }
export const workSrc = (w, t) => w.url || img(w.file, t)

export function WorkCard({ w, to }) {
  const { creator } = useStore()
  const c = creator(w.creator)
  return (
    <L to={to || `/works/${w.id}`} className="card">
      <div className="thumb"><img src={workSrc(w, true)} alt={w.title} loading="lazy" /></div>
      <div className="cap">
        <b>{w.title}</b>
        <div className="meta"><span>by {c?.name}</span><span>♥ {w.likes} · ✎ {w.comments.length}</span></div>
        {c && <Badge b={c.badge} />}
      </div>
    </L>
  )
}
export const JobLogo = ({ j }) => {
  const cols = ['#13aff0', '#3ecf8e', '#f5b942', '#c792ea', '#ff8a65']
  return <span className="logo-sq" style={{ background: cols[(j.company.length) % 5] }}>{j.company[0]}</span>
}
export function Pager({ page, pages, set }) {
  if (pages < 2) return null
  return <div className="pager">
    <button aria-label="Previous page" onClick={() => set(Math.max(1, page - 1))}>‹</button>
    {Array.from({ length: pages }, (_, i) => <button key={i} className={page === i + 1 ? 'on' : ''} onClick={() => set(i + 1)}>{i + 1}</button>)}
    <button aria-label="Next page" onClick={() => set(Math.min(pages, page + 1))}>›</button>
  </div>
}
export function Modal({ children, onClose }) {
  useEffect(() => { const f = (e) => e.key === 'Escape' && onClose(); addEventListener('keydown', f); return () => removeEventListener('keydown', f) }, [onClose])
  return <div className="modal-bg" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><div className="modal" role="dialog" aria-modal="true">{children}</div></div>
}
export function Confirm({ title, text, ok = 'Delete', onOk, onClose }) {
  return <Modal onClose={onClose}><h3>{title}</h3><p className="muted" style={{ margin: '8px 0 18px' }}>{text}</p>
    <div className="row" style={{ justifyContent: 'flex-end' }}><button className="btn" onClick={onClose}>Cancel</button><button className="btn dan" onClick={() => { onOk(); onClose() }}>{ok}</button></div></Modal>
}
export const Field = ({ label, err, hint, children }) => <label className="field"><span>{label}</span>{children}{err && <div className="err">{err}</div>}{hint && <div className="hint">{hint}</div>}</label>

export function download(name, rows) {
  const csv = rows.map((r) => r.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(',')).join('\n')
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = name; a.click()
}
