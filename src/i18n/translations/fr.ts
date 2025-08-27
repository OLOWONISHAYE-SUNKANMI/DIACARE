export const fr = {
  // App general
  appName: "DiabCare",
  appDescription: "",
  appSlogan: "La première plateforme de gestion et suivi du diabète en Afrique",
  
  // Navigation
  nav: {
    home: "Accueil",
    charts: "Données", 
    doses: "Doses",
    teleconsultation: "Télé",
    chat: "Chat",
    assistant: "Assistant",
    journal: "Carnet",
    blog: "Journal",
    family: "Famille",
    profile: "Profil",
    reminders: "Rappels"
  },

  // Journal Screen
  journal: {
    title: "Carnet",
    subtitle: "Suivi détaillé de vos glycémies et injections",
    glucose: "Glycémie",
    insulin: "Insuline",
    newEntry: "Nouvelle entrée",
    insulinReminder: "Rappel Insuline",
    filters: {
      today: "Aujourd'hui",
      week: "7 jours",
      month: "30 jours"
    },
    context: {
      beforeMeal: "Avant repas",
      afterMeal: "Après repas",
      fasting: "À jeun",
      bedtime: "Coucher"
    },
    status: {
      target: "Dans la cible",
      slightlyHigh: "Légèrement élevé",
      high: "Élevé",
      low: "Bas"
    },
    weeklyStats: {
      title: "Résumé hebdomadaire",
      inTarget: "Dans la cible",
      onTimeInjections: "Injections à temps",
      avgGlucose: "Moyenne glycémique"
    },
    advice: {
      title: "💡 Conseil DiabCare personnalisé",
      example: "Excellente adherence cette semaine ! Vos glycémies en fin d'après-midi sont légèrement élevées. Considérez ajuster votre collation de 15h ou anticiper votre injection de Humalog de 10 minutes."
    },
    injected: "Injecté à",
    missed: "Injection manquée"
  },

  // Charts Screen
  charts: {
    title: "Graphiques",
    subtitle: "Analyse de vos données glycémiques",
    glucoseAnalysis: "Analyse Glycémique",
    timeInRange: "Temps dans la Cible",
    weeklyTrends: "Tendances Hebdomadaires",
    last7Days: "7 derniers jours",
    zones: {
      veryHigh: "Élevé",
      high: "Limite",
      target: "Cible",
      low: "Bas"
    },
    stats: {
      average: "Moyenne",
      variability: "Variabilité",
      estimatedHbA1c: "HbA1c estimé",
      peakMax: "Pic Max"
    },
    objective: "Objectif : >70% dans la cible",
    percentageByDay: "Pourcentage de temps dans la cible par jour"
  },

  // Doses Screen
  doses: {
    title: "Doses",
    subtitle: "Gérez vos doses d'insuline",
    lantus: "Lantus (Basale)",
    humalog: "Humalog (Rapide)",
    active: "Actif",
    pending: "En attente",
    usualDose: "Dose habituelle",
    scheduledTime: "Heure programmée",
    lastInjection: "Dernière injection",
    markAsInjected: "Marquer comme injecté",
    currentGlucose: "Glycémie actuelle (mg/dL)",
    mealCarbs: "Glucides du repas",
    calculatedDose: "Dose Calculée",
    correction: "Correction",
    meal: "Repas",
    total: "Total",
    scheduleInjection: "Programmer injection",
    missedInjection: "Injection Manquée",
    ignore: "Ignorer",
    injectNow: "Injecter maintenant",
    history7Days: "Historique 7 jours",
    adherence: "observance",
    injectionMarked: "Injection marquée",
    injectionSuccess: "marqué comme injecté avec succès",
    injectionsPer: "Injections réalisées / programmées par jour"
  },

  // Reminders Screen
  reminders: {
    title: "Mes Rappels",
    subtitle: "Gérez vos rappels pour insuline, médicaments, tests et plus",
    newReminder: "Nouveau Rappel",
    upcomingReminders: "Rappels à venir (2h)",
    today: "Aujourd'hui",
    allReminders: "Tous les rappels",
    noReminders: "Aucun rappel configuré",
    noRemindersDesc: "Créez votre premier rappel pour ne jamais oublier vos traitements",
    createReminder: "Créer un rappel",
    dose: "Dose",
    soon: "Bientôt",
    done: "Fait",
    deleteConfirm: "Êtes-vous sûr de vouloir supprimer ce rappel ?",
    days: {
      everyday: "Tous les jours",
      weekdays: "Lun-Ven",
      monday: "Lun",
      tuesday: "Mar",
      wednesday: "Mer",
      thursday: "Jeu",
      friday: "Ven",
      saturday: "Sam",
      sunday: "Dim"
    }
  },

  // Blog/News Screen - COMPLETE
  blog: {
    title: "DiabCare News",
    subtitle: "Actualités et conseils sur le diabète",
    readMore: "Lire",
    readFull: "Lire l'article complet",
    author: "Auteur",
    source: "Source",
    publishedOn: "Publié le",
    saveArticle: "Sauvegarder l'article",
    search: "Rechercher...",
    all: "Tous",
    categories: {
      all: "Tous",
      research: "Recherches", 
      nutrition: "Nutrition",
      mental: "Mental",
      innovation: "Innovation",
      testimonials: "Témoignages",
      technology: "Technologie",
      lifestyle: "Mode de vie",
      treatment: "Traitement"
    },
    readingTime: "min",
    trending: "Tendance",
    internationalNews: "Actualités internationales sur le diabète",
    searchNews: "Rechercher des actualités...",
    by: "Par",
    saveArticleBtn: "Sauvegarder",
    fullSource: "Source complète",
    reliableSources: "Sources fiables",
    verifiedNews: "Toutes nos actualités sont vérifiées et proviennent de sources médicales reconnues internationalement"
  },

  // Activities
  activities: {
    walking: "Marche",
    running: "Course/Jogging", 
    cycling: "Vélo",
    dancing: "Danse",
    weightlifting: "Musculation",
    swimming: "Natation",
    soccer: "Football",
    basketball: "Basketball",
    selectActivity: "Sélectionnez une activité",
    intensity: {
      light: "Légère",
      moderate: "Modérée", 
      intense: "Intense"
    },
    duration: "Durée (minutes)",
    caloriesBurned: "Calories brûlées",
    addActivity: "Ajouter activité",
    activityRecorded: "Activité enregistrée"
  },

  // Glucose contexts
  glucoseContext: {
    fasting: "À jeun",
    beforeMeal: "Avant repas",
    afterMeal: "Après repas",
    bedtime: "Avant coucher",
    random: "Aléatoire",
    exercise: "Après exercice"
  },

  // Modals and forms
  modals: {
    selectValue: "Sélectionnez une valeur",
    enterValue: "Veuillez saisir une valeur de glycémie",
    time: "Heure",
    now: "Maintenant",
    custom: "Personnalisé",
    context: "Contexte",
    notes: "Notes (optionnel)",
    duration: "Durée",
    minutes: "minutes",
    scanProduct: "Scanner un Produit",
    productScanSimulation: "Simulation de scan de produits",
    takePhoto: "Prendre une Photo",
    aiMealAnalysis: "Analyse IA du repas",
    manualEntry: "Saisie Manuelle",
    enterInformation: "Entrez les informations",
    followCarbs: "Suivez vos glucides facilement"
  },
  
  // Authentication
  auth: {
    signIn: "Se connecter",
    signUp: "S'inscrire",
    signOut: "Se déconnecter",
    email: "Email",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    forgotPassword: "Mot de passe oublié ?",
    noAccount: "Pas de compte ?",
    hasAccount: "Déjà un compte ?",
    loading: "Chargement...",
    signInTitle: "Connexion",
    signUpTitle: "Inscription",
    description: "Accédez à votre compte DiabCare",
    appSlogan: "Diabète Africain & Ressources d'Excellence",
    patient: "Patient",
    professional: "Professionnel",
    family: "Famille",
    firstName: "Prénom",
    lastName: "Nom",
    professionalCode: "Code Professionnel",
    patientCode: "Code Patient",
    familyAccess: "Accéder à l'espace famille",
    professionalAccess: "Accéder à l'espace professionnel",
    codeProvidedByPatient: "Code fourni par le patient",
    professionalNotRegistered: "Pas encore inscrit ?",
    requestProfessionalAccess: "Demander un accès professionnel",
    needHelp: "Besoin d'aide ?",
    familyAccessGuide: "Guide d'accès famille",
    termsAcceptance: "En vous connectant, vous acceptez nos",
    termsOfUse: "Conditions d'utilisation",
    privacyPolicy: "Politique de confidentialité",
    and: "et notre",
    support: "Support",
    passwordMinLength: "Minimum 6 caractères",
    confirmPasswordPlaceholder: "Confirmez votre mot de passe",
    emailPlaceholder: "votre@email.com",
    professionalCodePlaceholder: "Code d'accès professionnel",
    patientCodePlaceholder: "Code d'accès du patient",
    connecting: "Connexion...",
    registering: "Inscription...",
    signInButton: "Connexion",
    signUpButton: "Inscription",
    // Error messages
    invalidCredentials: "Email ou mot de passe incorrect",
    emailNotConfirmed: "Veuillez confirmer votre email avant de vous connecter",
    userAlreadyExists: "Un compte existe déjà avec cette adresse email",
    passwordMismatch: "Les mots de passe ne correspondent pas",
    passwordTooShort: "Le mot de passe doit contenir au moins 6 caractères",
    invalidPatientCode: "Veuillez entrer un code patient valide",
    invalidOrExpiredCode: "Code patient invalide ou expiré",
    connectionError: "Une erreur est survenue lors de la connexion",
    registrationError: "Une erreur est survenue lors de l'inscription",
    // Success messages
    loginSuccess: "Connexion réussie !",
    welcomePatient: "Bienvenue dans votre espace patient.",
    registrationSuccess: "Inscription réussie !",
    choosePlan: "Choisissez votre forfait DiaCare",
    confirmEmail: "Vérifiez votre email pour confirmer votre compte.",
    familyAccessGranted: "Accès famille accordé !",
    welcomeFamily: "Bienvenue dans l'espace famille DiaCare.",
    professionalLoginSuccess: "Connexion professionnelle réussie !",
    welcomeProfessional: "Bienvenue dans votre espace professionnel."
  },

  // Home screen
  home: {
    welcome: "Bienvenue",
    latestGlucose: "Dernière glycémie",
    addGlucose: "Ajouter glycémie",
    quickActions: "Actions rapides",
    todayStats: "Statistiques du jour",
    medicationReminder: "Rappel médicament",
    upcomingAppointment: "Prochain rendez-vous"
  },

  // Glucose
  glucose: {
    level: "Niveau de glycémie",
    normal: "Normal",
    low: "Bas",
    high: "Élevé",
    addReading: "Ajouter une mesure",
    beforeMeal: "Avant repas",
    afterMeal: "Après repas",
    bedtime: "Coucher",
    morning: "Matin",
    comment: "Commentaire"
  },

  // Medications
  medication: {
    title: "Médicaments",
    addMedication: "Ajouter médicament",
    dosage: "Dosage",
    frequency: "Fréquence",
    time: "Heure",
    taken: "Pris",
    missed: "Manqué",
    insulin: "Insuline",
    metformin: "Metformine"
  },

  // Professional
  professional: {
    dashboard: "Tableau de bord professionnel",
    patients: "Patients",
    consultations: "Consultations",
    earnings: "Revenus",
    schedule: "Planning",
    startConsultation: "Démarrer consultation",
    endConsultation: "Terminer consultation",
    consultationNotes: "Notes de consultation",
    fee: "Honoraires",
    payment: "Paiement",
    pending: "En attente",
    completed: "Terminé",
    duration: "Durée",
    patientCode: "Code patient",
    patientInformation: "Informations Patient",
    stackTrace: "Stack trace"
  },

  // Chat and Community
  chat: {
    title: "Discussion communautaire",
    typeMessage: "Tapez votre message...",
    send: "Envoyer",
    glucoseShare: "Partage Glycémie",
    mealShare: "Repas diabète-friendly",
    progress: "Célébration",
    estimatedCarbs: "Glucides estimés"
  },

  // Common
  common: {
    save: "Enregistrer",
    cancel: "Annuler",
    delete: "Supprimer",
    edit: "Modifier",
    add: "Ajouter",
    close: "Fermer",
    confirm: "Confirmer",
    back: "Retour",
    next: "Suivant",
    previous: "Précédent",
    loading: "Chargement...",
    error: "Erreur",
    success: "Succès",
    warning: "Attention",
    info: "Information",
    today: "Aujourd'hui",
    yesterday: "Hier",
    thisWeek: "Cette semaine",
    thisMonth: "Ce mois",
    mg_dl: "mg/dL",
    mmol_l: "mmol/L",
    send: "Envoyer",
    sending: "Envoi en cours...",
    enable: "Activer",
    disable: "Désactiver"
  },

  // Notifications
  notifications: {
    medicationTime: "Il est temps de prendre votre médicament",
    glucoseReminder: "N'oubliez pas de mesurer votre glycémie",
    appointmentReminder: "Rendez-vous dans 1 heure",
    dataShared: "Données partagées avec succès",
    accessGranted: "Accès accordé au professionnel de santé",
    accessDenied: "Accès refusé au professionnel de santé"
  },

  // Home Screen
  homeScreen: {
    mission: "Mission DiabCare",
    darePackage: "Forfait DiabCare",
    completePlan: "DiabCare Complet",
    premium: "PREMIUM",
    monthlyPrice: "F CFA/mois",
    healthPriceless: "Votre santé n'a pas de prix",
    unlimitedLogbook: "Carnet glycémie illimité",
    smartReminders: "Rappels d'insuline intelligents",
    clarityCharts: "Graphiques style Clarity",
    advancedCalculator: "Calculateur doses avancé",
    familySupport: "Support familial",
    aiAssistant: "Assistant IA DiabCare",
    startTracking: "Commencer mon suivi DiabCare",
    freeTrial: "✨ Essai gratuit 7 jours",
    cancelAnytime: "Annulable à tout moment • Support inclus",
    lastReading: "Aujourd'hui 14:30",
    diabetes: "Diabetes",
    management: "Gestion",
    awareness: "Awareness",
    education: "Éducation",
    routine: "Routine",
    daily: "Quotidien",
    empowerment: "Empowerment",
    control: "Contrôle",
  },

  // Profile Screen
  profileScreen: {
    years: "ans",
    yearsWithDare: "Années avec DiabCare",
    glucoseMeasures: "Mesures glycémie",
    adherence: "Observance",
    personalInfo: "Informations Personnelles",
    fullName: "Nom complet",
    dateOfBirth: "Date de naissance",
    age: "Âge",
    phone: "Téléphone",
    city: "Ville",
    profession: "Profession",
    medicalTeam: "Équipe Médicale",
    doctor: "Médecin traitant • Diabétologue",
    followUpCenter: "Établissement de suivi",
    consultant: "Endocrinologue consultante",
    currentTreatment: "Traitement Actuel",
    insulins: "Insulines",
    keepCool: "Conservées au frais (canari en terre cuite)",
    oralMedications: "Médicaments oraux",
    price: "Prix",
    glucoseTarget: "Objectif glycémique",
    adaptedClimate: "Adapté au climat tropical",
    emergencyContact: "Contact d'Urgence",
    spouse: "Épouse",
    call: "Appeler",
    sms: "SMS",
    settings: "Paramètres",
    notifications: "Notifications",
    dataSharing: "Partage de données",
    darkMode: "Mode sombre",
    editProfile: "Modifier le profil",
    exportData: "Exporter les données",
    privacy: "Confidentialité",
    signOut: "Se déconnecter",
    verified: "✓ Profil Vérifié"
  },

  // Chat Screen
  chatScreen: {
    title: "DiabCare Chat",
    membersConnected: "membres connectés",
    successesThisWeek: "💚 142 succès cette semaine",
    inTargetZone: "🎯 89% dans la zone cible",
    newMembers: "👥 12 nouveaux membres",
    kindness: "💚 Bienveillance",
    mutualHelp: "🤝 Entraide",
    sharedMotivation: "🎯 Motivation commune",
    typingMessage: "Écrivez votre message de soutien...",
    typing: "en train d'écrire...",
    messageSent: "Message envoyé",
    messageShared: "Votre message a été partagé avec la communauté DiabCare"
  },

  // Professional Access
  professionalAccess: {
    title: "Demande d'Accès Professionnel",
    firstName: "Prénom",
    lastName: "Nom",
    email: "Email",
    phone: "Téléphone",
    profession: "Profession",
    selectProfession: "Sélectionnez votre profession",
    doctor: "Médecin",
    nurse: "Infirmier/ère",
    diabetologist: "Diabétologue",
    nutritionist: "Nutritionniste",
    pharmacist: "Pharmacien/ne",
    other: "Autre",
    licenseNumber: "Numéro de licence",
    institution: "Établissement",
    motivation: "Motivation",
    motivationPlaceholder: "Expliquez pourquoi vous souhaitez accéder à DiabCare...",
    requestSent: "Demande envoyée",
    requestSentDescription: "Votre demande d'accès professionnel a été envoyée avec succès",
    requestError: "Erreur lors de l'envoi de la demande"
  },

  // Onboarding
  onboarding: {
    step: "Étape",
    of: "sur",
    getStarted: "Commencer",
    languageSelection: {
      title: "Choisissez votre langue",
      description: "Sélectionnez votre langue préférée pour utiliser DiabCare"
    },
    welcome: {
      title: "Bienvenue dans DiabCare",
      subtitle: "La première plateforme africaine de gestion du diabète",
      description: "Nous sommes ravis de vous accompagner dans votre parcours de santé"
    },
    profile: {
      title: "Configurez votre profil",
      subtitle: "Aidez-nous à personnaliser votre expérience DiabCare",
      description: "Ces informations nous permettront de vous offrir un suivi adapté",
      namePlaceholder: "Entrez votre prénom",
      userType: "Je suis un(e)..."
    },
    privacy: {
      title: "Confidentialité et préférences",
      subtitle: "Contrôlez vos données et notifications",
      description: "Configurez vos préférences de confidentialité",
      notifications: "Notifications push",
      notificationsDesc: "Recevez des rappels pour vos médicaments et mesures",
      dataSharing: "Partage de données anonymes",
      dataSharingDesc: "Contribuez à la recherche sur le diabète (optionnel)",
      reminders: "Rappels intelligents",
      remindersDesc: "Rappels adaptatifs basés sur vos habitudes"
    },
    features: {
      title: "Découvrez DiabCare",
      subtitle: "Toutes les fonctionnalités pour gérer votre diabète",
      description: "Voici ce que DiabCare peut faire pour vous",
      glucose: "Suivi glycémique",
      reminders: "Rappels intelligents", 
      consultation: "Téléconsultations",
      community: "Communauté de soutien",
      tracking: "Suivi complet",
      trackingDesc: "Glycémie, médicaments, activités et plus",
      ai: "Assistant IA",
      aiDesc: "Conseils personnalisés basés sur vos données",
      telehealth: "Télémédecine",
      telehealthDesc: "Consultations avec des professionnels certifiés",
      support: "Communauté",
      supportDesc: "Échangez avec d'autres personnes diabétiques"
    },
    completion: {
      title: "Configuration terminée !",
      description: "Votre compte DiabCare est prêt à l'emploi"
    }
  },

  // Legal
  legal: {
    termsTitle: "Conditions d'Utilisation",
    termsDescription: "Veuillez lire attentivement nos conditions d'utilisation",
    privacyTitle: "Politique de Confidentialité",
    privacyDescription: "Découvrez comment nous protégeons vos données personnelles",
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
    `
  },

  // Admin sections
  admin: {
    notifications: "🔔 Notifications Admin",
    noNotifications: "Aucune notification",
    newActivities: "Les nouvelles activités apparaîtront ici",
    clearAll: "Tout effacer",
    applications: "Gestion des candidatures professionnelles",
    totalApplications: "Total candidatures",
    pending: "En attente",
    allStatuses: "Tous les statuts",
    approve: "Approuver",
    reject: "Rejeter",
    viewDetails: "Voir les détails",
    applicationSubmitted: "Candidature déposée",
    documents: "Documents",
    actions: "Actions",
    license: "Licence",
    city: "Ville",
    institution: "Institution",
    noDocuments: "Aucun document",
    notSpecified: "Non spécifiée"
  },

  // Form labels
  forms: {
    email: "Email",
    phone: "Téléphone",
    time: "Heure",
    now: "Maintenant",
    context: "Contexte de mesure",
    measurementTime: "Heure de mesure",
    title: "Titre du rappel",
    reminderType: "Type de rappel",
    mealName: "Nom du repas",
    mealTime: "Moment du repas",
    breakfast: "Petit-déjeuner",
    lunch: "Déjeuner",
    dinner: "Dîner",
    snack: "Collation",
    calories: "Calories",
    profilePhoto: "Photo de profil"
  },

  // Activities
  activityTypes: {
    walking: "Marche",
    running: "Course",
    cycling: "Vélo",
    swimming: "Natation",
    weightlifting: "Musculation",
    other: "Autre",
    light: "Légère",
    moderate: "Modérée",
    intense: "Intense",
    estimation: "Estimation"
  },

  // Medications
  medicationTypes: {
    rapidInsulin: "Insuline rapide",
    slowInsulin: "Insuline lente",
    metformin: "Metformine"
  },

  // Error messages
  errors: {
    error: "Erreur",
    cannotLoadPlans: "Impossible de charger les forfaits",
    codeNotFound: "Code manquant",
    genericError: "Une erreur s'est produite"
  }
};