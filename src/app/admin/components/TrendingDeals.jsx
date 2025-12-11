"use client";

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ExternalLink, DollarSign, Calendar, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import axiosInstance from '../../utils/axiosInstance';

export default function TrendingDeals() {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrevious, setHasPrevious] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedDeal, setSelectedDeal] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: '',
        price: '',
        currency: 'USD',
        external_link: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [submitLoading, setSubmitLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Fetch deals from API
    const fetchDeals = async (search = '', page = 1) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/api/v1/deals/admin/trending-deals/', {
                params: {
                    search,
                    page,
                    page_size: 12
                }
            });

            const data = response.data;
            const dealsList = Array.isArray(data) ? data : data.results || [];
            setDeals(dealsList);
            setTotalCount(Array.isArray(data) ? data.length : data.count || 0);
            setHasNext(!!data.next);
            setHasPrevious(!!data.previous);

        } catch (error) {
            console.error('Error fetching deals:', error);
            setErrorMessage('Failed to fetch deals. Please try again.');
            setDeals([]);
            setTotalCount(0);
            setHasNext(false);
            setHasPrevious(false);
        } finally {
            setLoading(false);
        }
    };

    // Load deals on component mount
    useEffect(() => {
        fetchDeals();
    }, []);

    // Search deals with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchDeals(searchQuery, 1);
            setCurrentPage(1);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    // Handle pagination
    const handleNextPage = () => {
        if (hasNext) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            fetchDeals(searchQuery, nextPage);
        }
    };

    const handlePreviousPage = () => {
        if (hasPrevious) {
            const prevPage = currentPage - 1;
            setCurrentPage(prevPage);
            fetchDeals(searchQuery, prevPage);
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            image: '',
            price: '',
            currency: 'USD',
            external_link: ''
        });
        setFormErrors({});
        setSelectedDeal(null);
    };

    // Handle form input changes
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // Clear error for this field when user starts typing
        if (formErrors[field]) {
            setFormErrors(prev => ({
                ...prev,
                [field]: null
            }));
        }
    };

    // Validate form
    const validateForm = () => {
        const errors = {};
        
        if (!formData.name.trim()) {
            errors.name = 'Deal name is required';
        } else if (formData.name.length > 255) {
            errors.name = 'Deal name must be less than 255 characters';
        }

        if (!formData.description.trim()) {
            errors.description = 'Description is required';
        }

        if (!formData.image.trim()) {
            errors.image = 'Image URL is required';
        } else if (!isValidUrl(formData.image)) {
            errors.image = 'Please enter a valid image URL';
        }

        if (!formData.price.trim()) {
            errors.price = 'Price is required';
        } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0) {
            errors.price = 'Please enter a valid price';
        }

        if (!formData.external_link.trim()) {
            errors.external_link = 'External link is required';
        } else if (!isValidUrl(formData.external_link)) {
            errors.external_link = 'Please enter a valid URL';
        }

        return errors;
    };

    // URL validation helper
    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    // Create deal
    const handleCreateDeal = async () => {
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setSubmitLoading(true);
        try {
            const response = await axiosInstance.post('/api/v1/deals/admin/trending-deals/', formData);
            setSuccessMessage('Deal created successfully!');
            setIsCreateModalOpen(false);
            resetForm();
            fetchDeals(searchQuery, currentPage);
            
            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error creating deal:', error);
            if (error.response?.data) {
                setFormErrors(error.response.data);
            } else {
                setErrorMessage('Failed to create deal. Please try again.');
            }
        } finally {
            setSubmitLoading(false);
        }
    };

    // Edit deal
    const handleEditDeal = async () => {
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setSubmitLoading(true);
        try {
            const response = await axiosInstance.patch(`/api/v1/deals/admin/trending-deals/${selectedDeal.id}/`, formData);
            setSuccessMessage('Deal updated successfully!');
            setIsEditModalOpen(false);
            resetForm();
            fetchDeals(searchQuery, currentPage);
            
            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error updating deal:', error);
            if (error.response?.data) {
                setFormErrors(error.response.data);
            } else {
                setErrorMessage('Failed to update deal. Please try again.');
            }
        } finally {
            setSubmitLoading(false);
        }
    };

    // Delete deal
    const handleDeleteDeal = async (dealId) => {
        if (!confirm('Are you sure you want to delete this deal? This action cannot be undone.')) {
            return;
        }

        try {
            await axiosInstance.delete(`/api/v1/deals/admin/trending-deals/${dealId}/`);
            setSuccessMessage('Deal deleted successfully!');
            fetchDeals(searchQuery, currentPage);
            
            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error deleting deal:', error);
            setErrorMessage('Failed to delete deal. Please try again.');
        }
    };

    // Open edit modal
    const openEditModal = (deal) => {
        setSelectedDeal(deal);
        setFormData({
            name: deal.name,
            description: deal.description,
            image: deal.image,
            price: deal.price,
            currency: deal.currency,
            external_link: deal.external_link
        });
        setIsEditModalOpen(true);
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="font-monument-regular text-xl sm:text-2xl text-gray-800 tracking-wide uppercase">
                        Trending Deals
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Manage and monitor trending deals ({totalCount} total)
                    </p>
                </div>
                
                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm} className="flex items-center space-x-2">
                            <Plus className="h-4 w-4" />
                            <span>Create Deal</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Create New Trending Deal</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Deal Name *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        placeholder="Enter deal name"
                                        className={formErrors.name ? 'border-red-500' : ''}
                                    />
                                    {formErrors.name && (
                                        <p className="text-sm text-red-500">{formErrors.name}</p>
                                    )}
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price *</Label>
                                    <div className="flex">
                                        <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                                            <SelectTrigger className="w-20">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="USD">USD</SelectItem>
                                                <SelectItem value="EUR">EUR</SelectItem>
                                                <SelectItem value="GBP">GBP</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Input
                                            id="price"
                                            type="number"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={(e) => handleInputChange('price', e.target.value)}
                                            placeholder="0.00"
                                            className={`ml-2 flex-1 ${formErrors.price ? 'border-red-500' : ''}`}
                                        />
                                    </div>
                                    {formErrors.price && (
                                        <p className="text-sm text-red-500">{formErrors.price}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description *</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    placeholder="Enter deal description"
                                    rows={3}
                                    className={formErrors.description ? 'border-red-500' : ''}
                                />
                                {formErrors.description && (
                                    <p className="text-sm text-red-500">{formErrors.description}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image">Image URL *</Label>
                                <Input
                                    id="image"
                                    value={formData.image}
                                    onChange={(e) => handleInputChange('image', e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                    className={formErrors.image ? 'border-red-500' : ''}
                                />
                                {formErrors.image && (
                                    <p className="text-sm text-red-500">{formErrors.image}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="external_link">External Link *</Label>
                                <Input
                                    id="external_link"
                                    value={formData.external_link}
                                    onChange={(e) => handleInputChange('external_link', e.target.value)}
                                    placeholder="https://store.example.com/deal"
                                    className={formErrors.external_link ? 'border-red-500' : ''}
                                />
                                {formErrors.external_link && (
                                    <p className="text-sm text-red-500">{formErrors.external_link}</p>
                                )}
                            </div>

                            <div className="flex justify-end space-x-2 pt-4">
                                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleCreateDeal} disabled={submitLoading}>
                                    {submitLoading ? 'Creating...' : 'Create Deal'}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Success/Error Messages */}
            {successMessage && (
                <Alert className="border-green-200 bg-green-50">
                    <AlertDescription className="text-green-800">
                        {successMessage}
                    </AlertDescription>
                </Alert>
            )}

            {errorMessage && (
                <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">
                        {errorMessage}
                    </AlertDescription>
                </Alert>
            )}

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        type="text"
                        placeholder="Search deals..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Deals Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                        <Card key={index} className="animate-pulse">
                            <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                            <CardContent className="p-4">
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                                <div className="flex justify-between items-center">
                                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                                    <div className="flex space-x-2">
                                        <div className="h-8 w-8 bg-gray-200 rounded"></div>
                                        <div className="h-8 w-8 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : deals.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {deals.map((deal) => (
                            <Card key={deal.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={deal.image || "/placeholder.svg"}
                                        alt={deal.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = '/placeholder.svg?height=200&width=300&text=Deal+Image';
                                        }}
                                    />
                                    <div className="absolute top-2 right-2">
                                        <Badge variant="secondary" className="bg-white/90">
                                            {deal.currency} {deal.price}
                                        </Badge>
                                    </div>
                                </div>
                                
                                <CardContent className="p-4">
                                    <div className="space-y-3">
                                        <div>
                                            <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                                                {deal.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                                                {deal.description}
                                            </p>
                                        </div>
                                        
                                        <div className="flex items-center text-xs text-gray-500">
                                            <Calendar className="h-3 w-3 mr-1" />
                                            {formatDate(deal.created_at)}
                                        </div>
                                        
                                        <div className="flex justify-between items-center pt-2">
                                            <a
                                                href={deal.external_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                                            >
                                                <ExternalLink className="h-3 w-3 mr-1" />
                                                View Deal
                                            </a>
                                            
                                            <div className="flex space-x-1">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => openEditModal(deal)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <Edit className="h-3 w-3" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDeleteDeal(deal.id)}
                                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Pagination */}
                    {(hasNext || hasPrevious) && (
                        <div className="flex items-center justify-between pt-6">
                            <Button
                                variant="outline"
                                onClick={handlePreviousPage}
                                disabled={!hasPrevious}
                            >
                                Previous
                            </Button>
                            <span className="text-sm text-gray-500">
                                Page {currentPage} of {Math.ceil(totalCount / 12)}
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
                </>
            ) : (
                <Card className="p-12 text-center">
                    <div className="space-y-4">
                        <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                            <DollarSign className="h-8 w-8 text-gray-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg text-gray-900">No deals found</h3>
                            <p className="text-gray-600 mt-1">
                                {searchQuery ? 'Try adjusting your search terms' : 'Get started by creating your first trending deal'}
                            </p>
                        </div>
                        {!searchQuery && (
                            <Button onClick={() => setIsCreateModalOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Create Your First Deal
                            </Button>
                        )}
                    </div>
                </Card>
            )}

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Trending Deal</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Deal Name *</Label>
                                <Input
                                    id="edit-name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="Enter deal name"
                                    className={formErrors.name ? 'border-red-500' : ''}
                                />
                                {formErrors.name && (
                                    <p className="text-sm text-red-500">{formErrors.name}</p>
                                )}
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="edit-price">Price *</Label>
                                <div className="flex">
                                    <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                                        <SelectTrigger className="w-20">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="USD">USD</SelectItem>
                                            <SelectItem value="EUR">EUR</SelectItem>
                                            <SelectItem value="GBP">GBP</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Input
                                        id="edit-price"
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => handleInputChange('price', e.target.value)}
                                        placeholder="0.00"
                                        className={`ml-2 flex-1 ${formErrors.price ? 'border-red-500' : ''}`}
                                    />
                                </div>
                                {formErrors.price && (
                                    <p className="text-sm text-red-500">{formErrors.price}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-description">Description *</Label>
                            <Textarea
                                id="edit-description"
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                placeholder="Enter deal description"
                                rows={3}
                                className={formErrors.description ? 'border-red-500' : ''}
                            />
                            {formErrors.description && (
                                <p className="text-sm text-red-500">{formErrors.description}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-image">Image URL *</Label>
                            <Input
                                id="edit-image"
                                value={formData.image}
                                onChange={(e) => handleInputChange('image', e.target.value)}
                                placeholder="https://example.com/image.jpg"
                                className={formErrors.image ? 'border-red-500' : ''}
                            />
                            {formErrors.image && (
                                <p className="text-sm text-red-500">{formErrors.image}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-external_link">External Link *</Label>
                            <Input
                                id="edit-external_link"
                                value={formData.external_link}
                                onChange={(e) => handleInputChange('external_link', e.target.value)}
                                placeholder="https://store.example.com/deal"
                                className={formErrors.external_link ? 'border-red-500' : ''}
                            />
                            {formErrors.external_link && (
                                <p className="text-sm text-red-500">{formErrors.external_link}</p>
                            )}
                        </div>

                        <div className="flex justify-end space-x-2 pt-4">
                            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleEditDeal} disabled={submitLoading}>
                                {submitLoading ? 'Updating...' : 'Update Deal'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
