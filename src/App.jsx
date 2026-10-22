import { useState } from 'react'
import { Provider, useStore, useHash, L, go, Avatar } from './ui'
import { Home, Works, WorkDetail, Creators, CreatorProfile, Jobs, JobDetail, Auth } from './pages/public'
import { CreatorShell } from './pages/creator'
import { AdminShell } from './pages/admin'

function Nav({ path }) {
  const { user, setUser, me, say } = useStore()
  const [open, setOpen] = useState(false)
  const on = (p) => (p === '/' ? path === '/' : path.startsWith(p)) ? 'on' : ''
  const home = user?.role === 'admin' ? '/admin' : '/creator'
  const out = () => { setUser(null); setOpen(false); say('You have been logged out'); go('/') }
  return (
    <header className="nav"><div className="wrap">
      <L to="/" className="logo"><i>F</i>FICUSIA HUB</L>
      {user?.role === 'admin' && <span className="pill on">ADMIN</span>}
      {user?.role !== 'admin' && <nav className="links" aria-label="Main">
        <L to="/" className={on('/')}>Home</L><L to="/works" className={on('/works')}>Works</L>
        <L to="/creators" className={on('/creators')}>Creators</L><L to="/jobs" className={on('/jobs')}>Jobs</L>
      </nav>}
      <span className="sp" />
      {!user ? <><L to="/login" className="btn sm">Login</L><L to="/login?signup" className="btn sm pri">Sign Up</L></> :
        <div className="menu">
          <button className="row" style={{ background: 'none', border: 0 }} onClick={() => setOpen(!open)} aria-expanded={open}>
            <Avatar c={me || { name: 'Admin' }} /><span>{me?.name || 'Admin'} ▾</span>
          </button>
          {open && <div className="pop" onClick={() => setOpen(false)}>
            <L to={home}>Dashboard</L>{me && <L to={`/creators/${me.id}`}>My public profile</L>}<button onClick={out}>Logout</button>
          </div>}
        </div>}
    </div></header>
  )
}

function Router({ path, full }) {
  const { user } = useStore()
  const p = path.split('/').filter(Boolean)
  if (p[0] === 'creator' || p[0] === 'admin') {
    const need = p[0]
    if (!user || user.role !== need) return <Auth guard={need} />
    return need === 'creator' ? <CreatorShell p={p} /> : <AdminShell p={p} />
  }
  if (!p.length) return <Home />
  if (p[0] === 'works') return p[1] ? <WorkDetail id={p[1]} /> : <Works key={full} />
  if (p[0] === 'creators') return p[1] ? <CreatorProfile id={p[1]} /> : <Creators />
  if (p[0] === 'jobs') return p[1] ? <JobDetail id={p[1]} /> : <Jobs />
  if (p[0] === 'login') return <Auth key={full} />
  return <div className="wrap"><div className="empty" style={{ marginTop: 40 }}>Page not found. <L to="/" style={{ color: 'var(--acc)' }}>Back to Home</L></div></div>
}

function Layout() {
  const full = useHash()
  const path = full.split('?')[0]
  const dash = path.startsWith('/creator/') || path === '/creator' || path.startsWith('/admin')
  return <>
    <Nav path={path} />
    <Router path={path} full={full} />
    {!dash && <footer className="foot"><div className="wrap"><span>© 2026 Ficusia Hub · Animation Creator Portfolio & Career Directory</span><span>Politeknik Negeri Batam</span></div></footer>}
  </>
}
export default function App() { return <Provider><Layout /></Provider> }
