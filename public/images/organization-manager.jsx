"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Building2, Globe, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"

export function OrganizationManager() {
  const [organizations, setOrganizations] = useState([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingOrg, setEditingOrg] = useState(null)
  const [formData, setFormData] = useState({
    subdomain: "",
    db_name: "",
    name: "",
    address: "",
    contact: "",
    website: "",
    logo: null,
    admin_email: "",
    admin_password: "",
    admin_first_name: "",
    admin_last_name: "",
  })
  const [logoPreview, setLogoPreview] = useState("")
  const { toast } = useToast()

  const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token")
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      'ngrok-skip-browser-warning': 'true',
      
    }
  }

  const getAuthHeadersMultipart = () => {
    const token = localStorage.getItem("access_token")
    return {
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "true",
    }
  }

  const fetchOrganizations = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/staff/masters/organizations/`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch organizations")
      }

      const data = await response.json()
      setOrganizations(data.results || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch organizations",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const isEditing = !!editingOrg
      const url = isEditing ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/staff/masters/organizations/${editingOrg.id}/` : `${process.env.NEXT_PUBLIC_API_BASE_URL}/staff/masters/organizations/`

      let response

      if (formData.logo) {
        // Use FormData for file upload
        const formDataObj = new FormData()
        formDataObj.append("subdomain", formData.subdomain)
        formDataObj.append("db_name", formData.db_name)
        formDataObj.append("name", formData.name)
        formDataObj.append("address", formData.address)
        formDataObj.append("contact", formData.contact)
        if (formData.website) {
          formDataObj.append("website", formData.website)
        }
        formDataObj.append("logo", formData.logo)
        
        // Add admin user fields to FormData
        if (!isEditing) {
          formDataObj.append("admin_email", formData.admin_email)
          formDataObj.append("admin_password", formData.admin_password)
          formDataObj.append("admin_first_name", formData.admin_first_name)
          formDataObj.append("admin_last_name", formData.admin_last_name)
        }

        response = await fetch(url, {
          method: isEditing ? "PATCH" : "POST",
          headers: getAuthHeadersMultipart(),
          body: formDataObj,
        })
      } else {
        // Use JSON for non-file data
        const jsonData = {
          subdomain: formData.subdomain,
          db_name: formData.db_name,
          name: formData.name,
          address: formData.address,
          contact: formData.contact,
          website: formData.website || undefined,
          logo: null,
          admin_email: formData.admin_email || undefined,
          admin_password: formData.admin_password || undefined,
          admin_first_name: formData.admin_first_name || undefined,
          admin_last_name: formData.admin_last_name || undefined,
        }

        response = await fetch(url, {
          method: isEditing ? "PATCH" : "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(jsonData),
        })
      }

      if (!response.ok) {
        throw new Error(`Failed to ${isEditing ? "update" : "create"} organization`)
      }

      toast({
        title: "Success",
        description: `Organization ${isEditing ? "updated" : "created"} successfully`,
      })

      setIsDialogOpen(false)
      resetForm()
      fetchOrganizations()
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingOrg ? "update" : "create"} organization`,
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this organization?")) {
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/staff/masters/organizations/${id}/`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error("Failed to delete organization")
      }

      toast({
        title: "Success",
        description: "Organization deleted successfully",
      })

      fetchOrganizations()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete organization",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (org) => {
    setEditingOrg(org)
    setFormData({
      subdomain: org.subdomain,
      db_name: org.db_name,
      name: org.name,
      address: org.address,
      contact: org.contact,
      website: org.website || "",
      logo: null,
    })
    setLogoPreview(org.logo || "")
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingOrg(null)
    setFormData({
      subdomain: "",
      db_name: "",
      name: "",
      address: "",
      contact: "",
      website: "",
      logo: null,
    })
    setLogoPreview("")
  }

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, logo: file }))
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  useEffect(() => {
    fetchOrganizations()
  }, [])

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Organization Management</h1>
          <p className="text-muted-foreground mt-2">Manage your organizations and their settings</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Organization
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingOrg ? "Edit Organization" : "Create New Organization"}</DialogTitle>
              <DialogDescription>
                {editingOrg
                  ? "Update the organization details below."
                  : "Fill in the details to create a new organization."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Organization Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subdomain">Subdomain *</Label>
                  <Input
                    id="subdomain"
                    value={formData.subdomain}
                    onChange={(e) => handleInputChange("subdomain", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="db_name">Database Name *</Label>
                <Input
                  id="db_name"
                  value={formData.db_name}
                  onChange={(e) => handleInputChange("db_name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  required
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact *</Label>
                  <Input
                    id="contact"
                    value={formData.contact}
                    onChange={(e) => handleInputChange("contact", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Logo</Label>
                <div className="flex items-center gap-4">
                  <Input id="logo" type="file" accept="image/*" onChange={handleLogoChange} className="flex-1" />
                  {logoPreview && (
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={logoPreview || "/placeholder.svg"} alt="Logo preview" />
                      <AvatarFallback>
                        <Building2 className="w-6 h-6" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>

              {/* Admin User Section - Only show when creating new organization */}
              {!editingOrg && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Admin User Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="admin_first_name">Admin First Name *</Label>
                        <Input
                          id="admin_first_name"
                          value={formData.admin_first_name}
                          onChange={(e) => handleInputChange("admin_first_name", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="admin_last_name">Admin Last Name *</Label>
                        <Input
                          id="admin_last_name"
                          value={formData.admin_last_name}
                          onChange={(e) => handleInputChange("admin_last_name", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin_email">Admin Email *</Label>
                      <Input
                        id="admin_email"
                        type="email"
                        value={formData.admin_email}
                        onChange={(e) => handleInputChange("admin_email", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin_password">Admin Password *</Label>
                      <Input
                        id="admin_password"
                        type="password"
                        value={formData.admin_password}
                        onChange={(e) => handleInputChange("admin_password", e.target.value)}
                        required
                        minLength={8}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingOrg ? "Update" : "Create"} Organization</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizations.map((org) => (
          <Card key={org.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={org.logo || "/placeholder.svg"} alt={`${org.name} logo`} />
                    <AvatarFallback>
                      <Building2 className="w-6 h-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{org.name}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {org.subdomain}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(org)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(org.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">{org.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{org.contact}</span>
              </div>
              {org.website && (
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <a
                    href={org.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline truncate"
                  >
                    {org.website}
                  </a>
                </div>
              )}
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">
                  Database: <span className="font-mono">{org.db_name}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {organizations.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Organizations Found</h3>
          <p className="text-muted-foreground mb-4">Get started by creating your first organization.</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Organization
          </Button>
        </div>
      )}
    </div>
  )
}
