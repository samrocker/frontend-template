"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Plus, Search, Building2, Users, TrendingUp, Pencil, Trash2, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { API_URL } from "@/lib/env"
import { getAccessToken } from "@/lib/auth"

interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface School {
  id: string
  name: string
  address: Address
  createdAt: string
  updatedAt: string
}

interface Stats {
  total: number
  totalStudents: number
  averageStudentsPerSchool: number
}

const SchoolsPage = () => {
  const [schools, setSchools] = useState<School[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSchool, setEditingSchool] = useState<School | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  })

  // Fetch schools and stats
  const fetchData = async () => {
    try {
      const [schoolsRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/v1/public/school/search`),
        fetch(`${API_URL}/v1/admin/school/stats`, {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        }),
      ])
      const schoolsData = await schoolsRes.json()
      const statsData = await statsRes.json()
      setSchools(schoolsData.data.schools)
      setStats(statsData.data)
    } catch (error) {
      toast.error("Error fetching data")
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredSchools = schools.filter(
    (school) =>
      school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.address.city.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const resetForm = () => {
    setFormData({
      name: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
    })
    setEditingSchool(null)
  }

  const openModal = (school?: School) => {
    if (school) {
      setEditingSchool(school)
      setFormData({
        name: school.name,
        address: { ...school.address },
      })
    } else {
      resetForm()
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    resetForm()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const token = getAccessToken()

    try {
      if (!token) throw new Error("Login required.")

      if (editingSchool) {
        const res = await fetch(`${API_URL}/v1/admin/school/${editingSchool.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ address: formData.address }),
        })
        if (!res.ok) throw new Error("Failed to update school.")
        toast.success("School updated successfully!")
      } else {
        const res = await fetch(`${API_URL}/v1/admin/school`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        })
        if (!res.ok) throw new Error("Failed to create school.")
        toast.success("School created successfully!")
      }

      await fetchData()
      closeModal()
    } catch (error: any) {
      toast.error(error?.message || "Error saving school")
      console.error("Error saving school:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const deleteSchool = async (id: string) => {
    if (!confirm("Are you sure you want to delete this school?")) return
    const token = getAccessToken()

    try {
      if (!token) throw new Error("Login required.")
      const res = await fetch(`${API_URL}/v1/admin/school/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) throw new Error("Failed to delete school.")
      toast.success("School deleted successfully!")
      await fetchData()
    } catch (error: any) {
      toast.error(error?.message || "Error deleting school")
      console.error("Error deleting school:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Schools Management</h1>
          <p className="text-muted-foreground">Manage and monitor all educational institutions</p>
        </motion.div>

        {/* Stats Cards */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Card className="hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalStudents}</div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Students/School</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageStudentsPerSchool}</div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Search and Add */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search schools..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => openModal()} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add School
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>{editingSchool ? "Edit School" : "Add New School"}</DialogTitle>
                      <DialogDescription>
                        {editingSchool
                          ? "Update the school information below."
                          : "Fill in the details to create a new school."}
                      </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {!editingSchool && (
                        <div className="space-y-2">
                          <Label htmlFor="name">School Name</Label>
                          <Input
                            id="name"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="street">Street Address</Label>
                        <Input
                          id="street"
                          required
                          value={formData.address.street}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              address: { ...prev.address, street: e.target.value },
                            }))
                          }
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            required
                            value={formData.address.city}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                address: { ...prev.address, city: e.target.value },
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            required
                            value={formData.address.state}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                address: { ...prev.address, state: e.target.value },
                              }))
                            }
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="zipCode">ZIP Code</Label>
                          <Input
                            id="zipCode"
                            required
                            value={formData.address.zipCode}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                address: { ...prev.address, zipCode: e.target.value },
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            required
                            value={formData.address.country}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                address: { ...prev.address, country: e.target.value },
                              }))
                            }
                          />
                        </div>
                      </div>

                      <DialogFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={closeModal}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {isSubmitting ? "Saving..." : editingSchool ? "Update" : "Create"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Schools Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredSchools.map((school, index) => (
              <motion.div
                key={school.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group hover:shadow-md transition-all duration-200 hover:border-primary/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors duration-200">
                          {school.name}
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {new Date(school.createdAt).toLocaleDateString()}
                        </Badge>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openModal(school)}
                          className="h-8 w-8 p-0 hover:bg-primary/10"
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteSchool(school.id)}
                          className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>{school.address.street}</p>
                      <p>
                        {school.address.city}, {school.address.state}
                      </p>
                      <p>
                        {school.address.country} {school.address.zipCode}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredSchools.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No schools found</p>
            {searchTerm && <p className="text-sm text-muted-foreground mt-2">Try adjusting your search terms</p>}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default SchoolsPage
