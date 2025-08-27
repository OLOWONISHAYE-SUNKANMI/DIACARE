
export const en = {
  // App general
  appName: "DiabCare",
  appDescription: "",
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
    blog: "News",
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
      title: "💡 Personalized DiabCare advice",
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

  // Blog/News Screen - COMPLETE
  blog: {
    title: "DiabCare News",
    subtitle: "News and advice on diabetes",
    readMore: "Read",
    readFull: "Read full article",
    author: "Author",
    source: "Source",
    publishedOn: "Published on",
    saveArticle: "Save article",
    search: "Search...",
    all: "All",
    categories: {
      all: "All",
      research: "Research",
      nutrition: "Nutrition", 
      mental: "Mental",
      innovation: "Innovation",
      testimonials: "Testimonials",
      technology: "Technology",
      lifestyle: "Lifestyle",
      treatment: "Treatment"
    },
    readingTime: "min",
    trending: "Trending",
    internationalNews: "International diabetes news",
    searchNews: "Search news...",
    by: "By",
    saveArticleBtn: "Save",
    fullSource: "Full source",
    reliableSources: "Reliable sources",
    verifiedNews: "All our news is verified and comes from internationally recognized medical sources"
  },

  // Activities
  activities: {
    walking: "Walking",
    running: "Running/Jogging",
    cycling: "Cycling", 
    dancing: "Dancing",
    weightlifting: "Weight Training",
    swimming: "Swimming",
    soccer: "Soccer",
    basketball: "Basketball",
    selectActivity: "Select an activity",
    intensity: {
      light: "Light",
      moderate: "Moderate",
      intense: "Intense"
    },
    duration: "Duration (minutes)",
    caloriesBurned: "Calories burned",
    addActivity: "Add activity",
    activityRecorded: "Activity recorded"
  },

  // Glucose contexts
  glucoseContext: {
    fasting: "Fasting",
    beforeMeal: "Before meal",
    afterMeal: "After meal", 
    bedtime: "Bedtime",
    random: "Random",
    exercise: "After exercise"
  },

  // Modals and forms
  modals: {
    selectValue: "Select a value",
    enterValue: "Please enter a glucose value",
    time: "Time",
    now: "Now",
    custom: "Custom", 
    context: "Context",
    notes: "Notes (optional)",
    duration: "Duration",
    minutes: "minutes"
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
    description: "Access your DiabCare account",
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
    mmol_l: "mmol/L",
    send: "Send",
    sending: "Sending..."
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
    mission: "DiabCare Mission",
    
    darePackage: "DiabCare Package",
    completePlan: "DiabCare Complete",
    premium: "PREMIUM",
    monthlyPrice: "CFA F/month",
    healthPriceless: "Your health is priceless",
    unlimitedLogbook: "Unlimited glucose logbook",
    smartReminders: "Smart insulin reminders",
    clarityCharts: "Clarity-style charts",
    advancedCalculator: "Advanced dose calculator",
    familySupport: "Family support",
    aiAssistant: "DiabCare AI Assistant",
    startTracking: "Start my DiabCare tracking",
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
  },

  // Profile Screen
  profileScreen: {
    years: "years old",
    yearsWithDare: "Years with DiabCare",
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
    title: "DiabCare Chat",
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
    messageShared: "Your message was shared with the DiabCare community"
  },

  // Legal
  legal: {
    termsTitle: "Terms of Use",
    termsDescription: "Please read our terms of use carefully",
    privacyTitle: "Privacy Policy",
    privacyDescription: "Learn how we protect your personal data",
    termsContent: `
      <h3>1. Acceptance of Terms</h3>
      <p>By using DiabCare (Diabetes Awareness, Routine & Empowerment), you accept these terms of use.</p>
      
      <h3>2. Service Description</h3>
      <p>DiabCare is the first diabetes management and monitoring platform in Africa, offering:</p>
      <ul>
        <li>Personalized glucose monitoring</li>
        <li>Medication management and reminders</li>
        <li>Teleconsultations with healthcare professionals</li>
        <li>Support community</li>
        <li>Analysis and prediction tools</li>
      </ul>
      
      <h3>3. User Account</h3>
      <p>You are responsible for maintaining the confidentiality of your account and password.</p>
    `
  },

  // Onboarding
  onboarding: {
    step: "Step",
    of: "of",
    getStarted: "Get Started",
    languageSelection: {
      title: "Choose your language",
      description: "Select your preferred language to use DiabCare"
    },
    welcome: {
      title: "Welcome to DiabCare",
      subtitle: "The first African diabetes management platform",
      description: "We're excited to accompany you on your health journey"
    },
    profile: {
      title: "Set up your profile",
      subtitle: "Help us personalize your DiabCare experience",
      description: "This information will help us provide you with tailored care",
      namePlaceholder: "Enter your first name",
      userType: "I am a..."
    },
    privacy: {
      title: "Privacy and preferences",
      subtitle: "Control your data and notifications",
      description: "Configure your privacy preferences",
      notifications: "Push notifications",
      notificationsDesc: "Receive reminders for medications and measurements",
      dataSharing: "Anonymous data sharing",
      dataSharingDesc: "Contribute to diabetes research (optional)",
      reminders: "Smart reminders",
      remindersDesc: "Adaptive reminders based on your habits"
    },
    features: {
      title: "Discover DiabCare",
      subtitle: "All the features to manage your diabetes",
      description: "Here's what DiabCare can do for you",
      glucose: "Glucose monitoring",
      reminders: "Smart reminders",
      consultation: "Teleconsultations", 
      community: "Support community",
      tracking: "Complete tracking",
      trackingDesc: "Glucose, medications, activities and more",
      ai: "AI Assistant",
      aiDesc: "Personalized advice based on your data",
      telehealth: "Telemedicine",
      telehealthDesc: "Consultations with certified professionals",
      support: "Community",
      supportDesc: "Connect with other people with diabetes"
    },
    completion: {
      title: "Setup complete!",
      description: "Your DiabCare account is ready to use"
    }
  },

  // Common additions
  enable: "Enable",
  disable: "Disable",

  // Admin sections
  admin: {
    notifications: "🔔 Admin Notifications",
    noNotifications: "No notifications",
    newActivities: "New activities will appear here",
    clearAll: "Clear all",
    applications: "Professional applications management",
    totalApplications: "Total applications",
    pending: "Pending",
    allStatuses: "All statuses",
    approve: "Approve",
    reject: "Reject",
    viewDetails: "View details",
    applicationSubmitted: "Application submitted",
    documents: "Documents",
    actions: "Actions",
    license: "License",
    city: "City",
    institution: "Institution",
    noDocuments: "No documents",
    notSpecified: "Not specified"
  },

  // Form labels
  forms: {
    email: "Email",
    phone: "Phone",
    time: "Time",
    now: "Now",
    context: "Measurement context",
    measurementTime: "Measurement time",
    title: "Reminder title",
    reminderType: "Reminder type",
    mealName: "Meal name",
    mealTime: "Meal time",
    breakfast: "Breakfast",
    lunch: "Lunch", 
    dinner: "Dinner",
    snack: "Snack",
    calories: "Calories",
    profilePhoto: "Profile photo"
  },

  // Activities
  activityTypes: {
    walking: "Walking",
    running: "Running",
    cycling: "Cycling",
    swimming: "Swimming",
    weightlifting: "Weight lifting",
    other: "Other",
    light: "Light",
    moderate: "Moderate",
    intense: "Intense",
    estimation: "Estimation"
  },

  // Medications
  medicationTypes: {
    rapidInsulin: "Rapid insulin",
    slowInsulin: "Slow insulin",
    metformin: "Metformin"
  },

  // Error messages
  errors: {
    error: "Error",
    cannotLoadPlans: "Cannot load plans",
    codeNotFound: "Code not found",
    genericError: "An error occurred"
  },

  // Modals additions
  modalExtras: {
    scanProduct: "Scan Product",
    productScanSimulation: "Product scan simulation",
    takePhoto: "Take Photo",
    aiMealAnalysis: "AI meal analysis",
    manualEntry: "Manual Entry",
    enterInformation: "Enter information",
    followCarbs: "Track your carbs easily"
  },

  // Blog additions
  blogExtras: {
    reliableSources: "Reliable sources",
    sources: "Nature Medicine • The Lancet • WHO • ADA"
  },

  // Professional additions
  professionalExtras: {
    patientInformation: "Patient Information",
    stackTrace: "Stack trace"
  },

  nativeHeader: {
    title: 'Diabetes Assistant',
    greetings: "Greetings",
    question: 'How is your diabetes today?'
  },

  bloodSugar: {
    title: 'Current Blood Sugar',
    state: 'Normal',
    measurement: 'Last measurement',
  },

  Actions: {
    actions: 'Rapid Actions',
    actionsPopover: {
      bloodSugar: {
        increment: 'Add Blood Sugar'
      },
      title: 'New Glucose Reading',
      input1: 'Blood Sugar',
      notes: 'optional',
      comments: 'Comments'
    },
    button: 'Save'
  },

  Journal: {
    title: "Meal Journal",
    media: {
      scanner: 'Scan barcode',
      photo: 'Photo + AI'
    },
    manualEntry: 'or manual entry',
    title1: 'Food Name',
    title2: 'Carbohydrates',
    optional: 'optional',
    button: 'Add Food'
  },

  Medication: {
    title: 'Medications',
    subtitle: 'Save Medication',
    title2: 'Type of medication',
    select: 'Select a Medication',
    dose: 'Dose',
    unit: 'unit',
    button: 's'
  },

  Activity: {
    title: 'Activity',
    subtitle: 'Physical Activity',
    type: 'Type of Activity',
    select: 'Select an activity',
    Popover: {
      one: "Walking",
      two: "Running",
      three: "Cycling",
      four: "Swimming",
      five: "Weight Training",
      six: "Other",
    },
    duration: 'Duration',
    button: 'Register'
  },

  Alerts: {
    title: 'AI Predictive Alerts',
    urgent: 'Urgent',
    monitor: 'To Monitor'
  }
};