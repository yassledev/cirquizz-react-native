import {Text} from "native-base";

export default {
    carte: 'Carte',
    liste: 'Liste',
    filtre: 'Filtres',
    filtreDuree: 'Filtrer par temps',
    filtreLongueur: 'Filtrer par longeur',
    filtrePosition: 'Filtrer par rapport à la position',
    filtreDenivele: 'Filtrer par dénivelé',
    filtreNom: 'Filtrer par rapport au nom',
    valider: 'Valider',
    choiceTimeFilter: {
        short: 'Entre 30 minutes et 1 heure',
        medium: 'Entre 1 et 2 heures',
        long: 'Entre 2 heures et 4 heures'
    },
    choiceDenivFilter: {
        short: "Inférieur 100 mètres",
        medium: "De 100 à 500 mètres",
        long: "Plus de 500 mètres"
    },
    choiceLengthFilter: {
        short: "Entre 1 et 10 kilomètres",
        medium: "Entre 10 et 30 kilomètres",
        long: "Entre 30 et 100 kilomètres"
    },


    choiceNotesFilter: {
        short: "Entre 1 et 2 étoiles",
        medium: "Entre 2 et 3 étoiles",
        long: "Entre 3 et 5 étoiles"
    },


    longueurMin: "Longueur min : ",
    longueurMax: "Longueur max : ",


    rayonRecherche: "Rayon de recherche : ",
    nomDuCircuit: "Nom du circuit : ",

    nom: "Nom : ",

    reset: "Réinitialiser",

    distance: "Distance : ",
    duree: "Durée : ",
    denivele: "Dénivelé : ",
    loin: "Eloigné : ",
    pres: "Proche : ",

    BesoinGPS: "Activez votre GPS, vous en aurez besoin pour cette étape.",
    PseudoBoussoleIndic: "Pseudo boussole, suivez la flèche:",

    explicationDirection: 'Cet indicateur vous indique si la direction que vous prenez est plus ou moins bonne par rapport au point que vous voulez trouver. \n\n' +
        'Avancez un peu regardez ce que l\'indicateur vous renvoie\n\n' +
        '\t\t\t\tSi l\'indicateur est vert et affiche Très bon, cela veut dire que la direction que vous prenez est optimale. Continuez Ainsi !\n\n' +
        '\t\t\t\tSi l\'indicateur est vert et affiche Bon, cela veut dire que la direction que vous prenez vous rapproche du point mais n\'est pas optimale\n\n' +
        '\t\t\t\tSi l\'indicateur est bleu et affiche Neutre, cela veut dire que la direction que vous prenez ne vous éloigne pas, mais ne vous rapproche pas non plus\n\n' +
        '\t\t\t\tSi l\'indicateur est rouge et affiche Mauvais, vous êtes sur la mauvaise voie, vous vous éloignez. Essayez une autre direction.\n\n' +
        '\t\t\t\tSi l\'indicateur est rouge et affiche Tres Mauvais, Vous allez dans la direction opposée. Faites demi-tour !\n\n\n' +
        'lorem ipsum jzefhlkvezbkjvekcz,eljcpazenkvzelhgvmkenvizehvmkneouiezujve,zn jzvheozemjvnmkzebo zehkvnmvnmvznekvnmvnemovznemkvnzemvznemvknezemzhvepomnzemknzemnvskmnvzeihvzemnvzmvzeonhovmznzojzmvlnznzemze',
    TM: 'Très Mauvais',
    M: 'Mauvais',
    N: 'Neutre',
    B: 'Bon',
    TB: 'Très bon',
    indicBonneDir: 'Indicateur de bonne direction \n ',
    MD: 'Mauvaise Direction',
    BD: 'Bonne Direction',
    BonEndroit: 'J\'y suis',

    noDescr: 'Aucune description pour ce circuit',
    noStats: 'Aucune statistique personnelle pour ce circuit',
    noComment: 'Aucun commentaire pour ce circuit',
    commentaire: 'Commentaires',
    commentairesDe: 'Commentaire de : ',
    detail: 'Détail : ',
    statistiques : 'Statistiques : ',
    nbrPointUserCourse: 'Nombre de points par utilisateurs sur une course',
    tpsRealuserCourse : 'Temps réalisé pour chaque utilisateur sur une course en minutes',

    temps: 'Temps : ',
    score: 'Score : ',

    connect: 'Connexion',
    register: 'Inscription',
    deco: "Deconnexion",

    mustBeCoToPlay: 'Vous devez vous connecter ou créer un compter pour continuer à jouer',

    youAreNotCo: 'Vous n\'êtes pas connecté',

    missingInfoToPlay: 'Il n\'y a pas assez d\'informations pour jouer',


    whatDoYouWantToDo: 'Que voulez-vous faire aujourd\'hui ? ',
    reprendreCircuit: 'Reprendre ce ciquizz',
    trouverCircuit: 'Trouver des cirquizz',
    mesCicuits: 'Mes cirquizz',
    monCompte: 'Mon compte',


    downloadCircuit: 'Télécharger le circuit',
    willDownloadCircuit: 'Vous allez télécharger le circuit ',
    doYouWantContinue: 'Voulez-vous continuer ? ',
    downloadPending: 'Téléchargement en cours...',
    downloadEnded: 'Téléchargement terminé',
    infoCircuit: 'Informations du circuit',
    description: 'Description',
    circuitDejaComm: 'Ce circuit a déjà été commencé',
    circuitTelecharge: 'Circuit téléchargé',
    dontHaveCircuit: 'Téléchargez ce circuit pour pouvoir y jouer',
    connectToPlay: 'Se connecter pour commencer à jouer',
    startCircuit: 'Jouer',


    partieComm: 'Partie(s) déjà commencée(s)',
    partieNonDem: 'Partie(s) non démarrée(s)',

    password: 'Mot de passe',
    username: 'Nom d\'utilisateur',
    addMail: 'Adresse email',

    circuitsSecteur: 'Circuits dans le secteur ',

    leaveGame: 'Voulez-vous quitter la partie? Cela sauvegardera votre progression',

    dontHaveFavCircuit: 'Vous n\'avez pas de circuits favoris'
};