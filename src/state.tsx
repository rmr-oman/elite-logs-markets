import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, Order, Coupon, UserProfile, OrderStatus, PaymentMethod, PaymentGateway, TopUpRequest, RegisteredUser, ChatMessage, SupportSettings, FAQItem } from "./types";
import { INITIAL_PRODUCTS, INITIAL_COUPONS, INITIAL_FAQS } from "./initialData";
import { db, auth } from "./firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup,
  GoogleAuthProvider,
  sendEmailVerification, 
  signOut, 
  updateProfile,
  updatePassword
} from "firebase/auth";
import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  getDocs,
  getDoc
} from "firebase/firestore";

interface AppState {
  products: Product[];
  orders: Order[];
  coupons: Coupon[];
  currentUser: UserProfile;
  cart: Array<{ productId: string; quantity: number }>;
  activeView: string; // "home" | "shop" | "product-details" | "cart" | "checkout" | "dashboard" | "tracking" | "faq" | "admin" | "contact"
  selectedProductId: string | null;
  activeTrackingOrderId: string | null;
  activeCouponCode: string | null;
  paymentGateways: PaymentGateway[];
  topUpRequests: TopUpRequest[];
  registeredUsers: RegisteredUser[];
  chatMessages: ChatMessage[];
  
  // Cart Actions
  addToCart: (productId: string, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  
  // Checkout & Order Actions
  placeOrder: (details: {
    name: string;
    email: string;
    social: string;
    paymentMethod: PaymentMethod;
    screenshotUrl?: string;
  }) => Order;
  
  // Admin Panel Actions
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  addManualCredentials: (orderId: string, credentials: string[]) => void;
  addDeliveredCredentials: (orderId: string, credentials: string[]) => void;
  updateOrderNotes: (orderId: string, notes: string) => void;
  addProduct: (product: Omit<Product, "id">) => void;
  addNewProduct: (product: Omit<Product, "id">) => void;
  editProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  restockProduct: (productId: string, additionalStock: number, newStockData?: string[]) => void;
  updateStock: (productId: string, stock: number) => void;
  generateMockOrder: () => void;
  addPaymentGateway: (gateway: Omit<PaymentGateway, "id">) => void;
  updatePaymentGateway: (gateway: PaymentGateway) => void;
  deletePaymentGateway: (id: string) => void;
  
  // User Actions
  setView: (view: string) => void;
  selectProduct: (productId: string | null) => void;
  activeDashboardTab: "overview" | "wallet" | "profile" | "security" | "orders" | "referral";
  setDashboardTab: (tab: "overview" | "wallet" | "profile" | "security" | "orders" | "referral") => void;
  trackOrder: (orderId: string | null) => void;
  toggleAdminMode: () => void;
  addWalletFunds: (amount: number) => void;
  requestTopUp: (details: { amount: number; paymentMethod: string; transactionId: string; screenshotUrl?: string }) => void;
  approveTopUp: (requestId: string) => void;
  rejectTopUp: (requestId: string) => void;
  registerUser: (username: string, email: string, passwordVal: string, referredBy?: string) => Promise<{ success: boolean; message: string; email?: string; otpCode?: string }>;
  loginUser: (email: string, passwordVal: string) => Promise<{ success: boolean; message: string; isAdmin?: boolean; requiresOtp?: boolean; email?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; message: string; isAdmin?: boolean }>;
  verifyUserOtp: (email: string, enteredCode: string) => Promise<{ success: boolean; message: string }>;
  resendUserOtp: (email: string) => Promise<{ success: boolean; message: string; otpCode?: string }>;
  requestPasswordResetOtp: (emailOrUsername: string) => Promise<{ success: boolean; message: string; email?: string }>;
  verifyResetOtp: (email: string, otpCode: string) => Promise<{ success: boolean; message: string }>;
  resetPasswordWithOtp: (email: string, otpCode: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  resendVerificationEmail: () => Promise<{ success: boolean; message: string }>;
  logOut: () => void;
  sendChatMessage: (messageText: string, targetConversationId?: string) => Promise<void>;
  supportSettings: SupportSettings;
  updateSupportSettings: (settings: SupportSettings) => Promise<void>;
  faqs: FAQItem[];
  addFaqItem: (question: string, answer: string, category: string) => Promise<void>;
  updateFaqItem: (id: string, question: string, answer: string, category: string) => Promise<void>;
  deleteFaqItem: (id: string) => Promise<void>;
  adjustUserBalance: (email: string, newBalance: number) => Promise<void>;
  toggleUserAdmin: (email: string, isAdmin: boolean) => Promise<void>;
  updateUserProfile: (updates: {
    fullName?: string;
    username?: string;
    phone?: string;
    avatarUrl?: string;
    bio?: string;
    passwordVal?: string;
    twoFactorEnabled?: boolean;
  }) => Promise<{ success: boolean; message: string }>;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const local = localStorage.getItem("elite_logs_user");
    return local ? JSON.parse(local) : {
      email: "rahatislamroman@gmail.com",
      username: "rahatroman",
      walletBalance: 150.00,
      isAdmin: false,
      referralCode: "ELITE-998A"
    };
  });
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [cart, setCart] = useState<Array<{ productId: string; quantity: number }>>(() => {
    const local = localStorage.getItem("elite_logs_cart");
    return local ? JSON.parse(local) : [];
  });
  const [activeView, setView] = useState<string>("home");
  const [activeDashboardTab, setDashboardTab] = useState<"overview" | "wallet" | "profile" | "security" | "orders" | "referral">("overview");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string | null>(null);
  const [activeCouponCode, setActiveCouponCode] = useState<string | null>(null);
  const [paymentGateways, setPaymentGateways] = useState<PaymentGateway[]>([]);
  const [topUpRequests, setTopUpRequests] = useState<TopUpRequest[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [supportSettings, setSupportSettings] = useState<SupportSettings>({
    telegramLink: "https://t.me/",
    whatsappLink: "https://wa.me/"
  });
  const [faqs, setFaqs] = useState<FAQItem[]>([]);

  // Real-time Firestore synchronization
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "faqs"), (snapshot) => {
      if (snapshot.empty) {
        INITIAL_FAQS.forEach(async (faq) => {
          await addDoc(collection(db, "faqs"), faq);
        });
      } else {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FAQItem));
        setFaqs(list);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "settings", "support"), (docSnap) => {
      if (docSnap.exists()) {
        setSupportSettings(docSnap.data() as SupportSettings);
      } else {
        const defaultSettings = {
          telegramLink: "https://t.me/",
          whatsappLink: "https://wa.me/"
        };
        setDoc(doc(db, "settings", "support"), defaultSettings);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      if (snapshot.empty) {
        // seed products
        INITIAL_PRODUCTS.forEach(async (p) => {
          await setDoc(doc(db, "products", p.id), p);
        });
      } else {
        const list: Product[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as Product);
        });
        setProducts(list);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "orders"), (snapshot) => {
      const list: Order[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as Order);
      });
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setOrders(list);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "registered_users"), (snapshot) => {
      if (snapshot.empty) {
        const defaultUsers = [
          {
            email: "rahatislamroman@gmail.com",
            username: "rahatroman",
            passwordVal: "rahat123",
            walletBalance: 150.00,
            isAdmin: false,
            referralCode: "ELITE-998A"
          },
          {
            email: "admin@elitelogs.net",
            username: "Admin",
            passwordVal: "admin123",
            walletBalance: 0.00,
            isAdmin: true,
            referralCode: "ELITE-ADMIN"
          }
        ];
        defaultUsers.forEach(async (u) => {
          await setDoc(doc(db, "registered_users", u.email.toLowerCase()), u);
        });
      } else {
        const list: RegisteredUser[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as RegisteredUser);
        });
        setRegisteredUsers(list);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "payment_gateways"), (snapshot) => {
      if (snapshot.empty) {
        const defaultGateways = [
          {
            id: "gateway-bkash",
            name: "bKash",
            type: "Merchant Number",
            details: "+880 1711-223344",
            instructions: "Initiate bKash 'Send Money' or 'Merchant Pay' to the agent line. Complete the transaction, capture a screenshot of the confirmation SMS or popup with TxnID, and upload below.",
            active: true
          },
          {
            id: "gateway-nagad",
            name: "Nagad",
            type: "Personal Wallet",
            details: "+880 1911-556677",
            instructions: "Send the total amount to the Nagad cash line. Capture a screenshot with the reference field showing your email address, and upload below.",
            active: true
          },
          {
            id: "gateway-usdt",
            name: "USDT (TRC20)",
            type: "TRC20 Wallet Address",
            details: "TYZ1pXfBf6tY3L7b2B8M9wX3U4H5oE6rWz",
            instructions: "Transfer the exact USD total on the TRC20 network. Double check the address carefully. Take a screenshot of your Binance, Trust Wallet, or Ledger confirmation, and upload below.",
            active: true
          }
        ];
        defaultGateways.forEach(async (g) => {
          await setDoc(doc(db, "payment_gateways", g.id), g);
        });
      } else {
        const list: PaymentGateway[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as PaymentGateway);
        });
        setPaymentGateways(list);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "topup_requests"), (snapshot) => {
      if (snapshot.empty) {
        const defaultTopups = [
          {
            id: "TOP-88219-ELITE",
            email: "buyer@elitelogs.net",
            username: "EliteMember",
            amount: 50.00,
            paymentMethod: "bKash",
            transactionId: "BK829A1X93",
            date: new Date(Date.now() - 3600000 * 3).toISOString(),
            status: "Pending",
            screenshotUrl: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=600&auto=format&fit=crop"
          },
          {
            id: "TOP-90311-ELITE",
            email: "crypto_whale@gmail.com",
            username: "CryptoWhale",
            amount: 250.00,
            paymentMethod: "USDT (TRC20)",
            transactionId: "0x8fa3729b1d8c...",
            date: new Date(Date.now() - 3600000 * 12).toISOString(),
            status: "Approved",
            screenshotUrl: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=600&auto=format&fit=crop"
          }
        ];
        defaultTopups.forEach(async (t) => {
          await setDoc(doc(db, "topup_requests", t.id), t);
        });
      } else {
        const list: TopUpRequest[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as TopUpRequest);
        });
        list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setTopUpRequests(list);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "chat_messages"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: ChatMessage[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as ChatMessage);
      });
      setChatMessages(list);
    });
    return () => unsubscribe();
  }, []);

  // Sync currentUser wallet balance and profile data from registered_users real-time
  useEffect(() => {
    if (currentUser && !currentUser.isGuest && currentUser.email) {
      const userDocRef = doc(db, "registered_users", currentUser.email.toLowerCase());
      const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data() as RegisteredUser;
          setCurrentUser(prev => {
            const updated = {
              ...prev,
              walletBalance: userData.walletBalance ?? prev.walletBalance,
              isAdmin: userData.isAdmin ?? prev.isAdmin,
              username: userData.username || prev.username,
              fullName: userData.fullName || prev.fullName,
              avatarUrl: userData.avatarUrl || prev.avatarUrl,
              phone: userData.phone || prev.phone,
              bio: userData.bio || prev.bio,
              twoFactorEnabled: userData.twoFactorEnabled ?? prev.twoFactorEnabled,
              createdAt: userData.createdAt || prev.createdAt
            };
            localStorage.setItem("elite_logs_user", JSON.stringify(updated));
            return updated;
          });
        } else {
          // Document does not exist in Firestore yet! Auto-create it so setDoc/merge or updateDoc never fails!
          const newUserDoc: RegisteredUser = {
            email: currentUser.email.trim(),
            username: currentUser.username || currentUser.email.split("@")[0],
            passwordVal: "",
            walletBalance: currentUser.walletBalance || 0.00,
            isAdmin: currentUser.isAdmin || false,
            referralCode: currentUser.referralCode || ("ELITE-" + Math.floor(1000 + Math.random() * 9000) + "X")
          };
          setDoc(userDocRef, newUserDoc, { merge: true });
        }
      });
      return () => unsubscribe();
    }
  }, [currentUser?.email, currentUser?.isGuest]);

  // Sync currentUser changes to localStorage
  useEffect(() => {
    localStorage.setItem("elite_logs_user", JSON.stringify(currentUser));
  }, [currentUser]);

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem("elite_logs_cart", JSON.stringify(cart));
  }, [cart]);

  // Cart Management
  const addToCart = (productId: string, qty: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item => 
          item.productId === productId 
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { productId, quantity: qty }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.productId === productId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
    setActiveCouponCode(null);
  };

  const applyCoupon = (code: string): boolean => {
    const found = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (found) {
      setActiveCouponCode(found.code);
      return true;
    }
    return false;
  };

  const removeCoupon = () => {
    setActiveCouponCode(null);
  };

  // Place Order Action
  const placeOrder = (details: {
    name: string;
    email: string;
    social: string;
    paymentMethod: PaymentMethod;
    screenshotUrl?: string;
  }): Order => {
    const subtotal = cart.reduce((acc, item) => {
      const p = products.find(prod => prod.id === item.productId);
      return acc + (p ? p.price * item.quantity : 0);
    }, 0);

    let discountAmount = 0;
    if (activeCouponCode) {
      const coupon = coupons.find(c => c.code === activeCouponCode);
      if (coupon) {
        discountAmount = (subtotal * coupon.discountPercent) / 100;
      }
    }

    const totalPrice = Math.max(0, subtotal - discountAmount);

    const orderItems = cart.map(item => {
      const p = products.find(prod => prod.id === item.productId)!;
      return {
        productId: p.id,
        name: p.name,
        price: p.price,
        quantity: item.quantity,
        deliveryType: p.deliveryType,
        imageUrl: p.imageUrl
      };
    });

    const orderId = "TXN-" + Math.floor(100000 + Math.random() * 900000) + "-ELITE";
    const newOrder: Order = {
      id: orderId,
      date: new Date().toISOString(),
      customerName: details.name,
      customerEmail: details.email,
      customerSocial: details.social,
      items: orderItems,
      subtotal,
      discountAmount,
      totalPrice,
      paymentMethod: details.paymentMethod,
      paymentScreenshot: details.screenshotUrl || "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=600&auto=format&fit=crop",
      status: details.paymentMethod === "Wallet Balance" ? "Processing" : "Pending",
      couponUsed: activeCouponCode || undefined
    };

    if (details.paymentMethod === "Wallet Balance" && !currentUser.isGuest) {
      const updatedBalance = Math.max(0, currentUser.walletBalance - totalPrice);
      setDoc(doc(db, "registered_users", currentUser.email.toLowerCase()), { walletBalance: updatedBalance }, { merge: true });
      setCurrentUser(user => ({ ...user, walletBalance: updatedBalance }));
    }

    // Deduct stock levels in Firestore
    cart.forEach(async (item) => {
      const p = products.find(prod => prod.id === item.productId);
      if (p) {
        await setDoc(doc(db, "products", p.id), { stock: Math.max(0, p.stock - item.quantity) }, { merge: true });
      }
    });

    // Save order to Firestore
    setDoc(doc(db, "orders", orderId), newOrder);

    // Clear cart
    clearCart();
    
    // Auto-progress system
    const allInstant = orderItems.every(i => i.deliveryType === "Instant");
    if (allInstant) {
      setTimeout(async () => {
        const delivered: string[] = [];
        newOrder.items.forEach(item => {
          const p = products.find(prod => prod.id === item.productId);
          if (p && p.stockData && p.stockData.length > 0) {
            const itemsToDeliver = p.stockData.slice(0, item.quantity);
            delivered.push(...itemsToDeliver.map(str => `${p.name} Credential: ${str}`));
          } else {
            delivered.push(`${item.name}: LICENSE-ELITE-${Math.floor(100000 + Math.random() * 900000)}`);
          }
        });
        await setDoc(doc(db, "orders", orderId), {
          status: "Completed",
          deliveredCredentials: delivered,
          internalNotes: "Auto-approved and delivered instant digital keys."
        }, { merge: true });
      }, 5000);
    } else {
      setTimeout(async () => {
        await setDoc(doc(db, "orders", orderId), {
          status: "Processing",
          internalNotes: "Admin is connecting with carrier to acquire active virtual token."
        }, { merge: true });
      }, 6000);
    }

    return newOrder;
  };

  // Admin Actions
  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    let delivered = order.deliveredCredentials || [];
    if (status === "Completed" && delivered.length === 0) {
      order.items.forEach(item => {
        const p = products.find(prod => prod.id === item.productId);
        if (p && p.stockData && p.stockData.length > 0) {
          const itemsToDeliver = p.stockData.slice(0, item.quantity);
          delivered.push(...itemsToDeliver.map(str => `${p.name}: ${str}`));
        } else {
          delivered.push(`${item.name} Login: admin_delivered_${Math.floor(Math.random() * 9000)}@elitelogs.net : password_warmed : token_88291a`);
        }
      });
    }

    await setDoc(doc(db, "orders", orderId), {
      status,
      deliveredCredentials: status === "Completed" ? delivered : order.deliveredCredentials 
    }, { merge: true });
  };

  const addManualCredentials = async (orderId: string, credentials: string[]) => {
    await setDoc(doc(db, "orders", orderId), {
      deliveredCredentials: credentials,
      status: "Completed"
    }, { merge: true });
  };

  const addDeliveredCredentials = addManualCredentials;

  const updateOrderNotes = async (orderId: string, notes: string) => {
    await setDoc(doc(db, "orders", orderId), { internalNotes: notes }, { merge: true });
  };

  const addProduct = async (newP: Omit<Product, "id">) => {
    const id = "PROD-" + Math.floor(1000 + Math.random() * 9000);
    await setDoc(doc(db, "products", id), { ...newP, id });
  };

  const addNewProduct = addProduct;

  const editProduct = async (updatedP: Product) => {
    await setDoc(doc(db, "products", updatedP.id), updatedP);
  };

  const deleteProduct = async (productId: string) => {
    await deleteDoc(doc(db, "products", productId));
  };

  const restockProduct = async (productId: string, additionalStock: number, newStockData?: string[]) => {
    const p = products.find(prod => prod.id === productId);
    if (!p) return;
    const updatedStockData = p.stockData ? [...p.stockData, ...(newStockData || [])] : (newStockData || []);
    await setDoc(doc(db, "products", productId), {
      stock: p.stock + additionalStock,
      stockData: updatedStockData
    }, { merge: true });
  };

  const updateStock = async (productId: string, stock: number) => {
    await setDoc(doc(db, "products", productId), { stock }, { merge: true });
  };

  const generateMockOrder = async () => {
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    if (!randomProduct) return;
    const randomTxnId = "TXN-" + Math.floor(100000 + Math.random() * 900000) + "-ELITE";
    const paymentScreenshot = "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=600&auto=format&fit=crop";
    const names = ["Alex Rivera", "Sophia Vance", "Zayn Malik", "Nolan Grayson", "Freya Croft"];
    const emails = ["alex@rivera.io", "sophia@outlook.com", "zayn@gmail.com", "nolan@grayson.net", "freya@croft.co"];
    const socials = ["@alex_tg", "+14159828811", "@sophia_tg", "@nolan_g", "@freyacroft"];
    const paymentMethods: PaymentMethod[] = ["bKash", "Nagad", "USDT (TRC20)"];

    const qty = Math.floor(Math.random() * 2) + 1;
    const item = {
      productId: randomProduct.id,
      name: randomProduct.name,
      price: randomProduct.price,
      quantity: qty,
      deliveryType: randomProduct.deliveryType,
      imageUrl: randomProduct.imageUrl
    };

    const subtotal = item.price * qty;
    const totalPrice = subtotal;

    const newOrder: Order = {
      id: randomTxnId,
      date: new Date().toISOString(),
      customerName: names[Math.floor(Math.random() * names.length)],
      customerEmail: emails[Math.floor(Math.random() * emails.length)],
      customerSocial: socials[Math.floor(Math.random() * socials.length)],
      items: [item],
      subtotal,
      discountAmount: 0,
      totalPrice,
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      paymentScreenshot,
      status: "Pending"
    };

    await setDoc(doc(db, "orders", randomTxnId), newOrder);
  };

  const addPaymentGateway = async (gateway: Omit<PaymentGateway, "id">) => {
    const id = "gateway-" + Date.now();
    await setDoc(doc(db, "payment_gateways", id), { ...gateway, id });
  };

  const updatePaymentGateway = async (updated: PaymentGateway) => {
    await setDoc(doc(db, "payment_gateways", updated.id), updated);
  };

  const deletePaymentGateway = async (id: string) => {
    await deleteDoc(doc(db, "payment_gateways", id));
  };

  // User Session Hooks
  const toggleAdminMode = () => {
    const nextAdminState = !currentUser.isAdmin;
    setCurrentUser(prev => ({ ...prev, isAdmin: nextAdminState }));
    // Also update in registered_users if logged in
    if (!currentUser.isGuest) {
      setDoc(doc(db, "registered_users", currentUser.email.toLowerCase()), { isAdmin: nextAdminState }, { merge: true });
    }
  };

  const addWalletFunds = async (amount: number) => {
    const updatedBalance = currentUser.walletBalance + amount;
    setCurrentUser(prev => ({ ...prev, walletBalance: updatedBalance }));
    if (!currentUser.isGuest) {
      await setDoc(doc(db, "registered_users", currentUser.email.toLowerCase()), { walletBalance: updatedBalance }, { merge: true });
    }
  };

  const requestTopUp = async (details: { amount: number; paymentMethod: string; transactionId: string; screenshotUrl?: string }) => {
    const id = "TOP-" + Math.floor(10000 + Math.random() * 90000) + "-ELITE";
    const newReq: TopUpRequest = {
      id,
      email: currentUser.email,
      username: currentUser.username,
      amount: details.amount,
      paymentMethod: details.paymentMethod,
      transactionId: details.transactionId,
      screenshotUrl: details.screenshotUrl || "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=600&auto=format&fit=crop",
      date: new Date().toISOString(),
      status: "Pending"
    };
    await setDoc(doc(db, "topup_requests", id), newReq);
  };

  const approveTopUp = async (requestId: string) => {
    const req = topUpRequests.find(r => r.id === requestId);
    if (!req || req.status !== "Pending") return;

    // Update Request status
    await setDoc(doc(db, "topup_requests", requestId), { status: "Approved" }, { merge: true });

    // Fetch user current wallet balance and update
    const defaultUserSnap = await getDocs(collection(db, "registered_users"));
    let foundUser: RegisteredUser | null = null;
    defaultUserSnap.forEach((doc) => {
      const u = doc.data() as RegisteredUser;
      if (doc.id.toLowerCase() === req.email.toLowerCase() || u.email.toLowerCase() === req.email.toLowerCase()) {
        foundUser = u;
      }
    });

    if (foundUser) {
      const updatedBalance = (foundUser as RegisteredUser).walletBalance + req.amount;
      await setDoc(doc(db, "registered_users", req.email.toLowerCase()), { walletBalance: updatedBalance }, { merge: true });
    }
  };

  const rejectTopUp = async (requestId: string) => {
    await setDoc(doc(db, "topup_requests", requestId), { status: "Rejected" }, { merge: true });
  };

  const registerUser = async (
    username: string, 
    email: string, 
    passwordVal: string, 
    referredBy?: string
  ): Promise<{ success: boolean; message: string; email?: string; otpCode?: string }> => {
    const cleanEmail = email.trim();
    const cleanEmailLower = cleanEmail.toLowerCase();
    const cleanUsername = username.trim();
    const cleanUsernameLower = cleanUsername.toLowerCase();

    if (!cleanUsername) {
      return { success: false, message: "Username cannot be empty!" };
    }

    // Fetch latest user snapshot from Firestore for realtime duplicate check
    let allUsers: RegisteredUser[] = [...registeredUsers];
    try {
      const usersSnap = await getDocs(collection(db, "registered_users"));
      const fetched: RegisteredUser[] = [];
      usersSnap.forEach(docSnap => {
        fetched.push(docSnap.data() as RegisteredUser);
      });
      if (fetched.length > 0) {
        allUsers = fetched;
      }
    } catch (e) {
      console.warn("Could not fetch latest users for username validation snapshot:", e);
    }

    // 1. Check if email is already registered in local state or Firestore
    const existingEmail = allUsers.find(u => u.email && u.email.trim().toLowerCase() === cleanEmailLower);
    if (existingEmail) {
      if (existingEmail.isVerified === false) {
        // Unverified existing user - resend OTP and return requires verification
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        await setDoc(doc(db, "registered_users", cleanEmailLower), { otpCode: newOtp }, { merge: true });
        
        // Dispatch OTP Email via Brevo API / SMTP server endpoint
        fetch("/api/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: cleanEmail, username: existingEmail.username || cleanUsername, otpCode: newOtp }),
        }).catch(err => console.warn("Brevo OTP email dispatch error:", err));

        return { 
          success: true, 
          message: `Account created previously but not verified. A new 6-digit OTP code has been sent to ${cleanEmail}.`, 
          email: cleanEmail, 
          otpCode: newOtp 
        };
      }
      return { success: false, message: "This email address is already registered! Please log in instead." };
    }

    // 2. Check if username is already taken (case-insensitive check across all users)
    const existingUsername = allUsers.find(
      u => u.username && u.username.trim().toLowerCase() === cleanUsernameLower
    );
    if (existingUsername) {
      return { success: false, message: `Username '${cleanUsername}' is already taken! Please choose a different username.` };
    }

    // 3. Register user in Firebase Authentication
    let firebaseUser = null;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, passwordVal);
      firebaseUser = userCredential.user;

      if (firebaseUser) {
        await updateProfile(firebaseUser, { displayName: cleanUsername });
        try {
          await sendEmailVerification(firebaseUser);
        } catch (e) {
          console.warn("Firebase Auth email verification error:", e);
        }
      }
    } catch (authErr: any) {
      console.error("Firebase Auth Registration Error:", authErr);
      if (authErr.code === "auth/email-already-in-use") {
        // If already in Auth but unverified in DB, proceed to generate OTP
      } else if (authErr.code === "auth/invalid-email") {
        return { success: false, message: "Invalid email address format." };
      } else if (authErr.code === "auth/weak-password") {
        return { success: false, message: "Password is too weak. Please use at least 8 characters with numbers and symbols." };
      }
    }

    // 4. Generate 6-digit OTP Code
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // 5. Store user profile in Firestore registered_users collection with isVerified: false
    const newUser: RegisteredUser = {
      email: cleanEmail,
      username: cleanUsername,
      passwordVal: passwordVal,
      walletBalance: referredBy ? 10.00 : 0.00, // referral bonus
      isAdmin: false,
      referralCode: "ELITE-" + Math.floor(1000 + Math.random() * 9000) + "X",
      isVerified: false, // OTP verification required before login!
      otpCode: generatedOtp
    };

    await setDoc(doc(db, "registered_users", cleanEmailLower), newUser, { merge: true });

    // Dispatch OTP Email via Brevo API / SMTP server endpoint
    fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: cleanEmail, username: cleanUsername, otpCode: generatedOtp }),
    }).catch(err => console.warn("Brevo OTP email dispatch error:", err));

    // DO NOT set currentUser here! User must verify OTP first before logging in!

    return { 
      success: true, 
      message: `Your Elite Logs Market account verification OTP is sent to ${cleanEmail}. Please enter the code below to complete verification.`, 
      email: cleanEmail,
      otpCode: generatedOtp
    };
  };

  const verifyUserOtp = async (email: string, enteredCode: string): Promise<{ success: boolean; message: string }> => {
    const cleanEmailLower = email.trim().toLowerCase();
    const userDocRef = doc(db, "registered_users", cleanEmailLower);
    const userSnap = await getDoc(userDocRef);

    let dbOtp = "";
    if (userSnap.exists()) {
      dbOtp = userSnap.data().otpCode || "";
    } else {
      const localUser = registeredUsers.find(u => u.email.toLowerCase() === cleanEmailLower);
      if (localUser) dbOtp = localUser.otpCode || "";
    }

    const cleanInputCode = enteredCode.trim();

    if (dbOtp && dbOtp === cleanInputCode) {
      // Mark as verified
      await setDoc(userDocRef, { isVerified: true, otpCode: "" }, { merge: true });

      return {
        success: true,
        message: "Email OTP verified successfully! You can now log in to your account."
      };
    } else if (!dbOtp) {
      return { success: false, message: "No active OTP request found for this email. Please request a new OTP." };
    } else {
      return { success: false, message: "Invalid 6-digit OTP code! Please check your email and try again." };
    }
  };

  const resendUserOtp = async (email: string): Promise<{ success: boolean; message: string; otpCode?: string }> => {
    const cleanEmailLower = email.trim().toLowerCase();
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

    await setDoc(doc(db, "registered_users", cleanEmailLower), { otpCode: newOtp }, { merge: true });

    // Fetch user doc to get username for personalized email
    let userUsername = email.split("@")[0];
    try {
      const uSnap = await getDoc(doc(db, "registered_users", cleanEmailLower));
      if (uSnap.exists() && uSnap.data().username) {
        userUsername = uSnap.data().username;
      }
    } catch (e) {
      console.warn("Could not fetch username for OTP email:", e);
    }

    // Dispatch OTP Email via Brevo API / SMTP server endpoint
    fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username: userUsername, otpCode: newOtp }),
    }).catch(err => console.warn("Brevo OTP email dispatch error:", err));

    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
      } catch (e) {
        console.warn("Resend email verification note:", e);
      }
    }

    return {
      success: true,
      message: `Your Elite Logs Market account verification OTP is sent to ${email}.`,
      otpCode: newOtp
    };
  };

  const requestPasswordResetOtp = async (
    emailOrUsername: string
  ): Promise<{ success: boolean; message: string; email?: string }> => {
    const cleanInput = emailOrUsername.trim();
    const cleanInputLower = cleanInput.toLowerCase();

    if (!cleanInput) {
      return { success: false, message: "Please enter your registered Email or Username." };
    }

    let foundUserDoc: RegisteredUser | null = null;
    let foundDocRef: ReturnType<typeof doc> | null = null;

    // Check local registeredUsers state first
    const localMatch = registeredUsers.find(
      u => (u.email && u.email.trim().toLowerCase() === cleanInputLower) ||
           (u.username && u.username.trim().toLowerCase() === cleanInputLower)
    );
    if (localMatch) {
      foundUserDoc = localMatch;
      foundDocRef = doc(db, "registered_users", localMatch.email.trim().toLowerCase());
    }

    // Check Firestore registered_users collection
    try {
      if (cleanInput.includes("@")) {
        const dSnap = await getDoc(doc(db, "registered_users", cleanInputLower));
        if (dSnap.exists()) {
          foundUserDoc = dSnap.data() as RegisteredUser;
          foundDocRef = dSnap.ref;
        }
      }
      if (!foundUserDoc) {
        const snap = await getDocs(collection(db, "registered_users"));
        snap.forEach(d => {
          const data = d.data() as RegisteredUser;
          if (
            (data.email && data.email.trim().toLowerCase() === cleanInputLower) ||
            (data.username && data.username.trim().toLowerCase() === cleanInputLower)
          ) {
            foundUserDoc = data;
            foundDocRef = d.ref;
          }
        });
      }
    } catch (e) {
      console.warn("Error finding user for password reset:", e);
    }

    if (!foundUserDoc) {
      return { success: false, message: "No registered account found with this Email or Username!" };
    }

    const targetEmail = foundUserDoc.email.trim();
    const targetUsername = foundUserDoc.username || targetEmail.split("@")[0];
    const newResetOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store reset OTP in Firestore
    const userDocRef = doc(db, "registered_users", targetEmail.toLowerCase());
    await setDoc(userDocRef, { resetOtpCode: newResetOtp, otpCode: newResetOtp }, { merge: true });

    // Send email via Brevo API endpoint
    fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: targetEmail,
        username: targetUsername,
        otpCode: newResetOtp,
        isPasswordReset: true
      }),
    }).catch(err => console.warn("Password reset OTP email dispatch error:", err));

    return {
      success: true,
      email: targetEmail,
      message: `A 6-digit password reset OTP code has been dispatched to ${targetEmail}.`
    };
  };

  const verifyResetOtp = async (
    email: string,
    otpCode: string
  ): Promise<{ success: boolean; message: string }> => {
    const cleanEmailLower = email.trim().toLowerCase();
    const cleanCode = otpCode.trim();

    if (!cleanEmailLower || !cleanCode) {
      return { success: false, message: "Please enter the 6-digit OTP code." };
    }

    const userDocRef = doc(db, "registered_users", cleanEmailLower);
    const userSnap = await getDoc(userDocRef);

    let storedOtp = "";
    if (userSnap.exists()) {
      storedOtp = userSnap.data().resetOtpCode || userSnap.data().otpCode || "";
    } else {
      const localUser = registeredUsers.find(u => u.email.toLowerCase() === cleanEmailLower);
      if (localUser) storedOtp = localUser.otpCode || "";
    }

    if (storedOtp && storedOtp === cleanCode) {
      return { success: true, message: "OTP verified successfully!" };
    } else if (!storedOtp) {
      return { success: false, message: "No active password reset code found for this email. Please request a new OTP code." };
    } else {
      return { success: false, message: "Invalid 6-digit OTP code! Please check your email and try again." };
    }
  };

  const resetPasswordWithOtp = async (
    email: string,
    otpCode: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    const cleanEmailLower = email.trim().toLowerCase();
    const cleanCode = otpCode.trim();
    const cleanPassword = newPassword;

    if (!cleanEmailLower || !cleanCode || !cleanPassword) {
      return { success: false, message: "Please fill in all required fields." };
    }

    if (cleanPassword.length < 8) {
      return { success: false, message: "New password must be at least 8 characters long." };
    }

    const userDocRef = doc(db, "registered_users", cleanEmailLower);
    const userSnap = await getDoc(userDocRef);

    let storedOtp = "";
    if (userSnap.exists()) {
      storedOtp = userSnap.data().resetOtpCode || userSnap.data().otpCode || "";
    } else {
      const localUser = registeredUsers.find(u => u.email.toLowerCase() === cleanEmailLower);
      if (localUser) storedOtp = localUser.otpCode || "";
    }

    if (storedOtp && storedOtp === cleanCode) {
      // Update password in Firestore and clear OTP
      await setDoc(userDocRef, {
        passwordVal: cleanPassword,
        resetOtpCode: "",
        otpCode: "",
        isVerified: true
      }, { merge: true });

      // Update Firebase Auth password if active or sync user
      if (auth.currentUser && auth.currentUser.email?.toLowerCase() === cleanEmailLower) {
        try {
          await updatePassword(auth.currentUser, cleanPassword);
        } catch (e) {
          console.warn("Firebase Auth updatePassword warning:", e);
        }
      }

      return {
        success: true,
        message: "Your password has been updated successfully! Please log in with your new password."
      };
    } else if (!storedOtp) {
      return { success: false, message: "No active password reset code found for this email. Please request a new OTP." };
    } else {
      return { success: false, message: "Invalid 6-digit OTP code! Please check your email and try again." };
    }
  };

  const loginUser = async (
    emailOrUsername: string, 
    passwordVal: string
  ): Promise<{ success: boolean; message: string; isAdmin?: boolean; requiresOtp?: boolean; email?: string }> => {
    const cleanInput = emailOrUsername.trim();
    const cleanInputLower = cleanInput.toLowerCase();
    const cleanPassword = passwordVal;

    if (!cleanInput || !cleanPassword) {
      return { success: false, message: "Please enter your email/username and password." };
    }

    // 1. Fetch user document from Firestore directly to guarantee fresh data
    let foundUserDoc: RegisteredUser | null = null;
    let foundDocRef: ReturnType<typeof doc> | null = null;

    // Check by email/username first in registeredUsers local state
    const localMatch = registeredUsers.find(
      u => (u.email && u.email.trim().toLowerCase() === cleanInputLower) ||
           (u.username && u.username.trim().toLowerCase() === cleanInputLower)
    );
    if (localMatch) {
      foundUserDoc = localMatch;
      foundDocRef = doc(db, "registered_users", localMatch.email.trim().toLowerCase());
    }

    // Fetch live from Firestore
    try {
      if (cleanInput.includes("@")) {
        const dSnap = await getDoc(doc(db, "registered_users", cleanInputLower));
        if (dSnap.exists()) {
          foundUserDoc = dSnap.data() as RegisteredUser;
          foundDocRef = dSnap.ref;
        }
      }
      if (!foundUserDoc) {
        // Query registered_users collection if not found by direct email ID
        const snap = await getDocs(collection(db, "registered_users"));
        snap.forEach(d => {
          const data = d.data() as RegisteredUser;
          if (
            (data.email && data.email.trim().toLowerCase() === cleanInputLower) ||
            (data.username && data.username.trim().toLowerCase() === cleanInputLower)
          ) {
            foundUserDoc = data;
            foundDocRef = d.ref;
          }
        });
      }
    } catch (e) {
      console.warn("Error fetching user doc during login:", e);
    }

    if (!foundUserDoc) {
      return { success: false, message: "No registered account found with this Email or Username!" };
    }

    const targetEmail = foundUserDoc.email.trim();
    const storedPassword = foundUserDoc.passwordVal ? foundUserDoc.passwordVal : "";

    // 2. Password Authentication Check
    let authSuccess = false;

    // Try Firebase Auth sign in
    try {
      await signInWithEmailAndPassword(auth, targetEmail, cleanPassword);
      authSuccess = true;
    } catch (authErr: any) {
      console.warn("Firebase Auth signin attempt code:", authErr?.code);
      // Fallback: Check stored password in Firestore
      if (storedPassword && (storedPassword === cleanPassword || storedPassword.trim() === cleanPassword.trim())) {
        authSuccess = true;
        // Seamlessly sync / create user in Firebase Auth
        try {
          await createUserWithEmailAndPassword(auth, targetEmail, cleanPassword);
        } catch (e) {
          // Ignore if already exists or sync error
        }
      }
    }

    if (!authSuccess) {
      return { success: false, message: "Incorrect password! Please check your password and try again." };
    }

    // Ensure stored password in Firestore is synced
    if (!storedPassword && foundDocRef) {
      await setDoc(foundDocRef, { passwordVal: cleanPassword }, { merge: true });
    }

    // 3. Check OTP Verification status from live Firestore user doc
    if (foundUserDoc.isVerified === false) {
      const otpCode = foundUserDoc.otpCode || Math.floor(100000 + Math.random() * 900000).toString();
      if (foundDocRef && !foundUserDoc.otpCode) {
        await setDoc(foundDocRef, { otpCode }, { merge: true });
      }

      // Re-dispatch OTP via Brevo API
      fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail, username: foundUserDoc.username || targetEmail.split("@")[0], otpCode }),
      }).catch(err => console.warn("Brevo OTP email dispatch error:", err));

      return {
        success: false,
        requiresOtp: true,
        email: targetEmail,
        message: `Your account is registered but not verified yet! A 6-digit OTP code has been sent to ${targetEmail}.`
      };
    }

    // 4. Set session user
    const sessionUser: UserProfile = {
      email: targetEmail,
      username: foundUserDoc.username || targetEmail.split("@")[0],
      walletBalance: foundUserDoc.walletBalance ?? 0.00,
      isAdmin: foundUserDoc.isAdmin ?? false,
      referralCode: foundUserDoc.referralCode || ("ELITE-" + Math.floor(1000 + Math.random() * 9000) + "X"),
      avatarUrl: foundUserDoc.avatarUrl,
      isGuest: false
    };

    setCurrentUser(sessionUser);
    localStorage.setItem("elite_logs_user", JSON.stringify(sessionUser));

    return {
      success: true,
      message: `Welcome back, ${sessionUser.username}! Logged in successfully.`,
      isAdmin: sessionUser.isAdmin
    };
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; message: string; isAdmin?: boolean }> => {
    const executeGoogleSignIn = async (isRetry = false): Promise<{ success: boolean; message: string; isAdmin?: boolean }> => {
      const startTime = Date.now();
      try {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        if (!user || !user.email) {
          return { success: false, message: "Could not retrieve user details from Google Sign-In." };
        }

        const cleanEmail = user.email.trim();
        const cleanEmailLower = cleanEmail.toLowerCase();
        const cleanUsername = user.displayName || cleanEmail.split("@")[0];

        const userDocRef = doc(db, "registered_users", cleanEmailLower);
        const userSnap = await getDoc(userDocRef);

        let isUserAdmin = false;
        let walletBal = 0.00;
        let refCode = "ELITE-" + Math.floor(1000 + Math.random() * 9000) + "X";
        let userAvatar = user.photoURL || undefined;

        if (userSnap.exists()) {
          const data = userSnap.data();
          isUserAdmin = data.isAdmin || false;
          walletBal = data.walletBalance || 0.00;
          if (data.referralCode) refCode = data.referralCode;
          if (data.avatarUrl) userAvatar = data.avatarUrl;
        } else {
          const newUserDoc: RegisteredUser = {
            email: cleanEmail,
            username: cleanUsername,
            passwordVal: "",
            walletBalance: walletBal,
            isAdmin: false,
            referralCode: refCode,
            avatarUrl: userAvatar
          };
          await setDoc(userDocRef, newUserDoc, { merge: true });
        }

        const sessionUser: UserProfile = {
          email: cleanEmail,
          username: cleanUsername,
          walletBalance: walletBal,
          isAdmin: isUserAdmin,
          referralCode: refCode,
          avatarUrl: userAvatar,
          isGuest: false
        };

        setCurrentUser(sessionUser);
        localStorage.setItem("elite_logs_user", JSON.stringify(sessionUser));

        return {
          success: true,
          message: `Welcome, ${cleanUsername}! Signed in with Google.`,
          isAdmin: isUserAdmin
        };
      } catch (err: any) {
        console.error("Google Sign-In Error:", err);
        const duration = Date.now() - startTime;

        // If the popup closed/cancelled almost immediately (e.g. initial iframe/handshake glitch on 1st attempt)
        if (!isRetry && (err.code === "auth/popup-closed-by-user" || err.code === "auth/cancelled-popup-request") && duration < 2500) {
          console.log("Instant popup close detected on 1st attempt. Retrying Google Sign-In automatically...");
          return await executeGoogleSignIn(true);
        }

        if (err.code === "auth/unauthorized-domain") {
          return { 
            success: false, 
            message: "Google Sign-In is unavailable on this domain. Please sign up or log in using Email & Password." 
          };
        }
        if (err.code === "auth/operation-not-allowed") {
          return {
            success: false,
            message: "Google Sign-In is currently disabled. Please use Email & Password."
          };
        }
        if (err.code === "auth/popup-closed-by-user" || err.code === "auth/cancelled-popup-request") {
          return { success: false, message: "Google Sign-In popup was closed." };
        }
        if (err.code === "auth/popup-blocked") {
          return { success: false, message: "Popup was blocked by browser. Please allow popups for Google Sign-In." };
        }
        return { success: false, message: err.message || "Google Authentication failed." };
      }
    };

    return await executeGoogleSignIn(false);
  };

  const resendVerificationEmail = async (): Promise<{ success: boolean; message: string }> => {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        return { success: true, message: `Verification email sent to ${auth.currentUser.email}. Please check your inbox or spam folder.` };
      } else {
        return { success: false, message: "No active authenticated session found. Please log in again." };
      }
    } catch (err: any) {
      return { success: false, message: err.message || "Failed to resend verification email." };
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn("Sign out error:", err);
    }
    localStorage.removeItem("elite_logs_user");
    setCurrentUser({
      email: "",
      username: "Guest",
      walletBalance: 0.00,
      isAdmin: false,
      referralCode: "",
      isGuest: true
    });
    setView("home");
  };

  const selectProduct = (id: string | null) => {
    setSelectedProductId(id);
    if (id) {
      setView("product-details");
    }
  };

  const trackOrder = (id: string | null) => {
    setActiveTrackingOrderId(id);
    if (id) {
      setView("tracking");
    }
  };

  const sendChatMessage = async (messageText: string, targetConversationId?: string) => {
    if (!messageText.trim()) return;
    const isUserAdmin = currentUser.isAdmin;
    const senderEmail = currentUser.email || "guest@elitelogs.net";
    const senderName = currentUser.username || "Guest";
    
    let conversationId = targetConversationId || (currentUser.isGuest ? "guest_support" : currentUser.email);

    const msg = {
      conversationId,
      senderEmail,
      senderName,
      message: messageText.trim(),
      timestamp: new Date().toISOString(),
      isAdmin: isUserAdmin
    };

    await addDoc(collection(db, "chat_messages"), msg);
  };

  const updateSupportSettings = async (settings: SupportSettings) => {
    await setDoc(doc(db, "settings", "support"), settings);
  };

  const addFaqItem = async (question: string, answer: string, category: string) => {
    const newItem = { question, answer, category };
    await addDoc(collection(db, "faqs"), newItem);
  };

  const updateFaqItem = async (id: string, question: string, answer: string, category: string) => {
    await setDoc(doc(db, "faqs", id), { question, answer, category }, { merge: true });
  };

  const deleteFaqItem = async (id: string) => {
    await deleteDoc(doc(db, "faqs", id));
  };

  const adjustUserBalance = async (email: string, newBalance: number) => {
    await setDoc(doc(db, "registered_users", email.trim().toLowerCase()), {
      walletBalance: newBalance
    }, { merge: true });
  };

  const toggleUserAdmin = async (email: string, isAdmin: boolean) => {
    await setDoc(doc(db, "registered_users", email.trim().toLowerCase()), {
      isAdmin
    }, { merge: true });
  };

  const updateUserProfile = async (updates: {
    fullName?: string;
    username?: string;
    phone?: string;
    country?: string;
    avatarUrl?: string;
    bio?: string;
    oldPasswordVal?: string;
    passwordVal?: string;
    twoFactorEnabled?: boolean;
  }): Promise<{ success: boolean; message: string }> => {
    if (!currentUser || currentUser.isGuest) {
      return { success: false, message: "Guest users cannot update profile." };
    }

    try {
      const emailKey = currentUser.email.trim().toLowerCase();
      const userDocRef = doc(db, "registered_users", emailKey);

      const firestoreUpdates: Record<string, any> = {
        email: currentUser.email,
        username: currentUser.username
      };

      if (updates.username !== undefined && updates.username.trim() !== "") {
        const cleanNewUsername = updates.username.trim();
        const cleanNewUsernameLower = cleanNewUsername.toLowerCase();
        const currentUsernameLower = (currentUser.username || "").trim().toLowerCase();

        if (cleanNewUsernameLower !== currentUsernameLower) {
          // Check if taken by another user
          const usernameTaken = registeredUsers.some(
            u => u.email.trim().toLowerCase() !== emailKey && 
                 u.username && u.username.trim().toLowerCase() === cleanNewUsernameLower
          );
          if (usernameTaken) {
            return { success: false, message: `Username '${cleanNewUsername}' is already taken by another account! Please choose a different username.` };
          }
        }
        firestoreUpdates.username = cleanNewUsername;
      }

      if (updates.fullName !== undefined) firestoreUpdates.fullName = updates.fullName;
      if (updates.phone !== undefined) firestoreUpdates.phone = updates.phone;
      if (updates.country !== undefined) firestoreUpdates.country = updates.country;
      if (updates.avatarUrl !== undefined) firestoreUpdates.avatarUrl = updates.avatarUrl;
      if (updates.bio !== undefined) firestoreUpdates.bio = updates.bio;
      if (updates.twoFactorEnabled !== undefined) firestoreUpdates.twoFactorEnabled = updates.twoFactorEnabled;
      
      if (updates.passwordVal !== undefined && updates.passwordVal.trim() !== "") {
        if (!updates.oldPasswordVal || updates.oldPasswordVal.trim() === "") {
          return { success: false, message: "Old password is required to set a new password." };
        }
        
        // Fetch current password from user doc in Firestore
        const userSnap = await getDoc(userDocRef);
        let existingPass = "";
        if (userSnap.exists()) {
          existingPass = userSnap.data().passwordVal || "";
        }
        if (!existingPass && currentUser.passwordVal) {
          existingPass = currentUser.passwordVal;
        }

        if (existingPass && existingPass !== updates.oldPasswordVal) {
          return { success: false, message: "Incorrect old password. Please enter your current password correctly." };
        }

        firestoreUpdates.passwordVal = updates.passwordVal;
      }

      await setDoc(userDocRef, firestoreUpdates, { merge: true });

      setCurrentUser(prev => {
        const updated = {
          ...prev,
          ...(updates.fullName !== undefined && { fullName: updates.fullName }),
          ...(updates.username !== undefined && { username: updates.username }),
          ...(updates.phone !== undefined && { phone: updates.phone }),
          ...(updates.country !== undefined && { country: updates.country }),
          ...(updates.avatarUrl !== undefined && { avatarUrl: updates.avatarUrl }),
          ...(updates.bio !== undefined && { bio: updates.bio }),
          ...(updates.twoFactorEnabled !== undefined && { twoFactorEnabled: updates.twoFactorEnabled }),
          ...(updates.passwordVal !== undefined && { passwordVal: updates.passwordVal })
        };
        localStorage.setItem("elite_logs_user", JSON.stringify(updated));
        return updated;
      });

      return { success: true, message: "Profile updated successfully!" };
    } catch (err: any) {
      console.error("Error updating profile:", err);
      return { success: false, message: err.message || "Failed to update profile." };
    }
  };

  return (
    <AppContext.Provider
      value={{
        products,
        orders,
        coupons,
        currentUser,
        cart,
        activeView,
        selectedProductId,
        activeTrackingOrderId,
        activeCouponCode,
        topUpRequests,
        registeredUsers,
        chatMessages,
        supportSettings,
        faqs,
        
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        
        placeOrder,
        
        updateOrderStatus,
        addManualCredentials,
        addDeliveredCredentials,
        updateOrderNotes,
        addProduct,
        addNewProduct,
        editProduct,
        deleteProduct,
        restockProduct,
        updateStock,
        generateMockOrder,
        paymentGateways,
        addPaymentGateway,
        updatePaymentGateway,
        deletePaymentGateway,
        
        setView,
        activeDashboardTab,
        setDashboardTab,
        selectProduct,
        trackOrder,
        toggleAdminMode,
        addWalletFunds,
        requestTopUp,
        approveTopUp,
        rejectTopUp,
        registerUser,
        loginUser,
        loginWithGoogle,
        verifyUserOtp,
        resendUserOtp,
        requestPasswordResetOtp,
        verifyResetOtp,
        resetPasswordWithOtp,
        resendVerificationEmail,
        logOut,
        sendChatMessage,
        updateSupportSettings,
        addFaqItem,
        updateFaqItem,
        deleteFaqItem,
        adjustUserBalance,
        toggleUserAdmin,
        updateUserProfile
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppProvider");
  }
  return context;
};
