"use client";

import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, ShoppingCart, Package, DollarSign, Clock, Eye, Filter, X, ExternalLink, CheckCircle, AlertCircle, Truck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axiosInstance';

export default function PersonalShopper({ selectedUser }) {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrevious, setHasPrevious] = useState(false);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showViewDialog, setShowViewDialog] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [statusFilter, setStatusFilter] = useState('');
    const [platformFilter, setPlatformFilter] = useState('');
    const [statusChoices, setStatusChoices] = useState([]);
    const [activeTab, setActiveTab] = useState('all');

    // Form state
    const [formData, setFormData] = useState({
        user: selectedUser?.id || '',
        product_url: '',
        product_name: '',
        quantity: 1,
        notes: '',
        extracted_price: '',
        extracted_currency: 'USD',
        platform: 'amazon',
        unit_price: '',
        estimated_tax: '',
        service_fee: '',
        shipping_fee: '0.00',
        admin_notes: '',
        status: 'pending_review',
        order_id_external: ''
    });

    // Review form state
    const [reviewData, setReviewData] = useState({
        unit_price: '',
        estimated_tax: '',
        service_fee: '',
        shipping_fee: '0.00',
        admin_notes: ''
    });

    // Fetch status choices
    const fetchStatusChoices = async () => {
        try {
            const response = await axiosInstance.get('/api/v1/shopforme/admin/requests/statuses/');
            setStatusChoices(response.data);
        } catch (error) {
            console.error('Error fetching status choices:', error);
        }
    };

    // Fetch ShopForMe requests
    const fetchRequests = async (search = '', page = 1, status = '', platform = '') => {
        setLoading(true);
        try {
            const params = {
                search,
                page,
                page_size: 10
            };

            if (status && status !== 'all') params.status = status;
            if (platform && platform !== 'all') params.platform = platform;
            if (selectedUser) params.user = selectedUser.id;

            const response = await axiosInstance.get('/api/v1/shopforme/admin/requests/', {
                params
            });

            const data = response.data;
            const requestsList = Array.isArray(data) ? data : data.results || [];
            setRequests(requestsList);
            setTotalCount(Array.isArray(data) ? data.length : data.count || 0);
            setHasNext(!!data.next);
            setHasPrevious(!!data.previous);

        } catch (error) {
            console.error('Error fetching requests:', error);
            toast.error("Failed to fetch ShopForMe requests");
            setRequests([]);
        } finally {
            setLoading(false);
        }
    };

    // Load data on component mount
    useEffect(() => {
        fetchStatusChoices();
        fetchRequests();
    }, [selectedUser]);

    // Search with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchRequests(searchQuery, 1, statusFilter, platformFilter);
            setCurrentPage(1);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, statusFilter, platformFilter]);

    // Create request
    const handleCreate = async () => {
        try {
            const requestData = {
                ...formData,
                user: selectedUser?.id || formData.user,
                quantity: parseInt(formData.quantity),
                unit_price: parseFloat(formData.unit_price) || 0,
                estimated_tax: parseFloat(formData.estimated_tax) || 0,
                service_fee: parseFloat(formData.service_fee) || 0,
                shipping_fee: parseFloat(formData.shipping_fee) || 0
            };

            await axiosInstance.post('/api/v1/shopforme/admin/requests/', requestData);

            toast.success("ShopForMe request created successfully");

            setShowCreateDialog(false);
            resetForm();
            fetchRequests(searchQuery, currentPage, statusFilter, platformFilter);
        } catch (error) {
            console.error('Error creating request:', error);
            toast.error("Failed to create ShopForMe request");
        }
    };

    // Update request
    const handleUpdate = async () => {
        try {
            const requestData = {
                ...formData,
                quantity: parseInt(formData.quantity),
                unit_price: parseFloat(formData.unit_price) || 0,
                estimated_tax: parseFloat(formData.estimated_tax) || 0,
                service_fee: parseFloat(formData.service_fee) || 0,
                shipping_fee: parseFloat(formData.shipping_fee) || 0
            };

            await axiosInstance.patch(`/api/v1/shopforme/admin/requests/${selectedRequest.id}/`, requestData);

            toast.success("ShopForMe request updated successfully");

            setShowEditDialog(false);
            resetForm();
            setSelectedRequest(null);
            fetchRequests(searchQuery, currentPage, statusFilter, platformFilter);
        } catch (error) {
            console.error('Error updating request:', error);
            toast.error("Failed to update ShopForMe request");
        }
    };

    // Delete request
    const handleDelete = async (requestId) => {
        try {
            await axiosInstance.delete(`/api/v1/shopforme/admin/requests/${requestId}/`);

            toast.success("ShopForMe request deleted successfully");

            fetchRequests(searchQuery, currentPage, statusFilter, platformFilter);
        } catch (error) {
            console.error('Error deleting request:', error);
            toast.error("Failed to delete ShopForMe request");
        }
    };

    // Review request
    const handleReview = async (requestId) => {
        try {
            const data = {
                unit_price: parseFloat(reviewData.unit_price),
                estimated_tax: parseFloat(reviewData.estimated_tax),
                service_fee: parseFloat(reviewData.service_fee),
                shipping_fee: parseFloat(reviewData.shipping_fee) || 0,
                admin_notes: reviewData.admin_notes
            };

            await axiosInstance.post(`/api/v1/shopforme/admin/requests/${requestId}/review_request/`, data);

            toast.success("Request reviewed and quotation provided");

            fetchRequests(searchQuery, currentPage, statusFilter, platformFilter);
        } catch (error) {
            console.error('Error reviewing request:', error);
            toast.error(error.response?.data?.error || "Failed to review request");
        }
    };

    // Place order
    const handlePlaceOrder = async (requestId, orderIdExternal) => {
        try {
            await axiosInstance.post(`/api/v1/shopforme/admin/requests/${requestId}/place_order/`, {
                order_id_external: orderIdExternal
            });

            toast.success("Order placed successfully");

            fetchRequests(searchQuery, currentPage, statusFilter, platformFilter);
        } catch (error) {
            console.error('Error placing order:', error);
            toast.error("Failed to place order");
        }
    };

    // Mark as arrived
    const handleMarkArrived = async (requestId) => {
        try {
            await axiosInstance.post(`/api/v1/shopforme/admin/requests/${requestId}/mark_arrived/`);

            toast.success("Item marked as arrived at warehouse");

            fetchRequests(searchQuery, currentPage, statusFilter, platformFilter);
        } catch (error) {
            console.error('Error marking as arrived:', error);
            toast.error("Failed to mark item as arrived");
        }
    };

    // Mark ready for shipment
    const handleReadyForShipment = async (requestId) => {
        try {
            await axiosInstance.post(`/api/v1/shopforme/admin/requests/${requestId}/ready_for_shipment/`);

            toast.success("Item marked as ready for shipment");

            fetchRequests(searchQuery, currentPage, statusFilter, platformFilter);
        } catch (error) {
            console.error('Error marking ready for shipment:', error);
            toast.error(error.response?.data?.error || "Failed to mark ready for shipment");
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            user: selectedUser?.id || '',
            product_url: '',
            product_name: '',
            quantity: 1,
            notes: '',
            extracted_price: '',
            extracted_currency: 'USD',
            platform: 'amazon',
            unit_price: '',
            estimated_tax: '',
            service_fee: '',
            shipping_fee: '0.00',
            admin_notes: '',
            status: 'pending_review',
            order_id_external: ''
        });
    };

    // Handle edit click
    const handleEditClick = (request) => {
        setSelectedRequest(request);
        setFormData({
            user: request.user,
            product_url: request.product_url,
            product_name: request.product_name,
            quantity: request.quantity,
            notes: request.notes || '',
            extracted_price: request.extracted_price || '',
            extracted_currency: request.extracted_currency || 'USD',
            platform: request.platform,
            unit_price: request.unit_price || '',
            estimated_tax: request.estimated_tax || '',
            service_fee: request.service_fee || '',
            shipping_fee: request.shipping_fee || '0.00',
            admin_notes: request.admin_notes || '',
            status: request.status,
            order_id_external: request.order_id_external || ''
        });
        setShowEditDialog(true);
    };

    // Handle view click
    const handleViewClick = (request) => {
        setSelectedRequest(request);
        setReviewData({
            unit_price: request.unit_price || '',
            estimated_tax: request.estimated_tax || '',
            service_fee: request.service_fee || '',
            shipping_fee: request.shipping_fee || '0.00',
            admin_notes: request.admin_notes || ''
        });
        setShowViewDialog(true);
    };

    // Get status badge variant
    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'quotation_ready':
            case 'order_placed':
            case 'arrived_at_warehouse':
            case 'ready_for_shipment':
            case 'shipped':
                return 'default';
            case 'pending_review':
            case 'awaiting_payment':
                return 'secondary';
            case 'rejected':
            case 'cancelled':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    // Get status icon
    const getStatusIcon = (status) => {
        switch (status) {
            case 'quotation_ready':
                return <DollarSign className="h-4 w-4" />;
            case 'order_placed':
                return <ShoppingCart className="h-4 w-4" />;
            case 'arrived_at_warehouse':
                return <Package className="h-4 w-4" />;
            case 'ready_for_shipment':
            case 'shipped':
                return <Truck className="h-4 w-4" />;
            case 'pending_review':
                return <Clock className="h-4 w-4" />;
            case 'rejected':
            case 'cancelled':
                return <AlertCircle className="h-4 w-4" />;
            default:
                return <CheckCircle className="h-4 w-4" />;
        }
    };

    // Handle pagination
    const handleNextPage = () => {
        if (hasNext) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            fetchRequests(searchQuery, nextPage, statusFilter, platformFilter);
        }
    };

    const handlePreviousPage = () => {
        if (hasPrevious) {
            const prevPage = currentPage - 1;
            setCurrentPage(prevPage);
            fetchRequests(searchQuery, prevPage, statusFilter, platformFilter);
        }
    };

    // Clear filters
    const clearFilters = () => {
        setSearchQuery('');
        setStatusFilter('');
        setPlatformFilter('');
    };

    // Filter requests by tab
    const getFilteredRequests = () => {
        switch (activeTab) {
            case 'pending':
                return requests.filter(req => ['pending_review', 'url_validated'].includes(req.status));
            case 'quoted':
                return requests.filter(req => ['quotation_ready', 'awaiting_payment'].includes(req.status));
            case 'ordered':
                return requests.filter(req => ['order_placed', 'arrived_at_warehouse', 'ready_for_shipment'].includes(req.status));
            case 'completed':
                return requests.filter(req => req.status === 'shipped');
            default:
                return requests;
        }
    };

    const filteredRequests = getFilteredRequests();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="font-monument-regular text-xl sm:text-2xl text-gray-800 tracking-wide uppercase">
                        Personal Shopper
                        {selectedUser && (
                            <span className="text-base ml-2">
                                - {selectedUser.first_name || selectedUser.last_name
                                    ? `${selectedUser.first_name || ''} ${selectedUser.last_name || ''}`.trim()
                                    : selectedUser.email
                                }
                            </span>
                        )}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Manage ShopForMe requests and orders
                    </p>
                </div>

                <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm} className="flex items-center space-x-2">
                            <Plus className="h-4 w-4" />
                            <span>Create Request</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Create ShopForMe Request</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="product_url">Product URL *</Label>
                                    <Input
                                        id="product_url"
                                        value={formData.product_url}
                                        onChange={(e) => setFormData({ ...formData, product_url: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="platform">Platform</Label>
                                    <Select value={formData.platform} onValueChange={(value) => setFormData({ ...formData, platform: value })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="amazon">Amazon</SelectItem>
                                            <SelectItem value="ebay">eBay</SelectItem>
                                            <SelectItem value="walmart">Walmart</SelectItem>
                                            <SelectItem value="target">Target</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="product_name">Product Name *</Label>
                                <Input
                                    id="product_name"
                                    value={formData.product_name}
                                    onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                                    placeholder="Enter product name"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="quantity">Quantity</Label>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        min="1"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="extracted_price">Extracted Price</Label>
                                    <Input
                                        id="extracted_price"
                                        type="number"
                                        step="0.01"
                                        value={formData.extracted_price}
                                        onChange={(e) => setFormData({ ...formData, extracted_price: e.target.value })}
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="extracted_currency">Currency</Label>
                                    <Select value={formData.extracted_currency} onValueChange={(value) => setFormData({ ...formData, extracted_currency: value })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="USD">USD</SelectItem>
                                            <SelectItem value="EUR">EUR</SelectItem>
                                            <SelectItem value="GBP">GBP</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                <div>
                                    <Label htmlFor="unit_price">Unit Price</Label>
                                    <Input
                                        id="unit_price"
                                        type="number"
                                        step="0.01"
                                        value={formData.unit_price}
                                        onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="estimated_tax">Tax</Label>
                                    <Input
                                        id="estimated_tax"
                                        type="number"
                                        step="0.01"
                                        value={formData.estimated_tax}
                                        onChange={(e) => setFormData({ ...formData, estimated_tax: e.target.value })}
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="service_fee">Service Fee</Label>
                                    <Input
                                        id="service_fee"
                                        type="number"
                                        step="0.01"
                                        value={formData.service_fee}
                                        onChange={(e) => setFormData({ ...formData, service_fee: e.target.value })}
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="shipping_fee">Shipping Fee</Label>
                                    <Input
                                        id="shipping_fee"
                                        type="number"
                                        step="0.01"
                                        value={formData.shipping_fee}
                                        onChange={(e) => setFormData({ ...formData, shipping_fee: e.target.value })}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="notes">Customer Notes</Label>
                                <Textarea
                                    id="notes"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    placeholder="Customer notes or special requests"
                                    rows={2}
                                />
                            </div>
                            <div>
                                <Label htmlFor="admin_notes">Admin Notes</Label>
                                <Textarea
                                    id="admin_notes"
                                    value={formData.admin_notes}
                                    onChange={(e) => setFormData({ ...formData, admin_notes: e.target.value })}
                                    placeholder="Internal admin notes"
                                    rows={2}
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleCreate}>
                                    Create Request
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search and Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    type="text"
                                    placeholder="Search requests..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full sm:w-40">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    {statusChoices.map((status) => (
                                        <SelectItem key={status.value} value={status.value}>
                                            {status.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={platformFilter} onValueChange={setPlatformFilter}>
                                <SelectTrigger className="w-full sm:w-32">
                                    <SelectValue placeholder="Platform" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Platforms</SelectItem>
                                    <SelectItem value="amazon">Amazon</SelectItem>
                                    <SelectItem value="ebay">eBay</SelectItem>
                                    <SelectItem value="walmart">Walmart</SelectItem>
                                    <SelectItem value="target">Target</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            {(searchQuery || statusFilter || platformFilter) && (
                                <Button variant="outline" size="sm" onClick={clearFilters}>
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="all">All ({requests.length})</TabsTrigger>
                    <TabsTrigger value="pending">Pending ({requests.filter(req => ['pending_review', 'url_validated'].includes(req.status)).length})</TabsTrigger>
                    <TabsTrigger value="quoted">Quoted ({requests.filter(req => ['quotation_ready', 'awaiting_payment'].includes(req.status)).length})</TabsTrigger>
                    <TabsTrigger value="ordered">Ordered ({requests.filter(req => ['order_placed', 'arrived_at_warehouse', 'ready_for_shipment'].includes(req.status)).length})</TabsTrigger>
                    <TabsTrigger value="completed">Completed ({requests.filter(req => req.status === 'shipped').length})</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>ShopForMe Requests ({filteredRequests.length})</span>
                                {loading && <span className="text-sm text-gray-500">Loading...</span>}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="text-center py-8">
                                    <div className="text-gray-500">Loading requests...</div>
                                </div>
                            ) : filteredRequests.length > 0 ? (
                                <div className="space-y-4">
                                    {filteredRequests.map((request) => (
                                        <div key={request.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-3 mb-2">
                                                        {getStatusIcon(request.status)}
                                                        <h3 className="font-medium text-gray-900 truncate">
                                                            {request.product_name}
                                                        </h3>
                                                        <Badge variant={getStatusBadgeVariant(request.status)}>
                                                            {statusChoices.find(s => s.value === request.status)?.label || request.status}
                                                        </Badge>
                                                        <Badge variant="outline">
                                                            {request.platform}
                                                        </Badge>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600 mb-2">
                                                        <div>User: {request.user_email}</div>
                                                        <div>Qty: {request.quantity}</div>
                                                        <div>Total: ${request.total_cost}</div>
                                                        <div>Created: {new Date(request.created_at).toLocaleDateString()}</div>
                                                    </div>
                                                    {request.product_url && (
                                                        <div className="flex items-center space-x-2 text-sm">
                                                            <ExternalLink className="h-4 w-4 text-gray-400" />
                                                            <a
                                                                href={request.product_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 hover:underline truncate"
                                                            >
                                                                {request.product_url}
                                                            </a>
                                                        </div>
                                                    )}
                                                    {request.notes && (
                                                        <div className="text-sm text-gray-600 mt-2">
                                                            <strong>Notes:</strong> {request.notes}
                                                        </div>
                                                    )}
                                                    <div className="text-xs text-gray-500 mt-2">
                                                        ID: {request.id} | Updated: {new Date(request.updated_at).toLocaleString()}
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2 ml-4">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleViewClick(request)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEditClick(request)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="outline" size="sm">
                                                                <Trash2 className="h-4 w-4 text-red-500" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Delete Request</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Are you sure you want to delete this ShopForMe request? This action cannot be undone.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDelete(request.id)}
                                                                    className="bg-red-600 hover:bg-red-700"
                                                                >
                                                                    Delete
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
                                    <p className="text-gray-500">
                                        {searchQuery || statusFilter || platformFilter
                                            ? 'Try adjusting your search or filters'
                                            : 'Get started by creating your first ShopForMe request'
                                        }
                                    </p>
                                </div>
                            )}

                            {/* Pagination */}
                            {(hasNext || hasPrevious) && (
                                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                                    <Button
                                        variant="outline"
                                        onClick={handlePreviousPage}
                                        disabled={!hasPrevious}
                                    >
                                        Previous
                                    </Button>
                                    <span className="text-sm text-gray-500">
                                        Page {currentPage}
                                    </span>
                                    <Button
                                        variant="outline"
                                        onClick={handleNextPage}
                                        disabled={!hasNext}
                                    >
                                        Next
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* View/Review Dialog */}
            <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Request Details & Actions</DialogTitle>
                    </DialogHeader>
                    {selectedRequest && (
                        <div className="space-y-6">
                            {/* Request Details */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <Label className="text-sm font-medium">Product Name</Label>
                                    <p className="text-sm">{selectedRequest.product_name}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Status</Label>
                                    <Badge variant={getStatusBadgeVariant(selectedRequest.status)} className="ml-2">
                                        {statusChoices.find(s => s.value === selectedRequest.status)?.label || selectedRequest.status}
                                    </Badge>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">User</Label>
                                    <p className="text-sm">{selectedRequest.user_email}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Platform</Label>
                                    <p className="text-sm">{selectedRequest.platform}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Quantity</Label>
                                    <p className="text-sm">{selectedRequest.quantity}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Total Cost</Label>
                                    <p className="text-sm font-medium">${selectedRequest.total_cost}</p>
                                </div>
                            </div>

                            {/* Product URL */}
                            {selectedRequest.product_url && (
                                <div>
                                    <Label className="text-sm font-medium">Product URL</Label>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <ExternalLink className="h-4 w-4 text-gray-400" />
                                        <a
                                            href={selectedRequest.product_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline text-sm break-all"
                                        >
                                            {selectedRequest.product_url}
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* Notes */}
                            {selectedRequest.notes && (
                                <div>
                                    <Label className="text-sm font-medium">Customer Notes</Label>
                                    <p className="text-sm mt-1 p-2 bg-gray-50 rounded">{selectedRequest.notes}</p>
                                </div>
                            )}

                            {/* Admin Actions */}
                            {selectedRequest.status === 'pending_review' && (
                                <div className="border-t pt-4">
                                    <h4 className="font-medium mb-4">Review Request & Provide Quotation</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                        <div>
                                            <Label htmlFor="review_unit_price">Unit Price *</Label>
                                            <Input
                                                id="review_unit_price"
                                                type="number"
                                                step="0.01"
                                                value={reviewData.unit_price}
                                                onChange={(e) => setReviewData({ ...reviewData, unit_price: e.target.value })}
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="review_tax">Tax</Label>
                                            <Input
                                                id="review_tax"
                                                type="number"
                                                step="0.01"
                                                value={reviewData.estimated_tax}
                                                onChange={(e) => setReviewData({ ...reviewData, estimated_tax: e.target.value })}
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="review_service">Service Fee</Label>
                                            <Input
                                                id="review_service"
                                                type="number"
                                                step="0.01"
                                                value={reviewData.service_fee}
                                                onChange={(e) => setReviewData({ ...reviewData, service_fee: e.target.value })}
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="review_shipping">Shipping</Label>
                                            <Input
                                                id="review_shipping"
                                                type="number"
                                                step="0.01"
                                                value={reviewData.shipping_fee}
                                                onChange={(e) => setReviewData({ ...reviewData, shipping_fee: e.target.value })}
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <Label htmlFor="review_notes">Admin Notes</Label>
                                        <Textarea
                                            id="review_notes"
                                            value={reviewData.admin_notes}
                                            onChange={(e) => setReviewData({ ...reviewData, admin_notes: e.target.value })}
                                            placeholder="Add notes about pricing, availability, etc."
                                            rows={2}
                                        />
                                    </div>
                                    <Button
                                        onClick={() => handleReview(selectedRequest.id)}
                                        className="mt-4"
                                    >
                                        Provide Quotation
                                    </Button>
                                </div>
                            )}

                            {/* Place Order */}
                            {selectedRequest.status === 'awaiting_payment' && (
                                <div className="border-t pt-4">
                                    <h4 className="font-medium mb-4">Place Order</h4>
                                    <div>
                                        <Label htmlFor="order_id">External Order ID</Label>
                                        <Input
                                            id="order_id"
                                            value={selectedRequest.order_id_external || ''}
                                            onChange={(e) => setSelectedRequest({ ...selectedRequest, order_id_external: e.target.value })}
                                            placeholder="Enter retailer order ID"
                                        />
                                    </div>
                                    <Button
                                        onClick={() => handlePlaceOrder(selectedRequest.id, selectedRequest.order_id_external)}
                                        className="mt-4"
                                        disabled={!selectedRequest.order_id_external}
                                    >
                                        Place Order
                                    </Button>
                                </div>
                            )}

                            {/* Mark as Arrived */}
                            {selectedRequest.status === 'order_placed' && (
                                <div className="border-t pt-4">
                                    <h4 className="font-medium mb-4">Warehouse Actions</h4>
                                    <Button
                                        onClick={() => handleMarkArrived(selectedRequest.id)}
                                        className="mr-2"
                                    >
                                        Mark as Arrived
                                    </Button>
                                </div>
                            )}

                            {/* Ready for Shipment */}
                            {selectedRequest.status === 'arrived_at_warehouse' && (
                                <div className="border-t pt-4">
                                    <h4 className="font-medium mb-4">Shipping Actions</h4>
                                    <Button
                                        onClick={() => handleReadyForShipment(selectedRequest.id)}
                                    >
                                        Mark Ready for Shipment
                                    </Button>
                                </div>
                            )}

                            <div className="flex justify-end">
                                <Button variant="outline" onClick={() => setShowViewDialog(false)}>
                                    Close
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit ShopForMe Request</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="edit_product_url">Product URL *</Label>
                                <Input
                                    id="edit_product_url"
                                    value={formData.product_url}
                                    onChange={(e) => setFormData({ ...formData, product_url: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>
                            <div>
                                <Label htmlFor="edit_platform">Platform</Label>
                                <Select value={formData.platform} onValueChange={(value) => setFormData({ ...formData, platform: value })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="amazon">Amazon</SelectItem>
                                        <SelectItem value="ebay">eBay</SelectItem>
                                        <SelectItem value="walmart">Walmart</SelectItem>
                                        <SelectItem value="target">Target</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="edit_product_name">Product Name *</Label>
                            <Input
                                id="edit_product_name"
                                value={formData.product_name}
                                onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                                placeholder="Enter product name"
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="edit_quantity">Quantity</Label>
                                <Input
                                    id="edit_quantity"
                                    type="number"
                                    min="1"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="edit_extracted_price">Extracted Price</Label>
                                <Input
                                    id="edit_extracted_price"
                                    type="number"
                                    step="0.01"
                                    value={formData.extracted_price}
                                    onChange={(e) => setFormData({ ...formData, extracted_price: e.target.value })}
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <Label htmlFor="edit_extracted_currency">Currency</Label>
                                <Select value={formData.extracted_currency} onValueChange={(value) => setFormData({ ...formData, extracted_currency: value })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="USD">USD</SelectItem>
                                        <SelectItem value="EUR">EUR</SelectItem>
                                        <SelectItem value="GBP">GBP</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                            <div>
                                <Label htmlFor="edit_unit_price">Unit Price</Label>
                                <Input
                                    id="edit_unit_price"
                                    type="number"
                                    step="0.01"
                                    value={formData.unit_price}
                                    onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <Label htmlFor="edit_estimated_tax">Tax</Label>
                                <Input
                                    id="edit_estimated_tax"
                                    type="number"
                                    step="0.01"
                                    value={formData.estimated_tax}
                                    onChange={(e) => setFormData({ ...formData, estimated_tax: e.target.value })}
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <Label htmlFor="edit_service_fee">Service Fee</Label>
                                <Input
                                    id="edit_service_fee"
                                    type="number"
                                    step="0.01"
                                    value={formData.service_fee}
                                    onChange={(e) => setFormData({ ...formData, service_fee: e.target.value })}
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <Label htmlFor="edit_shipping_fee">Shipping Fee</Label>
                                <Input
                                    id="edit_shipping_fee"
                                    type="number"
                                    step="0.01"
                                    value={formData.shipping_fee}
                                    onChange={(e) => setFormData({ ...formData, shipping_fee: e.target.value })}
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="edit_status">Status</Label>
                            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusChoices.map((status) => (
                                        <SelectItem key={status.value} value={status.value}>
                                            {status.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="edit_order_id">External Order ID</Label>
                            <Input
                                id="edit_order_id"
                                value={formData.order_id_external}
                                onChange={(e) => setFormData({ ...formData, order_id_external: e.target.value })}
                                placeholder="Retailer order ID"
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit_notes">Customer Notes</Label>
                            <Textarea
                                id="edit_notes"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Customer notes or special requests"
                                rows={2}
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit_admin_notes">Admin Notes</Label>
                            <Textarea
                                id="edit_admin_notes"
                                value={formData.admin_notes}
                                onChange={(e) => setFormData({ ...formData, admin_notes: e.target.value })}
                                placeholder="Internal admin notes"
                                rows={2}
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleUpdate}>
                                Update Request
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
