const SITE_URL = 'https://jamhuriafyaortho.co.ke'
const SITE_NAME = 'Jamhuri Orthopedic and Afya Services'
const DEFAULT_OG_IMAGE = '/images/clinicoutside.jpg'

const pages = {
  home: {
    seoTitle: 'Orthopaedic & Primary Care in Thika | Jamhuri Afya',
    seoDescription:
      'Orthopaedic and primary care in Thika, Kenya. Bone and joint care, physiotherapy, chronic disease support, and easy appointments.',
    seoPath: '/',
    seoSchema: true,
  },
  services: {
    seoTitle: 'Orthopaedic Services in Thika | Jamhuri Afya',
    seoDescription:
      'Comprehensive orthopaedic consultations, fracture care, physiotherapy, pain management, paediatric orthopaedics, and primary healthcare at our Thika clinic.',
    seoPath: '/services',
  },
  team: {
    seoTitle: 'Medical Team in Thika | Jamhuri Afya',
    seoDescription:
      'Meet Dr. George Maingi and the experienced team at Jamhuri Orthopedic and Afya Services, trusted specialists in Thika, Kenya.',
    seoPath: '/team',
  },
  resources: {
    seoTitle: 'Health Resources | Jamhuri Afya Thika',
    seoDescription:
      'Trusted orthopaedic and primary health articles, guides, and patient resources from Jamhuri Orthopedic and Afya Services in Thika, Kenya.',
    seoPath: '/resources',
  },
  contact: {
    seoTitle: 'Contact Jamhuri Afya Clinic in Thika',
    seoDescription:
      'Reach Jamhuri Orthopedic and Afya Services in Thika, Jomoko, Garissa Road. Call +254 722 314 884 or send a message to book care.',
    seoPath: '/contact',
    seoSchema: true,
  },
  appointments: {
    seoTitle: 'Book an Appointment in Thika | Jamhuri Afya',
    seoDescription:
      'Schedule an orthopaedic or primary care appointment at Jamhuri Orthopedic and Afya Services, Thika. Same-week availability for new and returning patients.',
    seoPath: '/appointments',
  },
  login: {
    seoTitle: `Patient Login | ${SITE_NAME}`,
    seoDescription: 'Secure patient portal login for Jamuhuri Orthopedic and Afya Services.',
    seoPath: '/login',
    seoNoindex: true,
  },
  signup: {
    seoTitle: `Create Account | ${SITE_NAME}`,
    seoDescription: 'Register for the Jamuhuri Orthopedic and Afya Services patient portal.',
    seoPath: '/signup',
    seoNoindex: true,
  },
  user: {
    seoTitle: `Health Dashboard | ${SITE_NAME}`,
    seoDescription: 'Personal health tracker and patient dashboard.',
    seoPath: '/user',
    seoNoindex: true,
  },
  admin: {
    seoTitle: `Admin Dashboard | ${SITE_NAME}`,
    seoDescription: 'Clinic administration dashboard.',
    seoPath: '/admin',
    seoNoindex: true,
  },
  bpGraph: {
    seoTitle: `Blood Pressure Tracker | ${SITE_NAME}`,
    seoDescription: 'Blood pressure tracking tool.',
    seoPath: '/bpGraph',
    seoNoindex: true,
  },
  verifyOtp: {
    seoTitle: `Verify Account | ${SITE_NAME}`,
    seoDescription: 'Verify your patient account.',
    seoPath: '/signup',
    seoNoindex: true,
  },
}

module.exports = { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE, pages }
