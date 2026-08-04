export type Category = string;

export type DeliveryType = "Instant" | "Manual";

export type PaymentMethod = string;

export type OrderStatus = "Pending" | "Processing" | "Completed";

export interface Product {
  id: string;
  name: string;
  category: Category;
  subCategory: string;
  price: number;
  deliveryType: DeliveryType;
  stock: number;
  imageUrl: string;
  description: string;
  features: string[];
  specs: Record<string, string>;
  stockData?: string[]; // Credentials list for instant products
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  deliveryType: DeliveryType;
  imageUrl: string;
}

export interface Order {
  id: string;
  date: string;
  customerName: string;
  customerEmail: string;
  customerSocial: string; // WhatsApp or Telegram contact
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  totalPrice: number;
  paymentMethod: PaymentMethod;
  paymentScreenshot?: string; // base64 or local image file url
  status: OrderStatus;
  deliveredCredentials?: string[]; // stock delivered on complete
  internalNotes?: string;
  couponUsed?: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
}

export interface UserProfile {
  email: string;
  username: string;
  fullName?: string;
  avatarUrl?: string;
  phone?: string;
  country?: string;
  bio?: string;
  walletBalance: number;
  isAdmin: boolean;
  referralCode: string;
  referredBy?: string;
  isGuest?: boolean;
  twoFactorEnabled?: boolean;
  createdAt?: string;
}

export interface RegisteredUser {
  email: string;
  username: string;
  fullName?: string;
  avatarUrl?: string;
  phone?: string;
  country?: string;
  bio?: string;
  passwordVal: string;
  walletBalance: number;
  isAdmin: boolean;
  referralCode: string;
  twoFactorEnabled?: boolean;
  isVerified?: boolean;
  otpCode?: string;
  createdAt?: string;
}

export interface FAQItem {
  id?: string;
  question: string;
  answer: string;
  category: string;
}

export interface PaymentGateway {
  id: string;
  name: string; // e.g. "bKash", "Nagad", "USDT (TRC20)"
  type: string; // e.g. "Merchant Number", "Personal Wallet", "TRC20 Address"
  details: string; // e.g. "+88017XXXXXXXX" or "TYZ1pX..."
  instructions: string; // e.g. "Send money to this line and upload screenshot..."
  active: boolean;
}

export interface PresetCategory {
  name: string;
  emoji: string;
  subcategories: string[];
}

export const PRESET_CATEGORIES: PresetCategory[] = [
  {
    name: "Virtual Numbers / Messaging Apps",
    emoji: "📱",
    subcategories: [
      "Google Voice", "TextNow", "TextPlus", "Talkatone", "TextMe", "2ndLine",
      "Dingtone", "Burner App", "Numero eSIM", "Hushed", "Sideline", "PingMe",
      "TextFree", "Nextplus", "Flyp"
    ]
  },
  {
    name: "WhatsApp Accounts",
    emoji: "💬",
    subcategories: [
      "USA WhatsApp", "UK WhatsApp", "Canada WhatsApp", "Nigeria WhatsApp",
      "Business WhatsApp", "Verified WhatsApp", "Aged WhatsApp"
    ]
  },
  {
    name: "Telegram Accounts",
    emoji: "✈️",
    subcategories: [
      "USA Telegram", "UK Telegram", "Nigeria Telegram", "Telegram Aged",
      "Telegram Fresh", "Telegram Verified"
    ]
  },
  {
    name: "Email Accounts",
    emoji: "📧",
    subcategories: [
      "Gmail Fresh", "Gmail Aged", "Gmail Verified", "Gmail PVA", "Outlook Account", "Yahoo Mail"
    ]
  },
  {
    name: "Apple Services",
    emoji: "🍏",
    subcategories: [
      "Apple ID Fresh", "Apple ID Verified", "iCloud Account"
    ]
  },
  {
    name: "OTP & Verification Services",
    emoji: "🔐",
    subcategories: [
      "OTP Verification (General)", "WhatsApp OTP", "Telegram OTP", "Google OTP",
      "Custom OTP Request", "Bulk OTP Service"
    ]
  },
  {
    name: "VPN & Proxy Services",
    emoji: "🌐",
    subcategories: [
      "ExpressVPN", "NordVPN", "HMA VPN", "Surfshark", "Proton VPN",
      "Private Internet Access", "Residential Proxy", "Datacenter Proxy"
    ]
  }
];

export interface TopUpRequest {
  id: string;
  email: string;
  username: string;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  screenshotUrl?: string;
  date: string;
  status: "Pending" | "Approved" | "Rejected";
}

export interface ChatMessage {
  id?: string;
  conversationId: string;
  senderEmail: string;
  senderName: string;
  message: string;
  timestamp: string;
  isAdmin: boolean;
}

export interface SupportSettings {
  telegramLink: string;
  whatsappLink: string;
  telegramGroupLink?: string;
  whatsappChannelLink?: string;
}



