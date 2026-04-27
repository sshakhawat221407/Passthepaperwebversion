import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type User = {
  id: string;
  email: string;
  name: string;
  university: string;
  isVerified: boolean;
  isAdmin: boolean;
  studentId?: string;
  walletBalance: number; // BDT in wallet
  password?: string;
  profilePicture?: string; // Base64 or URL
  rewardPoints: number; // Points earned from uploads
  membershipType?: 'free' | 'member';
  membershipExpiry?: string;
  isBanned?: boolean; // New: User ban status
  banReason?: string; // New: Reason for ban
  restrictions?: {
    canUpload?: boolean;
    canPurchase?: boolean;
    canComment?: boolean;
  };
};

export type Resource = {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  priceType: 'money' | 'points';
  uploadedBy: string;
  uploaderName: string;
  downloads: number;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  fileUrl: string;
  createdAt: string;
  department?: string;
  course?: string;
  semester?: string;
};

export type Transaction = {
  id: string;
  userId: string;
  type: 'add' | 'purchase' | 'upload_reward' | 'withdrawal';
  amount: number;
  currency: 'BDT' | 'Points';
  description: string;
  paymentMethod?: 'Bkash' | 'Nagad' | 'Card' | 'Bank Transfer';
  createdAt: string;
};

export type CartItem = {
  resourceId: string;
  userId: string;
  addedAt: string;
};

export type Purchase = {
  id: string;
  userId: string;
  resourceId: string;
  price: number;
  priceType: 'money' | 'points';
  purchasedAt: string;
  paymentMethod?: 'Bkash' | 'Nagad' | 'Card' | 'Wallet';
  feedback?: string;
  rating?: number;
};

export type Notification = {
  id: string;
  userId: string;
  type: 'purchase' | 'sale' | 'system' | 'feedback';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  relatedId?: string; // Can be resourceId, purchaseId, etc.
};

export type Feedback = {
  id: string;
  userId: string;
  type: 'system' | 'item';
  rating: number;
  comment: string;
  itemId?: string; // resourceId if feedback is for an item
  itemTitle?: string;
  createdAt: string;
  updatedAt?: string;
};

export type Withdrawal = {
  id: string;
  userId: string;
  amount: number;
  method: 'Bkash' | 'Nagad' | 'Bank Transfer';
  accountNumber: string;
  status: 'pending' | 'completed' | 'rejected';
  createdAt: string;
  completedAt?: string;
};

export type Appeal = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reviewedAt?: string;
  adminResponse?: string;
};

type MockDataContextType = {
  currentUser: User | null;
  users: User[];
  resources: Resource[];
  transactions: Transaction[];
  cartItems: CartItem[];
  purchases: Purchase[];
  feedbacks: Feedback[];
  login: (email: string, password: string) => Promise<User>;
  adminLogin: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, name: string, university: string, studentId: string) => Promise<void>;
  logout: () => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  verifyUser: (userId: string, approve: boolean) => void;
  banUser: (userId: string, reason: string) => void;
  unbanUser: (userId: string) => void;
  setUserRestrictions: (userId: string, restrictions: Partial<User['restrictions']>) => void;
  addResource: (resource: Omit<Resource, 'id' | 'createdAt' | 'downloads' | 'rating'>) => void;
  approveFile: (fileId: string, approve: boolean) => void;
  deleteResource: (resourceId: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  getResourcesByCategory: (category?: string) => Resource[];
  getPendingUsers: () => User[];
  getPendingFiles: () => Resource[];
  getAllUsers: () => User[];
  getFeaturedResources: () => Resource[];
  addToCart: (resourceId: string) => void;
  removeFromCart: (resourceId: string) => void;
  getCartItems: () => Resource[];
  purchaseFromCart: (paymentMethod: 'wallet' | 'points', useRewardPoints: boolean) => Promise<void>;
  getUserPurchases: () => Purchase[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  getNotifications: () => Notification[];
  addFeedback: (feedback: Omit<Feedback, 'id' | 'createdAt'>) => void;
  getFeedbacks: () => Feedback[];
  addWithdrawal: (withdrawal: Omit<Withdrawal, 'id' | 'createdAt'>) => void;
  getWithdrawals: () => Withdrawal[];
  getSellerRating: () => number;
  addAppeal: (appeal: Omit<Appeal, 'id' | 'createdAt' | 'status'>) => void;
  getAppeals: () => Appeal[];
  getAllAppeals: () => Appeal[];
  reviewAppeal: (appealId: string, approve: boolean, adminResponse?: string) => void;
};

const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

const initialUsers: User[] = [
  {
    id: 'admin-1',
    email: 'admin@passthepaper.com',
    password: 'admin123',
    name: 'Admin User',
    university: 'Pass The Paper',
    isVerified: true,
    isAdmin: true,
    walletBalance: 0,
    rewardPoints: 0,
  },
  {
    id: 'user-1',
    email: 'student@university.edu',
    password: 'student123',
    name: 'Nuhash',
    university: 'United International University',
    isVerified: true,
    isAdmin: false,
    studentId: '011221407',
    walletBalance: 500,
    rewardPoints: 1250,
  },
  {
    id: 'user-2',
    email: 'jane@university.edu',
    password: 'student123',
    name: 'Jane Smith',
    university: 'Example University',
    isVerified: false,
    isAdmin: false,
    studentId: 'STU002',
    walletBalance: 100,
    rewardPoints: 50,
  },
];

const initialResources: Resource[] = [
  {
    id: 'res-1',
    title: 'Data Structures Final Exam 2023',
    description: 'Complete final exam with solutions from Data Structures course.',
    category: 'Previous Papers',
    price: 50,
    priceType: 'points',
    uploadedBy: 'user-1',
    uploaderName: 'Nuhash',
    downloads: 45,
    rating: 4.5,
    status: 'approved',
    fileUrl: '#',
    createdAt: new Date('2024-01-15').toISOString(),
    department: 'Computer Science',
    course: 'CSE 201',
    semester: 'Fall 2023',
  },
  {
    id: 'res-2',
    title: 'Operating Systems Lecture Notes',
    description: 'Comprehensive lecture notes covering all OS concepts.',
    category: 'Lecture Notes',
    price: 30,
    priceType: 'money',
    uploadedBy: 'user-1',
    uploaderName: 'Nuhash',
    downloads: 32,
    rating: 4.8,
    status: 'approved',
    fileUrl: '#',
    createdAt: new Date('2024-01-10').toISOString(),
    department: 'Computer Science',
    course: 'CSE 301',
    semester: 'Spring 2024',
  },
  {
    id: 'res-3',
    title: 'Database Management Assignment Solutions',
    description: 'Solutions to all database assignment problems.',
    category: 'Assignments',
    price: 40,
    priceType: 'money',
    uploadedBy: 'user-1',
    uploaderName: 'Nuhash',
    downloads: 28,
    rating: 4.7,
    status: 'approved',
    fileUrl: '#',
    createdAt: new Date('2024-01-20').toISOString(),
    department: 'Computer Science',
    course: 'CSE 303',
    semester: 'Fall 2023',
  },
  {
    id: 'res-4',
    title: 'Algorithms Midterm 2024',
    description: 'Latest algorithms midterm exam paper.',
    category: 'Previous Papers',
    price: 45,
    priceType: 'points',
    uploadedBy: 'user-2',
    uploaderName: 'Jane Smith',
    downloads: 0,
    rating: 0,
    status: 'pending',
    fileUrl: '#',
    createdAt: new Date().toISOString(),
    department: 'Computer Science',
    course: 'CSE 401',
    semester: 'Spring 2024',
  },
  {
    id: 'res-5',
    title: 'Web Development Study Guide',
    description: 'Complete study guide for web development course.',
    category: 'Study Guides',
    price: 0,
    priceType: 'points',
    uploadedBy: 'user-1',
    uploaderName: 'Nuhash',
    downloads: 67,
    rating: 4.9,
    status: 'approved',
    fileUrl: '#',
    createdAt: new Date('2024-01-05').toISOString(),
    department: 'Computer Science',
    course: 'CSE 350',
    semester: 'Summer 2024',
  },
  {
    id: 'res-6',
    title: 'Introduction to Algorithms (CLRS)',
    description: 'Classic algorithms textbook in excellent condition.',
    category: 'Books',
    price: 450,
    priceType: 'money',
    uploadedBy: 'user-1',
    uploaderName: 'Nuhash',
    downloads: 12,
    rating: 4.6,
    status: 'approved',
    fileUrl: '#',
    createdAt: new Date('2024-01-12').toISOString(),
    department: 'Computer Science',
    course: 'CSE 401',
    semester: 'Available',
  },
  {
    id: 'res-7',
    title: 'Arduino Uno R3 Board',
    description: 'Authentic Arduino board with USB cable included.',
    category: 'Electronic Equipment',
    price: 850,
    priceType: 'money',
    uploadedBy: 'user-1',
    uploaderName: 'Nuhash',
    downloads: 8,
    rating: 5.0,
    status: 'approved',
    fileUrl: '#',
    createdAt: new Date('2024-01-18').toISOString(),
    department: 'Electrical Engineering',
    course: 'EEE 101',
    semester: 'Available',
  },
  {
    id: 'res-8',
    title: 'Calculus II Complete Notes',
    description: 'Comprehensive calculus notes with examples.',
    category: 'Lecture Notes',
    price: 120,
    priceType: 'points',
    uploadedBy: 'user-1',
    uploaderName: 'Nuhash',
    downloads: 23,
    rating: 4.4,
    status: 'approved',
    fileUrl: '#',
    createdAt: new Date('2024-01-08').toISOString(),
    department: 'Mathematics',
    course: 'MATH 202',
    semester: 'Spring 2024',
  },
  {
    id: 'res-9',
    title: 'Physics Lab Reports Collection',
    description: 'Complete set of physics lab reports.',
    category: 'Assignments',
    price: 200,
    priceType: 'points',
    uploadedBy: 'user-1',
    uploaderName: 'Nuhash',
    downloads: 15,
    rating: 4.3,
    status: 'approved',
    fileUrl: '#',
    createdAt: new Date('2024-01-14').toISOString(),
    department: 'Physics',
    course: 'PHY 201',
    semester: 'Fall 2023',
  },
  {
    id: 'res-10',
    title: 'Raspberry Pi 4 Model B (4GB RAM)',
    description: 'Powerful single-board computer with accessories.',
    category: 'Electronic Equipment',
    price: 5200,
    priceType: 'money',
    uploadedBy: 'user-2',
    uploaderName: 'Jane Smith',
    downloads: 3,
    rating: 4.8,
    status: 'approved',
    fileUrl: '#',
    createdAt: new Date('2024-01-22').toISOString(),
    department: 'Electrical Engineering',
    course: 'EEE 301',
    semester: 'Available',
  },
  {
    id: 'res-11',
    title: 'Organic Chemistry Study Guide',
    description: 'Comprehensive organic chemistry review.',
    category: 'Study Guides',
    price: 80,
    priceType: 'money',
    uploadedBy: 'user-1',
    uploaderName: 'Nuhash',
    downloads: 19,
    rating: 4.5,
    status: 'approved',
    fileUrl: '#',
    createdAt: new Date('2024-01-11').toISOString(),
    department: 'Chemistry',
    course: 'CHE 301',
    semester: 'Spring 2024',
  },
  {
    id: 'res-12',
    title: 'Discrete Mathematics Textbook',
    description: 'Standard discrete math textbook, good condition.',
    category: 'Books',
    price: 380,
    priceType: 'money',
    uploadedBy: 'user-2',
    uploaderName: 'Jane Smith',
    downloads: 7,
    rating: 4.2,
    status: 'approved',
    fileUrl: '#',
    createdAt: new Date('2024-01-16').toISOString(),
    department: 'Mathematics',
    course: 'MATH 250',
    semester: 'Available',
  },
];

const initialTransactions: Transaction[] = [
  {
    id: 'txn-1',
    userId: 'user-1',
    type: 'add',
    amount: 500,
    currency: 'BDT',
    description: 'Initial wallet balance',
    createdAt: new Date('2024-01-01').toISOString(),
  },
];

const initialPurchases: Purchase[] = [
  // Mock purchases with ratings for testing seller rating
  {
    id: 'pur-1',
    userId: 'user-2',
    resourceId: 'res-1',
    price: 50,
    priceType: 'points',
    purchasedAt: new Date('2024-01-20').toISOString(),
    paymentMethod: 'Wallet',
    feedback: 'Great resource! Very helpful for my exam preparation.',
    rating: 5,
  },
  {
    id: 'pur-2',
    userId: 'user-2',
    resourceId: 'res-2',
    price: 30,
    priceType: 'money',
    purchasedAt: new Date('2024-01-21').toISOString(),
    paymentMethod: 'Bkash',
    feedback: 'Good notes, well organized.',
    rating: 4,
  },
  {
    id: 'pur-3',
    userId: 'user-2',
    resourceId: 'res-3',
    price: 40,
    priceType: 'money',
    purchasedAt: new Date('2024-01-22').toISOString(),
    paymentMethod: 'Nagad',
    feedback: 'Excellent solutions, worth the price.',
    rating: 5,
  },
];

export function MockDataProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>(initialPurchases);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [appeals, setAppeals] = useState<Appeal[]>([]);

  // Initialize data from localStorage or use defaults
  useEffect(() => {
    // Version control for data updates - increment this when you update initial data
    const DATA_VERSION = '2.0';
    const storedVersion = localStorage.getItem('ptp_data_version');
    
    // If version mismatch, clear old data and use new initial data
    if (storedVersion !== DATA_VERSION) {
      localStorage.removeItem('ptp_users');
      localStorage.removeItem('ptp_resources');
      localStorage.removeItem('ptp_transactions');
      localStorage.removeItem('ptp_current_user');
      localStorage.setItem('ptp_data_version', DATA_VERSION);
    }
    
    const storedUsers = localStorage.getItem('ptp_users');
    const storedResources = localStorage.getItem('ptp_resources');
    const storedTransactions = localStorage.getItem('ptp_transactions');
    const storedCurrentUser = localStorage.getItem('ptp_current_user');

    setUsers(storedUsers ? JSON.parse(storedUsers) : initialUsers);
    setResources(storedResources ? JSON.parse(storedResources) : initialResources);
    setTransactions(storedTransactions ? JSON.parse(storedTransactions) : initialTransactions);
    if (storedCurrentUser) {
      setCurrentUser(JSON.parse(storedCurrentUser));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('ptp_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('ptp_resources', JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem('ptp_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ptp_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ptp_current_user');
    }
  }, [currentUser]);

  const login = async (email: string, password: string): Promise<User> => {
    const user = users.find(u => u.email === email && u.password === password && !u.isAdmin);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    setCurrentUser(user);
    return user;
  };

  const adminLogin = async (email: string, password: string): Promise<User> => {
    const user = users.find(u => u.email === email && u.password === password && u.isAdmin);
    if (!user) {
      throw new Error('Invalid admin credentials');
    }
    setCurrentUser(user);
    return user;
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    university: string,
    studentId: string
  ): Promise<void> => {
    if (users.find(u => u.email === email)) {
      throw new Error('Email already exists');
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      password,
      name,
      university,
      studentId,
      isVerified: false,
      isAdmin: false,
      walletBalance: 100, // Initial bonus
      rewardPoints: 0,
    };

    setUsers([...users, newUser]);
    setCurrentUser(newUser);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    setUsers(users.map(u => u.id === userId ? { ...u, ...updates } : u));
    if (currentUser?.id === userId) {
      setCurrentUser({ ...currentUser, ...updates });
    }
  };

  const verifyUser = (userId: string, approve: boolean) => {
    updateUser(userId, { isVerified: approve });
  };

  const banUser = (userId: string, reason: string) => {
    updateUser(userId, { isBanned: true, banReason: reason });
    
    // Send notification to the banned user
    const newNotification: Notification = {
      id: `not-${Date.now()}`,
      userId: userId,
      type: 'system',
      title: 'Account Banned',
      message: `Your account has been banned. Reason: ${reason}. You can submit an appeal if you believe this was done in error.`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications([...notifications, newNotification]);
  };

  const unbanUser = (userId: string) => {
    updateUser(userId, { isBanned: false, banReason: undefined });
  };

  const setUserRestrictions = (userId: string, restrictions: Partial<User['restrictions']>) => {
    updateUser(userId, { restrictions });
  };

  const addResource = (resource: Omit<Resource, 'id' | 'createdAt' | 'downloads' | 'rating'>) => {
    const newResource: Resource = {
      ...resource,
      id: `res-${Date.now()}`,
      createdAt: new Date().toISOString(),
      downloads: 0,
      rating: 0,
    };
    setResources([...resources, newResource]);
  };

  const approveFile = (fileId: string, approve: boolean) => {
    setResources(resources.map(r => 
      r.id === fileId 
        ? { ...r, status: approve ? 'approved' : 'rejected' } 
        : r
    ));
  };

  const deleteResource = (resourceId: string) => {
    setResources(resources.filter(r => r.id !== resourceId));
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `txn-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTransactions([...transactions, newTransaction]);

    // Update user wallet balance
    const user = users.find(u => u.id === transaction.userId);
    if (user) {
      let balanceChange = 0;
      
      // Debit transactions (subtract from balance)
      if (transaction.type === 'purchase' || transaction.type === 'withdrawal') {
        balanceChange = -transaction.amount;
      }
      // Credit transactions (add to balance)
      else if (transaction.type === 'add' || transaction.type === 'upload_reward') {
        balanceChange = transaction.amount;
      }
      
      updateUser(user.id, {
        walletBalance: user.walletBalance + balanceChange,
      });
    }
  };

  const getResourcesByCategory = (category?: string): Resource[] => {
    const approvedResources = resources.filter(r => r.status === 'approved');
    if (!category || category === 'All') {
      return approvedResources;
    }
    return approvedResources.filter(r => r.category === category);
  };

  const getPendingUsers = (): User[] => {
    return users.filter(u => !u.isVerified && !u.isAdmin);
  };

  const getPendingFiles = (): Resource[] => {
    return resources;
  };

  const getAllUsers = (): User[] => {
    return users;
  };

  const getFeaturedResources = (): Resource[] => {
    return resources
      .filter(r => r.status === 'approved')
      .sort((a, b) => b.downloads - a.downloads)
      .slice(0, 6);
  };

  const addToCart = (resourceId: string) => {
    if (!currentUser) {
      throw new Error('User not logged in');
    }
    const existingItem = cartItems.find(item => item.resourceId === resourceId && item.userId === currentUser.id);
    if (!existingItem) {
      setCartItems([...cartItems, { resourceId, userId: currentUser.id, addedAt: new Date().toISOString() }]);
    }
  };

  const removeFromCart = (resourceId: string) => {
    setCartItems(cartItems.filter(item => item.resourceId !== resourceId || item.userId !== currentUser?.id));
  };

  const getCartItems = (): Resource[] => {
    if (!currentUser) {
      return [];
    }
    return cartItems
      .filter(item => item.userId === currentUser.id)
      .map(item => resources.find(resource => resource.id === item.resourceId) as Resource);
  };

  const purchaseFromCart = async (paymentMethod: 'wallet' | 'points', useRewardPoints: boolean) => {
    if (!currentUser) {
      throw new Error('User not logged in');
    }
    const cartResources = getCartItems();
    let totalAmount = 0;
    let totalPoints = 0;

    cartResources.forEach(resource => {
      if (resource.priceType === 'money') {
        totalAmount += resource.price;
      } else {
        totalPoints += resource.price;
      }
    });

    // Handle wallet payment - deduct from user's wallet balance and reward points
    if (paymentMethod === 'wallet') {
      if (currentUser.walletBalance < totalAmount) {
        throw new Error('Insufficient wallet balance');
      }
      if (currentUser.rewardPoints < totalPoints) {
        throw new Error('Insufficient reward points');
      }
      
      // Deduct from wallet
      updateUser(currentUser.id, { 
        walletBalance: currentUser.walletBalance - totalAmount,
        rewardPoints: currentUser.rewardPoints - totalPoints
      });
    }
    // For external payment methods (Bkash, Nagad, Card), no deduction needed
    // The payment is processed externally and the purchase is recorded

    cartResources.forEach(resource => {
      const newPurchase: Purchase = {
        id: `pur-${Date.now()}`,
        userId: currentUser.id,
        resourceId: resource.id,
        price: resource.price,
        priceType: resource.priceType,
        purchasedAt: new Date().toISOString(),
        paymentMethod: paymentMethod,
      };
      setPurchases([...purchases, newPurchase]);

      const newTransaction: Transaction = {
        id: `txn-${Date.now()}`,
        userId: currentUser.id,
        type: 'purchase',
        amount: resource.price,
        currency: resource.priceType === 'money' ? 'BDT' : 'Points',
        description: `Purchase of ${resource.title}`,
        createdAt: new Date().toISOString(),
      };
      setTransactions([...transactions, newTransaction]);

      setResources(resources.map(r => 
        r.id === resource.id 
          ? { ...r, downloads: r.downloads + 1 } 
          : r
      ));
    });

    setCartItems([]);
  };

  const getUserPurchases = (): Purchase[] => {
    if (!currentUser) {
      return [];
    }
    return purchases.filter(purchase => purchase.userId === currentUser.id);
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `not-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setNotifications([...notifications, newNotification]);
  };

  const getNotifications = (): Notification[] => {
    if (!currentUser) {
      return [];
    }
    return notifications.filter(notification => notification.userId === currentUser.id);
  };

  const addFeedback = (feedback: Omit<Feedback, 'id' | 'createdAt'>) => {
    const newFeedback: Feedback = {
      ...feedback,
      id: `fb-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setFeedbacks([...feedbacks, newFeedback]);
  };

  const getFeedbacks = (): Feedback[] => {
    if (!currentUser) {
      return [];
    }
    return feedbacks.filter(feedback => feedback.userId === currentUser.id);
  };

  const addWithdrawal = (withdrawal: Omit<Withdrawal, 'id' | 'createdAt'>) => {
    const newWithdrawal: Withdrawal = {
      ...withdrawal,
      id: `wd-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setWithdrawals([...withdrawals, newWithdrawal]);
  };

  const getWithdrawals = (): Withdrawal[] => {
    if (!currentUser) {
      return [];
    }
    return withdrawals.filter(withdrawal => withdrawal.userId === currentUser.id);
  };

  const getSellerRating = (): number => {
    if (!currentUser) {
      return 0;
    }
    // Get all purchases where feedback was given for items uploaded by current user
    const userUploads = resources.filter(r => r.uploaderId === currentUser.id);
    const uploadIds = userUploads.map(u => u.id);
    
    // Get purchases with ratings for the user's uploaded items
    const ratingsForUserItems = purchases.filter(p => 
      uploadIds.includes(p.resourceId) && p.rating !== undefined
    );
    
    if (ratingsForUserItems.length === 0) {
      return 0;
    }
    
    const totalRating = ratingsForUserItems.reduce((sum, p) => sum + (p.rating || 0), 0);
    return Number((totalRating / ratingsForUserItems.length).toFixed(1));
  };

  const addAppeal = (appeal: Omit<Appeal, 'id' | 'createdAt' | 'status'>) => {
    const newAppeal: Appeal = {
      ...appeal,
      id: `ap-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    setAppeals([...appeals, newAppeal]);
  };

  const getAppeals = (): Appeal[] => {
    if (!currentUser) {
      return [];
    }
    return appeals.filter(appeal => appeal.userId === currentUser.id);
  };

  const getAllAppeals = (): Appeal[] => {
    return appeals;
  };

  const reviewAppeal = (appealId: string, approve: boolean, adminResponse?: string) => {
    const appeal = appeals.find(a => a.id === appealId);
    
    setAppeals(appeals.map(a => 
      a.id === appealId 
        ? { ...a, status: approve ? 'approved' : 'rejected', reviewedAt: new Date().toISOString(), adminResponse } 
        : a
    ));
    
    // If appeal is approved, unban the user
    if (approve && appeal) {
      unbanUser(appeal.userId);
      
      // Send notification to the user
      const newNotification: Notification = {
        id: `not-${Date.now()}`,
        userId: appeal.userId,
        type: 'system',
        title: 'Appeal Approved',
        message: `Your appeal has been approved. Your account has been unbanned. ${adminResponse ? 'Admin response: ' + adminResponse : ''}`,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications([...notifications, newNotification]);
    } else if (!approve && appeal) {
      // Send rejection notification
      const newNotification: Notification = {
        id: `not-${Date.now()}`,
        userId: appeal.userId,
        type: 'system',
        title: 'Appeal Rejected',
        message: `Your appeal has been rejected. ${adminResponse ? 'Admin response: ' + adminResponse : ''}`,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications([...notifications, newNotification]);
    }
  };

  return (
    <MockDataContext.Provider
      value={{
        currentUser,
        users,
        resources,
        transactions,
        cartItems,
        purchases,
        feedbacks,
        login,
        adminLogin,
        register,
        logout,
        updateUser,
        verifyUser,
        banUser,
        unbanUser,
        setUserRestrictions,
        addResource,
        approveFile,
        deleteResource,
        addTransaction,
        getResourcesByCategory,
        getPendingUsers,
        getPendingFiles,
        getAllUsers,
        getFeaturedResources,
        addToCart,
        removeFromCart,
        getCartItems,
        purchaseFromCart,
        getUserPurchases,
        addNotification,
        getNotifications,
        addFeedback,
        getFeedbacks,
        addWithdrawal,
        getWithdrawals,
        getSellerRating,
        addAppeal,
        getAppeals,
        getAllAppeals,
        reviewAppeal,
      }}
    >
      {children}
    </MockDataContext.Provider>
  );
}

export function useMockData() {
  const context = useContext(MockDataContext);
  if (context === undefined) {
    throw new Error('useMockData must be used within a MockDataProvider');
  }
  return context;
}