const SITE_URL = process.env.SITE_URL || 'https://jamhuriafyaortho.co.ke'
const SITE_NAME = 'Jamuhuri Orthopedic and Afya Services'
const DEFAULT_OG_IMAGE = '/images/clinicoutside.jpg'

const pages = {
  home: {
    seoTitle: `${SITE_NAME} | Orthopaedic & Primary Care in Thika, Kenya`,
    seoDescription:
      'Expert orthopaedic and primary healthcare in Thika — bone & joint care, physiotherapy, chronic disease management, and same-day appointments. Book online today.',
    seoPath: '/',
    seoSchema: true,
  },
  services: {
    seoTitle: `Orthopaedic & Medical Services | ${SITE_NAME}, Thika`,
    seoDescription:
      'Comprehensive orthopaedic consultations, fracture care, physiotherapy, pain management, paediatric orthopaedics, and primary healthcare at our Thika clinic.',
    seoPath: '/services',
  },
  team: {
    seoTitle: `Our Medical Team | ${SITE_NAME}, Thika`,
    seoDescription:
      'Meet Dr. George Maingi and the experienced team at Jamuhuri Orthopedic and Afya Services — trusted specialists in Thika, Kenya.',
    seoPath: '/team',
  },
  resources: {
    seoTitle: `Free Health Resources | ${SITE_NAME}`,
    seoDescription:
      'Trusted orthopaedic and primary health articles, guides, and patient resources from Jamuhuri Orthopedic and Afya Services in Thika, Kenya.',
    seoPath: '/resources',
  },
  contact: {
    seoTitle: `Contact Us | ${SITE_NAME}, Thika`,
    seoDescription:
      'Reach Jamuhuri Orthopedic and Afya Services in Thika — Jomoko, Garissa Road. Call +254 722 314 884 or send a message to book care.',
    seoPath: '/contact',
    seoSchema: true,
  },
  appointments: {
    seoTitle: `Book an Appointment | ${SITE_NAME}, Thika`,
    seoDescription:
      'Schedule an orthopaedic or primary care appointment at Jamuhuri Orthopedic and Afya Services, Thika. Same-week availability for new and returning patients.',
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
