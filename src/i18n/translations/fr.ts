export const fr = {
  // App general
  appName: 'Klukoo',
  appDescription: '',
  appSlogan: 'La première plateforme de gestion et suivi du diabète en Afrique',

  // Navigation
  nav: {
    home: 'Accueil',
    charts: 'Données',
    doses: 'Doses',
    teleconsultation: 'Télé',
    chat: 'Chat',
    assistant: 'Assistant',
    journal: 'Carnet',
    blog: 'Journal',
    family: 'Famille',
    profile: 'Profil',
    reminders: 'Rappels',
  },

  // Journal Screen
  journal: {
    title: 'Carnet',
    subtitle: 'Suivi détaillé de vos glycémies et injections',
    glucose: 'Glycémie',
    insulin: 'Insuline',
    newEntry: 'Nouvelle entrée',
    insulinReminder: 'Rappel Insuline',
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
      title: '💡 Conseil DiabCare personnalisé',
      example:
        "Excellente adherence cette semaine ! Vos glycémies en fin d'après-midi sont légèrement élevées. Considérez ajuster votre collation de 15h ou anticiper votre injection de Humalog de 10 minutes.",
    },
    injected: 'Injecté à',
    missed: 'Injection manquée',
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
    title: 'DiabCare News',
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
    description: 'Accédez à votre compte DiabCare',
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
    normal: 'Normal',
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
    mission: 'Mission DiabCare',
    darePackage: 'Forfait DiabCare',
    completePlan: 'DiabCare Complet',
    premium: 'PREMIUM',
    monthlyPrice: 'F CFA/mois',
    healthPriceless: "Votre santé n'a pas de prix",
    unlimitedLogbook: 'Carnet glycémie illimité',
    smartReminders: "Rappels d'insuline intelligents",
    clarityCharts: 'Graphiques style Clarity',
    advancedCalculator: 'Calculateur doses avancé',
    familySupport: 'Support familial',
    aiAssistant: 'Assistant IA DiabCare',
    startTracking: 'Commencer mon suivi DiabCare',
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
    yearsWithDare: 'Années avec DiabCare',
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
    currentTreatment: 'Traitement Actuel',
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
    title: 'DiabCare Chat',
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
    messageShared: 'Votre message a été partagé avec la communauté DiabCare',
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
      'Expliquez pourquoi vous souhaitez accéder à DiabCare...',
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
      description: 'Sélectionnez votre langue préférée pour utiliser DiabCare',
    },
    welcome: {
      title: 'Bienvenue dans DiabCare',
      subtitle: 'La première plateforme africaine de gestion du diabète',
      description:
        'Nous sommes ravis de vous accompagner dans votre parcours de santé',
    },
    profile: {
      title: 'Configurez votre profil',
      subtitle: 'Aidez-nous à personnaliser votre expérience DiabCare',
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
      title: 'Découvrez DiabCare',
      subtitle: 'Toutes les fonctionnalités pour gérer votre diabète',
      description: 'Voici ce que DiabCare peut faire pour vous',
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
      description: "Votre compte DiabCare est prêt à l'emploi",
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
      <p>En utilisant DiabCare (Diabète Africain & Ressources d'Excellence), vous acceptez les présentes conditions d'utilisation.</p>
      
      <h3>2. Description du Service</h3>
      <p>DiabCare est la première plateforme de gestion et suivi du diabète en Afrique, offrant :</p>
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
      <p>DiabCare fournit des outils d'aide à la gestion du diabète mais ne remplace pas un avis médical professionnel.</p>
      
      <h3>8. Résiliation</h3>
      <p>Vous pouvez supprimer votre compte à tout moment. Nous nous réservons le droit de suspendre des comptes en cas de violation.</p>
      
      <h3>9. Modifications</h3>
      <p>Nous nous réservons le droit de modifier ces conditions avec préavis.</p>
      
      <h3>10. Contact</h3>
      <p>Pour toute question : support@dare-africa.com</p>
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
      <p>Pour toute question sur vos données : dpo@dare-africa.com</p>
      
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
    urgent: 'Urgentes',
    monitor: 'À surveiller',
    good: 'Tout va bien !',
    message: 'Aucune alerte prédictive détectée pour le moment.',
  },

  analyze: {
    title: 'Analyse IA Continue',
    message:
      'Le système analyse vos données en continu pour détecter les patterns à risque',
  },

  mission: {
    title: 'La mission de DiabCare',
    message:
      'Notre mission est de vous aider à mieux comprendre et gérer votre diabète avec des outils adaptés à votre réalité.',
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
      button: 'Copier le code',
    },
    numOfPatients: {
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

  toastMessage: {
    title: 'Nouvelle entrée',
    description: 'Fonctionnalité disponible prochainement',
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
    title: 'Professionnel',
    study: 'Endocrinologie',
    mode: 'Mode Démo',
    logout: 'Déconnexion',
    stats: {
      title1: 'Patients suivis',
      title2: 'Consultations ce mois',
      title3: 'Rapports générés',
      title4: 'Temps moyen / consultation',
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
      "Une erreur inattendue s'est produite dans l'application DARE. Notre équipe technique a été informée automatiquement.",
    button_restart: 'Redémarrer',
    button_home: 'Accueil',
    footer_text: '💪 DARE - Osez vaincre le diabète ensemble',
  },

  onboardingFlow: {
    language_selected_title: 'Langue sélectionnée',
    language_selected_description: 'Français sélectionné avec succès',
    choose_language_title: 'Choisissez votre langue',
    choose_language_description:
      'Sélectionnez votre langue préférée pour continuer',
  },
};
