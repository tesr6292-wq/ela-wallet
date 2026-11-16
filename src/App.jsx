
import React, { useEffect, useMemo, useState } from "react";
import {
  Wallet,
  Plus,
  Trash2,
  Copy,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  History,
  X,
  Check,
  AlertCircle,
  Calculator,
  TrendingUp,
  CreditCard,
  CalendarDays,
  RotateCcw,
  Search,
  Banknote,
  ShieldCheck,
  Activity,
} from "lucide-react";

// ==========================================
// EL.A WALLET - Main Configuration
// ==========================================

const STORAGE_KEY = "ELA_WALLET_V1";

const COLORS = {
  bg: "#0A192F",
  card: "#112240",
  card2: "#172D50",
  gold: "#D4AF37",
  goldLight: "#F0D878",
  white: "#E6EDF7",
  muted: "#8B9BB4",
  green: "#36C98F",
  red: "#F16B75",
  border: "rgba(212,175,55,0.2)",
};

const today = () => new Date().toLocaleDateString("en-CA");
const monthNow = () => today().slice(0, 7);

const uid = () =>
  globalThis.crypto?.randomUUID?.() ||
  `${Date.now()}_${Math.random().toString(36).slice(2)}`;

const number = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(0, n) : 0;
};

const money = (value) =>
  number(value).toLocaleString("ar-EG", {
    maximumFractionDigits: 2,
  });

const emptyUsage = () => ({
  day: today(),
  month: monthNow(),
  outDay: 0,
  outMonth: 0,
  inDay: 0,
  inMonth: 0,
});

function normalizeWallet(wallet) {
  const usage = wallet.usage || emptyUsage();

  return {
    ...wallet,
    id: wallet.id || uid(),
    name: wallet.name || "محفظة",
    phone: wallet.phone || "",
    balance: number(wallet.balance),
    limits: {
      outDay: number(wallet.limits?.outDay),
      outMonth: number(wallet.limits?.outMonth),
      inDay: number(wallet.limits?.inDay),
      inMonth: number(wallet.limits?.inMonth),
    },
    usage: {
      ...emptyUsage(),
      ...usage,
      outDay: usage.day === today() ? number(usage.outDay) : 0,
      inDay: usage.day === today() ? number(usage.inDay) : 0,
      outMonth: usage.month === monthNow() ? number(usage.outMonth) : 0,
      inMonth: usage.month === monthNow() ? number(usage.inMonth) : 0,
      day: today(),
      month: monthNow(),
    },
  };
}

function getInitialData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      return {
        wallets: Array.isArray(data.wallets)
          ? data.wallets.map(normalizeWallet)
          : [],
        transactions: Array.isArray(data.transactions)
          ? data.transactions
          : [],
      };
    }
  } catch (error) {
    console.error("EL.A WALLET storage error:", error);
  }

  return {
    wallets: [],
    transactions: [],
  };
}

// ==========================================
// Inline UI Components
// ==========================================

const styles = {
  app: {
    minHeight: "100vh",
    background: COLORS.bg,
    color: COLORS.white,
    direction: "rtl",
    fontFamily: "Tahoma, Arial, sans-serif",
    padding: "20px",
    boxSizing: "border-box",
  },
  container: {
    maxWidth: "1250px",
    margin: "auto",
  },
  card: {
    background: COLORS.card,
    border: `1px solid ${COLORS.border}`,
    borderRadius: "15px",
    padding: "18px",
    boxSizing: "border-box",
  },
  button: {
    background: COLORS.gold,
    color: COLORS.bg,
    border: "none",
    borderRadius: "9px",
    padding: "11px 16px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "13px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
  },
  secondary: {
    background: COLORS.card2,
    color: COLORS.white,
    border: `1px solid ${COLORS.border}`,
    borderRadius: "9px",
    padding: "10px 13px",
    cursor: "pointer",
    fontSize: "13px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    background: COLORS.bg,
    color: COLORS.white,
    border: "1px solid #304563",
    borderRadius: "8px",
    outline: "none",
    fontSize: "14px",
  },
  label: {
    display: "block",
    color: COLORS.muted,
    fontSize: "12px",
    marginBottom: "7px",
  },
};

function Field({ label, value, onChange, type = "text", placeholder = "" }) {
  return (
    <div style={{ minWidth: 0 }}>
      <label style={styles.label}>{label}</label>
      <input
        style={styles.input}
        type={type}
        value={value}
        placeholder={placeholder}
        min={type === "number" ? "0" : undefined}
        step={type === "number" ? "0.01" : undefined}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Stat({ title, value, icon: Icon, color = COLORS.gold }) {
  return (
    <div style={styles.card}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ color: COLORS.muted, fontSize: "12px" }}>
          {title}
        </span>
        <Icon size={19} color={color} />
      </div>
      <div
        style={{
          color,
          fontSize: "23px",
          fontWeight: "bold",
          marginTop: "12px",
          overflowWrap: "anywhere",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.78)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "15px",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "650px",
          maxHeight: "90vh",
          overflowY: "auto",
          background: COLORS.card,
          border: `1px solid ${COLORS.gold}`,
          borderRadius: "16px",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ margin: 0, color: COLORS.gold }}>{title}</h3>
          <button
            onClick={onClose}
            style={{ ...styles.secondary, padding: "7px" }}
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ==========================================
// Main Application
// ==========================================

export default function App() {
  const initial = useMemo(() => getInitialData(), []);

  const [wallets, setWallets] = useState(initial.wallets);
  const [transactions, setTransactions] = useState(initial.transactions);

  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedWallet, setSelectedWallet] = useState("");
  const [operationType, setOperationType] = useState("out");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [splitPlan, setSplitPlan] = useState(null);
  const [message, setMessage] = useState("");

  // ------------------------------------------
  // Persistent Storage
  // ------------------------------------------

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ wallets, transactions })
      );
    } catch (error) {
      console.error("Unable to save data:", error);
      setMessage("مقدرناش نحفظ البيانات. راجع مساحة التخزين في المتصفح.");
    }
  }, [wallets, transactions]);

  // Refresh expired daily/monthly usage automatically.
  useEffect(() => {
    setWallets((prev) => {
      let changed = false;

      const next = prev.map((w) => {
        const usage = { ...w.usage };
        let update = false;

        if (usage.day !== today()) {
          usage.day = today();
          usage.outDay = 0;
          usage.inDay = 0;
          update = true;
        }

        if (usage.month !== monthNow()) {
          usage.month = monthNow();
          usage.outMonth = 0;
          usage.inMonth = 0;
          update = true;
        }

        if (update) {
          changed = true;
          return { ...w, usage };
        }

        return w;
      });

      return changed ? next : prev;
    });
  }, []);

  // ------------------------------------------
  // Calculations
  // ------------------------------------------

  const totalBalance = wallets.reduce(
    (sum, w) => sum + w.balance,
    0
  );

  const totalOutToday = wallets.reduce(
    (sum, w) => sum + w.usage.outDay,
    0
  );

  const totalInToday = wallets.reduce(
    (sum, w) => sum + w.usage.inDay,
    0
  );

  const filteredWallets = wallets.filter(
    (w) =>
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.phone.includes(search)
  );

  const getRemaining = (wallet, type) => {
    const out = type === "out";

    const daily = out ? "outDay" : "inDay";
    const monthly = out ? "outMonth" : "inMonth";

    const dayLimit = wallet.limits[daily];
    const monthLimit = wallet.limits[monthly];

    const dayRemaining =
      dayLimit === 0
        ? Infinity
        : Math.max(0, dayLimit - wallet.usage[daily]);

    const monthRemaining =
      monthLimit === 0
        ? Infinity
        : Math.max(0, monthLimit - wallet.usage[monthly]);

    return {
      day: dayRemaining,
      month: monthRemaining,
      available: Math.min(dayRemaining, monthRemaining),
    };
  };

  const getCapacity = (wallet, type) => {
    const limits = getRemaining(wallet, type);

    if (type === "out") {
      return Math.min(wallet.balance, limits.available);
    }

    return limits.available;
  };

  // ------------------------------------------
  // Wallet Management
  // ------------------------------------------

  const addWallet = (data) => {
    if (!data.name.trim() || !data.phone.trim()) {
      setMessage("اكتب اسم المحفظة ورقمها الأول.");
      return;
    }

    if (wallets.some((w) => w.phone === data.phone.trim())) {
      setMessage("رقم المحفظة ده متسجل بالفعل.");
      return;
    }

    const usage = {
      day: today(),
      month: monthNow(),
      outDay: number(data.outDayUsed),
      outMonth: number(data.outMonthUsed),
      inDay: number(data.inDayUsed),
      inMonth: number(data.inMonthUsed),
    };

    const wallet = normalizeWallet({
      id: uid(),
      name: data.name.trim(),
      phone: data.phone.trim(),
      balance: number(data.balance),
      limits: {
        outDay: number(data.outDay),
        outMonth: number(data.outMonth),
        inDay: number(data.inDay),
        inMonth: number(data.inMonth),
      },
      usage,
    });

    setWallets((prev) => [...prev, wallet]);
    setModal(null);
    setMessage("تمت إضافة المحفظة بنجاح.");
  };

  const deleteWallet = (id) => {
    const wallet = wallets.find((w) => w.id === id);
    if (!wallet) return;

    if (
      !window.confirm(
        `متأكد إنك عايز تحذف ${wallet.name}؟ العمليات القديمة هتفضل في السجل.`
      )
    ) {
      return;
    }

    setWallets((prev) => prev.filter((w) => w.id !== id));

    if (selectedWallet === id) setSelectedWallet("");
    setSplitPlan(null);
    setMessage("تم حذف المحفظة.");
  };

  const copyPhone = async (phone) => {
    try {
      await navigator.clipboard.writeText(phone);
      setMessage("تم نسخ رقم المحفظة.");
    } catch {
      setMessage("تعذر النسخ. انسخ الرقم يدويًا.");
    }
  };

  // ------------------------------------------
  // Reset Limits
  // ------------------------------------------

  const resetLimits = (period) => {
    const label = period === "day" ? "اليومية" : "الشهرية";

    if (
      !window.confirm(
        `متأكد إنك عايز تصفر الحدود ${label} لكل المحافظ؟ الأرصدة مش هتتغير.`
      )
    ) {
      return;
    }

    setWallets((prev) =>
      prev.map((w) => ({
        ...w,
        usage: {
          ...w.usage,
          ...(period === "day"
            ? {
                day: today(),
                outDay: 0,
                inDay: 0,
              }
            : {
                month: monthNow(),
                outMonth: 0,
                inMonth: 0,
              }),
        },
      }))
    );

    setMessage(`تم تصفير الحدود ${label} مع الحفاظ على الأرصدة.`);
  };

  // ------------------------------------------
  // Smart Split Engine
  // ------------------------------------------

  const calculateSplit = () => {
    const requested = number(amount);

    if (!selectedWallet) {
      setMessage("اختار المحفظة الأول.");
      return;
    }

    if (requested <= 0) {
      setMessage("اكتب مبلغ صحيح أكبر من صفر.");
      return;
    }

    const firstWallet = wallets.find(
      (w) => w.id === selectedWallet
    );

    if (!firstWallet) {
      setMessage("المحفظة المختارة مش موجودة.");
      return;
    }

    // Start with the selected wallet, then use other valid wallets.
    const ordered = [
      firstWallet,
      ...wallets.filter((w) => w.id !== selectedWallet),
    ];

    let remaining = requested;
    const allocations = [];

    for (const wallet of ordered) {
      if (remaining <= 0) break;

      const capacity = getCapacity(wallet, operationType);
      const allocated = Math.min(remaining, capacity);

      if (allocated > 0) {
        allocations.push({
          walletId: wallet.id,
          walletName: wallet.name,
          phone: wallet.phone,
          amount: allocated,
        });

        remaining = Math.max(0, remaining - allocated);
      }
    }

    const firstAllocation = allocations.find(
      (a) => a.walletId === selectedWallet
    );

    setSplitPlan({
      requested,
      allocations,
      remaining,
      complete: remaining <= 0.000001,
      firstAmount: firstAllocation?.amount || 0,
      rest: requested - (firstAllocation?.amount || 0),
    });
  };

  // ------------------------------------------
  // Execute Operations
  // ------------------------------------------

  const executeOperation = () => {
    if (!splitPlan || !splitPlan.complete) return;

    const type = operationType;
    const requested = splitPlan.requested;
    const allocations = splitPlan.allocations;

    // Revalidate the whole plan against current wallet data.
    for (const allocation of allocations) {
      const wallet = wallets.find(
        (w) => w.id === allocation.walletId
      );

      if (
        !wallet ||
        getCapacity(wallet, type) + 0.000001 < allocation.amount
      ) {
        setSplitPlan(null);
        setMessage("البيانات اتغيرت. احسب التقسيم من جديد.");
        return;
      }
    }

    const now = new Date();

    const newTransactions = allocations.map((allocation) => ({
      id: uid(),
      walletId: allocation.walletId,
      walletName: allocation.walletName,
      phone: allocation.phone,
      type,
      amount: allocation.amount,
      description: description.trim() || (
        type === "out" ? "تحويل صادر" : "استلام وارد"
      ),
      date: now.toISOString(),
      timestamp: now.getTime(),
    }));

    setWallets((prev) =>
      prev.map((wallet) => {
        const allocation = allocations.find(
          (a) => a.walletId === wallet.id
        );

        if (!allocation) return wallet;

        const value = allocation.amount;
        const usage = { ...wallet.usage };

        if (type === "out") {
          return {
            ...wallet,
            balance: wallet.balance - value,
            usage: {
              ...usage,
              outDay: usage.outDay + value,
              outMonth: usage.outMonth + value,
            },
          };
        }

        return {
          ...wallet,
          balance: wallet.balance + value,
          usage: {
            ...usage,
            inDay: usage.inDay + value,
            inMonth: usage.inMonth + value,
          },
        };
      })
    );

    setTransactions((prev) => [
      ...newTransactions,
      ...prev,
    ]);

    setAmount("");
    setDescription("");
    setSplitPlan(null);
    setModal(null);

    setMessage(
      `تم تنفيذ ${type === "out" ? "الصادر" : "الوارد"} بقيمة ${money(requested)} جنيه على ${allocations.length} محفظة.`
    );
  };

  // ------------------------------------------
  // Form defaults
  // ------------------------------------------

  const [newWallet, setNewWallet] = useState({
    name: "",
    phone: "",
    balance: "",
    outDay: "",
    outMonth: "",
    inDay: "",
    inMonth: "",
    outDayUsed: "",
    outMonthUsed: "",
    inDayUsed: "",
    inMonthUsed: "",
  });

  const updateNewWallet = (key, value) => {
    setNewWallet((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // ------------------------------------------
  // UI
  // ------------------------------------------

  return (
    <div style={styles.app}>
      <div style={styles.container}>

        {/* HEADER */}

        <header
          style={{
            ...styles.card,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "15px",
            marginBottom: "20px",
            borderTop: `3px solid ${COLORS.gold}`,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Wallet size={30} color={COLORS.gold} />
              <h1
                style={{
                  margin: 0,
                  color: COLORS.gold,
                  fontSize: "27px",
                  letterSpacing: "1px",
                }}
              >
                EL.A WALLET
              </h1>
            </div>
            <p
              style={{
                color: COLORS.muted,
                fontSize: "12px",
                margin: "8px 0 0",
              }}
            >
              نظام إدارة المحافظ والأرصدة والحدود المالية
            </p>
          </div>

          <div style={{ textAlign: "left" }}>
            <div style={{ color: COLORS.gold, fontSize: "12px" }}>
              LOCAL WALLET MANAGER
            </div>
            <div
              style={{
                color: COLORS.green,
                fontSize: "12px",
                marginTop: "7px",
              }}
            >
              <ShieldCheck
                size={13}
                style={{ verticalAlign: "middle" }}
              />{" "}
              تخزين محلي
            </div>
          </div>
        </header>

        {/* NOTIFICATION */}

        {message && (
          <div
            style={{
              background: COLORS.card2,
              border: `1px solid ${COLORS.gold}`,
              borderRadius: "9px",
              padding: "12px",
              marginBottom: "16px",
              display: "flex",
              justifyContent: "space-between",
              gap: "10px",
              fontSize: "13px",
            }}
          >
            <span>{message}</span>
            <button
              onClick={() => setMessage("")}
              style={{
                background: "transparent",
                color: COLORS.white,
                border: "none",
                cursor: "pointer",
              }}
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* DASHBOARD STATS */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))",
            gap: "13px",
            marginBottom: "20px",
          }}
        >
          <Stat
            title="إجمالي الأرصدة"
            value={`${money(totalBalance)} ج.م`}
            icon={Wallet}
          />
          <Stat
            title="عدد المحافظ"
            value={wallets.length}
            icon={CreditCard}
          />
          <Stat
            title="الصادر اليوم"
            value={`${money(totalOutToday)} ج.م`}
            icon={ArrowUpRight}
            color={COLORS.red}
          />
          <Stat
            title="الوارد اليوم"
            value={`${money(totalInToday)} ج.م`}
            icon={ArrowDownLeft}
            color={COLORS.green}
          />
        </div>

        {/* QUICK ACTIONS */}

        <div
          style={{
            ...styles.card,
            marginBottom: "20px",
          }}
        >
          <h3
            style={{
              color: COLORS.gold,
              fontSize: "15px",
              marginTop: 0,
            }}
          >
            <Activity
              size={17}
              style={{ verticalAlign: "middle" }}
            />{" "}
            التحكم السريع
          </h3>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "9px",
            }}
          >
            <button
              style={styles.button}
              onClick={() => {
                setNewWallet({
                  name: "",
                  phone: "",
                  balance: "",
                  outDay: "",
                  outMonth: "",
                  inDay: "",
                  inMonth: "",
                  outDayUsed: "",
                  outMonthUsed: "",
                  inDayUsed: "",
                  inMonthUsed: "",
                });
                setModal("wallet");
              }}
            >
              <Plus size={17} /> إضافة محفظة
            </button>

            <button
              style={styles.secondary}
              onClick={() => resetLimits("day")}
            >
              <RotateCcw size={16} /> تصفير الحدود اليومية
            </button>

            <button
              style={styles.secondary}
              onClick={() => resetLimits("month")}
            >
              <CalendarDays size={16} /> تصفير الحدود الشهرية
            </button>

            <button
              style={styles.secondary}
              onClick={() => setModal("operation")}
            >
              <Calculator size={16} /> عملية جديدة
            </button>
          </div>

          <p
            style={{
              color: COLORS.muted,
              fontSize: "11px",
              marginBottom: 0,
              marginTop: "12px",
            }}
          >
            تصفير الحدود لا يغير رصيد أي محفظة، وبيانات الاستهلاك
            بتتجدد تلقائيًا مع بداية اليوم والشهر.
          </p>
        </div>

        {/* WALLETS */}

        <section style={{ marginBottom: "25px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
              marginBottom: "15px",
            }}
          >
            <h2
              style={{
                color: COLORS.gold,
                fontSize: "19px",
                margin: 0,
              }}
            >
              <Wallet
                size={20}
                style={{ verticalAlign: "middle" }}
              />{" "}
              المحافظ المسجلة
            </h2>

            <div style={{ width: "220px", maxWidth: "100%" }}>
              <input
                style={styles.input}
                placeholder="ابحث بالاسم أو الرقم..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {filteredWallets.length === 0 ? (
            <div
              style={{
                ...styles.card,
                textAlign: "center",
                padding: "40px 15px",
              }}
            >
              <Wallet
                size={40}
                color={COLORS.gold}
                style={{ marginBottom: "10px" }}
              />
              <p style={{ color: COLORS.muted }}>
                {wallets.length === 0
                  ? "لسه مفيش محافظ. ابدأ بإضافة أول محفظة."
                  : "مفيش نتائج مطابقة للبحث."}
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(280px,1fr))",
                gap: "14px",
              }}
            >
              {filteredWallets.map((wallet) => {
                const out = getRemaining(wallet, "out");
                const incoming = getRemaining(wallet, "in");

                return (
                  <div
                    key={wallet.id}
                    style={{
                      ...styles.card,
                      borderTop: `3px solid ${COLORS.gold}`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "10px",
                      }}
                    >
                      <div>
                        <h3
                          style={{
                            color: COLORS.gold,
                            margin: "0 0 8px",
                            fontSize: "16px",
                          }}
                        >
                          {wallet.name}
                        </h3>
                        <div
                          style={{
                            color: COLORS.muted,
                            fontSize: "12px",
                          }}
                        >
                          {wallet.phone}
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "5px" }}>
                        <button
                          title="نسخ الرقم"
                          onClick={() => copyPhone(wallet.phone)}
                          style={{
                            ...styles.secondary,
                            padding: "7px",
                            height: "34px",
                          }}
                        >
                          <Copy size={15} />
                        </button>

                        <button
                          title="حذف المحفظة"
                          onClick={() => deleteWallet(wallet.id)}
                          style={{
                            ...styles.secondary,
                            color: COLORS.red,
                            padding: "7px",
                            height: "34px",
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    <div
                      style={{
                        background: COLORS.bg,
                        borderRadius: "10px",
                        padding: "15px",
                        margin: "16px 0",
                      }}
                    >
                      <div
                        style={{
                          color: COLORS.muted,
                          fontSize: "12px",
                        }}
                      >
                        الرصيد الحالي
                      </div>
                      <div
                        style={{
                          color: COLORS.green,
                          fontSize: "25px",
                          fontWeight: "bold",
                          marginTop: "6px",
                        }}
                      >
                        {money(wallet.balance)}{" "}
                        <small style={{ fontSize: "12px" }}>ج.م</small>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "9px",
                      }}
                    >
                      <div
                        style={{
                          background: COLORS.card2,
                          padding: "10px",
                          borderRadius: "8px",
                        }}
                      >
                        <div
                          style={{
                            color: COLORS.red,
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          <ArrowUpRight
                            size={13}
                            style={{ verticalAlign: "middle" }}
                          />{" "}
                          الصادر المتاح
                        </div>
                        <div
                          style={{
                            marginTop: "7px",
                            fontWeight: "bold",
                          }}
                        >
                          {out.available === Infinity
                            ? "غير محدود"
                            : money(Math.min(out.available, wallet.balance))}
                        </div>
                      </div>

                      <div
                        style={{
                          background: COLORS.card2,
                          padding: "10px",
                          borderRadius: "8px",
                        }}
                      >
                        <div
                          style={{
                            color: COLORS.green,
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          <ArrowDownLeft
                            size={13}
                            style={{ verticalAlign: "middle" }}
                          />{" "}
                          الوارد المتاح
                        </div>
                        <div
                          style={{
                            marginTop: "7px",
                            fontWeight: "bold",
                          }}
                        >
                          {incoming.available === Infinity
                            ? "غير محدود"
                            : money(incoming.available)}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: "14px",
                        borderTop: `1px solid ${COLORS.border}`,
                        paddingTop: "12px",
                      }}
                    >
                      <div
                        style={{
                          color: COLORS.muted,
                          fontSize: "11px",
                          marginBottom: "8px",
                        }}
                      >
                        استهلاك الحدود
                      </div>

                      {[
                        {
                          label: "صادر يومي",
                          used: wallet.usage.outDay,
                          limit: wallet.limits.outDay,
                        },
                        {
                          label: "صادر شهري",
                          used: wallet.usage.outMonth,
                          limit: wallet.limits.outMonth,
                        },
                        {
                          label: "وارد يومي",
                          used: wallet.usage.inDay,
                          limit: wallet.limits.inDay,
                        },
                        {
                          label: "وارد شهري",
                          used: wallet.usage.inMonth,
                          limit: wallet.limits.inMonth,
                        },
                      ].map((item) => (
                        <div
                          key={item.label}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "5px",
                            marginBottom: "7px",
                            fontSize: "11px",
                          }}
                        >
                          <span style={{ color: COLORS.muted }}>
                            {item.label}
                          </span>
                          <span>
                            {money(item.used)} /{" "}
                            {item.limit === 0
                              ? "∞"
                              : money(item.limit)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <button
                      style={{
                        ...styles.button,
                        width: "100%",
                        marginTop: "10px",
                      }}
                      onClick={() => {
                        setSelectedWallet(wallet.id);
                        setSplitPlan(null);
                        setAmount("");
                        setModal("operation");
                      }}
                    >
                      <Calculator size={15} /> إجراء عملية
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* TRANSACTIONS HISTORY */}

        <section style={styles.card}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <h2
              style={{
                color: COLORS.gold,
                fontSize: "18px",
                margin: 0,
              }}
            >
              <History
                size={20}
                style={{ verticalAlign: "middle" }}
              />{" "}
              سجل العمليات
            </h2>

            <span style={{ color: COLORS.muted, fontSize: "12px" }}>
              {transactions.length} عملية
            </span>
          </div>

          {transactions.length === 0 ? (
            <p
              style={{
                textAlign: "center",
                color: COLORS.muted,
                padding: "20px",
              }}
            >
              مفيش عمليات لحد دلوقتي.
            </p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  minWidth: "650px",
                  borderCollapse: "collapse",
                  fontSize: "12px",
                }}
              >
                <thead>
                  <tr style={{ color: COLORS.gold }}>
                    {[
                      "التاريخ",
                      "المحفظة",
                      "الرقم",
                      "النوع",
                      "المبلغ",
                      "البيان",
                    ].map((title) => (
                      <th
                        key={title}
                        style={{
                          textAlign: "right",
                          padding: "12px 9px",
                          borderBottom: `1px solid ${COLORS.border}`,
                        }}
                      >
                        {title}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td
                        style={{
                          padding: "12px 9px",
                          borderBottom: "1px solid #263B59",
                        }}
                      >
                        {new Date(tx.date).toLocaleString("ar-EG")}
                      </td>

                      <td style={{ padding: "12px 9px" }}>
                        {tx.walletName}
                      </td>

                      <td style={{ padding: "12px 9px" }}>
                        {tx.phone}
                      </td>

                      <td style={{ padding: "12px 9px" }}>
                        <span
                          style={{
                            color:
                              tx.type === "out"
                                ? COLORS.red
                                : COLORS.green,
                            fontWeight: "bold",
                          }}
                        >
                          {tx.type === "out" ? "صادر" : "وارد"}
                        </span>
                      </td>

                      <td
                        style={{
                          padding: "12px 9px",
                          fontWeight: "bold",
                        }}
                      >
                        {money(tx.amount)} ج.م
                      </td>

                      <td style={{ padding: "12px 9px" }}>
                        {tx.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* FOOTER */}

        <footer
          style={{
            textAlign: "center",
            color: COLORS.muted,
            fontSize: "11px",
            padding: "25px 10px",
          }}
        >
          <div style={{ color: COLORS.gold, fontWeight: "bold" }}>
            EL.A WALLET
          </div>
          <p>نظام إدارة المحافظ المالية - إصدار محلي</p>
          <p>
            جميع البيانات محفوظة على الجهاز المستخدم.
          </p>
        </footer>
      </div>

      {/* ======================================
          ADD WALLET MODAL
      ====================================== */}

      {modal === "wallet" && (
        <Modal
          title="إضافة محفظة جديدة"
          onClose={() => setModal(null)}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))",
              gap: "13px",
            }}
          >
            <Field
              label="اسم المحفظة"
              placeholder="مثال: فودافون كاش"
              value={newWallet.name}
              onChange={(v) => updateNewWallet("name", v)}
            />

            <Field
              label="رقم المحفظة"
              placeholder="01xxxxxxxxx"
              value={newWallet.phone}
              onChange={(v) => updateNewWallet("phone", v)}
            />

            <Field
              label="الرصيد الابتدائي"
              type="number"
              value={newWallet.balance}
              onChange={(v) => updateNewWallet("balance", v)}
            />
          </div>

          <h4 style={{ color: COLORS.gold, marginTop: "25px" }}>
            حدود الصادر (التحويل)
          </h4>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
              gap: "12px",
            }}
          >
            <Field
              label="الحد اليومي للصادر"
              type="number"
              value={newWallet.outDay}
              onChange={(v) => updateNewWallet("outDay", v)}
            />
            <Field
              label="الحد الشهري للصادر"
              type="number"
              value={newWallet.outMonth}
              onChange={(v) => updateNewWallet("outMonth", v)}
            />
          </div>

          <h4 style={{ color: COLORS.green, marginTop: "22px" }}>
            حدود الوارد (الاستلام)
          </h4>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
              gap: "12px",
            }}
          >
            <Field
              label="الحد اليومي للوارد"
              type="number"
              value={newWallet.inDay}
              onChange={(v) => updateNewWallet("inDay", v)}
            />
            <Field
              label="الحد الشهري للوارد"
              type="number"
              value={newWallet.inMonth}
              onChange={(v) => updateNewWallet("inMonth", v)}
            />
          </div>

          <h4 style={{ color: COLORS.gold, marginTop: "22px" }}>
            استهلاك سابق قبل تسجيل المحفظة
          </h4>

          <p
            style={{
              color: COLORS.muted,
              fontSize: "11px",
              marginTop: "-5px",
            }}
          >
            اكتب المبالغ المستهلكة بالفعل عشان البرنامج يحسب المتبقي
            بشكل صحيح.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
              gap: "12px",
            }}
          >
            <Field
              label="استهلاك الصادر اليومي"
              type="number"
              value={newWallet.outDayUsed}
              onChange={(v) => updateNewWallet("outDayUsed", v)}
            />
            <Field
              label="استهلاك الصادر الشهري"
              type="number"
              value={newWallet.outMonthUsed}
              onChange={(v) => updateNewWallet("outMonthUsed", v)}
            />
            <Field
              label="استهلاك الوارد اليومي"
              type="number"
              value={newWallet.inDayUsed}
              onChange={(v) => updateNewWallet("inDayUsed", v)}
            />
            <Field
              label="استهلاك الوارد الشهري"
              type="number"
              value={newWallet.inMonthUsed}
              onChange={(v) => updateNewWallet("inMonthUsed", v)}
            />
          </div>

          <p
            style={{
              fontSize: "11px",
              color: COLORS.muted,
              marginTop: "14px",
            }}
          >
            ملحوظة: اكتب صفر أو اترك الحد فارغًا لو الحد غير محدود.
            الحدود بتتطبق على الصادر والوارد بشكل مستقل.
          </p>

          <button
            style={{
              ...styles.button,
              width: "100%",
              marginTop: "15px",
            }}
            onClick={() => addWallet(newWallet)}
          >
            <Check size={17} /> حفظ المحفظة
          </button>
        </Modal>
      )}

      {/* ======================================
          OPERATION MODAL
      ====================================== */}

      {modal === "operation" && (
        <Modal
          title="تنفيذ عملية مالية"
          onClose={() => {
            setModal(null);
            setSplitPlan(null);
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <button
              onClick={() => {
                setOperationType("out");
                setSplitPlan(null);
              }}
              style={{
                ...styles.button,
                background:
                  operationType === "out"
                    ? COLORS.red
                    : COLORS.card2,
                color: "#fff",
                border:
                  operationType === "out"
                    ? "none"
                    : `1px solid ${COLORS.border}`,
              }}
            >
              <ArrowUpRight size={17} /> صادر (تحويل)
            </button>

            <button
              onClick={() => {
                setOperationType("in");
                setSplitPlan(null);
              }}
              style={{
                ...styles.button,
                background:
                  operationType === "in"
                    ? COLORS.green
                    : COLORS.card2,
                color: "#fff",
                border:
                  operationType === "in"
                    ? "none"
                    : `1px solid ${COLORS.border}`,
              }}
            >
              <ArrowDownLeft size={17} /> وارد (استلام)
            </button>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={styles.label}>المحفظة الأساسية</label>
            <select
              value={selectedWallet}
              onChange={(e) => {
                setSelectedWallet(e.target.value);
                setSplitPlan(null);
              }}
              style={{
                ...styles.input,
                colorScheme: "dark",
              }}
            >
              <option value="">اختار المحفظة</option>
              {wallets.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} - {w.phone}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <Field
              label="المبلغ المطلوب بالجنيه"
              type="number"
              value={amount}
              onChange={(v) => {
                setAmount(v);
                setSplitPlan(null);
              }}
            />
          </div>

          <div style={{ marginBottom: "18px" }}>
            <Field
              label="بيان العملية (اختياري)"
              value={description}
              onChange={(v) => {
                setDescription(v);
                setSplitPlan(null);
              }}
              placeholder="مثال: تحويل عميل"
            />
          </div>

          <button
            style={{ ...styles.button, width: "100%" }}
            onClick={calculateSplit}
          >
            <Calculator size={18} /> احسب المتاح والتقسيم الذكي
          </button>

          {/* SPLIT PREVIEW */}

          {splitPlan && (
            <div
              style={{
                marginTop: "20px",
                background: COLORS.bg,
                border: `1px solid ${COLORS.border}`,
                borderRadius: "12px",
                padding: "15px",
              }}
            >
              <h3
                style={{
                  color: COLORS.gold,
                  fontSize: "15px",
                  marginTop: 0,
                }}
              >
                نتيجة التقسيم الذكي
              </h3>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "13px",
                  marginBottom: "12px",
                }}
              >
                <span style={{ color: COLORS.muted }}>
                  المبلغ المطلوب
                </span>
                <strong>{money(splitPlan.requested)} ج.م</strong>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "13px",
                  marginBottom: "12px",
                }}
              >
                <span style={{ color: COLORS.muted }}>
                  المتاح في المحفظة الأساسية
                </span>
                <strong style={{ color: COLORS.green }}>
                  {money(splitPlan.firstAmount)} ج.م
                </strong>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "13px",
                  marginBottom: "15px",
                }}
              >
                <span style={{ color: COLORS.muted }}>
                  المبلغ المتبقي بعد المحفظة الأساسية
                </span>
                <strong style={{ color: COLORS.gold }}>
                  {money(splitPlan.rest)} ج.م
                </strong>
              </div>

              <div
                style={{
                  borderTop: `1px solid ${COLORS.border}`,
                  paddingTop: "12px",
                }}
              >
                <div
                  style={{
                    color: COLORS.gold,
                    fontSize: "13px",
                    fontWeight: "bold",
                    marginBottom: "12px",
                  }}
                >
                  توزيع المبلغ على المحافظ
                </div>

                {splitPlan.allocations.map((allocation, index) => (
                  <div
                    key={allocation.walletId}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "8px",
                      background: COLORS.card2,
                      padding: "11px",
                      borderRadius: "8px",
                      marginBottom: "8px",
                      fontSize: "12px",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: "bold" }}>
                        {index === 0
                          ? "المحفظة الأساسية"
                          : "المحفظة البديلة"}
                      </div>
                      <div
                        style={{
                          color: COLORS.muted,
                          marginTop: "5px",
                        }}
                      >
                        {allocation.walletName} - {allocation.phone}
                      </div>
                    </div>

                    <strong style={{ color: COLORS.green }}>
                      {money(allocation.amount)} ج.م
                    </strong>
                  </div>
                ))}

                {splitPlan.complete ? (
                  <div
                    style={{
                      background: "rgba(54,201,143,0.1)",
                      color: COLORS.green,
                      padding: "12px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      marginTop: "12px",
                    }}
                  >
                    <Check
                      size={16}
                      style={{ verticalAlign: "middle" }}
                    />{" "}
                    المبلغ متاح بالكامل. تقدر تنفذ العملية على المحافظ
                    دي بضغطة واحدة.
                  </div>
                ) : (
                  <div
                    style={{
                      background: "rgba(241,107,117,0.1)",
                      color: COLORS.red,
                      padding: "12px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      marginTop: "12px",
                    }}
                  >
                    <AlertCircle
                      size={16}
                      style={{ verticalAlign: "middle" }}
                    />{" "}
                    المتبقي غير متاح في باقي المحافظ:{" "}
                    {money(splitPlan.remaining)} جنيه. مش هننفذ
                    العملية الناقصة.
                  </div>
                )}
              </div>

              <button
                disabled={!splitPlan.complete}
                onClick={executeOperation}
                style={{
                  ...styles.button,
                  width: "100%",
                  marginTop: "15px",
                  opacity: splitPlan.complete ? 1 : 0.4,
                  cursor: splitPlan.complete
                    ? "pointer"
                    : "not-allowed",
                  background: splitPlan.complete
                    ? COLORS.green
                    : COLORS.muted,
                }}
              >
                <Check size={18} /> تأكيد وتنفيذ العملية بالكامل
              </button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
