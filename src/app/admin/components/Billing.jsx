"use client";

import { useState, useEffect } from 'react';
import { Wallet, CreditCard, Receipt, Shield, Activity, DollarSign, Plus, Edit, Trash2, AlertTriangle, CheckCircle, XCircle, Clock, Search, Filter, Download, Eye, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';

export default function Billing({ selectedUser }) {
    const [activeTab, setActiveTab] = useState('wallet');
    const [loading, setLoading] = useState(false);

    // Wallet state
    const [walletData, setWalletData] = useState(null);
    const [walletBalance, setWalletBalance] = useState('');
    const [adminNote, setAdminNote] = useState('');

    // Transaction state
    const [transactions, setTransactions] = useState([]);
    const [transactionFilters, setTransactionFilters] = useState({
        status: '',
        transaction_type: '',
        start_date: '',
        end_date: ''
    });
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [transactionStatuses, setTransactionStatuses] = useState([]);

    // Invoice state
    const [invoices, setInvoices] = useState([]);
    const [invoiceFilters, setInvoiceFilters] = useState({
        service_type: '',
        issued_date_from: '',
        issued_date_to: ''
    });
    const [newInvoice, setNewInvoice] = useState({
        amount_due: '',
        service_type: '',
        shipment: '',
        shopforme_request: ''
    });

    // Payment Methods state
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [paymentMethodTypes, setPaymentMethodTypes] = useState([]);

    // Fraud Detection state
    const [fraudRecords, setFraudRecords] = useState([]);
    const [fraudFilters, setFraudFilters] = useState({
        risk_score_min: '',
        risk_score_max: '',
        risk_level: ''
    });

    // User Behavior state
    const [behaviorRecords, setBehaviorRecords] = useState([]);
    const [behaviorFilters, setBehaviorFilters] = useState({
        action: '',
        start_date: '',
        end_date: ''
    });
    const [fraudRiskLevels, setFraudRiskLevels] = useState([]);

    // Dialog states
    const [showUpdateBalanceDialog, setShowUpdateBalanceDialog] = useState(false);
    const [showCreateInvoiceDialog, setShowCreateInvoiceDialog] = useState(false);
    const [showTransactionDialog, setShowTransactionDialog] = useState(false);
    const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    // Load status choices on component mount
    useEffect(() => {
        loadStatusChoices();
    }, []);

    // Load data when user changes or tab changes
    useEffect(() => {
        if (selectedUser) {
            loadTabData();
        }
    }, [selectedUser, activeTab]);

    const loadStatusChoices = async () => {
        try {
            const [transactionRes, paymentMethodRes, fraudRes] = await Promise.all([
                axiosInstance.get('/api/v1/payments/admin/transactions/statuses/'),
                axiosInstance.get('/api/v1/payments/admin/payment-methods/types/'),
                axiosInstance.get('/api/v1/payments/admin/fraud-detection/risk-levels/')
            ]);

            setTransactionStatuses(transactionRes.data);
            setPaymentMethodTypes(paymentMethodRes.data);
            setFraudRiskLevels(fraudRes.data);
        } catch (error) {
            console.error('Error loading status choices:', error);
        }
    };

    const loadTabData = () => {
        switch (activeTab) {
            case 'wallet':
                loadWalletData();
                break;
            case 'transactions':
                loadTransactions();
                break;
            case 'invoices':
                loadInvoices();
                break;
            case 'payment-methods':
                loadPaymentMethods();
                break;
            case 'fraud':
                loadFraudRecords();
                break;
            case 'behavior':
                loadBehaviorRecords();
                break;
        }
    };

    // Wallet functions
    const loadWalletData = async () => {
        if (!selectedUser) return;

        setLoading(true);
        try {
            const response = await axiosInstance.get(`/api/v1/payments/admin/wallets/by-user/${selectedUser.id}/`);
            setWalletData(response.data);
            setWalletBalance(response.data.balance.toString());
        } catch (error) {
            console.error('Error loading wallet data:', error);
            if (error.response?.status === 404) {
                toast.error('Wallet not found for this user');
            } else {
                toast.error('Failed to load wallet data');
            }
        } finally {
            setLoading(false);
        }
    };

    const updateWalletBalance = async () => {
        if (!walletData || !walletBalance) return;

        setLoading(true);
        try {
            const response = await axiosInstance.patch(`/api/v1/payments/admin/wallets/${walletData.id}/`, {
                balance: parseFloat(walletBalance),
                admin_note: adminNote
            });

            setWalletData(prev => ({ ...prev, balance: response.data.balance }));
            setShowUpdateBalanceDialog(false);
            setAdminNote('');
            toast.success('Wallet balance updated successfully');
        } catch (error) {
            console.error('Error updating wallet balance:', error);
            toast.error('Failed to update wallet balance');
        } finally {
            setLoading(false);
        }
    };

    // Transaction functions
    const loadTransactions = async () => {
        if (!selectedUser) return;

        setLoading(true);
        try {
            const params = {
                user: selectedUser.id,
                ...transactionFilters
            };

            const response = await axiosInstance.get('/api/v1/payments/admin/transactions/', { params });
            setTransactions(response.data);
        } catch (error) {
            console.error('Error loading transactions:', error);
            toast.error('Failed to load transactions');
        } finally {
            setLoading(false);
        }
    };

    const loadTransactionDetails = async (transactionId) => {
        try {
            const response = await axiosInstance.get(`/api/v1/payments/admin/transactions/${transactionId}/`);
            setSelectedTransaction(response.data);
            setShowTransactionDialog(true);
        } catch (error) {
            console.error('Error loading transaction details:', error);
            toast.error('Failed to load transaction details');
        }
    };

    const updateTransactionStatus = async (transactionId, status, note) => {
        try {
            await axiosInstance.patch(`/api/v1/payments/admin/transactions/${transactionId}/`, {
                status,
                admin_note: note
            });

            toast.success('Transaction status updated successfully');
            loadTransactions();
        } catch (error) {
            console.error('Error updating transaction status:', error);
            toast.error('Failed to update transaction status');
        }
    };

    // Invoice functions
    const loadInvoices = async () => {
        if (!selectedUser) return;

        setLoading(true);
        try {
            const params = {
                user: selectedUser.id,
            };

            if (invoiceFilters.status && invoiceFilters.status !== 'all') {
                params.status = invoiceFilters.status;
            }

            const response = await axiosInstance.get('/api/v1/payments/admin/invoices/', { params });
            setInvoices(response.data);
        } catch (error) {
            console.error('Error loading invoices:', error);
            toast.error('Failed to load invoices');
        } finally {
            setLoading(false);
        }
    };



    const createInvoice = async () => {
        if (!selectedUser || !newInvoice.amount_due || !newInvoice.service_type) return;

        setLoading(true);
        try {
            const invoiceData = {
                user: selectedUser.id,
                amount_due: parseFloat(newInvoice.amount_due),
                service_type: newInvoice.service_type
            };

            // Add optional fields if they exist
            if (newInvoice.shipment) {
                invoiceData.shipment = parseInt(newInvoice.shipment);
            }
            if (newInvoice.shopforme_request) {
                invoiceData.shopforme_request = parseInt(newInvoice.shopforme_request);
            }

            await axiosInstance.post('/api/v1/payments/admin/invoices/', invoiceData);

            setNewInvoice({ amount_due: '', service_type: '', shipment: '', shopforme_request: '' });
            setShowCreateInvoiceDialog(false);
            loadInvoices();
            toast.success('Invoice created successfully');
        } catch (error) {
            console.error('Error creating invoice:', error);
            toast.error('Failed to create invoice');
        } finally {
            setLoading(false);
        }
    };

    // Payment Methods functions
    const loadPaymentMethods = async () => {
        if (!selectedUser) return;

        setLoading(true);
        try {
            const response = await axiosInstance.get('/api/v1/payments/admin/payment-methods/', {
                params: { user: selectedUser.id }
            });
            setPaymentMethods(response.data);
        } catch (error) {
            console.error('Error loading payment methods:', error);
            toast.error('Failed to load payment methods');
        } finally {
            setLoading(false);
        }
    };

    const deletePaymentMethod = async (paymentMethodId) => {
        if (!confirm('Are you sure you want to delete this payment method?')) return;

        try {
            await axiosInstance.delete(`/api/v1/payments/admin/payment-methods/${paymentMethodId}/`);
            toast.success('Payment method deleted successfully');
            loadPaymentMethods();
        } catch (error) {
            console.error('Error deleting payment method:', error);
            toast.error('Failed to delete payment method');
        }
    };

    // Fraud Detection functions
    const loadFraudRecords = async () => {
        if (!selectedUser) return;

        setLoading(true);
        try {
            const params = {
                user: selectedUser.id,
                ...fraudFilters
            };

            const response = await axiosInstance.get('/api/v1/payments/admin/fraud-detection/', { params });
            setFraudRecords(response.data);
        } catch (error) {
            console.error('Error loading fraud records:', error);
            toast.error('Failed to load fraud records');
        } finally {
            setLoading(false);
        }
    };

    const updateFraudAction = async (fraudId, action, note) => {
        try {
            await axiosInstance.patch(`/api/v1/payments/admin/fraud-detection/${fraudId}/`, {
                action_taken: action,
                admin_note: note
            });

            toast.success('Fraud action updated successfully');
            loadFraudRecords();
        } catch (error) {
            console.error('Error updating fraud action:', error);
            toast.error('Failed to update fraud action');
        }
    };

    // User Behavior functions
    const loadBehaviorRecords = async () => {
        if (!selectedUser) return;

        setLoading(true);
        try {
            const params = {
                user: selectedUser.id,
                ...behaviorFilters
            };

            const response = await axiosInstance.get('/api/v1/payments/admin/user-behavior/', { params });
            setBehaviorRecords(response.data);
        } catch (error) {
            console.error('Error loading behavior records:', error);
            toast.error('Failed to load behavior records');
        } finally {
            setLoading(false);
        }
    };

    // Utility functions
    const getInvoiceStatus = (invoice) => {
        if (invoice.paid_at) {
            return 'paid';
        }
        return 'pending';
    };

    const getStatusBadgeVariant = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
            case 'paid':
            case 'active':
                return 'default';
            case 'pending':
            case 'review':
                return 'secondary';
            case 'failed':
            case 'overdue':
            case 'cancelled':
            case 'expired':
            case 'block':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getServiceTypeLabel = (serviceType) => {
        const serviceTypes = {
            'shipping': 'Shipping',
            'personal_shopper': 'Personal Shopper',
            'storage': 'Storage',
            'other': 'Other'
        };
        return serviceTypes[serviceType] || serviceType;
    };

    if (!selectedUser) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">Please select a user to view billing information.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-monument-regular text-xl sm:text-2xl text-gray-800 tracking-wide uppercase">
                        Billing - {selectedUser.first_name || selectedUser.last_name
                            ? `${selectedUser.first_name || ''} ${selectedUser.last_name || ''}`.trim()
                            : 'Admin User'
                        }
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">{selectedUser.email}</p>
                </div>
                <Button
                    onClick={loadTabData}
                    variant="outline"
                    size="sm"
                    disabled={loading}
                >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="wallet" className="flex items-center space-x-2">
                        <Wallet className="h-4 w-4" />
                        <span className="hidden sm:inline">Wallet</span>
                    </TabsTrigger>
                    <TabsTrigger value="transactions" className="flex items-center space-x-2">
                        <Activity className="h-4 w-4" />
                        <span className="hidden sm:inline">Transactions</span>
                    </TabsTrigger>
                    <TabsTrigger value="invoices" className="flex items-center space-x-2">
                        <Receipt className="h-4 w-4" />
                        <span className="hidden sm:inline">Invoices</span>
                    </TabsTrigger>
                    <TabsTrigger value="payment-methods" className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4" />
                        <span className="hidden sm:inline">Payment</span>
                    </TabsTrigger>
                    <TabsTrigger value="fraud" className="flex items-center space-x-2">
                        <Shield className="h-4 w-4" />
                        <span className="hidden sm:inline">Fraud</span>
                    </TabsTrigger>
                    <TabsTrigger value="behavior" className="flex items-center space-x-2">
                        <Activity className="h-4 w-4" />
                        <span className="hidden sm:inline">Behavior</span>
                    </TabsTrigger>
                </TabsList>

                {/* Wallet Tab */}
                <TabsContent value="wallet" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Wallet className="h-5 w-5" />
                                <span>Wallet Information</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                                    <p className="text-gray-500 mt-2">Loading wallet data...</p>
                                </div>
                            ) : walletData ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <div className="flex items-center space-x-2">
                                                <DollarSign className="h-5 w-5 text-green-600" />
                                                <span className="text-sm font-medium text-green-800">Current Balance</span>
                                            </div>
                                            <p className="text-2xl font-bold text-green-900 mt-1">
                                                {formatCurrency(walletData.balance)}
                                            </p>
                                        </div>
                                        
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex items-center space-x-2">
                                                <Clock className="h-5 w-5 text-gray-600" />
                                                <span className="text-sm font-medium text-gray-800">Last Updated</span>
                                            </div>
                                            <p className="text-sm text-gray-900 mt-1">
                                                {formatDate(walletData.updated_at)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-4 border-t">
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Created: {formatDate(walletData.created_at)}
                                            </p>
                                        </div>
                                        <Dialog open={showUpdateBalanceDialog} onOpenChange={setShowUpdateBalanceDialog}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline">
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Update Balance
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Update Wallet Balance</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-4">
                                                    <div>
                                                        <Label htmlFor="balance">New Balance</Label>
                                                        <Input
                                                            id="balance"
                                                            type="number"
                                                            step="0.01"
                                                            value={walletBalance}
                                                            onChange={(e) => setWalletBalance(e.target.value)}
                                                            placeholder="Enter new balance"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="admin-note">Admin Note</Label>
                                                        <Textarea
                                                            id="admin-note"
                                                            value={adminNote}
                                                            onChange={(e) => setAdminNote(e.target.value)}
                                                            placeholder="Reason for balance adjustment"
                                                        />
                                                    </div>
                                                    <div className="flex justify-end space-x-2">
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => setShowUpdateBalanceDialog(false)}
                                                        >
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            onClick={updateWalletBalance}
                                                            disabled={loading || !walletBalance}
                                                        >
                                                            Update Balance
                                                        </Button>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>

                                    {/* Recent Transactions */}
                                    {walletData.recent_transactions && walletData.recent_transactions.length > 0 && (
                                        <div className="pt-4 border-t">
                                            <h4 className="font-medium text-gray-900 mb-3">Recent Transactions</h4>
                                            <div className="space-y-2">
                                                {walletData.recent_transactions.map((transaction) => (
                                                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                        <div>
                                                            <p className="font-medium text-sm">{transaction.description}</p>
                                                            <p className="text-xs text-gray-500">{formatDate(transaction.timestamp)}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className={`font-semibold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                                                {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                                            </p>
                                                            <Badge variant={getStatusBadgeVariant(transaction.type)} className="text-xs">
                                                                {transaction.type}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Wallet className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">No wallet found for this user</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Transactions Tab */}
                <TabsContent value="transactions" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Activity className="h-5 w-5" />
                                    <span>Transactions</span>
                                </div>
                                <Button onClick={loadTransactions} variant="outline" size="sm">
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Refresh
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Filters */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                <Select
                                    value={transactionFilters.status}
                                    onValueChange={(value) => setTransactionFilters(prev => ({ ...prev, status: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        {transactionStatuses.map((status) => (
                                            <SelectItem key={status.value} value={status.value}>
                                                {status.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={transactionFilters.transaction_type}
                                    onValueChange={(value) => setTransactionFilters(prev => ({ ...prev, transaction_type: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filter by type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>

                                        <SelectItem value="credit">Credit</SelectItem>
                                        <SelectItem value="debit">Debit</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Input
                                    type="date"
                                    value={transactionFilters.start_date}
                                    onChange={(e) => setTransactionFilters(prev => ({ ...prev, start_date: e.target.value }))}
                                    placeholder="Start date"
                                />

                                <Input
                                    type="date"
                                    value={transactionFilters.end_date}
                                    onChange={(e) => setTransactionFilters(prev => ({ ...prev, end_date: e.target.value }))}
                                    placeholder="End date"
                                />
                            </div>

                            <div className="flex justify-end mb-4">
                                <Button onClick={loadTransactions} variant="outline" size="sm">
                                    <Filter className="h-4 w-4 mr-2" />
                                    Apply Filters
                                </Button>
                            </div>

                            {/* Transactions List */}
                            {loading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                                    <p className="text-gray-500 mt-2">Loading transactions...</p>
                                </div>
                            ) : transactions.length > 0 ? (
                                <div className="space-y-3">
                                    {transactions.map((transaction) => (
                                        <div key={transaction.id} className="border rounded-lg p-4 hover:bg-gray-50">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3">
                                                        <div className={`p-2 rounded-full ${transaction.transaction_type === 'credit' ? 'bg-green-100' : 'bg-red-100'}`}>
                                                            {transaction.transaction_type === 'credit' ?
                                                                <Plus className="h-4 w-4 text-green-600" /> :
                                                                <DollarSign className="h-4 w-4 text-red-600" />
                                                            }
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">{transaction.description}</p>
                                                            <p className="text-sm text-gray-500">
                                                                {formatDate(transaction.timestamp)}
                                                            </p>
                                                            {transaction.external_payment_id && (
                                                                <p className="text-xs text-gray-400">
                                                                    ID: {transaction.external_payment_id}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`font-semibold text-lg ${transaction.transaction_type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                                        {transaction.transaction_type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                                    </p>
                                                    <Badge variant={getStatusBadgeVariant(transaction.status)} className="mb-2">
                                                        {transaction.status}
                                                    </Badge>
                                                    <div className="flex space-x-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => loadTransactionDetails(transaction.id)}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <UpdateTransactionStatusDialog
                                                            transaction={transaction}
                                                            statuses={transactionStatuses}
                                                            onUpdate={updateTransactionStatus}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">No transactions found</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Transaction Details Dialog */}
                    <Dialog open={showTransactionDialog} onOpenChange={setShowTransactionDialog}>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Transaction Details</DialogTitle>
                            </DialogHeader>
                            {selectedTransaction && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>Transaction ID</Label>
                                            <p className="font-mono text-sm">{selectedTransaction.id}</p>
                                        </div>
                                        <div>
                                            <Label>Amount</Label>
                                            <p className={`font-semibold ${selectedTransaction.transaction_type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                                {selectedTransaction.transaction_type === 'credit' ? '+' : '-'}{formatCurrency(selectedTransaction.amount)}
                                            </p>
                                        </div>
                                        <div>
                                            <Label>Type</Label>
                                            <Badge variant={selectedTransaction.transaction_type === 'credit' ? 'default' : 'secondary'}>
                                                {selectedTransaction.transaction_type}
                                            </Badge>
                                        </div>
                                        <div>
                                            <Label>Status</Label>
                                            <Badge variant={getStatusBadgeVariant(selectedTransaction.status)}>
                                                {selectedTransaction.status}
                                            </Badge>
                                        </div>
                                        <div>
                                            <Label>Description</Label>
                                            <p>{selectedTransaction.description}</p>
                                        </div>
                                        <div>
                                            <Label>Timestamp</Label>
                                            <p>{formatDate(selectedTransaction.timestamp)}</p>
                                        </div>
                                        {selectedTransaction.external_payment_id && (
                                            <div className="col-span-2">
                                                <Label>External Payment ID</Label>
                                                <p className="font-mono text-sm">{selectedTransaction.external_payment_id}</p>
                                            </div>
                                        )}

                                    </div>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                </TabsContent>

                {/* Invoices Tab */}
                <TabsContent value="invoices" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Receipt className="h-5 w-5" />
                                    <span>Invoices</span>
                                </div>
                                <div className="flex space-x-2">
                                    <Dialog open={showCreateInvoiceDialog} onOpenChange={setShowCreateInvoiceDialog}>
                                        <DialogTrigger asChild>
                                            <Button size="sm">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Create Invoice
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Create New Invoice</DialogTitle>
                                            </DialogHeader>
                                            <div className="space-y-4">
                                                <div>
                                                    <Label htmlFor="invoice-amount">Amount Due</Label>
                                                    <Input
                                                        id="invoice-amount"
                                                        type="number"
                                                        step="0.01"
                                                        value={newInvoice.amount_due}
                                                        onChange={(e) => setNewInvoice(prev => ({ ...prev, amount_due: e.target.value }))}
                                                        placeholder="Enter amount due"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="service-type">Service Type</Label>
                                                    <Select
                                                        value={newInvoice.service_type}
                                                        onValueChange={(value) => setNewInvoice(prev => ({ ...prev, service_type: value }))}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select service type" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="shipping">Shipping</SelectItem>
                                                            <SelectItem value="personal_shopper">Personal Shopper</SelectItem>
                                                            <SelectItem value="storage">Storage</SelectItem>
                                                            <SelectItem value="other">Other</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <Label htmlFor="shipment">Shipment ID (Optional)</Label>
                                                    <Input
                                                        id="shipment"
                                                        type="number"
                                                        value={newInvoice.shipment}
                                                        onChange={(e) => setNewInvoice(prev => ({ ...prev, shipment: e.target.value }))}
                                                        placeholder="Enter shipment ID"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="shopforme-request">Shop For Me Request ID (Optional)</Label>
                                                    <Input
                                                        id="shopforme-request"
                                                        type="number"
                                                        value={newInvoice.shopforme_request}
                                                        onChange={(e) => setNewInvoice(prev => ({ ...prev, shopforme_request: e.target.value }))}
                                                        placeholder="Enter shop for me request ID"
                                                    />
                                                </div>
                                                <div className="flex justify-end space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => setShowCreateInvoiceDialog(false)}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        onClick={createInvoice}
                                                        disabled={loading || !newInvoice.amount_due || !newInvoice.service_type}
                                                    >
                                                        Create Invoice
                                                    </Button>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                    <Button onClick={loadInvoices} variant="outline" size="sm">
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Refresh
                                    </Button>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Invoice Filters */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <Select
                                    value={invoiceFilters.service_type}
                                    onValueChange={(value) => setInvoiceFilters(prev => ({ ...prev, service_type: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filter by service type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Service Types</SelectItem>
                                        <SelectItem value="shipping">Shipping</SelectItem>
                                        <SelectItem value="personal_shopper">Personal Shopper</SelectItem>
                                        <SelectItem value="storage">Storage</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Input
                                    type="date"
                                    value={invoiceFilters.issued_date_from}
                                    onChange={(e) => setInvoiceFilters(prev => ({ ...prev, issued_date_from: e.target.value }))}
                                    placeholder="Issued date from"
                                />

                                <Input
                                    type="date"
                                    value={invoiceFilters.issued_date_to}
                                    onChange={(e) => setInvoiceFilters(prev => ({ ...prev, issued_date_to: e.target.value }))}
                                    placeholder="Issued date to"
                                />
                            </div>

                            <div className="flex justify-end mb-4">
                                <Button onClick={loadInvoices} variant="outline" size="sm">
                                    <Filter className="h-4 w-4 mr-2" />
                                    Apply Filters
                                </Button>
                            </div>

                            {/* Invoices List */}
                            {loading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                                    <p className="text-gray-500 mt-2">Loading invoices...</p>
                                </div>
                            ) : invoices.length > 0 ? (
                                <div className="space-y-3">
                                    {invoices.map((invoice) => (
                                        <div key={invoice.id} className="border rounded-lg p-4 hover:bg-gray-50">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="p-2 rounded-full bg-blue-100">
                                                            <Receipt className="h-4 w-4 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">
                                                                {getServiceTypeLabel(invoice.service_type)} - Invoice #{invoice.id}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                Issued: {formatDate(invoice.issued_at)}
                                                            </p>
                                                            {invoice.paid_at && (
                                                                <p className="text-sm text-gray-500">
                                                                    Paid: {formatDate(invoice.paid_at)}
                                                                </p>
                                                            )}
                                                            {invoice.shipment && (
                                                                <p className="text-xs text-gray-400">
                                                                    Shipment ID: {invoice.shipment}
                                                                </p>
                                                            )}
                                                            {invoice.shopforme_request && (
                                                                <p className="text-xs text-gray-400">
                                                                    Shop For Me Request ID: {invoice.shopforme_request}
                                                                </p>
                                                            )}
                                                            {invoice.transaction && (
                                                                <p className="text-xs text-gray-400">
                                                                    Transaction ID: {invoice.transaction}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="space-y-1">
                                                        <p className="font-semibold text-lg">
                                                            {formatCurrency(invoice.amount_due)}
                                                        </p>
                                                        {invoice.amount_paid && parseFloat(invoice.amount_paid) > 0 && (
                                                            <p className="text-sm text-green-600">
                                                                Paid: {formatCurrency(invoice.amount_paid)}
                                                            </p>
                                                        )}
                                                        <Badge variant={getStatusBadgeVariant(getInvoiceStatus(invoice))} className="mb-2">
                                                            {getInvoiceStatus(invoice)}
                                                        </Badge>
                                                    </div>
                                                    <div className="mt-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedInvoice(invoice);
                                                                setShowInvoiceDialog(true);
                                                            }}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Receipt className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">No invoices found</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Invoice Details Dialog */}
                    <Dialog open={showInvoiceDialog} onOpenChange={setShowInvoiceDialog}>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Invoice Details</DialogTitle>
                            </DialogHeader>
                            {selectedInvoice && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>Invoice ID</Label>
                                            <p className="font-mono text-sm">{selectedInvoice.id}</p>
                                        </div>
                                        <div>
                                            <Label>Service Type</Label>
                                            <p>{getServiceTypeLabel(selectedInvoice.service_type)}</p>
                                        </div>
                                        <div>
                                            <Label>Amount Due</Label>
                                            <p className="font-semibold text-lg">
                                                {formatCurrency(selectedInvoice.amount_due)}
                                            </p>
                                        </div>
                                        <div>
                                            <Label>Amount Paid</Label>
                                            <p className="font-semibold text-green-600">
                                                {formatCurrency(selectedInvoice.amount_paid || 0)}
                                            </p>
                                        </div>
                                        <div>
                                            <Label>Status</Label>
                                            <Badge variant={getStatusBadgeVariant(getInvoiceStatus(selectedInvoice))}>
                                                {getInvoiceStatus(selectedInvoice)}
                                            </Badge>
                                        </div>
                                        <div>
                                            <Label>Issued At</Label>
                                            <p>{formatDate(selectedInvoice.issued_at)}</p>
                                        </div>
                                        {selectedInvoice.paid_at && (
                                            <div>
                                                <Label>Paid At</Label>
                                                <p>{formatDate(selectedInvoice.paid_at)}</p>
                                            </div>
                                        )}
                                        {selectedInvoice.shipment && (
                                            <div>
                                                <Label>Shipment ID</Label>
                                                <p className="font-mono text-sm">{selectedInvoice.shipment}</p>
                                            </div>
                                        )}
                                        {selectedInvoice.shopforme_request && (
                                            <div>
                                                <Label>Shop For Me Request ID</Label>
                                                <p className="font-mono text-sm">{selectedInvoice.shopforme_request}</p>
                                            </div>
                                        )}
                                        {selectedInvoice.transaction && (
                                            <div>
                                                <Label>Transaction ID</Label>
                                                <p className="font-mono text-sm">{selectedInvoice.transaction}</p>
                                            </div>
                                        )}
                                        {selectedInvoice.pdf_file && (
                                            <div className="col-span-2">
                                                <Label>PDF File</Label>
                                                <p>
                                                    <a
                                                        href={selectedInvoice.pdf_file}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        Download PDF
                                                    </a>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                </TabsContent>

                {/* Payment Methods Tab */}
                <TabsContent value="payment-methods" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <CreditCard className="h-5 w-5" />
                                    <span>Payment Methods</span>
                                </div>
                                <Button onClick={loadPaymentMethods} variant="outline" size="sm">
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Refresh
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                                    <p className="text-gray-500 mt-2">Loading payment methods...</p>
                                </div>
                            ) : paymentMethods.length > 0 ? (
                                <div className="space-y-3">
                                    {paymentMethods.map((method) => (
                                        <div key={method.id} className="border rounded-lg p-4 hover:bg-gray-50">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="p-2 rounded-full bg-gray-100">
                                                        <CreditCard className="h-4 w-4 text-gray-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">
                                                            {method.brand?.toUpperCase()} •••• {method.last4}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {paymentMethodTypes.find(t => t.value === method.type)?.label || method.type}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            Added: {formatDate(method.created_at)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    {method.is_default && (
                                                        <Badge variant="default">Default</Badge>
                                                    )}
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => deletePaymentMethod(method.id)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">No payment methods found</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Fraud Detection Tab */}
                <TabsContent value="fraud" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Shield className="h-5 w-5" />
                                    <span>Fraud Detection</span>
                                </div>
                                <Button onClick={loadFraudRecords} variant="outline" size="sm">
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Refresh
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Fraud Filters */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="1"
                                    value={fraudFilters.risk_score_min}
                                    onChange={(e) => setFraudFilters(prev => ({ ...prev, risk_score_min: e.target.value }))}
                                    placeholder="Min risk score (0-1)"
                                />

                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="1"
                                    value={fraudFilters.risk_score_max}
                                    onChange={(e) => setFraudFilters(prev => ({ ...prev, risk_score_max: e.target.value }))}
                                    placeholder="Max risk score (0-1)"
                                />

                                <Select
                                    value={fraudFilters.risk_level}
                                    onValueChange={(value) => setFraudFilters(prev => ({ ...prev, risk_level: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filter by risk level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Risk Levels</SelectItem>
                                        {fraudRiskLevels.map((level) => (
                                            <SelectItem key={level.value} value={level.value}>
                                                {level.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex justify-end mb-4">
                                <Button onClick={loadFraudRecords} variant="outline" size="sm">
                                    <Filter className="h-4 w-4 mr-2" />
                                    Apply Filters
                                </Button>
                            </div>

                            {loading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                                    <p className="text-gray-500 mt-2">Loading fraud records...</p>
                                </div>
                            ) : fraudRecords.length > 0 ? (
                                <div className="space-y-3">
                                    {fraudRecords.map((record) => (
                                        <div key={record.id} className="border rounded-lg p-4 hover:bg-gray-50">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3">
                                                        <div className={`p-2 rounded-full ${record.risk_score > 0.7 ? 'bg-red-100' : record.risk_score > 0.4 ? 'bg-yellow-100' : 'bg-green-100'}`}>
                                                            <Shield className={`h-4 w-4 ${record.risk_score > 0.7 ? 'text-red-600' : record.risk_score > 0.4 ? 'text-yellow-600' : 'text-green-600'}`} />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">{record.reason}</p>
                                                            <p className="text-sm text-gray-500">
                                                                Risk Score: {(record.risk_score * 100).toFixed(1)}%
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                {formatDate(record.created_at)}
                                                            </p>
                                                            {record.transaction && (
                                                                <p className="text-sm text-gray-500">
                                                                    Transaction: {formatCurrency(record.transaction.amount)}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <Badge variant={getStatusBadgeVariant(record.risk_level)} className="mb-2">
                                                        {record.risk_level}
                                                    </Badge>
                                                    <div>
                                                        <UpdateFraudActionDialog
                                                            record={record}
                                                            riskLevels={fraudRiskLevels}
                                                            onUpdate={updateFraudAction}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Shield className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">No fraud records found</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* User Behavior Tab */}
                <TabsContent value="behavior" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Activity className="h-5 w-5" />
                                    <span>User Behavior Analytics</span>
                                </div>
                                <Button onClick={loadBehaviorRecords} variant="outline" size="sm">
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Refresh
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Behavior Filters */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <Input
                                    value={behaviorFilters.action}
                                    onChange={(e) => setBehaviorFilters(prev => ({ ...prev, action: e.target.value }))}
                                    placeholder="Filter by action"
                                />

                                <Input
                                    type="date"
                                    value={behaviorFilters.start_date}
                                    onChange={(e) => setBehaviorFilters(prev => ({ ...prev, start_date: e.target.value }))}
                                    placeholder="Start date"
                                />

                                <Input
                                    type="date"
                                    value={behaviorFilters.end_date}
                                    onChange={(e) => setBehaviorFilters(prev => ({ ...prev, end_date: e.target.value }))}
                                    placeholder="End date"
                                />
                            </div>

                            <div className="flex justify-end mb-4">
                                <Button onClick={loadBehaviorRecords} variant="outline" size="sm">
                                    <Filter className="h-4 w-4 mr-2" />
                                    Apply Filters
                                </Button>
                            </div>

                            {loading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                                    <p className="text-gray-500 mt-2">Loading behavior records...</p>
                                </div>
                            ) : behaviorRecords.length > 0 ? (
                                <div className="space-y-3">
                                    {behaviorRecords.map((record) => (
                                        <div key={record.id} className="border rounded-lg p-4 hover:bg-gray-50">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="p-2 rounded-full bg-blue-100">
                                                        <Activity className="h-4 w-4 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{record.action}</p>
                                                        <p className="text-sm text-gray-500">
                                                            {formatDate(record.timestamp)}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            IP: {record.ip_address}
                                                        </p>
                                                        {record.user_agent && (
                                                            <p className="text-xs text-gray-400 truncate max-w-md">
                                                                {record.user_agent}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">No behavior records found</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

// Helper Components
function UpdateTransactionStatusDialog({ transaction, statuses, onUpdate }) {
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState(transaction.status);
    const [note, setNote] = useState('');

    const handleUpdate = () => {
        onUpdate(transaction.id, status, note);
        setOpen(false);
        setNote('');
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Transaction Status</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label>Status</Label>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {statuses.map((s) => (
                                    <SelectItem key={s.value} value={s.value}>
                                        {s.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Admin Note</Label>
                        <Textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Reason for status change"
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdate}>
                            Update Status
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function UpdateFraudActionDialog({ record, riskLevels, onUpdate }) {
    const [open, setOpen] = useState(false);
    const [riskLevel, setRiskLevel] = useState(record.risk_level || '');
    const [note, setNote] = useState('');

    const handleUpdate = () => {
        onUpdate(record.id, riskLevel, note);
        setOpen(false);
        setNote('');
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Risk Level</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label>Risk Level</Label>
                        <Select value={riskLevel} onValueChange={setRiskLevel}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {riskLevels.map((level) => (
                                    <SelectItem key={level.value} value={level.value}>
                                        {level.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Admin Note</Label>
                        <Textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Reason for risk level change"
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdate}>
                            Update Risk Level
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
