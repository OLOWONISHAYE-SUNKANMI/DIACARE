export const en = {
  // App general
  appName: "DARE",
  appDescription: "Diabetes Awareness, Routine & Empowerment",
  appSlogan: "The first diabetes management and monitoring platform in Africa",
  
  // Navigation
  nav: {
    home: "Home",
    charts: "Data", 
    doses: "Doses",
    teleconsultation: "Telehealth",
    chat: "Chat",
    assistant: "Assistant",
    journal: "Journal",
    blog: "Blog",
    family: "Family",
    profile: "Profile",
    reminders: "Reminders"
  },

  // Journal Screen
  journal: {
    title: "Journal",
    subtitle: "Detailed tracking of your glucose levels and injections",
    glucose: "Glucose",
    insulin: "Insulin",
    newEntry: "New entry",
    insulinReminder: "Insulin Reminder",
    filters: {
      today: "Today",
      week: "7 days",
      month: "30 days"
    },
    context: {
      beforeMeal: "Before meal",
      afterMeal: "After meal",
      fasting: "Fasting",
      bedtime: "Bedtime"
    },
    status: {
      target: "In target",
      slightlyHigh: "Slightly high",
      high: "High",
      low: "Low"
    },
    weeklyStats: {
      title: "Weekly summary",
      inTarget: "In target",
      onTimeInjections: "On-time injections",
      avgGlucose: "Average glucose"
    },
    advice: {
      title: "💡 Personalized DARE advice",
      example: "Excellent adherence this week! Your late afternoon glucose levels are slightly elevated. Consider adjusting your 3 PM snack or advancing your Humalog injection by 10 minutes."
    },
    injected: "Injected at",
    missed: "Missed injection"
  },

  // Charts Screen
  charts: {
    title: "Charts",
    subtitle: "Analysis of your glucose data",
    glucoseAnalysis: "Glucose Analysis",
    timeInRange: "Time in Range",
    weeklyTrends: "Weekly Trends",
    last7Days: "Last 7 days",
    zones: {
      veryHigh: "High",
      high: "Above",
      target: "Target",
      low: "Low"
    },
    stats: {
      average: "Average",
      variability: "Variability",
      estimatedHbA1c: "Estimated HbA1c",
      peakMax: "Peak Max"
    },
    objective: "Goal: >70% in target",
    percentageByDay: "Percentage of time in target per day"
  },

  // Doses Screen
  doses: {
    title: "Doses",
    subtitle: "Manage your insulin doses",
    lantus: "Lantus (Basal)",
    humalog: "Humalog (Rapid)",
    active: "Active",
    pending: "Pending",
    usualDose: "Usual dose",
    scheduledTime: "Scheduled time",
    lastInjection: "Last injection",
    markAsInjected: "Mark as injected",
    currentGlucose: "Current glucose (mg/dL)",
    mealCarbs: "Meal carbs",
    calculatedDose: "Calculated Dose",
    correction: "Correction",
    meal: "Meal",
    total: "Total",
    scheduleInjection: "Schedule injection",
    missedInjection: "Missed Injection",
    ignore: "Ignore",
    injectNow: "Inject now",
    history7Days: "7-day history",
    adherence: "adherence",
    injectionMarked: "Injection marked",
    injectionSuccess: "marked as injected successfully",
    injectionsPer: "Injections completed / scheduled per day"
  },

  // Reminders Screen
  reminders: {
    title: "My Reminders",
    subtitle: "Manage your reminders for insulin, medications, tests and more",
    newReminder: "New Reminder",
    upcomingReminders: "Upcoming reminders (2h)",
    today: "Today",
    allReminders: "All reminders",
    noReminders: "No reminders configured",
    noRemindersDesc: "Create your first reminder to never forget your treatments",
    createReminder: "Create reminder",
    dose: "Dose",
    soon: "Soon",
    done: "Done",
    deleteConfirm: "Are you sure you want to delete this reminder?",
    days: {
      everyday: "Every day",
      weekdays: "Mon-Fri",
      monday: "Mon",
      tuesday: "Tue",
      wednesday: "Wed",
      thursday: "Thu",
      friday: "Fri",
      saturday: "Sat",
      sunday: "Sun"
    }
  },

  // Blog/News Screen
  blog: {
    title: "DARE News",
    subtitle: "News and advice on diabetes",
    readMore: "Read",
    readFull: "Read full article",
    author: "Author",
    source: "Source",
    publishedOn: "Published on",
    saveArticle: "Save article",
    categories: {
      nutrition: "Nutrition",
      technology: "Technology",
      research: "Research",
      lifestyle: "Lifestyle",
      treatment: "Treatment"
    }
  },
  
  // Authentication
  auth: {
    signIn: "Sign In",
    signUp: "Sign Up",
    signOut: "Sign Out",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    forgotPassword: "Forgot Password?",
    noAccount: "No account?",
    hasAccount: "Already have an account?",
    loading: "Loading...",
    signInTitle: "Sign In",
    signUpTitle: "Sign Up",
    description: "Access your DARE account",
    appSlogan: "African Diabetes & Excellence Resources",
    patient: "Patient",
    professional: "Professional",
    family: "Family",
    firstName: "First Name",
    lastName: "Last Name",
    professionalCode: "Professional Code",
    patientCode: "Patient Code",
    familyAccess: "Access family space",
    professionalAccess: "Access professional space",
    codeProvidedByPatient: "Code provided by patient",
    professionalNotRegistered: "Not registered yet?",
    requestProfessionalAccess: "Request professional access",
    needHelp: "Need help?",
    familyAccessGuide: "Family access guide",
    termsAcceptance: "By signing in, you agree to our",
    termsOfUse: "Terms of Use",
    privacyPolicy: "Privacy Policy",
    and: "and our",
    support: "Support",
    passwordMinLength: "Minimum 6 characters",
    confirmPasswordPlaceholder: "Confirm your password",
    emailPlaceholder: "your@email.com",
    professionalCodePlaceholder: "Professional access code",
    patientCodePlaceholder: "Patient access code",
    connecting: "Connecting...",
    registering: "Registering...",
    signInButton: "Sign In",
    signUpButton: "Sign Up",
    // Error messages
    invalidCredentials: "Invalid email or password",
    emailNotConfirmed: "Please confirm your email before signing in",
    userAlreadyExists: "An account already exists with this email address",
    passwordMismatch: "Passwords do not match",
    passwordTooShort: "Password must be at least 6 characters long",
    invalidPatientCode: "Please enter a valid patient code",
    invalidOrExpiredCode: "Invalid or expired patient code",
    connectionError: "An error occurred during connection",
    registrationError: "An error occurred during registration",
    // Success messages
    loginSuccess: "Login successful!",
    welcomePatient: "Welcome to your patient space.",
    registrationSuccess: "Registration successful!",
    choosePlan: "Choose your DiaCare plan",
    confirmEmail: "Check your email to confirm your account.",
    familyAccessGranted: "Family access granted!",
    welcomeFamily: "Welcome to the DiaCare family space.",
    professionalLoginSuccess: "Professional login successful!",
    welcomeProfessional: "Welcome to your professional space."
  },

  // Home screen
  home: {
    welcome: "Welcome",
    latestGlucose: "Latest glucose",
    addGlucose: "Add glucose",
    quickActions: "Quick actions",
    todayStats: "Today's stats",
    medicationReminder: "Medication reminder",
    upcomingAppointment: "Upcoming appointment"
  },

  // Glucose
  glucose: {
    level: "Glucose level",
    normal: "Normal",
    low: "Low",
    high: "High",
    addReading: "Add reading",
    beforeMeal: "Before meal",
    afterMeal: "After meal",
    bedtime: "Bedtime",
    morning: "Morning",
    comment: "Comment"
  },

  // Medications
  medication: {
    title: "Medications",
    addMedication: "Add medication",
    dosage: "Dosage",
    frequency: "Frequency",
    time: "Time",
    taken: "Taken",
    missed: "Missed",
    insulin: "Insulin",
    metformin: "Metformin"
  },

  // Professional
  professional: {
    dashboard: "Professional dashboard",
    patients: "Patients",
    consultations: "Consultations",
    earnings: "Earnings",
    schedule: "Schedule",
    startConsultation: "Start consultation",
    endConsultation: "End consultation",
    consultationNotes: "Consultation notes",
    fee: "Fee",
    payment: "Payment",
    pending: "Pending",
    completed: "Completed",
    duration: "Duration",
    patientCode: "Patient code"
  },

  // Chat and Community
  chat: {
    title: "Community chat",
    typeMessage: "Type your message...",
    send: "Send",
    glucoseShare: "Glucose Share",
    mealShare: "Diabetes-friendly meal",
    progress: "Achievement",
    estimatedCarbs: "Estimated carbs"
  },

  // Common
  common: {
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    close: "Close",
    confirm: "Confirm",
    back: "Back",
    next: "Next",
    previous: "Previous",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    warning: "Warning",
    info: "Information",
    today: "Today",
    yesterday: "Yesterday",
    thisWeek: "This week",
    thisMonth: "This month",
    mg_dl: "mg/dL",
    mmol_l: "mmol/L"
  },

  // Notifications
  notifications: {
    medicationTime: "Time to take your medication",
    glucoseReminder: "Don't forget to check your glucose",
    appointmentReminder: "Appointment in 1 hour",
    dataShared: "Data shared successfully",
    accessGranted: "Access granted to healthcare professional",
    accessDenied: "Access denied to healthcare professional"
  },

  // Home Screen
  homeScreen: {
    mission: "DARE Mission",
    todaysChallenges: "Today's Challenges",
    darePackage: "DARE Package",
    completePlan: "DARE Complete",
    premium: "PREMIUM",
    monthlyPrice: "CFA F/month",
    healthPriceless: "Your health is priceless",
    unlimitedLogbook: "Unlimited glucose logbook",
    smartReminders: "Smart insulin reminders",
    clarityCharts: "Clarity-style charts",
    advancedCalculator: "Advanced dose calculator",
    familySupport: "Family support",
    aiAssistant: "DARE AI Assistant",
    startTracking: "Start my DARE tracking",
    freeTrial: "✨ 7-day free trial",
    cancelAnytime: "Cancel anytime • Support included",
    lastReading: "Today 2:30 PM",
    diabetes: "Diabetes",
    management: "Management",
    awareness: "Awareness",
    education: "Education",
    routine: "Routine",
    daily: "Daily",
    empowerment: "Empowerment",
    control: "Control",
    measureGlucose: "Measure glucose 3x today",
    takeMedication: "Take medications on time",
    physicalActivity: "30 min physical activity",
    noteObservations: "Note observations"
  },

  // Profile Screen
  profileScreen: {
    years: "years old",
    yearsWithDare: "Years with DARE",
    glucoseMeasures: "Glucose measurements",
    adherence: "Adherence",
    personalInfo: "Personal Information",
    fullName: "Full name",
    dateOfBirth: "Date of birth",
    age: "Age",
    phone: "Phone",
    city: "City",
    profession: "Profession",
    medicalTeam: "Medical Team",
    doctor: "Primary care physician • Diabetologist",
    followUpCenter: "Follow-up facility",
    consultant: "Consulting endocrinologist",
    currentTreatment: "Current Treatment",
    insulins: "Insulins",
    keepCool: "Stored cool (clay pot)",
    oralMedications: "Oral medications",
    price: "Price",
    glucoseTarget: "Glucose target",
    adaptedClimate: "Adapted to tropical climate",
    emergencyContact: "Emergency Contact",
    spouse: "Spouse",
    call: "Call",
    sms: "SMS",
    settings: "Settings",
    notifications: "Notifications",
    dataSharing: "Data sharing",
    darkMode: "Dark mode",
    editProfile: "Edit profile",
    exportData: "Export data",
    privacy: "Privacy",
    signOut: "Sign out",
    verified: "✓ Verified Profile"
  },

  // Chat Screen
  chatScreen: {
    title: "DARE Chat",
    membersConnected: "members connected",
    successesThisWeek: "💚 142 successes this week",
    inTargetZone: "🎯 89% in target zone",
    newMembers: "👥 12 new members",
    kindness: "💚 Kindness",
    mutualHelp: "🤝 Mutual help",
    sharedMotivation: "🎯 Shared motivation",
    typingMessage: "Write your supportive message...",
    typing: "typing...",
    messageSent: "Message sent",
    messageShared: "Your message was shared with the DARE community"
  },

  // Legal
  legal: {
    termsTitle: "Terms of Use",
    termsDescription: "Please read our terms of use carefully",
    privacyTitle: "Privacy Policy",
    privacyDescription: "Learn how we protect your personal data",
    termsContent: `
      <h3>1. Acceptance of Terms</h3>
      <p>By using DARE (Diabetes Awareness, Routine & Empowerment), you accept these terms of use.</p>
      
      <h3>2. Service Description</h3>
      <p>DARE is the first diabetes management and monitoring platform in Africa, offering:</p>
      <ul>
        <li>Personalized glucose monitoring</li>
        <li>Medication management and reminders</li>
        <li>Teleconsultations with healthcare professionals</li>
        <li>Support community</li>
        <li>Analysis and prediction tools</li>
      </ul>
      
      <h3>3. User Account</h3>
      <p>You are responsible for maintaining the confidentiality of your account and password.</p>
      
      <h3>4. Acceptable Use</h3>
      <p>You agree to:</p>
      <ul>
        <li>Provide accurate information</li>
        <li>Respect other users</li>
        <li>Not share others' medical information</li>
        <li>Use the platform for legal purposes only</li>
      </ul>
      
      <h3>5. Health Data</h3>
      <p>Your health data is strictly confidential and only shared with your explicit consent.</p>
      
      <h3>6. Teleconsultations</h3>
      <p>Medical consultations are provided by certified professionals. They do not replace emergency care.</p>
      
      <h3>7. Limitation of Liability</h3>
      <p>DARE provides diabetes management tools but does not replace professional medical advice.</p>
      
      <h3>8. Termination</h3>
      <p>You may delete your account at any time. We reserve the right to suspend accounts for violations.</p>
      
      <h3>9. Modifications</h3>
      <p>We reserve the right to modify these terms with notice.</p>
      
      <h3>10. Contact</h3>
      <p>For any questions: support@dare-africa.com</p>
    `,
    privacyContent: `
      <h3>1. Data Collection</h3>
      <p>We collect data you provide to us:</p>
      <ul>
        <li>Registration information (name, email, phone)</li>
        <li>Health data (glucose, medications, symptoms)</li>
        <li>Platform usage data</li>
      </ul>
      
      <h3>2. Data Usage</h3>
      <p>Your data is used to:</p>
      <ul>
        <li>Personalize your experience</li>
        <li>Provide analysis and recommendations</li>
        <li>Facilitate teleconsultations</li>
        <li>Improve our services</li>
      </ul>
      
      <h3>3. Data Protection</h3>
      <p>We use advanced encryption technologies and comply with GDPR and ISO 27001 standards.</p>
      
      <h3>4. Data Sharing</h3>
      <p>Your data is NEVER sold. It may only be shared:</p>
      <ul>
        <li>With your explicit consent</li>
        <li>With healthcare professionals you authorize</li>
        <li>When legally required</li>
      </ul>
      
      <h3>5. Anonymized Data</h3>
      <p>We may use anonymized data for medical research and improving diabetes care in Africa.</p>
      
      <h3>6. Your Rights</h3>
      <p>You have the right to:</p>
      <ul>
        <li>Access your data</li>
        <li>Correct incorrect information</li>
        <li>Delete your account and data</li>
        <li>Export your data</li>
        <li>Limit data usage</li>
      </ul>
      
      <h3>7. Data Retention</h3>
      <p>Your data is retained while your account is active, then deleted within 30 days of closure.</p>
      
      <h3>8. Cookies</h3>
      <p>We use essential cookies for platform operation and analytics cookies with your consent.</p>
      
      <h3>9. International Transfers</h3>
      <p>Your data is hosted in Africa. Any international transfer complies with data protection agreements.</p>
      
      <h3>10. DPO Contact</h3>
      <p>For any data questions: dpo@dare-africa.com</p>
      
      <p><strong>Last updated:</strong> December 2024</p>
    `
  }
};