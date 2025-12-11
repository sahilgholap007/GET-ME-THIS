"use client";

import { useState, useEffect } from 'react';
import { User, MapPin, Phone, Mail, Calendar, Shield, Edit, Save, X, Plus, Trash2, Loader2, AlertCircle, CheckCircle, Building, Globe, Key, UserCheck, UserX, Eye, Package, Wallet, Download, CreditCard, Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import axiosInstance from '../../utils/axiosInstance';

export default function Account({ selectedUser }) {
    const [userDetails, setUserDetails] = useState(null);
    const [userAddresses, setUserAddresses] = useState([]);
    const [userShipments, setUserShipments] = useState([]);
    const [userWallet, setUserWallet] = useState(null);
    const [loading, setLoading] = useState(false);
    const [addressesLoading, setAddressesLoading] = useState(false);
    const [shipmentsLoading, setShipmentsLoading] = useState(false);
    const [walletLoading, setWalletLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [editingUser, setEditingUser] = useState(false);
    const [updatingUser, setUpdatingUser] = useState(false);
    const [editedUserData, setEditedUserData] = useState({});
    const [showAddressDialog, setShowAddressDialog] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [creatingAddress, setCreatingAddress] = useState(false);
    const [updatingAddress, setUpdatingAddress] = useState(false);
    const [deletingAddress, setDeletingAddress] = useState(null);
    const [showPasswordDialog, setShowPasswordDialog] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [resettingPassword, setResettingPassword] = useState(false);
    const [activatingUser, setActivatingUser] = useState(false);
    const [deactivatingUser, setDeactivatingUser] = useState(false);
    const [impersonatingUser, setImpersonatingUser] = useState(false);
    const [exportingData, setExportingData] = useState(false);
    const [addressFormData, setAddressFormData] = useState({
        address_line1: '',
        address_line2: '',
        city: '',
        state_province_region: '',
        zip_postal_code: '',
        country: 'USA',
        phone_number: '',
        is_default: false
    });

    // Fetch user details
    const fetchUserDetails = async (userId) => {
        if (!userId) return;

        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.get(`/api/v1/users/admin/accounts/${userId}/`);
            setUserDetails(response.data);
            setEditedUserData({
                first_name: response.data.first_name || '',
                last_name: response.data.last_name || '',
                phone_number: response.data.phone_number || '',
                is_active: response.data.is_active
            });
        } catch (error) {
            console.error('Error fetching user details:', error);
            setError('Failed to load user details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch user addresses
    const fetchUserAddresses = async (userId) => {
        if (!userId) return;

        setAddressesLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.get(`/api/v1/users/admin/addresses/?user=${userId}`);
            const addressData = response.data;
            const addressList = Array.isArray(addressData) ? addressData : addressData.results || [];
            setUserAddresses(addressList);
        } catch (error) {
            console.error('Error fetching user addresses:', error);
            if (error.response?.status === 404) {
                setUserAddresses([]);
            } else {
                setError('Failed to load user addresses. Please try again.');
            }
        } finally {
            setAddressesLoading(false);
        }
    };

    // Fetch user shipments
    const fetchUserShipments = async (userId) => {
        if (!userId) return;

        setShipmentsLoading(true);

        try {
            const response = await axiosInstance.get(`/api/v1/users/admin/accounts/${userId}/shipments/`);
            setUserShipments(response.data.shipments || []);
        } catch (error) {
            console.error('Error fetching user shipments:', error);
            setUserShipments([]);
        } finally {
            setShipmentsLoading(false);
        }
    };

    // Fetch user wallet
    const fetchUserWallet = async (userId) => {
        if (!userId) return;

        setWalletLoading(true);

        try {
            const response = await axiosInstance.get(`/api/v1/users/admin/accounts/${userId}/wallet/`);
            setUserWallet(response.data);
        } catch (error) {
            console.error('Error fetching user wallet:', error);
            setUserWallet(null);
        } finally {
            setWalletLoading(false);
        }
    };

    // Update user details
    const updateUserDetails = async () => {
        setUpdatingUser(true);
        setError(null);

        try {
            const response = await axiosInstance.patch(
                `/api/v1/users/admin/accounts/${selectedUser.id}/`,
                editedUserData
            );
            setUserDetails(response.data);
            setEditingUser(false);
            setSuccess('User details updated successfully!');
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            console.error('Error updating user:', error);
            setError('Failed to update user details. Please try again.');
        } finally {
            setUpdatingUser(false);
        }
    };

    // Reset user password
    const resetUserPassword = async () => {
        if (!newPassword.trim()) {
            setError('Please enter a new password.');
            return;
        }

        setResettingPassword(true);
        setError(null);

        try {
            await axiosInstance.post(
                `/api/v1/users/admin/accounts/${selectedUser.id}/reset-password/`,
                { new_password: newPassword }
            );
            setShowPasswordDialog(false);
            setNewPassword('');
            setSuccess('Password reset successfully!');
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            console.error('Error resetting password:', error);
            setError('Failed to reset password. Please try again.');
        } finally {
            setResettingPassword(false);
        }
    };

    // Activate user
    const activateUser = async () => {
        setActivatingUser(true);
        setError(null);

        try {
            await axiosInstance.post(`/api/v1/users/admin/accounts/${selectedUser.id}/activate/`);
            setUserDetails(prev => ({ ...prev, is_active: true }));
            setEditedUserData(prev => ({ ...prev, is_active: true }));
            setSuccess('User activated successfully!');
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            console.error('Error activating user:', error);
            setError('Failed to activate user. Please try again.');
        } finally {
            setActivatingUser(false);
        }
    };

    // Deactivate user
    const deactivateUser = async () => {
        if (!confirm('Are you sure you want to deactivate this user?')) return;

        setDeactivatingUser(true);
        setError(null);

        try {
            await axiosInstance.post(`/api/v1/users/admin/accounts/${selectedUser.id}/deactivate/`);
            setUserDetails(prev => ({ ...prev, is_active: false }));
            setEditedUserData(prev => ({ ...prev, is_active: false }));
            setSuccess('User deactivated successfully!');
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            console.error('Error deactivating user:', error);
            setError('Failed to deactivate user. Please try again.');
        } finally {
            setDeactivatingUser(false);
        }
    };

    // Export user data
    const exportUserData = async () => {
        setExportingData(true);
        setError(null);

        try {
            const response = await axiosInstance.get(`/api/v1/users/admin/accounts/${selectedUser.id}/export/`);
            
            // Create and download file
            const dataStr = JSON.stringify(response.data, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `user_${selectedUser.id}_data.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            setSuccess('User data exported successfully!');
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            console.error('Error exporting user data:', error);
            setError('Failed to export user data. Please try again.');
        } finally {
            setExportingData(false);
        }
    };

    // Create new address
    const createAddress = async () => {
        setCreatingAddress(true);
        setError(null);

        try {
            const response = await axiosInstance.post(
                '/api/v1/users/admin/addresses/',
                { ...addressFormData, user: selectedUser.id }
            );
            setUserAddresses(prev => [...prev, response.data]);
            setShowAddressDialog(false);
            resetAddressForm();
            setSuccess('Address created successfully!');
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            console.error('Error creating address:', error);
            if (error.response?.data) {
                const errorMessages = Object.values(error.response.data).flat();
                setError(errorMessages.join(', '));
            } else {
                setError('Failed to create address. Please try again.');
            }
        } finally {
            setCreatingAddress(false);
        }
    };

    // Update address
    const updateAddress = async () => {
        setUpdatingAddress(true);
        setError(null);

        try {
            const response = await axiosInstance.patch(
                `/api/v1/users/admin/addresses/${editingAddress.id}/`,
                addressFormData
            );
            setUserAddresses(prev => 
                prev.map(addr => addr.id === editingAddress.id ? response.data : addr)
            );
            setShowAddressDialog(false);
            setEditingAddress(null);
            resetAddressForm();
            setSuccess('Address updated successfully!');
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            console.error('Error updating address:', error);
            if (error.response?.data) {
                const errorMessages = Object.values(error.response.data).flat();
                setError(errorMessages.join(', '));
            } else {
                setError('Failed to update address. Please try again.');
            }
        } finally {
            setUpdatingAddress(false);
        }
    };

    // Delete address
    const deleteAddress = async (addressId) => {
        if (!confirm('Are you sure you want to delete this address?')) return;

        setDeletingAddress(addressId);
        setError(null);

        try {
            await axiosInstance.delete(`/api/v1/users/admin/addresses/${addressId}/`);
            setUserAddresses(prev => prev.filter(addr => addr.id !== addressId));
            setSuccess('Address deleted successfully!');
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            console.error('Error deleting address:', error);
            setError('Failed to delete address. Please try again.');
        } finally {
            setDeletingAddress(null);
        }
    };

    // Reset address form
    const resetAddressForm = () => {
        setAddressFormData({
            address_line1: '',
            address_line2: '',
            city: '',
            state_province_region: '',
            zip_postal_code: '',
            country: 'USA',
            phone_number: '',
            is_default: false
        });
    };

    // Open create address dialog
    const openCreateAddressDialog = () => {
        resetAddressForm();
        setEditingAddress(null);
        setShowAddressDialog(true);
    };

    // Open edit address dialog
    const openEditAddressDialog = (address) => {
        setAddressFormData({
            address_line1: address.address_line1 || '',
            address_line2: address.address_line2 || '',
            city: address.city || '',
            state_province_region: address.state_province_region || '',
            zip_postal_code: address.zip_postal_code || '',
            country: address.country || 'USA',
            phone_number: address.phone_number || '',
            is_default: address.is_default || false
        });
        setEditingAddress(address);
        setShowAddressDialog(true);
    };

    // Handle address form submit
    const handleAddressSubmit = (e) => {
        e.preventDefault();
        if (editingAddress) {
            updateAddress();
        } else {
            createAddress();
        }
    };

    // Handle address form change
    const handleAddressChange = (field, value) => {
        setAddressFormData(prev => ({ ...prev, [field]: value }));
    };

    // Handle user form change
    const handleUserChange = (field, value) => {
        setEditedUserData(prev => ({ ...prev, [field]: value }));
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
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
            return 'Invalid Date';
        }
    };

    // Format address for display
    const formatAddress = (address) => {
        const parts = [
            address.address_line1,
            address.address_line2,
            address.city,
            address.state_province_region,
            address.zip_postal_code,
            address.country
        ].filter(Boolean);
        
        return parts.join(', ');
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    // Fetch data when selectedUser changes
    useEffect(() => {
        if (selectedUser?.id) {
            fetchUserDetails(selectedUser.id);
            fetchUserAddresses(selectedUser.id);
            fetchUserShipments(selectedUser.id);
            fetchUserWallet(selectedUser.id);
        } else {
            setUserDetails(null);
            setUserAddresses([]);
            setUserShipments([]);
            setUserWallet(null);
            setError(null);
        }
    }, [selectedUser]);

    // Loading skeleton
    const LoadingSkeleton = () => (
        <div className="space-y-6">
            <Card className="animate-pulse">
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    if (!selectedUser) {
        return (
            <div className="text-center py-8 sm:py-12">
                <div className="bg-gray-100 p-4 sm:p-6 rounded-full w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                    <User className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
                </div>
                <h3 className="font-monument-regular text-lg sm:text-xl text-gray-800 mb-3 sm:mb-4 tracking-wide uppercase">
                    Account Management
                </h3>
                <p className="text-gray-600 max-w-md mx-auto text-sm sm:text-base px-4">
                    Select a user from the list to view and manage their account details.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="font-monument-regular text-xl sm:text-2xl text-gray-800 mb-2 tracking-wide uppercase">
                        Account - {selectedUser.first_name || selectedUser.last_name
                            ? `${selectedUser.first_name || ''} ${selectedUser.last_name || ''}`.trim()
                            : 'Admin User'
                        }
                    </h2>
                    <p className="text-gray-600 text-sm">
                        Manage account details and settings for {selectedUser.email} • Suite: {selectedUser.suite_number}
                    </p>
                </div>
                
                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={exportUserData}
                        disabled={exportingData}
                        className="text-xs"
                    >
                        {exportingData ? (
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        ) : (
                            <Download className="h-3 w-3 mr-1" />
                        )}
                        Export Data
                    </Button>
                   
                </div>
            </div>

            {/* Success Message */}
            {success && (
                <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                        {success}
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

            {/* Loading State */}
            {loading && <LoadingSkeleton />}

            {/* Main Content */}
            {!loading && userDetails && (
                <Tabs defaultValue="details" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="details">Details</TabsTrigger>
                        <TabsTrigger value="addresses">Addresses</TabsTrigger>
                        <TabsTrigger value="shipments">Shipments</TabsTrigger>
                        <TabsTrigger value="wallet">Wallet</TabsTrigger>
                    </TabsList>

                    {/* User Details Tab */}
                    <TabsContent value="details" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="font-monument-regular text-lg tracking-wide uppercase">
                                        User Details
                                    </CardTitle>
                                    <div className="flex space-x-2">
                                        <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm" className="text-xs">
                                                    <Key className="h-3 w-3 mr-1" />
                                                    Reset Password
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Reset User Password</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-4">
                                                    <div>
                                                        <Label htmlFor="new_password">New Password</Label>
                                                        <Input
                                                            id="new_password"
                                                            type="password"
                                                            value={newPassword}
                                                            onChange={(e) => setNewPassword(e.target.value)}
                                                            placeholder="Enter new password"
                                                        />
                                                    </div>
                                                    <div className="flex justify-end space-x-2">
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => setShowPasswordDialog(false)}
                                                        >
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            onClick={resetUserPassword}
                                                            disabled={resettingPassword}
                                                        >
                                                            {resettingPassword ? (
                                                                <>
                                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                                    Resetting...
                                                                </>
                                                            ) : (
                                                                'Reset Password'
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                        
                                        {userDetails.is_active ? (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={deactivateUser}
                                                disabled={deactivatingUser}
                                                className="text-xs text-red-600 hover:text-red-700"
                                            >
                                                {deactivatingUser ? (
                                                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                                ) : (
                                                    <UserX className="h-3 w-3 mr-1" />
                                                )}
                                                Deactivate
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={activateUser}
                                                disabled={activatingUser}
                                                className="text-xs text-green-600 hover:text-green-700"
                                            >
                                                {activatingUser ? (
                                                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                                ) : (
                                                    <UserCheck className="h-3 w-3 mr-1" />
                                                )}
                                                Activate
                                            </Button>
                                        )}
                                        
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setEditingUser(!editingUser)}
                                            className="text-xs"
                                        >
                                            {editingUser ? (
                                                <>
                                                    <X className="h-3 w-3 mr-1" />
                                                    Cancel
                                                </>
                                            ) : (
                                                <>
                                                    <Edit className="h-3 w-3 mr-1" />
                                                    Edit
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {editingUser ? (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="first_name">First Name</Label>
                                                <Input
                                                    id="first_name"
                                                    value={editedUserData.first_name}
                                                    onChange={(e) => handleUserChange('first_name', e.target.value)}
                                                    placeholder="First name"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="last_name">Last Name</Label>
                                                <Input
                                                    id="last_name"
                                                    value={editedUserData.last_name}
                                                    onChange={(e) => handleUserChange('last_name', e.target.value)}
                                                    placeholder="Last name"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="phone_number">Phone Number</Label>
                                                <Input
                                                    id="phone_number"
                                                    value={editedUserData.phone_number}
                                                    onChange={(e) => handleUserChange('phone_number', e.target.value)}
                                                    placeholder="Phone number"
                                                />
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Switch
                                                    id="is_active"
                                                    checked={editedUserData.is_active}
                                                    onCheckedChange={(checked) => handleUserChange('is_active', checked)}
                                                />
                                                <Label htmlFor="is_active">Account Active</Label>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button
                                                onClick={updateUserDetails}
                                                disabled={updatingUser}
                                                size="sm"
                                                className="text-xs"
                                            >
                                                {updatingUser ? (
                                                    <>
                                                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                                        Updating...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="h-3 w-3 mr-1" />
                                                        Save Changes
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Basic Information */}
                                        <div className="space-y-4">
                                            <h3 className="font-monument-regular text-sm text-gray-700 tracking-wide uppercase">
                                                Basic Information
                                            </h3>
                                            <div className="space-y-3">
                                                <div className="flex items-center space-x-2">
                                                    <User className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm">
                                                        {userDetails.first_name} {userDetails.last_name}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Mail className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm">{userDetails.email}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Phone className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm">{userDetails.phone_number || 'Not provided'}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Building className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm">Suite: {userDetails.suite_number}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Account Status */}
                                        <div className="space-y-4">
                                            <h3 className="font-monument-regular text-sm text-gray-700 tracking-wide uppercase">
                                                Account Status
                                            </h3>
                                            <div className="space-y-3">
                                                <div className="flex items-center space-x-2">
                                                    <Shield className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm">Status:</span>
                                                    <Badge variant={userDetails.is_active ? "default" : "secondary"} className="text-xs">
                                                        {userDetails.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Shield className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm">Staff:</span>
                                                    <Badge variant={userDetails.is_staff ? "default" : "outline"} className="text-xs">
                                                        {userDetails.is_staff ? 'Yes' : 'No'}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Calendar className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm">Joined: {formatDate(userDetails.date_joined)}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Calendar className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm">Last Login: {formatDate(userDetails.last_login)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Referral Information */}
                                        {(userDetails.referral_code || userDetails.referred_by) && (
                                            <div className="space-y-4 md:col-span-2">
                                                <h3 className="font-monument-regular text-sm text-gray-700 tracking-wide uppercase">
                                                    Referral Information
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {userDetails.referral_code && (
                                                        <div className="flex items-center space-x-2">
                                                            <Globe className="h-4 w-4 text-gray-400" />
                                                            <span className="text-sm">Referral Code: {userDetails.referral_code}</span>
                                                        </div>
                                                    )}
                                                    {userDetails.referred_by && (
                                                        <div className="flex items-center space-x-2">
                                                            <User className="h-4 w-4 text-gray-400" />
                                                            <span className="text-sm">
                                                                Referred by: {userDetails.referred_by.email} (Suite: {userDetails.referred_by.suite_number})
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Addresses Tab */}
                    <TabsContent value="addresses" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="font-monument-regular text-lg tracking-wide uppercase">
                                        User Addresses ({userAddresses.length})
                                    </CardTitle>
                                    
                                </div>
                            </CardHeader>
                            <CardContent>
                                {addressesLoading ? (
                                    <div className="space-y-4">
                                        {[1, 2].map((i) => (
                                            <div key={i} className="animate-pulse p-4 border rounded">
                                                <div className="space-y-2">
                                                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                                                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : userAddresses.length > 0 ? (
                                    <div className="space-y-4">
                                        {userAddresses.map((address) => (
                                            <div key={address.id} className="p-4 border rounded hover:border-gray-300 transition-colors">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-2 mb-2">
                                                            <MapPin className="h-4 w-4 text-gray-400" />
                                                            <span className="font-monument-regular text-sm text-gray-800 tracking-wide uppercase">
                                                                {address.full_name || `Address #${address.id}`}
                                                            </span>
                                                            {address.is_default && (
                                                                <Badge variant="default" className="text-xs">
                                                                    Default
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="space-y-1 text-sm text-gray-600 ml-6">
                                                            <p>{formatAddress(address)}</p>
                                                            {address.phone_number && (
                                                                <div className="flex items-center space-x-2">
                                                                    <Phone className="h-3 w-3 text-gray-400" />
                                                                    <span>{address.phone_number}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                            <MapPin className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <h3 className="font-monument-regular text-lg text-gray-800 mb-2 tracking-wide uppercase">
                                            No Addresses Found
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            This user doesn't have any addresses yet.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Shipments Tab */}
                    <TabsContent value="shipments" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-monument-regular text-lg tracking-wide uppercase flex items-center">
                                    <Truck className="h-5 w-5 mr-2" />
                                    User Shipments ({userShipments.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {shipmentsLoading ? (
                                    <div className="space-y-4">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="animate-pulse p-4 border rounded">
                                                <div className="space-y-2">
                                                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : userShipments.length > 0 ? (
                                    <div className="space-y-4">
                                        {userShipments.map((shipment) => (
                                            <div key={shipment.id} className="p-4 border rounded hover:border-gray-300 transition-colors">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        <Package className="h-5 w-5 text-gray-400" />
                                                        <div>
                                                            <p className="font-monument-regular text-sm text-gray-800 tracking-wide uppercase">
                                                                Shipment #{shipment.id}
                                                            </p>
                                                            <p className="text-xs text-gray-600">
                                                                Tracking: {shipment.tracking_number}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Badge 
                                                        variant={shipment.status === 'delivered' ? 'default' : 'secondary'}
                                                        className="text-xs"
                                                    >
                                                        {shipment.status.replace('_', ' ').toUpperCase()}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                            <Package className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <h3 className="font-monument-regular text-lg text-gray-800 mb-2 tracking-wide uppercase">
                                            No Shipments Found
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            This user doesn't have any shipments yet.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Wallet Tab */}
                    <TabsContent value="wallet" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-monument-regular text-lg tracking-wide uppercase flex items-center">
                                    <Wallet className="h-5 w-5 mr-2" />
                                    User Wallet
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {walletLoading ? (
                                    <div className="animate-pulse space-y-4">
                                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                                        <div className="space-y-2">
                                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                ) : userWallet ? (
                                    <div className="space-y-6">
                                        {/* Balance */}
                                        <div className="text-center p-6 bg-gray-50 rounded-lg">
                                            <h3 className="font-monument-regular text-sm text-gray-700 mb-2 tracking-wide uppercase">
                                                Current Balance
                                            </h3>
                                            <p className="text-3xl font-bold text-gray-900">
                                                {formatCurrency(userWallet.balance)}
                                            </p>
                                        </div>

                                        {/* Transactions */}
                                        <div>
                                            <h3 className="font-monument-regular text-sm text-gray-700 mb-4 tracking-wide uppercase">
                                                Recent Transactions ({userWallet.transactions?.length || 0})
                                            </h3>
                                            {userWallet.transactions && userWallet.transactions.length > 0 ? (
                                                <div className="space-y-3">
                                                    {userWallet.transactions.map((transaction) => (
                                                        <div key={transaction.id} className="flex items-center justify-between p-3 border rounded">
                                                            <div className="flex items-center space-x-3">
                                                                <CreditCard className="h-4 w-4 text-gray-400" />
                                                                <div>
                                                                    <p className="text-sm font-medium">
                                                                        {transaction.type === 'CREDIT' ? 'Credit' : 'Debit'}
                                                                    </p>
                                                                    <p className="text-xs text-gray-600">
                                                                        {formatDate(transaction.timestamp)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className={`text-sm font-medium ${
                                                                    transaction.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                                                                }`}>
                                                                    {transaction.type === 'CREDIT' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                                                                </p>
                                                                <Badge 
                                                                    variant={transaction.status === 'COMPLETED' ? 'default' : 'secondary'}
                                                                    className="text-xs"
                                                                >
                                                                    {transaction.status}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-6">
                                                    <CreditCard className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                                                    <p className="text-sm text-gray-500">No transactions found</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                            <Wallet className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <h3 className="font-monument-regular text-lg text-gray-800 mb-2 tracking-wide uppercase">
                                            Wallet Not Available
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            Unable to load wallet information for this user.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            )}

            {/* Address Dialog */}
            <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="font-monument-regular tracking-wide uppercase">
                            {editingAddress ? `Edit Address #${editingAddress.id}` : 'Add New Address'}
                        </DialogTitle>
                    </DialogHeader>
                    
                    <form onSubmit={handleAddressSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <Label htmlFor="address_line1">Address Line 1 *</Label>
                                <Input
                                    id="address_line1"
                                    value={addressFormData.address_line1}
                                    onChange={(e) => handleAddressChange('address_line1', e.target.value)}
                                    required
                                    placeholder="Street address"
                                />
                            </div>
                            
                            <div className="md:col-span-2">
                                <Label htmlFor="address_line2">Address Line 2</Label>
                                <Input
                                    id="address_line2"
                                    value={addressFormData.address_line2}
                                    onChange={(e) => handleAddressChange('address_line2', e.target.value)}
                                    placeholder="Apartment, suite, etc."
                                />
                            </div>

                            <div>
                                <Label htmlFor="city">City *</Label>
                                <Input
                                    id="city"
                                    value={addressFormData.city}
                                    onChange={(e) => handleAddressChange('city', e.target.value)}
                                    required
                                    placeholder="City"
                                />
                            </div>

                            <div>
                                <Label htmlFor="state_province_region">State/Province *</Label>
                                <Input
                                    id="state_province_region"
                                    value={addressFormData.state_province_region}
                                    onChange={(e) => handleAddressChange('state_province_region', e.target.value)}
                                    required
                                    placeholder="State or Province"
                                />
                            </div>

                            <div>
                                <Label htmlFor="zip_postal_code">ZIP/Postal Code *</Label>
                                <Input
                                    id="zip_postal_code"
                                    value={addressFormData.zip_postal_code}
                                    onChange={(e) => handleAddressChange('zip_postal_code', e.target.value)}
                                    required
                                    placeholder="ZIP code"
                                />
                            </div>

                            <div>
                                <Label htmlFor="country">Country *</Label>
                                <Select 
                                    value={addressFormData.country} 
                                    onValueChange={(value) => handleAddressChange('country', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="USA">United States</SelectItem>
                                        <SelectItem value="Canada">Canada</SelectItem>
                                        <SelectItem value="Mexico">Mexico</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="phone_number">Phone Number</Label>
                                <Input
                                    id="phone_number"
                                    value={addressFormData.phone_number}
                                    onChange={(e) => handleAddressChange('phone_number', e.target.value)}
                                    placeholder="Phone number"
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="is_default"
                                    checked={addressFormData.is_default}
                                    onCheckedChange={(checked) => handleAddressChange('is_default', checked)}
                                />
                                <Label htmlFor="is_default">Set as default address</Label>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2 pt-4">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setShowAddressDialog(false)}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={creatingAddress || updatingAddress}
                            >
                                {(creatingAddress || updatingAddress) ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        {editingAddress ? 'Updating...' : 'Creating...'}
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        {editingAddress ? 'Update Address' : 'Create Address'}
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
