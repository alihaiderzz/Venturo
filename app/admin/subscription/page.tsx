"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Users, 
  Crown, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Mail,
  Phone,
  MapPin,
  Building,
  Star
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface Subscription {
  id: string
  user_id: string
  user_email: string
  user_name: string
  plan: 'free' | 'pro' | 'enterprise'
  status: 'active' | 'cancelled' | 'expired' | 'pending'
  created_at: string
  updated_at: string
  expires_at: string
  stripe_customer_id: string
  stripe_subscription_id: string
  user_profile?: {
    location: string
    company: string
    phone: string
    role: string
  }
}

export default function AdminSubscriptionPage() {
  return <AdminSubscriptionContent />
}

function AdminSubscriptionContent() {
  const { toast } = useToast()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterPlan, setFilterPlan] = useState<string>("all")

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const fetchSubscriptions = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/subscription')
      if (response.ok) {
        const data = await response.json()
        setSubscriptions(data.subscriptions || [])
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch subscriptions",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error)
      toast({
        title: "Error",
        description: "Failed to fetch subscriptions",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.user_email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || sub.status === filterStatus
    const matchesPlan = filterPlan === "all" || sub.plan === filterPlan
    return matchesSearch && matchesStatus && matchesPlan
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'expired': return 'bg-gray-100 text-gray-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'enterprise': return 'bg-purple-100 text-purple-800'
      case 'pro': return 'bg-blue-100 text-blue-800'
      case 'free': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const stats = {
    total: subscriptions.length,
    active: subscriptions.filter(s => s.status === 'active').length,
    pro: subscriptions.filter(s => s.plan === 'pro').length,
    enterprise: subscriptions.filter(s => s.plan === 'enterprise').length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Site
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <Crown className="h-8 w-8 text-purple-500" />
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Subscription Management
                </h1>
                <p className="text-muted-foreground text-lg">Manage user subscriptions and billing</p>
              </div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="hidden md:flex items-center gap-4">
            <div className="text-center p-3 bg-white rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Total Users</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-purple-600">{stats.pro + stats.enterprise}</div>
              <div className="text-xs text-muted-foreground">Paid Plans</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-medium text-yellow-600">Admin Zone</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" asChild>
              <Link href="/admin/events">
                <TrendingUp className="h-4 w-4 mr-2" />
                Events
              </Link>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-white/70 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="expired">Expired</option>
                  <option value="pending">Pending</option>
                </select>
                <select
                  value={filterPlan}
                  onChange={(e) => setFilterPlan(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Plans</option>
                  <option value="free">Free</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscriptions List */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse bg-white/50">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredSubscriptions.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No subscriptions found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || filterStatus !== "all" || filterPlan !== "all" 
                  ? "Try adjusting your search or filters"
                  : "No subscriptions have been created yet"
                }
              </p>
              {(searchTerm || filterStatus !== "all" || filterPlan !== "all") && (
                <Button 
                  onClick={() => {
                    setSearchTerm("")
                    setFilterStatus("all")
                    setFilterPlan("all")
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubscriptions.map((subscription) => (
              <Card key={subscription.id} className="hover:shadow-lg transition-all duration-300 bg-white/70">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{subscription.user_name}</CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getPlanColor(subscription.plan)}>
                          {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}
                        </Badge>
                        <Badge className={getStatusColor(subscription.status)}>
                          {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4 text-blue-500" />
                      <span>{subscription.user_email}</span>
                    </div>
                    {subscription.user_profile?.company && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building className="h-4 w-4 text-green-500" />
                        <span>{subscription.user_profile.company}</span>
                      </div>
                    )}
                    {subscription.user_profile?.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 text-red-500" />
                        <span>{subscription.user_profile.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 text-purple-500" />
                      <span>Joined {formatDate(subscription.created_at)}</span>
                    </div>
                    {subscription.expires_at && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4 text-orange-500" />
                        <span>Expires {formatDate(subscription.expires_at)}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
