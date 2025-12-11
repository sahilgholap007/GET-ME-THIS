"use client";

import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, AlertTriangle, CheckCircle, X, Shield, Package, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axiosInstance from '../../utils/axiosInstance';

export default function Compliance() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrevious, setHasPrevious] = useState(false);
    
    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    
    // Form states
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        is_active: true
    });
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Categories for dropdown
    const categories = [
        'Batteries',
        'Flammable Liquids',
        'Electronics',
        'Chemicals',
        'Weapons',
        'Drugs',
        'Food Items',
        'Fragile Items',
        'Hazardous Materials',
        'Other'
    ];

    // Fetch prohibited items from API
    const fetchItems = async (search = '', page = 1) => {
        setLoading(true);
        try {
            const params = {
                search,
                page,
                page_size: 12
            };

            // Add filters if they're not 'all'
            if (categoryFilter !== 'all') {
                params.category = categoryFilter;
            }
            if (statusFilter !== 'all') {
                params.is_active = statusFilter === 'active';
            }

            const response = await axiosInstance.get('/api/v1/compliance/admin/prohibited-items/', {
                params
            });

            const data = response.data;
            const itemsList = Array.isArray(data) ? data : data.results || [];
            setItems(itemsList);
            setTotalCount(Array.isArray(data) ? data.length : data.count || 0);
            setHasNext(!!data.next);
            setHasPrevious(!!data.previous);

        } catch (error) {
            console.error('Error fetching prohibited items:', error);
            setErrorMessage('Failed to load prohibited items. Please try again.');
            setItems([]);
            setTotalCount(0);
            setHasNext(false);
            setHasPrevious(false);
        } finally {
            setLoading(false);
        }
    };

    // Load items on component mount
    useEffect(() => {
        fetchItems();
    }, []);

    // Search items with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchItems(searchQuery, 1);
            setCurrentPage(1);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, categoryFilter, statusFilter]);

    // Handle form input changes
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // Clear field error when user starts typing
        if (formErrors[field]) {
            setFormErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    // Validate form
    const validateForm = () => {
        const errors = {};
        
        if (!formData.name.trim()) {
            errors.name = 'Item name is required';
        }
        
        if (!formData.description.trim()) {
            errors.description = 'Description is required';
        }
        
        if (!formData.category.trim()) {
            errors.category = 'Category is required';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            category: '',
            is_active: true
        });
        setFormErrors({});
        setSuccessMessage('');
        setErrorMessage('');
    };

    // Handle create item
    const handleCreateItem = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const response = await axiosInstance.post('/api/v1/compliance/admin/prohibited-items/', formData);

            setSuccessMessage('Prohibited item created successfully!');
            setIsCreateModalOpen(false);
            resetForm();
            fetchItems(searchQuery, currentPage);
            
            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000);

        } catch (error) {
            console.error('Error creating prohibited item:', error);
            if (error.response?.data) {
                setFormErrors(error.response.data);
            } else {
                setErrorMessage('Failed to create prohibited item. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle edit item
    const handleEditItem = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const response = await axiosInstance.patch(`/api/v1/compliance/admin/prohibited-items/${selectedItem.id}/`, formData);

            setSuccessMessage('Prohibited item updated successfully!');
            setIsEditModalOpen(false);
            resetForm();
            setSelectedItem(null);
            fetchItems(searchQuery, currentPage);
            
            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000);

        } catch (error) {
            console.error('Error updating prohibited item:', error);
            if (error.response?.data) {
                setFormErrors(error.response.data);
            } else {
                setErrorMessage('Failed to update prohibited item. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle delete item
    const handleDeleteItem = async () => {
        if (!selectedItem) return;

        setIsSubmitting(true);
        try {
            await axiosInstance.delete(`/api/v1/compliance/admin/prohibited-items/${selectedItem.id}/`);

            setSuccessMessage('Prohibited item deleted successfully!');
            setIsDeleteModalOpen(false);
            setSelectedItem(null);
            fetchItems(searchQuery, currentPage);
            
            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000);

        } catch (error) {
            console.error('Error deleting prohibited item:', error);
            setErrorMessage('Failed to delete prohibited item. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Open edit modal with item data
    const openEditModal = (item) => {
        setSelectedItem(item);
        setFormData({
            name: item.name,
            description: item.description,
            category: item.category,
            is_active: item.is_active
        });
        setIsEditModalOpen(true);
    };

    // Open delete modal
    const openDeleteModal = (item) => {
        setSelectedItem(item);
        setIsDeleteModalOpen(true);
    };

    // Handle pagination
    const handleNextPage = () => {
        if (hasNext) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            fetchItems(searchQuery, nextPage);
        }
    };

    const handlePreviousPage = () => {
        if (hasPrevious) {
            const prevPage = currentPage - 1;
            setCurrentPage(prevPage);
            fetchItems(searchQuery, prevPage);
        }
    };

    // Get unique categories from items for filter
    const getUniqueCategories = () => {
        const uniqueCategories = [...new Set(items.map(item => item.category))];
        return uniqueCategories.filter(Boolean);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="font-monument-regular text-xl sm:text-2xl text-gray-800 tracking-wide uppercase">
                        Compliance Management
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Manage prohibited items and shipping restrictions ({totalCount} total)
                    </p>
                </div>
                
                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm} className="flex items-center space-x-2">
                            <Plus className="h-4 w-4" />
                            <span>Add Prohibited Item</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Create Prohibited Item</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <Label htmlFor="name">Item Name *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        placeholder="Enter prohibited item name"
                                        className={formErrors.name ? 'border-red-500' : ''}
                                    />
                                    {formErrors.name && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                                    )}
                                </div>
                                
                                <div>
                                    <Label htmlFor="category">Category *</Label>
                                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                                        <SelectTrigger className={formErrors.category ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category} value={category}>
                                                    {category}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {formErrors.category && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>
                                    )}
                                </div>
                                
                                <div>
                                    <Label htmlFor="description">Description *</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        placeholder="Enter detailed description of why this item is prohibited"
                                        rows={4}
                                        className={formErrors.description ? 'border-red-500' : ''}
                                    />
                                    {formErrors.description && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
                                    )}
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="is_active"
                                        checked={formData.is_active}
                                        onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                                    />
                                    <Label htmlFor="is_active">Active (enforced)</Label>
                                </div>
                            </div>
                            
                            {errorMessage && (
                                <Alert variant="destructive">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertDescription>{errorMessage}</AlertDescription>
                                </Alert>
                            )}
                            
                            <div className="flex justify-end space-x-2 pt-4">
                                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleCreateItem} disabled={isSubmitting}>
                                    {isSubmitting ? 'Creating...' : 'Create Item'}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Success/Error Messages */}
            {successMessage && (
                <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
                </Alert>
            )}

            {errorMessage && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
            )}

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        type="text"
                        placeholder="Search prohibited items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                
                <div className="flex gap-2">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                    {category}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-32">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Items Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                        <Card key={index} className="animate-pulse">
                            <CardContent className="p-4">
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                                <div className="h-16 bg-gray-200 rounded mb-4"></div>
                                <div className="h-6 bg-gray-200 rounded w-20"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : items.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map((item) => (
                            <Card key={item.id} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center space-x-2">
                                            <div className={`p-2 rounded-full ${item.is_active ? 'bg-red-100' : 'bg-gray-100'}`}>
                                                {item.is_active ? (
                                                    <AlertTriangle className="h-4 w-4 text-red-600" />
                                                ) : (
                                                    <Package className="h-4 w-4 text-gray-400" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg truncate">
                                                    {item.name}
                                                </h3>
                                                <Badge variant="outline" className="text-xs mt-1">
                                                    {item.category}
                                                </Badge>
                                            </div>
                                        </div>
                                        
                                        <div className="flex space-x-1">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => openEditModal(item)}
                                                className="h-8 w-8 p-0"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => openDeleteModal(item)}
                                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                        {item.description}
                                    </p>
                                    
                                    <div className="flex items-center justify-between">
                                        <Badge 
                                            variant={item.is_active ? "destructive" : "secondary"}
                                            className="text-xs"
                                        >
                                            {item.is_active ? "Active" : "Inactive"}
                                        </Badge>
                                        
                                        <Badge variant="outline" className="text-xs">
                                            ID: {item.id}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Pagination */}
                    {(hasNext || hasPrevious) && (
                        <div className="flex items-center justify-between">
                            <Button
                                variant="outline"
                                onClick={handlePreviousPage}
                                disabled={!hasPrevious}
                            >
                                Previous
                            </Button>
                            <span className="text-sm text-gray-500">
                                Page {currentPage} • {totalCount} total items
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
                    <div className="bg-gray-100 p-6 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                        <Shield className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">No prohibited items found</h3>
                    <p className="text-gray-600 mb-4">
                        {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all' 
                            ? 'No items match your search criteria.' 
                            : 'Get started by adding your first prohibited item.'
                        }
                    </p>
                    <Button onClick={() => setIsCreateModalOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Item
                    </Button>
                </Card>
            )}

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Prohibited Item</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <Label htmlFor="edit-name">Item Name *</Label>
                                <Input
                                    id="edit-name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="Enter prohibited item name"
                                    className={formErrors.name ? 'border-red-500' : ''}
                                />
                                {formErrors.name && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                                )}
                            </div>
                            
                            <div>
                                <Label htmlFor="edit-category">Category *</Label>
                                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                                    <SelectTrigger className={formErrors.category ? 'border-red-500' : ''}>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {formErrors.category && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>
                                )}
                            </div>
                            
                            <div>
                                <Label htmlFor="edit-description">Description *</Label>
                                <Textarea
                                    id="edit-description"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    placeholder="Enter detailed description of why this item is prohibited"
                                    rows={4}
                                    className={formErrors.description ? 'border-red-500' : ''}
                                />
                                {formErrors.description && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
                                )}
                            </div>
                            
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="edit-is_active"
                                    checked={formData.is_active}
                                    onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                                />
                                <Label htmlFor="edit-is_active">Active (enforced)</Label>
                            </div>
                        </div>
                        
                        {errorMessage && (
                            <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>{errorMessage}</AlertDescription>
                            </Alert>
                        )}
                        
                        <div className="flex justify-end space-x-2 pt-4">
                            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleEditItem} disabled={isSubmitting}>
                                {isSubmitting ? 'Updating...' : 'Update Item'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Delete Prohibited Item</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-full bg-red-100">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">
                                    Are you sure you want to delete this item?
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    "{selectedItem?.name}" will be permanently removed from the prohibited items list.
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDeleteItem} disabled={isSubmitting}>
                                {isSubmitting ? 'Deleting...' : 'Delete Item'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
