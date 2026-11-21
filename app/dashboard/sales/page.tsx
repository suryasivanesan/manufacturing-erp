'use client';

import React, { useState, useEffect, useMemo, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  FileText,
  ShoppingCart,
  Truck,
  CreditCard,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  DollarSign,
  Plus,
  Printer,
  Download,
  Search,
  Building2,
  Sun,
  Moon,
  ArrowLeft,
  X,
  FileCheck2,
  Percent,
  Warehouse,
  Award,
  Calendar,
  XCircle,
  Users,
  Target,
  Send,
  Scale,
  Sparkles,
  Layers,
  ChevronRight,
  Star,
  Activity,
  Briefcase,
} from 'lucide-react';

// =========================================================================
// DATA INTERFACES
// =========================================================================

interface SalesLeadAcquisition {
  id: string;
  leadCode: string;
  clientCompanyName: string;
  contactPerson: string;
  contactPhone?: string | null;
  contactEmail?: string | null;
  leadSource: string;
  industrySegment: string;
  targetProducts: string;
  estimatedAnnualValue?: number | null;
  leadScore?: number | null;
  status: string;
  assignedSalesOfficer?: string | null;
  notes?: string | null;
  companyId: string;
  createdAt: string;
}

interface SalesQuotationNegotiation {
  id: string;
  quotationNumber: string;
  inquiryReference?: string | null;
  leadId?: string | null;
  clientCompanyName: string;
  productDescription: string;
  orderQuantity: number;
  unit: string;
  rawMaterialCost: number;
  productionOverheadCost: number;
  profitMarginPct: number;
  calculatedBaseRate: number;
  finalQuotedRate: number;
  totalQuotationValue: number;
  creditPeriodDays: number;
  advancePaymentPct: number;
  deliveryChargesTerms: string;
  status: string;
  validTill?: string | null;
  notes?: string | null;
  companyId: string;
  createdAt: string;
}

interface SalesOrderExecution {
  id: string;
  salesOrderNumber: string;
  quotationReference?: string | null;
  clientPurchaseOrderNo: string;
  clientCompanyName: string;
  productName: string;
  orderQuantity: number;
  unit: string;
  unitRate: number;
  totalOrderValue: number;
  inventoryStockCheckStatus: string;
  productionManagerConfirmed: boolean;
  estimatedDeliveryDate: string;
  executionProgressPct: number;
  orderStatus: string;
  assignedProductionLine?: string | null;
  notes?: string | null;
  companyId: string;
  createdAt: string;
}

interface SalesDispatchLogistics {
  id: string;
  dispatchTrackingCode: string;
  salesOrderNumber: string;
  clientCompanyName: string;
  deliveryChallanNumber: string;
  eWayBillNumber?: string | null;
  transporterFleetCarrier: string;
  vehicleNumber: string;
  driverNameAndContact?: string | null;
  dispatchWeightKg: number;
  destinationLocation: string;
  loadingBay: string;
  dispatchStatus: string;
  proofOfDeliveryReceived: boolean;
  dispatchedAt?: string | null;
  deliveredAt?: string | null;
  notes?: string | null;
  companyId: string;
  createdAt: string;
}

interface SalesCreditBilling {
  id: string;
  invoiceNumber: string;
  salesOrderNumber: string;
  deliveryChallanNumber?: string | null;
  clientCompanyName: string;
  clientGstNumber?: string | null;
  totalInvoiceAmount: number;
  taxAmount: number;
  netPayableAmount: number;
  dealerCreditLimit: number;
  outstandingBalance: number;
  paymentDueDate: string;
  paymentStatus: string;
  paidAmount: number;
  paymentReferenceUTR?: string | null;
  lastFollowUpDate?: string | null;
  notes?: string | null;
  companyId: string;
  createdAt: string;
}

interface SalesCustomerFeedback {
  id: string;
  ticketNumber: string;
  clientCompanyName: string;
  salesOrderNumber?: string | null;
  invoiceNumber?: string | null;
  feedbackType: string;
  issueDescription: string;
  severityLevel: string;
  rejectedQuantity?: number | null;
  unit?: string | null;
  qualityReplacementApproved: boolean;
  replacementOrderCode?: string | null;
  resolutionStatus: string;
  customerRating?: number | null;
  capaActionPlan?: string | null;
  resolvedAt?: string | null;
  notes?: string | null;
  companyId: string;
  createdAt: string;
}

type SalesTab =
  | 'leads'
  | 'quotations'
  | 'orders'
  | 'dispatches'
  | 'billings'
  | 'feedbacks';

export default function SalesPage() {
  const router = useRouter();

  // Dark / Light Mode (strictly defaults to light)
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active Tab
  const [salesTab, setSalesTab] = useState<SalesTab>('leads');

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');

  // Modal Visibility States
  const [isNewLeadModal, setIsNewLeadModal] = useState(false);
  const [isNewQuotationModal, setIsNewQuotationModal] = useState(false);
  const [isNewOrderModal, setIsNewOrderModal] = useState(false);
  const [isNewDispatchModal, setIsNewDispatchModal] = useState(false);
  const [isNewBillingModal, setIsNewBillingModal] = useState(false);
  const [isNewFeedbackModal, setIsNewFeedbackModal] = useState(false);

  // Print Modal
  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState<SalesOrderExecution | null>(null);

  // =========================================================================
  // DATA STATES (STRICTLY CLEAN INITIAL STATE - ZERO HARDCODED MOCKS)
  // =========================================================================

  const [leadList, setLeadList] = useState<SalesLeadAcquisition[]>([]);
  const [quotationList, setQuotationList] = useState<SalesQuotationNegotiation[]>([]);
  const [orderList, setOrderList] = useState<SalesOrderExecution[]>([]);
  const [dispatchList, setDispatchList] = useState<SalesDispatchLogistics[]>([]);
  const [billingList, setBillingList] = useState<SalesCreditBilling[]>([]);
  const [feedbackList, setFeedbackList] = useState<SalesCustomerFeedback[]>([]);

  // =========================================================================
  // LIFECYCLE & AUTH LOAD
  // =========================================================================

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }

    const storedUser = localStorage.getItem('user') || localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setCurrentUser(parsed);
      } catch (e) {
        console.error('Failed to parse user session', e);
      }
    }

    fetchInitialSalesData();
  }, []);

  const fetchInitialSalesData = async () => {
    try {
      const token = localStorage.getItem('access_token') || localStorage.getItem('auth_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const [resL, resQ, resO, resD, resB, resF] = await Promise.allSettled([
        fetch(`${apiUrl}/sales/leads`, { headers }).then((r) => (r.ok ? r.json() : [])),
        fetch(`${apiUrl}/sales/quotations`, { headers }).then((r) => (r.ok ? r.json() : [])),
        fetch(`${apiUrl}/sales/orders`, { headers }).then((r) => (r.ok ? r.json() : [])),
        fetch(`${apiUrl}/sales/dispatches`, { headers }).then((r) => (r.ok ? r.json() : [])),
        fetch(`${apiUrl}/sales/billings`, { headers }).then((r) => (r.ok ? r.json() : [])),
        fetch(`${apiUrl}/sales/feedbacks`, { headers }).then((r) => (r.ok ? r.json() : [])),
      ]);

      setLeadList(resL.status === 'fulfilled' && Array.isArray(resL.value) ? resL.value : []);
      setQuotationList(resQ.status === 'fulfilled' && Array.isArray(resQ.value) ? resQ.value : []);
      setOrderList(resO.status === 'fulfilled' && Array.isArray(resO.value) ? resO.value : []);
      setDispatchList(resD.status === 'fulfilled' && Array.isArray(resD.value) ? resD.value : []);
      setBillingList(resB.status === 'fulfilled' && Array.isArray(resB.value) ? resB.value : []);
      setFeedbackList(resF.status === 'fulfilled' && Array.isArray(resF.value) ? resF.value : []);
    } catch {
      setLeadList([]);
      setQuotationList([]);
      setOrderList([]);
      setDispatchList([]);
      setBillingList([]);
      setFeedbackList([]);
    }
  };

  const toggleTheme = () => {
    if (!isDark) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const companyName = currentUser?.company?.name || 'Manufacturing Enterprise';
  const tenantSubCategory = currentUser?.company?.subCategory || currentUser?.subCategory || 'Industrial Manufacturing';

  // =========================================================================
  // ACTION HANDLERS
  // =========================================================================

  // 1. Leads
  const handleAddLead = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const newLead: SalesLeadAcquisition = {
      id: `lead-${Date.now()}`,
      leadCode: `LEAD-2026-${Math.floor(100 + Math.random() * 900)}`,
      clientCompanyName: String(data.get('clientCompanyName') || 'Prospective Enterprise Client'),
      contactPerson: String(data.get('contactPerson') || 'Procurement Executive'),
      contactPhone: String(data.get('contactPhone') || '+91 98000 00000'),
      contactEmail: String(data.get('contactEmail') || 'purchasing@client.com'),
      leadSource: String(data.get('leadSource') || 'DIRECT_INQUIRY'),
      industrySegment: String(data.get('industrySegment') || 'AUTOMOTIVE_OEM'),
      targetProducts: String(data.get('targetProducts') || 'Standard Engineering Products'),
      estimatedAnnualValue: Number(data.get('estimatedAnnualValue')) || 10000000,
      leadScore: Number(data.get('leadScore')) || 85.0,
      status: 'QUALIFIED_PROSPECT',
      assignedSalesOfficer: String(data.get('assignedSalesOfficer') || 'Vikram Rao (Regional Sales Lead)'),
      notes: String(data.get('notes') || 'Inquiry registered into sales conversion funnel.'),
      companyId: currentUser?.companyId || 'company_isolated_01',
      createdAt: 'Just now',
    };

    setLeadList([newLead, ...leadList]);
    setIsNewLeadModal(false);
    showToast(`Lead ${newLead.leadCode} registered successfully.`);
  };

  const handleAdvanceLeadStatus = (id: string) => {
    setLeadList(
      leadList.map((l) => {
        if (l.id === id) {
          const next =
            l.status === 'NEW_INQUIRY'
              ? 'QUALIFIED_PROSPECT'
              : l.status === 'QUALIFIED_PROSPECT'
              ? 'CONVERTED_TO_RFQ'
              : 'CONVERTED_TO_RFQ';
          return {
            ...l,
            status: next,
            leadScore: Math.min(100, (l.leadScore || 80) + 10),
          };
        }
        return l;
      }),
    );
    showToast('Lead conversion stage updated.');
  };

  // 2. Quotations
  const handleAddQuotation = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const qty = Number(data.get('orderQuantity')) || 50;
    const rawCost = Number(data.get('rawMaterialCost')) || 45000;
    const overhead = Number(data.get('productionOverheadCost')) || 4000;
    const marginPct = Number(data.get('profitMarginPct')) || 15;
    const baseRate = Number(((rawCost + overhead) * (1 + marginPct / 100)).toFixed(2));
    const quotedRate = Number(data.get('finalQuotedRate')) || baseRate;
    const totalVal = Number((quotedRate * qty).toFixed(2));

    const newQuotation: SalesQuotationNegotiation = {
      id: `quot-${Date.now()}`,
      quotationNumber: `QUOT-2026-${Math.floor(100 + Math.random() * 900)}`,
      inquiryReference: String(data.get('inquiryReference') || `INQ-2026-${Math.floor(100 + Math.random() * 900)}`),
      leadId: null,
      clientCompanyName: String(data.get('clientCompanyName') || 'Enterprise Client'),
      productDescription: String(data.get('productDescription') || 'Manufactured Alloy Product'),
      orderQuantity: qty,
      unit: String(data.get('unit') || 'MT'),
      rawMaterialCost: rawCost,
      productionOverheadCost: overhead,
      profitMarginPct: marginPct,
      calculatedBaseRate: baseRate,
      finalQuotedRate: quotedRate,
      totalQuotationValue: totalVal,
      creditPeriodDays: Number(data.get('creditPeriodDays')) || 30,
      advancePaymentPct: Number(data.get('advancePaymentPct')) || 20,
      deliveryChargesTerms: String(data.get('deliveryChargesTerms') || 'FOR_DESTINATION'),
      status: 'SUBMITTED_TO_CLIENT',
      validTill: '2026-12-31',
      notes: String(data.get('notes') || 'Quotation generated from direct BOM cost sheet.'),
      companyId: currentUser?.companyId || 'company_isolated_01',
      createdAt: 'Just now',
    };

    setQuotationList([newQuotation, ...quotationList]);
    setIsNewQuotationModal(false);
    showToast(`Quotation ${newQuotation.quotationNumber} generated (₹${totalVal.toLocaleString()}).`);
  };

  const handleFinalizeAgreement = (id: string) => {
    setQuotationList(
      quotationList.map((q) => {
        if (q.id === id) {
          return {
            ...q,
            status: 'AGREEMENT_FINALIZED',
            notes: 'Commercial terms agreed. Customer PO issued.',
          };
        }
        return q;
      }),
    );
    showToast('Quotation agreement finalized and approved.');
  };

  // 3. Sales Orders
  const handleAddOrder = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const qty = Number(data.get('orderQuantity')) || 50;
    const rate = Number(data.get('unitRate')) || 60000;
    const totalVal = Number((qty * rate).toFixed(2));

    const newOrder: SalesOrderExecution = {
      id: `so-${Date.now()}`,
      salesOrderNumber: `SO-2026-${Math.floor(100 + Math.random() * 900)}`,
      quotationReference: String(data.get('quotationReference') || 'QUOT-2026-088'),
      clientPurchaseOrderNo: String(data.get('clientPurchaseOrderNo') || `PO-CUST-${Math.floor(1000 + Math.random() * 9000)}`),
      clientCompanyName: String(data.get('clientCompanyName') || 'Enterprise Client'),
      productName: String(data.get('productName') || 'Certified Manufactured Material'),
      orderQuantity: qty,
      unit: String(data.get('unit') || 'MT'),
      unitRate: rate,
      totalOrderValue: totalVal,
      inventoryStockCheckStatus: 'STOCK_SUFFICIENT',
      productionManagerConfirmed: true,
      estimatedDeliveryDate: String(data.get('estimatedDeliveryDate') || '2026-12-05'),
      executionProgressPct: 10.0,
      orderStatus: 'ORDER_CONFIRMED',
      assignedProductionLine: String(data.get('assignedProductionLine') || 'Main Rolling Bay #1'),
      notes: String(data.get('notes') || 'Order scheduled for line casting & rolling.'),
      companyId: currentUser?.companyId || 'company_isolated_01',
      createdAt: 'Just now',
    };

    setOrderList([newOrder, ...orderList]);
    setIsNewOrderModal(false);
    showToast(`Sales Order ${newOrder.salesOrderNumber} created (₹${totalVal.toLocaleString()}).`);
  };

  const handleAdvanceOrderStatus = (id: string) => {
    setOrderList(
      orderList.map((o) => {
        if (o.id === id) {
          const next =
            o.orderStatus === 'ORDER_CONFIRMED'
              ? 'IN_PRODUCTION'
              : o.orderStatus === 'IN_PRODUCTION'
              ? 'READY_FOR_DISPATCH'
              : o.orderStatus === 'READY_FOR_DISPATCH'
              ? 'DISPATCHED'
              : 'COMPLETED';
          const progress = next === 'COMPLETED' ? 100 : next === 'READY_FOR_DISPATCH' ? 95 : 60;
          return {
            ...o,
            orderStatus: next,
            executionProgressPct: progress,
          };
        }
        return o;
      }),
    );
    showToast('Sales Order manufacturing stage advanced.');
  };

  // 4. Dispatch Logistics
  const handleAddDispatch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const newDispatch: SalesDispatchLogistics = {
      id: `disp-${Date.now()}`,
      dispatchTrackingCode: `DISP-LOG-2026-${Math.floor(100 + Math.random() * 900)}`,
      salesOrderNumber: String(data.get('salesOrderNumber') || 'SO-2026-110'),
      clientCompanyName: String(data.get('clientCompanyName') || 'Enterprise Client'),
      deliveryChallanNumber: `DC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      eWayBillNumber: `EWB-${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      transporterFleetCarrier: String(data.get('transporterFleetCarrier') || 'VRL Heavy Freight Carriers'),
      vehicleNumber: String(data.get('vehicleNumber') || 'MH-12-RN-9921'),
      driverNameAndContact: String(data.get('driverNameAndContact') || 'Driver (+91 98000 00000)'),
      dispatchWeightKg: Number(data.get('dispatchWeightKg')) || 25000,
      destinationLocation: String(data.get('destinationLocation') || 'Client Factory Gate, Chakan MIDC'),
      loadingBay: String(data.get('loadingBay') || 'BAY-DISP-01'),
      dispatchStatus: 'DISPATCHED_IN_TRANSIT',
      proofOfDeliveryReceived: false,
      dispatchedAt: 'Just now',
      deliveredAt: null,
      notes: String(data.get('notes') || 'Consignment loaded and security gate cleared.'),
      companyId: currentUser?.companyId || 'company_isolated_01',
      createdAt: 'Just now',
    };

    setDispatchList([newDispatch, ...dispatchList]);
    setIsNewDispatchModal(false);
    showToast(`Dispatch ${newDispatch.dispatchTrackingCode} logged with DC ${newDispatch.deliveryChallanNumber}.`);
  };

  const handleConfirmPod = (id: string) => {
    setDispatchList(
      dispatchList.map((d) => {
        if (d.id === id) {
          return {
            ...d,
            dispatchStatus: 'DELIVERED_POD_RECEIVED',
            proofOfDeliveryReceived: true,
            deliveredAt: 'Just now',
            notes: 'Physical / Digital Proof of Delivery signed by consignee.',
          };
        }
        return d;
      }),
    );
    showToast('Delivery confirmed and Proof of Delivery (POD) archived.');
  };

  // 5. Billing & Invoicing
  const handleAddBilling = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const baseAmt = Number(data.get('totalInvoiceAmount')) || 2000000;
    const taxAmt = Number((baseAmt * 0.18).toFixed(2));
    const netAmt = Number((baseAmt + taxAmt).toFixed(2));

    const newBilling: SalesCreditBilling = {
      id: `bill-${Date.now()}`,
      invoiceNumber: `INV-SLS-2026-${Math.floor(100 + Math.random() * 900)}`,
      salesOrderNumber: String(data.get('salesOrderNumber') || 'SO-2026-110'),
      deliveryChallanNumber: `DC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      clientCompanyName: String(data.get('clientCompanyName') || 'Enterprise Client'),
      clientGstNumber: String(data.get('clientGstNumber') || '27AAACM1234F1Z5'),
      totalInvoiceAmount: baseAmt,
      taxAmount: taxAmt,
      netPayableAmount: netAmt,
      dealerCreditLimit: Number(data.get('dealerCreditLimit')) || 5000000,
      outstandingBalance: netAmt,
      paymentDueDate: String(data.get('paymentDueDate') || '2026-12-25'),
      paymentStatus: 'PAYMENT_DUE',
      paidAmount: 0.0,
      paymentReferenceUTR: null,
      lastFollowUpDate: 'Today',
      notes: String(data.get('notes') || 'Commercial tax invoice with 18% GST issued.'),
      companyId: currentUser?.companyId || 'company_isolated_01',
      createdAt: 'Just now',
    };

    setBillingList([newBilling, ...billingList]);
    setIsNewBillingModal(false);
    showToast(`Invoice ${newBilling.invoiceNumber} generated for ₹${netAmt.toLocaleString()}.`);
  };

  const handleSettlePayment = (id: string) => {
    setBillingList(
      billingList.map((b) => {
        if (b.id === id) {
          const utr = `UTR-HDFC-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
          return {
            ...b,
            paidAmount: b.netPayableAmount,
            outstandingBalance: 0.0,
            paymentStatus: 'FULLY_SETTLED',
            paymentReferenceUTR: utr,
            notes: 'Payment settled via bank wire UTR.',
          };
        }
        return b;
      }),
    );
    showToast('Payment credited in full and marked as SETTLED.');
  };

  // 6. CRM & Customer Feedback
  const handleAddFeedback = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const newFeedback: SalesCustomerFeedback = {
      id: `crm-${Date.now()}`,
      ticketNumber: `CRM-TKT-2026-${Math.floor(100 + Math.random() * 900)}`,
      clientCompanyName: String(data.get('clientCompanyName') || 'Enterprise Client'),
      salesOrderNumber: String(data.get('salesOrderNumber') || 'SO-2026-110'),
      invoiceNumber: `INV-SLS-2026-${Math.floor(100 + Math.random() * 900)}`,
      feedbackType: String(data.get('feedbackType') || 'CUSTOMER_COMPLAINT'),
      issueDescription: String(data.get('issueDescription') || 'Customer issue description'),
      severityLevel: String(data.get('severityLevel') || 'MEDIUM'),
      rejectedQuantity: Number(data.get('rejectedQuantity')) || 0,
      unit: 'MT',
      qualityReplacementApproved: false,
      replacementOrderCode: null,
      resolutionStatus: 'OPEN_INVESTIGATING',
      customerRating: Number(data.get('customerRating')) || 4.5,
      capaActionPlan: null,
      resolvedAt: null,
      notes: String(data.get('notes') || 'Ticket logged for QA & Sales follow-up.'),
      companyId: currentUser?.companyId || 'company_isolated_01',
      createdAt: 'Just now',
    };

    setFeedbackList([newFeedback, ...feedbackList]);
    setIsNewFeedbackModal(false);
    showToast(`Ticket ${newFeedback.ticketNumber} opened in CRM.`);
  };

  const handleResolveFeedback = (id: string) => {
    setFeedbackList(
      feedbackList.map((f) => {
        if (f.id === id) {
          const replCode = f.rejectedQuantity && f.rejectedQuantity > 0 ? `SO-REPL-2026-${Math.floor(10 + Math.random() * 90)}` : null;
          return {
            ...f,
            resolutionStatus: 'RESOLVED_CLOSED',
            qualityReplacementApproved: replCode !== null,
            replacementOrderCode: replCode,
            capaActionPlan: 'Root cause analyzed by Quality Incharge. Standard process controls implemented.',
            resolvedAt: 'Just now',
            notes: 'Customer accepted root-cause corrective action.',
          };
        }
        return f;
      }),
    );
    showToast('Customer complaint resolved and CAPA closed.');
  };

  // =========================================================================
  // METRICS & KPIS CALCULATIONS
  // =========================================================================

  const kpis = useMemo(() => {
    const activePipelineValue = leadList.reduce((sum, l) => sum + (l.estimatedAnnualValue || 0), 0);
    const totalOrderBookValue = orderList.reduce((sum, o) => sum + o.totalOrderValue, 0);
    const activeOrdersCount = orderList.filter((o) => o.orderStatus !== 'COMPLETED').length;
    const totalInvoicedRevenue = billingList.reduce((sum, b) => sum + b.netPayableAmount, 0);
    const totalCollectedRevenue = billingList.reduce((sum, b) => sum + b.paidAmount, 0);
    const totalOutstandingReceivables = billingList.reduce((sum, b) => sum + b.outstandingBalance, 0);

    const avgCsatScore =
      feedbackList.filter((f) => f.customerRating !== null && f.customerRating !== undefined).length > 0
        ? Number(
            (
              feedbackList
                .filter((f) => f.customerRating !== null && f.customerRating !== undefined)
                .reduce((sum, f) => sum + (f.customerRating || 5), 0) /
              feedbackList.filter((f) => f.customerRating !== null && f.customerRating !== undefined).length
            ).toFixed(1),
          )
        : 0.0;

    const leadConversionRatePct =
      leadList.length > 0
        ? Number(
            (
              (leadList.filter((l) => l.status === 'CONVERTED_TO_RFQ' || l.status === 'QUALIFIED_PROSPECT').length /
                leadList.length) *
              100
            ).toFixed(1),
          )
        : 0.0;

    return {
      activePipelineValue,
      totalOrderBookValue,
      activeOrdersCount,
      totalInvoicedRevenue,
      totalCollectedRevenue,
      totalOutstandingReceivables,
      avgCsatScore,
      leadConversionRatePct,
    };
  }, [leadList, quotationList, orderList, dispatchList, billingList, feedbackList]);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg bg-emerald-600 text-white font-medium text-base animate-bounce">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-20 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-semibold text-base whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="w-5 h-5 shrink-0" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="h-6 w-px bg-slate-300 dark:bg-slate-700 hidden sm:block" />
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-md shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight whitespace-nowrap">Sales Department</span>
                <span className="block text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Leads, Quotations, Sales Orders, Logistics &amp; Invoicing
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Link
              href="/dashboard/finance"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-base font-bold shadow-sm whitespace-nowrap shrink-0"
            >
              <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Finance Ledger</span>
            </Link>

            {mounted && (
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Company Isolation Badge */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5" />
                Company-Scoped Sales Portal
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                <CheckCircle2 className="w-3 h-3" />
                Zero Cross-Tenant Data Leakage
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Manufacturing Sales &amp; Commercial Operations
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mt-1">
              6 Core Pillars: Lead Acquisition, Quotation Costing, Sales Order (SO) Execution, Dispatch Logistics, Credit Billing, and CRM Feedback.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>{companyName}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-semibold">
                  Sales Authorized
                </span>
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                <span className="font-medium text-slate-800 dark:text-slate-200">{tenantSubCategory}</span>
                <span>&bull;</span>
                <span>Company ID Isolated</span>
              </div>
            </div>
          </div>
        </div>

        {/* Operational Navigation Tabs */}
        <div className="flex items-center gap-2 sm:gap-3 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setSalesTab('leads')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all whitespace-nowrap shrink-0 ${
              salesTab === 'leads'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span>1. Market Research &amp; Leads</span>
          </button>
          <button
            type="button"
            onClick={() => setSalesTab('quotations')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all whitespace-nowrap shrink-0 ${
              salesTab === 'quotations'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span>2. Quotations &amp; Costing</span>
          </button>
          <button
            type="button"
            onClick={() => setSalesTab('orders')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all whitespace-nowrap shrink-0 ${
              salesTab === 'orders'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ShoppingCart className="w-4 h-4 shrink-0" />
            <span>3. Sales Orders (SO) Flow</span>
          </button>
          <button
            type="button"
            onClick={() => setSalesTab('dispatches')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all whitespace-nowrap shrink-0 ${
              salesTab === 'dispatches'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Truck className="w-4 h-4 shrink-0" />
            <span>4. Dispatch &amp; Logistics</span>
          </button>
          <button
            type="button"
            onClick={() => setSalesTab('billings')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all whitespace-nowrap shrink-0 ${
              salesTab === 'billings'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <CreditCard className="w-4 h-4 shrink-0" />
            <span>5. Credit Control &amp; Invoicing</span>
          </button>
          <button
            type="button"
            onClick={() => setSalesTab('feedbacks')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold transition-all whitespace-nowrap shrink-0 ${
              salesTab === 'feedbacks'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4 shrink-0" />
            <span>6. CRM &amp; Rejections</span>
          </button>
        </div>

        {/* ================================================================= */}
        {/* TAB 1: MARKET RESEARCH & LEADS */}
        {/* ================================================================= */}
        {salesTab === 'leads' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Pipeline Value</span>
                  <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">₹{(kpis.activePipelineValue / 10000000).toFixed(2)} Cr</div>
                <div className="text-sm text-emerald-600 font-semibold mt-1">Estimated annual sales opportunity</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Total Leads</span>
                  <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">{leadList.length}</div>
                <div className="text-sm text-slate-500 mt-1">Prospects in active engagement</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Conversion Rate</span>
                  <div className="p-2.5 rounded-xl bg-violet-100 dark:bg-violet-900/40 text-violet-600">
                    <Target className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">{kpis.leadConversionRatePct}%</div>
                <div className="text-sm text-violet-600 font-semibold mt-1">Inquiry to RFQ conversion</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Avg Lead Score</span>
                  <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600">
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">
                  {leadList.filter((l) => l.leadScore !== null && l.leadScore !== undefined).length > 0
                    ? (
                        leadList
                          .filter((l) => l.leadScore !== null && l.leadScore !== undefined)
                          .reduce((sum, l) => sum + (l.leadScore || 0), 0) /
                        leadList.filter((l) => l.leadScore !== null && l.leadScore !== undefined).length
                      ).toFixed(1)
                    : '0.0'}
                </div>
                <div className="text-sm text-amber-600 font-semibold mt-1">High qualification index</div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search lead code, client name, or segment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-base focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsNewLeadModal(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-sm transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Acquire New Prospect</span>
              </button>
            </div>

            {/* Leads Data Table */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-base">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 text-sm font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-3.5">Lead Code</th>
                      <th className="px-5 py-3.5">Client &amp; Contact</th>
                      <th className="px-5 py-3.5">Industry Segment</th>
                      <th className="px-5 py-3.5">Target Products</th>
                      <th className="px-5 py-3.5">Est. Annual Value</th>
                      <th className="px-5 py-3.5">Score &amp; Status</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {leadList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                          <Users className="w-8 h-8 mx-auto mb-2 text-slate-400 opacity-60" />
                          <p className="font-bold">No sales leads recorded yet</p>
                          <p className="text-sm text-slate-400">Click &ldquo;Acquire New Prospect&rdquo; to register new client inquiries</p>
                        </td>
                      </tr>
                    ) : leadList.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-5 py-4 font-bold text-emerald-600">
                          {l.leadCode}
                          <span className="block text-xs font-semibold text-slate-400">{l.createdAt}</span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-900 dark:text-slate-100">{l.clientCompanyName}</div>
                          <div className="text-xs text-slate-500">{l.contactPerson}</div>
                          <div className="text-xs text-slate-400">{l.contactEmail}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-block text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                            {l.industrySegment.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-4 max-w-xs text-sm font-medium">
                          {l.targetProducts}
                        </td>
                        <td className="px-5 py-4 font-extrabold text-slate-900 dark:text-slate-100">
                          {l.estimatedAnnualValue ? `₹${(l.estimatedAnnualValue / 100000).toFixed(1)}L` : 'TBD'}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                              l.status === 'CONVERTED_TO_RFQ'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : l.status === 'QUALIFIED_PROSPECT'
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {l.status.replace(/_/g, ' ')}
                          </span>
                          <span className="block text-xs font-semibold text-slate-400 mt-1">Score: {l.leadScore}%</span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          {l.status !== 'CONVERTED_TO_RFQ' ? (
                            <button
                              type="button"
                              onClick={() => handleAdvanceLeadStatus(l.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                            >
                              Advance Stage
                            </button>
                          ) : (
                            <span className="text-xs font-bold text-emerald-600">RFQ Issued</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: QUOTATIONS & COSTING */}
        {/* ================================================================= */}
        {salesTab === 'quotations' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Total Quotations</span>
                  <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600">
                    <FileText className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">{quotationList.length}</div>
                <div className="text-sm text-slate-500 mt-1">Commercial proposals submitted</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Quotation Pipeline</span>
                  <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">
                  ₹{(quotationList.reduce((sum, q) => sum + q.totalQuotationValue, 0) / 100000).toFixed(1)}L
                </div>
                <div className="text-sm text-blue-600 font-semibold mt-1">Active quote negotiation value</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Avg Profit Margin</span>
                  <div className="p-2.5 rounded-xl bg-violet-100 dark:bg-violet-900/40 text-violet-600">
                    <Percent className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">
                  {quotationList.length > 0
                    ? `${(
                        quotationList.reduce((sum, q) => sum + (q.profitMarginPct || 0), 0) /
                        quotationList.length
                      ).toFixed(1)}%`
                    : '0.0%'}
                </div>
                <div className="text-sm text-violet-600 font-semibold mt-1">Over raw material &amp; overhead</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Agreements Finalized</span>
                  <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600">
                    <Award className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">
                  {quotationList.filter((q) => q.status === 'AGREEMENT_FINALIZED').length}
                </div>
                <div className="text-sm text-amber-600 font-semibold mt-1">Purchase contracts locked</div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search quote number, client, or product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-base focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsNewQuotationModal(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-sm transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Calculate &amp; Raise Quotation</span>
              </button>
            </div>

            {/* Quotations Data Table */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-base">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 text-sm font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-3.5">Quotation No</th>
                      <th className="px-5 py-3.5">Client &amp; Product</th>
                      <th className="px-5 py-3.5">Order Qty</th>
                      <th className="px-5 py-3.5">Cost Sheet Baseline</th>
                      <th className="px-5 py-3.5">Final Quoted Rate</th>
                      <th className="px-5 py-3.5">Total Value</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {quotationList.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-5 py-12 text-center text-slate-500">
                          <FileText className="w-8 h-8 mx-auto mb-2 text-slate-400 opacity-60" />
                          <p className="font-bold">No commercial quotations raised yet</p>
                          <p className="text-sm text-slate-400">Click &ldquo;Calculate &amp; Raise Quotation&rdquo; to build a cost sheet and proposal</p>
                        </td>
                      </tr>
                    ) : quotationList.map((q) => (
                      <tr key={q.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-5 py-4 font-bold text-emerald-600">
                          {q.quotationNumber}
                          <span className="block text-xs font-semibold text-slate-400">{q.inquiryReference}</span>
                        </td>
                        <td className="px-5 py-4 max-w-xs">
                          <div className="font-bold text-slate-900 dark:text-slate-100">{q.clientCompanyName}</div>
                          <div className="text-xs text-slate-500 truncate">{q.productDescription}</div>
                          <div className="text-xs text-slate-400 font-semibold mt-0.5">{q.deliveryChargesTerms}</div>
                        </td>
                        <td className="px-5 py-4 font-semibold">
                          {q.orderQuantity} {q.unit}
                        </td>
                        <td className="px-5 py-4 text-xs font-medium text-slate-600 dark:text-slate-400">
                          <div>RM: ₹{q.rawMaterialCost.toLocaleString()}</div>
                          <div>Overhead: ₹{q.productionOverheadCost.toLocaleString()}</div>
                          <div className="text-emerald-600 font-bold">Margin: {q.profitMarginPct}%</div>
                        </td>
                        <td className="px-5 py-4 font-bold text-slate-900 dark:text-slate-100">
                          ₹{q.finalQuotedRate.toLocaleString()} / {q.unit}
                        </td>
                        <td className="px-5 py-4 font-extrabold text-emerald-600">
                          ₹{q.totalQuotationValue.toLocaleString()}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                              q.status === 'AGREEMENT_FINALIZED'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {q.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          {q.status !== 'AGREEMENT_FINALIZED' ? (
                            <button
                              type="button"
                              onClick={() => handleFinalizeAgreement(q.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                            >
                              Finalize Agreement
                            </button>
                          ) : (
                            <span className="text-xs font-bold text-emerald-600">Locked</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: SALES ORDERS FLOW */}
        {/* ================================================================= */}
        {salesTab === 'orders' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Order Book Value</span>
                  <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">₹{(kpis.totalOrderBookValue / 100000).toFixed(1)}L</div>
                <div className="text-sm text-emerald-600 font-semibold mt-1">Confirmed manufacturing backlog</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Active Sales Orders</span>
                  <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">{kpis.activeOrdersCount}</div>
                <div className="text-sm text-slate-500 mt-1">In progress across production lines</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Stock Availability</span>
                  <div className="p-2.5 rounded-xl bg-violet-100 dark:bg-violet-900/40 text-violet-600">
                    <Warehouse className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">{orderList.length > 0 ? '100%' : '0%'}</div>
                <div className="text-sm text-violet-600 font-semibold mt-1">RM verified with Inventory Dept</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Ready for Dispatch</span>
                  <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">
                  {orderList.filter((o) => o.orderStatus === 'READY_FOR_DISPATCH').length}
                </div>
                <div className="text-sm text-amber-600 font-semibold mt-1">QA cleared in staging bay</div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search sales order, client PO, or product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-base focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsNewOrderModal(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-sm transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Create Sales Order (SO)</span>
              </button>
            </div>

            {/* Orders Data Table */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-base">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 text-sm font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-3.5">SO Number</th>
                      <th className="px-5 py-3.5">Client PO &amp; Customer</th>
                      <th className="px-5 py-3.5">Product &amp; Line</th>
                      <th className="px-5 py-3.5">Quantity &amp; Value</th>
                      <th className="px-5 py-3.5">Due Date &amp; Progress</th>
                      <th className="px-5 py-3.5">Execution Status</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {orderList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                          <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-slate-400 opacity-60" />
                          <p className="font-bold">No active sales orders recorded</p>
                          <p className="text-sm text-slate-400">Click &ldquo;Create Sales Order (SO)&rdquo; to book an order into production</p>
                        </td>
                      </tr>
                    ) : orderList.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-5 py-4 font-bold text-emerald-600">
                          {o.salesOrderNumber}
                          <span className="block text-xs font-semibold text-slate-400">{o.createdAt}</span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-900 dark:text-slate-100">{o.clientCompanyName}</div>
                          <span className="text-xs font-mono font-semibold text-slate-500">PO: {o.clientPurchaseOrderNo}</span>
                        </td>
                        <td className="px-5 py-4 max-w-xs">
                          <div className="font-semibold text-sm">{o.productName}</div>
                          <div className="text-xs text-indigo-600 font-bold">{o.assignedProductionLine}</div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-extrabold text-slate-900 dark:text-slate-100">
                            ₹{o.totalOrderValue.toLocaleString()}
                          </div>
                          <div className="text-xs text-slate-500">{o.orderQuantity} {o.unit} @ ₹{o.unitRate}</div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-medium text-sm">{o.estimatedDeliveryDate}</div>
                          <div className="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-1.5 overflow-hidden">
                            <div
                              className="bg-emerald-600 h-2 rounded-full"
                              style={{ width: `${o.executionProgressPct}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-400 font-bold">{o.executionProgressPct}% Done</span>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                              o.orderStatus === 'READY_FOR_DISPATCH'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                                : o.orderStatus === 'IN_PRODUCTION'
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {o.orderStatus.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedOrderForPrint(o)}
                              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all"
                              title="Print Sales Order Pass"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                            {o.orderStatus !== 'COMPLETED' && (
                              <button
                                type="button"
                                onClick={() => handleAdvanceOrderStatus(o.id)}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                              >
                                Advance
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: DISPATCH & LOGISTICS */}
        {/* ================================================================= */}
        {salesTab === 'dispatches' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Total Dispatches</span>
                  <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600">
                    <Truck className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">{dispatchList.length}</div>
                <div className="text-sm text-slate-500 mt-1">Consignments routed via carriers</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Dispatched Tonnage</span>
                  <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600">
                    <Scale className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">
                  {(dispatchList.reduce((sum, d) => sum + d.dispatchWeightKg, 0) / 1000).toFixed(1)} MT
                </div>
                <div className="text-sm text-blue-600 font-semibold mt-1">Weighbridge outward net mass</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">POD Receipt Rate</span>
                  <div className="p-2.5 rounded-xl bg-violet-100 dark:bg-violet-900/40 text-violet-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">
                  {dispatchList.length > 0
                    ? `${Math.round((dispatchList.filter((d) => d.proofOfDeliveryReceived).length / dispatchList.length) * 100)}%`
                    : '0%'}
                </div>
                <div className="text-sm text-violet-600 font-semibold mt-1">Proof of Delivery validated</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">In Transit</span>
                  <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">
                  {dispatchList.filter((d) => d.dispatchStatus === 'DISPATCHED_IN_TRANSIT').length}
                </div>
                <div className="text-sm text-amber-600 font-semibold mt-1">Active transit shipments</div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search dispatch code, delivery challan, vehicle..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-base focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsNewDispatchModal(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-sm transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Create Dispatch &amp; Challan</span>
              </button>
            </div>

            {/* Dispatches Data Table */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-base">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 text-sm font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-3.5">Dispatch Code</th>
                      <th className="px-5 py-3.5">Challan &amp; e-Way Bill</th>
                      <th className="px-5 py-3.5">Client &amp; Destination</th>
                      <th className="px-5 py-3.5">Carrier &amp; Vehicle</th>
                      <th className="px-5 py-3.5">Net Mass</th>
                      <th className="px-5 py-3.5">Transit Status</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {dispatchList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                          <Truck className="w-8 h-8 mx-auto mb-2 text-slate-400 opacity-60" />
                          <p className="font-bold">No dispatch consignments recorded</p>
                          <p className="text-sm text-slate-400">Click &ldquo;Create Dispatch &amp; Challan&rdquo; to generate DC and log outward transit</p>
                        </td>
                      </tr>
                    ) : dispatchList.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-5 py-4 font-bold text-emerald-600">
                          {d.dispatchTrackingCode}
                          <span className="block text-xs font-semibold text-slate-400">{d.salesOrderNumber}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="font-bold text-slate-900 dark:text-slate-100">{d.deliveryChallanNumber}</span>
                          <span className="block text-xs font-mono text-slate-400">{d.eWayBillNumber}</span>
                        </td>
                        <td className="px-5 py-4 max-w-xs">
                          <div className="font-semibold text-slate-900 dark:text-slate-100">{d.clientCompanyName}</div>
                          <div className="text-xs text-slate-500 truncate">{d.destinationLocation}</div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-800 dark:text-slate-200">{d.vehicleNumber}</div>
                          <div className="text-xs text-slate-500">{d.transporterFleetCarrier}</div>
                        </td>
                        <td className="px-5 py-4 font-extrabold text-slate-900 dark:text-slate-100">
                          {(d.dispatchWeightKg / 1000).toFixed(1)} MT
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                              d.dispatchStatus === 'DELIVERED_POD_RECEIVED'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {d.dispatchStatus.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          {d.dispatchStatus !== 'DELIVERED_POD_RECEIVED' ? (
                            <button
                              type="button"
                              onClick={() => handleConfirmPod(d.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                            >
                              Confirm POD
                            </button>
                          ) : (
                            <span className="text-xs font-bold text-emerald-600">Delivered</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 5: CREDIT CONTROL & INVOICING */}
        {/* ================================================================= */}
        {salesTab === 'billings' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Total Invoiced</span>
                  <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">₹{(kpis.totalInvoicedRevenue / 100000).toFixed(1)}L</div>
                <div className="text-sm text-emerald-600 font-semibold mt-1">Net billable with 18% GST</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Collected Revenue</span>
                  <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600">
                    <CreditCard className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">₹{(kpis.totalCollectedRevenue / 100000).toFixed(1)}L</div>
                <div className="text-sm text-blue-600 font-semibold mt-1">Bank settlements confirmed</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Outstanding Due</span>
                  <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">₹{(kpis.totalOutstandingReceivables / 100000).toFixed(1)}L</div>
                <div className="text-sm text-amber-600 font-semibold mt-1">Within sanctioned credit period</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Settled Invoices</span>
                  <div className="p-2.5 rounded-xl bg-violet-100 dark:bg-violet-900/40 text-violet-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">
                  {billingList.filter((b) => b.paymentStatus === 'FULLY_SETTLED').length}
                </div>
                <div className="text-sm text-slate-500 mt-1">Zero balance remaining</div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search invoice number, client, or GSTIN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-base focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsNewBillingModal(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-sm transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Issue Commercial Invoice</span>
              </button>
            </div>

            {/* Billing Data Table */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-base">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 text-sm font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-3.5">Invoice Number</th>
                      <th className="px-5 py-3.5">Client &amp; GSTIN</th>
                      <th className="px-5 py-3.5">SO &amp; Delivery Challan</th>
                      <th className="px-5 py-3.5">Net Payable</th>
                      <th className="px-5 py-3.5">Due Date &amp; Credit</th>
                      <th className="px-5 py-3.5">Payment Status</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {billingList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                          <CreditCard className="w-8 h-8 mx-auto mb-2 text-slate-400 opacity-60" />
                          <p className="font-bold">No commercial invoices generated</p>
                          <p className="text-sm text-slate-400">Click &ldquo;Issue Commercial Invoice&rdquo; to issue a tax invoice with credit terms</p>
                        </td>
                      </tr>
                    ) : billingList.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-5 py-4 font-bold text-emerald-600">{b.invoiceNumber}</td>
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-900 dark:text-slate-100">{b.clientCompanyName}</div>
                          <div className="text-xs font-mono text-slate-400">{b.clientGstNumber}</div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-semibold text-sm">{b.salesOrderNumber}</div>
                          <div className="text-xs text-slate-500">{b.deliveryChallanNumber}</div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-extrabold text-slate-900 dark:text-slate-100">
                            ₹{b.netPayableAmount.toLocaleString()}
                          </div>
                          <div className="text-xs text-slate-500">Tax: ₹{b.taxAmount.toLocaleString()} (18%)</div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-medium text-sm">{b.paymentDueDate}</div>
                          <div className="text-xs text-slate-500">
                            Limit: ₹{(b.dealerCreditLimit / 100000).toFixed(1)}L
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                              b.paymentStatus === 'FULLY_SETTLED'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {b.paymentStatus.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          {b.paymentStatus !== 'FULLY_SETTLED' ? (
                            <button
                              type="button"
                              onClick={() => handleSettlePayment(b.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                            >
                              Settle Payment
                            </button>
                          ) : (
                            <span className="text-xs font-mono font-bold text-slate-500">{b.paymentReferenceUTR}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 6: CRM & FEEDBACK */}
        {/* ================================================================= */}
        {salesTab === 'feedbacks' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">CSAT Rating</span>
                  <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600">
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">{kpis.avgCsatScore} / 5.0</div>
                <div className="text-sm text-amber-600 font-semibold mt-1">Customer satisfaction index</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Total Tickets</span>
                  <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">{feedbackList.length}</div>
                <div className="text-sm text-slate-500 mt-1">Feedback &amp; complaints logged</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Closed &amp; CAPA</span>
                  <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">
                  {feedbackList.filter((f) => f.resolutionStatus === 'RESOLVED_CLOSED').length}
                </div>
                <div className="text-sm text-emerald-600 font-semibold mt-1">Issues successfully resolved</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">Replacements Approved</span>
                  <div className="p-2.5 rounded-xl bg-violet-100 dark:bg-violet-900/40 text-violet-600">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mt-3">
                  {feedbackList.filter((f) => f.qualityReplacementApproved).length}
                </div>
                <div className="text-sm text-violet-600 font-semibold mt-1">Under QA warranty guarantee</div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search ticket code, client, or issue..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-base focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsNewFeedbackModal(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-sm transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Log Feedback or Complaint</span>
              </button>
            </div>

            {/* Feedback Data Table */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-base">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 text-sm font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-3.5">Ticket Code</th>
                      <th className="px-5 py-3.5">Client &amp; Order Ref</th>
                      <th className="px-5 py-3.5">Type &amp; Severity</th>
                      <th className="px-5 py-3.5">Description &amp; Action</th>
                      <th className="px-5 py-3.5">Rating &amp; Status</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {feedbackList.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                          <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-400 opacity-60" />
                          <p className="font-bold">No customer complaints or tickets logged</p>
                          <p className="text-sm text-slate-400">Click &ldquo;Log Feedback or Complaint&rdquo; to initiate CRM / QA replacement ticketing</p>
                        </td>
                      </tr>
                    ) : feedbackList.map((f) => (
                      <tr key={f.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-5 py-4 font-bold text-emerald-600">{f.ticketNumber}</td>
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-900 dark:text-slate-100">{f.clientCompanyName}</div>
                          <span className="text-xs text-slate-500 font-mono">{f.salesOrderNumber}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-block text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                            {f.feedbackType.replace(/_/g, ' ')}
                          </span>
                          <span className="block text-xs font-bold text-rose-600 mt-1">Severity: {f.severityLevel}</span>
                        </td>
                        <td className="px-5 py-4 max-w-sm">
                          <div className="text-sm font-medium text-slate-800 dark:text-slate-200 line-clamp-2">
                            {f.issueDescription}
                          </div>
                          {f.capaActionPlan && (
                            <div className="text-xs text-emerald-600 font-semibold mt-1">CAPA: {f.capaActionPlan}</div>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                              f.resolutionStatus === 'RESOLVED_CLOSED'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {f.resolutionStatus.replace(/_/g, ' ')}
                          </span>
                          {f.customerRating && (
                            <div className="text-xs font-bold text-amber-600 mt-1 flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              <span>{f.customerRating} / 5</span>
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right">
                          {f.resolutionStatus !== 'RESOLVED_CLOSED' ? (
                            <button
                              type="button"
                              onClick={() => handleResolveFeedback(f.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                            >
                              Resolve Ticket
                            </button>
                          ) : (
                            <span className="text-xs font-bold text-emerald-600">Closed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* 1. MODAL: ACQUIRE NEW PROSPECT */}
      {/* ========================================================================= */}
      {isNewLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <Users className="w-6 h-6 text-emerald-600" />
                <h3 className="text-xl font-extrabold">Acquire Industrial Client Lead</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewLeadModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLead} className="mt-5 space-y-4 text-base">
              <div>
                <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                  Client Company Name *
                </label>
                <input
                  type="text"
                  name="clientCompanyName"
                  required
                  placeholder="e.g. Bharat Heavy Axles & Forgings Pvt Ltd"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    required
                    placeholder="Sanjay Deshmukh (SCM Head)"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Industry Segment *
                  </label>
                  <select
                    name="industrySegment"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="AUTOMOTIVE_OEM">Automotive OEM</option>
                    <option value="INFRASTRUCTURE">Infrastructure &amp; Construction</option>
                    <option value="ENGINEERING">Heavy Engineering</option>
                    <option value="DEFENCE">Aerospace &amp; Defence</option>
                    <option value="ELECTRONICS">Electronics &amp; Electricals</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    name="contactPhone"
                    placeholder="+91 98220 11920"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    placeholder="procure@client.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                  Target Products &amp; Requirements *
                </label>
                <input
                  type="text"
                  name="targetProducts"
                  required
                  placeholder="Grade EN8 Billets 100x100mm, Forged Shafts"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Est. Annual Value (₹)
                  </label>
                  <input
                    type="number"
                    name="estimatedAnnualValue"
                    defaultValue={15000000}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Lead Source
                  </label>
                  <select
                    name="leadSource"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="EXHIBITION_TRADE_FAIR">Exhibition &amp; Trade Fair</option>
                    <option value="DIRECT_INQUIRY">Direct Inward Inquiry</option>
                    <option value="MARKET_RESEARCH">Market Research Outreach</option>
                    <option value="PRODUCT_CATALOGUE_PITCH">Product Catalogue Pitch</option>
                    <option value="DIGITAL_PORTAL">Digital Portal</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewLeadModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Acquire Prospect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MODAL: CALCULATE & RAISE QUOTATION */}
      {/* ========================================================================= */}
      {isNewQuotationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <FileText className="w-6 h-6 text-emerald-600" />
                <h3 className="text-xl font-extrabold">Generate Quotation with Costing</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewQuotationModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddQuotation} className="mt-5 space-y-4 text-base">
              <div>
                <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                  Client Company Name *
                </label>
                <input
                  type="text"
                  name="clientCompanyName"
                  required
                  placeholder="Bharat Heavy Axles & Forgings Pvt Ltd"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                  Product Description *
                </label>
                <input
                  type="text"
                  name="productDescription"
                  required
                  placeholder="Grade EN8 Billets 100x100mm, length 6m (IS 5517)"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Order Quantity &amp; Unit *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="orderQuantity"
                      required
                      defaultValue={80}
                      className="w-2/3 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                    <input
                      type="text"
                      name="unit"
                      required
                      defaultValue="MT"
                      className="w-1/3 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 uppercase font-semibold"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Delivery Terms
                  </label>
                  <select
                    name="deliveryChargesTerms"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="FOR_DESTINATION">FOR Destination (Freight Included)</option>
                    <option value="EX_WORKS">Ex-Works Plant Dock</option>
                    <option value="FOB_PORT">FOB Port</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">RM Cost (₹/unit)</label>
                  <input
                    type="number"
                    name="rawMaterialCost"
                    required
                    defaultValue={48500}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">Overhead (₹)</label>
                  <input
                    type="number"
                    name="productionOverheadCost"
                    required
                    defaultValue={4200}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">Margin (%)</label>
                  <input
                    type="number"
                    name="profitMarginPct"
                    required
                    defaultValue={14.5}
                    step="0.1"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">Final Quoted Rate</label>
                  <input
                    type="number"
                    name="finalQuotedRate"
                    required
                    defaultValue={59500}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">Credit Days</label>
                  <input
                    type="number"
                    name="creditPeriodDays"
                    defaultValue={30}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">Advance (%)</label>
                  <input
                    type="number"
                    name="advancePaymentPct"
                    defaultValue={20}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewQuotationModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Issue Formal Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MODAL: CREATE SALES ORDER */}
      {/* ========================================================================= */}
      {isNewOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <ShoppingCart className="w-6 h-6 text-emerald-600" />
                <h3 className="text-xl font-extrabold">Generate Official Sales Order (SO)</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewOrderModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddOrder} className="mt-5 space-y-4 text-base">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Client Purchase Order (PO) No *
                  </label>
                  <input
                    type="text"
                    name="clientPurchaseOrderNo"
                    required
                    placeholder="PO-BHA-2026-8819"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Quotation Ref
                  </label>
                  <input
                    type="text"
                    name="quotationReference"
                    defaultValue="QUOT-2026-088"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                  Client Company Name *
                </label>
                <input
                  type="text"
                  name="clientCompanyName"
                  required
                  placeholder="Bharat Heavy Axles & Forgings Pvt Ltd"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="productName"
                  required
                  placeholder="Grade EN8 Carbon Steel Billets 100x100mm"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">Quantity *</label>
                  <input
                    type="number"
                    name="orderQuantity"
                    required
                    defaultValue={80}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">Unit Rate (₹) *</label>
                  <input
                    type="number"
                    name="unitRate"
                    required
                    defaultValue={59500}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">Delivery Date *</label>
                  <input
                    type="date"
                    name="estimatedDeliveryDate"
                    required
                    defaultValue="2026-11-28"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                  Assigned Production Line
                </label>
                <input
                  type="text"
                  name="assignedProductionLine"
                  defaultValue="Continuous Casting & Billet Rolling Line #1"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewOrderModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Confirm &amp; Schedule Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODAL: CREATE DISPATCH & LOGISTICS */}
      {/* ========================================================================= */}
      {isNewDispatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <Truck className="w-6 h-6 text-emerald-600" />
                <h3 className="text-xl font-extrabold">Generate Delivery Challan &amp; Dispatch</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewDispatchModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDispatch} className="mt-5 space-y-4 text-base">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Sales Order (SO) Number *
                  </label>
                  <input
                    type="text"
                    name="salesOrderNumber"
                    required
                    defaultValue="SO-2026-110"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Client Company Name *
                  </label>
                  <input
                    type="text"
                    name="clientCompanyName"
                    required
                    defaultValue="Bharat Heavy Axles & Forgings Pvt Ltd"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Transporter Carrier Fleet *
                  </label>
                  <input
                    type="text"
                    name="transporterFleetCarrier"
                    required
                    defaultValue="VRL Heavy Freight Carriers"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Vehicle Number *
                  </label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    required
                    defaultValue="MH-12-RN-9921"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Net Weight (Kg) *
                  </label>
                  <input
                    type="number"
                    name="dispatchWeightKg"
                    required
                    defaultValue={35000}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Loading Bay
                  </label>
                  <input
                    type="text"
                    name="loadingBay"
                    defaultValue="BAY-DISP-02"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                  Destination Factory Location *
                </label>
                <input
                  type="text"
                  name="destinationLocation"
                  required
                  defaultValue="Chakan MIDC Phase II, Pune Industrial Zone"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewDispatchModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Generate Challan &amp; Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL: ISSUE COMMERCIAL INVOICE */}
      {/* ========================================================================= */}
      {isNewBillingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-6 h-6 text-emerald-600" />
                <h3 className="text-xl font-extrabold">Generate Commercial Tax Invoice</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewBillingModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddBilling} className="mt-5 space-y-4 text-base">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Sales Order (SO) Ref *
                  </label>
                  <input
                    type="text"
                    name="salesOrderNumber"
                    required
                    defaultValue="SO-2026-110"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Client GSTIN *
                  </label>
                  <input
                    type="text"
                    name="clientGstNumber"
                    required
                    defaultValue="27AAACM1234F1Z5"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono uppercase font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                  Client Company Name *
                </label>
                <input
                  type="text"
                  name="clientCompanyName"
                  required
                  defaultValue="Bharat Heavy Axles & Forgings Pvt Ltd"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Invoice Base Amount (₹) *
                  </label>
                  <input
                    type="number"
                    name="totalInvoiceAmount"
                    required
                    defaultValue={2380000}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Payment Due Date *
                  </label>
                  <input
                    type="date"
                    name="paymentDueDate"
                    required
                    defaultValue="2026-12-25"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                  Approved Dealer Credit Limit (₹)
                </label>
                <input
                  type="number"
                  name="dealerCreditLimit"
                  defaultValue={10000000}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewBillingModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Issue Tax Invoice (+18% GST)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL: LOG CRM FEEDBACK & REJECTION */}
      {/* ========================================================================= */}
      {isNewFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-6 h-6 text-emerald-600" />
                <h3 className="text-xl font-extrabold">Open Customer Feedback / Rejection Ticket</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewFeedbackModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddFeedback} className="mt-5 space-y-4 text-base">
              <div>
                <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                  Client Company Name *
                </label>
                <input
                  type="text"
                  name="clientCompanyName"
                  required
                  placeholder="Mahindra Automotive Foundry Division"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Feedback Category *
                  </label>
                  <select
                    name="feedbackType"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="CUSTOMER_COMPLAINT">Customer Quality Complaint</option>
                    <option value="PRODUCT_REJECTION">Product Dimensional / Chemical Rejection</option>
                    <option value="WARRANTY_CLAIM">Warranty Replacement Claim</option>
                    <option value="SERVICE_RATING">Service &amp; Delivery Rating</option>
                    <option value="PRODUCT_IMPROVEMENT_FEEDBACK">Product Improvement Feedback</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Severity Level
                  </label>
                  <select
                    name="severityLevel"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High (Line Stoppage Threat)</option>
                    <option value="CRITICAL">Critical (Total Lot Rejection)</option>
                    <option value="LOW">Low (Minor Non-Conformance)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                  Defect / Feedback Description *
                </label>
                <textarea
                  name="issueDescription"
                  required
                  rows={2}
                  placeholder="Surface pitting, dimensional variation, blowholes, or metallurgical variation..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Rejected Quantity (MT)
                  </label>
                  <input
                    type="number"
                    name="rejectedQuantity"
                    defaultValue={1.5}
                    step="0.1"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
                    Customer CSAT Rating (1 to 5)
                  </label>
                  <input
                    type="number"
                    name="customerRating"
                    defaultValue={4}
                    min={1}
                    max={5}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewFeedbackModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. PRINTABLE OFFICIAL SALES ORDER CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {selectedOrderForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 shadow-2xl max-h-[90vh] overflow-y-auto print:m-0 print:p-0 print:border-none print:shadow-none">
            <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 print:hidden">
              <div className="flex items-center gap-2 text-emerald-600 font-bold">
                <Printer className="w-5 h-5" />
                <span>Official Sales Order &amp; Commercial Contract Pass</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Document</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrderForPrint(null)}
                  className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Document Body */}
            <div className="mt-6 space-y-6 text-slate-900 dark:text-slate-100">
              {/* Header */}
              <div className="flex justify-between items-start border-b-2 border-emerald-600 pb-4">
                <div>
                  <h2 className="text-2xl font-black tracking-tight">{companyName}</h2>
                  <p className="text-sm text-slate-500 font-medium">
                    Commercial Sales Division &bull; {tenantSubCategory} &bull; Multi-Tenant Isolated
                  </p>
                  <p className="text-xs font-mono text-slate-400">Tenant CID: {selectedOrderForPrint.companyId}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Sales Order Confirmation</span>
                  <div className="text-2xl font-extrabold font-mono">{selectedOrderForPrint.salesOrderNumber}</div>
                  <div className="text-xs text-slate-500">Date: {selectedOrderForPrint.createdAt}</div>
                </div>
              </div>

              {/* Order Meta */}
              <div className="grid grid-cols-2 gap-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Consignee Customer</span>
                  <div className="font-bold text-lg text-slate-900 dark:text-slate-100 mt-0.5">
                    {selectedOrderForPrint.clientCompanyName}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Customer PO Ref: {selectedOrderForPrint.clientPurchaseOrderNo}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Quotation: {selectedOrderForPrint.quotationReference || 'Direct Bid'}</div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Shopfloor Line Allocation</span>
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {selectedOrderForPrint.assignedProductionLine}
                  </div>
                  <div className="text-xs text-emerald-600 font-bold mt-1">
                    Promised Delivery: {selectedOrderForPrint.estimatedDeliveryDate}
                  </div>
                  <div className="text-xs text-slate-500">Status: {selectedOrderForPrint.orderStatus}</div>
                </div>
              </div>

              {/* Item Details */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                    <tr>
                      <th className="px-4 py-2.5">Product Description</th>
                      <th className="px-4 py-2.5">Order Quantity</th>
                      <th className="px-4 py-2.5">Unit Rate</th>
                      <th className="px-4 py-2.5 text-right">Total Order Value (INR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-3 font-semibold">{selectedOrderForPrint.productName}</td>
                      <td className="px-4 py-3 font-mono">{selectedOrderForPrint.orderQuantity} {selectedOrderForPrint.unit}</td>
                      <td className="px-4 py-3 font-mono">₹{selectedOrderForPrint.unitRate.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-black text-base text-emerald-600">
                        ₹{selectedOrderForPrint.totalOrderValue.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Signatures */}
              <div className="pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-8 text-center">
                <div>
                  <div className="h-14 border-b border-dashed border-slate-400 flex items-end justify-center pb-2 text-xs text-slate-400">
                    [Digitally Signed via ERP Sales Auth]
                  </div>
                  <div className="font-bold text-sm mt-2">Authorized Signatory</div>
                  <div className="text-xs text-slate-500">Director of Sales &amp; Commercial Operations</div>
                </div>
                <div>
                  <div className="h-14 border-b border-dashed border-slate-400 flex items-end justify-center pb-2 text-xs text-slate-400">
                    [Customer Order Acknowledgment]
                  </div>
                  <div className="font-bold text-sm mt-2">{selectedOrderForPrint.clientCompanyName}</div>
                  <div className="text-xs text-slate-500">Authorized Client SCM Representative</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
