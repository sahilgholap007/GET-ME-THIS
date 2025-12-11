"use client";

import { useState, useEffect } from 'react';
import { Search, User, ChevronDown, ChevronUp, Menu, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import axiosInstance from '../../utils/axiosInstance';
import AddressBook from '../components/AddressBook';
import Mailbox from '../components/Mailbox';
import Account from '../components/Accounts';
import TrendingDeals from '../components/TrendingDeals';
import Compliance from '../components/Compliance';
import PersonalShopper from '../components/PersonalShopper';
import Billing from '../components/Billing';
import Shipment from '../components/Shipment';
import CourierPartners from '../components/CourierPartners';

export default function AdminDashboard() {
    const [users, setUsers] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrevious, setHasPrevious] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Component visibility states
    const [showTrendingDeals, setShowTrendingDeals] = useState(false);
    const [showStore, setShowStore] = useState(false);
    const [showCompliance, setShowCompliance] = useState(false);
    const [showRewards, setShowRewards] = useState(false);
    const [showPersonalShopper, setShowPersonalShopper] = useState(false);
    const [showBilling, setShowBilling] = useState(false);
    const [showMyAccount, setShowMyAccount] = useState(false);
    const [showAddressbook, setShowAddressbook] = useState(false);
    const [showMailbox, setShowMailbox] = useState(false);
    const [showshipment, setShowShipment] = useState(false)
    const [showCourierPartners, setShowCourierPartners] = useState(false)

    // Fetch users from API
    const fetchUsers = async (search = '', page = 1) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/api/v1/users/admin/accounts/', {
                params: {
                    search,
                    page,
                    page_size: 10
                }
            });

            const data = response.data;
            const usersList = Array.isArray(data) ? data : data.results || [];
            setUsers(usersList);
            setTotalCount(Array.isArray(data) ? data.length : data.count || 0);
            setHasNext(!!data.next);
            setHasPrevious(!!data.previous);

        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]);
            setTotalCount(0);
            setHasNext(false);
            setHasPrevious(false);
        } finally {
            setLoading(false);
        }
    };

    // Load users on component mount
    useEffect(() => {
        fetchUsers();
    }, []);

    // Search users with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchUsers(searchQuery, 1);
            setCurrentPage(1);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    // Hide all components
    const hideAllComponents = () => {
        setShowTrendingDeals(false);
        setShowStore(false);
        setShowCompliance(false);
        setShowRewards(false);
        setShowPersonalShopper(false);
        setShowBilling(false);
        setShowMyAccount(false);
        setShowAddressbook(false);
        setShowMailbox(false);
        setShowShipment(false);
        setIsMobileMenuOpen(false);
        setShowCourierPartners(false);
    };

    // Admin section handlers
    const handleTrendingDealsClick = () => { hideAllComponents(); setShowTrendingDeals(true); };
    const handleStoreClick = () => { hideAllComponents(); setShowStore(true); };
    const handleComplianceClick = () => { hideAllComponents(); setShowCompliance(true); };
    const handleRewardsClick = () => { hideAllComponents(); setShowRewards(true); };
    const handleCourierPartnerClick = () => { hideAllComponents(); setShowCourierPartners(true); }

    // User section handlers
    const handlePersonalShopperClick = () => { hideAllComponents(); setShowPersonalShopper(true); };
    const handleBillingClick = () => { hideAllComponents(); setShowBilling(true); };
    const handleMyAccountClick = () => { hideAllComponents(); setShowMyAccount(true); };
    const handleAddressbookClick = () => { hideAllComponents(); setShowAddressbook(true); };
    const handleMailboxClick = () => { hideAllComponents(); setShowMailbox(true); };
    const handleShipmentClick = () => { hideAllComponents(); setShowShipment(true) };

    // Handle user selection
    const handleUserSelect = (user) => {
        setSelectedUser(user);
        hideAllComponents();
    };

    // Handle pagination
    const handleNextPage = () => {
        if (hasNext) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            fetchUsers(searchQuery, nextPage);
        }
    };

    const handlePreviousPage = () => {
        if (hasPrevious) {
            const prevPage = currentPage - 1;
            setCurrentPage(prevPage);
            fetchUsers(searchQuery, prevPage);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-gray-200 border-b border-gray-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 lg:pt-32 pb-8 sm:pb-12">
                    <div className="text-center mb-8 sm:mb-12 px-4">
                        <h1 className="font-monument-regular text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-gray-600 tracking-widest uppercase">
                            ADMIN DASHBOARD
                        </h1>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex justify-center mb-6">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="flex items-center space-x-2"
                        >
                            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                            <span className="text-xs font-monument-ultralight tracking-wide">
                                {isMobileMenuOpen ? 'CLOSE MENU' : 'OPEN MENU'}
                            </span>
                        </Button>
                    </div>

                    {/* Navigation - Desktop */}
                    <div className="hidden lg:flex flex-wrap justify-center lg:justify-between gap-8 lg:gap-16">
                        {/* Admin Tasks Section */}
                        <div className="text-left">
                            <h2 className="font-monument-regular text-sm text-gray-700 mb-6 tracking-[0.15em] uppercase">Admin Tasks</h2>
                            <div className="space-y-3 text-xs text-gray-600 font-monument-ultralight leading-relaxed">
                                <div onClick={handleTrendingDealsClick} className="block tracking-wide transition-colors hover:text-gray-900 cursor-pointer">TRENDING DEALS</div>
                                <div onClick={handleStoreClick} className="block tracking-wide transition-colors hover:text-gray-900 cursor-pointer">STORE</div>
                                <div onClick={handleComplianceClick} className="block tracking-wide transition-colors hover:text-gray-900 cursor-pointer">COMPLIANCE</div>
                                <div onClick={handleCourierPartnerClick} className="block tracking-wide transition-colors hover:text-gray-900 cursor-pointer">COURIER PARTNERS</div>
                            </div>
                        </div>

                        {/* User Management Section - Only show when user is selected */}
                        {selectedUser && (
                            <>
                                <div className="text-left">
                                    <h2 className="font-monument-regular text-sm text-gray-700 mb-6 tracking-[0.15em] uppercase">
                                        User Services
                                    </h2>
                                    <div className="space-y-3 text-xs text-gray-600 font-monument-ultralight leading-relaxed">
                                        <div onClick={handlePersonalShopperClick} className="block tracking-wide transition-colors hover:text-gray-900 cursor-pointer">PERSONAL SHOPPER</div>
                                        <div onClick={handleBillingClick} className="block tracking-wide transition-colors hover:text-gray-900 cursor-pointer">BILLING</div>
                                        <div onClick={handleMyAccountClick} className="block tracking-wide transition-colors hover:text-gray-900 cursor-pointer">MY ACCOUNT</div>
                                    </div>
                                </div>

                                <div className="text-left">
                                    <h2 className="font-monument-regular text-sm text-gray-700 mb-6 tracking-[0.15em] uppercase">
                                        User Account
                                    </h2>
                                    <div className="space-y-3 text-xs text-gray-600 font-monument-ultralight leading-relaxed">
                                        <div onClick={handleAddressbookClick} className="block tracking-wide transition-colors hover:text-gray-900 cursor-pointer">ADDRESS BOOK</div>
                                        <div onClick={handleMailboxClick} className="block tracking-wide transition-colors hover:text-gray-900 cursor-pointer">MAILBOX</div>
                                        <div onClick={handleShipmentClick} className='block tracking-wide transition-colors hover:text-gray-900 cursor-pointer'>SHIPMENT</div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Placeholder when no user is selected */}
                        {!selectedUser && (
                            <div className="text-left">
                                <h2 className="font-monument-regular text-sm text-gray-700 mb-6 tracking-[0.15em] uppercase">
                                    User Management
                                </h2>
                                <div className="space-y-3 text-xs text-gray-500 font-monument-ultralight leading-relaxed">
                                    <div className="block tracking-wide">SELECT A USER TO MANAGE THEIR ACCOUNT</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Navigation - Mobile */}
                    {isMobileMenuOpen && (
                        <div className="lg:hidden bg-white rounded-lg shadow-lg p-6 mt-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* Admin Tasks Section */}
                                <div className="text-left">
                                    <h2 className="font-monument-regular text-sm text-gray-700 mb-4 tracking-[0.15em] uppercase">Admin Tasks</h2>
                                    <div className="space-y-2 text-xs text-gray-600 font-monument-ultralight leading-relaxed">
                                        <div onClick={handleTrendingDealsClick} className="block tracking-wide transition-colors hover:text-gray-900 cursor-pointer py-2 px-3 rounded hover:bg-gray-50">TRENDING DEALS</div>
                                        <div onClick={handleStoreClick} className="block tracking-wide transition-colors hover:text-gray-900 cursor-pointer py-2 px-3 rounded hover:bg-gray-50">STORE</div>
                                        <div onClick={handleComplianceClick} className="block tracking-wide transition-colors hover:text-gray-900 cursor-pointer py-2 px-3 rounded hover:bg-gray-50">COMPLIANCE</div>
                                        <div onClick={handleCourierPartnerClick} className="block tracking-wide transition-colors hover:text-gray-900 cursor-pointer py-2 px-3 rounded hover:bg-gray-50">COURIER PARTNERS</div>
                                    </div>
                                </div>

                                {/* User Management Section */}
                                {selectedUser ? (
                                    <div className="text-left">
                                        <h2 className="font-monument-regular text-sm text-gray-700 mb-4 tracking-[0.15em] uppercase">
                                            User Services
                                        </h2>
                                        <div className="space-y-2 text-xs text-gray-600 font-monument-ultralight leading-relaxed">
                                            <div onClick={handlePersonalShopperClick} className="block tracking-wide transition-colors hover:text-gray-900 cursor-pointer py-2 px-3 rounded hover:bg-gray-50">PERSONAL SHOPPER</div>
                                            <div onClick={handleBillingClick} className="block tracking-wide transition-colors hover:text-gray-900 cursor-pointer py-2 px-3 rounded hover:bg-gray-50">BILLING</div>
                                            <div onClick={handleMyAccountClick} className="block tracking-wide transition-colors hover:text-gray-900 cursor-pointer py-2 px-3 rounded hover:bg-gray-50">MY ACCOUNT</div>
                                            <div onClick={handleAddressbookClick} className="block tracking-wide transition-colors hover:text-gray-900 cursor-pointer py-2 px-3 rounded hover:bg-gray-50">ADDRESS BOOK</div>
                                            <div onClick={handleMailboxClick} className="block tracking-wide transition-colors hover:text-gray-900 cursor-pointer py-2 px-3 rounded hover:bg-gray-50">MAILBOX</div>
                                            <div onClick={handleShipmentClick} className="block tracking-wide transition-colors hover:text-gray-900 cursor-pointer py-2 px-3 rounded hover:bg-gray-50">SHIPMENT</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-left">
                                        <h2 className="font-monument-regular text-sm text-gray-700 mb-4 tracking-[0.15em] uppercase">
                                            User Management
                                        </h2>
                                        <div className="text-xs text-gray-500 font-monument-ultralight leading-relaxed">
                                            <div className="block tracking-wide py-2 px-3">SELECT A USER TO MANAGE THEIR ACCOUNT</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-screen mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: User Search and List */}
                    <div className="lg:col-span-1 order-1 lg:order-1">
                        <div className="space-y-4">
                            {/* Search Bar */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 h-10 sm:h-12 text-sm bg-white border-gray-300 focus:border-gray-500"
                                />
                            </div>

                            {/* Selected User Display */}
                            {selectedUser && (
                                <Card className="bg-blue-50 border-blue-200">
                                    <CardContent className="p-3 sm:p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start space-x-3 min-w-0 flex-1">
                                                <User className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0 mt-1" />
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="font-monument-regular text-sm text-gray-800 truncate">
                                                        {selectedUser.first_name || selectedUser.last_name
                                                            ? `${selectedUser.first_name || ''} ${selectedUser.last_name || ''}`.trim()
                                                            : 'Admin User'
                                                        }
                                                    </h3>
                                                    <p className="text-xs text-gray-600 truncate">{selectedUser.email}</p>
                                                    <div className="mt-2 space-y-1">
                                                        <p className="text-xs text-gray-500">Suite: {selectedUser.suite_number}</p>
                                                        <p className="text-xs text-gray-500">Code: {selectedUser.referral_code}</p>
                                                        {selectedUser.phone_number && (
                                                            <p className="text-xs text-gray-500 truncate">Phone: {selectedUser.phone_number}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col space-y-2 ml-2">
                                                <Badge variant={selectedUser.is_active ? "default" : "secondary"} className="text-xs">
                                                    {selectedUser.is_active ? "Active" : "Inactive"}
                                                </Badge>
                                                {selectedUser.is_staff && (
                                                    <Badge variant="outline" className="text-xs">Staff</Badge>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Users List */}
                            <Card className="h-64 sm:h-80 lg:h-96 overflow-hidden flex flex-col">
                                <div className="p-3 sm:p-4 border-b border-gray-100 flex-shrink-0">
                                    <div className="flex items-center justify-between">
                                        <h2 className="font-monument-regular text-sm text-gray-800 tracking-wide uppercase">
                                            Users ({totalCount})
                                        </h2>
                                        {loading && (
                                            <div className="text-xs text-gray-500">Loading...</div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto">
                                    {loading ? (
                                        <div className="p-4 text-center text-gray-500 text-sm">Loading users...</div>
                                    ) : (users && users.length > 0) ? (
                                        <>
                                            {users.map((user) => (
                                                <div
                                                    key={user.id}
                                                    onClick={() => handleUserSelect(user)}
                                                    className={`p-3 sm:p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${selectedUser && selectedUser.id === user.id ? 'bg-blue-50 border-blue-200' : ''
                                                        }`}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="min-w-0 flex-1">
                                                            <h4 className="font-monument-regular text-sm text-gray-800 truncate">
                                                                {user.first_name || user.last_name
                                                                    ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                                                                    : 'Admin User'
                                                                }
                                                            </h4>
                                                            <p className="text-xs text-gray-600 truncate mt-1">{user.email || ''}</p>
                                                            <p className="text-xs text-gray-500 mt-1">Suite: {user.suite_number || 'N/A'}</p>
                                                        </div>
                                                        <div className="flex flex-col space-y-1 ml-2">
                                                            <Badge variant={user.is_active ? "default" : "secondary"} className="text-xs">
                                                                {user.is_active ? "Active" : "Inactive"}
                                                            </Badge>
                                                            {user.is_staff && (
                                                                <Badge variant="outline" className="text-xs">Staff</Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        <div className="p-4 text-center text-gray-500">
                                            <User className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                                            <p className="text-sm">
                                                {searchQuery ? 'No users found' : 'No users available'}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Pagination */}
                                {(hasNext || hasPrevious) && (
                                    <div className="p-3 sm:p-4 border-t border-gray-100 flex items-center justify-between flex-shrink-0">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handlePreviousPage}
                                            disabled={!hasPrevious}
                                            className="text-xs"
                                        >
                                            Previous
                                        </Button>
                                        <span className="text-xs text-gray-500">
                                            Page {currentPage}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleNextPage}
                                            disabled={!hasNext}
                                            className="text-xs"
                                        >
                                            Next
                                        </Button>
                                    </div>
                                )}
                            </Card>
                        </div>
                    </div>

                    {/* Right Column: Content Area */}
                    <div className="lg:col-span-2 order-2 lg:order-2">
                        <Card className="min-h-[400px] sm:min-h-[500px]">
                            <CardContent className="p-4 sm:p-6 lg:p-8">
                                {/* Admin Components */}
                                {showTrendingDeals && (
                                    <TrendingDeals />
                                )}

                                {showStore && (
                                    <div>
                                        <h2 className="font-monument-regular text-xl sm:text-2xl text-gray-800 mb-4 sm:mb-6 tracking-wide uppercase">Store</h2>
                                        <p className="text-gray-600">Store management component would be rendered here.</p>
                                    </div>
                                )}

                                {showCompliance && (
                                    <Compliance />
                                )}

                                {showCourierPartners && (
                                    <CourierPartners />
                                )}



                                {/* Address Book Component */}
                                {showAddressbook && (
                                    <AddressBook selectedUser={selectedUser} />
                                )}

                                {/* User-specific Components */}
                                {selectedUser && (
                                    <>
                                        {showPersonalShopper && (
                                            <PersonalShopper />
                                        )}

                                        {showBilling && (
                                            <Billing selectedUser={selectedUser} />
                                        )}

                                        {showMyAccount && (
                                            <Account selectedUser={selectedUser} />
                                        )}

                                        {showMailbox && (
                                            <Mailbox selectedUser={selectedUser} />
                                        )}
                                        {showshipment && (
                                            <Shipment selectedUser={selectedUser} />
                                        )}
                                    </>
                                )}

                                {/* Default Welcome State */}
                                {!showTrendingDeals && !showStore && !showCompliance && !showRewards &&
                                    !showPersonalShopper && !showBilling && !showMyAccount &&
                                    !showAddressbook && !showMailbox && !showshipment && !showCourierPartners && (
                                        <div className="text-center py-8 sm:py-12">
                                            <div className="bg-gray-100 p-4 sm:p-6 rounded-full w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                                                <User className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
                                            </div>
                                            <h3 className="font-monument-regular text-lg sm:text-xl text-gray-800 mb-3 sm:mb-4 tracking-wide uppercase">
                                                Admin Dashboard
                                            </h3>
                                            <p className="text-gray-600 max-w-md mx-auto text-sm sm:text-base px-4">
                                                {selectedUser
                                                    ? 'Select an action from the navigation to manage this user\'s account.'
                                                    : 'Select a user from the list to manage their account, or choose an admin task from the navigation.'
                                                }
                                            </p>
                                        </div>
                                    )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
