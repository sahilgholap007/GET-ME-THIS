"use client";

import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, User, Edit, Trash2, Plus, Home } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import axiosInstance from '../../utils/axiosInstance';

export default function AddressBook({ selectedUser }) {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch user's address
    const fetchUserAddress = async (userId) => {
        if (!userId) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await axiosInstance.get(`/api/v1/users/admin/addresses/?user=${userId}`);
            setAddresses(response.data || []);
            if (response.data.length === 0) {
                setError('No addresses found for this user');
            }
        } catch (error) {
            console.error('Error fetching user addresses:', error);
            if (error.response?.status === 404) {
                setError('No addresses found for this user');
            } else {
                setError('Failed to load address information');
            }
            setAddresses([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch address when selectedUser changes
    useEffect(() => {
        if (selectedUser?.id) {
            fetchUserAddress(selectedUser.id);
        } else {
            setAddresses([]);
            setError(null);
        }
    }, [selectedUser]);

    // Format address for display
    const formatAddress = (addressData) => {
        if (!addressData) return '';
        
        const parts = [
            addressData.address_line1,
            addressData.address_line2,
            addressData.city,
            addressData.state_province_region,
            addressData.zip_postal_code,
            addressData.country
        ].filter(Boolean);
        
        return parts.join(', ');
    };

    // Loading skeleton
    const AddressSkeleton = () => (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-5 w-16" />
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="flex space-x-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                </div>
            </CardContent>
        </Card>
    );

    if (!selectedUser) {
        return (
            <div className="text-center py-12">
                <div className="bg-gray-100 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <MapPin className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="font-monument-regular text-xl text-gray-800 mb-4 tracking-wide uppercase">
                    Address Book
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                    Select a user from the list to view their address information.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-monument-regular text-2xl text-gray-800 mb-2 tracking-wide uppercase">
                        Address Book
                    </h2>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <User className="h-4 w-4" />
                        <span>
                            {selectedUser.full_name || selectedUser.last_name
                                ? `${selectedUser.full_name || ''}`.trim()
                                : 'Admin User'
                            }
                        </span>
                        <span className="text-gray-400">•</span>
                        <span>{selectedUser.email}</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AddressSkeleton />
                </div>
            ) : error ? (
                <Card className="border-dashed border-2 border-gray-300">
                    <CardContent className="text-center py-12">
                        <div className="bg-gray-100 p-6 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                            <MapPin className="h-10 w-10 text-gray-400" />
                        </div>
                        <h3 className="font-monument-regular text-lg text-gray-800 mb-2 tracking-wide uppercase">
                            No Address Found
                        </h3>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <Button variant="outline" size="sm" className="flex items-center space-x-2 mx-auto">
                            <Plus className="h-4 w-4" />
                            <span>Add First Address</span>
                        </Button>
                    </CardContent>
                </Card>
            ) : addresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((address) => (
                        <div key={address.id}>
                            {/* Address Card */}
                            <Card className="relative">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center space-x-2">
                                            <Home className="h-5 w-5 text-gray-600" />
                                            <span className="font-monument-regular text-lg tracking-wide uppercase">
                                                Address
                                            </span>
                                        </CardTitle>
                                        {address.is_default && (
                                            <Badge variant="default" className="text-xs">
                                                Default
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Address Lines */}
                                    <div className="space-y-2">
                                        <div className="flex items-start space-x-3">
                                            <MapPin className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {address.address_line1}
                                                </p>
                                                {address.address_line2 && (
                                                    <p className="text-sm text-gray-600">
                                                        {address.address_line2}
                                                    </p>
                                                )}
                                                {address.suite_number && (
                                                    <p className="text-sm text-gray-600">
                                                        Suite {address.suite_number}
                                                    </p>
                                                )}
                                                <p className="text-sm text-gray-600">
                                                    {address.city}, {address.state_province_region} {address.zip_postal_code}
                                                </p>
                                                <p className="text-sm text-gray-600 font-medium">
                                                    {address.country}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Phone Number */}
                                    {address.phone_number && (
                                        <div className="flex items-center space-x-3">
                                            <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                            <span className="text-sm text-gray-900">
                                                {address.phone_number}
                                            </span>
                                        </div>
                                    )}

                                    {/* User Email */}
                                    <div className="flex items-center space-x-3">
                                        <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                        <span className="text-sm text-gray-900">
                                            {selectedUser.email}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
}
