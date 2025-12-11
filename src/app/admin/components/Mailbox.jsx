"use client";

import { useState, useEffect } from 'react';
import { Mail, Package, Eye, MapPin, Calendar, Weight, Ruler, DollarSign, User, Building, Loader2, AlertCircle, ImageIcon, ArrowLeft, ExternalLink, Edit, Upload, Save, X, CheckCircle, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import axiosInstance from '../../utils/axiosInstance';

export default function Mailbox({ selectedUser }) {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [showPackageDetail, setShowPackageDetail] = useState(false);
    const [imageErrors, setImageErrors] = useState({});
    const [packageStatuses, setPackageStatuses] = useState([]);
    const [editingPackage, setEditingPackage] = useState(null);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(null);
    const [serviceRequestStatuses, setServiceRequestStatuses] = useState([]);
    const [updatingServiceRequest, setUpdatingServiceRequest] = useState(null);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [creatingPackage, setCreatingPackage] = useState(false);
    const [createPackageData, setCreatePackageData] = useState({
        user_suite: '',
        full_name: '',
        weight: '',
        status: 'in_warehouse',
        inbound_tracking_number: '',
        sender_name: '',
        declared_value: '',
        length: '',
        width: '',
        height: '',
        location: '',
        warehouse: 1,
        selectedImage: null
    });

    // Fetch packages for selected user
    const fetchPackages = async (userId) => {
        if (!userId) return;

        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.get(`/api/v1/warehouse/admin/packages/?user=${userId}`);
            const packageData = response.data;

            // Handle both array and paginated response
            const packageList = Array.isArray(packageData) ? packageData : packageData.results || [];
            setPackages(packageList);

        } catch (error) {
            console.error('Error fetching packages:', error);
            if (error.response?.status === 404) {
                setPackages([]);
                setError('No packages found for this user.');
            } else {
                setError('Failed to load packages. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Fetch package statuses
    const fetchPackageStatuses = async () => {
        try {
            const response = await axiosInstance.get('/api/v1/warehouse/admin/packages/statuses/');
            setPackageStatuses(response.data || []);
        } catch (error) {
            console.error('Error fetching package statuses:', error);
            // Fallback statuses if API fails
            setPackageStatuses([
                { value: 'in_warehouse', label: 'In Warehouse' },
                { value: 'consolidating', label: 'Consolidating' },
                { value: 'ready_to_ship', label: 'Ready to Ship' },
                { value: 'awaiting_shipment', label: 'Awaiting Shipment' },
                { value: 'shipped', label: 'Shipped' },
                { value: 'returned', label: 'Returned' },
                { value: 'disposed', label: 'Disposed' }
            ]);
        }
    };

    // Update package status and details
    const updatePackage = async (packageId, updateData) => {
        setUpdating(true);
        try {
            const response = await axiosInstance.patch(`/api/v1/warehouse/admin/packages/${packageId}/`, updateData);
            
            // Update the package in both packages list and selectedPackage
            setPackages(prev => prev.map(pkg => pkg.id === packageId ? response.data : pkg));
            if (selectedPackage && selectedPackage.id === packageId) {
                setSelectedPackage(response.data);
            }
            
            setUpdateSuccess('Package updated successfully!');
            setTimeout(() => setUpdateSuccess(null), 3000);
            setShowEditDialog(false);
            setEditingPackage(null);
            
        } catch (error) {
            console.error('Error updating package:', error);
            setError('Failed to update package. Please try again.');
        } finally {
            setUpdating(false);
        }
    };

    // Upload image to package using multipart/form-data
    const uploadImageToPackage = async (packageId, imageFile) => {
        setUploadingImage(true);
        setError(null);
        
        try {
            // Create FormData for multipart/form-data request
            const formData = new FormData();
            formData.append('image', imageFile);
            
            // Make PATCH request with multipart/form-data
            const response = await axiosInstance.patch(
                `/api/v1/warehouse/admin/packages/${packageId}/`, 
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            
            // Update the package in both packages list and selectedPackage
            setPackages(prev => prev.map(pkg => pkg.id === packageId ? response.data : pkg));
            if (selectedPackage && selectedPackage.id === packageId) {
                setSelectedPackage(response.data);
            }
            
            setUpdateSuccess('Image uploaded successfully!');
            setTimeout(() => setUpdateSuccess(null), 3000);
            
        } catch (error) {
            console.error('Error uploading image:', error);
            if (error.response?.status === 400) {
                setError('Invalid image file. Please check the file format and size.');
            } else if (error.response?.status === 413) {
                setError('Image file is too large. Please select a smaller file.');
            } else {
                setError('Failed to upload image. Please try again.');
            }
        } finally {
            setUploadingImage(false);
        }
    };

    // Handle file input change with validation
    const handleImageUpload = (event, packageId) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setError('Please select a valid image file (JPEG, PNG, GIF, or WebP).');
            event.target.value = '';
            return;
        }
        
        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (file.size > maxSize) {
            setError('Image file size must be less than 10MB.');
            event.target.value = '';
            return;
        }
        
        // Upload the image
        uploadImageToPackage(packageId, file);
        
        // Reset the input
        event.target.value = '';
    };

    // Update package with both data and image
    const updatePackageWithImage = async (packageId, updateData, imageFile = null) => {
        setUpdating(true);
        setError(null);
        
        try {
            const formData = new FormData();
            
            // Add all update data to FormData
            Object.keys(updateData).forEach(key => {
                if (updateData[key] !== null && updateData[key] !== undefined && updateData[key] !== '') {
                    formData.append(key, updateData[key]);
                }
            });
            
            // Add image if provided
            if (imageFile) {
                formData.append('image', imageFile);
            }
            
            const response = await axiosInstance.patch(
                `/api/v1/warehouse/admin/packages/${packageId}/`, 
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            
            // Update the package in both packages list and selectedPackage
            setPackages(prev => prev.map(pkg => pkg.id === packageId ? response.data : pkg));
            if (selectedPackage && selectedPackage.id === packageId) {
                setSelectedPackage(response.data);
            }
            
            const message = imageFile ? 'Package and image updated successfully!' : 'Package updated successfully!';
            setUpdateSuccess(message);
            setTimeout(() => setUpdateSuccess(null), 3000);
            setShowEditDialog(false);
            setEditingPackage(null);
            
        } catch (error) {
            console.error('Error updating package:', error);
            if (error.response?.status === 400) {
                setError('Invalid data provided. Please check all fields.');
            } else {
                setError('Failed to update package. Please try again.');
            }
        } finally {
            setUpdating(false);
        }
    };
  console.log(selectedPackage)
    // Create new package
    const createPackage = async (packageData, imageFile = null) => {
        setCreatingPackage(true);
        setError(null);
        
        try {
            const formData = new FormData();
            
            // Add all package data to FormData
            Object.keys(packageData).forEach(key => {
                if (packageData[key] !== null && packageData[key] !== undefined && packageData[key] !== '' && key !== 'selectedImage') {
                    formData.append(key, packageData[key]);
                }
            });
            
            // Add image if provided
            if (imageFile) {
                formData.append('image', imageFile);
            }
            
            const response = await axiosInstance.post(
                '/api/v1/warehouse/admin/packages/', 
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            
            // Add the new package to the packages list
            setPackages(prev => [response.data, ...prev]);
            
            setUpdateSuccess('Package created successfully!');
            setTimeout(() => setUpdateSuccess(null), 3000);
            setShowCreateDialog(false);
            resetCreateForm();
            
        } catch (error) {
            console.error('Error creating package:', error);
            if (error.response?.status === 400) {
                setError('Invalid data provided. Please check all fields.');
            } else {
                setError('Failed to create package. Please try again.');
            }
        } finally {
            setCreatingPackage(false);
        }
    };

    // Reset create form
    const resetCreateForm = () => {
        setCreatePackageData({
            user_suite: selectedUser?.suite_number || '',
            full_name: selectedUser ? `${selectedUser.first_name || ''} ${selectedUser.last_name || ''}`.trim() : '',
            weight: '',
            status: 'in_warehouse',
            inbound_tracking_number: '',
            sender_name: '',
            declared_value: '',
            length: '',
            width: '',
            height: '',
            location: '',
            warehouse: 1,
            selectedImage: null
        });
    };

    // Handle create form submit
    const handleCreateSubmit = (e) => {
        e.preventDefault();
        const { selectedImage, ...packageData } = createPackageData;
        createPackage(packageData, selectedImage);
    };

    // Handle create form change
    const handleCreateChange = (field, value) => {
        setCreatePackageData(prev => ({ ...prev, [field]: value }));
    };

    // Handle image selection in create dialog
    const handleCreateImageSelect = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setError('Please select a valid image file (JPEG, PNG, GIF, or WebP).');
            event.target.value = '';
            return;
        }
        
        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (file.size > maxSize) {
            setError('Image file size must be less than 10MB.');
            event.target.value = '';
            return;
        }

        setCreatePackageData(prev => ({ ...prev, selectedImage: file }));
        setError(null);
    };

    // Open create dialog
    const openCreateDialog = () => {
        resetCreateForm();
        setError(null);
        setShowCreateDialog(true);
    };

    // Open edit dialog - Fixed to work in both views
    const openEditDialog = (pkg) => {
        console.log('Opening edit dialog for package:', pkg.id);
        setError(null); // Clear any existing errors
        setEditingPackage({
            id: pkg.id,
            status: pkg.status,
            location: pkg.location || '',
            sender_name: pkg.sender_name || '',
            inbound_tracking_number: pkg.inbound_tracking_number || '',
            weight: pkg.weight || '',
            length: pkg.length || '',
            width: pkg.width || '',
            height: pkg.height || '',
            declared_value: pkg.declared_value || '',
            selectedImage: null // For new image upload
        });
        setShowEditDialog(true);
    };

    // Handle edit form submit
    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (editingPackage) {
            const { id, selectedImage, ...updateData } = editingPackage;
            
            // Remove empty values
            const cleanedData = Object.fromEntries(
                Object.entries(updateData).filter(([_, value]) => value !== '' && value !== null)
            );
            
            updatePackageWithImage(id, cleanedData, selectedImage);
        }
    };

    // Handle edit form change
    const handleEditChange = (field, value) => {
        setEditingPackage(prev => ({ ...prev, [field]: value }));
    };

    // Handle image selection in edit dialog
    const handleEditImageSelect = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setError('Please select a valid image file (JPEG, PNG, GIF, or WebP).');
            event.target.value = '';
            return;
        }
        
        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (file.size > maxSize) {
            setError('Image file size must be less than 10MB.');
            event.target.value = '';
            return;
        }

        setEditingPackage(prev => ({ ...prev, selectedImage: file }));
        setError(null);
    };

    // Fetch service request statuses
    const fetchServiceRequestStatuses = async () => {
        try {
            const response = await axiosInstance.get('/api/v1/warehouse/admin/service-requests/statuses/');
            setServiceRequestStatuses(response.data || []);
        } catch (error) {
            console.error('Error fetching service request statuses:', error);
            // Fallback statuses if API fails
            setServiceRequestStatuses([
                { value: 'pending', label: 'Pending' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' },
                { value: 'cancelled', label: 'Cancelled' }
            ]);
        }
    };

    // Update service request status
    const updateServiceRequestStatus = async (serviceRequestId, newStatus) => {
        setUpdatingServiceRequest(serviceRequestId);
        setError(null);
        
        try {
            const response = await axiosInstance.patch(
                `/api/v1/warehouse/admin/service-requests/${serviceRequestId}/`,
                { status: newStatus }
            );
            
            // Update the service request in the selected package
            if (selectedPackage && selectedPackage.service_requests) {
                const updatedServiceRequests = selectedPackage.service_requests.map(request => 
                    request.id === serviceRequestId ? { ...request, status: newStatus } : request
                );
            
                const updatedPackage = {
                    ...selectedPackage,
                    service_requests: updatedServiceRequests
                };
            
                setSelectedPackage(updatedPackage);
            
                // Also update in packages list
                setPackages(prev => prev.map(pkg => 
                    pkg.id === selectedPackage.id ? updatedPackage : pkg
                ));
            }
        
            setUpdateSuccess('Service request status updated successfully!');
            setTimeout(() => setUpdateSuccess(null), 3000);
        
        } catch (error) {
            console.error('Error updating service request status:', error);
            setError('Failed to update service request status. Please try again.');
        } finally {
            setUpdatingServiceRequest(null);
        }
    };

    // Get service request status color
    const getServiceRequestStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'in_progress':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Fetch packages when selectedUser changes
    useEffect(() => {
        if (selectedUser?.id) {
            fetchPackages(selectedUser.id);
        } else {
            setPackages([]);
            setError(null);
            setShowPackageDetail(false);
            setSelectedPackage(null);
        }
    }, [selectedUser]);

    useEffect(() => {
        fetchPackageStatuses();
        fetchServiceRequestStatuses();
    }, []);

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch (error) {
            console.error("Error formatting date:", error);
            return 'N/A';
        }
    };

    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'in_warehouse':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'consolidating':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'ready_to_ship':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'awaiting_shipment':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'shipped':
                return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'returned':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'disposed':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Get status display text
    const getStatusText = (status) => {
        return status.replace('_', ' ').toUpperCase();
    };

    // Open package detail view
    const openPackageDetail = (pkg) => {
        setSelectedPackage(pkg);
        setShowPackageDetail(true);
    };

    // Go back to package list - Fixed to clear edit dialog state
    const goBackToList = () => {
        setShowPackageDetail(false);
        setSelectedPackage(null);
        // Clear edit dialog state when going back
        setShowEditDialog(false);
        setEditingPackage(null);
        setError(null);
    };

    // Handle image error
    const handleImageError = (imageId) => {
        setImageErrors(prev => ({ ...prev, [imageId]: true }));
    };

    // Handle image click - open in new tab with proper URL construction
    const handleImageClick = (imageUrl) => {
        // Construct full URL if it's a relative path
        const fullUrl = imageUrl.startsWith('http') 
            ? imageUrl 
            : `${axiosInstance.defaults.baseURL}${imageUrl}`;
        window.open(fullUrl, '_blank');
    };

    // Loading skeleton
    const LoadingSkeleton = () => (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                    <CardContent className="p-4 sm:p-6">
                        <div className="space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                            <div className="h-3 bg-gray-200 rounded w-full"></div>
                            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                            <div className="flex space-x-2">
                                <div className="h-6 bg-gray-200 rounded w-16"></div>
                                <div className="h-6 bg-gray-200 rounded w-20"></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );

    if (!selectedUser) {
        return (
            <div className="text-center py-8 sm:py-12">
                <div className="bg-gray-100 p-4 sm:p-6 rounded-full w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                    <Mail className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
                </div>
                <h3 className="font-monument-regular text-lg sm:text-xl text-gray-800 mb-3 sm:mb-4 tracking-wide uppercase">
                    Mailbox
                </h3>
                <p className="text-gray-600 max-w-md mx-auto text-sm sm:text-base px-4">
                    Select a user from the list to view their mailbox and packages.
                </p>
            </div>
        );
    }

    // Package Detail View
    if (showPackageDetail && selectedPackage) {
        return (
            <div className="space-y-6">
                {/* Back Button */}
                <div className="flex items-center space-x-4">
                    <Button variant="outline" size="sm" onClick={goBackToList} className="text-xs">
                        <ArrowLeft className="h-3 w-3 mr-1" />
                        Back to Mailbox
                    </Button>
                    <div>
                        <h2 className="font-monument-regular text-xl sm:text-2xl text-gray-800 tracking-wide uppercase">
                            Package Details - #{selectedPackage.id}
                        </h2>
                        <p className="text-gray-600 text-sm">
                            {selectedPackage.package_full_name || selectedPackage.full_name}
                        </p>
                    </div>
                </div>

                {/* Package Header Card */}
                <Card className="bg-gray-50 border-gray-200">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                                <h3 className="font-monument-regular text-lg text-gray-800 tracking-wide uppercase mb-2">
                                    {selectedPackage.package_full_name || selectedPackage.full_name}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Tracking: {selectedPackage.inbound_tracking_number || 'N/A'}
                                </p>
                            </div>
                            <Badge className={`text-sm ${getStatusColor(selectedPackage.status)}`}>
                                {getStatusText(selectedPackage.status)}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Package Actions */}
                <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditDialog(selectedPackage)}
                                className="text-xs"
                            >
                                <Edit className="h-3 w-3 mr-1" />
                                Edit Package
                            </Button>
                            
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                    onChange={(e) => handleImageUpload(e, selectedPackage.id)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    disabled={uploadingImage}
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={uploadingImage}
                                    className="text-xs w-full"
                                >
                                    {uploadingImage ? (
                                        <>
                                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-3 w-3 mr-1" />
                                            Upload Image
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Success Message */}
                {updateSuccess && (
                    <Alert className="border-green-200 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                            {updateSuccess}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Error Message */}
                {error && (
                    <Alert className="border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                            {error}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* User Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-monument-regular text-sm tracking-wide uppercase">
                                User Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <User className="h-4 w-4 text-gray-400" />
                                <span className="text-sm">
                                    {selectedPackage.user.first_name} {selectedPackage.user.last_name}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-gray-400" />
                                <span className="text-sm">{selectedPackage.user.email}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Building className="h-4 w-4 text-gray-400" />
                                <span className="text-sm">Suite: {selectedPackage.user.suite_number}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Package Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-monument-regular text-sm tracking-wide uppercase">
                                Package Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {selectedPackage.sender_name && (
                                <div className="flex items-center space-x-2">
                                    <User className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm">From: {selectedPackage.sender_name}</span>
                                </div>
                            )}
                            {selectedPackage.weight && (
                                <div className="flex items-center space-x-2">
                                    <Weight className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm">Weight: {selectedPackage.weight} lbs</span>
                                </div>
                            )}
                            {(selectedPackage.length || selectedPackage.width || selectedPackage.height) && (
                                <div className="flex items-center space-x-2">
                                    <Ruler className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm">
                                        Dimensions: {selectedPackage.length}" × {selectedPackage.width}" × {selectedPackage.height}"
                                    </span>
                                </div>
                            )}
                            {selectedPackage.declared_value && (
                                <div className="flex items-center space-x-2">
                                    <DollarSign className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm">Value: ${selectedPackage.declared_value}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Warehouse Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-monument-regular text-sm tracking-wide uppercase">
                                Warehouse Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {selectedPackage.warehouse && (
                                <>
                                    <div className="flex items-center space-x-2">
                                        <Building className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm">{selectedPackage.warehouse.name}</span>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                                        <span className="text-sm">
                                            {selectedPackage.warehouse.address_line1}, {selectedPackage.warehouse.city}, {selectedPackage.warehouse.state}, {selectedPackage.warehouse.country}
                                        </span>
                                    </div>
                                </>
                            )}
                            {selectedPackage.location && (
                                <div className="flex items-center space-x-2">
                                    <MapPin className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm">Location: {selectedPackage.location}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Timeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-monument-regular text-sm tracking-wide uppercase">
                                Package Timeline
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-blue-400" />
                                <span className="text-sm">Arrived: {formatDate(selectedPackage.date_arrived)}</span>
                            </div>
                            {selectedPackage.date_processed ? (
                                <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4 text-yellow-400" />
                                    <span className="text-sm">Processed: {formatDate(selectedPackage.date_processed)}</span>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4 text-gray-300" />
                                    <span className="text-sm text-gray-400">Not processed yet</span>
                                </div>
                            )}
                            {selectedPackage.date_shipped ? (
                                <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4 text-green-400" />
                                    <span className="text-sm">Shipped: {formatDate(selectedPackage.date_shipped)}</span>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4 text-gray-300" />
                                    <span className="text-sm text-gray-400">Not shipped yet</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Package Images */}
                {selectedPackage.images && selectedPackage.images.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-monument-regular text-sm tracking-wide uppercase">
                                Package Images ({selectedPackage.images.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {selectedPackage.images.map((image, index) => (
                                    <div key={image.id} className="relative group">
                                        <div className="w-full h-32 bg-gray-100 rounded border flex items-center justify-center overflow-hidden">
                                            {imageErrors[image.id] ? (
                                                <div className="flex flex-col items-center justify-center text-gray-400 text-xs h-full p-2">
                                                    <ImageIcon className="h-6 w-6 mb-1" />
                                                    <span className="mb-2">Cannot Display</span>
                                                    <button 
                                                        className="text-blue-500 underline text-xs hover:text-blue-700"
                                                        onClick={() => handleImageClick(image.image)}
                                                    >
                                                        View in New Tab
                                                    </button>
                                                </div>
                                            ) : (
                                                <img
                                                    src={image.image.startsWith('http') ? image.image : `${axiosInstance.defaults.baseURL}${image.image}`}
                                                    alt={`Package ${selectedPackage.id} - Image ${index + 1}`}
                                                    className="w-full h-full object-cover cursor-pointer hover:opacity-75 transition-opacity"
                                                    onClick={() => handleImageClick(image.image)}
                                                    onError={() => handleImageError(image.id)}
                                                    onLoad={() => {
                                                        console.log('Image loaded successfully:', image.image);
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1 text-center">
                                            {formatDate(image.uploaded_at)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Service Requests */}
                {selectedPackage.service_requests && selectedPackage.service_requests.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-monument-regular text-sm tracking-wide uppercase">
                                Service Requests ({selectedPackage.service_requests.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {selectedPackage.service_requests.map((request, index) => (
                                    <div key={request.id || index} className="p-4 bg-gray-50 rounded border">
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                                            <div className="flex items-center space-x-2">
                                                <h5 className="font-monument-regular text-sm text-gray-800 tracking-wide uppercase">
                                                    Service Request #{request.id || index + 1}
                                                </h5>
                                                <Badge className={`text-xs ${getServiceRequestStatusColor(request.status)}`}>
                                                    {request.status ? request.status.replace('_', ' ').toUpperCase() : 'UNKNOWN'}
                                                </Badge>
                                            </div>
                                            
                                            {/* Status Update Dropdown */}
                                            <div className="flex items-center space-x-2">
                                                <Label className="text-xs text-gray-600">Update Status:</Label>
                                                <Select 
                                                    value={request.status || 'pending'} 
                                                    onValueChange={(newStatus) => updateServiceRequestStatus(request.id, newStatus)}
                                                    disabled={updatingServiceRequest === request.id}
                                                >
                                                    <SelectTrigger className="w-40 h-8 text-xs">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {serviceRequestStatuses.map((status) => (
                                                            <SelectItem key={status.value} value={status.value}>
                                                                {status.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {updatingServiceRequest === request.id && (
                                                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* Service Details */}
                                        {request.service && (
                                            <div className="mb-4 p-3 bg-white rounded border">
                                                <h6 className="font-monument-regular text-xs text-gray-700 tracking-wide uppercase mb-2">
                                                    Service Details
                                                </h6>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                                    <div>
                                                        <span className="font-monument-regular text-xs text-gray-700 tracking-wide uppercase">Service Name:</span>
                                                        <p className="text-gray-800">{request.service.name}</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-monument-regular text-xs text-gray-700 tracking-wide uppercase">Service ID:</span>
                                                        <p className="text-gray-800">#{request.service.id}</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-monument-regular text-xs text-gray-700 tracking-wide uppercase">Price:</span>
                                                        <p className="text-gray-800">${request.service.price}</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-monument-regular text-xs text-gray-700 tracking-wide uppercase">Status:</span>
                                                        <p className="text-gray-800 capitalize">
                                                            {request.service.is_active ? 'Active' : 'Inactive'}
                                                        </p>
                                                    </div>
                                                    {request.service.description && (
                                                        <div className="sm:col-span-2">
                                                            <span className="font-monument-regular text-xs text-gray-700 tracking-wide uppercase">Description:</span>
                                                            <p className="text-gray-800">{request.service.description}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                            <div>
                                                <span className="font-monument-regular text-xs text-gray-700 tracking-wide uppercase">Request ID:</span>
                                                <p className="text-gray-800">#{request.id}</p>
                                            </div>
                                            <div>
                                                <span className="font-monument-regular text-xs text-gray-700 tracking-wide uppercase">Status:</span>
                                                <p className="text-gray-800 capitalize">{request.status?.replace('_', ' ') || 'Unknown'}</p>
                                            </div>
                                            <div>
                                                <span className="font-monument-regular text-xs text-gray-700 tracking-wide uppercase">Requested:</span>
                                                <p className="text-gray-800">{formatDate(request.requested_at)}</p>
                                            </div>
                                            <div>
                                                <span className="font-monument-regular text-xs text-gray-700 tracking-wide uppercase">Completed:</span>
                                                <p className="text-gray-800">{formatDate(request.completed_at) || 'Not completed'}</p>
                                            </div>
                                            {request.notes && request.notes.trim() && (
                                                <div className="sm:col-span-2">
                                                    <span className="font-monument-regular text-xs text-gray-700 tracking-wide uppercase">Notes:</span>
                                                    <p className="text-gray-800">{request.notes}</p>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Service Request Actions */}
                                        <div className="flex space-x-2 mt-3 pt-3 border-t border-gray-200">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-xs"
                                                onClick={() => {
                                                    console.log('View service request details:', request);
                                                }}
                                            >
                                                <Eye className="h-3 w-3 mr-1" />
                                                View Details
                                            </Button>
                                            
                                            {request.status === 'pending' && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-xs text-blue-600 hover:text-blue-700"
                                                    onClick={() => updateServiceRequestStatus(request.id, 'in_progress')}
                                                    disabled={updatingServiceRequest === request.id}
                                                >
                                                    {updatingServiceRequest === request.id ? (
                                                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                                    ) : (
                                                        <Edit className="h-3 w-3 mr-1" />
                                                    )}
                                                    Start Processing
                                                </Button>
                                            )}
                                            
                                            {request.status === 'in_progress' && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-xs text-green-600 hover:text-green-700"
                                                    onClick={() => updateServiceRequestStatus(request.id, 'completed')}
                                                    disabled={updatingServiceRequest === request.id}
                                                >
                                                    {updatingServiceRequest === request.id ? (
                                                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                                    ) : (
                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                    )}
                                                    Mark Complete
                                                </Button>
                                            )}
                                            
                                            {request.status === 'completed' && (
                                                <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    Completed
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Edit Package Dialog - Moved outside the detail view to ensure it's always rendered */}
                <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="font-monument-regular tracking-wide uppercase">
                                Edit Package #{editingPackage?.id}
                            </DialogTitle>
                        </DialogHeader>
                        
                        {editingPackage && (
                            <form onSubmit={handleEditSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Status */}
                                    <div>
                                        <Label htmlFor="status">Status *</Label>
                                        <Select 
                                            value={editingPackage.status} 
                                            onValueChange={(value) => handleEditChange('status', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {packageStatuses.map((status) => (
                                                    <SelectItem key={status.value} value={status.value}>
                                                        {status.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Location */}
                                    <div>
                                        <Label htmlFor="location">Location</Label>
                                        <Input
                                            id="location"
                                            value={editingPackage.location}
                                            onChange={(e) => handleEditChange('location', e.target.value)}
                                            placeholder="e.g., Shelf A-3"
                                        />
                                    </div>

                                    {/* Sender Name */}
                                    <div>
                                        <Label htmlFor="sender_name">Sender Name</Label>
                                        <Input
                                            id="sender_name"
                                            value={editingPackage.sender_name}
                                            onChange={(e) => handleEditChange('sender_name', e.target.value)}
                                            placeholder="Sender name"
                                        />
                                    </div>

                                    {/* Tracking Number */}
                                    <div>
                                        <Label htmlFor="inbound_tracking_number">Tracking Number</Label>
                                        <Input
                                            id="inbound_tracking_number"
                                            value={editingPackage.inbound_tracking_number}
                                            onChange={(e) => handleEditChange('inbound_tracking_number', e.target.value)}
                                            placeholder="Tracking number"
                                        />
                                    </div>

                                    {/* Weight */}
                                    <div>
                                        <Label htmlFor="weight">Weight (lbs)</Label>
                                        <Input
                                            id="weight"
                                            type="number"
                                            step="0.1"
                                            value={editingPackage.weight}
                                            onChange={(e) => handleEditChange('weight', e.target.value)}
                                            placeholder="Weight in pounds"
                                        />
                                    </div>

                                    {/* Declared Value */}
                                    <div>
                                        <Label htmlFor="declared_value">Declared Value ($)</Label>
                                        <Input
                                            id="declared_value"
                                            type="number"
                                            step="0.01"
                                            value={editingPackage.declared_value}
                                            onChange={(e) => handleEditChange('declared_value', e.target.value)}
                                            placeholder="Declared value"
                                        />
                                    </div>

                                    {/* Length */}
                                    <div>
                                        <Label htmlFor="length">Length (inches)</Label>
                                        <Input
                                            id="length"
                                            type="number"
                                            step="0.1"
                                            value={editingPackage.length}
                                            onChange={(e) => handleEditChange('length', e.target.value)}
                                            placeholder="Length"
                                        />
                                    </div>

                                    {/* Width */}
                                    <div>
                                        <Label htmlFor="width">Width (inches)</Label>
                                        <Input
                                            id="width"
                                            type="number"
                                            step="0.1"
                                            value={editingPackage.width}
                                            onChange={(e) => handleEditChange('width', e.target.value)}
                                            placeholder="Width"
                                        />
                                    </div>

                                    {/* Height */}
                                    <div>
                                        <Label htmlFor="height">Height (inches)</Label>
                                        <Input
                                            id="height"
                                            type="number"
                                            step="0.1"
                                            value={editingPackage.height}
                                            onChange={(e) => handleEditChange('height', e.target.value)}
                                            placeholder="Height"
                                        />
                                    </div>
                                </div>

                                {/* Image Upload Section */}
                                <div className="border-t pt-4">
                                    <Label className="text-sm font-monument-regular tracking-wide uppercase">
                                        Upload New Image
                                    </Label>
                                    <div className="mt-2 relative">
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                            onChange={handleEditImageSelect}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            disabled={uploadingImage}
                                        />
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                                            {editingPackage.selectedImage ? (
                                                <div className="flex items-center justify-center space-x-2">
                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                    <span className="text-sm text-gray-600">
                                                        Selected: {editingPackage.selectedImage.name}
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center space-y-2">
                                                    <Upload className="h-6 w-6 text-gray-400" />
                                                    <span className="text-sm text-gray-600">Click to select an image</span>
                                                    <span className="text-xs text-gray-500">JPEG, PNG, GIF, WebP up to 10MB</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Form Actions */}
                                <div className="flex justify-end space-x-2 pt-4">
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        onClick={() => setShowEditDialog(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={updating}>
                                        {updating ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4 mr-2" />
                                                Update Package
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        );
    }

    // Package List View
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="font-monument-regular text-xl sm:text-2xl text-gray-800 mb-2 tracking-wide uppercase">
                        Mailbox - {selectedUser.first_name || selectedUser.last_name
                            ? `${selectedUser.first_name || ''} ${selectedUser.last_name || ''}`.trim()
                            : 'Admin User'
                        }
                    </h2>
                    <p className="text-gray-600 text-sm">
                        View packages and mail for {selectedUser.email} • Suite: {selectedUser.suite_number}
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                        {packages.length} Package{packages.length !== 1 ? 's' : ''}
                    </Badge>
                    <Button 
                        size="sm" 
                        className="text-xs"
                        onClick={openCreateDialog}
                    >
                        <Plus className="h-3 w-3 mr-1" />
                        Create Package
                    </Button>
                </div>
            </div>

            {/* Loading State */}
            {loading && <LoadingSkeleton />}

            {/* Error State */}
            {error && !loading && (
                <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                        {error}
                    </AlertDescription>
                </Alert>
            )}

            {/* Success Message */}
            {updateSuccess && (
                <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                        {updateSuccess}
                    </AlertDescription>
                </Alert>
            )}

            {/* Packages List */}
            {!loading && !error && packages.length > 0 && (
                <div className="space-y-4">
                    {packages.map((pkg) => (
                        <Card key={pkg.id} className="transition-all duration-200 hover:shadow-md hover:border-gray-300">
                            <CardHeader className="pb-3">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <Package className="h-5 w-5 text-gray-600" />
                                            <CardTitle className="font-monument-regular text-base text-gray-800 tracking-wide uppercase truncate">
                                                {pkg.package_full_name || pkg.full_name}
                                            </CardTitle>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            <Badge className={`text-xs ${getStatusColor(pkg.status)}`}>
                                                {getStatusText(pkg.status)}
                                            </Badge>
                                            {pkg.inbound_tracking_number && (
                                                <Badge variant="outline" className="text-xs">
                                                    {pkg.inbound_tracking_number}
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            Package ID: #{pkg.id} • Arrived: {formatDate(pkg.date_arrived)}
                                        </p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openPackageDetail(pkg)}
                                            className="text-xs"
                                        >
                                            <Eye className="h-3 w-3 mr-1" />
                                            View Details
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openEditDialog(pkg)}
                                            className="text-xs"
                                        >
                                            <Edit className="h-3 w-3 mr-1" />
                                            Edit
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {/* Package Info */}
                                    <div className="space-y-2">
                                        <h4 className="font-monument-regular text-xs text-gray-700 tracking-wide uppercase">
                                            Package Details
                                        </h4>
                                        <div className="space-y-1 text-sm">
                                            {pkg.sender_name && (
                                                <div className="flex items-center space-x-2">
                                                    <User className="h-3 w-3 text-gray-400" />
                                                    <span className="text-gray-600 text-xs">From: {pkg.sender_name}</span>
                                                </div>
                                            )}
                                            {pkg.weight && (
                                                <div className="flex items-center space-x-2">
                                                    <Weight className="h-3 w-3 text-gray-400" />
                                                    <span className="text-gray-600 text-xs">{pkg.weight} lbs</span>
                                                </div>
                                            )}
                                            {(pkg.length || pkg.width || pkg.height) && (
                                                <div className="flex items-center space-x-2">
                                                    <Ruler className="h-3 w-3 text-gray-400" />
                                                    <span className="text-gray-600 text-xs">
                                                        {pkg.length}"×{pkg.width}"×{pkg.height}"
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Warehouse Info */}
                                    <div className="space-y-2">
                                        <h4 className="font-monument-regular text-xs text-gray-700 tracking-wide uppercase">
                                            Warehouse
                                        </h4>
                                        <div className="space-y-1 text-sm">
                                            {pkg.warehouse && (
                                                <div className="flex items-center space-x-2">
                                                    <Building className="h-3 w-3 text-gray-400" />
                                                    <span className="text-gray-600 text-xs">{pkg.warehouse.name}</span>
                                                </div>
                                            )}
                                            {pkg.location && (
                                                <div className="flex items-center space-x-2">
                                                    <MapPin className="h-3 w-3 text-gray-400" />
                                                    <span className="text-gray-600 text-xs">{pkg.location}</span>
                                                </div>
                                            )}
                                            {pkg.declared_value && (
                                                <div className="flex items-center space-x-2">
                                                    <DollarSign className="h-3 w-3 text-gray-400" />
                                                    <span className="text-gray-600 text-xs">${pkg.declared_value}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Status Timeline */}
                                    <div className="space-y-2">
                                        <h4 className="font-monument-regular text-xs text-gray-700 tracking-wide uppercase">
                                            Timeline
                                        </h4>
                                        <div className="space-y-1 text-sm">
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="h-3 w-3 text-gray-400" />
                                                <span className="text-gray-600 text-xs">
                                                    Arrived: {formatDate(pkg.date_arrived)}
                                                </span>
                                            </div>
                                            {pkg.date_processed && (
                                                <div className="flex items-center space-x-2">
                                                    <Calendar className="h-3 w-3 text-yellow-400" />
                                                    <span className="text-gray-600 text-xs">
                                                        Processed: {formatDate(pkg.date_processed)}
                                                    </span>
                                                </div>
                                            )}
                                            {pkg.date_shipped && (
                                                <div className="flex items-center space-x-2">
                                                    <Calendar className="h-3 w-3 text-green-400" />
                                                    <span className="text-gray-600 text-xs">
                                                        Shipped: {formatDate(pkg.date_shipped)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Package Images Preview */}
                                {pkg.images && pkg.images.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <ImageIcon className="h-4 w-4 text-gray-400" />
                                            <span className="text-xs text-gray-600 font-monument-regular tracking-wide uppercase">
                                                {pkg.images.length} Image{pkg.images.length !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                        <div className="flex space-x-2 overflow-x-auto">
                                            {pkg.images.slice(0, 3).map((image, index) => (
                                                <div key={image.id} className="flex-shrink-0">
                                                    <div className="w-16 h-16 bg-gray-100 rounded border flex items-center justify-center overflow-hidden">
                                                        {imageErrors[image.id] ? (
                                                            <div className="flex flex-col items-center justify-center text-gray-400 text-xs h-full">
                                                                <ImageIcon className="h-4 w-4 mb-1" />
                                                                <span>Error</span>
                                                            </div>
                                                        ) : (
                                                            <img
                                                                src={image.image.startsWith('http') ? image.image : `${axiosInstance.defaults.baseURL}${image.image}`}
                                                                alt={`Package ${pkg.id} - Image ${index + 1}`}
                                                                className="w-full h-full object-cover cursor-pointer hover:opacity-75 transition-opacity"
                                                                onClick={() => handleImageClick(image.image)}
                                                                onError={() => handleImageError(image.id)}
                                                                onLoad={() => {
                                                                    console.log('Preview image loaded successfully:', image.image);
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                            {pkg.images.length > 3 && (
                                                <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded border flex items-center justify-center">
                                                    <span className="text-xs text-gray-500">+{pkg.images.length - 3}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && packages.length === 0 && (
                <Card className="border-dashed border-2 border-gray-200">
                    <CardContent className="p-8 sm:p-12 text-center">
                        <div className="bg-gray-100 p-4 sm:p-6 rounded-full w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                            <Package className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
                        </div>
                        <h3 className="font-monument-regular text-lg text-gray-800 mb-3 tracking-wide uppercase">
                            No Packages Found
                        </h3>
                        <p className="text-gray-600 max-w-md mx-auto text-sm sm:text-base">
                            This user doesn't have any packages in their mailbox yet.
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Create Package Dialog */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="font-monument-regular tracking-wide uppercase">
                            Create New Package for {selectedUser?.first_name} {selectedUser?.last_name}
                        </DialogTitle>
                    </DialogHeader>
                    
                    <form onSubmit={handleCreateSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* User Suite */}
                            <div>
                                <Label htmlFor="user_suite">User Suite *</Label>
                                <Input
                                    id="user_suite"
                                    value={createPackageData.user_suite}
                                    onChange={(e) => handleCreateChange('user_suite', e.target.value)}
                                    required
                                    placeholder="e.g., F2362C"
                                />
                            </div>

                            {/* Full Name */}
                            <div>
                                <Label htmlFor="full_name">Full Name *</Label>
                                <Input
                                    id="full_name"
                                    value={createPackageData.full_name}
                                    onChange={(e) => handleCreateChange('full_name', e.target.value)}
                                    required
                                    placeholder="e.g., Sahil Gholap"
                                />
                            </div>

                            {/* Status */}
                            <div>
                                <Label htmlFor="status">Status *</Label>
                                <Select 
                                    value={createPackageData.status} 
                                    onValueChange={(value) => handleCreateChange('status', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {packageStatuses.map((status) => (
                                            <SelectItem key={status.value} value={status.value}>
                                                {status.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Tracking Number */}
                            <div>
                                <Label htmlFor="inbound_tracking_number">Tracking Number *</Label>
                                <Input
                                    id="inbound_tracking_number"
                                    value={createPackageData.inbound_tracking_number}
                                    onChange={(e) => handleCreateChange('inbound_tracking_number', e.target.value)}
                                    required
                                    placeholder="e.g., AMZ123456789"
                                />
                            </div>

                            {/* Sender Name */}
                            <div>
                                <Label htmlFor="sender_name">Sender Name *</Label>
                                <Input
                                    id="sender_name"
                                    value={createPackageData.sender_name}
                                    onChange={(e) => handleCreateChange('sender_name', e.target.value)}
                                    required
                                    placeholder="e.g., John Doe"
                                />
                            </div>

                            {/* Weight */}
                            <div>
                                <Label htmlFor="weight">Weight (lbs) *</Label>
                                <Input
                                    id="weight"
                                    type="number"
                                    step="0.1"
                                    value={createPackageData.weight}
                                    onChange={(e) => handleCreateChange('weight', e.target.value)}
                                    required
                                    placeholder="e.g., 2.0"
                                />
                            </div>

                            {/* Declared Value */}
                            <div>
                                <Label htmlFor="declared_value">Declared Value ($) *</Label>
                                <Input
                                    id="declared_value"
                                    type="number"
                                    step="0.01"
                                    value={createPackageData.declared_value}
                                    onChange={(e) => handleCreateChange('declared_value', e.target.value)}
                                    required
                                    placeholder="e.g., 100.0"
                                />
                            </div>

                            {/* Location */}
                            <div>
                                <Label htmlFor="location">Location *</Label>
                                <Input
                                    id="location"
                                    value={createPackageData.location}
                                    onChange={(e) => handleCreateChange('location', e.target.value)}
                                    required
                                    placeholder="e.g., Shelf A-1"
                                />
                            </div>

                            {/* Length */}
                            <div>
                                <Label htmlFor="length">Length (inches) *</Label>
                                <Input
                                    id="length"
                                    type="number"
                                    step="0.1"
                                    value={createPackageData.length}
                                    onChange={(e) => handleCreateChange('length', e.target.value)}
                                    required
                                    placeholder="e.g., 10.0"
                                />
                            </div>

                            {/* Width */}
                            <div>
                                <Label htmlFor="width">Width (inches) *</Label>
                                <Input
                                    id="width"
                                    type="number"
                                    step="0.1"
                                    value={createPackageData.width}
                                    onChange={(e) => handleCreateChange('width', e.target.value)}
                                    required
                                    placeholder="e.g., 20.0"
                                />
                            </div>

                            {/* Height */}
                            <div>
                                <Label htmlFor="height">Height (inches) *</Label>
                                <Input
                                    id="height"
                                    type="number"
                                    step="0.1"
                                    value={createPackageData.height}
                                    onChange={(e) => handleCreateChange('height', e.target.value)}
                                    required
                                    placeholder="e.g., 30.0"
                                />
                            </div>

                            {/* Warehouse */}
                            <div>
                                <Label htmlFor="warehouse">Warehouse *</Label>
                                <Select 
                                    value={createPackageData.warehouse.toString()} 
                                    onValueChange={(value) => handleCreateChange('warehouse', parseInt(value))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">US Tax Free Warehouse</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Image Upload Section */}
                        <div className="border-t pt-4">
                            <Label className="text-sm font-monument-regular tracking-wide uppercase">
                                Upload Package Image
                            </Label>
                            <div className="mt-2 relative">
                                <input
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                    onChange={handleCreateImageSelect}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    disabled={creatingPackage}
                                />
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                                    {createPackageData.selectedImage ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            <span className="text-sm text-gray-600">
                                                Selected: {createPackageData.selectedImage.name}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center space-y-2">
                                            <Upload className="h-6 w-6 text-gray-400" />
                                            <span className="text-sm text-gray-600">Click to select an image</span>
                                            <span className="text-xs text-gray-500">JPEG, PNG, GIF, WebP up to 10MB (Optional)</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end space-x-2 pt-4">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setShowCreateDialog(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={creatingPackage}>
                                {creatingPackage ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Create Package
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Package Dialog - Also available in list view */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="font-monument-regular tracking-wide uppercase">
                            Edit Package #{editingPackage?.id}
                        </DialogTitle>
                    </DialogHeader>
                    
                    {editingPackage && (
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Status */}
                                <div>
                                    <Label htmlFor="status">Status *</Label>
                                    <Select 
                                        value={editingPackage.status} 
                                        onValueChange={(value) => handleEditChange('status', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {packageStatuses.map((status) => (
                                                <SelectItem key={status.value} value={status.value}>
                                                    {status.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Location */}
                                <div>
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        value={editingPackage.location}
                                        onChange={(e) => handleEditChange('location', e.target.value)}
                                        placeholder="e.g., Shelf A-3"
                                    />
                                </div>

                                {/* Sender Name */}
                                <div>
                                    <Label htmlFor="sender_name">Sender Name</Label>
                                    <Input
                                        id="sender_name"
                                        value={editingPackage.sender_name}
                                        onChange={(e) => handleEditChange('sender_name', e.target.value)}
                                        placeholder="Sender name"
                                    />
                                </div>

                                {/* Tracking Number */}
                                <div>
                                    <Label htmlFor="inbound_tracking_number">Tracking Number</Label>
                                    <Input
                                        id="inbound_tracking_number"
                                        value={editingPackage.inbound_tracking_number}
                                        onChange={(e) => handleEditChange('inbound_tracking_number', e.target.value)}
                                        placeholder="Tracking number"
                                    />
                                </div>

                                {/* Weight */}
                                <div>
                                    <Label htmlFor="weight">Weight (lbs)</Label>
                                    <Input
                                        id="weight"
                                        type="number"
                                        step="0.1"
                                        value={editingPackage.weight}
                                        onChange={(e) => handleEditChange('weight', e.target.value)}
                                        placeholder="Weight in pounds"
                                    />
                                </div>

                                {/* Declared Value */}
                                <div>
                                    <Label htmlFor="declared_value">Declared Value ($)</Label>
                                    <Input
                                        id="declared_value"
                                        type="number"
                                        step="0.01"
                                        value={editingPackage.declared_value}
                                        onChange={(e) => handleEditChange('declared_value', e.target.value)}
                                        placeholder="Declared value"
                                    />
                                </div>

                                {/* Length */}
                                <div>
                                    <Label htmlFor="length">Length (inches)</Label>
                                    <Input
                                        id="length"
                                        type="number"
                                        step="0.1"
                                        value={editingPackage.length}
                                        onChange={(e) => handleEditChange('length', e.target.value)}
                                        placeholder="Length"
                                    />
                                </div>

                                {/* Width */}
                                <div>
                                    <Label htmlFor="width">Width (inches)</Label>
                                    <Input
                                        id="width"
                                        type="number"
                                        step="0.1"
                                        value={editingPackage.width}
                                        onChange={(e) => handleEditChange('width', e.target.value)}
                                        placeholder="Width"
                                    />
                                </div>

                                {/* Height */}
                                <div>
                                    <Label htmlFor="height">Height (inches)</Label>
                                    <Input
                                        id="height"
                                        type="number"
                                        step="0.1"
                                        value={editingPackage.height}
                                        onChange={(e) => handleEditChange('height', e.target.value)}
                                        placeholder="Height"
                                    />
                                </div>
                            </div>

                            {/* Image Upload Section */}
                            <div className="border-t pt-4">
                                <Label className="text-sm font-monument-regular tracking-wide uppercase">
                                    Upload New Image
                                </Label>
                                <div className="mt-2 relative">
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                        onChange={handleEditImageSelect}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        disabled={uploadingImage}
                                    />
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                                        {editingPackage.selectedImage ? (
                                            <div className="flex items-center justify-center space-x-2">
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                                <span className="text-sm text-gray-600">
                                                    Selected: {editingPackage.selectedImage.name}
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center space-y-2">
                                                <Upload className="h-6 w-6 text-gray-400" />
                                                <span className="text-sm text-gray-600">Click to select an image</span>
                                                <span className="text-xs text-gray-500">JPEG, PNG, GIF, WebP up to 10MB</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex justify-end space-x-2 pt-4">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => setShowEditDialog(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={updating}>
                                    {updating ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Update Package
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
