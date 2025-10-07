export const fr = {
  // App general
  appName: 'Klukoo',
  appDescription: '',
  appSlogan:
    'La première application intelligente en Afrique qui aide les patients diabétiques à mieux vivre, mieux anticiper et mieux réagir.',

  // Navigation
  nav: {
    home: 'Accueil',
    charts: 'Données',
    doses: 'Doses',
    teleconsultation: 'Télé',
    chat: 'Chat',
    assistant: 'Assistant',
    journal: 'Carnet',
    blog: 'Blog',
    family: 'Famille',
    profile: 'Profil',
    reminders: 'Rappels',
    insulin: 'Fiche de dosage d insuline',
    biomarker: 'Outil de Suivi des Biomarqueurs',
  },

  // Journal Screen
  journal: {
    title: 'Carnet',
    subtitle: 'Suivi détaillé de vos glycémies et injections',
    glucose: 'Glycémie',
    insulin: 'Insuline',
    newEntry: 'Nouvelle entrée',
    insulinReminder: 'Rappel Insuline',
    target: 'Dans la cible',
    slightlyHigh: 'Légèrement élevé',
    high: 'Élevé',
    normal: 'Normale',
    meal: 'Repas',
    activity: 'Activité',
    medication: 'Médicament',
    low: 'Bas',
    filters: {
      today: "Aujourd'hui",
      week: '7 jours',
      month: '30 jours',
    },
    context: {
      beforeMeal: 'Avant repas',
      afterMeal: 'Après repas',
      fasting: 'À jeun',
      bedtime: 'Coucher',
    },
    status: {
      target: 'Dans la cible',
      slightlyHigh: 'Légèrement élevé',
      high: 'Élevé',
      low: 'Bas',
    },
    weeklyStats: {
      title: 'Résumé hebdomadaire',
      inTarget: 'Dans la cible',
      onTimeInjections: 'Injections à temps',
      avgGlucose: 'Moyenne glycémique',
    },
    advice: {
      title: '💡 Conseil Klukoo personnalisé',
      example:
        "Excellente adherence cette semaine ! Vos glycémies en fin d'après-midi sont légèrement élevées. Considérez ajuster votre collation de 15h ou anticiper votre injection de Humalog de 10 minutes.",
    },
    injected: 'Injecté à',
    missed: 'Injection manquée',
    noEntries: 'Aucune entrée',
  },

  // Charts Screen
  charts: {
    title: 'Graphiques',
    subtitle: 'Analyse de vos données glycémiques',
    glucoseAnalysis: 'Analyse Glycémique',
    timeInRange: 'Temps dans la Cible',
    weeklyTrends: 'Tendances Hebdomadaires',
    last7Days: '7 derniers jours',
    zones: {
      veryHigh: 'Élevé',
      high: 'Limite',
      target: 'Cible',
      low: 'Bas',
    },
    stats: {
      average: 'Moyenne',
      variability: 'Variabilité',
      estimatedHbA1c: 'HbA1c estimé',
      peakMax: 'Pic Max',
    },
    objective: 'Objectif : >70% dans la cible',
    percentageByDay: 'Pourcentage de temps dans la cible par jour',
    latest: 'Dernier',
    average: 'Moyenne',
    highest: 'élevé',
    inRange: 'Dans la plage',
    glucose: 'Glycémie',
    meals: 'Glucides Des Repas',
    medications: 'Médicaments',
    activities: 'Activités',
  },

  // Doses Screen
  doses: {
    title: 'Doses',
    subtitle: "Gérez vos doses d'insuline",
    lantus: 'Lantus (Basale)',
    humalog: 'Humalog (Rapide)',
    active: 'Actif',
    pending: 'En attente',
    usualDose: 'Dose habituelle',
    scheduledTime: 'Heure programmée',
    lastInjection: 'Dernière injection',
    markAsInjected: 'Marquer comme injecté',
    currentGlucose: 'Glycémie actuelle (mg/dL)',
    mealCarbs: 'Glucides du repas',
    calculatedDose: 'Dose Calculée',
    correction: 'Correction',
    meal: 'Repas',
    total: 'Total',
    scheduleInjection: 'Programmer injection',
    missedInjection: 'Injection Manquée',
    ignore: 'Ignorer',
    injectNow: 'Injecter maintenant',
    history7Days: 'Historique 7 jours',
    adherence: 'observance',
    injectionMarked: 'Injection marquée',
    injectionSuccess: 'marqué comme injecté avec succès',
    injectionsPer: 'Injections réalisées / programmées par jour',
  },

  // Reminders Screen
  reminders: {
    title: 'Mes Rappels',
    subtitle: 'Gérez vos rappels pour insuline, médicaments, tests et plus',
    newReminder: 'Nouveau Rappel',
    upcomingReminders: 'Rappels à venir (2h)',
    today: "Aujourd'hui",
    allReminders: 'Tous les rappels',
    noReminders: 'Aucun rappel configuré',
    noRemindersDesc:
      'Créez votre premier rappel pour ne jamais oublier vos traitements',
    createReminder: 'Créer un rappel',
    dose: 'Dose',
    soon: 'Bientôt',
    done: 'Fait',
    deleteConfirm: 'Êtes-vous sûr de vouloir supprimer ce rappel ?',
    days: {
      everyday: 'Tous les jours',
      weekdays: 'Lun-Ven',
      monday: 'Lun',
      tuesday: 'Mar',
      wednesday: 'Mer',
      thursday: 'Jeu',
      friday: 'Ven',
      saturday: 'Sam',
      sunday: 'Dim',
    },
  },

  // Blog/News Screen - COMPLETE
  blog: {
    title: 'Klukoo News',
    subtitle: 'Actualités et conseils sur le diabète',
    readMore: 'Lire',
    readFull: "Lire l'article complet",
    author: 'Auteur',
    source: 'Source',
    publishedOn: 'Publié le',
    saveArticle: "Sauvegarder l'article",
    search: 'Rechercher...',
    all: 'Tous',
    categories: {
      all: 'Tous',
      research: 'Recherches',
      nutrition: 'Nutrition',
      mental: 'Mental',
      innovation: 'Innovation',
      testimonials: 'Témoignages',
      technology: 'Technologie',
      lifestyle: 'Mode de vie',
      treatment: 'Traitement',
    },
    readingTime: 'min',
    trending: 'Tendance',
    internationalNews: 'Actualités internationales sur le diabète',
    searchNews: 'Rechercher des actualités...',
    by: 'Par',
    saveArticleBtn: 'Sauvegarder',
    fullSource: 'Source complète',
    reliableSources: 'Sources fiables',
    verifiedNews:
      'Toutes nos actualités sont vérifiées et proviennent de sources médicales reconnues internationalement',
  },

  // Activities
  activities: {
    walking: 'Marche',
    running: 'Course/Jogging',
    cycling: 'Vélo',
    dancing: 'Danse',
    weightlifting: 'Musculation',
    swimming: 'Natation',
    soccer: 'Football',
    basketball: 'Basketball',
    selectActivity: 'Sélectionnez une activité',
    intensity: {
      light: 'Légère',
      moderate: 'Modérée',
      intense: 'Intense',
    },
    duration: 'Durée (minutes)',
    caloriesBurned: 'Calories brûlées',
    addActivity: 'Ajouter activité',
    activityRecorded: 'Activité enregistrée',
  },

  // Glucose contexts
  glucoseContext: {
    fasting: 'À jeun',
    beforeMeal: 'Avant repas',
    afterMeal: 'Après repas',
    bedtime: 'Avant coucher',
    random: 'Aléatoire',
    exercise: 'Après exercice',
  },

  // Modals and forms
  modals: {
    selectValue: 'Sélectionnez une valeur',
    enterValue: 'Veuillez saisir une valeur de glycémie',
    time: 'Heure',
    now: 'Maintenant',
    custom: 'Personnalisé',
    context: 'Contexte',
    notes: 'Notes (optionnel)',
    duration: 'Durée',
    minutes: 'minutes',
    scanProduct: 'Scanner un Produit',
    productScanSimulation: 'Simulation de scan de produits',
    takePhoto: 'Prendre une Photo',
    aiMealAnalysis: 'Analyse IA du repas',
    manualEntry: 'Saisie Manuelle',
    enterInformation: 'Entrez les informations',
    followCarbs: 'Suivez vos glucides facilement',
  },

  // Authentication
  auth: {
    signIn: 'Se connecter',
    signUp: "S'inscrire",
    signOut: 'Se déconnecter',
    email: 'Email',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    forgotPassword: 'Mot de passe oublié ?',
    noAccount: 'Pas de compte ?',
    hasAccount: 'Déjà un compte ?',
    loading: 'Chargement...',
    signInTitle: 'Connexion',
    signUpTitle: 'Inscription',
    description: 'Accédez à votre compte Klukoo',
    appSlogan: "Diabète Africain & Ressources d'Excellence",
    patient: 'Patient',
    professional: 'Professionnel',
    family: 'Famille',
    firstName: 'Prénom',
    lastName: 'Nom',
    professionalCode: 'Code Professionnel',
    patientCode: 'Code Patient',
    familyAccess: "Accéder à l'espace famille",
    professionalAccess: "Accéder à l'espace professionnel",
    codeProvidedByPatient: 'Code fourni par le patient',
    professionalNotRegistered: 'Pas encore inscrit ?',
    requestProfessionalAccess: 'Demander un accès professionnel',
    needHelp: "Besoin d'aide ?",
    familyAccessGuide: "Guide d'accès famille",
    termsAcceptance: 'En vous connectant, vous acceptez nos',
    termsOfUse: "Conditions d'utilisation",
    privacyPolicy: 'Politique de confidentialité',
    and: 'et notre',
    support: 'Support',
    passwordMinLength: 'Minimum 6 caractères',
    confirmPasswordPlaceholder: 'Confirmez votre mot de passe',
    emailPlaceholder: 'votre@email.com',
    professionalCodePlaceholder: "Code d'accès professionnel",
    patientCodePlaceholder: "Code d'accès du patient",
    connecting: 'Connexion...',
    registering: 'Inscription...',
    signInButton: 'Connexion',
    signUpButton: 'Inscription',
    // Error messages
    invalidCredentials: 'Email ou mot de passe incorrect',
    emailNotConfirmed: 'Veuillez confirmer votre email avant de vous connecter',
    userAlreadyExists: 'Un compte existe déjà avec cette adresse email',
    passwordMismatch: 'Les mots de passe ne correspondent pas',
    passwordTooShort: 'Le mot de passe doit contenir au moins 6 caractères',
    invalidPatientCode: 'Veuillez entrer un code patient valide',
    invalidOrExpiredCode: 'Code patient invalide ou expiré',
    connectionError: 'Une erreur est survenue lors de la connexion',
    registrationError: "Une erreur est survenue lors de l'inscription",
    // Success messages
    loginSuccess: 'Connexion réussie !',
    welcomePatient: 'Bienvenue dans votre espace patient.',
    registrationSuccess: 'Inscription réussie !',
    choosePlan: 'Choisissez votre forfait Klukoo',
    confirmEmail: 'Vérifiez votre email pour confirmer votre compte.',
    familyAccessGranted: 'Accès famille accordé !',
    welcomeFamily: "Bienvenue dans l'espace famille Klukoo.",
    professionalLoginSuccess: 'Connexion professionnelle réussie !',
    welcomeProfessional: 'Bienvenue dans votre espace professionnel.',
  },

  // Home screen
  home: {
    welcome: 'Bienvenue',
    latestGlucose: 'Dernière glycémie',
    addGlucose: 'Ajouter glycémie',
    quickActions: 'Actions rapides',
    todayStats: 'Statistiques du jour',
    medicationReminder: 'Rappel médicament',
    upcomingAppointment: 'Prochain rendez-vous',
  },

  // Glucose
  glucose: {
    level: 'Niveau de glycémie',
    normal: 'Normale',
    low: 'Bas',
    high: 'Élevé',
    addReading: 'Ajouter une mesure',
    beforeMeal: 'Avant repas',
    afterMeal: 'Après repas',
    bedtime: 'Coucher',
    morning: 'Matin',
    comment: 'Commentaire',
  },

  // Medications
  medication: {
    title: 'Médicaments',
    addMedication: 'Ajouter médicament',
    dosage: 'Dosage',
    frequency: 'Fréquence',
    time: 'Heure',
    taken: 'Pris',
    missed: 'Manqué',
    insulin: 'Insuline',
    metformin: 'Metformine',
  },

  // Professional
  professional: {
    dashboard: 'Tableau de bord professionnel',
    patients: 'Patients',
    consultations: 'Consultations',
    earnings: 'Revenus',
    schedule: 'Planning',
    startConsultation: 'Démarrer consultation',
    endConsultation: 'Terminer consultation',
    consultationNotes: 'Notes de consultation',
    fee: 'Honoraires',
    payment: 'Paiement',
    pending: 'En attente',
    completed: 'Terminé',
    duration: 'Durée',
    patientCode: 'Code patient',
    patientInformation: 'Informations Patient',
    stackTrace: 'Stack trace',
  },

  // Chat and Community
  chat: {
    title: 'Discussion communautaire',
    typeMessage: 'Tapez votre message...',
    send: 'Envoyer',
    glucoseShare: 'Partage Glycémie',
    mealShare: 'Repas diabète-friendly',
    progress: 'Célébration',
    estimatedCarbs: 'Glucides estimés',
  },

  // Common
  common: {
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    add: 'Ajouter',
    close: 'Fermer',
    confirm: 'Confirmer',
    back: 'Retour',
    next: 'Suivant',
    previous: 'Précédent',
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    warning: 'Attention',
    info: 'Information',
    today: "Aujourd'hui",
    yesterday: 'Hier',
    thisWeek: 'Cette semaine',
    thisMonth: 'Ce mois',
    mg_dl: 'mg/dL',
    mmol_l: 'mmol/L',
    send: 'Envoyer',
    sending: 'Envoi en cours...',
    enable: 'Activer',
    disable: 'Désactiver',
  },

  // Notifications
  notifications: {
    medicationTime: 'Il est temps de prendre votre médicament',
    glucoseReminder: "N'oubliez pas de mesurer votre glycémie",
    appointmentReminder: 'Rendez-vous dans 1 heure',
    dataShared: 'Données partagées avec succès',
    accessGranted: 'Accès accordé au professionnel de santé',
    accessDenied: 'Accès refusé au professionnel de santé',
  },

  // Home Screen
  homeScreen: {
    mission: 'Mission Klukoo',
    darePackage: 'Forfait Klukoo',
    completePlan: 'Klukoo Complet',
    premium: 'PREMIUM',
    monthlyPrice: 'F CFA/mois',
    healthPriceless: "Votre santé n'a pas de prix",
    unlimitedLogbook: 'Carnet glycémie illimité',
    smartReminders: "Rappels d'insuline intelligents",
    clarityCharts: 'Graphiques style Clarity',
    advancedCalculator: 'Calculateur doses avancé',
    familySupport: 'Support familial',
    aiAssistant: 'Assistant IA Klukoo',
    startTracking: 'Commencer mon suivi Klukoo',
    freeTrial: '✨ Essai gratuit 7 jours',
    cancelAnytime: 'Annulable à tout moment • Support inclus',
    lastReading: "Aujourd'hui 14:30",
    diabetes: 'Diabetes',
    management: 'Gestion',
    awareness: 'Awareness',
    education: 'Éducation',
    routine: 'Routine',
    daily: 'Quotidien',
    empowerment: 'Empowerment',
    control: 'Contrôle',
  },

  // Profile Screen
  profileScreen: {
    years: 'ans',
    yearsWithDare: 'Années avec Klukoo',
    glucoseMeasures: 'Mesures glycémie',
    adherence: 'Observance',
    personalInfo: 'Informations Personnelles',
    fullName: 'Nom complet',
    dateOfBirth: 'Date de naissance',
    age: 'Âge',
    phone: 'Téléphone',
    city: 'Ville',
    profession: 'Profession',
    medicalTeam: 'Équipe Médicale',
    doctor: 'Médecin traitant • Diabétologue',
    followUpCenter: 'Établissement de suivi',
    consultant: 'Endocrinologue consultante',
    currentTreatment: 'Dosage de l insuline',
    insulins: 'Insulines',
    keepCool: 'Conservées au frais (canari en terre cuite)',
    oralMedications: 'Médicaments oraux',
    price: 'Prix',
    glucoseTarget: 'Objectif glycémique',
    adaptedClimate: 'Adapté au climat tropical',
    emergencyContact: "Contact d'Urgence",
    spouse: 'Épouse',
    call: 'Appeler',
    sms: 'SMS',
    settings: 'Paramètres',
    notifications: 'Notifications',
    dataSharing: 'Partage de données',
    darkMode: 'Mode sombre',
    editProfile: 'Modifier le profil',
    exportData: 'Exporter les données',
    privacy: 'Confidentialité',
    signOut: 'Se déconnecter',
    verified: '✓ Profil Vérifié',
  },

  // Chat Screen
  chatScreen: {
    title: 'Klukoo Chat',
    membersConnected: 'membres connectés',
    successesThisWeek: '💚 142 succès cette semaine',
    inTargetZone: '🎯 89% dans la zone cible',
    newMembers: '👥 12 nouveaux membres',
    kindness: '💚 Bienveillance',
    mutualHelp: '🤝 Entraide',
    sharedMotivation: '🎯 Motivation commune',
    typingMessage: 'Écrivez votre message de soutien...',
    typing: "en train d'écrire...",
    messageSent: 'Message envoyé',
    messageShared: 'Votre message a été partagé avec la communauté Klukoo',
  },

  // Booklet
    booklet: {
    downloadGuideTitle: 'Guide du diabète',
    downloadGuideDescription: 'Téléchargez le guide Diabates dans votre langue préférée :',
    downloadFrench: 'Télécharger en français',
    downloadEnglish: 'Télécharger en anglais',   
  },


  // Professional Access
  professionalAccess: {
    title: "Demande d'Accès Professionnel",
    firstName: 'Prénom',
    lastName: 'Nom',
    email: 'Email',
    phone: 'Téléphone',
    profession: 'Profession',
    selectProfession: 'Sélectionnez votre profession',
    doctor: 'Médecin',
    nurse: 'Infirmier/ère',
    diabetologist: 'Diabétologue',
    nutritionist: 'Nutritionniste',
    pharmacist: 'Pharmacien/ne',
    other: 'Autre',
    licenseNumber: 'Numéro de licence',
    institution: 'Établissement',
    motivation: 'Motivation',
    motivationPlaceholder:
      'Expliquez pourquoi vous souhaitez accéder à Klukoo...',
    requestSent: 'Demande envoyée',
    requestSentDescription:
      "Votre demande d'accès professionnel a été envoyée avec succès",
    requestError: "Erreur lors de l'envoi de la demande",
  },

  // Onboarding
  onboarding: {
    step: 'Étape',
    of: 'sur',
    getStarted: 'Commencer',
    languageSelection: {
      title: 'Choisissez votre langue',
      description: 'Sélectionnez votre langue préférée pour utiliser Klukoo',
    },
    welcome: {
      title: 'Bienvenue dans Klukoo',
      subtitle: 'La première plateforme africaine de gestion du diabète',
      description:
        'Nous sommes ravis de vous accompagner dans votre parcours de santé',
    },
    profile: {
      title: 'Configurez votre profil',
      subtitle: 'Aidez-nous à personnaliser votre expérience Klukoo',
      description:
        'Ces informations nous permettront de vous offrir un suivi adapté',
      namePlaceholder: 'Entrez votre prénom',
      userType: 'Je suis un(e)...',
    },
    privacy: {
      title: 'Confidentialité et préférences',
      subtitle: 'Contrôlez vos données et notifications',
      description: 'Configurez vos préférences de confidentialité',
      notifications: 'Notifications push',
      notificationsDesc: 'Recevez des rappels pour vos médicaments et mesures',
      dataSharing: 'Partage de données anonymes',
      dataSharingDesc: 'Contribuez à la recherche sur le diabète (optionnel)',
      reminders: 'Rappels intelligents',
      remindersDesc: 'Rappels adaptatifs basés sur vos habitudes',
    },
    features: {
      title: 'Découvrez Klukoo',
      subtitle: 'Toutes les fonctionnalités pour gérer votre diabète',
      description: 'Voici ce que Klukoo peut faire pour vous',
      glucose: 'Suivi glycémique',
      reminders: 'Rappels intelligents',
      consultation: 'Téléconsultations',
      community: 'Communauté de soutien',
      tracking: 'Suivi complet',
      trackingDesc: 'Glycémie, médicaments, activités et plus',
      ai: 'Assistant IA',
      aiDesc: 'Conseils personnalisés basés sur vos données',
      telehealth: 'Télémédecine',
      telehealthDesc: 'Consultations avec des professionnels certifiés',
      support: 'Communauté',
      supportDesc: "Échangez avec d'autres personnes diabétiques",
    },
    completion: {
      title: 'Configuration terminée !',
      description: "Votre compte Klukoo est prêt à l'emploi",
    },
  },

  // Legal
  legal: {
    termsTitle: "Conditions d'Utilisation",
    termsDescription:
      "Veuillez lire attentivement nos conditions d'utilisation",
    privacyTitle: 'Politique de Confidentialité',
    privacyDescription:
      'Découvrez comment nous protégeons vos données personnelles',
    termsContent: `
      <h3>1. Acceptation des Conditions</h3>
      <p>En utilisant Klukoo (Diabète Africain & Ressources d'Excellence), vous acceptez les présentes conditions d'utilisation.</p>
      
      <h3>2. Description du Service</h3>
      <p>Klukoo est la première plateforme de gestion et suivi du diabète en Afrique, offrant :</p>
      <ul>
        <li>Suivi personnalisé de la glycémie</li>
        <li>Gestion des médicaments et rappels</li>
        <li>Téléconsultations avec des professionnels de santé</li>
        <li>Communauté de soutien</li>
        <li>Outils d'analyse et de prédiction</li>
      </ul>
      
      <h3>3. Compte Utilisateur</h3>
      <p>Vous êtes responsable de maintenir la confidentialité de votre compte et mot de passe.</p>
      
      <h3>4. Utilisation Acceptable</h3>
      <p>Vous vous engagez à :</p>
      <ul>
        <li>Fournir des informations exactes</li>
        <li>Respecter les autres utilisateurs</li>
        <li>Ne pas partager d'informations médicales d'autrui</li>
        <li>Utiliser la plateforme à des fins légales uniquement</li>
      </ul>
      
      <h3>5. Données de Santé</h3>
      <p>Vos données de santé sont strictement confidentielles et ne sont partagées qu'avec votre consentement explicite.</p>
      
      <h3>6. Téléconsultations</h3>
      <p>Les consultations médicales sont fournies par des professionnels certifiés. Elles ne remplacent pas les soins d'urgence.</p>
      
      <h3>7. Limitation de Responsabilité</h3>
      <p>Klukoo fournit des outils d'aide à la gestion du diabète mais ne remplace pas un avis médical professionnel.</p>
      
      <h3>8. Résiliation</h3>
      <p>Vous pouvez supprimer votre compte à tout moment. Nous nous réservons le droit de suspendre des comptes en cas de violation.</p>
      
      <h3>9. Modifications</h3>
      <p>Nous nous réservons le droit de modifier ces conditions avec préavis.</p>
      
      <h3>10. Contact</h3>
      <p>Pour toute question : support@Klukoo-africa.com</p>
    `,
    privacyContent: `
      <h3>1. Collecte des Données</h3>
      <p>Nous collectons les données que vous nous fournissez :</p>
      <ul>
        <li>Informations d'inscription (nom, email, téléphone)</li>
        <li>Données de santé (glycémie, médicaments, symptômes)</li>
        <li>Données d'utilisation de la plateforme</li>
      </ul>
      
      <h3>2. Utilisation des Données</h3>
      <p>Vos données sont utilisées pour :</p>
      <ul>
        <li>Personnaliser votre expérience</li>
        <li>Fournir des analyses et recommandations</li>
        <li>Faciliter les téléconsultations</li>
        <li>Améliorer nos services</li>
      </ul>
      
      <h3>3. Protection des Données</h3>
      <p>Nous utilisons des technologies de chiffrement avancées et respectons les standards RGPD et ISO 27001.</p>
      
      <h3>4. Partage des Données</h3>
      <p>Vos données ne sont JAMAIS vendues. Elles peuvent être partagées uniquement :</p>
      <ul>
        <li>Avec votre consentement explicite</li>
        <li>Avec les professionnels de santé que vous autorisez</li>
        <li>En cas d'obligation légale</li>
      </ul>
      
      <h3>5. Données Anonymisées</h3>
      <p>Nous pouvons utiliser des données anonymisées pour la recherche médicale et l'amélioration des soins du diabète en Afrique.</p>
      
      <h3>6. Vos Droits</h3>
      <p>Vous avez le droit de :</p>
      <ul>
        <li>Accéder à vos données</li>
        <li>Corriger des informations incorrectes</li>
        <li>Supprimer votre compte et vos données</li>
        <li>Exporter vos données</li>
        <li>Limiter l'utilisation de vos données</li>
      </ul>
      
      <h3>7. Conservation des Données</h3>
      <p>Vos données sont conservées tant que votre compte est actif, puis supprimées dans les 30 jours suivant la fermeture.</p>
      
      <h3>8. Cookies</h3>
      <p>Nous utilisons des cookies essentiels pour le fonctionnement de la plateforme et des cookies d'analyse avec votre consentement.</p>
      
      <h3>9. Transferts Internationaux</h3>
      <p>Vos données sont hébergées en Afrique. Tout transfert international respecte les accords de protection des données.</p>
      
      <h3>10. Contact DPO</h3>
      <p>Pour toute question sur vos données : dpo@Klukoo-africa.com</p>
      
      <p><strong>Dernière mise à jour :</strong> Décembre 2024</p>
    `,
  },

  // Admin sections
  admin: {
    notifications: '🔔 Notifications Admin',
    noNotifications: 'Aucune notification',
    newActivities: 'Les nouvelles activités apparaîtront ici',
    clearAll: 'Tout effacer',
    applications: 'Gestion des candidatures professionnelles',
    totalApplications: 'Total candidatures',
    pending: 'En attente',
    allStatuses: 'Tous les statuts',
    approve: 'Approuver',
    reject: 'Rejeter',
    viewDetails: 'Voir les détails',
    applicationSubmitted: 'Candidature déposée',
    documents: 'Documents',
    actions: 'Actions',
    license: 'Licence',
    city: 'Ville',
    institution: 'Institution',
    noDocuments: 'Aucun document',
    notSpecified: 'Non spécifiée',
  },

  // Form labels
  forms: {
    email: 'Email',
    phone: 'Téléphone',
    time: 'Heure',
    now: 'Maintenant',
    context: 'Contexte de mesure',
    measurementTime: 'Heure de mesure',
    title: 'Titre du rappel',
    reminderType: 'Type de rappel',
    mealName: 'Nom du repas',
    mealTime: 'Moment du repas',
    breakfast: 'Petit-déjeuner',
    lunch: 'Déjeuner',
    dinner: 'Dîner',
    snack: 'Collation',
    calories: 'Calories',
    profilePhoto: 'Photo de profil',
  },

  // Activities
  activityTypes: {
    walking: 'Marche',
    running: 'Course',
    cycling: 'Vélo',
    swimming: 'Natation',
    weightlifting: 'Musculation',
    other: 'Autre',
    light: 'Légère',
    moderate: 'Modérée',
    intense: 'Intense',
    estimation: 'Estimation',
  },

  // Medications
  medicationTypes: {
    rapidInsulin: 'Insuline rapide',
    slowInsulin: 'Insuline lente',
    metformin: 'Metformine',
  },

  // Error messages
  errors: {
    error: 'Erreur',
    cannotLoadPlans: 'Impossible de charger les forfaits',
    codeNotFound: 'Code manquant',
    genericError: "Une erreur s'est produite",
  },

  nativeHeader: {
    title: 'Assistant Diabète',
    greetings: 'Bonjuor',
    question: 'Comment va votre diabète aujourdhui ?',
  },

  bloodSugar: {
    title: 'Glycémie Actuelle',
    state: 'Dans la normale',
    measurement: 'Dernière mesure',
  },

  Actions: {
    actions: 'Actions Rapides',
    addMeal: 'Ajouter un repas',
    addMedication: 'Ajouter un médicament',
    addActivity: 'Ajouter une activité',
    glucoseSaved: 'Glycémie économisée',
    reminders: 'Ajouter des rappels',
    actionsPopover: {
      bloodSugar: {
        increment: 'Ajouter Glycémie',
      },
      title: 'Nouvelle mesure glycémique',
      input1: 'Glycémie',
      notes: 'optionnel',
      comments: 'Commentaires...',
    },
    button: 'Enregister',
  },

  Journal: {
    title: 'Journal des Repas',
    media: {
      scanner: 'Scanner code-barres',
      photo: 'Photo + IA',
    },
    manualEntry: 'ou saisie manuelle',
    title1: 'Nom de laliment',
    title2: 'Glucides',
    optional: 'optionnel',
    button: 'Ajouter',
  },

  Medication: {
    title: 'Medications',
    subtitle: 'Save Medication',
    title2: 'Type of medication',
    select: {
      title: 'Select a Medication',
      option: {
        one: 'Insuline ultra-rapide',
        two: 'Humalog (Lispro)',
        three: 'NovoRapid (Aspart)',
        four: 'Apidra (Glulisine)',
        five: 'Fiasp (Aspart ultra-rapide)',
        six: 'Insuline rapide',
        seven: 'Actrapid',
        eight: 'Humulin R',
        nine: 'Insuman Rapid',
        ten: 'Insuline intermédiaire',
        eleven: 'Insulatard (NPH)',
        twelve: 'Humulin N (NPH)',
        thirteen: 'Insuman Basal (NPH)',
        fourteen: 'Insuline lente',
        fifteen: 'Lantus (Glargine)',
        sixteen: 'Levemir (Detemir)',
        seventeen: 'Toujeo (Glargine U300)',
        eighteen: 'Tresiba (Degludec)',
        nineteen: 'Abasaglar (Glargine)',
        twenty: 'Insuline mixte',
        twentyone: 'NovoMix 30 (Aspart + NPH)',
        twentytwo: 'Humalog Mix 25/50 (Lispro + NPH)',
        twentythree: 'Humulin 70/30 (Rapide + NPH)',
        twentyfour: 'Insuman Comb (Rapide + NPH)',
        twentyfive: 'Metformine',
        twentysix: 'Glucophage (Metformine)',
        twentyseven: 'Stagid (Metformine)',
        twentyeight: 'Gliclazide',
        twentynine: 'Diamicron (Gliclazide)',
        thirty: 'Victoza (Liraglutide)',
        thirtyone: 'Ozempic (Semaglutide)',
        thirtytwo: 'Trulicity (Dulaglutide)',
        thirtythree: 'Januvia (Sitagliptine)',
        thirtyfour: 'Forxiga (Dapagliflozine)',
        thirtyfive: 'Autre',
      },
    },
    dose: 'Dose',
    unit: 'unit',
    button: 'Save',
  },

  Activity: {
    title: 'Activité',
    subtitle: ' Activité Physique',
    type: 'Type d activité',
    select: 'Sélectionner une activité',
    Popover: {
      one: 'Marche',
      two: 'Course',
      three: 'Vélo',
      four: 'Natation',
      five: 'Musculation',
      six: 'Autre',
    },
    duration: 'Durée',
    button: 'Enregister',
  },

  Alerts: {
    title: 'Alertes Prédictives IA',
    total: 'Totale',
    urgent: 'Urgentes',
    monitor: 'À surveiller',
    good: 'Tout va bien !',
    message: 'Aucune alerte prédictive détectée pour le moment.',
  },

  analyze: {
    title: 'Analyse IA Continue',
    message:
      'Le système analyse vos données en continu pour détecter les patterns à risque',
    buttons: {
      enter: 'Vérifier mes prédictions',
    },
  },

  mission: {
    title: 'Mission',
    message:
      'Klukoo surveille votre diabète, prédisant les risques d hypo et d hyper avant quils ne surviennent.',
  },

  analysis: {
    title: 'Analyse Glycémique',
    days: '7 derniers jours',
    time: {
      midnight: 'Minuit',
      noon: 'Midi',
    },
    context: {
      fasting: 'Jeûne',
      postMeal: 'Post-repas',
      morning: 'Matin',
      breakfast: 'Petit-déj',
      activity: 'Activité',
      lunch: 'Déjeuner',
      snack: 'Collation',
      dinner: 'Dîner',
      evening: 'Soirée',
    },
    state: {
      one: 'Élevé',
      two: 'Limite',
      three: 'Cible',
      four: 'Bas',
    },
    contextChart: 'Contexte',
  },

  target: {
    title: 'Temps dans la Cible',
    goal: 'Objectif',
    target: 'dans la cible',
  },

  mode: {
    average: 'Moyenne',
    variability: 'Variabilité',
    estimated: 'Estimé',
  },

  trend: {
    title: 'Tendances Hebdomadaires',
    message: 'Pourcentage de temps dans la cible par jour',
  },

  reminder: {
    writeup: 'Rappel Insuline - 19h00 Lantus 20UI',
  },

  lantus: {
    dose: 'Dose habituelle',
    time: 'Heure programmée',
    injection: 'Dernière injection : Aujourd hui 07:45',
    button: 'Marquer comme injecté',
  },

  humalog: {
    title: 'Humalog (Rapide)',
    glucose: 'Glycémie actuelle',
    pending: 'En attente',
    carbs: 'Glucides du repas',
    dose: 'Dose Calculée',
    meal: 'Repas',
    button: 'Planifier une injection',
  },

  injection: {
    title: 'Injection Manquée',
    time: 'Hier 19:00 - Humalog 6 UI',
    administer: 'Non administré',
    button1: 'Ignorer',
    button2: 'Injecter maintenant',
  },

  history: {
    title: 'Historique 7 jours',
    message: 'Injections réalisées / programmées par jour',
  },

  consultation: {
    title: 'Demande de Consultation',
    subtitle: 'Consultez un professionnel de santé spécialisé en diabète',
    request: {
      title: 'Nouvelle demande de consultation',
      subtitle: 'Sélectionnez un professionnel et décrivez votre besoin',
      input1: {
        title: 'Professionnel de santé *',
        writeup: 'Choisissez un professionnel',
      },
      input2: {
        title: 'Motif de consultation *',
        writeup: {
          title: 'Sélectionnez un motif',
          options: {
            one: 'Contrôle de routine',
            two: 'Consultation urgente',
            three: 'Gestion glycémie',
            four: 'Ajustement traitement',
            five: 'Conseil nutritionnel',
            six: 'Soutien psychologique',
            seven: 'Complications diabète',
            eight: 'Suivi post-consultation',
          },
        },
      },
      input3: {
        title: 'Message pour le professionnel (optionnel)',
        writeup: 'Décrivez votre situation, vos symptômes ou questions...',
      },
    },
    button: 'Envoyer la demande',
  },

  consultationRequest: {
    title: 'Mes demandes de consultation',
    subtitle: 'Historique de vos demandes et leur statut',
    request: {
      noRequest: 'Aucune demande de consultation',
      procedure: 'Vos demandes apparaîtront ici une fois envoyées',
    },
  },

  reminderScreen: {
    title: 'Mes Rappels',
    subtitle: 'Gérez vos rappels pour insuline, médicaments, tests et plus',
    newReminder: {
      title: ' Tous les rappels',
      reminderSet: 'Aucun rappel configuré',
      writeup:
        'Créez votre premier rappel pour ne jamais oublier vos traitements',
    },
    button1: 'Créer un rappel',
    button2: 'Nouveau Rappel',
  },

  chatTestimonial: {
    firstMessage:
      'Bonjour à tous ! Jai réussi à maintenir ma glycémie dans la zone cible toute la semaine 🎉',
    secondMessage:
      'Félicitations Marie ! Cest exactement le type de progrès que nous aimons voir. Continuez ainsi !',
    thirdMessage:
      'Jai une question sur linsuline rapide avant les repas. Quelquun peut-il partager son expérience ?',
  },

  journalEntries: {
    id1: {
      date: 'Vendredi',
      glucoseStatus: 'Légèrement élevé',
      context: 'Après thiéboudienne',
    },
    id2: {
      date: 'Vendredi',
      glucoseStatus: 'Dans la cible',
      context: 'À jeun',
    },
    id3: {
      date: 'Jeudi',
      glucoseStatus: 'Élevé',
      context: 'Avant dîner',
    },
    id4: {
      date: 'Jeudi',
      glucoseStatus: 'Dans la cible',
      context: 'Post-déjeuner',
    },
    id5: {
      date: 'Mercredi',
      glucoseStatus: 'Dans la cible',
      context: 'Après bissap sans sucre',
    },
  },

  blogScreen: {
    article: {
      id7: {
        category: 'instructions',
        title: 'Guide nutritionnel pour les diabétiques',
        excerpt:
          'Guide complet pour une alimentation équilibrée adaptée au diabète. Découvrez les aliments recommandés, les portions et les stratégies nutritionnelles...',
        authorTitle: 'Nutritionniste.',
      },
      id8: {
        category: 'instructions',
        title: 'Guide complet sur le diabète de type 1 et de type 2.',
        excerpt:
          'Tout ce que vous devez savoir sur le diabète : définitions, symptômes, traitements, complications et gestion au quotidien...',
        authorTitle: 'Endocrinologue.',
      },
      id1: {
        category: 'Recherche',
        title:
          'Percée : 83 % des diabétiques de type 1 libérés de l’insuline grâce au Zimislecel',
        excerpt:
          'Une thérapie révolutionnaire par cellules souches permet à 83 % des patients de ne plus avoir besoin d’injections d’insuline après un an…',
      },
      id2: {
        category: 'Innovation',
        title:
          'Gel “intelligent” révolutionnaire : guérison des plaies diabétiques en quelques jours.',
        excerpt:
          'Un nouveau gel restaure la circulation sanguine et accélère dramatiquement la cicatrisation des plaies diabétiques chroniques...',
      },
      id3: {
        category: 'Recherche',
        title:
          'Première transplantation d’îlots génétiquement modifiés sans immunosuppression',
        excerpt:
          'Pour la première fois, des cellules d’îlots pancréatiques génétiquement éditées ont été transplantées avec succès sans médicaments anti-rejet…',
      },
      id4: {
        category: 'Innovation',
        title: 'Insuline intelligente : premiers essais cliniques réussis',
        excerpt:
          'Une insuline qui s’adapte automatiquement au taux de glucose sanguin montre des résultats prometteurs lors des tests...',
      },
      id5: {
        category: 'Témoignages',
        title:
          'Marathon avec le diabète : l’exploit de James Thompson à 65 ans.',
        excerpt:
          'Diabétique depuis 30 ans, James Thompson termine le marathon de Boston et inspire des milliers de personnes...',
      },
      id6: {
        category: 'Innovation',
        title:
          'IA prédictive 2025 : prévention des hypoglycémies avec 97 % de précision',
        excerpt:
          'La nouvelle génération d’IA médicale atteint une précision de 97 % dans la prédiction des crises, avec alerte 45 minutes à l’avance…',
      },
    },
    sources: {
      title: 'Sources fiables',
      subtitle:
        'Toutes nos actualités sont vérifiées et proviennent de sources médicales reconnues internationalement',
    },
    button: 'Lire',
  },

  familyScreen: {
    heading: {
      title: 'Famille',
      subtitle: 'Votre cercle de soins',
    },
    familySharingCode: {
      title: 'Code de partage familial',
      subtitle:
        'Partagez ce code avec vos proches afin qu’ils puissent vous accompagner.',
      copyButton: 'Copier le code',
    },
    numOfPatients: {
       patients: 'Partenaires de soins',
      first: 'Alertes',
      second: 'Jours connectés',
    },
    familyMembers: {
      title: 'Membres de la famille',
      patientOne: {
        role: 'Épouse',
        permission: 'Accès complet',
        lastSeen: 'En ligne',
      },
      patientTwo: {
        role: 'Médecin traitant',
        permission: 'Urgences + Données',
        lastSeen: 'Il y a 2 heures',
      },
      patientThree: {
        role: 'Fils',
        permission: 'Lecture seule',
        lastSeen: 'Il y a 1 heure',
      },
    },
    recentActivity: {
      firstOne: {
        title: 'Activité récente',
        action: 'Fatou a consulté vos dernières glycémies.',
        time: 'Il y a 10 minutes',
      },
      secondOne: {
        action: 'Dr Kane a ajouté une note médicale.',
        time: 'Il y a 2 heures',
      },
      thirdOne: {
        action: 'Ibrahim a reçu une alerte pour injection manquée.',
        time: 'Hier à 19h30',
      },
      fourthOne: {
        action: 'Fatou a confirmé votre injection de Humalog.',
        time: 'Hier à 15h00',
      },
    },
    button1: 'Inviter un partenaire de soins',
    button2: 'Gérer les permissions',
    emergencyContact: 'Contact d’urgence',
  },

    // Invite Partner Modal 
  invitePartnerModal: {
    title: 'Inviter un partenaire de soins',
    form: {
      name: 'Nom de famille',
      phone: 'Numéro de téléphone',
      code: 'Code patient',
      permission: 'Niveau d accès',
    },
    permissionOptions: {
      read: 'Lecture seule',
      full: 'Accès complet',
    },
    button1: 'Annuler',
    button2: 'Envoyer le code',
  },

  manageAccessModal: {
    title: 'Gérer l accès',
    radio1: 'Lecture seule',
    radio2: 'Accès complet',
    radio3: 'Supprimer l accès',
    button1: 'Annuler',
    button2: 'Enregistrer',

  },

  toastMessage: {
    title: 'Nouvelle entrée',
    description: 'Fonctionnalité disponible prochainement',
    copy: 'Copié!',
    copyDescription: 'Le code d accès a été copié dans votre presse-papiers.',
  },

  //professional login card
  professionalLoginCard: {
    title: 'Professionnel de santé',
    subtitle: 'Accès aux outils professionnels',
    button: "Accéder à l'espace professionnel",
    testAccess: 'Accès test professionnel',
    loginButton: 'Connexion',
  },

  //professionalDashboard
  professionalDashboard: {
    loading: 'Chargement...',
    toast: {
      logout: {
        title: 'Déconnexion',
        description: 'Vous avez été déconnecté du mode demo',
      },
    },
    title: 'Professionnel',
    study: 'Endocrinologie',
    mode: 'Mode Démo',
    logout: 'Déconnexion',
    stats: {
      title1: 'Patients actifs',
      title2: 'Prochains rendez-vous',
      title3: 'Rapports terminés',
      title4: 'Durée moyenne / consultation',
      compared: 'vs mois dernier',
    },

    tableHeaderSections: {
      revenue: 'Revenus',
      settings: 'Paramètres',
    },

    overview: {
      heading: 'Aperçu',
      recentPatients: {
        title: 'Patients récents',
        firstPatient: {
          lastvisit: 'Il y a 2 heures',
          status: 'stable',
        },
        secondPatient: {
          lastvisit: 'Hier',
          status: 'amélioration',
        },
        ThirdPatient: {
          lastvisit: 'Il y a 3 jours',
          status: 'amélioration',
        },
        button: 'Voir tous les patients',
      },

      quickActions: {
        title: 'Actions rapides',
        scheduleAppointment: {
          title: 'Planifier un rendez-vous',
          subtitle: 'Planifier un rendez-vous',
          patient: {
            placeholder: 'Sélectionner un patient',
          },
          date: {
            placeholder: 'Choisir une date',
          },
          time: {
            title: 'Heure',
            placeholder: "Sélectionner l'heure",
          },
          consultationType: {
            title: 'Type de consultation',
            placeholder: {
              title: 'Sélectionner le type',
              routine: 'Suivi de routine',
              urgent: 'Consultation urgente',
              teleconsultation: 'Téléconsultation',
              first: 'Première consultation',
            },
          },
          notes: {
            title: 'optional',
            placeholder: 'Consultation observations...',
          },
          button1: 'Cancel',
          button2: 'Programmer',
        },

        //
        reportGenerator: {
          title: 'Générer un rapport',
          subtitle: 'Générer un rapport',
          reportType: {
            title: 'Type de rapport',
            placeholder: {
              title: 'Sélectionner un type',
              monthly: 'Rapport mensuel',
              patient: 'Rapport patient',
              financial: 'Rapport financier',
              activity: "Rapport d'activité",
            },
          },
          timeframe: {
            title: 'Période',
            placeholder: {
              title: 'Sélectionner la période',
              lastWeek: 'Semaine dernière',
              lastMonth: 'Mois dernier',
              lastQuarter: 'Trimestre dernier',
              custom: 'Période personnalisée',
            },
          },
          format: {
            placeholder: 'Sélectionner le format',
          },
          button1: 'Fermer',
          button2: 'Générer',
        },

        //
        addPatient: {
          title: 'Ajouter un patient',
          subtitle: 'Ajouter un nouveau patient',
          name: {
            firstName: 'Prénom',
            lastName: 'Nom de famille',
          },
          number: 'Téléphone',

          diabetesTypes: {
            title: 'Type de diabète',
            placeholder: {
              title: 'Sélectionner le type',
              type1: 'Type 1',
              type2: 'Type 2',
              gestational: 'Gestationnel',
            },
          },
          medicalNotes: {
            title: 'Notes médicales',
            placeholder: 'Antécédents médicaux, allergies, etc.',
          },
          button1: 'Fermer',
          button2: 'Ajouter',
        },

        //accountSetting
        accountSetting: {
          title: 'Paramètres du compte',
          currentStatus: {
            title: 'Disponibilité',
            placeholder: 'Statut actuel',
            options: {
              available: 'Disponible',
              busy: 'Occupé',
              offline: 'Hors ligne',
            },
          },

          notifications: {
            placeholder: 'Préférences de notification',
            options: {
              all: 'Toutes les notifications',
              important: 'Uniquement les importantes',
              none: 'Aucune notification',
            },
          },

          consultationFee: 'Tarif de consultation',
          button1: 'Fermer',
          button2: 'Enregistrer',
        },
      },
    },

    //patient
    patients: {
      calendar: 'Calendrier',
      title: 'Liste des patients',
      tableHeading: {
        first: 'Patient',
        second: 'Type de diabète',
        third: 'Dernière consultation',
        fourth: 'Dernière glycémie',
        fifth: 'Statut',
      },
      lastBloodGlucose: {
        first: 'Stable',
        second: 'amélioration',
        third: 'attention',
        fourth: 'Stable',
      },
      recentNotes: {
        title: 'Notes récentes',
        people: {
          first:
            'Glycémie bien contrôlée. Continuer le traitement actuel. Prochaine consultation dans 1 semaine.',
          second:
            "Amélioration significative de l'HbA1c. Réduction de la dose d'insuline recommandée.",
          third:
            'Pics fréquents de glycémie. Revoir l’alimentation et ajuster le traitement.',
          fourth: '',
        },
      },
      dropdownOptions: {
        first: 'Voir le dossier',
        second: 'Envoyer un message',
        third: 'Téléconsultation',
        fourth: 'Appeler',
        fifth: 'Modifier le profil',
      },

      //
      planning: {
        title: 'Planning des consultations',
        tableHeading: {
          time: 'Heure',
          duration: 'Durée',
          status: 'Statut',
        },
        type: {
          followUp: 'Suivi routine',
          urgent: 'Consultation urgente',
          teleconsultation: 'Téléconsultation',
          first: 'Première consultation',
        },
        status: {
          scheduled: 'Planifié',
          completed: 'Terminé',
          cancelled: 'Annulé',
        },
        actions: {
          start: 'Commencer la consultation',
          view: 'Voir les détails',
          edit: 'Modifier',
          cancel: 'Annuler',
        },
      },

      //calender
      calendarScreen: {
        title: 'Calendrier',
        consulationOf: 'Consultations du',
        scheduled: "Aucune consultation prévue pour aujourd'hui",
      },
    },

    //consulations
    consultations: {
      title: 'Mes consultations',
      placeholder: {
        title: 'Filtrer par statut',
        options: {
          all: 'Toutes',
          pending: 'En attente',
          active: 'Actives',
          completed: 'Terminées',
        },
      },
      loading: 'Chargement des consultations...',
    },

    revenue: {
      title: 'Revenu',
      thisMonth: 'Ce mois-ci',
      revenueThisMonth: 'Revenu net ce mois-ci',
      tableHeader: {
        grossAmount: 'Montant Brut',
        status: 'Statut',
      },
      consultationType: {
        one: 'Consultation endocrinologie',
        two: 'Suivi diabète',
        three: 'Consultation endocrinologie',
        four: 'Téléconsultation',
        five: 'Consultation endocrinologie',
        six: 'Suivi hormonal',
      },
      status: {
        paid: 'Payé',
        processing: 'En traitement',
        pending: 'En attente',
      },
      consultationRevenue: {
        title: 'Revenu par consultation',
        writeup:
          'Le revenu est calculé automatiquement selon les tarifs par profession définis dans le système. Chaque consultation terminée ajoute le montant correspondant à votre revenu.',
      },
    },

    //accountSettings
    accountSettings: {
      title: 'Paramètres du compte',
      writeup: 'Paramètres du compte en cours de développement...',
    },
  },

  //fixes
  getGlucoseStatus: {
    status_low: 'Glycémie basse',
    status_normal: 'Dans la normale',
    status_high: 'Glycémie élevée',
  },

  foodNamePlaceholder: {
    placeholder_foodName: 'Ex: Pomme, Riz, Salade...',
  },

  mealType: {
    label_mealType: 'Type de repas',
    option_breakfast: 'Petit-déjeuner',
    option_lunch: 'Déjeuner',
    option_dinner: 'Dîner',
    option_snack: 'Snack',
  },

  foodDetailsPlaceholder: {
    placeholder_foodDetails: 'Ex: Avec du poulet, sauce légère...',
  },

  blogScreenFixes: {
    title_diabetesNews: 'Actualités internationales sur le diabète',
    placeholder_searchNews: 'Rechercher des actualités...',
    loading_news: 'Chargement des actualités...',
    no_articles_found: 'Aucun article trouvé.',
    categories: {
      all: 'Tout',
      guides: 'Guides',
      research: 'Recherche',
      nutrition: 'Nutrition',
      mental: 'Santé mentale',
      innovation: 'Innovation',
      testimonials: 'Témoignages',
    },
  },

  profileScreenFixes: {
    status_unverifiedProfile: 'Profil non vérifié',
    label_weight: 'Poids',
    label_professionalLicense: 'Licence professionnelle',
    label_specialty: 'Spécialité',
    action_editProfile: 'Modifier le profil',
    label_firstName: 'Prénom',
    label_lastName: 'Nom',
    label_phone: 'Téléphone',
  },

  professionalNotification: {
    title_consultationRequests: 'Demandes de consultation',
    message_noRequests: 'Aucune demande',
    time_justNow: 'Il y a quelques minutes',
    time_oneHour: 'Il y a 1 heure',
    time_hours: 'Il y a {{count}} heures',
    time_day: 'Il y a {{count}} jour',
    time_days: 'Il y a {{count}} jours',
    toast_accessGranted_title: 'Accès accordé',
    toast_accessGranted_description:
      '✅ Accès accordé au professionnel de santé pour 24h',
    toast_accessDenied_title: 'Accès refusé',
    toast_accessDenied_description: '❌ Accès refusé au professionnel de santé',
    toast_error_title: 'Erreur',
    toast_error_description: 'Erreur lors de la réponse à la demande',
    section_glucose: 'Glycémies',
    section_medications: 'Médicaments',
    section_meals: 'Repas',
    section_activities: 'Activités',
    section_notes: 'Notes personnelles',
    section_reports: 'Rapports médicaux',
    title_dataAccessRequest: "🔐 Demande d'Accès à vos Données",
    label_professionalCode: 'Code professionnel:',
    label_maxConsultations: 'Consultations max:',
    label_requested: 'Demandé:',
    title_requestedData: '📋 Données demandées:',
    button_deny: '❌ Refuser',
    button_approve: '✅ Autoriser (24h)',
  },

  applicationCard: {
    professional_endocrinologist: 'Endocrinologue',
    professional_diabetologist: 'Diabétologue',
    professional_nutritionist: 'Nutritionniste',
    professional_generalPractitioner: 'Médecin généraliste',
    professional_nurse: 'Infirmier(e) spécialisé(e)',
    professional_pharmacist: 'Pharmacien',
    professional_psychologist: 'Psychologue',
    professional_podiatrist: 'Podologue',
    badge_pending: 'En attente',
    notSpecified: 'Non spécifiée',
    application_submitted: 'Candidature déposée',
    button_approve: 'Approuver',
    button_reject: 'Rejeter',
    personalInfo_title: 'Informations personnelles',
    personalInfo_email: 'Email :',
    personalInfo_phone: 'Téléphone :',
    personalInfo_location: 'Localisation :',
    professionalQualifications_title: 'Qualifications professionnelles',
    professionalQualifications_licenseNumber: 'N° Licence :',
    professionalQualifications_institution: 'Institution :',
    documents_title: 'Documents justificatifs',
    documents_label: 'Document',
    button_view: 'Voir',
    noDocument: 'Aucun document',
    application_submitted_on: 'Candidature déposée le',
  },

  documentUploader: {
    file_too_large: '{{fileName}}: Fichier trop volumineux (max 10MB)',
    file_unsupported_type: '{{fileName}}: Type de fichier non supporté',
    max_files_allowed: 'Maximum {{maxFiles}} fichiers autorisés',
    file_already_added: '{{fileName}}: Fichier déjà ajouté',
    documents_title: 'Documents justificatifs',
    documents_count: '{{current}}/{{max}} fichiers',
    dropzone_dragFiles: 'Glissez vos documents ici',
    dropzone_orClick: 'ou',
    dropzone_clickToSelect: 'cliquez pour sélectionner',
    dropzone_fileInfo:
      '{{types}} - Max {{maxFiles}} fichiers - 10MB par fichier',
    documents_added: 'Documents ajoutés :',
    requiredDocuments_title: '📋 Documents requis :',
    requiredDocuments_item1:
      '• Diplôme de médecine ou certification professionnelle',
    requiredDocuments_item2: "• Licence d'exercice en cours de validité",
    requiredDocuments_item3:
      "• Certificat d'inscription à l'ordre des médecins",
    requiredDocuments_item4: '• CV professionnel détaillé',
    requiredDocuments_item5: "• Pièce d'identité (optionnel mais recommandé)",
  },

  errorBoundary: {
    error_occurred: "Oups! Une erreur s'est produite",
    unexpected_error_message:
      "Une erreur inattendue s'est produite dans l'application Klukoo. Notre équipe technique a été informée automatiquement.",
    button_restart: 'Redémarrer',
    button_home: 'Accueil',
    footer_text: '💪 Klukoo - Osez vaincre le diabète ensemble',
  },

  onboardingFlow: {
    language_selected_title: 'Langue sélectionnée',
    language_selected_description: 'Français sélectionné avec succès',
    choose_language_title: 'Choisissez votre langue',
    choose_language_description:
      'Sélectionnez votre langue préférée pour continuer',
  },

  planSelection: {
    loading_plans: 'Chargement des forfaits...',
    plans_error_title: 'Erreur',
    plans_error_description: 'Impossible de charger les forfaits',
    choose_plan_title: 'Choisissez votre forfait Klukoo',
    choose_plan_description:
      'Sélectionnez le forfait qui correspond le mieux à vos besoins',
    badge_recommended_family: 'Recommandé pour la famille',
    per_month: 'par mois',
    selected: 'Sélectionné',
    choose_this_plan: 'Choisir ce forfait',
    payment_secure: '💳 Paiement sécurisé par Flutterwave',
    payment_method_card: '• Cartes bancaires (Visa, Mastercard, etc.)',
    payment_method_mobile: '• Mobile Money (Orange Money, MTN, Wave, etc.)',
    payment_method_bank: '• Virements bancaires locaux',
    payment_method_patient_code:
      '• Code patient généré automatiquement après paiement',
    cancel: 'Annuler',
    continue: 'Continuer',
    localCurrency: 'Devise locale',
  },

  professionalCodeManager: {
    code_generated_title: 'Code généré avec succès',
    code_generated_description:
      "Votre code d'identification professionnel est prêt",
    code_error_title: 'Erreur',
    code_error_description: 'Impossible de générer le code professionnel',
    code_copied_title: 'Code copié',
    code_copied_description: 'Le code a été copié dans le presse-papiers',
    missing_code_title: 'Code manquant',
    missing_code_description: "Veuillez saisir un code d'accès patient",
    meal_fasting: 'À jeun',
    meal_after_meal: 'Après repas',
    meal_before_dinner: 'Avant dîner',
    access_granted_title: 'Accès autorisé',
    access_granted_description: 'Données patient récupérées avec succès',
    access_denied_title: 'Accès refusé',
    access_denied_description: "Code d'accès invalide ou patient introuvable",
    professional_id_code: "Code d'identification professionnel",
    professional_code_description:
      'Générez votre code unique pour accéder aux données patients Klukoo',
    generate_professional_code: 'Générer mon code professionnel',
    generated_on: 'Généré le',
    badge_active: 'Actif',
    professional_code_warning:
      "Important : Ce code est personnel et confidentiel. Ne le partagez jamais. Il vous permet d'accéder aux données sensibles des patients.",
    patient_data_access_title: 'Accès données patient',
    patient_data_access_description:
      "Utilisez votre code professionnel pour accéder aux données d'un patient",
    patient_code_label: "Code d'accès patient",
    patient_code_placeholder: 'Saisissez le code patient...',
    all_access_tracked: 'Tous les accès sont tracés et sécurisés',
    secure_patient_data_title: 'Données Patient - Accès Sécurisé',
    secure_patient_data_description:
      'Informations médicales sensibles - Usage strictement professionnel',
    patient_information: 'Informations Patient',
    last_name: 'Nom',
    first_name: 'Prénom',
    diabetes_type: 'Type de diabète',
    recent_glucose_readings: 'Relevés glycémiques récents',
    confidentiality_notice:
      'Confidentialité : Ces données sont strictement confidentielles et protégées par le secret médical. Toute utilisation non autorisée est passible de sanctions.',
  },

  blogScreenRead: {
    nutrition_guide_content_one: `# Guide d'alimentation pour personnes diabétiques

## Introduction
Une alimentation équilibrée est la pierre angulaire de la gestion du diabète. Ce guide vous fournit les bases pour adopter de bonnes habitudes alimentaires qui vous aideront à contrôler votre glycémie tout en maintenant une qualité de vie optimale.

## Principes de base

### 1. Répartition des macronutriments
- **Glucides** : 45-65% de l'apport énergétique total
- **Protéines** : 15-20% de l'apport énergétique total  
- **Lipides** : 20-35% de l'apport énergétique total

### 2. Index glycémique
Privilégiez les aliments à index glycémique bas ou modéré :
- **IG bas (< 55)** : Légumes verts, légumineuses, quinoa, avoine
- **IG modéré (55-70)** : Pain complet, riz brun, patate douce
- **IG élevé (> 70)** : À limiter - pain blanc, pomme de terre, sucre

## Aliments recommandés

### Légumes (à volonté)
- Brocolis, épinards, courgettes, aubergines
- Tomates, poivrons, concombres
- Chou-fleur, haricots verts, asperges

### Protéines de qualité
- Poissons gras : saumon, maquereau, sardines
- Volaille sans peau : poulet, dinde
- Légumineuses : lentilles, pois chiches, haricots
- Œufs (avec modération)
- Tofu et produits à base de soja

### Glucides complexes
- Quinoa, avoine, orge
- Pain complet, pâtes complètes
- Riz brun, légumineuses
- Patate douce (avec modération)

### Bonnes graisses
- Huile d'olive, avocat
- Noix, amandes, graines
- Poissons gras

## Aliments à limiter

### Sucres simples
- Sucreries, pâtisseries, sodas
- Fruits très sucrés en excès
- Miel, sirop d'érable (occasionnellement)

### Graisses saturées
- Viandes grasses, charcuterie
- Fromages gras, beurre en excès
- Aliments frits, fast-food

## Stratégies pratiques

### Planification des repas
1. **Méthode de l'assiette** :
   - 1/2 assiette : légumes non féculents
   - 1/4 assiette : protéines maigres
   - 1/4 assiette : glucides complexes

2. **Horaires réguliers** : 3 repas + 1-2 collations si nécessaire

3. **Contrôle des portions** :
   - Utilisez des assiettes plus petites
   - Pesez vos aliments au début pour apprendre
   - Écoutez vos signaux de satiété

### Gestion des envies
- Buvez de l'eau avant les repas
- Incluez des fibres à chaque repas
- Préparez des collations saines à l'avance
- Mangez lentement et en pleine conscience

## Conseils spécifiques par type de diabète

### Type 1
- Comptage des glucides pour ajuster l'insuline
- Attention aux hypoglycémies pendant l'exercice
- Resucrage adapté en cas d'hypoglycémie

### Type 2
- Perte de poids si nécessaire (5-10%)
- Activité physique régulière après les repas
- Surveillance de la tension artérielle

## Hydratation
- 1,5 à 2 litres d'eau par jour
- Évitez les boissons sucrées
- Thé et café sans sucre autorisés
- Attention à l'alcool (avec modération et jamais à jeun)

## Compléments et vitamines
Consultez votre médecin avant de prendre :
- Vitamine D (souvent carencée)
- Magnésium
- Oméga-3
- Chrome (controverse scientifique)

## Conclusion
Une alimentation adaptée au diabète n'est pas restrictive mais équilibrée. Elle permet de profiter des plaisirs de la table tout en maintenant une glycémie stable. N'hésitez pas à consulter un nutritionniste spécialisé pour un plan personnalisé.`,

    nutrition_guide_content_two: `# Guide complet sur le diabète de type 1 et type 2

## Qu'est-ce que le diabète ?

Le diabète est une maladie chronique caractérisée par une hyperglycémie (taux de sucre élevé dans le sang) due à un défaut de sécrétion ou d'action de l'insuline. Il existe plusieurs types de diabète, mais les plus fréquents sont les types 1 et 2.

## Diabète de type 1

### Définition
Le diabète de type 1 est une maladie auto-immune où le système immunitaire détruit les cellules bêta du pancréas qui produisent l'insuline. Il représente 5-10% des cas de diabète.

### Caractéristiques
- **Début** : Généralement avant 30 ans, souvent dans l'enfance
- **Évolution** : Rapide, en quelques semaines ou mois
- **Hérédité** : Faible composante génétique (3-5% de risque familial)
- **Poids** : Souvent poids normal ou maigreur

### Symptômes
Les "4P" classiques :
- **Polyurie** : urines abondantes et fréquentes
- **Polydipsie** : soif intense
- **Polyphagie** : faim excessive
- **Perte de poids** rapide et inexpliquée

Autres symptômes :
- Fatigue extrême
- Vision floue
- Infections récurrentes
- Haleine fruitée (cétose)

### Diagnostic
- **Glycémie à jeun** ≥ 1,26 g/L (7 mmol/L) à deux reprises
- **Glycémie aléatoire** ≥ 2 g/L (11,1 mmol/L) avec symptômes
- **HbA1c** ≥ 6,5% (48 mmol/mol)
- **Test de tolérance au glucose** : glycémie ≥ 2 g/L à 2h

### Traitement
**Insulinothérapie obligatoire** :
- Insuline basale (lente) : couvre les besoins de base
- Insuline prandiale (rapide) : couvre les repas
- Schémas possibles : stylos, pompe à insuline

**Surveillance** :
- Glycémie 4-6 fois/jour minimum
- HbA1c tous les 3 mois (objectif < 7%)
- Surveillance des complications

## Diabète de type 2

### Définition
Le diabète de type 2 résulte d'une résistance à l'insuline et/ou d'un déficit de sécrétion insulinique. Il représente 90-95% des cas de diabète.

### Caractéristiques
- **Début** : Généralement après 40 ans (de plus en plus jeune)
- **Évolution** : Progressive, souvent asymptomatique au début
- **Hérédité** : Forte composante génétique (30-40% de risque familial)
- **Poids** : Souvent surpoids ou obésité (80% des cas)

### Facteurs de risque
- Âge > 45 ans
- Surpoids/obésité (IMC > 25)
- Antécédents familiaux de diabète
- Sédentarité
- Hypertension artérielle
- Dyslipidémie
- Antécédent de diabète gestationnel
- Syndrome des ovaires polykystiques (SOPK)
- Origine ethnique (africaine, hispanique, asiatique)

### Symptômes
Souvent asymptomatique au début, puis :
- Fatigue
- Soif modérée
- Urines fréquentes
- Infections récurrentes (mycoses, cystites)
- Cicatrisation lente
- Vision floue

### Diagnostic
Mêmes critères que le type 1, mais évolution plus lente.

### Traitements

**1. Mesures hygiéno-diététiques (première ligne)**
- Perte de poids (5-10% du poids initial)
- Alimentation équilibrée
- Activité physique régulière (150 min/semaine)
- Arrêt du tabac

**2. Médicaments oraux**
- **Metformine** : première intention, diminue la production hépatique de glucose
- **Sulfamides hypoglycémiants** : stimulent la sécrétion d'insuline
- **Glinides** : stimulation rapide de l'insuline
- **Inhibiteurs des alpha-glucosidases** : ralentissent l'absorption des glucides
- **Glitazones** : améliorent la sensibilité à l'insuline
- **Inhibiteurs DPP-4** : augmentent l'insuline et diminuent le glucagon
- **Agonistes du GLP-1** : injectables, effet sur la satiété

**3. Insuline (si échec des autres traitements)**

## Complications communes

### Complications aiguës
**Hypoglycémie** (< 0,70 g/L) :
- Symptômes : tremblements, sueurs, palpitations, confusion
- Traitement : 15g de glucides rapides (3 morceaux de sucre)

**Hyperglycémie sévère** :
- Type 1 : acidocétose diabétique (urgence)
- Type 2 : coma hyperosmolaire (urgence)

### Complications chroniques
**Microvasculaires** :
- **Rétinopathie** : atteinte des vaisseaux de la rétine
- **Néphropathie** : atteinte des reins
- **Neuropathie** : atteinte des nerfs (pieds, mains)

**Macrovasculaires** :
- Infarctus du myocarde (risque x2-4)
- Accident vasculaire cérébral
- Artérite des membres inférieurs

**Autres** :
- Pied diabétique
- Infections récurrentes
- Troubles de l'érection

## Prévention des complications

### Contrôle glycémique
- **Objectif HbA1c** : < 7% (personnalisable selon l'âge et les comorbidités)
- **Autosurveillance** régulière
- **Adaptation thérapeutique** selon les résultats

### Contrôle des facteurs de risque cardiovasculaire
- **Tension artérielle** : < 140/90 mmHg (< 130/80 si possible)
- **Cholestérol** : LDL < 1g/L (< 0,7g/L si haut risque)
- **Arrêt du tabac** impératif

### Surveillance régulière
- **Ophtalmologique** : fond d'œil annuel
- **Néphrologique** : créatinine et microalbuminurie annuelles
- **Podologique** : examen des pieds régulier
- **Cardiologique** : ECG, échodoppler si nécessaire

## Vivre avec le diabète

### Au quotidien
- **Alimentation** : équilibrée, régulière, adaptée
- **Activité physique** : 30 min/jour minimum
- **Gestion du stress** : techniques de relaxation
- **Sommeil** : 7-8h/nuit, qualité importante

### Situations particulières
- **Voyage** : prévoir médicaments, ordonnances
- **Maladie** : surveillance renforcée, adaptation traitement
- **Grossesse** : suivi spécialisé, objectifs glycémiques stricts
- **Sport** : adaptation insuline/alimentation selon l'effort

### Éducation thérapeutique
- Programmes d'éducation en groupe ou individuels
- Apprentissage de l'autogestion
- Soutien psychologique si nécessaire
- Associations de patients

## Innovations et perspectives

### Technologies
- **Capteurs de glucose continu** : surveillance sans piqûres
- **Pompes à insuline** intelligentes
- **Pancréas artificiel** : en développement
- **Applications mobiles** : aide à la gestion

### Recherche
- **Thérapies cellulaires** : transplantation d'îlots, cellules souches
- **Immunothérapies** : prévention du type 1
- **Médicaments innovants** : nouvelles classes thérapeutiques

## Conclusion

Le diabète est une maladie complexe mais gérable. Une prise en charge précoce et adaptée, associée à une bonne hygiène de vie, permet de prévenir les complications et de maintenir une qualité de vie optimale. L'éducation du patient et le soutien de l'équipe soignante sont essentiels pour une gestion réussie à long terme.`,
    nutrition_guide_content_three: `Une percée médicale majeure vient d'être annoncée : le traitement Zimislecel, une thérapie par cellules souches, a permis à 83% des patients atteints de diabète de type 1 sévère d'arrêter complètement leurs injections d'insuline après une seule perfusion.

L'étude, publiée ce mois-ci, a suivi 12 volontaires pendant un an. Dix d'entre eux n'ont plus eu besoin d'insuline, tandis que les deux autres ont pu réduire drastiquement leurs doses. Aucun épisode d'hypoglycémie sévère n'a été rapporté.

"C'est révolutionnaire", explique le Dr. Jennifer Martinez, investigatrice principale. "Nous assistons potentiellement à la fin de l'ère des injections quotidiennes d'insuline pour ces patients."

Le traitement utilise des cellules souches manipulées pour devenir des cellules d'îlots pancréatiques, responsables de la production d'insuline. Cette approche représente l'aboutissement de décennies de recherche sur la médecine régénérative.

La FDA examine actuellement ce traitement pour une approbation accélérée, ce qui pourrait révolutionner la prise en charge du diabète de type 1 dès 2026.`,
    nutrition_guide_content_four: `Une innovation majeure dans le traitement des plaies diabétiques vient d'être dévoilée : un gel "intelligent" qui combine des vésicules cicatrisantes microscopiques avec un hydrogel spécialisé, restaurant la circulation sanguine et accélérant la guérison de façon spectaculaire.

Cette thérapie révolutionnaire, développée par une équipe internationale, utilise des messagers de guérison encapsulés dans des nanovésicules qui se libèrent progressivement au contact de la plaie. Le gel stimule la formation de nouveaux vaisseaux sanguins tout en protégeant la zone blessée.

Les résultats des tests cliniques sont impressionnants :
- Guérison 5 fois plus rapide que les traitements conventionnels
- Restauration complète de la circulation sanguine en 72h
- Réduction de 85% du risque d'amputation
- Aucun effet secondaire majeur reporté

"Cette technologie va sauver des milliers de membres chaque année", déclare le Dr. Sarah Chen, dermatologue spécialisée. "Nous passons de semaines de traitement à quelques jours seulement."

Le gel sera disponible dans les hôpitaux européens dès septembre 2025, après validation réglementaire.`,
    nutrition_guide_content_five: `Une équipe internationale de chercheurs a développé une "insuline intelligente" capable de s'adapter automatiquement aux variations de glucose sanguin. Cette innovation pourrait révolutionner le traitement du diabète en éliminant les risques d'hypoglycémie.

Le principe repose sur des nanoparticules qui libèrent l'insuline uniquement en présence de glucose élevé. Les premiers essais cliniques sur 45 patients diabétiques de type 1 montrent des résultats exceptionnels :

- Réduction de 75% des épisodes d'hypoglycémie - Temps dans la cible glycémique augmenté à 95% - Simplification drastique du traitement (une injection par semaine)

"C'est le Saint Graal du traitement diabétique", explique le Dr. Li Wei, responsable de l'étude. "Cette insuline 'pense' à la place du patient."

La commercialisation pourrait débuter dès 2026 après validation des essais de phase III.`,
    nutrition_guide_content_six: `Une équipe internationale de chercheurs a développé une "insuline intelligente" capable de s'adapter automatiquement aux variations de glucose sanguin. Cette innovation pourrait révolutionner le traitement du diabète en éliminant les risques d'hypoglycémie.

Le principe repose sur des nanoparticules qui libèrent l'insuline uniquement en présence de glucose élevé. Les premiers essais cliniques sur 45 patients diabétiques de type 1 montrent des résultats exceptionnels :

- Réduction de 75% des épisodes d'hypoglycémie - Temps dans la cible glycémique augmenté à 95% - Simplification drastique du traitement (une injection par semaine)

"C'est le Saint Graal du traitement diabétique", explique le Dr. Li Wei, responsable de l'étude. "Cette insuline 'pense' à la place du patient."

La commercialisation pourrait débuter dès 2026 après validation des essais de phase III.`,
    nutrition_guide_content_seven: `À 65 ans et diabétique depuis 30 ans, James Thompson a réalisé l'exploit de terminer le prestigieux marathon de Boston en 3h42min. Son parcours inspire désormais des milliers de personnes à travers le monde.

"Quand on m'a diagnostiqué le diabète à 35 ans, je pensais que ma vie sportive était finie", confie James. "J'avais tort. Le diabète n'est pas une limite, c'est un défi à relever."

Sa routine d'entraînement inclut : - Surveillance glycémique toutes les 30 minutes pendant l'effort - Stratégie nutritionnelle adaptée avec son endocrinologue - Entraînement progressif sur 18 mois - Équipe de soutien médical pendant la course

"James prouve que le diabète bien géré n'empêche aucun rêve", déclare son médecin. Son histoire fait désormais l'objet d'un documentaire et d'un livre à paraître.

Il prépare maintenant l'Ironman de Hawaï pour ses 66 ans.`,
    nutrition_guide_content_eight: `L'intelligence artificielle médicale franchit un nouveau cap en 2025 : la dernière version de l'algorithme prédictif développé conjointement par Google Health et l'Université de Stanford atteint une précision de 97% dans la prévention des hypoglycémies, avec des alertes jusqu'à 45 minutes à l'avance.

Cette IA de nouvelle génération analyse désormais plus de 150 biomarqueurs en temps réel : - Micro-variations glycémiques via capteurs ultra-sensibles - Analyse vocale et reconnaissance d'émotions - Patterns de sommeil et stress physiologique - Données météorologiques et activité géolocalisée - Historique alimentaire via reconnaissance d'images

Déployée sur 15,000 patients dans 12 pays, l'IA montre des résultats exceptionnels : - 97% de précision prédictive (vs 94% en 2024) - Réduction de 82% des hypoglycémies sévères - Prédictions jusqu'à 45 minutes à l'avance - Intégration native avec tous les capteurs glucose

"Nous entrons dans l'ère de la prévention totale", déclare le Dr. Lisa Wang, directrice de Google Health Diabetes. "L'hypoglycémie sévère devient un événement évitable."

L'application Klukoo AI sera la première à intégrer cette technologie dès septembre 2025, avec certification CE et FDA approuvée.`,
    save: 'Sauvegarder',
    fullSource: 'Source complète',
    all: 'Tous',
    newsSearchPlaceholder: 'Rechercher des actualités...',
  },

  adminDashboardScreen: {
    applicationApprovedTitle: 'Candidature approuvée !',
    applicationApprovedDescription:
      '{{firstName}} {{lastName}} a été approuvé(e)',
    errorTitle: 'Erreur',
    applicationApproveError: "Impossible d'approuver la candidature",
    applicationLoadError: 'Impossible de charger les candidatures',
    reasonRequiredTitle: 'Motif requis',
    reasonRequiredDescription: 'Veuillez indiquer le motif du rejet',
    applicationRejectedTitle: 'Candidature rejetée',
    applicationRejectedDescription:
      '{{firstName}} {{lastName}} a été rejeté(e)',
    applicationRejectError: 'Impossible de rejeter la candidature',
    statusPending: 'En attente',
    statusApproved: 'Approuvé',
    statusRejected: 'Rejeté',
    adminTitle: '🏥 Administration Klukoo',
    adminSubtitle: 'Gestion des candidatures professionnelles',
    totalApplications: 'Total candidatures',
    searchPlaceholder: 'Rechercher par nom, email, ou spécialité...',
    allStatuses: 'Tous les statuts',
    filterByStatus: 'Filtrer par statut',
    noApplicationsFound: 'Aucune candidature trouvée',
    tabDetails: 'Détails',
    phoneLabel: 'Téléphone',
    licenseLabel: 'Licence',
    cityLabel: 'Ville',
    institutionLabel: 'Institution',
    notSpecified: 'Non spécifiée',
    documentLabel: 'Document {{number}}',
    viewButton: 'Voir',
    noDocuments: 'Aucun document',
    rejectionReasonPlaceholder: 'Motif du rejet (requis)',
    applicationAlreadyProcessed: 'Candidature déjà traitée',
    processedOn: 'Traitée le {{date}}',
    selectApplication: 'Sélectionnez une candidature',
    selectApplicationHint: 'pour voir les détails',
  },

  adminApplicationReview: {
    applicationApprovedTitle: 'Candidature approuvée !',
    applicationApprovedDescription:
      '{{firstName}} {{lastName}} a été approuvé(e)',
    errorTitle: 'Erreur',
    applicationApproveError: "Impossible d'approuver la candidature",
    reasonRequiredTitle: 'Motif requis',
    reasonRequiredDescription: 'Veuillez indiquer le motif du rejet',
    applicationRejectedTitle: 'Candidature rejetée',
    applicationRejectedDescription:
      '{{firstName}} {{lastName}} a été rejeté(e)',
    applicationRejectError: 'Impossible de rejeter la candidature',
    loadingApplications: 'Chargement des candidatures...',
    adminApplicationsTitle: '🔧 Klukoo Admin - Candidatures',
    pendingApplications: "{{count}} candidature(s) en attente d'examen",
    refresh: 'Actualiser',
    noPending: {
      title: 'Aucune candidature en attente',
      description:
        'Toutes les candidatures ont été traitées. Les nouvelles candidatures apparaîtront ici automatiquement.',
    },
    refreshCheck: 'Vérifier les nouvelles candidatures',
    rejectionReason: {
      title: 'Motif du rejet',
      placeholder: 'Expliquez pourquoi cette candidature est rejetée...',
    },
    actions: {
      confirmReject: 'Confirmer le rejet',
    },
    applications: {
      noSelectionTitle: 'Aucune sélection',
      noSelectionDescription:
        'Cliquez sur "Examiner" pour voir les détails d\'une candidature',
    },
  },

  adminDashboard: {
    dashboard: {
      loadErrorTitle: 'Erreur de chargement',
      loadErrorDescription:
        'Impossible de charger les métriques du tableau de bord.',
      loadingAdmin: 'Chargement du tableau de bord administrateur...',
    },
    title: '🔧 Klukoo Administration',
    subtitle: 'Gestion des professionnels de santé',
    metrics: {
      paymentsThisMonth: 'Paiements ce mois',
      activeProfessionals: 'Professionnels actifs',
      monthlyConsultations: 'Consultations ce mois',
      pendingApplications: 'Candidatures en attente',
    },
  },

  chatScreenFixes: {
    typingIndicator: "{{users}} en train d'écrire...",
  },

  consultationRequestFixes: {
    errors: {
      loadProfessionals: 'Erreur chargement professionnels :',
      loadRequests: 'Erreur chargement demandes :',
      professionalNotFound: 'Professionnel non trouvé',
      sendRequestConsole: 'Erreur envoi demande :',
      sendRequestToastTitle: 'Erreur',
      sendRequestToastDescription: "Impossible d'envoyer la demande",
    },
    fieldsRequiredTitle: 'Champs requis',
    fieldsRequiredDescription:
      'Veuillez sélectionner un professionnel et un motif de consultation.',
    requestSentTitle: 'Demande envoyée !',
    requestSentDescription:
      'Le professionnel recevra une notification et vous répondra bientôt.',
    status: {
      pending: 'En attente',
      accepted: 'Acceptée',
      rejected: 'Refusée',
      completed: 'Terminée',
    },
    professionals: {
      endocrinologist: 'Endocrinologue',
      general_practitioner: 'Médecin généraliste',
      psychologist: 'Psychologue',
      nurse: 'Infirmier(ère)',
      nutritionist: 'Nutritionniste',
    },
    consultationFee: 'Tarif consultation',
    monthlyPackagePercentage: '({percentage}% du forfait mensuel)',
    consultation: {
      button: 'Envoyer',
      sending: 'Envoi en cours...',
      request: {
        title: 'Mes demandes de consultation',
        subtitle: 'Suivez toutes vos demandes de consultation ici',
        reason: 'Motif:',
        requestedOn: 'Demandé le:',
        professionalResponse: 'Réponse du professionnel:',
        join: 'Rejoindre',
      },
    },
  },

  doctorDashboard: {
    consultationReasonDefault: 'Consultation de suivi diabète',
    consultationAcceptedTitle: 'Consultation acceptée',
    consultationAcceptedDescription:
      'La consultation a été confirmée. Le patient en sera informé.',
    errors: {
      acceptConsultationTitle: 'Erreur',
      acceptConsultationDescription: "Impossible d'accepter la consultation.",
      declineConsultationTitle: 'Erreur',
      declineConsultationDescription: 'Impossible de décliner la consultation.',
    },
    consultationDeclinedTitle: 'Consultation déclinée',
    consultationDeclinedDescription:
      'La consultation a été annulée. Le patient en sera informé.',
    statusToggle: {
      onlineTitle: 'Vous êtes maintenant en ligne',
      onlineDescription: 'Vous pouvez recevoir de nouvelles consultations',
      offlineTitle: 'Vous êtes maintenant hors ligne',
      offlineDescription: 'Vous ne recevrez plus de nouvelles demandes',
    },
    dashboard: {
      loading: 'Chargement du tableau de bord...',
    },
    doctor: {
      title: 'Dr. Mamadou Kane',
      subtitle: 'Endocrinologue • Klukoo Pro',
    },
    earningsToday: "Gains aujourd'hui",
    statusButton: {
      online: '🟢 En ligne',
      offline: '🔴 Hors ligne',
    },
    settingsButton: 'Paramètres',
    stats: {
      pendingPatients: 'Patients en attente',
      monthlyRevenue: 'Revenus ce mois',
      todayConsultations: "Consultations aujourd'hui",
      averageConsultationTime: 'Temps moyen/consultation',
    },
    pendingConsultations: 'Consultations en Attente',
    pendingBadge: '{{count}} en attente',
    noPendingConsultations: 'Aucune consultation en attente',
    newRequestsInfo: 'Les nouvelles demandes apparaîtront ici',
  },

  healthProfessionalScreen: {
    acceptanceRequiredTitle: 'Acceptation requise',
    acceptanceRequiredDescription:
      "Vous devez accepter les conditions d'utilisation et la charte déontologique",
    registration: {
      submittedTitle: 'Inscription soumise',
      submittedDescription:
        "Votre demande d'inscription sera examinée sous 24h",
      accessDeniedTitle: 'Accès refusé',
      accessDeniedDescription:
        "L'acceptation de la charte déontologique Klukoo est obligatoire",
    },
    teleconsultation: {
      startedTitle: 'Téléconsultation initiée',
      startedDescription: 'Connexion avec le patient en cours...',
    },
    consultationTypes: {
      diabetesFollowUp: 'Suivi diabète',
      urgentConsultation: 'Consultation urgente',
      bloodSugarCheck: 'Contrôle glycémie',
    },
    consultationStatuses: {
      pending: 'En attente',
      inProgress: 'En cours',
      scheduled: 'Programmée',
    },
    professionalPortal: {
      title: 'Portal Professionnel Klukoo',
      description:
        'Rejoignez notre réseau de professionnels de santé et offrez des téléconsultations spécialisées en diabète',
    },
    formLabels: {
      firstName: 'Prénom *',
      lastName: 'Nom *',
      specialty: 'Spécialité *',
      specialtyPlaceholder: 'Sélectionnez votre spécialité',

      specialties: {
        endocrinologist: 'Endocrinologue',
        generalPractitioner: 'Médecin généraliste',
        diabetologist: 'Diabétologue',
        nutritionist: 'Nutritionniste',
        diabetesNurse: 'Infirmier spécialisé diabète',
      },
      license: 'Numéro CNI *',
      licensePlaceholder: 'Ex: A1234567890',
      hospital: 'Établissement',
      hospitalPlaceholder: 'Hôpital ou clinique',
      email: 'Email professionnel *',
      phone: 'Téléphone *',
      terms: "J'accepte les conditions d'utilisation",
      charter: "J'accepte la charte de déontologie Klukoo (obligatoire)",
      submitApplication: 'Soumettre ma candidature',
    },
    professionalBenefits: {
      title: 'Avantages professionnels :',
      list: {
        one: '• Rémunération de 500 FCFA par téléconsultation',
        two: '• Paiement mensuel automatique',
        three: '• Plateforme sécurisée et certifiée',
        four: '• Accès aux données glycémiques temps réel',
        five: '• Support technique 24/7',
      },
    },
    professionalInfo: {
      verified: 'Vérifié',
      endocrinologist: 'Endocrinologue',
    },
    tabs: {
      overview: 'Aperçu',
      consultations: 'Consultations',
      earnings: 'Rémunérations',
      patients: 'Patientes',
      access_codes: "Codes d'accès",
      settings: 'Paramètres',
    },
    labels: {
      patients_tracked: 'Patients suivis',
      today_consultations: "Consultations aujourd'hui",
      today_earnings: "Revenus aujourd'hui",
      average_rating: 'Note moyenne',
      upcoming_consultations: 'Prochaines consultations',
    },
    consultation: {
      status: {
        en_cours: 'En cours',
        terminée: 'Terminée',
        annulée: 'Annulée',
      },
    },
    dashboard: {
      consultations_management: {
        title: 'Gestion des consultations',
        description:
          'Planifiez et gérez vos téléconsultations avec les patients Klukoo',
        available_slots: 'Créneaux disponibles',
        manage_slots: 'Gérer mes créneaux',
      },
      free_slots: {
        title: 'Créneaux libres',
        subtitle: 'Cette semaine',
      },
      scheduled_consultations: {
        title: 'Consultations programmées',
        subtitle: 'Cette semaine',
      },
      earnings: {
        detailed_title: 'Revenus détaillés',
        today: "Aujourd'hui",
        week: 'Cette semaine',
        month: 'Ce mois',
        pending: 'En attente de paiement',
      },
      auto_payments: {
        title: 'Paiements automatiques',
        description:
          'Vos rémunérations sont versées automatiquement chaque mois',
        last_transfer: 'Dernier virement',
        next_transfer: 'Prochain virement',
        january: 'Janvier',
      },
      patients: {
        title: 'Mes patients',
        description: 'Suivi des patients diabétiques qui vous sont assignés',
        type: 'Diabète Type',
        lastGlucose: 'Dernière glycémie',
        record: 'Dossier',
        contact: 'Contacter',
      },
    },
    dialog: {
      codeOfConduct: {
        title: 'Charte Déontologique Klukoo',
        description:
          'Veuillez lire attentivement et accepter notre charte déontologique pour rejoindre Klukoo',
      },
    },
    codeOfConductFull: `
Article 1 - Engagement professionnel
Le professionnel de santé s'engage à respecter les principes déontologiques de sa profession et à maintenir ses compétences à jour dans le domaine du diabète.

Article 2 - Qualité des soins
Tous les soins dispensés via Klukoo doivent respecter les standards de qualité les plus élevés. Le professionnel s'engage à fournir des consultations complètes et adaptées aux besoins spécifiques de chaque patient diabétique.

Article 3 - Confidentialité et protection des données
Le professionnel s'engage à respecter strictement la confidentialité des données patients et à ne jamais divulguer d'informations médicales sans autorisation expresse. Toutes les données sont protégées selon les normes RGPD.

Article 4 - Disponibilité et ponctualité
Le professionnel s'engage à respecter ses créneaux de consultation et à être ponctuel. En cas d'empêchement, il doit prévenir au minimum 2 heures à l'avance.

Article 5 - Responsabilité médicale
Le professionnel reste pleinement responsable de ses actes médicaux et diagnostics. Klukoo fournit uniquement la plateforme technologique, la responsabilité médicale incombe entièrement au professionnel de santé.

Article 6 - Formation continue
Le professionnel s'engage à participer aux formations Klukoo proposées et à maintenir ses connaissances à jour concernant les nouvelles pratiques en diabétologie.

Article 7 - Sanctions
Le non-respect de cette charte peut entraîner une suspension temporaire ou définitive de l'accès à la plateforme Klukoo, sans préavis ni compensation.
`,
  },
  charterFooter: {
    note: 'En acceptant cette charte, vous confirmez avoir lu, compris et vous engagez à respecter tous les articles ci-dessus.',
    buttons: {
      decline: 'Refuser',
      accept: 'Accepter et continuer',
    },
  },

  healthProfessionalSignupScreen: {
    professionals: {
      endocrinologist: {
        name: 'Endocrinologue',
        rate: '630 F CFA/consultation (35%)',
        description: 'Spécialiste diabète et hormones',
      },
      general_practitioner: {
        name: 'Médecin Généraliste',
        rate: '520 F CFA/consultation (29%)',
        description: 'Médecine générale avec focus diabète',
      },
      psychologist: {
        name: 'Psychologue',
        rate: '430 F CFA/séance (24%)',
        description: 'Soutien psychologique diabète',
      },
      nurse: {
        name: 'Infirmier(ère)',
        rate: '120 F CFA/suivi (7%)',
        description: 'Suivi et éducation thérapeutique',
      },
      nutritionist: {
        name: 'Nutritionniste',
        rate: '100 F CFA/consultation (5%)',
        description: 'Conseils alimentaires personnalisés',
      },
    },
    toastMissingFields: {
      title: 'Champs requis manquants',
      description: 'Veuillez remplir tous les champs obligatoires.',
    },
    toastApplicationSubmitted: {
      title: 'Candidature soumise !',
      description:
        'Votre candidature a été envoyée pour examen. Vous recevrez une réponse dans les 24-48h.',
    },
    toastSubmissionError: {
      title: 'Erreur',
      description: 'Une erreur est survenue lors de la soumission.',
      variant: 'destructive',
    },
    professionalPortal: {
      title: '🏥 Klukoo Pro - Professionnels de Santé',
      subtitle:
        'Rejoignez le réseau Klukoo et monétisez vos consultations de télémédecine',
      benefits: {
        freeRegistration: 'Inscription gratuite',
        validatedWithin48h: 'Validation sous 48h',
        securePayment: 'Paiement sécurisé',
      },
    },
    registrationSteps: {
      step1: {
        title: '1. Sélectionnez votre spécialité',
        description:
          'Choisissez la spécialité qui correspond à votre expertise',
      },
      step2: {
        title: '2. Informations professionnelles - {{name}}',
        description:
          'Fournissez vos informations professionnelles pour la vérification',
        firstName: 'Prénom *',
        firstNamePlaceholder: 'Votre prénom',
        lastName: 'Nom *',
        lastNamePlaceholder: 'Votre nom',
        email: 'Email professionnel *',
        emailPlaceholder: 'professionnel@hopital.com',
        phone: 'Téléphone',
        phonePlaceholder: '+221 XX XXX XX XX',
        licenseNumber: 'Numéro de licence/ordre *',
        licenseNumberPlaceholder: "Numéro d'inscription à l'ordre",
        institution: 'Institution/Hôpital',
        institutionPlaceholder: 'Nom de votre institution',
        city: 'Ville',
        cityPlaceholder: 'Dakar, Thiès, etc.',
        country: 'Pays',
        countryPlaceholder: 'Sélectionnez votre pays',
        countries: {
          senegal: 'Sénégal',
          mali: 'Mali',
          burkina: 'Burkina Faso',
          cote_ivoire: "Côte d'Ivoire",
          guinea: 'Guinée',
          mauritania: 'Mauritanie',
        },
        experience: "Années d'expérience",
        experiencePlaceholder: 'Sélectionnez votre expérience',
        experienceOptions: {
          '0-2': '0-2 ans',
          '3-5': '3-5 ans',
          '6-10': '6-10 ans',
          '11-15': '11-15 ans',
          '15+': 'Plus de 15 ans',
        },
        biography: 'Biographie professionnelle',
        biographyPlaceholder:
          'Décrivez votre parcours et votre expertise dans le domaine du diabète...',
      },
      step3: {
        title: 'Documents justificatifs',
        description:
          'Uploadez vos documents pour la vérification (diplômes, licences, CV)',
        selectedDocuments: 'Documents sélectionnés',
      },
    },
    dareProCompensation: {
      title: 'Nouveau système de rémunération (1800 F/patient/mois) :',
      endocrinologue: 'Endocrinologue: 630 F (35%)',
      medecinGeneraliste: 'Médecin généraliste: 520 F (29%)',
      psychologue: 'Psychologue: 430 F (24%)',
      infirmier: 'Infirmier(ère): 120 F (7%)',
      nutritionniste: 'Nutritionniste: 100 F (5%)',
      paiementsAutomatiques: 'Paiements automatiques mensuels',
    },
    applicationForm: {
      submitButton: {
        default: 'Soumettre ma candidature',
        loading: 'Soumission en cours...',
      },
      disclaimer:
        "En soumettant cette candidature, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.",
    },
  },

  patientAccessScreen: {
    status: {
      pending: 'En attente',
      approved: 'Approuvé',
      denied: 'Refusé',
      expired: 'Expiré',
      default: '{{status}}',
    },
    loading: {
      accessRequests: "Chargement des demandes d'accès...",
    },
    access: {
      title: 'Accès Professionnels',
      subtitle: "Gérez les demandes d'accès à vos données médicales",
      refresh: 'Actualiser',
      history: '📋 Historique des accès',
      emptyHistory: "Aucun historique d'accès pour le moment",
      requestedOn: 'Demandé le:',
      respondedOn: 'Répondu le:',
      authorizedData: 'Données autorisées:',
      noRequestTitle: "Aucune demande d'accès",
      noRequestDescription:
        "Les professionnels de santé pourront demander l'accès à vos données médicales. Vous recevrez une notification pour chaque demande.",
    },
    requests: {
      pending: '⏳ Demandes en attente ({{count}})',
    },
  },

  paymentScreen: {
    subscription: {
      defaultDescription: 'Abonnement mensuel Klukoo Premium',
      period: 'Période',
      oneMonth: '1 mois',
    },
    toasts: {
      missingInfo: {
        title: 'Missing Information',
        description: 'Please fill in all required fields',
      },
    },
    payment: {
      simulationLog: 'Simulation paiement Flutterwave:',
      simulationError: "Simulation d'échec de paiement",
      toastErrorTitle: 'Paiement échoué (Test)',
      toastErrorDescription: "Simulation d'échec de paiement. Réessayez.",
      secure: 'Paiement sécurisé',
      perMonth: 'par mois',
      infoTitle: 'Informations de paiement',
      secureInfo: 'Paiement sécurisé via Flutterwave',
      fullNameLabel: 'Nom complet *',
      fullNamePlaceholder: 'Votre nom complet',
      secureByFlutterwave: 'Paiement sécurisé par Flutterwave',
      processing: 'Traitement...',
      pay: 'Payer {{amount}}',
    },
    paymentSuccess: {
      title: 'Paiement confirmé !',
      welcome:
        'Bienvenue dans Klukoo Premium. Votre abonnement est maintenant actif.',
      activated: 'Klukoo Premium activé',
      access: 'Accès complet à toutes les fonctionnalités',
    },
    form: {
      emailLabel: 'Adresse email *',
      phoneLabel: 'Numéro de téléphone *',
    },
    paymentMethods: {
      title: 'Méthodes de paiement acceptées',
      mobileMoney: '📱 Mobile Money (MTN, Airtel, M-Pesa, etc.)',
      cardPayments : '💳 Card Payments (Visa, Mastercard, Verve)',
      bankTransfers: '🏦 Bank Transfers',
      ussd: '🔢 USSD',
      barter: '💲 Barter by Flutterwave',
      paypal: '🌍 PayPal (via Flutterwave)'
    },
    subscriptionInfo: {
      securePayment: 'Paiement sécurisé • Annulable à tout moment',
      support: 'Support technique inclus',
    },
    localCurrency: 'Devise locale',
  },

  paymentSuccess: {
    toast: {
      paymentConfirmed: {
        title: 'Paiement confirmé !',
        description:
          'Votre abonnement Klukoo est maintenant actif (Mode Test).',
      },
      copyCode: {
        title: 'Code copié !',
        description:
          'Le code patient {{code}} a été copié dans le presse-papiers.',
      },
    },
    errors: {
      missingSessionId: 'Session ID manquant',
    },
    payment: {
      successTitle: 'Paiement confirmé !',
      successDescription: 'Votre abonnement Klukoo est maintenant actif.',
      verifyError: 'Échec de la vérification du paiement',
      verifyErrorToast: 'Impossible de vérifier le paiement',
      verifying: 'Vérification du paiement en cours...',
      errorTitle: 'Erreur de paiement',
      backToAuth: "Retour à l'authentification",
      errorMessage: '{{error}}',
      successMessage:
        'Félicitations ! Votre abonnement Klukoo est maintenant actif.',
    },
    patient: {
      codeTitle: 'Votre code patient Klukoo',
      codeUsage:
        'Utilisez ce code pour accéder à vos fonctionnalités et le partager avec votre famille',
    },
    subscription: {
      status: "Statut de l'abonnement",
      active: 'Actif',
    },
    account: {
      email: 'Email du compte',
    },
    billing: {
      next: 'Prochaine facturation',
    },
    benefits: {
      title: '🎉 Vos avantages Klukoo',
      list: {
        fullAccess: 'Accès complet à toutes les fonctionnalités Klukoo',
        consultations: '10 téléconsultations par mois',
        chatNews: 'Klukoo Chat et Klukoo News',
        alerts: 'Alertes personnalisées et suivi glycémie',
      },
    },
    confirmationEmail: {
      title: 'Email de confirmation envoyé',
      message:
        'Un email avec votre code patient et toutes les informations importantes a été envoyé à {{email}}',
    },
    buttons: {
      completeProfile: 'Compléter mon profil',
      accessApp: 'Accéder à Klukoo',
    },
  },

  predictiveAlertsScreen: {
    aiSystem: {
      title: "Système d'IA Prédictive",
      subtitle:
        'Intelligence Artificielle • Machine Learning • Alertes Temps Réel',
    },
    aiFeatures: {
      multiFactorAnalysis: {
        title: 'Analyse Multi-facteurs',
        description: 'Glycémie, Repas, Insuline, Âge, Activités',
      },
      predictiveAI: {
        title: 'IA Prédictive',
        description: 'Détection précoce des risques',
      },
      familyAlerts: {
        title: 'Alertes Famille',
        description: 'Notifications simultanées',
      },
    },
  },

  professionalMainDashboard: {
    errorLoadingHistory: 'Erreur chargement historique',
    codeRequired: '⚠️ Code requis',
    patientCodeRequired: 'Veuillez saisir un code patient',
    accessAuthorized: '✅ Accès autorisé',
    accessGranted: 'Données de {{firstName}} {{lastName}} accessibles',
    accessDenied: '❌ Accès refusé',
    accessDeniedDescription:
      '{{error}} ou code patient invalide ou accès non autorisé',
    patientAccessError: 'Erreur accès patient:',
    noPatientSelectedTitle: '❌ Erreur',
    noPatientSelectedDescription: 'Aucun patient sélectionné',
    consultationStartedTitle: '🩺 Consultation démarrée',
    consultationStartedDescription:
      'Consultation avec {{firstName}} {{lastName}}',
    consultationStartErrorTitle: '❌ Erreur',
    consultationStartErrorDescription: 'Impossible de démarrer la consultation',
    consultationStartError: 'Erreur démarrage consultation : {{error}}',
    verifiedStatus: '🟢 Vérifié',
    validity: 'Validité : {{date}}',
    patientDataAccess: '🔍 Accès aux Données Patient',
    patientCode: 'Code Patient Klukoo',
    access: 'Accéder',
    scan_qr_code: 'Scanner QR Code Patient',
    last_glucose: 'Dernière glycémie',
    remaining_consultations: 'Consultations restantes',
    start_consultation: 'Démarrer Consultation',
    close_access: 'Fermer Accès',
    consultation_notes: 'Notes de consultation',
    consultation_notes_placeholder: 'Saisissez vos observations...',
    status: {
      completed: '✅ Terminée',
      started: '🔄 En cours',
      pending: '⏳ En attente',
    },
    recentAccess: {
      title: '📋 Accès Récents',
      refresh: '🔄 Actualiser',
      duration: 'Durée : {{minutes}} min',
      none: 'Aucun accès récent',
      info: 'Vos consultations apparaîtront ici',
    },
  },

  professionalRegistrationScreen: {
    profession: {
      endocrinologist: 'Endocrinologue',
      general_practitioner: 'Médecin généraliste',
      diabetologist: 'Diabétologue',
      nutritionist: 'Nutritionniste',
      nurse: 'Infirmier(e) spécialisé(e)',
      pharmacist: 'Pharmacien',
      psychologist: 'Psychologue',
      podiatrist: 'Podologue',
    },
    toast: {
      required_field_title: 'Champ requis',
      required_field_description: 'Veuillez remplir le champ: {{field}}',
      required_documents_title: 'Documents requis',
      required_documents_description:
        'Veuillez ajouter au moins un document justificatif',
      application_submitted_title: 'Candidature soumise !',
      application_submitted_description:
        'Votre candidature a été envoyée avec succès',
      error: 'Erreur soumission:',
    },
    application: {
      submitted_success: '🎉 Candidature soumise avec succès !',
      reference: 'Numéro de référence :',
      nextSteps: {
        title: '⏰ Prochaines étapes :',
        review: {
          title: 'Examen de votre dossier',
          description: 'Notre équipe vérifiera vos qualifications (48-72h)',
        },
        documents: {
          title: 'Vérification des documents',
          description: 'Contrôle de vos certifications',
        },
        emailNotification: {
          title: 'Notification par email',
          description: 'Vous recevrez notre décision',
        },
        accountActivation: {
          title: 'Activation du compte',
          description: "Si approuvé, vous recevrez vos codes d'accès",
        },
      },
      submitting: '📤 Envoi en cours...',
      submit: '🚀 Soumettre ma candidature',
    },
    registration: {
      confirmationEmail: 'Un email de confirmation a été envoyé à {{email}}',
    },
    buttons: {
      backToHome: "Retour à l'accueil",
      login: 'Se connecter',
    },
    apply: {
      title: 'Candidature Klukoo Pro',
      subtitle: 'Rejoignez la plateforme de consultation diabétologique',
    },
    personalInfo: {
      title: 'Informations personnelles',
      firstNameLabel: 'Prénom *',
      firstNamePlaceholder: 'Votre prénom',
      lastNameLabel: 'Nom *',
      lastNamePlaceholder: 'Votre nom',
      emailLabel: 'Email professionnel *',
      phoneLabel: 'Téléphone *',
    },
    professionalInfo: {
      header: 'Informations professionnelles',
      typeLabel: 'Type de professionnel *',
      typePlaceholder: 'Sélectionnez votre spécialité',
      licenseLabel: 'Numéro de licence *',
      licensePlaceholder: "Numéro d'inscription à l'ordre",
      institutionLabel: 'Institution / Hôpital',
      institutionPlaceholder: 'Nom de votre établissement',
    },
    professionalTypes: {
      endocrinologist: 'Endocrinologue',
      general_practitioner: 'Médecin généraliste',
      diabetologist: 'Diabétologue',
      nutritionist: 'Nutritionniste',
      nurse: 'Infirmier(e) spécialisé(e)',
      pharmacist: 'Pharmacien',
      psychologist: 'Psychologue',
      podiatrist: 'Podologue',
    },
    location: {
      header: 'Localisation',
      countryLabel: 'Pays *',
      countryPlaceholder: 'Sélectionnez votre pays',
      cityLabel: 'Ville *',
      cityPlaceholder: "Votre ville d'exercice",
    },
    documents: {
      title: 'Documents justificatifs',
    },
    terms: {
      title: "Conditions d'utilisation",
      agreement:
        "En soumettant cette candidature, vous acceptez les conditions d'utilisation de la plateforme Klukoo et vous engagez à respecter la charte professionnelle et déontologique.",
      privacy:
        'Vos données personnelles seront traitées conformément à notre politique de confidentialité.',
    },
  },

  professionalRequestDashboard: {
    requests: {
      accepted: 'Demande acceptée',
      rejected: 'Demande refusée',
      rescheduled: 'Nouvelle date proposée',
      new_slot: 'Nouveau créneau: {{date}} à {{time}}',
    },
  },

  remindersScreen: {
    status: {
      upcoming: 'Bientôt',
    },
    reminder: {
      delete_confirmation: 'Êtes-vous sûr de vouloir supprimer ce rappel ?',
      upcoming: 'Rappels à venir ',
      today: "Aujourd'hui",
      markDone: 'Fait',
    },
  },

  teleconsultationBooking: {
    toast: {
      missing_info: {
        title: 'Informations manquantes',
        description:
          'Veuillez sélectionner un professionnel, une date et une heure.',
      },
      consultation_booked: {
        title: 'Consultation réservée !',
        description:
          'Votre consultation avec {{firstName}} {{lastName}} est confirmée pour le {{date}} à {{time}}.',
      },
      booking_error: {
        title: 'Erreur de réservation',
        description: 'Une erreur est survenue lors de la réservation.',
      },
    },
    professions: {
      endocrinologist: 'Endocrinologue',
      psychologist: 'Psychologue',
      nutritionist: 'Nutritionniste',
      nurse: 'Infirmier(ère)',
      diabetologist: 'Diabétologue',
      general_practitioner: 'Médecin Généraliste',
    },
    teleconsultation_title: 'Téléconsultation',
    teleconsultation_description:
      'Réservez une consultation avec un professionnel de santé spécialisé en diabète',
    search_filters: 'Filtres de recherche',
    search_label: 'Rechercher',
    specialty_label: 'Spécialité',
    all_specialties: 'Toutes les spécialités',
    endocrinologist: 'Endocrinologue',
    diabetologist: 'Diabétologue',
    nutritionist: 'Nutritionniste',
    psychologist: 'Psychologue',
    nurse: 'Infirmier(ère)',
    general_practitioner: 'Médecin Généraliste',
    city_label: 'Ville',
    city_placeholder: 'Dakar, Thiès...',
    available_professionals: 'Professionnels disponibles',
    next_slot: 'Prochain créneau :',
    book_consultation: 'Réserver une consultation',
    select_professional: 'Sélectionnez un professionnel pour réserver',
    consultation_date_label: 'Date de consultation',
    available_time_slots: 'Créneaux horaires disponibles',
    summary: 'Récapitulatif',
    professional_label: 'Professionnel',
    date_label: 'Date',
    time_label: 'Heure',
    rate_label: 'Tarif',
    booking_loading: 'Réservation...',
    book_and_pay: 'Réserver et payer',
  },

  teleconsultationInterface: {
    patient_message_thanks: "Merci docteur, je me sens mieux aujourd'hui.",
    consultation_completed_title: 'Consultation terminée',
    consultation_completed_description: '{amount} F CFA ajoutés à vos revenus',
    consultation_extended_title: 'Consultation prolongée',
    consultation_extended_description:
      '15 minutes supplémentaires ajoutées (+250 F CFA)',
    audio_enabled: 'Audio activé',
    audio_disabled: 'Audio désactivé',
    video_enabled: 'Vidéo activée',
    video_disabled: 'Vidéo désactivée',
    prescription_title: 'Prescription',
    prescription_description:
      'Module de prescription en cours de développement',
    consultation_with: 'Consultation avec',
    started_since: 'Démarrée il y a',
    audio_button: 'Audio',
    video_button: 'Vidéo',
    prescribe_button: 'Prescrire',
    consultation_notes_title: 'Notes de consultation',
    consultation_notes_placeholder:
      'Notez vos observations, diagnostics, recommandations...',
    end_consultation_button: 'Terminer Consultation ({amount} F CFA ajouté)',
    extend_consultation_button: 'Prolonger (+250 F)',
  },

  activityModal: {
    activity_walking: 'Marche',
    activity_running: 'Course/Jogging',
    activity_cycling: 'Vélo',
    activity_dancing: 'Danse',
    activity_weightlifting: 'Musculation',
    activity_swimming: 'Natation',
    intensity_light: 'Légère',
    intensity_moderate: 'Modérée',
    intensity_intense: 'Intense',
    activity_type_error_title: 'Erreur',
    activity_type_error_description: "Veuillez sélectionner un type d'activité",
    activity_saved_title: 'Activité enregistrée',
    activity_saved_description:
      '{activityName} ({duration}min, {intensity}) ajoutée au carnet',
    save_activity: 'Enregistrer Activité Physique',
    activity_type_label: "Type d'activité",
    activity_type_placeholder: 'Sélectionnez une activité',
    duration_label: 'Durée: {duration} minutes',
    duration_min: '15 min',
    duration_max: '120 min',
    intensity_label: 'Intensité: {intensity}',
    estimation_title: 'Estimation',
    estimation_duration: 'Durée:',
    estimation_intensity: 'Intensité:',
    estimation_calories: 'Calories brûlées estimées:',
    cancel_button: 'Annuler',
    save_button: 'Enregistrer',
  },

  addGlucoseModal: {
    blood_sugar_error_title: 'Erreur',
    blood_sugar_error_description: 'Veuillez saisir une valeur de glycémie',
    context_fasting: 'À jeun',
    context_before_meal: 'Avant repas',
    context_after_meal_1h: 'Après repas (1h)',
    context_after_meal_2h: 'Après repas (2h)',
    context_bedtime: 'Avant coucher',
    context_night: 'Nocturne',
    new_blood_sugar_measure: 'Nouvelle Mesure Glycémique',
    glucose_label: 'Valeur glycémie (mg/dL)',
    glucose_placeholder: 'Ex: 120',
    measurement_time_label: 'Heure de mesure',
    time_now: 'Maintenant',
    time_custom: 'Heure personnalisée',
    measurement_context_label: 'Contexte de mesure',
    notes_label: 'Notes (optionnel)',
    notes_placeholder: 'Ajoutez vos observations...',
    cancel_button: 'Annuler',
    save_button: 'Enregistrer',
  },

  barcodeScanModal: {
    camera_prompt_header: 'Scanner le code-barres',
    camera_prompt_photo: 'Prendre une photo',
    camera_prompt_gallery: 'Choisir depuis la galerie',
    food_name_apple: 'Pomme Golden - 1 unité moyenne',
    barcode_scanned_title: 'Code-barres scanné',
    barcode_scanned_description: 'Produit: {productName}',
    barcode_scan_error_title: 'Erreur',
    barcode_scan_error_description: 'Impossible de scanner le code-barres',
    scan_error_log: 'Erreur lors du scan:',
    scanner_modal_title: '📱 Scanner Code-barres',
    scanner_button_scanning: 'Scan en cours...',
    scanner_button_start: 'Démarrer le scan',
    scanner_detected_label: 'Code-barres détecté:',
    food_found_title: 'Produit trouvé:',
    food_name_label: 'Nom:',
    food_carbs_label: 'Glucides:',
    add_to_journal_button: 'Ajouter au journal',
    manual_code_label: 'Ou saisir le code manuellement:',
    manual_code_placeholder: 'Ex: 1234567890123',
  },

  completeMealModal: {
    painDeMieComplet: 'Pain de mie complet',
    yaourtNature: 'Yaourt nature',
    toast: {
      barcodeScanned: 'Code-barres scanné ✓',
      productAdded: '{{product}} ajouté avec succès',
      scanErrorTitle: 'Erreur',
      scanErrorDescription: 'Impossible de scanner le code-barres',
      productFoundTitle: 'Produit trouvé',
      productFoundDescription: '{{product}} ajouté',
      productNotFoundTitle: 'Produit non trouvé',
      productNotFoundDescription: 'Code-barres non reconnu',
      apiErrorTitle: 'Erreur',
      apiErrorDescription: 'Impossible de récupérer les informations',
      photoErrorTitle: 'Erreur',
      photoErrorDescription: 'Impossible de capturer la photo',
      imageAnalyzed: {
        title: 'Image analysée par IA ✓',
        description: '{{meal}} détecté',
      },
      formError: {
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs requis',
      },
      mealSaved: {
        title: 'Repas enregistré',
        description: '{{meal}} - {{carbs}}g glucides',
      },
    },
    product: {
      unknown: 'Produit inconnu',
    },
    mealTypes: {
      saladeCesar: 'Salade César',
      patesBolognaise: 'Pâtes Bolognaise',
      sandwichJambon: 'Sandwich Jambon',
      rizLegumes: 'Riz aux légumes',
      pizzaMargherita: 'Pizza Margherita',
    },
    headings: {
      mealJournal: '🍽️ Journal des Repas',
      scanBarcode: 'Scanner Code-Barres',
      takePhoto: 'Prendre une Photo',
      manualEntry: 'Saisie Manuelle',
    },
    texts: {
      addMealQuestion: 'Comment souhaitez-vous ajouter votre repas ?',
      scanSimulation: 'Simulation de scan de produits',
      mealAiAnalysis: 'Analyse IA du repas',
      enterInformation: 'Entrez les informations',
    },
    images: {
      meal: 'Repas',
    },
    form: {
      mealName: {
        label: 'Nom du repas',
        placeholder: 'Ex: Salade César',
      },
      mealTime: {
        label: 'Moment du repas',
        placeholder: 'Sélectionner',
        options: {
          breakfast: 'Petit-déjeuner',
          lunch: 'Déjeuner',
          snack: 'Collation',
          dinner: 'Dîner',
        },
      },
    },
    nutrition: {
      title: 'Valeurs nutritionnelles (pour {{portion}}g)',
      fields: {
        carbs: 'Glucides (g)',
        calories: 'Calories',
      },
      carbsEvaluation: {
        title: 'Évaluation Glucides:',
        impact: 'Impact modéré sur la glycémie',
      },
    },
    buttons: {
      back: 'Retour',
      save: 'Enregistrer',
    },
    loading: {
      scannerInit: {
        main: 'Initialisation du scanner...',
        sub: 'Recherche dans la base de données',
      },
      aiAnalysis: {
        main: 'Analyse IA en cours...',
        sub: 'Identification des aliments',
      },
      processing: {
        main: 'Traitement...',
        sub: 'Veuillez patienter',
      },
    },
  },

  createReminderModal: {
    reminders: {
      types: {
        insulin: {
          label: 'Insuline',
          description: "Injection d'insuline",
        },
        medication: {
          label: 'Médicament',
          description: 'Prise de médicament',
        },
        glucose_test: {
          label: 'Test glycémie',
          description: 'Mesure de glycémie',
        },
        meal: {
          label: 'Repas',
          description: 'Rappel de repas',
        },
        activity: {
          label: 'Activité',
          description: 'Exercice physique',
        },
      },
    },
    days: {
      '1': { label: 'Lundi', short: 'Lun' },
      '2': { label: 'Mardi', short: 'Mar' },
      '3': { label: 'Mercredi', short: 'Mer' },
      '4': { label: 'Jeudi', short: 'Jeu' },
      '5': { label: 'Vendredi', short: 'Ven' },
      '6': { label: 'Samedi', short: 'Sam' },
      '7': { label: 'Dimanche', short: 'Dim' },
    },
    placeholders: {
      selectType: 'Select a type',
      reminderTitle: 'Ex: Humalog avant déjeuner',
    },
    form: {
      description: {
        label: 'Description (optionnelle)',
        placeholder: 'Informations supplémentaires...',
      },
      time: 'Heure',
      unit: 'Unité',
      units: {
        ui: 'UI',
        ml: 'mL',
        mg: 'mg',
        g: 'g',
        tablet: 'comprimé(s)',
        capsule: 'gélule(s)',
      },
      repeatDays: 'Jours de répétition',
      repeatOptions: {
        all: 'Tous les jours',
        weekdays: 'Lun-Ven',
        weekends: 'Week-end',
      },
    },
    buttons: {
      cancel: 'Annuler',
      create: 'Créer',
      edit: 'Modifier',
    },
    reminderType: 'Type de rappel',
    title: 'Titre',
    reminder: {
      new: 'Nouveau rappel',
      edit: 'Modifier le rappel',
    },
  },

  injectionInsulinModal: {
    toast: {
      error: 'Erreur',
      fillRequired: 'Veuillez remplir tous les champs obligatoires',
      injectionSaved: 'Injection enregistrée',
      injectionDescription: '{{insulinType}} {{dose}}UI injecté',
    },
    insulin: {
      newInjection: "Nouvelle Injection d'Insuline",
      types: {
        lantus: 'Lantus (insuline lente)',
        humalog: 'Humalog (rapide)',
        novolog: 'NovoLog (rapide)',
        levemir: 'Levemir (lente)',
        tresiba: 'Tresiba (ultra-lente)',
        other: 'Autre',
      },
      sites: {
        abdomen: 'Abdomen',
        thigh: 'Cuisse',
        arm: 'Bras',
        buttock: 'Fesse',
      },
      typeLabel: "Type d'insuline *",
      typePlaceholder: "Sélectionner le type d'insuline",
      injectionTimeLabel: "Heure d'injection",
      timeOptions: {
        now: 'Maintenant',
        custom: 'Heure personnalisée',
      },
    },
    form: {
      notes: {
        label: 'Notes (optional)',
        placeholder: 'Observations, site rotation, etc...',
      },
    },
    buttons: {
      cancel: 'Annuler',
      save: 'Enregistrer',
    },
  },

  medicationModal: {
    medication: {
      injectionDone: 'Injection effectuée',
      injectionSiteLabel: "Zone d'injection",
      timeLabel: "Heure d'administration",
      typeLabel: 'Type de médicament',
      typePlaceholder: 'Sélectionnez un médicament',
      logTitle: 'Enregistrer Prise Médicament',
      options: {
        lantus: 'Lantus (Insuline lente)',
        humalog: 'Humalog (Insuline rapide)',
        novorapid: 'NovoRapid (Insuline rapide)',
        metformine: 'Metformine',
        other: 'Autre médicament',
      },
      units: {
        ui: 'UI',
        mg: 'mg',
      },
      sites: {
        arm: 'Bras',
        thigh: 'Cuisse',
        abdomen: 'Ventre',
      },
    },
    toast: {
      error: 'Erreur',
      fillRequiredFields: 'Veuillez remplir tous les champs obligatoires',
      selectInjectionSite: "Veuillez sélectionner la zone d'injection",
      medicationSaved: 'Médicament enregistré',
      medicationSavedDescription:
        '{{medicationName}} ({{dose}}{{unit}}) ajouté au carnet',
    },
    buttons: {
      cancel: 'Annuler',
      confirm: 'Confirmer',
    },
  },

  photoAnalysisModal: {
    camera: {
      mealPhotoHeader: 'Photo du repas',
      takePhoto: 'Prendre une photo',
      chooseFromGallery: 'Choisir depuis la galerie',
    },
    toast: {
      photoCaptured: 'Photo capturée',
      photoCapturedDescription: 'Vous pouvez maintenant analyser cette image',
      error: 'Erreur',
      photoCaptureFailed: 'Impossible de prendre la photo',
      analysisComplete: 'Analyse terminée',
      analysisCompleteDescription: "L'IA a analysé votre repas avec succès",
      analysisFailed: "Impossible d'analyser l'image",
    },
    console: {
      photoCaptureError: 'Erreur lors de la prise de photo:',
      console: {
        analysisError: "Erreur lors de l'analyse:",
      },
    },
    ai: {
      analyzeFoodPrompt:
        'Analyse cette image de nourriture et estime:\n1. Le nom du plat/aliment principal\n2. La quantité approximative de glucides en grammes\n3. Une brève description de ce que tu vois\n\nRéponds au format JSON: {"name": "nom du plat", "carbs": nombre, "analysis": "description"}',
      mockResult: {
        name: 'Assiette de pâtes à la sauce tomate',
        carbs: 45,
        analysis:
          "Je vois une assiette de pâtes avec de la sauce tomate. La portion semble être d'environ 100g de pâtes cuites, ce qui représente approximativement 45g de glucides.",
      },
    },
    modal: {
      header: '📸 Analyse Photo + IA',
      instructions:
        "Prenez une photo de votre repas pour que l'IA estime automatiquement les glucides.",
      takePhoto: 'Prendre une photo',
      chooseFromGallery: 'Choisir depuis la galerie',
      change: 'Changer',
      analyzeAI: "🤖 Analyser avec l'IA",
      analyzing: 'Analyse en cours...',
      analysisResult: "Résultat de l'analyse IA:",
      dishIdentified: 'Plat identifié:',
      estimatedCarbs: 'Glucides estimés:',
      analysis: 'Analyse:',
      addToJournal: 'Ajouter au journal',
    },
  },

  photoUploadModal: {
    profilePhoto: {
      title: 'Photo de profil',
      description: 'Ajoutez ou modifiez votre photo de profil',
      choosePhoto: 'Choisir une photo',
      removePhoto: 'Supprimer la photo',
    },
    buttons: {
      cancel: 'Annuler',
      save: 'Enregistrer',
    },
  },

  scanMealModal: {
    toast: {
      productScanned: '✅ Produit scanné',
      productDetected: '{{productName}} détecté',
      mealSaved: '🍽️ Repas enregistré',
      mealSavedDescription: '{{food}} ({{carbs}}g glucides) ajouté au carnet',
      productScanned1: 'Produit scanné avec succès',
    },
    food: {
      petitEcolierBiscuits: 'Biscuits Lu Petit Écolier',
    },
    foods: {
      rice: 'Riz blanc cuit',
      bread: 'Pain de mie',
      pasta: 'Pâtes cuites',
      apple: 'Pomme',
      banana: 'Banane',
      plainYogurt: 'Yaourt nature',
    },
    mealTimes: {
      breakfast: 'Petit-déjeuner',
      lunch: 'Déjeuner',
      snack: 'Collation',
      dinner: 'Dîner',
    },
    dailyMealDialog: {
      title: '🍽️ Repas de la Journée',
      description: 'Suivez vos glucides facilement',
    },
    foodInfo: {
      industrialProducts: 'Produits industriels et emballés',
      exactNutrition: '• Infos nutritionnelles exactes',
    },
    searchFood: {
      title: '🔍 Rechercher un Aliment',
      subtitle: 'Base de données complète',
      note: '• Aliments frais et cuisinés',
    },
    manualAdd: {
      title: '✏️ Ajouter Manuellement',
      subtitle: 'Créez votre propre entrée',
      note: '• Recettes personnalisées',
    },
    activeOptions: {
      barcode: 'Scanner Code-Barres',
      search: 'Rechercher un Aliment',
      custom: 'Ajouter Manuellement',
    },
    meal: {
      mealTimeLabel: '⏰ Moment du repas',
      consumedPortion: '⚖️ Portion consommée',
    },
    scanner: {
      scanning: 'Scanner en cours...',
      positionBarcode: 'Positionnez le code-barres dans le cadre',
    },
    search: {
      label: '🔍 Rechercher un aliment',
      placeholder: 'Ex: pomme, riz, pain...',
    },
    popularFoods: {
      label: '💡 Aliments populaires',
    },
    manualFood: {
      nameLabel: "✏️ Nom de l'aliment",
      namePlaceholder: 'Ex: Gâteau de maman, salade de fruits...',
    },
    nutrition: {
      estimatedCarbs: 'Glucides estimés',
    },
    buttons: {
      cancel: 'Annuler',
      addToJournal: 'Ajouter au carnet',
    },
  },

  simpleActivityModal: {
    toast: {
      error: 'Erreur',
      fillAllFields: 'Veuillez remplir tous les champs',
      activitySaved: '{{activity}} pendant {{duration}} minutes',
    },
    activity: {
      header: '🏃 Activité Physique',
      typeLabel: "Type d'activité",
      typePlaceholder: 'Sélectionner une activité',
      options: {
        walking: 'Marche',
        running: 'Course',
        cycling: 'Vélo',
        swimming: 'Natation',
        strength: 'Musculation',
        other: 'Autre',
      },
      durationLabel: 'Durée (minutes)',
    },
    buttons: {
      cancel: 'Annuler',
      save: 'Enregistrer',
    },
  },

  simpleGlucoseModal: {
    toast: {
      errorTitle: 'Erreur',
      invalidGlucose: 'Veuillez entrer une valeur de glycémie valide',
      glucoseAdded: 'Votre glycémie a été enregistrée avec succès',
      glucoseAddedTitle: 'Mesure ajoutée',
    },
    glucose: {
      header: '📊 Nouvelle Mesure Glycémique',
      label: 'Glycémie (mg/dL)',
      notesPlaceholder: 'Commentaires...',
    },
    buttons: {
      cancel: 'Annuler',
      save: 'Enregistrer',
    },
  },

  simpleMealModal: {
    toast: {
      foodNameRequired: "Veuillez entrer un nom d'aliment",
      mealAdded: '{{foodName}} a été ajouté à votre journal',
      mealAddedTitle: 'Repas ajouté',
    },
    mealJournal: {
      header: '🍽️ Journal des Repas',
    },
    food: {
      label: "Nom de l'aliment",
      placeholder: 'Ex: Pomme, Riz, Salade...',
    },
    nutrition: {
      carbsLabel: 'Glucides (g) - optionnel',
      carbsPlaceholder: 'Ex: 25',
      cancel: 'Annuler',
      add: 'Ajouter',
    },
  },

  simpleMedicationModal: {
    toast: {
      errorTitle: 'Erreur',
      errorFillFields: 'Veuillez remplir tous les champs',
      medicationSavedTitle: 'Médicament enregistré',
      medicationSavedDesc: '{{medication}} - {{dose}} unités pris avec succès',
    },
    medication: {
      recordHeader: '💊 Enregistrer Prise Médicament',
      typeLabel: 'Type de médicament',
      placeholder: 'Sélectionner un médicament',
      options: {
        fastInsulin: 'Insuline rapide',
        slowInsulin: 'Insuline lente',
        metformin: 'Metformine',
        other: 'Autre',
      },
    },
    dose: {
      label: 'Dose (unités)',
      placeholder: 'Ex: 5',
    },
    buttons: {
      cancel: 'Annuler',
      confirm: 'Confirmer',
    },
  },

  weightModal: {
    weightModal: {
      invalidWeight: {
        title: 'Erreur',
        description: 'Veuillez entrer un poids valide (entre 1 et 300 kg)',
      },
      success: {
        title: 'Poids mis à jour',
        description: 'Votre poids a été enregistré : {{weight}} kg',
      },
      title: 'Poids corporel',
      description: 'Enregistrez votre poids actuel pour un suivi optimal',
      inputLabel: 'Poids (kg)',
      placeholder: 'Ex: 75.5',
      tip: '💡 Conseil : Pesez-vous toujours à la même heure, de préférence le matin à jeun pour des mesures cohérentes.',
      cancel: 'Annuler',
      save: 'Enregistrer',
    },
  },

  actionsRapides: {
    toast: {
      error: {
        title: 'Erreur',
        description: 'Veuillez entrer une valeur de glycémie valide',
      },
    },

    errorAddGlucose: 'Erreur ajout glycémie:',
    toastErrorTitle: 'Erreur',
    toastErrorDescription: "Impossible d'enregistrer votre mesure",
    toastFoodNameError: "Veuillez entrer un nom d'aliment",
    toastMealAddedTitle: 'Repas ajouté',
    toastMealAddedDescription: '{{foodName}} a été ajouté à votre journal',
    toastMealAddError: "Impossible d'ajouter le repas",
    toastFillAllFields: 'Veuillez remplir tous les champs',
    toastMedicationSavedTitle: 'Médicament enregistré',
    toastMedicationSavedDescription:
      '{{medication}} - {{dose}} unités pris avec succès',
    toastMedicationAddError: "Impossible d'ajouter le médicament",
    toastActivitySavedTitle: 'Activité enregistrée',
    toastActivitySavedDescription: '{{activity}} pendant {{duration}} minutes',
    toastActivityAddError: "Impossible d'ajouter l'activité",
    Actions: {
      button: 'Enregistrer',
    },
    loadingSave: 'Enregistrement...',
    Journal: {
      button: 'Ajouter un repas',
    },
    loadingAdd: 'Ajout...',
    Medication: {
      subtitle: '💊 Médicament',
      title2: 'Médicament',
      select: {
        title: 'Sélectionner un médicament',
        option: {
          one: 'Insuline ultra-rapide',
          two: 'Humalog',
          three: 'NovoRapid',
          four: 'Apidra',
          five: 'Fiasp',
          six: 'Insuline rapide',
          seven: 'Actrapid',
          eight: 'Humulin R',
          nine: 'Insuman Rapid',
          ten: 'Insuline intermédiaire',
          eleven: 'Insulatard',
          twelve: 'Humulin N',
          thirteen: 'Insuman Basal',
          fourteen: 'Insuline lente',
          fifteen: 'Lantus',
          sixteen: 'Levemir',
          seventeen: 'Toujeo',
          eighteen: 'Tresiba',
          nineteen: 'Abasaglar',
          twenty: 'Insuline mixte',
          twentyone: 'NovoMix',
          twentytwo: 'Humalog Mix',
          twentythree: 'Humulin Mix',
          twentyfour: 'Insuman Comb',
          twentyfive: 'Metformine',
          twentysix: 'Glucophage',
          twentyseven: 'Stagid',
          twentyeight: 'Gliclazide',
          twentynine: 'Diamicron',
          thirty: 'Victoza',
          thirtyone: 'Ozempic',
          thirtytwo: 'Trulicity',
          thirtythree: 'Januvia',
          thirtyfour: 'Forxiga',
          thirtyfive: 'Autre',
        },
      },
      dose: 'Dose',
      unit: 'unités',
      button: 'Enregistrer le médicament',
    },
    Food: {
      barcode: {
        title: 'Produit ajouté',
        description: '{{food}} - {{carbs}}g de glucides',
      },
      photo: {
        title: 'Analyse terminée',
        description: '{{food}} - {{carbs}}g de glucides estimés',
      },
    },
    mealModal: {
      title: '🍽 Journal des Repas',
      barcodeScan: 'Scanner code-barres',
      photoAI: 'Photo + IA',
      manualEntry: 'ou saisie manuelle',
      foodNameLabel: "Nom de l'aliment",
      foodNamePlaceholder: 'Ex: Pomme, Riz, Salade...',
      carbsLabel: 'Glucides (g) - optionnel',
      carbsPlaceholder: 'Ex: 25',
      addButton: 'Ajouter',
    },
  },

  adminTabs: {
    Applications: {
      status: {
        pending: 'En attente',
        approved: 'Approuvé',
        rejected: 'Rejeté',
      },
      fields: {
        first_name: 'Prénom',
        last_name: 'Nom',
        email: 'Email',
        professional_type: 'Type de professionnel',
        institution: 'Institution',
        license_number: 'Numéro de licence',
        country: 'Pays',
        city: 'Ville',
        created_at: 'Date de candidature',
        documents: 'Documents',
      },
      institutions: {
        hopital_principal: 'Hôpital Principal de Dakar',
        clinique_pasteur: 'Clinique Pasteur',
      },
      pendingTitle: 'Candidatures en Attente',
      pendingCount: 'en attente',
      none: 'Aucune candidature',
      noneDescription:
        'Les nouvelles candidatures de professionnels apparaîtront ici',
    },
    toast: {
      approved: {
        title: 'Candidature approuvée',
        description:
          'Le professionnel a été approuvé et peut maintenant utiliser Klukoo Pro.',
      },
      rejected: {
        title: 'Candidature rejetée',
        description: 'La candidature a été rejetée.',
      },
    },
    status: {
      pending: 'En attente',
      approved: 'Approuvé',
      rejected: 'Rejeté',
    },
    Dashboard: {
      tabs: {
        applications: 'Candidatures',
        consultations: 'Consultations',
        payments: 'Paiements',
        analytics: 'Analytiques',
      },
    },
    Consultations: {
      recent: 'Consultations Récentes',
    },
    Payments: {
      title: 'Gestion des Paiements',
      module: 'Module de Paiement',
      description: 'Gestion des paiements aux professionnels et commissions',
    },
    Analytics: {
      title: 'Analytiques',
      module: 'Tableau de Bord Analytique',
      description: 'Statistiques détaillées et rapports de performance',
    },
  },

  applicationCardFixes: {
    Document: {
      title: 'Document',
      description:
        'Visualisation de {{name}} - Fonctionnalité en développement',
      default: 'document',
    },
    Status: {
      approved: 'Approuvé',
      rejected: 'Rejeté',
      pending: 'En attente',
    },
    Application: {
      specialty: 'Spécialité',
      location: 'Localisation',
      institution: 'Institution',
      notSpecified: 'Non spécifiée',
      license: 'N° Licence',
      email: 'Email',
      date: 'Candidature du',
    },
    Actions: {
      reject: 'Rejeter',
      approve: 'Approuver',
    },
    Documents: {
      title: 'Documents soumis:',
      default: 'Document {{index}}',
      none: 'Aucun document uploadé',
    },
  },

  autoMessageCard: {
    Badge: {
      sent: 'Envoyé',
    },
    Reactions: {
      label: 'Réactions',
    },
    Metadata: {
      source: 'Source',
      manual: 'Manuel',
      automatic: 'Automatique',
      type: 'Type',
    },
    Actions: {
      resend: 'Renvoyer',
    },
  },

  badgeDisplay: {
    Badges: {
      earnedOn: 'Obtenu le',
    },
  },

  chatInterface: {
    Consultation: {
      title: 'Consultation avec {{name}}',
      startConversation: 'Commencez la conversation avec votre patient',
      suggestions: 'Suggestions de démarrage:',
      messages: {
        feel: "Bonjour, comment vous sentez-vous aujourd'hui ?",
        concerns: 'Avez-vous des préoccupations particulières ?',
        glycemia: 'Comment se passent vos glycémies récemment ?',
      },
    },
    Chat: {
      inputPlaceholder: 'Tapez votre message...',
    },
  },

  communityChallengeCard: {
    Status: {
      completed: 'Terminé',
      active: 'En cours',
      upcoming: 'À venir',
    },
    Challenge: {
      participants: '{{count}} participant',
      participants_plural: '{{count}} participants',
      goal: 'Objectif: {{value}} {{unit}}',
      endsIn: 'Se termine {{time}}',
      yourProgress: 'Votre progression',
      completed: 'Terminé',
      finished: 'Défi terminé !',
      reward: 'Récompense',
      join: 'Rejoindre le défi',
      finishedMessage:
        "Ce défi est terminé. Restez à l'écoute pour les prochains défis !",
    },
  },

  communityInsightDashboard: {
    Community: {
      insights: 'Insights Communautaires',
      anonymizedData:
        'Données anonymisées de la communauté - Mis à jour le {{date}}',
      avgTimeInTarget: 'Temps dans la cible moyen',
      globalCommunity: 'Communauté globale',
      mostActiveRegion: 'Région la plus active',
      moreCommunityEngagement: "Plus d'engagement communautaire",
      popularMealTimes: 'Horaires de repas populaires',
      commonChallenges: 'Défis communs',
      anonymizedDataNotice:
        'Les données sont anonymisées et agrégées pour protéger la confidentialité des utilisateurs',
    },
    Actions: {
      retry: 'Réessayer',
    },
  },

  consultationBilling: {
    History: {
      loadError: 'Erreur chargement historique :',
    },
    Payment: {
      requiredTitle: '💳 Paiement requis',
      processingDescription: '{{amount}} - Traitement du paiement en cours...',
      errorTitle: '❌ Erreur de paiement',
      errorDescription: 'Impossible de traiter le paiement de {{amount}}',
    },
    Consultation: {
      startedTitle: '✅ Consultation démarrée',
      paymentConfirmed:
        'Paiement de {{amount}} confirmé - Session {{sessionId}}',
      completedTitle: '✅ Consultation terminée',
      completedDescription: 'Paiement traité automatiquement',
      errorTitle: '❌ Erreur',
      errorDescription: 'Impossible de terminer la consultation',
      inProgress: 'Consultation en cours',
      session: 'Session',
      started: 'Démarré',
      amount: 'Montant',
      paymentStatus: 'Statut paiement',
      notesPlaceholder: 'Notes de consultation...',
      processing: '⏳ Traitement...',
      endButton: '🔚 Terminer consultation',
      newTitle: 'Nouvelle consultation - {{amount}}',
      fee: 'Tarif',
      feePerSession: '{{amount}} par consultation',
      payment: 'Paiement',
      paymentMethod: 'Automatique avant consultation',
      dareCommission: 'Commission Klukoo',
      commissionRate: '10% (50 FCFA)',
      patientCodePlaceholder: 'Code patient (ex: PAT001)',
      processingPayment: '⏳ Traitement paiement...',
      startButton: '💳 Démarrer consultation ({{amount}})',
      historyTitle: 'Historique des consultations',
      noHistory: 'Aucune consultation pour le moment',
      patient: 'Patient',
      date: 'Date',
      status: 'Statut',
      notes: 'Notes',
    },
    PaymentStatus: {
      paid: 'Payé',
      pending: 'En attente',
      failed: 'Échec',
    },
  },

  ConsultationCard: {
    years: 'ans',
    diabetesType: 'Diabète Type',
    requestedAgo: 'Demandé il y a {{time}}',
    consultation: 'Consultation',
    viewData: 'Voir données',
    accept: 'Accepter',
    reason: 'Motif',
  },

  consultationChat: {
    Chat: {
      errorTitle: 'Erreur de connexion',
      errorDescription: 'Impossible de se connecter au chat',
      initError: 'Erreur initialisation chat :',
      title: 'Chat de consultation',
      input: {
        placeholder: 'Tapez votre message...',
      },
    },
    messages: {
      initialPatientMessage:
        "Bonjour docteur, j'ai une question sur ma glycémie",
    },
    toast: {
      sentTitle: 'Message envoyé',
      sentDescription: 'Votre message a été envoyé avec succès',
    },
    Consultation: {
      start: {
        successTitle: 'Consultation démarrée',
        successDescription: 'La consultation est maintenant active',
        errorLog: 'Erreur démarrage consultation :',
        errorTitle: 'Erreur',
        errorDescription: 'Impossible de démarrer la consultation',
      },
      complete: {
        successTitle: 'Consultation terminée',
        successDescription: 'La consultation a été marquée comme terminée',
      },
      errorTitle: 'Erreur',
      errorDescription: 'Impossible de terminer la consultation',
      button: {
        start: 'Démarrer la consultation',
        end: 'Terminer',
      },
      status: {
        finished: 'Cette consultation est terminée',
      },
    },
    Connection: {
      status: {
        connected: 'Connecté',
        disconnected: 'Déconnecté',
      },
    },
  },

  countrySelector: {
    Settings: {
      countryCurrency: {
        title: 'Sélection du pays et devise',
        detecting: 'Détection de votre pays...',
        detected: 'Pays détecté',
        use: 'Utiliser',
        selectCountry: 'Choisissez votre pays :',
        selectPlaceholder: 'Sélectionner un pays...',
      },
    },
  },

  dataSharingSettings: {
    Settings: {
      sharePrefs: {
        successTitle: 'Préférences mises à jour',
        successDescription: 'Vos paramètres de partage ont été sauvegardés.',
        errorTitle: 'Erreur',
        errorDescription: 'Impossible de mettre à jour vos préférences.',
      },
      privacy: {
        title: 'Paramètres de confidentialité',
        anonymousData: {
          title: 'Partage de données anonymes',
          description:
            'Contribuez à améliorer la communauté en partageant vos données de manière anonyme',
        },
        shareStats: {
          title: 'Partager mes statistiques',
          description: 'Glycémie moyenne et temps dans la cible',
        },
        shareRegion: {
          title: 'Partager ma région',
          description: 'Région géographique pour les statistiques locales',
        },
        shareAge: {
          title: "Partager ma tranche d'âge",
          description: "Groupe d'âge pour les comparaisons démographiques",
        },
        shareDiabetesType: {
          title: 'Partager mon type de diabète',
          description: 'Type de diabète pour des insights spécialisés',
        },
        guarantee: {
          title: 'Confidentialité garantie',
          description:
            "Toutes les données partagées sont anonymisées et ne peuvent pas être liées à votre identité. Elles servent uniquement à améliorer l'expérience communautaire.",
        },
      },
    },
  },

  gamificationDashboard: {
    Profile: {
      reputation: {
        points: 'Points de réputation',
      },
      badges: {
        earned: 'Badges obtenus',
        progression: 'Progression des badges',
        description:
          'Débloquez de nouveaux badges en participant à la communauté',
        earned1: 'Badges obtenus ({{count}})',
        available: 'Badges à débloquer ({{count}})',
        locked: 'À débloquer',
        viewAll: 'Voir tous les badges (+{{remaining}})',
      },
      messages: {
        sent: 'Messages envoyés',
      },
      points: {
        title: 'Gagnez des points',
        description:
          'Participez à ces activités pour augmenter votre réputation',
        message: {
          title: 'Messages utiles',
          description: '+{{points}} points chacun',
          button: 'Écrire un message',
        },
        mentoring: {
          title: 'Mentoring',
          description: '+{{points}} points par personne',
          button: 'Devenir mentor',
        },
        challenges: {
          title: 'Défis',
          description: '+{{points}} points par participation',
          button: 'Rejoindre un défi',
        },
        dataSharing: {
          title: 'Partage de données',
          description: '+{{points}} points par partage',
          button: 'Partager des données',
        },
      },
    },
  },

  glucoseShareMessage: {
    Profile: {
      points: {
        glucoseSharing: {
          title: 'Partage Glycémie',
        },
      },
    },
  },

  groupCard: {
    Profile: {
      points: {
        glucoseSharing: {
          joinButton: 'Rejoindre',
        },
      },
    },
  },

  lazyImage: {
    common: {
      imageUnavailable: 'Image non disponible',
    },
  },

  liveSessions: {
    sessions: {
      qaWithDoctor: 'Q&A avec {{doctor}}',
      diabetesCookingWorkshop: 'Atelier Cuisine Diabète',
      meditationStressManagement: 'Méditation & Gestion Stress',
      todayAt: "Aujourd'hui {{time}}",
      tomorrowAt: 'Demain {{time}}',
      onDayAt: '{{day}} {{time}}',
      duration: '{{duration}}',
    },
  },

  mealPhotoMessage: {
    meal: {
      diabetesFriendly: 'Repas diabète-friendly',
      sharedMeal: 'Repas partagé',
      estimatedCarbs: 'Glucides estimés',
    },
  },

  messageBubble: {
    meal: {
      carbs: 'glucides',
    },
    metrics: {
      Glucose: 'Glycémie',
      Insulin: 'Insuline',
      period: 'Période',
    },
  },

  nativeHeaderFixes: {
    notifications: {
      inDevelopment: 'Notifications - Fonctionnalité en développement',
    },
    settings: {
      inDevelopment: 'Paramètres - Fonctionnalité en développement',
    },
  },

  networkStatus: {
    network: {
      online: 'Connexion rétablie',
      offline: 'Pas de connexion internet - Mode hors ligne activé',
    },
  },

  networkStatusIndicator: {
    networkStatus: {
      verySlow: 'Réseau très lent',
      slow: 'Réseau lent',
      moderate: 'Réseau modéré',
      fast: 'Bon réseau',
      unknown: 'Réseau inconnu',
    },
    badges: {
      saveData: '💾 Économie données',
      optimizedMode: 'Mode optimisé activé',
    },
  },

  patientAccessHistory: {
    professionalType: {
      endocrinologist: 'Endocrinologue',
      generalPractitioner: 'Médecin généraliste',
      nutritionist: 'Nutritionniste',
      unknown: 'Inconnu',
    },
    actions: {
      consultation: 'Consultation',
      view: 'Consulté',
      viewData: 'Consultation données',
      download: 'Téléchargement',
      exportData: 'Export données',
      access: 'Accès',
      downloadFullReport: '📄 Télécharger Rapport Complet',
    },
    data: {
      glucose: 'Glycémie',
      medications: 'Médicaments',
      overview: 'Aperçu',
      meals: 'Repas',
      activities: 'Activités',
    },
    errors: {
      loadingHistory: "Erreur lors du chargement de l'historique",
      loadingError: 'Erreur de Chargement',
    },
    time: {
      agoMinutes: 'Il y a {{count}} min',
      agoHours: 'Il y a {{count}}h',
      yesterday: 'Hier',
      agoDays: 'Il y a {{count}} jours',
    },
    report: {
      generatingTitle: '📄 Génération du rapport',
      generatingDesc: "Préparation du rapport d'accès en cours...",
      successTitle: '✅ Rapport généré',
      successDesc: "Le rapport d'accès a été téléchargé avec succès",
      errorTitle: '❌ Erreur',
      errorDesc: 'Impossible de générer le rapport',
    },
    history: {
      loadingError: 'Erreur de Chargement',
      accessTitle: "🔍 Historique d'Accès à mes Données",
      accessSubtitle: 'Tous les accès à vos données sont tracés et sécurisés',
      noRecentAccess: 'Aucun accès récent à vos données',
      suspect: '⚠️ Suspect',
      code: 'Code',
      sectionsAccessed: 'Sections consultées',
    },
  },

  patientAccessInterface: {
    injection: {
      doseUnits: '{{count}} unités',
    },
    meal: {
      totalCarbs: '{{count}}g glucides',
    },
  },

  patientDataPanel: {
    patient: {
      infoTitle: 'Informations Patient',
      age: 'Âge',
      years: 'ans',
      type: 'Type',
      diabetesType: 'Diabète Type {{type}}',
      diagnosis: 'Diagnostic',
      targetBelow: 'objectif <',
      recentGlucose: 'Glycémies Récentes',
      treatment: 'Traitement',
      alerts: 'Alertes',
    },
    actions: {
      viewFullGraphs: 'Voir graphiques complets',
      consultationHistory: 'Historique consultations',
      adjustInsulinDoses: 'Ajuster doses insuline',
    },
  },

  patientDataTabs: {
    tabs: {
      overview: "📊 Vue d'ensemble",
      glucose: '🩸 Glycémies',
      medications: '💊 Médicaments',
      meals: '🍽️ Nutrition',
      activities: '🏃 Activités',
      history: '📋 Historique',
    },
    access: {
      sectionNotAccessibleTitle: 'Section non accessible',
      sectionNotAccessibleDesc:
        "Vous n'avez pas l'autorisation d'accéder aux données de {{section}}.",
    },
    medications: {
      metformin: 'Metformine',
      lantus: 'Lantus',
      humalog: 'Humalog',
      current: 'Médications Actuelles',
    },
    alerts: {
      hba1cAboveTarget: 'HbA1c > objectif',
      threeHypoglycemiasWeek: '3 hypoglycémies cette semaine',
      followUpAppointment: 'Rendez-vous de suivi prévu',
      title: 'Alertes Actives',
      count: 'alertes',
    },
    glycemicControl: {
      title: 'Contrôle Glycémique',
      currentHbA1c: 'HbA1c actuelle',
      target: 'Objectif',
      timeInRange: 'Temps dans cible',
    },
    treatment: {
      title: 'Traitement',
      activeMedications: 'médicaments actifs',
    },
    latestMeasures: {
      title: 'Dernières Mesures',
      current: 'Actuelle',
      sevenDayAvg: 'Moyenne 7j',
      variability: 'Variabilité',
    },
    activity: {
      title: 'Activité',
      today: "Aujourd'hui",
      thisWeek: 'Cette semaine',
      target: 'Objectif',
      progress: "{{percent}}% de l'objectif",
    },
    nutrition: {
      title: 'Nutrition',
      carbsToday: "Glucides aujourd'hui",
      mealsLogged: 'Repas enregistrés',
      avgGI: 'IG moyen',
      giModerate: 'Modéré',
      todayMeals: "Repas et Nutrition - Aujourd'hui",
      carbs: 'g glucides',
      dailySummary: 'Bilan journalier',
      totalCarbs: 'Glucides totaux',
      totalCalories: 'Calories totales',
      avgGlycemicIndex: 'Index glycémique moyen',
      gi: {
        low: 'Faible',
        moderate: 'Modéré',
        high: 'Élevé',
      },
    },
    charts: {
      sevenDayGlucose: 'Glycémies des 7 derniers jours',
      patientGlucoseGraph: 'Graphique glycémies patient',
      last7DaysData: 'Données des 7 derniers jours',
    },
    glucose: {
      context: {
        fasting: 'Jeûne',
        postMeal: 'Post-repas',
        snack: 'Collation',
        afterDinner: 'Après dîner',
      },
      trend: {
        stable: 'Stable',
        up: 'En hausse',
        down: 'En baisse',
      },
    },
    glycemia: {
      todayData: "Données Glycémiques - Aujourd'hui",
      last: 'Dernière',
      level: {
        high: 'Élevé',
        low: 'Bas',
        normal: 'Normal',
      },
    },
    medication: {
      frequency: {
        twiceDaily: '2x/jour',
        onceDaily: '1x/jour',
        beforeMeal: 'Avant repas',
      },
      time: {
        morningEvening: 'Matin/Soir',
        evening: 'Soir',
        variable: 'Variable',
      },
    },
    meals: {
      breakfast: 'Petit-déjeuner',
      lunch: 'Déjeuner',
      dinner: 'Dîner',
    },
    activities: {
      walk: 'Marche',
      cycling: 'Vélo',
      intensity: {
        low: 'Faible',
        moderate: 'Modérée',
        high: 'Élevée',
      },
      todayActivities: "Activités Physiques - Aujourd'hui",
      minutes: 'minutes',
      summary: 'Résumé',
      totalTime: 'Temps total',
      caloriesBurned: 'Calories brûlées',
      weeklyGoal: 'Objectif hebdo',
    },
    consultations: {
      historyTitle: 'Historique des Consultations',
      consultation: 'Consultation',
      teleconsultation: 'Téléconsultation',
      notes: {
        adjustInsulin: 'Ajustement insuline',
        glycemiaFollowUp: 'Suivi glycémies',
        quarterlyCheck: 'Contrôle trimestriel',
      },
    },
  },

  patientManagement: {
    patientCodeModal: {
      title: 'Code patient requis',
      description:
        'Veuillez saisir le code patient pour accéder aux informations sécurisées',
      enterCodeFor:
        'Veuillez saisir le code patient pour accéder aux informations de {{patientName}}',
      placeholder: 'Code patient (ex: ABC123)',
      cancel: 'Annuler',
      access: 'Accéder',
    },
    patientFile: {
      title: 'Dossier Patient - {{patientName}}',
      description: 'Consultation complète du dossier médical',
      name: 'Nom du patient',
      diabetesType: 'Type de diabète',
      lastGlucose: 'Dernière glycémie',
      status: 'Statut',
      medicalNotes: 'Notes médicales',
      lastConsultation: 'Dernière consultation',
      nextAppointment: 'Prochain rendez-vous',
      close: 'Fermer',
    },
    messageModal: {
      title: 'Envoyer un message à {{patientName}}',
      description: 'Messagerie sécurisée patient-professionnel',
      subject: 'Sujet',
      subjectPlaceholder: 'Objet du message',
      content: 'Message',
      contentPlaceholder: 'Tapez votre message ici...',
      cancel: 'Annuler',
      send: 'Envoyer',
    },
    teleconsultation: {
      title: 'Téléconsultation avec {{patientName}}',
      description: 'Interface de consultation vidéo sécurisée',
      interfaceTitle: 'Interface vidéo',
      interfaceSubtitle: 'La consultation vidéo apparaîtrait ici',
      patientLabel: 'Patient',
      durationLabel: 'Durée prévue',
      durationValue: '{{minutes}} minutes',
      notesLabel: 'Notes de consultation',
      notesPlaceholder: 'Notez les points importants de la consultation...',
      close: 'Fermer',
      audioOnly: 'Audio uniquement',
      startVideo: 'Démarrer la vidéo',
    },
    call: {
      title: 'Appeler {{patientName}}',
      description: "Interface d'appel téléphonique",
      ready: 'Prêt à composer le numéro',
      notesLabel: "Notes d'appel",
      notesPlaceholder: "Notez l'objet de l'appel...",
      cancel: 'Annuler',
      dial: 'Composer',
    },
    editProfile: {
      title: 'Modifier le profil - {{patientName}}',
      description: 'Édition des informations du patient',
      name: 'Nom du patient',
      diabetesType: 'Type de diabète',
      status: 'Statut',
      statusOptions: {
        stable: 'Stable',
        attention: 'Attention',
        improving: 'Amélioration',
      },
      lastGlucose: 'Dernière glycémie',
      notes: 'Notes médicales',
      nextAppointment: 'Prochain rendez-vous',
      cancel: 'Annuler',
      save: 'Enregistrer les modifications',
    },
  },

  paymentRow: {
    payment: {
      successTitle: 'Paiement traité',
      successDescription: 'Paiement de {{amount}} F CFA traité pour {{doctor}}',
      errorTitle: 'Erreur',
      errorDescription: 'Impossible de traiter le paiement',
      pay: 'Payer',
      receipt: 'Reçu',
    },
    status: {
      paid: 'Payé',
      processing: 'En cours',
      pending: 'En attente',
    },
  },

  predictiveAlerts: {
    aiAnalysis: {
      inProgress: 'Analyse IA en cours...',
      patternDetection: 'Détection des patterns glycémiques',
    },
    notifications: {
      markAllRead: 'Tout marquer lu',
    },
    alerts: {
      prediction: 'Prédiction',
      inApproxMinutes: '(dans ~{{minutes}} min)',
    },
    recommendations: {
      actions: 'Actions recommandées',
    },
    predictive: {
      confidence: 'Confiance',
      label: 'IA Prédictive',
    },
  },

  professionalConsultationDashboard: {
    professionalDashboard: {
      consultations: {
        title: 'Consultations',
        status: {
          scheduled: 'Programmée',
          confirmed: 'Confirmée',
          in_progress: 'En cours',
          completed: 'Terminée',
          cancelled: 'Annulée',
          no_show: 'Absent',
        },
      },
    },
    consultation: {
      back_to_list: 'Retour aux consultations',
      number: 'Consultation #{{id}}',
      none_found: 'Aucune consultation trouvée',
      none_found_description:
        'Les consultations apparaîtront ici une fois créées',
      duration: 'Durée',
      minutes: 'minutes',
      start: 'Démarrer',
      resume: 'Reprendre',
    },
  },

  professionalCredentials: {
    qrcode: {
      error_title: 'Erreur QR Code',
      error_description: 'Impossible de générer le QR Code',
    },
    certificate: {
      title: 'Klukoo - Certificat Professionnel',
      institution: 'Institution',
      license: 'Licence',
      approved_at: "Date d'approbation",
      validity: 'Validité',
      validity_period: "1 an à partir de la date d'émission",
      platform: 'Plateforme',
      not_specified: 'Non spécifiée',
      approval_statement:
        "Ce certificat atteste de l'approbation du professionnel sur la plateforme Klukoo.",
      verification_contact:
        'Pour toute vérification, contactez support@Klukoo-health.com',
      download_success_title: '✅ Certificat téléchargé',
      download_success_description:
        'Le certificat professionnel a été téléchargé avec succès',
      download_error_title: '❌ Erreur téléchargement',
      download_error_description: 'Impossible de générer le certificat',
    },
    email: {
      sent_title: '✅ Email envoyé',
      sent_description: 'Les identifiants ont été envoyés à {{email}}',
      error_title: '❌ Erreur envoi',
      error_description: "Impossible d'envoyer l'email",
      console_error: 'Erreur envoi email :',
    },
    approval: {
      congratulations: 'Félicitations Dr. {{name}} !',
      message:
        'Votre candidature a été approuvée. Voici vos identifiants Klukoo Pro.',
    },
    identification: {
      title: "🔑 Votre Code d'Identification",
    },
    professional: {
      type: 'Type',
      country: 'Pays',
      validity: 'Validité',
      validity_period: '{{years}} an',
      institution: 'Institution',
    },
    actions: {
      generating: 'Génération...',
      download_certificate: 'Télécharger Certificat',
      sending: 'Envoi...',
      send_by_email: 'Envoyer par Email',
    },
    instructions: {
      title: "Instructions d'utilisation",
      use_code: 'Utilisez ce code pour vous identifier sur Klukoo Pro',
      request_patient_code:
        'Demandez le code patient pour accéder à ses données',
      consultation_fee:
        'Chaque consultation est rémunérée 500 F CFA automatiquement',
      keep_code_safe: 'Conservez ce code de manière sécurisée',
      qr_verification:
        'Le QR Code permet une vérification rapide de votre identité',
    },
  },

  professionalDashboardNew: {
    dashboard: {
      error_title: 'Erreur',
      error_description: 'Impossible de charger les données du tableau de bord',
      totalPatients: 'Patients suivis',
      today: "Aujourd'hui",
      monthlyEarnings: 'Revenus mois',
      averageRating: 'Note moyenne',
      recentRequests: 'Demandes récentes',
      consultationRequests: 'Demandes de consultation',
      manageConsultationRequests:
        'Gérez les demandes de consultation des patients',
      patient: 'Patient',
      patientMessage: 'Message du patient',
      viewData: 'Voir données',
      complete: 'Terminer',
      noRequests: 'Aucune demande de consultation',
    },
    requests: {
      accepted_title: 'Demande acceptée',
      accepted_description: 'Le patient a été notifié de votre acceptation',
      error_title: 'Erreur',
      error_description: "Impossible d'accepter la demande",
      request_rejected_title: 'Demande refusée',
      request_rejected_description: 'Le patient a été notifié de votre refus',
      refusal_error_title: 'Erreur',
      refusal_error_description:
        'Impossible de refuser la demande : {{message}}',
      accept: {
        title: 'Accepter la demande de consultation',
        description: 'Vous pouvez ajouter un message pour le patient',
        messageLabel: 'Message (optionnel)',
        messagePlaceholder: 'Je suis disponible pour votre consultation...',
      },
      reject: {
        title: 'Refuser la demande de consultation',
        description: 'Veuillez indiquer la raison du refus',
        messageLabel: 'Raison du refus *',
        messagePlaceholder: 'Malheureusement, je ne suis pas disponible car...',
      },
    },
    consultation: {
      notes_saved_title: 'Notes sauvegardées',
      notes_saved_description:
        'Les notes de consultation ont été ajoutées au dossier patient',
      notes_error_title: 'Erreur',
      notes_error_description:
        'Impossible de sauvegarder les notes : {{message}}',
      notes: {
        title: 'Notes de consultation',
        description:
          'Ajoutez vos notes qui seront sauvegardées dans le dossier patient',
        notesLabel: 'Notes de consultation *',
        notesPlaceholder:
          'Observations, diagnostic, discussions avec le patient...',
        recommendationsLabel: 'Recommandations',
        recommendationsPlaceholder:
          'Conseils, modifications de traitement, suivi...',
        nextAppointmentLabel: 'Prochain rendez-vous',
      },
    },
    status: {
      pending: 'En attente',
      accepted: 'Acceptée',
      rejected: 'Refusée',
      completed: 'Terminée',
      verified: 'Vérifié',
    },
    reason: {
      routine_checkup: 'Contrôle de routine',
      urgent_consultation: 'Consultation urgente',
      glucose_management: 'Gestion glycémie',
      medication_adjustment: 'Ajustement traitement',
      diet_counseling: 'Conseil nutritionnel',
      psychological_support: 'Soutien psychologique',
      complications: 'Complications diabète',
      follow_up: 'Suivi post-consultation',
    },
    professional_account: {
      not_approved: "Votre compte professionnel n'a pas encore été approuvé.",
    },
    notifications: {
      pendingRequests: 'Vous avez {{count}} demande en attente',
      pendingRequests_plural: 'Vous avez {{count}} demandes en attente',
    },
    tabs: {
      dashboard: 'Tableau de bord',
      requests: 'Demandes ({{count}})',
      requests_plural: 'Demandes ({{count}})',
      patients: 'Mes patients',
      earnings: 'Revenus',
    },
    patients: {
      title: 'Mes patients',
      description: 'Historique des patients consultés',
      placeholder: 'Liste des patients en développement',
    },
    earnings: {
      title: 'Revenus détaillés',
      description: 'Suivi de vos gains et paiements',
      monthly: 'Ce mois',
      pending: 'En attente',
      yearly: 'Total année',
    },
    common: {
      cancel: 'Annuler',
      accept: 'Accepter',
      reject: 'Refuser',
      save: 'Sauvegarder',
      close: 'Fermer',
    },
    patientData: {
      title: 'Données patient',
      description: 'Accès aux données de santé du patient (sauf Klukoo Chat)',
      glycemic: {
        title: 'Données glycémiques',
        description:
          'Accès complet aux relevés de glycémie, tendances et analyses',
        button: 'Voir les données',
      },
      medicalProfile: {
        title: 'Profil médical',
        description: 'Informations médicales, traitements et antécédents',
        button: 'Voir le profil',
      },
      nutrition: {
        title: 'Alimentation',
        description: 'Journal alimentaire et analyse nutritionnelle',
        button: "Voir l'alimentation",
      },
      activity: {
        title: 'Activité physique',
        description: "Suivi d'activité et impact sur la glycémie",
        button: "Voir l'activité",
      },
      restrictedAccess: {
        title: 'Accès restreint',
        description:
          "L'interface Klukoo Chat n'est pas accessible aux professionnels pour préserver la confidentialité des échanges personnels du patient.",
      },
    },
  },

  professionalNotificationCenter: {
    consultationReasons: {
      routine_checkup: 'Contrôle de routine',
      urgent_consultation: 'Consultation urgente',
      glucose_management: 'Gestion glycémie',
      medication_adjustment: 'Ajustement traitement',
      diet_counseling: 'Conseil nutritionnel',
      psychological_support: 'Soutien psychologique',
      complications: 'Complications diabète',
      follow_up: 'Suivi post-consultation',
    },
    consultation: {
      response: {
        acceptedTitle: 'Consultation acceptée',
        rejectedTitle: 'Consultation refusée',
        acceptedDescription: 'Le patient peut maintenant démarrer le chat',
        rejectedDescription: 'Le patient a été notifié de votre réponse',
        errorLog: 'Erreur réponse:',
        errorTitle: 'Erreur',
        errorDescription: 'Impossible de traiter la réponse',
      },
    },
    professionalNotification: {
      title_consultationRequests: 'Demandes de consultation',
      newRequests_one: '{{count}} nouvelle demande',
      newRequests_other: '{{count}} nouvelles demandes',
      message_noRequests: 'Il n y a aucune demande de consultation disponible.',
    },
    consultationStatus: {
      pending: 'En attente',
      accepted: 'Acceptée',
      rejected: 'Refusée',
    },
    consultationActions: {
      accept: 'Accepter',
      reschedule: 'Reporter',
      startChat: 'Démarrer le chat',
    },
    consultationDetails: {
      reason: 'Motif',
      fee: 'Tarif',
      message: 'Message',
    },
    consultationResponse: {
      acceptTitle: 'Accepter la consultation',
      rescheduleTitle: 'Reporter la consultation',
      proposedDate: 'Date proposée',
      proposedTime: 'Heure proposée',
      message: 'Message',
      optional: '(optionnel)',
      forPatient: 'pour le patient',
      confirmationPlaceholder: 'Message de confirmation...',
      reschedulePlaceholder:
        'Expliquez pourquoi vous reportez et proposez une nouvelle date...',
      accept: 'Accepter',
      reschedule: 'Reporter',
    },
    common: {
      cancel: 'Annuler',
      processing: 'Traitement...',
    },
  },

  progressMessage: {
    celebration: {
      title: 'Célébration',
      achievements: {
        first_consultation: 'Première consultation',
        milestone_reached: 'Étape atteinte',
      },
      descriptions: {
        first_consultation:
          'Vous avez terminé votre première consultation avec succès !',
        milestone_reached:
          'Félicitations pour avoir atteint cette étape importante.',
      },
    },
  },

  quickActions: {
    actions: {
      scheduleConsultation: {
        title: 'Consultation programmée',
        description: 'La consultation a été ajoutée au planning',
      },
      generateReport: {
        title: 'Rapport généré',
        description: 'Le rapport a été généré avec succès',
      },
      addPatient: {
        title: 'Patient ajouté',
        description: 'Le nouveau patient a été ajouté à votre liste',
      },
    },
  },

  quickActionsGrid: {
    quickActions: {
      glucose: 'Ajouter Glycémie',
      meal: 'Journal des repas',
      medication: 'Médicaments',
      activity: 'Activité',
      reminders: 'Rappels',
      title: 'Actions Rapides',
    },
  },

  reputationCard: {
    communityReputation: {
      title: 'Réputation communautaire',
      description: 'Votre contribution à la communauté Klukoo',
      progressTowards: 'Progression vers {{nextLevel}}',
      pointsToNext: 'Plus que {{points}} points pour le niveau suivant',
      levels: {
        beginner: 'Débutant',
        active: 'Actif',
        contributor: 'Contributeur',
        expert: 'Expert',
        legend: 'Légende',
      },
      stats: {
        helpfulMessages: 'Messages utiles',
        positiveReactions: 'Réactions positives',
        dataShares: 'Partages de données',
        mentoredUsers: 'Personnes mentorées',
      },
    },
    badges: {
      title: 'Badges obtenus ({{count}})',
      engagement: 'Engagement',
      expertise: 'Expertise',
      invite: 'Participez à la communauté pour gagner vos premiers badges !',
    },
  },

  revenueDistribution: {
    title: 'Distribution des Revenus',
    description:
      'Système automatique basé sur vos forfaits Premium (8€) et Famille (10€)',
    refresh: 'Actualiser',
    plan: 'Forfait {{planName}}',
    autoDistribution: 'Répartition automatique pour {{amount}} par abonnement',
    professionals: 'Professionnels',
    appMaintenance: 'App & Maintenance',
    paymentPlatform: 'Plateforme paiement',
    netProfit: 'Bénéfices nets',
    reinvestment: 'Réinvestissement',
    toast: {
      errorTitle: 'Erreur',
      configLoadError: 'Impossible de charger la configuration de distribution',
      loadError: 'Impossible de charger {{item}}',
      monthlyDistribution: 'la distribution mensuelle',
    },
    specialities: {
      endocrinologist: 'Endocrinologue',
      general_practitioner: 'Médecin Généraliste',
    },
    status: {
      pending: 'En attente',
      approved: 'Approuvé',
      paid: 'Payé',
      distributed: 'Distribué',
    },
    distribution: {
      approved: {
        title: 'Distribution approuvée',
        description: 'La distribution des revenus a été approuvée avec succès',
      },
      error: 'Impossible de traiter la distribution',
    },
    error: {
      title: 'Erreur',
    },
    distributionCards: {
      totalRevenue: 'Revenus Total',
      subscriptions: '{{count}} abonnements',
      professionals: 'Professionnels',
      toRedistribute: 'À redistribuer',
      netProfit: 'Bénéfices Nets',
      fixedShare: 'Votre part fixe: {{amount}} F CFA',
      reinvesment: 'Réinvestissement',
      marketingDevelopment: 'Marketing & développement',
      title: 'Distribution de {{month}}',
      description: 'Statut actuel de la distribution mensuelle automatique',
      appFees: 'Frais App & Maintenance',
      platformFees: 'Frais Plateforme Paiement',
      progress: 'Progression',
      distributionStatus: 'Distribution',
      toProfessionals: 'aux professionnels',
      approveDistribution: 'Approuver la Distribution',
    },
    earningsCard: {
      title: 'Gains par Professionnel',
      description: 'Détail des paiements aux professionnels de santé',
      professional: 'Professionnel',
      speciality: 'Spécialité',
      consultations: 'Consultations',
      patients: 'Patients',
      grossAmount: 'Montant Brut',
      platformFee: 'Commission',
      netAmount: 'Net à Payer',
      status: 'Statut',
    },
    actions: {
      exportPDF: 'Exporter PDF',
      reportExcel: 'Rapport Excel',
      sendEmail: 'Envoyer par Email',
      history: 'Historique',
    },
  },

  roleProgressCard: {
    memberStatus: {
      title: 'Statut de membre',
    },
    userStats: {
      sentMessages: 'Messages envoyés',
      receivedReactions: 'Réactions reçues',
      activeDays: 'Jours actifs',
      warnings: 'Avertissements',
      nextLevelProgress: 'Progression vers le niveau suivant',
    },
    status: {
      validated: 'Validé',
    },
    roleManagement: {
      title: 'Gestion des rôles',
      verifiedMember: 'Membre Vérifié',
      expert: 'Expert',
      moderator: 'Modérateur',
      demote: 'Rétrograder',
    },
    userProgress: {
      maxLevelNotice:
        'Vous avez atteint le niveau maximum disponible ou votre progression nécessite une validation manuelle.',
    },
  },

  simplifiedPredictiveAlerts: {
    riskLevel: {
      veryHigh: 'Très Élevé',
      high: 'Élevé',
      moderate: 'Modéré',
      low: 'Faible',
    },
    advancedAI: {
      title: 'Analyse IA Avancée...',
      subtitle: 'Machine Learning • Prédiction Multi-facteurs',
      glycemicPatternAnalysis: 'Analyse des patterns glycémiques',
    },
    multiFactorAI: {
      title: 'IA Prédictive Multi-facteurs',
      features: 'Glycémie • Repas • Insuline • Âge • Activités',
      analyze: 'Analyser',
      dismissAll: 'Tout lire',
      alerts: 'Alertes IA',
      critical: 'Critiques',
      high: 'Urgentes',
      medium: 'À surveiller',
      age: 'Âge',
      type: 'Type',
      ratio: 'Ratio G/I',
      target: 'Cible',
    },
    emergencyCard: {
      title: 'SOS Famille',
      subtitle: "Alerte d'urgence immédiate",
      alertFamily: 'Alerter Famille',
    },
    familyCard: {
      title: 'Famille Notifiée ({{count}})',
      lastNotification: 'Dernière notification : {{time}}',
      noNotifications: "Aucune notification pour l'instant",
    },
    iaCard: {
      title: '🤖 Analyse IA Complète',
      description: 'Aucun risque prévisible détecté pour le moment.',
      patternsOk: 'Patterns OK',
      stablePredictions: 'Prédictions Stables',
      familyNotified: 'Famille Informée',
    },
    alert: {
      riskLevel: 'Niveau de risque:',
      confidence: 'Confiance IA:',
      iaPrediction: '🤖 Prédiction IA :',
      inApprox: 'dans ~{{minutes}} min',
    },
    ai: {
      recommendedActions: "Actions recommandées par l'IA",
      version: 'IA {{version}}',
    },
    badge: {
      familyNotified: 'Famille Notifiée',
    },
    predictiveSystem: {
      active: 'Système IA Prédictif Actif',
      description:
        'Surveillance continue • Notifications famille en temps réel • Machine Learning',
      nextAnalysisLabel: 'Prochaine analyse',
      nextAnalysisTime: 'dans {{time}}',
    },
  },

  SOSButton: {
    emergency: {
      sosButton: "🆘 Besoin d'aide urgente",
      dialogTitle: "Demande d'aide d'urgence",
      dialogDescription:
        "Ceci enverra une notification prioritaire aux experts en ligne. Si c'est une urgence médicale immédiate, appelez le 15 (SAMU).",
      contactNumbers: "Numéros d'urgence",
      samu: 'SAMU',
      sosDoctors: 'SOS Médecins',
      poisonCenter: 'Centre antipoison',
      messageLabel: 'Décrivez brièvement votre situation (optionnel)',
      messagePlaceholder:
        'Ex: Hypoglycémie sévère, besoin de conseil urgent...',
      onlineExperts: 'Experts disponibles',
      expertCount:
        '{{count}} expert(s) en ligne · Temps de réponse moyen: < 5 min',
      cancel: 'Annuler',
      sending: 'Envoi...',
      sendRequest: "Envoyer la demande d'urgence",
    },
  },

  supportDashboard: {
    error: {
      retry: 'Réessayer',
    },
    communitySupport: {
      title: 'Support Communautaire',
      description: 'Entraide, sessions de groupe et défis communautaires',
      refresh: 'Actualiser',
    },
    emergencySupport: {
      title: "Support d'Urgence",
      description:
        "Besoin d'aide immédiate ? Nos experts sont là pour vous aider 24h/7j",
      warning: "Cliquez seulement en cas de besoin réel d'assistance",
      availableExperts: 'Experts disponibles',
      averageResponse: 'Temps de réponse moyen: < 5 minutes',
    },
    communityTabs: {
      sessions: 'Sessions',
      challenges: 'Défis',
      buddies: 'Binômes',
      experts: 'Experts',
    },
    community: {
      sessions: {
        title: 'Sessions de Support',
        description:
          'Rejoignez nos sessions thématiques animées par des experts',
        noSessions: 'Aucune session programmée pour le moment',
      },
      challenges: {
        title: 'Défis Communautaires',
        description:
          'Participez aux défis et gagnez des badges de reconnaissance',
        noChallenges: 'Aucun défi disponible pour le moment',
      },
    },
    peerSupport: {
      title: 'Système de Binômes',
      description: 'Trouvez un mentor ou accompagnez un nouveau membre',
      mentorship: 'Relation de mentorat',
      active: 'Actif',
      startedOn: 'Commencé le {{date}}',
      noPairs: "Vous n'avez pas encore de binôme assigné",
      becomeMentor: 'Devenir mentor',
      findMentor: 'Trouver un mentor',
    },
    expertsOnline: {
      title: 'Experts en Ligne',
      description: 'Nos experts diabète disponibles pour vous aider',
      available: 'Expert disponible',
      specialties: 'Spécialités',
      responseTime: 'Temps de réponse',
      minutes: 'min',
      totalResponses: 'réponses données',
      noneAvailable: 'Aucun expert disponible en ce moment',
    },
  },

  supportSessionCard: {
    sessionType: {
      group: 'Séance de groupe',
      mentoring: 'Mentorat',
      emergency: "Support d'urgence",
      challenge: 'Groupe défi',
    },
    userStatus: {
      registered: 'Inscrit',
    },
    session: {
      moderatedBy: 'Animé par {{name}}',
      recurring: 'Séance récurrente · {{pattern}}',
      past: 'Séance passée',
      leave: 'Se désinscrire',
      join: 'Rejoindre',
      full: 'Complet',
      enter: 'Rejoindre',
      full_waitlist:
        "Cette session est complète. Vous pouvez vous inscrire sur liste d'attente.",
    },
  },

  thematicGroups: {
    groups: {
      newcomers: {
        name: '🌱 Nouveaux Diabétiques',
        description: 'Support pour débuter',
      },
      parents: {
        name: "👨‍👩‍👧‍👦 Parents d'Enfants Diabétiques",
        description: 'Conseils parentaux',
      },
      nutrition: {
        name: '🍽️ Nutrition Africaine',
        description: 'Cuisine locale adaptée',
      },
      active: { name: '🏃 Diabète & Sport', description: 'Activité physique' },
    },
    community: {
      groupsTitle: 'Groupes Thématiques',
    },
  },

  userRoleBadge: {
    roles: {
      member: 'Membre',
      verified_member: 'Vérifié',
      expert: 'Expert',
      moderator: 'Modérateur',
    },
  },

  virtualizedList: {
    virtualizedList: {
      empty: 'Aucun élément à afficher',
      loading: 'Chargement...',
    },
  },

  authFixes: {
    error: 'Erreur',
    plan_selection: {
      failed: 'Impossible de traiter la sélection du plan',
    },
    test_mode: {
      enabled_title: '🧪 Mode Test Activé',
      enabled_description: 'Accès famille autorisé en mode test',
    },
    demo_mode: {
      enabled_title: '🚀 Mode Demo Activé',
      enabled_description: "Redirection vers l'interface professionnelle",
    },
    logout: {
      success: {
        title: 'Déconnexion réussie',
        description: 'Vous êtes maintenant déconnecté',
      },
      error: {
        title: 'Erreur',
        description: 'Impossible de se déconnecter',
        catch_description: 'Erreur lors de la déconnexion',
      },
      button: 'Se déconnecter',
      loading: 'Déconnexion...',
    },
    auth: {
      codeProvidedByPatient: 'Code fourni par le patient',
      testModeHint: "🧪 En mode test, n'importe quel code fonctionne",
      connecting: 'Connexion',
      familyAccess: 'Accès Famille',
    },
  },

  index: {
    loading: {
      charts: 'Chargement des graphiques...',
      blog: 'Chargement du blog...',
      journal: 'Chargement du journal...',
      family: 'Chargement famille...',
      chat: 'Chargement du chat...',
      consultation: 'Chargement consultation...',
      alerts: 'Chargement alertes...',
    },
  },

  notFound: {
    links: {
      dashboard: 'Tableau de bord',
      glucoseTracking: 'Suivi glycémie',
      medicationReminders: 'Rappels médicaments',
    },
    errors: {
      pageNotFound: 'Page introuvable',
      pageNotFoundDescription:
        "La page que vous recherchez n'existe pas ou a été déplacée.",
    },
    buttons: {
      back: 'Retour',
      home: 'Accueil',
    },
    footer: {
      tagline: '💪 DARE - Votre compagnon diabète',
    },
  },

  editProfileModalChanges: {
    common: {
      saving: 'Enregistrement...',
      saveChanges: 'Enregistrer les modifications',
    },
  },

  app: {
    status: {
      offline: '📡 Mode hors ligne - Certaines fonctionnalités sont limitées',
    },
  },

  insulinDosage: {
    title: "Dosage d'insuline",
    mealGuidance: {
      breakfast: {
        range1:
          "Traitez d'abord l'hypoglycémie. Une fois corrigée, administrez cette dose.",
        range5: 'Vérifiez les cétones',
      },
      lunch: {
        range1:
          "Traitez d'abord l'hypoglycémie. Une fois corrigée, administrez cette dose.",
        range5: 'Vérifiez les cétones',
      },
      supper: {
        range1:
          "Traitez d'abord l'hypoglycémie. Une fois corrigée, administrez cette dose.",
        range5: 'Vérifiez les cétones',
      },
    },
    glucoseRanges: {
      mgdl: {
        range1: '70 ou moins',
        range2: '72 - 144',
        range3: '145 - 216',
        range4: '217 - 306',
        range5: '307 ou plus',
        snackBreakfast: '72 ou plus',
        snackLunch: '72 ou plus',
        snackSupper: '108 ou plus',
      },
      mmol: {
        range1: '3,9 ou moins',
        range2: '4,0 - 8,0',
        range3: '8,1 - 12,0',
        range4: '12,1 - 17,0',
        range5: '17,1 ou plus',
        snackBreakfast: '4,0 ou plus',
        snackLunch: '4,0 ou plus',
        snackSupper: '6,0 ou plus',
      },
    },
    share: {
      title: "FEUILLE DE DOSE D'INSULINE",
      patient: 'Patient',
      patientFallback: 'Patient',
      date: 'Date',
      units: 'Unités',
      unitsLabel: 'unités',
      breakfast: 'PETIT DÉJEUNER',
      lunch: 'DÉJEUNER',
      supper: 'DÎNER',
      bedtime: 'COUCHER',
      basalInsulin: 'Insuline basale',
      snack: 'Collation',
      notSet: 'Non défini',
      healthcareProvider: 'PROFESSIONNEL DE SANTÉ',
      doctor: 'Médecin',
      notSpecified: 'Non spécifié',
      doctorNotes: 'NOTES DU MÉDECIN',
      recommendations: 'Recommandations',
      specialInstructions: 'Instructions spéciales',
      nextAppointment: 'Prochain rendez-vous',
      generatedFrom: 'Généré par le système de gestion du diabète',
      copySuccess:
        "✅ Feuille de dose d'insuline copiée dans le presse-papiers !\n\nVous pouvez maintenant la coller dans :\n• Email à votre médecin\n• Message WhatsApp/SMS\n• Application ou portail médical",
    },
    slidingScale: {
      insulinText: "Échelle mobile pour l'insuline à action rapide",
      penColour: 'couleur du stylo',
      typePlaceholder: 'type',
      colorPlaceholder: 'couleur',
    },
    insulinTable: {
      bloodSugar: 'Glycémie',
      units: 'Unités',
      specialNotes: 'Notes spéciales',
      unitsPlaceholder: 'unités',
      specialNotesPlaceholder: 'Ajouter des instructions spéciales...',
    },
    snackSection: {
      title: 'Collation',
      fixedDoseText: "Dose fixe d'insuline à action rapide claire",
      penColour: 'couleur du stylo _______',
      bloodSugar: 'Glycémie',
      units: 'Unités',
      unitsPlaceholder: 'unités',
    },
    insulinSheet: {
      title: "Feuille de dose d'insuline",
      rapidActing: 'Insuline à action rapide',
      patientName: 'Nom du patient',
      patientNamePlaceholder: 'Entrez le nom du patient',
      glucoseUnits: 'Unités de glycémie :',
      switchUnits: 'Cliquez pour changer les unités',
      measurements: 'Pour les mesures de glycémie en {{unit}}',
    },
    meals: {
      breakfast: 'Petit-déjeuner',
      lunch: 'Déjeuner',
      supper: 'Dîner',
      bedtime: 'Au coucher',
    },
    insulin: {
      fixedDoseClear: "Dose fixe d'insuline basale claire",
      penColour: 'couleur du stylo',
    },
    placeholders: {
      type: 'type',
      color: 'couleur',
      units: 'unités',
    },
    units: {
      label: 'Unités',
    },
    notes: {
      doctorsNotes: 'Notes et recommandations du médecin',
      patientCondition: 'État actuel du patient, observations générales...',
      generalNotes: 'Notes générales',
      bloodGlucosePatterns:
        "Profils de glycémie, taux d'HbA1c, symptômes observés...",
      clinicalObservations: 'Observations cliniques',
      emergencyContact: "Instructions de contact d'urgence",
      emergencyContactPlaceholder:
        "Quand appeler les services d'urgence, coordonnées du médecin...",
      treatmentRecommendations: 'Recommandations de traitement',
      treatmentRecommendationsPlaceholder:
        "Recommandations alimentaires, directives d'exercice, ajustements de médication...",
      specialInstructions: 'Instructions spéciales',
      specialInstructionsPlaceholder:
        'Gestion des jours de maladie, instructions de voyage, situations particulières...',
      followUpAppointment: 'Prochain rendez-vous de suivi',
    },
    quickReference: {
      title: 'Directives de référence rapide',
      hypoTitle: "Signes d'hypoglycémie",
      hypoSigns:
        'Transpiration, tremblements, confusion, rythme cardiaque rapide',
      hyperTitle: "Signes d'hyperglycémie",
      hyperSigns: 'Soif excessive, mictions fréquentes, fatigue',
      ketoneTitle: 'Test des cétones',
      ketoneInstruction: 'Testez lorsque la glycémie > 250 mg/dL (13,9 mmol/L)',
    },
    caregiverTraining: {
      message:
        "Les parents/soignants ont reçu une formation pour ajuster l'insuline. Ils sont qualifiés pour modifier les doses d'insuline en fonction des besoins du patient.",
    },
    doctorSection: {
      healthProfessional: 'Professionnel de santé',
      nameInPrint: 'Nom en lettres majuscules',
      signature: 'Signature',
      dateFormat: 'Date JJ/MM/AAAA',
      doctor: 'Médecin',
      enterName: 'Entrez le nom',
      keepSheetAccessible:
        'Gardez cette fiche accessible en tout temps - Référence médicale uniquement',
      printSheet: 'Imprimer la fiche',
      saveData: 'Enregistrer les données',
      shareWithDoctor: 'Partager avec le médecin',
    },
    shareInfo: {
      title: 'Partager avec le médecin :',
      description:
        "Copie vos doses d'insuline et vos notes dans le presse-papiers, puis collez-les dans un e-mail, WhatsApp ou message texte à votre professionnel de santé.",
    },
    dashboard: {
      title: 'Système de gestion du diabète',
      subtitle:
        "Surveillance de la glycémie en temps réel avec prédictions basées sur l'IA",
      tabs: {
        monitoring: 'Surveillance',
        dosage: "Feuille de doses d'insuline",
      },
    },
    patient: {
      manualInput: 'Saisie manuelle du patient',
      currentGlucose: 'Glycémie actuelle (mg/dL)',
      insulinUnits: 'Insuline (unités)',
      carbsGrams: 'Glucides (grammes)',
      activityMinutes: 'Activité (minutes)',
      addReadingGeneratePrediction:
        'Ajouter une lecture et générer une prédiction',
    },
    alerts: {
      title: "Paramètres d'alerte",
      lowThreshold: 'Seuil bas (mg/dL)',
      highThreshold: 'Seuil haut (mg/dL)',
    },
    aiPrediction: {
      title: 'Moteur de Prédiction IA',
      nextPrediction: 'Prédiction pour les 30 prochaines minutes :',
      basedOn:
        "Basé sur l'analyse des séries temporelles et des facteurs à base de règles",
    },
    doctorNotes: {
      recommendations: 'Recommandations de traitement',
      specialInstructions: 'Instructions spéciales',
      nextAppointment: 'Prochain rendez-vous :',
    },
    monitoring: {
      realTimeGlucose: 'Glycémie en temps réel',
      actualReadings: 'Lectures réelles',
      aiPredictions: 'Prédictions IA',
    },
    alertsSystem: {
      title: "Système d'alertes",
      noActiveAlerts: 'Aucune alerte active',
    },
    historicalDatabase: {
      title: 'Base de données historique',
      totalReadings: 'Lectures totales',
      dataPointsToday: "Points de données aujourd'hui",
    },
  },

  biomarkerTracker: {
    title: 'Suivi des biomarqueurs',
    bmi: {
      notSet: 'Non défini',
      underweight: 'Insuffisance pondérale',
      normal: 'Normal',
      overweight: 'Surpoids',
      obese: 'Obèse',
    },
    doctorNotes: {
      recommendations:
        'Continuez le traitement médicamenteux et le régime actuel.',
      specialInstructions: 'Surveillez la glycémie avant le coucher.',
    },
    alerts: {
      hypo: 'Le glucose est tombé en dessous de 70 mg/dL',
      hyper: 'Le glucose a dépassé 180 mg/dL',
    },
    hba1cTitle: 'HbA1c (Hémoglobine glyquée)',
    hba1cPlaceholder: '7,5',
    hba1cUnit: '%',
    hba1cTarget: 'Cible : <7 % pour la plupart des adultes',
    bloodPressureTitle: 'Pression artérielle',
    bloodPressureSystolicPlaceholder: '120',
    bloodPressureDiastolicPlaceholder: '80',
    bloodPressureUnit: 'mmHg',
    bloodPressureTarget: 'Cible : <130/80 mmHg',
    weightBmiTitle: 'Poids et IMC',
    weightPlaceholder: '70',
    weightUnit: 'kg',
    heightPlaceholder: '170',
    heightUnit: 'cm',
    bmiLabel: 'IMC',
    cholesterolProfileTitle: 'Profil lipidique',
    cholesterolPlaceholderTotal: 'Total',
    cholesterolPlaceholderHDL: 'HDL',
    cholesterolPlaceholderLDL: 'LDL',
    cholesterolPlaceholderTriglycerides: 'Triglycérides',
    cholesterolUnit: 'mg/dL',
    cholesterolTargets: 'Cibles : LDL <100, HDL >40♂/50♀, TG <150',
    kidneyFunctionTitle: 'Fonction rénale',
    creatininePlaceholder: '1,0',
    creatinineUnit: 'mg/dL',
    microalbuminPlaceholder: 'Microalbumine',
    microalbuminUnit: 'mg/g',
    screeningExamsTitle: 'Examens de dépistage',
    lastEyeExamLabel: 'Dernier examen des yeux',
    lastFootExamLabel: 'Dernier examen des pieds',
    screeningExamsNote: 'Examens annuels des yeux et des pieds recommandés',
    quickSummaryTitle: 'Résumé rapide',
    hba1cLabel: 'HbA1c',
    bpLabel: 'TA',
    ldlLabel: 'LDL',
    notSet: 'Non défini',
    aiPredictionEngineTitle: 'Moteur de Prédiction IA',
    nextPredictionLabel: 'Prédiction pour les 30 prochaines minutes :',
    predictionUnit: '{{value}} mg/dL',
    predictionNote:
      "Basé sur l'analyse des séries temporelles + facteurs basés sur des règles",
    doctorsRecommendations: 'Recommandations du médecin',
    treatmentRecommendations: 'Recommandations de traitement',
    specialInstructions: 'Instructions spéciales',
    nextAppointment: 'Prochain rendez-vous :',
    realTimeBloodGlucose: 'Glycémie en temps réel',
    glucoseLegend: {
      actualReadings: 'Mesures réelles',
      aiPredictions: 'Prédictions IA',
    },
    alertsSystem: {
      title: "Système d'alertes",
      noAlerts: 'Aucune alerte active',
      hypoAlert: 'Alerte hypoglycémie',
      hyperAlert: 'Alerte hyperglycémie',
      alertMessage: '{{message}}',
    },
    historicalDatabase: {
      title: 'Base de données historique',
      totalReadings: 'Lectures totales',
      dataPointsToday: "Points de données aujourd'hui",
    },
  },

  predictiveAlertScreenFixes: {
    predictiveAlert: {
      title: 'Alerte Prédictive !',
      risk: "Risque d'hypoglycémie (prob={{probability}}%)",
      forecast:
        'Prévision : la glycémie pourrait descendre à {{bg}} mg/dL dans {{minutes}} min',
      suggestion: 'Suggestion : Recontrôlez la glycémie dans {{minutes}} min',
    },
    currentBG: {
      label: 'Glycémie Actuelle',
      value: '{{value}} {{unit}}',
    },
    enterFood: {
      title: 'Entrer un aliment',
      food: {
        name: 'Riz',
        carbs: '{{amount}}g de glucides',
      },
      insulin: {
        name: 'Rapide',
        dose: '{{units}} unités',
      },
    },
    activityCard: {
      title: 'Activité',
      description: 'Oui Modéré 30 min',
    },
    predictiveAlerts: {
      title: 'Alertes IA Prédictives',
      status: 'Statut : {{state}}',
      forecast: 'Prévision à 30 min : {{trend}} ({{change}})',
    },
    nextForecast: {
      label: 'Prévision des 30 prochaines min : Stable (',
      change: '↓ 2 mg/dL',
    },
  },

  predictiveCard: {
    predictiveAlert: {
      title: 'Alerte Prédictive !',
      dismissAria: 'Fermer l’alerte',
      loading: 'Chargement...',
    },
    aiSummary: {
      error: 'Erreur lors de la récupération du résumé.',
    },
  },

  useReminders: {
    toast: {
      errorTitle: 'Erreur',
      remindersLoadError: 'Impossible de charger les rappels',
      reminderCreatedTitle: '✅ Rappel créé',
      reminderScheduled: '{{title}} a été programmé',
      reminderCreateError: 'Impossible de créer le rappel',
      reminderUpdatedTitle: '✅ Rappel mis à jour',
      reminderUpdatedDescription: 'Les modifications ont été sauvegardées',
      reminderUpdateErrorDescription: 'Impossible de modifier le rappel',
      reminderDeletedTitle: '🗑️ Rappel supprimé',
      reminderDeletedDescription: 'Le rappel a été supprimé',
      reminderDeleteErrorDescription: 'Impossible de supprimer le rappel',
      reminderActionTitle: '{{emoji}} Rappel {{status}}',
      reminderActionDescription: '{{notes, default=Action enregistrée}}',
      reminderActionErrorDescription: "Impossible d'enregistrer l'action",
      reminderStatus: {
        completed: 'complété',
        snoozed: 'reporté',
        missed: 'marqué manqué',
      },
    },
    typeMap: {
      insulin: {
        name: 'Insuline',
      },
      medication: {
        name: 'Médicament',
      },
      glucose_test: {
        name: 'Test glycémie',
      },
      meal: {
        name: 'Repas',
      },
      activity: {
        name: 'Activité',
      },
    },
  },

  paymentPlan: {
    patientPlan: {
      title: 'Klukoo Patient',
      subtitle: 'Forfait patient complet avec consultations',
      pricePerMonth: 'par mois',
      features: {
        allFeatures: 'Toutes les fonctionnalités',
        consultationsPerMonth: '10 consultations par mois',
        chat: 'Chat Klukoo',
        news: 'Actualités Klukoo',
        personalizedAlerts: 'Alertes personnalisées',
        glucoseTracking: 'Suivi glycémie',
      },
      cta: 'Sélectionné',
    },

    familyPlan: {
      title: 'Klukoo Famille',
      subtitle: 'Forfait famille avec partage de données',
      pricePerMonth: 'par mois',
      features: {
        allFeatures: 'Toutes les fonctionnalités',
        consultationsPerMonth: '10 consultations par mois',
        chat: 'Chat Klukoo',
        news: 'Actualités Klukoo',
        familySharing: 'Partage avec 3 membres de famille',
        familyAlerts: 'Alertes familiales',
        glucoseTracking: 'Suivi glycémie',
      },
      cta: 'Choisir ce plan',
    },
  },
};
