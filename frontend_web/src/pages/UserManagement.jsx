import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserProfileHeader } from "@/components/user-profile-header"
import { AccountSettings } from "@/components/account-settings"
import { SecuritySettings } from "@/components/security-settings"
import { useAuth } from "@/contexts/authentication-context"
import MainLayout from "@/components/main-layout"
export default function ProfilePage() {
    const [user, setUser] = useState({})
    const { currentUser, updateUserProfile } = useAuth()
    useEffect(() => {
        if (currentUser) {
            setUser(currentUser)
        }
    }, [currentUser])

    const updateUser = (updatedData) => {
        updateUserProfile(updatedData)
    }

    return (
        <MainLayout>
            <div className="container mx-auto py-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>
                    <p className="text-muted-foreground">View and manage your profile information</p>
                </div>

                <div className="grid gap-6 md:grid-cols-12">
                    <div className="md:col-span-4 space-y-6">
                        <UserProfileHeader user={user} />
                    </div>

                    <div className="md:col-span-8">
                        <Tabs defaultValue="account" className="space-y-4">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="account">Account</TabsTrigger>
                                <TabsTrigger value="security">Security</TabsTrigger>
                            </TabsList>

                            <TabsContent value="account" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Account Settings</CardTitle>
                                        <CardDescription>Manage your account information</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <AccountSettings user={user} updateUser={updateUser} />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="security" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Security Settings</CardTitle>
                                        <CardDescription>Manage your password and security options</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <SecuritySettings />
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </MainLayout>
        
    )
}
