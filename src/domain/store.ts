import { v4 as uuidv4 } from "uuid";

import type {
  Complaint,
  ComplaintStatus,
  CreateComplaintInput,
  Ministry,
  Notice,
  Project,
  ProjectStatus
} from "./models.js";

const now = (): string => new Date().toISOString();

const ministriesSeed: Ministry[] = [
  {
    id: "min-health",
    slug: "mohp",
    name: "Ministry of Health and Population",
    nameNe: "स्वास्थ्य तथा जनसंख्या मन्त्रालय",
    description: "Health policy, service delivery, and public health programs",
    sourceUrl: "https://www.mohp.gov.np/",
    sourceType: "official_page",
    lastCheckedAt: now()
  },
  {
    id: "min-education",
    slug: "moest",
    name: "Ministry of Education, Science and Technology",
    nameNe: "शिक्षा, विज्ञान तथा प्रविधि मन्त्रालय",
    description: "Education, science, and technology governance",
    sourceUrl: "https://www.moest.gov.np/",
    sourceType: "official_page",
    lastCheckedAt: now()
  },
  {
    id: "min-infra",
    slug: "mopit",
    name: "Ministry of Physical Infrastructure and Transport",
    nameNe: "भौतिक पूर्वाधार तथा यातायात मन्त्रालय",
    description: "Roads, transport and physical infrastructure",
    sourceUrl: "https://www.mopit.gov.np/",
    sourceType: "official_page",
    lastCheckedAt: now()
  }
];

const projectsSeed: Project[] = [
  {
    id: "proj-h-001",
    ministryId: "min-health",
    title: "Nepal Health Sector Strategic Plan (NHSSP) 2023-2030 Implementation",
    description: "Sector-wide implementation roadmap toward Universal Health Coverage under NHSSP 2023-2030.",
    status: "active",
    startDate: "2023-07-16",
    endDate: "2030-07-15",
    sourceUrl: "https://mohp.gov.np/uploads/articles/Progress%20of%20Health%20and%20Population%20Sector-final.pdf",
    sourceType: "pdf_extract",
    lastCheckedAt: now(),
    lastUpdatedAt: "2024-07-16"
  },
  {
    id: "proj-h-002",
    ministryId: "min-health",
    title: "Health National Adaptation Plan - Climate Change (2023-2030)",
    description: "Health system adaptation actions aligned with climate resilience objectives.",
    status: "active",
    startDate: "2023-01-01",
    endDate: "2030-12-31",
    sourceUrl: "https://climate.mohp.gov.np/acts/31-acts",
    sourceType: "official_page",
    lastCheckedAt: now(),
    lastUpdatedAt: "2023-12-31"
  },
  {
    id: "proj-h-003",
    ministryId: "min-health",
    title: "National Health Care Waste Management Standards and SOP Operationalization",
    description: "Implementation and compliance actions for national healthcare waste management standards (2020).",
    status: "active",
    startDate: "2020-01-01",
    sourceUrl: "https://climate.mohp.gov.np/acts/31-acts",
    sourceType: "official_page",
    lastCheckedAt: now(),
    lastUpdatedAt: "2024-01-01"
  },
  {
    id: "proj-h-004",
    ministryId: "min-health",
    title: "National Joint Annual Review (NJAR) System Strengthening",
    description: "Institutionalized annual review platform for MoHP and partners across sector programs.",
    status: "active",
    startDate: "2018-01-01",
    sourceUrl: "https://www.mohp.gov.np/uploads/articles/Council.pdf",
    sourceType: "pdf_extract",
    lastCheckedAt: now(),
    lastUpdatedAt: "2024-01-01"
  },
  {
    id: "proj-h-005",
    ministryId: "min-health",
    title: "Health Vulnerability Adaptation Assessment Follow-up Program",
    description: "Follow-up implementation actions from Vulnerability Adaptation Assessment Report 2022.",
    status: "planned",
    startDate: "2025-01-01",
    endDate: "2027-12-31",
    sourceUrl: "https://climate.mohp.gov.np/acts/31-acts",
    sourceType: "official_page",
    lastCheckedAt: now(),
    lastUpdatedAt: "2025-01-01"
  },
  {
    id: "proj-e-001",
    ministryId: "min-education",
    title: "School Education Sector Plan (SESP) 2022-2032 Implementation",
    description: "Long-term education sector program implementation framework for school education outcomes.",
    status: "active",
    startDate: "2022-01-01",
    endDate: "2032-12-31",
    sourceUrl: "https://elibrary.moest.gov.np/handle/123456789/178",
    sourceType: "official_page",
    lastCheckedAt: now(),
    lastUpdatedAt: "2024-12-31"
  },
  {
    id: "proj-e-002",
    ministryId: "min-education",
    title: "School Sector Development Plan (SSDP) 2016-2023",
    description: "Legacy school sector development program covering BS 2073-2080 implementation period.",
    status: "completed",
    startDate: "2016-01-01",
    endDate: "2023-12-31",
    sourceUrl: "https://elibrary.moest.gov.np/handle/123456789/187?mode=full",
    sourceType: "official_page",
    lastCheckedAt: now(),
    lastUpdatedAt: "2023-12-31"
  },
  {
    id: "proj-e-003",
    ministryId: "min-education",
    title: "National Science, Technology and Innovation Policy 2019 Implementation",
    description: "Policy-driven implementation actions for national science, technology, and innovation development.",
    status: "active",
    startDate: "2019-01-01",
    sourceUrl: "https://moest.gov.np/content/10152/10152-national-science-technology-a/",
    sourceType: "official_page",
    lastCheckedAt: now(),
    lastUpdatedAt: "2024-01-01"
  },
  {
    id: "proj-e-004",
    ministryId: "min-education",
    title: "University-Level STEAM Materials Competition Program",
    description: "Competitive STEAM materials development initiative for university students.",
    status: "active",
    startDate: "2023-12-01",
    sourceUrl: "https://moest.gov.np/content/10258/10258-%E0%A4%B5%E0%A4%B6%E0%A4%B5%E0%A4%B5%E0%A4%A6%E0%A4%AF%E0%A4%B2%E0%A4%AF%E0%A4%95-%E0%A4%B5%E0%A4%A6%E0%A4%AF%E0%A4%B0%E0%A4%A5%E0%A4%B9%E0%A4%B0/",
    sourceType: "official_page",
    lastCheckedAt: now(),
    lastUpdatedAt: "2023-12-19"
  },
  {
    id: "proj-e-005",
    ministryId: "min-education",
    title: "International Scholarship Coordination (Academic Year 2026/27)",
    description: "Processing and coordination of external scholarship opportunities for higher studies.",
    status: "planned",
    startDate: "2025-12-01",
    endDate: "2026-12-31",
    sourceUrl: "https://moest.gov.np/category/1711/",
    sourceType: "official_page",
    lastCheckedAt: now(),
    lastUpdatedAt: "2025-12-01"
  },
  {
    id: "proj-i-001",
    ministryId: "min-infra",
    title:
      "Detail Survey and Design: Butwal-Lamahi, Lamahi-Kohalpur-Nepalgunj, Kohalpur-Sukhkhad, Sukhkhad-Gaddachowki Electrified Railway Line (HSR)",
    description: "Consultancy and design-stage preparation for electrified railway corridor segments.",
    status: "planned",
    startDate: "2025-01-01",
    sourceUrl: "https://mopit.gov.np/en/notice-details/123/23656676",
    sourceType: "official_page",
    lastCheckedAt: now(),
    lastUpdatedAt: "2025-01-01"
  },
  {
    id: "proj-i-002",
    ministryId: "min-infra",
    title: "Strategic Road Network (SRN) Priority Investment and Maintenance Program",
    description:
      "Programmatic expansion, maintenance and investment planning for SRN highways and feeder corridors.",
    status: "active",
    startDate: "2017-01-01",
    sourceUrl: "https://mopit.gov.np/pages/74/93430229/",
    sourceType: "official_page",
    lastCheckedAt: now(),
    lastUpdatedAt: "2025-01-01"
  },
  {
    id: "proj-i-003",
    ministryId: "min-infra",
    title: "National Seat Belt Compliance and Road Safety Evidence Program",
    description: "Road safety measurement and compliance enhancement informed by seat belt compliance study outputs.",
    status: "active",
    startDate: "2025-01-01",
    sourceUrl: "https://mopit.gov.np/downloadfiles/Final-Report-Seat-Belt-Compliance-Study-%283%29-1750580574.pdf",
    sourceType: "pdf_extract",
    lastCheckedAt: now(),
    lastUpdatedAt: "2025-06-01"
  },
  {
    id: "proj-i-004",
    ministryId: "min-infra",
    title: "GESI Mainstreaming in Physical Infrastructure and Transport Programs",
    description: "Institutional mainstreaming of Gender Equality and Social Inclusion (GESI) operational guideline.",
    status: "active",
    startDate: "2017-01-01",
    sourceUrl:
      "https://www.mopit.gov.np/downloadfiles/Operational%20Guidelines%20for%20Mainstreaming%20GESI%20in%20MOPIT%20English-2_1569147282.pdf",
    sourceType: "pdf_extract",
    lastCheckedAt: now(),
    lastUpdatedAt: "2025-01-01"
  },
  {
    id: "proj-i-005",
    ministryId: "min-infra",
    title: "Annual Physical Infrastructure Progress Program (FY 2080/81)",
    description: "Annual implementation and progress reporting program for ministry infrastructure targets.",
    status: "active",
    startDate: "2024-07-16",
    endDate: "2025-07-15",
    sourceUrl:
      "https://mopit.gov.np/downloadfiles/%E0%A5%A8%E0%A5%A6%E0%A5%AE%E0%A5%A6_%E0%A5%AE%E0%A5%A7-%E0%A4%AC%E0%A4%BE%E0%A4%B0%E0%A5%8D%E0%A4%B7%E0%A4%BF%E0%A4%95-%E0%A4%AA%E0%A5%8D%E0%A4%B0%E0%A4%97%E0%A4%A4%E0%A4%BF-%E0%A4%AA%E0%A5%8D%E0%A4%B0%E0%A4%A4%E0%A4%BF%E0%A4%B5%E0%A5%87%E0%A4%A6%E0%A4%A8-1750315194.pdf",
    sourceType: "pdf_extract",
    lastCheckedAt: now(),
    lastUpdatedAt: "2025-07-15"
  },
  {
    id: "proj-h-006",
    ministryId: "min-health",
    title: "Baseline Assessment of GHG Emissions of Nepal's Health Sector",
    description: "Baseline assessment publication supporting climate-resilient health system planning.",
    status: "completed",
    startDate: "2024-01-01",
    endDate: "2025-03-03",
    sourceUrl: "https://climate.mohp.gov.np/our-media/news-notices",
    sourceType: "official_page",
    lastCheckedAt: now(),
    lastUpdatedAt: "2025-03-03"
  },
  {
    id: "proj-h-007",
    ministryId: "min-health",
    title: "Climate Resilience and Environmental Sustainability of Health Care Facilities (Three Ecological Regions)",
    description:
      "Implementation preparation initiative for climate resilience and environmental sustainability in health facilities.",
    status: "active",
    startDate: "2022-07-03",
    sourceUrl: "https://climate.mohp.gov.np/our-media/news-notices",
    sourceType: "official_page",
    lastCheckedAt: now(),
    lastUpdatedAt: "2024-12-31"
  },
  {
    id: "proj-h-008",
    ministryId: "min-health",
    title: "Vulnerability and Adaptation Assessment for Climate Sensitive Diseases and Health Risks",
    description: "Technical assessment program for climate-sensitive health risks and adaptation options.",
    status: "completed",
    startDate: "2021-06-14",
    endDate: "2022-12-31",
    sourceUrl: "https://climate.mohp.gov.np/our-media/news-notices?start=5",
    sourceType: "official_page",
    lastCheckedAt: now(),
    lastUpdatedAt: "2022-12-31"
  },
  {
    id: "proj-e-006",
    ministryId: "min-education",
    title: "Science, Technology and Innovation Conference, Exhibition and Startup Hackathon Grant Program (2082)",
    description: "Grant-supported program for innovation ecosystem events and startup hackathon activities.",
    status: "active",
    startDate: "2025-02-01",
    sourceUrl: "https://www.moest.gov.np/",
    sourceType: "official_page",
    lastCheckedAt: now(),
    lastUpdatedAt: "2025-02-10"
  },
  {
    id: "proj-e-007",
    ministryId: "min-education",
    title: "Foreign Study Approval Publication Program (FY 2081/82)",
    description: "Publication and transparency of issued foreign study approvals by country and subject.",
    status: "active",
    startDate: "2024-07-16",
    endDate: "2025-10-17",
    sourceUrl: "https://moest.gov.np/category/1711/",
    sourceType: "official_page",
    lastCheckedAt: now(),
    lastUpdatedAt: "2025-10-17"
  },
  {
    id: "proj-e-008",
    ministryId: "min-education",
    title: "School Midday Meal Nutrition Model Rollout (Local Product Based)",
    description: "Model rollout program for nutrition-focused school midday meals using local products.",
    status: "active",
    startDate: "2024-10-01",
    sourceUrl: "https://moest.gov.np/category/1711/",
    sourceType: "official_page",
    lastCheckedAt: now(),
    lastUpdatedAt: "2025-01-01"
  },
  {
    id: "proj-i-006",
    ministryId: "min-infra",
    title: "Grievance Hotline Service Operations",
    description: "Public grievance hotline operationalization and service monitoring under MOPIT.",
    status: "active",
    startDate: "2025-12-03",
    sourceUrl: "https://mopit.gov.np/category/press-release/",
    sourceType: "official_page",
    lastCheckedAt: now(),
    lastUpdatedAt: "2025-12-03"
  },
  {
    id: "proj-i-007",
    ministryId: "min-infra",
    title: "Purvadhar Patrika (Infrastructure Journal) First-Issue Publication Program",
    description: "Program to collect and publish technical articles for the first issue of infrastructure journal.",
    status: "active",
    startDate: "2025-11-01",
    sourceUrl: "https://mopit.gov.np/category/press-release/",
    sourceType: "official_page",
    lastCheckedAt: now(),
    lastUpdatedAt: "2025-11-20"
  },
  {
    id: "proj-i-008",
    ministryId: "min-infra",
    title: "Mahakali Bridge Construction MoU Follow-up Coordination",
    description: "Follow-up coordination actions after MoU signing for Mahakali bridge construction.",
    status: "active",
    startDate: "2022-02-01",
    sourceUrl: "https://www.mopit.gov.np/en/notice-board/3/51387898",
    sourceType: "official_page",
    lastCheckedAt: now(),
    lastUpdatedAt: "2025-01-01"
  }
];

const noticesSeed: Notice[] = [
  {
    id: "notice-h-001",
    ministryId: "min-health",
    title: "National Health Policy 2076",
    category: "policy",
    publishedAt: "2019-01-01",
    sourceUrl: "https://climate.mohp.gov.np/31-acts/164-national-health-policy-2076",
    sourceType: "official_page",
    lastCheckedAt: now(),
    summary: "Updated national health policy framework."
  },
  {
    id: "notice-h-002",
    ministryId: "min-health",
    title: "National Health Policy 2071",
    category: "policy",
    publishedAt: "2014-01-01",
    sourceUrl: "https://mohp.gov.np/content/162/national-health-policy-2071/",
    sourceType: "official_page",
    lastCheckedAt: now(),
    summary: "National policy document for health system direction."
  },
  {
    id: "notice-h-003",
    ministryId: "min-health",
    title: "National Health Policy-1991",
    category: "policy",
    publishedAt: "1991-01-01",
    sourceUrl: "https://mohp.gov.np/content/182/national-health-policy-1991/",
    sourceType: "official_page",
    lastCheckedAt: now(),
    summary: "Foundational policy document for Nepal health sector."
  },
  {
    id: "notice-h-004",
    ministryId: "min-health",
    title: "Progress of Health and Population Sector 2023/24 (2080/81)",
    category: "news",
    publishedAt: "2024-07-01",
    sourceUrl: "https://mohp.gov.np/uploads/articles/Progress%20of%20Health%20and%20Population%20Sector-final.pdf",
    sourceType: "pdf_extract",
    lastCheckedAt: now(),
    summary: "National progress update aligned with NHSSP 2023-2030."
  },
  {
    id: "notice-h-005",
    ministryId: "min-health",
    title: "National Joint Annual Review 2078/79 (Combined Presentation of Councils)",
    category: "news",
    publishedAt: "2022-07-16",
    sourceUrl: "https://www.mohp.gov.np/uploads/articles/Council.pdf",
    sourceType: "pdf_extract",
    lastCheckedAt: now(),
    summary: "Combined council-level annual health sector review output."
  },
  {
    id: "notice-h-006",
    ministryId: "min-health",
    title: "National Adaptation Plan (2021-2050)",
    category: "policy",
    publishedAt: "2021-01-01",
    sourceUrl: "https://climate.mohp.gov.np/faq/31-acts/174-national-adaptation-plan-2021-2050",
    sourceType: "official_page",
    lastCheckedAt: now(),
    summary: "National adaptation planning reference used for health-sector climate alignment."
  },
  {
    id: "notice-h-007",
    ministryId: "min-health",
    title: "Nationally Determined Contribution (NDC) 3.0 (Health-relevant publication list)",
    category: "news",
    publishedAt: "2025-01-01",
    sourceUrl: "https://climate.mohp.gov.np/acts/31-acts",
    sourceType: "official_page",
    lastCheckedAt: now(),
    summary: "Health-linked climate commitment publication under NDC 3.0 listing."
  },
  {
    id: "notice-e-001",
    ministryId: "min-education",
    title: "School Education Sector Plan (SESP) 2022-2032",
    category: "policy",
    publishedAt: "2022-01-01",
    sourceUrl: "https://elibrary.moest.gov.np/handle/123456789/178",
    sourceType: "official_page",
    lastCheckedAt: now(),
    summary: "Core sector plan for school education reforms and outcomes."
  },
  {
    id: "notice-e-002",
    ministryId: "min-education",
    title: "School Sector Development Plan 2016-2023 (BS 2073-2080)",
    category: "policy",
    publishedAt: "2016-01-01",
    sourceUrl: "https://elibrary.moest.gov.np/handle/123456789/187?mode=full",
    sourceType: "official_page",
    lastCheckedAt: now(),
    summary: "Sector planning document for school education development period 2016-2023."
  },
  {
    id: "notice-e-003",
    ministryId: "min-education",
    title: "National Science, Technology and Innovation Policy, 2019",
    category: "policy",
    publishedAt: "2019-01-01",
    sourceUrl: "https://moest.gov.np/content/10152/10152-national-science-technology-a/",
    sourceType: "official_page",
    lastCheckedAt: now(),
    summary: "National policy for science, technology and innovation ecosystem."
  },
  {
    id: "notice-e-004",
    ministryId: "min-education",
    title: "National Nuclear Policy, 2064 (2007)",
    category: "policy",
    publishedAt: "2007-01-01",
    sourceUrl: "https://moest.gov.np/content/10153/10153-national-nuclear-policy-2064/",
    sourceType: "official_page",
    lastCheckedAt: now(),
    summary: "National nuclear policy publication."
  },
  {
    id: "notice-e-005",
    ministryId: "min-education",
    title: "Notice for Letter of Intent (LOI)",
    category: "notice",
    publishedAt: "2024-11-29",
    sourceUrl: "https://moest.gov.np/content/13369/notice-for-letter-of-intent--loi-/",
    sourceType: "official_page",
    lastCheckedAt: now(),
    summary: "MOEST public notice for LOI process."
  },
  {
    id: "notice-e-006",
    ministryId: "min-education",
    title: "Invitation for Bids (Tender Category Listing)",
    category: "notice",
    publishedAt: "2025-08-26",
    sourceUrl: "https://moest.gov.np/category/1711/",
    sourceType: "official_page",
    lastCheckedAt: now(),
    summary: "Procurement-related invitation publication under MOEST tender category."
  },
  {
    id: "notice-e-007",
    ministryId: "min-education",
    title: "Invitation for Sealed Quotation (Tender Category Listing)",
    category: "notice",
    publishedAt: "2025-09-07",
    sourceUrl: "https://moest.gov.np/category/1711/",
    sourceType: "official_page",
    lastCheckedAt: now(),
    summary: "Tender listing entry for sealed quotation publication."
  },
  {
    id: "notice-e-008",
    ministryId: "min-education",
    title: "University-Level STEAM Materials Competition Notice",
    category: "notice",
    publishedAt: "2023-12-05",
    sourceUrl:
      "https://moest.gov.np/content/10258/10258-%E0%A4%B5%E0%A4%B6%E0%A4%B5%E0%A4%B5%E0%A4%A6%E0%A4%AF%E0%A4%B2%E0%A4%AF%E0%A4%95-%E0%A4%B5%E0%A4%A6%E0%A4%AF%E0%A4%B0%E0%A4%A5%E0%A4%B9%E0%A4%B0/",
    sourceType: "official_page",
    lastCheckedAt: now(),
    summary: "Competition notice for STEAM material development among university students."
  },
  {
    id: "notice-i-001",
    ministryId: "min-infra",
    title: "सवारी तथा यातायातको सम्बन्धमा व्यवस्था गर्न बनेको विधेयक, २०८१ (मस्यौदा)",
    category: "policy",
    publishedAt: "2025-11-20",
    sourceUrl: "https://www.mopit.gov.np/en/notice-details/247/77262715",
    sourceType: "official_page",
    lastCheckedAt: now(),
    summary: "Draft bill related to transport and vehicle regulatory provisions."
  },
  {
    id: "notice-i-002",
    ministryId: "min-infra",
    title:
      "Amendment on Notice for EOI for Consultancy Services for Detail Survey and Design of Electrified Railway Line (HSR)",
    category: "notice",
    publishedAt: "2025-11-20",
    sourceUrl: "https://mopit.gov.np/en/notice-details/123/23656676",
    sourceType: "official_page",
    lastCheckedAt: now(),
    summary:
      "Amendment notice for consultancy EOI covering Butwal-Lamahi, Lamahi-Kohalpur-Nepalgunj and linked segments."
  },
  {
    id: "notice-i-003",
    ministryId: "min-infra",
    title: "Press Release 2076-03-08",
    category: "press_release",
    publishedAt: "2019-06-24",
    sourceUrl: "https://www.mopit.gov.np/en/notice-board/3/51387898",
    sourceType: "official_page",
    lastCheckedAt: now(),
    summary: "Press release entry listed in official MOPIT press release board."
  },
  {
    id: "notice-i-004",
    ministryId: "min-infra",
    title: "Press Release 2076/02/30",
    category: "press_release",
    publishedAt: "2019-06-13",
    sourceUrl: "https://www.mopit.gov.np/en/notice-board/3/51387898",
    sourceType: "official_page",
    lastCheckedAt: now(),
    summary: "Press release entry listed in official MOPIT press release board."
  },
  {
    id: "notice-i-005",
    ministryId: "min-infra",
    title: "प्रेस विज्ञप्ति (सवारी साधन आगजनी भएको घटना सम्बन्धमा)",
    category: "press_release",
    publishedAt: "2023-12-29",
    sourceUrl: "https://www.mopit.gov.np/en/notice-board/3/51387898",
    sourceType: "official_page",
    lastCheckedAt: now(),
    summary: "Press release regarding vehicle arson incident."
  },
  {
    id: "notice-i-006",
    ministryId: "min-infra",
    title: "गुनासो हटलाइन सेवा सञ्चालन सम्बन्धी सूचना",
    category: "notice",
    publishedAt: "2025-12-03",
    sourceUrl: "https://www.mopit.gov.np/en/",
    sourceType: "official_page",
    lastCheckedAt: now(),
    summary: "Public notice on operation of grievance hotline service."
  },
  {
    id: "notice-i-007",
    ministryId: "min-infra",
    title: "Final Report - Seat Belt Compliance Study",
    category: "news",
    publishedAt: "2025-06-22",
    sourceUrl: "https://mopit.gov.np/downloadfiles/Final-Report-Seat-Belt-Compliance-Study-%283%29-1750580574.pdf",
    sourceType: "pdf_extract",
    lastCheckedAt: now(),
    summary: "Road safety and seat-belt compliance study report publication."
  },
  {
    id: "notice-i-008",
    ministryId: "min-infra",
    title: "२०८०/८१ वार्षिक प्रगति प्रतिवेदन",
    category: "news",
    publishedAt: "2025-05-30",
    sourceUrl:
      "https://mopit.gov.np/downloadfiles/%E0%A5%A8%E0%A5%A6%E0%A5%AE%E0%A5%A6_%E0%A5%AE%E0%A5%A7-%E0%A4%AC%E0%A4%BE%E0%A4%B0%E0%A5%8D%E0%A4%B7%E0%A4%BF%E0%A4%95-%E0%A4%AA%E0%A5%8D%E0%A4%B0%E0%A4%97%E0%A4%A4%E0%A4%BF-%E0%A4%AA%E0%A5%8D%E0%A4%B0%E0%A4%A4%E0%A4%BF%E0%A4%B5%E0%A5%87%E0%A4%A6%E0%A4%A8-1750315194.pdf",
    sourceType: "pdf_extract",
    lastCheckedAt: now(),
    summary: "Annual progress report for FY 2080/81."
  },
  {
    id: "notice-h-008",
    ministryId: "min-health",
    title: "Baseline Assessment of GHG Emissions of Nepal's Health Sector",
    category: "news",
    publishedAt: "2025-03-03",
    sourceUrl: "https://climate.mohp.gov.np/our-media/news-notices",
    sourceType: "official_page",
    lastCheckedAt: now(),
    summary: "Baseline greenhouse-gas emissions assessment publication for Nepal health sector."
  },
  {
    id: "notice-h-009",
    ministryId: "min-health",
    title: "Notice to provide feedback",
    category: "notice",
    publishedAt: "2023-12-28",
    sourceUrl: "https://climate.mohp.gov.np/our-media/news-notices",
    sourceType: "official_page",
    lastCheckedAt: now(),
    summary: "Public notice requesting stakeholder feedback."
  },
  {
    id: "notice-h-010",
    ministryId: "min-health",
    title:
      "Request for Proposal for Implementation of Climate Resilience and Environmental Sustainability of Health Care Facilities in Three Ecological Regions",
    category: "notice",
    publishedAt: "2022-07-03",
    sourceUrl: "https://climate.mohp.gov.np/our-media/news-notices",
    sourceType: "official_page",
    lastCheckedAt: now(),
    summary: "RFP notice for climate-resilient and environmentally sustainable health facility implementation."
  },
  {
    id: "notice-h-011",
    ministryId: "min-health",
    title: "CoP26 Special Report on Climate Change and Health: The Health Argument for Climate Action",
    category: "news",
    publishedAt: "2021-10-27",
    sourceUrl: "https://climate.mohp.gov.np/our-media/news-notices",
    sourceType: "official_page",
    lastCheckedAt: now(),
    summary: "Special report publication linked to global climate and health agenda."
  },
  {
    id: "notice-h-012",
    ministryId: "min-health",
    title: "Climate Change and Health: Vulnerability and Adaptation Assessment",
    category: "news",
    publishedAt: "2021-10-27",
    sourceUrl:
      "https://climate.mohp.gov.np/our-media/news-notices/170-climate-change-and-health-vulnerability-and-adaptation-assessment",
    sourceType: "official_page",
    lastCheckedAt: now(),
    summary: "Assessment report publication on climate-linked health vulnerabilities and adaptation."
  },
  {
    id: "notice-h-013",
    ministryId: "min-health",
    title: "Request for proposals on vulnerability and adaptation assessment for climate-sensitive diseases and health risks",
    category: "notice",
    publishedAt: "2021-06-14",
    sourceUrl: "https://climate.mohp.gov.np/our-media/news-notices?start=5",
    sourceType: "official_page",
    lastCheckedAt: now(),
    summary: "Procurement notice for assessment work on climate-sensitive diseases and risks."
  },
  {
    id: "notice-h-014",
    ministryId: "min-health",
    title: "Launch of the official website of Climate Change and Health, Ministry of Health and Population",
    category: "news",
    publishedAt: "2019-12-23",
    sourceUrl: "https://climate.mohp.gov.np/our-media/news-notices/34-scroll/156-climate-change-health-website-launched",
    sourceType: "official_page",
    lastCheckedAt: now(),
    summary: "Announcement of the official climate-change-and-health portal launch."
  },
  {
    id: "notice-h-015",
    ministryId: "min-health",
    title: "National Framework on Local Adaptation Plans for Action",
    category: "policy",
    publishedAt: "2019-11-03",
    sourceUrl:
      "https://climate.mohp.gov.np/our-media/news-notices/31-acts/152-national-framework-on-local-adaptation-plans-for-action",
    sourceType: "official_page",
    lastCheckedAt: now(),
    summary: "Framework reference for local adaptation planning."
  },
  {
    id: "notice-h-016",
    ministryId: "min-health",
    title: "National Adaptation Programme of Action (NAPA) to Climate Change",
    category: "policy",
    publishedAt: "2019-11-03",
    sourceUrl:
      "https://climate.mohp.gov.np/our-media/news-notices/31-acts/155-national-adaptation-programme-of-action-napa-to-climate-change",
    sourceType: "official_page",
    lastCheckedAt: now(),
    summary: "National adaptation program reference publication."
  },
  {
    id: "notice-e-009",
    ministryId: "min-education",
    title: "बोलपत्र/ शिलबन्दी दरभाउपत्र स्वीकृत गर्ने आशयको सूचना",
    category: "notice",
    publishedAt: "2025-10-12",
    sourceUrl: "https://moest.gov.np/category/1711/",
    sourceType: "official_page",
    lastCheckedAt: now(),
    summary: "Tender award intent notice under MOEST tender section."
  },
  {
    id: "notice-e-010",
    ministryId: "min-education",
    title: "Invitation for Sealed Quotation",
    category: "notice",
    publishedAt: "2025-09-08",
    sourceUrl: "https://moest.gov.np/category/1711/",
    sourceType: "official_page",
    lastCheckedAt: now(),
    summary: "Public procurement sealed quotation notice."
  },
  {
    id: "notice-e-011",
    ministryId: "min-education",
    title: "Invitation for Sealed Quotation",
    category: "notice",
    publishedAt: "2025-05-09",
    sourceUrl: "https://moest.gov.np/category/1711/",
    sourceType: "official_page",
    lastCheckedAt: now(),
    summary: "Additional sealed quotation notice listed under tender category."
  },
  {
    id: "notice-e-012",
    ministryId: "min-education",
    title: "सम्पत्ति तथा जिन्सी मालसामानको लिलाम बिक्रीको लागि बोलपत्र आव्हानको सूचना",
    category: "notice",
    publishedAt: "2025-05-08",
    sourceUrl: "https://moest.gov.np/category/1711/",
    sourceType: "official_page",
    lastCheckedAt: now(),
    summary: "Notice inviting bids for auction of property and inventory items."
  },
  {
    id: "notice-e-013",
    ministryId: "min-education",
    title: "चीन सरकारबाट शैक्षिक बर्ष २०२६/२७ का लागि प्राप्त छात्रवृत्तिमा आवेदन आव्हानसम्बन्धी सूचना",
    category: "notice",
    publishedAt: "2025-12-12",
    sourceUrl: "https://moest.gov.np/category/1711/",
    sourceType: "official_page",
    lastCheckedAt: now(),
    summary: "Application call notice for China government scholarships (AY 2026/27)."
  },
  {
    id: "notice-e-014",
    ministryId: "min-education",
    title:
      "शैक्षिक परामर्श सेवा, पूर्व तयारी कक्षा तथा भाषा शिक्षण सम्बन्धी कार्य गर्न अनुमति प्राप्त संस्थाहरुलाई थप दस्तुर तिरी संस्था नवीकरण गराउने सम्बन्धी अत्यन्त जरुरी सूचना",
    category: "notice",
    publishedAt: "2025-12-10",
    sourceUrl: "https://moest.gov.np/category/1711/",
    sourceType: "official_page",
    lastCheckedAt: now(),
    summary: "Urgent notice for institution renewal related to educational consultancy and language training services."
  },
  {
    id: "notice-e-015",
    ministryId: "min-education",
    title: "विज्ञान प्रविधि तथा नवप्रवर्तन सम्बन्धी सम्मेलन, प्रदर्शनी तथा स्टार्टअप ह्याकाथोन अनुदान कार्यक्रम सञ्चालन सम्बन्धी कार्यविधि, २०८२",
    category: "policy",
    publishedAt: "2025-08-01",
    sourceUrl: "https://moest.gov.np/category/1711/",
    sourceType: "official_page",
    lastCheckedAt: now(),
    summary: "Program guideline for conference, exhibition and startup hackathon grant implementation."
  },
  {
    id: "notice-i-009",
    ministryId: "min-infra",
    title: "Press Release (2081/06/13)",
    category: "press_release",
    publishedAt: "2024-09-29",
    sourceUrl: "https://www.mopit.gov.np/en/notice-details/242/15797935",
    sourceType: "official_page",
    lastCheckedAt: now(),
    summary: "Official press release entry from MOPIT notice board."
  },
  {
    id: "notice-i-010",
    ministryId: "min-infra",
    title: "Press Release (2081/06/12)",
    category: "press_release",
    publishedAt: "2024-09-28",
    sourceUrl: "https://www.mopit.gov.np/en/notice-details/241/98948655",
    sourceType: "official_page",
    lastCheckedAt: now(),
    summary: "Official press release entry from MOPIT notice board."
  },
  {
    id: "notice-i-011",
    ministryId: "min-infra",
    title: "बिज्ञप्ति : महाकाली पूल निर्माणको लागी समझदारी पत्रमा हस्ताक्षर",
    category: "press_release",
    publishedAt: "2022-02-01",
    sourceUrl: "https://www.mopit.gov.np/en/notice-board/3/51387898",
    sourceType: "official_page",
    lastCheckedAt: now(),
    summary: "Press release on MoU signing for Mahakali bridge construction."
  },
  {
    id: "notice-i-012",
    ministryId: "min-infra",
    title: "भौतिक पूर्वाधार तथा यातायात मन्त्रीज्यूको फ्रान्सेली राजदुतसंग भेट",
    category: "press_release",
    publishedAt: "2021-12-20",
    sourceUrl: "https://www.mopit.gov.np/en/notice-board/3/51387898",
    sourceType: "official_page",
    lastCheckedAt: now(),
    summary: "Press release on minister-level diplomatic meeting."
  },
  {
    id: "notice-i-013",
    ministryId: "min-infra",
    title: "Press Release (2078/03/20)",
    category: "press_release",
    publishedAt: "2021-07-06",
    sourceUrl: "https://www.mopit.gov.np/en/notice-board/3/51387898",
    sourceType: "official_page",
    lastCheckedAt: now(),
    summary: "Press release listed in official MOPIT archive."
  },
  {
    id: "notice-i-014",
    ministryId: "min-infra",
    title: "Press Release 2076/08/30",
    category: "press_release",
    publishedAt: "2019-12-16",
    sourceUrl: "https://www.mopit.gov.np/en/notice-board/3/51387898",
    sourceType: "official_page",
    lastCheckedAt: now(),
    summary: "Archived MOPIT press release entry."
  },
  {
    id: "notice-i-015",
    ministryId: "min-infra",
    title: "Press Release 2076/08/24",
    category: "press_release",
    publishedAt: "2019-12-10",
    sourceUrl: "https://www.mopit.gov.np/en/notice-details/166/90037594",
    sourceType: "official_page",
    lastCheckedAt: now(),
    summary: "Archived MOPIT press release entry."
  },
  {
    id: "notice-i-016",
    ministryId: "min-infra",
    title: "Press Release 2076-06-30",
    category: "press_release",
    publishedAt: "2019-10-17",
    sourceUrl: "https://www.mopit.gov.np/en/notice-details/164/94548235",
    sourceType: "official_page",
    lastCheckedAt: now(),
    summary: "Archived MOPIT press release entry."
  }
];

class InMemoryStore {
  private readonly ministries = [...ministriesSeed];
  private readonly projects = [...projectsSeed];
  private readonly notices = [...noticesSeed];
  private readonly complaints: Complaint[] = [];

  public listMinistries(): Ministry[] {
    return [...this.ministries];
  }

  public findMinistryBySlug(slug: string): Ministry | undefined {
    return this.ministries.find((ministry) => ministry.slug === slug);
  }

  public findMinistryById(id: string): Ministry | undefined {
    return this.ministries.find((ministry) => ministry.id === id);
  }

  public listProjects(params: { ministryId?: string; status?: ProjectStatus; q?: string }): Project[] {
    return this.projects.filter((project) => {
      if (params.ministryId && project.ministryId !== params.ministryId) {
        return false;
      }

      if (params.status && project.status !== params.status) {
        return false;
      }

      if (params.q) {
        const query = params.q.toLowerCase();
        const haystack = `${project.title} ${project.description ?? ""}`.toLowerCase();
        if (!haystack.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }

  public listNotices(params: { ministryId?: string; category?: string; limit?: number }): Notice[] {
    const filtered = this.notices
      .filter((notice) => {
        if (params.ministryId && notice.ministryId !== params.ministryId) {
          return false;
        }

        if (params.category && notice.category !== params.category) {
          return false;
        }

        return true;
      })
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

    return params.limit ? filtered.slice(0, params.limit) : filtered;
  }

  public createComplaint(input: CreateComplaintInput): Complaint {
    const timestamp = now();
    const id = uuidv4();

    const complaint: Complaint = {
      id,
      ticketId: `NPL-${Math.floor(Math.random() * 9_000_000 + 1_000_000)}`,
      ministryId: input.ministryId,
      category: input.category,
      message: input.message,
      isAnonymous: input.isAnonymous,
      contactEmail: input.isAnonymous ? undefined : input.contactEmail,
      status: "submitted",
      createdAt: timestamp,
      updatedAt: timestamp
    };

    this.complaints.push(complaint);
    return complaint;
  }

  public findComplaintByTicketId(ticketId: string): Complaint | undefined {
    return this.complaints.find((complaint) => complaint.ticketId === ticketId);
  }

  public updateComplaintStatus(ticketId: string, status: ComplaintStatus): Complaint | undefined {
    const complaint = this.findComplaintByTicketId(ticketId);

    if (!complaint) {
      return undefined;
    }

    complaint.status = status;
    complaint.updatedAt = now();

    return complaint;
  }
}

export const store = new InMemoryStore();
