export interface MinistryOfficial {
  name: string;
  title: string;
  phone?: string;
  email?: string;
}

export interface MinistryProfile {
  website: string;
  contactPage: string;
  address: string;
  phones: string[];
  emails: string[];
  logoUrl: string;
  socials: {
    facebook?: string;
    x?: string;
    youtube?: string;
  };
  officials: MinistryOfficial[];
}

export const ministryProfiles: Record<string, MinistryProfile> = {
  mohp: {
    website: "https://www.mohp.gov.np/",
    contactPage: "https://www.mohp.gov.np/en/contact-us/",
    address: "Ramshah Path, Kathmandu, Nepal",
    phones: ["01-5362590", "01-5362802", "01-5355770"],
    emails: ["info@mohp.gov.np"],
    logoUrl: "https://giwmscdnone.gov.np/static/assets/image/Emblem_of_Nepal.png",
    socials: {
      facebook: "https://www.facebook.com/mohpnep/"
    },
    officials: [
      {
        name: "Prof. Dr. Prakash Budhathoki",
        title: "Spokesperson",
        phone: "9851037883",
        email: "spokesperson@mohp.gov.np"
      },
      {
        name: "Mr. Dhanraj Gautam",
        title: "Joint Spokesperson",
        phone: "9851000126",
        email: "dhanraj.gautam@mohp.gov.np"
      }
    ]
  },
  moest: {
    website: "https://www.moest.gov.np/",
    contactPage: "https://www.moest.gov.np/contact/",
    address: "Singha Durbar, Kathmandu, Nepal",
    phones: ["014200453", "01-6635419"],
    emails: [
      "info@moest.gov.np",
      "secretariat.education@moest.gov.np",
      "secretariat.science@moest.gov.np",
      "spokesperson@moest.gov.np",
      "information.officer@moest.gov.np"
    ],
    logoUrl: "https://giwmscdntwo.gov.np/static/assets/image/Emblem_of_Nepal.png",
    socials: {},
    officials: [
      {
        name: "Mr. Chudamani Poudel",
        title: "Secretary (Education)",
        phone: "014200354",
        email: "secretariat.education@moest.gov.np"
      },
      {
        name: "Mr. Ram Adhar Shah",
        title: "Secretary (Science and Technology)",
        phone: "014211973",
        email: "secretariat.science@moest.gov.np"
      },
      {
        name: "Mr. Shiva Kumar Sapkota",
        title: "Spokesperson",
        phone: "014200357",
        email: "spokesperson@moest.gov.np"
      },
      {
        name: "Mr. Madhu Prasad Ghimire",
        title: "Information Officer",
        phone: "9863197318",
        email: "information.officer@moest.gov.np"
      }
    ]
  },
  mopit: {
    website: "https://www.mopit.gov.np/",
    contactPage: "https://www.mopit.gov.np/en/pages/105/48710538/",
    address: "Singha Durbar, Kathmandu, Nepal",
    phones: ["+977-1-4211880", "+977-1-4211618"],
    emails: ["info@mopit.gov.np", "secretary@mopit.gov.np"],
    logoUrl: "https://giwmscdntwo.gov.np/static/assets/image/Emblem_of_Nepal.png",
    socials: {},
    officials: [
      {
        name: "Mr. Keshav Kumar Sharma",
        title: "Secretary",
        phone: "+977-1-4211880",
        email: "secretary@mopit.gov.np"
      },
      {
        name: "Mr. Balram Rijal",
        title: "Information Officer and Spokesperson",
        phone: "+977-1-4211753",
        email: "info@mopit.gov.np"
      }
    ]
  }
};
