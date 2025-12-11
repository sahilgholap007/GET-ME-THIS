"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Package, Truck, MapPin, Calendar, DollarSign, Eye, Plus, Edit, Trash2, Search, Filter, RefreshCw, ExternalLink, Clock, CheckCircle, AlertCircle, XCircle, Users, TrendingUp, History, CreditCard, Settings, Archive, Bell, BarChart3, FileText, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axiosInstance';

export default function Shipment({ selectedUser }) {
    const [shipments, setShipments] = useState([]);
    const [carriers, setCarriers] = useState([]);
    const [shippingRates, setShippingRates] = useState([]);
    const [eligiblePackages, setEligiblePackages] = useState([]);
    const [consolidatedPackages, setConsolidatedPackages] = useState([]);
    const [eligibleForConsolidation, setEligibleForConsolidation] = useState([]);
    const [trackingDetails, setTrackingDetails] = useState(null);
    const [userStatistics, setUserStatistics] = useState(null);
    const [globalStatistics, setGlobalStatistics] = useState(null);
    const [consolidatedStats, setConsolidatedStats] = useState(null);
    const [shippingHistory, setShippingHistory] = useState(null);
    const [shippingCosts, setShippingCosts] = useState(null);
    const [shippingAddresses, setShippingAddresses] = useState([]);
    const [carriersUsed, setCarriersUsed] = useState([]);
    const [trackingUpdates, setTrackingUpdates] = useState([]);
    const [shipmentTimeline, setShipmentTimeline] = useState([]);
    const [statusChoices, setStatusChoices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedShipments, setSelectedShipments] = useState([]);
    const [selectedShipment, setSelectedShipment] = useState(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isTrackingDialogOpen, setIsTrackingDialogOpen] = useState(false);
    const [isBulkCreateDialogOpen, setIsBulkCreateDialogOpen] = useState(false);
    const [isConsolidateDialogOpen, setIsConsolidateDialogOpen] = useState(false);
    const [isCreateRateDialogOpen, setIsCreateRateDialogOpen] = useState(false);
    const [isCreateCarrierDialogOpen, setIsCreateCarrierDialogOpen] = useState(false);
    const [bulkShipments, setBulkShipments] = useState([{ shipping_address: '', carrier: '', outbound_tracking_number: '', shipping_cost: '', packages: '' }]);

    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
    const { register: registerBulk, handleSubmit: handleSubmitBulk, reset: resetBulk, formState: { errors: errorsBulk } } = useForm();
    const { register: registerConsolidate, handleSubmit: handleSubmitConsolidate, reset: resetConsolidate, formState: { errors: errorsConsolidate } } = useForm();
    const { register: registerRate, handleSubmit: handleSubmitRate, reset: resetRate, formState: { errors: errorsRate } } = useForm();
    const { register: registerCarrier, handleSubmit: handleSubmitCarrier, reset: resetCarrier, formState: { errors: errorsCarrier } } = useForm();

    const getStatusBadge = (status) => {
        const statusOption = statusChoices.find(option => option.value === status);
        if (statusOption) {
            return { label: statusOption.label, color: getStatusColor(status) };
        }
        return { label: status, color: 'bg-gray-100 text-gray-800' };
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING_PAYMENT':
            case 'pending_payment': return 'bg-yellow-100 text-yellow-800';
            case 'PROCESSING':
            case 'processing': return 'bg-blue-100 text-blue-800';
            case 'IN_TRANSIT':
            case 'in_transit': return 'bg-purple-100 text-purple-800';
            case 'DELIVERED':
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'EXCEPTION':
            case 'exception': return 'bg-orange-100 text-orange-800';
            case 'CANCELLED':
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'PENDING_PAYMENT':
            case 'pending_payment':
                return <DollarSign className="h-4 w-4 text-yellow-600" />;
            case 'PROCESSING':
            case 'processing':
                return <Package className="h-4 w-4 text-blue-600" />;
            case 'IN_TRANSIT':
            case 'in_transit':
                return <Truck className="h-4 w-4 text-purple-600" />;
            case 'DELIVERED':
            case 'delivered':
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case 'EXCEPTION':
            case 'exception':
                return <AlertCircle className="h-4 w-4 text-orange-600" />;
            case 'CANCELLED':
            case 'cancelled':
                return <XCircle className="h-4 w-4 text-red-600" />;
            default:
                return <Clock className="h-4 w-4 text-gray-600" />;
        }
    };

    // Load all data when user is selected
    useEffect(() => {
        if (loading) return; // Prevent multiple calls

        if (selectedUser) {
            loadAllData();
        }
        loadGlobalData();
    }, [selectedUser]);

    const loadAllData = async () => {
        if (loading) return; // Prevent multiple calls
        setLoading(true);
        await Promise.all([
            loadShipments(),
            loadEligiblePackages(),
            loadConsolidatedPackages(),
            loadEligibleForConsolidation(),
            loadUserStatistics(),
            loadShippingHistory(),
            loadShippingCosts(),
            loadShippingAddresses(),
            loadCarriersUsed(),
            loadTrackingUpdates(),
            loadShipmentTimeline()
        ]);
        setLoading(false);
    };

    const loadGlobalData = async () => {
        await Promise.all([
            loadCarriers(),
            loadShippingRates(),
            loadGlobalStatistics(),
            loadConsolidatedStats(),
            loadStatusChoices()
        ]);
    };

    // Individual load functions
    const loadShipments = async () => {
        if (!selectedUser) return;

        setLoading(true);
        try {
            const response = await axiosInstance.get(`/api/v1/shipping/admin/shipments/user/${selectedUser.id}/`);
            setShipments(response.data.shipments || []);
        } catch (error) {
            console.error('Error loading shipments:', error);
            toast.error('Failed to load shipments');
        } finally {
            setLoading(false);
        }
    };

    const loadCarriers = async () => {
        try {
            const response = await axiosInstance.get('/api/v1/shipping/admin/carriers/');
            setCarriers(response.data || []);
        } catch (error) {
            console.error('Error loading carriers:', error);
            toast.error('Failed to load carriers');
        }
    };

    const loadShippingRates = async () => {
        try {
            const response = await axiosInstance.get('/api/v1/shipping/admin/rates/');
            setShippingRates(response.data || []);
        } catch (error) {
            console.error('Error loading shipping rates:', error);
            toast.error('Failed to load shipping rates');
        }
    };

    const loadEligiblePackages = async () => {
        if (!selectedUser) return;

        try {
            const response = await axiosInstance.get(`/api/v1/shipping/admin/shipments/user/${selectedUser.id}/packages/`);
            setEligiblePackages(response.data.eligible_packages || []);
        } catch (error) {
            console.error('Error loading eligible packages:', error);
            toast.error('Failed to load eligible packages');
        }
    };

    const loadConsolidatedPackages = async () => {
        if (!selectedUser) return;

        try {
            const response = await axiosInstance.get(`/api/v1/shipping/admin/consolidated-packages/user/${selectedUser.id}/`);
            setConsolidatedPackages(response.data.consolidated_packages || []);
        } catch (error) {
            console.error('Error loading consolidated packages:', error);
            toast.error('Failed to load consolidated packages');
        }
    };

    const loadEligibleForConsolidation = async () => {
        if (!selectedUser) return;

        try {
            const response = await axiosInstance.get(`/api/v1/shipping/admin/consolidated-packages/user/${selectedUser.id}/eligible-packages/`);
            setEligibleForConsolidation(response.data.eligible_packages || []);
        } catch (error) {
            console.error('Error loading eligible packages for consolidation:', error);
            toast.error('Failed to load eligible packages for consolidation');
        }
    };

    const loadUserStatistics = async () => {
        if (!selectedUser) return;

        try {
            const response = await axiosInstance.get(`/api/v1/shipping/admin/shipments/user/${selectedUser.id}/performance/`);
            setUserStatistics(response.data);
        } catch (error) {
            console.error('Error loading user statistics:', error);
        }
    };

    const loadGlobalStatistics = async () => {
        try {
            const response = await axiosInstance.get('/api/v1/shipping/admin/shipments/stats/');
            setGlobalStatistics(response.data);
        } catch (error) {
            console.error('Error loading global statistics:', error);
        }
    };

    const loadConsolidatedStats = async () => {
        try {
            const response = await axiosInstance.get('/api/v1/shipping/admin/consolidated-packages/stats/');
            setConsolidatedStats(response.data);
        } catch (error) {
            console.error('Error loading consolidated statistics:', error);
        }
    };

    const loadShippingHistory = async () => {
        if (!selectedUser) return;

        try {
            const response = await axiosInstance.get(`/api/v1/shipping/admin/shipments/user/${selectedUser.id}/history/`);
            setShippingHistory(response.data);
        } catch (error) {
            console.error('Error loading shipping history:', error);
        }
    };

    const loadShippingCosts = async () => {
        if (!selectedUser) return;

        try {
            const response = await axiosInstance.get(`/api/v1/shipping/admin/shipments/user/${selectedUser.id}/costs/`);
            setShippingCosts(response.data);
        } catch (error) {
            console.error('Error loading shipping costs:', error);
        }
    };

    const loadShippingAddresses = async () => {
        if (!selectedUser) return;

        try {
            const response = await axiosInstance.get(`/api/v1/shipping/admin/shipments/user/${selectedUser.id}/addresses/`);
            setShippingAddresses(response.data.shipping_addresses || []);
        } catch (error) {
            console.error('Error loading shipping addresses:', error);
        }
    };

    const loadCarriersUsed = async () => {
        if (!selectedUser) return;

        try {
            const response = await axiosInstance.get(`/api/v1/shipping/admin/shipments/user/${selectedUser.id}/carriers-used/`);
            setCarriersUsed(response.data.carriers_used || []);
        } catch (error) {
            console.error('Error loading carriers used:', error);
        }
    };

    const loadTrackingUpdates = async () => {
        if (!selectedUser) return;

        try {
            const response = await axiosInstance.get(`/api/v1/shipping/admin/shipments/user/${selectedUser.id}/tracking-updates/`);
            setTrackingUpdates(response.data.tracking_updates || []);
        } catch (error) {
            console.error('Error loading tracking updates:', error);
        }
    };

    const loadShipmentTimeline = async () => {
        if (!selectedUser) return;

        try {
            const response = await axiosInstance.get(`/api/v1/shipping/admin/shipments/user/${selectedUser.id}/timeline/`);
            setShipmentTimeline(response.data.timeline || []);
        } catch (error) {
            console.error('Error loading shipment timeline:', error);
        }
    };

    const loadStatusChoices = async () => {
        try {
            const response = await axiosInstance.get('/api/v1/shipping/admin/shipments/statuses/');
            setStatusChoices(response.data || []);
        } catch (error) {
            console.error('Error loading status choices:', error);
        }
    };

    const loadTrackingDetails = async (shipmentId) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/api/v1/shipping/admin/shipments/${shipmentId}/tracking/`);
            setTrackingDetails(response.data);
            setIsTrackingDialogOpen(true);
        } catch (error) {
            console.error('Error loading tracking details:', error);
            toast.error('Failed to load tracking details');
        } finally {
            setLoading(false);
        }
    };

    // CRUD Operations
    const handleCreateShipment = async (data) => {
        try {
            const shipmentData = {
                user_id: selectedUser.id,
                shipping_address: parseInt(data.shipping_address),
                carrier: parseInt(data.carrier),
                outbound_tracking_number: data.outbound_tracking_number,
                status: data.status,
                shipping_cost: data.shipping_cost,
                insurance_cost: data.insurance_cost || '0.00',
                currency: data.currency || 'USD',
                packages: data.packages ? data.packages.split(',').map(id => parseInt(id.trim())) : []
            };

            await axiosInstance.post('/api/v1/shipping/admin/shipments/create-for-user/', shipmentData);
            toast.success('Shipment created successfully');
            setIsCreateDialogOpen(false);
            reset();
            loadShipments();
            loadEligiblePackages();
        } catch (error) {
            console.error('Error creating shipment:', error);
            toast.error('Failed to create shipment');
        }
    };

    const handleCreateBulkShipments = async (data) => {
        try {
            const shipmentsData = bulkShipments.map(shipment => ({
                shipping_address: parseInt(shipment.shipping_address),
                carrier: parseInt(shipment.carrier),
                outbound_tracking_number: shipment.outbound_tracking_number,
                shipping_cost: shipment.shipping_cost,
                packages: shipment.packages ? shipment.packages.split(',').map(id => parseInt(id.trim())) : []
            }));

            const response = await axiosInstance.post(`/api/v1/shipping/admin/shipments/user/${selectedUser.id}/create-bulk-shipments/`, {
                shipments: shipmentsData
            });

            toast.success(`Created ${response.data.created_count} shipments successfully`);
            if (response.data.error_count > 0) {
                toast.warning(`${response.data.error_count} shipments failed to create`);
            }

            setIsBulkCreateDialogOpen(false);
            setBulkShipments([{ shipping_address: '', carrier: '', outbound_tracking_number: '', shipping_cost: '', packages: '' }]);
            loadShipments();
            loadEligiblePackages();
        } catch (error) {
            console.error('Error creating bulk shipments:', error);
            toast.error('Failed to create bulk shipments');
        }
    };

    const handleCreateConsolidatedPackage = async (data) => {
        try {
            const consolidatedData = {
                user_id: selectedUser.id,
                final_weight: data.final_weight,
                final_length: data.final_length,
                final_width: data.final_width,
                final_height: data.final_height,
                packages: data.packages ? data.packages.split(',').map(id => parseInt(id.trim())) : []
            };

            await axiosInstance.post('/api/v1/shipping/admin/consolidated-packages/create-for-user/', consolidatedData);
            toast.success('Consolidated package created successfully');
            setIsConsolidateDialogOpen(false);
            resetConsolidate();
            loadConsolidatedPackages();
            loadEligibleForConsolidation();
        } catch (error) {
            console.error('Error creating consolidated package:', error);
            toast.error('Failed to create consolidated package');
        }
    };

    const handleCreateShippingRate = async (data) => {
        try {
            await axiosInstance.post('/api/v1/shipping/admin/rates/', data);
            toast.success('Shipping rate created successfully');
            setIsCreateRateDialogOpen(false);
            resetRate();
            loadShippingRates();
        } catch (error) {
            console.error('Error creating shipping rate:', error);
            toast.error('Failed to create shipping rate');
        }
    };

    const handleCreateCarrier = async (data) => {
        try {
            await axiosInstance.post('/api/v1/shipping/admin/carriers/', data);
            toast.success('Carrier created successfully');
            setIsCreateCarrierDialogOpen(false);
            resetCarrier();
            loadCarriers();
        } catch (error) {
            console.error('Error creating carrier:', error);
            toast.error('Failed to create carrier');
        }
    };

    const handleUpdateStatus = async (shipmentId, newStatus) => {
        try {
            // Use the specific status update endpoint mentioned in documentation
            await axiosInstance.put(`/api/v1/shipping/admin/shipments/${shipmentId}/status/`, {
                status: newStatus
            });
            toast.success('Shipment status updated successfully');
            loadShipments();
        } catch (error) {
            console.error('Error updating shipment status with new endpoint, trying fallback:', error);

            // Fallback to the old endpoint pattern
            try {
                await axiosInstance.patch(`/api/v1/shipping/admin/shipments/${shipmentId}/`, {
                    status: newStatus
                });
                toast.success('Shipment status updated successfully');
                loadShipments();
            } catch (fallbackError) {
                console.error('Error updating shipment status:', fallbackError);
                toast.error('Failed to update shipment status');
            }
        }
    };

    const handleBulkUpdateStatus = async (newStatus) => {
        if (selectedShipments.length === 0) {
            toast.warning('Please select shipments to update');
            return;
        }

        try {
            await axiosInstance.patch(`/api/v1/shipping/admin/shipments/user/${selectedUser.id}/bulk-update-status/`, {
                shipment_ids: selectedShipments,
                status: newStatus
            });
            toast.success(`Updated ${selectedShipments.length} shipments successfully`);
            setSelectedShipments([]);
            loadShipments();
        } catch (error) {
            console.error('Error bulk updating shipment status:', error);
            toast.error('Failed to bulk update shipment status');
        }
    };

    const handleDeleteShipment = async (shipmentId) => {
        if (!confirm('Are you sure you want to delete this shipment?')) return;

        try {
            await axiosInstance.delete(`/api/v1/shipping/admin/shipments/${shipmentId}/`);
            toast.success('Shipment deleted successfully');
            loadShipments();
        } catch (error) {
            console.error('Error deleting shipment:', error);
            toast.error('Failed to delete shipment');
        }
    };

    const handleCancelPendingShipments = async () => {
        if (!confirm('Are you sure you want to cancel all pending shipments for this user?')) return;

        try {
            const response = await axiosInstance.delete(`/api/v1/shipping/admin/shipments/user/${selectedUser.id}/cancel-pending/`);
            toast.success(response.data.message);
            loadShipments();
        } catch (error) {
            console.error('Error cancelling pending shipments:', error);
            toast.error('Failed to cancel pending shipments');
        }
    };

    const handleForceTrackingUpdate = async () => {
        if (selectedShipments.length === 0) {
            toast.warning('Please select shipments to update tracking');
            return;
        }

        try {
            const response = await axiosInstance.post(`/api/v1/shipping/admin/shipments/user/${selectedUser.id}/force-tracking-update/`, {
                shipment_ids: selectedShipments
            });
            toast.success(response.data.message);
            loadTrackingUpdates();
        } catch (error) {
            console.error('Error forcing tracking update:', error);
            toast.error('Failed to force tracking update');
        }
    };

    const handleAddTrackingUpdate = async (shipmentId, trackingData) => {
        try {
            await axiosInstance.post(`/api/v1/shipping/admin/shipments/${shipmentId}/tracking/`, trackingData);
            toast.success('Tracking update added successfully');
            loadTrackingUpdates();
        } catch (error) {
            console.error('Error adding tracking update:', error);
            toast.error('Failed to add tracking update');
        }
    };

    const addBulkShipment = () => {
        setBulkShipments([...bulkShipments, { shipping_address: '', carrier: '', outbound_tracking_number: '', shipping_cost: '', packages: '' }]);
    };

    const removeBulkShipment = (index) => {
        setBulkShipments(bulkShipments.filter((_, i) => i !== index));
    };

    const updateBulkShipment = (index, field, value) => {
        const updated = [...bulkShipments];
        updated[index][field] = value;
        setBulkShipments(updated);
    };

    const filteredShipments = shipments.filter(shipment => {
        const matchesSearch = !searchTerm ||
            shipment.outbound_tracking_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            shipment.id.toString().includes(searchTerm);
        const matchesStatus = !statusFilter || shipment.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const formatCurrency = (amount, currency = 'USD') => {
        try {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency
            }).format(amount);
        } catch (error) {
            // Fallback for unsupported currencies
            return `${currency} ${parseFloat(amount).toFixed(2)}`;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!selectedUser) {
        return (
            <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Please select a user to view shipment information.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="font-monument-regular text-xl sm:text-2xl text-gray-800 tracking-wide uppercase">
                        Shipment Management
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Managing shipments for {selectedUser.first_name} {selectedUser.last_name} ({selectedUser.email})
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Shipment
                    </Button>
                    <Button variant="outline" onClick={() => setIsBulkCreateDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Bulk Create
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="shipments" className="space-y-6">
                <TabsList className="grid w-full grid-cols-8">
                    <TabsTrigger value="shipments">Shipments</TabsTrigger>
                    <TabsTrigger value="packages">Packages</TabsTrigger>
                    <TabsTrigger value="consolidated">Consolidated</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                    <TabsTrigger value="costs">Costs</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    <TabsTrigger value="statistics">Statistics</TabsTrigger>
                    <TabsTrigger value="management">Management</TabsTrigger>
                </TabsList>

                <TabsContent value="shipments" className="space-y-4">
                    {/* Search and Filter */}
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Search by tracking number or ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full lg:w-48">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                {statusChoices.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button variant="outline" onClick={loadShipments}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh
                        </Button>
                    </div>

                    {/* Bulk Actions */}
                    {selectedShipments.length > 0 && (
                        <Card className="bg-blue-50 border-blue-200">
                            <CardContent className="p-4">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <p className="text-sm text-blue-800">
                                        {selectedShipments.length} shipment(s) selected
                                    </p>
                                    <div className="flex gap-2">
                                        <Select onValueChange={handleBulkUpdateStatus}>
                                            <SelectTrigger className="w-48">
                                                <SelectValue placeholder="Bulk update status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {statusChoices.map(option => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Button variant="outline" onClick={handleForceTrackingUpdate}>
                                            <RefreshCw className="h-4 w-4 mr-2" />
                                            Force Tracking Update
                                        </Button>
                                        <Button variant="outline" onClick={() => setSelectedShipments([])}>
                                            Clear Selection
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Shipments List */}
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                            <p className="text-gray-500 mt-2">Loading shipments...</p>
                        </div>
                    ) : filteredShipments.length > 0 ? (
                        <div className="grid gap-4">
                            {filteredShipments.map((shipment) => {
                                const statusBadge = getStatusBadge(shipment.status);
                                const isSelected = selectedShipments.includes(shipment.id);
                                return (
                                    <Card key={shipment.id} className={`hover:shadow-md transition-shadow ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
                                        <CardContent className="p-6">
                                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                                <div className="flex items-start gap-3">
                                                    <Checkbox
                                                        checked={isSelected}
                                                        onCheckedChange={(checked) => {
                                                            if (checked) {
                                                                setSelectedShipments([...selectedShipments, shipment.id]);
                                                            } else {
                                                                setSelectedShipments(selectedShipments.filter(id => id !== shipment.id));
                                                            }
                                                        }}
                                                    />
                                                    <div className="flex-1 space-y-3">
                                                        <div className="flex items-center gap-3">
                                                            {getStatusIcon(shipment.status)}
                                                            <div>
                                                                <h3 className="font-semibold text-lg">
                                                                    Shipment #{shipment.id}
                                                                </h3>
                                                                <p className="text-sm text-gray-600">
                                                                    Tracking: {shipment.outbound_tracking_number || 'Not assigned'}
                                                                </p>
                                                            </div>
                                                            <Badge className={statusBadge.color}>
                                                                {statusBadge.label}
                                                            </Badge>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                            <div className="flex items-center gap-2">
                                                                <DollarSign className="h-4 w-4 text-gray-400" />
                                                                <span>Total: {formatCurrency(shipment.total_cost, shipment.currency)}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                                <span>Created: {formatDate(shipment.created_at)}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Package className="h-4 w-4 text-gray-400" />
                                                                <span>Packages: {shipment.packages?.length || 0}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col sm:flex-row gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => loadTrackingDetails(shipment.id)}
                                                    >
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        Track
                                                    </Button>

                                                    <Select
                                                        value={shipment.status}
                                                        onValueChange={(newStatus) => handleUpdateStatus(shipment.id, newStatus)}
                                                    >
                                                        <SelectTrigger className="w-32">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {statusChoices.map(option => (
                                                                <SelectItem key={option.value} value={option.value}>
                                                                    {option.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>

                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDeleteShipment(shipment.id)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No shipments found</h3>
                            <p className="text-gray-500">
                                {searchTerm || statusFilter ? 'Try adjusting your search criteria' : 'No shipments available for this user'}
                            </p>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="packages" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Eligible Packages for Shipping</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {eligiblePackages.length > 0 ? (
                                    <div className="grid gap-4">
                                        {eligiblePackages.map((pkg) => (
                                            <div key={pkg.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                <div className="space-y-1">
                                                    <h4 className="font-medium">Package #{pkg.id}</h4>
                                                    <p className="text-sm text-gray-600">
                                                        Tracking: {pkg.inbound_tracking_number}
                                                    </p>
                                                    <div className="flex gap-4 text-xs text-gray-500">
                                                        <span>Weight: {pkg.weight}kg</span>
                                                        <span>Value: {formatCurrency(pkg.declared_value)}</span>
                                                        <span>Arrived: {formatDate(pkg.date_arrived)}</span>
                                                    </div>
                                                </div>
                                                <Badge variant="outline" className="bg-green-50 text-green-700">
                                                    {pkg.status}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500">No eligible packages for shipping</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Eligible for Consolidation</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {eligibleForConsolidation.length > 0 ? (
                                    <div className="space-y-4">
                                        <div className="grid gap-4">
                                            {eligibleForConsolidation.map((pkg) => (
                                                <div key={pkg.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                    <div className="space-y-1">
                                                        <h4 className="font-medium">Package #{pkg.id}</h4>
                                                        <p className="text-sm text-gray-600">
                                                            Tracking: {pkg.inbound_tracking_number}
                                                        </p>
                                                        <div className="flex gap-4 text-xs text-gray-500">
                                                            <span>Weight: {pkg.weight}kg</span>
                                                            <span>Dimensions: {pkg.length}×{pkg.width}×{pkg.height}cm</span>
                                                        </div>
                                                    </div>
                                                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                                        {pkg.status}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                        <Button onClick={() => setIsConsolidateDialogOpen(true)} className="w-full">
                                            <Package className="h-4 w-4 mr-2" />
                                            Create Consolidated Package
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500">No packages eligible for consolidation</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="consolidated" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Consolidated Packages</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {consolidatedPackages.length > 0 ? (
                                <div className="grid gap-4">
                                    {consolidatedPackages.map((consolidated) => (
                                        <div key={consolidated.id} className="p-4 border rounded-lg">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="font-medium">Consolidated Package #{consolidated.id}</h4>
                                                <Badge variant="outline">
                                                    {consolidated.package_count} packages
                                                </Badge>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                                <div>Weight: {consolidated.final_weight}kg</div>
                                                <div>Length: {consolidated.final_length}cm</div>
                                                <div>Width: {consolidated.final_width}cm</div>
                                                <div>Height: {consolidated.final_height}cm</div>
                                            </div>
                                            <div className="mt-2 text-xs text-gray-500">
                                                Created: {formatDate(consolidated.created_at)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">No consolidated packages found</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                    {shippingHistory ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between">
                                        <span>Total Shipments:</span>
                                        <span className="font-medium">{shippingHistory.summary.total_shipments}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Total Spent:</span>
                                        <span className="font-medium">{formatCurrency(shippingHistory.summary.total_spent)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Average Cost:</span>
                                        <span className="font-medium">{formatCurrency(shippingHistory.summary.average_cost)}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>By Status</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {Object.entries(shippingHistory.summary.by_status).map(([status, count]) => (
                                        <div key={status} className="flex justify-between">
                                            <span className="capitalize">{status.replace('_', ' ')}:</span>
                                            <span className="font-medium">{count}</span>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>By Carrier</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {Object.entries(shippingHistory.summary.by_carrier).map(([carrier, count]) => (
                                        <div key={carrier} className="flex justify-between">
                                            <span>{carrier}:</span>
                                            <span className="font-medium">{count}</span>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <History className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">Loading shipping history...</p>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="costs" className="space-y-4">
                    {shippingCosts ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Cost Breakdown</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between">
                                        <span>Total Shipping Cost:</span>
                                        <span className="font-medium">{formatCurrency(shippingCosts.cost_breakdown.total_shipping_cost)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Total Insurance Cost:</span>
                                        <span className="font-medium">{formatCurrency(shippingCosts.cost_breakdown.total_insurance_cost)}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between text-lg font-semibold">
                                        <span>Total Cost:</span>
                                        <span>{formatCurrency(shippingCosts.cost_breakdown.total_cost)}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>By Carrier</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {shippingCosts.by_carrier.map((carrier) => (
                                        <div key={carrier.carrier} className="space-y-2">
                                            <div className="flex justify-between font-medium">
                                                <span>{carrier.carrier}</span>
                                                <span>{formatCurrency(carrier.total_cost)}</span>
                                            </div>
                                            <div className="text-sm text-gray-600 flex justify-between">
                                                <span>{carrier.shipment_count} shipments</span>
                                                <span>Avg: {formatCurrency(carrier.average_cost)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">Loading shipping costs...</p>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="timeline" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Shipment Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {shipmentTimeline.length > 0 ? (
                                <div className="space-y-4">
                                    {shipmentTimeline.map((event, index) => (
                                        <div key={index} className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className="w-3 h-3 rounded-full bg-blue-600" />
                                                {index < shipmentTimeline.length - 1 && (
                                                    <div className="w-px h-8 bg-gray-200 mt-2" />
                                                )}
                                            </div>
                                            <div className="flex-1 pb-4">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-medium">{event.description}</span>
                                                    <Badge variant="outline" className="text-xs">
                                                        {event.type.replace('_', ' ')}
                                                    </Badge>
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    <div>{formatDate(event.timestamp)}</div>
                                                    {event.location && <div>Location: {event.location}</div>}
                                                    {event.tracking_number && <div>Tracking: {event.tracking_number}</div>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">No timeline events found</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="statistics" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* User Statistics */}
                        {userStatistics && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>User Performance</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold">{userStatistics.metrics.total_shipments}</div>
                                            <div className="text-sm text-gray-600">Total Shipments</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600">
                                                {userStatistics.metrics.success_rate_percentage.toFixed(1)}%
                                            </div>
                                            <div className="text-sm text-gray-600">Success Rate</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold">
                                                {formatCurrency(userStatistics.metrics.total_spent)}
                                            </div>
                                            <div className="text-sm text-gray-600">Total Spent</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold">
                                                {userStatistics.metrics.average_delivery_days} days
                                            </div>
                                            <div className="text-sm text-gray-600">Avg Delivery</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Global Statistics */}
                        {globalStatistics && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Global Statistics</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <span>Total Shipments:</span>
                                            <span className="font-medium">{globalStatistics.total_shipments}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Total Shipping Cost:</span>
                                            <span className="font-medium">{formatCurrency(globalStatistics.total_shipping_cost)}</span>
                                        </div>
                                        <Separator />
                                        <div className="space-y-2">
                                            <h4 className="font-medium">By Status:</h4>
                                            {Object.entries(globalStatistics.by_status).map(([status, count]) => (
                                                <div key={status} className="flex justify-between text-sm">
                                                    <span className="capitalize">{status.replace('_', ' ')}:</span>
                                                    <span>{count}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <Separator />
                                        <div className="space-y-2">
                                            <h4 className="font-medium">By Carrier:</h4>
                                            {Object.entries(globalStatistics.by_carrier).map(([carrier, count]) => (
                                                <div key={carrier} className="flex justify-between text-sm">
                                                    <span>{carrier}:</span>
                                                    <span>{count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Consolidated Statistics */}
                        {consolidatedStats && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Consolidated Package Stats</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <span>Total Consolidated:</span>
                                            <span className="font-medium">{consolidatedStats.total_consolidated_packages}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Packages Consolidated:</span>
                                            <span className="font-medium">{consolidatedStats.total_packages_consolidated}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Average Weight:</span>
                                            <span className="font-medium">{consolidatedStats.average_weight}kg</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Carriers Used */}
                        {carriersUsed.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Carriers Used by User</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {carriersUsed.map((carrier) => (
                                            <div key={carrier.carrier__id} className="space-y-1">
                                                <div className="flex justify-between font-medium">
                                                    <span>{carrier.carrier__name}</span>
                                                    <span>{carrier.usage_count} shipments</span>
                                                </div>
                                                <div className="text-sm text-gray-600 flex justify-between">
                                                    <span>Total: {formatCurrency(carrier.total_cost)}</span>
                                                    <span>Avg: {formatCurrency(carrier.average_cost)}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="management" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Carriers Management */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Carriers</CardTitle>
                                <Button onClick={() => setIsCreateCarrierDialogOpen(true)} size="sm">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Carrier
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {carriers.map((carrier) => (
                                        <div key={carrier.id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div>
                                                <h4 className="font-medium">{carrier.name}</h4>
                                                <p className="text-sm text-gray-600">ID: {carrier.id}</p>
                                            </div>
                                            <Badge variant={carrier.is_active ? "default" : "secondary"}>
                                                {carrier.is_active ? "Active" : "Inactive"}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Shipping Rates Management */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Shipping Rates</CardTitle>
                                <Button onClick={() => setIsCreateRateDialogOpen(true)} size="sm">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Rate
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {shippingRates.slice(0, 5).map((rate) => (
                                        <div key={rate.id} className="p-3 border rounded-lg">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-medium">Carrier #{rate.carrier}</h4>
                                                    <p className="text-sm text-gray-600">{rate.destination_country}</p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-medium">{formatCurrency(rate.rate_per_kg)}/kg</div>
                                                    <div className="text-sm text-gray-600">Base: {formatCurrency(rate.base_rate)}</div>
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-500 mt-2">
                                                Weight: {rate.weight_from_kg}kg - {rate.weight_to_kg}kg
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Shipping Addresses */}
                        <Card>
                            <CardHeader>
                                <CardTitle>User Shipping Addresses</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {shippingAddresses.length > 0 ? (
                                    <div className="space-y-3">
                                        {shippingAddresses.map((address) => (
                                            <div key={address.id} className="p-3 border rounded-lg">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="font-medium">{address.full_name}</h4>
                                                        <p className="text-sm text-gray-600">{address.address_line1}</p>
                                                        <p className="text-sm text-gray-600">{address.city}, {address.country}</p>
                                                    </div>
                                                    {address.is_default && (
                                                        <Badge variant="outline">Default</Badge>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <MapPin className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                                        <p className="text-gray-500">No shipping addresses found</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={handleCancelPendingShipments}
                                >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Cancel All Pending Shipments
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => loadAllData()}
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Refresh All Data
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => window.open(`/api/v1/shipping/admin/analytics/`, '_blank')}
                                >
                                    <BarChart3 className="h-4 w-4 mr-2" />
                                    View Analytics
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => window.open(`/api/v1/shipping/admin/shipments/user/${selectedUser.id}/export`, '_blank')}
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Export User Shipments
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Create Shipment Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Create New Shipment</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(handleCreateShipment)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="carrier">Carrier</Label>
                                <Select onValueChange={(value) => setValue('carrier', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select carrier" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {carriers.map(carrier => (
                                            <SelectItem key={carrier.id} value={carrier.id.toString()}>
                                                {carrier.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.carrier && <p className="text-sm text-red-600">Carrier is required</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select onValueChange={(value) => setValue('status', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statusChoices.map(option => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.status && <p className="text-sm text-red-600">Status is required</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="outbound_tracking_number">Tracking Number</Label>
                            <Input
                                id="outbound_tracking_number"
                                {...register('outbound_tracking_number', { required: 'Tracking number is required' })}
                                placeholder="Enter tracking number"
                            />
                            {errors.outbound_tracking_number && (
                                <p className="text-sm text-red-600">{errors.outbound_tracking_number.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="shipping_cost">Shipping Cost</Label>
                                <Input
                                    id="shipping_cost"
                                    type="number"
                                    step="0.01"
                                    {...register('shipping_cost', { required: 'Shipping cost is required' })}
                                    placeholder="0.00"
                                />
                                {errors.shipping_cost && (
                                    <p className="text-sm text-red-600">{errors.shipping_cost.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="insurance_cost">Insurance Cost</Label>
                                <Input
                                    id="insurance_cost"
                                    type="number"
                                    step="0.01"
                                    {...register('insurance_cost')}
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="currency">Currency</Label>
                                <Select onValueChange={(value) => setValue('currency', value)} defaultValue="USD">
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

                        <div className="space-y-2">
                            <Label htmlFor="packages">Package IDs (comma-separated)</Label>
                            <Input
                                id="packages"
                                {...register('packages')}
                                placeholder="e.g., 51, 52, 53"
                            />
                            <p className="text-xs text-gray-500">
                                Enter package IDs separated by commas. Available packages: {eligiblePackages.map(p => p.id).join(', ')}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="shipping_address">Shipping Address ID</Label>
                            <Select onValueChange={(value) => setValue('shipping_address', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select shipping address" />
                                </SelectTrigger>
                                <SelectContent>
                                    {shippingAddresses.map(address => (
                                        <SelectItem key={address.id} value={address.id.toString()}>
                                            {address.full_name} - {address.city}, {address.country}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.shipping_address && (
                                <p className="text-sm text-red-600">{errors.shipping_address.message}</p>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Create Shipment</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Bulk Create Shipments Dialog */}
            <Dialog open={isBulkCreateDialogOpen} onOpenChange={setIsBulkCreateDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Create Bulk Shipments</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        {bulkShipments.map((shipment, index) => (
                            <Card key={index} className="p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-medium">Shipment #{index + 1}</h4>
                                    {bulkShipments.length > 1 && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => removeBulkShipment(index)}
                                            className="text-red-600"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Carrier</Label>
                                        <Select onValueChange={(value) => updateBulkShipment(index, 'carrier', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select carrier" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {carriers.map(carrier => (
                                                    <SelectItem key={carrier.id} value={carrier.id.toString()}>
                                                        {carrier.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Shipping Address</Label>
                                        <Select onValueChange={(value) => updateBulkShipment(index, 'shipping_address', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select address" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {shippingAddresses.map(address => (
                                                    <SelectItem key={address.id} value={address.id.toString()}>
                                                        {address.full_name} - {address.city}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Tracking Number</Label>
                                        <Input
                                            placeholder="Enter tracking number"
                                            value={shipment.outbound_tracking_number}
                                            onChange={(e) => updateBulkShipment(index, 'outbound_tracking_number', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Shipping Cost</Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={shipment.shipping_cost}
                                            onChange={(e) => updateBulkShipment(index, 'shipping_cost', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label>Package IDs (comma-separated)</Label>
                                        <Input
                                            placeholder="e.g., 51, 52, 53"
                                            value={shipment.packages}
                                            onChange={(e) => updateBulkShipment(index, 'packages', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </Card>
                        ))}

                        <div className="flex justify-between">
                            <Button type="button" variant="outline" onClick={addBulkShipment}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Another Shipment
                            </Button>
                            <div className="flex gap-2">
                                <Button type="button" variant="outline" onClick={() => setIsBulkCreateDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleCreateBulkShipments}>
                                    Create {bulkShipments.length} Shipments
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Create Consolidated Package Dialog */}
            <Dialog open={isConsolidateDialogOpen} onOpenChange={setIsConsolidateDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Create Consolidated Package</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmitConsolidate(handleCreateConsolidatedPackage)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="final_weight">Final Weight (kg)</Label>
                                <Input
                                    id="final_weight"
                                    type="number"
                                    step="0.01"
                                    {...registerConsolidate('final_weight', { required: 'Weight is required' })}
                                    placeholder="0.00"
                                />
                                {errorsConsolidate.final_weight && (
                                    <p className="text-sm text-red-600">{errorsConsolidate.final_weight.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="final_length">Length (cm)</Label>
                                <Input
                                    id="final_length"
                                    type="number"
                                    step="0.01"
                                    {...registerConsolidate('final_length', { required: 'Length is required' })}
                                    placeholder="0.00"
                                />
                                {errorsConsolidate.final_length && (
                                    <p className="text-sm text-red-600">{errorsConsolidate.final_length.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="final_width">Width (cm)</Label>
                                <Input
                                    id="final_width"
                                    type="number"
                                    step="0.01"
                                    {...registerConsolidate('final_width', { required: 'Width is required' })}
                                    placeholder="0.00"
                                />
                                {errorsConsolidate.final_width && (
                                    <p className="text-sm text-red-600">{errorsConsolidate.final_width.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="final_height">Height (cm)</Label>
                                <Input
                                    id="final_height"
                                    type="number"
                                    step="0.01"
                                    {...registerConsolidate('final_height', { required: 'Height is required' })}
                                    placeholder="0.00"
                                />
                                {errorsConsolidate.final_height && (
                                    <p className="text-sm text-red-600">{errorsConsolidate.final_height.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="packages">Package IDs (comma-separated)</Label>
                            <Input
                                id="packages"
                                {...registerConsolidate('packages', { required: 'At least one package is required' })}
                                placeholder="e.g., 51, 52, 53"
                            />
                            <p className="text-xs text-gray-500">
                                Available packages: {eligibleForConsolidation.map(p => p.id).join(', ')}
                            </p>
                            {errorsConsolidate.packages && (
                                <p className="text-sm text-red-600">{errorsConsolidate.packages.message}</p>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsConsolidateDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Create Consolidated Package</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Create Shipping Rate Dialog */}
            <Dialog open={isCreateRateDialogOpen} onOpenChange={setIsCreateRateDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Create Shipping Rate</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmitRate(handleCreateShippingRate)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="carrier">Carrier</Label>
                                <Select onValueChange={(value) => setValue('carrier', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select carrier" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {carriers.map(carrier => (
                                            <SelectItem key={carrier.id} value={carrier.id.toString()}>
                                                {carrier.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="destination_country">Destination Country</Label>
                                <Input
                                    id="destination_country"
                                    {...registerRate('destination_country', { required: 'Destination country is required' })}
                                    placeholder="e.g., USA, Canada, UK"
                                />
                                {errorsRate.destination_country && (
                                    <p className="text-sm text-red-600">{errorsRate.destination_country.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="weight_from_kg">Weight From (kg)</Label>
                                <Input
                                    id="weight_from_kg"
                                    type="number"
                                    step="0.01"
                                    {...registerRate('weight_from_kg', { required: 'Weight from is required' })}
                                    placeholder="0.00"
                                />
                                {errorsRate.weight_from_kg && (
                                    <p className="text-sm text-red-600">{errorsRate.weight_from_kg.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="weight_to_kg">Weight To (kg)</Label>
                                <Input
                                    id="weight_to_kg"
                                    type="number"
                                    step="0.01"
                                    {...registerRate('weight_to_kg', { required: 'Weight to is required' })}
                                    placeholder="0.00"
                                />
                                {errorsRate.weight_to_kg && (
                                    <p className="text-sm text-red-600">{errorsRate.weight_to_kg.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="rate_per_kg">Rate per KG</Label>
                                <Input
                                    id="rate_per_kg"
                                    type="number"
                                    step="0.01"
                                    {...registerRate('rate_per_kg', { required: 'Rate per kg is required' })}
                                    placeholder="0.00"
                                />
                                {errorsRate.rate_per_kg && (
                                    <p className="text-sm text-red-600">{errorsRate.rate_per_kg.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="base_rate">Base Rate</Label>
                                <Input
                                    id="base_rate"
                                    type="number"
                                    step="0.01"
                                    {...registerRate('base_rate', { required: 'Base rate is required' })}
                                    placeholder="0.00"
                                />
                                {errorsRate.base_rate && (
                                    <p className="text-sm text-red-600">{errorsRate.base_rate.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="currency">Currency</Label>
                                <Select onValueChange={(value) => setValue('currency', value)} defaultValue="USD">
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

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsCreateRateDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Create Rate</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Create Carrier Dialog */}
            <Dialog open={isCreateCarrierDialogOpen} onOpenChange={setIsCreateCarrierDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Create New Carrier</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmitCarrier(handleCreateCarrier)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Carrier Name</Label>
                            <Input
                                id="name"
                                {...registerCarrier('name', { required: 'Carrier name is required' })}
                                placeholder="e.g., DHL Express, FedEx, UPS"
                            />
                            {errorsCarrier.name && (
                                <p className="text-sm text-red-600">{errorsCarrier.name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tracking_url_template">Tracking URL Template</Label>
                            <Input
                                id="tracking_url_template"
                                {...registerCarrier('tracking_url_template', { required: 'Tracking URL template is required' })}
                                placeholder="https://example.com/track?number={tracking_number}"
                            />
                            <p className="text-xs text-gray-500">
                                Use {'{tracking_number}'} as placeholder for the tracking number
                            </p>
                            {errorsCarrier.tracking_url_template && (
                                <p className="text-sm text-red-600">{errorsCarrier.tracking_url_template.message}</p>
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="is_active"
                                {...registerCarrier('is_active')}
                                defaultChecked={true}
                            />
                            <Label htmlFor="is_active">Active</Label>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsCreateCarrierDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Create Carrier</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Tracking Details Dialog */}
            <Dialog open={isTrackingDialogOpen} onOpenChange={setIsTrackingDialogOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Tracking Details</DialogTitle>
                    </DialogHeader>
                    {trackingDetails && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg">Shipment Info</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Tracking Number:</span>
                                            <span className="font-medium">{trackingDetails.tracking_number}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Carrier:</span>
                                            <span className="font-medium">{trackingDetails.carrier}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Status:</span>
                                            <Badge className={getStatusBadge(trackingDetails.status).color}>
                                                {getStatusBadge(trackingDetails.status).label}
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Total Cost:</span>
                                            <span className="font-medium">
                                                {formatCurrency(trackingDetails.shipment.total_cost)}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg">Current Status</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(trackingDetails.current_tracking_status.status)}
                                            <span className="font-medium">
                                                {trackingDetails.current_tracking_status.description}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <div>Location: {trackingDetails.current_tracking_status.location}</div>
                                            <div>Time: {formatDate(trackingDetails.current_tracking_status.timestamp)}</div>
                                        </div>
                                        {trackingDetails.tracking_url && (
                                            <Button variant="outline" size="sm" asChild>
                                                <a href={trackingDetails.tracking_url} target="_blank" rel="noopener noreferrer">
                                                    <ExternalLink className="h-4 w-4 mr-2" />
                                                    Track on Carrier Site
                                                </a>
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Tracking History</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {trackingDetails.tracking_history.map((update, index) => (
                                            <div key={update.id} className="flex gap-4">
                                                <div className="flex flex-col items-center">
                                                    <div className={`w-3 h-3 rounded-full ${update.is_current ? 'bg-blue-600' : 'bg-gray-300'
                                                        }`} />
                                                    {index < trackingDetails.tracking_history.length - 1 && (
                                                        <div className="w-px h-8 bg-gray-200 mt-2" />
                                                    )}
                                                </div>
                                                <div className="flex-1 pb-4">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        {getStatusIcon(update.status)}
                                                        <span className="font-medium">{update.description}</span>
                                                        {update.is_current && (
                                                            <Badge variant="outline" className="text-xs">Current</Badge>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        <div>{update.location}</div>
                                                        <div>{formatDate(update.timestamp)}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
