export type Locale = "en" | "fr";

export type HomePage = {
  hero: {
    nextMainEvent: {
      descriptionTitle: string;
      descriptionItems: string[];
    };
    parisP2P: {
      title: string;
    };
    hackathon: {
      title: string;
      subtitle: string;
      datetime: string;
      btn: {
        text: string;
        link: string;
      };
    };
  };
  buttons: {
    getTicket: {
      title: string;
      link: string;
    };
    joinHackathon: {
      title: string;
      link: string;
    };
  };
  donate: {
    title: string;
    description: string;
    buttonText: string;
  };
  coOrg: {
    title: string;
    buttonText: string;
  };
  speakers: {
    title: string;
    buttonText: string;
  };
  usefulInformation: {
    title: string;
    groundControl: {
      title: string;
      desc: string;
      buttonText: string;
    };
    support: {
      title: string;
      desc: string;
      buttonText: string;
    };
    news: {
      title: string;
      desc: string;
      buttonText: string;
      inputPlaceholder: string;
    };
  };
  plan: {
    title: string;
  };
  schedule: {
    title: string;
    filterTitle: string;
    kind: string;
    location: string;
  };
  upcomingEventCTA: {
    title: string;
    subtitle: string;
    btn_text: string;
  };
  gathering: {
    title: string;
    programFestival: string;
    hackathon: string;
    speakers: string;
  };
  previousEvents: {
    title: string;
    buttonTitle: string;
  };
  footer: {
    buy: {
      title: string;
      buttonText: string;
    };
  };
};

export type ManifestoPage = {
  title: string;
  content: {
    text: string[];
    type: "title" | "description";
  }[];
};

export type CommonTypes = {
  notFound: string;
  notFoundDesc: string;
  loadMore: string;
  showAll: string;
  header: {
    events: string;
    pastEvents: {
      title: string;
      desc: string;
    };
    speakers: {
      title: string;
      desc: string;
    };
    manifesto: string;
    addToCalendar: string;
  };
};

export type TalkPage = {
  title: string;
  showAll: string;
};

export type EventPage = {
  title: string;
  showAll: string;
};

export type SpeakerPage = {
  title: string;
  showAll: string;
  becomeSpeaker: string;
};
export type PageContent = {
  home: HomePage;
  manifesto: ManifestoPage;
  talk: TalkPage;
  event: EventPage;
  speaker: SpeakerPage;
  common: CommonTypes;
};

export const defaultPagesContent: {
  home: {
    fr: HomePage;
    en: HomePage;
  };
  manifesto: { fr: ManifestoPage; en: ManifestoPage };
  talk: { fr: TalkPage; en: TalkPage };
  event: { fr: EventPage; en: EventPage };
  speaker: { fr: SpeakerPage; en: SpeakerPage };
  common: { fr: CommonTypes; en: CommonTypes };
} = {
  home: {
    fr: {
      hero: {
        nextMainEvent: {
          descriptionTitle: "Gratuit pour tous",
          descriptionItems: [
            "/conférences",
            "/ateliers",
            "/hackathon",
            "/coworking gratuit",
          ],
        },
        parisP2P: {
          title: "Paris P2P_",
        },
        hackathon: {
          title: "10 000$",
          subtitle: "Prix cash du Hackathon",
          datetime: "4 au 11 avril 2025",
          btn: {
            text: "S'inscrire",
            link: "/rejoindre",
          },
        },
      },
      buttons: {
        getTicket: { title: "Obtenez votre billet", link: "" },
        joinHackathon: { title: "Rejoignez le hackathon", link: "" },
      },
      donate: {
        title: "Vous aimez cette initiative et souhaitez nous aider ?",
        description:
          "Vous pouvez montrer votre soutien en faisant un don pour aider à financer cet événement gratuit et les prochains…",
        buttonText: "Faire un don",
      },
      coOrg: {
        title: "Co-Org et sponsors",
        buttonText: "Devenez parrain",
      },
      speakers: {
        title: "Intervenants",
        buttonText: "Devenez intervenant",
      },
      schedule: {
        title: "Calendrier",
        filterTitle: "Filtrer les événements",
        kind: "Type",
        location: "Emplacement",
      },
      upcomingEventCTA: {
        title: "Rejoignez-nous à notre prochain événement",
        subtitle:
          "Rencontrez de nouvelles personnes, apprenez de nouvelles compétences et amusez-vous",
        btn_text: "RSVP",
      },
      usefulInformation: {
        title: "Informations utiles",
        groundControl: {
          title: "Contrôle au sol",
          desc: "Gare de Lyon - 81 rue du Charolais 75012 Paris, France",
          buttonText: "Apprendre encore plus",
        },
        support: {
          title: "Soutien",
          desc: "C’est gratuit pour tous mais cela a un coût ! Merci de nous aider à rendre cela possible.",
          buttonText: "Faire un don",
        },
        news: {
          title: "Nouvelles",
          desc: "Recevez les news de dernière minute, le planning définitif...",
          buttonText: "S'abonner",
          inputPlaceholder: "Votre email",
        },
      },
      plan: {
        title: "Plan",
      },
      footer: {
        buy: {
          title: "Achetez et soutenez le festival",
          buttonText: "Acheter un t-shirt",
        },
      },
      gathering: {
        title: "Evénement open-source gratuit",
        programFestival: "Programme du festival",
        hackathon: "Hackathon 2025",
        speakers: "Intervenants",
      },
      previousEvents: {
        title: "Conférences précédentes",
        buttonTitle: "Voir toutes les conférences",
      },
    },
    en: {
      hero: {
        nextMainEvent: {
          descriptionTitle: "Free for all",
          descriptionItems: [
            "/conferences",
            "/workshops",
            "/hackathon",
            "/free co-working",
          ],
        },
        parisP2P: {
          title: "Paris P2P_",
        },
        hackathon: {
          title: "$10 000",
          subtitle: "Hackathon cashprize",
          datetime: "April 4th to 11th, 2025",
          btn: {
            text: "Register",
            link: "/join",
          },
        },
      },
      buttons: {
        getTicket: { title: "Get your ticket", link: "" },
        joinHackathon: { title: "Join Hackathon", link: "" },
      },
      donate: {
        title: "You like this initiative and want to help us?",
        description:
          "You can show your support by donating to help funding this free event and the next ones…",
        buttonText: "Donate",
      },
      coOrg: {
        title: "Co-Org and sponsors",
        buttonText: "Become a sponsor",
      },
      speakers: {
        title: "Speakers",
        buttonText: "Become a Speaker",
      },
      schedule: {
        title: "Schedule",
        filterTitle: "Filter events",
        kind: "Kind",
        location: "Location",
      },
      upcomingEventCTA: {
        title: "Join us at our next event",
        subtitle: "Meet new people, learn new skills, and have fun",
        btn_text: "RSVP",
      },
      usefulInformation: {
        title: "Useful information",
        groundControl: {
          title: "Ground Control",
          desc: "Gare de Lyon - 81 rue du Charolais 75012 Paris, France",
          buttonText: "Learn more",
        },
        support: {
          title: "Support",
          desc: "It’s free for all but it has a cost! Thanks to help us to make it possible.",
          buttonText: "Donate",
        },
        news: {
          title: "News",
          desc: "Receive last minute news, final schedule...",
          buttonText: "Subscribe",
          inputPlaceholder: "Your email",
        },
      },
      plan: {
        title: "Plan",
      },
      footer: {
        buy: {
          title: "Buy & support the festival",
          buttonText: "Buy a t-shirt",
        },
      },
      gathering: {
        title: "World wide free gathering",
        programFestival: "Program festival",
        hackathon: "Hackathon 2025",
        speakers: "Speakers",
      },
      previousEvents: {
        title: "Previous conferences",
        buttonTitle: "See all events",
      },
    },
  },
  manifesto: {
    fr: {
      title: "Manifeste",
      content: [
        {
          type: "title",
          text: ["La centralisation tue. Construisons un monde P2P."],
        },
        {
          type: "description",
          text: [
            "Dans un monde dominé par l’hyperconnectivité et les entreprises tentaculaires, nous avons besoin d’un sanctuaire – un espace libre et ouvert pour rassembler des connaissances, des outils, du code, des pratiques et des idées, libéré du contrôle de tiers.",
            "Nous avons besoin que ce soit gratuit pour tous.",
            "Nous devons défendre, promouvoir et construire une culture du pair à pair.",
            "Nous pensons que la vie privée est un droit humain.",
            "La surveillance de masse est une impasse : elle accapare le pouvoir, la richesse, les données et la vérité, nous laissant exposés et impuissants.",
          ],
        },
        {
          type: "title",
          text: [
            "Nous sommes des ingénieurs, des hackers, des bricoleurs, des rêveurs, des curieux, des anonymes et des personnalités publiques.",
            "Nous sommes des humains. Nous sommes la société.",
          ],
        },
        {
          type: "description",
          text: [
            "De tous les lieux, de tous les âges, de toutes les cultures.",
            "Nous refusons de laisser l’avenir être dicté par quelques-uns.",
            "Nous expérimentons, piratons, construisons et partageons pour les biens communs : protocoles, outils, systèmes et idées.",
            "Pas pour le profit. Pas pour le contrôle. Mais pour la résistance. Pour la résilience. Pour la liberté.",
            "La gouvernance doit être transparente, équitable et axée sur la communauté.",
            "Tout ce qui est inférieur est un échec.",
            "Nous nous réunissons pour partager, enseigner, apprendre et conspirer :",
            "Meetups, hackathons, ateliers, gratuits et ouverts à tous.",
            "Pas de publicité. Pas d'engagement. L'open source est une rébellion. Le peer-to-peer est une question de survie.",
            "La communauté P2P de Paris est un outil, un espace commun pour tous ceux qui sont suffisamment audacieux pour défier la centralisation et construire quelque chose de mieux.",
          ],
        },
        {
          type: "title",
          text: [
            "Cet événement est un outil partagé par et pour les communautés.",
            "Rejoignez-nous. Hackez avec nous.",
            "Fourchons le monde.",
          ],
        },
      ],
    },
    en: {
      title: "Manifesto",
      content: [
        {
          type: "title",
          text: ["Centralization kills. Let’s build P2P World."],
        },
        {
          type: "description",
          text: [
            "In a world dominated by hyperconnectivity and sprawling corporations, we need a sanctuary—a free, open space to gather knowledge, tools, code, practices, and ideas, unshackled from third-party control.",
            "We need it to be free for all.",
            "We must defend, promote, and build a peer-to-peer culture.",
            "We believe privacy is a human right.",
            "Mass surveillance is a dead end—it hoards power, wealth, data, and truth, leaving us exposed and powerless.",
          ],
        },
        {
          type: "title",
          text: [
            "We are engineers, hackers, tinkerers, dreamers, the curious, anons, and public figures alike.",
            "we are humans. We are society.",
          ],
        },
        {
          type: "description",
          text: [
            "From all places, all ages, all cultures.",
            "We refuse to let the future be dictated by a few.",
            "We experiment, hack, build, and share for the commons: Protocols, tools, systems, and ideas.",
            "Not for profit. Not for control. But for resistance. For resilience. For freedom.",
            "Governance must be transparent, fair, and community-driven.",
            "Anything less is failure.",
            "We gather to share, teach, learn, and conspire:",
            "Meetups, hackathons, workshops—free and open to all.",
            "No ads. No strings attached. Open source is rebellion. Peer-to-peer is survival.",
            "The Paris P2P community is a tool—a common space for anyone bold enough to defy centralization and build something better.",
          ],
        },
        {
          type: "title",
          text: [
            "This event is a shared tool by and for communities.",
            "Join us. Hack with us.",
            "Let’s fork the world.",
          ],
        },
      ],
    },
  },
  talk: {
    en: {
      title: "Talks",
      showAll: "Show all talks",
    },
    fr: {
      title: "Conférences",
      showAll: "Afficher toutes les présentations",
    },
  },
  event: {
    en: {
      title: "Events",
      showAll: "Show all events",
    },
    fr: {
      title: "Conférences",
      showAll: "Afficher tous les événements",
    },
  },
  speaker: {
    en: {
      title: "Speakers",
      showAll: "Show all speakers",
      becomeSpeaker: "Become a speaker",
    },
    fr: {
      title: "Intervenants",
      showAll: "Afficher tous les intervenants",
      becomeSpeaker: "Devenez intervenant",
    },
  },
  common: {
    en: {
      notFound: "404 Not found",
      notFoundDesc: "Requested resource not found",
      loadMore: "Load more",
      showAll: "Show all",
      header: {
        events: "Events",
        pastEvents: {
          title: "Past Events",
          desc: "See our past festivals, workshops and meetups.",
        },
        speakers: {
          title: "Speakers",
          desc: "Hackers, developers, politicians, economists...",
        },
        manifesto: "Manifesto",
        addToCalendar: "Add to Calendar",
      },
    },
    fr: {
      notFound: "404 Non trouvé",
      notFoundDesc: "Ressource demandée introuvable",
      loadMore: "Charger plus",
      showAll: "Tout afficher",
      header: {
        events: "Événements",
        pastEvents: {
          title: "Événements passés",
          desc: "Découvrez nos festivals, ateliers et rencontres passés.",
        },
        speakers: {
          title: "Intervenants",
          desc: "Hackers, développeurs, politiques, économistes...",
        },
        manifesto: "Manifesto",
        addToCalendar: "Ajouter au calendrier",
      },
    },
  },
};

export const generatePageTypeByLocale = (locale: "en" | "fr"): PageContent => {
  const obj = {} as PageContent;

  Object.entries(defaultPagesContent).forEach(([key, value]) => {
    //@ts-ignore type error
    obj[key] = value[locale];
  });

  return obj;
};
