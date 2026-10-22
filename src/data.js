export const CATEGORIES = ['3D Animation', '2D Animation', 'Concept Art', 'Motion Graphic', 'Others']
export const TOOLS = ['Blender', 'Maya', 'Rigging', 'ZBrush', 'Compositing', 'Substance Painter', 'Photoshop', 'Storyboarding']
export const BADGES = ['Sprout', 'Sapling', 'Ficus']
export const img = (n, t) => `img/${n}${t ? '-t' : ''}.jpg`

export const initialCreators = [
  { id: 'riki', name: 'Riki Oktav', spec: 'Illustrator & Character Designer', status: 'Alumni', badge: 'Ficus', email: 'riki.oktav@gmail.com', active: true,
    skills: ['Substance Painter', 'Storyboarding', 'Character Design', 'Illustration', 'ZBrush', 'Blender'],
    bio: 'Illustrator and lecturer based in Batam, Indonesia. MFA in Animation from SCAD and a Fulbright alumnus, specializing in illustration, character design, and storyboarding.',
    showreel: 'https://www.youtube.com/', links: { ArtStation: 'https://www.artstation.com/', Behance: 'https://www.behance.net/', LinkedIn: 'https://www.linkedin.com/in/riki-oktav' },
    cv: 'files/Riki-Oktav-CV.pdf', avatar: 'img/maniac-t.jpg', banner: 'img/desert.jpg' },
  { id: 'intan', name: 'Intan Rahmadani Putri', spec: '3D Animator', status: 'Student', badge: 'Sprout', email: 'intan@email.com', active: true, skills: ['Blender', 'Maya'], bio: 'Animation student at Politeknik Negeri Batam.', links: {} },
  { id: 'juni', name: 'Juni Friskenny Sinaga', spec: 'Concept Artist', status: 'Alumni', badge: 'Sapling', email: 'juni@email.com', active: true, skills: ['Photoshop', 'Blender'], bio: 'Animation alumni focusing on concept art.', links: {} },
  { id: 'rafi', name: 'Rafi Pratama', spec: 'Motion Designer', status: 'Student', badge: 'Sprout', email: 'rafi@email.com', active: true, skills: ['Compositing'], bio: 'Motion graphics enthusiast.', links: {} },
  { id: 'dewi', name: 'Dewi Lestari', spec: '2D Animator', status: 'Alumni', badge: 'Sapling', email: 'dewi@email.com', active: false, skills: ['Photoshop', 'Rigging'], bio: '2D animator and illustrator.', links: {} },
]

const c = (u, t, h) => ({ user: u, text: t, ago: h })
export const initialWorks = [
  { id: 'w1', title: 'Maniac', year: 2023, cat: '3D Animation', tools: ['ZBrush', 'Substance Painter', 'Blender'], file: 'maniac', creator: 'riki', likes: 31, status: 'Published', desc: 'A mischievous kid piloting a teapot tank. A character and prop design exercise, from sculpt to texture.', comments: [c('budi_3d', 'The teapot silhouette is so fun. Love the worn paint.', '2 hours ago'), c('sari.anim', 'Great character energy!', '1 day ago')] },
  { id: 'w2', title: 'Shrines', year: 2023, cat: '3D Animation', tools: ['Blender', 'Substance Painter'], file: 'shrines', creator: 'riki', likes: 24, status: 'Published', desc: 'A small shrine and torii gate environment with hand-painted wood and moss details.', comments: [c('rina_k', 'The lantern lighting is lovely.', '3 hours ago')] },
  { id: 'w3', title: 'Abandoned Van', year: 2024, cat: '3D Animation', tools: ['Substance Painter', 'Blender'], file: 'van', creator: 'riki', likes: 42, status: 'Published', desc: 'A weathered vintage van with layered rust, chipped paint, and grime. A texturing study in Substance Painter.', comments: [c('dewi_l', 'The rust work is incredible.', '5 hours ago'), c('budi_3d', 'Would love a breakdown!', '1 day ago'), c('rafi.p', 'So believable.', '2 days ago')] },
  { id: 'w4', title: 'Torii Gate', year: 2025, cat: 'Concept Art', tools: ['Photoshop'], file: 'torii', creator: 'riki', likes: 28, status: 'Published', desc: 'A quiet stairway through a forest, framed by a torii gate. Digital painting focused on color and mood.', comments: [c('sari.anim', 'Such a calm scene.', '1 day ago')] },
  { id: 'w5', title: 'A Girl Playing around The Ricefield', year: 2025, cat: 'Concept Art', tools: ['Photoshop'], file: 'ricefield', creator: 'riki', likes: 36, status: 'Published', desc: 'A summer afternoon by the rice field, with big clouds and soft painterly light.', comments: [c('rina_k', 'The clouds are gorgeous.', '4 hours ago'), c('dewi_l', 'Feels like a Ghibli frame.', '2 days ago')] },
  { id: 'w6', title: 'A Van in a Desert', year: 2021, cat: 'Concept Art', tools: ['Photoshop'], file: 'desert', creator: 'riki', likes: 19, status: 'Published', desc: 'A lone camper van in a surreal desert. Early environment concept exploration.', comments: [] },
]
export const initialJobs = [
  { id: 'j1', title: 'Junior 3D Animator', company: 'Kepri Kreatif Studio', type: 'Internship', location: 'Batam', deadline: '2026-11-30', posted: '2026-10-05', status: 'Active', interested: 12, skills: ['Blender', 'Maya', 'Rigging'], desc: 'Support the production team on short animated projects, from blocking to polish.', qual: ['Animation or related study program', 'Basic knowledge of Blender or Maya', 'Portfolio or showreel link'], apply: 'https://example.com/apply' },
  { id: 'j2', title: 'Motion Designer', company: 'Batam Pixel Works', type: 'Full-time', location: 'Batam', deadline: '2026-12-10', posted: '2026-10-12', status: 'Active', interested: 10, skills: ['Compositing', 'Photoshop'], desc: 'Create motion graphics for ads, social media, and product launches.', qual: ['1+ year of motion design experience', 'Strong sense of timing and layout'], apply: 'https://example.com/apply' },
  { id: 'j3', title: 'Concept Artist', company: 'Nusantara Games', type: 'Freelance', location: 'Remote', deadline: '2026-11-15', posted: '2026-10-01', status: 'Draft', interested: 8, skills: ['Photoshop', 'ZBrush'], desc: 'Design characters and environments for an upcoming mobile adventure game.', qual: ['Strong portfolio of character or environment concepts'], apply: 'https://example.com/apply' },
  { id: 'j4', title: 'Texture Artist Intern', company: 'Lagoon Animation', type: 'Internship', location: 'Batam / Remote', deadline: '2026-11-20', posted: '2026-09-28', status: 'Active', interested: 6, skills: ['Substance Painter', 'Blender'], desc: 'Texture props and environments for a stylized animated series.', qual: ['Experience with Substance Painter', 'Eye for material detail'], apply: 'https://example.com/apply' },
  { id: 'j5', title: 'Storyboard Artist', company: 'Riau Story Lab', type: 'Full-time', location: 'Batam', deadline: '2026-10-01', posted: '2026-08-20', status: 'Closed', interested: 4, skills: ['Storyboarding', 'Photoshop'], desc: 'Translate scripts into clear, cinematic storyboards.', qual: ['Understanding of visual storytelling'], apply: 'https://example.com/apply' },
  { id: 'j6', title: '2D Animator', company: 'Sunrise Motion', type: 'Freelance', location: 'Remote', deadline: '2026-12-20', posted: '2026-10-15', status: 'Active', interested: 2, skills: ['Rigging', 'Photoshop'], desc: 'Frame-by-frame and rigged 2D animation for short explainer videos.', qual: ['Solid animation fundamentals', 'Reliable delivery'], apply: 'https://example.com/apply' },
]
export const experience = {
  riki: [
    { id: 'e1', title: 'Head of Animation Study Program', org: 'Politeknik Negeri Batam', role: 'Head of Program', start: '2025', end: 'Present', type: 'Academic', desc: 'Leading the animation study program and curriculum.' },
    { id: 'e2', title: 'Lecturer, Animation', org: 'Politeknik Negeri Batam', role: 'Lecturer', start: '2024', end: 'Present', type: 'Academic', desc: 'Teaching animation and pre-production courses.' },
    { id: 'e3', title: 'Historical Adventure in Cinematic Animation', org: 'Savannah College of Art and Design', role: 'Teaching Assistant', start: '2024', end: '2024', type: 'Academic', desc: 'Assisted the professor in the cinematic animation class.' },
    { id: 'e4', title: 'Event Promotion Art Direction', org: 'Smart Idea Event Organizer', role: 'Art Director', start: '2014', end: '2015', type: 'Commercial', desc: 'Art direction for events in Jakarta.' },
    { id: 'e5', title: 'SME Promotion Campaigns', org: 'Batampos Entrepreneur School', role: 'Graphic Designer', start: '2013', end: '2014', type: 'Commercial', desc: 'Graphic design and event hosting to promote small-medium enterprises.' },
    { id: 'e6', title: 'Mall Promotion Design', org: 'Mega Mall Batam Center', role: 'Graphic Designer', start: '2012', end: '2012', type: 'Commercial', desc: 'Graphic design for in-mall promotions.' },
  ],
}
export const education = [
  ['Master of Fine Arts, Animation', 'Savannah College of Art and Design', '2022 – 2024'],
  ['Bachelor of Applied Science, Multimedia and Networking', 'Politeknik Negeri Batam', '2015 – 2017'],
  ['Exchange Student, Graphic Design', 'Politeknik Negeri Media Kreatif', '2015 – 2016'],
]
export const honors = ['Fulbright Master’s Program', 'Fulbright Long Term English Program', 'PERMATA (Pertukaran Mahasiswa Nusantara)', 'AAI Short Course: Developing and Protecting IP in the Animation Industry']
export const initialBadgeRequests = [
  { id: 'b1', creator: 'intan', from: 'Sprout', to: 'Sapling', date: '2026-10-20', status: 'Pending', works: 5, exp: 1, showreel: true, reason: 'I just graduated and have completed five portfolio works.', note: '' },
  { id: 'b2', creator: 'juni', from: 'Sapling', to: 'Ficus', date: '2026-10-19', status: 'Pending', works: 14, exp: 3, showreel: true, reason: 'I have worked on three commercial projects and updated my showreel.', note: '' },
  { id: 'b3', creator: 'rafi', from: 'Sprout', to: 'Sapling', date: '2026-10-17', status: 'Pending', works: 2, exp: 0, showreel: false, reason: 'Requesting an upgrade after graduation.', note: '' },
  { id: 'b4', creator: 'dewi', from: 'Sprout', to: 'Sapling', date: '2026-10-02', status: 'Approved', works: 8, exp: 1, showreel: true, reason: 'Alumni status updated.', note: 'Approved.' },
]
export const initialReports = [
  { id: 'r1', kind: 'Comment', text: 'Reported comment content…', by: 'budi_3d', author: 'anon_22', reason: 'Inappropriate', status: 'Pending', date: '2026-10-21' },
  { id: 'r2', kind: 'Work', text: 'Maniac', work: 'w1', by: 'rina_k', author: 'Riki Oktav', reason: 'Wrong category', status: 'Pending', date: '2026-10-21' },
  { id: 'r3', kind: 'Comment', text: 'Check my profile for free assets!!', by: 'sari.anim', author: 'promo_bot', reason: 'Spam', status: 'Pending', date: '2026-10-20' },
  { id: 'r4', kind: 'Comment', text: 'Another comment…', by: 'dewi_l', author: 'user_88', reason: 'Spam', status: 'Under review', date: '2026-10-19' },
]
