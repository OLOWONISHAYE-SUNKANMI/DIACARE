export const en = {
  // App general
  appName: 'Klukoo',
  appDescription: '',
  appSlogan: 'The first diabetes management and monitoring platform in Africa',

  // Navigation
  nav: {
    home: 'Home',
    charts: 'Data',
    doses: 'Doses',
    teleconsultation: 'Telehealth',
    chat: 'Chat',
    assistant: 'Assistant',
    journal: 'Journal',
    blog: 'News',
    family: 'Family',
    profile: 'Profile',
    reminders: 'Reminders',
  },

  // Journal Screen
  journal: {
    title: 'Journal',
    subtitle: 'Detailed tracking of your glucose levels and injections',
    glucose: 'Glucose',
    insulin: 'Insulin',
    newEntry: 'New entry',
    insulinReminder: 'Insulin Reminder',
    filters: {
      today: 'Today',
      week: '7 days',
      month: '30 days',
    },
    context: {
      beforeMeal: 'Before meal',
      afterMeal: 'After meal',
      fasting: 'Fasting',
      bedtime: 'Bedtime',
    },
    status: {
      target: 'In target',
      slightlyHigh: 'Slightly high',
      high: 'High',
      low: 'Low',
    },
    weeklyStats: {
      title: 'Weekly summary',
      inTarget: 'In target',
      onTimeInjections: 'On-time injections',
      avgGlucose: 'Average glucose',
    },
    advice: {
      title: '💡 Personalized Klukoo advice',
      example:
        'Excellent adherence this week! Your late afternoon glucose levels are slightly elevated. Consider adjusting your 3 PM snack or advancing your Humalog injection by 10 minutes.',
    },
    injected: 'Injected at',
    missed: 'Missed injection',
  },
  charts: {
    title: 'Charts',
    subtitle: 'Analysis of your glucose data',

    // Sections
    glucose: 'Blood Glucose',
    meals: 'Meals',
    activities: 'Activities',
    medications: 'Medications',

    glucoseAnalysis: 'Glucose Analysis',
    timeInRange: 'Time in Range',
    weeklyTrends: 'Weekly Trends',
    last7Days: 'Last 7 days',

    zones: {
      veryHigh: 'High',
      high: 'Above',
      target: 'Target',
      low: 'Low',
    },

    stats: {
      average: 'Average',
      variability: 'Variability',
      estimatedHbA1c: 'Estimated HbA1c',
      peakMax: 'Peak Max',
      latest: 'Latest',
    },

    objective: 'Goal: >70% in target',
    percentageByDay: 'Percentage of time in target per day',

    trend: {
      title: 'Trends',
      message: 'Percentage of time in range this week',
    },
  },

  // Doses Screen
  doses: {
    title: 'Doses',
    subtitle: 'Manage your insulin doses',
    lantus: 'Lantus (Basal)',
    humalog: 'Humalog (Rapid)',
    active: 'Active',
    pending: 'Pending',
    usualDose: 'Usual dose',
    scheduledTime: 'Scheduled time',
    lastInjection: 'Last injection',
    markAsInjected: 'Mark as injected',
    currentGlucose: 'Current glucose (mg/dL)',
    mealCarbs: 'Meal carbs',
    calculatedDose: 'Calculated Dose',
    correction: 'Correction',
    meal: 'Meal',
    total: 'Total',
    scheduleInjection: 'Schedule injection',
    missedInjection: 'Missed Injection',
    ignore: 'Ignore',
    injectNow: 'Inject now',
    history7Days: '7-day history',
    adherence: 'adherence',
    injectionMarked: 'Injection marked',
    injectionSuccess: 'marked as injected successfully',
    injectionsPer: 'Injections completed / scheduled per day',
  },

  // Reminders Screen
  reminders: {
    title: 'My Reminders',
    subtitle: 'Manage your reminders for insulin, medications, tests and more',
    newReminder: 'New Reminder',
    upcomingReminders: 'Upcoming reminders (2h)',
    today: 'Today',
    allReminders: 'All reminders',
    noReminders: 'No reminders configured',
    noRemindersDesc:
      'Create your first reminder to never forget your treatments',
    createReminder: 'Create reminder',
    dose: 'Dose',
    soon: 'Soon',
    done: 'Done',
    deleteConfirm: 'Are you sure you want to delete this reminder?',
    days: {
      everyday: 'Every day',
      weekdays: 'Mon-Fri',
      monday: 'Mon',
      tuesday: 'Tue',
      wednesday: 'Wed',
      thursday: 'Thu',
      friday: 'Fri',
      saturday: 'Sat',
      sunday: 'Sun',
    },
  },

  // Blog/News Screen - COMPLETE
  blog: {
    title: 'Klukoo News',
    subtitle: 'News and advice on diabetes',
    readMore: 'Read',
    readFull: 'Read full article',
    author: 'Author',
    source: 'Source',
    publishedOn: 'Published on',
    saveArticle: 'Save article',
    search: 'Search...',
    all: 'All',
    categories: {
      all: 'All',
      research: 'Research',
      nutrition: 'Nutrition',
      mental: 'Mental',
      innovation: 'Innovation',
      testimonials: 'Testimonials',
      technology: 'Technology',
      lifestyle: 'Lifestyle',
      treatment: 'Treatment',
    },
    readingTime: 'min',
    trending: 'Trending',
    internationalNews: 'International diabetes news',
    searchNews: 'Search news...',
    by: 'By',
    saveArticleBtn: 'Save',
    fullSource: 'Full source',
    reliableSources: 'Reliable sources',
    verifiedNews:
      'All our news is verified and comes from internationally recognized medical sources',
  },

  // Activities
  activities: {
    walking: 'Walking',
    running: 'Running/Jogging',
    cycling: 'Cycling',
    dancing: 'Dancing',
    weightlifting: 'Weight Training',
    swimming: 'Swimming',
    soccer: 'Soccer',
    basketball: 'Basketball',
    selectActivity: 'Select an activity',
    intensity: {
      light: 'Light',
      moderate: 'Moderate',
      intense: 'Intense',
    },
    duration: 'Duration (minutes)',
    caloriesBurned: 'Calories burned',
    addActivity: 'Add activity',
    activityRecorded: 'Activity recorded',
  },

  // Glucose contexts
  glucoseContext: {
    fasting: 'Fasting',
    beforeMeal: 'Before meal',
    afterMeal: 'After meal',
    bedtime: 'Bedtime',
    random: 'Random',
    exercise: 'After exercise',
  },

  // Modals and forms
  modals: {
    selectValue: 'Select a value',
    enterValue: 'Please enter a glucose value',
    time: 'Time',
    now: 'Now',
    custom: 'Custom',
    context: 'Context',
    notes: 'Notes (optional)',
    duration: 'Duration',
    minutes: 'minutes',
  },

  // Authentication
  auth: {
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signOut: 'Sign Out',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    forgotPassword: 'Forgot Password?',
    noAccount: 'No account?',
    hasAccount: 'Already have an account?',
    loading: 'Loading...',
    signInTitle: 'Sign In',
    signUpTitle: 'Sign Up',
    description: 'Access your Klukoo account',
    appSlogan: 'African Diabetes & Excellence Resources',
    patient: 'Patient',
    professional: 'Professional',
    family: 'Family',
    firstName: 'First Name',
    lastName: 'Last Name',
    professionalCode: 'Professional Code',
    patientCode: 'Patient Code',
    familyAccess: 'Access family space',
    professionalAccess: 'Access professional space',
    codeProvidedByPatient: 'Code provided by patient',
    professionalNotRegistered: 'Not registered yet?',
    requestProfessionalAccess: 'Request professional access',
    needHelp: 'Need help?',
    familyAccessGuide: 'Family access guide',
    termsAcceptance: 'By signing in, you agree to our',
    termsOfUse: 'Terms of Use',
    privacyPolicy: 'Privacy Policy',
    and: 'and our',
    support: 'Support',
    passwordMinLength: 'Minimum 6 characters',
    confirmPasswordPlaceholder: 'Confirm your password',
    emailPlaceholder: 'your@email.com',
    professionalCodePlaceholder: 'Professional access code',
    patientCodePlaceholder: 'Patient access code',
    connecting: 'Connecting...',
    registering: 'Registering...',
    signInButton: 'Sign In',
    signUpButton: 'Sign Up',
    // Error messages
    invalidCredentials: 'Invalid email or password',
    emailNotConfirmed: 'Please confirm your email before signing in',
    userAlreadyExists: 'An account already exists with this email address',
    passwordMismatch: 'Passwords do not match',
    passwordTooShort: 'Password must be at least 6 characters long',
    invalidPatientCode: 'Please enter a valid patient code',
    invalidOrExpiredCode: 'Invalid or expired patient code',
    connectionError: 'An error occurred during connection',
    registrationError: 'An error occurred during registration',
    // Success messages
    loginSuccess: 'Login successful!',
    welcomePatient: 'Welcome to your patient space.',
    registrationSuccess: 'Registration successful!',
    choosePlan: 'Choose your Klukoo plan',
    confirmEmail: 'Check your email to confirm your account.',
    familyAccessGranted: 'Family access granted!',
    welcomeFamily: 'Welcome to the Klukoo family space.',
    professionalLoginSuccess: 'Professional login successful!',
    welcomeProfessional: 'Welcome to your professional space.',
  },

  // Home screen
  home: {
    welcome: 'Welcome',
    latestGlucose: 'Latest glucose',
    addGlucose: 'Add glucose',
    quickActions: 'Quick actions',
    todayStats: "Today's stats",
    medicationReminder: 'Medication reminder',
    upcomingAppointment: 'Upcoming appointment',
  },

  // Glucose
  glucose: {
    level: 'Glucose level',
    normal: 'Normal',
    low: 'Low',
    high: 'High',
    addReading: 'Add reading',
    beforeMeal: 'Before meal',
    afterMeal: 'After meal',
    bedtime: 'Bedtime',
    morning: 'Morning',
    comment: 'Comment',
  },

  // Medications
  medication: {
    title: 'Medications',
    addMedication: 'Add medication',
    dosage: 'Dosage',
    frequency: 'Frequency',
    time: 'Time',
    taken: 'Taken',
    missed: 'Missed',
    insulin: 'Insulin',
    metformin: 'Metformin',
  },

  // Professional
  professional: {
    dashboard: 'Professional dashboard',
    patients: 'Patients',
    consultations: 'Consultations',
    earnings: 'Earnings',
    schedule: 'Schedule',
    startConsultation: 'Start consultation',
    endConsultation: 'End consultation',
    consultationNotes: 'Consultation notes',
    fee: 'Fee',
    payment: 'Payment',
    pending: 'Pending',
    completed: 'Completed',
    duration: 'Duration',
    patientCode: 'Patient code',
  },

  // Chat and Community
  chat: {
    title: 'Community chat',
    typeMessage: 'Type your message...',
    send: 'Send',
    glucoseShare: 'Glucose Share',
    mealShare: 'Diabetes-friendly meal',
    progress: 'Achievement',
    estimatedCarbs: 'Estimated carbs',
  },

  // Common
  common: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    close: 'Close',
    confirm: 'Confirm',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Information',
    today: 'Today',
    yesterday: 'Yesterday',
    thisWeek: 'This week',
    thisMonth: 'This month',
    mg_dl: 'mg/dL',
    mmol_l: 'mmol/L',
    send: 'Send',
    sending: 'Sending...',
  },

  // Notifications
  notifications: {
    medicationTime: 'Time to take your medication',
    glucoseReminder: "Don't forget to check your glucose",
    appointmentReminder: 'Appointment in 1 hour',
    dataShared: 'Data shared successfully',
    accessGranted: 'Access granted to healthcare professional',
    accessDenied: 'Access denied to healthcare professional',
  },

  // Home Screen
  homeScreen: {
    mission: 'Klukoo Mission',

    darePackage: 'Klukoo Package',
    completePlan: 'Klukoo Complete',
    premium: 'PREMIUM',
    monthlyPrice: 'CFA F/month',
    healthPriceless: 'Your health is priceless',
    unlimitedLogbook: 'Unlimited glucose logbook',
    smartReminders: 'Smart insulin reminders',
    clarityCharts: 'Clarity-style charts',
    advancedCalculator: 'Advanced dose calculator',
    familySupport: 'Family support',
    aiAssistant: 'Klukoo AI Assistant',
    startTracking: 'Start my Klukoo tracking',
    freeTrial: '✨ 7-day free trial',
    cancelAnytime: 'Cancel anytime • Support included',
    lastReading: 'Today 2:30 PM',
    diabetes: 'Diabetes',
    management: 'Management',
    awareness: 'Awareness',
    education: 'Education',
    routine: 'Routine',
    daily: 'Daily',
    empowerment: 'Empowerment',
    control: 'Control',
  },
  // Profile Screen
  profileScreen: {
    years: 'years old',
    yearsWithDare: 'Years with Klukoo',
    glucoseMeasures: 'Glucose measurements',
    adherence: 'Adherence',

    userType: 'User type',
    professionalLicense: 'Professional license',
    specialty: 'Specialty',

    notSet: 'Not set',
    // verified: '✓ Verified Profile',
    notVerified: '✗ Unverified Profile',

    // Section titles
    personalInfo: 'Personal Information',
    medicalTeam: 'Medical Team',
    currentTreatment: 'Current Treatment',
    emergencyContact: 'Emergency Contact',
    settings: 'Settings',

    // Profile fields (static labels only!)
    fullName: 'Full name',
    dateOfBirth: 'Date of birth',
    age: 'Age',
    phone: 'Phone',
    city: 'City',
    profession: 'Profession',

    // Medical team
    doctor: 'Primary care physician • Diabetologist',
    followUpCenter: 'Follow-up facility',
    consultant: 'Consulting endocrinologist',

    // Treatment
    insulins: 'Insulins',
    keepCool: 'Stored cool (clay pot)',
    oralMedications: 'Oral medications',
    price: 'Price',
    glucoseTarget: 'Glucose target',
    adaptedClimate: 'Adapted to tropical climate',

    // Emergency contact
    spouse: 'Spouse',
    call: 'Call',
    sms: 'SMS',

    // Settings
    notifications: 'Notifications',
    dataSharing: 'Data sharing',
    darkMode: 'Dark mode',
    editProfile: 'Edit profile',
    exportData: 'Export data',
    privacy: 'Privacy',
    signOut: 'Sign out',
    verified: '✓ Verified Profile',
    unverified: 'Unverified Profile',
  },
  // Chat Screen
  chatScreen: {
    title: 'Klukoo Chat',
    membersConnected: 'members connected',
    successesThisWeek: '💚 142 successes this week',
    inTargetZone: '🎯 89% in target zone',
    newMembers: '👥 12 new members',
    kindness: '💚 Kindness',
    mutualHelp: '🤝 Mutual help',
    sharedMotivation: '🎯 Shared motivation',
    typingMessage: 'Write your supportive message...',
    typing: 'typing...',
    messageSent: 'Message sent',
    messageShared: 'Your message was shared with the Klukoo community',
  },

  // Legal
  legal: {
    termsTitle: 'Terms of Use',
    termsDescription: 'Please read our terms of use carefully',
    privacyTitle: 'Privacy Policy',
    privacyDescription: 'Learn how we protect your personal data',
    termsContent: `
      <h3>1. Acceptance of Terms</h3>
      <p>By using Klukoo (Diabetes Awareness, Routine & Empowerment), you accept these terms of use.</p>
      
      <h3>2. Service Description</h3>
      <p>Klukoo is the first diabetes management and monitoring platform in Africa, offering:</p>
      <ul>
        <li>Personalized glucose monitoring</li>
        <li>Medication management and reminders</li>
        <li>Teleconsultations with healthcare professionals</li>
        <li>Support community</li>
        <li>Analysis and prediction tools</li>
      </ul>
      
      <h3>3. User Account</h3>
      <p>You are responsible for maintaining the confidentiality of your account and password.</p>
    `,
  },

  // Onboarding
  onboarding: {
    step: 'Step',
    of: 'of',
    getStarted: 'Get Started',
    languageSelection: {
      title: 'Choose your language',
      description: 'Select your preferred language to use Klukoo',
    },
    welcome: {
      title: 'Welcome to Klukoo',
      subtitle: 'The first African diabetes management platform',
      description: "We're excited to accompany you on your health journey",
    },
    profile: {
      title: 'Set up your profile',
      subtitle: 'Help us personalize your Klukoo experience',
      description:
        'This information will help us provide you with tailored care',
      namePlaceholder: 'Enter your first name',
      userType: 'I am a...',
    },
    privacy: {
      title: 'Privacy and preferences',
      subtitle: 'Control your data and notifications',
      description: 'Configure your privacy preferences',
      notifications: 'Push notifications',
      notificationsDesc: 'Receive reminders for medications and measurements',
      dataSharing: 'Anonymous data sharing',
      dataSharingDesc: 'Contribute to diabetes research (optional)',
      reminders: 'Smart reminders',
      remindersDesc: 'Adaptive reminders based on your habits',
    },
    features: {
      title: 'Discover Klukoo',
      subtitle: 'All the features to manage your diabetes',
      description: "Here's what Klukoo can do for you",
      glucose: 'Glucose monitoring',
      reminders: 'Smart reminders',
      consultation: 'Teleconsultations',
      community: 'Support community',
      tracking: 'Complete tracking',
      trackingDesc: 'Glucose, medications, activities and more',
      ai: 'AI Assistant',
      aiDesc: 'Personalized advice based on your data',
      telehealth: 'Telemedicine',
      telehealthDesc: 'Consultations with certified professionals',
      support: 'Community',
      supportDesc: 'Connect with other people with diabetes',
    },
    completion: {
      title: 'Setup complete!',
      description: 'Your Klukoo account is ready to use',
    },
  },

  // Common additions
  enable: 'Enable',
  disable: 'Disable',

  // Admin sections
  admin: {
    notifications: '🔔 Admin Notifications',
    noNotifications: 'No notifications',
    newActivities: 'New activities will appear here',
    clearAll: 'Clear all',
    applications: 'Professional applications management',
    totalApplications: 'Total applications',
    pending: 'Pending',
    allStatuses: 'All statuses',
    approve: 'Approve',
    reject: 'Reject',
    viewDetails: 'View details',
    applicationSubmitted: 'Application submitted',
    documents: 'Documents',
    actions: 'Actions',
    license: 'License',
    city: 'City',
    institution: 'Institution',
    noDocuments: 'No documents',
    notSpecified: 'Not specified',
  },

  // Form labels
  forms: {
    email: 'Email',
    phone: 'Phone',
    time: 'Time',
    now: 'Now',
    context: 'Measurement context',
    measurementTime: 'Measurement time',
    title: 'Reminder title',
    reminderType: 'Reminder type',
    mealName: 'Meal name',
    mealTime: 'Meal time',
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snack: 'Snack',
    calories: 'Calories',
    profilePhoto: 'Profile photo',
  },

  // Activities
  activityTypes: {
    walking: 'Walking',
    running: 'Running',
    cycling: 'Cycling',
    swimming: 'Swimming',
    weightlifting: 'Weight lifting',
    other: 'Other',
    light: 'Light',
    moderate: 'Moderate',
    intense: 'Intense',
    estimation: 'Estimation',
  },

  // Medications
  medicationTypes: {
    rapidInsulin: 'Rapid insulin',
    slowInsulin: 'Slow insulin',
    metformin: 'Metformin',
  },

  // Error messages
  errors: {
    error: 'Error',
    cannotLoadPlans: 'Cannot load plans',
    codeNotFound: 'Code not found',
    genericError: 'An error occurred',
  },

  // Modals additions
  modalExtras: {
    scanProduct: 'Scan Product',
    productScanSimulation: 'Product scan simulation',
    takePhoto: 'Take Photo',
    aiMealAnalysis: 'AI meal analysis',
    manualEntry: 'Manual Entry',
    enterInformation: 'Enter information',
    followCarbs: 'Track your carbs easily',
  },

  // Blog additions
  blogExtras: {
    reliableSources: 'Reliable sources',
    sources: 'Nature Medicine • The Lancet • WHO • ADA',
  },

  // Professional additions
  professionalExtras: {
    patientInformation: 'Patient Information',
    stackTrace: 'Stack trace',
  },

  nativeHeader: {
    title: 'Diabetes Assistant',
    greetings: 'Greetings',
    question: 'How is your diabetes today?',
  },

  bloodSugar: {
    title: 'Current Blood Sugar',
    state: 'Normal',
    measurement: 'Last measurement',
    noReading: 'No reading yet',
  },

  Actions: {
    actions: 'Rapid Actions',
    actionsPopover: {
      bloodSugar: {
        increment: 'Add Blood Sugar',
      },
      title: 'New Glucose Reading',
      input1: 'Blood Sugar',
      notes: 'optional',
      comments: 'Comments',
    },
    button: 'Save',
  },

  Journal: {
    title: 'Meal Journal',
    media: {
      scanner: 'Scan barcode',
      photo: 'Photo + AI',
    },
    manualEntry: 'or manual entry',
    title1: 'Food Name',
    title2: 'Carbohydrates',
    optional: 'optional',
    button: 'Add Food',
  },

  Medication: {
    title: 'Medications',
    subtitle: 'Save Medication',
    title2: 'Type of medication',
    select: {
      title: 'Select a Medication',
      option: {
        one: 'Ultra-Rapid Insulin',
        two: 'Humalog (Lispro)',
        three: 'NovoRapid (Aspart)',
        four: 'Apidra (Glulisine)',
        five: 'Fiasp (Ultra-Rapid Aspart)',
        six: 'Rapid Insulin',
        seven: 'Actrapid',
        eight: 'Humulin R',
        nine: 'Insuman Rapid',
        ten: 'Intermediate Insulin',
        eleven: 'Insulatard (NPH)',
        twelve: 'Humulin N (NPH)',
        thirteen: 'Insuman Basal (NPH)',
        fourteen: 'Long-Acting Insulin',
        fifteen: 'Lantus (Glargine)',
        sixteen: 'Levemir (Detemir)',
        seventeen: 'Toujeo (Glargine U300)',
        eighteen: 'Tresiba (Degludec)',
        nineteen: 'Abasaglar (Glargine)',
        twenty: 'Mixed Insulin',
        twentyone: 'NovoMix 30 (Aspart + NPH)',
        twentytwo: 'Humalog Mix 25/50 (Lispro + NPH)',
        twentythree: 'Humulin 70/30 (Rapid + NPH)',
        twentyfour: 'Insuman Comb (Rapid + NPH)',
        twentyfive: 'Metformin',
        twentysix: 'Glucophage (Metformin)',
        twentyseven: 'Stagid (Metformin)',
        twentyeight: 'Gliclazide',
        twentynine: 'Diamicron (Gliclazide)',
        thirty: 'Victoza (Liraglutide)',
        thirtyone: 'Ozempic (Semaglutide)',
        thirtytwo: 'Trulicity (Dulaglutide)',
        thirtythree: 'Januvia (Sitagliptin)',
        thirtyfour: 'Forxiga (Dapagliflozin)',
        thirtyfive: 'Other',
      },
    },
    dose: 'Dose',
    unit: 'unit',
    button: 'Save',
  },

  Activity: {
    title: 'Activity',
    subtitle: 'Physical Activity',
    type: 'Type of Activity',
    select: 'Select an activity',
    Popover: {
      one: 'Walking',
      two: 'Running',
      three: 'Cycling',
      four: 'Swimming',
      five: 'Weight Training',
      six: 'Other',
    },
    duration: 'Duration',
    button: 'Register',
  },

  Alerts: {
    title: 'AI Predictive Alerts',
    urgent: 'Urgent',
    monitor: 'To Monitor',
    good: 'All Good',
    message: 'No predictive alerts detected at the moment.',
  },

  analyze: {
    title: 'Continuous AI Analysis',
    message:
      'The system continuously analyzes your data to detect risk patterns.',
  },

  mission: {
    title: 'Klukoo Mission',
    message:
      'Our mission is to help you better understand and manage your diabetes with tools adapted to your reality.',
  },

  analysis: {
    title: 'Glucose Analysis',
    days: 'Last 7 days',

    time: {
      midnight: 'Midnight',
      noon: 'Noon',
    },
    context: {
      fasting: 'Fasting',
      postMeal: 'Post-meal',
      morning: 'Morning',
      breakfast: 'Breakfast',
      activity: 'Activity',
      lunch: 'Lunch',
      snack: 'Snack',
      dinner: 'Dinner',
      evening: 'Evening',
    },

    state: {
      one: 'High',
      two: 'Borderline',
      three: 'Target',
      four: 'Low',
    },
    contextChart: 'Context',
  },

  target: {
    title: 'Time in Target',
    goal: 'Goal',
    target: 'In Target',
  },

  mode: {
    average: 'Average',
    variability: 'Variability',
    estimated: 'Estimated',
  },

  trend: {
    title: 'Weekly Trend',
    message: 'Percentage of Time in Target per Day',
  },

  reminder: {
    writeup: 'Insulin Reminder – 7:00 PM Lantus 20IU',
  },

  lantus: {
    dose: 'Usual Dose',
    time: 'Scheduled Time',
    injection: 'Last Injection: Today 07:45',
    button: 'Mark as Injected',
  },

  humalog: {
    title: 'Humalog (Fast-Acting)',
    glucose: 'Current Blood Glucose',
    pending: 'Pending',
    carbs: 'Meal Carbs',
    dose: 'Calculated Dose',
    meal: 'Meal',
    button: 'Schedule an injection',
  },

  injection: {
    title: 'Missed Injection',
    time: 'Yesterday 7:00 PM – Humalog 6 IU',
    administer: 'Not Administered',
    button1: 'Ignore',
    button2: 'Inject Now',
  },

  history: {
    title: '7-Day History',
    message: 'Injections Done / Scheduled per Day',
  },

  consultation: {
    title: 'Consultation Request',
    subtitle: 'Consult a healthcare professional specialized in diabetes',
    request: {
      title: 'New Consultation Request',
      subtitle: 'Select a professional and describe your need',
      input1: {
        title: 'Healthcare Professional',
        writeup: 'Choose a professional',
      },
      input2: {
        title: 'Reason for Consultation *',
        writeup: {
          title: 'Select a reason',
          options: {
            one: 'Routine Check',
            two: 'Urgent Consultation',
            three: 'Blood Glucose Management',
            four: 'Treatment Adjustment',
            five: 'Nutritional Advice',
            six: 'Psychological Support',
            seven: 'Diabetes Complications',
            eight: 'Post-Consultation Follow-up',
          },
        },
      },
      input3: {
        title: 'Message for the professional (optional)',
        writeup: 'Describe your situation, symptoms, or questions…',
      },
    },
    button: 'Send Request',
  },

  consultationRequest: {
    title: 'My Consultation Requests',
    subtitle: 'History of your requests and their status',
    request: {
      noRequest: 'No consultation requests',
      procedure: 'Your requests will appear here once submitted',
    },
  },

  reminderScreen: {
    title: 'My Reminders',
    subtitle: 'Manage your reminders for insulin, medication, tests, and more',
    newReminder: {
      title: 'All Reminders',
      reminderSet: 'No Reminder Set',
      writeup: 'Create your first reminder so you never forget your treatments',
    },
    button1: 'Create a Reminder',
    button2: 'New Reminder',
  },

  chatTestimonial: {
    firstMessage:
      'Hello everyone! I managed to keep my blood glucose in the target range all week 🎉',
    secondMessage:
      'Congratulations Marie! This is exactly the kind of progress we love to see. Keep it up!',
    thirdMessage:
      'I have a question about rapid-acting insulin before meals. Can anyone share their experience?',
  },

  journalEntries: {
    id1: {
      date: 'Friday',
      glucoseStatus: 'slightly high',
      context: 'after thiéboudienne.',
    },
    id2: {
      date: 'Friday',
      glucoseStatus: 'within target range',
      context: 'on an empty stomach',
    },
    id3: {
      date: 'Thursday',
      glucoseStatus: 'high',
      context: 'before dinner.',
    },
    id4: {
      date: 'Thursday',
      glucoseStatus: 'within target range',
      context: 'after launch',
    },
    id5: {
      date: 'Wednesday',
      glucoseStatus: 'within target range.',
      context: 'after hibiscus juice without sugar.',
    },
  },

  blogScreen: {
    article: {
      id7: {
        category: 'Instructions',
        title: 'Nutrition guide for diabetics',
        excerpt:
          'Complete guide for a balanced diet adapted to diabetes. Discover recommended foods, portions, and nutritional strategies...',
        authorTitle: 'Nutritionist.',
      },
      id8: {
        category: 'Instructions',
        title: 'Complete guide on type 1 and type 2 diabetes.',
        excerpt:
          'Everything you need to know about diabetes: definitions, symptoms, treatments, complications, and daily management...',
        authorTitle: 'Endocrinologist.',
      },
      id1: {
        category: 'Research',
        title:
          'Breakthrough: 83% of type 1 diabetics freed from insulin with Zimislecel',
        excerpt:
          'A revolutionary stem cell therapy allows 83% of patients to no longer need insulin injections after one year…',
      },
      id2: {
        category: 'Innovation',
        title:
          'Revolutionary smart gel: healing diabetic wounds in just a few days.',
        excerpt:
          'A new gel restores blood circulation and dramatically accelerates the healing of chronic diabetic wounds...',
      },
      id3: {
        category: 'Research',
        title:
          'First transplantation of genetically modified islets without immunosuppression',
        excerpt:
          'For the first time, genetically edited pancreatic islet cells were successfully transplanted without anti-rejection drugs…',
      },
      id4: {
        category: 'Innovation',
        title: 'Smart insulin: first successful clinical trials',
        excerpt:
          'An insulin that automatically adapts to blood glucose levels shows promising results in tests...',
      },
      id5: {
        category: 'Testimonials',
        title:
          'Marathon with diabetes: the achievement of James Thompson at 65 years old.',
        excerpt:
          'Diabetic for 30 years, James Thompson finishes the Boston Marathon and inspires thousands of people...',
      },
      id6: {
        category: 'Innovation',
        title:
          'Predictive AI 2025: prevention of hypoglycemia with 97% accuracy',
        excerpt:
          'The new generation of medical AI achieves 97% accuracy in predicting crises, with alerts up to 45 minutes in advance…',
      },
    },
    sources: {
      title: 'Reliable Sources',
      subtitle:
        'All our news is verified and comes from internationally recognized medical sources.',
    },
    button: 'Read',
  },

  familyScreen: {
    heading: {
      title: 'Family',
      subtitle: 'Your circle of care',
    },
    familySharingCode: {
      title: 'Family Sharing Code',
      subtitle:
        'Share this code with your relatives so they can accompany you.',
      button: 'Copy the code',
    },
    numOfPatients: {
      first: 'Alerts',
      second: 'Connected days',
    },
    familyMembers: {
      title: 'Family Members',
      patientOne: {
        role: 'Wife',
        permission: 'Full Access',
        lastSeen: 'Online',
      },
      patientTwo: {
        role: 'Primary Care Doctor',
        permission: 'Emergency + Data',
        lastSeen: '2 hours ago',
      },
      patientThree: {
        role: 'Son',
        permission: 'Read-only',
        lastSeen: '1 hour ago',
      },
    },
    recentActivity: {
      firstOne: {
        title: 'Recent Activity',
        action: 'Fatou has viewed your latest blood glucose readings.',
        time: '10 minutes ago',
      },
      secondOne: {
        action: 'Dr. Kane added a medical note.',
        time: '2 hours ago',
      },
      thirdOne: {
        action: 'Ibrahim received a missed injection alert.',
        time: 'Yesterday at 7:30 PM',
      },
      fourthOne: {
        action: 'Fatou confirmed your Humalog injection.',
        time: 'Yesterday at 3:00 PM',
      },
    },
    button1: 'Invite a Care Partner',
    button2: 'Manage Permissions',
    emergencyContact: 'Emergency Contact',
  },

  //professional login card
  professionalLoginCard: {
    title: 'Healthcare Professional',
    subtitle: 'Access to professional tools',
    button: 'Access Professional Space',
    testAccess: 'Professional Test Access',
    loginButton: 'Login',
  },

  toastMessage: {
    title: 'New Entry',
    description: 'Feature coming soon',
  },

  //professionalDashboard
  professionalDashboard: {
    title: 'Professional',
    study: 'Endocrinology',
    mode: 'Demo Mode',
    logout: 'Logout',
    stats: {
      title1: 'Followed Patients',
      title2: 'Consultations This Month',
      title3: 'Generated Reports',
      title4: 'Average Time / Consultation',
      compared: 'compared to last month',
    },

    tableHeaderSections: {
      revenue: 'Revenue',
      settings: 'Settings',
    },

    overview: {
      heading: 'Overview',
      recentPatients: {
        title: 'Recent patients',
        firstPatient: {
          lastvisit: '2 hours ago',
          status: 'stable',
        },
        secondPatient: {
          lastvisit: 'Yesterday',
          status: 'improvement',
        },
        ThirdPatient: {
          lastvisit: '3 days ago',
          status: 'improvement',
        },
        button: 'See all patients',
      },

      //
      quickActions: {
        title: 'Quick Actions',
        scheduleAppointment: {
          title: 'Schedule an appointment',
          subtitle: 'Schedule an appointment',
          patient: {
            placeholder: 'Select a patient',
          },
          date: {
            placeholder: 'Choose a date',
          },
          time: {
            title: 'Time',
            placeholder: 'Select the time',
          },
          consultationType: {
            title: 'Type of consultation',
            placeholder: {
              title: 'Select the type',
              routine: 'Routine follow-up',
              urgent: 'Urgent consultation',
              teleconsultation: 'Teleconsultation',
              first: 'First consultation',
            },
          },
          notes: {
            title: 'optional',
            placeholder: 'Consultation observations...',
          },
          button1: 'Cancel',
          button2: 'Schedule',
        },

        //
        reportGenerator: {
          title: 'Generate a report',
          subtitle: 'Generate a report',
          reportType: {
            title: 'Type of report',
            placeholder: {
              title: 'Select a type',
              monthly: 'Monthly report',
              patient: 'Patient report',
              financial: 'Financial report',
              activity: 'Activity report',
            },
          },
          timeframe: {
            title: 'Timeframe',
            placeholder: {
              title: 'Select the period',
              lastWeek: 'Last week',
              lastMonth: 'Last month',
              lastQuarter: 'Last quarter',
              custom: 'Custom period',
            },
          },
          format: {
            placeholder: 'Select the format',
          },
          button1: 'Close',
          button2: 'Generate',
        },

        //
        addPatient: {
          title: 'Add a patient',
          subtitle: 'Add a new patient',
          name: {
            firstName: 'Frist Name',
            lastName: 'Last Name',
          },
          number: 'Phone',

          diabetesTypes: {
            title: 'Type of Diabetes',
            placeholder: {
              title: 'Select the type',
              type1: 'Type 1',
              type2: 'Type 2',
              gestational: 'Gestational',
            },
          },
          medicalNotes: {
            title: 'Medical Notes',
            placeholder: 'Medical history, allergies, etc.',
          },
          button1: 'Close',
          button2: 'Add',
        },

        //accountSetting
        accountSetting: {
          title: 'Account Settings',
          currentStatus: {
            title: 'Availability',
            placeholder: 'Current Status',
            options: {
              available: 'Available',
              busy: 'Busy',
              offline: 'Offline',
            },
          },

          notifications: {
            placeholder: 'Notification Preferences',
            options: {
              all: 'All Notifications',
              important: 'Important Only',
              none: 'No Notifications',
            },
          },

          consultationFee: ' Tarif consultation ',
          button1: 'Close',
          button2: 'Save',
        },
      },
    },

    //patient
    patients: {
      calendar: 'Calender',
      title: 'List of patients',
      tableHeading: {
        first: 'Patient',
        second: 'Diabetes Type',
        third: 'Last consultation',
        fourth: 'Last blood glucose',
        fifth: 'Status',
      },
      lastBloodGlucose: {
        first: 'stable',
        second: 'improvement',
        third: 'warning',
        fourth: 'stable',
      },
      recentNotes: {
        title: 'Recent notes',
        people: {
          first:
            'Glucose well controlled. Continue the current treatment. Next consultation in 1 week.',
          second:
            'Significant improvement in HbA1c. Reduction of the insulin dose recommended.',
          third:
            'Frequent blood glucose spikes. Review diet and adjust treatment.',
          fourth: '',
        },
      },
      dropdownOptions: {
        first: 'View record',
        second: 'Send a message',
        third: 'Teleconsultation',
        fourth: 'Call',
        fifth: 'Edit profile',
      },

      //
      planning: {
        title: 'Consultation Schedule',
        tableHeading: {
          time: 'Time',
          duration: 'Duration',
          status: 'Status',
        },
        type: {
          followUp: 'Routine follow-up',
          urgent: 'Urgent consultation',
          teleconsultation: 'Teleconsultation',
          first: 'First consultation',
        },
        status: {
          scheduled: 'Scheduled',
          completed: 'Completed',
          cancelled: 'Cancelled',
        },
        actions: {
          start: 'Start Consultation',
          view: 'View Details',
          edit: 'Edit',
          cancel: 'Cancel',
        },
      },

      //calendar
      calendarScreen: {
        title: 'Calender',
        consulationOf: 'Consultations on',
        scheduled: 'No consultations scheduled for today',
      },
    },

    //consultations
    consultations: {
      title: 'My consultations',
      placeholder: {
        title: 'Filter by status',
        options: {
          all: 'All',
          pending: 'Pending',
          active: 'Active',
          completed: 'Completed',
        },
      },
      loading: 'Loading consultations',
    },

    //revenue
    revenue: {
      title: 'Revenue',
      thisMonth: 'This Month',
      revenueThisMonth: 'Net revenue this month',
      tableHeader: {
        grossAmount: 'Gross Amount',
        status: 'Status',
      },
      consultationType: {
        one: 'Endocrinology Consultation',
        two: 'Diabetes Follow-up',
        three: 'Endocrinology Consultation',
        four: 'Teleconsultation',
        five: 'Endocrinology Consultation',
        six: 'Hormonal Follow-up',
      },
      status: {
        paid: 'Paid',
        processing: 'Processing',
        pending: 'Pending',
      },
      consultationRevenue: {
        title: 'Revenue per consultation',
        writeup:
          'Revenue is calculated automatically according to the rates per profession defined in the system. Each completed consultation adds the corresponding amount to your revenue.',
      },
    },

    //accountSettings
    accountSettings: {
      title: 'Account settings',
      writeup: 'Account settings under development...',
    },
  },

  //fixes
  getGlucoseStatus: {
    status_low: 'Low blood sugar',
    status_normal: 'Within normal range',
    status_high: 'High blood sugar',
  },

  foodNamePlaceholder: {
    placeholder_foodName: 'Ex: Apple, Rice, Salad...',
  },

  mealType: {
    label_mealType: 'Meal type',
    option_breakfast: 'Breakfast',
    option_lunch: 'Lunch',
    option_dinner: 'Dinner',
    option_snack: 'Snack',
  },

  foodDetailsPlaceholder: {
    placeholder_foodDetails: 'Ex: With chicken, light sauce...',
  },

  blogScreenFixes: {
    title_diabetesNews: 'International news on diabetes',
    placeholder_searchNews: 'Search news...',
  },

  profileScreenFixes: {
    status_unverifiedProfile: 'Unverified Profile',
    label_weight: 'Weight',
    label_professionalLicense: 'Professional license',
    label_specialty: 'Specialty',
    action_editProfile: 'Edit Profile',
    label_firstName: 'First Name',
    label_lastName: 'Last Name',
    label_phone: 'Phone',
  },

  professionalAccess: {
    title: 'Professional Access Request',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    phone: 'Phone',
    profession: 'Profession',
    selectProfession: 'Select your profession',
    doctor: 'Doctor',
    nurse: 'Nurse',
    diabetologist: 'Diabetologist',
    nutritionist: 'Nutritionist',
    pharmacist: 'Pharmacist',
    other: 'Other',
    licenseNumber: 'License Number',
    institution: 'Institution',
    motivation: 'Motivation',
    motivationPlaceholder: 'Explain why you want to access DiabCare...',
    requestSent: 'Request Sent',
    requestSentDescription:
      'Your professional access request has been successfully sent',
    requestError: 'Error sending the request',
  },

  professionalNotification: {
    title_consultationRequests: 'Consultation Requests',
    message_noRequests: 'No Requests',
    time_justNow: 'A few minutes ago',
    time_oneHour: '1 hour ago',
    time_hours: '{{count}} hours ago',
    time_day: '{{count}} day ago',
    time_days: '{{count}} days ago',
    toast_accessGranted_title: 'Access Granted',
    toast_accessGranted_description:
      '✅ Access granted to the healthcare professional for 24h',
    toast_accessDenied_title: 'Access Denied',
    toast_accessDenied_description:
      '❌ Access denied to the healthcare professional',
    toast_error_title: 'Error',
    toast_error_description: 'Error while responding to the request',
    section_glucose: 'Glucose',
    section_medications: 'Medications',
    section_meals: 'Meals',
    section_activities: 'Activities',
    section_notes: 'Personal Notes',
    section_reports: 'Medical Reports',
    title_dataAccessRequest: '🔐 Request Access to Your Data',
    label_professionalCode: 'Professional Code:',
    label_maxConsultations: 'Max Consultations:',
    label_requested: 'Requested:',
    title_requestedData: '📋 Requested Data:',
    button_deny: '❌ Deny',
    button_approve: '✅ Approve (24h)',
  },

  applicationCard: {
    professional_endocrinologist: 'Endocrinologist',
    professional_diabetologist: 'Diabetologist',
    professional_nutritionist: 'Nutritionist',
    professional_generalPractitioner: 'General Practitioner',
    professional_nurse: 'Specialized Nurse',
    professional_pharmacist: 'Pharmacist',
    professional_psychologist: 'Psychologist',
    professional_podiatrist: 'Podiatrist',
    badge_pending: 'Pending',
    notSpecified: 'Not specified',
    application_submitted: 'Application submitted',
    button_approve: 'Approve',
    button_reject: 'Reject',
    personalInfo_title: 'Personal Information',
    personalInfo_email: 'Email:',
    personalInfo_phone: 'Phone:',
    personalInfo_location: 'Location:',
    professionalQualifications_title: 'Professional Qualifications',
    professionalQualifications_licenseNumber: 'License Number:',
    professionalQualifications_institution: 'Institution:',
    documents_title: 'Supporting Documents',
    documents_label: 'Document',
    button_view: 'View',
    noDocument: 'No document',
    application_submitted_on: 'Application submitted on',
  },

  documentUploader: {
    file_too_large: '{{fileName}}: File too large (max 10MB)',
    file_unsupported_type: '{{fileName}}: Unsupported file type',
    max_files_allowed: 'Maximum {{maxFiles}} files allowed',
    file_already_added: '{{fileName}}: File already added',
    documents_title: 'Supporting Documents',
    documents_count: '{{current}}/{{max}} files',
    dropzone_dragFiles: 'Drag your documents here',
    dropzone_orClick: 'or',
    dropzone_clickToSelect: 'click to select',
    dropzone_fileInfo: '{{types}} - Max {{maxFiles}} files - 10MB per file',
    documents_added: 'Added Documents:',
    requiredDocuments_title: '📋 Required Documents:',
    requiredDocuments_item1: '• Medical diploma or professional certification',
    requiredDocuments_item2: '• Valid practicing license',
    requiredDocuments_item3:
      '• Certificate of registration with the medical board',
    requiredDocuments_item4: '• Detailed professional CV',
    requiredDocuments_item5: '• Identification (optional but recommended)',
  },

  errorBoundary: {
    error_occurred: 'Oops! An error occurred',
    unexpected_error_message:
      'An unexpected error occurred in the DARE application. Our technical team has been notified automatically.',
    button_restart: 'Restart',
    button_home: 'Home',
    footer_text: '💪 DARE - Dare to conquer diabetes together',
  },

  onboardingFlow: {
    language_selected_title: 'Language selected',
    language_selected_description: 'English selected successfully',
    choose_language_title: 'Choose your language',
    choose_language_description: 'Select your preferred language to continue',
  },

  planSelection: {
    loading_plans: 'Loading plans...',
    plans_error_title: 'Error',
    plans_error_description: 'Unable to load plans',
    choose_plan_title: 'Choose your DiaCare plan',
    choose_plan_description: 'Select the plan that best fits your needs',
    badge_recommended_family: 'Recommended for family',
    per_month: 'per month',
    selected: 'Selected',
    choose_this_plan: 'Choose this plan',
    payment_secure: '💳 Secure payment via Flutterwave',
    payment_method_card: '• Bank cards (Visa, Mastercard, etc.)',
    payment_method_mobile: '• Mobile Money (Orange Money, MTN, Wave, etc.)',
    payment_method_bank: '• Local bank transfers',
    payment_method_patient_code:
      '• Patient code generated automatically after payment',
  },

  professionalCodeManager: {
    code_generated_title: 'Code generated successfully',
    code_generated_description:
      'Your professional identification code is ready',
    code_error_title: 'Error',
    code_error_description: 'Unable to generate the professional code',
    code_copied_title: 'Code copied',
    code_copied_description: 'The code has been copied to the clipboard',
    missing_code_title: 'Code missing',
    missing_code_description: 'Please enter a patient access code',
    meal_fasting: 'Fasting',
    meal_after_meal: 'After meal',
    meal_before_dinner: 'Before dinner',
    access_granted_title: 'Access granted',
    access_granted_description: 'Patient data retrieved successfully',
    access_denied_title: 'Access denied',
    access_denied_description: 'Invalid access code or patient not found',
    professional_id_code: 'Professional identification code',
    professional_code_description:
      'Generate your unique code to access DARE patient data',
    generate_professional_code: 'Generate my professional code',
    generated_on: 'Generated on',
    badge_active: 'Active',
    professional_code_warning:
      'Important: This code is personal and confidential. Never share it. It allows you to access sensitive patient data.',
    patient_data_access_title: 'Patient data access',
    patient_data_access_description:
      "Use your professional code to access a patient's data",
    patient_code_label: 'Patient access code',
    patient_code_placeholder: 'Enter the patient code...',
    all_access_tracked: 'All accesses are tracked and secure',
    secure_patient_data_title: 'Patient Data - Secure Access',
    secure_patient_data_description:
      'Sensitive medical information - Strictly professional use',
    patient_information: 'Patient Information',
    last_name: 'Last Name',
    first_name: 'First Name',
    diabetes_type: 'Diabetes Type',
    recent_glucose_readings: 'Recent Glucose Readings',
    confidentiality_notice:
      'Confidentiality: This data is strictly confidential and protected by medical secrecy. Any unauthorized use is subject to penalties.',
  },

  blogScreenRead: {
    nutrition_guide_content_one: `# Nutrition Guide for People with Diabetes

## Introduction
A balanced diet is the cornerstone of diabetes management. This guide provides the basics for adopting healthy eating habits that will help you control your blood sugar while maintaining an optimal quality of life.

## Basic Principles

### 1. Macronutrient Distribution
- **Carbohydrates**: 45-65% of total energy intake
- **Proteins**: 15-20% of total energy intake  
- **Fats**: 20-35% of total energy intake

### 2. Glycemic Index
Prioritize foods with a low or moderate glycemic index:
- **Low GI (< 55)**: Green vegetables, legumes, quinoa, oats
- **Moderate GI (55-70)**: Whole grain bread, brown rice, sweet potato
- **High GI (> 70)**: Limit - white bread, potatoes, sugar

## Recommended Foods

### Vegetables (as much as you want)
- Broccoli, spinach, zucchini, eggplant
- Tomatoes, bell peppers, cucumbers
- Cauliflower, green beans, asparagus

### Quality Proteins
- Fatty fish: salmon, mackerel, sardines
- Skinless poultry: chicken, turkey
- Legumes: lentils, chickpeas, beans
- Eggs (in moderation)
- Tofu and soy-based products

### Complex Carbohydrates
- Quinoa, oats, barley
- Whole grain bread, whole grain pasta
- Brown rice, legumes
- Sweet potato (in moderation)

### Healthy Fats
- Olive oil, avocado
- Nuts, almonds, seeds
- Fatty fish

## Foods to Limit

### Simple Sugars
- Sweets, pastries, sodas
- Very sweet fruits in excess
- Honey, maple syrup (occasionally)

### Saturated Fats
- Fatty meats, processed meats
- Fatty cheeses, excess butter
- Fried foods, fast food

## Practical Strategies

### Meal Planning
1. **Plate Method**:
   - 1/2 plate: non-starchy vegetables
   - 1/4 plate: lean proteins
   - 1/4 plate: complex carbohydrates

2. **Regular Schedule**: 3 meals + 1-2 snacks if needed

3. **Portion Control**:
   - Use smaller plates
   - Weigh your food initially to learn portion sizes
   - Listen to your satiety signals

### Managing Cravings
- Drink water before meals
- Include fiber in every meal
- Prepare healthy snacks in advance
- Eat slowly and mindfully

## Diabetes Type-Specific Advice

### Type 1
- Count carbohydrates to adjust insulin
- Watch for hypoglycemia during exercise
- Appropriate sugar intake in case of hypoglycemia

### Type 2
- Weight loss if necessary (5-10%)
- Regular physical activity after meals
- Monitor blood pressure

## Hydration
- 1.5 to 2 liters of water per day
- Avoid sugary drinks
- Tea and coffee without sugar are allowed
- Alcohol in moderation and never on an empty stomach

## Supplements and Vitamins
Consult your doctor before taking:
- Vitamin D (often deficient)
- Magnesium
- Omega-3
- Chromium (scientific controversy)

## Conclusion
A diabetes-friendly diet is not restrictive but balanced. It allows you to enjoy the pleasures of the table while maintaining stable blood sugar. Do not hesitate to consult a specialized nutritionist for a personalized plan.`,
    nutrition_guide_content_two: `# Complete Guide on Type 1 and Type 2 Diabetes

## What is Diabetes?

Diabetes is a chronic disease characterized by hyperglycemia (high blood sugar) due to a defect in insulin secretion or action. There are several types of diabetes, but the most common are Type 1 and Type 2.

## Type 1 Diabetes

### Definition
Type 1 diabetes is an autoimmune disease where the immune system destroys the beta cells of the pancreas that produce insulin. It accounts for 5-10% of diabetes cases.

### Characteristics
- **Onset**: Usually before 30 years old, often in childhood
- **Progression**: Rapid, over a few weeks or months
- **Heredity**: Low genetic component (3-5% family risk)
- **Weight**: Often normal weight or underweight

### Symptoms
The classic "4 Ps":
- **Polyuria**: frequent and excessive urination
- **Polydipsia**: intense thirst
- **Polyphagia**: excessive hunger
- **Rapid weight loss**: unexplained

Other symptoms:
- Extreme fatigue
- Blurred vision
- Recurrent infections
- Fruity breath (ketosis)

### Diagnosis
- **Fasting blood glucose** ≥ 126 mg/dL (7 mmol/L) twice
- **Random blood glucose** ≥ 200 mg/dL (11.1 mmol/L) with symptoms
- **HbA1c** ≥ 6.5% (48 mmol/mol)
- **Glucose tolerance test**: blood glucose ≥ 200 mg/dL at 2h

### Treatment
**Insulin therapy required**:
- Basal insulin (long-acting): covers baseline needs
- Prandial insulin (rapid-acting): covers meals
- Possible methods: pens, insulin pump

**Monitoring**:
- Blood glucose 4-6 times/day minimum
- HbA1c every 3 months (goal < 7%)
- Monitoring for complications

## Type 2 Diabetes

### Definition
Type 2 diabetes results from insulin resistance and/or a deficit in insulin secretion. It accounts for 90-95% of diabetes cases.

### Characteristics
- **Onset**: Usually after 40 years old (increasingly younger)
- **Progression**: Gradual, often asymptomatic at first
- **Heredity**: Strong genetic component (30-40% family risk)
- **Weight**: Often overweight or obese (80% of cases)

### Risk Factors
- Age > 45
- Overweight/obesity (BMI > 25)
- Family history of diabetes
- Sedentary lifestyle
- High blood pressure
- Dyslipidemia
- History of gestational diabetes
- Polycystic ovary syndrome (PCOS)
- Ethnic origin (African, Hispanic, Asian)

### Symptoms
Often asymptomatic at first, then:
- Fatigue
- Moderate thirst
- Frequent urination
- Recurrent infections (yeast infections, UTIs)
- Slow wound healing
- Blurred vision

### Diagnosis
Same criteria as Type 1, but slower progression.

### Treatments

**1. Lifestyle Measures (first line)**
- Weight loss (5-10% of initial weight)
- Balanced diet
- Regular physical activity (150 min/week)
- Smoking cessation

**2. Oral Medications**
- **Metformin**: first-line, reduces hepatic glucose production
- **Sulfonylureas**: stimulate insulin secretion
- **Glinides**: rapid insulin stimulation
- **Alpha-glucosidase inhibitors**: slow carbohydrate absorption
- **Thiazolidinediones**: improve insulin sensitivity
- **DPP-4 inhibitors**: increase insulin, decrease glucagon
- **GLP-1 agonists**: injectable, affect satiety

**3. Insulin (if other treatments fail)**

## Common Complications

### Acute Complications
**Hypoglycemia** (< 70 mg/dL):
- Symptoms: tremors, sweating, palpitations, confusion
- Treatment: 15g fast-acting carbs (3 sugar cubes)

**Severe Hyperglycemia**:
- Type 1: diabetic ketoacidosis (emergency)
- Type 2: hyperosmolar coma (emergency)

### Chronic Complications
**Microvascular**:
- **Retinopathy**: damage to retinal vessels
- **Nephropathy**: kidney damage
- **Neuropathy**: nerve damage (feet, hands)

**Macrovascular**:
- Myocardial infarction (risk x2-4)
- Stroke
- Peripheral artery disease

**Other**:
- Diabetic foot
- Recurrent infections
- Erectile dysfunction

## Complication Prevention

### Glycemic Control
- **HbA1c target**: < 7% (customizable by age/comorbidities)
- **Regular self-monitoring**
- **Therapeutic adjustment** based on results

### Cardiovascular Risk Control
- **Blood pressure**: < 140/90 mmHg (< 130/80 if possible)
- **Cholesterol**: LDL < 100 mg/dL (< 70 mg/dL if high risk)
- **Smoking cessation** mandatory

### Regular Monitoring
- **Ophthalmologic**: annual eye exam
- **Nephrologic**: annual creatinine and microalbuminuria
- **Podiatric**: regular foot exams
- **Cardiologic**: ECG, Doppler if needed

## Living with Diabetes

### Daily Life
- **Diet**: balanced, regular, adapted
- **Physical activity**: 30 min/day minimum
- **Stress management**: relaxation techniques
- **Sleep**: 7-8 hours/night, quality important

### Special Situations
- **Travel**: bring medications, prescriptions
- **Illness**: enhanced monitoring, treatment adjustment
- **Pregnancy**: specialized follow-up, strict glycemic targets
- **Sports**: insulin/diet adjustment according to effort

### Therapeutic Education
- Group or individual education programs
- Learning self-management
- Psychological support if needed
- Patient associations

## Innovations and Perspectives

### Technologies
- **Continuous glucose sensors**: needle-free monitoring
- **Smart insulin pumps**
- **Artificial pancreas**: in development
- **Mobile apps**: management support

### Research
- **Cell therapies**: islet transplantation, stem cells
- **Immunotherapies**: Type 1 prevention
- **Innovative medications**: new therapeutic classes

## Conclusion

Diabetes is a complex but manageable disease. Early and appropriate management, combined with a healthy lifestyle, prevents complications and maintains optimal quality of life. Patient education and healthcare team support are essential for long-term successful management.

Never hesitate to ask questions to your medical team and actively participate in your care.`,
    nutrition_guide_content_three: `A major medical breakthrough has just been announced: the Zimislecel treatment, a stem cell therapy, has enabled 83% of patients with severe Type 1 diabetes to completely stop their insulin injections after a single infusion.

The study, published this month, followed 12 volunteers for one year. Ten of them no longer needed insulin, while the other two were able to drastically reduce their doses. No episodes of severe hypoglycemia were reported.

"This is revolutionary," says Dr. Jennifer Martinez, principal investigator. "We may be witnessing the end of the daily insulin injection era for these patients."

The treatment uses stem cells engineered to become pancreatic islet cells, responsible for insulin production. This approach represents the culmination of decades of research in regenerative medicine.

The FDA is currently reviewing this treatment for accelerated approval, which could revolutionize Type 1 diabetes management as early as 2026.`,
    nutrition_guide_content_four: `A major innovation in the treatment of diabetic wounds has just been unveiled: a "smart" gel that combines microscopic healing vesicles with a specialized hydrogel, restoring blood flow and dramatically accelerating healing.

This revolutionary therapy, developed by an international team, uses healing messengers encapsulated in nanovesicles that are gradually released upon contact with the wound. The gel stimulates the formation of new blood vessels while protecting the injured area.

The results from clinical tests are impressive:
- Healing 5 times faster than conventional treatments
- Complete restoration of blood flow within 72 hours
- 85% reduction in the risk of amputation
- No major side effects reported

"This technology will save thousands of limbs each year," says Dr. Sarah Chen, a specialist dermatologist. "We are moving from weeks of treatment to just a few days."

The gel will be available in European hospitals starting September 2025, following regulatory approval.`,
    nutrition_guide_content_five: `An international team of researchers has developed "smart insulin" capable of automatically adapting to blood glucose fluctuations. This innovation could revolutionize diabetes treatment by eliminating the risk of hypoglycemia.

The principle relies on nanoparticles that release insulin only in the presence of high glucose levels. Early clinical trials on 45 type 1 diabetic patients show outstanding results:

- 75% reduction in hypoglycemic episodes  
- Time in target glucose range increased to 95%  
- Drastic simplification of treatment (one injection per week)

"This is the Holy Grail of diabetes treatment," says Dr. Li Wei, lead investigator. "This insulin 'thinks' for the patient."

Commercialization could begin as early as 2026 after phase III trial approval.`,
    nutrition_guide_content_six: `An international team of researchers has developed “smart insulin” capable of automatically adapting to blood glucose fluctuations. This innovation could revolutionize diabetes treatment by eliminating the risks of hypoglycemia.

The principle relies on nanoparticles that release insulin only in the presence of high glucose. Early clinical trials on 45 type 1 diabetic patients show exceptional results:

- 75% reduction in hypoglycemic episodes
- Time in target glucose range increased to 95%
- Drastic simplification of treatment (one injection per week)

“This is the Holy Grail of diabetes treatment,” says Dr. Li Wei, lead investigator. “This insulin 'thinks' for the patient.”

Commercialization could begin as early as 2026 following phase III trial approval.`,
    nutrition_guide_content_seven: `At 65 years old and diabetic for 30 years, James Thompson accomplished the feat of finishing the prestigious Boston Marathon in 3 hours and 42 minutes. His journey now inspires thousands of people around the world.

“When I was diagnosed with diabetes at 35, I thought my athletic life was over,” James confides. “I was wrong. Diabetes is not a limitation; it’s a challenge to overcome.”

His training routine includes:
- Glucose monitoring every 30 minutes during exercise
- Nutrition strategy tailored with his endocrinologist
- Progressive training over 18 months
- Medical support team during the race

“James proves that well-managed diabetes doesn’t stop any dream,” says his doctor. His story is now the subject of a documentary and an upcoming book.

He is now preparing for the Ironman in Hawaii for his 66th birthday.`,
    nutrition_guide_content_eight: `Medical artificial intelligence reaches a new milestone in 2025: the latest version of the predictive algorithm developed jointly by Google Health and Stanford University achieves 97% accuracy in preventing hypoglycemia, with alerts up to 45 minutes in advance.

This next-generation AI now analyzes over 150 biomarkers in real time:
- Micro glucose variations via ultra-sensitive sensors
- Voice analysis and emotion recognition
- Sleep patterns and physiological stress
- Weather data and geolocated activity
- Dietary history via image recognition

Deployed on 15,000 patients across 12 countries, the AI shows exceptional results:
- 97% predictive accuracy (vs 94% in 2024)
- 82% reduction in severe hypoglycemia
- Predictions up to 45 minutes in advance
- Native integration with all glucose sensors

“We are entering the era of total prevention,” says Dr. Lisa Wang, Director of Google Health Diabetes. “Severe hypoglycemia becomes a preventable event.”

The DARE AI app will be the first to integrate this technology starting September 2025, with CE certification and FDA approval.`,
  },
};
