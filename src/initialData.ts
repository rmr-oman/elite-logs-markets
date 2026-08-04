import { Product, FAQItem, Coupon } from "./types";

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "gvoice-01",
    name: "Google Voice Accounts",
    category: "Virtual Numbers / Messaging Apps",
    subCategory: "Google Voice",
    price: 7.50,
    deliveryType: "Instant",
    stock: 24,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYG_PI2BoqlBvG8jos3q1Mpm_jQ1mf3l4WtNCFa29IlzjRvY6IUfHULDmK7GyXpQAL321YWUioKO112GNF75RURr0gqlDXidUTa0E8g-YWoQ6Yb90Qa0dZaaKwGqRhEHauntTLxWyE62F-ZpoBPQ8fqZGoATBPCfL7uyY7FcbrNKeFbXS-0JpFOMmzVcdUkOYK1U5iSB6BdjlTa7BSGC4tDqk4jeCiSZyHOjLnbjEwUwezJou2iwaecQ",
    description: "Fully verified premium Google Voice accounts with USA numbers. Pre-warmed and ready for call routing, verification codes, and SMS marketing campaigns.",
    features: [
      "Real US phone number included",
      "Instant login access via credentials",
      "Recovery email access included",
      "Clean IP history (No spam history)"
    ],
    specs: {
      "Account Age": "30+ Days Aged",
      "Number Region": "United States (USA)",
      "Access Type": "Email + Password + Recovery",
      "Warranty": "48 Hours Replacement Warranty"
    },
    stockData: [
      "gvoice_user_alpha@gmail.com:GVoicePass_9901:gvoice_rec_1@mail.com | Tel: +1 (201) 555-0192",
      "gvoice_user_beta@gmail.com:GVoicePass_8821:gvoice_rec_2@mail.com | Tel: +1 (312) 555-0143",
      "gvoice_user_gamma@gmail.com:GVoicePass_1244:gvoice_rec_3@mail.com | Tel: +1 (415) 555-0177",
      "gvoice_user_delta@gmail.com:GVoicePass_7761:gvoice_rec_4@mail.com | Tel: +1 (646) 555-0122",
      "gvoice_user_epsilon@gmail.com:GVoicePass_4410:gvoice_rec_5@mail.com | Tel: +1 (305) 555-0118"
    ]
  },
  {
    id: "textnow-01",
    name: "TextNow Aged Accounts",
    category: "Virtual Numbers / Messaging Apps",
    subCategory: "TextNow",
    price: 3.50,
    deliveryType: "Instant",
    stock: 15,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDuQcCLdETlVXXKf_ZBo_rfAd3bInacbvDCaKPYvUg2R7jBCYs1xKU2ICUlr-po2z9qRwk4KGNZGQXiNQzolNwX4eOBfQe0E9_VD_pyXk6rIcPNyuiTbKUTFyXr1zuE4a1YC4lR1HA_U5w0VO76HBfPD5w3utP4YanPtoauRCbkbxb739BqIbdKA1CMoGAu6nyp8P4MuoP5_Y3uBjj5yXloyqshiTaaSoC35GtOzwA-s7XnzkLZTLwMIA",
    description: "Premium aged TextNow accounts ready for instant use. Perfect for bypassing basic virtual phone number verification processes.",
    features: [
      "Pre-selected active USA/UK numbers",
      "Secure login details via premium proxy",
      "Guaranteed inbox availability",
      "Pre-warmed messaging history"
    ],
    specs: {
      "Account Age": "15+ Days Aged",
      "Platform": "iOS / Android / Web Browser",
      "IP Requirement": "USA Proxy recommended",
      "Warranty": "24 Hours Replacement"
    },
    stockData: [
      "textnow_user01:TextNowPass_xyz_9:recovery01@mail.com | Number: +1 (949) 344-9981",
      "textnow_user02:TextNowPass_abc_4:recovery02@mail.com | Number: +1 (310) 887-2244",
      "textnow_user03:TextNowPass_mno_1:recovery03@mail.com | Number: +1 (407) 505-1122"
    ]
  },
  {
    id: "talkatone-01",
    name: "Talkatone High-Authority Accounts",
    category: "Virtual Numbers / Messaging Apps",
    subCategory: "Talkatone",
    price: 8.00,
    deliveryType: "Manual",
    stock: 8,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAKp_alhPZJZ6t568QzEMLqykHU1B9D4MTJ7qPheHaavgO6Hf3BfB2L1oKmXzGhGfVFeUyEbWiGGalVL-RsQ1wzhtpbfUdcTq1jyZqLmUE_h1FYmLgKN2Hak5F90dh09Lt9m08GzBipZBSEob-IfSJtrj8xmbwPuYQOd8tUfYTi5PongUGUATI8Adt9I9s0fsmvVVAP4H79P99NWGHMmfomr4pDqKiN4pWkE_QhVkHmeTABnUd_kej2iQ",
    description: "Manual authority delivery Talkatone accounts. Excellent for high-end activations like WhatsApp Business, Telegram, Signal, and banking OTP bypasses.",
    features: [
      "Dedicated virtual SIM number",
      "Hard-to-block carrier registration",
      "Delivered with setup instructions",
      "1-on-1 Admin login support"
    ],
    specs: {
      "Delivery Time": "10 - 30 Minutes",
      "Account Age": "Fresh & Clean Slate",
      "Carrier Provider": "Premium Voip US Network",
      "Recommended Use": "App verifications"
    }
  },
  {
    id: "whatsapp-usa",
    name: "USA WhatsApp Account (Aged)",
    category: "WhatsApp Accounts",
    subCategory: "USA WhatsApp",
    price: 25.00,
    deliveryType: "Manual",
    stock: 142,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAvn5l2AEnpWjgKjPDyw-JoW4qxG5Fp_kVkii3duKA6GMTPdVWzfqA_UJF6QdhUI9fm6YjuWHHKq_e_YSeozHkAO7hhv4Gpra_wyLSiJpyYWuVYEONn23Iwb534f9Nm9Zq2G04vZdzcooJLN03x0oyJwIVocTSiGrDdFbiBmiDLKU2jzshwL6bacAvnXw-CZ3nDiU8gPqdZtb72IOcjprH3WMhJAiEAS0apIU3mjIGbYlOYzd4-U-vPfg",
    description: "Highly authoritative USA WhatsApp Business accounts. Aged for 6+ months with active chat history (warmed-up) to guarantee maximal delivery rates and avoid instant bans.",
    features: [
      "Aged + High Trust Factor (6+ Months)",
      "Anti-Ban Protected via custom warms",
      "Preloaded session details / verification support",
      "Region: USA (+1 Code)"
    ],
    specs: {
      "Account Age": "6+ Months Aged",
      "IP Reputation": "Residential Clean",
      "Message Limit": "Warmup Tier 3 (Highest authority)",
      "Warranty": "7-Day replacement guarantee if initial login fails"
    }
  },
  {
    id: "whatsapp-uk",
    name: "UK WhatsApp Account (Business ready)",
    category: "WhatsApp Accounts",
    subCategory: "UK WhatsApp",
    price: 22.00,
    deliveryType: "Manual",
    stock: 95,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBn97tOvBH2fhltefY3ejj8fU6RqsXgr5MNI1Pni903kWUxZG7RlJuo3LHIhGD_PZ36V11N32pjQHPWQgwTgyMhXLpTMB_GqyDClu_EdXnt-DG60GaEynX9rTccd0i77sLjKDUyVIHEPu9g7v2M4iehloNPfQ_r-GLiNpjB-beU_h0GYTOlC06Gp498RtwMwyB1Hsv3LedJy41sPZxE7yCcunhI0odGCvZsX_Do14Z6fsVpcVdRxAB-lg",
    description: "Premium United Kingdom (+44) WhatsApp accounts designed for customer service and international sales outreach. Pre-configured and verified manually.",
    features: [
      "UK Number (+44) included",
      "Manual setup support with verification code matching",
      "Perfect for mass DM routing and high-volume business usage",
      "Complete registration data"
    ],
    specs: {
      "Account Type": "WhatsApp Business/Personal",
      "Delivery Mode": "Manual OTP match / Session transfer",
      "Setup Duration": "15 Minutes Average",
      "Region": "United Kingdom (UK)"
    }
  },
  {
    id: "telegram-usa",
    name: "USA Telegram Warmed Accounts",
    category: "Telegram Accounts",
    subCategory: "USA Telegram",
    price: 12.00,
    deliveryType: "Manual",
    stock: 60,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCCsj4-lwEzTYvi2kRioO-Hxboipk5-LDrSdl0Amawn9FNxXkK5DLs4as9NAxyV1Zy4qIgUN8GzGnqasM-B0OOZzf14eWV_adsgdC0WS8UrWdFZD0ErTU5BTyJVokg3IdHw_t4lNeQL8NxtOCwR-CSeMkkLveVId_QtwNiWgTE4Ydfv9b9JJ60DUDzAgdF70FYMzqH5RTK75JA0hHv7mSmilYSg4l1RH5TXOxIX7L3hDO72rB-ecHfMQ",
    description: "USA Telegram accounts registered on high-quality real US SIMs. Ready for mass group adding, scraping, or anonymous elite corporate networking.",
    features: [
      "TGP / TData session format compatible",
      "Aged over 3 months",
      "SpamInfoBot verified: 0 block score",
      "Includes 2FA access code"
    ],
    specs: {
      "Format": "TData Session or .session + JSON",
      "Aged": "90+ Days",
      "SIM Type": "Real Physical SIM USA",
      "Anti-Spam Status": "100% Green / Safe"
    }
  },
  {
    id: "gmail-fresh",
    name: "Fresh Gmail Account (2024 PVA)",
    category: "Email Accounts",
    subCategory: "Gmail Fresh",
    price: 1.50,
    deliveryType: "Instant",
    stock: 1250,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDbNCwWPTsjS7icl6w7vMiPG79RDPDomAiF8ZGFNQGM_K5tUUCs2mzWhMCMiLeWprGZF4zDlJ1OQdbkxFBgeW3FxN0RbRK7tXtoxMZ3Zrjdzxzg89X4VKkYczlgYmrAfbkI9RVcNH9UG1JkKGEdYmWhpOgOKtcRPd-7x8vYdryAO0nJSuqpUau0ClXlXRqSSdQHII078n_-4MreHmVg1lsTuzdaVZcmk1LyLvVDdFFD-Osgih4pXHgt_A",
    description: "Phone Verified (PVA) fresh Gmail accounts. Created manually using unique premium residential IPs. Absolutely no login lock issues.",
    features: [
      "100% Hand-Created and PVA Verified",
      "Unique recovery email attached",
      "No phone number verification required on login",
      "Perfect for creating social profiles, gaming, or crypto accounts"
    ],
    specs: {
      "Account Age": "Fresh (Less than 7 Days)",
      "Format": "Email : Password : RecoveryEmail",
      "Verification Method": "Real SIM verified",
      "IP Location": "Mixed (Global High-Reputation)"
    },
    stockData: [
      "fresh.gmail.001@gmail.com:PassGmail_001a:rec_mail_001@outlook.com",
      "fresh.gmail.002@gmail.com:PassGmail_002b:rec_mail_002@outlook.com",
      "fresh.gmail.003@gmail.com:PassGmail_003c:rec_mail_003@outlook.com",
      "fresh.gmail.004@gmail.com:PassGmail_004d:rec_mail_004@outlook.com",
      "fresh.gmail.005@gmail.com:PassGmail_005e:rec_mail_005@outlook.com",
      "fresh.gmail.006@gmail.com:PassGmail_006f:rec_mail_006@outlook.com",
      "fresh.gmail.007@gmail.com:PassGmail_007g:rec_mail_007@outlook.com"
    ]
  },
  {
    id: "apple-id-usa",
    name: "USA Apple ID (Pre-Verified)",
    category: "Apple Services",
    subCategory: "Apple ID Fresh",
    price: 5.00,
    deliveryType: "Instant",
    stock: 45,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCBFniNP6F8lmAHtc1kCrIsKHZRRT5jjjqNV4b5Af2tvsHXjS40ETLwEFDNSkuQJlJfs0VRKbhYPgB9Mjv1eW-AyLol3VywLHIUd85CJzHmE_7vcEarIFvR11DYdRUzWy297cQd14Y71_xy-CSBN3vscnHe6OvwVePR0-xpPvyax94pcU2cgnJ5q_IA-PttlHv9RaLVq6mnFMqEKmrXkRhSnzGv2lfTBKBRSmgo52z4yyzSxtJ5ox8kzg",
    description: "Fully registered and verified USA region Apple IDs. Easily access the US App Store, purchase regional apps, download games not available in Nigeria, and log into iCloud securely.",
    features: [
      "USA Region pre-configured",
      "Full credentials including 3 security questions/answers",
      "Instant App Store login",
      "Preloaded free subscription slots compatible"
    ],
    specs: {
      "Region": "United States (USA)",
      "iCloud Status": "Active & Free Tier",
      "Questions Included": "Security Q1, Q2, Q3 Answers attached",
      "Format": "AppleID : Password : Q1 : A1 : Q2 : A2"
    },
    stockData: [
      "apple.us.alpha@icloud.com:AppleIDPass_99a! | Q1: First Pet? A1: Titan | Q2: Car? A2: Mustang | Q3: Town? A3: Miami",
      "apple.us.beta@icloud.com:AppleIDPass_88b! | Q1: First Pet? A1: Zeus | Q2: Car? A2: Corvette | Q3: Town? A3: Austin",
      "apple.us.gamma@icloud.com:AppleIDPass_77c! | Q1: First Pet? A1: Sparky | Q2: Car? A2: Charger | Q3: Town? A3: Seattle"
    ]
  },
  {
    id: "otp-bypass",
    name: "Global SMS OTP Bypass Token",
    category: "OTP & Verification Services",
    subCategory: "OTP Verification (General)",
    price: 12.50,
    deliveryType: "Manual",
    stock: 150,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCD3ZKvzul4iKMRoHhcJFFw0S1BohNYzR2SIlK8OwT701oO5L7pf-Ffjy8IIlmaQAXHInbOYe0dRwCOTWdi-5bTF69h3qEBBhaxCT9HqObTVR3ZLfo-EOI3wjCw909bkXLzyRe71-AF6sMRWGlS8UJXvsW19qAopiS6c1U8xq91o6Tn-n4CQLppGPrj4u0cGlonA6StA0jsJfNkag-0MUaFLQKWYU2KzlpVuUovi7C_-5KxBfJEBLSKdA",
    description: "SMS OTP verification service for premium applications (Uber, WhatsApp, PayPal, Tinder, Binance, Coinbase, local banks). Buy the slot and match with the active admin for real-time OTP injection.",
    features: [
      "High bypass success rate (99.2%)",
      "No account credentials required",
      "Fast instant code delivery",
      "Global carrier lists (USA, UK, Canada, Nigeria, etc.)"
    ],
    specs: {
      "Active Window": "20 Minutes session time",
      "Supported Platforms": "Almost all web apps/mobile services",
      "Interface": "WhatsApp Admin Live Inject",
      "Refund Policy": "Full credit back if verification fails"
    }
  },
  {
    id: "nordvpn-2y",
    name: "NordVPN Premium 2-Year License",
    category: "VPN & Proxy Services",
    subCategory: "NordVPN",
    price: 49.00,
    deliveryType: "Instant",
    stock: 12,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDuQcCLdETlVXXKf_ZBo_rfAd3bInacbvDCaKPYvUg2R7jBCYs1xKU2ICUlr-po2z9qRwk4KGNZGQXiNQzolNwX4eOBfQe0E9_VD_pyXk6rIcPNyuiTbKUTFyXr1zuE4a1YC4lR1HA_U5w0VO76HBfPD5w3utP4YanPtoauRCbkbxb739BqIbdKA1CMoGAu6nyp8P4MuoP5_Y3uBjj5yXloyqshiTaaSoC35GtOzwA-s7XnzkLZTLwMIA",
    description: "NordVPN private accounts with 2 years of fully active premium subscription. Safeguard your IP address, bypass ISP speed throttles, and access unrestricted geo-blocked digital markets worldwide.",
    features: [
      "Double VPN and CyberSec security features",
      "Bypasses major firewalls & local IP filters",
      "Simultaneous connection on up to 6 devices",
      "High speed servers across 60 countries"
    ],
    specs: {
      "License Validity": "2 Full Years Guaranteed",
      "Access Format": "Username : Password login link",
      "Platform": "Windows / macOS / Android / iOS / Linux",
      "Bandwidth": "Unlimited high speed bandwidth"
    },
    stockData: [
      "nordvpn_user_992@nordmember.com:NordForce_2026_xyz! | Expires: April 2028",
      "nordvpn_user_110@nordmember.com:NordShield_Secure99! | Expires: June 2028",
      "nordvpn_user_872@nordmember.com:NordGhost_Ultimate77@ | Expires: Sept 2028"
    ]
  },
  {
    id: "expressvpn-1y",
    name: "ExpressVPN Private 1-Year Subscription",
    category: "VPN & Proxy Services",
    subCategory: "ExpressVPN",
    price: 39.00,
    deliveryType: "Instant",
    stock: 7,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAKp_alhPZJZ6t568QzEMLqykHU1B9D4MTJ7qPheHaavgO6Hf3BfB2L1oKmXzGhGfVFeUyEbWiGGalVL-RsQ1wzhtpbfUdcTq1jyZqLmUE_h1FYmLgKN2Hak5F90dh09Lt9m08GzBipZBSEob-IfSJtrj8xmbwPuYQOd8tUfYTi5PongUGUATI8Adt9I9s0fsmvVVAP4H79P99NWGHMmfomr4pDqKiN4pWkE_QhVkHmeTABnUd_kej2iQ",
    description: "ExpressVPN premium accounts with active subscription. Widely regarded as the fastest VPN for heavy download sessions and security-focused professionals.",
    features: [
      "Military-grade AES-256 encryption",
      "Optimized for light-speed protocols (Lightway)",
      "Zero connection activity logs",
      "94 countries premium coverage"
    ],
    specs: {
      "License Validity": "1 Full Year",
      "Access Format": "Activation Key / Credentials link",
      "Device Limit": "Up to 5 active systems",
      "Auto-Reconnect": "Yes, network lock support"
    },
    stockData: [
      "expvpn_user_alpha@express.com:ExpressPower990! | Activation Key: EXPR-XXXX-YYYY-ZZZZ",
      "expvpn_user_beta@express.com:ExpressGhost114! | Activation Key: EXPR-AAAA-BBBB-CCCC"
    ]
  }
];

export const INITIAL_FAQS: FAQItem[] = [
  {
    question: "What is Elite Logs Market?",
    answer: "Elite Logs Market is a premium marketplace for verified digital assets, high-authority logs, warmed messaging accounts (WhatsApp, Telegram), virtual numbers, phone-verified email accounts, and premium VPN subscription profiles.",
    category: "General"
  },
  {
    question: "How do I receive my purchased products?",
    answer: "Products are categorized into two: 'Instant Delivery' products are automated and will instantly show up on your Order Tracking Page and Order History with their full credentials the second your payment screenshot is approved. 'Manual Delivery' products (like active WhatsApp/Telegram accounts) require active carrier handshakes, which our Admin manually activates and delivers to you via the customer dashboard or support chat within 10-30 minutes.",
    category: "Delivery"
  },
  {
    question: "Which payment methods are accepted?",
    answer: "We support bKash and Nagad for regional payments, and USDT (TRC20 Network) for international, secure, and fast cryptocurrency transfers. Simply copy the wallet/number displayed on checkout, send the exact total amount, take a screenshot of the confirmation page, and upload it.",
    category: "Payment"
  },
  {
    question: "Do you offer a replacement guarantee?",
    answer: "Yes, we build trust instantly. All fresh Gmails have a standard lock-free warranty, and messaging accounts carry a 7-day warranty. If any account fails to log in initially, submit a replacement request via support, and the Admin will supply a brand new log instantly after verification.",
    category: "General"
  },
  {
    question: "How does the wallet system work?",
    answer: "Registered users have an active wallet. You can load funds into your wallet to make instant, hassle-free 1-click checkout purchases on all premium items.",
    category: "Wallet"
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  { code: "ELITE20", discountPercent: 20 },
  { code: "NIGERIA10", discountPercent: 10 },
  { code: "CYBER50", discountPercent: 50 }
];
